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
  status: string;
  instructor_id: string;
  created_at: string;
}

interface Instructor {
  _id: string;
  name: string;
  email: string;
  rank: string;
  role?: string;
  location?: string;
  phone?: string;
  image_url?: string;
}

interface NewsItem {
  _id?: string;
  title: string;
  organizer: string;
  date: string;
  description: string;
  image_url?: string;
}

// Custom SVG Icons
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
  </svg>
);

const InstructorsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const AnnouncementsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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

function TextAreaField({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <textarea
        {...props}
        className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-slate-800 text-sm outline-none transition-all min-h-[100px]"
      />
    </div>
  );
}

export default function AdminDashboard() {
  const [adminId, setAdminId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const router = useRouter();

  // Instructor Form States
  const [showInstForm, setShowInstForm] = useState(false);
  const [editingInstId, setEditingInstId] = useState<string | null>(null);
  const [instName, setInstName] = useState("");
  const [instRank, setInstRank] = useState("");
  const [instRole, setInstRole] = useState("Instructor");
  const [instLocation, setInstLocation] = useState("");
  const [instPhone, setInstPhone] = useState("");
  const [instEmail, setInstEmail] = useState("");
  const [instImage, setInstImage] = useState("");
  const [instSubmitting, setInstSubmitting] = useState(false);

  // Announcement Form States
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsDescription, setNewsDescription] = useState("");
  const [newsOrganizer, setNewsOrganizer] = useState("Admin");
  const [newsDate, setNewsDate] = useState("");
  const [newsImage, setNewsImage] = useState("");
  const [newsSubmitting, setNewsSubmitting] = useState(false);

  // Admin Account Settings States
  const [adminUser, setAdminUser] = useState<any>(null);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPhoto, setAdminPhoto] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingAccount, setUpdatingAccount] = useState(false);

  useEffect(() => {
    // Check if user is logged in as admin
    const userId = localStorage.getItem("user_id");
    const userRole = localStorage.getItem("user_role");

    if (!userId || userRole !== "admin") {
      router.push("/login");
      return;
    }

    setAdminId(userId);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, instructorsRes, newsRes, usersRes] = await Promise.all([
        fetch("/api/bookings").catch(() => null),
        fetch("/api/instructors").catch(() => null),
        fetch("/api/news").catch(() => null),
        fetch("/api/users").catch(() => null),
      ]);

      if (bookingsRes?.ok) {
        setBookings(await bookingsRes.json());
      }
      if (instructorsRes?.ok) {
        setInstructors(await instructorsRes.json());
      }
      if (newsRes?.ok) {
        setNews(await newsRes.json());
      }
      if (usersRes?.ok) {
        const usersList = await usersRes.json();
        const loggedInId = localStorage.getItem("user_id");
        const currentUser = usersList.find((u: any) => u._id === loggedInId);
        if (currentUser) {
          setAdminUser(currentUser);
          setAdminUsername(currentUser.username || "");
          setAdminPhoto(currentUser.profile_photo || currentUser.photo_image_url || "");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_name");
    router.push("/login");
  };

  const handleUpdateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );
      } else {
        alert("Failed to update booking status.");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Error updating booking status.");
    }
  };

  // Instructor Handlers
  const resetInstForm = () => {
    setEditingInstId(null);
    setInstName("");
    setInstRank("");
    setInstRole("Instructor");
    setInstLocation("");
    setInstPhone("");
    setInstEmail("");
    setInstImage("");
  };

  const handleEditInstructor = (instructor: Instructor) => {
    setEditingInstId(instructor._id);
    setInstName(instructor.name);
    setInstRank(instructor.rank);
    setInstRole(instructor.role || "Instructor");
    setInstLocation(instructor.location || "");
    setInstPhone(instructor.phone || "");
    setInstEmail(instructor.email);
    setInstImage(instructor.image_url || "");
    setShowInstForm(true);
  };

  const handleSaveInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    setInstSubmitting(true);
    try {
      const payload = {
        name: instName,
        rank: instRank,
        role: instRole,
        location: instLocation,
        phone: instPhone,
        email: instEmail,
        image_url: instImage || undefined,
      };

      const url = editingInstId ? `/api/instructors/${editingInstId}` : "/api/instructors";
      const method = editingInstId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        if (editingInstId) {
          setInstructors((prev) => prev.map((i) => (i._id === editingInstId ? saved : i)));
        } else {
          setInstructors((prev) => [...prev, saved]);
        }
        setShowInstForm(false);
        resetInstForm();
      } else {
        alert("Failed to save instructor.");
      }
    } catch (error) {
      console.error("Error saving instructor:", error);
      alert("Error saving instructor.");
    } finally {
      setInstSubmitting(false);
    }
  };

  const handleDeleteInstructor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this instructor?")) return;
    try {
      const res = await fetch(`/api/instructors/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInstructors((prev) => prev.filter((i) => i._id !== id));
      } else {
        alert("Failed to delete instructor.");
      }
    } catch (error) {
      console.error("Error deleting instructor:", error);
      alert("Error deleting instructor.");
    }
  };

  // Announcement Handlers
  const resetNewsForm = () => {
    setNewsTitle("");
    setNewsDescription("");
    setNewsOrganizer("Admin");
    setNewsDate("");
    setNewsImage("");
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsSubmitting(true);
    try {
      const payload = {
        title: newsTitle,
        description: newsDescription,
        organizer: newsOrganizer || "Admin",
        date: newsDate || new Date().toISOString().split("T")[0],
        image_url: newsImage || undefined,
      };

      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        setNews((prev) => [saved, ...prev]);
        setShowNewsForm(false);
        resetNewsForm();
      } else {
        alert("Failed to save announcement.");
      }
    } catch (error) {
      console.error("Error saving announcement:", error);
      alert("Error saving announcement.");
    } finally {
      setNewsSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNews((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert("Failed to delete announcement.");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Error deleting announcement.");
    }
  };

  // Account Settings Handlers
  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setUpdatingAccount(true);
    try {
      const payload: any = {};
      if (adminUsername) payload.username = adminUsername;
      if (newPassword) payload.new_password = newPassword;
      if (adminPhoto) payload.profile_photo = adminPhoto;

      const token = localStorage.getItem("user_token");
      const res = await fetch("/api/update-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        alert("Account updated successfully!");
        setAdminUser(data.user);
        if (data.user.username) {
          setAdminUsername(data.user.username);
        }
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Failed to update account.");
      }
    } catch (error) {
      console.error("Error updating account:", error);
      alert("Error updating account.");
    } finally {
      setUpdatingAccount(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInstructorName = (instructorId: string) => {
    if (instructorId === "umapathi_master_class") return "Umapathi Master Class";
    const instructor = instructors.find((i) => i._id === instructorId);
    return instructor?.name || "Unknown";
  };

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const acceptedBookings = bookings.filter((b) => b.status === "accepted");

  return (
    <div className="flex h-screen bg-slate-50 text-foreground font-sans overflow-hidden">
      {/* Light Mode Collapsible Sidebar */}
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
                A
              </div>
              <span className="font-extrabold text-sm tracking-wider uppercase truncate text-slate-800">Skybound Admin</span>
            </div>
          )}
          {isSidebarCollapsed && (
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm mx-auto shrink-0">
              A
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
            { id: "bookings", label: "Bookings & Overview", icon: <DashboardIcon /> },
            { id: "instructors", label: "Instructor Settings", icon: <InstructorsIcon /> },
            { id: "announcements", label: "Announcements", icon: <AnnouncementsIcon /> },
            { id: "settings", label: "Account Settings", icon: <SettingsIcon /> },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
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
        {/* Custom Header */}
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
                Admin Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted font-semibold hidden md:inline-block bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Admin Mode
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
              {/* BOOKINGS TAB */}
              {activeTab === "bookings" && (
                <div className="space-y-12">
                  <div>
                    <h1 className="text-3xl font-black text-foreground mb-2">Admin Dashboard</h1>
                    <p className="text-muted text-sm">Manage all academy operations and bookings</p>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Bookings</p>
                      <p className="text-3xl font-black text-slate-800 mt-1">{bookings.length}</p>
                    </div>
                    <div className="bg-white border border-amber-500/20 rounded-xl p-5 shadow-xs">
                      <p className="text-amber-600 text-xs font-semibold uppercase tracking-wider">Pending</p>
                      <p className="text-3xl font-black text-amber-500 mt-1">{pendingBookings.length}</p>
                    </div>
                    <div className="bg-white border border-emerald-500/20 rounded-xl p-5 shadow-xs">
                      <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wider">Accepted</p>
                      <p className="text-3xl font-black text-emerald-600 mt-1">{acceptedBookings.length}</p>
                    </div>
                    <div className="bg-white border border-red-500/20 rounded-xl p-5 shadow-xs">
                      <p className="text-red-600 text-xs font-semibold uppercase tracking-wider">Instructors</p>
                      <p className="text-3xl font-black text-red-500 mt-1">{instructors.length}</p>
                    </div>
                  </div>

                  {/* All Bookings Table */}
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                      <h2 className="text-lg font-bold text-slate-800">Recent Bookings</h2>
                      <span className="text-xs font-semibold bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-500">
                        Total: {bookings.length}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50/50">
                            <th className="px-6 py-3 text-left font-bold text-slate-800">Student</th>
                            <th className="px-6 py-3 text-left font-bold text-slate-800">Instructor</th>
                            <th className="px-6 py-3 text-left font-bold text-slate-800">Phone</th>
                            <th className="px-6 py-3 text-left font-bold text-slate-800">Program</th>
                            <th className="px-6 py-3 text-left font-bold text-slate-800">Date</th>
                            <th className="px-6 py-3 text-left font-bold text-slate-800">Status</th>
                            <th className="px-6 py-3 text-center font-bold text-slate-800">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {bookings.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                                No bookings found.
                              </td>
                            </tr>
                          ) : (
                            bookings.map((booking) => (
                              <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-slate-800 font-semibold">
                                  {booking.student_name} ({booking.student_age}y)
                                </td>
                                <td className="px-6 py-4 text-slate-600">{getInstructorName(booking.instructor_id)}</td>
                                <td className="px-6 py-4 text-slate-600">{booking.phone}</td>
                                <td className="px-6 py-4 text-slate-600">{booking.program}</td>
                                <td className="px-6 py-4 text-slate-600">{booking.date}</td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                      booking.status === "pending"
                                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                                        : booking.status === "accepted"
                                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                        : "bg-red-100 text-red-800 border border-red-200"
                                    }`}
                                  >
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  {booking.status === "pending" ? (
                                    <div className="flex gap-2 justify-center">
                                      <button
                                        onClick={() => handleUpdateBookingStatus(booking._id, "accepted")}
                                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                                      >
                                        Accept
                                      </button>
                                      <button
                                        onClick={() => handleUpdateBookingStatus(booking._id, "rejected")}
                                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                                      >
                                        Reject
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-slate-400 font-medium">No actions</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* INSTRUCTORS TAB */}
              {activeTab === "instructors" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-3xl font-black text-slate-800 mb-2">Instructors</h1>
                      <p className="text-slate-500 text-sm">Add, update, and manage academy instructors</p>
                    </div>
                    <button
                      onClick={() => {
                        resetInstForm();
                        setShowInstForm(true);
                      }}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all text-sm shadow-md shadow-red-900/10 cursor-pointer"
                    >
                      + Add Instructor
                    </button>
                  </div>

                  {/* Instructor Modal Popup */}
                  {showInstForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                          <h2 className="text-xl font-bold text-slate-800">
                            {editingInstId ? "Edit Instructor Details" : "Create New Instructor"}
                          </h2>
                          <button
                            onClick={() => {
                              setShowInstForm(false);
                              resetInstForm();
                            }}
                            className="text-slate-400 hover:text-slate-700 text-2xl cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                        <form onSubmit={handleSaveInstructor} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                              label="Instructor Name"
                              value={instName}
                              onChange={(e) => setInstName(e.target.value)}
                              placeholder="e.g. Sensei John Doe"
                              required
                            />
                            <InputField
                              label="Rank / Belt"
                              value={instRank}
                              onChange={(e) => setInstRank(e.target.value)}
                              placeholder="e.g. Black Belt 3rd Dan"
                              required
                            />
                            <InputField
                              label="Role"
                              value={instRole}
                              onChange={(e) => setInstRole(e.target.value)}
                              placeholder="e.g. Head Coach / Assistant Instructor"
                              required
                            />
                            <InputField
                              label="Location"
                              value={instLocation}
                              onChange={(e) => setInstLocation(e.target.value)}
                              placeholder="e.g. Main Branch"
                              required
                            />
                            <InputField
                              label="Phone Number"
                              value={instPhone}
                              onChange={(e) => setInstPhone(e.target.value)}
                              placeholder="e.g. +91 98765 43210"
                              required
                            />
                            <InputField
                              label="Email Address"
                              type="email"
                              value={instEmail}
                              onChange={(e) => setInstEmail(e.target.value)}
                              placeholder="e.g. instructor@skybound.com"
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Instructor Photo
                            </label>
                            <div className="flex items-center gap-4">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePhotoUpload(e, setInstImage)}
                                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-pointer"
                              />
                              {instImage && (
                                <img
                                  src={instImage}
                                  alt="Preview"
                                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                                />
                              )}
                            </div>
                          </div>

                          <div className="flex gap-3 pt-6 border-t border-slate-100 justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setShowInstForm(false);
                                resetInstForm();
                              }}
                              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={instSubmitting}
                              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg text-sm shadow-xs cursor-pointer"
                            >
                              {instSubmitting ? "Saving..." : "Save Details"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Instructors Table List */}
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="px-6 py-3 text-left font-bold text-slate-800">Instructor</th>
                            <th className="px-6 py-3 text-left font-bold text-slate-800">Rank</th>
                            <th className="px-6 py-3 text-left font-bold text-slate-800">Role</th>
                            <th className="px-6 py-3 text-left font-bold text-slate-800">Email</th>
                            <th className="px-6 py-3 text-left font-bold text-slate-800">Phone</th>
                            <th className="px-6 py-3 text-left font-bold text-slate-800">Location</th>
                            <th className="px-6 py-3 text-center font-bold text-slate-800">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {instructors.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                                No instructors configured.
                              </td>
                            </tr>
                          ) : (
                            instructors.map((inst) => (
                              <tr key={inst._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={inst.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"}
                                      alt={inst.name}
                                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                      onError={(e) => {
                                        e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop";
                                      }}
                                    />
                                    <span className="font-semibold text-slate-800">{inst.name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{inst.rank}</td>
                                <td className="px-6 py-4 text-slate-600">{inst.role || "Instructor"}</td>
                                <td className="px-6 py-4 text-slate-600">{inst.email}</td>
                                <td className="px-6 py-4 text-slate-600">{inst.phone || "—"}</td>
                                <td className="px-6 py-4 text-slate-600">{inst.location || "—"}</td>
                                <td className="px-6 py-4 text-center">
                                  <div className="flex gap-2 justify-center">
                                    <button
                                      onClick={() => handleEditInstructor(inst)}
                                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded text-xs font-semibold transition cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteInstructor(inst._id)}
                                      className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-xs font-semibold transition cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ANNOUNCEMENTS TAB */}
              {activeTab === "announcements" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-3xl font-black text-slate-800 mb-2">Announcements</h1>
                      <p className="text-slate-500 text-sm">Post news, event updates, and notices for students</p>
                    </div>
                    <button
                      onClick={() => {
                        resetNewsForm();
                        setShowNewsForm(true);
                      }}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all text-sm shadow-md shadow-red-900/10 cursor-pointer"
                    >
                      + Create Announcement
                    </button>
                  </div>

                  {/* Announcement Modal Popup */}
                  {showNewsForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                          <h2 className="text-xl font-bold text-slate-800">
                            Compose New Announcement
                          </h2>
                          <button
                            onClick={() => {
                              setShowNewsForm(false);
                              resetNewsForm();
                            }}
                            className="text-slate-400 hover:text-slate-700 text-2xl cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                        <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                          <InputField
                            label="Announcement Title"
                            value={newsTitle}
                            onChange={(e) => setNewsTitle(e.target.value)}
                            placeholder="e.g. Belt Grading Test - June 2026"
                            required
                          />
                          <TextAreaField
                            label="Content Description"
                            value={newsDescription}
                            onChange={(e) => setNewsDescription(e.target.value)}
                            placeholder="Provide details about the event, timing, criteria..."
                            required
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                              label="Organizer / Authority"
                              value={newsOrganizer}
                              onChange={(e) => setNewsOrganizer(e.target.value)}
                              placeholder="e.g. Sensei / Dojo Admin"
                            />
                            <InputField
                              label="Publish Date"
                              type="date"
                              value={newsDate}
                              onChange={(e) => setNewsDate(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Cover Image (Optional)
                            </label>
                            <div className="flex items-center gap-4">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePhotoUpload(e, setNewsImage)}
                                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-pointer"
                              />
                              {newsImage && (
                                <img
                                  src={newsImage}
                                  alt="Preview"
                                  className="w-16 h-10 object-cover border border-slate-200 rounded"
                                />
                              )}
                            </div>
                          </div>

                          <div className="flex gap-3 pt-6 border-t border-slate-100 justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setShowNewsForm(false);
                                resetNewsForm();
                              }}
                              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={newsSubmitting}
                              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg text-sm shadow-xs cursor-pointer"
                            >
                              {newsSubmitting ? "Publishing..." : "Publish Now"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Announcement List cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.length === 0 ? (
                      <div className="col-span-full text-center py-12 bg-white border border-slate-200 rounded-xl text-slate-400 text-sm">
                        No announcements posted yet.
                      </div>
                    ) : (
                      news.map((item) => (
                        <div key={item._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
                          <div>
                            <img
                              src={item.image_url || "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop"}
                              alt={item.title}
                              className="w-full h-40 object-cover border-b border-slate-200"
                              onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop";
                              }}
                            />
                            <div className="p-5 space-y-2.5">
                              <h3 className="font-bold text-slate-800 line-clamp-2">{item.title}</h3>
                              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                                {item.date} • {item.organizer}
                              </p>
                              <p className="text-xs text-slate-500 line-clamp-3">{item.description}</p>
                            </div>
                          </div>
                          <div className="p-5 pt-0 border-t border-slate-100 flex justify-end">
                            <button
                              onClick={() => handleDeleteAnnouncement(item._id || "")}
                              className="px-3 py-1.5 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg cursor-pointer transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ACCOUNT SETTINGS TAB */}
              {activeTab === "settings" && (
                <div className="space-y-6 max-w-3xl animate-fade-in">
                  <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-2">Account Settings</h1>
                    <p className="text-slate-500 text-sm">Update your administrative credentials and profile photo</p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs">
                    <form onSubmit={handleUpdateAccount} className="space-y-6">
                      
                      {/* Profile Photo Upload Section */}
                      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                        <div className="relative group">
                          <img
                            src={adminPhoto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"}
                            alt="Admin Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-slate-100"
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop";
                            }}
                          />
                          <label className="absolute inset-0 flex items-center justify-center bg-slate-900/60 text-white text-[10px] font-bold rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                            Change Photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handlePhotoUpload(e, setAdminPhoto)}
                            />
                          </label>
                        </div>
                        <div className="text-center sm:text-left space-y-1">
                          <h3 className="font-bold text-slate-800 text-lg">{adminUser?.username || "Admin"}</h3>
                          <p className="text-xs text-slate-400 font-semibold">{adminUser?.email || "admin@skybound.com"}</p>
                          <span className="inline-block px-2.5 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {adminUser?.role || "System Admin"}
                          </span>
                        </div>
                      </div>

                      {/* General Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                          label="Username"
                          value={adminUsername}
                          onChange={(e) => setAdminUsername(e.target.value)}
                          placeholder="admin123"
                          required
                        />
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-slate-400 mb-2">Email Address (Read-only)</label>
                          <input
                            type="text"
                            value={adminUser?.email || ""}
                            disabled
                            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 text-sm outline-none cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {/* Password Fields */}
                      <div className="pt-6 border-t border-slate-100 space-y-4">
                        <h3 className="font-bold text-slate-800 text-base">Change Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InputField
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min. 6 characters"
                          />
                          <InputField
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                          />
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button
                          type="submit"
                          disabled={updatingAccount}
                          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg text-sm shadow-md shadow-red-900/10 transition-all cursor-pointer"
                        >
                          {updatingAccount ? "Saving Changes..." : "Save Settings"}
                        </button>
                      </div>

                    </form>
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
