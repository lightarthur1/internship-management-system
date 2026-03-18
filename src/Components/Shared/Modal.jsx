import React from "react";
import { X } from "lucide-react";
import "./Modal.css";

const Modal = ({ title, subtitle, onClose, onConfirm, confirmLabel, confirmVariant = "primary", children }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <h2 className="modal-title">{title}</h2>
        <p className="modal-subtitle">{subtitle}</p>

        <div className="modal-body">{children}</div>

        <div className="modal-footer">
          <button className="modal-btn modal-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`modal-btn modal-btn-${confirmVariant}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Modal;