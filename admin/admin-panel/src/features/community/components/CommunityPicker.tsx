import { useState } from 'react'
import { getErrorMessage } from '@/api/errors'
import { SearchInput } from '@/components/data/SearchInput'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useCommunities } from '../hooks/useCommunities'
import type { Community } from '../types'

/** Resultados por búsqueda; si hay más, se pide acotar escribiendo */
const RESULT_COUNT = 8

interface CommunityPickerProps {
  /** id del buscador, para el `htmlFor` de `FormField` */
  id: string
  /** Comunidad seleccionada (null: ninguna, se abre directamente el buscador) */
  value: Community | null
  onChange: (community: Community) => void
  invalid?: boolean
}

function communitySummary(community: Community): string {
  const city = community.localization?.city
  return city ? `CIF ${community.cif} · ${city}` : `CIF ${community.cif}`
}

/**
 * Selector de comunidad: muestra la seleccionada con un botón "Cambiar" que abre un buscador por nombre
 * (`GET /community?name=…`, ordenado por nombre). Solo pide comunidades mientras el buscador está abierto.
 */
export function CommunityPicker({ id, value, onChange, invalid = false }: CommunityPickerProps) {
  const [searching, setSearching] = useState(value === null)
  const [name, setName] = useState('')
  const { data, isPending, isFetching, isError, error, refetch } = useCommunities(
    { name, page: 0, size: RESULT_COUNT, sort: 'name,asc' },
    { enabled: searching },
  )

  if (!searching && value) {
    return (
      <div
        className={`flex items-center justify-between gap-3 rounded-md px-3 py-2 ring-1 ring-inset ${
          invalid ? 'ring-red-500' : 'ring-slate-300'
        }`}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{value.name}</p>
          <p className="truncate text-xs text-slate-500">{communitySummary(value)}</p>
        </div>
        <Button id={id} variant="secondary" size="sm" onClick={() => setSearching(true)}>
          Cambiar
        </Button>
      </div>
    )
  }

  const select = (community: Community) => {
    onChange(community)
    setSearching(false)
    setName('')
  }

  const renderResults = () => {
    if (isPending) {
      return (
        <div className="flex items-center gap-2 p-3 text-sm text-slate-500">
          <Spinner label="Buscando comunidades" />
          Buscando…
        </div>
      )
    }
    if (isError) {
      return (
        <div className="flex flex-wrap items-center gap-2 p-3 text-sm text-red-700">
          {getErrorMessage(error)}
          <Button variant="ghost" size="sm" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </div>
      )
    }
    if (data.content.length === 0) {
      return (
        <p className="p-3 text-sm text-slate-500">
          {name.trim() ? `No hay comunidades que coincidan con «${name.trim()}».` : 'No hay comunidades.'}
        </p>
      )
    }
    return (
      <>
        <ul className={`divide-y divide-slate-100 ${isFetching ? 'opacity-60' : ''}`}>
          {data.content.map((community) => {
            const selected = community.id === value?.id
            return (
              <li key={community.id}>
                <button
                  type="button"
                  onClick={() => select(community)}
                  aria-current={selected || undefined}
                  className={`block w-full px-3 py-2 text-left hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 ${
                    selected ? 'bg-indigo-50' : ''
                  }`}
                >
                  <span className="block text-sm font-medium text-slate-900">
                    {community.name}
                    {selected && <span className="ml-2 text-xs font-normal text-indigo-600">(actual)</span>}
                  </span>
                  <span className="block text-xs text-slate-500">{communitySummary(community)}</span>
                </button>
              </li>
            )
          })}
        </ul>
        {data.totalElements > data.content.length && (
          <p className="border-t border-slate-100 px-3 py-2 text-xs text-slate-500">
            Mostrando {data.content.length} de {data.totalElements}. Escribe para acotar la búsqueda.
          </p>
        )}
      </>
    )
  }

  return (
    <div className="space-y-2">
      <SearchInput
        id={id}
        autoFocus={value !== null}
        value={name}
        onChange={setName}
        placeholder="Buscar comunidad por nombre…"
      />
      <div
        className={`max-h-72 overflow-y-auto rounded-md ring-1 ring-inset ${
          invalid ? 'ring-red-500' : 'ring-slate-200'
        }`}
      >
        {renderResults()}
      </div>
      {value && (
        <Button variant="ghost" size="sm" onClick={() => setSearching(false)}>
          Mantener «{value.name}»
        </Button>
      )}
    </div>
  )
}
