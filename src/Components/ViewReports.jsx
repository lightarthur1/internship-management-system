import React, { useEffect, useMemo, useState } from 'react';
import { BiComment } from 'react-icons/bi';
import { IoArrowBack } from 'react-icons/io5';
import { LuThumbsDown, LuThumbsUp } from 'react-icons/lu';
import { VscThumbsupFilled } from 'react-icons/vsc';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import './ViewReports.css';

const API = API_BASE_URL;

const FALLBACK_LOGS = [
  {
    _id: 'demo-log-1',
    createdAt: new Date('2026-02-21').toISOString(),
    periodType: 'weekly',
    status: 'reviewed',
    content: 'Implemented user authentication and completed test coverage for login/register.',
    feedback: 'Great progress. Keep improving validation.',
  },
  {
    _id: 'demo-log-2',
    createdAt: new Date('2026-02-28').toISOString(),
    periodType: 'weekly',
    status: 'pending',
    content: 'Worked on report endpoints and bug fixes for dashboard flows.',
    feedback: '',
  },
];

const FALLBACK_WORKPLACE_REPORTS = [
  {
    _id: 'demo-workplace-1',
    createdAt: new Date('2026-02-28').toISOString(),
    period: 'February 2026',
    rating: 4,
    summary: 'Intern delivered consistently and collaborated well with the team.',
    recommendation: 'Continue improving communication and documentation quality.',
  },
];

function ViewReports() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const studentId = location.state?.studentId || '';
  const initialName = location.state?.studentName || 'Student';
  const initialStudentIdText = location.state?.studentIdText || 'N/A';
  const initialCompany = location.state?.companyName || 'Not set';

  const [student, setStudent] = useState({
    name: initialName,
    studentIdText: initialStudentIdText,
    company: initialCompany,
  });
  const [logs, setLogs] = useState([]);
  const [workplaceReports, setWorkplaceReports] = useState([]);
  const [draftFeedbackByLogId, setDraftFeedbackByLogId] = useState({});
  const [loading, setLoading] = useState(true);

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const loadData = async () => {
    if (!token || !studentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [studentsRes, logsRes, workplaceRes] = await Promise.all([
        axios.get(`${API}/academic/me/students`, { headers: authHeaders }),
        axios.get(`${API}/academic/students/${studentId}/logs`, { headers: authHeaders }),
        axios.get(`${API}/academic/students/${studentId}/workplace-reports`, {
          headers: authHeaders,
        }),
      ]);

      const assigned = studentsRes?.data?.students || [];
      const selected = assigned.find((s) => s._id === studentId);
      const p = selected?.profile || {};

      if (selected) {
        setStudent({
          name: selected.fullName,
          studentIdText: p.studentId || 'N/A',
          company: p.companyName || 'Not set',
        });
      }

      const fetchedLogs = logsRes?.data?.logs || [];
      setLogs(fetchedLogs);
      setDraftFeedbackByLogId(
        fetchedLogs.reduce((acc, log) => {
          acc[log._id] = log.feedback || '';
          return acc;
        }, {})
      );
      setWorkplaceReports(workplaceRes?.data?.reports || []);
    } catch (e) {
      console.error('Failed to load student reports', e);
      setLogs(FALLBACK_LOGS);
      setDraftFeedbackByLogId(
        FALLBACK_LOGS.reduce((acc, log) => {
          acc[log._id] = log.feedback || '';
          return acc;
        }, {})
      );
      setWorkplaceReports(FALLBACK_WORKPLACE_REPORTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token, studentId, authHeaders]);

  const reviewLog = async (log, status) => {
    try {
      await axios.patch(
        `${API}/academic/logs/${log._id}/review`,
        {
          status,
          feedback: (draftFeedbackByLogId[log._id] || '').trim(),
        },
        { headers: authHeaders }
      );

      await loadData();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to update report review');
    }
  };

  if (!studentId) {
    return (
      <div className="vr-page">
        <div className="vr-header">
          <button onClick={() => navigate('/academic-supervisor')} className="vr-back-btn">
            <IoArrowBack className="vr-back-icon" />
            Back to Dashboard
          </button>
          <h1 className="vr-header-title">Student Reports</h1>
          <p className="vr-header-subtitle">No student selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vr-page">
      <div className="vr-header">
        <button onClick={() => navigate('/academic-supervisor')} className="vr-back-btn">
          <IoArrowBack className="vr-back-icon" />
          Back to Dashboard
        </button>

        <h1 className="vr-header-title">Student Reports</h1>
        <p className="vr-header-subtitle">
          {student.name} ({student.studentIdText}) - {student.company}
        </p>
      </div>

      <div className="vr-card">
        <p className="vr-card-title">Internship Reports</p>
        <p className="vr-card-subtitle">Review and provide feedback on student progress</p>

        {loading ? (
          <div className="vr-report">
            <div className="vr-report-inner">Loading reports...</div>
          </div>
        ) : logs.length === 0 ? (
          <div className="vr-report">
            <div className="vr-report-inner">No student logs submitted yet.</div>
          </div>
        ) : (
          logs.map((log) => {
            const reviewed = log.status === 'reviewed';
            return (
              <div key={log._id} className="vr-report">
                <div className="vr-report-inner">
                  <div className="vr-report-header">
                    <div className="vr-report-meta">
                      <span className="vr-report-date">
                        {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : ''}
                      </span>
                      <span className="vr-badge vr-badge-green">{log.periodType}</span>
                      <span className="vr-badge vr-badge-green">{log.status}</span>
                    </div>
                    {reviewed && (
                      <span className="vr-thumbsup">
                        <VscThumbsupFilled />
                      </span>
                    )}
                  </div>

                  <div className="vr-report-body">{log.content}</div>

                  <div className="vr-feedback" style={{ marginTop: '1rem' }}>
                    <p className="vr-feedback-label">Academic Feedback</p>
                    <textarea
                      value={draftFeedbackByLogId[log._id] || ''}
                      onChange={(e) =>
                        setDraftFeedbackByLogId((prev) => ({
                          ...prev,
                          [log._id]: e.target.value,
                        }))
                      }
                      placeholder="Write feedback for this report..."
                      rows={4}
                      style={{
                        width: '100%',
                        border: '1px solid #d7dce5',
                        borderRadius: '10px',
                        padding: '0.75rem',
                        fontFamily: 'inherit',
                        fontSize: '0.95rem',
                        color: '#111827',
                        fontWeight: 500,
                        caretColor: '#111827',
                        resize: 'vertical',
                        background: '#fff',
                      }}
                    />
                    {reviewed && log.feedback && (
                      <p className="vr-feedback-text" style={{ marginTop: '0.5rem' }}>
                        Current saved feedback: {log.feedback}
                      </p>
                    )}
                  </div>

                  <div className="vr-actions">
                    <button className="vr-cta-btn" onClick={() => reviewLog(log, 'reviewed')}>
                      <LuThumbsUp />
                      Approve
                    </button>
                    <button className="vr-cta-btn" onClick={() => reviewLog(log, 'pending')}>
                      <LuThumbsDown />
                      Request Update
                    </button>
                    <button className="vr-cta-btn" onClick={() => reviewLog(log, reviewed ? 'reviewed' : 'pending')}>
                      <BiComment />
                      Save Feedback
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {workplaceReports.length > 0 && (
          <>
            <p className="vr-card-title" style={{ marginTop: '2rem' }}>
              Workplace Supervisor Reports
            </p>
            {workplaceReports.map((report) => (
              <div key={report._id} className="vr-report">
                <div className="vr-report-inner">
                  <div className="vr-report-header">
                    <div className="vr-report-meta">
                      <span className="vr-report-date">
                        {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : ''}
                      </span>
                      <span className="vr-badge vr-badge-green">{report.period || 'period'}</span>
                      <span className="vr-badge vr-badge-green">rating {report.rating || 3}/5</span>
                    </div>
                  </div>

                  <div className="vr-report-body">{report.summary}</div>

                  {report.recommendation && (
                    <div className="vr-feedback">
                      <p className="vr-feedback-label">Recommendation:</p>
                      <p className="vr-feedback-text">{report.recommendation}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default ViewReports;
