const passageGroups = {
  story: [
    {
      title: "The Dragon, the Mouse, and the Moon",
      text: `The dragon spoke in a voice as deep as thunder. Who has taken the silver moon bell from my tower? he roared, and the windows of the village rattled.

From behind a pumpkin cart, a tiny mouse lifted one paw. I borrowed it, she squeaked, because the river was lonely and needed music. The dragon blinked. The mayor gasped. The baker dropped an entire tray of buns.

Then the river began to sing. Its voice was soft at first, then bright, then wild with joy. The dragon lowered his head and whispered, perhaps the bell belongs to everyone tonight.

So the mouse rang the bell once more. The dragon hummed along, the mayor clapped in rhythm, and even the baker laughed so loudly that the buns shook sugar into the street.`
    },
    {
      title: "The Clockmaker and the Storm",
      text: `At noon, the clockmaker raised both hands and shouted, Stop the tower clock! The storm is coming early, and the whole town must hear the warning before the sky turns black.

The mayor frowned. That clock has never stopped in ninety years, she said. If we stop it now, everyone will panic. But a young runner pointed to the hills and whispered, Look. The clouds are moving like a wall.

The clockmaker climbed the tower steps, slow at first, then faster as the wind pushed against the windows. He pulled the golden lever. The bells rang once, twice, then seven wild times.

Doors opened. People looked up. The mayor took a deep breath and called, To the shelter, calmly and quickly. By sunset, the storm had passed, and the silent clock became the bravest sound the town had ever heard.`
    },
    {
      title: "The Tiny Theater Mystery",
      text: `The curtain rose, and Princess Lila stepped forward in a sparkling blue cape. Tonight, she announced, we present the grand mystery of the missing crown.

Behind the curtain, Max the detective whispered, The crown is not missing. It is on your head. Lila froze. The audience gasped. The stage manager waved both arms and mouthed, Keep going.

So Lila lifted her chin and said, Exactly. The mystery is not where the crown is, but who is brave enough to wear it. Max blinked. The stage manager stopped waving. Someone in the front row laughed.

Then the smallest actor marched on stage and declared, I am brave enough. The room went quiet, then burst into applause. The mystery had changed, the story had changed, and somehow the ending was better than the plan.`
    }
  ],
  business: [
    {
      title: "Quarterly Planning Brief",
      text: `Good morning, everyone. Today I want to focus on three decisions: where we are growing, where we are losing momentum, and what we will change before the next quarter begins.

First, the good news. Customer retention improved by eight percent, and the education segment is becoming our strongest source of repeat revenue. That tells us the product is solving a real problem.

Now the challenge. Our onboarding process is still too slow. If a new customer does not see value in the first week, the risk of churn doubles. We need a simpler path from sign-up to first success.

My proposal is direct. We reduce the onboarding steps, assign one owner to the first-week experience, and review the numbers every Friday. If we move quickly, this quarter can become a turning point rather than a warning sign.`
    },
    {
      title: "Product Launch Update",
      text: `Thank you for joining on short notice. We are three weeks from launch, and the situation is promising, but not simple.

The product itself is ready. The early testers understand the value quickly, and their comments are more specific than we expected. That is a strong signal.

The risk is awareness. Our target customers like the idea once they see it, but too few of them know that it exists. A quiet launch would waste a good product.

So the next step is clear. We keep the launch date, sharpen the message, and focus the first campaign on one audience: team leaders who need faster onboarding. If we speak to everyone, we will sound vague. If we speak to them, we can sound useful.`
    },
    {
      title: "Team Change Announcement",
      text: `I want to talk about a change in how we work together. This is not a crisis, and it is not just an administrative update. It is a chance to remove friction.

Over the last two months, several projects slowed down because decisions were moving through too many people. Everyone was trying to help, but the process became heavier than the work itself.

Starting next Monday, every project will have one decision owner, one support lead, and one weekly checkpoint. That means fewer meetings, clearer responsibility, and faster movement when something blocks us.

This will feel different at first. Some of us will need to step back, and others will need to step forward. But if we use the new structure well, we should gain time, focus, and a calmer rhythm.`
    }
  ]
};

const passageTitle = document.querySelector("#passageTitle");
const readingText = document.querySelector("#readingText");
const ownTextInput = document.querySelector("#ownTextInput");
const readingStatus = document.querySelector("#readingStatus");
const readingProgress = document.querySelector("#readingProgress");
const modeInputs = Array.from(document.querySelectorAll("input[name='practiceMode']"));
const fontSizeInputs = Array.from(document.querySelectorAll("input[name='readingSize']"));
const scrollModeInputs = Array.from(document.querySelectorAll("input[name='scrollMode']"));
const audienceTypeInputs = Array.from(document.querySelectorAll("input[name='audienceType']"));
const newPromptButton = document.querySelector("#newPromptButton");
const recordButton = document.querySelector("#recordButton");
const playButton = document.querySelector("#playButton");
const microphoneSelect = document.querySelector("#microphoneSelect");
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
const metricDetailPanel = document.querySelector("#metricDetailPanel");
const metricDetailButtons = Array.from(document.querySelectorAll("[data-detail-metric]"));
const determinationMetric = document.querySelector("#determinationMetric");
const compassionMetric = document.querySelector("#compassionMetric");
const enthusiasmMetric = document.querySelector("#enthusiasmMetric");
const vocalColourText = document.querySelector("#vocalColourText");
const feedbackText = document.querySelector("#feedbackText");
const feedbackBox = document.querySelector(".feedback-box");
const scoreRing = document.querySelector(".score-ring");
const attentionMeter = document.querySelector("#attentionMeter");
const attentionLabel = document.querySelector("#attentionLabel");
const kids = Array.from(document.querySelectorAll("[data-kid]"));
const MIN_FEEDBACK_SECONDS = 5;
const PRAAT_ANALYZE_URL = "http://127.0.0.1:8000/analyze";
const PRAAT_LIVE_INTERVAL_SECONDS = 5;
const PRAAT_LIVE_WINDOW_SECONDS = 8;
const AUDIENCE_UPDATE_SECONDS = 1;
const AUDIENCE_MEMORY_WEIGHT = 0.75;
const AUDIENCE_START_ATTENTION = 52;
const VOICE_MATCH_BACKTRACK_WORDS = 8;
const VOICE_MATCH_LOOKAHEAD_WORDS = 42;
const VOICE_MATCH_PHRASE_WORDS = 14;
const VOICE_MATCH_MAX_INTERIM_ADVANCE = 10;
const VOICE_MATCH_MAX_FINAL_ADVANCE = 22;
const VOICE_ASSIST_SECONDS_BEFORE_NUDGE = 2;
const AUTO_SCROLL_WORDS_PER_SECOND = 2.35;
const VOICE_ASSIST_WORDS_PER_SECOND = 2.05;

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
let currentScrollMode = "auto";
let currentAudienceType = "duo";
let selectedMicrophoneId = "";
let liveAudioProcessor;
let liveMonitorGain;
let livePcmChunks = [];
let livePcmSampleCount = 0;
let livePcmTotalSamples = 0;
let recordingPcmChunks = [];
let recordingPcmSampleCount = 0;
let recordingPcmSampleRate = 0;
let livePraatInterval;
let isLivePraatAnalyzing = false;
let audienceAttention = AUDIENCE_START_ATTENTION;
let audienceAttentionHistory = [];
let audienceMomentScores = [];
let audienceAnalysisHistory = [];
let lastAudienceUpdateAt = 0;
let latestAnalysisResult = null;
let activeDetailMetric = "pitch";

function setPrompt() {
  if (currentMode === "own") {
    renderOwnText();
  } else if (currentMode === "audience") {
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
  document.body.classList.toggle("own-text-mode", mode === "own");
  document.body.classList.toggle("audience-only-mode", mode === "audience");

  modeInputs.forEach(input => {
    input.checked = input.value === mode;
  });

  updateAudiencePresentation();

  if (mode === "own") {
    feedbackText.textContent = "Speak your own text. I will judge vocal variety from pitch, volume, and pacing.";
  } else if (mode === "audience") {
    feedbackText.textContent = "Speak freely to the audience. I will judge vocal variety from pitch, volume, tempo, pauses, and emphasis.";
  } else {
    feedbackText.textContent = "Record a short take and I will listen for variety in energy, pitch, and pace.";
  }

  setPrompt();
}

function setAudienceType(type) {
  currentAudienceType = type;
  audienceTypeInputs.forEach(input => {
    input.checked = input.value === type;
  });
  updateAudiencePresentation();
  resetAudience();
}

function getEffectiveAudienceType() {
  return currentMode === "business"
    ? "business"
    : currentMode === "audience"
      ? currentAudienceType
      : "kids";
}

function isSuperheroAudience() {
  return getEffectiveAudienceType() === "superheroes";
}

function updateAudiencePresentation() {
  const effectiveType = getEffectiveAudienceType();
  const audienceLabels = {
    kids: ["Maya", "Noah", "Sam", "Ivy", "Leo"],
    business: ["Business listener 1", "Business listener 2", "Business listener 3", "Business listener 4", "Business listener 5"],
    duo: ["Antonie", "Steffen", "Hidden listener", "Hidden listener", "Hidden listener"],
    superheroes: ["Spider-Man", "Hulk", "Wonder Woman", "Superman", "Darth Vader"],
    online: ["Ari", "Bo", "Cy", "Dee", "Eli", "Fay", "Gus", "Hal", "Ira", "Jo"]
  };

  document.body.classList.toggle("business-mode", effectiveType === "business");
  document.body.classList.toggle("duo-audience-mode", effectiveType === "duo");
  document.body.classList.toggle("superhero-audience-mode", effectiveType === "superheroes");
  document.body.classList.toggle("online-audience-mode", effectiveType === "online");

  const title = effectiveType === "business"
    ? "Meeting room"
    : effectiveType === "duo"
      ? "Antonie & Steffen"
      : effectiveType === "superheroes"
        ? "Superhero audience"
        : effectiveType === "online"
          ? "Online meeting"
          : "Classroom";
  document.querySelector("#audience-title").textContent = title;

  kids.forEach((kid, index) => {
    kid.setAttribute("aria-label", audienceLabels[effectiveType][index] || "Hidden listener");
  });
}

function updateOwnTextVisibility() {
  const hasText = ownTextInput.value.trim().length > 0;
  document.body.classList.toggle("own-text-has-passage", hasText);
}

function renderOwnText() {
  const text = ownTextInput.value.trim();
  if (!text) {
    clearPassage();
    passageTitle.textContent = "Own text";
    readingStatus.textContent = "Paste a text above, or record freely without a reading text.";
    readingStatus.classList.remove("warning");
    updateOwnTextVisibility();
    return;
  }

  renderPassage({
    title: "Own text",
    text
  });
  readingStatus.textContent = "Own text ready.";
  readingStatus.classList.remove("warning");
  updateOwnTextVisibility();
}

function setReadingSize(size) {
  document.body.classList.remove("reading-size-small", "reading-size-medium", "reading-size-large");
  document.body.classList.add(`reading-size-${size}`);

  fontSizeInputs.forEach(input => {
    input.checked = input.value === size;
  });
}

function setScrollMode(mode) {
  currentScrollMode = mode;
  scrollModeInputs.forEach(input => {
    input.checked = input.value === mode;
  });

  if (mediaRecorder && mediaRecorder.state === "recording" && hasReadingPassage()) {
    startReadingTracker();
  } else if (hasReadingPassage()) {
    const messages = {
      voice: "Ready to follow your voice.",
      auto: "Ready to auto-scroll through the text.",
      manual: "Manual scrolling selected."
    };
    readingStatus.textContent = messages[mode];
    readingStatus.classList.remove("warning");
  }
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
  return currentPassageWords.length > 0;
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
  const spokenWords = transcript
    .split(/\s+/)
    .map(normalizeWord)
    .filter(Boolean)
    .slice(-VOICE_MATCH_PHRASE_WORDS);

  if (!spokenWords.length) return recognizedWordIndex;

  const searchStart = Math.max(0, recognizedWordIndex - VOICE_MATCH_BACKTRACK_WORDS);
  const searchEnd = Math.min(
    currentPassageWords.length,
    recognizedWordIndex + VOICE_MATCH_LOOKAHEAD_WORDS
  );
  let best = {
    endIndex: recognizedWordIndex,
    matches: 0,
    score: 0
  };

  for (let startIndex = searchStart; startIndex < searchEnd; startIndex += 1) {
    let passageIndex = startIndex;
    let matches = 0;
    let score = 0;
    let lastMatchIndex = startIndex - 1;

    spokenWords.forEach(spokenWord => {
      const localEnd = Math.min(searchEnd, passageIndex + 5);

      for (let index = passageIndex; index < localEnd; index += 1) {
        if (wordsSimilar(spokenWord, currentPassageWords[index])) {
          const skippedWords = index - passageIndex;
          matches += 1;
          score += Math.max(1, 6 - skippedWords);
          lastMatchIndex = index;
          passageIndex = index + 1;
          break;
        }
      }
    });

    if (matches >= 2 && score > best.score) {
      best = {
        endIndex: lastMatchIndex + 1,
        matches,
        score
      };
    }
  }

  if (best.matches < 2) {
    return recognizedWordIndex;
  }

  return Math.max(recognizedWordIndex, best.endIndex);
}

function updateReadingFromTranscript(transcript, isFinal = false) {
  const matchedWords = matchTranscriptToPassage(transcript);
  const maximumAdvance = isFinal ? VOICE_MATCH_MAX_FINAL_ADVANCE : VOICE_MATCH_MAX_INTERIM_ADVANCE;
  const nextIndex = Math.min(matchedWords, recognizedWordIndex + maximumAdvance);
  updateReadingProgress(nextIndex);
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

  const activeWord = wordElements[Math.min(wordElements.length - 1, Math.max(0, currentIndex + 8))];
  if (activeWord) {
    activeWord.scrollIntoView({ block: "center", behavior: "auto" });
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
    const targetDuration = clamp(currentPassageWords.length / AUTO_SCROLL_WORDS_PER_SECOND, 28, 62);
    const estimatedWords = Math.floor((getElapsedSeconds() / targetDuration) * currentPassageWords.length);
    updateReadingProgress(
      estimatedWords,
      `Auto scroll: ${Math.min(estimatedWords, currentPassageWords.length)} / ${currentPassageWords.length} words`
    );
  }, 500);
}

function stopTimedReadingScroll() {
  clearInterval(timedScrollInterval);
  timedScrollInterval = null;
}

function startVoiceReadingAssist() {
  clearInterval(timedScrollInterval);
  timedScrollInterval = setInterval(() => {
    if (!mediaRecorder || mediaRecorder.state !== "recording") return;

    const elapsedSeconds = getElapsedSeconds();
    if (elapsedSeconds < VOICE_ASSIST_SECONDS_BEFORE_NUDGE) return;

    const targetDuration = clamp(currentPassageWords.length / VOICE_ASSIST_WORDS_PER_SECOND, 32, 72);
    const estimatedWords = Math.floor((elapsedSeconds / targetDuration) * currentPassageWords.length);
    const lag = estimatedWords - recognizedWordIndex;
    const shouldNudge = lag > 4;

    if (shouldNudge) {
      const nudgeWords = lag > 12 ? 2 : 1;
      updateReadingProgress(
        Math.min(recognizedWordIndex + nudgeWords, currentPassageWords.length),
        `Following your voice: ${recognizedWordIndex} / ${currentPassageWords.length} words`
      );
    }
  }, 650);
}

function startReadingTracker() {
  if (!hasReadingPassage()) return;

  stopReadingTracker();

  if (currentScrollMode === "manual") {
    readingStatus.textContent = "Manual scrolling selected. Move the text yourself while recording.";
    readingStatus.classList.remove("warning");
    return;
  }

  if (currentScrollMode === "auto") {
    readingStatus.textContent = "Auto scroll selected. The text will move slowly through the take.";
    readingStatus.classList.remove("warning");
    startTimedReadingScroll();
    return;
  }

  const SpeechRecognition = getSpeechRecognitionConstructor();

  if (!SpeechRecognition) {
    readingStatus.textContent = "Voice following is using guided scrolling in this browser.";
    readingStatus.classList.remove("warning");
    shouldTrackSpeech = true;
    startVoiceReadingAssist();
    return;
  }

  shouldTrackSpeech = true;
  startVoiceReadingAssist();
  speechRecognizer = new SpeechRecognition();
  speechRecognizer.continuous = true;
  speechRecognizer.interimResults = true;
  speechRecognizer.lang = "en-US";

  speechRecognizer.addEventListener("result", event => {
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index];
      updateReadingFromTranscript(result[0].transcript, result.isFinal);
    }
  });

  speechRecognizer.addEventListener("error", event => {
    if (event.error === "not-allowed") {
      readingStatus.textContent = "Voice following was blocked. Choose Auto or Manual.";
    } else {
      readingStatus.textContent = "Voice following paused. Choose Auto if you want steady scrolling.";
    }
    readingStatus.classList.add("warning");
  });

  speechRecognizer.addEventListener("end", () => {
    if (!shouldTrackSpeech) return;
    try {
      speechRecognizer.start();
    } catch (error) {
      readingStatus.textContent = "Voice following paused. Choose Auto if you want steady scrolling.";
      readingStatus.classList.add("warning");
    }
  });

  try {
    speechRecognizer.start();
    updateReadingProgress(0, "Listening for the words you read...");
  } catch (error) {
    readingStatus.textContent = "Voice following could not start. Choose Auto or Manual.";
    readingStatus.classList.add("warning");
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

function averagePitchHz(pitches) {
  const cleanPitches = pitches.filter(pitch => pitch >= 70 && pitch <= 450);
  return cleanPitches.length ? percentile(cleanPitches, 0.5) : 0;
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

function cleanPitchHzReadings(pitches) {
  const inHumanRange = pitches.filter(pitch => pitch >= 70 && pitch <= 450);
  if (inHumanRange.length < 4) return [];

  const basePitch = percentile(inHumanRange, 0.5);
  const pitchPoints = inHumanRange.map(pitch => ({
    hz: pitch,
    semitone: 12 * Math.log2(pitch / basePitch)
  }));
  const semitones = pitchPoints.map(point => point.semitone);
  const low = percentile(semitones, 0.05);
  const high = percentile(semitones, 0.95);

  return pitchPoints
    .filter(point => point.semitone >= low && point.semitone <= high)
    .map(point => point.hz);
}

function describeMetric(score, lowLabel, midLabel, highLabel, detail) {
  const label = score < 45 ? lowLabel : score < 72 ? midLabel : highLabel;
  return detail ? `${label}: ${detail}` : label;
}

function getQualityClass(score) {
  if (score == null) return "quality-neutral";
  if (score < 45) return "quality-low";
  if (score < 72) return "quality-mid";
  return "quality-high";
}

function setQuality(element, score) {
  const card = element?.closest("article") || element;
  if (!card) return;
  card.classList.remove("quality-low", "quality-mid", "quality-high", "quality-neutral");
  card.classList.add(getQualityClass(score));
}

function setScoreVisual(score) {
  const qualityClass = getQualityClass(score);
  const color = qualityClass === "quality-high"
    ? "var(--quality-high)"
    : qualityClass === "quality-mid"
      ? "var(--quality-mid)"
      : "var(--quality-low)";
  scoreRing.style.background = `conic-gradient(${color} ${score * 3.6}deg, #dcece9 0deg)`;
  setQuality(feedbackBox, score);
}

function clearQualityColors() {
  [
    pitchMetric,
    energyMetric,
    tempoMetric,
    pauseMetric,
    emphasisMetric,
    clarityMetric,
    determinationMetric,
    compassionMetric,
    enthusiasmMetric,
    feedbackBox
  ].forEach(element => {
    setQuality(element, null);
  });
  scoreRing.style.background = "conic-gradient(var(--accent) 0deg, #dcece9 0deg)";
}

function setMetricDetailEmpty(message = "Record a take, then open a metric to see the shape behind the score.") {
  latestAnalysisResult = null;
  metricDetailButtons.forEach(button => {
    button.classList.remove("active");
  });

  if (!metricDetailPanel) return;
  metricDetailPanel.innerHTML = `<div class="metric-detail-empty">${message}</div>`;
}

function markerStyle(percent) {
  return `--marker-position: ${clamp(percent, 0, 100)}%;`;
}

function barStyle(percent) {
  return `--bar-fill: ${clamp(percent, 0, 100)}%;`;
}

function formatValue(value, suffix = "", digits = 1) {
  return Number.isFinite(value) ? `${value.toFixed(digits)}${suffix}` : "--";
}

function describePitchZone(pitchHz) {
  if (!pitchHz) {
    return {
      label: "Pitch unclear",
      note: "The app needs a steadier voice trace before it can place the pitch."
    };
  }

  if (pitchHz < 145) {
    return {
      label: "Lower pitch area",
      note: "Often read as a lower speaking pitch, but pitch alone does not define the voice."
    };
  }

  if (pitchHz <= 185) {
    return {
      label: "Overlap area",
      note: "This sits in the shared middle where many voices can sound different for reasons beyond pitch."
    };
  }

  return {
    label: "Higher pitch area",
    note: "Often read as a higher speaking pitch, but resonance and delivery matter too."
  };
}

function pitchHzToSpectrumPosition(hz) {
  return linearScore(hz, 80, 265);
}

function getPitchRangeHz(result) {
  const medianHz = result.pitchMedianHz || 0;
  let lowHz = result.pitchLowHz || 0;
  let highHz = result.pitchHighHz || 0;

  if ((!lowHz || !highHz) && medianHz && Number.isFinite(result.pitchRange)) {
    const halfRange = result.pitchRange / 2;
    lowHz = medianHz / Math.pow(2, halfRange / 12);
    highHz = medianHz * Math.pow(2, halfRange / 12);
  }

  if (!medianHz || !lowHz || !highHz || highHz <= lowHz) {
    return null;
  }

  const left = clamp(pitchHzToSpectrumPosition(lowHz), 4, 96);
  const right = clamp(pitchHzToSpectrumPosition(highHz), 4, 96);
  const medianPosition = clamp(pitchHzToSpectrumPosition(medianHz), 6, 94);

  return {
    low: Math.round(lowHz),
    median: Math.round(medianHz),
    high: Math.round(highHz),
    left,
    right,
    medianPosition
  };
}

function renderPitchDetail(result) {
  const pitchHz = result.pitchMedianHz || 0;
  const voiceZone = linearScore(pitchHz, 85, 255);
  const rangeFill = linearScore(result.pitchRange, 0, 12);
  const pitchZone = describePitchZone(pitchHz);
  const rangeHz = getPitchRangeHz(result);
  const pitchMapStyle = rangeHz
    ? `--pitch-range-left: ${rangeHz.left}%; --pitch-range-right: ${rangeHz.right}%; --pitch-median-position: ${rangeHz.medianPosition}%;`
    : "";

  return `
    <div class="detail-header">
      <h3>Pitch detail</h3>
      <span>${pitchHz ? Math.round(pitchHz) : "--"} Hz average</span>
    </div>
    <div class="pitch-reference-map" style="${pitchMapStyle}">
      <div class="pitch-map-title">
        <strong>Voice pitch framework</strong>
        <span>${rangeHz ? `${rangeHz.low}-${rangeHz.high} Hz` : "Range unclear"}</span>
      </div>
      <div class="pitch-spectrum" aria-hidden="true">
        <span class="pitch-spectrum-band male" style="--band-left: ${pitchHzToSpectrumPosition(85)}%; --band-right: ${pitchHzToSpectrumPosition(180)}%;"></span>
        <span class="pitch-spectrum-band shared" style="--band-left: ${pitchHzToSpectrumPosition(145)}%; --band-right: ${pitchHzToSpectrumPosition(185)}%;"></span>
        <span class="pitch-spectrum-band female" style="--band-left: ${pitchHzToSpectrumPosition(165)}%; --band-right: ${pitchHzToSpectrumPosition(255)}%;"></span>
        ${rangeHz ? `
          <span class="pitch-spectrum-range"></span>
          <span class="pitch-spectrum-median"></span>
        ` : ""}
      </div>
      <div class="pitch-spectrum-labels">
        <div>
          <strong>Male range</strong>
          <span>85-180 Hz</span>
        </div>
        <div>
          <strong>Androgynous overlap</strong>
          <span>145-185 Hz</span>
        </div>
        <div>
          <strong>Female range</strong>
          <span>165-255 Hz</span>
        </div>
      </div>
      <div class="pitch-map-values">
        <span>Low ${rangeHz ? `${rangeHz.low} Hz` : "--"}</span>
        <span>Average ${rangeHz ? `${rangeHz.median} Hz` : "--"}</span>
        <span>High ${rangeHz ? `${rangeHz.high} Hz` : "--"}</span>
      </div>
    </div>
    <div class="pitch-zone-summary">
      <strong>${pitchZone.label}</strong>
      <span>${pitchZone.note}</span>
    </div>
    <div class="pitch-range-card">
      <span>Pitch range</span>
      <strong>${formatValue(result.pitchRange, " semitones")}</strong>
      <small>This is how far your voice moved up and down during the take.</small>
    </div>
    <div class="detail-bars">
      <div class="detail-bar-row">
        <div>
          <strong>Pitch range</strong>
          <small>More filled means more up-and-down movement</small>
        </div>
        <div class="detail-bar" style="${barStyle(rangeFill)}"><span></span></div>
        <b>${formatValue(result.pitchRange, " st")}</b>
      </div>
      <div class="detail-bar-row">
        <div>
          <strong>Typical pitch</strong>
          <small>Rough middle of the spoken voice</small>
        </div>
        <div class="detail-bar" style="${barStyle(voiceZone)}"><span></span></div>
        <b>${pitchHz ? Math.round(pitchHz) : "--"} Hz</b>
      </div>
    </div>
  `;
}

function renderVolumeDetail(result) {
  return `
    <div class="detail-header">
      <h3>Volume detail</h3>
      <span>${formatValue(result.energySd, " dB")} contrast</span>
    </div>
    <div class="detail-bars">
      <div class="detail-bar-row">
        <div>
          <strong>Volume contrast</strong>
          <small>Difference between quieter and stronger moments</small>
        </div>
        <div class="detail-bar warm" style="${barStyle(linearScore(result.energySd, 0, 6))}"><span></span></div>
        <b>${formatValue(result.energySd, " dB")}</b>
      </div>
      <div class="detail-bar-row">
        <div>
          <strong>Full loudness range</strong>
          <small>Quiet-to-loud spread across the take</small>
        </div>
        <div class="detail-bar warm" style="${barStyle(linearScore(result.energyRange, 0, 18))}"><span></span></div>
        <b>${formatValue(result.energyRange, " dB")}</b>
      </div>
    </div>
  `;
}

function renderTempoDetail(result) {
  const speechPercent = result.speechRatio * 100;

  return `
    <div class="detail-header">
      <h3>Tempo detail</h3>
      <span>${Math.round(speechPercent)}% speaking</span>
    </div>
    <div class="speech-balance" style="${barStyle(speechPercent)}">
      <span>Pause</span>
      <span>Speech</span>
      <i></i>
    </div>
    <div class="detail-bars">
      <div class="detail-bar-row">
        <div>
          <strong>Speech balance</strong>
          <small>How much of the take contained voice</small>
        </div>
        <div class="detail-bar blue" style="${barStyle(speechPercent)}"><span></span></div>
        <b>${Math.round(speechPercent)}%</b>
      </div>
      <div class="detail-bar-row">
        <div>
          <strong>Average phrase length</strong>
          <small>Short phrases can feel lively; long ones need clear shape</small>
        </div>
        <div class="detail-bar blue" style="${barStyle(linearScore(result.averageSpeechRun, 0, 8))}"><span></span></div>
        <b>${formatValue(result.averageSpeechRun, " sec")}</b>
      </div>
    </div>
  `;
}

function renderPauseDetail(result) {
  return `
    <div class="detail-header">
      <h3>Pause detail</h3>
      <span>${result.strategicPauses} useful pauses</span>
    </div>
    <div class="detail-bars">
      <div class="detail-bar-row">
        <div>
          <strong>Pause rhythm</strong>
          <small>Useful pauses per minute</small>
        </div>
        <div class="detail-bar green" style="${barStyle(linearScore(result.pausesPerMinute, 0, 14))}"><span></span></div>
        <b>${formatValue(result.pausesPerMinute, "/min")}</b>
      </div>
      <div class="detail-bar-row">
        <div>
          <strong>Pause score</strong>
          <small>Best when pauses are present but not constant</small>
        </div>
        <div class="detail-bar green" style="${barStyle(result.pauseScore)}"><span></span></div>
        <b>${Math.round(result.pauseScore)}</b>
      </div>
    </div>
  `;
}

function renderEmphasisDetail(result) {
  return `
    <div class="detail-header">
      <h3>Emphasis detail</h3>
      <span>${result.emphasisPeaks} peaks</span>
    </div>
    <div class="detail-bars">
      <div class="detail-bar-row">
        <div>
          <strong>Emphasis peaks</strong>
          <small>Moments that stood out in volume or movement</small>
        </div>
        <div class="detail-bar warm" style="${barStyle(linearScore(result.emphasisPeaksPerMinute, 0, 22))}"><span></span></div>
        <b>${formatValue(result.emphasisPeaksPerMinute, "/min")}</b>
      </div>
      <div class="detail-bar-row">
        <div>
          <strong>Emphasis score</strong>
          <small>Best when key words pop out clearly</small>
        </div>
        <div class="detail-bar warm" style="${barStyle(result.emphasisScore)}"><span></span></div>
        <b>${Math.round(result.emphasisScore)}</b>
      </div>
    </div>
  `;
}

function renderClarityDetail(result) {
  const tracePercent = result.pitchTrackingRatio * 100;

  return `
    <div class="detail-header">
      <h3>Clarity detail</h3>
      <span>${Math.round(tracePercent)}% voice trace</span>
    </div>
    <div class="detail-bars">
      <div class="detail-bar-row">
        <div>
          <strong>Voice trace</strong>
          <small>How often the app could follow a stable voice signal</small>
        </div>
        <div class="detail-bar blue" style="${barStyle(tracePercent)}"><span></span></div>
        <b>${Math.round(tracePercent)}%</b>
      </div>
      <div class="detail-bar-row">
        <div>
          <strong>Clarity score</strong>
          <small>A signal-quality proxy, not a pronunciation test</small>
        </div>
        <div class="detail-bar blue" style="${barStyle(result.clarityScore)}"><span></span></div>
        <b>${Math.round(result.clarityScore)}</b>
      </div>
    </div>
  `;
}

function renderMetricDetail(metric = activeDetailMetric) {
  activeDetailMetric = metric;
  metricDetailButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.detailMetric === metric);
  });

  if (!metricDetailPanel) return;

  if (!latestAnalysisResult) {
    metricDetailPanel.innerHTML = `<div class="metric-detail-empty">Record a take, then open a metric to see the shape behind the score.</div>`;
    return;
  }

  const renderers = {
    pitch: renderPitchDetail,
    volume: renderVolumeDetail,
    tempo: renderTempoDetail,
    pauses: renderPauseDetail,
    emphasis: renderEmphasisDetail,
    clarity: renderClarityDetail
  };

  metricDetailPanel.innerHTML = renderers[metric]?.(latestAnalysisResult) || renderPitchDetail(latestAnalysisResult);
}

function describeColourScore(score) {
  if (score < 35) return `Low: ${Math.round(score)}%`;
  if (score < 65) return `Some: ${Math.round(score)}%`;
  return `Strong: ${Math.round(score)}%`;
}

function updateVocalColour(colour) {
  determinationMetric.textContent = describeColourScore(colour.determination);
  compassionMetric.textContent = describeColourScore(colour.compassion);
  enthusiasmMetric.textContent = describeColourScore(colour.enthusiasm);
  setQuality(determinationMetric, colour.determination);
  setQuality(compassionMetric, colour.compassion);
  setQuality(enthusiasmMetric, colour.enthusiasm);
  vocalColourText.textContent = colour.feedback;
}

function resetVocalColour(message = "This first version is a rule-based estimate. A trained model can be added later.") {
  determinationMetric.textContent = "Not trained";
  compassionMetric.textContent = "Not trained";
  enthusiasmMetric.textContent = "Not trained";
  vocalColourText.textContent = message;
  [determinationMetric, compassionMetric, enthusiasmMetric].forEach(element => setQuality(element, null));
}

function hasEnoughSpeech(result) {
  return result.speechRatio >= 0.12 && (result.pitchSamples >= 6 || result.energyRange >= 3);
}

function hasEnoughPraatSpeech(result) {
  const speechRatio = result.tempo?.speechRatio ?? 0;
  const pitchFrames = result.pitch?.trackedFrames ?? 0;
  const volumeRange = result.volume?.rangeDbP05P95 ?? 0;

  return speechRatio >= 0.12 && (pitchFrames >= 6 || volumeRange >= 3);
}

function showNoSpeechDetected() {
  scoreValue.textContent = "--";
  clearQualityColors();
  attentionLabel.textContent = "No speech detected";
  attentionMeter.style.width = "32%";
  setKidStates(["ready", "curious", "ready", "curious", "ready"]);
  energyMetric.textContent = "No speech detected";
  pitchMetric.textContent = "No speech detected";
  tempoMetric.textContent = "No speech detected";
  pauseMetric.textContent = "No speech detected";
  emphasisMetric.textContent = "No speech detected";
  clarityMetric.textContent = "No speech detected";
  resetVocalColour("No Vocal Colour score yet. I need enough audible speech first.");
  setMetricDetailEmpty("No detailed charts yet. I need enough audible speech first.");
  setRecordingNotice("I did not hear enough speech to score this take.", "warning");
  feedbackText.textContent = "This take did not contain enough audible speech. Try again with the microphone close enough and speak for at least 5 seconds.";
}

function buildVocalColourFromScores(scores) {
  const determination = clamp(
    scores.energy * 0.28 +
      scores.emphasis * 0.3 +
      scores.clarity * 0.18 +
      scores.tempo * 0.14 +
      scores.pause * 0.1,
    0,
    100
  );
  const compassion = clamp(
    scores.pause * 0.34 +
      (100 - Math.abs(scores.energy - 52)) * 0.24 +
      scores.clarity * 0.18 +
      (100 - Math.abs(scores.tempo - 58)) * 0.14 +
      (100 - Math.abs(scores.pitch - 48)) * 0.1,
    0,
    100
  );
  const enthusiasm = clamp(
    scores.pitch * 0.32 +
      scores.energy * 0.28 +
      scores.emphasis * 0.24 +
      scores.tempo * 0.1 +
      scores.clarity * 0.06,
    0,
    100
  );
  const colours = [
    ["determination", determination],
    ["compassion", compassion],
    ["enthusiasm", enthusiasm]
  ];
  const [dominantName, dominantScore] = [...colours].sort((a, b) => b[1] - a[1])[0];
  const label = dominantScore < 42 ? "not strongly coloured yet" : `mostly ${dominantName}`;
  const advice = dominantName === "determination"
    ? "To add compassion, slow slightly and soften one important phrase."
    : dominantName === "compassion"
      ? "To add determination, make one key word firmer and more deliberate."
      : "To add determination, land the final sentence with a steadier pace.";

  return {
    determination,
    compassion,
    enthusiasm,
    feedback: `Prototype only, not trained yet. Your vocal colour sounds ${label}. ${advice}`
  };
}

function vocalColourFromBrowserResult(result) {
  return buildVocalColourFromScores({
    pitch: result.pitchSamples < 8 ? 38 : result.pitchScore,
    energy: result.energyScore,
    tempo: result.tempoScore,
    pause: result.pauseScore,
    emphasis: result.emphasisScore,
    clarity: result.clarityScore
  });
}

function vocalColourFromPraatCoach(coach) {
  return buildVocalColourFromScores({
    pitch: coach.pitch.score,
    energy: coach.volume.score,
    tempo: coach.tempo.score,
    pause: coach.pauses.score,
    emphasis: coach.emphasis.score,
    clarity: coach.clarity.score
  });
}

function semitoneRangeFromHz(meanHz, rangeHz) {
  if (!meanHz || !rangeHz || rangeHz <= 0) return null;
  const low = meanHz - rangeHz / 2;
  const high = meanHz + rangeHz / 2;
  if (low <= 0 || high <= low) return null;
  return 12 * Math.log2(high / low);
}

function makeCoachMetric(score, lowLabel, midLabel, highLabel, advice) {
  return {
    score,
    label: score < 45 ? lowLabel : score < 72 ? midLabel : highLabel,
    advice
  };
}

function classifyPraatFeedback(result) {
  const pitchMean = result.pitch?.meanHz;
  const pitchRangeHz = result.pitch?.rangeHzP10P90;
  const pitchRangeSt = semitoneRangeFromHz(pitchMean, pitchRangeHz);
  const pitchFrames = result.pitch?.trackedFrames ?? 0;
  const volumeSd = result.volume?.sdDb;
  const volumeRange = result.volume?.rangeDbP05P95;
  const speechRatio = result.tempo?.speechRatio;
  const pauseCount = result.pauses?.count ?? 0;
  const pausesPerMinute = result.pauses?.perMinute ?? 0;
  const longPauseCount = result.pauses?.longPauseCount ?? 0;
  const peaksPerMinute = result.emphasis?.peaksPerMinute ?? 0;
  const clarityRatio = result.clarity?.pitchTrackingRatio;

  const pitch = !pitchRangeSt || pitchFrames < 8
    ? makeCoachMetric(38, "Pitch unclear", "Pitch unclear", "Pitch unclear", "speak a little longer and keep the microphone steady")
    : makeCoachMetric(
        pitchRangeSt < 3.5 ? 32 : pitchRangeSt < 7 ? 64 : pitchRangeSt < 13 ? 88 : 74,
        "Low pitch variety",
        "Some pitch variety",
        pitchRangeSt < 13 ? "Good pitch variety" : "Very animated pitch",
        "let important words rise or fall more clearly"
      );

  const volume = volumeSd == null || volumeRange == null
    ? makeCoachMetric(38, "Volume unclear", "Volume unclear", "Volume unclear", "keep a steady distance from the microphone")
    : makeCoachMetric(
        volumeSd < 2 || volumeRange < 5 ? 34 : volumeSd < 4.5 || volumeRange < 10 ? 66 : volumeRange < 18 ? 86 : 76,
        "Low volume contrast",
        "Some volume contrast",
        volumeRange < 18 ? "Good volume contrast" : "Very strong volume contrast",
        "make key words a little stronger and less important words lighter"
      );

  const tempo = speechRatio == null
    ? makeCoachMetric(38, "Pace unclear", "Pace unclear", "Pace unclear", "speak a little longer")
    : makeCoachMetric(
        speechRatio < 0.45 ? 46 : speechRatio > 0.93 ? 42 : speechRatio > 0.88 ? 62 : 82,
        speechRatio < 0.45 ? "Flow has many gaps" : "Rushed pace",
        "Mostly steady pace",
        "Good pace variety",
        speechRatio > 0.88
          ? "slow down around important ideas"
          : "change pace between setup, contrast, and conclusion"
      );

  let pauseScore = 34;
  let pauseLabel = "Needs clearer pauses";
  if (longPauseCount > 0) {
    pauseScore = 48;
    pauseLabel = "One pause may be too long";
  } else if (pauseCount > 0 && pausesPerMinute <= 12) {
    pauseScore = 84;
    pauseLabel = "Good pause shape";
  } else if (pauseCount > 0 && pausesPerMinute <= 18) {
    pauseScore = 64;
    pauseLabel = "Many short pauses";
  } else if (pauseCount > 0) {
    pauseScore = 46;
    pauseLabel = "Too many pauses";
  }
  const pauses = makeCoachMetric(
    pauseScore,
    pauseLabel,
    pauseLabel,
    pauseLabel,
    "add one clean pause before or after an important sentence"
  );

  const emphasis = makeCoachMetric(
    peaksPerMinute < 4 ? 34 : peaksPerMinute < 18 ? 84 : 68,
    "Few emphasized moments",
    peaksPerMinute < 18 ? "Clear emphasis" : "Very frequent emphasis",
    peaksPerMinute < 18 ? "Clear emphasis" : "Very frequent emphasis",
    "choose two or three key words to land more strongly"
  );

  const clarity = clarityRatio == null
    ? makeCoachMetric(38, "Signal unclear", "Signal unclear", "Signal unclear", "move slightly closer to the microphone")
    : makeCoachMetric(
        clarityRatio < 0.2 ? 36 : clarityRatio < 0.55 ? 64 : 86,
        "Voice signal unclear",
        "Voice signal usable",
        "Voice signal clear",
        "speak cleanly and keep a stable microphone position"
      );

  const overall = Math.round(clamp(
    pitch.score * 0.3 +
      volume.score * 0.22 +
      tempo.score * 0.18 +
      pauses.score * 0.14 +
      emphasis.score * 0.12 +
      clarity.score * 0.04,
    0,
    100
  ));
  const summary = overall < 45
    ? "Low voice variety"
    : overall < 72
      ? "Some voice variety"
      : "Good voice variety";
  const areas = [
    ["pitch", pitch],
    ["volume", volume],
    ["tempo", tempo],
    ["pauses", pauses],
    ["emphasis", emphasis],
    ["clarity", clarity]
  ];
  const [focusName, focus] = [...areas].sort((a, b) => a[1].score - b[1].score)[0];
  const strengths = areas
    .filter(([, area]) => area.score >= 72)
    .map(([name]) => name)
    .filter(name => name !== "clarity");
  const strengthText = strengths.length
    ? `Strongest area: ${strengths.slice(0, 2).join(" and ")}.`
    : "No strong contrast yet.";

  return {
    score: overall,
    summary,
    pitch,
    volume,
    tempo,
    pauses,
    emphasis,
    clarity,
    feedback: `${summary}. ${strengthText} Next, work on ${focusName}: ${focus.advice}.`
  };
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
  resetAudienceTracking();
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
    return "Safari cannot record from the file version. Start the local web server and open http://127.0.0.1:5173/index.html.";
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return "This browser cannot access the microphone from this page. Try http://127.0.0.1:5173/index.html in Chrome or Safari.";
  }

  if (!window.MediaRecorder) {
    return "This browser can access the microphone but cannot record audio here. Try a newer Safari or Chrome.";
  }

  if (!getAudioContextConstructor()) {
    return "This browser cannot analyze microphone audio here. Try a newer Safari or Chrome.";
  }

  return "";
}

function getAudioContextConstructor() {
  return window.AudioContext || window.webkitAudioContext;
}

function getSelectedAudioConstraint() {
  return selectedMicrophoneId
    ? { deviceId: { exact: selectedMicrophoneId } }
    : true;
}

async function getMicrophoneStream() {
  try {
    return await navigator.mediaDevices.getUserMedia({ audio: getSelectedAudioConstraint() });
  } catch (error) {
    if (!selectedMicrophoneId || !["NotFoundError", "OverconstrainedError"].includes(error.name)) {
      throw error;
    }

    selectedMicrophoneId = "";
    if (microphoneSelect) microphoneSelect.value = "";
    setRecordingNotice("Selected microphone was not available, so I switched back to the default input.", "warning");
    return navigator.mediaDevices.getUserMedia({ audio: true });
  }
}

async function refreshMicrophoneInputs() {
  if (!navigator.mediaDevices?.enumerateDevices || !microphoneSelect) return;

  let microphones = [];
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    microphones = devices.filter(device => device.kind === "audioinput");
  } catch (error) {
    return;
  }

  const previousSelection = selectedMicrophoneId;
  microphoneSelect.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Default microphone";
  microphoneSelect.append(defaultOption);

  microphones.forEach((device, index) => {
    const option = document.createElement("option");
    option.value = device.deviceId;
    option.textContent = device.label || `Microphone ${index + 1}`;
    microphoneSelect.append(option);
  });

  const hasPreviousSelection = microphones.some(device => device.deviceId === previousSelection);
  selectedMicrophoneId = hasPreviousSelection ? previousSelection : "";
  microphoneSelect.value = selectedMicrophoneId;
}

function canUseLocalPraat() {
  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
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

function encodeWav(audioBuffer) {
  const channelCount = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const samples = audioBuffer.length;
  const bytesPerSample = 2;
  const blockAlign = channelCount * bytesPerSample;
  const buffer = new ArrayBuffer(44 + samples * blockAlign);
  const view = new DataView(buffer);
  let offset = 0;

  function writeString(value) {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset, value.charCodeAt(index));
      offset += 1;
    }
  }

  writeString("RIFF");
  view.setUint32(offset, 36 + samples * blockAlign, true);
  offset += 4;
  writeString("WAVE");
  writeString("fmt ");
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, channelCount, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, sampleRate * blockAlign, true);
  offset += 4;
  view.setUint16(offset, blockAlign, true);
  offset += 2;
  view.setUint16(offset, bytesPerSample * 8, true);
  offset += 2;
  writeString("data");
  view.setUint32(offset, samples * blockAlign, true);
  offset += 4;

  const channels = Array.from({ length: channelCount }, (_, index) => audioBuffer.getChannelData(index));
  for (let sampleIndex = 0; sampleIndex < samples; sampleIndex += 1) {
    for (let channelIndex = 0; channelIndex < channelCount; channelIndex += 1) {
      const sample = clamp(channels[channelIndex][sampleIndex], -1, 1);
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: "audio/wav" });
}

function encodePcmWav(floatSamples, sampleRate) {
  const bytesPerSample = 2;
  const buffer = new ArrayBuffer(44 + floatSamples.length * bytesPerSample);
  const view = new DataView(buffer);
  let offset = 0;

  function writeString(value) {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset, value.charCodeAt(index));
      offset += 1;
    }
  }

  writeString("RIFF");
  view.setUint32(offset, 36 + floatSamples.length * bytesPerSample, true);
  offset += 4;
  writeString("WAVE");
  writeString("fmt ");
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, sampleRate * bytesPerSample, true);
  offset += 4;
  view.setUint16(offset, bytesPerSample, true);
  offset += 2;
  view.setUint16(offset, bytesPerSample * 8, true);
  offset += 2;
  writeString("data");
  view.setUint32(offset, floatSamples.length * bytesPerSample, true);
  offset += 4;

  floatSamples.forEach(value => {
    const sample = clamp(value, -1, 1);
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  });

  return new Blob([buffer], { type: "audio/wav" });
}

async function convertRecordingToWav(recordingBlob) {
  if (recordingPcmSampleCount > 0 && recordingPcmSampleRate > 0) {
    return encodePcmWav(getRecordingPcm(), recordingPcmSampleRate);
  }

  const arrayBuffer = await recordingBlob.arrayBuffer();
  const AudioContextConstructor = getAudioContextConstructor();
  const decodeContext = new AudioContextConstructor();

  try {
    const audioBuffer = await decodeContext.decodeAudioData(arrayBuffer.slice(0));
    return encodeWav(audioBuffer);
  } finally {
    await decodeContext.close();
  }
}

function applyPraatAnalysis(result, options = {}) {
  if (!result?.ok) return;

  if (!hasEnoughPraatSpeech(result)) {
    if (!options.live && !options.finalTechnical) showNoSpeechDetected();
    return;
  }

  const coach = classifyPraatFeedback(result);

  if (options.finalTechnical) {
    setRecordingNotice("Praat technical check complete. Overall score uses average audience attention across the take.", "success");
    return;
  }

  const displayScore = options.live && audienceAttentionHistory.length
    ? Math.round(audienceAttention)
    : coach.score;
  scoreValue.textContent = displayScore;
  setScoreVisual(displayScore);
  if (!options.live) updateAudience(coach.score);
  pitchMetric.textContent = coach.pitch.label;
  energyMetric.textContent = coach.volume.label;
  tempoMetric.textContent = coach.tempo.label;
  pauseMetric.textContent = coach.pauses.label;
  emphasisMetric.textContent = coach.emphasis.label;
  clarityMetric.textContent = coach.clarity.label;
  setQuality(pitchMetric, coach.pitch.score);
  setQuality(energyMetric, coach.volume.score);
  setQuality(tempoMetric, coach.tempo.score);
  setQuality(pauseMetric, coach.pauses.score);
  setQuality(emphasisMetric, coach.emphasis.score);
  setQuality(clarityMetric, coach.clarity.score);
  updateVocalColour(vocalColourFromPraatCoach(coach));
  feedbackText.textContent = coach.feedback;
  setRecordingNotice(
    options.live
      ? "Recording. Praat checked the latest speech section."
      : "Praat analysis complete. Playback is ready below.",
    options.live ? "active" : "success"
  );
}

async function sendWavToPraat(wavBlob) {
  let response;
  try {
    response = await fetch(PRAAT_ANALYZE_URL, {
      method: "POST",
      headers: { "Content-Type": "audio/wav" },
      body: wavBlob
    });
  } catch (error) {
    throw new Error("Start the local Praat backend, then try again.");
  }

  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Praat analysis failed");
  }

  return result;
}

async function analyzeWithPraat(recordingBlob) {
  if (!canUseLocalPraat()) {
    setRecordingNotice("Browser analysis complete. Playback is ready below.", "success");
    return;
  }

  try {
    setRecordingNotice("Recording complete. Running local Praat analysis...", "active");
    const wavBlob = await convertRecordingToWav(recordingBlob);
    const result = await sendWavToPraat(wavBlob);
    applyPraatAnalysis(result, { finalTechnical: true });
  } catch (error) {
    setRecordingNotice(
      "Browser analysis complete. Optional Praat check is off; start the local Praat backend only if you want the extra technical check.",
      "success"
    );
  }
}

function isRecordingActive() {
  return mediaRecorder && mediaRecorder.state === "recording";
}

function resetLivePraatBuffers() {
  livePcmChunks = [];
  livePcmSampleCount = 0;
  livePcmTotalSamples = 0;
  recordingPcmChunks = [];
  recordingPcmSampleCount = 0;
  recordingPcmSampleRate = 0;
  isLivePraatAnalyzing = false;
}

function trimLivePcmBuffer() {
  if (!audioContext) return;
  const maximumSamples = Math.ceil(audioContext.sampleRate * PRAAT_LIVE_WINDOW_SECONDS);

  while (livePcmChunks.length > 1 && livePcmSampleCount - livePcmChunks[0].length > maximumSamples) {
    livePcmSampleCount -= livePcmChunks.shift().length;
  }
}

function appendLivePcm(inputBuffer) {
  const incoming = inputBuffer.getChannelData(0);
  const copy = new Float32Array(incoming.length);
  copy.set(incoming);
  livePcmChunks.push(copy);
  livePcmSampleCount += copy.length;
  livePcmTotalSamples += copy.length;
  recordingPcmChunks.push(copy);
  recordingPcmSampleCount += copy.length;
  recordingPcmSampleRate = audioContext?.sampleRate || inputBuffer.sampleRate || recordingPcmSampleRate;
  trimLivePcmBuffer();
}

function getRecordingPcm() {
  const result = new Float32Array(recordingPcmSampleCount);
  let offset = 0;

  recordingPcmChunks.forEach(chunk => {
    result.set(chunk, offset);
    offset += chunk.length;
  });

  return result;
}

function getRecentLivePcm() {
  if (!audioContext) return new Float32Array();

  const neededSamples = Math.min(
    livePcmSampleCount,
    Math.ceil(audioContext.sampleRate * PRAAT_LIVE_WINDOW_SECONDS)
  );
  const result = new Float32Array(neededSamples);
  let writeIndex = neededSamples;

  for (let chunkIndex = livePcmChunks.length - 1; chunkIndex >= 0 && writeIndex > 0; chunkIndex -= 1) {
    const chunk = livePcmChunks[chunkIndex];
    const amount = Math.min(chunk.length, writeIndex);
    writeIndex -= amount;
    result.set(chunk.slice(chunk.length - amount), writeIndex);
  }

  return result;
}

async function analyzeLiveWithPraat() {
  if (!isRecordingActive() || isLivePraatAnalyzing || !audioContext) return;

  const minimumSamples = audioContext.sampleRate * MIN_FEEDBACK_SECONDS;
  if (livePcmTotalSamples < minimumSamples || livePcmSampleCount < minimumSamples) return;

  isLivePraatAnalyzing = true;
  try {
    setRecordingNotice("Recording. Praat is checking the latest speech section...", "active");
    const recentSamples = getRecentLivePcm();
    const wavBlob = encodePcmWav(recentSamples, audioContext.sampleRate);
    const result = await sendWavToPraat(wavBlob);

    if (isRecordingActive()) {
      applyPraatAnalysis(result, { live: true });
    }
  } catch (error) {
    if (isRecordingActive()) {
      setRecordingNotice("Recording. Browser feedback is shown; the optional Praat helper is off.", "active");
    }
  } finally {
    isLivePraatAnalyzing = false;
  }
}

function startLivePraatAnalysis() {
  if (!canUseLocalPraat()) return;

  resetLivePraatBuffers();

  if (!audioContext || typeof audioContext.createScriptProcessor !== "function") return;

  liveAudioProcessor = audioContext.createScriptProcessor(4096, 1, 1);
  liveMonitorGain = audioContext.createGain();
  liveMonitorGain.gain.value = 0;
  liveAudioProcessor.onaudioprocess = event => appendLivePcm(event.inputBuffer);
  source.connect(liveAudioProcessor);
  liveAudioProcessor.connect(liveMonitorGain);
  liveMonitorGain.connect(audioContext.destination);

  clearInterval(livePraatInterval);
  livePraatInterval = setInterval(analyzeLiveWithPraat, PRAAT_LIVE_INTERVAL_SECONDS * 1000);
}

function stopLivePraatAnalysis() {
  clearInterval(livePraatInterval);
  livePraatInterval = null;

  if (liveAudioProcessor) {
    liveAudioProcessor.onaudioprocess = null;
    try {
      liveAudioProcessor.disconnect();
    } catch (error) {
      // The audio node may already be disconnected when recording stops.
    }
  }

  if (liveMonitorGain) {
    try {
      liveMonitorGain.disconnect();
    } catch (error) {
      // The audio node may already be disconnected when recording stops.
    }
  }

  liveAudioProcessor = null;
  liveMonitorGain = null;
}

function updateAudience(score) {
  const attention = clamp(Math.round(score), 0, 100);
  attentionMeter.style.width = `${attention}%`;
  const isOnlineAudience = getEffectiveAudienceType() === "online";

  if (attention < 28) {
    attentionLabel.textContent = "Attention slipping";
    setKidStates(isOnlineAudience
      ? ["distracted", "distracted", "unsure", "distracted", "distracted", "unsure", "distracted", "distracted", "unsure", "distracted"]
      : ["distracted", "unsure", "distracted", "distracted", "unsure"]);
  } else if (attention < 52) {
    attentionLabel.textContent = "Trying to follow";
    setKidStates(isOnlineAudience
      ? ["unsure", "curious", "unsure", "distracted", "curious", "unsure", "curious", "distracted", "unsure", "curious"]
      : ["unsure", "curious", "unsure", "distracted", "curious"]);
  } else if (attention < 76) {
    attentionLabel.textContent = "Listening";
    setKidStates(isOnlineAudience
      ? ["focused", "curious", "focused", "curious", "focused", "curious", "focused", "focused", "curious", "focused"]
      : ["focused", "curious", "focused", "curious", "focused"]);
  } else {
    attentionLabel.textContent = "Fully engaged";
    setKidStates(isOnlineAudience
      ? ["delighted", "focused", "delighted", "focused", "delighted", "focused", "delighted", "delighted", "focused", "delighted"]
      : ["delighted", "focused", "delighted", "focused", "delighted"]);
  }
}

function resetAudienceTracking() {
  audienceAttention = AUDIENCE_START_ATTENTION;
  audienceAttentionHistory = [];
  audienceMomentScores = [];
  audienceAnalysisHistory = [];
  lastAudienceUpdateAt = 0;
}

function getRecentProsodyResult(windowSeconds = PRAAT_LIVE_WINDOW_SECONDS, elapsedSeconds = getElapsedSeconds()) {
  const elapsed = Math.max(1, elapsedSeconds);
  const windowDuration = Math.min(windowSeconds, elapsed);
  const rmsFramesPerSecond = samples.length / elapsed;
  const pitchFramesPerSecond = pitchReadings.length / elapsed;
  const recentRmsCount = Math.max(1, Math.round(rmsFramesPerSecond * windowDuration));
  const recentPitchCount = Math.max(1, Math.round(pitchFramesPerSecond * windowDuration));

  return analyzeProsody(
    samples.slice(-recentRmsCount),
    pitchReadings.slice(-recentPitchCount),
    windowDuration
  );
}

function updateAudienceOverTime(result) {
  const momentScore = clamp(result.score, 0, 100);
  const memoryWeight = isSuperheroAudience() ? 0.38 : AUDIENCE_MEMORY_WEIGHT;
  audienceAttention = clamp(
    audienceAttention * memoryWeight + momentScore * (1 - memoryWeight),
    0,
    100
  );
  audienceAttentionHistory.push(audienceAttention);
  audienceMomentScores.push(momentScore);
  audienceAnalysisHistory.push(result);
  updateAudience(audienceAttention);
}

function averageResultValue(results, property, fallback) {
  const values = results
    .map(result => result[property])
    .filter(value => Number.isFinite(value));

  return values.length ? mean(values) : fallback[property];
}

function sumResultValue(results, property, fallback) {
  const values = results
    .map(result => result[property])
    .filter(value => Number.isFinite(value));

  return values.length
    ? values.reduce((total, value) => total + value, 0)
    : fallback[property];
}

function buildFinalAudienceResult(fallbackResult) {
  const usableResults = audienceAnalysisHistory.filter(hasEnoughSpeech);
  if (!usableResults.length || !audienceAttentionHistory.length) return fallbackResult;

  const finalScore = Math.round(mean(audienceAttentionHistory));

  return {
    ...fallbackResult,
    score: finalScore,
    pitchScore: averageResultValue(usableResults, "pitchScore", fallbackResult),
    energyScore: averageResultValue(usableResults, "energyScore", fallbackResult),
    pacingScore: averageResultValue(usableResults, "pacingScore", fallbackResult),
    pitchSd: averageResultValue(usableResults, "pitchSd", fallbackResult),
    pitchRange: averageResultValue(usableResults, "pitchRange", fallbackResult),
    pitchMedianHz: averageResultValue(usableResults, "pitchMedianHz", fallbackResult),
    pitchLowHz: averageResultValue(usableResults, "pitchLowHz", fallbackResult),
    pitchHighHz: averageResultValue(usableResults, "pitchHighHz", fallbackResult),
    energySd: averageResultValue(usableResults, "energySd", fallbackResult),
    energyRange: averageResultValue(usableResults, "energyRange", fallbackResult),
    speechRatio: averageResultValue(usableResults, "speechRatio", fallbackResult),
    pitchSamples: Math.round(sumResultValue(usableResults, "pitchSamples", fallbackResult)),
    tempoScore: averageResultValue(usableResults, "tempoScore", fallbackResult),
    pauseScore: averageResultValue(usableResults, "pauseScore", fallbackResult),
    emphasisScore: averageResultValue(usableResults, "emphasisScore", fallbackResult),
    clarityScore: averageResultValue(usableResults, "clarityScore", fallbackResult),
    averageSpeechRun: averageResultValue(usableResults, "averageSpeechRun", fallbackResult),
    emphasisPeaks: Math.round(sumResultValue(usableResults, "emphasisPeaks", fallbackResult)),
    emphasisPeaksPerMinute: averageResultValue(usableResults, "emphasisPeaksPerMinute", fallbackResult),
    pitchTrackingRatio: averageResultValue(usableResults, "pitchTrackingRatio", fallbackResult),
    strategicPauses: Math.round(sumResultValue(usableResults, "strategicPauses", fallbackResult)),
    pausesPerMinute: averageResultValue(usableResults, "pausesPerMinute", fallbackResult),
    audienceMoments: usableResults.length,
    rawBestMoment: Math.round(Math.max(...audienceMomentScores)),
    rawAverageMoment: Math.round(mean(audienceMomentScores))
  };
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
  const pitchHzValues = cleanPitchHzReadings(pitches);
  const pitchMedianHz = averagePitchHz(pitches);
  const pitchLowHz = pitchHzValues.length ? percentile(pitchHzValues, 0.1) : 0;
  const pitchHighHz = pitchHzValues.length ? percentile(pitchHzValues, 0.9) : 0;
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
    pitchMedianHz,
    pitchLowHz,
    pitchHighHz,
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
  const result = getRecentProsodyResult();
  return hasEnoughSpeech(result) ? result : null;
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
    } else if (elapsedSeconds - lastAudienceUpdateAt >= AUDIENCE_UPDATE_SECONDS) {
      lastAudienceUpdateAt = elapsedSeconds;
      const liveResult = scoreLiveAudience();
      if (liveResult == null) {
        attentionLabel.textContent = "Waiting for speech";
        attentionMeter.style.width = "36%";
        setKidStates(["ready", "curious", "ready", "curious", "ready"]);
      } else {
        updateAudienceOverTime(liveResult);
      }
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
    clearQualityColors();
    attentionLabel.textContent = "Too short to judge";
    attentionMeter.style.width = "42%";
    setKidStates(["ready", "curious", "ready", "curious", "ready"]);
    energyMetric.textContent = "Need 5 seconds";
    pitchMetric.textContent = "Need 5 seconds";
    tempoMetric.textContent = "Need 5 seconds";
    pauseMetric.textContent = "Need 5 seconds";
    emphasisMetric.textContent = "Need 5 seconds";
    clarityMetric.textContent = "Need 5 seconds";
    resetVocalColour("Vocal Colour also needs at least 5 seconds of speech.");
    setMetricDetailEmpty("Detailed charts need at least 5 seconds of speech.");
    setRecordingNotice("That take was under 5 seconds, so I did not score voice variety yet.", "warning");
    feedbackText.textContent = "This take was too short to judge voice variety fairly. Try speaking for at least 5 seconds so the audience can hear a real pattern.";
    return;
  }

  const wholeResult = analyzeProsody(samples, pitchReadings, duration);

  if (!hasEnoughSpeech(wholeResult)) {
    showNoSpeechDetected();
    return;
  }

  if (!audienceAnalysisHistory.length) {
    const recentResult = getRecentProsodyResult(PRAAT_LIVE_WINDOW_SECONDS, duration);
    if (hasEnoughSpeech(recentResult)) updateAudienceOverTime(recentResult);
  }

  const result = buildFinalAudienceResult(wholeResult);
  latestAnalysisResult = result;
  renderMetricDetail(activeDetailMetric);

  scoreValue.textContent = result.score;
  setScoreVisual(result.score);
  updateAudience(result.score);
  setQuality(energyMetric, result.energyScore);
  energyMetric.textContent = describeMetric(
    result.energyScore,
    "Low",
    "Some contrast",
    "Strong contrast",
    `${result.energySd.toFixed(1)} dB SD`
  );
  setQuality(pitchMetric, result.pitchSamples < 8 ? 38 : result.pitchScore);
  pitchMetric.textContent = result.pitchSamples < 8
    ? "Pitch unclear"
    : describeMetric(
        result.pitchScore,
        "Mostly flat",
        "Some melody",
        "Expressive",
        `${result.pitchRange.toFixed(1)} st range`
      );
  setQuality(tempoMetric, result.tempoScore);
  tempoMetric.textContent = describeMetric(
    result.tempoScore,
    "Uneven flow",
    "Moderate flow",
    "Steady flow",
    result.audienceMoments
      ? `${Math.round(result.speechRatio * 100)}% speech average`
      : `${Math.round(result.speechRatio * 100)}% speech`
  );
  setQuality(pauseMetric, result.pauseScore);
  pauseMetric.textContent = describeMetric(
    result.pauseScore,
    "Needs clearer pauses",
    "Some pause shape",
    "Good pause shape",
    result.audienceMoments
      ? `${result.pausesPerMinute.toFixed(1)}/min average`
      : `${result.strategicPauses} pauses, ${result.pausesPerMinute.toFixed(1)}/min`
  );
  setQuality(emphasisMetric, result.emphasisScore);
  emphasisMetric.textContent = describeMetric(
    result.emphasisScore,
    "Few peaks",
    "Some emphasis",
    "Clear emphasis",
    result.audienceMoments
      ? `${result.emphasisPeaksPerMinute.toFixed(1)}/min average`
      : `${result.emphasisPeaks} peaks`
  );
  setQuality(clarityMetric, result.clarityScore);
  clarityMetric.textContent = describeMetric(
    result.clarityScore,
    "Signal unclear",
    "Usable",
    "Clear signal",
    `${Math.round(result.pitchTrackingRatio * 100)}% voice trace`
  );
  updateVocalColour(vocalColourFromBrowserResult(result));

  if (result.score >= 78) {
    feedbackText.textContent = "On average, the audience stayed with you. Keep the shape, and now practice making the most important sentence even more deliberate.";
  } else if (result.pitchScore < 45 && result.energyScore < 45) {
    feedbackText.textContent = "Across the take, this sounded fairly monotone: both pitch and volume stayed narrow. Try choosing three key words and lifting either the pitch or volume on each one.";
  } else if (result.pitchScore < 45) {
    feedbackText.textContent = "Across the take, the pitch stayed in a narrow band. Try adding a clearer rise, fall, or peak on the most important phrase.";
  } else if (result.energyScore < 45) {
    feedbackText.textContent = "Across the take, the volume stayed too even. Try making important words stronger and less important words lighter.";
  } else if (result.pacingScore < 45) {
    feedbackText.textContent = "Across the take, the pacing needs more shape. Add one clean pause before an important idea and another after it lands.";
  } else {
    feedbackText.textContent = "There is some variety, but the average audience reaction still has room to grow. Try a second take with steady contrast throughout, not only at the end.";
  }
}

async function startRecording() {
  const microphoneIssue = getMicrophoneIssue();
  if (microphoneIssue) {
    throw new Error(microphoneIssue);
  }

  stream = await getMicrophoneStream();
  await refreshMicrophoneInputs();
  const AudioContextConstructor = getAudioContextConstructor();
  audioContext = new AudioContextConstructor();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);
  startLivePraatAnalysis();

  chunks = [];
  recordedMimeType = "";
  samples = [];
  pitchReadings = [];
  speakingFrames = 0;
  quietFrames = 0;
  liveFrame = 0;
  setMetricDetailEmpty("Recording now. The detailed charts will appear after this take.");
  resetAudienceTracking();
  if (audioUrl) URL.revokeObjectURL(audioUrl);
  audioUrl = "";
  playbackAudio.removeAttribute("src");
  playbackAudio.classList.remove("ready");
  playbackAudio.load();
  clearQualityColors();
  resetVocalColour("Listening first. Vocal Colour will update after a few seconds.");
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
  microphoneSelect.disabled = true;
  playButton.disabled = true;
  setRecordingNotice("Recording. The audience will listen first, then average its attention over time.", "active");
  feedbackText.textContent = currentMode === "own"
    ? "Speak freely. After 5 seconds, the audience will react gradually and the final score will reflect the whole take."
    : "The audience is listening first. After 5 seconds, they will react gradually and the final score will reflect the whole take.";
  updateListeningPeriod(0);
}

function finishRecording() {
  clearInterval(timerInterval);
  cancelAnimationFrame(animationFrame);
  stopLivePraatAnalysis();
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
  microphoneSelect.disabled = false;
  setRecordingNotice("Recording complete. Play it back or try another take.", "success");
  analyzeRecording();
  analyzeWithPraat(blob);
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
    microphoneSelect.disabled = false;
    setRecordingNotice(message, "warning");
    feedbackText.textContent = message;
    stopLivePraatAnalysis();
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
fontSizeInputs.forEach(input => {
  input.addEventListener("change", () => {
    if (input.checked) setReadingSize(input.value);
  });
});
ownTextInput.addEventListener("input", () => {
  if (currentMode === "own") renderOwnText();
});
scrollModeInputs.forEach(input => {
  input.addEventListener("change", () => {
    if (input.checked) setScrollMode(input.value);
  });
});
audienceTypeInputs.forEach(input => {
  input.addEventListener("change", () => {
    if (input.checked) setAudienceType(input.value);
  });
});
metricDetailButtons.forEach(button => {
  button.addEventListener("click", () => renderMetricDetail(button.dataset.detailMetric));
});
recordButton.addEventListener("click", toggleRecording);
playButton.addEventListener("click", playRecording);
microphoneSelect.addEventListener("change", () => {
  selectedMicrophoneId = microphoneSelect.value;
});

if (navigator.mediaDevices?.addEventListener) {
  navigator.mediaDevices.addEventListener("devicechange", refreshMicrophoneInputs);
}

setReadingSize("large");
setScrollMode("auto");
setAudienceType("duo");
setMode("story");
drawIdleWave();
refreshMicrophoneInputs();

const firstMicrophoneIssue = getMicrophoneIssue();
if (firstMicrophoneIssue) {
  setRecordingNotice(firstMicrophoneIssue, "warning");
} else {
  setRecordingNotice("Ready. Press Start Recording and allow microphone access.", "active");
}
