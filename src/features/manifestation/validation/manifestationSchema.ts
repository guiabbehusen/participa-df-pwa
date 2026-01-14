import { z } from 'zod'
import type { ManifestationFormData } from '../types/manifestation'

const fileSchema = z
  .custom<File>((val) => val instanceof File, { message: 'Arquivo inválido' })
  .optional()
  .nullable()

export const manifestationSchema: z.ZodType<ManifestationFormData> = z
  .object({
    kind: z.enum(['reclamacao', 'denuncia', 'sugestao', 'elogio']),
    subject: z.string().trim().min(3, 'Informe um assunto (mín. 3 caracteres).'),

    descriptionText: z.string().trim().optional(),

    audioFile: fileSchema,
    audioTranscript: z.string().trim().optional(),

    imageFile: fileSchema,
    imageAlt: z.string().trim().optional(),

    videoFile: fileSchema,
    videoDescription: z.string().trim().optional(),

    anonymous: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const hasText = (data.descriptionText ?? '').trim().length >= 10
    const hasAudio = Boolean(data.audioFile)

    if (!hasText && !hasAudio) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['descriptionText'],
        message: 'Escreva o relato (mín. 10 caracteres) ou envie/grave um áudio.',
      })
    }

    if (data.audioFile && !(data.audioTranscript ?? '').trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['audioTranscript'],
        message: 'Para acessibilidade, informe a transcrição/resumo do áudio.',
      })
    }

    if (data.imageFile && !(data.imageAlt ?? '').trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['imageAlt'],
        message: 'Para acessibilidade, descreva a imagem (texto alternativo).',
      })
    }

    if (data.videoFile && !(data.videoDescription ?? '').trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['videoDescription'],
        message: 'Para acessibilidade, descreva o vídeo (legenda/descrição).',
      })
    }
  })
