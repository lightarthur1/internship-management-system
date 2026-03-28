import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../Context/AuthContext";

export default function useSupervisors() {
  const { authFetch } = useAuth();
  const [supervisors, setSupervisors] = useState([]);
  const [students, setStudents]       = useState([]);
  const [toast, setToast]             = useState(null);
  const [loading, setLoading]         = useState(true);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch supervisors and students in parallel ────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      const [supData, stuData] = await Promise.all([
        authFetch("/admin/supervisors?role=academic-supervisor"),
        authFetch("/admin/students"),
      ]);

      // Normalise supervisors
      const normSups = supData.supervisors.map((s) => ({
        id:           s._id,
        name:         s.name,
        email:        s.email,
        department:   s.department || "—",
        studentCount: 0, // computed below
      }));

      // Normalise students (id = profile _id for UI key; userId = User._id for admin API)
      const normStudents = stuData.students.map((s) => ({
        id:           s._id,
        userId:       s.user?._id || s.user,
        name:         s.user?.name      || "—",
        studentId:    s.studentId       || "—",
        department:   s.department      || "—",
        company:      s.companyName     || "Not set",
        supervisorId: s.academicSupervisor?._id || null,
        supervisor:   s.academicSupervisor
          ? { id: s.academicSupervisor._id, name: s.academicSupervisor.name }
          : null,
      }));

      // Compute student count per supervisor
      const withCount = normSups.map((sup) => ({
        ...sup,
        studentCount: normStudents.filter((st) => st.supervisorId === sup.id)
          .length,
      }));

      setSupervisors(withCount);
      setStudents(normStudents);
    } catch (err) {
      showToast("Failed to load data: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Assign supervisor to student ──────────────────────────────────────────
  const assignSupervisor = async (studentUserId, supervisorUserId) => {
    try {
      await authFetch("/admin/assign-supervisor", {
        method: "PUT",
        body: JSON.stringify({ studentUserId, supervisorUserId }),
      });

      const supervisor = supervisors.find((s) => s.id === supervisorUserId);

      // Update students list locally
      setStudents((prev) =>
        prev.map((s) =>
          s.userId === studentUserId
            ? {
                ...s,
                supervisorId: supervisorUserId,
                supervisor: supervisor
                  ? { id: supervisor.id, name: supervisor.name }
                  : null,
              }
            : s
        )
      );

      // Update supervisor student counts
      setSupervisors((prev) =>
        prev.map((sup) => {
          const count = students.filter((st) =>
            st.userId === studentUserId
              ? sup.id === supervisorUserId
              : st.supervisorId === sup.id
          ).length;
          return { ...sup, studentCount: count };
        })
      );

      showToast(
        `Supervisor ${supervisor?.name || ""} assigned successfully!`
      );
    } catch (err) {
      showToast("Failed to assign: " + err.message, "error");
    }
  };

  return {
    supervisors,
    students,
    toast,
    loading,
    assignSupervisor,
  };
}