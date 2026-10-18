import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { getErrorMessage } from '@/api/errors'
import { FormField } from '@/components/forms/FormField'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { toDateTimeInputValue } from '@/lib/dateTime'
import {
  COMMENTARY_MAX,
  MAINTENANCE_FREQUENCY_DESCRIPTIONS,
  MAINTENANCE_TYPE_LABELS,
  MAINTENANCE_TYPES,
  reportFormSchema,
  type ReportFormInput,
  type ReportFormValues,
  type ReportKind,
} from '../types'

interface ReportFormProps {
  /** `maintenance` añade el tipo y hace obligatoria la fecha de fin */
  kind: ReportKind
  onSubmit: (values: ReportFormValues) => void
  onCancel: () => void
  submitLabel: string
  isPending: boolean
  /** Error de la mutación; se muestra encima del formulario */
  error: unknown
}

/** Formulario de nuevo informe (incidencia o mantenimiento). El inicio se rellena con la fecha y hora actuales. */
export function ReportForm({ kind, onSubmit, onCancel, submitLabel, isPending, error }: ReportFormProps) {
  const schema = useMemo(() => reportFormSchema(kind), [kind])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportFormInput, unknown, ReportFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { startDate: toDateTimeInputValue(new Date()), endDate: '', commentary: '' },
  })
  const isMaintenance = kind === 'maintenance'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {error != null && <Alert variant="error">{getErrorMessage(error)}</Alert>}

      {isMaintenance && (
        <FormField label="Tipo de mantenimiento" htmlFor="report-type" error={errors.maintenanceType?.message}>
          <Select
            id="report-type"
            className="w-full"
            defaultValue=""
            autoFocus
            invalid={Boolean(errors.maintenanceType)}
            {...register('maintenanceType', {
              setValueAs: (value: string) => (value === '' ? undefined : value),
            })}
          >
            <option value="" disabled>
              Selecciona el tipo
            </option>
            {MAINTENANCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {MAINTENANCE_TYPE_LABELS[type]} ({MAINTENANCE_FREQUENCY_DESCRIPTIONS[type].toLowerCase()})
              </option>
            ))}
          </Select>
        </FormField>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Fecha de inicio" htmlFor="report-start" error={errors.startDate?.message}>
          <Input
            id="report-start"
            type="datetime-local"
            step={60}
            invalid={Boolean(errors.startDate)}
            {...register('startDate')}
          />
        </FormField>

        <FormField
          label="Fecha de fin"
          htmlFor="report-end"
          error={errors.endDate?.message}
          hint={isMaintenance ? undefined : 'Opcional. Déjala vacía si la incidencia sigue abierta.'}
        >
          <Input
            id="report-end"
            type="datetime-local"
            step={60}
            invalid={Boolean(errors.endDate)}
            {...register('endDate')}
          />
        </FormField>
      </div>

      <FormField label="Comentario" htmlFor="report-commentary" error={errors.commentary?.message} hint="Opcional.">
        <Textarea
          id="report-commentary"
          autoFocus={!isMaintenance}
          maxLength={COMMENTARY_MAX}
          placeholder={isMaintenance ? 'Ej.: Revisión anual del ascensor' : 'Ej.: El ascensor se detiene entre plantas'}
          invalid={Boolean(errors.commentary)}
          {...register('commentary')}
        />
      </FormField>

      <div className="flex justify-end gap-2 border-t border-slate-200 pt-5">
        <Button variant="secondary" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" loading={isPending}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
