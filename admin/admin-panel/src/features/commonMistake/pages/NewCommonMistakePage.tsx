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
import { Textarea } from '@/components/ui/Textarea'
import { paths } from '@/routes/paths'
import { useCreateCommonMistake } from '../hooks/useCreateCommonMistake'
import { commonMistakeFormSchema, type CommonMistakeFormValues } from '../types'

/** `/common-mistakes/new`: formulario de alta de un fallo común. */
export function NewCommonMistakePage() {
  const navigate = useNavigate()
  const createMistake = useCreateCommonMistake()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommonMistakeFormValues>({
    resolver: zodResolver(commonMistakeFormSchema),
    defaultValues: { identificator: '', description: '' },
  })

  const onSubmit = handleSubmit((values) => {
    createMistake.mutate(values, { onSuccess: () => void navigate(paths.commonMistakes) })
  })

  return (
    <>
      <BackLink to={paths.commonMistakes}>Volver a fallos comunes</BackLink>
      <PageHeader title="Nuevo fallo común" />

      <DetailCard className="max-w-2xl">
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          {createMistake.isError && <Alert variant="error">{getErrorMessage(createMistake.error)}</Alert>}

          <FormField
            label="Identificador"
            htmlFor="mistake-identificator"
            error={errors.identificator?.message}
            hint="Código único del fallo."
          >
            <Input
              id="mistake-identificator"
              autoFocus
              maxLength={255}
              placeholder="Ej.: CM007"
              invalid={Boolean(errors.identificator)}
              {...register('identificator')}
            />
          </FormField>

          <FormField label="Descripción" htmlFor="mistake-description" error={errors.description?.message}>
            <Textarea
              id="mistake-description"
              maxLength={255}
              placeholder="Ej.: El ascensor no nivela correctamente en la planta"
              invalid={Boolean(errors.description)}
              {...register('description')}
            />
          </FormField>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-5">
            <Button
              variant="secondary"
              onClick={() => void navigate(paths.commonMistakes)}
              disabled={createMistake.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={createMistake.isPending}>
              Crear fallo común
            </Button>
          </div>
        </form>
      </DetailCard>
    </>
  )
}
