import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q      = searchParams.get('q') || ''
  const cedula = searchParams.get('cedula') || ''

  if (cedula) {
    const [{ data: paciente }, { data: docs }, { data: pagos }] = await Promise.all([
      supabaseAdmin.from('pacientes').select('*').eq('cedula', cedula).maybeSingle(),
      supabaseAdmin.from('documentos_paciente').select('*')
        .eq('cedula_paciente', cedula).order('fecha_generacion', { ascending: false }),
      supabaseAdmin.from('pagos').select('*')
        .eq('cedula_paciente', cedula).order('fecha_pago', { ascending: false }),
    ])
    return NextResponse.json({ data: { ...paciente, documentos_paciente: docs || [], pagos: pagos || [] } })
  }

  let query = supabaseAdmin
    .from('pacientes')
    .select('cedula, nombre, telefono, email, total_presupuesto, total_pagado, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (q) query = query.or(`nombre.ilike.%${q}%,cedula.ilike.%${q}%,telefono.ilike.%${q}%`)

  const { data } = await query
  return NextResponse.json({ data: data || [] })
}
