# Neo Assessment: Character Battle Simulator

## Overview

This project is a proof-of-concept for a new role-playing game (RPG) character management and battle simulation system. It consists of a **backend API** for managing characters and simulating battles, and a **frontend** for interacting with the system via a modern web UI.

### Problem Statement

You are tasked with building the backend system for managing RPG characters, including:

- Creating, listing, updating, and deleting characters
- Simulating battles between characters
- Providing API documentation for easy integration

This solution provides:

- A **NestJS backend** with a RESTful API for all character and battle operations
- A **React + Chakra UI frontend** for user-friendly character management and battle simulation
- **Swagger/OpenAPI documentation** for the backend API

---

## Requirements

- **Node.js** v18 or higher (recommended v22+)
- **npm** v9 or higher

---

## Environment Variables

Both backend and frontend use environment variables for configuration. Example files are provided:

### Backend (`backend/.env-example`)

Copy this file to `.env` in the backend folder and adjust as needed:

```env
PORT=3000
NODE_ENV=development
# Add other backend-specific variables here
```

### Frontend (`frontend/.env-example`)

Copy this file to `.env` in the frontend folder and adjust as needed:

```env
VITE_API_URL=http://localhost:3000
```

**Instructions:**

1. Copy `.env-example` to `.env` in both `backend` and `frontend` folders.
2. Edit the values as needed for your local setup.

---

## Backend Setup (NestJS)

1. **Install dependencies:**

   ```bash
   cd backend
   npm install
   ```

2. **Run the backend server:**

   ```bash
   npm run start:dev
   ```

   The backend will start on [http://localhost:3000](http://localhost:3000)

3. **API Documentation (Swagger):**
   - Visit [http://localhost:3000/api](http://localhost:3000/api) to view and interact with the Swagger UI.

---

## Frontend Setup (React + Vite + Chakra UI)

1. **Install dependencies:**

   ```bash
   cd frontend
   npm install
   ```

2. **Run the frontend app:**

   ```bash
   npm run dev
   ```

   The frontend will start on [http://localhost:5173](http://localhost:5173)

3. **Usage:**
   - Open [http://localhost:5173](http://localhost:5173) in your browser.
   - Create, view, and manage characters.
   - Select two characters to simulate a battle and view the results.

---

## Project Structure

- `backend/` - NestJS API for character management and battles
- `frontend/` - React app for interacting with the API

---

## Key Features

- **Character CRUD:** Create, view, update, and delete RPG characters
- **Battle Simulation:** Simulate battles between two characters and view detailed logs
- **Modern UI:** Responsive, user-friendly interface with Chakra UI
- **API Docs:** Full Swagger documentation at `/api` endpoint

---

## Notes

- Make sure both backend and frontend are running for full functionality.
- The backend uses in-memory storage for simplicity (no database required for the proof-of-concept).
- You can extend the system with more features or connect to a real database as needed.

---

## Contact

For any questions or suggestions, please contact the author: David Jimenez https://github.com/Danimaxpd 
