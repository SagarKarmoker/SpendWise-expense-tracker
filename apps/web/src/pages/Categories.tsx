import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { categoriesApi, CreateCategoryData } from '../api/categories'
import { Plus, Pencil, Trash2, X, TrendingUp, TrendingDown, Tag, ShoppingBag, Coffee, Home, Car, Briefcase, Gift } from 'lucide-react'

// Map category icons to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'shopping-bag': ShoppingBag,
  'coffee': Coffee,
  'home': Home,
  'car': Car,
  'briefcase': Briefcase,
  'gift': Gift,
  'tag': Tag,
}

const getIconComponent = (iconName?: string) => {
  if (!iconName) return Tag
  return iconMap[iconName] || Tag
}

const Categories = () => {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll().then((res) => res.data),
  })

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsModalOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCategoryData> }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsModalOpen(false)
      setEditingId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
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

  const incomeCategories = categories?.filter((c) => c.type === 'INCOME') || []
  const expenseCategories = categories?.filter((c) => c.type === 'EXPENSE') || []

  return (
    <div className="space-y-6">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-light dark:text-text-dark">Categories</h1>
        <button
          onClick={() => {
            setEditingId(null)
            setIsModalOpen(true)
          }}
          className="bg-primary text-accent-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold hover:shadow-glow hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Add Category
        </button>
      </div>

      {/* Categories Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Income Categories */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-text-light dark:text-text-dark">Income Categories</h2>
          </div>
          <ul className="space-y-2 sm:space-y-3">
            {incomeCategories.map((category) => {
              const IconComponent = getIconComponent(category.icon || undefined)
              return (
                <li
                  key={category.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-accent-gray dark:bg-background-dark rounded-xl sm:rounded-2xl hover:shadow-soft transition-shadow"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {category.color && (
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: category.color }} />
                      </div>
                    )}
                    <span className="font-bold text-sm text-text-light dark:text-text-dark truncate">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingId(category.id)
                        setIsModalOpen(true)
                      }}
                      className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-subtext-light dark:text-subtext-dark"
                    >
                      <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-1.5 sm:p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </li>
              )
            })}
            {incomeCategories.length === 0 && (
              <div className="text-center py-6 sm:py-8">
                <p className="text-subtext-light dark:text-subtext-dark text-sm">No income categories yet</p>
              </div>
            )}
          </ul>
        </div>

        {/* Expense Categories */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-text-light dark:text-text-dark">Expense Categories</h2>
          </div>
          <ul className="space-y-2 sm:space-y-3">
            {expenseCategories.map((category) => {
              const IconComponent = getIconComponent(category.icon || undefined)
              return (
                <li
                  key={category.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-accent-gray dark:bg-background-dark rounded-xl sm:rounded-2xl hover:shadow-soft transition-shadow"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {category.color && (
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: category.color }} />
                      </div>
                    )}
                    <span className="font-bold text-sm text-text-light dark:text-text-dark truncate">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingId(category.id)
                        setIsModalOpen(true)
                      }}
                      className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-subtext-light dark:text-subtext-dark"
                    >
                      <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-1.5 sm:p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </li>
              )
            })}
            {expenseCategories.length === 0 && (
              <div className="text-center py-6 sm:py-8">
                <p className="text-subtext-light dark:text-subtext-dark text-sm">No expense categories yet</p>
              </div>
            )}
          </ul>
        </div>
      </div>

      {/* Modal - Mobile Optimized */}
      {isModalOpen && (
        <CategoryModal
          editingCategory={categories?.find((c) => c.id === editingId)}
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

interface CategoryModalProps {
  editingCategory?: { name: string; color?: string; icon?: string; type: 'INCOME' | 'EXPENSE' }
  onClose: () => void
  onSubmit: (data: CreateCategoryData) => void
}

const CategoryModal = ({ editingCategory, onClose, onSubmit }: CategoryModalProps) => {
  const { register, handleSubmit, watch } = useForm<CreateCategoryData>({
    defaultValues: editingCategory || {
      type: 'EXPENSE',
    },
  })

  const selectedColor = watch('color') || '#D4F00C'

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
      <div className="bg-surface-light dark:bg-surface-dark rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] sm:max-h-none overflow-y-auto shadow-soft">
        <div className="sticky top-0 bg-surface-light dark:bg-surface-dark rounded-t-3xl p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold text-text-light dark:text-text-dark">
              {editingCategory ? 'Edit Category' : 'Add Category'}
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

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-subtext-light dark:text-subtext-dark mb-2">
              NAME
            </label>
            <div className="bg-accent-gray dark:bg-background-dark rounded-2xl px-4 py-3">
              <input
                {...register('name', { required: true })}
                type="text"
                required
                placeholder="e.g., Groceries"
                className="bg-transparent border-none focus:ring-0 w-full text-text-light dark:text-text-dark placeholder-subtext-light dark:placeholder-subtext-dark text-sm"
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-bold text-subtext-light dark:text-subtext-dark mb-2">
              COLOR
            </label>
            <div className="bg-accent-gray dark:bg-background-dark rounded-2xl px-4 py-3 flex items-center gap-3">
              <input
                {...register('color')}
                type="color"
                className="w-10 h-10 rounded-lg border-0 cursor-pointer"
              />
              <span className="text-sm text-subtext-light dark:text-subtext-dark">{selectedColor}</span>
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-xs font-bold text-subtext-light dark:text-subtext-dark mb-2">
              ICON
            </label>
            <div className="bg-accent-gray dark:bg-background-dark rounded-2xl px-4 py-3">
              <select
                {...register('icon')}
                className="bg-accent-gray dark:bg-background-dark border-none focus:ring-0 w-full text-text-light dark:text-text-dark text-sm"
              >
                <option value="">Select an icon</option>
                <option value="shopping-bag">Shopping Bag</option>
                <option value="coffee">Coffee</option>
                <option value="home">Home</option>
                <option value="car">Car</option>
                <option value="briefcase">Work</option>
                <option value="gift">Gift</option>
                <option value="tag">Other</option>
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
              {editingCategory ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Categories
