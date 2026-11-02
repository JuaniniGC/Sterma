import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm, type DefaultValues } from 'react-hook-form'
import { getErrorMessage } from '@/api/errors'
import { FormField } from '@/components/forms/FormField'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CommunityPicker } from '@/features/community/components/CommunityPicker'
import type { Community } from '@/features/community/types'
import {
  elevatorFormSchema,
  INSTALATION_YEAR_MAX,
  INSTALATION_YEAR_MIN,
  type ElevatorFormInput,
  type ElevatorFormValues,
  type UpdateElevatorRequest,
} from '../types'

interface ElevatorFormProps {
  /** Al crear, solo `{ rae: '' }` (año y comunidad vacíos); al editar, `elevatorToFormValues(e)` */
  defaultValues: DefaultValues<ElevatorFormInput>
  /** Comunidad de `defaultValues.communityId`, para mostrarla en el selector (null al crear: abre el buscador) */
  defaultCommunity: Community | null
  onSubmit: (request: UpdateElevatorRequest) => void
  onCancel: () => void
  submitLabel: string
  isPending: boolean
  /** Error de la mutación; se muestra encima del formulario */
  error: unknown
}

/** Formulario de ascensor: RAE, año de instalación y comunidad (con buscador). */
export function ElevatorForm({
  defaultValues,
  defaultCommunity,
  onSubmit,
  onCancel,
  submitLabel,
  isPending,
  error,
}: ElevatorFormProps) {
  // El formulario guarda solo el id; el objeto se conserva para mostrar el nombre en el selector
  const [community, setCommunity] = useState(defaultCommunity)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ElevatorFormInput, unknown, ElevatorFormValues>({
    resolver: zodResolver(elevatorFormSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {error != null && <Alert variant="error">{getErrorMessage(error)}</Alert>}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="RAE" htmlFor="elevator-rae" error={errors.rae?.message}>
          <Input
            id="elevator-rae"
            autoFocus
            maxLength={255}
            placeholder="Ej.: RAE007"
            invalid={Boolean(errors.rae)}
            {...register('rae')}
          />
        </FormField>

        <FormField
          label="Año de instalación"
          htmlFor="elevator-year"
          error={errors.instalationYear?.message}
          hint={`Entre ${INSTALATION_YEAR_MIN} y ${INSTALATION_YEAR_MAX}.`}
        >
          <Input
            id="elevator-year"
            type="number"
            inputMode="numeric"
            min={INSTALATION_YEAR_MIN}
            max={INSTALATION_YEAR_MAX}
            step={1}
            invalid={Boolean(errors.instalationYear)}
            {...register('instalationYear', {
              // Vacío → undefined para que Zod muestre "Introduce el año de instalación"
              setValueAs: (value: string | number) =>
                String(value).trim() === '' ? undefined : Number(value),
            })}
          />
        </FormField>
      </div>

      <FormField label="Comunidad" htmlFor="elevator-community" error={errors.communityId?.message}>
        <Controller
          control={control}
          name="communityId"
          render={({ field }) => (
            <CommunityPicker
              id="elevator-community"
              value={community}
              invalid={Boolean(errors.communityId)}
              onChange={(selected) => {
                setCommunity(selected)
                field.onChange(selected.id)
              }}
            />
          )}
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
