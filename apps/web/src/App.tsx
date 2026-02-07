import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Categories from './pages/Categories'
import Login from './pages/Login'
import Register from './pages/Register'
import LandingPage from './pages/LandingPage'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <Routes>
      {/* Landing Page - Default route */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
      } />
      
      {/* Public Routes */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
      } />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
      }>
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="/transactions" element={
        isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
      }>
        <Route index element={<Transactions />} />
      </Route>
      <Route path="/categories" element={
        isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
      }>
        <Route index element={<Categories />} />
      </Route>
    </Routes>
  )
}

export default App
