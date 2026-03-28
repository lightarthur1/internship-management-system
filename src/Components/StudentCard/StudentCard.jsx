import React from "react";
import { UserCheck } from "lucide-react";
import SupervisorDropdown from "../StudentCard/SupervisorDropDown";
import "./StudentCard.css";

const StudentCard = ({ student, supervisors, onAssign }) => {
  const { name, studentId, department, company, supervisor } = student;
  const isAssigned = !!supervisor;

  return (
    <div className="student-card">
      <div className="student-card-left">
        <div className="student-card-header">
          <h4 className="student-name">{name}</h4>
          {isAssigned && (
            <span className="assigned-badge">
              <UserCheck size={13} /> Assigned
            </span>
          )}
        </div>
        <p className="student-meta">{studentId} • {department}</p>
        <p className="student-company">
          Company: <strong>{company}</strong>
        </p>
        {isAssigned && (
          <p className="student-supervisor-name">
            Supervisor: {supervisor.name}
          </p>
        )}
      </div>

      <SupervisorDropdown
        supervisors={supervisors}
        selectedId={student.supervisorId}
        onSelect={(supervisorUserId) =>
          onAssign(student.userId, supervisorUserId)
        }
      />
    </div>
  );
};

export default StudentCard;