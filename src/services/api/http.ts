export class HttpError extends Error {
  status: number
  bodyText?: string

  constructor(message: string, status: number, bodyText?: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.bodyText = bodyText
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

function joinUrl(path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalized}`
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(joinUrl(path), init)

  if (!res.ok) {
    const bodyText = await res.text().catch(() => undefined)
    throw new HttpError(`Erro HTTP ${res.status}`, res.status, bodyText)
  }

  // 204 No Content
  if (res.status === 204) return undefined as T

  return (await res.json()) as T
}
