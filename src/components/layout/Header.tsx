import { NavLink } from 'react-router-dom'
import { AccessibilityMenu } from '../../features/accessibility/components/AccessibilityMenu'

export function Header() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="brand" aria-label="Participa DF">
          <span className="brand__name">Participa DF</span>
          <span className="brand__badge">PWA Ouvidoria</span>
        </div>

        <nav className="app-nav" aria-label="Navegação principal">
          <NavLink to="/" end>
            Início
          </NavLink>
          <NavLink to="/manifestacoes/nova">Registrar</NavLink>
          <NavLink to="/protocolos">Acompanhar</NavLink>
        </nav>

        <AccessibilityMenu />
      </div>
    </header>
  )
}
