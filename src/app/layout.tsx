import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '440 Clinic Portal',
  description: 'Portal central 440 Clinic',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
