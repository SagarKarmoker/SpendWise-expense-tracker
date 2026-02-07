import { Outlet, NavLink, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'
import { BarChart3, LogOut, LayoutDashboard, Receipt, Tags, Sun, Moon } from 'lucide-react'
import { useEffect } from 'react'

const Layout = () => {
  const { user, logout } = useAuthStore()
  const { isDarkMode, toggleDarkMode } = useThemeStore()

  // Initialize dark mode on component mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 left-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-accent-black font-bold text-xl shadow-glow">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-text-light dark:text-text-dark">
                SpendWise
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8 items-center">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-subtext-light dark:text-subtext-dark hover:text-text-light dark:hover:text-text-dark'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </NavLink>
              <NavLink
                to="/transactions"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-subtext-light dark:text-subtext-dark hover:text-text-light dark:hover:text-text-dark'
                  }`
                }
              >
                <Receipt className="w-4 h-4" />
                Transactions
              </NavLink>
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-subtext-light dark:text-subtext-dark hover:text-text-light dark:hover:text-text-dark'
                  }`
                }
              >
                <Tags className="w-4 h-4" />
                Categories
              </NavLink>
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-subtext-light dark:text-subtext-dark"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              
              <div className="hidden md:flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-text-light dark:text-text-dark">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-subtext-light dark:text-subtext-dark"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
