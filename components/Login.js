'use client'

import { useState } from 'react'
import { createClient } from '../utils/supabase/client'

export default function AuthPopup({ open, setIsOpen }) {
  const [activeTab, setActiveTab] = useState('login') // 'login' или 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('') // Държи съобщения за грешка
  const [success, setSuccess] = useState('') // Съобщение за успех

  const supabase = createClient()

  const closePopup = () => {
    setIsOpen(false)
    setError('')
    setSuccess('')
  }

  // Логика за Login
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) setError(error.message)
    else closePopup()
  }

  // Логика за Register
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Registration successful! A confirmation email has been sent to your inbox.')
      setTimeout(() => closePopup(), 2000) // Автоматично затваря popup-a
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 animate-slide-up">
        {/* Tabs */}
        <div className="flex justify-around mb-4 border-b pb-2">
          <button
            className={`w-1/2 text-center font-medium ${
              activeTab === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`w-1/2 text-center font-medium ${
              activeTab === 'register'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {/* Content */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-300"
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <input
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {/* {success && <p className="text-green-500 text-sm">{success}</p>} */}
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-all duration-300"
            >
              Register
            </button>
          </form>
        )}

        {/* Close button */}
        <button
          onClick={closePopup}
          className="mt-4 text-gray-500 hover:text-gray-700 text-sm transition-all"
        >
          Close
        </button>
      </div>
    </div>
  )
}
