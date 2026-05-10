# StudyX

StudyX is an offline-first Django study tracker with:
- Subject CRUD with color tags
- Focus timer with Pomodoro, Deep Work, and custom modes
- Auto session saving
- Dashboard analytics, streaks, and CSV export
- Dark/light mode UI

## 1) Prerequisites

- Python 3.11+
- pip

## 2) Setup

```bash
cd StudyX
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
# source .venv/bin/activate
pip install -r requirements.txt
```

## 3) Database Migrations

```bash
python manage.py migrate
```

## 4) Run Locally

```bash
python manage.py runserver
```

Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/).

## 5) Optional: Local Chart.js bundle for full offline charts

StudyX uses a local file path for Chart.js:

`static/js/vendor/chart.umd.min.js`

Replace that placeholder with the real Chart.js UMD minified build to enable full interactive charts offline.  
If omitted, StudyX still renders fallback canvas charts.
