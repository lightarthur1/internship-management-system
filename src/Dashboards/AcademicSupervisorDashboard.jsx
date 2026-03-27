import React, { useEffect, useMemo, useState } from 'react';
import { FiUser } from 'react-icons/fi';
import { FaRegFileLines } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import './AcademicSupervisor.css';

const API = API_BASE_URL;

const FALLBACK_STUDENTS = [
  {
    _id: 'demo-student-1',
    fullName: 'John Doe',
    profile: {
      studentId: '200455544',
      department: 'Computer Science',
      companyName: 'Tech Solutions Ltd',
      stateOfOrigin: 'Accra, Ghana',
    },
  },
  {
    _id: 'demo-student-2',
    fullName: 'Emily Brown',
    profile: {
      studentId: '200455545',
      department: 'Software Engineering',
      companyName: 'Digital Marketing PRO',
      stateOfOrigin: 'Kumasi, Ghana',
    },
  },
];

const AcademicSupervisorDashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [profile, setProfile] = useState({ department: '', phone: '', title: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [students, setStudents] = useState([]);
  const [studentStats, setStudentStats] = useState({});
  const [loadingStudents, setLoadingStudents] = useState(true);

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const handleLogout = () => {
    logout?.();
    navigate('/login');
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setLoadingProfile(false);
        return;
      }
      try {
        const res = await axios.get(`${API}/users/me`, { headers: authHeaders });
        const p = res?.data?.user?.profile || {};
        setProfile({
          department: p.department || '',
          phone: p.phone || '',
          title: p.title || '',
        });
      } catch (e) {
        console.error('Failed to load supervisor profile', e);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [token, authHeaders]);

  useEffect(() => {
    const loadStudentsAndStats = async () => {
      if (!token) {
        setLoadingStudents(false);
        return;
      }

      setLoadingStudents(true);
      try {
        const studentsRes = await axios.get(`${API}/academic/me/students`, {
          headers: authHeaders,
        });

        const assignedStudents = studentsRes?.data?.students || [];
        setStudents(assignedStudents);

        const statEntries = await Promise.all(
          assignedStudents.map(async (student) => {
            try {
              const logsRes = await axios.get(
                `${API}/academic/students/${student._id}/logs`,
                { headers: authHeaders }
              );
              const logs = logsRes?.data?.logs || [];
              const pendingLogs = logs.filter((l) => l.status === 'pending').length;
              return [
                student._id,
                {
                  reportsSubmitted: logs.length,
                  pendingLogs,
                },
              ];
            } catch (error) {
              return [student._id, { reportsSubmitted: 0, pendingLogs: 0 }];
            }
          })
        );

        setStudentStats(Object.fromEntries(statEntries));
      } catch (e) {
        console.error('Failed to load assigned students', e);
        setStudents(FALLBACK_STUDENTS);
        setStudentStats({
          'demo-student-1': { reportsSubmitted: 3, pendingLogs: 1 },
          'demo-student-2': { reportsSubmitted: 2, pendingLogs: 0 },
        });
      } finally {
        setLoadingStudents(false);
      }
    };

    loadStudentsAndStats();
  }, [token, authHeaders]);

  const saveProfile = async () => {
    try {
      await axios.patch(
        `${API}/users/me/profile`,
        {
          department: profile.department,
          phone: profile.phone,
          title: profile.title,
        },
        { headers: authHeaders }
      );
      setIsEditingProfile(false);
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to save profile');
    }
  };

  const supervisorName = user?.name || user?.fullName || 'Academic Supervisor';
  const supervisorEmail = user?.email || 'No email';
  const supervisorDepartment = profile.department || 'Not set';

  const totalStudents = students.length;
  const totalReports = students.reduce(
    (sum, s) => sum + (studentStats[s._id]?.reportsSubmitted || 0),
    0
  );
  const totalPending = students.reduce(
    (sum, s) => sum + (studentStats[s._id]?.pendingLogs || 0),
    0
  );

  return (
    <>
      <div style={{ background: '#0f172a', padding: '10px 16px', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#fff', fontWeight: 700, margin: 0 }}>Academic Supervisor Dashboard</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: 0 }}>IMS Portal</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '8px',
              padding: '8px 14px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <main className="asd-main">
        <div className="asd-container">
          <div className="asd-info-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <h2 className="asd-info-title">Supervisor Information</h2>
              <button
                onClick={() => setIsEditingProfile((v) => !v)}
                style={{ background: '#0f172a', color: '#ffffff', border: '1px solid #0f172a', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontWeight: 600 }}
              >
                {isEditingProfile ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="asd-info-grid">
              <div>
                <p className="asd-info-label">Name</p>
                <p className="asd-info-value">{supervisorName}</p>
              </div>
              <div>
                <p className="asd-info-label">Department</p>
                {isEditingProfile ? (
                  <input
                    className="asd-input"
                    value={profile.department}
                    onChange={(e) => setProfile((p) => ({ ...p, department: e.target.value }))}
                    placeholder="e.g. Computer Science"
                  />
                ) : (
                  <p className="asd-info-value">{loadingProfile ? 'Loading...' : supervisorDepartment}</p>
                )}
              </div>
              <div>
                <p className="asd-info-label">Phone</p>
                {isEditingProfile ? (
                  <input
                    className="asd-input"
                    value={profile.phone || ''}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="e.g. +233 123 456 789"
                  />
                ) : (
                  <p className="asd-info-value">{loadingProfile ? 'Loading...' : profile.phone || 'Not set'}</p>
                )}
              </div>
              <div>
                <p className="asd-info-label">Title</p>
                {isEditingProfile ? (
                  <input
                    className="asd-input"
                    value={profile.title || ''}
                    onChange={(e) => setProfile((p) => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Senior Lecturer"
                  />
                ) : (
                  <p className="asd-info-value">{loadingProfile ? 'Loading...' : profile.title || 'Not set'}</p>
                )}
              </div>
              <div>
                <p className="asd-info-label">Email</p>
                <p className="asd-info-value">{supervisorEmail}</p>
              </div>
            </div>

            {isEditingProfile && (
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={saveProfile}
                  style={{ background: '#14532d', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Save Profile
                </button>
              </div>
            )}
          </div>

          <div className="asd-stats-grid">
            <div className="asd-stat-card">
              <div className="asd-stat-header">
                <h3 className="asd-stat-label">Assigned Students</h3>
                <FiUser className="asd-stat-icon" />
              </div>
              <span className="asd-stat-value">{loadingStudents ? '...' : totalStudents}</span>
            </div>

            <div className="asd-stat-card">
              <div className="asd-stat-header">
                <h3 className="asd-stat-label">Total Reports</h3>
                <FaRegFileLines className="asd-stat-icon" />
              </div>
              <span className="asd-stat-value">{loadingStudents ? '...' : totalReports}</span>
            </div>

            <div className="asd-stat-card">
              <div className="asd-stat-header">
                <h3 className="asd-stat-label">Pending Reviews</h3>
                <FaRegFileLines className="asd-stat-icon--orange" />
              </div>
              <span className="asd-stat-value--orange">{loadingStudents ? '...' : totalPending}</span>
            </div>
          </div>

          <div className="asd-students-wrapper">
            <div className="asd-students-card">
              <h3 className="asd-students-title">Assigned Students</h3>
              <p className="asd-students-subtitle">Students under your supervision</p>

              <div className="asd-students-inner">
                {loadingStudents ? (
                  <div style={{ padding: '16px', color: '#6b7280' }}>Loading students...</div>
                ) : students.length === 0 ? (
                  <div style={{ padding: '16px', color: '#6b7280' }}>No students assigned yet.</div>
                ) : (
                  students.map((student) => {
                    const stats = studentStats[student._id] || { reportsSubmitted: 0, pendingLogs: 0 };
                    const p = student.profile || {};
                    return (
                      <div key={student._id} className="asd-student-card">
                        <div>
                          <div className="asd-student-header">
                            <h3 className="asd-student-name">{student.fullName}</h3>
                            <span className="asd-pending-badge">{stats.pendingLogs} pending</span>
                          </div>

                          <div className="asd-student-meta">
                            <p>
                              {p.studentId || 'N/A'} <span className="asd-student-dot">·</span> {p.department || 'N/A'}
                            </p>
                            <div className="asd-student-row">
                              <p>
                                Company: <span className="asd-student-company">{p.companyName || 'Not set'}</span>
                              </p>
                              <p>Location: {p.stateOfOrigin || 'N/A'}</p>
                              <button
                                type="button"
                                className="asd-view-btn"
                                onClick={() =>
                                  navigate('/view-reports', {
                                    state: {
                                      studentId: student._id,
                                      studentName: student.fullName,
                                      studentIdText: p.studentId || 'N/A',
                                      companyName: p.companyName || 'Not set',
                                    },
                                  })
                                }
                              >
                                <FaRegFileLines />
                                <span>View Reports</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        <p className="asd-reports-submitted">
                          Reports Submitted: <span>{stats.reportsSubmitted}</span>
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AcademicSupervisorDashboard;
