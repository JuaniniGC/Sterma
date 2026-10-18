import { useRef, type ComponentProps } from 'react'
import { Button } from './Button'

interface FileButtonProps extends Omit<ComponentProps<typeof Button>, 'onClick' | 'type'> {
  /** Tipos aceptados por el selector (atributo `accept` de `<input type="file">`) */
  accept?: string
  multiple?: boolean
  /** Archivos elegidos (nunca vacío) */
  onFiles: (files: File[]) => void
}

/** Botón que abre el selector de archivos del sistema. Mismas variantes y props que `Button`. */
export function FileButton({ accept, multiple = false, onFiles, children, ...buttonProps }: FileButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <Button {...buttonProps} onClick={() => inputRef.current?.click()}>
        {children}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? [])
          // Vaciar para que elegir otra vez el mismo archivo vuelva a disparar onChange
          event.target.value = ''
          if (files.length > 0) onFiles(files)
        }}
      />
    </>
  )
}
