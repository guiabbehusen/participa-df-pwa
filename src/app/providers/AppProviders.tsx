import type { ReactNode } from 'react'
import { AccessibilityProvider } from '../../features/accessibility/store/accessibilityStore'

export function AppProviders({ children }: { children: ReactNode }) {
  return <AccessibilityProvider>{children}</AccessibilityProvider>
}
