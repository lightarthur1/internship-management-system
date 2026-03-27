import React from 'react'
import { Layout, LogOut, BriefcaseBusiness, FileCheck, Users, TrendingUp } from 'lucide-react'
import '../Admin/AdminDashboard.css'
import AdminReviewCard from '../../Components/ReviewCard/AdminReviewCard'
import AdminQuickActionCard from '../../Components/AdminQuickActionCard/AdminQuickActionCard'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout?.();
    navigate('/login');
  };

  return (
    <div className='Admin'>
      <div className="admin-navbar">
        <div className="admin-nav-logo">
          <div className="logo"> <Layout size={50} /></div>
          <div className="admin-header">
            <h2 className="header">MFDoom Admin</h2>
            <p className="sub-title">Internship Management</p>
          </div>
        </div>
        <div className="btn-div">
        <button className='logout-btn' onClick={handleLogout}><LogOut/>Logout</button>
        </div>
      </div>
      <div className="admin-page-container">
        
        <div className="cards-container">
          <AdminReviewCard label="Total Opportunities" number="12" icon={BriefcaseBusiness} iconColor="#666" />
          <AdminReviewCard label="Pending Letters" number="5" icon={FileCheck} iconColor="#F97316" />
          <AdminReviewCard label="Supervisors" number="8" icon={Users} iconColor="#666" />
          <AdminReviewCard label="Active Students" number="45" icon={TrendingUp} iconColor="#22C55E" />
        </div>

       
        <div className="quick-action-container">
          <p>Quick Actions</p>
          <div className="quick-action-cards-wrapper">
            <AdminQuickActionCard 
              icon={BriefcaseBusiness} 
              title="Manage Opportunities" 
              subTitle="Add, edit or remove internship opportunities" 
              btnText="Manage"
              bgColor="#E0E7FF" // Light blue
              iconColor="#3B82F6" 
              path="/admin/manage-opportunities"
            />
            <AdminQuickActionCard 
              icon={FileCheck} 
              title="Approve Letters" 
              subTitle="Review and approve internship letters" 
              btnText="Review"
              bgColor="#FFEDD5" // Light orange
              iconColor="#F97316" 
              path="/admin/approve-letters"
            />
            <AdminQuickActionCard 
              icon={Users} 
              title="Assign Supervisors" 
              subTitle="Match supervisors with students" 
              btnText="Assign"
              bgColor="#DCFCE7" // Light green
              iconColor="#22C55E" 
              path="/admin/assign-supervisors"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard