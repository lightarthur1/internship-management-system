import React from "react";
import "./OpportunityForm.css";
import { isOpportunityLogoImage } from "../../utils/opportunityLogo";

const OpportunityForm = ({ form, onChange }) => {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    /* Persist as companyEmoji — backend + UseOpportunities only store that field (not `logo`). */
    reader.onload = (ev) =>
      onChange({ ...form, companyEmoji: ev.target.result });
    reader.readAsDataURL(file);
  };

  return (
    <div className="opp-form">

      <div className="form-row">
        <label className="form-label">Company</label>
        <input
          className="form-input"
          value={form.company}
          onChange={(e) => onChange({ ...form, company: e.target.value })}
          placeholder="e.g., Tech Solutions Ltd"
          autoFocus
        />
      </div>

      <div className="form-row">
        <label className="form-label">Company Logo</label>
        <div className="form-upload-wrapper">
          <label className="form-upload-label">
            <input
              type="file"
              accept="image/*"
              className="form-upload-input"
              onChange={handleImageUpload}
            />
            {isOpportunityLogoImage(form.companyEmoji) ? (
              <div className="upload-preview">
                <img src={form.companyEmoji} alt="Company logo" className="upload-preview-img" />
                <div className="upload-preview-overlay">Change</div>
              </div>
            ) : (
              <div className="upload-placeholder">
                <span className="upload-icon">📁</span>
                <span className="upload-text">Click to upload image</span>
                <span className="upload-hint">PNG, JPG, SVG</span>
              </div>
            )}
          </label>
        </div>
      </div>

      <div className="form-row">
        <label className="form-label">Location</label>
        <input
          className="form-input"
          value={form.location}
          onChange={(e) => onChange({ ...form, location: e.target.value })}
          placeholder="e.g., Lagos, Nigeria"
        />
      </div>

      <div className="form-row">
        <label className="form-label">Description</label>
        <textarea
          className="form-input form-textarea"
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          placeholder="Describe the internship..."
        />
      </div>

      <div className="form-row">
        <label className="form-label">Positions</label>
        <input
          type="number"
          min="1"
          className="form-input"
          value={form.positions}
          onChange={(e) => onChange({ ...form, positions: e.target.value })}
        />
      </div>

      <div className="form-row">
        <label className="form-label">Duration</label>
        <input
          className="form-input"
          value={form.duration}
          onChange={(e) => onChange({ ...form, duration: e.target.value })}
          placeholder="e.g., 6 months"
        />
      </div>

    </div>
  );
};

export default OpportunityForm;