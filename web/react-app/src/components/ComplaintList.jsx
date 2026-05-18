import React from 'react'

function formatDate(iso){ try{ return new Date(iso).toLocaleString() }catch(e){ return iso } }

function Pill({status}){
  const cls = status==='Open'? 'pill status-open': status==='Resolved'? 'pill status-resolved':'pill status-progress'
  return <span className={cls}>{status}</span>
}

function PriorityBadge({priority}){
  const cls = priority==='Critical'? 'priority-critical': priority==='High'? 'priority-high': priority==='Low'? 'priority-low':'priority-medium'
  return <span className={`priority-badge ${cls}`}>{priority}</span>
}

export default function ComplaintList({ items, onToggle, onDelete, onSelect, selectedIds = [], onToggleSelect }){
  if(!items || items.length===0) return <ul className="complaint-list"><li className="small">No complaints found.</li></ul>

  return (
    <ul className="complaint-list">
      {items.map(c=> (
        <li key={c.id} className="complaint-item" style={{display:'flex',alignItems:'flex-start',gap:10}}>
          <div style={{marginTop:6}}>
            <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={(e)=>{ e.stopPropagation(); onToggleSelect && onToggleSelect(c.id) }} />
          </div>
          <div style={{flex:1, cursor:'pointer'}} onClick={()=> onSelect && onSelect(c.id)}>
            <div className="subject">{c.subject}</div>
            <div className="meta">{c.description.slice(0,200)}</div>
            <div className="small">
              ID: {c.id} • {formatDate(c.createdAt).slice(0,10)} • {c.course||'—'} • {c.category}
              {(c.comments||[]).length>0 && ` • ${(c.comments||[]).length} comment${(c.comments||[]).length===1?'':'s'}`}
              {c.assignedTo && ` • 👤 ${c.assignedTo}`}
              {c.dueDate && ` • 📅 Due ${new Date(c.dueDate).toLocaleDateString()}`}
            </div>
          </div>
          <div className="item-actions" style={{display:'flex',flexDirection:'column',gap:8}}>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <PriorityBadge priority={c.priority||'Medium'} />
              <Pill status={c.status} />
            </div>
            <div style={{display:'flex',gap:6}}>
              <button className="btn" onClick={(e)=>{ e.stopPropagation(); onToggle && onToggle(c.id, c.status==='Resolved'? 'Open':'Resolved') }}>{c.status==='Resolved'? 'Reopen':'Mark Resolved'}</button>
              <button className="btn danger" onClick={(e)=>{ e.stopPropagation(); if(confirm('Delete this complaint?')) onDelete && onDelete(c.id) }}>Delete</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
