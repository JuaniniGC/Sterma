import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getCommonMistakes } from '@/api/commonMistake.api'
import type { PageParams } from '@/types/pagination'

export const commonMistakeKeys = {
  all: ['commonMistakes'] as const,
  list: (params: PageParams) => [...commonMistakeKeys.all, 'list', params] as const,
}

export function useCommonMistakes(params: PageParams) {
  return useQuery({
    queryKey: commonMistakeKeys.list(params),
    queryFn: () => getCommonMistakes(params),
    // Mantiene la página anterior visible mientras llega la siguiente
    placeholderData: keepPreviousData,
  })
}
