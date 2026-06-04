"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Affiliation {
  name: string;
}

interface DojoInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  map_embed: string;
  affiliations: Affiliation[];
}

interface Instructor {
  _id?: string;
  name: string;
  rank: string;
  role: string;
  location: string;
  phone: string;
  email: string;
  image_url: string;
}

interface NewsItem {
  _id?: string;
  title: string;
  organizer: string;
  date: string;
  description: string;
  image_url: string;
}

interface Booking {
  _id: string;
  student_name: string;
  student_age: number;
  phone: string;
  program: string;
  date: string;
  status: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [dojoInfo, setDojoInfo] = useState<DojoInfo | null>(null);
  const [supportingInstructors, setSupportingInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States for adding Instructor
  const [instName, setInstName] = useState("");
  const [instRank, setInstRank] = useState("");
  const [instRole, setInstRole] = useState("Instructor");
  const [instLocation, setInstLocation] = useState("");
  const [instPhone, setInstPhone] = useState("");
  const [instEmail, setInstEmail] = useState("");
  const [instImage, setInstImage] = useState("");
  const [instSubmitting, setInstSubmitting] = useState(false);

  // Form States for adding Supporting Instructor
  const [suppName, setSuppName] = useState("");
  const [suppRank, setSuppRank] = useState("");
  const [suppRole, setSuppRole] = useState("Supporting Instructor");
  const [suppLocation, setSuppLocation] = useState("");
  const [suppPhone, setSuppPhone] = useState("");
  const [suppEmail, setSuppEmail] = useState("");
  const [suppImage, setSuppImage] = useState("");
  const [suppSubmitting, setSuppSubmitting] = useState(false);

  // Form States for adding News
  const [newsTitle, setNewsTitle] = useState("");
  const [newsOrganizer, setNewsOrganizer] = useState("");
  const [newsDate, setNewsDate] = useState("");
  const [newsDesc, setNewsDesc] = useState("");
  const [newsImage, setNewsImage] = useState("");
  const [newsSubmitting, setNewsSubmitting] = useState(false);

  // Form States for Dojo settings
  const [dojoName, setDojoName] = useState("");
  const [dojoPhone, setDojoPhone] = useState("");
  const [dojoEmail, setDojoEmail] = useState("");
  const [dojoAddress, setDojoAddress] = useState("");
  const [dojoMapEmbed, setDojoMapEmbed] = useState("");
  const [settingsSubmitting, setSettingsSubmitting] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Password Verification (simple hardcoded demo password: admin123)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin123") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect passcode. Try 'admin123'");
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, instRes, newsRes, infoRes, suppRes] = await Promise.all([
        fetch("/api/bookings").catch(() => null),
        fetch("/api/instructors").catch(() => null),
        fetch("/api/news").catch(() => null),
        fetch("/api/dojo-info").catch(() => null),
        fetch("/api/supporting-instructors").catch(() => null)
      ]);

      if (bookingsRes && bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);
      }

      if (instRes && instRes.ok) {
        const instData = await instRes.json();
        setInstructors(instData);
      }

      if (newsRes && newsRes.ok) {
        const newsData = await newsRes.json();
        setNews(newsData);
      }

      if (infoRes && infoRes.ok) {
        const infoData = await infoRes.json();
        setDojoInfo(infoData);
        // Pre-fill settings form
        setDojoName(infoData.name);
        setDojoPhone(infoData.phone);
        setDojoEmail(infoData.email);
        setDojoAddress(infoData.address);
        setDojoMapEmbed(infoData.map_embed);
      }

      if (suppRes && suppRes.ok) {
        const suppData = await suppRes.json();
        setSupportingInstructors(suppData);
      }
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        loadData();
      }, 0);
    }
  }, [isAuthenticated]);

  // Handle Booking Status update
  const handleUpdateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );
      } else {
        alert("Failed to update booking status.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Instructor
  const handleAddInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instName || !instRank) return;

    try {
      setInstSubmitting(true);
      const res = await fetch("/api/instructors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: instName,
          rank: instRank,
          role: instRole,
          location: instLocation,
          phone: instPhone,
          email: instEmail,
          image_url: instImage || undefined,
        }),
      });

      if (res.ok) {
        const newInst = await res.json();
        setInstructors((prev) => [...prev, newInst]);
        // Reset form
        setInstName("");
        setInstRank("");
        setInstRole("Instructor");
        setInstLocation("");
        setInstPhone("");
        setInstEmail("");
        setInstImage("");
      } else {
        alert("Failed to add instructor.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInstSubmitting(false);
    }
  };

  // Delete Instructor
  const handleDeleteInstructor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this instructor?")) return;

    try {
      const res = await fetch(`/api/instructors/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInstructors((prev) => prev.filter((i) => i._id !== id));
      } else {
        alert("Failed to delete instructor.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Supporting Instructor
  const handleAddSupportingInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suppName || !suppRank) return;

    try {
      setSuppSubmitting(true);
      const res = await fetch("/api/supporting-instructors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: suppName,
          rank: suppRank,
          role: suppRole,
          location: suppLocation,
          phone: suppPhone,
          email: suppEmail,
          image_url: suppImage || undefined,
        }),
      });

      if (res.ok) {
        const newInst = await res.json();
        setSupportingInstructors((prev) => [...prev, newInst]);
        // Reset form
        setSuppName("");
        setSuppRank("");
        setSuppRole("Supporting Instructor");
        setSuppLocation("");
        setSuppPhone("");
        setSuppEmail("");
        setSuppImage("");
      } else {
        alert("Failed to add supporting instructor.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSuppSubmitting(false);
    }
  };

  // Delete Supporting Instructor
  const handleDeleteSupportingInstructor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this supporting instructor?")) return;

    try {
      const res = await fetch(`/api/supporting-instructors/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSupportingInstructors((prev) => prev.filter((i) => i._id !== id));
      } else {
        alert("Failed to delete supporting instructor.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add News
  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsDesc) return;

    try {
      setNewsSubmitting(true);
      const res = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newsTitle,
          organizer: newsOrganizer || "Dojo",
          date: newsDate || new Date().toISOString().split("T")[0],
          description: newsDesc,
          image_url: newsImage || undefined,
        }),
      });

      if (res.ok) {
        const newItem = await res.json();
        setNews((prev) => [newItem, ...prev]);
        // Reset form
        setNewsTitle("");
        setNewsOrganizer("");
        setNewsDate("");
        setNewsDesc("");
        setNewsImage("");
      } else {
        alert("Failed to post news.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setNewsSubmitting(false);
    }
  };

  // Delete News
  const handleDeleteNews = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news item?")) return;

    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNews((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert("Failed to delete news item.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Settings
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess(false);

    try {
      setSettingsSubmitting(true);
      const res = await fetch("/api/dojo-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: dojoName,
          phone: dojoPhone,
          email: dojoEmail,
          address: dojoAddress,
          map_embed: dojoMapEmbed,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setDojoInfo(updated);
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      } else {
        alert("Failed to update dojo settings.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSettingsSubmitting(false);
    }
  };

  // Auth lock screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-6 selection:bg-red-500 selection:text-white">
        <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-white tracking-wide uppercase">Dojo Admin Portal</h1>
            <p className="text-slate-400 text-xs">Please enter the security passcode to access management tools.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-2">Security Passcode</label>
              <input
                type="password"
                required
                placeholder="e.g. admin123"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-100 placeholder-slate-700 outline-none text-sm transition"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-500 font-mono bg-red-950/20 border border-red-900/30 p-2.5 rounded-lg text-center">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg transition"
            >
              Verify Passcode
            </button>
          </form>

          <p className="text-[10px] text-center text-slate-600 font-mono">
            Demo passcode: <span className="text-red-400">admin123</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Admin Navbar */}
      <header className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-red-600 text-[10px] font-mono font-bold text-white uppercase tracking-wider">
              Control Panel
            </span>
            <h1 className="text-lg font-black tracking-wide text-white uppercase">
              {dojoInfo?.name || "Okinawa Karate"} Management
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-750 text-slate-200 transition"
            >
              View Site
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-red-950/50 hover:bg-red-950 border border-red-900/40 text-red-400 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Nav */}
        <aside className="lg:col-span-3 space-y-2">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold uppercase transition flex items-center justify-between ${
              activeTab === "bookings"
                ? "bg-red-600 text-white shadow-lg shadow-red-950/30"
                : "bg-slate-900/40 border border-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <span>Trial Bookings</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-950 text-[10px] text-amber-500 font-mono">
              {bookings.filter(b => b.status === "Pending").length} New
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab("instructors")}
            className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold uppercase transition ${
              activeTab === "instructors"
                ? "bg-red-600 text-white shadow-lg shadow-red-950/30"
                : "bg-slate-900/40 border border-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Manage Instructors ({instructors.length})
          </button>

          <button
            onClick={() => setActiveTab("supporting")}
            className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold uppercase transition ${
              activeTab === "supporting"
                ? "bg-red-600 text-white shadow-lg shadow-red-950/30"
                : "bg-slate-900/40 border border-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Supporting Team ({supportingInstructors.length})
          </button>

          <button
            onClick={() => setActiveTab("news")}
            className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold uppercase transition ${
              activeTab === "news"
                ? "bg-red-600 text-white shadow-lg shadow-red-950/30"
                : "bg-slate-900/40 border border-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Announcements ({news.length})
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold uppercase transition ${
              activeTab === "settings"
                ? "bg-red-600 text-white shadow-lg shadow-red-950/30"
                : "bg-slate-900/40 border border-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Dojo Info & Map
          </button>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 sm:p-8 min-h-[400px]">
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <svg className="animate-spin h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : (
            <>
              {/* 1. TAB: BOOKINGS */}
              {activeTab === "bookings" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-white">Trial Booking Requests</h2>
                    <p className="text-slate-450 text-xs">Review submissions from the public signup forms.</p>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-850">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-950 text-slate-400 font-mono border-b border-slate-850">
                          <th className="p-4">Student</th>
                          <th className="p-4">Age</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Program</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {bookings.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-500">
                              No booking requests found.
                            </td>
                          </tr>
                        ) : (
                          bookings.map((booking) => (
                            <tr key={booking._id} className="hover:bg-slate-900/30">
                              <td className="p-4 font-bold text-white">{booking.student_name}</td>
                              <td className="p-4 text-slate-300">{booking.student_age} yrs</td>
                              <td className="p-4 font-mono text-slate-300">{booking.phone}</td>
                              <td className="p-4 text-slate-300">{booking.program}</td>
                              <td className="p-4 font-mono text-slate-350">{booking.date}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  booking.status === "Pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                  booking.status === "Confirmed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                  "bg-slate-800 text-slate-400"
                                }`}>
                                  {booking.status}
                                </span>
                              </td>
                              <td className="p-4 text-right space-x-2">
                                {booking.status === "Pending" && (
                                  <button
                                    onClick={() => handleUpdateBookingStatus(booking._id, "Confirmed")}
                                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition"
                                  >
                                    Confirm
                                  </button>
                                )}
                                {booking.status !== "Archived" && (
                                  <button
                                    onClick={() => handleUpdateBookingStatus(booking._id, "Archived")}
                                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-semibold text-[10px] transition"
                                  >
                                    Archive
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 2. TAB: INSTRUCTORS */}
              {activeTab === "instructors" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-black text-white">Manage Dojo Instructors</h2>
                    <p className="text-slate-400 text-xs">Add or remove coaches from the public list.</p>
                  </div>

                  {/* Form to Add Coach */}
                  <form onSubmit={handleAddInstructor} className="bg-slate-950/40 border border-slate-850 p-6 rounded-2xl space-y-4">
                    <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider">Add New Instructor Profile</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sensei Vikas Kumar"
                          value={instName}
                          onChange={(e) => setInstName(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Belt Grade / Rank</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Black Belt 3rd Dan"
                          value={instRank}
                          onChange={(e) => setInstRank(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Role/Title</label>
                        <select
                          value={instRole}
                          onChange={(e) => setInstRole(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-850 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                        >
                          <option value="Senior Coach">Senior Coach</option>
                          <option value="Coach">Coach</option>
                          <option value="Instructor">Instructor</option>
                          <option value="Assistant Instructor">Assistant Instructor</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Location / Branch</label>
                        <input
                          type="text"
                          placeholder="e.g. Rama Vihar, Delhi"
                          value={instLocation}
                          onChange={(e) => setInstLocation(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Contact Phone</label>
                        <input
                          type="tel"
                          placeholder="e.g. +91 99999 77777"
                          value={instPhone}
                          onChange={(e) => setInstPhone(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Photo URL (Unsplash portrait or local link)</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={instImage}
                        onChange={(e) => setInstImage(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={instSubmitting}
                      className="px-5 py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs shadow-md transition"
                    >
                      {instSubmitting ? "Saving..." : "Register Coach"}
                    </button>
                  </form>

                  {/* List of current instructors */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Current Instructors Registry</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {instructors.map((inst) => (
                        <div
                          key={inst._id}
                          className="p-4 bg-slate-950/20 border border-slate-850 rounded-2xl flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={inst.image_url}
                              alt={inst.name}
                              className="w-12 h-12 object-cover rounded-lg bg-slate-800"
                            />
                            <div>
                              <p className="text-sm font-bold text-white">{inst.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono">{inst.rank} &bull; {inst.role}</p>
                              <p className="text-[10px] text-slate-400">{inst.location}</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => inst._id && handleDeleteInstructor(inst._id)}
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-red-950/30 hover:bg-red-900 border border-red-900/30 text-red-400 hover:text-white transition"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SUPPORTING INSTRUCTORS */}
              {activeTab === "supporting" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-black text-white">Manage Supporting Team</h2>
                    <p className="text-slate-400 text-xs">Add or remove supporting coaches and assistant trainers.</p>
                  </div>

                  {/* Form to Add Supporting Coach */}
                  <form onSubmit={handleAddSupportingInstructor} className="bg-slate-950/40 border border-slate-850 p-6 rounded-2xl space-y-4">
                    <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider">Add New Supporting Instructor</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sempai Pallavi"
                          value={suppName}
                          onChange={(e) => setSuppName(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Belt Grade / Rank</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Black Belt 1st Dan"
                          value={suppRank}
                          onChange={(e) => setSuppRank(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Role/Title</label>
                        <select
                          value={suppRole}
                          onChange={(e) => setSuppRole(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-850 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                        >
                          <option value="Supporting Instructor">Supporting Instructor</option>
                          <option value="Assistant Coach">Assistant Coach</option>
                          <option value="Trainer">Trainer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Location / Branch</label>
                        <input
                          type="text"
                          placeholder="e.g. Bangalore, Karnataka"
                          value={suppLocation}
                          onChange={(e) => setSuppLocation(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Contact Phone</label>
                        <input
                          type="tel"
                          placeholder="e.g. +91 99999 11111"
                          value={suppPhone}
                          onChange={(e) => setSuppPhone(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Photo URL (Unsplash portrait or local link)</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={suppImage}
                        onChange={(e) => setSuppImage(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={suppSubmitting}
                      className="px-5 py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs shadow-md transition"
                    >
                      {suppSubmitting ? "Saving..." : "Register Supporting Member"}
                    </button>
                  </form>

                  {/* List of current supporting instructors */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Supporting Team Registry</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {supportingInstructors.map((inst) => (
                        <div
                          key={inst._id}
                          className="p-4 bg-slate-950/20 border border-slate-850 rounded-2xl flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={inst.image_url}
                              alt={inst.name}
                              className="w-12 h-12 object-cover rounded-lg bg-slate-800"
                            />
                            <div>
                              <p className="text-sm font-bold text-white">{inst.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono">{inst.rank} &bull; {inst.role}</p>
                              <p className="text-[10px] text-slate-400">{inst.location}</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => inst._id && handleDeleteSupportingInstructor(inst._id)}
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-red-950/30 hover:bg-red-900 border border-red-900/30 text-red-400 hover:text-white transition"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. TAB: NEWS */}
              {activeTab === "news" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-black text-white">Post Announcements & News</h2>
                    <p className="text-slate-400 text-xs">Write details about tournaments or belt gradings.</p>
                  </div>

                  {/* Add News Form */}
                  <form onSubmit={handleAddNews} className="bg-slate-950/40 border border-slate-850 p-6 rounded-2xl space-y-4">
                    <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider">Publish New Event / Cup</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Announcement Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 7th Royal Challenges Championship"
                          value={newsTitle}
                          onChange={(e) => setNewsTitle(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Organizer (e.g. TRADI / GKSF)</label>
                        <input
                          type="text"
                          placeholder="e.g. TRADI"
                          value={newsOrganizer}
                          onChange={(e) => setNewsOrganizer(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Date Published</label>
                        <input
                          type="date"
                          value={newsDate}
                          onChange={(e) => setNewsDate(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-250 text-xs outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Banner Image URL</label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={newsImage}
                          onChange={(e) => setNewsImage(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Description / Details</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Write dynamic details about the tournament, rules, or cup awards..."
                        value={newsDesc}
                        onChange={(e) => setNewsDesc(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-xs outline-none transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={newsSubmitting}
                      className="px-5 py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs shadow-md transition"
                    >
                      {newsSubmitting ? "Publishing..." : "Post Announcement"}
                    </button>
                  </form>

                  {/* List News */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Published Announcements</h3>
                    <div className="space-y-3">
                      {news.map((item) => (
                        <div
                          key={item._id}
                          className="p-4 bg-slate-950/20 border border-slate-850 rounded-2xl flex items-center justify-between gap-4"
                        >
                          <div>
                            <p className="text-sm font-bold text-white">{item.title}</p>
                            <p className="text-[10px] text-slate-500 font-mono">Date: {item.date} &bull; Org: {item.organizer}</p>
                          </div>
                          
                          <button
                            onClick={() => item._id && handleDeleteNews(item._id)}
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-red-950/30 hover:bg-red-900 border border-red-900/30 text-red-400 hover:text-white transition"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. TAB: SETTINGS */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-white">Dojo Configuration Settings</h2>
                    <p className="text-slate-400 text-xs">Update your new Karate Class contact details dynamically in MongoDB.</p>
                  </div>

                  <form onSubmit={handleUpdateSettings} className="bg-slate-950/40 border border-slate-850 p-6 rounded-2xl space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Karate Dojo Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Okinawa Shotokon Karate Do"
                        value={dojoName}
                        onChange={(e) => setDojoName(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Dojo Public Phone</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. +91 85100 00838"
                          value={dojoPhone}
                          onChange={(e) => setDojoPhone(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Dojo Contact Email</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. contact@internationalkarate.in"
                          value={dojoEmail}
                          onChange={(e) => setDojoEmail(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Full Postal Address</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. X-1/32, Budh Vihar, New Delhi, India"
                        value={dojoAddress}
                        onChange={(e) => setDojoAddress(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-xs outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Google Maps Iframe Embed Source URL</label>
                      <input
                        type="text"
                        required
                        placeholder="https://www.google.com/maps/embed?pb=..."
                        value={dojoMapEmbed}
                        onChange={(e) => setDojoMapEmbed(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-200 text-[10px] font-mono outline-none transition"
                      />
                      <span className="text-[9px] text-slate-500 block mt-1">
                        Ensure you extract the URL inside the src=&quot;...&quot; attribute of the Google Map embed iframe code.
                      </span>
                    </div>

                    {settingsSuccess && (
                      <p className="text-xs text-emerald-400 font-mono bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-lg">
                        Dojo configuration updated in database! Changes will show on homepage.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={settingsSubmitting || settingsSuccess}
                      className="px-5 py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs shadow-md transition"
                    >
                      {settingsSubmitting ? "Updating..." : "Save Dojo Config"}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

        </main>
      </div>

    </div>
  );
}
