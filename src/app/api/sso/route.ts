import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// POST /api/sso — crea token SSO para el usuario autenticado
export async function POST(req: Request) {
  const { portal_rol, nombre } = await req.json()
  if (!portal_rol || !nombre) return NextResponse.json({ error: 'missing fields' }, { status: 400 })

  const { data, error } = await db()
    .from('portal_sesiones')
    .insert({ portal_rol, nombre })
    .select('token')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ token: data.token })
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

// GET /api/sso?token=xxx — valida token y lo marca como usado
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'no token' }, { status: 400, headers: CORS })

  const client = db()

  const { data, error } = await client
    .from('portal_sesiones')
    .select('*')
    .eq('token', token)
    .eq('usado', false)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (error || !data) return NextResponse.json({ error: 'token inválido o expirado' }, { status: 401, headers: CORS })

  await client.from('portal_sesiones').update({ usado: true }).eq('token', token)

  return NextResponse.json({ portal_rol: data.portal_rol, nombre: data.nombre }, { headers: CORS })
}
