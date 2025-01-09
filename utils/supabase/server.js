// utils/supabase/server.js
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createClient = () => {
  return createServerComponentClient({ cookies })
}

export const getSession = async () => {
  const supabase = createClient()
  
  try {
    // Fetch session
    const { data: { session } } = await supabase.auth.getSession()
    
    // If no session, return null
    if (!session) return null

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    // Attach profile to the session if found
    return {
      ...session,
      profile: profile || null
    }
  } catch (error) {
    console.error('Error fetching session:', error)
    return null
  }
}

// Helper to get current user's ID server-side
export const getCurrentUserId = async () => {
  const session = await getSession()
  return session?.user?.id || null
}