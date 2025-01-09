// utils/supabase/client.js
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => {
  return createClientComponentClient()
}

export const getUserProfile = async (supabase) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.warn('No profile found')
      return null
    }

    return profile
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

// Optional: Provide a context or hook for easier access
export const useUserProfile = () => {
  const supabase = createClient()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const userProfile = await getUserProfile(supabase)
      setProfile(userProfile)
    }

    fetchProfile()
  }, [])

  return profile
}