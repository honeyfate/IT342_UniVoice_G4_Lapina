import React from 'react'

export default function Dashboard({ complaints }) {
  const total = complaints.length
  const open = complaints.filter(c => c.status === 'Open').length
  const inProgress = complaints.filter(c => c.status === 'In Progress').length
  const resolved = complaints.filter(c => c.status === 'Resolved').length

  const categories = {}
  complaints.forEach(c => {
    categories[c.category] = (categories[c.category] || 0) + 1
  })

  const avgResolutionTime = () => {
    const resolved_items = complaints.filter(c => c.status === 'Resolved')
    if (resolved_items.length === 0) return 0
    const totalTime = resolved_items.reduce((sum, c) => {
      return sum + (new Date(c.resolvedAt || c.createdAt) - new Date(c.createdAt))
    }, 0)
    const days = Math.round(totalTime / resolved_items.length / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total Complaints</div>
        </div>
        <div className="stat-card open">
          <div className="stat-value">{open}</div>
          <div className="stat-label">Open</div>
        </div>
        <div className="stat-card progress">
          <div className="stat-value">{inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card resolved">
          <div className="stat-value">{resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      {Object.keys(categories).length > 0 && (
        <div className="category-breakdown">
          <h3>By Category</h3>
          <div className="category-list">
            {Object.entries(categories).map(([cat, count]) => (
              <div key={cat} className="category-item">
                <span className="category-name">{cat}</span>
                <span className="category-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {resolved > 0 && (
        <div className="metric">
          <span className="metric-label">Avg. Resolution Time:</span>
          <span className="metric-value">{avgResolutionTime()} days</span>
        </div>
      )}
    </div>
  )
}
