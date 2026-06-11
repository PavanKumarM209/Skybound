"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Booking {
  _id: string;
  student_name: string;
  student_age: number;
  phone: string;
  program: string;
  date: string;
  status: "pending" | "accepted" | "rejected" | "enrolled";
  instructor_id: string;
  created_at: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  father_name: string;
  age: number;
  gender: string;
  class: string;
  attendance: number;
  phone?: string;
  password?: string;
  monthly_due?: number;
  payment_status?: string;
  last_paid_month?: string;
}

// Custom SVG Icons matching Admin Panel
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
  </svg>
);

const StudentsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const AttendanceIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PaymentsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h4a3 3 0 013 3v1" />
  </svg>
);

const CollapseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
);

const ExpandIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
);

function InputField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-slate-800 text-sm outline-none transition-all"
      />
    </div>
  );
}

export default function InstructorDashboard() {
  const [instructorId, setInstructorId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookings" | "students" | "attendance" | "payments" | "settings">("bookings");
  
  // Student view and list toggle states
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  // Direct Student Add state
  const [showAddStudentDirectModal, setShowAddStudentDirectModal] = useState(false);
  const [directStudentForm, setDirectStudentForm] = useState({
    name: "",
    email: "",
    father_name: "",
    age: "",
    gender: "",
    class: "Regular Training",
    phone: "",
    password: "",
    monthly_due: ""
  });

  // Edit Student state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Payments & billing states
  const [instructorProfile, setInstructorProfile] = useState<any>(null);
  const [paymentLogs, setPaymentLogs] = useState<any[]>([]);
  const [selectedPaymentProof, setSelectedPaymentProof] = useState<any | null>(null);
  const [qrCodeInput, setQrCodeInput] = useState("");
  const [qrUploading, setQrUploading] = useState(false);

  // Password change states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Student Add modal states (from Bookings)
  const [showAddStudentModal, setShowAddStudentModal] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState({ email: "", father_name: "", gender: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  // Attendance states
  const [attendanceDate, setAttendanceDate] = useState("");
  const [selectedForAttendance, setSelectedForAttendance] = useState<Set<string>>(new Set());
  const [attendanceMessage, setAttendanceMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Pagination states
  const [bookingsPage, setBookingsPage] = useState(1);
  const [studentsPage, setStudentsPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setAttendanceDate(`${yyyy}-${mm}-${dd}`);

    const id = localStorage.getItem("user_id");
    const role = localStorage.getItem("user_role");

    if (!id || role !== "instructor") {
      router.push("/login");
      return;
    }
    setInstructorId(id);
    fetchData(id);
  }, [router]);

  const fetchData = async (id: string) => {
    setLoading(true);
    await Promise.all([
      fetchBookings(id),
      fetchStudents(id),
      fetchInstructorProfile(id),
      fetchPaymentLogs(id)
    ]);
    setLoading(false);
  };

  const fetchBookings = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings?instructor_id=${id}`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchInstructorProfile = async (id: string) => {
    try {
      const response = await fetch(`/api/instructors/${id}`);
      if (response.ok) {
        const data = await response.json();
        setInstructorProfile(data);
        setQrCodeInput(data.payment_qr || "");
      }
    } catch (error) {
      console.error("Error fetching instructor profile:", error);
    }
  };

  const fetchPaymentLogs = async (id: string) => {
    try {
      const response = await fetch(`/api/payments/instructor/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPaymentLogs(data);
      }
    } catch (error) {
      console.error("Error fetching payment logs:", error);
    }
  };

  const fetchStudents = async (id: string) => {
    try {
      const response = await fetch(`/api/students?instructor_id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleApprovePayment = async (paymentId: string) => {
    try {
      const res = await fetch(`/api/payments/${paymentId}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        alert("Payment approved successfully!");
        setSelectedPaymentProof(null);
        if (instructorId) {
          fetchData(instructorId);
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to approve payment");
      }
    } catch (err) {
      console.error("Error approving payment:", err);
      alert("Error approving payment");
    }
  };

  const handleMarkPaidManual = async (studentId: string) => {
    try {
      const res = await fetch(`/api/students/${studentId}/mark-paid-manual`, {
        method: "POST",
      });
      if (res.ok) {
        alert("Student marked as paid successfully!");
        if (instructorId) {
          fetchData(instructorId);
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to mark student as paid");
      }
    } catch (err) {
      console.error("Error marking student as paid:", err);
      alert("Error marking student as paid");
    }
  };

  const handleUpdateQrCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructorId) return;

    try {
      const res = await fetch(`/api/instructors/${instructorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_qr: qrCodeInput }),
      });
      if (res.ok) {
        alert("Payment QR Code updated successfully!");
        fetchInstructorProfile(instructorId);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update QR Code");
      }
    } catch (err) {
      console.error("Error updating QR Code:", err);
      alert("Error updating QR Code");
    }
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setQrUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setQrCodeInput(data.url);
        alert("Image uploaded successfully!");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to upload image");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Error uploading image");
    } finally {
      setQrUploading(false);
    }
  };

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      });
      if (res.ok && instructorId) {
        fetchBookings(instructorId);
      }
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
      if (res.ok && instructorId) {
        fetchBookings(instructorId);
      }
    } catch (error) {
      console.error("Error rejecting booking:", error);
    }
  };

  const handleAddStudent = async (bookingId: string) => {
    const booking = bookings.find((b) => b._id === bookingId);
    if (!booking) return;

    if (!studentForm.email || !studentForm.father_name || !studentForm.gender || !studentForm.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: booking.student_name,
          email: studentForm.email,
          father_name: studentForm.father_name,
          age: booking.student_age,
          gender: studentForm.gender,
          class: booking.program,
          phone: booking.phone,
          password: studentForm.password,
          instructor_id: instructorId,
        }),
      });

      if (res.ok) {
        // Update booking status to enrolled
        await fetch(`/api/bookings/${bookingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "enrolled" }),
        });

        setShowAddStudentModal(null);
        setStudentForm({ email: "", father_name: "", gender: "", password: "" });
        if (instructorId) {
          await fetchData(instructorId);
        }
      } else {
        alert("Failed to add student. Please try again.");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Error adding student. Please try again.");
    }
  };

  const handleCreateStudentDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directStudentForm.name || !directStudentForm.email || !directStudentForm.father_name || !directStudentForm.age || !directStudentForm.gender || !directStudentForm.password) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...directStudentForm,
          age: parseInt(directStudentForm.age),
          monthly_due: parseFloat(directStudentForm.monthly_due) || 0,
          instructor_id: instructorId,
        }),
      });

      if (res.ok) {
        setShowAddStudentDirectModal(false);
        setDirectStudentForm({
          name: "",
          email: "",
          father_name: "",
          age: "",
          gender: "",
          class: "Regular Training",
          phone: "",
          password: "",
          monthly_due: ""
        });
        if (instructorId) {
          fetchStudents(instructorId);
        }
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to add student");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding student");
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      const res = await fetch(`/api/students/${editingStudent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingStudent.name,
          email: editingStudent.email,
          father_name: editingStudent.father_name,
          age: editingStudent.age,
          gender: editingStudent.gender,
          class: editingStudent.class,
          phone: editingStudent.phone,
          password: editingStudent.password,
          monthly_due: editingStudent.monthly_due,
        }),
      });

      if (res.ok) {
        setEditingStudent(null);
        if (instructorId) {
          fetchStudents(instructorId);
        }
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to update student");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating student");
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm("Are you sure you want to delete this student? Their access will be immediately terminated and revoked.")) return;

    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        if (instructorId) {
          fetchStudents(instructorId);
        }
      } else {
        alert("Failed to delete student");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting student");
    }
  };

  const handleMarkAttendance = async () => {
    if (selectedForAttendance.size === 0) {
      setAttendanceMessage({ type: "error", text: "Select at least one student" });
      return;
    }

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instructor_id: instructorId,
          date: attendanceDate,
          student_ids: Array.from(selectedForAttendance),
        }),
      });

      if (res.ok) {
        setAttendanceMessage({ type: "success", text: "Attendance marked successfully!" });
        setSelectedForAttendance(new Set());

        if (instructorId) {
          await fetchStudents(instructorId);
        }

        setTimeout(() => setAttendanceMessage(null), 2000);
      } else {
        setAttendanceMessage({ type: "error", text: "Error marking attendance" });
      }
    } catch (error) {
      setAttendanceMessage({ type: "error", text: "Error marking attendance" });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords don't match!" });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password must be at least 6 characters!" });
      return;
    }

    try {
      const response = await fetch("/api/instructor-change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instructor_id: instructorId,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        setPasswordMessage({ type: "success", text: "Password changed successfully!" });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setShowChangePassword(false), 1500);
      } else {
        setPasswordMessage({ type: "error", text: "Incorrect current password!" });
      }
    } catch (error) {
      setPasswordMessage({ type: "error", text: "Error changing password. Try again." });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const acceptedBookings = bookings.filter((b) => b.status === "accepted" || b.status === "enrolled");

  // Pagination logic
  const paginatePendingBookings = pendingBookings.slice((bookingsPage - 1) * itemsPerPage, bookingsPage * itemsPerPage);
  const paginateStudents = students.slice((studentsPage - 1) * itemsPerPage, studentsPage * itemsPerPage);
  const totalPendingPages = Math.ceil(pendingBookings.length / itemsPerPage);
  const totalStudentPages = Math.ceil(students.length / itemsPerPage);

  return (
    <div className="flex h-screen bg-slate-50 text-foreground font-sans overflow-hidden">
      {/* Light Mode Collapsible Sidebar (Matching Admin) */}
      <aside
        className={`${
          isSidebarCollapsed ? "w-20" : "w-64"
        } bg-white border-r border-slate-200 text-slate-800 flex flex-col transition-all duration-300 ease-in-out z-40`}
      >
        {/* Brand / Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 shrink-0 bg-white">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden truncate">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                I
              </div>
              <span className="font-extrabold text-sm tracking-wider uppercase truncate text-slate-800">Skybound Coach</span>
            </div>
          )}
          {isSidebarCollapsed && (
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm mx-auto shrink-0">
              I
            </div>
          )}
          
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors ml-auto cursor-pointer"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ExpandIcon /> : <CollapseIcon />}
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {[
            { id: "bookings", label: "Trial Booked", icon: <DashboardIcon /> },
            { id: "students", label: "Students List", icon: <StudentsIcon /> },
            { id: "attendance", label: "Mark Attendance", icon: <AttendanceIcon /> },
            { id: "payments", label: "Payment Logs", icon: <PaymentsIcon /> },
            { id: "settings", label: "Settings", icon: <SettingsIcon /> },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all border-l-4 ${
                  isActive
                    ? "bg-red-50 text-red-600 border-red-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent"
                } ${isSidebarCollapsed ? "justify-center" : ""}`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Bottom */}
        <div className="p-3 border-t border-slate-200 shrink-0">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all border-l-4 border-transparent ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
            title={isSidebarCollapsed ? "Logout" : undefined}
          >
            <span className="shrink-0">
              <LogoutIcon />
            </span>
            {!isSidebarCollapsed && <span className="truncate">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Custom Header (Matching Admin Header layout) */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 shrink-0 flex items-center justify-between px-6 shadow-xs">
          <div className="flex items-center gap-3">
            <img
              src="/logo_karate.jpg"
              alt="Dojo Logo"
              className="h-10 w-10 object-contain rounded-full border border-red-500/30 bg-card p-0.5"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div>
              <span className="text-base font-black tracking-wider bg-gradient-to-r from-foreground via-red-600 to-amber-500 bg-clip-text text-transparent uppercase">
                Okinawa Shotokon
              </span>
              <span className="block text-[8px] text-red-600 font-mono tracking-widest uppercase">
                Instructor Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted font-semibold hidden md:inline-block bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Instructor Mode
            </span>
            <button
              onClick={handleLogout}
              className="border border-red-600/35 hover:border-red-600 text-red-600 hover:bg-red-50 font-bold py-1.5 px-4 rounded-lg transition-all text-xs cursor-pointer"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-muted">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                Loading data...
              </div>
            </div>
          ) : (
            <>
              {/* TRIAL BOOKED TAB */}
              {activeTab === "bookings" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-2">Trial Class Bookings</h1>
                    <p className="text-slate-500 text-sm">Accept bookings and enroll new students</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Pending Bookings</p>
                      <p className="text-3xl font-black text-amber-500 mt-1">{pendingBookings.length}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Accepted Bookings</p>
                      <p className="text-3xl font-black text-emerald-600 mt-1">{acceptedBookings.length}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Enrolled Students</p>
                      <p className="text-3xl font-black text-red-500 mt-1">{students.length}</p>
                    </div>
                  </div>

                  {/* Pending Bookings Section */}
                  {pendingBookings.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-slate-800">Pending Bookings</h2>
                      <div className="grid grid-cols-1 gap-4">
                        {paginatePendingBookings.map((booking) => (
                          <div key={booking._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                              <div>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase">Student Name</p>
                                <p className="font-bold text-slate-800 text-sm">{booking.student_name}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase">Phone</p>
                                <p className="font-bold text-slate-800 text-sm">{booking.phone}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase">Age</p>
                                <p className="font-bold text-slate-800 text-sm">{booking.student_age} years</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase">Program</p>
                                <p className="font-bold text-slate-800 text-sm">{booking.program}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAcceptBooking(booking._id)}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleRejectBooking(booking._id)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPendingPages > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                          <button
                            onClick={() => setBookingsPage(Math.max(1, bookingsPage - 1))}
                            disabled={bookingsPage === 1}
                            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-50 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                          >
                            Previous
                          </button>
                          <span className="px-3 py-1.5 text-xs text-slate-600 font-semibold">
                            Page {bookingsPage} of {totalPendingPages}
                          </span>
                          <button
                            onClick={() => setBookingsPage(Math.min(totalPendingPages, bookingsPage + 1))}
                            disabled={bookingsPage === totalPendingPages}
                            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-50 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Accepted Bookings - Ready to Add */}
                  {acceptedBookings.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-slate-800">Accepted Trials - Ready to Enroll</h2>
                      <div className="grid grid-cols-1 gap-4">
                        {acceptedBookings.map((booking) => (
                          <div key={booking._id} className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <h3 className="font-bold text-slate-800 text-sm">{booking.student_name}</h3>
                              <p className="text-xs text-slate-500 mt-1">
                                {booking.phone} • {booking.student_age} years • {booking.program}
                              </p>
                            </div>
                            {booking.status === "enrolled" ? (
                              <span className="px-3 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-black uppercase tracking-wider">
                                Trial Enrolled
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  setShowAddStudentModal(booking._id);
                                  setStudentForm({ email: "", father_name: "", gender: "", password: "" });
                                }}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                              >
                                Enroll Student
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add Student Popup Modal */}
                  {showAddStudentModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 md:p-8 space-y-6">
                        <div>
                          <h2 className="text-xl font-bold text-slate-800">Enroll Student Details</h2>
                          <p className="text-xs text-slate-400 mt-1">
                            For trial candidate: {bookings.find(b => b._id === showAddStudentModal)?.student_name}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <InputField
                            label="Email Address"
                            type="email"
                            value={studentForm.email}
                            onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                            placeholder="student@example.com"
                            required
                          />
                          <InputField
                            label="Father's Name"
                            type="text"
                            value={studentForm.father_name}
                            onChange={(e) => setStudentForm({ ...studentForm, father_name: e.target.value })}
                            placeholder="Enter father name"
                            required
                          />
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
                            <select
                              value={studentForm.gender}
                              onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-slate-800 text-sm outline-none transition-all"
                            >
                              <option value="">Select gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Login Password</label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={studentForm.password}
                                onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                                placeholder="Set login password"
                                className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-slate-800 text-sm outline-none transition-all pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-slate-100 justify-end">
                          <button
                            onClick={() => setShowAddStudentModal(null)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAddStudent(showAddStudentModal)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                          >
                            Create Student
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {pendingBookings.length === 0 && acceptedBookings.length === 0 && (
                    <div className="text-center py-12 bg-white border border-slate-200 rounded-xl text-slate-400 text-sm shadow-xs">
                      No active class bookings to show.
                    </div>
                  )}
                </div>
              )}

              {/* STUDENTS TAB */}
              {activeTab === "students" && (
                <div className="space-y-6">
                  {/* Top bar with add and view toggles */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h1 className="text-3xl font-black text-slate-800 mb-2">Your Enrolled Students</h1>
                      <p className="text-slate-500 text-sm">View details and attendance logs of all active students</p>
                    </div>

                    <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
                      {/* View Mode Toggle Buttons */}
                      <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                        <button
                          onClick={() => setViewMode("card")}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                            viewMode === "card"
                              ? "bg-white text-slate-800 shadow-xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Card View
                        </button>
                        <button
                          onClick={() => setViewMode("list")}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                            viewMode === "list"
                              ? "bg-white text-slate-800 shadow-xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          List View
                        </button>
                      </div>

                      {/* Direct Add Button */}
                      <button
                        onClick={() => {
                          setShowAddStudentDirectModal(true);
                          setDirectStudentForm({
                            name: "",
                            email: "",
                            father_name: "",
                            age: "",
                            gender: "",
                            class: "Regular Training",
                            phone: "",
                            password: "",
                            monthly_due: ""
                          });
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Add Student</span>
                      </button>
                    </div>
                  </div>

                  {students.length > 0 ? (
                    <div className="space-y-6">
                      {/* Card View */}
                      {viewMode === "card" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {paginateStudents.map((student) => (
                            <div key={student._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                              <div>
                                <h3 className="font-bold text-slate-800 text-base mb-3 border-b border-slate-100 pb-2">{student.name}</h3>
                                <div className="space-y-2 text-xs text-slate-500 font-medium">
                                  <p><span className="text-slate-400">Email:</span> {student.email}</p>
                                  {student.phone && <p><span className="text-slate-400">Phone:</span> {student.phone}</p>}
                                  <p><span className="text-slate-400">Father:</span> {student.father_name}</p>
                                  <p><span className="text-slate-400">Age / Gender:</span> {student.age}y • {student.gender}</p>
                                  <p><span className="text-slate-400">Program:</span> {student.class}</p>
                                  <div className="pt-2 border-t border-slate-100 mt-2 space-y-1">
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Monthly Due:</span>
                                      <span className="font-bold text-slate-800">₹{student.monthly_due || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-slate-400">Payment Status:</span>
                                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                        student.payment_status === "paid"
                                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                          : student.payment_status === "pending"
                                          ? "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                                          : "bg-rose-50 text-rose-700 border border-rose-200"
                                      }`}>
                                        {student.payment_status || "unpaid"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-3">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-slate-400">Classes Attended:</span>
                                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                    {student.attendance}
                                  </span>
                                </div>
                                <div className="flex gap-2 justify-end pt-1 flex-wrap">
                                  {student.payment_status === "pending" && (
                                    <button
                                      onClick={() => {
                                        const proof = paymentLogs.find(p => p.student_id === student._id && p.status === "pending");
                                        if (proof) {
                                          setSelectedPaymentProof(proof);
                                        } else {
                                          alert("No pending proof found in logs");
                                        }
                                      }}
                                      className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[10px] transition cursor-pointer"
                                    >
                                      View Proof
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleMarkPaidManual(student._id)}
                                    disabled={student.payment_status === "paid"}
                                    className={`px-2.5 py-1.5 font-bold rounded-lg text-[10px] transition cursor-pointer ${
                                      student.payment_status === "paid"
                                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                                    }`}
                                  >
                                    {student.payment_status === "paid" ? "Paid ✓" : "Mark Paid"}
                                  </button>
                                  <button
                                    onClick={() => setEditingStudent(student)}
                                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px] transition cursor-pointer"
                                  >
                                    Edit Details
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStudent(student._id)}
                                    className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-[10px] transition cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* List View (Table Mode) */}
                      {viewMode === "list" && (
                        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                                <th className="px-6 py-4">Student Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Program / Class</th>
                                <th className="px-6 py-4">Monthly Due</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Attendance</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                              {paginateStudents.map((student) => (
                                <tr key={student._id} className="hover:bg-slate-50/50">
                                  <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                                  <td className="px-6 py-4 text-slate-500">{student.email}</td>
                                  <td className="px-6 py-4">{student.class}</td>
                                  <td className="px-6 py-4 font-bold text-slate-800">₹{student.monthly_due || 0}</td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                      student.payment_status === "paid"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : student.payment_status === "pending"
                                        ? "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                                        : "bg-rose-50 text-rose-700 border border-rose-200"
                                    }`}>
                                      {student.payment_status || "unpaid"}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                      {student.attendance}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex gap-2 justify-end items-center flex-wrap">
                                      {student.payment_status === "pending" && (
                                        <button
                                          onClick={() => {
                                            const proof = paymentLogs.find(p => p.student_id === student._id && p.status === "pending");
                                            if (proof) {
                                              setSelectedPaymentProof(proof);
                                            } else {
                                              alert("No pending proof found in logs");
                                            }
                                          }}
                                          className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded text-[10px] transition cursor-pointer"
                                        >
                                          Proof
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleMarkPaidManual(student._id)}
                                        disabled={student.payment_status === "paid"}
                                        className={`px-2 py-1 font-bold rounded text-[10px] transition cursor-pointer ${
                                          student.payment_status === "paid"
                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                                        }`}
                                      >
                                        {student.payment_status === "paid" ? "Paid ✓" : "Mark Paid"}
                                      </button>
                                      <button
                                        onClick={() => setEditingStudent(student)}
                                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[10px] transition cursor-pointer"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteStudent(student._id)}
                                        className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded text-[10px] transition cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Pagination */}
                      {totalStudentPages > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                          <button
                            onClick={() => setStudentsPage(Math.max(1, studentsPage - 1))}
                            disabled={studentsPage === 1}
                            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-50 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                          >
                            Previous
                          </button>
                          <span className="px-3 py-1.5 text-xs text-slate-600 font-semibold">
                            Page {studentsPage} of {totalStudentPages}
                          </span>
                          <button
                            onClick={() => setStudentsPage(Math.min(totalStudentPages, studentsPage + 1))}
                            disabled={studentsPage === totalStudentPages}
                            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-50 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white border border-slate-200 rounded-xl text-slate-400 text-sm shadow-xs">
                      No students registered under your account yet.
                    </div>
                  )}
                </div>
              )}

              {/* PAYMENTS LOG TAB */}
              {activeTab === "payments" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-2">Dojo Billing & Payment History</h1>
                    <p className="text-slate-500 text-sm">Review student fees submission proofs and transaction records</p>
                  </div>

                  {/* Payment Logs History */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Student Payment Logs</h2>
                    </div>

                    {paymentLogs.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                              <th className="px-4 py-3">Student</th>
                              <th className="px-4 py-3">Month</th>
                              <th className="px-4 py-3">Amount</th>
                              <th className="px-4 py-3">Transaction ID</th>
                              <th className="px-4 py-3">Submitted Date</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3 text-right">Proof</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                            {paymentLogs.map((log) => (
                              <tr key={log._id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3">
                                  <div>
                                    <p className="font-bold text-slate-800">{log.student_name}</p>
                                    <p className="text-[10px] text-slate-400">{log.student_email}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-3">{log.month}</td>
                                <td className="px-4 py-3 font-bold text-slate-800">₹{log.amount}</td>
                                <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{log.transaction_id}</td>
                                <td className="px-4 py-3 text-slate-500">
                                  {log.submitted_at ? new Date(log.submitted_at).toLocaleString() : "-"}
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                    log.status === "paid"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                                  }`}>
                                    {log.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  {log.screenshot_url ? (
                                    <button
                                      onClick={() => setSelectedPaymentProof(log)}
                                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] transition cursor-pointer"
                                    >
                                      View Proof
                                    </button>
                                  ) : (
                                    <span className="text-slate-400 italic text-[10px]">No image</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-slate-400 text-xs py-4 text-center">No payment log history available yet.</p>
                    )}
                  </div>
                </div>
              )}

              {/* ATTENDANCE TAB */}
              {activeTab === "attendance" && (
                <div className="space-y-6">
                  {/* Attendance display and inputs */}
                  <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-2">Daily Attendance</h1>
                    <p className="text-slate-500 text-sm">Select date and mark student attendance</p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 max-w-2xl shadow-xs">
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Attendance Date (Read-only)</label>
                      <input
                        type="date"
                        value={attendanceDate}
                        disabled
                        className="px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-400 text-sm outline-none cursor-not-allowed w-full md:w-auto"
                      />
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">Attendance is strictly marked for the current day only.</p>
                    </div>

                    <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Students Present</h2>

                    {students.length > 0 ? (
                      <div className="space-y-2 mb-6 max-h-96 overflow-y-auto pr-2">
                        {students.map((student) => (
                          <label key={student._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition-all">
                            <input
                              type="checkbox"
                              checked={selectedForAttendance.has(student._id)}
                              onChange={(e) => {
                                const newSelected = new Set(selectedForAttendance);
                                if (e.target.checked) {
                                  newSelected.add(student._id);
                                } else {
                                  newSelected.delete(student._id);
                                }
                                setSelectedForAttendance(newSelected);
                              }}
                              className="w-4 h-4 rounded text-red-600 focus:ring-red-500/20 border-slate-300 cursor-pointer"
                            />
                            <div className="flex-1">
                              <p className="font-bold text-slate-800 text-sm">{student.name}</p>
                              <p className="text-[10px] text-slate-400 font-semibold uppercase">{student.class} • Present count: {student.attendance}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-center py-8 text-sm">No students enrolled to mark attendance</p>
                    )}

                    {attendanceMessage && (
                      <div
                        className={`p-3 rounded-lg text-sm mb-4 font-semibold ${
                          attendanceMessage.type === "success"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                      >
                        {attendanceMessage.text}
                      </div>
                    )}

                    <button
                      onClick={handleMarkAttendance}
                      disabled={students.length === 0}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all shadow-xs cursor-pointer text-sm"
                    >
                      Save Attendance Log
                    </button>
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === "settings" && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-2">Settings</h1>
                    <p className="text-slate-500 text-sm">Update your instructor credentials and password</p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Change Account Password</h2>

                    {!showChangePassword ? (
                      <button
                        onClick={() => setShowChangePassword(true)}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all shadow-xs cursor-pointer"
                      >
                        Change Password
                      </button>
                    ) : (
                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <InputField
                          label="Current Password"
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Enter current password"
                          required
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputField
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min. 6 characters"
                            required
                          />
                          <InputField
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                          />
                        </div>

                        {passwordMessage && (
                          <div
                            className={`p-3 rounded-lg text-sm font-semibold ${
                              passwordMessage.type === "success"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                          >
                            {passwordMessage.text}
                          </div>
                        )}

                        <div className="flex gap-3 pt-4 border-t border-slate-100 justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setShowChangePassword(false);
                              setOldPassword("");
                              setNewPassword("");
                              setConfirmPassword("");
                              setPasswordMessage(null);
                            }}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition shadow-xs cursor-pointer"
                          >
                            Update Password
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Payment QR Settings */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs mt-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-2 border-b border-slate-100 pb-2">Dojo Payments QR Code Settings</h2>
                    <p className="text-slate-500 text-xs mb-4">Set your payments QR code URL. Students will see this QR code in their billing dashboard to scan and pay.</p>

                    <form onSubmit={handleUpdateQrCode} className="space-y-4">
                      <InputField
                        label="Payment QR Code Image URL"
                        type="text"
                        value={qrCodeInput}
                        onChange={(e) => setQrCodeInput(e.target.value)}
                        placeholder="Paste image URL (e.g. https://example.com/qr.png)"
                      />

                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">Or Upload QR Code Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleQrUpload}
                          disabled={qrUploading}
                          className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                        />
                        {qrUploading && <p className="text-[10px] text-slate-400 mt-1 animate-pulse font-bold">Uploading file...</p>}
                      </div>

                      {qrCodeInput && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">QR Code Preview</p>
                          <img
                            src={qrCodeInput}
                            alt="Payment QR Code Preview"
                            className="max-w-[200px] h-auto border border-slate-300 rounded-lg shadow-sm bg-white"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition shadow-xs cursor-pointer"
                        >
                          Save QR Code
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* DIRECT ADD STUDENT MODAL */}
              {showAddStudentDirectModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 md:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Add New Student</h2>
                      <p className="text-xs text-slate-400 mt-1">Enroll a new student directly into the Academy database.</p>
                    </div>

                    <form onSubmit={handleCreateStudentDirect} className="space-y-4">
                      <InputField
                        label="Student's Full Name"
                        type="text"
                        value={directStudentForm.name}
                        onChange={(e) => setDirectStudentForm({ ...directStudentForm, name: e.target.value })}
                        placeholder="e.g. Puneeth Kumar"
                        required
                      />
                      <InputField
                        label="Email Address"
                        type="email"
                        value={directStudentForm.email}
                        onChange={(e) => setDirectStudentForm({ ...directStudentForm, email: e.target.value })}
                        placeholder="student@example.com"
                        required
                      />
                      <InputField
                        label="Father's Name"
                        type="text"
                        value={directStudentForm.father_name}
                        onChange={(e) => setDirectStudentForm({ ...directStudentForm, father_name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Age"
                          type="number"
                          value={directStudentForm.age}
                          onChange={(e) => setDirectStudentForm({ ...directStudentForm, age: e.target.value })}
                          placeholder="e.g. 12"
                          min="4"
                          required
                        />
                        <InputField
                          label="Contact Phone"
                          type="tel"
                          value={directStudentForm.phone}
                          onChange={(e) => setDirectStudentForm({ ...directStudentForm, phone: e.target.value })}
                          placeholder="e.g. +91 9999999999"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
                          <select
                            value={directStudentForm.gender}
                            onChange={(e) => setDirectStudentForm({ ...directStudentForm, gender: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-slate-800 text-sm outline-none transition-all"
                            required
                          >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Program / Class</label>
                          <select
                            value={directStudentForm.class}
                            onChange={(e) => setDirectStudentForm({ ...directStudentForm, class: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-slate-800 text-sm outline-none transition-all"
                          >
                            <option value="Regular Training">Regular Training</option>
                            <option value="Belt Grading">Belt Grading</option>
                            <option value="Tournament Training">Tournament Training</option>
                          </select>
                        </div>
                      </div>
                      <InputField
                        label="Monthly Fee Amount (₹)"
                        type="number"
                        value={directStudentForm.monthly_due}
                        onChange={(e) => setDirectStudentForm({ ...directStudentForm, monthly_due: e.target.value })}
                        placeholder="e.g. 1500"
                      />
                      <InputField
                        label="Login Password"
                        type="password"
                        value={directStudentForm.password}
                        onChange={(e) => setDirectStudentForm({ ...directStudentForm, password: e.target.value })}
                        placeholder="Create strong login password"
                        required
                      />

                      <div className="flex gap-3 pt-4 border-t border-slate-100 justify-end">
                        <button
                          type="button"
                          onClick={() => setShowAddStudentDirectModal(false)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          Add Student
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* EDIT STUDENT DETAILS MODAL */}
              {editingStudent && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 md:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Edit Student Details</h2>
                      <p className="text-xs text-slate-400 mt-1">Modify student details and credentials.</p>
                    </div>

                    <form onSubmit={handleUpdateStudent} className="space-y-4">
                      <InputField
                        label="Student's Full Name"
                        type="text"
                        value={editingStudent.name}
                        onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                        required
                      />
                      <InputField
                        label="Email Address"
                        type="email"
                        value={editingStudent.email}
                        onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                        required
                      />
                      <InputField
                        label="Father's Name"
                        type="text"
                        value={editingStudent.father_name || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, father_name: e.target.value })}
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Age"
                          type="number"
                          value={editingStudent.age}
                          onChange={(e) => setEditingStudent({ ...editingStudent, age: parseInt(e.target.value) || 0 })}
                          min="4"
                          required
                        />
                        <InputField
                          label="Contact Phone"
                          type="tel"
                          value={editingStudent.phone || ""}
                          onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
                          <select
                            value={editingStudent.gender}
                            onChange={(e) => setEditingStudent({ ...editingStudent, gender: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-slate-800 text-sm outline-none transition-all"
                            required
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Program / Class</label>
                          <select
                            value={editingStudent.class}
                            onChange={(e) => setEditingStudent({ ...editingStudent, class: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-slate-800 text-sm outline-none transition-all"
                          >
                            <option value="Regular Training">Regular Training</option>
                            <option value="Belt Grading">Belt Grading</option>
                            <option value="Tournament Training">Tournament Training</option>
                          </select>
                        </div>
                      </div>
                      <InputField
                        label="Monthly Fee Amount (₹)"
                        type="number"
                        value={editingStudent.monthly_due || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, monthly_due: parseFloat(e.target.value) || 0 })}
                        placeholder="e.g. 1500"
                      />
                      <InputField
                        label="Password (Leave blank to keep unchanged)"
                        type="password"
                        value={editingStudent.password || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, password: e.target.value })}
                        placeholder="Enter new password if changing"
                      />

                      <div className="flex gap-3 pt-4 border-t border-slate-100 justify-end">
                        <button
                          type="button"
                          onClick={() => setEditingStudent(null)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* PAYMENT PROOF MODAL */}
              {selectedPaymentProof && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 md:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
                    <div>
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-black text-slate-800">Verify Payment Proof</h2>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          selectedPaymentProof.status === "paid"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                        }`}>
                          {selectedPaymentProof.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Review the transaction proof uploaded by the student.</p>
                    </div>

                    <div className="space-y-3 text-xs text-slate-600">
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="font-bold text-slate-400">Student Name:</span>
                        <span className="font-bold text-slate-800">{selectedPaymentProof.student_name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="font-bold text-slate-400">Amount Paid:</span>
                        <span className="font-black text-slate-800 text-sm text-red-600">₹{selectedPaymentProof.amount}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="font-bold text-slate-400">Month:</span>
                        <span className="font-bold text-slate-800">{selectedPaymentProof.month}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="font-bold text-slate-400">Transaction ID:</span>
                        <span className="font-mono text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">{selectedPaymentProof.transaction_id}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="font-bold text-slate-400">Submitted Date:</span>
                        <span className="font-bold text-slate-800">
                          {selectedPaymentProof.submitted_at ? new Date(selectedPaymentProof.submitted_at).toLocaleString() : "-"}
                        </span>
                      </div>

                      {selectedPaymentProof.screenshot_url ? (
                        <div className="space-y-1 pt-2">
                          <span className="font-bold text-slate-400 block mb-1">Receipt Screenshot:</span>
                          <div className="relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center p-2">
                            <img
                              src={selectedPaymentProof.screenshot_url}
                              alt="Receipt screenshot"
                              className="max-w-full max-h-64 object-contain rounded-lg"
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-400 italic text-[11px] pt-2">No screenshot proof uploaded.</p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100 justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentProof(null)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition cursor-pointer"
                      >
                        Close
                      </button>
                      {selectedPaymentProof.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => handleApprovePayment(selectedPaymentProof._id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          Approve & Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
