// components/Login.js
'use client'

import { useState } from 'react'
import { createClient } from '../../utils/supabase/client'



export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const supabase = createClient()

  const handleLogin = async (e) => {
    e.preventDefault()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Login error:', error)
      return
    }

    // Redirect or update UI after successful login
    console.log('Logged in:', data)
  }

  return (

<>
<form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required 
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required 
      />
      <button type="submit">Login</button>
    </form>
<button type="submit">Login</button>


</>
    
  )
}