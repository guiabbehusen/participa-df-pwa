import { apiFetch } from '../../../services/api/http'
import type {
  CreateManifestationResponse,
  ManifestationFormData,
  ManifestationStatusResponse,
} from '../types/manifestation'

export async function createManifestation(data: ManifestationFormData) {
  const fd = new FormData()
  fd.append('kind', data.kind)
  fd.append('subject', data.subject)
  fd.append('descriptionText', data.descriptionText ?? '')
  fd.append('anonymous', String(Boolean(data.anonymous)))

  if (data.audioFile) fd.append('audioFile', data.audioFile)
  fd.append('audioTranscript', data.audioTranscript ?? '')

  if (data.imageFile) fd.append('imageFile', data.imageFile)
  fd.append('imageAlt', data.imageAlt ?? '')

  if (data.videoFile) fd.append('videoFile', data.videoFile)
  fd.append('videoDescription', data.videoDescription ?? '')

  return apiFetch<CreateManifestationResponse>('/manifestations', {
    method: 'POST',
    body: fd,
  })
}

export async function getManifestationStatus(protocol: string) {
  const safe = encodeURIComponent(protocol)
  return apiFetch<ManifestationStatusResponse>(`/manifestations/${safe}`, { method: 'GET' })
}
