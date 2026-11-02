import type { ReactNode } from 'react'
import { Link, useNavigate, type To } from 'react-router'
import { hasAppHistory } from '@/lib/history'

interface BackLinkProps {
  /** Destino del enlace (o destino de reserva si `preferHistory` y no hay pantalla anterior) */
  to: To
  children: ReactNode
  /** Vuelve a la pantalla anterior de la app (como "atrás" del navegador) si existe; si no, va a `to` */
  preferHistory?: boolean
}

/** Enlace "← Volver a ..." encima del título de una pantalla. */
export function BackLink({ to, children, preferHistory = false }: BackLinkProps) {
  const navigate = useNavigate()

  return (
    <Link
      to={to}
      onClick={(event) => {
        // Con Ctrl/Cmd/clic central se respeta el comportamiento normal del enlace
        if (!preferHistory || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
        if (hasAppHistory()) {
          event.preventDefault()
          void navigate(-1)
        }
      }}
      className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600"
    >
      <span aria-hidden="true">←</span>
      {children}
    </Link>
  )
}
