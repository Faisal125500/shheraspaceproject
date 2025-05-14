'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="card max-w-lg w-full mx-auto transform hover:scale-105 transition-all duration-300">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">Task Manager</h1>
          <p className="text-[var(--text-secondary)] mb-8 text-lg">Organize your tasks with ease and efficiency</p>
        </div>
        
        <div className="space-y-4">
          <Link href="/signup" className="block">
            <button className="btn-primary w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                <path d="M16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              Sign Up
            </button>
          </Link>
          
          <Link href="/login" className="block">
            <button className="btn-secondary w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Log In
            </button>
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-[var(--text-secondary)]">
          <p>Simple, fast, and secure task management</p>
        </div>
      </div>
    </div>
  );
} 