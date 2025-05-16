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


**Made with ❤️ by Faisal Ahmed**
