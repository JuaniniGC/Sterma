interface SkeletonProps {
  /** Tamaño y forma (por defecto una línea de texto: `h-4 w-full`) */
  className?: string
}

/** Bloque gris animado que ocupa el lugar del contenido mientras carga. */
export function Skeleton({ className = 'h-4 w-full' }: SkeletonProps) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} aria-hidden="true" />
}
