import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'


export default async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/login')
}

