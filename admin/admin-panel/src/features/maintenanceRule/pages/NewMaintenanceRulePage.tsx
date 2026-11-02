import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { getErrorMessage } from '@/api/errors'
import { DetailCard } from '@/components/data/DetailCard'
import { FormField } from '@/components/forms/FormField'
import { BackLink } from '@/components/layout/BackLink'
import { PageHeader } from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import {
  MAINTENANCE_FREQUENCY_DESCRIPTIONS,
  MAINTENANCE_FREQUENCY_LABELS,
  MAINTENANCE_TYPES,
} from '@/features/report/types'
import { paths } from '@/routes/paths'
import { useCreateMaintenanceRule } from '../hooks/useCreateMaintenanceRule'
import {
  maintenanceRuleFormSchema,
  ORDER_NUM_MAX,
  ORDER_NUM_MIN,
  type MaintenanceRuleFormInput,
  type MaintenanceRuleFormValues,
} from '../types'

export function NewMaintenanceRulePage() {
  const navigate = useNavigate()
  const createRule = useCreateMaintenanceRule()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaintenanceRuleFormInput, unknown, MaintenanceRuleFormValues>({
    resolver: zodResolver(maintenanceRuleFormSchema),
    defaultValues: { name: '', description: '' },
  })

  const onSubmit = handleSubmit((values) => {
    createRule.mutate(
      { ...values, description: values.description || null },
      { onSuccess: () => void navigate(paths.maintenanceRules) },
    )
  })

  return (
    <>
      <BackLink to={paths.maintenanceRules}>Volver a pasos de mantenimiento</BackLink>
      <PageHeader title="Nuevo paso de mantenimiento" />

      <DetailCard className="max-w-2xl">
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          {createRule.isError && (
            <Alert variant="error">{getErrorMessage(createRule.error)}</Alert>
          )}

          <FormField label="Nombre" htmlFor="rule-name" error={errors.name?.message}>
            <Input
              id="rule-name"
              autoFocus
              maxLength={255}
              placeholder="Ej.: Revisión de frenos"
              invalid={Boolean(errors.name)}
              {...register('name')}
            />
          </FormField>

          <FormField
            label="Descripción"
            htmlFor="rule-description"
            error={errors.description?.message}
            hint="Opcional."
          >
            <Input
              id="rule-description"
              maxLength={255}
              placeholder="Ej.: Comprobar el desgaste de las zapatas"
              invalid={Boolean(errors.description)}
              {...register('description')}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              label="Orden"
              htmlFor="rule-order"
              error={errors.orderNum?.message}
              hint={`Número entero del ${ORDER_NUM_MIN} al ${ORDER_NUM_MAX}.`}
            >
              <Input
                id="rule-order"
                type="number"
                inputMode="numeric"
                min={ORDER_NUM_MIN}
                max={ORDER_NUM_MAX}
                step={1}
                placeholder={`${ORDER_NUM_MIN}–${ORDER_NUM_MAX}`}
                invalid={Boolean(errors.orderNum)}
                {...register('orderNum', {
                  // Vacío → undefined para que Zod muestre "Introduce el orden"
                  setValueAs: (value: string) => (value.trim() === '' ? undefined : Number(value)),
                })}
              />
            </FormField>

            <FormField
              label="Tipo de mantenimiento"
              htmlFor="rule-type"
              error={errors.maintenanceType?.message}
            >
              <Select
                id="rule-type"
                className="w-full"
                defaultValue=""
                invalid={Boolean(errors.maintenanceType)}
                {...register('maintenanceType')}
              >
                <option value="" disabled>
                  Selecciona el tipo
                </option>
                {MAINTENANCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {MAINTENANCE_FREQUENCY_LABELS[type]} ({MAINTENANCE_FREQUENCY_DESCRIPTIONS[type].toLowerCase()})
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-5">
            <Button
              variant="secondary"
              onClick={() => void navigate(paths.maintenanceRules)}
              disabled={createRule.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={createRule.isPending}>
              Crear paso
            </Button>
          </div>
        </form>
      </DetailCard>
    </>
  )
}
