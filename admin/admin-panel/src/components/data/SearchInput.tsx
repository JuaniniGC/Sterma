import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/Input'

interface SearchInputProps {
  /** Valor externo (p. ej. el de la URL). Si cambia desde fuera, el campo se actualiza. */
  value: string
  /** Se llama con el texto tras `debounceMs` sin escribir (o al instante al limpiar) */
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
  /** Etiqueta accesible (por defecto usa el placeholder) */
  label?: string
  className?: string
  /** id del input, para asociarlo a un `<label>` externo (p. ej. `FormField`); con él no se usa `aria-label` */
  id?: string
  autoFocus?: boolean
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar…',
  debounceMs = 400,
  label,
  className = '',
  id,
  autoFocus,
}: SearchInputProps) {
  const [text, setText] = useState(value)
  const [lastValue, setLastValue] = useState(value)
  const timer = useRef<number | undefined>(undefined)

  // Sincroniza con cambios externos (navegación atrás/adelante, enlace compartido)
  if (value !== lastValue) {
    setLastValue(value)
    setText(value)
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function emit(next: string, delay: number) {
    window.clearTimeout(timer.current)
    if (delay === 0) onChange(next)
    else timer.current = window.setTimeout(() => onChange(next), delay)
  }

  return (
    <div className={`relative ${className}`}>
      <svg
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.45 4.39l3.08 3.08a.75.75 0 11-1.06 1.06l-3.08-3.08A7 7 0 012 9z"
          clipRule="evenodd"
        />
      </svg>
      <Input
        type="search"
        value={text}
        placeholder={placeholder}
        id={id}
        autoFocus={autoFocus}
        aria-label={id ? undefined : (label ?? placeholder)}
        className="pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
        onChange={(event) => {
          setText(event.target.value)
          emit(event.target.value, debounceMs)
        }}
      />
      {text && (
        <button
          type="button"
          onClick={() => {
            setText('')
            emit('', 0)
          }}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600"
          aria-label="Limpiar búsqueda"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </div>
  )
}
