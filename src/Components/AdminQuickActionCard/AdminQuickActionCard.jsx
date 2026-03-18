import React from 'react'
import './AdminQuickActionCard.css'
import { useNavigate } from 'react-router-dom'



const AdminQuickActionCard = ({ icon: Icon, title, subTitle, btnText, bgColor, iconColor,path }) => {

    const navigate = useNavigate()

  const handleNavigation = () => {
    navigate(path)
  }

  return (
    <div className="quick-action-card">
      <div className="quick-action-logo" style={{ backgroundColor: bgColor, color: iconColor }}>
        
        <Icon size={30} /> 
      </div>
      <h4 className="quick-action-title">{title}</h4>
      <p className="quick-action-sub-title">{subTitle}</p>
      <button onClick={handleNavigation} className="quick-action-btn">{btnText}</button>
    </div>
  )
}

export default AdminQuickActionCard