import { Application, STAGES } from '@/types'

export default function StatsBar({ applications }: { applications: Application[] }) {
  const total = applications.length
  const byStage = STAGES.reduce((acc, s) => ({
    ...acc,
    [s]: applications.filter(a => a.stage === s).length
  }), {} as Record<string, number>)

  const rate = total > 0 ? Math.round((byStage.offer / total) * 100) : 0

  const stats = [
    { label: 'Total Applied', value: total },
    { label: 'Screening', value: byStage.screening },
    { label: 'Interviews', value: byStage.interview },
    { label: 'Offers', value: byStage.offer },
    { label: 'Offer Rate', value: rate + '%' },
  ]

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-xl border p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{s.label}</p>
          <p className="text-2xl font-semibold">{s.value}</p>
        </div>
      ))}
    </div>
  )
}