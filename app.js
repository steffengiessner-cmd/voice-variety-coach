const passageGroups = {
  story: [
    {
      title: "The Dragon, the Mouse, and the Moon",
      text: `The dragon spoke in a voice as deep as thunder. Who has taken the silver moon bell from my tower? he roared, and the windows of the village rattled.

From behind a pumpkin cart, a tiny mouse lifted one paw. I borrowed it, she squeaked, because the river was lonely and needed music. The dragon blinked. The mayor gasped. The baker dropped an entire tray of buns.

Then the river began to sing. Its voice was soft at first, then bright, then wild with joy. The dragon lowered his head and whispered, perhaps the bell belongs to everyone tonight.

So the mouse rang the bell once more. The dragon hummed along, the mayor clapped in rhythm, and even the baker laughed so loudly that the buns shook sugar into the street.`
    }
  ],
  business: [
    {
      title: "Quarterly Planning Brief",
      text: `Good morning, everyone. Today I want to focus on three decisions: where we are growing, where we are losing momentum, and what we will change before the next quarter begins.

First, the good news. Customer retention improved by eight percent, and the education segment is becoming our strongest source of repeat revenue. That tells us the product is solving a real problem.

Now the challenge. Our onboarding process is still too slow. If a new customer does not see value in the first week, the risk of churn doubles. We need a simpler path from sign-up to first success.

My proposal is direct. We reduce the onboarding steps, assign one owner to the first-week experience, and review the numbers every Friday. If we move quickly, this quarter can become a turning point rather than a warning sign.`
    }
  ]
};

const passageTitle = document.querySelector("#passageTitle");
const readingText = document.querySelector("#readingText");
const readingStatus = document.querySelector("#readingStatus");
const readingProgress = document.querySelector("#readingProgress");
const modeInputs = Array.from(document.querySelectorAll("input[name='practiceMode']"));
const newPromptButton = document.querySelector("#newPromptButton");
const recordButton = document.querySelector("#recordButton");
const playButton = document.querySelector("#playButton");
const playbackAudio = document.querySelector("#playbackAudio");
const recordingNotice = document.querySelector("#recordingNotice");
const sessionPill = document.querySelector("#sessionPill");
const timer = document.querySelector("#timer");
const waveform = document.querySelector("#waveform");
const scoreValue = document.querySelector("#scoreValue");
const energyMetric = document.querySelector("#energyMetric");
const pitchMetric = document.querySelector("#pitchMetric");
const tempoMetric = document.querySelector("#tempoMetric");
const pauseMetric = document.querySelector("#pauseMetric");
const emphasisMetric = document.querySelector("#emphasisMetric");
const clarityMetric = document.querySelector("#clarityMetric");
const feedbackText = document.querySelector("#feedbackText");
const scoreRing = document.querySelector(".score-ring");
const attentionMeter = document.querySelector("#attentionMeter");
const attentionLabel = document.querySelector("#attentionLabel");
const kids = Array.from(document.querySelectorAll("[data-kid]"));
const MIN_FEEDBACK_SECONDS = 5;
const LIVE_SAMPLE_WINDOW = 1200;
const LIVE_PITCH_WINDOW = 360;

const canvasContext = waveform.getContext("2d");
let mediaRecorder;
let audioContext;
let analyser;
let source;
let stream;
let chunks = [];
let recordedMimeType = "";
let recordingStartedAt = 0;
let timerInterval;
let animationFrame;
let audioUrl;
let samples = [];
let pitchReadings = [];
let speakingFrames = 0;
let quietFrames = 0;
let liveFrame = 0;
let currentPassageWords = [];
let wordElements = [];
let recognizedWordIndex = 0;
let speechRecognizer;
let shouldTrackSpeech = false;
let timedScrollInterval;
let currentMode = "story";

function setPrompt() {
  if (currentMode === "own") {
    clearPassage();
  } else {
    const passages = passageGroups[currentMode];
    const index = Math.floor(Math.random() * passages.length);
    renderPassage(passages[index]);
  }

  if (!mediaRecorder || mediaRecorder.state === "inactive") {
    resetAudience();
  }
}

function setMode(mode) {
  currentMode = mode;
  document.body.classList.toggle("business-mode", mode === "business");
  document.body.classList.toggle("own-text-mode", mode === "own");

  modeInputs.forEach(input => {
    input.checked = input.value === mode;
  });

  document.querySelector("#audience-title").textContent = mode === "business" ? "Meeting room" : "Classroom";
  feedbackText.textContent = mode === "own"
    ? "Speak your own text. I will judge vocal variety from pitch, volume, and pacing."
    : "Record a short take and I will listen for variety in energy, pitch, and pace.";
  setPrompt();
}

function clearPassage() {
  passageTitle.textContent = "Own text";
  readingText.innerHTML = "";
  currentPassageWords = [];
  wordElements = [];
  recognizedWordIndex = 0;
  readingProgress.style.width = "0%";
  readingText.scrollTop = 0;
  readingStatus.textContent = "";
  readingStatus.classList.remove("warning");
}

function hasReadingPassage() {
  return currentMode !== "own" && currentPassageWords.length > 0;
}

function normalizeWord(word) {
  return word
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function renderPassage(passage) {
  passageTitle.textContent = passage.title;
  readingText.innerHTML = "";
  currentPassageWords = [];
  wordElements = [];
  recognizedWordIndex = 0;
  readingProgress.style.width = "0%";
  readingStatus.textContent = "Ready to follow your reading.";
  readingStatus.classList.remove("warning");

  passage.text.trim().split(/\n\s*\n/).forEach(paragraph => {
    const paragraphElement = document.createElement("p");

    paragraph.trim().split(/\s+/).forEach(word => {
      const normalized = normalizeWord(word);
      if (!normalized) return;

      const wordElement = document.createElement("span");
      wordElement.className = "reading-word";
      wordElement.textContent = word;
      wordElement.dataset.wordIndex = currentPassageWords.length;
      paragraphElement.append(wordElement, " ");
      currentPassageWords.push(normalized);
      wordElements.push(wordElement);
    });

    readingText.append(paragraphElement);
  });

  readingText.scrollTop = 0;
}

function wordsSimilar(spokenWord, passageWord) {
  if (spokenWord === passageWord) return true;
  if (spokenWord.length < 5 || passageWord.length < 5) return false;
  if (Math.abs(spokenWord.length - passageWord.length) > 1) return false;

  let spokenIndex = 0;
  let passageIndex = 0;
  let edits = 0;

  while (spokenIndex < spokenWord.length && passageIndex < passageWord.length) {
    if (spokenWord[spokenIndex] === passageWord[passageIndex]) {
      spokenIndex += 1;
      passageIndex += 1;
      continue;
    }

    edits += 1;
    if (edits > 1) return false;

    if (spokenWord.length > passageWord.length) {
      spokenIndex += 1;
    } else if (passageWord.length > spokenWord.length) {
      passageIndex += 1;
    } else {
      spokenIndex += 1;
      passageIndex += 1;
    }
  }

  return edits + (spokenWord.length - spokenIndex) + (passageWord.length - passageIndex) <= 1;
}

function matchTranscriptToPassage(transcript) {
  const spokenWords = transcript.split(/\s+/).map(normalizeWord).filter(Boolean);
  if (!spokenWords.length) return recognizedWordIndex;

  let cursor = 0;
  spokenWords.forEach(spokenWord => {
    for (let index = cursor; index < Math.min(currentPassageWords.length, cursor + 14); index += 1) {
      if (wordsSimilar(spokenWord, currentPassageWords[index])) {
        cursor = index + 1;
        break;
      }
    }
  });

  return Math.max(recognizedWordIndex, cursor);
}

function updateReadingProgress(nextIndex, message) {
  recognizedWordIndex = clamp(nextIndex, 0, currentPassageWords.length);
  const currentIndex = Math.min(recognizedWordIndex, currentPassageWords.length - 1);

  wordElements.forEach((wordElement, index) => {
    wordElement.classList.toggle("read", index < recognizedWordIndex);
    wordElement.classList.toggle("current", index === currentIndex);
  });

  const progress = currentPassageWords.length
    ? (recognizedWordIndex / currentPassageWords.length) * 100
    : 0;
  readingProgress.style.width = `${progress}%`;

  const activeWord = wordElements[Math.max(0, currentIndex - 2)];
  if (activeWord) {
    activeWord.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  readingStatus.textContent = message || `Following your reading: ${recognizedWordIndex} / ${currentPassageWords.length} words`;
  readingStatus.classList.remove("warning");
}

function getSpeechRecognitionConstructor() {
  return window.SpeechRecognition || window.webkitSpeechRecognition;
}

function startTimedReadingScroll() {
  clearInterval(timedScrollInterval);
  timedScrollInterval = setInterval(() => {
    if (!mediaRecorder || mediaRecorder.state !== "recording") return;
    const estimatedWords = Math.floor(getElapsedSeconds() * 2.25);
    updateReadingProgress(
      estimatedWords,
      `Timed scroll: ${Math.min(estimatedWords, currentPassageWords.length)} / ${currentPassageWords.length} words`
    );
  }, 700);
}

function stopTimedReadingScroll() {
  clearInterval(timedScrollInterval);
  timedScrollInterval = null;
}

function startReadingTracker() {
  if (!hasReadingPassage()) return;

  const SpeechRecognition = getSpeechRecognitionConstructor();

  if (!SpeechRecognition) {
    readingStatus.textContent = "Word recognition is not available in this browser, so I will scroll the text at a steady reading pace.";
    readingStatus.classList.remove("warning");
    startTimedReadingScroll();
    return;
  }

  stopReadingTracker();
  shouldTrackSpeech = true;
  speechRecognizer = new SpeechRecognition();
  speechRecognizer.continuous = true;
  speechRecognizer.interimResults = true;
  speechRecognizer.lang = "en-US";

  speechRecognizer.addEventListener("result", event => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join(" ");
    updateReadingProgress(matchTranscriptToPassage(transcript));
  });

  speechRecognizer.addEventListener("error", event => {
    if (event.error === "not-allowed") {
      readingStatus.textContent = "Speech recognition was blocked, so I will scroll the text at a steady reading pace.";
      startTimedReadingScroll();
    } else {
      readingStatus.textContent = "Speech recognition paused, so I will scroll the text at a steady reading pace.";
      startTimedReadingScroll();
    }
    readingStatus.classList.remove("warning");
  });

  speechRecognizer.addEventListener("end", () => {
    if (!shouldTrackSpeech) return;
    try {
      speechRecognizer.start();
    } catch (error) {
      readingStatus.textContent = "Speech recognition paused, so I will scroll the text at a steady reading pace.";
      readingStatus.classList.remove("warning");
      startTimedReadingScroll();
    }
  });

  try {
    speechRecognizer.start();
    updateReadingProgress(0, "Listening for the words you read...");
  } catch (error) {
    readingStatus.textContent = "Word recognition could not start, so I will scroll the text at a steady reading pace.";
    readingStatus.classList.remove("warning");
    startTimedReadingScroll();
  }
}

function stopReadingTracker() {
  shouldTrackSpeech = false;
  stopTimedReadingScroll();
  if (!speechRecognizer) return;

  try {
    speechRecognizer.stop();
  } catch (error) {
    // The recognizer may already be stopped by the browser.
  }

  speechRecognizer = null;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function getElapsedSeconds() {
  return Math.floor((Date.now() - recordingStartedAt) / 1000);
}

function drawIdleWave() {
  const { width, height } = waveform;
  canvasContext.clearRect(0, 0, width, height);
  canvasContext.strokeStyle = "#c9d6df";
  canvasContext.lineWidth = 3;
  canvasContext.beginPath();
  for (let x = 0; x < width; x += 8) {
    const y = height / 2 + Math.sin(x / 28) * 14;
    x === 0 ? canvasContext.moveTo(x, y) : canvasContext.lineTo(x, y);
  }
  canvasContext.stroke();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function linearScore(value, low, high) {
  if (high === low) return 0;
  return clamp(((value - low) / (high - low)) * 100, 0, 100);
}

function bandScore(value, idealLow, idealHigh, hardLow, hardHigh) {
  if (value >= idealLow && value <= idealHigh) return 100;
  if (value < idealLow) return linearScore(value, hardLow, idealLow);
  return 100 - linearScore(value, idealHigh, hardHigh);
}

function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function standardDeviation(values) {
  if (values.length < 2) return 0;
  const average = mean(values);
  const variance = mean(values.map(value => (value - average) ** 2));
  return Math.sqrt(variance);
}

function percentile(values, amount) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (sorted.length - 1) * amount;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

function rmsToDb(rms) {
  return 20 * Math.log10(Math.max(rms, 0.00001));
}

function getSpeechThreshold(rmsValues) {
  if (!rmsValues.length) return 0.025;
  const quiet = percentile(rmsValues, 0.1);
  const loud = percentile(rmsValues, 0.95);
  return clamp(quiet + (loud - quiet) * 0.22, 0.014, 0.09);
}

function getRuns(flags, targetValue, frameDuration) {
  const runs = [];
  let start = null;

  flags.forEach((flag, index) => {
    if (flag === targetValue && start === null) {
      start = index;
    }

    if ((flag !== targetValue || index === flags.length - 1) && start !== null) {
      const end = flag === targetValue && index === flags.length - 1 ? index + 1 : index;
      runs.push((end - start) * frameDuration);
      start = null;
    }
  });

  return runs;
}

function cleanPitchReadings(pitches) {
  const inHumanRange = pitches.filter(pitch => pitch >= 70 && pitch <= 450);
  if (inHumanRange.length < 4) return [];

  const basePitch = percentile(inHumanRange, 0.5);
  const semitones = inHumanRange.map(pitch => 12 * Math.log2(pitch / basePitch));
  const low = percentile(semitones, 0.05);
  const high = percentile(semitones, 0.95);

  return semitones.filter(value => value >= low && value <= high);
}

function describeMetric(score, lowLabel, midLabel, highLabel, detail) {
  const label = score < 45 ? lowLabel : score < 72 ? midLabel : highLabel;
  return detail ? `${label}: ${detail}` : label;
}

function countEmphasisPeaks(dbValues, frameDuration) {
  if (dbValues.length < 4) return 0;
  const threshold = mean(dbValues) + standardDeviation(dbValues) * 0.85;
  const minGapFrames = Math.max(1, Math.round(0.35 / Math.max(frameDuration, 0.01)));
  let peaks = 0;
  let framesSincePeak = minGapFrames;

  dbValues.forEach((value, index, values) => {
    const previous = values[index - 1] ?? value;
    const next = values[index + 1] ?? value;
    const isPeak = value > threshold && value >= previous && value >= next;

    if (isPeak && framesSincePeak >= minGapFrames) {
      peaks += 1;
      framesSincePeak = 0;
    } else {
      framesSincePeak += 1;
    }
  });

  return peaks;
}

function setKidStates(states) {
  kids.forEach((kid, index) => {
    kid.classList.remove("ready", "distracted", "unsure", "curious", "focused", "delighted");
    kid.classList.add(states[index] || states[states.length - 1]);
  });
}

function resetAudience() {
  attentionLabel.textContent = "Ready to listen";
  attentionMeter.style.width = "34%";
  setKidStates(["ready", "ready", "ready", "ready", "ready"]);
}

function updateListeningPeriod(elapsedSeconds) {
  const progress = clamp(elapsedSeconds / MIN_FEEDBACK_SECONDS, 0, 1);
  const remaining = Math.max(0, MIN_FEEDBACK_SECONDS - elapsedSeconds);
  attentionLabel.textContent = remaining
    ? `Listening first: ${remaining}s`
    : "Ready to judge";
  attentionMeter.style.width = `${34 + progress * 28}%`;
  setKidStates(["ready", "curious", "ready", "curious", "ready"]);
}

function setRecordingNotice(message, tone = "") {
  recordingNotice.textContent = message;
  recordingNotice.classList.remove("warning", "active", "success");
  if (tone) recordingNotice.classList.add(tone);
}

function getMicrophoneIssue() {
  const localHosts = ["localhost", "127.0.0.1", "::1"];
  const isLocalHost = localHosts.includes(window.location.hostname);
  const isHttps = window.location.protocol === "https:";

  if (!isHttps && !isLocalHost) {
    return "Recording needs the local web link. Open http://127.0.0.1:5173/index.html instead of the file version.";
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return "This browser cannot access the microphone from this page. Try http://127.0.0.1:5173/index.html in Chrome or Safari.";
  }

  if (!window.MediaRecorder) {
    return "This browser can access the microphone but cannot record audio here. Try a newer Safari or Chrome.";
  }

  return "";
}

function getRecorderOptions() {
  if (!window.MediaRecorder || typeof MediaRecorder.isTypeSupported !== "function") return {};

  const mimeTypes = [
    "audio/mp4",
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus"
  ];

  const supportedType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type));
  return supportedType ? { mimeType: supportedType } : {};
}

function updateAudience(score) {
  const attention = clamp(Math.round(score), 0, 100);
  attentionMeter.style.width = `${attention}%`;

  if (attention < 28) {
    attentionLabel.textContent = "Attention slipping";
    setKidStates(["distracted", "unsure", "distracted", "distracted", "unsure"]);
  } else if (attention < 52) {
    attentionLabel.textContent = "Trying to follow";
    setKidStates(["unsure", "curious", "unsure", "distracted", "curious"]);
  } else if (attention < 76) {
    attentionLabel.textContent = "Listening";
    setKidStates(["focused", "curious", "focused", "curious", "focused"]);
  } else {
    attentionLabel.textContent = "Fully engaged";
    setKidStates(["delighted", "focused", "delighted", "focused", "delighted"]);
  }
}

function analyzeProsody(rmsValues, pitches, duration) {
  const speechThreshold = getSpeechThreshold(rmsValues);
  const frameDuration = duration / Math.max(1, rmsValues.length);
  const speechFlags = rmsValues.map(value => value > speechThreshold);
  const speechRms = rmsValues.filter(value => value > speechThreshold);
  const speechRatio = speechRms.length / Math.max(1, rmsValues.length);
  const speechDb = speechRms.map(rmsToDb);

  const energySd = standardDeviation(speechDb);
  const energyRange = percentile(speechDb, 0.95) - percentile(speechDb, 0.05);
  const energyScore = clamp(
    linearScore(energySd, 1.4, 5.2) * 0.65 +
      linearScore(energyRange, 4.5, 15) * 0.35,
    0,
    100
  );

  const semitoneValues = cleanPitchReadings(pitches);
  const pitchSd = standardDeviation(semitoneValues);
  const pitchRange = percentile(semitoneValues, 0.9) - percentile(semitoneValues, 0.1);
  const pitchMoves = semitoneValues.reduce((count, value, index, values) => {
    if (index === 0) return count;
    return Math.abs(value - values[index - 1]) >= 1.4 ? count + 1 : count;
  }, 0);

  let pitchScore = clamp(
    linearScore(pitchSd, 0.65, 3.1) * 0.56 +
      linearScore(pitchRange, 3.2, 9.5) * 0.34 +
      linearScore(pitchMoves / Math.max(1, duration / 20), 1, 8) * 0.1,
    0,
    100
  );

  if (pitchRange < 3.2) {
    pitchScore = Math.min(pitchScore, 36);
  }

  if (semitoneValues.length < 8) {
    pitchScore = Math.min(pitchScore, 42);
  }

  const pauseDurations = getRuns(speechFlags, false, frameDuration);
  const speechDurations = getRuns(speechFlags, true, frameDuration);
  const strategicPauses = pauseDurations.filter(pause => pause >= 0.35 && pause <= 2.4);
  const longPauses = pauseDurations.filter(pause => pause > 2.4);
  const pausesPerMinute = strategicPauses.length / Math.max(0.1, duration / 60);
  const pauseVariation = standardDeviation(strategicPauses);
  const averageSpeechRun = mean(speechDurations);
  const speechRatioScore = bandScore(speechRatio, 0.62, 0.88, 0.35, 0.98);
  const speechRunScore = bandScore(averageSpeechRun, 1.4, 4.8, 0.4, 9);
  const pauseFrequencyScore = bandScore(pausesPerMinute, 3, 9, 0, 16);
  const pauseVariationScore = strategicPauses.length >= 2 ? linearScore(pauseVariation, 0.12, 0.75) : 28;
  const longPausePenalty = Math.min(30, longPauses.length * 10);
  const tempoScore = clamp(
    speechRatioScore * 0.62 + speechRunScore * 0.38,
    0,
    100
  );
  let pauseScore = clamp(
    pauseFrequencyScore * 0.68 + pauseVariationScore * 0.32 - longPausePenalty,
    0,
    100
  );

  if (!strategicPauses.length) {
    pauseScore = Math.min(pauseScore, 42);
  }

  const emphasisPeaks = countEmphasisPeaks(speechDb, frameDuration);
  const emphasisPeaksPerMinute = emphasisPeaks / Math.max(0.1, duration / 60);
  const emphasisScore = clamp(
    bandScore(emphasisPeaksPerMinute, 5, 14, 0, 24) * 0.58 +
      linearScore(energyRange, 4.5, 15) * 0.27 +
      linearScore(pitchMoves / Math.max(1, duration / 20), 1, 8) * 0.15,
    0,
    100
  );

  const pitchTrackingRatio = pitches.length / Math.max(1, speechRms.length);
  const clippingRatio = rmsValues.filter(value => value > 0.92).length / Math.max(1, rmsValues.length);
  const clarityScore = clamp(
    linearScore(pitchTrackingRatio, 0.12, 0.58) * 0.55 +
      speechRatioScore * 0.3 +
      (100 - linearScore(clippingRatio, 0.01, 0.08)) * 0.15,
    0,
    100
  );

  const pacingScore = tempoScore * 0.58 + pauseScore * 0.42;
  let score = pitchScore * 0.36 + energyScore * 0.24 + pacingScore * 0.22 + emphasisScore * 0.12 + clarityScore * 0.06;

  if (pitchScore < 45 && energyScore < 45) {
    score = Math.min(score, 48);
  }

  if (pitchRange < 3.2 && energySd < 2.2) {
    score = Math.min(score, 42);
  }

  if (semitoneValues.length < 8) {
    score = Math.min(score, 58);
  }

  return {
    score: Math.round(clamp(score, 0, 100)),
    pitchScore,
    energyScore,
    pacingScore,
    pitchSd,
    pitchRange,
    energySd,
    energyRange,
    speechRatio,
    pitchSamples: semitoneValues.length,
    tempoScore,
    pauseScore,
    emphasisScore,
    clarityScore,
    averageSpeechRun,
    emphasisPeaks,
    emphasisPeaksPerMinute,
    pitchTrackingRatio,
    strategicPauses: strategicPauses.length,
    pausesPerMinute
  };
}

function scoreLiveAudience() {
  const recentEnergy = samples.slice(-LIVE_SAMPLE_WINDOW);
  const recentPitch = pitchReadings.slice(-LIVE_PITCH_WINDOW);
  return analyzeProsody(recentEnergy, recentPitch, MIN_FEEDBACK_SECONDS).score;
}

function estimatePitch(buffer, sampleRate, rms) {
  if (rms < 0.018) return null;

  const meanValue = mean(Array.from(buffer));
  let bestOffset = -1;
  let bestCorrelation = 0;
  const minOffset = Math.floor(sampleRate / 450);
  const maxOffset = Math.floor(sampleRate / 70);

  for (let offset = minOffset; offset <= maxOffset; offset += 1) {
    let correlation = 0;
    let firstEnergy = 0;
    let secondEnergy = 0;

    for (let i = 0; i < buffer.length - offset; i += 1) {
      const first = buffer[i] - meanValue;
      const second = buffer[i + offset] - meanValue;
      correlation += first * second;
      firstEnergy += first * first;
      secondEnergy += second * second;
    }

    correlation = correlation / Math.sqrt(firstEnergy * secondEnergy || 1);

    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }

  return bestCorrelation > 0.62 && bestOffset > 0 ? sampleRate / bestOffset : null;
}

function drawLiveWave() {
  const timeData = new Uint8Array(analyser.fftSize);
  const floatData = new Float32Array(analyser.fftSize);
  analyser.getByteTimeDomainData(timeData);
  analyser.getFloatTimeDomainData(floatData);

  const normalized = Array.from(timeData, value => (value - 128) / 128);
  const rms = Math.sqrt(normalized.reduce((sum, value) => sum + value * value, 0) / normalized.length);
  samples.push(rms);
  rms > 0.035 ? speakingFrames += 1 : quietFrames += 1;

  const pitch = estimatePitch(floatData, audioContext.sampleRate, rms);
  if (pitch) pitchReadings.push(pitch);

  liveFrame += 1;
  if (liveFrame % 8 === 0) {
    const elapsedSeconds = getElapsedSeconds();
    if (elapsedSeconds < MIN_FEEDBACK_SECONDS) {
      updateListeningPeriod(elapsedSeconds);
    } else {
      updateAudience(scoreLiveAudience());
    }
  }

  const { width, height } = waveform;
  canvasContext.clearRect(0, 0, width, height);
  canvasContext.strokeStyle = "#0d7c80";
  canvasContext.lineWidth = 3;
  canvasContext.beginPath();

  const step = width / timeData.length;
  timeData.forEach((value, index) => {
    const x = index * step;
    const y = (value / 255) * height;
    index === 0 ? canvasContext.moveTo(x, y) : canvasContext.lineTo(x, y);
  });

  canvasContext.stroke();
  animationFrame = requestAnimationFrame(drawLiveWave);
}

function updateTimer() {
  const elapsed = getElapsedSeconds();
  timer.textContent = formatTime(elapsed);
}

function describeLevel(value, lowLabel, midLabel, highLabel) {
  if (value < 35) return lowLabel;
  if (value < 70) return midLabel;
  return highLabel;
}

function analyzeRecording() {
  const duration = Math.max(1, getElapsedSeconds());

  if (duration < MIN_FEEDBACK_SECONDS) {
    scoreValue.textContent = "--";
    scoreRing.style.background = "conic-gradient(var(--accent) 0deg, #dcece9 0deg)";
    attentionLabel.textContent = "Too short to judge";
    attentionMeter.style.width = "42%";
    setKidStates(["ready", "curious", "ready", "curious", "ready"]);
    energyMetric.textContent = "Need 5 seconds";
    pitchMetric.textContent = "Need 5 seconds";
    tempoMetric.textContent = "Need 5 seconds";
    pauseMetric.textContent = "Need 5 seconds";
    emphasisMetric.textContent = "Need 5 seconds";
    clarityMetric.textContent = "Need 5 seconds";
    setRecordingNotice("That take was under 5 seconds, so I did not score voice variety yet.", "warning");
    feedbackText.textContent = "This take was too short to judge voice variety fairly. Try speaking for at least 5 seconds so the audience can hear a real pattern.";
    return;
  }

  const result = analyzeProsody(samples, pitchReadings, duration);

  scoreValue.textContent = result.score;
  scoreRing.style.background = `conic-gradient(var(--accent) ${result.score * 3.6}deg, #dcece9 0deg)`;
  updateAudience(result.score);
  energyMetric.textContent = describeMetric(
    result.energyScore,
    "Low",
    "Some contrast",
    "Strong contrast",
    `${result.energySd.toFixed(1)} dB SD`
  );
  pitchMetric.textContent = result.pitchSamples < 8
    ? "Pitch unclear"
    : describeMetric(
        result.pitchScore,
        "Mostly flat",
        "Some melody",
        "Expressive",
        `${result.pitchRange.toFixed(1)} st range`
      );
  tempoMetric.textContent = describeMetric(
    result.tempoScore,
    "Uneven flow",
    "Moderate flow",
    "Steady flow",
    `${Math.round(result.speechRatio * 100)}% speech`
  );
  pauseMetric.textContent = describeMetric(
    result.pauseScore,
    "Needs clearer pauses",
    "Some pause shape",
    "Good pause shape",
    `${result.strategicPauses} pauses, ${result.pausesPerMinute.toFixed(1)}/min`
  );
  emphasisMetric.textContent = describeMetric(
    result.emphasisScore,
    "Few peaks",
    "Some emphasis",
    "Clear emphasis",
    `${result.emphasisPeaks} peaks`
  );
  clarityMetric.textContent = describeMetric(
    result.clarityScore,
    "Signal unclear",
    "Usable",
    "Clear signal",
    `${Math.round(result.pitchTrackingRatio * 100)}% voice trace`
  );

  if (result.score >= 78) {
    feedbackText.textContent = "The audience stayed with you. Keep the shape, and now practice making the most important sentence even more deliberate.";
  } else if (result.pitchScore < 45 && result.energyScore < 45) {
    feedbackText.textContent = "This sounded fairly monotone: both pitch and volume stayed narrow. Try choosing three key words and lifting either the pitch or volume on each one.";
  } else if (result.pitchScore < 45) {
    feedbackText.textContent = "The pitch stayed in a narrow band. Try adding a clearer rise, fall, or peak on the most important phrase.";
  } else if (result.energyScore < 45) {
    feedbackText.textContent = "The volume stayed too even. Try making important words stronger and less important words lighter.";
  } else if (result.pacingScore < 45) {
    feedbackText.textContent = "The pacing needs more shape. Add one clean pause before an important idea and another after it lands.";
  } else {
    feedbackText.textContent = "There is some variety, but not enough contrast yet. Try a second take with a larger pitch change and one deliberate pause.";
  }
}

async function startRecording() {
  const microphoneIssue = getMicrophoneIssue();
  if (microphoneIssue) {
    throw new Error(microphoneIssue);
  }

  stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  audioContext = new AudioContext();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);

  chunks = [];
  recordedMimeType = "";
  samples = [];
  pitchReadings = [];
  speakingFrames = 0;
  quietFrames = 0;
  liveFrame = 0;
  if (audioUrl) URL.revokeObjectURL(audioUrl);
  audioUrl = "";
  playbackAudio.removeAttribute("src");
  playbackAudio.classList.remove("ready");
  playbackAudio.load();
  if (hasReadingPassage()) {
    updateReadingProgress(0, "Listening for the words you read...");
  }

  const recorderOptions = getRecorderOptions();
  mediaRecorder = new MediaRecorder(stream, recorderOptions);
  recordedMimeType = mediaRecorder.mimeType || recorderOptions.mimeType || "";
  mediaRecorder.addEventListener("dataavailable", event => {
    if (event.data && event.data.size > 0) chunks.push(event.data);
  });
  mediaRecorder.addEventListener("stop", finishRecording);
  mediaRecorder.start();
  startReadingTracker();

  recordingStartedAt = Date.now();
  timerInterval = setInterval(updateTimer, 250);
  updateTimer();
  drawLiveWave();

  sessionPill.textContent = "Recording";
  sessionPill.classList.add("recording");
  document.body.classList.add("is-recording");
  recordButton.textContent = "Stop Recording";
  recordButton.classList.add("recording");
  playButton.disabled = true;
  setRecordingNotice("Recording. The audience will listen for 5 seconds before judging variety.", "active");
  feedbackText.textContent = currentMode === "own"
    ? "Speak freely. After 5 seconds, the audience will start reacting to your voice variety."
    : "The audience is listening first. After 5 seconds, they will start reacting to your voice variety.";
  updateListeningPeriod(0);
}

function finishRecording() {
  clearInterval(timerInterval);
  cancelAnimationFrame(animationFrame);
  stopReadingTracker();
  stream.getTracks().forEach(track => track.stop());
  audioContext.close();

  const blobType = recordedMimeType || chunks[0]?.type || "audio/mp4";
  const blob = new Blob(chunks, { type: blobType });
  if (audioUrl) URL.revokeObjectURL(audioUrl);
  audioUrl = URL.createObjectURL(blob);
  playbackAudio.src = audioUrl;
  playbackAudio.classList.add("ready");
  playbackAudio.load();
  playButton.disabled = false;

  sessionPill.textContent = "Complete";
  sessionPill.classList.remove("recording");
  document.body.classList.remove("is-recording");
  recordButton.textContent = "Start Recording";
  recordButton.classList.remove("recording");
  setRecordingNotice("Recording complete. Play it back or try another take.", "success");
  analyzeRecording();
}

async function toggleRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    return;
  }

  try {
    await startRecording();
  } catch (error) {
    const message = error.name === "NotAllowedError"
      ? "Microphone permission was blocked. Allow microphone access in your browser and try again."
      : error.message || "I could not access the microphone. Please allow microphone permission in your browser and try again.";

    sessionPill.textContent = "Ready";
    sessionPill.classList.remove("recording");
    document.body.classList.remove("is-recording");
    recordButton.textContent = "Start Recording";
    recordButton.classList.remove("recording");
    setRecordingNotice(message, "warning");
    feedbackText.textContent = message;
    stopReadingTracker();
    updateAudience(18);
  }
}

async function playRecording() {
  if (!audioUrl) {
    setRecordingNotice("Record a take first, then play it back.", "warning");
    return;
  }

  try {
    playbackAudio.currentTime = 0;
    await playbackAudio.play();
  } catch (error) {
    setRecordingNotice("Playback was blocked. Use the audio controls below the buttons.", "warning");
    playbackAudio.classList.add("ready");
  }
}

newPromptButton.addEventListener("click", setPrompt);
modeInputs.forEach(input => {
  input.addEventListener("change", () => {
    if (input.checked) setMode(input.value);
  });
});
recordButton.addEventListener("click", toggleRecording);
playButton.addEventListener("click", playRecording);

setMode("story");
drawIdleWave();

const firstMicrophoneIssue = getMicrophoneIssue();
if (firstMicrophoneIssue) {
  setRecordingNotice(firstMicrophoneIssue, "warning");
} else {
  setRecordingNotice("Ready. Press Start Recording and allow microphone access.", "active");
}
