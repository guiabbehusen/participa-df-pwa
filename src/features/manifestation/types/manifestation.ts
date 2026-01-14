export type ManifestationKind = 'reclamacao' | 'denuncia' | 'sugestao' | 'elogio'

export type ManifestationFormData = {
  kind: ManifestationKind
  subject: string

  descriptionText?: string

  audioFile?: File | null
  audioTranscript?: string

  imageFile?: File | null
  imageAlt?: string

  videoFile?: File | null
  videoDescription?: string

  anonymous: boolean
}

export type CreateManifestationResponse = {
  protocol: string
  createdAt: string
}

export type ManifestationStatusResponse = {
  protocol: string
  createdAt: string
  status: 'Recebido' | 'Em análise' | 'Respondido'
  subject?: string
}
