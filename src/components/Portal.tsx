'use client'
import { useState } from 'react'
import { Usuario } from '@/app/page'
import Pacientes from './Pacientes'

interface Props { usuario: Usuario; onLogout: () => void; theme: 'light'|'dark'; onToggleTheme: () => void }

const MODULES = [
  { id:'inicio',       label:'Inicio',        icon:'🏠', roles:['dr_gio','contabilidad','suite','asesora','sharon'] },
  { id:'pacientes',    label:'Pacientes',      icon:'👥', roles:['dr_gio','contabilidad','suite','asesora','sharon'] },
  { id:'suite',        label:'Suite Médica',   icon:'💊', roles:['dr_gio','suite','sharon'] },
  { id:'contabilidad', label:'Contabilidad',   icon:'💰', roles:['dr_gio','contabilidad'] },
  { id:'comisiones',   label:'Mis Comisiones', icon:'📊', roles:['asesora','sharon'] },
  { id:'config',       label:'Configuración',  icon:'⚙️', roles:['dr_gio'] },
]

const ROL_LABELS: Record<string,string> = {
  dr_gio:'Dr. Gio', suite:'Suite Médica', asesora:'Asesora',
  sharon:'Dra. Sharon', contabilidad:'Auxiliar Contable'
}

export default function Portal({ usuario, onLogout, theme, onToggleTheme }: Props) {
  const [tab, setTab] = useState('pacientes')
  const isDark = theme === 'dark'

  const sidebarBg    = '#1e293b'
  const sidebarBorder= '#334155'
  const mainBg       = isDark ? '#0f172a' : '#f1f5f9'
  const cardBg       = isDark ? '#1e293b' : '#ffffff'
  const border       = isDark ? '#334155' : '#e2e8f0'
  const textMain     = isDark ? '#f8fafc'  : '#0f172a'
  const textMut      = isDark ? '#94a3b8'  : '#64748b'

  const visibles = MODULES.filter(m => m.roles.includes(usuario.rol))

  return (
    <div style={{ display:'flex', minHeight:'100vh', background: mainBg }}>

      {/* Sidebar */}
      <aside style={{
        width:240, background: sidebarBg, borderRight:'1px solid '+sidebarBorder,
        display:'flex', flexDirection:'column', position:'fixed',
        top:0, left:0, bottom:0, zIndex:50,
      }} className="portal-sidebar">

        {/* Logo */}
        <div style={{ padding:'1.25rem 1rem', borderBottom:'1px solid '+sidebarBorder }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              width:40, height:40, borderRadius:10, flexShrink:0,
              background:'linear-gradient(135deg, #2563eb, #1d4ed8)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <span style={{ color:'#fff', fontWeight:700, fontSize:'0.85rem' }}>440</span>
            </div>
            <div>
              <p style={{ fontSize:'0.9rem', fontWeight:700, color:'#f8fafc', lineHeight:1.2 }}>440 Clinic</p>
              <p style={{ fontSize:'0.65rem', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Portal Clínico</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'0.75rem', display:'flex', flexDirection:'column', gap:2 }}>
          {visibles.map(m => {
            const active = tab === m.id
            return (
              <button key={m.id} onClick={() => setTab(m.id)} style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'0.6rem 0.875rem', borderRadius:10, border:'none',
                background: active ? 'rgba(37,99,235,0.15)' : 'transparent',
                color: active ? '#60a5fa' : '#94a3b8',
                fontSize:'0.875rem', fontWeight: active ? 600 : 400,
                cursor:'pointer', textAlign:'left', width:'100%',
                borderLeft: active ? '3px solid #2563eb' : '3px solid transparent',
                transition:'all 0.15s', fontFamily:'Outfit, sans-serif',
              }}>
                <span style={{ fontSize:'1rem', width:20, textAlign:'center' }}>{m.icon}</span>
                {m.label}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding:'0.75rem', borderTop:'1px solid '+sidebarBorder }}>
          {/* Theme toggle */}
          <button onClick={onToggleTheme} style={{
            width:'100%', padding:'0.5rem', borderRadius:8, border:'1px solid '+sidebarBorder,
            background:'transparent', color:'#94a3b8', fontSize:'0.8rem',
            cursor:'pointer', display:'flex', alignItems:'center', gap:6,
            justifyContent:'center', marginBottom:'0.5rem', fontFamily:'Outfit, sans-serif',
          }}>{isDark ? '☀️ Modo claro' : '🌙 Modo oscuro'}</button>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 0.25rem' }}>
            <div>
              <p style={{ fontSize:'0.8rem', fontWeight:600, color:'#f8fafc' }}>{usuario.nombre}</p>
              <p style={{ fontSize:'0.7rem', color:'#94a3b8' }}>{ROL_LABELS[usuario.rol]}</p>
            </div>
            <button onClick={onLogout} style={{
              padding:'0.35rem 0.65rem', borderRadius:8,
              border:'1px solid rgba(239,68,68,0.3)',
              background:'rgba(239,68,68,0.08)',
              color:'#f87171', fontSize:'0.75rem', cursor:'pointer',
            }}>Salir</button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header style={{
        position:'fixed', top:0, left:0, right:0, height:56,
        background: sidebarBg, borderBottom:'1px solid '+sidebarBorder,
        display:'flex', alignItems:'center', padding:'0 1rem',
        justifyContent:'space-between', zIndex:40,
      }} className="portal-mobile-header">
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{
            width:30, height:30, borderRadius:8,
            background:'linear-gradient(135deg, #2563eb, #1d4ed8)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'0.75rem', fontWeight:700, color:'#fff',
          }}>440</div>
          <span style={{ fontSize:'0.9rem', fontWeight:600, color:'#f8fafc' }}>
            {visibles.find(m=>m.id===tab)?.icon} {visibles.find(m=>m.id===tab)?.label}
          </span>
        </div>
        <div style={{ display:'flex', gap:6 }}>
          <button onClick={onToggleTheme} style={{
            background:'rgba(255,255,255,0.05)', border:'1px solid '+sidebarBorder,
            color:'#94a3b8', padding:'0.35rem 0.6rem', borderRadius:8,
            fontSize:'0.85rem', cursor:'pointer',
          }}>{isDark ? '☀️' : '🌙'}</button>
          <button onClick={onLogout} style={{
            background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.3)',
            color:'#f87171', padding:'0.35rem 0.65rem', borderRadius:8,
            fontSize:'0.75rem', cursor:'pointer',
          }}>Salir</button>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav style={{
        position:'fixed', bottom:0, left:0, right:0,
        background: sidebarBg, borderTop:'1px solid '+sidebarBorder,
        display:'flex', zIndex:40, padding:'0.4rem 0.25rem 0.6rem',
      }} className="portal-mobile-nav">
        {visibles.slice(0,5).map(m => (
          <button key={m.id} onClick={() => setTab(m.id)} style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2,
            padding:'0.25rem', border:'none', background:'transparent',
            color: tab===m.id ? '#60a5fa' : '#64748b', cursor:'pointer',
            fontFamily:'Outfit, sans-serif',
          }}>
            <span style={{ fontSize:'1.1rem' }}>{m.icon}</span>
            <span style={{ fontSize:'0.6rem', fontWeight: tab===m.id ? 600 : 400 }}>{m.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>

      {/* Main */}
      <main style={{ flex:1, marginLeft:240, padding:'1.5rem', minHeight:'100vh' }} className="portal-main">
        {tab==='inicio'       && <Inicio usuario={usuario} cardBg={cardBg} border={border} textMain={textMain} textMut={textMut} />}
        {tab==='pacientes'    && <Pacientes usuario={usuario} theme={theme} />}
        {tab==='suite'        && <Proximamente titulo="Suite Médica" icon="💊" desc="Integración con suite-medica-440.vercel.app" url="https://suite-medica-440.vercel.app" cardBg={cardBg} border={border} textMain={textMain} textMut={textMut} />}
        {tab==='contabilidad' && <Proximamente titulo="Contabilidad" icon="💰" desc="Integración con contabilidad-440.vercel.app" url="https://contabilidad-440.vercel.app" cardBg={cardBg} border={border} textMain={textMain} textMut={textMut} />}
        {tab==='comisiones'   && <Proximamente titulo="Mis Comisiones" icon="📊" desc="Módulo de comisiones" cardBg={cardBg} border={border} textMain={textMain} textMut={textMut} />}
        {tab==='config'       && <Proximamente titulo="Configuración" icon="⚙️" desc="Panel de configuración" cardBg={cardBg} border={border} textMain={textMain} textMut={textMut} />}
      </main>

      <style>{`
        .portal-sidebar { display:flex !important; }
        .portal-mobile-header { display:none !important; }
        .portal-mobile-nav { display:none !important; }
        @media (max-width:768px) {
          .portal-sidebar { display:none !important; }
          .portal-mobile-header { display:flex !important; }
          .portal-mobile-nav { display:flex !important; }
          .portal-main { margin-left:0 !important; padding:0.75rem !important; padding-top:4.5rem !important; padding-bottom:5rem !important; }
        }
      `}</style>
    </div>
  )
}

function Inicio({ usuario, cardBg, border, textMain, textMut }: { usuario: Usuario; cardBg:string; border:string; textMain:string; textMut:string }) {
  return (
    <div>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontSize:'1.5rem', fontWeight:700, color:textMain, letterSpacing:'-0.5px' }}>
          Bienvenido, {usuario.nombre} 👋
        </h1>
        <p style={{ color:textMut, marginTop:4, fontSize:'0.875rem' }}>
          {new Date().toLocaleDateString('es-CO',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
        </p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:'1rem' }}>
        {[
          { label:'Portal Clínico Unificado', desc:'Acceso centralizado a toda la información de 440 Clinic', icon:'🏥', color:'#2563eb' },
          { label:'Base de datos unificada', desc:'Pacientes, documentos y finanzas en un solo lugar', icon:'🗃️', color:'#10b981' },
          { label:'Chat IA por paciente', desc:'Consulta el expediente completo con inteligencia artificial', icon:'🤖', color:'#8b5cf6' },
        ].map(c => (
          <div key={c.label} style={{ background:cardBg, border:'1px solid '+border, borderRadius:14, padding:'1.25rem' }}>
            <div style={{
              width:44, height:44, borderRadius:10, marginBottom:'1rem',
              background: c.color+'20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem'
            }}>{c.icon}</div>
            <p style={{ fontWeight:600, color:textMain, fontSize:'0.9rem' }}>{c.label}</p>
            <p style={{ fontSize:'0.8rem', color:textMut, marginTop:'0.25rem' }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Proximamente({ titulo, icon, desc, url, cardBg, border, textMain, textMut }:
  { titulo:string; icon:string; desc:string; url?:string; cardBg:string; border:string; textMain:string; textMut:string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
      <div style={{ textAlign:'center', background:cardBg, border:'1px solid '+border, borderRadius:16, padding:'3rem 2.5rem', maxWidth:400 }}>
        <span style={{ fontSize:'3rem' }}>{icon}</span>
        <h2 style={{ fontSize:'1.25rem', fontWeight:700, color:textMain, marginTop:'1rem' }}>{titulo}</h2>
        <p style={{ color:textMut, marginTop:'0.5rem', fontSize:'0.875rem' }}>{desc}</p>
        {url && (
          <a href={url} target="_blank" rel="noreferrer" style={{
            display:'inline-block', marginTop:'1.25rem', padding:'0.6rem 1.25rem',
            background:'rgba(37,99,235,0.1)', border:'1px solid rgba(37,99,235,0.3)',
            borderRadius:10, color:'#60a5fa', fontSize:'0.85rem', fontWeight:500,
            textDecoration:'none',
          }}>🔗 Abrir app →</a>
        )}
        <div style={{
          marginTop:'0.75rem', display:'inline-block', padding:'0.4rem 1rem',
          background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)',
          borderRadius:8, color:'#fbbf24', fontSize:'0.8rem', fontWeight:500,
        }}>🚧 Integración próximamente</div>
      </div>
    </div>
  )
}
