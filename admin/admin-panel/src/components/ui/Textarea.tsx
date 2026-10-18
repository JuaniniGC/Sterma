import type { ComponentProps } from 'react'

interface TextareaProps extends ComponentProps<'textarea'> {
  /** Marca el campo como erróneo (borde rojo y aria-invalid) */
  invalid?: boolean
}

/** Área de texto con el mismo estilo que `Input`. Compatible con `register()` de React Hook Form. */
export function Textarea({ invalid = false, className = '', rows = 3, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={`block w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-100 ${
        invalid
          ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
          : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
      } ${className}`}
      {...props}
    />
  )
}
