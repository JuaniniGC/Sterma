const pad = (value: number) => String(value).padStart(2, '0')

/** Fecha local en el formato de `<input type="datetime-local">`: `2025-11-13T10:30` (sin segundos). */
export function toDateTimeInputValue(date: Date): string {
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}

/**
 * Valor de `<input type="datetime-local">` → `LocalDateTime` de Spring (`2025-11-13T10:30:00`, hora local,
 * sin zona). Un formato que Jackson no entienda daría 400 → `/error` → 401 y cerraría la sesión.
 */
export function toLocalDateTime(inputValue: string): string {
  return inputValue.length === 16 ? `${inputValue}:00` : inputValue
}
