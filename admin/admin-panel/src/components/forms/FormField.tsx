import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  /** id del control, para asociar la etiqueta */
  htmlFor: string
  /** Mensaje de error de validación (p. ej. `errors.campo?.message`) */
  error?: string
  hint?: string
  children: ReactNode
}

/** Etiqueta + control + error/ayuda. El control (Input, Select...) va como hijo. */
export function FormField({ label, htmlFor, error, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : (
        hint && <p className="text-xs text-slate-500">{hint}</p>
      )}
    </div>
  )
}
