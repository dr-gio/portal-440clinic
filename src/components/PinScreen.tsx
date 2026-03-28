'use client'
import { useState } from 'react'
import { Usuario } from '@/app/page'

interface Props { onLogin: (u: Usuario) => void; theme: 'light'|'dark'; onToggleTheme: () => void }

export default function PinScreen({ onLogin, theme, onToggleTheme }: Props) {
  const [pin, setPin]         = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const del = () => setPin(p => p.slice(0, -1))

  const submit = async (currentPin = pin) => {
    if (currentPin.length < 4) return
    setLoading(true); setError('')
    try {
      const r = await fetch('/api/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: currentPin })
      })
      const d = await r.json()
      if (d.ok) onLogin(d.usuario)
      else { setError('PIN incorrecto'); setPin('') }
    } catch { setError('Error de conexión') }
    setLoading(false)
  }

  const handleKey = (k: string) => {
    if (k === '⌫') { del(); return }
    if (k === '✓') { submit(); return }
    const newPin = pin.length < 6 ? pin + k : pin
    setPin(newPin)
    if (newPin.length === 6) setTimeout(() => submit(newPin), 150)
  }

  const isDark = theme === 'dark'
  const cardBg   = isDark ? '#1e293b' : '#ffffff'
  const border   = isDark ? '#334155' : '#e2e8f0'
  const textMain = isDark ? '#f8fafc' : '#0f172a'
  const textMut  = isDark ? '#94a3b8' : '#64748b'
  const keyBg    = isDark ? '#0f172a' : '#f1f5f9'

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: isDark
        ? 'radial-gradient(circle at 15% 50%, rgba(37,99,235,0.08), transparent 25%), radial-gradient(circle at 85% 30%, rgba(16,185,129,0.05), transparent 25%), #0f172a'
        : 'radial-gradient(circle at 15% 50%, rgba(37,99,235,0.06), transparent 25%), #f1f5f9',
      position: 'relative'
    }}>
      {/* Theme toggle */}
      <button onClick={onToggleTheme} style={{
        position: 'absolute', top: 20, right: 20,
        background: cardBg, border: '1px solid ' + border,
        borderRadius: 10, padding: '0.5rem 0.75rem',
        color: textMut, fontSize: '1rem', cursor: 'pointer'
      }}>{isDark ? '☀️' : '🌙'}</button>

      <div style={{
        background: cardBg, borderRadius: 24, padding: '2.5rem 2rem',
        border: '1px solid ' + border, width: 340,
        boxShadow: isDark ? '0 25px 50px rgba(0,0,0,0.4)' : '0 25px 50px rgba(0,0,0,0.08)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>440</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textMain, letterSpacing: '-0.5px' }}>440 Clinic</h1>
          <p style={{ fontSize: '0.75rem', color: textMut, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Plastic Surgery · Dr. Gio</p>
          <p style={{ fontSize: '0.85rem', color: textMut, marginTop: '1rem' }}>Ingresa tu PIN de 6 dígitos</p>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: '1.5rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              width: 16, height: 16, borderRadius: '50%',
              background: i < pin.length ? '#2563eb' : 'transparent',
              border: '2px solid ' + (i < pin.length ? '#2563eb' : border),
              transition: 'all 0.15s'
            }}/>
          ))}
        </div>

        {error && <p style={{ textAlign: 'center', color: '#ef4444', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>}

        {/* Keypad */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {['1','2','3','4','5','6','7','8','9','✓','0','⌫'].map(k => (
            <button key={k} onClick={() => handleKey(k)}
              style={{
                height: 60, borderRadius: 14,
                border: '1px solid ' + border,
                background: k === '✓' ? (pin.length >= 4 ? 'rgba(37,99,235,0.1)' : keyBg) : keyBg,
                color: k === '✓' ? (pin.length >= 4 ? '#2563eb' : textMut) : k === '⌫' ? '#ef4444' : textMain,
                fontSize: k === '⌫' ? '1.1rem' : '1.3rem',
                fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                transition: 'all 0.1s',
                opacity: k === '✓' && pin.length < 4 ? 0.4 : 1,
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.93)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >{k}</button>
          ))}
        </div>

        {loading && <p style={{ textAlign: 'center', color: textMut, fontSize: '0.85rem', marginTop: '1rem' }}>Verificando...</p>}
      </div>
    </div>
  )
}
