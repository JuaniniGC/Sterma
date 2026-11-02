import { useEffect } from 'react'

/**
 * Si la página actual ya no existe (p. ej. enlace antiguo o tras filtrar), salta a la última.
 * Spring devuelve `content` vacío para páginas fuera de rango.
 */
export function useClampPage(
  page: number,
  totalPages: number | undefined,
  setPage: (page: number) => void,
): void {
  useEffect(() => {
    if (totalPages !== undefined && totalPages > 0 && page >= totalPages) setPage(totalPages - 1)
  }, [page, totalPages, setPage])
}
