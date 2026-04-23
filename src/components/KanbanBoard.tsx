'use client'
import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Application, Stage, STAGES, STAGE_LABELS } from '@/types'
import ApplicationCard from './ApplicationCard'
import AddApplicationModal from './AddApplicationModal'

export default function KanbanBoard({
  initialApplications,
  userId
}: {
  initialApplications: Application[]
  userId: string
}) {
  const [apps, setApps] = useState(initialApplications)
  const [showModal, setShowModal] = useState(false)
  const [activeStage, setActiveStage] = useState<Stage>('applied')

  const total = apps.length
  const byStage = STAGES.reduce((acc, s) => ({
    ...acc,
    [s]: apps.filter(a => a.stage === s).length
  }), {} as Record<string, number>)
  const rate = total > 0 ? Math.round((byStage.offer / total) * 100) : 0

  const stats = [
    { label: 'Total', value: total },
    { label: 'Screening', value: byStage.screening },
    { label: 'Interviews', value: byStage.interview },
    { label: 'Offers', value: byStage.offer },
    { label: 'Rate', value: rate + '%' },
  ]

  async function onDragEnd(result: DropResult) {
    if (!result.destination) return
    const { draggableId, destination } = result
    const newStage = destination.droppableId as Stage
    setApps(prev => prev.map(a =>
      a.id === draggableId ? { ...a, stage: newStage } : a
    ))
    await fetch(`/api/applications/${draggableId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: newStage }),
    })
  }

  function handleAdded(app: Application) {
    setApps(prev => [app, ...prev])
    setShowModal(false)
  }

  async function handleDelete(id: string) {
    setApps(prev => prev.filter(a => a.id !== id))
    await fetch(`/api/applications/${id}`, { method: 'DELETE' })
  }

  function handleUpdate(updated: Application) {
    setApps(prev => prev.map(a => a.id === updated.id ? updated : a))
  }

  const STAGE_COLORS: Record<Stage, string> = {
    applied: '#6dbfb8',
    screening: '#f0a500',
    interview: '#5b8dd9',
    offer: '#4caf7d',
    rejected: '#e05c5c',
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-5 gap-2 md:gap-4 mb-6 md:mb-8">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl p-3 md:p-4 text-white"
            style={{ backgroundColor: '#2d3e50' }}>
            <p className="text-xs uppercase tracking-wide mb-1 truncate" style={{ color: '#6dbfb8' }}>
              {s.label}
            </p>
            <p className="text-xl md:text-3xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Pipeline Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base md:text-lg font-bold" style={{ color: '#2d3e50' }}>Pipeline</h2>
        <button
          onClick={() => setShowModal(true)}
          className="text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#6dbfb8', color: '#2d3e50' }}
        >
          + Add
        </button>
      </div>

      {/* Mobile Stage Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 md:hidden">
        {STAGES.map(stage => (
          <button
            key={stage}
            onClick={() => setActiveStage(stage)}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all"
            style={{
              backgroundColor: activeStage === stage ? STAGE_COLORS[stage] : '#f5f7fa',
              color: activeStage === stage ? 'white' : '#2d3e50',
              border: `1px solid ${STAGE_COLORS[stage]}`
            }}
          >
            {STAGE_LABELS[stage]} ({apps.filter(a => a.stage === stage).length})
          </button>
        ))}
      </div>

      {/* Kanban — Desktop: all columns, Mobile: single active column */}
      <DragDropContext onDragEnd={onDragEnd}>

        {/* Desktop */}
        <div className="hidden md:grid grid-cols-5 gap-4">
          {STAGES.map(stage => (
            <div key={stage} className="rounded-xl p-3"
              style={{ backgroundColor: '#f5f7fa', border: '1px solid #e2e8f0' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_COLORS[stage] }} />
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#2d3e50' }}>
                    {STAGE_LABELS[stage]}
                  </span>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: STAGE_COLORS[stage] }}>
                  {apps.filter(a => a.stage === stage).length}
                </span>
              </div>
              <Droppable droppableId={stage}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[200px]">
                    {apps.filter(a => a.stage === stage).map((app, index) => (
                      <Draggable key={app.id} draggableId={app.id} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <ApplicationCard app={app} onDelete={handleDelete} onUpdate={handleUpdate} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>

        {/* Mobile — show only active stage */}
        <div className="md:hidden">
          <Droppable droppableId={activeStage}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}
                className="rounded-xl p-3 min-h-[300px]"
                style={{ backgroundColor: '#f5f7fa', border: '1px solid #e2e8f0' }}>
                {apps.filter(a => a.stage === activeStage).length === 0 && (
                  <p className="text-center text-sm text-slate-400 mt-8">No applications here</p>
                )}
                {apps.filter(a => a.stage === activeStage).map((app, index) => (
                  <Draggable key={app.id} draggableId={app.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <ApplicationCard app={app} onDelete={handleDelete} onUpdate={handleUpdate} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

      </DragDropContext>

      {showModal && (
        <AddApplicationModal
          userId={userId}
          onClose={() => setShowModal(false)}
          onAdded={handleAdded}
        />
      )}
    </div>
  )
}