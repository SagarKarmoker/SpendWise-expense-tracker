import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { transactionsApi } from '../api/transactions'
import { useAuthStore } from '../stores/authStore'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { TrendingUp, TrendingDown, Wallet, Banknote, CreditCard, Landmark } from 'lucide-react'

const SOURCE_LABELS: Record<string, { label: string; icon: typeof Banknote }> = {
  CASH: { label: 'Cash', icon: Banknote },
  DEBIT_CARD: { label: 'Debit Card', icon: Landmark },
  CREDIT_CARD: { label: 'Credit Card', icon: CreditCard },
}

const Dashboard = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsApi.getAll().then((res) => res.data),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const allTransactions = transactions || []

  const income = allTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const expense = allTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = income - expense

  // Current month stats
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const thisMonthTransactions = allTransactions.filter((t) => {
    const d = new Date(t.date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })
  const lastMonthTransactions = allTransactions.filter((t) => {
    const d = new Date(t.date)
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear
  })

  const thisMonthIncome = thisMonthTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const lastMonthIncome = lastMonthTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const thisMonthExpense = thisMonthTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const lastMonthExpense = lastMonthTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const incomeChange = lastMonthIncome > 0
    ? Math.round(((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100)
    : thisMonthIncome > 0 ? 100 : 0

  const expenseChange = lastMonthExpense > 0
    ? Math.round(((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100)
    : thisMonthExpense > 0 ? 100 : 0

  // Expense by category chart
  const expenseByCategory = allTransactions
    .filter((t) => t.type === 'EXPENSE' && t.category)
    .reduce((acc, t) => {
      const categoryName = t.category!.name
      const color = t.category!.color || '#888'
      if (!acc[categoryName]) acc[categoryName] = { amount: 0, color }
      acc[categoryName].amount += Number(t.amount)
      return acc
    }, {} as Record<string, { amount: number; color: string }>)

  const chartData = Object.entries(expenseByCategory).map(([name, data]) => ({
    name,
    value: data.amount,
    color: data.color,
  }))

  // Spending by source
  const spendingBySource = allTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, t) => {
      const src = t.source || 'CASH'
      acc[src] = (acc[src] || 0) + Number(t.amount)
      return acc
    }, {} as Record<string, number>)

  const sourceChartData = Object.entries(spendingBySource).map(([source, amount]) => ({
    source: SOURCE_LABELS[source]?.label || source,
    amount,
  }))

  const transactionCount = allTransactions.length

  return (
    <div className="space-y-6">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-light dark:text-text-dark">
            Welcome back{user?.name ? `, ${user.name} ` : ''}
          </h1>
          <p className="text-sm sm:text-base text-subtext-light dark:text-subtext-dark mt-1">
            {transactionCount} transaction{transactionCount !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={() => navigate('/transactions?add=true')}
          className="bg-accent-black dark:bg-white text-white dark:text-accent-black px-4 sm:px-5 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform whitespace-nowrap"
        >
          + Add Transaction
        </button>
      </div>

      {/* Stats Cards - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Balance Card */}
        <div className="bg-accent-black dark:bg-surface-dark rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white relative overflow-hidden shadow-xl">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary opacity-30 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm text-gray-400">Total Balance</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">৳{balance.toFixed(2)}</p>
            <p className={`text - xs sm: text - sm mt - 1 sm: mt - 2 ${balance >= 0 ? 'text-primary' : 'text-red-400'} `}>
              {balance >= 0 ? 'Healthy' : 'Over budget'}
            </p>
          </div>
        </div>

        {/* Income Card */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs sm:text-sm text-subtext-light dark:text-subtext-dark">Total Income</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-text-light dark:text-text-dark">
            ৳{income.toFixed(2)}
          </p>
          {lastMonthIncome > 0 || thisMonthIncome > 0 ? (
            <p className={`text - xs sm: text - sm mt - 1 sm: mt - 2 ${incomeChange >= 0 ? 'text-green-600' : 'text-red-500'} `}>
              {incomeChange >= 0 ? '+' : ''}{incomeChange}% vs last month
            </p>
          ) : (
            <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-subtext-light dark:text-subtext-dark">No data yet</p>
          )}
        </div>

        {/* Expense Card */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-soft sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-xs sm:text-sm text-subtext-light dark:text-subtext-dark">Total Expenses</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-text-light dark:text-text-dark">
            ৳{expense.toFixed(2)}
          </p>
          {lastMonthExpense > 0 || thisMonthExpense > 0 ? (
            <p className={`text - xs sm: text - sm mt - 1 sm: mt - 2 ${expenseChange <= 0 ? 'text-green-600' : 'text-red-500'} `}>
              {expenseChange >= 0 ? '+' : ''}{expenseChange}% vs last month
            </p>
          ) : (
            <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-subtext-light dark:text-subtext-dark">No data yet</p>
          )}
        </div>
      </div>

      {/* Chart Section - Mobile Optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Expense by Category Chart */}
        {chartData.length > 0 ? (
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft">
            <h2 className="text-base sm:text-lg font-bold text-text-light dark:text-text-dark mb-4">
              Expenses by Category
            </h2>
            <div className="h-48 sm:h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={4}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1A1A1A',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => [`৳${value.toFixed(2)}`, 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
              {chartData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs text-subtext-light dark:text-subtext-dark">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="truncate max-w-[80px] sm:max-w-none">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft flex items-center justify-center">
            <div className="text-center">
              <p className="text-subtext-light dark:text-subtext-dark text-sm">No expense data yet</p>
              <p className="text-xs text-subtext-light dark:text-subtext-dark mt-1">Add transactions to see your spending chart</p>
            </div>
          </div>
        )}

        {/* Spending by Source Chart */}
        {sourceChartData.length > 0 ? (
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft">
            <h2 className="text-base sm:text-lg font-bold text-text-light dark:text-text-dark mb-4">
              Spending by Payment Method
            </h2>
            <div className="h-48 sm:h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceChartData} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                  <XAxis type="number" tickFormatter={(v: number) => `৳${v}`} fontSize={10} stroke="#888" />
                  <YAxis type="category" dataKey="source" fontSize={10} stroke="#888" width={60} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1A1A1A',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => [`৳${value.toFixed(2)}`, 'Spent']}
                  />
                  <Bar dataKey="amount" fill="#D4F00C" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft flex items-center justify-center">
            <div className="text-center">
              <p className="text-subtext-light dark:text-subtext-dark text-sm">No spending data yet</p>
              <p className="text-xs text-subtext-light dark:text-subtext-dark mt-1">Add expenses to see payment method breakdown</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Transactions - Mobile Optimized */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-bold text-text-light dark:text-text-dark">Recent Transactions</h3>
          {allTransactions.length > 0 && (
            <button
              onClick={() => navigate('/transactions')}
              className="text-xs sm:text-sm font-bold text-primary hover:text-primary-dark transition-colors"
            >
              View All
            </button>
          )}
        </div>
        {allTransactions.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-subtext-light dark:text-subtext-dark text-sm">No transactions yet.</p>
            <button
              onClick={() => navigate('/transactions?add=true')}
              className="mt-3 text-sm font-bold text-primary hover:text-primary-dark transition-colors"
            >
              Add your first transaction
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {allTransactions.slice(0, 5).map((transaction) => {
              const sourceInfo = SOURCE_LABELS[transaction.source || 'CASH']
              const SourceIcon = sourceInfo?.icon || Banknote
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-accent-gray dark:bg-background-dark rounded-xl sm:rounded-2xl"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w - 10 h - 10 sm: w - 12 sm: h - 12 rounded - xl sm: rounded - 2xl flex items - center justify - center flex - shrink - 0 ${transaction.type === 'INCOME'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                      } `}>
                      {transaction.type === 'INCOME' ? (
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-text-light dark:text-text-dark truncate">
                        {transaction.description || transaction.category?.name || 'Transaction'}
                      </h4>
                      <p className="text-xs text-subtext-light dark:text-subtext-dark flex items-center gap-1 flex-wrap">
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        {transaction.category && <span className="hidden sm:inline">• {transaction.category.name}</span>}
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px]">
                          <SourceIcon className="w-2.5 h-2.5" />
                          <span className="hidden sm:inline">{sourceInfo?.label || 'Cash'}</span>
                        </span>
                      </p>
                    </div>
                  </div>
                  <span className={`font - bold text - sm sm: text - base whitespace - nowrap ml - 2 ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-500'
                    } `}>
                    {transaction.type === 'INCOME' ? '+' : '-'}৳{Number(transaction.amount).toFixed(2)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
