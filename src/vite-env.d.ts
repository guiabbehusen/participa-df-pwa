/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_ENABLE_MSW?: string
  readonly VITE_ENABLE_AXE?: string
  readonly VITE_IZA_MODE?: 'mock' | 'api'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
