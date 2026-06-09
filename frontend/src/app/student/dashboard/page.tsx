"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

interface StudentData {
  _id: string;
  name: string;
  email: string;
  age: number;
  attendance: number;
  fees_paid: number;
}

export default function StudentDashboard() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "announcements" | "attendance" | "payment">("dashboard");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    const role = localStorage.getItem("user_role");

    if (!id || role !== "student") {
      router.push("/student/login");
      return;
    }
    setStudentId(id);
    fetchStudentData(id);
  }, [router]);

  const fetchStudentData = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${id}`);
      if (response.ok) {
        const data = await response.json();
        setStudentData(data);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "dashboard"
                  ? "bg-red-600 text-white"
                  : "text-foreground hover:bg-background"
              }`}
              title="Dashboard"
            >
              <span className="text-lg">📊</span>
              {sidebarOpen && <span className="font-semibold text-sm">Dashboard</span>}
            </button>

            <button
              onClick={() => setActiveTab("announcements")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "announcements"
                  ? "bg-red-600 text-white"
                  : "text-foreground hover:bg-background"
              }`}
              title="Announcements"
            >
              <span className="text-lg">📢</span>
              {sidebarOpen && <span className="font-semibold text-sm">Announcements</span>}
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
              onClick={() => setActiveTab("payment")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "payment"
                  ? "bg-red-600 text-white"
                  : "text-foreground hover:bg-background"
              }`}
              title="Payment"
            >
              <span className="text-lg">💳</span>
              {sidebarOpen && <span className="font-semibold text-sm">Payment</span>}
            </button>
          </nav>

          <div className="p-4 border-t border-border">
            <button
              onClick={() => {
                localStorage.clear();
                router.push("/student/login");
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
          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-black text-foreground mb-2">Welcome to Your Portal</h1>
                <p className="text-muted">Track your progress and stay updated</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-muted text-sm">Classes Attended</p>
                  <p className="text-3xl font-black text-red-600">{studentData?.attendance || 0}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-muted text-sm">Pending Fees</p>
                  <p className="text-3xl font-black text-amber-500">-</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-muted text-sm">Active Status</p>
                  <p className="text-3xl font-black text-emerald-500">Active</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Recent Announcements</h2>
                <p className="text-muted">No announcements yet</p>
              </div>
            </div>
          )}

          {/* ANNOUNCEMENTS TAB */}
          {activeTab === "announcements" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-black text-foreground mb-2">Announcements</h1>
                <p className="text-muted">Stay updated with academy news</p>
              </div>

              <div className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-muted text-xs mb-2">No announcements available</p>
                </div>
              </div>
            </div>
          )}

          {/* ATTENDANCE TAB */}
          {activeTab === "attendance" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-black text-foreground mb-2">Attendance</h1>
                <p className="text-muted">View your class attendance records</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card border border-emerald-500/30 rounded-xl p-6">
                  <p className="text-muted text-sm">Classes Attended</p>
                  <p className="text-4xl font-black text-emerald-500">{studentData?.attendance || 0}</p>
                </div>
                <div className="bg-card border border-amber-500/30 rounded-xl p-6">
                  <p className="text-muted text-sm">Status</p>
                  <p className="text-lg font-bold text-amber-500">Keep attending!</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Attendance Summary</h2>
                <div className="space-y-2 text-muted">
                  <p>Total classes attended: <span className="font-bold text-foreground">{studentData?.attendance || 0}</span></p>
                  <p>Keep attending to improve your progress!</p>
                </div>
              </div>
            </div>
          )}

          {/* PAYMENT TAB */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-black text-foreground mb-2">Payment</h1>
                <p className="text-muted">View and manage your fees</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Payment Status</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-6">
                    <p className="text-muted text-sm">Total Paid</p>
                    <p className="text-2xl font-black text-emerald-400">Rs 0</p>
                  </div>
                  <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-6">
                    <p className="text-muted text-sm">Pending Amount</p>
                    <p className="text-2xl font-black text-amber-400">-</p>
                  </div>
                </div>

                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all">
                  Make Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
