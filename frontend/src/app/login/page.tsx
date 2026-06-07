"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [emailOrUser, setEmailOrUser] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  // Password Change State
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [tempUser, setTempUser] = useState<any>(null);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUser || !password) {
      setError("Please enter your credentials.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: emailOrUser,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user.force_password_change) {
          // Store token temporarily and show password reset screen
          setTempToken(data.token);
          setTempUser(data.user);
          setShowChangePassword(true);
        } else {
          // Store JWT token and user info
          localStorage.setItem("auth_token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          router.push("/admin");
        }
      } else {
        setError(data.error || "Invalid credentials.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");

    setLoading(true); setError(null); setMessage(null);
    try {
      const response = await fetch("http://localhost:5000/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tempToken}` },
        body: JSON.stringify({ new_password: newPassword }),
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("auth_token", tempToken);
        const updatedUser = { ...tempUser, force_password_change: false };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setMessage("Password updated successfully!");
        setTimeout(() => router.push("/admin"), 1000);
      } else {
        setError(data.error || "Failed to update password.");
      }
    } catch (err) {
      setError("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans selection:bg-rose-500/30">
      
      {/* Left Section - Hero/Brand */}
      <div className="hidden md:flex md:w-[55%] bg-[#0a0a0b] relative overflow-hidden flex-col justify-between p-12 lg:p-20 overflow-y-auto">
        
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-rose-600/20 blur-[140px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
        </div>

        {/* Top Header/Logo */}
        <div className="relative z-10 flex items-center gap-4 animate-fade-in">
          <img src="/logo_karate.jpg" alt="Logo" className="w-16 h-16 object-contain rounded-xl shadow-lg border border-white/10" />
          <span className="text-xl font-black tracking-tight text-white uppercase">Skybound</span>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-8 max-w-xl">
          <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
            Skybound <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-300">Martial Arts</span> Academy.
          </h1>
          <p className="text-slate-400 text-lg lg:text-xl font-medium leading-relaxed">
            Welcome to the official academy dashboard. Manage bookings, instructors, and announcements in a unified workspace.
          </p>
        </div>

        {/* Feature Cards/Footer */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mt-20">
          <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <h3 className="text-white font-bold text-sm">MULTI-DOJO</h3>
            <p className="text-slate-500 text-xs mt-1">Manage multiple branches with distinct identities.</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" /></svg>
            </div>
            <h3 className="text-white font-bold text-sm">LEAD INBOX</h3>
            <p className="text-slate-500 text-xs mt-1">Student submissions stored securely in MongoDB.</p>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-20 relative overflow-hidden bg-slate-50">
        
        {/* Mobile Logo Only */}
        <div className="md:hidden absolute top-8 left-8 flex items-center gap-3">
          <img src="/logo_karate.jpg" alt="Logo" className="w-12 h-12 object-contain rounded-lg shadow-sm border border-slate-100 bg-white" />
          <span className="text-lg font-black tracking-tight text-slate-900 uppercase">Skybound</span>
        </div>

        <div className="w-full max-w-[440px] relative z-10 transition-all duration-500">
          
          {/* Main Card */}
          <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-10 lg:p-14 border border-slate-100">
            <div className="space-y-2 mb-10 text-center">
              <h2 className="text-4xl font-black tracking-tight text-slate-900">Welcome back</h2>
              <p className="text-slate-500 text-sm font-medium">Sign in to manage your academy operations.</p>
            </div>

            {error && (
              <div className="mb-8 p-4 rounded-3xl bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100 animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            {!showChangePassword ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email or Username</label>
                  <input
                    type="text"
                    required
                    value={emailOrUser}
                    onChange={(e) => setEmailOrUser(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/5 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                    <a href="#" className="text-[10px] font-bold text-rose-600 hover:text-rose-700 uppercase tracking-wider transition-colors">Forgot?</a>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/5 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <button
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xl shadow-rose-600/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group mt-10"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/5 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400 tracking-widest"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/5 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400 tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2 group mt-10"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Save Password"
                  )}
                </button>
              </form>
            )}

            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center">
               <a href="/" className="text-[11px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                 Back to Home
               </a>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform built for Martial Arts Academies</p>
          </div>
        </div>
      </div>
    </div>
  );
}
