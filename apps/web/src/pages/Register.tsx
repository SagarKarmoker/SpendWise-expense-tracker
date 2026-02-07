import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { authApi, RegisterData } from '../api/auth'
import { useAuthStore } from '../stores/authStore'
import { BarChart3, ArrowRight, User, Mail, Lock } from 'lucide-react'

const Register = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<RegisterData>()

  const onSubmit = async (data: RegisterData) => {
    try {
      setError('')
      const response = await authApi.register(data)
      setAuth(response.data.token, response.data.user)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
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
            Create account
          </h2>
          <p className="mt-2 text-subtext-light dark:text-subtext-dark">
            Start managing your finances today
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 shadow-soft">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}
            
            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-subtext-light dark:text-subtext-dark mb-2 ml-4">
                FULL NAME
              </label>
              <div className="bg-accent-gray dark:bg-background-dark rounded-2xl flex items-center px-4 py-3">
                <User className="w-5 h-5 text-subtext-light dark:text-subtext-dark mr-3" />
                <input
                  {...register('name', { required: true })}
                  type="text"
                  required
                  className="bg-transparent border-none focus:ring-0 w-full text-text-light dark:text-text-dark placeholder-subtext-light dark:placeholder-subtext-dark"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  {...register('password', { required: true, minLength: 6 })}
                  type="password"
                  required
                  className="bg-transparent border-none focus:ring-0 w-full text-text-light dark:text-text-dark placeholder-subtext-light dark:placeholder-subtext-dark"
                  placeholder="Min 6 characters"
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
                'Creating account...'
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-subtext-light dark:text-subtext-dark">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-bold text-primary hover:text-primary-dark transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
