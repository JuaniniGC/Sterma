import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'

interface ErrorStateProps {
  message: string
  /** Si se indica, muestra el botón "Reintentar" */
  onRetry?: () => void
}

/** Mensaje de error de bloque con botón de reintentar opcional. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div>
      <Alert variant="error">{message}</Alert>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}
