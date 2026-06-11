"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface StudentData {
  _id: string;
  name: string;
  email: string;
  age: number;
  attendance: number;
  fees_paid?: number;
  father_name?: string;
  gender?: string;
  class?: string;
  phone?: string;
  monthly_due?: number;
  payment_status?: string;
  instructor_id?: string;
}

interface NewsItem {
  _id: string;
  title: string;
  organizer: string;
  date: string;
  description: string;
  image_url?: string;
}

// Custom SVGs matching design language
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
  </svg>
);

const AnnouncementsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

const AttendanceIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const PaymentIcon = () => (
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

export default function StudentDashboard() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "announcements" | "attendance" | "payment">("dashboard");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Payment State Variables
  const [instructorQR, setInstructorQR] = useState<string | null>(null);
  const [studentPayments, setStudentPayments] = useState<any[]>([]);
  const [txnIdInput, setTxnIdInput] = useState("");
  const [proofUrlInput, setProofUrlInput] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [proofUploading, setProofUploading] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    const role = localStorage.getItem("user_role");

    if (!id || role !== "student") {
      router.push("/login");
      return;
    }
    setStudentId(id);
    fetchData(id);
  }, [router]);

  const fetchData = async (id: string) => {
    setLoading(true);
    const sData = await fetchStudentData(id);
    await Promise.all([
      fetchNews(),
      fetchStudentPayments(id),
      sData?.instructor_id ? fetchInstructorQR(sData.instructor_id) : Promise.resolve()
    ]);
    setLoading(false);
  };

  const fetchStudentData = async (id: string) => {
    try {
      const response = await fetch(`/api/students/${id}`);
      if (response.ok) {
        const data = await response.json();
        setStudentData(data);
        return data;
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
    return null;
  };

  const fetchStudentPayments = async (id: string) => {
    try {
      const response = await fetch(`/api/payments/student/${id}`);
      if (response.ok) {
        const data = await response.json();
        setStudentPayments(data);
      }
    } catch (error) {
      console.error("Error fetching student payments:", error);
    }
  };

  const fetchInstructorQR = async (instructorId: string) => {
    try {
      const response = await fetch(`/api/instructors/${instructorId}`);
      if (response.ok) {
        const data = await response.json();
        setInstructorQR(data.payment_qr || null);
      }
    } catch (error) {
      console.error("Error fetching instructor QR code:", error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news");
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !studentData) return;

    if (!txnIdInput) {
      alert("Please enter a transaction ID");
      return;
    }

    setSubmitLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          amount: studentData.monthly_due || 0,
          transaction_id: txnIdInput,
          screenshot_url: proofUrlInput || ""
        }),
      });

      if (res.ok) {
        alert("Payment proof submitted successfully! Waiting for instructor approval.");
        setTxnIdInput("");
        setProofUrlInput("");
        fetchData(studentId);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit payment proof");
      }
    } catch (err) {
      console.error("Error submitting payment proof:", err);
      alert("Error submitting payment proof");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProofUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProofUrlInput(data.url);
        alert("Receipt screenshot uploaded successfully!");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to upload image");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Error uploading image");
    } finally {
      setProofUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

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
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                S
              </div>
              <span className="font-extrabold text-sm tracking-wider uppercase truncate text-slate-800">Student Portal</span>
            </div>
          )}
          {isSidebarCollapsed && (
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs mx-auto shrink-0">
              S
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
            { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
            { id: "announcements", label: "Announcements", icon: <AnnouncementsIcon /> },
            { id: "attendance", label: "My Attendance", icon: <AttendanceIcon /> },
            { id: "payment", label: "Fee Payment", icon: <PaymentIcon /> },
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
        {/* Top Header */}
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
                Karate Do Sports Federation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted font-semibold hidden md:inline-block bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Student Mode
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
                Loading student details...
              </div>
            </div>
          ) : (
            <>
              {/* DASHBOARD TAB */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-2">Welcome, {studentData?.name}!</h1>
                    <p className="text-slate-500 text-sm">Track your training progress, announcements, and fees</p>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Classes Attended</p>
                      <p className="text-3xl font-black text-red-600 mt-1">{studentData?.attendance || 0}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Program / Class</p>
                      <p className="text-xl font-extrabold text-slate-800 mt-2 truncate">{studentData?.class || "Regular Training"}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Portal Status</p>
                      <p className="text-xl font-extrabold text-emerald-600 mt-2">Active Student</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Student Profile Card */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
                      <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Student Information</h2>
                      <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                        <div>
                          <p className="text-slate-400">Full Name</p>
                          <p className="text-slate-800 font-bold mt-0.5">{studentData?.name}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Email Address</p>
                          <p className="text-slate-800 font-bold mt-0.5 break-all">{studentData?.email}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Age / Gender</p>
                          <p className="text-slate-800 font-bold mt-0.5">{studentData?.age} years • {studentData?.gender || "Not Specified"}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Father's Name</p>
                          <p className="text-slate-800 font-bold mt-0.5">{studentData?.father_name || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Phone</p>
                          <p className="text-slate-800 font-bold mt-0.5">{studentData?.phone || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Latest Announcement Card */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between group">
                      <div>
                        <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">Latest Announcement</h2>
                        {news.length > 0 ? (
                          <div className="space-y-3">
                            {news[0].image_url && (
                              <div className="relative h-32 bg-slate-100 rounded-lg overflow-hidden mb-3 border border-slate-200">
                                <img
                                  src={news[0].image_url}
                                  alt={news[0].title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-red-650 transition-colors">{news[0].title}</h3>
                            <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{news[0].description}</p>
                          </div>
                        ) : (
                          <p className="text-slate-400 text-xs py-4">No announcements posted recently.</p>
                        )}
                      </div>
                      {news.length > 0 && (
                        <button
                          onClick={() => setActiveTab("announcements")}
                          className="text-xs font-bold text-red-600 hover:text-red-700 mt-4 text-left transition"
                        >
                          View All Announcements →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ANNOUNCEMENTS TAB */}
              {activeTab === "announcements" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-2">Announcements</h1>
                    <p className="text-slate-500 text-sm">Stay updated with dojo news and championship events</p>
                  </div>

                  {news.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {news.map((item) => (
                        <div key={item._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                          {item.image_url && (
                            <div className="relative h-48 bg-slate-100 overflow-hidden border-b border-slate-200">
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                <span>By {item.organizer}</span>
                                <span>{item.date}</span>
                              </div>
                              <h3 className="text-base font-black text-slate-800 group-hover:text-red-605 transition-colors">{item.title}</h3>
                              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white border border-slate-200 rounded-xl text-slate-400 text-sm shadow-xs">
                      No announcements available at the moment.
                    </div>
                  )}
                </div>
              )}

              {/* ATTENDANCE TAB */}
              {activeTab === "attendance" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-2">My Attendance</h1>
                    <p className="text-slate-500 text-sm">Track your class participation logs</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs md:col-span-1 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-24 h-24 rounded-full border-4 border-red-500 flex items-center justify-center bg-red-50">
                        <span className="text-3xl font-black text-red-600">{studentData?.attendance || 0}</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Total Classes Attended</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">Keep coming to Dojo sessions!</p>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs md:col-span-2 space-y-4">
                      <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Training Performance</h2>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Consistent practice is the cornerstone of martial arts. Every class you attend brings you one step closer to your next Belt grading exam. Instructors log your attendance dynamically during each session.
                      </p>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-600 space-y-2">
                        <p className="font-bold text-slate-700">💡 Tip for growth:</p>
                        <p>A minimum of 24 classes is recommended before attempting grading for yellow belt.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENT TAB */}
              {activeTab === "payment" && (
                <div className="space-y-6 max-w-2xl animate-fade-in">
                  <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-2">Monthly Fee Payment</h1>
                    <p className="text-slate-500 text-sm">Scan Dojo QR code, submit transaction reference, and track history</p>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex justify-between items-center">
                      <div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Monthly Fee Amount</p>
                        <p className="text-2xl font-black text-slate-800 mt-1">₹{studentData?.monthly_due || 0}</p>
                      </div>
                      <div className="p-3 bg-red-50 text-red-600 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex justify-between items-center">
                      <div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Current Month Status</p>
                        <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          studentData?.payment_status === "paid"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : studentData?.payment_status === "pending"
                            ? "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}>
                          {studentData?.payment_status || "unpaid"}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 text-slate-600 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Submit Payment proof Section */}
                  {studentData?.payment_status !== "paid" && (
                    <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs space-y-6">
                      <div>
                        <h2 className="text-lg font-black text-slate-800">1. Scan & Pay</h2>
                        <p className="text-slate-500 text-xs mt-1">Use the Dojo QR Code set up by your instructor below</p>
                      </div>

                      {instructorQR ? (
                        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                          <img
                            src={instructorQR}
                            alt="Dojo Payment QR Code"
                            className="max-w-[220px] h-auto border border-slate-300 rounded-xl shadow-md bg-white p-2"
                          />
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-3">Scan with UPI App (GPay/PhonePe/Paytm)</p>
                        </div>
                      ) : (
                        <div className="p-5 text-center bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                          ⚠️ No payment QR Code set by your instructor yet. Please contact your Dojo instructor to configure it.
                        </div>
                      )}

                      <div className="border-t border-slate-100 pt-6">
                        <h2 className="text-lg font-black text-slate-800">2. Submit Verification Details</h2>
                        <p className="text-slate-500 text-xs mt-1">Provide UPI transaction references for verification</p>
                      </div>

                      {studentData?.payment_status === "pending" ? (
                        <div className="p-5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold">
                          ⏳ Payment proof submitted. Instructor verification and status synchronization is in progress.
                        </div>
                      ) : (
                        <form onSubmit={handleSubmitPayment} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Transaction ID / Reference Number *</label>
                            <input
                              type="text"
                              value={txnIdInput}
                              onChange={(e) => setTxnIdInput(e.target.value)}
                              placeholder="Enter 12-digit UPI Txn ID"
                              required
                              className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-slate-800 text-xs outline-none transition-all font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Receipt Screenshot Image URL (Optional)</label>
                            <input
                              type="text"
                              value={proofUrlInput}
                              onChange={(e) => setProofUrlInput(e.target.value)}
                              placeholder="Paste public image link (e.g. imgur or postimg link)"
                              className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-slate-800 text-xs outline-none transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Or Upload Screenshot Image</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleProofUpload}
                              disabled={proofUploading}
                              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                            />
                            {proofUploading && <p className="text-[10px] text-slate-400 mt-1 animate-pulse font-bold">Uploading file...</p>}
                          </div>

                          {proofUrlInput && (
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center">
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Screenshot Preview</p>
                              <img
                                src={proofUrlInput}
                                alt="Payment proof preview"
                                className="max-w-[150px] h-auto border border-slate-300 rounded-lg shadow-sm bg-white"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={submitLoading}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all text-xs shadow-xs cursor-pointer uppercase tracking-wider"
                          >
                            {submitLoading ? "Submitting..." : "Submit Payment Proof"}
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* Payment Logs */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                    <div className="mb-4">
                      <h2 className="text-lg font-black text-slate-800">My Fee History & Logs</h2>
                      <p className="text-slate-500 text-xs mt-1">Review all your processed payment proofs and verification history</p>
                    </div>

                    {studentPayments.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                              <th className="px-4 py-3">Month</th>
                              <th className="px-4 py-3">Amount</th>
                              <th className="px-4 py-3">Transaction ID</th>
                              <th className="px-4 py-3">Date Submitted</th>
                              <th className="px-4 py-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                            {studentPayments.map((log) => (
                              <tr key={log._id}>
                                <td className="px-4 py-3">{log.month}</td>
                                <td className="px-4 py-3 font-bold text-slate-800">₹{log.amount}</td>
                                <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{log.transaction_id}</td>
                                <td className="px-4 py-3 text-slate-500">
                                  {log.submitted_at ? new Date(log.submitted_at).toLocaleString() : "-"}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                    log.status === "paid"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : "bg-amber-50 text-amber-700 border border-amber-200"
                                  }`}>
                                    {log.status}
                                  </span>
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
