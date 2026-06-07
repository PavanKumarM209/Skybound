"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Affiliation { name: string; }
interface DojoInfo {
  name: string; phone: string; email: string;
  address: string; map_embed: string; affiliations: Affiliation[];
}
interface Instructor {
  _id?: string; name: string; rank: string; role: string;
  location: string; phone: string; email: string; image_url: string;
}
interface NewsItem {
  _id?: string; title: string; organizer: string;
  date: string; description: string; image_url: string;
}
interface Booking {
  _id: string; student_name: string; student_age: number;
  phone: string; program: string; date: string; status: string;
}

const NAV_ITEMS = [
  { id: "bookings", label: "Bookings", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
  )},
  { id: "instructors", label: "Instructors", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
  )},
  { id: "supporting", label: "Support Team", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
  )},
  { id: "news", label: "Announcements", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
  )},
  { id: "settings", label: "Settings", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
  )},
];

function InputField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 text-slate-800 text-sm outline-none transition-all shadow-sm placeholder:text-slate-300"
      />
    </div>
  );
}

function SelectField({ label, children, ...props }: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      <select
        {...props}
        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-violet-400 text-slate-700 text-sm outline-none transition-all shadow-sm"
      >
        {children}
      </select>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}

function FormCard({ title, onSubmit, children }: { title: string; onSubmit: (e: React.FormEvent) => void; children: React.ReactNode }) {
  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
      <p className="text-xs font-bold text-violet-600 uppercase tracking-widest">{title}</p>
      {children}
    </form>
  );
}

function PersonCard({ name, rank, role, imageUrl, onDelete }: {
  name: string; rank: string; role: string; imageUrl: string; onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-violet-100 text-violet-600 font-bold text-lg">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 truncate">{name}</p>
        <p className="text-xs text-slate-400 truncate">{rank}</p>
        <span className="inline-block mt-0.5 px-2 py-0.5 bg-violet-50 text-violet-600 text-[10px] font-bold rounded-full">{role}</span>
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-xs font-semibold transition-all"
      >
        Remove
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("bookings");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [dojoInfo, setDojoInfo] = useState<DojoInfo | null>(null);
  const [supportingInstructors, setSupportingInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  // Instructor form
  const [instName, setInstName] = useState(""); const [instRank, setInstRank] = useState("");
  const [instRole, setInstRole] = useState("Instructor"); const [instLocation, setInstLocation] = useState("");
  const [instPhone, setInstPhone] = useState(""); const [instEmail, setInstEmail] = useState("");
  const [instImage, setInstImage] = useState(""); const [instSubmitting, setInstSubmitting] = useState(false);

  // Supporting form
  const [suppName, setSuppName] = useState(""); const [suppRank, setSuppRank] = useState("");
  const [suppRole, setSuppRole] = useState("Supporting Instructor"); const [suppLocation, setSuppLocation] = useState("");
  const [suppPhone, setSuppPhone] = useState(""); const [suppEmail, setSuppEmail] = useState(""); const [suppImage, setSuppImage] = useState("");
  const [suppSubmitting, setSuppSubmitting] = useState(false);

  // News form
  const [newsTitle, setNewsTitle] = useState(""); const [newsOrganizer, setNewsOrganizer] = useState("");
  const [newsDate, setNewsDate] = useState(""); const [newsDesc, setNewsDesc] = useState("");
  const [newsImage, setNewsImage] = useState(""); const [newsSubmitting, setNewsSubmitting] = useState(false);

  // Settings form
  const [dojoName, setDojoName] = useState(""); const [dojoPhone, setDojoPhone] = useState("");
  const [dojoEmail, setDojoEmail] = useState(""); const [dojoAddress, setDojoAddress] = useState("");
  const [dojoMapEmbed, setDojoMapEmbed] = useState(""); const [settingsSubmitting, setSettingsSubmitting] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Account settings
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [acctUsername, setAcctUsername] = useState("");
  const [acctNewPassword, setAcctNewPassword] = useState("");
  const [acctConfirmPassword, setAcctConfirmPassword] = useState("");
  const [acctPhoto, setAcctPhoto] = useState("");
  const [acctSubmitting, setAcctSubmitting] = useState(false);
  const [acctSuccess, setAcctSuccess] = useState("");
  const [acctError, setAcctError] = useState("");

  useEffect(() => {
    const verifyUserToken = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login?redirect=/admin");
        return;
      }
      // Load current user from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const uObj = JSON.parse(storedUser);
        setCurrentUser(uObj);
        setAcctUsername(uObj.username || "");
        setAcctPhoto(uObj.profile_photo || "");
      }

      try {
        const res = await fetch("http://localhost:5000/api/verify-token", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          router.push("/login?redirect=/admin");
        }
      } catch (err) {
        console.error("Token verification failed", err);
        router.push("/login?redirect=/admin");
      } finally {
        setAuthChecking(false);
      }
    };

    verifyUserToken();
  }, []);

  const loadData = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      const [b, i, n, d, s] = await Promise.all([
        fetch("/api/bookings").catch(() => null),
        fetch("/api/instructors").catch(() => null),
        fetch("/api/news").catch(() => null),
        fetch("/api/dojo-info").catch(() => null),
        fetch("/api/supporting-instructors").catch(() => null),
      ]);
      if (b?.ok) setBookings(await b.json());
      if (i?.ok) setInstructors(await i.json());
      if (n?.ok) setNews(await n.json());
      if (d?.ok && !isPolling) {
        const info = await d.json();
        setDojoInfo(info);
        setDojoName(info.name || ""); setDojoPhone(info.phone || ""); setDojoEmail(info.email || "");
        setDojoAddress(info.address || ""); setDojoMapEmbed(info.map_embed || "");
      }
      if (s?.ok) setSupportingInstructors(await s.json());
    } finally { 
      if (!isPolling) setLoading(false); 
    }
  };

  useEffect(() => { 
    if (isAuthenticated) {
      loadData();
      const interval = setInterval(() => loadData(true), 10000); // Live sync every 10s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // File Upload Helper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };


  const handleUpdateBookingStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (res.ok) setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
    else alert("Failed to update booking.");
  };

  const handleAddInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setInstSubmitting(true);
      const res = await fetch("/api/instructors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: instName, rank: instRank, role: instRole, location: instLocation, phone: instPhone, email: instEmail, image_url: instImage || undefined }) });
      if (res.ok) { const newInst = await res.json(); setInstructors(p => [...p, newInst]); setInstName(""); setInstRank(""); setInstLocation(""); setInstPhone(""); setInstEmail(""); setInstImage(""); }
      else alert("Failed to add instructor.");
    } finally { setInstSubmitting(false); }
  };

  const handleDeleteInstructor = async (id: string) => {
    if (!confirm("Delete this instructor?")) return;
    const res = await fetch(`/api/instructors/${id}`, { method: "DELETE" });
    if (res.ok) setInstructors(p => p.filter(i => i._id !== id));
  };

  const handleAddSupporting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSuppSubmitting(true);
      const res = await fetch("/api/supporting-instructors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: suppName, rank: suppRank, role: suppRole, location: suppLocation, phone: suppPhone, email: suppEmail, image_url: suppImage || undefined }) });
      if (res.ok) { const newSupp = await res.json(); setSupportingInstructors(p => [...p, newSupp]); setSuppName(""); setSuppRank(""); setSuppLocation(""); setSuppPhone(""); setSuppEmail(""); setSuppImage(""); }
      else alert("Failed to add supporting instructor.");
    } finally { setSuppSubmitting(false); }
  };

  const handleDeleteSupporting = async (id: string) => {
    if (!confirm("Delete this member?")) return;
    const res = await fetch(`/api/supporting-instructors/${id}`, { method: "DELETE" });
    if (res.ok) setSupportingInstructors(p => p.filter(i => i._id !== id));
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setNewsSubmitting(true);
      const res = await fetch("/api/news", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: newsTitle, organizer: newsOrganizer || "Dojo", date: newsDate || new Date().toISOString().split("T")[0], description: newsDesc, image_url: newsImage || undefined }) });
      if (res.ok) { const newItem = await res.json(); setNews(p => [newItem, ...p]); setNewsTitle(""); setNewsOrganizer(""); setNewsDate(""); setNewsDesc(""); setNewsImage(""); }
      else alert("Failed to post news.");
    } finally { setNewsSubmitting(false); }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
    if (res.ok) setNews(p => p.filter(item => item._id !== id));
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSettingsSubmitting(true); setSettingsSuccess(false);
      const res = await fetch("/api/dojo-info", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: dojoName, phone: dojoPhone, email: dojoEmail, address: dojoAddress, map_embed: dojoMapEmbed }) });
      if (res.ok) { setDojoInfo(await res.json()); setSettingsSuccess(true); setTimeout(() => setSettingsSuccess(false), 3000); }
      else alert("Failed to update dojo settings.");
    } finally { setSettingsSubmitting(false); }
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAcctError(""); setAcctSuccess("");
    if (acctNewPassword && acctNewPassword.length < 6) return setAcctError("Password must be at least 6 characters.");
    if (acctNewPassword && acctNewPassword !== acctConfirmPassword) return setAcctError("Passwords do not match.");
    if (!acctUsername.trim()) return setAcctError("Username cannot be empty.");
    setAcctSubmitting(true);
    try {
      const token = localStorage.getItem("auth_token");
      const body: any = { username: acctUsername };
      if (acctNewPassword) body.new_password = acctNewPassword;
      if (acctPhoto) body.profile_photo = acctPhoto;
      const res = await fetch("http://localhost:5000/api/update-account", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        const updatedUser = { ...currentUser, ...data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setAcctSuccess("Account updated successfully!");
        setAcctNewPassword(""); setAcctConfirmPassword("");
        setTimeout(() => setAcctSuccess(""), 3000);
      } else { setAcctError(data.error || "Failed to update account."); }
    } catch { setAcctError("Connection error."); }
    finally { setAcctSubmitting(false); }
  };

  const handleLogout = () => { localStorage.removeItem("user"); localStorage.removeItem("auth_token"); router.push("/login"); };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return null;

  const pendingCount = bookings.filter(b => b.status === "Pending").length;
  const userInitial = (dojoInfo?.name?.[0] || "A").toUpperCase();

  return (
    <div className="min-h-screen bg-[#f4f4f8] flex font-sans">

      {/* ─── SIDEBAR ─── */}
      <aside className={`${sidebarCollapsed ? "w-20" : "w-64"} shrink-0 bg-white border-r border-slate-100 flex flex-col transition-all duration-300 relative z-20`}>
        
        {/* Logo */}
        <div className={`h-16 flex items-center gap-3 px-5 border-b border-slate-100 ${sidebarCollapsed ? "justify-center px-0" : ""}`}>
          <img src="/logo_karate.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-lg shadow-sm border border-slate-100 bg-white shrink-0" />
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 leading-tight truncate">{dojoInfo?.name || "Skybound Karate"}</p>
              <p className="text-[10px] text-slate-400 font-medium">Platform Admin</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                activeTab === item.id
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <span className="shrink-0">{item.icon}</span>
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              {!sidebarCollapsed && item.id === "bookings" && pendingCount > 0 && (
                <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === "bookings" ? "bg-white/20 text-white" : "bg-violet-100 text-violet-600"}`}>
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Tip card */}
        {!sidebarCollapsed && (
          <div className="m-3 p-4 bg-violet-50 border border-violet-100 rounded-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span className="text-xs font-bold text-violet-700">Tip</span>
            </div>
            <p className="text-[11px] text-violet-600 leading-relaxed">
              Use Settings to update dojo info. Changes appear on the homepage instantly.
            </p>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-12 w-full flex items-center justify-center border-t border-slate-100 text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
        >
          <svg className={`w-4 h-4 transition-transform duration-300 ${sidebarCollapsed ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
        </button>
      </aside>

      {/* ─── MAIN ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              {activeTab === "bookings" && <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>}
              {activeTab === "instructors" && <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>}
              {activeTab === "supporting" && <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>}
              {activeTab === "news" && <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>}
              {activeTab === "settings" && <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"/>}
            </svg>
            <h1 className="text-base font-bold text-slate-800">
              {NAV_ITEMS.find(n => n.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-violet-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-violet-50">
              ← View Site
            </Link>
            <div className="h-8 w-px bg-slate-100" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                {currentUser?.profile_photo ? (
                  <img src={currentUser.profile_photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  (currentUser?.username || "A").charAt(0).toUpperCase()
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-700">{currentUser?.username || "admin"}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">{currentUser?.role || "Admin"}</p>
              </div>
              <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all" title="Logout">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="max-w-5xl mx-auto space-y-8">

              {/* ─── TAB: BOOKINGS ─── */}
              {activeTab === "bookings" && (
                <>
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Total Bookings", value: bookings.length, sub: "All time", color: "violet", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> },
                      { label: "Pending", value: pendingCount, sub: "Needs action", color: "amber", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
                      { label: "Confirmed", value: bookings.filter(b => b.status === "Confirmed").length, sub: "Ready to start", color: "emerald", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
                      { label: "Instructors", value: instructors.length, sub: "Active coaches", color: "sky", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
                    ].map(stat => (
                      <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                          <p className={`text-3xl font-black ${stat.color === "violet" ? "text-violet-600" : stat.color === "amber" ? "text-amber-500" : stat.color === "emerald" ? "text-emerald-500" : "text-sky-500"}`}>{stat.value}</p>
                          <p className={`text-xs font-semibold mt-1 ${stat.color === "violet" ? "text-violet-400" : stat.color === "amber" ? "text-amber-400" : stat.color === "emerald" ? "text-emerald-400" : "text-sky-400"}`}>{stat.sub}</p>
                        </div>
                        <div className={`p-2.5 rounded-xl ${stat.color === "violet" ? "bg-violet-50 text-violet-500" : stat.color === "amber" ? "bg-amber-50 text-amber-500" : stat.color === "emerald" ? "bg-emerald-50 text-emerald-500" : "bg-sky-50 text-sky-500"}`}>
                          {stat.icon}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bookings Table */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-bold text-slate-800">Trial Booking Requests</h3>
                        {pendingCount > 0 && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full border border-amber-100">{pendingCount} pending</span>
                        )}
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-50">
                            <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Student</th>
                            <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Age</th>
                            <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phone</th>
                            <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Program</th>
                            <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                            <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="text-right px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {bookings.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400">No booking requests yet.</td></tr>
                          ) : bookings.map(b => (
                            <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 font-semibold text-slate-800">{b.student_name}</td>
                              <td className="px-6 py-4 text-slate-500">{b.student_age} yrs</td>
                              <td className="px-6 py-4 text-slate-500 font-mono text-xs">{b.phone}</td>
                              <td className="px-6 py-4 text-slate-600">{b.program}</td>
                              <td className="px-6 py-4 text-slate-400 font-mono text-xs">{b.date}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  b.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                  b.status === "Confirmed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                  "bg-slate-100 text-slate-500"
                                }`}>{b.status}</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {b.status === "Pending" && (
                                    <button onClick={() => handleUpdateBookingStatus(b._id, "Confirmed")} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all active:scale-95">
                                      Confirm
                                    </button>
                                  )}
                                  {b.status !== "Archived" && (
                                    <button onClick={() => handleUpdateBookingStatus(b._id, "Archived")} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 text-xs font-semibold rounded-lg transition-all active:scale-95">
                                      Archive
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* ─── TAB: INSTRUCTORS ─── */}
              {activeTab === "instructors" && (
                <>
                  <div className="flex items-center justify-between">
                    <SectionHeader title="Instructors Team" subtitle="Add and manage head coaches and instructors." />
                    <span className="px-3 py-1.5 bg-violet-50 text-violet-600 text-xs font-bold rounded-full border border-violet-100">{instructors.length} registered</span>
                  </div>

                  <FormCard title="Register New Instructor" onSubmit={handleAddInstructor}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField label="Full Name *" required placeholder="e.g. Sensei Vikas Kumar" value={instName} onChange={e => setInstName(e.target.value)} />
                      <InputField label="Belt Grade / Rank *" required placeholder="e.g. Black Belt 3rd Dan" value={instRank} onChange={e => setInstRank(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField label="Email Address *" type="email" required placeholder="instructor@example.com" value={instEmail} onChange={e => setInstEmail(e.target.value)} />
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Role / Title *</label>
                        <select
                          required
                          value={instRole}
                          onChange={e => setInstRole(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-violet-400 text-slate-700 text-sm outline-none transition-all shadow-sm"
                        >
                          <option value="" disabled>Select a role…</option>
                          <option>Senior Coach</option><option>Coach</option><option>Instructor</option><option>Assistant Instructor</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField label="Location / Branch *" required placeholder="e.g. Rama Vihar, Delhi" value={instLocation} onChange={e => setInstLocation(e.target.value)} />
                      <InputField label="Contact Phone *" required type="tel" placeholder="9999977777" pattern="[0-9]{10}" title="Phone must be exactly 10 digits (numbers only, no spaces or special characters)" value={instPhone} onChange={e => setInstPhone(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Instructor Photo (Upload from device)</label>
                      <input 
                        type="file" accept="image/*" 
                        onChange={e => handleFileUpload(e, setInstImage)} 
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 text-slate-800 text-sm outline-none transition-all shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" 
                      />
                      {instImage && <img src={instImage} alt="Preview" className="mt-2 h-16 w-16 object-cover rounded-xl shadow-sm" />}
                    </div>
                    <button type="submit" disabled={instSubmitting} className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl shadow-sm disabled:opacity-50 transition-all active:scale-95">
                      {instSubmitting ? "Saving…" : "+ Register Coach"}
                    </button>
                  </FormCard>

                  {instructors.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Current Registry</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {instructors.map(inst => (
                          <PersonCard key={inst._id} name={inst.name} rank={inst.rank} role={inst.role} imageUrl={inst.image_url} onDelete={() => inst._id && handleDeleteInstructor(inst._id)} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ─── TAB: SUPPORTING ─── */}
              {activeTab === "supporting" && (
                <>
                  <div className="flex items-center justify-between">
                    <SectionHeader title="Supporting Team" subtitle="Manage assistant trainers and supporting coaches." />
                    <span className="px-3 py-1.5 bg-violet-50 text-violet-600 text-xs font-bold rounded-full border border-violet-100">{supportingInstructors.length} registered</span>
                  </div>

                  <FormCard title="Register Supporting Member" onSubmit={handleAddSupporting}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField label="Full Name *" required placeholder="e.g. Sempai Pallavi" value={suppName} onChange={e => setSuppName(e.target.value)} />
                      <InputField label="Belt Grade / Rank *" required placeholder="e.g. Black Belt 1st Dan" value={suppRank} onChange={e => setSuppRank(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Role / Title *</label>
                        <select
                          required
                          value={suppRole}
                          onChange={e => setSuppRole(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-violet-400 text-slate-700 text-sm outline-none transition-all shadow-sm"
                        >
                          <option value="" disabled>Select a role…</option>
                          <option>Supporting Instructor</option><option>Assistant Coach</option><option>Trainer</option>
                        </select>
                      </div>
                      <InputField label="Email Address *" type="email" required placeholder="member@example.com" value={suppEmail} onChange={e => setSuppEmail(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField label="Location / Branch *" required placeholder="e.g. Bangalore" value={suppLocation} onChange={e => setSuppLocation(e.target.value)} />
                      <InputField label="Contact Phone *" required type="tel" placeholder="9999911111" pattern="[0-9]{10}" title="Phone must be exactly 10 digits (numbers only, no spaces or special characters)" value={suppPhone} onChange={e => setSuppPhone(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Photo (Upload from device)</label>
                      <input 
                        type="file" accept="image/*" 
                        onChange={e => handleFileUpload(e, setSuppImage)} 
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 text-slate-800 text-sm outline-none transition-all shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" 
                      />
                      {suppImage && <img src={suppImage} alt="Preview" className="mt-2 h-16 w-16 object-cover rounded-xl shadow-sm" />}
                    </div>
                    <button type="submit" disabled={suppSubmitting} className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl shadow-sm disabled:opacity-50 transition-all active:scale-95">
                      {suppSubmitting ? "Saving…" : "+ Register Member"}
                    </button>
                  </FormCard>

                  {supportingInstructors.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Current Registry</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {supportingInstructors.map(inst => (
                          <PersonCard key={inst._id} name={inst.name} rank={inst.rank} role={inst.role} imageUrl={inst.image_url} onDelete={() => inst._id && handleDeleteSupporting(inst._id)} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ─── TAB: NEWS ─── */}
              {activeTab === "news" && (
                <>
                  <div className="flex items-center justify-between">
                    <SectionHeader title="Announcements" subtitle="Post tournaments, belt gradings, or Dojo events." />
                    <span className="px-3 py-1.5 bg-violet-50 text-violet-600 text-xs font-bold rounded-full border border-violet-100">{news.length} published</span>
                  </div>

                  <FormCard title="Publish New Announcement" onSubmit={handleAddNews}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <InputField label="Title *" required placeholder="e.g. 7th Royal Challenges Championship" value={newsTitle} onChange={e => setNewsTitle(e.target.value)} />
                      </div>
                      <InputField label="Organizer" placeholder="e.g. TRADI" value={newsOrganizer} onChange={e => setNewsOrganizer(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField label="Date" type="date" value={newsDate} onChange={e => setNewsDate(e.target.value)} />
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Banner Image (Upload)</label>
                        <input 
                          type="file" accept="image/*" 
                          onChange={e => handleFileUpload(e, setNewsImage)} 
                          className="w-full px-4 py-1.5 rounded-xl bg-white border border-slate-200 focus:border-violet-400 text-slate-800 text-sm outline-none transition-all shadow-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" 
                        />
                        {newsImage && <img src={newsImage} alt="Preview" className="mt-2 h-12 w-full object-cover rounded-lg shadow-sm" />}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Description *</label>
                      <textarea required rows={3} placeholder="Details about the event…" value={newsDesc} onChange={e => setNewsDesc(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 text-slate-800 text-sm outline-none transition-all shadow-sm resize-none placeholder:text-slate-300" />
                    </div>
                    <button type="submit" disabled={newsSubmitting} className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl shadow-sm disabled:opacity-50 transition-all active:scale-95">
                      {newsSubmitting ? "Publishing…" : "+ Post Announcement"}
                    </button>
                  </FormCard>

                  {news.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Published</p>
                      {news.map(item => (
                        <div key={item._id} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                          {item.image_url && (
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{item.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{item.date} · <span className="text-violet-500 font-semibold">{item.organizer}</span></p>
                          </div>
                          <button onClick={() => item._id && handleDeleteNews(item._id)} className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-xs font-semibold transition-all">
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ─── TAB: SETTINGS ─── */}
              {activeTab === "settings" && (
                <>
                  <SectionHeader title="Dojo Settings" subtitle="Update contact details, address, and map embed displayed on the homepage." />
                  
                  <form onSubmit={handleUpdateSettings} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
                    <p className="text-xs font-bold text-violet-600 uppercase tracking-widest">Dojo Information</p>
                    <InputField label="Dojo Name *" required placeholder="e.g. Okinawa Shotokon Karate Do" value={dojoName} onChange={e => setDojoName(e.target.value)} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField label="Public Phone *" required type="tel" placeholder="+91 85100 00838" value={dojoPhone} onChange={e => setDojoPhone(e.target.value)} />
                      <InputField label="Contact Email *" required type="email" placeholder="contact@dojo.in" value={dojoEmail} onChange={e => setDojoEmail(e.target.value)} />
                    </div>
                    <InputField label="Full Postal Address *" required placeholder="e.g. X-1/32, Budh Vihar, New Delhi" value={dojoAddress} onChange={e => setDojoAddress(e.target.value)} />
                    <div>
                      <InputField label="Google Maps Embed URL *" required type="text" placeholder="https://www.google.com/maps/embed?pb=..." value={dojoMapEmbed} onChange={e => setDojoMapEmbed(e.target.value)} />
                      <p className="text-[11px] text-slate-400 mt-1.5">Copy the URL inside the <code className="text-violet-500">src="…"</code> of the Google Maps embed code.</p>
                    </div>

                    {settingsSuccess && (
                      <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                        <p className="text-xs font-bold text-emerald-600">Dojo settings saved! Changes are live on the homepage.</p>
                      </div>
                    )}

                    <button type="submit" disabled={settingsSubmitting} className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl shadow-sm disabled:opacity-50 transition-all active:scale-95">
                      {settingsSubmitting ? "Saving…" : "Save Settings"}
                    </button>
                  </form>

                  {/* Account Settings */}
                  <form onSubmit={handleUpdateAccount} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5 mt-6">
                    <p className="text-xs font-bold text-violet-600 uppercase tracking-widest">My Account</p>
                    <p className="text-xs text-slate-400">Change your login username, password, or profile photo.</p>

                    {/* Profile photo */}
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-2xl shrink-0">
                        {acctPhoto || currentUser?.profile_photo ? (
                          <img src={acctPhoto || currentUser?.profile_photo} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          (currentUser?.username || "A").charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Profile Photo (Upload)</label>
                        <input
                          type="file" accept="image/*"
                          onChange={e => handleFileUpload(e, setAcctPhoto)}
                          className="w-full px-4 py-1.5 rounded-xl bg-white border border-slate-200 focus:border-violet-400 text-slate-800 text-sm outline-none transition-all shadow-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                        />
                      </div>
                    </div>

                    <InputField
                      label="Username"
                      placeholder={currentUser?.username || "your-username"}
                      value={acctUsername}
                      onChange={e => setAcctUsername(e.target.value)}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="New Password (leave blank to keep)"
                        type="password"
                        placeholder="••••••••"
                        value={acctNewPassword}
                        onChange={e => setAcctNewPassword(e.target.value)}
                      />
                      <InputField
                        label="Confirm New Password"
                        type="password"
                        placeholder="••••••••"
                        value={acctConfirmPassword}
                        onChange={e => setAcctConfirmPassword(e.target.value)}
                      />
                    </div>

                    {acctError && (
                      <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-100 rounded-xl">
                        <p className="text-xs font-bold text-rose-600">{acctError}</p>
                      </div>
                    )}
                    {acctSuccess && (
                      <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                        <p className="text-xs font-bold text-emerald-600">{acctSuccess}</p>
                      </div>
                    )}

                    <button type="submit" disabled={acctSubmitting} className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl shadow-sm disabled:opacity-50 transition-all active:scale-95">
                      {acctSubmitting ? "Saving…" : "Save Account"}
                    </button>
                  </form>
                </>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
