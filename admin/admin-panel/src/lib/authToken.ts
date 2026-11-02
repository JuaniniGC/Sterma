const TOKEN_KEY = 'sterma.admin.token'

// Almacenamiento del JWT en localStorage (única clave). Lo gestiona AuthProvider.
export const authToken = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },
  clear(): void {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      // sin acceso a localStorage: nada que limpiar
    }
  },
}
