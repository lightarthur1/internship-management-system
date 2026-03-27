import React, { useEffect, useMemo, useState } from 'react'
import { Layout, LogOut, BriefcaseBusiness, FileCheck, Users, TrendingUp } from 'lucide-react'
import '../Admin/AdminDashboard.css'
import AdminReviewCard from '../../Components/ReviewCard/AdminReviewCard'
import AdminQuickActionCard from '../../Components/AdminQuickActionCard/AdminQuickActionCard'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'

const API = API_BASE_URL;

const FALLBACK_STATS = {
  totalOpportunities: 12,
  pendingLetters: 5,
  supervisors: 8,
  activeStudents: 45,
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, token } = useAuth();
  const [stats, setStats] = useState(FALLBACK_STATS);

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  useEffect(() => {
    const loadStats = async () => {
      if (!token) {
        setStats(FALLBACK_STATS);
        return;
      }

      try {
        const [oppRes, lettersRes, supervisorsRes, studentsRes] = await Promise.all([
          axios.get(`${API}/opportunities`),
          axios.get(`${API}/letters/admin/all`, { headers: authHeaders }),
          axios.get(`${API}/admin/academic-supervisors`, { headers: authHeaders }),
          axios.get(`${API}/admin/students`, { headers: authHeaders }),
        ]);

        const opportunities = oppRes?.data?.opportunities || [];
        const letters = lettersRes?.data?.letters || [];
        const supervisors = supervisorsRes?.data?.supervisors || [];
        const students = studentsRes?.data?.students || [];

        setStats({
          totalOpportunities: opportunities.length,
          pendingLetters: letters.filter((l) => l.status === 'pending').length,
          supervisors: supervisors.length,
          activeStudents: students.length,
        });
      } catch (error) {
        console.error('Failed to load admin stats, using fallback', error);
        setStats(FALLBACK_STATS);
      }
    };

    loadStats();
  }, [token, authHeaders]);

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
            <h2 className="header">IMS Admin</h2>
            <p className="sub-title">Internship Management</p>
          </div>
        </div>
        <div className="btn-div">
        <button className='logout-btn' onClick={handleLogout}><LogOut/>Logout</button>
        </div>
      </div>
      <div className="admin-page-container">
        
        <div className="cards-container">
          <AdminReviewCard label="Total Opportunities" number={String(stats.totalOpportunities)} icon={BriefcaseBusiness} iconColor="#334155" />
          <AdminReviewCard label="Pending Letters" number={String(stats.pendingLetters)} icon={FileCheck} iconColor="#F97316" />
          <AdminReviewCard label="Supervisors" number={String(stats.supervisors)} icon={Users} iconColor="#334155" />
          <AdminReviewCard label="Active Students" number={String(stats.activeStudents)} icon={TrendingUp} iconColor="#22C55E" />
        </div>

       
        <div className="quick-action-container">
          <p className="quick-action-heading">Quick Actions</p>
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