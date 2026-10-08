/**
 * Convierte el `:id` de la URL en número. Devuelve null si no es un entero > 0.
 * Validarlo antes de pedirlo es obligatorio: el backend responde 401 (no 400)
 * a ids no numéricos, y eso cerraría la sesión.
 */
export function parseId(raw: string | undefined): number | null {
  const id = Number(raw)
  return Number.isInteger(id) && id > 0 ? id : null
}
