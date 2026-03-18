import React from "react";
import { Trash2 } from "lucide-react";
import "./ConfirmDeleteModal.css";

const ConfirmDeleteModal = ({ onClose, onConfirm }) => {
  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div className="confirm-box" onClick={(e) => e.stopPropagation()}>

        <div className="confirm-icon">
          <Trash2 size={32} />
        </div>

        <h2 className="confirm-title">Delete Opportunity?</h2>
        <p className="confirm-message">
          This action cannot be undone. The opportunity will be permanently removed.
        </p>

        <div className="confirm-footer">
          <button className="confirm-btn confirm-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-btn confirm-btn-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmDeleteModal;