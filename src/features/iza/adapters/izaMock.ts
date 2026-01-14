import type { IZASuggestions } from '../types/iza'

export function getIZASuggestionsFromText(text: string): IZASuggestions {
  const t = (text || '').toLowerCase()

  const suggestedSubjects: string[] = []
  const questionsToAsk: string[] = [
    'Onde aconteceu (região/bairro/ponto de referência)?',
    'Quando aconteceu?',
    'Alguém foi afetado? Como?',
  ]
  const tips: string[] = [
    'Se possível, descreva fatos observáveis (o que, onde, quando) para facilitar o encaminhamento.',
    'Evite dados pessoais no relato se você preferir anonimato.',
  ]

  if (t.includes('lixo') || t.includes('entulho')) suggestedSubjects.push('Coleta de lixo/entulho')
  if (t.includes('buraco') || t.includes('asfalto')) suggestedSubjects.push('Buraco na via / pavimentação')
  if (t.includes('ilumina') || t.includes('poste')) suggestedSubjects.push('Iluminação pública')
  if (t.includes('barulho') || t.includes('som alto')) suggestedSubjects.push('Perturbação sonora')

  if (suggestedSubjects.length === 0 && text.trim().length > 20) {
    suggestedSubjects.push('Manifestação sobre serviço público')
  }

  if (text.trim().length === 0) {
    suggestedSubjects.push('Descreva o ocorrido para eu sugerir um assunto')
  }

  return { suggestedSubjects, questionsToAsk, tips }
}
