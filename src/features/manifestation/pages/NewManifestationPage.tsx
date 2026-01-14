import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import { IZAAssistant } from '../../iza/components/IZAAssistant'
import { AudioRecorder } from '../../../components/media/AudioRecorder'
import { manifestationSchema } from '../validation/manifestationSchema'
import type { ManifestationFormData } from '../types/manifestation'
import { createManifestation } from '../api/manifestationApi'
import {
  clearNewManifestationDraft,
  loadNewManifestationDraft,
  saveNewManifestationDraft,
} from '../../../services/storage/draftDb'

type Step = 1 | 2 | 3

const DEFAULT_VALUES: ManifestationFormData = {
  kind: 'reclamacao',
  subject: '',
  descriptionText: '',
  anonymous: false,
  audioFile: null,
  audioTranscript: '',
  imageFile: null,
  imageAlt: '',
  videoFile: null,
  videoDescription: '',
}

export function NewManifestationPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [draftStatus, setDraftStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const form = useForm<ManifestationFormData>({
    resolver: zodResolver(manifestationSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched',
  })

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    trigger,
    formState: { errors },
    control,
    watch,
  } = form

  const watched = useWatch({ control })
  const descriptionText = watch('descriptionText') || ''
  const imageFile = watch('imageFile')
  const videoFile = watch('videoFile')
  const audioFile = watch('audioFile')

  // Carrega rascunho (sem anexos)
  useEffect(() => {
    loadNewManifestationDraft().then((draft) => {
      if (draft) {
        reset({ ...DEFAULT_VALUES, ...draft, audioFile: null, imageFile: null, videoFile: null })
      }
    })
  }, [reset])

  // Salva rascunho (debounce)
  useEffect(() => {
    const { audioFile, imageFile, videoFile, ...draft } = watched

    setDraftStatus('saving')
    const t = window.setTimeout(() => {
      saveNewManifestationDraft(draft)
        .then(() => setDraftStatus('saved'))
        .catch(() => setDraftStatus('error'))
    }, 450)

    return () => window.clearTimeout(t)
  }, [watched])

  const imagePreviewUrl = useMemo(() => {
    if (!imageFile) return null
    return URL.createObjectURL(imageFile)
  }, [imageFile])

  const videoPreviewUrl = useMemo(() => {
    if (!videoFile) return null
    return URL.createObjectURL(videoFile)
  }, [videoFile])

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl)
    }
  }, [imagePreviewUrl, videoPreviewUrl])

  async function goNext() {
    const fields =
      step === 1
        ? (['kind', 'subject'] as const)
        : step === 2
          ? ([
              'descriptionText',
              'audioFile',
              'audioTranscript',
              'imageFile',
              'imageAlt',
              'videoFile',
              'videoDescription',
            ] as const)
          : (['anonymous'] as const)

    const ok = await trigger(fields, { shouldFocus: true })
    if (ok) setStep((s) => ((s + 1) as Step))
  }

  function goBack() {
    setStep((s) => ((s - 1) as Step))
  }

  async function onClearDraft() {
    reset(DEFAULT_VALUES)
    await clearNewManifestationDraft()
    setDraftStatus('idle')
  }

  const onSubmit = async (data: ManifestationFormData) => {
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      const res = await createManifestation(data)
      await clearNewManifestationDraft()
      navigate(`/protocolos/${encodeURIComponent(res.protocol)}`)
    } catch (e) {
      setSubmitError('Não foi possível enviar agora. Verifique sua conexão e tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page">
      <h1>Registrar manifestação</h1>
      <p className="muted">
        Preencha por texto ou áudio e anexe evidências. Campos de acessibilidade (alt/descrição/transcrição)
        são obrigatórios quando houver mídia.
      </p>

      <ol className="stepper" aria-label="Etapas do formulário">
        <li aria-current={step === 1 ? 'step' : undefined}>1. Tipo</li>
        <li aria-current={step === 2 ? 'step' : undefined}>2. Relato e anexos</li>
        <li aria-current={step === 3 ? 'step' : undefined}>3. Revisão e envio</li>
      </ol>

      <div className="status-row" role="status" aria-live="polite">
        {draftStatus === 'saving' && <span className="muted">Salvando rascunho…</span>}
        {draftStatus === 'saved' && <span className="muted">Rascunho salvo.</span>}
        {draftStatus === 'error' && <span className="muted">Não foi possível salvar o rascunho.</span>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form">
        {step === 1 && (
          <>
            <fieldset className="field">
              <legend>Tipo de manifestação</legend>

              <label className="radio">
                <input type="radio" value="reclamacao" {...register('kind')} />
                Reclamação
              </label>
              <label className="radio">
                <input type="radio" value="denuncia" {...register('kind')} />
                Denúncia
              </label>
              <label className="radio">
                <input type="radio" value="sugestao" {...register('kind')} />
                Sugestão
              </label>
              <label className="radio">
                <input type="radio" value="elogio" {...register('kind')} />
                Elogio
              </label>
            </fieldset>

            <div className="field">
              <label htmlFor="subject">Assunto</label>
              <input
                id="subject"
                type="text"
                {...register('subject')}
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={errors.subject ? 'subject-error' : 'subject-hint'}
                placeholder="Ex.: Iluminação pública, pavimentação, atendimento..."
              />
              <p id="subject-hint" className="muted">
                Use termos simples e objetivos.
              </p>
              {errors.subject && (
                <p id="subject-error" className="error">
                  {errors.subject.message}
                </p>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="two-col">
              <div>
                <div className="field">
                  <label htmlFor="descriptionText">Relato (texto)</label>
                  <textarea
                    id="descriptionText"
                    rows={6}
                    {...register('descriptionText')}
                    aria-invalid={Boolean(errors.descriptionText)}
                    aria-describedby={errors.descriptionText ? 'desc-error' : 'desc-hint'}
                    placeholder="Descreva o que aconteceu, onde e quando..."
                  />
                  <p id="desc-hint" className="muted">
                    Você pode enviar por texto ou por áudio (ou ambos).
                  </p>
                  {errors.descriptionText && (
                    <p id="desc-error" className="error">
                      {errors.descriptionText.message}
                    </p>
                  )}
                </div>

                <div className="field">
                  <h2 className="h3">Relato por áudio</h2>
                  <AudioRecorder
                    onRecorded={(file) => setValue('audioFile', file, { shouldValidate: true })}
                    onClear={() => setValue('audioFile', null, { shouldValidate: true })}
                  />

                  <label htmlFor="audioTranscript">Transcrição / resumo do áudio (obrigatório se houver áudio)</label>
                  <textarea
                    id="audioTranscript"
                    rows={3}
                    {...register('audioTranscript')}
                    aria-invalid={Boolean(errors.audioTranscript)}
                    aria-describedby={errors.audioTranscript ? 'audioTx-error' : undefined}
                    placeholder="Escreva um resumo do que foi dito no áudio (acessibilidade)."
                  />
                  {errors.audioTranscript && (
                    <p id="audioTx-error" className="error">
                      {errors.audioTranscript.message}
                    </p>
                  )}

                  <p className="muted">
                    {audioFile ? `Áudio anexado: ${audioFile.name}` : 'Nenhum áudio anexado.'}
                  </p>
                </div>

                <div className="field">
                  <h2 className="h3">Imagem</h2>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) =>
                      setValue('imageFile', e.target.files?.[0] ?? null, { shouldValidate: true })
                    }
                    aria-describedby="img-hint"
                  />
                  <p id="img-hint" className="muted">
                    Se anexar imagem, descreva no campo abaixo (alt).
                  </p>

                  {imagePreviewUrl && (
                    <img className="preview" src={imagePreviewUrl} alt="" />
                  )}

                  <label htmlFor="imageAlt">Descrição da imagem (alt) — obrigatório se houver imagem</label>
                  <input
                    id="imageAlt"
                    type="text"
                    {...register('imageAlt')}
                    aria-invalid={Boolean(errors.imageAlt)}
                    aria-describedby={errors.imageAlt ? 'imgAlt-error' : undefined}
                    placeholder="Ex.: Foto de um buraco na via em frente ao número 123."
                  />
                  {errors.imageAlt && (
                    <p id="imgAlt-error" className="error">
                      {errors.imageAlt.message}
                    </p>
                  )}
                </div>

                <div className="field">
                  <h2 className="h3">Vídeo</h2>
                  <input
                    type="file"
                    accept="video/*"
                    capture="environment"
                    onChange={(e) =>
                      setValue('videoFile', e.target.files?.[0] ?? null, { shouldValidate: true })
                    }
                    aria-describedby="video-hint"
                  />
                  <p id="video-hint" className="muted">
                    Se anexar vídeo, descreva/legende no campo abaixo.
                  </p>

                  {videoPreviewUrl && (
                    <video className="preview" controls src={videoPreviewUrl}>
                      Seu navegador não suporta vídeo.
                    </video>
                  )}

                  <label htmlFor="videoDescription">Descrição do vídeo — obrigatório se houver vídeo</label>
                  <input
                    id="videoDescription"
                    type="text"
                    {...register('videoDescription')}
                    aria-invalid={Boolean(errors.videoDescription)}
                    aria-describedby={errors.videoDescription ? 'videoDesc-error' : undefined}
                    placeholder="Ex.: Vídeo mostra lâmpada piscando no poste durante a noite."
                  />
                  {errors.videoDescription && (
                    <p id="videoDesc-error" className="error">
                      {errors.videoDescription.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <IZAAssistant
                  text={descriptionText}
                  onUseSuggestedSubject={(s) => setValue('subject', s, { shouldValidate: true })}
                />
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="field">
              <label className="checkbox">
                <input type="checkbox" {...register('anonymous')} />
                Quero enviar de forma anônima
              </label>
              <p className="muted">
                Se marcar anonimato, evite inserir dados pessoais no texto e nas descrições de mídia.
              </p>
            </div>

            <div className="review">
              <h2>Revisão</h2>
              <ul>
                <li>
                  <strong>Tipo:</strong> {watch('kind')}
                </li>
                <li>
                  <strong>Assunto:</strong> {watch('subject') || '(não informado)'}
                </li>
                <li>
                  <strong>Texto:</strong>{' '}
                  {(watch('descriptionText') || '').trim()
                    ? 'Informado'
                    : 'Não informado (ok se houver áudio)'}
                </li>
                <li>
                  <strong>Áudio:</strong> {watch('audioFile') ? 'Anexado' : 'Não anexado'}
                </li>
                <li>
                  <strong>Imagem:</strong> {watch('imageFile') ? 'Anexada' : 'Não anexada'}
                </li>
                <li>
                  <strong>Vídeo:</strong> {watch('videoFile') ? 'Anexado' : 'Não anexado'}
                </li>
                <li>
                  <strong>Anônimo:</strong> {watch('anonymous') ? 'Sim' : 'Não'}
                </li>
              </ul>
            </div>

            {submitError && <p className="error">{submitError}</p>}
          </>
        )}

        <div className="form-actions">
          {step > 1 && (
            <button type="button" onClick={goBack}>
              Voltar
            </button>
          )}

          {step < 3 && (
            <button type="button" onClick={goNext}>
              Próximo
            </button>
          )}

          {step === 3 && (
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando…' : 'Enviar e gerar protocolo'}
            </button>
          )}

          <button type="button" className="secondary" onClick={onClearDraft}>
            Limpar rascunho
          </button>
        </div>
      </form>
    </section>
  )
}
