import { Spinner } from '@/components/ui/Spinner'

interface LoadingStateProps {
  /** Texto visible junto al spinner */
  label?: string
}

/** Indicador de carga de bloque (p. ej. mientras llega el detalle de una entidad). */
export function LoadingState({ label = 'Cargando…' }: LoadingStateProps) {
  return (
    <p className="flex items-center gap-2 py-12 text-slate-500" aria-live="polite">
      <Spinner /> {label}
    </p>
  )
}
