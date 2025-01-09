'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../utils/supabase/client'
import { useSearchParams } from 'next/navigation'

export default function ConfirmEmail() {
  const [status, setStatus] = useState('Verifying...') // Loading message
  const searchParams = useSearchParams() // Fetch URL params
  const supabase = createClient()

  useEffect(() => {
    const confirmEmail = async () => {
      const token_hash = searchParams.get('token_hash')
      const type = searchParams.get('type')

      if (!token_hash || type !== 'email') {
        setStatus('Invalid confirmation link. Please try again.')
        return
      }

      const { error } = await supabase.auth.verifyOtp({
        type: 'email',
        token_hash,
      })

      if (error) {
        setStatus('Failed to verify email. Please try again or contact support.')
        console.error('Email confirmation error:', error.message)
      } else {
        setStatus('Your email has been successfully confirmed! 🎉')
      }
    }

    confirmEmail()
  }, [searchParams])

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-4 text-blue-600">Email Confirmation</h1>
        <p className="text-gray-700">{status}</p>
      </div>
    </div>
  )
}
