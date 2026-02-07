import { Link } from 'react-router-dom'
import { useThemeStore } from '../stores/themeStore'
import { useEffect } from 'react'
import { 
  BarChart3, 
  ArrowRight, 
  ArrowDown, 
  CheckCircle, 
  Eye, 
  Zap, 
  Smartphone,
  CreditCard,
  Receipt,
  TrendingUp,
  Shield,
  Download,
  Sun,
  Moon
} from 'lucide-react'

const LandingPage = () => {
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
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-accent-black font-bold text-xl shadow-glow">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-text-light dark:text-text-dark">
                SpendWise
              </span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#features" className="text-sm font-medium text-subtext-light dark:text-subtext-dark hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-subtext-light dark:text-subtext-dark hover:text-primary transition-colors">
                How it Works
              </a>
              <a href="#pricing" className="text-sm font-medium text-subtext-light dark:text-subtext-dark hover:text-primary transition-colors">
                Pricing
              </a>
              
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

              <Link 
                to="/login" 
                className="bg-accent-black dark:bg-white text-white dark:text-accent-black px-5 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mesh-gradient pt-32 pb-20 lg:pt-48 lg:pb-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-white dark:bg-surface-dark px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 mb-8 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-semibold uppercase tracking-wider text-subtext-light dark:text-subtext-dark">
                  Now in Beta
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-text-light dark:text-text-dark">
                Smart Finance<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark dark:from-primary dark:to-green-300">
                  Made Simple.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-subtext-light dark:text-subtext-dark mb-10 max-w-xl">
                Take control of your money with intelligent tracking, insightful analytics, and seamless budgeting—all in one beautiful app.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/register"
                  className="bg-primary text-accent-black px-8 py-4 rounded-full font-bold hover:shadow-glow hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a 
                  href="#features"
                  className="bg-white dark:bg-surface-dark text-text-light dark:text-text-dark border border-gray-200 dark:border-gray-700 px-8 py-4 rounded-full font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                >
                  Learn More
                </a>
              </div>
              
              {/* Trust badges */}
              <div className="mt-12 flex items-center gap-8 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-subtext-light dark:text-subtext-dark">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm">Free forever plan</span>
                </div>
                <div className="flex items-center gap-2 text-subtext-light dark:text-subtext-dark">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm">No credit card</span>
                </div>
              </div>
            </div>
            
            {/* Hero Image / App Preview */}
            <div className="relative">
              <div className="relative mx-auto border-accent-black dark:border-gray-900 bg-accent-black dark:bg-gray-900 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl">
                <div className="w-[148px] h-[18px] bg-accent-black dark:bg-gray-900 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                <div className="h-[32px] w-[3px] bg-accent-black dark:bg-gray-900 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-accent-black dark:bg-gray-900 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-accent-black dark:bg-gray-900 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                <div className="h-[64px] w-[3px] bg-accent-black dark:bg-gray-900 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-background-dark relative">
                  {/* App Content */}
                  <div className="pt-12 px-6">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <p className="text-xs text-subtext-light">Welcome back,</p>
                        <h3 className="font-bold text-lg text-text-light dark:text-text-dark">Alex</h3>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">A</span>
                      </div>
                    </div>
                    
                    {/* Balance Card */}
                    <div className="bg-accent-black rounded-2xl p-5 text-white mb-6 relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary opacity-30 rounded-full blur-xl"></div>
                      <p className="text-[10px] text-gray-400 mb-1">Total Balance</p>
                      <h2 className="text-2xl font-bold mb-4">৳24,500.00</h2>
                      <div className="flex gap-3">
                        <button className="bg-primary text-black text-xs font-bold px-4 py-2 rounded-full flex-1">Add</button>
                        <button className="bg-white/10 text-white text-xs font-bold px-4 py-2 rounded-full flex-1">Send</button>
                      </div>
                    </div>
                    
                    {/* Spending Chart */}
                    <div className="bg-white dark:bg-surface-dark rounded-t-3xl -mx-6 px-6 py-6 h-full">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-sm text-text-light dark:text-text-dark">Spending</h4>
                        <span className="text-xs text-subtext-light dark:text-subtext-dark">This Week</span>
                      </div>
                      <div className="flex items-end justify-between h-32 mb-6 px-2">
                        <div className="w-2 bg-gray-200 dark:bg-gray-700 h-[40%] rounded-full"></div>
                        <div className="w-2 bg-gray-200 dark:bg-gray-700 h-[60%] rounded-full"></div>
                        <div className="w-2 bg-primary h-[85%] rounded-full shadow-[0_0_10px_rgba(212,240,12,0.5)]"></div>
                        <div className="w-2 bg-gray-200 dark:bg-gray-700 h-[50%] rounded-full"></div>
                        <div className="w-2 bg-gray-200 dark:bg-gray-700 h-[30%] rounded-full"></div>
                        <div className="w-2 bg-gray-200 dark:bg-gray-700 h-[70%] rounded-full"></div>
                        <div className="w-2 bg-gray-200 dark:bg-gray-700 h-[45%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-primary to-transparent rounded-full filter blur-[100px] opacity-20 -z-10"></div>
            </div>
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-1/2 left-10 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
        <div className="absolute top-1/2 right-10 w-64 h-64 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-bold uppercase tracking-wider text-sm">Features</span>
            <h2 className="text-4xl font-bold mt-2 mb-4 text-text-light dark:text-text-dark">
              Everything you need
            </h2>
            <p className="text-subtext-light dark:text-subtext-dark max-w-2xl mx-auto">
              Powerful tools to help you track, analyze, and optimize your spending habits
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-accent-gray dark:bg-background-dark rounded-3xl p-8 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-primary-dark" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">Complete Visibility</h3>
              <p className="text-subtext-light dark:text-subtext-dark">
                See all your transactions in one place. Connect bank accounts, credit cards, and cash expenses seamlessly.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-accent-gray dark:bg-background-dark rounded-3xl p-8 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">Smart Insights</h3>
              <p className="text-subtext-light dark:text-subtext-dark">
                AI-powered analysis identifies spending patterns and suggests ways to save money automatically.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-accent-gray dark:bg-background-dark rounded-3xl p-8 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6">
                <Smartphone className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">Cross-Platform</h3>
              <p className="text-subtext-light dark:text-subtext-dark">
                Access your finances anywhere. Web, iOS, and Android apps keep you connected on the go.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-accent-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">৳2M+</p>
              <p className="text-gray-400">Transactions Tracked</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">50K+</p>
              <p className="text-gray-400">Active Users</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">4.9</p>
              <p className="text-gray-400">App Store Rating</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">128</p>
              <p className="text-gray-400">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-bold uppercase tracking-wider text-sm">How It Works</span>
            <h2 className="text-4xl font-bold mt-2 mb-4 text-text-light dark:text-text-dark">
              Get started in minutes
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-accent-black font-bold text-2xl mx-auto mb-6 shadow-glow">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">Create Account</h3>
              <p className="text-subtext-light dark:text-subtext-dark">
                Sign up for free in seconds. No credit card required to get started.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-accent-black font-bold text-2xl mx-auto mb-6 shadow-glow">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">Connect Accounts</h3>
              <p className="text-subtext-light dark:text-subtext-dark">
                Link your bank accounts securely or add transactions manually.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-accent-black font-bold text-2xl mx-auto mb-6 shadow-glow">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">Start Saving</h3>
              <p className="text-subtext-light dark:text-subtext-dark">
                Get insights, set budgets, and watch your savings grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-surface-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-light dark:text-text-dark">
            Ready to take control?
          </h2>
          <p className="text-xl text-subtext-light dark:text-subtext-dark mb-10 max-w-2xl mx-auto">
            Join thousands of users who have transformed their financial lives with SpendWise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register"
              className="bg-primary text-accent-black px-8 py-4 rounded-full font-bold hover:shadow-glow hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="bg-accent-black dark:bg-white text-white dark:text-accent-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download App
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-accent-black font-bold">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="font-bold text-xl tracking-tight">SpendWise</span>
              </div>
              <p className="text-gray-400 max-w-sm mb-6">
                Empowering users to take control of their financial future with clarity, style, and precision.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-accent-black transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-accent-black transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-primary">Product</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-primary">Company</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2024 SpendWise. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
