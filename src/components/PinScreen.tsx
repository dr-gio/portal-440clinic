'use client'
import { useState } from 'react'
import { Usuario } from '@/app/page'

interface Props { onLogin: (u: Usuario) => void }

export default function PinScreen({ onLogin }: Props) {
  const [pin, setPin]       = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const addDigit = (d: string) => {
    if (pin.length < 6) setPin(p => p + d)
  }
  const del = () => setPin(p => p.slice(0, -1))
  const clear = () => { setPin(''); setError('') }

  const submit = async () => {
    if (pin.length < 4) return
    setLoading(true)
    setError('')
    try {
      const r = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      })
      const d = await r.json()
      if (d.ok) onLogin(d.usuario)
      else { setError('PIN incorrecto'); setPin('') }
    } catch {
      setError('Error de conexión')
    }
    setLoading(false)
  }

  const keys = ['1','2','3','4','5','6','7','8','9','C','0','⌫']

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0d1b2a 0%, #26364D 100%)',
    }}>
      <div style={{
        background: '#1a2a3a', borderRadius: 24, padding: '2.5rem 2rem',
        border: '1px solid #2a4060', width: 320, boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 16, margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, #A27B5A, #8a6547)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 700, color: '#fff'
          }}>440</div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e2e8f0' }}>440 Clinic</h1>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>Portal Clínico</p>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: '1.5rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              width: 14, height: 14, borderRadius: '50%',
              background: i < pin.length ? '#A27B5A' : '#2a4060',
              border: '2px solid ' + (i < pin.length ? '#A27B5A' : '#3a5070'),
              transition: 'all 0.15s'
            }} />
          ))}
        </div>

        {/* Error */}
        {error && (
          <p style={{ textAlign: 'center', color: '#f87171', fontSize: '0.8rem', marginBottom: '1rem' }}>
            {error}
          </p>
        )}

        {/* Keypad */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {keys.map(k => (
            <button key={k} onClick={() => {
              if (k === '⌫') del()
              else if (k === 'C') clear()
              else addDigit(k)
            }}
              style={{
                height: 56, borderRadius: 12, border: '1px solid #2a4060',
                background: k === 'C' ? 'rgba(239,68,68,0.1)' : '#26364D',
                color: k === 'C' ? '#f87171' : '#e2e8f0',
                fontSize: k === '⌫' ? '1.2rem' : '1.25rem',
                fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.1s',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.94)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >{k}</button>
          ))}
        </div>

        {/* Ingresar */}
        <button onClick={submit} disabled={pin.length < 4 || loading}
          style={{
            width: '100%', marginTop: '1.25rem', height: 50, borderRadius: 12,
            background: 'linear-gradient(135deg, #A27B5A, #8a6547)',
            border: 'none', color: '#fff', fontSize: '0.95rem',
            fontWeight: 600, cursor: pin.length < 4 ? 'not-allowed' : 'pointer',
            opacity: pin.length < 4 ? 0.5 : 1, transition: 'all 0.2s'
          }}>
          {loading ? 'Verificando...' : 'Ingresar →'}
        </button>
      </div>
    </div>
  )
}
