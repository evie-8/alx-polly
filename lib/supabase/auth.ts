import { createClient } from './server'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const supabase = createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }
    
    return user
  } catch (error) {
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  return user
}
