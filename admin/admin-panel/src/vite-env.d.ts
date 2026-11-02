/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL del backend, p. ej. http://localhost:8080 */
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
