import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const { pin } = await req.json()
  if (!pin) return NextResponse.json({ ok: false, error: 'PIN requerido' })

  const { data, error } = await supabaseAdmin
    .from('portal_usuarios')
    .select('*')
    .eq('pin', pin.toString())
    .eq('activo', true)
    .maybeSingle()

  if (error || !data) return NextResponse.json({ ok: false, error: 'PIN incorrecto' })
  return NextResponse.json({ ok: true, usuario: data })
}
