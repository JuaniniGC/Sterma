import type { ReactNode } from 'react'

interface HeaderProps {
  onMenuClick: () => void
  /** Contenido a la derecha de la cabecera (usuario, acciones globales...) */
  actions?: ReactNode
}

export function Header({ onMenuClick, actions }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Abrir menú"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M3 5h14v2H3zM3 9h14v2H3zM3 13h14v2H3z" />
        </svg>
      </button>
      <div className="ml-auto flex items-center gap-3">{actions}</div>
    </header>
  )
}
