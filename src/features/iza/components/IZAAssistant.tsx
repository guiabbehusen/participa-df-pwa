import { useMemo } from 'react'
import { getIZASuggestionsFromText } from '../adapters/izaMock'

type Props = {
  text: string
  onUseSuggestedSubject: (subject: string) => void
}

export function IZAAssistant({ text, onUseSuggestedSubject }: Props) {
  const suggestions = useMemo(() => getIZASuggestionsFromText(text), [text])

  return (
    <aside className="iza" aria-label="Assistente IZA">
      <h3>IZA (assistente)</h3>
      <p className="muted">
        Sugestões automáticas para ajudar a escrever com clareza e facilitar o encaminhamento.
      </p>

      <div className="iza__section">
        <h4>Assuntos sugeridos</h4>
        <div className="iza__chips" aria-label="Sugestões de assunto">
          {suggestions.suggestedSubjects.map((s) => (
            <button
              type="button"
              key={s}
              className="chip"
              onClick={() => onUseSuggestedSubject(s)}
            >
              Usar: {s}
            </button>
          ))}
        </div>
      </div>

      <div className="iza__section">
        <h4>Perguntas-guia</h4>
        <ul>
          {suggestions.questionsToAsk.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </div>

      <div className="iza__section">
        <h4>Dicas</h4>
        <ul>
          {suggestions.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
