import React from 'react';
import Landing from './Pages/Landing';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import AdminDashboard from './Dashboards/Admin/AdminDashboard';
import ManageOpportunities from './Pages/ManageOpportunities';
import ApproveLetters from './Pages/ApproveLetters';
import AssignSupervisors from './Pages/AssignSupervisors';
import AcademicSupervisorDashboard from './Dashboards/AcademicSupervisorDashboard';
import StudentDashboard from './Dashboards/StudentDashboard';
import ProtectedRoute from './Components/ProtectedRoute';
import WorkplaceSupervisorDashboard from './Dashboards/WorkplaceSupervisorDashboard';
import { BrowserRouter,Route,Routes,Navigate } from 'react-router-dom';
import DashboardRedirect from './Components/DashboardRedirect';
import { AuthProvider, useAuth } from './Context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          
          {/* Protected Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/manage-opportunities" element={
             <ProtectedRoute allowedRoles={['admin']}>
               <ManageOpportunities />
            </ProtectedRoute>
          }/>

          <Route path="/admin/approve-letters" element={
             <ProtectedRoute allowedRoles={['admin']}>
               <ApproveLetters />
            </ProtectedRoute>
          }/>

           <Route path="/admin/assign-supervisors" element={
             <ProtectedRoute allowedRoles={['admin']}>
               <AssignSupervisors />
            </ProtectedRoute>
          }/>

          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />

          <Route path="/academic-supervisor" element={
            <ProtectedRoute allowedRoles={['academic-supervisor']}>
              <AcademicSupervisorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/workplace-supervisor" element={
            <ProtectedRoute allowedRoles={['workplace-supervisor']}>
              <WorkplaceSupervisorDashboard />
            </ProtectedRoute>
          } />
          
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;