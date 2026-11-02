import type { ReactNode } from 'react'

export interface InfoItem {
  label: string
  /** null, undefined o '' se muestran como `emptyValue` */
  value: ReactNode
  /** Ocupa todo el ancho de la sección */
  fullWidth?: boolean
}

export interface InfoSection {
  /** Título opcional de la sección */
  title?: string
  items: InfoItem[]
}

interface InfoGridProps {
  sections: InfoSection[]
  /** Columnas en pantallas anchas (en móvil siempre 1) */
  columns?: 1 | 2 | 3
  emptyValue?: ReactNode
}

const columnClasses: Record<NonNullable<InfoGridProps['columns']>, string> = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
}

function isEmpty(value: ReactNode): boolean {
  return value === null || value === undefined || value === ''
}

/** Pares etiqueta-valor agrupados en secciones, para mostrar el detalle de una entidad. */
export function InfoGrid({ sections, columns = 3, emptyValue = '—' }: InfoGridProps) {
  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <section key={section.title ?? index}>
          {section.title && (
            <h3 className="mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              {section.title}
            </h3>
          )}
          <dl className={`grid grid-cols-1 gap-x-6 gap-y-4 ${columnClasses[columns]}`}>
            {section.items.map((item) => (
              <div key={item.label} className={item.fullWidth ? 'col-span-full' : undefined}>
                <dt className="text-sm text-slate-500">{item.label}</dt>
                <dd className="mt-1 text-base font-medium break-words text-slate-900">
                  {isEmpty(item.value) ? (
                    <span className="font-normal text-slate-400">{emptyValue}</span>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  )
}
