# Local Praat Backend

This backend lets the browser app send a recording to Python, where Praat/Parselmouth extracts acoustic statistics.

## First-Time Setup

From the project folder:

```bash
python3 -m pip install praat-parselmouth
```

## Run

```bash
cd ~/Documents/GitHub/voice-variety-coach
python3 backend/server.py
```

Then keep the existing frontend open at:

```text
http://127.0.0.1:5173/index.html
```

The frontend sends recordings to:

```text
http://127.0.0.1:8000/analyze
```

Later, this same API shape can be moved to an online Python backend.
