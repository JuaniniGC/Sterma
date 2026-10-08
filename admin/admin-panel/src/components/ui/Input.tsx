import type { ComponentProps } from 'react'

interface InputProps extends ComponentProps<'input'> {
  /** Marca el campo como erróneo (borde rojo y aria-invalid) */
  invalid?: boolean
}

/** Input de texto. Compatible con `register()` de React Hook Form (el `ref` se reenvía). */
export function Input({ invalid = false, className = '', ...props }: InputProps) {
  return (
    <input
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
