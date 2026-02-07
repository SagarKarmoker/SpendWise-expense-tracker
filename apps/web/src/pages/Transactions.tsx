import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { transactionsApi, CreateTransactionData } from '../api/transactions'
import { categoriesApi } from '../api/categories'
import { Plus, Pencil, Trash2, X, TrendingUp, TrendingDown, Banknote, CreditCard, Landmark, Download } from 'lucide-react'

const Transactions = () => {
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Auto-open modal when navigated with ?add=true
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setIsModalOpen(true)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsApi.getAll().then((res) => res.data),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll().then((res) => res.data),
  })

  const createMutation = useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      setIsModalOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTransactionData> }) =>
      transactionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      setIsModalOpen(false)
      setEditingId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: transactionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-light dark:text-text-dark">Transactions</h1>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={async () => {
              try {
                const response = await transactionsApi.downloadPdf()
                const blob = new Blob([response.data], { type: 'application/pdf' })
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = `transactions-report-${new Date().toISOString().split('T')[0]}.pdf`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url)
              } catch (error) {
                alert('Failed to download PDF report')
              }
            }}
            className="flex-1 sm:flex-none bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-text-light dark:text-text-dark px-3 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
          <button
            onClick={() => {
              setEditingId(null)
              setIsModalOpen(true)
            }}
            className="flex-1 sm:flex-none bg-primary text-accent-black px-3 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold hover:shadow-glow hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Transactions List - Mobile Optimized */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl sm:rounded-3xl shadow-soft overflow-hidden">
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {transactions?.map((transaction) => (
            <li 
              key={transaction.id} 
              className="px-3 sm:px-6 py-3 sm:py-4 hover:bg-accent-gray dark:hover:bg-background-dark transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      transaction.type === 'INCOME' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {transaction.type === 'INCOME' ? (
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-text-light dark:text-text-dark truncate">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-subtext-light dark:text-subtext-dark flex items-center gap-1 flex-wrap">
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      {transaction.category && (
                        <span className="hidden sm:inline">• {transaction.category.name}</span>
                      )}
                      {transaction.source && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px]">
                          {transaction.source === 'CASH' && <Banknote className="w-2.5 h-2.5" />}
                          {transaction.source === 'DEBIT_CARD' && <Landmark className="w-2.5 h-2.5" />}
                          {transaction.source === 'CREDIT_CARD' && <CreditCard className="w-2.5 h-2.5" />}
                          <span className="hidden sm:inline">
                            {transaction.source === 'CASH' ? 'Cash' : transaction.source === 'DEBIT_CARD' ? 'Debit' : 'Credit'}
                          </span>
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-4">
                  <span
                    className={`font-bold text-sm whitespace-nowrap ${
                      transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {transaction.type === 'INCOME' ? '+' : '-'}৳{Number(transaction.amount).toFixed(2)}
                  </span>
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        setEditingId(transaction.id)
                        setIsModalOpen(true)
                      }}
                      className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-subtext-light dark:text-subtext-dark"
                    >
                      <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-1.5 sm:p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Empty State */}
      {transactions?.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent-gray dark:bg-background-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-subtext-light dark:text-subtext-dark" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-text-light dark:text-text-dark mb-2">No transactions yet</h3>
          <p className="text-subtext-light dark:text-subtext-dark mb-4 text-sm">Add your first transaction to get started</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-accent-black px-5 py-2.5 rounded-full font-bold hover:shadow-glow transition-all"
          >
            Add Transaction
          </button>
        </div>
      )}

      {/* Modal - Mobile Optimized */}
      {isModalOpen && (
        <TransactionModal
          categories={categories || []}
          editingTransaction={transactions?.find((t) => t.id === editingId)}
          onClose={() => {
            setIsModalOpen(false)
            setEditingId(null)
          }}
          onSubmit={(data) => {
            if (editingId) {
              updateMutation.mutate({ id: editingId, data })
            } else {
              createMutation.mutate(data)
            }
          }}
        />
      )}
    </div>
  )
}

interface TransactionModalProps {
  categories: { id: string; name: string; type: string }[]
  editingTransaction?: { amount: number; description: string; type: string; source?: string; date: string; categoryId?: string }
  onClose: () => void
  onSubmit: (data: CreateTransactionData) => void
}

const TransactionModal = ({ categories, editingTransaction, onClose, onSubmit }: TransactionModalProps) => {
  const { register, handleSubmit, watch } = useForm<CreateTransactionData>({
    defaultValues: editingTransaction
      ? {
          amount: editingTransaction.amount,
          description: editingTransaction.description,
          type: editingTransaction.type as 'INCOME' | 'EXPENSE',
          source: (editingTransaction.source as CreateTransactionData['source']) || 'CASH',
          date: editingTransaction.date.split('T')[0],
          categoryId: editingTransaction.categoryId,
        }
      : {
          type: 'EXPENSE',
          source: 'CASH',
          date: new Date().toISOString().split('T')[0],
        },
  })

  const type = watch('type')
  const filteredCategories = categories.filter((c) => c.type === type)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
      <div className="bg-surface-light dark:bg-surface-dark rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] sm:max-h-none overflow-y-auto shadow-soft">
        <div className="sticky top-0 bg-surface-light dark:bg-surface-dark rounded-t-3xl p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold text-text-light dark:text-text-dark">
              {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-subtext-light dark:text-subtext-dark" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4">
          {/* Type */}
          <div>
            <label className="block text-xs font-bold text-subtext-light dark:text-subtext-dark mb-2">
              TYPE
            </label>
            <div className="bg-accent-gray dark:bg-background-dark rounded-2xl px-4 py-3">
              <select
                {...register('type')}
                className="bg-accent-gray dark:bg-background-dark border-none focus:ring-0 w-full text-text-light dark:text-text-dark text-sm"
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-subtext-light dark:text-subtext-dark mb-2">
              AMOUNT (৳)
            </label>
            <div className="bg-accent-gray dark:bg-background-dark rounded-2xl px-4 py-3">
              <input
                {...register('amount', { required: true, valueAsNumber: true })}
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                className="bg-transparent border-none focus:ring-0 w-full text-text-light dark:text-text-dark placeholder-subtext-light dark:placeholder-subtext-dark text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-subtext-light dark:text-subtext-dark mb-2">
              DESCRIPTION
            </label>
            <div className="bg-accent-gray dark:bg-background-dark rounded-2xl px-4 py-3">
              <input
                {...register('description', { required: true })}
                type="text"
                required
                placeholder="What was this for?"
                className="bg-transparent border-none focus:ring-0 w-full text-text-light dark:text-text-dark placeholder-subtext-light dark:placeholder-subtext-dark text-sm"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-subtext-light dark:text-subtext-dark mb-2">
              DATE
            </label>
            <div className="bg-accent-gray dark:bg-background-dark rounded-2xl px-4 py-3">
              <input
                {...register('date', { required: true })}
                type="date"
                required
                className="bg-transparent border-none focus:ring-0 w-full text-text-light dark:text-text-dark text-sm"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-subtext-light dark:text-subtext-dark mb-2">
              CATEGORY
            </label>
            <div className="bg-accent-gray dark:bg-background-dark rounded-2xl px-4 py-3">
              <select
                {...register('categoryId')}
                className="bg-accent-gray dark:bg-background-dark border-none focus:ring-0 w-full text-text-light dark:text-text-dark text-sm"
              >
                <option value="">
                  {filteredCategories.length === 0 ? 'No categories — add from Categories page' : 'Select a category'}
                </option>
                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="block text-xs font-bold text-subtext-light dark:text-subtext-dark mb-2">
              PAYMENT METHOD
            </label>
            <div className="bg-accent-gray dark:bg-background-dark rounded-2xl px-4 py-3">
              <select
                {...register('source')}
                className="bg-accent-gray dark:bg-background-dark border-none focus:ring-0 w-full text-text-light dark:text-text-dark text-sm"
              >
                <option value="CASH">Cash</option>
                <option value="DEBIT_CARD">Debit Card</option>
                <option value="CREDIT_CARD">Credit Card</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-full text-text-light dark:text-text-dark font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary text-accent-black rounded-full font-bold hover:shadow-glow transition-all text-sm"
            >
              {editingTransaction ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Transactions
