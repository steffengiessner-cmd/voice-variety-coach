# Voice Variety Dataset Roadmap

This plan keeps the current coach behavior intact while collecting better evidence for future calibration and model work.

## Goals

- Calibrate vocal-variety scoring against human listener judgments.
- Separate business delivery and storytelling delivery, because effective prosody differs by context.
- Treat emotion labels as intended tone and listener-perceived tone, not as ground truth about a speaker's inner state.
- Keep models interpretable unless a larger validated dataset justifies a more complex classifier.

## Public Emotion Datasets

Use RAVDESS and TESS for feature validation and experiments, not as the main scoring authority.

RAVDESS is useful for checking whether acoustic features behave plausibly across acted emotional speech. It has balanced actor coverage, acted emotional intensity, and validated labels. It is still acted speech with two fixed statements, so it does not directly represent business or story performance.

TESS is useful for controlled emotion-feature checks across many words. It has only two speakers, both actresses, so it is too narrow for training a general user-facing model.

Recommended use:

- Extract the same features used by this app from RAVDESS and TESS.
- Confirm expected feature directions, such as higher pitch range and intensity variation for higher-arousal tones.
- Train small experimental classifiers only with speaker-held-out validation.
- Require cross-dataset testing before shipping any emotion model.
- Prefer using these datasets to validate feature extraction and scoring assumptions.

## Custom Dataset

Create recordings that match this app's target use cases: business texts and stories with high/low vocal variety and intended tones.

Suggested pilot:

- 10 speakers.
- 12 business passages and 12 story passages.
- Each speaker records 4 business and 4 story passages.
- Each passage is recorded in low-variety and high-variety versions.
- Use 3 intended tones per speaker session.
- Record 2 repetitions per condition.
- Target: about 960 clips.

Suggested v1 calibration set:

- 30 speakers.
- Target: about 2,500 to 3,000 clips.
- Keep a held-out speaker test set.

Suggested model set:

- 60 or more speakers.
- Target: 5,000 to 8,000 or more clips.
- Balance speakers, text type, intended tone, and variety level.

## Recording Protocol

- Record WAV when possible, mono, 44.1 kHz or 48 kHz.
- Use a quiet room and stable microphone position.
- Keep microphone distance consistent within a session.
- Record 20 to 45 seconds per clip.
- Capture speaker ID, text ID, intended tone, intended variety level, repetition, microphone, and room notes.
- Do not coach the speaker during a take. Give instructions before recording.
- Mark unusable takes rather than deleting them immediately.

## Annotation

Use at least 3 independent listener ratings per clip.

Listener fields:

- Vocal variety: 1 to 5.
- Expressiveness: 1 to 5.
- Naturalness: 1 to 5.
- Clarity: 1 to 5.
- Engagement: 1 to 5.
- Perceived tone: neutral, enthusiastic, determined, compassionate, concerned, playful, other, unclear.
- Tone match: 1 to 5.

Quality-control fields:

- Background noise.
- Clipping or distortion.
- Reading error.
- Rater confidence.

## Feature Set

Keep browser features for compatibility:

- Pitch semitone range, pitch semitone SD, pitch movement count, pitch tracking ratio.
- Volume SD and P05-P95 range.
- Speech ratio.
- Average speech-run length.
- Strategic pause count, pause rate, pause duration distribution.
- Emphasis peak count and peak rate.

Prefer Praat-backed features for calibration:

- Median F0, mean F0, F0 SD, F0 P10-P90 range.
- F0 range in semitones relative to speaker median.
- Intensity mean, SD, and P05-P95 range.
- Pause count, pause duration, speech ratio.
- Optional: HNR, jitter, shimmer, spectral tilt if stable enough.

## Validation Strategy

- Split by speaker, not by clip.
- Report correlations between app features and human ratings.
- Report inter-rater reliability before training models.
- Validate business and story tasks separately.
- Test whether score thresholds work similarly across speaker groups.
- Compare browser features with Praat features to understand frontend/backend drift.
- Ship recalibrated heuristic thresholds before shipping an emotion classifier.

## Concrete App Path

1. Export feature JSON after recordings.
2. Collect pilot recordings with metadata.
3. Add listener ratings using the annotation schema.
4. Analyze feature/rating relationships offline.
5. Recalibrate score bands.
6. Add separate business and story scoring profiles.
7. Only then consider a trained tone classifier.
