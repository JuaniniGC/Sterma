import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation } from 'react-router'
import { getErrorMessage, type ApiError } from '@/api/errors'
import { FormField } from '@/components/forms/FormField'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { paths } from '@/routes/paths'
import type { LoginLocationState } from '../components/ProtectedRoute'
import { useAuth } from '../hooks/useAuth'
import { useLogin } from '../hooks/useLogin'
import { loginSchema, type LoginFormValues } from '../types'

// El backend responde 401 con un texto en inglés; se sustituye por un mensaje claro
function loginErrorMessage(error: ApiError): string {
  return error.status === 401 ? 'Usuario o contraseña incorrectos.' : getErrorMessage(error)
}

export function LoginPage() {
  const { isAuthenticated, sessionExpired } = useAuth()
  const location = useLocation()
  const loginMutation = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  if (isAuthenticated) {
    const from = (location.state as LoginLocationState | null)?.from
    return <Navigate to={from ?? paths.home} replace />
  }

  const onSubmit = handleSubmit((values) => loginMutation.mutate(values))

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Sterma Admin</h1>
        <p className="mt-1 text-sm text-slate-600">Inicia sesión para continuar.</p>

        <div className="mt-6 space-y-3">
          {sessionExpired && !loginMutation.isError && (
            <Alert variant="warning">Tu sesión ha caducado. Inicia sesión de nuevo.</Alert>
          )}
          {loginMutation.isError && (
            <Alert variant="error">{loginErrorMessage(loginMutation.error)}</Alert>
          )}
        </div>

        <form onSubmit={onSubmit} noValidate className="mt-4 space-y-4">
          <FormField label="Usuario" htmlFor="username" error={errors.username?.message}>
            <Input
              id="username"
              autoComplete="username"
              autoFocus
              invalid={Boolean(errors.username)}
              {...register('username')}
            />
          </FormField>
          <FormField label="Contraseña" htmlFor="password" error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              invalid={Boolean(errors.password)}
              {...register('password')}
            />
          </FormField>
          <Button type="submit" className="w-full" loading={loginMutation.isPending}>
            Iniciar sesión
          </Button>
        </form>
      </div>
    </div>
  )
}
