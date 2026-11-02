/** true si hay una entrada anterior de la app en el historial de esta pestaña (React Router guarda `idx`). */
export function hasAppHistory(): boolean {
  const state: unknown = window.history.state
  return (
    typeof state === 'object' &&
    state !== null &&
    'idx' in state &&
    typeof state.idx === 'number' &&
    state.idx > 0
  )
}
