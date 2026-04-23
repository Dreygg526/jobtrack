'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function NavBar({ userEmail }: { userEmail: string }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <nav className="px-4 md:px-6 py-3 flex items-center justify-between" style={{ backgroundColor: '#2d3e50' }}>
      <span className="text-lg md:text-xl font-bold text-white">JobTrack</span>
      <div className="flex items-center gap-2 md:gap-4">
        <span className="text-xs md:text-sm hidden sm:block truncate max-w-[150px] md:max-w-none" style={{ color: '#6dbfb8' }}>
          {userEmail}
        </span>
        <button
          onClick={handleSignOut}
          className="text-xs md:text-sm px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#6dbfb8', color: '#2d3e50' }}
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}