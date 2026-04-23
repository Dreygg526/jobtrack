import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NavBar from '@/components/NavBar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f7fa' }}>
      <NavBar userEmail={user.email!} />
      <main className="p-6">{children}</main>
    </div>
  )
}