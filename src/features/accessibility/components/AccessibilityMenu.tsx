import { useAccessibility } from '../store/accessibilityStore'

export function AccessibilityMenu() {
  const { prefs, setHighContrast, setLargeText, reset } = useAccessibility()

  return (
    <details className="a11y-menu">
      <summary className="a11y-menu__summary">Acessibilidade</summary>
      <div className="a11y-menu__panel" role="group" aria-label="Preferências de acessibilidade">
        <label className="a11y-menu__item">
          <input
            type="checkbox"
            checked={prefs.highContrast}
            onChange={(e) => setHighContrast(e.target.checked)}
          />
          Alto contraste
        </label>

        <label className="a11y-menu__item">
          <input
            type="checkbox"
            checked={prefs.largeText}
            onChange={(e) => setLargeText(e.target.checked)}
          />
          Texto grande
        </label>

        <button type="button" className="a11y-menu__reset" onClick={reset}>
          Restaurar padrão
        </button>
      </div>
    </details>
  )
}
