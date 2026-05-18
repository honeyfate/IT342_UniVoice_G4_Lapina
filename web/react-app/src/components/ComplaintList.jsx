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

export default function ComplaintList({ items, onToggle, onDelete, onSelect }){
  if(items.length===0) return <ul className="complaint-list"><li className="small">No complaints found.</li></ul>

  return (
    <ul className="complaint-list">
      {items.map(c=> (
        <li key={c.id} className="complaint-item">
          <div style={{flex:1, cursor:'pointer'}} onClick={()=>onSelect(c.id)}>
            <div className="subject">{c.subject}</div>
            <div className="meta">{c.description.slice(0,200)}</div>
            <div className="small">
              ID: {c.id} • {formatDate(c.createdAt).slice(0,10)} • {c.course||'—'} • {c.category}
              {(c.comments||[]).length>0 && ` • ${(c.comments||[]).length} comment${(c.comments||[]).length===1?'':'s'}`}
              {c.assignedTo && ` • 👤 ${c.assignedTo}`}
              {c.dueDate && ` • 📅 Due ${new Date(c.dueDate).toLocaleDateString()}`}
            </div>
          </div>
          <div className="item-actions">
            <PriorityBadge priority={c.priority||'Medium'} />
            <Pill status={c.status} />
            <button className="btn" onClick={()=> onToggle(c.id, c.status==='Resolved'? 'Open':'Resolved')}>{c.status==='Resolved'? 'Reopen':'Mark Resolved'}</button>
            <button className="btn" onClick={()=> { if(confirm('Delete this complaint?')) onDelete(c.id) }}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  )
}
import React from 'react'

function formatDate(iso){ try{ return new Date(iso).toLocaleString() }catch(e){ return iso } }

function Pill({status}){
  const cls = status==='Open'? 'pill status-open': status==='Resolved'? 'pill status-resolved':'pill status-progress'
  return <span className={cls}>{status}</span>
}

export default function ComplaintList({ items, onToggle, onDelete }){
  if(items.length===0) return <ul className="complaint-list"><li className="small">No complaints found.</li></ul>

  return (
    <ul className="complaint-list">
      {items.map(c=> (
        <li key={c.id} className="complaint-item">
          <div style={{flex:1}}>
            <div className="subject">{c.subject}</div>
            <div className="meta">{c.description.slice(0,200)}</div>
            <div className="small">ID: {c.id} • {formatDate(c.createdAt)} • {c.course||'—'} • {c.category}</div>
          </div>
          <div className="item-actions">
            <Pill status={c.status} />
            <button className="btn" onClick={()=> onToggle(c.id, c.status==='Resolved'? 'Open':'Resolved')}>{c.status==='Resolved'? 'Reopen':'Mark Resolved'}</button>
            <button className="btn" onClick={()=> { if(confirm('Delete this complaint?')) onDelete(c.id) }}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  )
}
