import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildVisemeTimeline,
  visemeStepMs,
  wordAt,
  wordToVisemes,
  type Viseme,
} from "@/lib/visemes";

/**
 * Drives a viseme (mouth shape) stream from a SpeechSynthesisUtterance.
 *
 * Primary path: `onboundary` word events → step through that word's visemes.
 * Fallback path: browsers without boundary events (some mobile Safari builds)
 * get a pre-computed timeline based on estimated speech duration.
 */
export function useVisemeSync() {
  const [viseme, setViseme] = useState<Viseme>("rest");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setViseme("rest");
  }, [clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  /** Attach viseme tracking to an utterance without clobbering its handlers. */
  const attach = useCallback(
    (utterance: SpeechSynthesisUtterance, isCurrent: () => boolean) => {
      const text = utterance.text ?? "";
      const rate = utterance.rate || 1;
      const step = visemeStepMs(rate);
      let sawBoundary = false;

      const schedule = (frames: { viseme: Viseme; at: number }[]) => {
        frames.forEach(({ viseme: v, at }) => {
          const timer = setTimeout(() => {
            if (isCurrent()) setViseme(v);
          }, at);
          timersRef.current.push(timer);
        });
      };

      const prevStart = utterance.onstart;
      const prevEnd = utterance.onend;
      const prevError = utterance.onerror;

      utterance.onstart = (e) => {
        prevStart?.call(utterance, e);
        clearTimers();
        setViseme("rest");
        // If no boundary event arrives shortly, drive the whole text on a timer.
        const probe = setTimeout(() => {
          if (!sawBoundary && isCurrent()) {
            schedule(buildVisemeTimeline(text, rate));
          }
        }, 400);
        timersRef.current.push(probe);
      };

      utterance.onboundary = (e) => {
        if (e.name && e.name !== "word") return;
        sawBoundary = true;
        clearTimers();
        const word = wordAt(text, e.charIndex, (e as SpeechSynthesisEvent).charLength);
        const visemes = wordToVisemes(word);
        schedule(visemes.map((v, i) => ({ viseme: v, at: i * step })));
        const closer = setTimeout(() => {
          if (isCurrent()) setViseme("rest");
        }, visemes.length * step);
        timersRef.current.push(closer);
      };

      utterance.onend = (e) => {
        prevEnd?.call(utterance, e);
        reset();
      };

      utterance.onerror = (e) => {
        prevError?.call(utterance, e);
        reset();
      };
    },
    [clearTimers, reset]
  );

  return { viseme, attach, reset };
}
