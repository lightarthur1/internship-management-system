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

  const { supervisors, students, toast, assignSupervisor } = useSupervisors();

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

      {/* Two-column layout */}
      <div className="assign-content">

        {/* Left — Available Supervisors */}
        <div className="assign-panel assign-panel-left">
          <div className="panel-header">
            <h2 className="panel-title">Available Supervisors</h2>
            <p className="panel-subtitle">Academic supervisors by department</p>
          </div>
          <div className="supervisors-list">
            {supervisors.map((supervisor) => (
              <SupervisorCard key={supervisor.id} supervisor={supervisor} />
            ))}
          </div>
        </div>

        {/* Right — Students */}
        <div className="assign-panel assign-panel-right">
          <div className="panel-header">
            <h2 className="panel-title">Students</h2>
            <p className="panel-subtitle">Assign or update academic supervisors</p>
          </div>
          <div className="students-list">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                supervisors={supervisors}
                onAssign={assignSupervisor}
              />
            ))}
          </div>
        </div>

      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}

    </div>
  );
};

export default AssignSupervisors;