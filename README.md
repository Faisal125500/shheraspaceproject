# Task Manager

A modern, full-stack task management application built with **Flask** (Python) for the backend and **Next.js** (React) for the frontend.

## Features

- User authentication (signup, login, logout)
- Secure password hashing
- Add, edit, complete, and delete tasks
- Due date support for tasks
- Responsive, modern UI with Tailwind CSS
- Toast notifications for user feedback
- User avatar/initials and personalized dashboard
- Animated loading spinners and skeleton loaders
- Persistent storage with SQLite
- RESTful API

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, react-hot-toast
- **Backend:** Flask, Flask-CORS, Gunicorn, SQLite, Werkzeug
- **Deployment:** Vercel (frontend), Render (backend)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Python 3.8+
- pip

### Backend Setup (Flask)

1. Install dependencies:
    ```sh
    pip install -r requirements.txt
    ```
2. Run the backend:
    ```sh
    python app.py
    ```
    The API will be available at `http://localhost:5000`.

### Frontend Setup (Next.js)

1. Install dependencies:
    ```sh
    cd task-frontend
    npm install
    ```
2. Set the backend API URL in `.env.local` (optional, for deployment):
    ```
    NEXT_PUBLIC_API_URL=http://localhost:5000
    ```
3. Run the frontend:
    ```sh
    npm run dev
    ```
    The app will be available at `http://localhost:3000`.

## Deployment

### Backend (Render)

- Push your backend code to GitHub.
- Create a new Web Service on [Render](https://render.com/).
- Set the build command: `pip install -r requirements.txt`
- Set the start command: `gunicorn app:app`
- Add environment variables as needed.

### Frontend (Vercel)

- Push your frontend code to GitHub.
- Import your repo on [Vercel](https://vercel.com/).
- Set the project root to `task-frontend`.
- Set `NEXT_PUBLIC_API_URL` to your Render backend URL in Vercel's environment variables.
- Deploy!

## Screenshots

_Add screenshots here if you like!_

## License

MIT

---

**Made with ❤️ by Faisal Ahmed** 