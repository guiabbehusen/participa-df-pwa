import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import { HomePage } from '../../features/home/pages/HomePage'
import { NewManifestationPage } from '../../features/manifestation/pages/NewManifestationPage'
import { TrackProtocolPage } from '../../features/protocol/pages/TrackProtocolPage'
import { ProtocolDetailsPage } from '../../features/protocol/pages/ProtocolDetailsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'manifestacoes/nova', element: <NewManifestationPage /> },
      { path: 'protocolos', element: <TrackProtocolPage /> },
      { path: 'protocolos/:protocol', element: <ProtocolDetailsPage /> },
    ],
  },
])
