import React, { useState } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'

const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState(initialMode) // 'signin', 'signup', 'forgot'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { signIn, signUp, resetPassword } = useAuth()

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess('')
    setShowPassword(false)
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    resetForm()
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const validateForm = () => {
    if (!email) {
      setError('Email is required')
      return false
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }

    if (mode !== 'forgot' && !password) {
      setError('Password is required')
      return false
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long')
        return false
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    setIsLoading(true)

    try {
      let result
      
      switch (mode) {
        case 'signin':
          result = await signIn(email, password)
          if (result.success) {
            setSuccess('Successfully signed in!')
            setTimeout(() => handleClose(), 1500)
          } else {
            setError(result.error)
          }
          break

        case 'signup':
          result = await signUp(email, password)
          if (result.success) {
            setSuccess('Account created! Please check your email to verify your account.')
            setTimeout(() => handleClose(), 3000)
          } else {
            setError(result.error)
          }
          break

        case 'forgot':
          result = await resetPassword(email)
          if (result.success) {
            setSuccess('Password reset email sent! Check your inbox.')
            setTimeout(() => handleModeChange('signin'), 3000)
          } else {
            setError(result.error)
          }
          break

        default:
          setError('Invalid mode')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Auth error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const renderForm = () => {
    switch (mode) {
      case 'signin':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center text-gray-900">
              Welcome Back
            </h2>
            <p className="text-center text-gray-600">
              Sign in to your AnimateFlow account
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-5 h-5" />}
                  disabled={isLoading}
                />
              </div>
              
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-5 h-5" />}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <button
                onClick={() => handleModeChange('forgot')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Forgot your password?
              </button>
              <div className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => handleModeChange('signup')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        )

      case 'signup':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center text-gray-900">
              Create Account
            </h2>
            <p className="text-center text-gray-600">
              Join AnimateFlow and start creating amazing animations
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-5 h-5" />}
                  disabled={isLoading}
                />
              </div>
              
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-5 h-5" />}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<Lock className="w-5 h-5" />}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center">
              <div className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => handleModeChange('signin')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        )

      case 'forgot':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center text-gray-900">
              Reset Password
            </h2>
            <p className="text-center text-gray-600">
              Enter your email address and we'll send you a reset link
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-5 h-5" />}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="text-center">
              <button
                onClick={() => handleModeChange('signin')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Back to sign in
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {renderForm()}
      </div>
    </Modal>
  )
}

export default AuthModal
