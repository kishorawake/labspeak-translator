# Custom Photo Avatar with Phoneme Lip-Sync

Replace the cartoon AI doctor image in the AI assistant card with your own uploaded photo, enlarge the avatar, and drive a real phoneme-based (viseme) mouth animation from the spoken text.

## What you'll see

- A larger avatar stage at the top of the AI assistant card (roughly a 160px portrait instead of the current 64px circle), keeping the holographic rings, scanlines, glow and particles.
- Your photo as the face, tinted to match the hologram look.
- While the assistant speaks, an animated mouth overlay sits on the photo's mouth and changes shape per sound group (A, E, I, O, U, M/B/P closed, F/V, L, W/Q, rest) instead of just opening and closing.
- Subtle head bob and eye-blink so the still photo feels alive.
- Works in every selected language (English, Hindi, Telugu, Tamil, Marathi) since visemes come from the text being spoken.

## What I need from you

Attach the portrait photo you want to use (front-facing, mouth closed, neutral expression works best). Until you send it, I'll wire everything up against the existing image so nothing breaks, then swap in your photo the moment it arrives.

## How the lip-sync works

1. The text queued for speech is split into words, then each word into sound groups mapped to one of 10 visemes.
2. `speechSynthesis` `onboundary` events report which word is being spoken; between boundaries the visemes of that word are stepped through on a timer scaled to the word's length and the current speech rate.
3. On browsers with no `onboundary` support (some mobile Safari builds), the whole utterance is timed by estimated duration so the mouth still tracks the sentence.
4. On `onend`/`oncancel`, the mouth resets to the closed/rest viseme.

## Technical notes

- New `src/lib/visemes.ts`: text → viseme timeline (pure, unit-testable), plus the language-agnostic grapheme-to-viseme table.
- New `src/components/AvatarFace.tsx`: renders the photo plus an absolutely positioned SVG mouth whose path morphs between viseme shapes with Motion, driven by a `viseme` prop. Mouth position/scale exposed as calibration constants so it can be nudged to fit your photo.
- New `src/hooks/useVisemeSync.ts`: subscribes to the current utterance and exposes the active viseme; wraps the boundary/timer fallback logic.
- `src/components/HolographicAvatar.tsx`: swap the 64px `<img>` block for `<AvatarFace>` at the larger size, pass the viseme from the hook, remove the old `holo-lip-overlay` div, and keep the existing speak/mute/language logic untouched.
- Your photo is added under `src/assets/` and imported directly; the old cartoon asset stays in the repo unless you want it deleted.
- No backend, API keys, or extra services — everything stays client-side.
