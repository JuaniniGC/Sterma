import type { ReactNode } from 'react'

type AlertVariant = 'error' | 'warning' | 'success' | 'info'

interface AlertProps {
  variant?: AlertVariant
  children: ReactNode
}

const variantClasses: Record<AlertVariant, string> = {
  error: 'border-red-200 bg-red-50 text-red-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
}

export function Alert({ variant = 'info', children }: AlertProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`rounded-md border px-3 py-2 text-sm ${variantClasses[variant]}`}
    >
      {children}
    </div>
  )
}
