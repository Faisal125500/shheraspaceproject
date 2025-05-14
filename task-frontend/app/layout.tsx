import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Task Management App',
  description: 'A modern task management application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-cover bg-center bg-fixed bg-no-repeat`} style={{
        backgroundImage: 'url(/images/background.jpg)'
      }}>
        <div className="min-h-screen bg-black/10 flex flex-col">
          <div className="flex-1 flex flex-col">
            {children}
            <Toaster position="top-center" />
          </div>
          <footer className="w-full text-center py-4 text-sm text-black/80 mb-16">
            All rights reserved by Faisal Ahmed
          </footer>
        </div>
      </body>
    </html>
  )
} 