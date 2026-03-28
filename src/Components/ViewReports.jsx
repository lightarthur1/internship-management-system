import React, { useState, useEffect, useCallback } from 'react'
import { BiComment } from 'react-icons/bi'
import { IoArrowBack } from 'react-icons/io5'
import { LuThumbsDown, LuThumbsUp } from 'react-icons/lu'
import { VscThumbsupFilled } from 'react-icons/vsc'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import './ViewReports.css'

function ViewReports() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const filterStudentId = params.get('studentId')
  const { authFetch } = useAuth()

  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedbackDraft, setFeedbackDraft] = useState({})
  const [headerSubtitle, setHeaderSubtitle] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const q = filterStudentId ? `?studentId=${encodeURIComponent(filterStudentId)}` : ''
      const data = await authFetch(`/academic-supervisor/reports${q}`)
      const list = data.reports || []
      setReports(list)
      const first = list[0]
      if (first?.student?.name) {
        setHeaderSubtitle(
          `${first.student.name}${filterStudentId ? '' : ' — all assigned students'}`
        )
      } else {
        setHeaderSubtitle('No reports yet')
      }
    } catch (e) {
      setHeaderSubtitle(e.message || 'Failed to load')
      setReports([])
    } finally {
      setLoading(false)
    }
  }, [authFetch, filterStudentId])

  useEffect(() => { load() }, [load])

  const submitFeedback = async (reportId) => {
    const text = (feedbackDraft[reportId] || '').trim()
    if (!text) return
    try {
      await authFetch(`/reports/${reportId}/review`, {
        method: 'PUT',
        body: JSON.stringify({ feedback: text }),
      })
      setFeedbackDraft((d) => ({ ...d, [reportId]: '' }))
      await load()
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="vr-page">

      <div className="vr-header">
        <button
          onClick={() => navigate("/academic-supervisor")}
          className="vr-back-btn"
        >
          <IoArrowBack className="vr-back-icon" />
          Back to Dashboard
        </button>

        <h1 className="vr-header-title">Student Reports</h1>
        <p className="vr-header-subtitle">
          {loading ? 'Loading…' : headerSubtitle}
        </p>
      </div>

      <div className="vr-card">
        <p className="vr-card-title">Internship Reports</p>
        <p className="vr-card-subtitle">
          Review and provide feedback on student progress
        </p>

        {!loading && reports.length === 0 && (
          <p style={{ color: '#6b7280', padding: '12px 0' }}>No reports to show.</p>
        )}

        {reports.map((r) => {
          const dateStr = new Date(r.createdAt).toLocaleDateString()
          const isReviewed = r.status === 'reviewed'
          return (
            <div className="vr-report" key={r._id}>
              <div className="vr-report-inner">
                <div className="vr-report-header">
                  <div className="vr-report-meta">
                    <span className="vr-report-date">{dateStr}</span>
                    <span className="vr-badge vr-badge-green">{r.reportType}</span>
                    <span className={`vr-badge ${isReviewed ? 'vr-badge-green' : ''}`}>{r.status}</span>
                  </div>
                  {isReviewed && (
                    <span className="vr-thumbsup">
                      <VscThumbsupFilled />
                    </span>
                  )}
                </div>

                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
                  {r.student?.name || 'Student'}
                </div>

                <div className="vr-report-body">
                  {r.content}
                </div>

                {r.feedback && (
                  <div className="vr-feedback">
                    <p className="vr-feedback-label">Your Feedback:</p>
                    <p className="vr-feedback-text">{r.feedback}</p>
                  </div>
                )}

                {!isReviewed && (
                  <div style={{ marginTop: 12 }}>
                    <textarea
                      className="vr-cta-btn"
                      style={{ width: '100%', minHeight: 72, padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', fontFamily: 'inherit' }}
                      placeholder="Write feedback…"
                      value={feedbackDraft[r._id] || ''}
                      onChange={(e) => setFeedbackDraft((d) => ({ ...d, [r._id]: e.target.value }))}
                    />
                    <div className="vr-actions" style={{ marginTop: 8 }}>
                      <button type="button" className="vr-cta-btn" onClick={() => submitFeedback(r._id)}>
                        <LuThumbsUp />
                        Submit feedback
                      </button>
                      <button type="button" className="vr-cta-btn" onClick={() => setFeedbackDraft((d) => ({ ...d, [r._id]: '' }))}>
                        <LuThumbsDown />
                        Clear
                      </button>
                      <span className="vr-cta-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <BiComment />
                        Comment above
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ViewReports
