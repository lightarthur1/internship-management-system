import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { API_BASE_URL } from "../config/api";

export default function useLetters() {
  const { token } = useAuth();
  const api = useMemo(
    () =>
      axios.create({
        baseURL: API_BASE_URL,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    [token]
  );

  const [letters, setLetters] = useState([]);
  const [previewLetter, setPreviewLetter] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/letters/admin/all");
        const items = (res?.data?.letters || []).map((l) => ({
          id: l._id,
          studentName: l?.student?.fullName || "Unknown Student",
          studentId: l?.student?.profile?.studentId || "N/A",
          department: l?.student?.profile?.department || "N/A",
          company: l.company,
          location: l.location,
          requestDate: l.createdAt
            ? new Date(l.createdAt).toLocaleDateString()
            : "",
          status: l.status,
        }));
        setLetters(items);
      } catch (e) {
        console.error("Failed to load letters", e);
        showToast("Failed to load letters", "error");
      }
    };
    load();
  }, [api]);

  const pendingLetters = letters.filter((l) => l.status === "pending");
  const processedLetters = letters.filter((l) => l.status !== "pending");

  const handleApprove = async (id) => {
    try {
      await api.patch(`/letters/admin/${id}/status`, { status: "approved" });
      setLetters((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: "approved" } : l))
      );
      showToast("Letter approved successfully!");
    } catch (e) {
      console.error("Approve failed", e);
      showToast("Failed to approve letter", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/letters/admin/${id}/status`, { status: "rejected" });
      setLetters((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: "rejected" } : l))
      );
      showToast("Letter rejected.", "error");
    } catch (e) {
      console.error("Reject failed", e);
      showToast("Failed to reject letter", "error");
    }
  };

  const openPreview = (letter) => setPreviewLetter(letter);
  const closePreview = () => setPreviewLetter(null);

  return {
    pendingLetters,
    processedLetters,
    previewLetter,
    toast,
    handleApprove,
    handleReject,
    openPreview,
    closePreview,
  };
}