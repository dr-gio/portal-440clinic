'use client'
import { useState, useEffect, useCallback } from 'react'
import PinScreen from '@/components/PinScreen'
import Portal from '@/components/Portal'
import SplashScreen from '@/components/SplashScreen'

export interface Usuario {
  id: string; nombre: string; pin: string
  rol: 'dr_gio'|'suite'|'asesora'|'sharon'|'contabilidad'; activo: boolean
}

export default function Home() {
  const [usuario,    setUsuario]    = useState<Usuario | null>(null)
  const [theme,      setTheme]      = useState<'light'|'dark'>('dark')
  const [showIntro,  setShowIntro]  = useState(false)
  const [pendingUser, setPendingUser] = useState<Usuario | null>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('portal_user')
    if (saved) setUsuario(JSON.parse(saved))
    const t = localStorage.getItem('portal_theme') as 'light'|'dark' || 'dark'
    setTheme(t)
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('portal_theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  // PIN correcto → guardar usuario pendiente y mostrar video
  const handleLogin = (u: Usuario) => {
    sessionStorage.setItem('portal_user', JSON.stringify(u))
    setPendingUser(u)
    setShowIntro(true)
  }

  // Video termina → entrar al portal
  const handleIntroDone = useCallback(() => {
    setShowIntro(false)
    setUsuario(pendingUser)
  }, [pendingUser])

  const handleLogout = () => {
    sessionStorage.removeItem('portal_user')
    setUsuario(null)
    setPendingUser(null)
  }

  if (showIntro)  return <SplashScreen onDone={handleIntroDone} />
  if (!usuario)   return <PinScreen onLogin={handleLogin} theme={theme} onToggleTheme={toggleTheme} />
  return <Portal usuario={usuario} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />
}
