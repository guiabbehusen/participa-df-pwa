import { Outlet } from 'react-router-dom'
import { SkipLink } from '../a11y/SkipLink'
import { OfflineBanner } from '../a11y/OfflineBanner'
import { Header } from './Header'
import { Footer } from './Footer'

export function AppShell() {
  return (
    <div className="app-shell">
      <SkipLink href="#main-content">Pular para o conteúdo principal</SkipLink>
      <Header />
      <OfflineBanner />
      <main id="main-content" className="app-main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
