/**
 * Text → viseme timeline.
 *
 * A "viseme" is the visual shape a mouth makes for a group of sounds.
 * We use 10 shapes that cover the useful visual range and are language
 * agnostic enough to work for Latin and Indic scripts.
 */

export type Viseme =
  | "rest" // closed / neutral
  | "MBP" // m, b, p — lips pressed shut
  | "AA" // open "ah"
  | "EE" // wide "ee"
  | "IH" // small "i"
  | "OH" // rounded "o"
  | "UU" // tight rounded "oo"
  | "FV" // f, v — lower lip to teeth
  | "L" // l, n, d, t — tongue up, slight open
  | "WQ"; // w, q, r — puckered

/** Geometry for each viseme. rx/ry are the mouth opening radii in SVG units. */
export const VISEME_SHAPES: Record<
  Viseme,
  { rx: number; ry: number; lipRy: number; corner: number }
> = {
  rest: { rx: 15, ry: 1.2, lipRy: 3.5, corner: 0 },
  MBP: { rx: 14, ry: 0.8, lipRy: 3.2, corner: 0 },
  AA: { rx: 15, ry: 12, lipRy: 15, corner: 0.2 },
  EE: { rx: 19, ry: 5, lipRy: 8, corner: 0.6 },
  IH: { rx: 16, ry: 3.5, lipRy: 6, corner: 0.35 },
  OH: { rx: 11, ry: 10.5, lipRy: 13, corner: 0.9 },
  UU: { rx: 7.5, ry: 7.5, lipRy: 10, corner: 1 },
  FV: { rx: 14, ry: 2.4, lipRy: 5, corner: 0.1 },
  L: { rx: 13, ry: 6, lipRy: 9, corner: 0.25 },
  WQ: { rx: 9, ry: 6.5, lipRy: 9.5, corner: 0.95 },
};

/** Latin letters → viseme. */
const LATIN: Record<string, Viseme> = {
  a: "AA",
  e: "EE",
  i: "IH",
  o: "OH",
  u: "UU",
  y: "IH",
  m: "MBP",
  b: "MBP",
  p: "MBP",
  f: "FV",
  v: "FV",
  w: "WQ",
  q: "WQ",
  r: "WQ",
  l: "L",
  n: "L",
  d: "L",
  t: "L",
  s: "EE",
  z: "EE",
  c: "EE",
  j: "EE",
  g: "L",
  k: "L",
  h: "AA",
  x: "EE",
};

/**
 * Indic vowel signs / independent vowels (Devanagari, Telugu, Tamil ranges share
 * offsets within their blocks, so we normalise by codepoint offset).
 */
function indicViseme(ch: string): Viseme | null {
  const code = ch.codePointAt(0) ?? 0;
  // Devanagari 0900, Telugu 0C00, Tamil 0B80, Marathi uses Devanagari.
  const blocks = [0x0900, 0x0c00, 0x0b80, 0x0980, 0x0a00, 0x0a80, 0x0b00, 0x0c80, 0x0d00];
  const block = blocks.find((b) => code >= b && code <= b + 0x7f);
  if (block === undefined) return null;
  const off = code - block;

  // Independent vowels 0x05..0x14, vowel signs 0x3E..0x4C
  const vowelOffsets: Record<number, Viseme> = {
    0x05: "AA",
    0x06: "AA",
    0x07: "IH",
    0x08: "EE",
    0x09: "UU",
    0x0a: "UU",
    0x0f: "EE",
    0x10: "EE",
    0x13: "OH",
    0x14: "OH",
    0x3e: "AA",
    0x3f: "IH",
    0x40: "EE",
    0x41: "UU",
    0x42: "UU",
    0x47: "EE",
    0x48: "EE",
    0x4b: "OH",
    0x4c: "OH",
  };
  if (vowelOffsets[off]) return vowelOffsets[off];

  // Consonants: labials (pa/pha/ba/bha/ma) sit at 0x2A..0x2E in Devanagari-like blocks.
  if (off >= 0x2a && off <= 0x2e) return "MBP";
  if (off === 0x35) return "FV"; // va
  if (off === 0x30 || off === 0x32) return "L"; // ra / la
  if (off >= 0x15 && off <= 0x39) return "AA"; // other consonants default open
  return null;
}

/** Viseme for a single character, or null when it contributes no shape. */
export function charToViseme(ch: string): Viseme | null {
  const lower = ch.toLowerCase();
  if (LATIN[lower]) return LATIN[lower];
  return indicViseme(ch);
}

/** Visemes for one word, always at least one entry, with rests between repeats. */
export function wordToVisemes(word: string): Viseme[] {
  const out: Viseme[] = [];
  for (const ch of word) {
    const v = charToViseme(ch);
    if (!v) continue;
    if (out[out.length - 1] === v) {
      // Avoid a frozen mouth on doubled letters.
      out.push(v === "rest" ? "AA" : "rest");
      continue;
    }
    out.push(v);
  }
  if (out.length === 0) out.push("AA");
  return out;
}

export interface VisemeFrame {
  viseme: Viseme;
  /** Milliseconds from the start of the timeline. */
  at: number;
}

/** Average speaking speed used for fallback timing. */
const MS_PER_VISEME = 85;

/**
 * Build a full timeline for a text, used when the browser gives no
 * `onboundary` events.
 */
export function buildVisemeTimeline(text: string, rate = 1): VisemeFrame[] {
  const words = text.split(/\s+/).filter(Boolean);
  const step = MS_PER_VISEME / Math.max(0.5, rate);
  const frames: VisemeFrame[] = [];
  let t = 0;
  for (const word of words) {
    for (const viseme of wordToVisemes(word)) {
      frames.push({ viseme, at: t });
      t += step;
    }
    frames.push({ viseme: "rest", at: t });
    t += step * 0.6; // inter-word gap
  }
  frames.push({ viseme: "rest", at: t });
  return frames;
}

/** Per-viseme duration for a single word spoken at `rate`. */
export function visemeStepMs(rate = 1): number {
  return MS_PER_VISEME / Math.max(0.5, rate);
}

/** Extract the word starting at `charIndex` from `text`. */
export function wordAt(text: string, charIndex: number, charLength?: number): string {
  if (charLength && charLength > 0) return text.slice(charIndex, charIndex + charLength);
  const rest = text.slice(charIndex);
  const match = rest.match(/^\S+/);
  return match ? match[0] : "";
}
