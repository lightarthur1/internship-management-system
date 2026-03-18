import React from "react";
import "../Styles/ManageOpportunities.css";
import OpportunityCard from "../Components/OpportunityCard/OpportunityCard";
import AddOpportunityModal from "../Components/Shared/AddOpportunityModal";
import EditOpportunityModal from "../Components/Shared/EditOpportunityModal";
import ConfirmDeleteModal from "../Components/Shared/ConfirmDeleteModal";
import Toast from "../Components/Shared/Toast";
import useOpportunities from "../Hooks/UseOpportunities";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManageOpportunities = () => {
  const navigate = useNavigate();

  const {
    opportunities,
    form,
    setForm,
    toast,
    showAddModal,
    editTargetId,
    deleteTargetId,
    openAdd,
    openEdit,
    openDelete,
    closeModals,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useOpportunities();

  return (
    <div className="manage-container">

      <div className="manage-opp-nav">
        <div className="top-bar">
          <button className="back-btn" onClick={() => navigate("/admin")}>
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <button className="add-btn" onClick={openAdd}>
            <Plus size={18} />
            Add Opportunity
          </button>
        </div>

        <div className="page-title">
          <h1>Manage Opportunities</h1>
          <p>Add, edit, or remove internship positions</p>
        </div>
      </div>

      <div className="opportunity-grid">
        {opportunities.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">No opportunities yet</p>
            <p className="empty-hint">Click "Add Opportunity" to get started</p>
          </div>
        ) : (
          opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              company={opp.company}
              logo={opp.logo}
              location={opp.location}
              description={opp.description}
              positions={opp.positions}
              duration={opp.duration}
              onEdit={() => openEdit(opp)}
              onDelete={() => openDelete(opp.id)}
            />
          ))
        )}
      </div>

      {showAddModal && (
        <AddOpportunityModal
          form={form}
          onChange={setForm}
          onClose={closeModals}
          onConfirm={handleCreate}
        />
      )}

      {editTargetId !== null && (
        <EditOpportunityModal
          form={form}
          onChange={setForm}
          onClose={closeModals}
          onConfirm={handleUpdate}
        />
      )}

      {deleteTargetId !== null && (
        <ConfirmDeleteModal
          onClose={closeModals}
          onConfirm={handleDelete}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}

    </div>
  );
};

export default ManageOpportunities;