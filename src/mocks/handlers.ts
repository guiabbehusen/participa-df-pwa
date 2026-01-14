import { http, HttpResponse } from 'msw'

type RecordStatus = 'Recebido' | 'Em análise' | 'Respondido'

type ManifestationRecord = {
  protocol: string
  createdAt: string
  status: RecordStatus
  subject?: string
}

const db = new Map<string, ManifestationRecord>()

function generateProtocol() {
  const year = new Date().getFullYear()
  const seq = String(Math.floor(Math.random() * 900000) + 100000)
  return `DF-${year}-${seq}`
}

export const handlers = [
  http.post('/api/manifestations', async ({ request }) => {
    const createdAt = new Date().toISOString()
    const protocol = generateProtocol()

    // Opcional: captura subject do FormData
    let subject: string | undefined
    try {
      const fd = await request.formData()
      subject = String(fd.get('subject') ?? '') || undefined
    } catch {
      subject = undefined
    }

    const record: ManifestationRecord = {
      protocol,
      createdAt,
      status: 'Recebido',
      subject,
    }

    db.set(protocol, record)

    return HttpResponse.json({ protocol, createdAt }, { status: 201 })
  }),

  http.get('/api/manifestations/:protocol', ({ params }) => {
    const protocol = String(params.protocol)
    const record = db.get(protocol)

    if (!record) {
      return HttpResponse.json({ message: 'Protocolo não encontrado' }, { status: 404 })
    }

    return HttpResponse.json(record, { status: 200 })
  }),
]
