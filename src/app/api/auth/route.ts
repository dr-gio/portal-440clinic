import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Usa anon key — portal_usuarios no tiene RLS
function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// GET /api/auth — lista usuarios activos (sin PINs)
export async function GET() {
  const { data, error } = await db()
    .from('portal_usuarios')
    .select('id, nombre, rol')
    .eq('activo', true)
    .order('nombre')
  if (error) return NextResponse.json({ usuarios: [], error: error.message })
  return NextResponse.json({ usuarios: data || [] })
}

// POST /api/auth — valida PIN para un usuario específico
export async function POST(req: Request) {
  try {
    const { pin, userId } = await req.json()
    if (!pin) return NextResponse.json({ ok: false, error: 'PIN requerido' })

    let query = db()
      .from('portal_usuarios')
      .select('*')
      .eq('pin', pin.toString())
      .eq('activo', true)

    if (userId) query = query.eq('id', userId)

    const { data, error } = await query.maybeSingle()

    if (error) return NextResponse.json({ ok: false, error: error.message })
    if (!data)  return NextResponse.json({ ok: false, error: 'PIN incorrecto' })
    return NextResponse.json({ ok: true, usuario: data })
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
