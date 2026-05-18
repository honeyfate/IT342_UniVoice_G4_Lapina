import React, { useEffect, useMemo, useState } from 'react'
import ComplaintForm from './components/ComplaintForm'
import ComplaintList from './components/ComplaintList'

const STORAGE_KEY = 'univoice_complaints_v1'

function readStorage(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }catch(e){ return [] }
}
function writeStorage(list){ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) }

export default function App(){
  const [complaints, setComplaints] = useState(() => readStorage())
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(()=>{ writeStorage(complaints) }, [complaints])

  function addComplaint(c){
    setComplaints(prev => [c, ...prev])
  }

  function updateStatus(id, status){
    setComplaints(prev => prev.map(p=> p.id===id? {...p, status}:p))
  }

  function removeComplaint(id){
    setComplaints(prev => prev.filter(p=>p.id!==id))
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
      if(!q) return true
      return [c.subject, c.description, c.course, c.id, c.studentId, c.name, c.category]
        .filter(Boolean)
        .some(s=>s.toLowerCase().includes(q))
    })
  },[complaints,query,statusFilter])

  return (
    <div className="app-root">
      <header className="site-header">
        <h1>UniVoice — Student Complaint System</h1>
        <p className="subtitle">Submit and track complaints (stored in your browser)</p>
      </header>
      <main className="container">
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
            <button className="btn" onClick={exportCsv}>Export CSV</button>
          </div>
          <ComplaintList items={filtered} onToggle={updateStatus} onDelete={removeComplaint} />
        </section>
      </main>
      <footer className="site-footer">
        <small>UniVoice — Demo. Data stored in browser.</small>
      </footer>
    </div>
  )
}
