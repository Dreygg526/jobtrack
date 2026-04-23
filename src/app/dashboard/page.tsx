import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import KanbanBoard from '@/components/KanbanBoard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: applications } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6">
      <KanbanBoard initialApplications={applications ?? []} userId={user.id} />
    </div>
  )
}