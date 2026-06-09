"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

interface Booking {
  _id: string;
  student_name: string;
  student_age: number;
  phone: string;
  program: string;
  date: string;
  status: "pending" | "accepted" | "rejected";
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
}

export default function InstructorDashboard() {
  const [instructorId, setInstructorId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"bookings" | "students" | "attendance" | "settings">("bookings");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState({ email: "", father_name: "", gender: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedForAttendance, setSelectedForAttendance] = useState<Set<string>>(new Set());
  const [attendanceMessage, setAttendanceMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [studentsPage, setStudentsPage] = useState(1);
  const [attendancePage, setAttendancePage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

  useEffect(() => {
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
    await Promise.all([fetchBookings(id), fetchStudents(id)]);
  };

  const fetchBookings = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings?instructor_id=${id}`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students?instructor_id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      });
      // Show form to add student details
      setExpandedBooking(bookingId);
      if (instructorId) fetchBookings(instructorId);
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
      if (instructorId) fetchBookings(instructorId);
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
      await fetch("http://localhost:5000/api/students", {
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

      setShowAddStudentModal(null);
      setStudentForm({ email: "", father_name: "", gender: "", password: "" });
      if (instructorId) {
        await fetchData(instructorId);
      }
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Error adding student. Please try again.");
    }
  };

  const handleMarkAttendance = async () => {
    if (selectedForAttendance.size === 0) {
      setAttendanceMessage({ type: "error", text: "Select at least one student" });
      return;
    }

    try {
      await fetch("http://localhost:5000/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instructor_id: instructorId,
          date: attendanceDate,
          student_ids: Array.from(selectedForAttendance),
        }),
      });

      setAttendanceMessage({ type: "success", text: "Attendance marked successfully!" });
      setSelectedForAttendance(new Set());

      // Real-time update
      if (instructorId) {
        await fetchStudents(instructorId);
      }

      setTimeout(() => setAttendanceMessage(null), 2000);
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
      const response = await fetch("http://localhost:5000/api/instructor-change-password", {
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

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const acceptedBookings = bookings.filter((b) => b.status === "accepted");

  // Pagination logic
  const paginatePendingBookings = pendingBookings.slice((bookingsPage - 1) * itemsPerPage, bookingsPage * itemsPerPage);
  const paginateStudents = students.slice((studentsPage - 1) * itemsPerPage, studentsPage * itemsPerPage);
  const paginateAttendance = selectedForAttendance.size > 0 ? Array.from(selectedForAttendance) : [];
  const totalPendingPages = Math.ceil(pendingBookings.length / itemsPerPage);
  const totalStudentPages = Math.ceil(students.length / itemsPerPage);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex flex-col md:flex-row">
        {/* SIDEBAR */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } bg-card border-r border-border transition-all duration-300 flex flex-col`}
        >
          <div className="p-4 border-b border-border flex justify-between items-center">
            {sidebarOpen && <h3 className="font-black text-foreground text-sm">Menu</h3>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-background rounded-lg transition-all"
              title={sidebarOpen ? "Collapse" : "Expand"}
            >
              {sidebarOpen ? "←" : "→"}
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "bookings"
                  ? "bg-red-600 text-white"
                  : "text-foreground hover:bg-background"
              }`}
              title="Trial Booked"
            >
              <span className="text-lg">📅</span>
              {sidebarOpen && <span className="font-semibold text-sm">Trial Booked</span>}
            </button>

            <button
              onClick={() => setActiveTab("students")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "students"
                  ? "bg-red-600 text-white"
                  : "text-foreground hover:bg-background"
              }`}
              title="Students"
            >
              <span className="text-lg">👥</span>
              {sidebarOpen && <span className="font-semibold text-sm">Students</span>}
            </button>

            <button
              onClick={() => setActiveTab("attendance")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "attendance"
                  ? "bg-red-600 text-white"
                  : "text-foreground hover:bg-background"
              }`}
              title="Attendance"
            >
              <span className="text-lg">✓</span>
              {sidebarOpen && <span className="font-semibold text-sm">Attendance</span>}
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "settings"
                  ? "bg-red-600 text-white"
                  : "text-foreground hover:bg-background"
              }`}
              title="Settings"
            >
              <span className="text-lg">⚙️</span>
              {sidebarOpen && <span className="font-semibold text-sm">Settings</span>}
            </button>
          </nav>

          <div className="p-4 border-t border-border">
            <button
              onClick={() => {
                localStorage.clear();
                router.push("/login");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-950/20 transition-all"
              title="Logout"
            >
              <span className="text-lg">🚪</span>
              {sidebarOpen && <span className="font-semibold text-sm">Logout</span>}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto">
          {loading ? (
            <div className="text-center text-muted">Loading...</div>
          ) : (
            <>
              {/* TRIAL BOOKED TAB */}
              {activeTab === "bookings" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-black text-foreground mb-2">Trial Class Bookings</h1>
                    <p className="text-muted">Accept bookings and add student details</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card border border-amber-500/30 rounded-xl p-6">
                      <p className="text-muted text-sm">Pending</p>
                      <p className="text-3xl font-black text-amber-500">{pendingBookings.length}</p>
                    </div>
                    <div className="bg-card border border-emerald-500/30 rounded-xl p-6">
                      <p className="text-muted text-sm">Accepted</p>
                      <p className="text-3xl font-black text-emerald-500">{acceptedBookings.length}</p>
                    </div>
                    <div className="bg-card border border-blue-500/30 rounded-xl p-6">
                      <p className="text-muted text-sm">Total Students</p>
                      <p className="text-3xl font-black text-blue-500">{students.length}</p>
                    </div>
                  </div>

                  {/* Pending Bookings */}
                  {pendingBookings.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">Pending Bookings</h2>
                      <div className="space-y-4">
                        {paginatePendingBookings.map((booking) => (
                          <div key={booking._id} className="bg-card border border-border rounded-xl p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                                <div>
                                  <p className="text-xs text-muted uppercase">Student Name</p>
                                  <p className="text-lg font-bold text-foreground">{booking.student_name}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted uppercase">Phone</p>
                                  <p className="text-lg font-bold text-foreground">{booking.phone}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted uppercase">Age</p>
                                  <p className="text-lg font-bold text-foreground">{booking.student_age}y</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted uppercase">Program</p>
                                  <p className="text-lg font-bold text-foreground">{booking.program}</p>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleAcceptBooking(booking._id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition-all whitespace-nowrap"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleRejectBooking(booking._id)}
                                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all whitespace-nowrap"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination Controls */}
                      {totalPendingPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                          <button
                            onClick={() => setBookingsPage(Math.max(1, bookingsPage - 1))}
                            disabled={bookingsPage === 1}
                            className="px-4 py-2 rounded-lg bg-card border border-border disabled:opacity-50 hover:bg-background transition-all"
                          >
                            Previous
                          </button>
                          <span className="px-4 py-2 text-foreground">
                            Page {bookingsPage} of {totalPendingPages}
                          </span>
                          <button
                            onClick={() => setBookingsPage(Math.min(totalPendingPages, bookingsPage + 1))}
                            disabled={bookingsPage === totalPendingPages}
                            className="px-4 py-2 rounded-lg bg-card border border-border disabled:opacity-50 hover:bg-background transition-all"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Accepted Bookings - Add Student Button */}
                  {acceptedBookings.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">Accepted - Ready to Add</h2>
                      <div className="space-y-4">
                        {acceptedBookings.map((booking) => (
                          <div key={booking._id} className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <h3 className="font-bold text-foreground text-lg">{booking.student_name}</h3>
                              <p className="text-sm text-muted">{booking.phone} • {booking.student_age} years • {booking.program}</p>
                            </div>
                            <button
                              onClick={() => {
                                setShowAddStudentModal(booking._id);
                                setStudentForm({ email: "", father_name: "", gender: "", password: "" });
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-8 rounded-lg transition-all whitespace-nowrap"
                            >
                              Add Student
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Modal Popup */}
                  {showAddStudentModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                      <div className="bg-card rounded-xl max-w-md w-full p-8 space-y-6">
                        <div>
                          <h2 className="text-2xl font-black text-foreground mb-2">Add Student Details</h2>
                          <p className="text-sm text-muted">{bookings.find(b => b._id === showAddStudentModal)?.student_name}</p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                            <input
                              type="email"
                              value={studentForm.email}
                              onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                              placeholder="student@example.com"
                              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-red-500 text-foreground outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Father Name</label>
                            <input
                              type="text"
                              value={studentForm.father_name}
                              onChange={(e) => setStudentForm({ ...studentForm, father_name: e.target.value })}
                              placeholder="Enter father name"
                              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-red-500 text-foreground outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Gender</label>
                            <select
                              value={studentForm.gender}
                              onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-red-500 text-foreground outline-none"
                            >
                              <option value="">Select gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={studentForm.password}
                                onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                                placeholder="Set login password"
                                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-red-500 text-foreground outline-none pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                                title={showPassword ? "Hide" : "Show"}
                              >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleAddStudent(showAddStudentModal)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition-all"
                          >
                            Add Student
                          </button>
                          <button
                            onClick={() => setShowAddStudentModal(null)}
                            className="flex-1 bg-background border border-border text-foreground font-bold py-2 rounded-lg transition-all hover:bg-border"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {pendingBookings.length === 0 && acceptedBookings.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted text-lg">No bookings</p>
                    </div>
                  )}
                </div>
              )}

              {/* STUDENTS TAB */}
              {activeTab === "students" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-black text-foreground mb-2">Your Students</h1>
                    <p className="text-muted">View all enrolled students</p>
                  </div>

                  {students.length > 0 ? (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginateStudents.map((student) => (
                        <div key={student._id} className="bg-card border border-border rounded-xl p-6">
                          <h3 className="font-bold text-foreground mb-3">{student.name}</h3>
                          <div className="space-y-2 text-sm text-muted">
                            <p>Email: {student.email}</p>
                            <p>Father: {student.father_name}</p>
                            <p>Age: {student.age} years</p>
                            <p>Gender: {student.gender}</p>
                            <p>Class: {student.class}</p>
                            <p className="pt-2 border-t border-border">Attendance: <span className="font-bold text-foreground">{student.attendance}</span></p>
                          </div>
                        </div>
                      ))}
                      </div>

                      {/* Pagination Controls */}
                      {totalStudentPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                          <button
                            onClick={() => setStudentsPage(Math.max(1, studentsPage - 1))}
                            disabled={studentsPage === 1}
                            className="px-4 py-2 rounded-lg bg-card border border-border disabled:opacity-50 hover:bg-background transition-all"
                          >
                            Previous
                          </button>
                          <span className="px-4 py-2 text-foreground">
                            Page {studentsPage} of {totalStudentPages}
                          </span>
                          <button
                            onClick={() => setStudentsPage(Math.min(totalStudentPages, studentsPage + 1))}
                            disabled={studentsPage === totalStudentPages}
                            className="px-4 py-2 rounded-lg bg-card border border-border disabled:opacity-50 hover:bg-background transition-all"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-card border border-border rounded-xl">
                      <p className="text-muted text-lg">No students yet</p>
                    </div>
                  )}
                </div>
              )}

              {/* ATTENDANCE TAB */}
              {activeTab === "attendance" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-black text-foreground mb-2">Mark Attendance</h1>
                    <p className="text-muted">Record student attendance for the day</p>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-foreground mb-2">Select Date</label>
                      <input
                        type="date"
                        value={attendanceDate}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-background border border-border focus:border-red-500 text-foreground outline-none"
                      />
                    </div>

                    <h2 className="text-xl font-bold text-foreground mb-4">Select Students Present</h2>

                    {students.length > 0 ? (
                      <div>
                        <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                          {students.map((student) => (
                          <label key={student._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-background cursor-pointer transition-all">
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
                              className="w-5 h-5 rounded cursor-pointer"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">{student.name}</p>
                              <p className="text-xs text-muted">Attended: {student.attendance}</p>
                            </div>
                          </label>
                        ))}
                        </div>
                        <p className="text-xs text-muted text-center mt-2">{students.length} student(s)</p>
                      </div>
                    ) : (
                      <p className="text-muted text-center py-8">No students enrolled yet</p>
                    )}

                    {attendanceMessage && (
                      <div
                        className={`p-3 rounded-lg text-sm mb-4 ${
                          attendanceMessage.type === "success"
                            ? "bg-emerald-950/30 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-950/30 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {attendanceMessage.text}
                      </div>
                    )}

                    <button
                      onClick={handleMarkAttendance}
                      disabled={students.length === 0}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all"
                    >
                      Mark Attendance
                    </button>
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === "settings" && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h1 className="text-3xl font-black text-foreground mb-2">Settings</h1>
                    <p className="text-muted">Manage your account settings</p>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-bold text-foreground mb-4">Change Password</h2>

                    {!showChangePassword ? (
                      <button
                        onClick={() => setShowChangePassword(true)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all"
                      >
                        Change Password
                      </button>
                    ) : (
                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-red-500 text-foreground outline-none"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-red-500 text-foreground outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-red-500 text-foreground outline-none"
                              required
                            />
                          </div>
                        </div>

                        {passwordMessage && (
                          <div
                            className={`p-3 rounded-lg text-sm ${
                              passwordMessage.type === "success"
                                ? "bg-emerald-950/30 text-emerald-400 border border-emerald-500/30"
                                : "bg-red-950/30 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {passwordMessage.text}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-all"
                          >
                            Update Password
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowChangePassword(false);
                              setOldPassword("");
                              setNewPassword("");
                              setConfirmPassword("");
                              setPasswordMessage(null);
                            }}
                            className="bg-background border border-border text-foreground font-bold py-2 rounded-lg transition-all hover:bg-border"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
