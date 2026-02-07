import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { transactionsApi, CreateTransactionData } from '../api/transactions'
import { categoriesApi } from '../api/categories'
import { Plus, Pencil, Trash2, X, TrendingUp, TrendingDown, Banknote, CreditCard, Landmark } from 'lucide-react'

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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Transactions</h1>
        <button
          onClick={() => {
            setEditingId(null)
            setIsModalOpen(true)
          }}
          className="bg-primary text-accent-black px-5 py-2.5 rounded-full font-bold hover:shadow-glow hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>

      {/* Transactions List */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-soft overflow-hidden">
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {transactions?.map((transaction) => (
            <li 
              key={transaction.id} 
              className="px-6 py-4 hover:bg-accent-gray dark:hover:bg-background-dark transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      transaction.type === 'INCOME' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {transaction.type === 'INCOME' ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-text-light dark:text-text-dark">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-subtext-light dark:text-subtext-dark flex items-center gap-1.5">
                      {new Date(transaction.date).toLocaleDateString()}
                      {transaction.category && ` • ${transaction.category.name}`}
                      {transaction.source && (
                        <span className="inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">
                          {transaction.source === 'CASH' && <Banknote className="w-3 h-3" />}
                          {transaction.source === 'DEBIT_CARD' && <Landmark className="w-3 h-3" />}
                          {transaction.source === 'CREDIT_CARD' && <CreditCard className="w-3 h-3" />}
                          {transaction.source === 'CASH' ? 'Cash' : transaction.source === 'DEBIT_CARD' ? 'Debit' : 'Credit'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`font-bold ${
                      transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {transaction.type === 'INCOME' ? '+' : '-'}৳{Number(transaction.amount).toFixed(2)}
                  </span>
                  <button
                    onClick={() => {
                      setEditingId(transaction.id)
                      setIsModalOpen(true)
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-subtext-light dark:text-subtext-dark"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Empty State */}
      {transactions?.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-accent-gray dark:bg-background-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-subtext-light dark:text-subtext-dark" />
          </div>
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-2">No transactions yet</h3>
          <p className="text-subtext-light dark:text-subtext-dark mb-4">Add your first transaction to get started</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-accent-black px-5 py-2.5 rounded-full font-bold hover:shadow-glow transition-all"
          >
            Add Transaction
          </button>
        </div>
      )}

      {/* Modal */}
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-surface-light dark:bg-surface-dark rounded-3xl max-w-md w-full p-6 shadow-soft">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
            {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-subtext-light dark:text-subtext-dark" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type */}
          <div>
            <label className="block text-xs font-bold text-subtext-light dark:text-subtext-dark mb-2 ml-4">
              TYPE
            </label>
            <div className="bg-accent-gray dark:bg-background-dark rounded-2xl px-4 py-3">
              <select
                {...register('type')}
                className="bg-accent-gray dark:bg-background-dark border-none focus:ring-0 w-full text-text-light dark:text-text-dark"
              >
                <option className="bg-white dark:bg-gray-900 text-black dark:text-white" value="EXPENSE">Expense</option>
                <option className="bg-white dark:bg-gray-900 text-black dark:text-white" value="INCOME">Income</option>
              </select>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-subtext-light dark:text-subtext-dark mb-2 ml-4">
              AMOUNT (৳)
            </label>
            <div className="bg-accent-gray dark:bg-background-dark rounded-2xl px-4 py-3">
              <input
                {...register('amount', { required: true, valueAsNumber: true })}
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                className="bg-transparent border-none focus:ring-0 w-full text-text-light dark:text-text-dark placeholder-subtext-light dark:placeholder-subtext-dark"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-subtext-light dark:text-subtext-dark mb-2 ml-4">
              DESCRIPTION
            </label>
            <div className="bg-accent-gray dark:bg-background-dark rounded-2xl px-4 py-3">
              <input
                {...register('description', { required: true })}
                type="text"
                required
                placeholder="What was this for?"
                className="bg-transparent border-none focus:ring-0 w-full text-text-light dark:text-text-dark placeholder-subtext-light dark:placeholder-subtext-dark"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-subtext-light dark:text-subtext-dark mb-2 ml-4">
              DATE
            </label>
            <div className="bg-accent-gray dark:bg-background-dark rounded-2xl px-4 py-3">
              <input
                {...register('date', { required: true })}
                type="date"
                required
                className="bg-transparent border-none focus:ring-0 w-full text-text-light dark:text-text-dark"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-subtext-light dark:text-subtext-dark mb-2 ml-4">
              CATEGORY
            </label>
            <div className="bg-accent-gray dark:bg-background-dark rounded-2xl px-4 py-3">
              <select
                {...register('categoryId')}
                className="bg-accent-gray dark:bg-background-dark border-none focus:ring-0 w-full text-text-light dark:text-text-dark"
              >
                <option className="bg-white dark:bg-gray-900 text-black dark:text-white" value="">
                  {filteredCategories.length === 0 ? 'No categories — add from Categories page' : 'Select a category'}
                </option>
                {filteredCategories.map((category) => (
                  <option className="bg-white dark:bg-gray-900 text-black dark:text-white" key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="block text-xs font-bold text-subtext-light dark:text-subtext-dark mb-2 ml-4">
              PAYMENT METHOD
            </label>
            <div className="bg-accent-gray dark:bg-background-dark rounded-2xl px-4 py-3">
              <select
                {...register('source')}
                className="bg-accent-gray dark:bg-background-dark border-none focus:ring-0 w-full text-text-light dark:text-text-dark"
              >
                <option className="bg-white dark:bg-gray-900 text-black dark:text-white" value="CASH">Cash</option>
                <option className="bg-white dark:bg-gray-900 text-black dark:text-white" value="DEBIT_CARD">Debit Card</option>
                <option className="bg-white dark:bg-gray-900 text-black dark:text-white" value="CREDIT_CARD">Credit Card</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-full text-text-light dark:text-text-dark font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary text-accent-black rounded-full font-bold hover:shadow-glow transition-all"
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
