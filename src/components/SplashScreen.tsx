'use client'
import { useEffect, useState } from 'react'

interface Props { onDone: () => void }

export default function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<'in'|'hold'|'out'>('in')

  useEffect(() => {
    // in: 0–800ms  |  hold: 800–2600ms  |  out: 2600–3400ms  |  done: 3400ms
    const t1 = setTimeout(() => setPhase('hold'), 800)
    const t2 = setTimeout(() => setPhase('out'),  2600)
    const t3 = setTimeout(() => onDone(),         3400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0f172a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: phase === 'out' ? 0 : 1,
      transition: phase === 'out' ? 'opacity 0.8s ease' : 'none',
      overflow: 'hidden',
    }}>

      {/* Radial glow background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(37,99,235,0.18) 0%, transparent 70%)',
        opacity: phase === 'in' ? 0 : 1,
        transition: 'opacity 1.2s ease',
      }} />

      {/* Orbiting ring */}
      <div style={{
        position: 'absolute',
        width: 340, height: 340,
        borderRadius: '50%',
        border: '1px solid rgba(37,99,235,0.2)',
        opacity: phase === 'in' ? 0 : 0.6,
        transition: 'opacity 1s ease',
        animation: 'spin 12s linear infinite',
      }} />
      <div style={{
        position: 'absolute',
        width: 240, height: 240,
        borderRadius: '50%',
        border: '1px solid rgba(96,165,250,0.15)',
        opacity: phase === 'in' ? 0 : 0.5,
        transition: 'opacity 1s ease 0.2s',
        animation: 'spinRev 8s linear infinite',
      }} />

      {/* Main content */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
        opacity: phase === 'in' ? 0 : 1,
        transform: phase === 'in' ? 'translateY(20px) scale(0.96)' : 'translateY(0) scale(1)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>

        {/* Logo */}
        <div style={{
          width: 88, height: 88, borderRadius: 22,
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 60%, #1e40af 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(37,99,235,0.5), 0 0 80px rgba(37,99,235,0.2)',
          position: 'relative',
        }}>
          <span style={{
            color: '#fff', fontWeight: 800, fontSize: '1.6rem',
            fontFamily: 'Outfit, sans-serif', letterSpacing: '-1px',
          }}>440</span>
          {/* Pulse ring */}
          <div style={{
            position: 'absolute', inset: -8, borderRadius: 30,
            border: '2px solid rgba(37,99,235,0.4)',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
        </div>

        {/* Wordmark */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 700,
            fontSize: '1.75rem', color: '#f8fafc',
            letterSpacing: '-0.5px', lineHeight: 1,
          }}>440 Clinic</p>
          <p style={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 400,
            fontSize: '0.8rem', color: '#60a5fa',
            letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: 6,
          }}>Portal Clínico Unificado</p>
        </div>

        {/* Loading bar */}
        <div style={{
          width: 180, height: 2, background: 'rgba(255,255,255,0.08)',
          borderRadius: 999, overflow: 'hidden', marginTop: 8,
        }}>
          <div style={{
            height: '100%', borderRadius: 999,
            background: 'linear-gradient(90deg, #2563eb, #60a5fa)',
            width: phase === 'hold' || phase === 'out' ? '100%' : '0%',
            transition: 'width 1.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
        </div>

        {/* Tagline */}
        <p style={{
          fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem',
          color: '#334155', letterSpacing: '0.05em',
          opacity: phase === 'hold' ? 1 : 0,
          transition: 'opacity 0.5s ease 0.8s',
        }}>Construido con ❤️ por Dr. Gio</p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spinRev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.9; transform: scale(1.08); }
        }
      `}</style>
    </div>
  )
}
