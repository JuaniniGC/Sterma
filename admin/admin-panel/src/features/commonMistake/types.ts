import { z } from 'zod'

/** Elemento de GET /mistake */
export interface CommonMistake {
  id: number
  /** Código del fallo (único), p. ej. `CM001` */
  identificator: string
  description: string
}

/** Body de POST /mistake (el `id` lo genera el backend) */
export interface CreateCommonMistakeRequest {
  identificator: string
  description: string
}

/**
 * Formulario de nuevo fallo común. El backend no valida nada (sin `@NotBlank`): ambos campos son NOT NULL en la BD
 * (VARCHAR(255)) y un fallo ahí llega como 500 "Error inesperado: …", así que se exigen aquí.
 */
export const commonMistakeFormSchema = z.object({
  identificator: z
    .string()
    .trim()
    .min(1, 'Introduce el identificador')
    .max(255, 'El identificador no puede superar los 255 caracteres'),
  description: z
    .string()
    .trim()
    .min(1, 'Introduce la descripción')
    .max(255, 'La descripción no puede superar los 255 caracteres'),
})

export type CommonMistakeFormValues = z.infer<typeof commonMistakeFormSchema>
