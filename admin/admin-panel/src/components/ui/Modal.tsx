import { useEffect, useId, useRef, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Botones de acción, alineados a la derecha */
  footer?: ReactNode
  /** Permite cerrar con Esc o clic fuera (desactívalo mientras se guarda) */
  dismissible?: boolean
}

/**
 * Diálogo modal sobre `<dialog>` nativo: bloquea el fondo, atrapa el foco,
 * devuelve el foco al cerrar y se cierra con Esc o clic en el fondo.
 */
export function Modal({ open, onClose, title, children, footer, dismissible = true }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        // Esc: el cierre lo controla el estado `open` del padre
        event.preventDefault()
        if (dismissible) onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && dismissible) onClose()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-900/40"
    >
      <div className="px-6 pt-6 pb-4">
        <h2 id={titleId} className="text-lg font-semibold">
          {title}
        </h2>
        <div className="mt-2 text-sm text-slate-600">{children}</div>
      </div>
      {footer && (
        <div className="flex flex-wrap justify-end gap-2 rounded-b-lg bg-slate-50 px-6 py-4">{footer}</div>
      )}
    </dialog>
  )
}
