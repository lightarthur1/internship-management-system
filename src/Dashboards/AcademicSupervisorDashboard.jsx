import React, { useEffect, useState } from 'react'
import { FiUser } from "react-icons/fi";
import { FaRegFileLines } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import './AcademicSupervisor.css'

const AcademicSupervisorDashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState({ department: "", phone: "", title: "" });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditingDepartment, setIsEditingDepartment] = useState(false);

  const handleLogout = () => {
    logout?.();
    navigate('/login');
  };

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setLoadingProfile(false);
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const p = res?.data?.user?.profile || {};
        setProfile({
          department: p.department || "",
          phone: p.phone || "",
          title: p.title || "",
        });
      } catch (e) {
        console.error("Failed to load supervisor profile", e);
      } finally {
        setLoadingProfile(false);
      }
    };
    load();
  }, [token]);

  const saveDepartment = async () => {
    try {
      await axios.patch(
        "http://localhost:5000/api/users/me/profile",
        {
          department: profile.department,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditingDepartment(false);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to save profile");
    }
  };

  const supervisorName = user?.name || user?.fullName || "Academic Supervisor";
  const supervisorEmail = user?.email || "No email";
  const supervisorDepartment = profile.department || "Not set";

  return (
    <>
      <div style={{ background: "#0f172a", padding: "10px 16px", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, margin: 0 }}>Academic Supervisor Dashboard</p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: 0 }}>IMS Portal</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "8px",
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <main className="asd-main">
        <div className="asd-container">
          {/* Supervisor Information*/}
          <div className="asd-info-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <h2 className="asd-info-title">Supervisor Information</h2>
              <button
                onClick={() => setIsEditingDepartment((v) => !v)}
                style={{ background: "#0f172a", color: "#ffffff", border: "1px solid #0f172a", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontWeight: 600 }}
              >
                {isEditingDepartment ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="asd-info-grid">
              <div>
                <p className="asd-info-label">Name</p>
                <p className="asd-info-value">{supervisorName}</p>
              </div>
              <div>
                <p className="asd-info-label">Department</p>
                {isEditingDepartment ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      value={profile.department}
                      onChange={(e) => setProfile((p) => ({ ...p, department: e.target.value }))}
                      placeholder="e.g. Computer Science"
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #d1d5db", color: "#0f172a", fontWeight: 600 }}
                    />
                    <button
                      onClick={saveDepartment}
                      style={{ background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer", whiteSpace: "nowrap" }}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <p className="asd-info-value">{loadingProfile ? "Loading..." : supervisorDepartment}</p>
                )}
              </div>
              <div>
                <p className="asd-info-label">Email</p>
                <p className="asd-info-value">{supervisorEmail}</p>
              </div>
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="asd-stats-grid">

            {/* Assigned Students */}
            <div className="asd-stat-card">
              <div className="asd-stat-header">
                <h3 className="asd-stat-label">Assigned Students</h3>
                <FiUser className="asd-stat-icon" />
              </div>
              <span className="asd-stat-value">3</span>
            </div>

            {/* Total Reports */}
            <div className="asd-stat-card">
              <div className="asd-stat-header">
                <h3 className="asd-stat-label">Total Reports</h3>
                <FaRegFileLines className="asd-stat-icon" />
              </div>
              <span className="asd-stat-value">9</span>
            </div>

            {/* Pending Reviews */}
            <div className="asd-stat-card">
              <div className="asd-stat-header">
                <h3 className="asd-stat-label">Pending Reviews</h3>
                <FaRegFileLines className="asd-stat-icon--orange" />
              </div>
              <span className="asd-stat-value--orange">3</span>
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
