import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { paths } from './paths'

function describeError(error: unknown): string {
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`
  if (error instanceof Error) return error.message
  return 'Error desconocido.'
}

export function RouteErrorPage() {
  const error = useRouteError()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 p-6 text-center">
      <h1 className="text-xl font-semibold text-slate-900">Algo ha ido mal</h1>
      <p className="max-w-md text-sm text-slate-600">{describeError(error)}</p>
      <Link to={paths.home} className="text-sm font-medium text-indigo-600 hover:underline">
        Volver al inicio
      </Link>
    </div>
  )
}
