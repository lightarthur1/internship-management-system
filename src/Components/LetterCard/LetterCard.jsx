import React from "react";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import "./LetterCard.css";

const StatusBadge = ({ status }) => (
  <span className={`status-badge status-badge-${status}`}>
    {status === "pending" && "Pending"}
    {status === "approved" && <><CheckCircle size={13} /> Approved</>}
    {status === "rejected" && <><XCircle size={13} /> Rejected</>}
  </span>
);

const LetterCard = ({ letter, onPreview, onApprove, onReject }) => {
  const { studentName, studentId, department, company, location, requestDate, status } = letter;
  const isPending = status === "pending";

  return (
    <div className="letter-card">
      <div className="letter-card-header">
        <div>
          <h3 className="letter-student-name">{studentName}</h3>
          <p className="letter-student-meta">{studentId} • {department}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="letter-card-details">
        <div className="letter-field">
          <span className="letter-label">Company</span>
          <span className="letter-value">{company}</span>
        </div>
        <div className="letter-field">
          <span className="letter-label">Location</span>
          <span className="letter-value">{location}</span>
        </div>
        {isPending && (
          <div className="letter-field">
            <span className="letter-label">Request Date</span>
            <span className="letter-value">{requestDate}</span>
          </div>
        )}
      </div>

      {isPending && (
        <div className="letter-card-actions">
          <button className="letter-btn letter-btn-preview" onClick={() => onPreview(letter)}>
            <Eye size={15} /> Preview
          </button>
          <button className="letter-btn letter-btn-approve" onClick={() => onApprove(letter.id)}>
            <CheckCircle size={15} /> Approve
          </button>
          <button className="letter-btn letter-btn-reject" onClick={() => onReject(letter.id)}>
            <XCircle size={15} /> Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default LetterCard;