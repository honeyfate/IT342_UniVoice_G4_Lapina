# UniVoice — Frontend (web)

This folder contains a simple frontend for a university complaint system. It is a static single-page app that stores complaints in the browser's `localStorage` for demonstration and development.

Files:

- `index.html` — main UI
- `css/styles.css` — styles
- `js/app.js` — client logic (stores complaints in `localStorage`)

Quick start (open locally):

1. Open `index.html` in your browser directly (double-click or from file explorer).

Or run a simple local server (recommended to avoid some browser restrictions):

PowerShell (Windows):
```powershell
cd "c:\Users\User\Documents\UniVoice\IT342_UniVoice_G4_Lapina\web"
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

Notes & next steps:

- Data is stored in the browser only. For a real application, implement a backend (API) to persist complaints to a database and add authentication/authorization.
- I can add a Node/Express backend or connect this frontend to an existing API if you want.
