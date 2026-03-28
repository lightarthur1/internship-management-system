import React from "react";
import Modal from "./Modal";
import OpportunityForm from "./OpportunityForm";

const AddOpportunityModal = ({ form, onChange, onClose, onConfirm, saving }) => {
  return (
    <Modal
      title="Add Opportunity"
      subtitle="Create an internship opportunity for students"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmLabel={saving ? "Creating..." : "Create"}
      confirmDisabled={saving}
      confirmVariant="primary"
    >
      <OpportunityForm form={form} onChange={onChange} />
    </Modal>
  );
};

export default AddOpportunityModal;