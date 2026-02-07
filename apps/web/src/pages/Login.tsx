import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { authApi, LoginCredentials } from '../api/auth'
import { useAuthStore } from '../stores/authStore'
import { BarChart3, ArrowRight, Mail, Lock } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginCredentials>()

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setError('')
      const response = await authApi.login(data)
      setAuth(response.data.token, response.data.user)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark mesh-gradient py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-accent-black font-bold text-3xl shadow-glow">
              <BarChart3 className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">
            Welcome back
          </h2>
          <p className="mt-2 text-subtext-light dark:text-subtext-dark">
            Sign in to manage your finances
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 shadow-soft">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}
            
            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold text-subtext-light dark:text-subtext-dark mb-2 ml-4">
                EMAIL ADDRESS
              </label>
              <div className="bg-accent-gray dark:bg-background-dark rounded-2xl flex items-center px-4 py-3">
                <Mail className="w-5 h-5 text-subtext-light dark:text-subtext-dark mr-3" />
                <input
                  {...register('email', { required: true })}
                  type="email"
                  required
                  className="bg-transparent border-none focus:ring-0 w-full text-text-light dark:text-text-dark placeholder-subtext-light dark:placeholder-subtext-dark"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-subtext-light dark:text-subtext-dark mb-2 ml-4">
                PASSWORD
              </label>
              <div className="bg-accent-gray dark:bg-background-dark rounded-2xl flex items-center px-4 py-3">
                <Lock className="w-5 h-5 text-subtext-light dark:text-subtext-dark mr-3" />
                <input
                  {...register('password', { required: true })}
                  type="password"
                  required
                  className="bg-transparent border-none focus:ring-0 w-full text-text-light dark:text-text-dark placeholder-subtext-light dark:placeholder-subtext-dark"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-accent-black font-bold py-4 rounded-full shadow-glow hover:bg-primary-dark hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                'Signing in...'
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-subtext-light dark:text-subtext-dark">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-bold text-primary hover:text-primary-dark transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
