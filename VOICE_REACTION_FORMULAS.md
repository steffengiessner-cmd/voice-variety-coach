# Voice Variety Coach: Voice Reaction Formulas

This document explains how the app currently reacts to a speaker's voice. It describes the browser-based scoring system, the audience reaction model, the responsiveness slider, and the optional Praat/Parselmouth backend.

The app is a heuristic prototype. It does not use a trained model of human perception. Scores are useful for practice feedback, but they should not be treated as clinical, diagnostic, or fully calibrated acoustic measurements.

## 1. What The Browser Measures

During recording, the browser samples the microphone signal through Web Audio.

For each audio frame the app stores:

- **RMS loudness**: a frame-level estimate of signal strength.
- **Pitch estimate**: a rough fundamental frequency estimate in Hz, when the frame has enough signal.
- **Time progression**: the app keeps the recording duration and uses frame counts to estimate seconds.

The waveform data is converted from byte values to a normalized signal:

```text
normalized_sample = (byte_value - 128) / 128
rms = sqrt(mean(normalized_sample^2))
```

Pitch is estimated with autocorrelation:

```text
if rms < 0.018:
  pitch = null

candidate_offsets = sampleRate / 450 Hz ... sampleRate / 70 Hz
correlation(offset) =
  sum((x[i] - mean(x)) * (x[i + offset] - mean(x)))
  / sqrt(sum((x[i] - mean(x))^2) * sum((x[i + offset] - mean(x))^2))

best_offset = offset with highest correlation
pitch = sampleRate / best_offset, only if best_correlation > 0.62
```

So the browser pitch range is limited to roughly **70-450 Hz**.

## 2. General Helper Formulas

Most scores use two helper functions.

```text
clamp(value, min, max) = max(min, min(value, max))
```

```text
linearScore(value, low, high) =
  clamp(((value - low) / (high - low)) * 100, 0, 100)
```

This maps a value to a 0-100 score. Values at `low` score 0. Values at `high` score 100.

```text
bandScore(value, idealLow, idealHigh, hardLow, hardHigh):
  if idealLow <= value <= idealHigh:
    return 100
  if value < idealLow:
    return linearScore(value, hardLow, idealLow)
  if value > idealHigh:
    return 100 - linearScore(value, idealHigh, hardHigh)
```

This rewards a middle range and penalizes values that are too low or too high.

## 3. Speech Detection

The app separates likely speech from silence/noise using the RMS signal.

```text
quiet = percentile(rmsValues, 0.10)
loud = percentile(rmsValues, 0.95)
speechThreshold = clamp(quiet + (loud - quiet) * 0.22, 0.014, 0.09)

speechFrame = rms > speechThreshold
speechRatio = number_of_speech_frames / number_of_all_frames
```

The app requires enough speech before scoring:

```text
enoughSpeech =
  speechRatio >= 0.12
  and (pitchSamples >= 6 or energyRange >= 3)
```

## 4. Volume / Energy Variety

For each speech frame:

```text
dB = 20 * log10(max(rms, 0.00001))
```

The browser calculates:

```text
energySd = standardDeviation(speechDb)
energyRange = percentile(speechDb, 0.95) - percentile(speechDb, 0.05)
```

Then:

```text
energyScore =
  clamp(
    linearScore(energySd, 1.4, 5.2) * 0.65
    + linearScore(energyRange, 4.5, 15) * 0.35,
    0,
    100
  )
```

Meaning:

- More variation in loudness raises the score.
- A wider quiet-to-loud spread raises the score.
- The score rewards contrast, not raw loudness.

## 5. Pitch Variety

The app first removes pitch readings outside the human working range:

```text
validPitchHz = pitch values from 70 to 450 Hz
basePitch = median(validPitchHz)
semitoneValue = 12 * log2(pitchHz / basePitch)
```

It then removes extreme outliers by keeping semitone values between the 5th and 95th percentile.

Pitch metrics:

```text
pitchSd = standardDeviation(cleanSemitoneValues)
pitchRange = percentile(cleanSemitoneValues, 0.90) - percentile(cleanSemitoneValues, 0.10)
pitchMoves = count of adjacent semitone changes >= 1.4
```

Pitch score:

```text
pitchScore =
  clamp(
    linearScore(pitchSd, 0.65, 3.1) * 0.56
    + linearScore(pitchRange, 3.2, 9.5) * 0.34
    + linearScore(pitchMoves / max(1, duration / 20), 1, 8) * 0.10,
    0,
    100
  )
```

Penalties:

```text
if pitchRange < 3.2:
  pitchScore = min(pitchScore, 36)

if clean pitch sample count < 8:
  pitchScore = min(pitchScore, 42)
```

Meaning:

- A voice with more melodic movement scores higher.
- Very narrow pitch range is capped.
- Too few stable pitch samples makes pitch feedback uncertain.

## 6. Tempo And Pause Shape

The app creates runs of speech and silence from the speech-frame sequence.

```text
speechDurations = durations of consecutive speech frames
pauseDurations = durations of consecutive non-speech frames
strategicPauses = pauses from 0.35 to 2.4 seconds
longPauses = pauses longer than 2.4 seconds
pausesPerMinute = count(strategicPauses) / max(0.1, duration / 60)
averageSpeechRun = mean(speechDurations)
```

Tempo score:

```text
speechRatioScore = bandScore(speechRatio, 0.62, 0.88, 0.35, 0.98)
speechRunScore = bandScore(averageSpeechRun, 1.4, 4.8, 0.4, 9)

tempoScore =
  clamp(
    speechRatioScore * 0.62
    + speechRunScore * 0.38,
    0,
    100
  )
```

Pause score:

```text
pauseFrequencyScore = bandScore(pausesPerMinute, 3, 9, 0, 16)
pauseVariationScore =
  if count(strategicPauses) >= 2:
    linearScore(standardDeviation(strategicPauses), 0.12, 0.75)
  else:
    28

longPausePenalty = min(30, count(longPauses) * 10)

pauseScore =
  clamp(
    pauseFrequencyScore * 0.68
    + pauseVariationScore * 0.32
    - longPausePenalty,
    0,
    100
  )

if no strategic pauses:
  pauseScore = min(pauseScore, 42)
```

Meaning:

- The app rewards enough speech flow, but not constant nonstop talking.
- It rewards short intentional pauses.
- It penalizes long silences.

## 7. Emphasis

The app detects peaks in the speech loudness signal.

```text
emphasisThreshold = mean(speechDb) + standardDeviation(speechDb) * 0.85
```

A frame is counted as an emphasis peak if:

```text
currentDb > emphasisThreshold
currentDb >= previousDb
currentDb >= nextDb
time since last peak >= 0.35 seconds
```

Then:

```text
emphasisPeaksPerMinute = emphasisPeaks / max(0.1, duration / 60)

emphasisScore =
  clamp(
    bandScore(emphasisPeaksPerMinute, 5, 14, 0, 24) * 0.58
    + linearScore(energyRange, 4.5, 15) * 0.27
    + linearScore(pitchMoves / max(1, duration / 20), 1, 8) * 0.15,
    0,
    100
  )
```

Meaning:

- Emphasis is inferred from loudness peaks, supported by volume range and pitch movement.
- Too few peaks feels flat.
- Too many peaks can feel over-emphasized.

## 8. Clarity / Signal Quality

This is not true pronunciation scoring. It is a signal-quality proxy.

```text
pitchTrackingRatio = pitchReadings / speechFrames
clippingRatio = count(rmsValues > 0.92) / totalFrames

clarityScore =
  clamp(
    linearScore(pitchTrackingRatio, 0.12, 0.58) * 0.55
    + speechRatioScore * 0.30
    + (100 - linearScore(clippingRatio, 0.01, 0.08)) * 0.15,
    0,
    100
  )
```

Meaning:

- A stable pitch trace helps.
- A usable amount of speech helps.
- Clipping hurts.

## 9. Overall Voice Variety Score

The pacing score combines tempo and pause shape:

```text
pacingScore = tempoScore * 0.58 + pauseScore * 0.42
```

The overall browser score:

```text
score =
  pitchScore * 0.36
  + energyScore * 0.24
  + pacingScore * 0.22
  + emphasisScore * 0.12
  + clarityScore * 0.06
```

Caps:

```text
if pitchScore < 45 and energyScore < 45:
  score = min(score, 48)

if pitchRange < 3.2 and energySd < 2.2:
  score = min(score, 42)

if clean pitch sample count < 8:
  score = min(score, 58)
```

Final score:

```text
score = round(clamp(score, 0, 100))
```

## 10. Live Audience Reaction

After the first 5 seconds, the app evaluates a recent speech window once per second.

```text
recentWindow = up to last 8 seconds
momentScore = analyzeProsody(recentWindow).score
```

The audience does not jump directly to the latest score. It uses memory/smoothing:

```text
audienceAttention =
  audienceAttention * memoryWeight
  + momentScore * (1 - memoryWeight)
```

Then:

```text
audienceAttention = clamp(audienceAttention, 0, 100)
```

The starting value is:

```text
AUDIENCE_START_ATTENTION = 52
```

## 11. Audience Responsiveness Slider

The slider changes `memoryWeight`.

Labels:

```text
0-34   = Calm
35-65  = Default
66-100 = Reactive
```

Default behavior:

```text
ordinary audiences: memoryWeight = 0.75
superhero audience: memoryWeight = 0.38
```

Slider formula:

```text
calmWeight = 0.90
reactiveWeight =
  if superhero audience: 0.22
  else: 0.50

if slider <= 50:
  amount = slider / 50
  memoryWeight = calmWeight + (defaultWeight - calmWeight) * amount

if slider > 50:
  amount = (slider - 50) / 50
  memoryWeight = defaultWeight + (reactiveWeight - defaultWeight) * amount
```

Interpretation:

- **Calm** means the audience reacts more slowly.
- **Default** means the original app behavior.
- **Reactive** means the audience follows the latest vocal variety more quickly.

## 12. Audience Visual States

The current audience attention value controls the label and faces.

```text
attention < 28:
  label = "Attention slipping"

28 <= attention < 52:
  label = "Trying to follow"

52 <= attention < 76:
  label = "Listening"

attention >= 76:
  label = "Fully engaged"
```

Different audience types use different visual states, but the thresholds are the same.

## 13. Final Audience Score

For normal takes, the app keeps a history of live audience attention values during the recording.

At the end:

```text
finalScore = round(mean(audienceAttentionHistory))
```

If there are usable live moments, the final result uses:

- mean pitch score across usable moments
- mean energy score across usable moments
- mean pacing score across usable moments
- mean tempo, pause, emphasis, and clarity scores
- summed counts for peaks and pauses
- average audience attention as the final score

If there is not enough live history, it falls back to the full-recording analysis.

## 14. Optional Praat/Parselmouth Backend

When the local backend is running, the app can send a WAV file to Praat/Parselmouth.

Praat extracts:

- pitch mean, pitch standard deviation, and pitch P10-P90 range
- intensity mean, intensity standard deviation, and intensity P05-P95 range
- speech ratio
- pause count and pauses per minute
- emphasis peaks per minute
- pitch tracking ratio

Praat speech detection:

```text
db_floor = percentile(intensityDb, 0.12)
db_top = percentile(intensityDb, 0.95)
speechThreshold = db_floor + (db_top - db_floor) * 0.25
speechFrame = intensityDb > speechThreshold
```

Volume statistics use only detected speech frames:

```text
speechDbValues = intensity values where speechFrame is true
meanDb = mean(speechDbValues)
sdDb = standardDeviation(speechDbValues)
rangeDbP05P95 = percentile(speechDbValues, 0.95) - percentile(speechDbValues, 0.05)
```

Praat pitch range in semitones:

```text
low = meanHz - rangeHzP10P90 / 2
high = meanHz + rangeHzP10P90 / 2
pitchRangeSt = 12 * log2(high / low)
```

Praat coach scoring:

```text
pitch:
  unclear if pitchRangeSt missing or trackedFrames < 8 -> 38
  if pitchRangeSt < 3.5 -> 32
  if pitchRangeSt < 7 -> 64
  if pitchRangeSt < 13 -> 88
  else -> 74

volume:
  unclear if sdDb or rangeDb missing -> 38
  if sdDb < 2 or rangeDb < 5 -> 34
  if sdDb < 4.5 or rangeDb < 10 -> 66
  if rangeDb < 18 -> 86
  else -> 76

tempo:
  unclear if speechRatio missing -> 38
  if speechRatio < 0.45 -> 46
  if speechRatio > 0.93 -> 42
  if speechRatio > 0.88 -> 62
  else -> 82

pauses:
  default -> 34
  if any long pause -> 48
  if pauseCount > 0 and pausesPerMinute <= 12 -> 84
  if pauseCount > 0 and pausesPerMinute <= 18 -> 64
  if pauseCount > 0 -> 46

emphasis:
  if peaksPerMinute < 4 -> 34
  if peaksPerMinute < 18 -> 84
  else -> 68

clarity:
  unclear if pitchTrackingRatio missing -> 38
  if pitchTrackingRatio < 0.2 -> 36
  if pitchTrackingRatio < 0.55 -> 64
  else -> 86
```

Praat overall score:

```text
overall =
  pitch * 0.30
  + volume * 0.22
  + tempo * 0.18
  + pauses * 0.14
  + emphasis * 0.12
  + clarity * 0.04
```

## 15. Practice Mode Formulas

Practice mode has separate focused exercises.

### Pitch Glide

The pitch glide exercise expects one continuous high-to-low "ah".

```text
valid points = pitch timeline points from 70 to 450 Hz
low = percentile(hz, 0.08)
high = percentile(hz, 0.92)
rangeSemitones = 12 * log2(high / low)
normalizedPitch = clamp((hz - low) / (high - low), 0, 1)
```

Shape:

```text
startLevel = mean(first 18% of normalizedPitch)
endLevel = mean(last 18% of normalizedPitch)
downwardConsistency =
  count of adjacent frames where current <= previous + 0.06
  / number of adjacent frame pairs

shapeScore =
  clamp(
    startLevel * 35
    + (1 - endLevel) * 35
    + downwardConsistency * 30,
    0,
    100
  )

rangeScore = linearScore(rangeSemitones, 5, 18)

pitchGlideScore =
  clamp(rangeScore * 0.62 + shapeScore * 0.38, 0, 100)
```

### Volume Practice

The volume practice does not show a numeric score. It gives descriptive feedback from browser signal level and optional Praat acoustic detail.

Browser thresholds:

```text
medianDb = percentile(speechDb, 0.50)
peakDb = percentile(speechDb, 0.95)
clippingRatio = count(rms > 0.88) / totalFrames
```

Labels:

```text
medianDb < -40:
  "very soft"

-40 <= medianDb < -32:
  "quiet one-to-one"

-32 <= medianDb < -17:
  "conversation or small team"

-17 <= medianDb < -10 or clippingRatio <= 0.01:
  "strong conversational level"

otherwise:
  "too close or too strong"
```

Important limitation: neither browser analysis nor Praat can know true room loudness without a calibrated microphone.

### Tempo Practice

Tempo practice asks for a fast familiar first part and a slower important second part.

The app looks for a pause near the expected divider:

```text
expectedSplit = activeFrameCount * 0.38
searchWindow = 24% to 58% of active frames
bestSplit = silence run with strongest combination of length and closeness to expectedSplit
```

Then it estimates rhythm peaks in each section:

```text
smoothedRms = moving average over nearby frames
threshold = percentile(smoothedRms, 0.35)
            + (percentile(smoothedRms, 0.90) - percentile(smoothedRms, 0.35)) * 0.34

rhythmPeak = local peak above threshold, at least 0.16 sec after previous peak
rhythmRate = rhythmPeaks / sectionDuration
```

Tempo contrast:

```text
wordPaceContrast =
  (knownWords / firstDuration)
  / max(0.1, newWords / secondDuration)

rhythmContrast =
  firstRhythmRate / max(0.1, secondRhythmRate)

contrast =
  wordPaceContrast * 0.35
  + rhythmContrast * 0.65
```

Practice tempo score:

```text
if contrast >= 1.22 -> 94
if contrast >= 1.08 -> 84
if contrast >= 0.96 -> 68
if contrast >= 0.84 -> 52
else -> 38
```

The second part should be slower and more deliberate, but not word-by-word.

## 16. Current Limitations

- Browser microphone level depends on microphone gain and distance.
- Pitch tracking is approximate and can fail for noisy, breathy, or very quiet voices.
- Volume is relative to the recording signal, not actual room loudness.
- Speech recognition is only used for text following, not for scoring content accuracy.
- Praat improves acoustic measurement stability, but without calibration it still cannot infer true audience audibility.
- Audience reactions are simulated from the score; no real listener data is used.

