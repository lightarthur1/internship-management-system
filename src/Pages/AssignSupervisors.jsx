import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useSupervisors from "../Hooks/UseSupervisors";
import SupervisorCard from "../Components/SupervisorPanel/SupervisorCard";
import StudentCard from "../Components/StudentCard/StudentCard";
import Toast from "../Components/Shared/Toast";
import "../Styles/AssignSupervisors.css";

const AssignSupervisors = () => {
  const navigate = useNavigate();

  const {
    supervisors, students, toast,
    loading, assigningId,
    assignSupervisor,
  } = useSupervisors();

  return (
    <div className="assign-container">

      {/* Header */}
      <div className="assign-nav">
        <button className="back-btn" onClick={() => navigate("/admin")}>
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
        <div className="page-title">
          <h1>Assign Supervisors</h1>
          <p>Match academic supervisors with students</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:"80px 0" }}>
          <div style={{ fontSize:36, marginBottom:12 }}>⏳</div>
          <p style={{ fontWeight:600, color:"#6b7280", fontSize:15 }}>
            Loading supervisors and students...
          </p>
          <p style={{ fontSize:13, color:"#9ca3af", marginTop:4 }}>
            Connecting to database
          </p>
        </div>
      ) : (
        <div className="assign-content">

          {/* Left — Available Supervisors */}
          <div className="assign-panel assign-panel-left">
            <div className="panel-header">
              <h2 className="panel-title">Available Supervisors</h2>
              <p className="panel-subtitle">
                {supervisors.length} academic supervisor{supervisors.length !== 1 ? "s" : ""}
              </p>
            </div>
            {supervisors.length === 0 ? (
              <div style={{ padding:"32px 16px", textAlign:"center", color:"#9ca3af", fontSize:13 }}>
                No academic supervisors registered yet.
              </div>
            ) : (
              <div className="supervisors-list">
                {supervisors.map((supervisor) => (
                  <SupervisorCard key={supervisor.id} supervisor={supervisor} />
                ))}
              </div>
            )}
          </div>

          {/* Right — Students */}
          <div className="assign-panel assign-panel-right">
            <div className="panel-header">
              <h2 className="panel-title">Students</h2>
              <p className="panel-subtitle">
                {students.length} student{students.length !== 1 ? "s" : ""} registered
              </p>
            </div>
            {students.length === 0 ? (
              <div style={{ padding:"32px 16px", textAlign:"center", color:"#9ca3af", fontSize:13 }}>
                No students registered yet.
              </div>
            ) : (
              <div className="students-list">
                {students.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    supervisors={supervisors}
                    onAssign={assignSupervisor}
                    assigning={assigningId === student.userId}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}

    </div>
  );
};

export default AssignSupervisors;