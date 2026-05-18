import React, { useState } from 'react'
import Timeline from './Timeline'

function formatDate(iso){ try{ return new Date(iso).toLocaleString() }catch(e){ return iso } }

export default function ComplaintDetail({ complaint, onClose, onAddComment, onRemoveComment, onUpdateStatus, onAssignStaff, onSetDueDate }){
  const [comment, setComment] = useState('')
  const [assignInput, setAssignInput] = useState(complaint.assignedTo||'')

  const handleAddComment = ()=>{
    if(!comment.trim()) return
    onAddComment(complaint.id, comment)
    setComment('')
  }

  if(!complaint) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>{complaint.subject}</h2>

        <div className="detail-row">
          <div className="detail-label">Status</div>
          <div className="detail-value">
            <select value={complaint.status} onChange={e=>onUpdateStatus(complaint.id, e.target.value)} style={{marginTop:4,padding:6,borderRadius:4,border:'1px solid #d1d5db'}}>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-label">ID</div>
          <div className="detail-value">{complaint.id}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Category</div>
          <div className="detail-value">{complaint.category}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Priority</div>
          <div className="detail-value"><span className={`priority-badge priority-${complaint.priority?.toLowerCase()}`}>{complaint.priority || 'Medium'}</span></div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Submitted</div>
          <div className="detail-value">{formatDate(complaint.createdAt)}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Assigned To</div>
          <div className="detail-value">
            <input 
              value={assignInput} 
              onChange={e=>setAssignInput(e.target.value)} 
              onBlur={()=>onAssignStaff(complaint.id, assignInput||null)}
              placeholder="Enter staff name..."
              style={{width:'100%',padding:'6px',border:'1px solid #d1d5db',borderRadius:'4px',marginTop:'4px',fontSize:'13px'}}
            />
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Due Date</div>
          <div className="detail-value">
            <input 
              type="date"
              value={complaint.dueDate? complaint.dueDate.slice(0,10):''}
              onChange={e=>onSetDueDate(complaint.id, e.target.value? e.target.value+'T23:59:59Z':null)}
              style={{width:'100%',padding:'6px',border:'1px solid #d1d5db',borderRadius:'4px',marginTop:'4px',fontSize:'13px'}}
            />
          </div>
        </div>

        {complaint.name && <div className="detail-row">
          <div className="detail-label">Name</div>
          <div className="detail-value">{complaint.name}</div>
        </div>}

        {complaint.studentId && <div className="detail-row">
          <div className="detail-label">Student ID</div>
          <div className="detail-value">{complaint.studentId}</div>
        </div>}

        {complaint.email && <div className="detail-row">
          <div className="detail-label">Email</div>
          <div className="detail-value">{complaint.email}</div>
        </div>}

        {complaint.course && <div className="detail-row">
          <div className="detail-label">Course</div>
          <div className="detail-value">{complaint.course}</div>
        </div>}

        <div className="detail-row">
          <div className="detail-label">Description</div>
          <div className="detail-value" style={{whiteSpace:'pre-wrap'}}>{complaint.description}</div>
        </div>

        <Timeline complaint={complaint} />

        <div className="comments-section">
          <h3 style={{margin:'0 0 12px 0',fontSize:14}}>Comments & Notes ({(complaint.comments||[]).length})</h3>
          <div>
            {(complaint.comments||[]).map(c=>(
              <div key={c.id} className="comment-item">
                <div className="comment-meta">
                  {formatDate(c.createdAt)}
                  <button className="comment-delete" onClick={()=>onRemoveComment(complaint.id, c.id)}>Delete</button>
                </div>
                <div className="comment-text">{c.text}</div>
              </div>
            ))}
          </div>

          <div className="add-comment">
            <textarea placeholder="Add a note or update..." value={comment} onChange={e=>setComment(e.target.value)} />
            <button className="btn primary" onClick={handleAddComment}>Add Comment</button>
          </div>
        </div>
      </div>
    </div>
  )
}
