'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    website: '',
    avatar_url: ''
  })
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchUserAndProfile() {
      try {
        // Fetch current session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/login')
          return
        }

        setUser(session.user)

        // Fetch profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.warn('No profile found, using default values')
        }

        if (data) {
          setProfile({
            username: data.username || '',
            full_name: data.full_name || '',
            website: data.website || '',
            avatar_url: data.avatar_url || ''
          })
        }
      } catch (error) {
        console.error('Error fetching user and profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndProfile()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    
    if (!user) return

    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: profile.username,
          full_name: profile.full_name,
          website: profile.website,
          avatar_url: profile.avatar_url,
          updated_at: new Date()
        })

      if (error) throw error

      alert('Profile updated successfully!')
    } catch (error) {
      alert('Error updating profile')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    try {
      setUploading(true)
      
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      if (urlError) {
        throw urlError
      }

      // Update profile with new avatar URL
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: publicUrl
        })

      if (profileUpdateError) {
        throw profileUpdateError
      }

      setProfile(prev => ({
        ...prev,
        avatar_url: publicUrl
      }))
    } catch (error) {
      alert('Error uploading avatar')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      {/* Avatar Upload */}
      <div className="mb-4">
        <label className="block mb-2">Profile Picture</label>
        {profile.avatar_url && (
          <img 
            src={profile.avatar_url} 
            alt="Avatar" 
            className="w-24 h-24 rounded-full object-cover mb-2"
          />
        )}
        <input 
          type="file" 
          accept="image/*"
          onChange={handleAvatarUpload}
          disabled={uploading}
          className="block w-full text-sm"
        />
        {uploading && <p>Uploading...</p>}
      </div>

      {/* Profile Form */}
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input 
            type="email" 
            value={user.email} 
            disabled 
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1">Username</label>
          <input 
            type="text"
            name="username"
            value={profile.username}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Full Name</label>
          <input 
            type="text"
            name="full_name"
            value={profile.full_name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* <div>
          <label className="block mb-1">Website</label>
          <input 
            type="url"
            name="website"
            value={profile.website}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div> */}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="w-full mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  )
}