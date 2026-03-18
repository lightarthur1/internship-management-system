import { useState } from "react";

const INITIAL_SUPERVISORS = [
  {
    id: 1,
    name: "Dr. Sarah Williams",
    department: "Computer Science",
    email: "sarah.w@university.edu",
  },
  {
    id: 2,
    name: "Prof. James Brown",
    department: "Business Administration",
    email: "james.b@university.edu",
  },
  {
    id: 3,
    name: "Dr. Emily Davis",
    department: "Engineering",
    email: "emily.d@university.edu",
  },
  {
    id: 4,
    name: "Dr. Michael Chen",
    department: "Computer Science",
    email: "michael.c@university.edu",
  },
];

const INITIAL_STUDENTS = [
  {
    id: 1,
    name: "John Doe",
    studentId: "2024001",
    department: "Computer Science",
    company: "Tech Solutions Ltd",
    supervisorId: 1, // pre-assigned
  },
  {
    id: 2,
    name: "Jane Smith",
    studentId: "2024002",
    department: "Business Administration",
    company: "Finance Group Inc",
    supervisorId: null,
  },
  {
    id: 3,
    name: "Michael Johnson",
    studentId: "2024003",
    department: "Engineering",
    company: "Engineering Dynamics",
    supervisorId: null,
  },
  {
    id: 4,
    name: "Emily Brown",
    studentId: "2024004",
    department: "Computer Science",
    company: "Digital Marketing Pro",
    supervisorId: 4, // pre-assigned
  },
];

export default function useSupervisors() {
  const [supervisors] = useState(INITIAL_SUPERVISORS);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const assignSupervisor = (studentId, supervisorId) => {
    const supervisor = supervisors.find((s) => s.id === supervisorId);
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, supervisorId } : s
      )
    );
    showToast(`Supervisor assigned: ${supervisor.name}`);
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