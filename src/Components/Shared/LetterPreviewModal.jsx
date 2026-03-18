import React from "react";
import { X } from "lucide-react";
import "./LetterPreviewModal.css";

const LetterPreviewModal = ({ letter, onClose }) => {
  if (!letter) return null;

  const today = new Date().toLocaleDateString("en-US");

  return (
    <div className="preview-overlay" onClick={onClose}>
      <div className="preview-box" onClick={(e) => e.stopPropagation()}>

        <button className="preview-close" onClick={onClose}>
          <X size={18} />
        </button>

        <h2 className="preview-title">Internship Letter Preview</h2>
        <p className="preview-subtitle">Review the letter before approval</p>

        <div className="preview-letter">
          <p className="preview-letter-date">{today}</p>

          <p className="preview-letter-line"><strong>{letter.company}</strong></p>
          <p className="preview-letter-line">{letter.location}</p>

          <p className="preview-letter-line preview-letter-salutation">Dear Sir/Madam,</p>

          <p className="preview-letter-body">
            This is to certify that <strong>{letter.studentName}</strong> (Student ID: {letter.studentId}) from the
            Department of {letter.department} is a bonafide student of our institution.
          </p>

          <p className="preview-letter-body">
            We kindly request you to grant them the opportunity to undertake an internship
            program at your esteemed organization.
          </p>

          <p className="preview-letter-line">Sincerely,</p>
          <p className="preview-letter-line"><strong>Academic Coordinator</strong></p>
        </div>

        <div className="preview-footer">
          <button className="preview-close-btn" onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  );
};

export default LetterPreviewModal;