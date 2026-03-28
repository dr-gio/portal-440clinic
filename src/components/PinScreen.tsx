'use client'
import { useState, useEffect } from 'react'
import { Usuario } from '@/app/page'

interface Props { onLogin: (u: Usuario) => void; theme: 'light'|'dark'; onToggleTheme: () => void }

interface UsuarioPublico { id: string; nombre: string; rol: string }

const ROL_LABELS: Record<string, string> = {
  dr_gio:       'Dr. Gio',
  suite:        'Suite Médica',
  asesora:      'Asesora',
  sharon:       'Dra. Sharon',
  contabilidad: 'Auxiliar Contable',
}

const ROL_COLORS: Record<string, string> = {
  dr_gio:       '#2563eb',
  suite:        '#10b981',
  asesora:      '#f59e0b',
  sharon:       '#8b5cf6',
  contabilidad: '#ef4444',
}

function initiales(nombre: string) {
  return nombre.split(' ').slice(0, 2).map(p => p[0]?.toUpperCase()).join('')
}

export default function PinScreen({ onLogin, theme, onToggleTheme }: Props) {
  const [step, setStep]           = useState<'select'|'pin'>('select')
  const [usuarios, setUsuarios]   = useState<UsuarioPublico[]>([])
  const [selected, setSelected]   = useState<UsuarioPublico | null>(null)
  const [pin, setPin]             = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(true)

  const isDark   = theme === 'dark'
  const cardBg   = isDark ? '#1e293b' : '#ffffff'
  const border   = isDark ? '#334155' : '#e2e8f0'
  const textMain = isDark ? '#f8fafc' : '#0f172a'
  const textMut  = isDark ? '#94a3b8' : '#64748b'
  const keyBg    = isDark ? '#0f172a' : '#f1f5f9'

  useEffect(() => {
    fetch('/api/auth')
      .then(r => r.json())
      .then(d => setUsuarios(d.usuarios || []))
      .finally(() => setLoadingUsers(false))
  }, [])

  const seleccionarUsuario = (u: UsuarioPublico) => {
    setSelected(u)
    setPin('')
    setError('')
    setStep('pin')
  }

  const volver = () => {
    setStep('select')
    setSelected(null)
    setPin('')
    setError('')
  }

  const submit = async (currentPin = pin) => {
    if (currentPin.length < 4 || !selected) return
    setLoading(true); setError('')
    try {
      const r = await fetch('/api/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: currentPin, userId: selected.id })
      })
      const d = await r.json()
      if (d.ok) onLogin(d.usuario)
      else { setError('PIN incorrecto'); setPin('') }
    } catch { setError('Error de conexión') }
    setLoading(false)
  }

  const handleKey = (k: string) => {
    if (k === '⌫') { setPin(p => p.slice(0, -1)); return }
    if (k === '✓') { submit(); return }
    const newPin = pin.length < 6 ? pin + k : pin
    setPin(newPin)
    if (newPin.length === 6) setTimeout(() => submit(newPin), 150)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: isDark
        ? 'radial-gradient(circle at 15% 50%, rgba(37,99,235,0.08), transparent 30%), #0f172a'
        : 'radial-gradient(circle at 15% 50%, rgba(37,99,235,0.05), transparent 30%), #f1f5f9',
      padding: '1.5rem', position: 'relative',
    }}>
      {/* Theme toggle */}
      <button onClick={onToggleTheme} style={{
        position: 'absolute', top: 20, right: 20,
        background: cardBg, border: '1px solid ' + border,
        borderRadius: 10, padding: '0.5rem 0.75rem',
        color: textMut, fontSize: '1rem', cursor: 'pointer'
      }}>{isDark ? '☀️' : '🌙'}</button>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, margin: '0 auto 0.875rem',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 24px rgba(37,99,235,0.35)',
        }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.5px' }}>440</span>
        </div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: textMain, letterSpacing: '-0.5px' }}>440 Clinic</h1>
        <p style={{ fontSize: '0.72rem', color: textMut, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>
          Portal Clínico Unificado
        </p>
      </div>

      {/* ─── PASO 1: SELECCIÓN DE USUARIO ─── */}
      {step === 'select' && (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: textMut, marginBottom: '1.25rem' }}>
            ¿Quién eres?
          </p>

          {loadingUsers ? (
            <p style={{ textAlign: 'center', color: textMut, fontSize: '0.85rem' }}>Cargando...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
              {usuarios.map(u => {
                const color = ROL_COLORS[u.rol] || '#2563eb'
                return (
                  <button key={u.id} onClick={() => seleccionarUsuario(u)} style={{
                    background: cardBg, border: '1px solid ' + border, borderRadius: 16,
                    padding: '1.25rem 1rem', cursor: 'pointer', textAlign: 'center',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem',
                    transition: 'all 0.15s', fontFamily: 'Outfit, sans-serif',
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = color
                      ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = border
                      ;(e.currentTarget as HTMLButtonElement).style.transform = ''
                    }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: color + '20', border: '2px solid ' + color + '50',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', fontWeight: 700, color,
                    }}>{initiales(u.nombre)}</div>
                    <div>
                      <p style={{ fontWeight: 600, color: textMain, fontSize: '0.875rem', lineHeight: 1.2 }}>{u.nombre}</p>
                      <p style={{ fontSize: '0.7rem', color, marginTop: 2, fontWeight: 500 }}>{ROL_LABELS[u.rol] || u.rol}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── PASO 2: PIN ─── */}
      {step === 'pin' && selected && (
        <div style={{
          background: cardBg, borderRadius: 24, padding: '2rem 1.75rem',
          border: '1px solid ' + border, width: '100%', maxWidth: 320,
          boxShadow: isDark ? '0 25px 50px rgba(0,0,0,0.4)' : '0 25px 50px rgba(0,0,0,0.08)'
        }}>
          {/* Usuario seleccionado */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.75rem' }}>
            <button onClick={volver} style={{
              background: 'transparent', border: 'none', color: textMut,
              fontSize: '1.2rem', cursor: 'pointer', padding: '0.25rem', lineHeight: 1,
            }}>←</button>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
              background: (ROL_COLORS[selected.rol] || '#2563eb') + '20',
              border: '2px solid ' + (ROL_COLORS[selected.rol] || '#2563eb') + '50',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 700, color: ROL_COLORS[selected.rol] || '#2563eb',
            }}>{initiales(selected.nombre)}</div>
            <div>
              <p style={{ fontWeight: 700, color: textMain, fontSize: '0.95rem' }}>{selected.nombre}</p>
              <p style={{ fontSize: '0.72rem', color: ROL_COLORS[selected.rol] || '#2563eb', fontWeight: 500 }}>
                {ROL_LABELS[selected.rol] || selected.rol}
              </p>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: textMut, marginBottom: '1.25rem' }}>
            Ingresa tu PIN
          </p>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: '1.5rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{
                width: 14, height: 14, borderRadius: '50%',
                background: i < pin.length ? (ROL_COLORS[selected.rol] || '#2563eb') : 'transparent',
                border: '2px solid ' + (i < pin.length ? ROL_COLORS[selected.rol] || '#2563eb' : border),
                transition: 'all 0.15s'
              }}/>
            ))}
          </div>

          {error && <p style={{ textAlign: 'center', color: '#ef4444', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>}

          {/* Keypad */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {['1','2','3','4','5','6','7','8','9','✓','0','⌫'].map(k => (
              <button key={k} onClick={() => handleKey(k)} style={{
                height: 56, borderRadius: 12, border: '1px solid ' + border,
                background: k === '✓'
                  ? (pin.length >= 4 ? (ROL_COLORS[selected.rol] || '#2563eb') + '15' : keyBg)
                  : keyBg,
                color: k === '✓'
                  ? (pin.length >= 4 ? ROL_COLORS[selected.rol] || '#2563eb' : textMut)
                  : k === '⌫' ? '#ef4444' : textMain,
                fontSize: k === '⌫' ? '1.1rem' : '1.25rem',
                fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                opacity: k === '✓' && pin.length < 4 ? 0.4 : 1,
                transition: 'all 0.1s',
              }}
                onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.93)')}
                onMouseUp={e => (e.currentTarget.style.transform = '')}
              >{k}</button>
            ))}
          </div>

          {loading && (
            <p style={{ textAlign: 'center', color: textMut, fontSize: '0.85rem', marginTop: '1rem' }}>
              Verificando...
            </p>
          )}
        </div>
      )}
    </div>
  )
}
