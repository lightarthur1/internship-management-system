import { useState } from "react";

const INITIAL_OPPORTUNITIES = [
  {
    id: 1,
    company: "Tech Solutions Ltd",
    logo: null,
    location: "Lagos, Nigeria",
    description: "Looking for software development interns",
    positions: 5,
    duration: "6 months",
  },
  {
    id: 2,
    company: "Digital Marketing Pro",
    logo: null,
    location: "Abuja, Nigeria",
    description: "Marketing internship opportunity",
    positions: 3,
    duration: "4 months",
  },
];

export const EMPTY_FORM = {
  company: "",
  logo: null,
  location: "",
  description: "",
  positions: 1,
  duration: "",
};

export default function useOpportunities() {
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTargetId, setEditTargetId] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setEditTargetId(null);
    setDeleteTargetId(null);
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setShowAddModal(true);
  };

  const openEdit = (opportunity) => {
    setForm({ ...opportunity });
    setEditTargetId(opportunity.id);
  };

  const openDelete = (id) => {
    setDeleteTargetId(id);
  };

  const handleCreate = () => {
    if (!form.company.trim()) return;
    setOpportunities((prev) => [
      ...prev,
      { ...form, id: Date.now(), positions: Number(form.positions) },
    ]);
    closeModals();
    showToast("Opportunity created successfully!");
  };

  const handleUpdate = () => {
    if (!form.company.trim()) return;
    setOpportunities((prev) =>
      prev.map((opp) =>
        opp.id === editTargetId
          ? { ...form, id: editTargetId, positions: Number(form.positions) }
          : opp
      )
    );
    closeModals();
    showToast("Opportunity updated successfully!");
  };

  const handleDelete = () => {
    setOpportunities((prev) => prev.filter((opp) => opp.id !== deleteTargetId));
    closeModals();
    showToast("Opportunity deleted.", "error");
  };

  return {
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
  };
}