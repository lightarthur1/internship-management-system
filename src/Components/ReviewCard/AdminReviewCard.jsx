import React from 'react'
import '../ReviewCard/AdminReviewCard.css'

const AdminReviewCard = ({ label, number, icon: Icon, iconColor }) => {
  return (
    <div className='admin-review-card'>
      <div className="card-info">
        <div className="card-header">
          <p>{label}</p>
          <div style={{ color: iconColor }}>
            <Icon size={20} />
          </div>
        </div>
        <h5 className='number' style={{ color: iconColor === '#22C55E' ? '#22C55E' : iconColor === '#F97316' ? '#F97316' : 'black' }}>
          {number}
        </h5>
      </div>
    </div>
  )
}

export default AdminReviewCard