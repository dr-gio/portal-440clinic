'use client'
import { useState, useEffect } from 'react'
import PinScreen from '@/components/PinScreen'
import Portal from '@/components/Portal'

export interface Usuario {
  id: string
  nombre: string
  pin: string
  rol: 'dr_gio' | 'suite' | 'asesora' | 'sharon' | 'contabilidad'
  activo: boolean
}

export default function Home() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('portal_user')
    if (saved) setUsuario(JSON.parse(saved))
  }, [])

  const handleLogin = (u: Usuario) => {
    sessionStorage.setItem('portal_user', JSON.stringify(u))
    setUsuario(u)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('portal_user')
    setUsuario(null)
  }

  if (!usuario) return <PinScreen onLogin={handleLogin} />
  return <Portal usuario={usuario} onLogout={handleLogout} />
}
