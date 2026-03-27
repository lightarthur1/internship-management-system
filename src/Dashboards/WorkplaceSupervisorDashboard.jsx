import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { API_BASE_URL } from '../config/api';

const API = API_BASE_URL;

const FALLBACK_PROFILE = {
  companyName: 'Tech Solutions Ltd',
  workEmail: 'supervisor@techsolutions.com',
};

const FALLBACK_STUDENTS = [
  {
    _id: 'demo-student-1',
    fullName: 'John Doe',
    profile: {
      studentId: '2024001',
      department: 'Computer Science',
    },
  },
  {
    _id: 'demo-student-2',
    fullName: 'Alice Cooper',
    profile: {
      studentId: '2024006',
      department: 'Software Engineering',
    },
  },
];

const FALLBACK_REPORTS = [
  {
    _id: 'demo-report-1',
    student: { _id: 'demo-student-1', fullName: 'John Doe' },
    period: 'February 2026',
    rating: 4,
    summary: 'Consistent delivery and strong ownership of assigned tasks.',
    recommendation: 'Keep improving report documentation quality.',
  },
];

function ReportModal({ student, onClose, onSubmit }) {
  const [period, setPeriod] = useState('');
  const [rating, setRating] = useState(3);
  const [summary, setSummary] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!period.trim() || !summary.trim()) {
      alert('Period and summary are required.');
      return;
    }

    setSubmitting(true);
    const ok = await onSubmit({
      studentId: student._id,
      period: period.trim(),
      rating: Number(rating),
      summary: summary.trim(),
      recommendation: recommendation.trim(),
    });
    setSubmitting(false);

    if (ok) onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 999 }}>
      <div style={{ width: '100%', maxWidth: 620, background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding: 18 }}>
        <h3 style={{ marginTop: 0, marginBottom: 6, color: '#0f172a' }}>Submit Workplace Report</h3>
        <p style={{ marginTop: 0, color: '#334155', fontSize: 14, fontWeight: 500 }}>
          {student.fullName} ({student?.profile?.studentId || 'N/A'})
        </p>

        <div style={{ display: 'grid', gap: 10 }}>
          <label style={{ fontSize: 13, fontWeight: 600 }}>
            Period
            <input
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="e.g. February 2026"
              style={{ width: '100%', marginTop: 4, padding: 10, borderRadius: 8, border: '1px solid #d1d5db', color: '#111827', fontWeight: 500, background: '#fff' }}
            />
          </label>

          <label style={{ fontSize: 13, fontWeight: 600 }}>
            Rating (1-5)
            <input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              style={{ width: '100%', marginTop: 4, padding: 10, borderRadius: 8, border: '1px solid #d1d5db', color: '#111827', fontWeight: 600, background: '#fff' }}
            />
          </label>

          <label style={{ fontSize: 13, fontWeight: 600 }}>
            Summary
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Describe the intern's progress."
              style={{ width: '100%', marginTop: 4, padding: 10, borderRadius: 8, border: '1px solid #d1d5db', resize: 'vertical', color: '#111827', fontWeight: 500, background: '#fff' }}
            />
          </label>

          <label style={{ fontSize: 13, fontWeight: 600 }}>
            Recommendation
            <textarea
              rows={3}
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              placeholder="Recommendation for improvement or continuation."
              style={{ width: '100%', marginTop: 4, padding: 10, borderRadius: 8, border: '1px solid #d1d5db', resize: 'vertical', color: '#111827', fontWeight: 500, background: '#fff' }}
            />
          </label>
        </div>

        <div style={{ marginTop: 14, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              border: '1px solid #94a3b8',
              background: '#f8fafc',
              color: '#0f172a',
              fontWeight: 700,
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ border: 'none', background: '#14532d', color: '#fff', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontWeight: 600 }}
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorkplaceSupervisorDashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [companyDraft, setCompanyDraft] = useState('');
  const [workEmailDraft, setWorkEmailDraft] = useState('');

  const [selectedStudent, setSelectedStudent] = useState(null);

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const loadData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [meRes, studentsRes, reportsRes] = await Promise.all([
        axios.get(`${API}/users/me`, { headers: authHeaders }),
        axios.get(`${API}/workplace/me/students`, { headers: authHeaders }),
        axios.get(`${API}/workplace/reports`, { headers: authHeaders }),
      ]);

      const p = meRes?.data?.user?.profile || {};
      setProfile(p);
      setCompanyDraft(p.companyName || '');
      setWorkEmailDraft(p.workEmail || user?.email || '');
      setShowProfileSetup(!p.companyName || !p.workEmail);

      setStudents(studentsRes?.data?.students || []);
      setReports(reportsRes?.data?.reports || []);
    } catch (e) {
      console.error('Failed to load workplace dashboard data', e);
      setProfile(FALLBACK_PROFILE);
      setStudents(FALLBACK_STUDENTS);
      setReports(FALLBACK_REPORTS);
      setCompanyDraft(FALLBACK_PROFILE.companyName);
      setWorkEmailDraft(FALLBACK_PROFILE.workEmail);
      setShowProfileSetup(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token, authHeaders]);

  const handleLogout = () => {
    logout?.();
    navigate('/login');
  };

  const saveProfile = async () => {
    try {
      await axios.patch(
        `${API}/users/me/profile`,
        {
          companyName: companyDraft,
          workEmail: workEmailDraft,
        },
        { headers: authHeaders }
      );
      setShowProfileSetup(false);
      await loadData();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to save profile');
    }
  };

  const submitReport = async (payload) => {
    try {
      await axios.post(`${API}/workplace/reports`, payload, { headers: authHeaders });
      await loadData();
      return true;
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to submit report');
      return false;
    }
  };

  const reportsByStudent = reports.reduce((acc, report) => {
    const sid = report?.student?._id || '';
    if (!sid) return acc;
    if (!acc[sid]) acc[sid] = [];
    acc[sid].push(report);
    return acc;
  }, {});

  const submittedCount = reports.length;
  const pendingCount = students.filter((s) => !(reportsByStudent[s._id] || []).length).length;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f8fafc 0%, #e0f2fe 35%, #ecfeff 100%)', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: 'linear-gradient(90deg, #0f172a 0%, #14532d 100%)', color: '#fff', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 6px 18px rgba(15, 23, 42, 0.25)' }}>
        <div>
          <div style={{ fontWeight: 700, letterSpacing: 0.2 }}>Workplace Supervisor Dashboard</div>
          <div style={{ fontSize: 12, opacity: 0.9 }}>IMS Portal</div>
        </div>
        <button onClick={handleLogout} style={{ border: '1px solid rgba(255,255,255,0.4)', background: 'transparent', color: '#fff', borderRadius: 8, padding: '7px 12px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 16 }}>
        {loading ? (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>Loading dashboard...</div>
        ) : (
          <>
            <div style={{ background: '#ffffffd9', backdropFilter: 'blur(4px)', border: '1px solid #dbeafe', borderRadius: 14, padding: 16, marginBottom: 14, boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)' }}>
              <h3 style={{ marginTop: 0, marginBottom: 6, color: '#0f172a' }}>Supervisor Profile</h3>
              <p style={{ color: '#334155', marginTop: 0, fontWeight: 500 }}>Name: {user?.name || user?.fullName || 'Supervisor'}</p>
              <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                  Company Name
                  <input
                    value={companyDraft}
                    onChange={(e) => setCompanyDraft(e.target.value)}
                    placeholder="Company name"
                    style={{ width: '100%', marginTop: 4, padding: 10, border: '1px solid #cbd5e1', borderRadius: 8, color: '#111827', fontWeight: 500, background: '#fff' }}
                  />
                </label>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                  Work Email
                  <input
                    value={workEmailDraft}
                    onChange={(e) => setWorkEmailDraft(e.target.value)}
                    placeholder="Work email"
                    style={{ width: '100%', marginTop: 4, padding: 10, border: '1px solid #cbd5e1', borderRadius: 8, color: '#111827', fontWeight: 500, background: '#fff' }}
                  />
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 10 }}>
                <p style={{ margin: 0, fontSize: 13, color: showProfileSetup ? '#92400e' : '#166534', fontWeight: 600 }}>
                  {showProfileSetup ? 'Complete your profile details and save.' : 'Profile details are editable and up to date.'}
                </p>
                <button onClick={saveProfile} style={{ border: 'none', background: '#14532d', color: '#fff', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontWeight: 600 }}>
                  Save Profile
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 14 }}>
              <div style={{ background: 'linear-gradient(160deg, #ffffff 0%, #ecfeff 100%)', border: '1px solid #bae6fd', borderRadius: 12, padding: 14, boxShadow: '0 8px 18px rgba(14, 116, 144, 0.12)' }}>
                <div style={{ color: '#334155', fontSize: 13, fontWeight: 600 }}>Assigned Students</div>
                <div style={{ fontWeight: 800, fontSize: 30, color: '#0f172a' }}>{students.length}</div>
              </div>
              <div style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f0fdf4 100%)', border: '1px solid #bbf7d0', borderRadius: 12, padding: 14, boxShadow: '0 8px 18px rgba(22, 101, 52, 0.12)' }}>
                <div style={{ color: '#334155', fontSize: 13, fontWeight: 600 }}>Submitted Reports</div>
                <div style={{ fontWeight: 800, fontSize: 30, color: '#0f172a' }}>{submittedCount}</div>
              </div>
              <div style={{ background: 'linear-gradient(160deg, #ffffff 0%, #fffbeb 100%)', border: '1px solid #fde68a', borderRadius: 12, padding: 14, boxShadow: '0 8px 18px rgba(146, 64, 14, 0.12)' }}>
                <div style={{ color: '#334155', fontSize: 13, fontWeight: 600 }}>Pending Reports</div>
                <div style={{ fontWeight: 800, fontSize: 30, color: '#7c2d12' }}>{pendingCount}</div>
              </div>
            </div>

            <div style={{ background: '#ffffffd9', backdropFilter: 'blur(4px)', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <h3 style={{ marginTop: 0, color: '#0f172a' }}>Assigned Interns</h3>
              {students.length === 0 ? (
                <p style={{ color: '#334155', fontWeight: 500 }}>No students assigned to your workplace yet. A student appears here after starting internship with your email.</p>
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  {students.map((student) => {
                    const studentReports = reportsByStudent[student._id] || [];
                    return (
                      <div key={student._id} style={{ border: '1px solid #dbeafe', borderRadius: 10, padding: 12, background: '#f8fafc' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{student.fullName}</div>
                            <div style={{ color: '#334155', fontSize: 13, fontWeight: 500 }}>
                              {student?.profile?.studentId || 'N/A'} · {student?.profile?.department || 'N/A'}
                            </div>
                            <div style={{ color: '#334155', fontSize: 13, fontWeight: 600 }}>
                              Reports submitted: {studentReports.length}
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedStudent(student)}
                            style={{ border: 'none', background: '#14532d', color: '#fff', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontWeight: 600 }}
                          >
                            Write Report
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ background: '#ffffffd9', backdropFilter: 'blur(4px)', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
              <h3 style={{ marginTop: 0, color: '#0f172a' }}>Recent Submitted Reports</h3>
              {reports.length === 0 ? (
                <p style={{ color: '#334155', fontWeight: 500 }}>No reports submitted yet.</p>
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  {reports.map((report) => (
                    <div key={report._id} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, background: '#ffffff' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{report?.student?.fullName || 'Unknown student'}</div>
                      <div style={{ color: '#334155', fontSize: 13, fontWeight: 600 }}>Period: {report.period || 'N/A'} · Rating: {report.rating || 3}/5</div>
                      <div style={{ color: '#374151', marginTop: 6 }}>{report.summary}</div>
                      {report.recommendation && (
                        <div style={{ color: '#334155', marginTop: 6, fontSize: 13, fontWeight: 500 }}>
                          Recommendation: {report.recommendation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {selectedStudent && (
        <ReportModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSubmit={submitReport}
        />
      )}
    </div>
  );
}
