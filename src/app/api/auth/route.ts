import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { pin } = await req.json()
    if (!pin) return NextResponse.json({ ok: false, error: 'PIN requerido' })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ ok: false, error: 'Config error', url: !!url, key: !!key })

    const admin = createClient(url, key)
    const { data, error } = await admin
      .from('portal_usuarios')
      .select('*')
      .eq('pin', pin.toString())
      .eq('activo', true)
      .maybeSingle()

    if (error) return NextResponse.json({ ok: false, error: error.message, code: error.code })
    if (!data) return NextResponse.json({ ok: false, error: 'PIN incorrecto', pin_recibido: pin.toString() })
    return NextResponse.json({ ok: true, usuario: data })
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
