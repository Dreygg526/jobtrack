export type Stage = 'applied' | 'screening' | 'interview' | 'offer' | 'rejected'
export type WorkType = 'remote' | 'onsite' | 'hybrid'

export interface Application {
  id: string
  user_id: string
  company: string
  role: string
  stage: Stage
  work_type: WorkType
  notes: string | null
  applied_date: string
  created_at: string
}

export const STAGES: Stage[] = ['applied', 'screening', 'interview', 'offer', 'rejected']

export const STAGE_LABELS: Record<Stage, string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
}