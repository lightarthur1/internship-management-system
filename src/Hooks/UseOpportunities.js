import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../Context/AuthContext";

export const EMPTY_FORM = {
  company:      "",
  companyEmoji: "🏢",
  location:     "",
  description:  "",
  positions:    1,
  duration:     "",
  type:         "On-site",
  stipend:      "",
  roles:        [],
  skills:       [],
};

export default function useOpportunities() {
  const { authFetch } = useAuth();
  const [opportunities, setOpportunities]     = useState([]);
  const [form, setForm]                       = useState(EMPTY_FORM);
  const [showAddModal, setShowAddModal]       = useState(false);
  const [editTargetId, setEditTargetId]       = useState(null);
  const [deleteTargetId, setDeleteTargetId]   = useState(null);
  const [toast, setToast]                     = useState(null);
  const [loading, setLoading]                 = useState(true);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOpportunities = useCallback(async () => {
    try {
      const data = await authFetch("/admin/opportunities");
      const normalised = data.opportunities.map((o) => ({
        id:          o._id,
        company:     o.companyName,
        logo:        o.companyEmoji || "🏢",
        location:    o.location,
        description: o.description,
        positions:   o.positions,
        duration:    o.duration,
        type:        o.type,
        stipend:     o.stipend,
        roles:       o.roles  || [],
        skills:      o.skills || [],
        isActive:    o.isActive,
      }));
      setOpportunities(normalised);
    } catch (err) {
      showToast("Failed to load opportunities: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOpportunities(); }, [fetchOpportunities]);

  const closeModals = () => {
    setShowAddModal(false);
    setEditTargetId(null);
    setDeleteTargetId(null);
    setForm(EMPTY_FORM);
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setShowAddModal(true);
  };

  const openEdit = (opportunity) => {
    setForm({
      company:      opportunity.company,
      companyEmoji: opportunity.logo,
      location:     opportunity.location,
      description:  opportunity.description,
      positions:    opportunity.positions,
      duration:     opportunity.duration,
      type:         opportunity.type    || "On-site",
      stipend:      opportunity.stipend || "",
      roles:        opportunity.roles   || [],
      skills:       opportunity.skills  || [],
    });
    setEditTargetId(opportunity.id);
  };

  const openDelete = (id) => setDeleteTargetId(id);

  // ── Create ────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!form.company?.trim()) return;
    try {
      const data = await authFetch("/admin/opportunities", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          companyName: form.company,        // ← map to backend field
          positions:   Number(form.positions),
        }),
      });
      const o = data.opportunity;
      setOpportunities((prev) => [
        {
          id:          o._id,
          company:     o.companyName,
          logo:        o.companyEmoji || "🏢",
          location:    o.location,
          description: o.description,
          positions:   o.positions,
          duration:    o.duration,
          type:        o.type,
          stipend:     o.stipend,
          roles:       o.roles  || [],
          skills:      o.skills || [],
        },
        ...prev,
      ]);
      closeModals();
      showToast("Opportunity created successfully!");
    } catch (err) {
      showToast("Failed to create: " + err.message, "error");
    }
  };

  // ── Update ────────────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!form.company?.trim()) return;
    try {
      const data = await authFetch(`/admin/opportunities/${editTargetId}`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          companyName: form.company,        // ← map to backend field
          positions:   Number(form.positions),
        }),
      });
      const o = data.opportunity;
      setOpportunities((prev) =>
        prev.map((opp) =>
          opp.id === editTargetId
            ? {
                id:          o._id,
                company:     o.companyName,
                logo:        o.companyEmoji || "🏢",
                location:    o.location,
                description: o.description,
                positions:   o.positions,
                duration:    o.duration,
                type:        o.type,
                stipend:     o.stipend,
                roles:       o.roles  || [],
                skills:      o.skills || [],
              }
            : opp
        )
      );
      closeModals();
      showToast("Opportunity updated successfully!");
    } catch (err) {
      showToast("Failed to update: " + err.message, "error");
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      await authFetch(`/admin/opportunities/${deleteTargetId}`, {
        method: "DELETE",
      });
      setOpportunities((prev) =>
        prev.filter((opp) => opp.id !== deleteTargetId)
      );
      closeModals();
      showToast("Opportunity removed.", "error");
    } catch (err) {
      showToast("Failed to delete: " + err.message, "error");
    }
  };

  return {
    opportunities,
    form,
    setForm,
    toast,
    loading,
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