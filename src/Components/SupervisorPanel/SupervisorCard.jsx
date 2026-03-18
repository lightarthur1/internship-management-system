import React from "react";
import "./SupervisorCard.css";

const SupervisorCard = ({ supervisor }) => {
  const { name, department, email, studentCount } = supervisor;

  return (
    <div className="supervisor-card">
      <h4 className="supervisor-name">{name}</h4>
      <p className="supervisor-department">{department}</p>
      <p className="supervisor-email">{email}</p>
      <span className="supervisor-count">
        {studentCount} {studentCount === 1 ? "student" : "students"}
      </span>
    </div>
  );
};

export default SupervisorCard;