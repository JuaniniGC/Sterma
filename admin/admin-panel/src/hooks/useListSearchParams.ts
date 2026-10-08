import { useCallback } from 'react'
import { useSearchParams } from 'react-router'
import { toSpringSort, type SortState } from '@/types/pagination'

interface ListSearchParamsOptions {
  defaultSize?: number
  sizeOptions?: readonly number[]
  /** Orden cuando la URL no indica ninguno */
  defaultSort?: SortState | null
  /** Campos por los que se permite ordenar; un `sort` de la URL con otro campo se ignora */
  sortKeys?: readonly string[]
}

type ParamValue = string | number | null

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

/** Lee `campo,asc|desc` (formato Spring) si el campo está permitido. */
function parseSort(value: string | null, sortKeys: readonly string[]): SortState | null {
  if (!value) return null
  const [key, direction = 'asc'] = value.split(',')
  if (!sortKeys.includes(key) || (direction !== 'asc' && direction !== 'desc')) return null
  return { key, direction }
}

/**
 * Estado de un listado paginado sincronizado con la URL (`?name=...&page=2&size=50&sort=name,desc`).
 * - `page` en la URL empieza en 1 (legible); el hook devuelve `page` empezando en 0 (Spring).
 * - Los valores por defecto (página 1, `defaultSize`, filtros vacíos, `defaultSort`) no se escriben en la URL.
 * - Cambiar un filtro, el tamaño o el orden vuelve a la primera página.
 * - `sortParam` es el orden ya en formato Spring, listo para la API.
 */
export function useListSearchParams<F extends string>(
  filterKeys: readonly F[],
  {
    defaultSize = 20,
    sizeOptions = [10, 20, 50],
    defaultSort = null,
    sortKeys = [],
  }: ListSearchParamsOptions = {},
) {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = parsePositiveInt(searchParams.get('page'), 1) - 1
  const requestedSize = parsePositiveInt(searchParams.get('size'), defaultSize)
  const size = sizeOptions.includes(requestedSize) ? requestedSize : defaultSize
  const filters = Object.fromEntries(
    filterKeys.map((key) => [key, searchParams.get(key) ?? '']),
  ) as Record<F, string>
  const defaultSortParam = toSpringSort(defaultSort) ?? null
  const sort = parseSort(searchParams.get('sort'), sortKeys) ?? defaultSort
  const sortParam = toSpringSort(sort)

  const update = useCallback(
    (changes: Record<string, ParamValue>, replace: boolean) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [key, value] of Object.entries(changes)) {
            if (value === null || value === '') next.delete(key)
            else next.set(key, String(value))
          }
          return next
        },
        { replace },
      )
    },
    [setSearchParams],
  )

  const setPage = useCallback(
    (nextPage: number) => update({ page: nextPage > 0 ? nextPage + 1 : null }, false),
    [update],
  )

  const setSize = useCallback(
    (nextSize: number) =>
      update({ size: nextSize === defaultSize ? null : nextSize, page: null }, false),
    [update, defaultSize],
  )

  // replace: escribir en el buscador no debe llenar el historial
  const setFilter = useCallback(
    (key: F, value: string) => update({ [key]: value, page: null }, true),
    [update],
  )

  const setSort = useCallback(
    (nextSort: SortState | null) => {
      const value = toSpringSort(nextSort) ?? null
      update({ sort: value === defaultSortParam ? null : value, page: null }, false)
    },
    [update, defaultSortParam],
  )

  const filterKeysParam = filterKeys.join(',')
  const clearFilters = useCallback(
    () =>
      update(
        Object.fromEntries([...filterKeysParam.split(','), 'page'].map((key) => [key, null])),
        false,
      ),
    [update, filterKeysParam],
  )

  const hasActiveFilters = filterKeys.some((key) => filters[key].trim() !== '')

  return {
    page,
    size,
    filters,
    hasActiveFilters,
    sort,
    sortParam,
    setPage,
    setSize,
    setFilter,
    clearFilters,
    setSort,
  }
}
