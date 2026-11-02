import { httpClient } from './client'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
}

/** POST /auth/login — devuelve el JWT. 401 si las credenciales son incorrectas. */
export async function login(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await httpClient.post<LoginResponse>('/auth/login', body, { skipAuth: true })
  return data
}
