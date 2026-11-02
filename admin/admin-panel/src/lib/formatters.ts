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

const dateFormatter = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })

/**
 * Convierte un `LocalDate` de Spring (`2026-05-22`) en un `Date` a medianoche local. No se usa `new Date(valor)`
 * porque una fecha sin hora se interpreta como UTC y en zonas al oeste de Greenwich mostraría el día anterior.
 * Devuelve null si el valor está vacío o no es una fecha válida.
 */
export function parseLocalDate(value: string | null | undefined): Date | null {
  const match = value ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null
  if (!match) return null
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return Number.isNaN(date.getTime()) ? null : date
}

/** Formatea un `LocalDate` de Spring (`2026-05-22`) como `22/05/2026`; null si vacío o inválido. */
export function formatDate(value: string | null | undefined): string | null {
  const date = parseLocalDate(value)
  return date ? dateFormatter.format(date) : null
}
