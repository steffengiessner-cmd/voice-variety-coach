# Voice Variety Coach

A small browser app for practicing vocal variety. It gives you a speaking prompt, records a short take, plays it back, and estimates variety in energy, pitch movement, and pacing.

The shared GitHub Pages version runs fully in the browser. The local Mac version can also use the optional Praat/Parselmouth helper for stronger acoustic statistics.

## Run It Locally

Because microphone access works best on `localhost`, start a small local server from this folder:

```bash
cd ~/Documents/GitHub/voice-variety-coach
python3 -m http.server 5173
```

Then open:

```text
http://localhost:5173
```

Safari will not record reliably if you open `index.html` directly as a file. Use the `localhost` link above instead.

## Use It

1. Click **Start Recording**.
2. Allow microphone access when the browser asks.
3. If you use an external microphone, choose it from **Microphone input**. Device names may appear after permission is granted.
4. Read the prompt aloud for 30-60 seconds.
5. Click **Stop Recording**.
6. Review the score and play back your recording.

## Publish With GitHub Pages

This app is plain HTML, CSS, and JavaScript, so it can be published directly with GitHub Pages.

In GitHub:

1. Open the repository settings.
2. Go to **Pages**.
3. Choose **Deploy from a branch**.
4. Select the `main` branch and root folder.
5. Save.

The online version will use browser-based feedback. To use the local Praat analysis, run the backend helper on your Mac and open the app through `localhost`.

## Dataset Capture

The recording panel includes optional labels for building a calibration dataset: speaker ID, intended variety level, intended tone, and take number. After a recording, click **Export Features** to download a local JSON file with the labels, prompt metadata, browser features, current scores, and optional Praat technical results. The export does not include raw audio.

Starter materials live in:

- `docs/dataset-roadmap.md`
- `data/starter_corpus.csv`
- `data/annotation_schema.csv`

## Leading with Presence companion

Story, Business, and Own text start with a live colour box: red for low vocal variety, amber for moderate variety, and green for high variety. The Live feedback display selector switches to the existing animated audience. Just audience starts with the audience and also offers the colour box. Each mode remembers its display choice until the page reloads. Practice hides both displays. Optional Explore mode pauses live feedback; the colour box stays neutral. Choose an intention and practise one skill. The optional “Add Toolbox preparation” button reveals four plain-language body-and-breath steps; it starts off and requires no prior book or training experience. The Practice tab includes emphasis (Exercise 5.8.1) and vocal colour (Exercise 5.10.3), with book references and reflection prompts.

The two latest recordings can be played side by side in the reflection panel. They and the written reflections are kept only for the current page session, not saved across reloads. Clear recordings removes the retained takes. Use the transfer prompt to plan one real conversation, and ask a buddy what message they received.

Acoustic feedback remains available as an option. Audience reactions are explicitly a simulation, and vocal-colour percentages are no longer displayed. Deliberate-pause practice is enabled by default: the browser excludes the pause score from its pacing blend and hides the pause metric. Pause duration alone no longer triggers the former long-pause deduction. Other acoustic heuristics and the optional local Praat helper remain experimental; they do not measure communicative success or real listener engagement.

### Average vocal variety

The colour box and overall score share the same browser vocal-variety calculation. Each valid live reading is smoothed with a fixed 65% previous / 35% new weighting; the first reading starts at its measured value. The displayed average is the arithmetic mean of those smoothed readings (one per live update), rounded to 0–100. Audience type and responsiveness affect only the animated audience. Praat technical checks do not replace this score. Silence without a usable reading is not added as zero; a whole-recording estimate is the fallback if there are no usable live readings. This is practice feedback about vocal variation, not a measure of communication effectiveness.

In Story, Business, and Own text, live colour appears as a light tint behind the reading text instead of a separate box. The phone reading area remains enlarged during recording. Just audience retains the standalone box. Switching to Animated audience removes the reading tint.

### Fullscreen recording reader

Recording in Story, Business, or Own text opens a reading-only view with a Stop recording button at the top. The existing reading element retains text size, scrolling, word tracking, and live background colour when colour feedback is selected. Phones and desktop browsers use native fullscreen when permitted, otherwise a viewport-filling modal. Stopping returns the text to the main app for playback and feedback; microphone failures also restore the app. Practice and Just audience keep their existing recording layouts. Own text requires a reading passage before recording.

When Animated audience is selected for Story, Business, or Own text, the fullscreen reader includes the live audience below the text. Only the text, audience, and top Stop recording button are shown. The audience scales to fit portrait and landscape screens, and returns to its original position after recording.
