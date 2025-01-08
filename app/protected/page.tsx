

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { signOutAction } from '../actions'
import Patient from '@/components/patient'

export default async function PrivatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error logging out:", error.message)
      return
    }
    // Redirect to login after successful logout
    redirect('/login')
  }

  return (
  <div>
        <p>Hello {data.user.email}</p>
        <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
        </form>
        <Patient />
        
      
  </div>
  
  )
}