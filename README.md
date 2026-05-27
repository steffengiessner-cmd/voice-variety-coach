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
