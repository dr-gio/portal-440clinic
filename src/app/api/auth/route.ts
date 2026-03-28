import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/auth — lista usuarios activos (sin PINs)
export async function GET() {
  const { data } = await supabaseAdmin
    .from('portal_usuarios')
    .select('id, nombre, rol')
    .eq('activo', true)
    .order('nombre')
  return NextResponse.json({ usuarios: data || [] })
}

// POST /api/auth — valida PIN para un usuario específico
export async function POST(req: Request) {
  try {
    const { pin, userId } = await req.json()
    if (!pin) return NextResponse.json({ ok: false, error: 'PIN requerido' })

    let query = supabaseAdmin
      .from('portal_usuarios')
      .select('*')
      .eq('pin', pin.toString())
      .eq('activo', true)

    // Si viene userId, valida contra ese usuario específico
    if (userId) query = query.eq('id', userId)

    const { data, error } = await query.maybeSingle()

    if (error) return NextResponse.json({ ok: false, error: error.message })
    if (!data)  return NextResponse.json({ ok: false, error: 'PIN incorrecto' })
    return NextResponse.json({ ok: true, usuario: data })
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
