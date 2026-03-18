import { useState } from "react";

const INITIAL_LETTERS = [
  {
    id: 1,
    studentName: "John Doe",
    studentId: "2024001",
    department: "Computer Science",
    company: "Tech Solutions Ltd",
    location: "Lagos, Nigeria",
    requestDate: "2/25/2026",
    status: "pending",
  },
  {
    id: 2,
    studentName: "Jane Smith",
    studentId: "2024002",
    department: "Business Administration",
    company: "Finance Group Inc",
    location: "Abuja, Nigeria",
    requestDate: "2/26/2026",
    status: "pending",
  },
  {
    id: 3,
    studentName: "Michael Johnson",
    studentId: "2024003",
    department: "Engineering",
    company: "Engineering Dynamics",
    location: "Port Harcourt, Nigeria",
    requestDate: "2/20/2026",
    status: "approved",
  },
];

export default function useLetters() {
  const [letters, setLetters] = useState(INITIAL_LETTERS);
  const [previewLetter, setPreviewLetter] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const pendingLetters = letters.filter((l) => l.status === "pending");
  const processedLetters = letters.filter((l) => l.status !== "pending");

  const handleApprove = (id) => {
    setLetters((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "approved" } : l))
    );
    showToast("Letter approved successfully!");
  };

  const handleReject = (id) => {
    setLetters((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "rejected" } : l))
    );
    showToast("Letter rejected.", "error");
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