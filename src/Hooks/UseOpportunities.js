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
  const [opportunities, setOpportunities]   = useState([]);
  const [form, setForm]                     = useState(EMPTY_FORM);
  const [showAddModal, setShowAddModal]     = useState(false);
  const [editTargetId, setEditTargetId]     = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [toast, setToast]                   = useState(null);
  const [loading, setLoading]               = useState(true);
  const [saving, setSaving]                 = useState(false);
  const [deleting, setDeleting]             = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const normalise = (o) => ({
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
  });

  const fetchOpportunities = useCallback(async () => {
    try {
      const data = await authFetch("/admin/opportunities");
      setOpportunities(data.opportunities.map(normalise));
    } catch (err) {
      showToast("Failed to load opportunities: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => { fetchOpportunities(); }, [fetchOpportunities]);

  const opportunityApiBody = (f) => ({
    companyName:  f.company?.trim(),
    companyEmoji: f.companyEmoji,
    location:     f.location,
    description:  f.description,
    positions:    Number(f.positions),
    duration:     f.duration,
    type:         f.type,
    stipend:      f.stipend || undefined,
    roles:        f.roles  || [],
    skills:       f.skills || [],
  });

  const closeModals = () => {
    setShowAddModal(false);
    setEditTargetId(null);
    setDeleteTargetId(null);
    setForm(EMPTY_FORM);
  };

  const openAdd = () => { setForm(EMPTY_FORM); setShowAddModal(true); };

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

  // ── Create ──────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!form.company?.trim()) return;
    setSaving(true);
    try {
      const data = await authFetch("/admin/opportunities", {
        method: "POST",
        body: JSON.stringify(opportunityApiBody(form)),
      });
      setOpportunities((prev) => [normalise(data.opportunity), ...prev]);
      closeModals();
      showToast("Opportunity created successfully!");
    } catch (err) {
      showToast("Failed to create: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Update ──────────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!form.company?.trim()) return;
    setSaving(true);
    try {
      const data = await authFetch(`/admin/opportunities/${editTargetId}`, {
        method: "PUT",
        body: JSON.stringify(opportunityApiBody(form)),
      });
      setOpportunities((prev) =>
        prev.map((opp) =>
          opp.id === editTargetId ? normalise(data.opportunity) : opp
        )
      );
      closeModals();
      showToast("Opportunity updated successfully!");
    } catch (err) {
      showToast("Failed to update: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await authFetch(`/admin/opportunities/${deleteTargetId}`, { method: "DELETE" });
      setOpportunities((prev) => prev.filter((opp) => opp.id !== deleteTargetId));
      closeModals();
      showToast("Opportunity removed.", "error");
    } catch (err) {
      showToast("Failed to delete: " + err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  return {
    opportunities, form, setForm, toast,
    loading, saving, deleting,
    showAddModal, editTargetId, deleteTargetId,
    openAdd, openEdit, openDelete, closeModals,
    handleCreate, handleUpdate, handleDelete,
  };
}