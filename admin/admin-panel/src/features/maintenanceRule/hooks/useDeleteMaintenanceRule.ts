import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteMaintenanceRule } from '@/api/report.api'
import type { MaintenanceRule } from '../types'
import { maintenanceRuleKeys } from './useMaintenanceRules'

/** Borra una regla. Los errores los notifica el toast global de mutaciones. */
export function useDeleteMaintenanceRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (rule: MaintenanceRule) => deleteMaintenanceRule(rule.id),
    onSuccess: (_data, rule) => {
      toast.success(`Regla «${rule.name}» eliminada.`)
    },
    // También tras un error: si era un 404 la regla ya no existe y la lista debe reflejarlo
    onSettled: () => queryClient.invalidateQueries({ queryKey: maintenanceRuleKeys.all }),
  })
}
