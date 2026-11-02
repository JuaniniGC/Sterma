const UPLOAD_SEGMENT = '/image/upload/'

/**
 * ID público de una imagen a partir de la URL que genera el backend (`cloudinary.url().secure(true).generate(id)`):
 * `https://res.cloudinary.com/<cloud>/image/upload/ah2mqo3kd7restgyhep0?_a=…` → `ah2mqo3kd7restgyhep0`.
 *
 * Devuelve null si la URL no tiene esa forma o si el id lleva carpetas (`/`): enviado como `%2F` en la ruta,
 * Spring lo rechazaría con un 400 que pasa por `/error` y llega como 401 (cerraría la sesión).
 */
export function imagePublicIdFromUrl(url: string): string | null {
  let pathname: string
  try {
    pathname = new URL(url).pathname
  } catch {
    return null
  }
  const start = pathname.indexOf(UPLOAD_SEGMENT)
  if (start === -1) return null
  let publicId: string
  try {
    publicId = decodeURIComponent(pathname.slice(start + UPLOAD_SEGMENT.length))
  } catch {
    return null
  }
  return publicId && !publicId.includes('/') ? publicId : null
}
