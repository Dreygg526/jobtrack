'use client'
import { useState } from 'react'
import { Application, Stage, WorkType } from '@/types'

export default function AddApplicationModal({
  userId,
  onClose,
  onAdded
}: {
  userId: string
  onClose: () => void
  onAdded: (app: Application) => void
}) {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [stage, setStage] = useState<Stage>('applied')
  const [workType, setWorkType] = useState<WorkType>('remote')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company,
        role,
        stage,
        work_type: workType,
        user_id: userId
      }),
    })
    const data = await res.json()
    onAdded(data)
    setLoading(false)
  }

  const inputClass = "w-full border rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="font-semibold text-lg mb-4 text-slate-900">New Application</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            placeholder="Company"
            value={company}
            onChange={e => setCompany(e.target.value)}
            required
            className={inputClass}
          />
          <input
            placeholder="Role"
            value={role}
            onChange={e => setRole(e.target.value)}
            required
            className={inputClass}
          />
          <select
            value={stage}
            onChange={e => setStage(e.target.value as Stage)}
            className={inputClass}
          >
            <option value="applied">Applied</option>
            <option value="screening">Screening</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={workType}
            onChange={e => setWorkType(e.target.value as WorkType)}
            className={inputClass}
          >
            <option value="remote">Remote</option>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border rounded-lg py-2 text-sm text-slate-900 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-slate-900 text-white rounded-lg py-2 text-sm hover:bg-slate-700"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}