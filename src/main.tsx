import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { App } from './app/App'

import './styles/tokens.css'
import './styles/globals.css'

registerSW({ immediate: true })

async function prepare() {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === 'true') {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_AXE === 'true') {
    const React = await import('react')
    const ReactDOM = await import('react-dom')
    const axe = await import('@axe-core/react')
    axe.default(React, ReactDOM, 1000)
  }
}

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
