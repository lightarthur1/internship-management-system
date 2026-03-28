import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../Context/AuthContext";

export default function useLetters() {
  const { authFetch } = useAuth();
  const [letters, setLetters]             = useState([]);
  const [previewLetter, setPreviewLetter] = useState(null);
  const [toast, setToast]                 = useState(null);
  const [loading, setLoading]             = useState(true);
  // tracks which letter id is currently being approved or rejected
  const [processingId, setProcessingId]   = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchLetters = useCallback(async () => {
    try {
      const data = await authFetch("/letters");
      const normalised = data.letters.map((l) => ({
        id:          l._id,
        studentName: l.student?.name              || "—",
        studentId:   l.studentProfile?.studentId  || "—",
        department:  l.studentProfile?.department || "—",
        company:     l.opportunity?.companyName   || "—",
        location:    l.opportunity?.location      || "—",
        duration:    l.opportunity?.duration      || "—",
        requestDate: new Date(l.createdAt).toLocaleDateString(),
        status:      l.status,
        adminNote:   l.adminNote || "",
      }));
      setLetters(normalised);
    } catch (err) {
      showToast("Failed to load letters: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => { fetchLetters(); }, [fetchLetters]);

  const pendingLetters   = letters.filter((l) => l.status === "pending");
  const processedLetters = letters.filter((l) => l.status !== "pending");

  // ── Approve ────────────────────────────────────────────────────────────
  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await authFetch(`/letters/${id}/approve`, { method: "PUT" });
      setLetters((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: "approved" } : l))
      );
      showToast("Letter approved successfully!");
    } catch (err) {
      showToast("Failed to approve: " + err.message, "error");
    } finally {
      setProcessingId(null);
    }
  };

  // ── Reject ─────────────────────────────────────────────────────────────
  const handleReject = async (id, adminNote = "Request rejected.") => {
    setProcessingId(id);
    try {
      await authFetch(`/letters/${id}/reject`, {
        method: "PUT",
        body: JSON.stringify({ adminNote }),
      });
      setLetters((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status: "rejected", adminNote } : l
        )
      );
      showToast("Letter rejected.", "error");
    } catch (err) {
      showToast("Failed to reject: " + err.message, "error");
    } finally {
      setProcessingId(null);
    }
  };

  const openPreview  = (letter) => setPreviewLetter(letter);
  const closePreview = () => setPreviewLetter(null);

  return {
    letters,
    pendingLetters,
    processedLetters,
    previewLetter,
    toast,
    loading,
    processingId,
    handleApprove,
    handleReject,
    openPreview,
    closePreview,
  };
}