const dateTimeFormatter = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/**
 * Formatea un `LocalDateTime` de Spring (`2025-02-18T14:15:00`, sin zona) como `18/02/2025, 14:15`.
 * Sin zona horaria, el navegador lo interpreta como hora local, que es lo que guarda el backend.
 * Devuelve null si el valor está vacío o no es una fecha válida.
 */
export function formatDateTime(value: string | null | undefined): string | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : dateTimeFormatter.format(date)
}
