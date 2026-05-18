import React from 'react'

function formatDate(iso){ try{ return new Date(iso).toLocaleString() }catch(e){ return iso } }

export default function Timeline({ complaint }) {
  // Build timeline from complaint events
  const events = []
  
  if(complaint.createdAt) events.push({
    type: 'created',
    time: complaint.createdAt,
    label: 'Complaint submitted'
  })

  // Track status changes (if stored in history)
  if(complaint.statusHistory){
    complaint.statusHistory.forEach(h=> events.push({
      type: 'status-change',
      time: h.changedAt,
      label: `Status changed to ${h.status}`
    }))
  }

  // Show when assigned
  if(complaint.assignedTo && complaint.assignedAt){
    events.push({
      type: 'assigned',
      time: complaint.assignedAt,
      label: `Assigned to ${complaint.assignedTo}`
    })
  }

  // Due date
  if(complaint.dueDate){
    const due = new Date(complaint.dueDate)
    const now = new Date()
    const isOverdue = due < now && complaint.status !== 'Resolved'
    events.push({
      type: 'due-date',
      time: complaint.dueDate,
      label: `Due date: ${due.toLocaleDateString()}`,
      isOverdue
    })
  }

  // Comments
  if(complaint.comments){
    complaint.comments.forEach(c=> events.push({
      type: 'comment',
      time: c.createdAt,
      label: 'Comment added'
    }))
  }

  // Sort by date
  events.sort((a,b)=> new Date(a.time) - new Date(b.time))

  return (
    <div className="timeline">
      <h3>History & Timeline</h3>
      <div className="timeline-items">
        {events.map((e, i)=> (
          <div key={i} className={`timeline-item timeline-${e.type}${e.isOverdue ? ' overdue' : ''}`}>
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <div className="timeline-label">{e.label}</div>
              <div className="timeline-time">{formatDate(e.time)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
