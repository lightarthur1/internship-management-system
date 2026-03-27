import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

export default function useSupervisors() {
  const { token } = useAuth();
  const api = useMemo(
    () =>
      axios.create({
        baseURL: "http://localhost:5000/api",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    [token]
  );

  const [supervisors, setSupervisors] = useState([]);
  const [students, setStudents] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [supRes, stuRes] = await Promise.all([
          api.get("/admin/academic-supervisors"),
          api.get("/admin/students"),
        ]);

        const supMapped = (supRes?.data?.supervisors || []).map((s) => ({
          id: s._id,
          name: s.fullName,
          department: s?.profile?.department || "N/A",
          email: s.email,
        }));

        const stuMapped = (stuRes?.data?.students || []).map((s) => ({
          id: s._id,
          name: s.fullName,
          studentId: s?.profile?.studentId || "N/A",
          department: s?.profile?.department || "N/A",
          company: "Not set",
          supervisorId: s?.profile?.academicSupervisorId?._id || null,
        }));

        setSupervisors(supMapped);
        setStudents(stuMapped);
      } catch (e) {
        console.error("Failed to load supervisor assignment data", e);
        showToast("Failed to load supervisors/students", "error");
      }
    };
    if (token) load();
  }, [api, token]);

  const assignSupervisor = async (studentId, supervisorId) => {
    try {
      await api.patch(`/admin/students/${studentId}/academic-supervisor`, {
        academicSupervisorId: supervisorId,
      });
      const supervisor = supervisors.find((s) => s.id === supervisorId);
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, supervisorId } : s))
      );
      showToast(`Supervisor assigned: ${supervisor?.name || "Updated"}`);
    } catch (e) {
      console.error("Assign supervisor failed", e);
      showToast("Failed to assign supervisor", "error");
    }
  };

  // Compute student count per supervisor dynamically
  const supervisorsWithCount = supervisors.map((sup) => ({
    ...sup,
    studentCount: students.filter((s) => s.supervisorId === sup.id).length,
  }));

  // Enrich students with their supervisor object
  const enrichedStudents = students.map((student) => ({
    ...student,
    supervisor: supervisors.find((s) => s.id === student.supervisorId) || null,
  }));

  return {
    supervisors: supervisorsWithCount,
    students: enrichedStudents,
    toast,
    assignSupervisor,
  };
}