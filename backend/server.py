#!/usr/bin/env python3
from __future__ import annotations

import json
import math
import tempfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from statistics import mean, pstdev
from urllib.parse import urlparse


HOST = "127.0.0.1"
PORT = 8000


def safe_number(value: float | int | None, digits: int = 2) -> float | None:
    if value is None:
        return None
    if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
        return None
    return round(float(value), digits)


def percentile(values: list[float], amount: float) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    index = (len(ordered) - 1) * amount
    lower = math.floor(index)
    upper = math.ceil(index)
    weight = index - lower
    return ordered[lower] * (1 - weight) + ordered[upper] * weight


def runs(flags: list[bool], target: bool, frame_duration: float) -> list[float]:
    result: list[float] = []
    start: int | None = None

    for index, flag in enumerate(flags):
        if flag == target and start is None:
            start = index

        if (flag != target or index == len(flags) - 1) and start is not None:
            end = index + 1 if flag == target and index == len(flags) - 1 else index
            result.append((end - start) * frame_duration)
            start = None

    return result


def analyze_with_praat(path: Path) -> dict:
    try:
        import parselmouth
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "Parselmouth is not installed yet. Run: python3 -m pip install praat-parselmouth"
        ) from exc

    sound = parselmouth.Sound(str(path))
    duration = sound.get_total_duration()

    pitch = sound.to_pitch(time_step=0.01, pitch_floor=70, pitch_ceiling=450)
    pitch_values = [
        pitch.get_value_at_time(time)
        for time in [pitch.xmin + index * pitch.dx for index in range(pitch.nx)]
    ]
    f0_values = [value for value in pitch_values if value and not math.isnan(value)]

    intensity = sound.to_intensity(time_step=0.01, minimum_pitch=70)
    intensity_values = [
        intensity.get_value(time)
        for time in [intensity.xmin + index * intensity.dx for index in range(intensity.nx)]
    ]
    db_values = [value for value in intensity_values if value and not math.isnan(value)]

    db_floor = percentile(db_values, 0.12) or 0
    db_top = percentile(db_values, 0.95) or db_floor
    speech_threshold = db_floor + (db_top - db_floor) * 0.25
    speech_flags = [value > speech_threshold for value in db_values]
    speech_db_values = [
        value for value, is_speech in zip(db_values, speech_flags) if is_speech
    ]
    frame_duration = duration / max(1, len(speech_flags))
    pause_durations = runs(speech_flags, False, frame_duration)
    strategic_pauses = [pause for pause in pause_durations if 0.35 <= pause <= 2.4]
    long_pauses = [pause for pause in pause_durations if pause > 2.4]

    db_mean = mean(speech_db_values) if speech_db_values else None
    db_sd = pstdev(speech_db_values) if len(speech_db_values) > 1 else None
    f0_mean = mean(f0_values) if f0_values else None
    f0_sd = pstdev(f0_values) if len(f0_values) > 1 else None
    f0_p10 = percentile(f0_values, 0.1)
    f0_p90 = percentile(f0_values, 0.9)
    f0_range = (f0_p90 - f0_p10) if f0_p10 is not None and f0_p90 is not None else None
    db_p05 = percentile(speech_db_values, 0.05)
    db_p95 = percentile(speech_db_values, 0.95)
    db_range = (db_p95 - db_p05) if db_p05 is not None and db_p95 is not None else None
    speech_ratio = sum(speech_flags) / max(1, len(speech_flags))

    emphasis_threshold = (db_mean or 0) + (db_sd or 0) * 0.85
    emphasis_peaks = 0
    last_peak = -100
    min_peak_gap = max(1, round(0.35 / max(frame_duration, 0.01)))
    for index, value in enumerate(db_values):
        previous_value = db_values[index - 1] if index else value
        next_value = db_values[index + 1] if index + 1 < len(db_values) else value
        if (
            value > emphasis_threshold
            and value >= previous_value
            and value >= next_value
            and index - last_peak >= min_peak_gap
        ):
            emphasis_peaks += 1
            last_peak = index

    return {
        "ok": True,
        "engine": "Praat/Parselmouth",
        "durationSeconds": safe_number(duration),
        "pitch": {
            "meanHz": safe_number(f0_mean),
            "sdHz": safe_number(f0_sd),
            "rangeHzP10P90": safe_number(f0_range),
            "trackedFrames": len(f0_values),
        },
        "volume": {
            "meanDb": safe_number(db_mean),
            "sdDb": safe_number(db_sd),
            "rangeDbP05P95": safe_number(db_range),
        },
        "tempo": {
            "speechRatio": safe_number(speech_ratio),
            "estimatedSpeechSeconds": safe_number(duration * speech_ratio),
        },
        "pauses": {
            "count": len(strategic_pauses),
            "perMinute": safe_number(len(strategic_pauses) / max(0.1, duration / 60)),
            "meanSeconds": safe_number(mean(strategic_pauses) if strategic_pauses else None),
            "longPauseCount": len(long_pauses),
        },
        "emphasis": {
            "peakCount": emphasis_peaks,
            "peaksPerMinute": safe_number(emphasis_peaks / max(0.1, duration / 60)),
        },
        "clarity": {
            "pitchTrackingRatio": safe_number(len(f0_values) / max(1, len(db_values))),
            "note": "Proxy only. True articulation needs speech recognition or deeper acoustic analysis.",
        },
    }


class Handler(BaseHTTPRequestHandler):
    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def send_json(self, status: int, payload: dict) -> None:
        data = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.end_headers()

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path not in {"/", "/analyze", "/health"}:
            self.send_json(404, {"ok": False, "error": "Not found"})
            return

        self.send_json(
            200,
            {
                "ok": True,
                "service": "Voice Variety Coach local Praat backend",
                "usage": "POST a WAV audio body to /analyze",
            },
        )

    def do_POST(self) -> None:
        if urlparse(self.path).path != "/analyze":
            self.send_json(404, {"ok": False, "error": "Not found"})
            return

        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            self.send_json(400, {"ok": False, "error": "No audio body received"})
            return

        audio_bytes = self.rfile.read(length)
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as audio_file:
            audio_file.write(audio_bytes)
            audio_path = Path(audio_file.name)

        try:
            result = analyze_with_praat(audio_path)
            self.send_json(200, result)
        except Exception as exc:
            self.send_json(500, {"ok": False, "error": str(exc)})
        finally:
            audio_path.unlink(missing_ok=True)


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Praat backend running at http://{HOST}:{PORT}/analyze")
    print("Press Ctrl+C to stop.")
    server.serve_forever()


if __name__ == "__main__":
    main()
