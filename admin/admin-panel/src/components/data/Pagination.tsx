import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'

interface PaginationProps {
  /** Página actual, empieza en 0 */
  page: number
  totalPages: number
  totalElements: number
  size: number
  onPageChange: (page: number) => void
  onSizeChange?: (size: number) => void
  sizeOptions?: readonly number[]
  disabled?: boolean
}

export function Pagination({
  page,
  totalPages,
  totalElements,
  size,
  onPageChange,
  onSizeChange,
  sizeOptions = [10, 20, 50],
  disabled = false,
}: PaginationProps) {
  const from = totalElements === 0 ? 0 : page * size + 1
  const to = Math.min((page + 1) * size, totalElements)
  const isFirst = page <= 0
  const isLast = page >= totalPages - 1

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
      <div className="flex items-center gap-3">
        <span>
          Mostrando <strong className="font-medium text-slate-900">{from}</strong>–
          <strong className="font-medium text-slate-900">{to}</strong> de{' '}
          <strong className="font-medium text-slate-900">{totalElements}</strong>
        </span>
        {onSizeChange && (
          <label className="flex items-center gap-2">
            <span>Por página</span>
            <Select
              value={size}
              disabled={disabled}
              onChange={(event) => onSizeChange(Number(event.target.value))}
              className="py-1"
            >
              {sizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </label>
        )}
      </div>

      <nav className="flex items-center gap-2" aria-label="Paginación">
        <Button
          variant="secondary"
          size="sm"
          disabled={disabled || isFirst}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </Button>
        <span>
          Página {totalPages === 0 ? 0 : page + 1} de {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={disabled || isLast}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
        </Button>
      </nav>
    </div>
  )
}
