'use client'
import { Application, WorkType } from '@/types'
import { useState } from 'react'

const TYPE_COLORS = {
  remote: 'bg-emerald-50 text-emerald-700',
  onsite: 'bg-blue-50 text-blue-700',
  hybrid: 'bg-purple-50 text-purple-700',
}

export default function ApplicationCard({
  app,
  onDelete,
  onUpdate,
}: {
  app: Application
  onDelete: (id: string) => void
  onUpdate: (updated: Application) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [company, setCompany] = useState(app.company)
  const [role, setRole] = useState(app.role)
  const [workType, setWorkType] = useState<WorkType>(app.work_type)
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    const res = await fetch(`/api/applications/${app.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company, role, work_type: workType }),
    })
    const updated = await res.json()
    onUpdate(updated)
    setIsEditing(false)
    setLoading(false)
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg p-3 mb-2 border border-slate-200">
        <input
          value={company}
          onChange={e => setCompany(e.target.value)}
          className="w-full border rounded px-2 py-1 text-xs text-slate-900 mb-1 focus:outline-none"
          placeholder="Company"
        />
        <input
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full border rounded px-2 py-1 text-xs text-slate-900 mb-2 focus:outline-none"
          placeholder="Role"
        />
        <select
          value={workType}
          onChange={e => setWorkType(e.target.value as WorkType)}
          className="w-full border rounded px-2 py-1 text-xs text-slate-900 mb-2 focus:outline-none"
        >
          <option value="remote">Remote</option>
          <option value="onsite">On-site</option>
          <option value="hybrid">Hybrid</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="text-xs px-2 py-1 rounded text-white"
            style={{ backgroundColor: '#6dbfb8' }}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="text-xs px-2 py-1 rounded border text-slate-500"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-3 mb-2 border border-slate-100">
      <p className="font-medium text-sm text-slate-800">{app.company}</p>
      <p className="text-xs text-slate-500 mb-2">{app.role}</p>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[app.work_type]}`}>
          {app.work_type}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-medium"
            style={{ color: '#6dbfb8' }}
          >
            edit
          </button>
          <button
            onClick={() => onDelete(app.id)}
            className="text-xs text-slate-400 hover:text-red-500"
          >
            remove
          </button>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-1">{app.applied_date}</p>
    </div>
  )
}