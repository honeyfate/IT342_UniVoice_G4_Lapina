import React, { useEffect, useMemo, useState } from 'react'
import ComplaintForm from './components/ComplaintForm'
import ComplaintList from './components/ComplaintList'
import ComplaintDetail from './components/ComplaintDetail'
import Dashboard from './components/Dashboard'

const STORAGE_KEY = 'univoice_complaints_v1'

const USERS = [
  { name: 'Alice (Student)', role: 'student' },
  { name: 'Bob (Student)', role: 'student' },
  { name: 'Staff (Admin)', role: 'admin' }
]
function readStorage(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }catch(e){ return [] }
}
function writeStorage(list){ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) }

export default function App(){
  const [complaints, setComplaints] = useState(() => readStorage())
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const [currentUser, setCurrentUser] = useState(USERS[0])
  const [selectedIds, setSelectedIds] = useState([])

  useEffect(()=>{ writeStorage(complaints) }, [complaints])

  function addComplaint(c){
    setComplaints(prev => [c, ...prev])
  }

  function updateStatus(id, status){
    setComplaints(prev => prev.map(p=> p.id===id? {...p, status}:p))
  }

  function removeComplaint(id){
    setComplaints(prev => prev.filter(p=>p.id!==id))
    setSelectedId(null)
  }

  function addComment(id, comment){
    setComplaints(prev => prev.map(p=> {
      if(p.id!==id) return p
      return {
        ...p,
        comments: [...(p.comments||[]), {
          id: 'cm-'+Date.now().toString(36),
          text: comment.trim(),
          createdAt: new Date().toISOString()
        }]
      }
    }))
  }

  function removeComment(complaintId, commentId){
    setComplaints(prev => prev.map(p=> {
      if(p.id!==complaintId) return p
      return {...p, comments: (p.comments||[]).filter(c=>c.id!==commentId)}
    }))
  }

  // selection for bulk actions
  function toggleSelect(id){
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id])
  }

  function clearSelection(){ setSelectedIds([]) }

  function bulkDelete(){
    if(selectedIds.length===0){ alert('No items selected'); return }
    if(!confirm(`Delete ${selectedIds.length} selected complaint(s)?`)) return
    setComplaints(prev => prev.filter(p=> !selectedIds.includes(p.id)))
    clearSelection()
  }

  function bulkMarkResolved(){
    if(selectedIds.length===0){ alert('No items selected'); return }
    setComplaints(prev => prev.map(p=> selectedIds.includes(p.id)? {...p, status:'Resolved', resolvedAt: new Date().toISOString() }: p))
    clearSelection()
  }

  function bulkAssign(staffName){
    if(selectedIds.length===0){ alert('No items selected'); return }
    setComplaints(prev => prev.map(p=> selectedIds.includes(p.id)? {...p, assignedTo: staffName, assignedAt: staffName? new Date().toISOString():null }: p))
    clearSelection()
  }

  function exportJson(){
    const blob = new Blob([JSON.stringify(complaints,null,2)],{type:'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'complaints.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
  }

  function importJsonFile(file){
    const reader = new FileReader()
    reader.onload = e=>{
      try{
        const data = JSON.parse(e.target.result)
        if(!Array.isArray(data)) throw new Error('Invalid file')
        // merge, avoid id collisions
        const existingIds = new Set(complaints.map(c=>c.id))
        const newItems = data.filter(d=>d && d.id && !existingIds.has(d.id))
        if(newItems.length===0){ alert('No new complaints found in file') }
        setComplaints(prev => [...newItems, ...prev])
      }catch(err){ alert('Failed to import JSON: '+err.message) }
    }
    reader.readAsText(file)
  }

  function assignStaff(id, staffName){
    setComplaints(prev => prev.map(p=> 
      p.id===id? {...p, assignedTo: staffName||null, assignedAt: staffName? new Date().toISOString():null}:p
    ))
  }

  function setDueDate(id, dueDate){
    setComplaints(prev => prev.map(p=> 
      p.id===id? {...p, dueDate: dueDate||null}:p
    ))
  }

  function exportCsv(){
    if(complaints.length===0){ alert('No complaints to export'); return }
    const keys = ['id','createdAt','status','category','subject','description','name','studentId','email','course']
    const lines = [keys.join(',')]
    for(const r of complaints){
      const row = keys.map(k=>`"${(r[k]||'').toString().replace(/"/g,'""')}"`)
      lines.push(row.join(','))
    }
    const blob = new Blob([lines.join('\n')],{type:'text/csv'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'complaints.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
  }

  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase()
    return complaints.filter(c=>{
      if(statusFilter!=='all' && c.status!==statusFilter) return false
      if(priorityFilter!=='all' && c.priority!==priorityFilter) return false
      if(!q) return true
      return [c.subject, c.description, c.course, c.id, c.studentId, c.name, c.category]
        .filter(Boolean)
        .some(s=>s.toLowerCase().includes(q))
    })
  },[complaints,query,statusFilter,priorityFilter])

  return (
    <div className="app-root">
      <header className="site-header">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <h1>UniVoice — Student Complaint System</h1>
            <p className="subtitle">Submit and track complaints (stored in your browser)</p>
          </div>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <label style={{color:'white',fontSize:13,opacity:.95}}>User:</label>
            <select value={currentUser.name} onChange={e=> setCurrentUser(USERS.find(u=>u.name===e.target.value))}>
              {USERS.map(u=> <option key={u.name} value={u.name}>{u.name} — {u.role}</option>)}
            </select>
          </div>
        </div>
      </header>
      <main className="container">
        <Dashboard complaints={complaints} />
        <section className="panel form-panel">
          <h2>Submit Complaint</h2>
          <ComplaintForm onSubmit={addComplaint} />
        </section>

        <section className="panel list-panel">
          <h2>Complaints</h2>
          <div className="controls">
            <input placeholder="Search subject, description, course, id..." value={query} onChange={e=>setQuery(e.target.value)} />
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <select value={priorityFilter} onChange={e=>setPriorityFilter(e.target.value)}>
              <option value="all">All priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <button className="btn" onClick={exportCsv}>Export CSV</button>
            <button className="btn" onClick={exportJson}>Export JSON</button>
            <label className="btn" style={{display:'inline-block',cursor:'pointer',padding:'8px 12px'}}>
              Import JSON
              <input type="file" accept="application/json" style={{display:'none'}} onChange={e=>{ if(e.target.files && e.target.files[0]) importJsonFile(e.target.files[0]); e.target.value='' }} />
            </label>
          </div>

          <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:10}}>
            <div style={{fontSize:13,color:'#374151'}}>Selected: {selectedIds.length}</div>
            <button className="btn" onClick={bulkMarkResolved}>Mark Resolved</button>
            <button className="btn" onClick={bulkDelete}>Delete</button>
            <button className="btn" onClick={()=>{ const name = prompt('Assign selected to (staff name):'); if(name) bulkAssign(name) }}>Assign...</button>
          </div>

          <ComplaintList items={filtered} onToggle={updateStatus} onDelete={removeComplaint} onSelect={setSelectedId} selectedIds={selectedIds} onToggleSelect={toggleSelect} />
        </section>
        {selectedId && <ComplaintDetail complaint={complaints.find(c=>c.id===selectedId)} onClose={()=>setSelectedId(null)} onAddComment={addComment} onRemoveComment={removeComment} onUpdateStatus={updateStatus} onAssignStaff={assignStaff} onSetDueDate={setDueDate} />}
      </main>
      <footer className="site-footer">
        <small>UniVoice — Demo. Data stored in browser.</small>
      </footer>
    </div>
  )
}
