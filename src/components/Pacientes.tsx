'use client'
import { useState, useEffect, useCallback } from 'react'
import { Usuario } from '@/app/page'

interface Paciente {
  cedula: string; nombre: string; telefono?: string; email?: string
  total_presupuesto?: number; total_pagado?: number
  pagos?: DocItem[]; documentos_paciente?: DocItem[]
}

interface ChatMsg { role: 'user' | 'assistant'; content: string }
interface DocItem { id: string; tipo_documento: string; nombre_archivo: string; url_archivo?: string; app_origen?: string; fecha_generacion: string }

const fmt = (n: number) => '$' + Math.round(n || 0).toLocaleString('es-CO')

export default function Pacientes({ usuario, theme }: { usuario: Usuario; theme: 'light'|'dark' }) {
  const isDark = theme === 'dark'
  const CARD = isDark ? '#1a2a3a' : '#ffffff'
  const BORDER = isDark ? '#2a4060' : '#e2e8f0'
  const [busqueda, setBusqueda]   = useState('')
  const [lista, setLista]         = useState<Paciente[]>([])
  const [seleccionado, setSelec]  = useState<Paciente | null>(null)
  const [cargando, setCargando]   = useState(false)
  const [tab, setTab]             = useState<'info'|'docs'|'chat'>('info')
  const [chatMsgs, setChatMsgs]   = useState<ChatMsg[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoad, setChatLoad]   = useState(false)

  const verFinanciero = ['dr_gio', 'contabilidad'].includes(usuario.rol)

  const buscar = useCallback(async (q: string) => {
    setCargando(true)
    const r = await fetch(`/api/pacientes?q=${encodeURIComponent(q)}`).then(x => x.json()).catch(() => ({ data: [] }))
    setLista(r.data || [])
    setCargando(false)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => buscar(busqueda), 300)
    return () => clearTimeout(t)
  }, [busqueda, buscar])

  useEffect(() => { buscar('') }, [buscar])

  const abrirPaciente = async (p: Paciente) => {
    const r = await fetch(`/api/pacientes?cedula=${p.cedula}`).then(x => x.json())
    setSelec(r.data)
    setTab('info')
    setChatMsgs([])
  }

  const enviarChat = async () => {
    if (!chatInput.trim() || !seleccionado) return
    const msg: ChatMsg = { role: 'user', content: chatInput }
    const nuevos = [...chatMsgs, msg]
    setChatMsgs(nuevos)
    setChatInput('')
    setChatLoad(true)
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nuevos, paciente: seleccionado, rol: usuario.rol })
      }).then(x => x.json())
      setChatMsgs(prev => [...prev, { role: 'assistant', content: r.content }])
    } catch { setChatMsgs(prev => [...prev, { role: 'assistant', content: 'Error al conectar con la IA.' }]) }
    setChatLoad(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.65rem 0.875rem', borderRadius: 10,
    border: '1px solid ' + BORDER, background: '#0d1b2a',
    color: '#e2e8f0', fontSize: '0.875rem', outline: 'none'
  }

  const tabBtn = (id: typeof tab, label: string) => (
    <button onClick={() => setTab(id)} style={{
      padding: '0.5rem 1rem', borderRadius: 8, border: 'none',
      background: tab === id ? 'rgba(162,123,90,0.15)' : 'transparent',
      color: tab === id ? '#A27B5A' : '#94a3b8',
      fontSize: '0.85rem', fontWeight: tab === id ? 600 : 400,
      cursor: 'pointer', borderBottom: tab === id ? '2px solid #A27B5A' : '2px solid transparent'
    }}>{label}</button>
  )

  const DOC_TIPOS: Record<string, string> = {
    consentimiento: '📋', presupuesto: '💰', receta: '💊',
    laboratorio: '🧪', comprobante_pago: '💳', factura: '🧾',
    foto_preop: '📸', foto_postop: '📸', evolucion: '📝', contrato_firmado: '✍️'
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', height: 'calc(100vh - 3rem)' }}>

      {/* Panel izquierdo */}
      <div style={{
        width: 300, flexShrink: 0, background: CARD, borderRadius: 14,
        border: '1px solid ' + BORDER, display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid ' + BORDER }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.75rem' }}>
            👥 Pacientes
          </h2>
          <input
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, CC o teléfono..."
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
          {cargando ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem', fontSize: '0.85rem' }}>Buscando...</p>
          ) : lista.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem', fontSize: '0.85rem' }}>Sin resultados</p>
          ) : lista.map(p => (
            <div key={p.cedula} onClick={() => abrirPaciente(p)}
              style={{
                padding: '0.75rem', borderRadius: 10, cursor: 'pointer', marginBottom: 4,
                background: seleccionado?.cedula === p.cedula ? 'rgba(162,123,90,0.12)' : 'transparent',
                border: '1px solid ' + (seleccionado?.cedula === p.cedula ? 'rgba(162,123,90,0.4)' : 'transparent'),
                transition: 'all 0.15s'
              }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0' }}>{p.nombre}</p>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>CC {p.cedula}</p>
              {verFinanciero && p.total_presupuesto && (
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: '0.7rem', color: '#34d399' }}>{fmt(p.total_pagado || 0)} pagado</span>
                  {(p.total_presupuesto - (p.total_pagado || 0)) > 0 && (
                    <span style={{ fontSize: '0.7rem', color: '#f87171' }}>
                      {fmt(p.total_presupuesto - (p.total_pagado || 0))} pendiente
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>
        {!seleccionado ? (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: CARD, borderRadius: 14, border: '1px solid ' + BORDER
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '3rem' }}>👥</span>
              <p style={{ color: '#94a3b8', marginTop: '1rem', fontSize: '0.9rem' }}>Selecciona un paciente para ver su expediente</p>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, background: CARD, borderRadius: 14, border: '1px solid ' + BORDER, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header paciente */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid ' + BORDER }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0' }}>{seleccionado.nombre}</h2>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>
                    CC {seleccionado.cedula}
                    {seleccionado.telefono && ` · 📱 ${seleccionado.telefono}`}
                    {seleccionado.email && ` · ✉️ ${seleccionado.email}`}
                  </p>
                </div>
                <button onClick={() => setSelec(null)} style={{
                  background: 'transparent', border: 'none', color: '#64748b',
                  fontSize: '1.2rem', cursor: 'pointer'
                }}>✕</button>
              </div>

              {/* Financiero */}
              {verFinanciero && seleccionado.total_presupuesto && (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.875rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Presupuesto', val: fmt(seleccionado.total_presupuesto), color: '#94a3b8' },
                    { label: 'Pagado', val: fmt(seleccionado.total_pagado || 0), color: '#34d399' },
                    { label: 'Pendiente', val: fmt((seleccionado.total_presupuesto || 0) - (seleccionado.total_pagado || 0)), color: '#fbbf24' },
                  ].map(m => (
                    <div key={m.label} style={{
                      padding: '0.5rem 0.875rem', borderRadius: 8,
                      background: '#0d1b2a', border: '1px solid ' + BORDER
                    }}>
                      <p style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</p>
                      <p style={{ fontSize: '0.95rem', fontWeight: 700, color: m.color }}>{m.val}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 4, marginTop: '0.875rem' }}>
                {tabBtn('info', '📋 Información')}
                {tabBtn('docs', `📁 Documentos${seleccionado.documentos_paciente?.length ? ` (${seleccionado.documentos_paciente.length})` : ''}`)}
                {tabBtn('chat', '🤖 Chat IA')}
              </div>
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>

              {tab === 'info' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { label: 'Nombre completo', val: seleccionado.nombre },
                    { label: 'Cédula', val: seleccionado.cedula },
                    { label: 'Teléfono', val: seleccionado.telefono || '—' },
                    { label: 'Email', val: seleccionado.email || '—' },
                  ].map(f => (
                    <div key={f.label} style={{ padding: '0.875rem', background: '#0d1b2a', borderRadius: 10, border: '1px solid ' + BORDER }}>
                      <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{f.label}</p>
                      <p style={{ fontSize: '0.875rem', color: '#e2e8f0', fontWeight: 500 }}>{f.val}</p>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'docs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {!seleccionado.documentos_paciente?.length ? (
                    <p style={{ color: '#64748b', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>Sin documentos registrados</p>
                  ) : seleccionado.documentos_paciente.map((d: DocItem) => (
                    <div key={d.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.75rem 1rem', background: '#0d1b2a', borderRadius: 10, border: '1px solid ' + BORDER
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '1.25rem' }}>{DOC_TIPOS[d.tipo_documento] || '📄'}</span>
                        <div>
                          <p style={{ fontSize: '0.85rem', fontWeight: 500, color: '#e2e8f0' }}>{d.nombre_archivo}</p>
                          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {d.tipo_documento} · {d.app_origen} · {new Date(d.fecha_generacion).toLocaleDateString('es-CO')}
                          </p>
                        </div>
                      </div>
                      {d.url_archivo && (
                        <a href={d.url_archivo} target="_blank" rel="noreferrer"
                          style={{
                            padding: '0.4rem 0.75rem', borderRadius: 8, border: '1px solid #2a4060',
                            background: '#26364D', color: '#9CB2BF', fontSize: '0.75rem',
                            textDecoration: 'none', fontWeight: 500
                          }}>⬇ Descargar</a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {tab === 'chat' && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.75rem' }}>
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 200 }}>
                    {!chatMsgs.length && (
                      <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <span style={{ fontSize: '2rem' }}>🤖</span>
                        <p style={{ color: '#94a3b8', marginTop: '0.75rem', fontSize: '0.875rem' }}>
                          Pregúntame cualquier cosa sobre {seleccionado.nombre}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                          {['¿Cuánto ha pagado?', '¿Qué documentos tiene?', '¿Cuál es su saldo pendiente?'].map(s => (
                            <button key={s} onClick={() => setChatInput(s)} style={{
                              padding: '0.4rem 0.75rem', borderRadius: 20, border: '1px solid #2a4060',
                              background: '#26364D', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer'
                            }}>{s}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    {chatMsgs.map((m, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
                      }}>
                        <div style={{
                          maxWidth: '80%', padding: '0.75rem 1rem', borderRadius: 12,
                          background: m.role === 'user' ? 'rgba(162,123,90,0.2)' : '#0d1b2a',
                          border: '1px solid ' + (m.role === 'user' ? 'rgba(162,123,90,0.3)' : BORDER),
                          color: '#e2e8f0', fontSize: '0.875rem', lineHeight: 1.5
                        }}>{m.content}</div>
                      </div>
                    ))}
                    {chatLoad && (
                      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{ padding: '0.75rem 1rem', background: '#0d1b2a', border: '1px solid ' + BORDER, borderRadius: 12, color: '#94a3b8', fontSize: '0.875rem' }}>
                          Pensando...
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && enviarChat()}
                      placeholder="Pregunta sobre el paciente..."
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button onClick={enviarChat} disabled={!chatInput.trim() || chatLoad}
                      style={{
                        padding: '0.65rem 1rem', borderRadius: 10, border: 'none',
                        background: 'linear-gradient(135deg, #A27B5A, #8a6547)',
                        color: '#fff', fontSize: '0.875rem', fontWeight: 600,
                        cursor: 'pointer', opacity: !chatInput.trim() ? 0.5 : 1
                      }}>→</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pacientes-layout { flex-direction: column !important; }
        }
      `}</style>
    </div>
  )
}
