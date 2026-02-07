import api from './client'

export type TransactionSource = 'CASH' | 'DEBIT_CARD' | 'CREDIT_CARD'

export interface Transaction {
  id: string
  amount: number
  description: string
  type: 'INCOME' | 'EXPENSE'
  source: TransactionSource
  date: string
  categoryId?: string
  category?: {
    id: string
    name: string
    color: string
  }
}

export interface CreateTransactionData {
  amount: number
  description: string
  type: 'INCOME' | 'EXPENSE'
  source: TransactionSource
  date: string
  categoryId?: string
}

export const transactionsApi = {
  getAll: (params?: { startDate?: string; endDate?: string }) =>
    api.get<Transaction[]>('/transactions', { params }),
  getById: (id: string) =>
    api.get<Transaction>(`/transactions/${id}`),
  create: (data: CreateTransactionData) =>
    api.post<Transaction>('/transactions', data),
  update: (id: string, data: Partial<CreateTransactionData>) =>
    api.put<Transaction>(`/transactions/${id}`, data),
  delete: (id: string) =>
    api.delete(`/transactions/${id}`),
  downloadPdf: (params?: { startDate?: string; endDate?: string }) =>
    api.get('/transactions/report/pdf', { 
      params,
      responseType: 'blob'
    }),
}
