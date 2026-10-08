import type { ReactNode } from 'react'

interface DetailCardProps {
  title?: string
  description?: ReactNode
  /** Acciones alineadas a la derecha de la cabecera */
  actions?: ReactNode
  children: ReactNode
  className?: string
}

/** Tarjeta con cabecera opcional para agrupar contenido (InfoGrid, tablas...). */
export function DetailCard({ title, description, actions, children, className = '' }: DetailCardProps) {
  const hasHeader = Boolean(title || description || actions)
  return (
    <section className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
      {hasHeader && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            {title && <h2 className="text-lg font-semibold text-slate-900">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-slate-600">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}
