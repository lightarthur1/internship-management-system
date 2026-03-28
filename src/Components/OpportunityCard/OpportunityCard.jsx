import React from "react";
import "./OpportunityCard.css";
import { Building2, Pencil, Trash2 } from "lucide-react";
import { isOpportunityLogoImage } from "../../utils/opportunityLogo";

const OpportunityCard = ({
  company,
  logo,
  location,
  description,
  positions,
  duration,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="opportunity-card">
      <div className="card-info">

        <div className="card-header">
          {isOpportunityLogoImage(logo) ? (
            <img src={logo} alt={company} className="company-logo" />
          ) : logo ? (
            <span className="company-emoji-mark" aria-hidden>{logo}</span>
          ) : (
            <Building2 size={28} className="company-icon" />
          )}
          <h3>{company}</h3>
        </div>

        <p className="label">Location</p>
        <p className="value">{location}</p>

        <p className="label">Description</p>
        <p className="value">{description}</p>

        <div className="card-meta">
          <div>
            <p className="label">Positions</p>
            <p className="value">{positions}</p>
          </div>
          <div>
            <p className="label">Duration</p>
            <p className="value">{duration}</p>
          </div>
        </div>

        <div className="card-actions">
          <button className="edit-btn" onClick={onEdit}>
            <Pencil size={16} />
            Edit
          </button>
          <button className="delete-btn" onClick={onDelete}>
            <Trash2 size={16} />
            Delete
          </button>
        </div>

      </div>
    </div>
  );
};

export default OpportunityCard;