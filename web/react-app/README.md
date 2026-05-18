    # UniVoice React Frontend

This is a small React frontend (Vite) for the UniVoice complaint system. Data is persisted to `localStorage` for demo purposes.

**Features:**
- Submit complaints with category, subject, description, optional student ID and course.
- View all complaints in a list with filtering by status (Open, In Progress, Resolved).
- Search complaints by subject, description, course, ID, or category.
- **Comments & Notes** — Click on any complaint to open its detail modal and add tracking notes/updates.
- Export complaints to CSV.
- Mark complaints as resolved/reopen them.
- Delete complaints.

Quick start (Windows PowerShell):

1. Open PowerShell and change to the react app folder:
```powershell
cd "c:\Users\User\Documents\UniVoice\IT342_UniVoice_G4_Lapina\web\react-app"
```
2. Install dependencies:
```powershell
npm install
```
3. Start dev server:
```powershell
npm run dev
```
4. Open the provided local address (usually `http://localhost:5173`).

Build for production:
```powershell
npm run build
npm run preview
```

Notes:
- The app stores complaints in browser `localStorage` under key `univoice_complaints_v1`.
- To persist data to a real backend, I can add a Node/Express or other API and adapt the frontend to call it.
