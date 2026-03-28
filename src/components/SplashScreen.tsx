'use client'
import { useEffect, useRef, useState } from 'react'

interface Props { onDone: () => void }

export default function SplashScreen({ onDone }: Props) {
  const [fading, setFading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // When video ends → fade out and call onDone
    const handleEnded = () => {
      setFading(true)
      setTimeout(onDone, 700)
    }

    // Fallback: if video fails to play or takes too long, skip after 5s
    const fallback = setTimeout(() => {
      setFading(true)
      setTimeout(onDone, 700)
    }, 5000)

    video.addEventListener('ended', handleEnded)
    video.play().catch(() => {
      // Autoplay blocked → skip immediately
      clearTimeout(fallback)
      onDone()
    })

    return () => {
      video.removeEventListener('ended', handleEnded)
      clearTimeout(fallback)
    }
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0f172a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.7s ease',
    }}>

      {/* Video */}
      <video
        ref={videoRef}
        src="/logo440.mp4"
        muted
        playsInline
        style={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 16,
          objectFit: 'contain',
        }}
      />

      {/* Powered by */}
      <p style={{
        marginTop: '1.5rem',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '0.78rem',
        fontWeight: 400,
        color: '#475569',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}>
        Powered by <span style={{ color: '#60a5fa', fontWeight: 600 }}>Dr. Gio</span>
      </p>
    </div>
  )
}
