// Simple complaint system using localStorage
(function(){
  const STORAGE_KEY = 'univoice_complaints_v1'

  function uid(){
    return 'c-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9)
  }

  function readStorage(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw? JSON.parse(raw): []
    }catch(e){
      console.error('readStorage',e); return []
    }
  }

  function writeStorage(list){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  }

  // DOM refs
  const form = document.getElementById('complaintForm')
  const listEl = document.getElementById('complaintList')
  const searchEl = document.getElementById('search')
  const filterStatus = document.getElementById('filterStatus')
  const exportBtn = document.getElementById('exportCsv')
  const clearBtn = document.getElementById('clearForm')

  function getFormData(){
    return {
      id: uid(),
      name: document.getElementById('name').value.trim(),
      studentId: document.getElementById('studentId').value.trim(),
      email: document.getElementById('email').value.trim(),
      course: document.getElementById('course').value.trim(),
      category: document.getElementById('category').value,
      subject: document.getElementById('subject').value.trim(),
      description: document.getElementById('description').value.trim(),
      status: 'Open',
      createdAt: new Date().toISOString()
    }
  }

  function clearForm(){
    form.reset()
  }

  function validate(data){
    if(!data.subject) return 'Subject is required'
    if(!data.description) return 'Description is required'
    return null
  }

  function render(){
    const all = readStorage()
    const q = (searchEl.value||'').toLowerCase()
    const statusFilter = filterStatus.value
    const filtered = all.filter(c=>{
      if(statusFilter!=='all' && c.status!==statusFilter) return false
      if(!q) return true
      return [c.subject, c.description, c.course, c.id, c.studentId, c.name, c.category]
        .filter(Boolean)
        .some(s=>s.toLowerCase().includes(q))
    }).sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt))

    listEl.innerHTML = ''
    if(filtered.length===0){
      listEl.innerHTML = '<li class="small">No complaints found.</li>'
      return
    }

    for(const c of filtered){
      const li = document.createElement('li')
      li.className = 'complaint-item'

      const left = document.createElement('div')
      left.style.flex = '1'
      left.innerHTML = `<div class="subject">${escapeHtml(c.subject)}</div>
        <div class="meta">${escapeHtml(c.description.slice(0,200))}</div>
        <div class="small">ID: ${c.id} • ${formatDate(c.createdAt)} • ${escapeHtml(c.course||'—')} • ${escapeHtml(c.category)}</div>`

      const right = document.createElement('div')
      right.className = 'item-actions'

      const statusPill = document.createElement('span')
      statusPill.className = 'pill ' + (c.status==='Open'? 'status-open': c.status==='Resolved'? 'status-resolved':'status-progress')
      statusPill.textContent = c.status

      const toggleBtn = document.createElement('button')
      toggleBtn.className = 'btn'
      toggleBtn.textContent = c.status==='Resolved'? 'Reopen': 'Mark Resolved'
      toggleBtn.onclick = ()=>{
        updateStatus(c.id, c.status==='Resolved'? 'Open':'Resolved')
      }

      const delBtn = document.createElement('button')
      delBtn.className = 'btn'
      delBtn.textContent = 'Delete'
      delBtn.onclick = ()=>{ if(confirm('Delete this complaint?')) removeComplaint(c.id) }

      right.appendChild(statusPill)
      right.appendChild(toggleBtn)
      right.appendChild(delBtn)

      li.appendChild(left)
      li.appendChild(right)
      listEl.appendChild(li)
    }
  }

  function escapeHtml(s){
    if(!s) return ''
    return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
  }

  function formatDate(iso){
    try{ const d = new Date(iso); return d.toLocaleString() }catch(e){return iso}
  }

  function addComplaint(data){
    const list = readStorage()
    list.push(data)
    writeStorage(list)
    render()
  }

  function updateStatus(id,status){
    const list = readStorage()
    const idx = list.findIndex(x=>x.id===id)
    if(idx===-1) return
    list[idx].status = status
    writeStorage(list)
    render()
  }

  function removeComplaint(id){
    let list = readStorage()
    list = list.filter(x=>x.id!==id)
    writeStorage(list)
    render()
  }

  function exportCsv(){
    const list = readStorage()
    if(list.length===0){ alert('No complaints to export'); return }
    const keys = ['id','createdAt','status','category','subject','description','name','studentId','email','course']
    const lines = [keys.join(',')]
    for(const r of list){
      const row = keys.map(k=>`"${(r[k]||'').toString().replace(/"/g,'""')}"`)
      lines.push(row.join(','))
    }
    const blob = new Blob([lines.join('\n')],{type:'text/csv'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'complaints.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
  }

  // events
  form.addEventListener('submit', e=>{
    e.preventDefault()
    const data = getFormData()
    const err = validate(data)
    if(err){ alert(err); return }
    addComplaint(data)
    clearForm()
    alert('Complaint submitted — it is saved locally in your browser.')
  })

  clearBtn.addEventListener('click', ()=>{ if(confirm('Clear form?')) clearForm() })
  searchEl.addEventListener('input', ()=>render())
  filterStatus.addEventListener('change', ()=>render())
  exportBtn.addEventListener('click', exportCsv)

  // initial render
  render()

  // expose for debugging
  window.Univoice = {readStorage, writeStorage}

})();
