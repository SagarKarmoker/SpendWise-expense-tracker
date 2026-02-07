import api from './client'

export interface Category {
  id: string
  name: string
  color?: string
  icon?: string
  type: 'INCOME' | 'EXPENSE'
}

export interface CreateCategoryData {
  name: string
  color?: string
  icon?: string
  type?: 'INCOME' | 'EXPENSE'
}

export const categoriesApi = {
  getAll: () =>
    api.get<Category[]>('/categories'),
  getById: (id: string) =>
    api.get<Category>(`/categories/${id}`),
  create: (data: CreateCategoryData) =>
    api.post<Category>('/categories', data),
  update: (id: string, data: Partial<CreateCategoryData>) =>
    api.put<Category>(`/categories/${id}`, data),
  delete: (id: string) =>
    api.delete(`/categories/${id}`),
}
