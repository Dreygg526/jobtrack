import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await context.params
  const body = await req.json()
  const { data, error } = await supabase
    .from('applications')
    .update(body)
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await context.params
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}