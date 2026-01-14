import { useEffect, useRef, useState } from 'react'

type Props = {
  onRecorded: (file: File) => void
  onClear: () => void
}

type Status = 'idle' | 'recording' | 'ready' | 'error' | 'unsupported'

export function AudioRecorder({ onRecorded, onClear }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState<string>('')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    const supported = typeof window !== 'undefined' && 'MediaRecorder' in window
    if (!supported) setStatus('unsupported')
  }, [])

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [audioUrl])

  async function start() {
    try {
      setMessage('')
      chunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (evt) => {
        if (evt.data && evt.data.size > 0) chunksRef.current.push(evt.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        const file = new File([blob], `relato-${Date.now()}.webm`, { type: blob.type })

        if (audioUrl) URL.revokeObjectURL(audioUrl)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)

        setStatus('ready')
        onRecorded(file)

        // libera microfone
        streamRef.current?.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }

      recorder.start()
      setStatus('recording')
      setMessage('Gravação iniciada.')
    } catch {
      setStatus('error')
      setMessage('Não foi possível acessar o microfone.')
    }
  }

  function stop() {
    try {
      mediaRecorderRef.current?.stop()
      setMessage('Gravação finalizada.')
    } catch {
      setStatus('error')
      setMessage('Erro ao finalizar a gravação.')
    }
  }

  function clear() {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    setStatus('idle')
    setMessage('')
    onClear()
  }

  if (status === 'unsupported') {
    return (
      <div className="field">
        <p className="muted">Gravação não suportada neste navegador. Use “Enviar arquivo de áudio”.</p>
      </div>
    )
  }

  return (
    <div className="field">
      <div className="field-row">
        {status !== 'recording' && (
          <button type="button" onClick={start}>
            Gravar áudio
          </button>
        )}

        {status === 'recording' && (
          <button type="button" onClick={stop}>
            Parar gravação
          </button>
        )}

        {status === 'ready' && (
          <button type="button" onClick={clear}>
            Remover áudio
          </button>
        )}
      </div>

      <p className="muted" role="status" aria-live="polite">
        {message}
      </p>

      {audioUrl && (
        <audio controls src={audioUrl}>
          Seu navegador não suporta áudio.
        </audio>
      )}
    </div>
  )
}
