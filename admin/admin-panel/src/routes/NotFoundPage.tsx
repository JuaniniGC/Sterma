import { Link } from 'react-router'
import { PageHeader } from '@/components/layout/PageHeader'
import { paths } from './paths'

export function NotFoundPage() {
  return (
    <>
      <PageHeader title="Página no encontrada" description="La ruta que buscas no existe." />
      <Link to={paths.home} className="text-sm font-medium text-indigo-600 hover:underline">
        Volver al inicio
      </Link>
    </>
  )
}
