import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { getErrorMessage } from '@/api/errors'
import { FormField } from '@/components/forms/FormField'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  communityFormSchema,
  toCommunityRequest,
  type CommunityFormInput,
  type CommunityFormValues,
  type CreateCommunityRequest,
} from '../types'

interface CommunityFormProps {
  /** Valores iniciales: `EMPTY_COMMUNITY_FORM` al crear, `communityToFormValues(c)` al editar */
  defaultValues: CommunityFormInput
  /** Recibe el body ya listo para el backend (opcionales vacíos → `null`) */
  onSubmit: (request: CreateCommunityRequest) => void
  onCancel: () => void
  submitLabel: string
  isPending: boolean
  /** Error de la mutación; se muestra encima del formulario */
  error: unknown
}

/** Formulario de comunidad (alta y edición). Las validaciones replican las del backend. */
export function CommunityForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel,
  isPending,
  error,
}: CommunityFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommunityFormInput, unknown, CommunityFormValues>({
    resolver: zodResolver(communityFormSchema),
    defaultValues,
  })

  const submit = handleSubmit((values) => onSubmit(toCommunityRequest(values)))

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {error != null && <Alert variant="error">{getErrorMessage(error)}</Alert>}

      <fieldset className="space-y-5">
        <legend className="mb-3 text-sm font-semibold text-slate-900">Datos generales</legend>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Nombre" htmlFor="community-name" error={errors.name?.message}>
            <Input
              id="community-name"
              autoFocus
              maxLength={255}
              placeholder="Ej.: Residencial Las Rosas"
              invalid={Boolean(errors.name)}
              {...register('name')}
            />
          </FormField>

          <FormField
            label="CIF"
            htmlFor="community-cif"
            error={errors.cif?.message}
            hint="Letra, 7 dígitos y control. Ej.: A12345678"
          >
            <Input
              id="community-cif"
              maxLength={9}
              autoComplete="off"
              placeholder="A12345678"
              className="uppercase"
              invalid={Boolean(errors.cif)}
              {...register('cif')}
            />
          </FormField>
        </div>

        <FormField
          label="Descripción"
          htmlFor="community-description"
          error={errors.description?.message}
          hint="Opcional."
        >
          <Input
            id="community-description"
            maxLength={255}
            placeholder="Ej.: Edificio residencial de 10 plantas"
            invalid={Boolean(errors.description)}
            {...register('description')}
          />
        </FormField>
      </fieldset>

      <div className="border-t border-slate-200 pt-5">
        <fieldset className="space-y-5">
          <legend className="mb-3 text-sm font-semibold text-slate-900">
            Localización
          </legend>

          <FormField label="Dirección" htmlFor="community-street" error={errors.street?.message}>
            <Input
              id="community-street"
              maxLength={255}
              placeholder="Ej.: Calle Falsa 123"
              invalid={Boolean(errors.street)}
              {...register('street')}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Ciudad" htmlFor="community-city" error={errors.city?.message}>
              <Input
                id="community-city"
                maxLength={255}
                placeholder="Ej.: Madrid"
                invalid={Boolean(errors.city)}
                {...register('city')}
              />
            </FormField>

            <FormField
              label="Código postal"
              htmlFor="community-postal-code"
              error={errors.postalCode?.message}
            >
              <Input
                id="community-postal-code"
                inputMode="numeric"
                maxLength={5}
                placeholder="28001"
                invalid={Boolean(errors.postalCode)}
                {...register('postalCode')}
              />
            </FormField>
          </div>
        </fieldset>
      </div>

      <div className="border-t border-slate-200 pt-5">
        <fieldset className="space-y-5">
          <legend className="mb-3 text-sm font-semibold text-slate-900">
            Responsable <span className="font-normal text-slate-500">(opcional)</span>
          </legend>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              label="Nombre del responsable"
              htmlFor="community-leader-name"
              error={errors.communityLeaderName?.message}
            >
              <Input
                id="community-leader-name"
                maxLength={255}
                placeholder="Ej.: Juan Pérez"
                invalid={Boolean(errors.communityLeaderName)}
                {...register('communityLeaderName')}
              />
            </FormField>

            <FormField
              label="Teléfono"
              htmlFor="community-leader-telephone"
              error={errors.communityLeaderTelephone?.message}
              hint="9 dígitos, sin espacios."
            >
              <Input
                id="community-leader-telephone"
                type="tel"
                inputMode="numeric"
                maxLength={9}
                placeholder="600000000"
                invalid={Boolean(errors.communityLeaderTelephone)}
                {...register('communityLeaderTelephone')}
              />
            </FormField>
          </div>

          <FormField
            label="Nota"
            htmlFor="community-leader-note"
            error={errors.communityLeaderNote?.message}
          >
            <Input
              id="community-leader-note"
              maxLength={255}
              placeholder="Ej.: Presidente"
              invalid={Boolean(errors.communityLeaderNote)}
              {...register('communityLeaderNote')}
            />
          </FormField>
        </fieldset>
      </div>

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
