import api from './client'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
  }
  token: string
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/auth/login', credentials),
  register: (data: RegisterData) =>
    api.post<AuthResponse>('/auth/register', data),
}
