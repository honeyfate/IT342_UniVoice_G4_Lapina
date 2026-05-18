import React, { useState } from 'react'

function uid(){
  return 'c-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9)
}

export default function ComplaintForm({ onSubmit }){
  const [name,setName] = useState('')
  const [studentId,setStudentId] = useState('')
  const [email,setEmail] = useState('')
  const [course,setCourse] = useState('')
  const [category,setCategory] = useState('Academic')
  const [priority,setPriority] = useState('Medium')
  const [subject,setSubject] = useState('')
  const [description,setDescription] = useState('')

  function handleSubmit(e){
    e.preventDefault()
    if(!subject.trim()){ alert('Subject is required'); return }
    if(!description.trim()){ alert('Description is required'); return }
    const payload = {
      id: uid(),
      name: name.trim(),
      studentId: studentId.trim(),
      email: email.trim(),
      course: course.trim(),
      category,
      priority,
      subject: subject.trim(),
      description: description.trim(),
      status: 'Open',
      createdAt: new Date().toISOString()
    }
    onSubmit(payload)
    setName(''); setStudentId(''); setEmail(''); setCourse(''); setSubject(''); setDescription(''); setCategory('Academic'); setPriority('Medium')
    alert('Complaint submitted — saved locally in your browser.')
  }

  return (
    <form onSubmit={handleSubmit} id="complaintForm">
      <div className="row">
        <label>Full name
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name (optional)" />
        </label>
        <label>Student ID
          <input value={studentId} onChange={e=>setStudentId(e.target.value)} placeholder="e.g. s1234567" />
        </label>
      </div>

      <div className="row">
        <label>Email
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.edu (optional)" />
        </label>
        <label>Course
          <input value={course} onChange={e=>setCourse(e.target.value)} placeholder="Course or unit code (optional)" />
        </label>
      </div>

      <label>Category
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="Academic">Academic</option>
          <option value="Administrative">Administrative</option>
          <option value="Facilities">Facilities</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <label>Priority
        <select value={priority} onChange={e=>setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </label>

      <label>Subject
        <input value={subject} onChange={e=>setSubject(e.target.value)} required placeholder="Short subject of the complaint" />
      </label>

      <label>Description
        <textarea value={description} onChange={e=>setDescription(e.target.value)} required rows={5} placeholder="Describe the issue in detail" />
      </label>

      <div className="actions">
        <button className="btn primary" type="submit">Submit Complaint</button>
        <button className="btn" type="button" onClick={()=>{ if(confirm('Clear form?')){ setName(''); setStudentId(''); setEmail(''); setCourse(''); setSubject(''); setDescription('') } }}>Clear</button>
      </div>
    </form>
  )
}
