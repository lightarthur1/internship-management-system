import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { API_BASE_URL } from "../config/api";

export const EMPTY_FORM = {
  company: "",
  logo: null,
  location: "",
  description: "",
  positions: 1,
  duration: "",
};

export default function useOpportunities() {
  const { token } = useAuth();
  const api = useMemo(() => {
    return axios.create({
      baseURL: API_BASE_URL,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }, [token]);

  const [opportunities, setOpportunities] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTargetId, setEditTargetId] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get("/opportunities");
        const items = res?.data?.opportunities || [];
        setOpportunities(
          items.map((o) => ({
            id: o._id,
            company: o.company,
            logo: o.logo,
            location: o.location,
            description: o.description,
            positions: o.positions,
            duration: o.duration,
            isActive: o.isActive,
          }))
        );
      } catch (e) {
        console.error("Failed to load opportunities", e);
        showToast("Failed to load opportunities", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [api]);

  const handleCreate = async () => {
    if (!form.company.trim()) return;
    try {
      const res = await api.post("/opportunities", {
        company: form.company,
        logo: form.logo,
        location: form.location,
        description: form.description,
        positions: Number(form.positions),
        duration: form.duration,
      });
      const o = res?.data?.opportunity;
      if (o) {
        setOpportunities((prev) => [
          {
            id: o._id,
            company: o.company,
            logo: o.logo,
            location: o.location,
            description: o.description,
            positions: o.positions,
            duration: o.duration,
            isActive: o.isActive,
          },
          ...prev,
        ]);
      }
      closeModals();
      showToast("Opportunity created successfully!");
    } catch (e) {
      console.error("Create opportunity failed", e);
      showToast(e?.response?.data?.message || "Create failed", "error");
    }
  };

  const handleUpdate = async () => {
    if (!form.company.trim()) return;
    try {
      const res = await api.patch(`/opportunities/${editTargetId}`, {
        company: form.company,
        logo: form.logo,
        location: form.location,
        description: form.description,
        positions: Number(form.positions),
        duration: form.duration,
      });
      const o = res?.data?.opportunity;
      if (o) {
        setOpportunities((prev) =>
          prev.map((opp) =>
            opp.id === editTargetId
              ? {
                  id: o._id,
                  company: o.company,
                  logo: o.logo,
                  location: o.location,
                  description: o.description,
                  positions: o.positions,
                  duration: o.duration,
                  isActive: o.isActive,
                }
              : opp
          )
        );
      }
      closeModals();
      showToast("Opportunity updated successfully!");
    } catch (e) {
      console.error("Update opportunity failed", e);
      showToast(e?.response?.data?.message || "Update failed", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/opportunities/${deleteTargetId}`);
      setOpportunities((prev) => prev.filter((opp) => opp.id !== deleteTargetId));
      closeModals();
      showToast("Opportunity deleted.");
    } catch (e) {
      console.error("Delete opportunity failed", e);
      showToast(e?.response?.data?.message || "Delete failed", "error");
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