# Smart Doc Analyzer Frontend

This folder contains the React + TypeScript frontend (Vite).

All commands below are written for Windows PowerShell.

## What This Frontend Uses

Main runtime libraries (from `package.json`):

- `react`, `react-dom`, `react-router-dom`
- `axios`
- `zustand`
- `framer-motion`
- `lucide-react`
- `jspdf`
- `sass`

Main dev/build libraries:

- `vite`
- `typescript`
- `eslint` + `typescript-eslint`
- `tailwindcss`

## Prerequisites

- Node.js 20+
- npm

## Install Dependencies

From this folder (`frontend/smart-doc-analyzer`):

```powershell
npm install
```

## Run Frontend

```powershell
npm run dev
```

Default frontend URL:

- `http://localhost:5173`

## Build and Preview

```powershell
npm run build
npm run preview
```

## Backend Connection

This frontend expects backend API at:

- `http://localhost:8000`

The base URL is defined in:

- `src/api/axios.ts`

There are also direct backend URL calls in:

- `src/store/documentStore.ts`

If backend host/port changes, update those files.

## Auth/Cookies

The frontend uses cookie-based auth (`withCredentials: true`), so backend CORS and cookie settings must match your frontend origin.
