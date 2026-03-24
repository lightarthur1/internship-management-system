import React from 'react'
import { BiComment } from 'react-icons/bi'
import { IoArrowBack } from 'react-icons/io5'
import { LuThumbsDown, LuThumbsUp } from 'react-icons/lu'
import { VscThumbsupFilled } from 'react-icons/vsc'
import { useNavigate } from 'react-router-dom'
import './ViewReports.css'

function ViewReports() {
  const navigate = useNavigate();

  return (
    <div className="vr-page">

      {/* ── Header ── */}
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
          John Doe (2024001) - Tech Solutions Ltd
        </p>
      </div>

      {/* ── Main card ── */}
      <div className="vr-card">
        <p className="vr-card-title">Internship Reports</p>
        <p className="vr-card-subtitle">
          Review and provide feedback on students progress
        </p>

        {/* ── Report 1 — reviewed ── */}
        <div className="vr-report">
          <div className="vr-report-inner">
            <div className="vr-report-header">
              <div className="vr-report-meta">
                <span className="vr-report-date">2/21/2026</span>
                <span className="vr-badge vr-badge-green">weekly</span>
                <span className="vr-badge vr-badge-green">reviewed</span>
              </div>
              <span className="vr-thumbsup">
                <VscThumbsupFilled />
              </span>
            </div>

            <div className="vr-report-body">
              This week I worked on the user authentication module. Implemented
              login and registration features using JWT tokens. Also started
              working on password reset functionality.
            </div>

            <div className="vr-feedback">
              <p className="vr-feedback-label">Your Feedback:</p>
              <p className="vr-feedback-text">
                Good progress! Make sure to add proper validation and error
                handling.
              </p>
            </div>
          </div>
        </div>

        {/* ── Report 2 — reviewed ── */}
        <div className="vr-report">
          <div className="vr-report-inner">
            <div className="vr-report-header">
              <div className="vr-report-meta">
                <span className="vr-report-date">2/21/2026</span>
                <span className="vr-badge vr-badge-green">weekly</span>
                <span className="vr-badge vr-badge-green">reviewed</span>
              </div>
              <span className="vr-thumbsup">
                <VscThumbsupFilled />
              </span>
            </div>

            <div className="vr-report-body">
              This week I worked on the user authentication module. Implemented
              login and registration features using JWT tokens. Also started
              working on password reset functionality.
            </div>

            <div className="vr-feedback">
              <p className="vr-feedback-label">Your Feedback:</p>
              <p className="vr-feedback-text">Great start! Keep up the good work.</p>
            </div>
          </div>
        </div>

        {/* ── Report 3 — pending ── */}
        <div className="vr-report">
          <div className="vr-report-inner">
            <div className="vr-report-header">
              <div className="vr-report-meta">
                <span className="vr-report-date">2/21/2026</span>
                <span className="vr-badge vr-badge-green">weekly</span>
                <span className="vr-badge vr-badge-green">pending</span>
              </div>
            </div>

            <div className="vr-report-body">
              Working on database integration and API endpoints for user
              management. Created RESTful endpoints for CRUD operations.
              Implemented data validation middleware.
            </div>

            <div className="vr-actions">
              <button className="vr-action-btn">
                <LuThumbsUp />
                Like
              </button>
              <button className="vr-action-btn">
                <LuThumbsDown />
                Dislike
              </button>
              <button className="vr-action-btn">
                <BiComment />
                Comment
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ViewReports
