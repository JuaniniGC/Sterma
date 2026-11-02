import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createMaintenanceRule } from '@/api/report.api'
import { maintenanceRuleKeys } from './useMaintenanceRules'

export function useCreateMaintenanceRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createMaintenanceRule,
    // El error se muestra dentro del formulario
    meta: { skipErrorToast: true },
    onSuccess: async (rule) => {
      toast.success(`Paso «${rule.name}» creado.`)
      await queryClient.invalidateQueries({ queryKey: maintenanceRuleKeys.all })
    },
  })
}
