import React from "react";
import Modal from "./Modal";
import OpportunityForm from "./OpportunityForm";

const EditOpportunityModal = ({ form, onChange, onClose, onConfirm }) => {
  return (
    <Modal
      title="Edit Opportunity"
      subtitle="Update an internship opportunity for students"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmLabel="Update"
      confirmVariant="primary"
    >
      <OpportunityForm form={form} onChange={onChange} />
    </Modal>
  );
};

export default EditOpportunityModal;