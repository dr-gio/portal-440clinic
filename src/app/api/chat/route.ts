import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_KEY })

export async function POST(req: Request) {
  const { messages, paciente, rol } = await req.json()

  const puedeVerFinanciero = ['dr_gio', 'contabilidad'].includes(rol)

  const systemPrompt = `Eres el asistente clínico de 440 Clinic. Tienes acceso al expediente completo del paciente.

PACIENTE ACTIVO:
- Nombre: ${paciente.nombre}
- Cédula: ${paciente.cedula}
- Teléfono: ${paciente.telefono || '—'}
- Email: ${paciente.email || '—'}
${puedeVerFinanciero ? `
INFORMACIÓN FINANCIERA:
- Presupuesto total: $${Number(paciente.total_presupuesto || 0).toLocaleString('es-CO')}
- Total pagado: $${Number(paciente.total_pagado || 0).toLocaleString('es-CO')}
- Saldo pendiente: $${Number((paciente.total_presupuesto || 0) - (paciente.total_pagado || 0)).toLocaleString('es-CO')}
- Pagos: ${JSON.stringify(paciente.pagos || [])}
` : ''}
DOCUMENTOS: ${JSON.stringify((paciente.documentos_paciente || []).map((d: any) => ({ tipo: d.tipo_documento, fecha: d.fecha_generacion, nombre: d.nombre_archivo })))}

INSTRUCCIONES:
- Responde en español, de forma concisa y profesional
- ${puedeVerFinanciero ? 'Puedes compartir información financiera del paciente' : 'NO compartas información financiera — no tienes acceso a ella con tu rol'}
- Si no tienes la información solicitada, dilo claramente`

  const r = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m: any) => ({ role: m.role, content: m.content }))
  })

  return NextResponse.json({ ok: true, content: r.content[0].type === 'text' ? r.content[0].text : '' })
}
