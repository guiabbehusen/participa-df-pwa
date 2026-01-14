import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type AccessibilityPrefs = {
  highContrast: boolean
  largeText: boolean
}

type AccessibilityContextValue = {
  prefs: AccessibilityPrefs
  setHighContrast: (value: boolean) => void
  setLargeText: (value: boolean) => void
  reset: () => void
}

const STORAGE_KEY = 'participa_df_a11y_prefs_v1'

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null)

function applyPrefsToDom(prefs: AccessibilityPrefs) {
  const root = document.documentElement
  root.dataset.contrast = prefs.highContrast ? 'high' : 'default'
  root.dataset.text = prefs.largeText ? 'large' : 'default'
}

function loadPrefs(): AccessibilityPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { highContrast: false, largeText: false }
    const parsed = JSON.parse(raw) as Partial<AccessibilityPrefs>
    return {
      highContrast: Boolean(parsed.highContrast),
      largeText: Boolean(parsed.largeText),
    }
  } catch {
    return { highContrast: false, largeText: false }
  }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<AccessibilityPrefs>(() => loadPrefs())

  useEffect(() => {
    applyPrefsToDom(prefs)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  }, [prefs])

  const value = useMemo<AccessibilityContextValue>(() => {
    return {
      prefs,
      setHighContrast: (value) => setPrefs((p) => ({ ...p, highContrast: value })),
      setLargeText: (value) => setPrefs((p) => ({ ...p, largeText: value })),
      reset: () => setPrefs({ highContrast: false, largeText: false }),
    }
  }, [prefs])

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext)
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider')
  return ctx
}
