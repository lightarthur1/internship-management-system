import React from 'react'
import { FiUser } from "react-icons/fi";
import Navbar from '../Components/Navbar/Navbar'
import { FaRegFileLines } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import './AcademicSupervisor.css'

const AcademicSupervisorDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="asd-main">
        <div className="asd-container">

          {/* Supervisor Info */}
          <div className="info-card">
            <h2 className="info-title">Supervisor Information</h2>

            <div className="info-grid">
              <div>
                <p className="info-label">Name</p>
                <p className="info-value">Dr. Sarah Williams</p>
              </div>
              <div>
                <p className="info-label">Department</p>
                <p className="info-value">Computer Science</p>
              </div>
              <div>
                <p className="info-label">Email</p>
                <p className="info-value">sarah.w@university.edu</p>
              </div>
            </div>
          </div>

          {/*Stats row */}
          <div className="stats-grid">

            {/* Assigned Students */}
            <div className="stat-card">
              <div className="stat-header">
                <h3 className="stat-label">Assigned Students</h3>
                <FiUser className="stat-icon" />
              </div>
              <span className="stat-value">3</span>
            </div>

            {/* Total Reports */}
            <div className="-stat-card">
              <div className="-stat-header">
                <h3 className="stat-label">Total Reports</h3>
                <FaRegFileLines className="stat-icon" />
              </div>
              <span className="stat-value">9</span>
            </div>

            {/* Pending Reviews */}
            <div className="stat-card">
              <div className="stat-header">
                <h3 className="stat-label">Pending Reviews</h3>
                <FaRegFileLines className="asd-stat-icon--orange" />
              </div>
              <span className="stat-value--orange">3</span>
            </div>

          </div>

          {/* ── Assigned Students Card ── */}
          <div className="asd-students-wrapper">
            <div className="asd-students-card">
              <h3 className="asd-students-title">Assigned Students</h3>
              <p className="asd-students-subtitle">Students under your supervision</p>

              <div className="asd-students-inner">

                {/* ── Student: John Doe ── */}
                <div className="asd-student-card">
                  <div>
                    <div className="asd-student-header">
                      <h3 className="asd-student-name">John Doe</h3>
                      <span className="asd-pending-badge">1 pending</span>
                    </div>

                    <div className="asd-student-meta">
                      <p>200455544 <span className="asd-student-dot">·</span> Computer Science</p>
                      <div className="asd-student-row">
                        <p>Company: <span className="asd-student-company">Tech Solutions Ltd</span></p>
                        <p>Location: Accra, Ghana</p>
                        <div className="asd-view-btn" onClick={() => navigate("/view-reports")}>
                          <FaRegFileLines />
                          <button>View Reports</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="asd-reports-submitted">Reports Submitted: <span>3</span></p>
                </div>

                {/* ── Student: Emily Brown ── */}
                <div className="asd-student-card">
                  <div>
                    <div className="asd-student-header">
                      <h3 className="asd-student-name">Emily Brown</h3>
                      <span className="asd-pending-badge">2 pending</span>
                    </div>

                    <div className="asd-student-meta">
                      <p>200455544 <span className="asd-student-dot">·</span> Computer Science</p>
                      <div className="asd-student-row">
                        <p>Company: <span className="asd-student-company">Digital Marketing PRO</span></p>
                        <p>Location: Accra, Ghana</p>
                        <div className="asd-view-btn" onClick={() => navigate("/view-reports")}>
                          <FaRegFileLines />
                          <button>View Reports</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="asd-reports-submitted">Reports Submitted: <span>2</span></p>
                </div>

                {/* ── Student: David Wilson ── */}
                <div className="asd-student-card">
                  <div>
                    <div className="asd-student-header">
                      <h3 className="asd-student-name">David Wilson</h3>
                      <span className="asd-pending-badge">3 pending</span>
                    </div>

                    <div className="asd-student-meta">
                      <p>200455544 <span className="asd-student-dot">·</span> Computer Science</p>
                      <div className="asd-student-row">
                        <p>Company: <span className="asd-student-company">Software Incorporated</span></p>
                        <p>Location: Accra, Ghana</p>
                        <div className="asd-view-btn" onClick={() => navigate("/view-reports")}>
                          <FaRegFileLines />
                          <button>View Reports</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="asd-reports-submitted">Reports Submitted: <span>2</span></p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}

export default AcademicSupervisorDashboard
