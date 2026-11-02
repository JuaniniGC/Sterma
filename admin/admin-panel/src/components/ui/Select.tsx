import type { ComponentProps } from 'react'

interface SelectProps extends ComponentProps<'select'> {
  /** Marca el campo como erróneo (borde rojo y aria-invalid) */
  invalid?: boolean
}

/** Select nativo estilado. Las opciones van como `<option>` hijas. Compatible con `register()` de RHF. */
export function Select({ invalid = false, className = '', children, ...props }: SelectProps) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={`block rounded-md border bg-white py-2 pr-8 pl-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 disabled:bg-slate-100 ${
        invalid
          ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
          : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}
