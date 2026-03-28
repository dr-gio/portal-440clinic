'use client'
import { useState } from 'react'
import { Usuario } from '@/app/page'
import Pacientes from './Pacientes'

interface Props { usuario: Usuario; onLogout: () => void }

const MODULES = [
  { id: 'inicio',        label: 'Inicio',         icon: '🏠', roles: ['dr_gio','contabilidad','suite','asesora','sharon'] },
  { id: 'pacientes',     label: 'Pacientes',       icon: '👥', roles: ['dr_gio','contabilidad','suite','asesora','sharon'] },
  { id: 'suite',         label: 'Suite Médica',    icon: '💊', roles: ['dr_gio','suite','sharon'] },
  { id: 'contabilidad',  label: 'Contabilidad',    icon: '💰', roles: ['dr_gio','contabilidad'] },
  { id: 'comisiones',    label: 'Mis Comisiones',  icon: '📊', roles: ['asesora','sharon'] },
  { id: 'config',        label: 'Configuración',   icon: '⚙️', roles: ['dr_gio'] },
]

const ROL_LABELS: Record<string, string> = {
  dr_gio: 'Dr. Gio', suite: 'Suite Médica', asesora: 'Asesora',
  sharon: 'Dra. Sharon', contabilidad: 'Auxiliar Contable'
}

export default function Portal({ usuario, onLogout }: Props) {
  const [tab, setTab] = useState('pacientes')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const visibles = MODULES.filter(m => m.roles.includes(usuario.rol))

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d1b2a' }}>

      {/* Sidebar */}
      <div style={{
        width: 240, background: '#1a2a3a', borderRight: '1px solid #2a4060',
        display: 'flex', flexDirection: 'column', position: 'fixed',
        top: 0, left: 0, bottom: 0, zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : undefined,
      }} className="hidden-mobile-sidebar">

        {/* Logo */}
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid #2a4060' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #A27B5A, #8a6547)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0
            }}>440</div>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0', lineHeight: 1.2 }}>440 Clinic</p>
              <p style={{ fontSize: '0.7rem', color: '#9CB2BF' }}>Portal Clínico</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {visibles.map(m => (
            <button key={m.id} onClick={() => setTab(m.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '0.65rem 0.875rem', borderRadius: 10, border: 'none',
                background: tab === m.id ? 'rgba(162,123,90,0.15)' : 'transparent',
                color: tab === m.id ? '#A27B5A' : '#94a3b8',
                fontSize: '0.875rem', fontWeight: tab === m.id ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left', width: '100%',
                borderLeft: tab === m.id ? '3px solid #A27B5A' : '3px solid transparent',
              }}>
              <span style={{ fontSize: '1rem' }}>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid #2a4060' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>{usuario.nombre}</p>
              <p style={{ fontSize: '0.7rem', color: '#9CB2BF' }}>{ROL_LABELS[usuario.rol]}</p>
            </div>
            <button onClick={onLogout}
              style={{
                padding: '0.4rem 0.7rem', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)',
                background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: '0.75rem',
                cursor: 'pointer', fontWeight: 500
              }}>Salir</button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 56,
        background: '#1a2a3a', borderBottom: '1px solid #2a4060',
        display: 'flex', alignItems: 'center', padding: '0 1rem',
        justifyContent: 'space-between', zIndex: 40,
      }} className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #A27B5A, #8a6547)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff'
          }}>440</div>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0' }}>
            {visibles.find(m => m.id === tab)?.icon} {visibles.find(m => m.id === tab)?.label}
          </span>
        </div>
        <button onClick={onLogout} style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
          color: '#f87171', padding: '0.35rem 0.65rem', borderRadius: 8,
          fontSize: '0.75rem', cursor: 'pointer'
        }}>Salir</button>
      </div>

      {/* Mobile bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#1a2a3a', borderTop: '1px solid #2a4060',
        display: 'flex', zIndex: 40, padding: '0.5rem 0.25rem',
      }} className="mobile-bottom-nav">
        {visibles.slice(0, 5).map(m => (
          <button key={m.id} onClick={() => setTab(m.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 2, padding: '0.25rem', border: 'none', background: 'transparent',
              color: tab === m.id ? '#A27B5A' : '#64748b', cursor: 'pointer',
            }}>
            <span style={{ fontSize: '1.2rem' }}>{m.icon}</span>
            <span style={{ fontSize: '0.6rem', fontWeight: tab === m.id ? 600 : 400 }}>
              {m.label.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Main content */}
      <main style={{
        flex: 1, marginLeft: 240, padding: '1.5rem',
        minHeight: '100vh',
      }} className="portal-main">
        {tab === 'inicio' && <Inicio usuario={usuario} />}
        {tab === 'pacientes' && <Pacientes usuario={usuario} />}
        {tab === 'suite' && <ProximamenteCard titulo="Suite Médica" icon="💊" desc="Integración con suite-medica-440.vercel.app" />}
        {tab === 'contabilidad' && <ProximamenteCard titulo="Contabilidad" icon="💰" desc="Integración con contabilidad-440.vercel.app" />}
        {tab === 'comisiones' && <ProximamenteCard titulo="Mis Comisiones" icon="📊" desc="Módulo de comisiones en construcción" />}
        {tab === 'config' && <ProximamenteCard titulo="Configuración" icon="⚙️" desc="Panel de configuración del portal" />}
      </main>

      <style>{`
        .hidden-mobile-sidebar { display: flex !important; }
        .mobile-header { display: none !important; }
        .mobile-bottom-nav { display: none !important; }
        @media (max-width: 768px) {
          .hidden-mobile-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
          .mobile-bottom-nav { display: flex !important; }
          .portal-main { margin-left: 0 !important; padding: 0.75rem !important; padding-top: 4rem !important; padding-bottom: 5rem !important; }
        }
      `}</style>
    </div>
  )
}

function Inicio({ usuario }: { usuario: Usuario }) {
  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem' }}>
        Bienvenido, {usuario.nombre} 👋
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '0.9rem' }}>
        {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Portal Clínico', desc: 'Acceso centralizado a toda la información', icon: '🏥' },
          { label: 'Base de datos unificada', desc: 'Pacientes, documentos y finanzas en un solo lugar', icon: '🗃️' },
          { label: 'Chat IA', desc: 'Consulta el expediente de cualquier paciente con IA', icon: '🤖' },
        ].map(c => (
          <div key={c.label} style={{
            background: '#1a2a3a', border: '1px solid #2a4060', borderRadius: 12,
            padding: '1.25rem',
          }}>
            <span style={{ fontSize: '2rem' }}>{c.icon}</span>
            <p style={{ fontWeight: 600, color: '#e2e8f0', marginTop: '0.75rem', fontSize: '0.9rem' }}>{c.label}</p>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProximamenteCard({ titulo, icon, desc }: { titulo: string; icon: string; desc: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '3rem' }}>{icon}</span>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e2e8f0', marginTop: '1rem' }}>{titulo}</h2>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.9rem' }}>{desc}</p>
        <div style={{
          marginTop: '1rem', display: 'inline-block', padding: '0.5rem 1rem',
          background: 'rgba(162,123,90,0.1)', border: '1px solid rgba(162,123,90,0.3)',
          borderRadius: 8, color: '#A27B5A', fontSize: '0.8rem', fontWeight: 500
        }}>🚧 Próximamente</div>
      </div>
    </div>
  )
}
