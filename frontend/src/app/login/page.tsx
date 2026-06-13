"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      // Try student login first
      let response = await fetch("/api/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_role", "student");
        localStorage.setItem("user_token", data.token);
        localStorage.setItem("user_name", data.name || email);
        router.push("/student/dashboard");
        return;
      }

      // If not student, try instructor login
      response = await fetch("/api/instructor-login-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_role", "instructor");
        localStorage.setItem("user_token", data.token);
        localStorage.setItem("user_name", data.name || email);
        router.push("/instructor/dashboard");
        return;
      }

      // If not instructor, try admin login
      response = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_role", "admin");
        localStorage.setItem("user_token", data.token);
        localStorage.setItem("user_name", data.name || email);
        router.push("/admin/dashboard");
        return;
      }

      setError("Invalid email or password");
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans selection:bg-red-100">
      {/* LEFT SIDE - Branding (desktop only) */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center px-12 py-20 bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="space-y-8 text-center">
          <div>
            <img
              src="/logo_karate.jpg"
              alt="Skybound Logo"
              className="w-32 h-32 rounded-full mx-auto border-4 border-red-500/30 object-contain shadow-xl"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black text-slate-900">Sky Bound Martial Arts Academy</h1>
            <p className="text-xl text-red-600 font-semibold">Martial Arts Excellence</p>
            <p className="text-slate-600 text-sm max-w-sm">
              Learn Real Martial Arts from Expert Instructors. Join our academy and master the art of Karate with our elite Senseis.
            </p>
          </div>

          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3 text-slate-700">
              <span className="text-red-600 font-black">✓</span>
              <span>Professional Instructors</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <span className="text-red-600 font-black">✓</span>
              <span>Certified Training Programs</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <span className="text-red-600 font-black">✓</span>
              <span>Belt Ranking System</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white">

        {/* Mobile-only top branding banner */}
        <div className="md:hidden w-full bg-gradient-to-br from-red-600 to-red-800 px-8 pt-12 pb-10 flex flex-col items-center gap-4 text-center">
          {/* Glowing logo */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-white/30 blur-md animate-pulse" />
            <img
              src="/logo_karate.jpg"
              alt="Skybound Logo"
              className="relative w-20 h-20 rounded-full border-4 border-white/60 object-contain shadow-2xl"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide uppercase leading-tight">
              Sky Bound Martial Arts Academy
            </h1>
            <p className="text-red-200 text-xs font-semibold tracking-widest uppercase mt-1">
              Karate Do Sports Federation
            </p>
          </div>
          {/* Quick trust badges */}
          <div className="flex items-center gap-4 mt-1">
            <span className="flex items-center gap-1 text-white/90 text-[11px] font-semibold">
              <span className="text-amber-300 font-black">✓</span> Expert Senseis
            </span>
            <span className="flex items-center gap-1 text-white/90 text-[11px] font-semibold">
              <span className="text-amber-300 font-black">✓</span> Belt Grading
            </span>
            <span className="flex items-center gap-1 text-white/90 text-[11px] font-semibold">
              <span className="text-amber-300 font-black">✓</span> WKF Affiliated
            </span>
          </div>
        </div>

        {/* Login form card */}
        <div className="w-full max-w-sm space-y-8 px-8 py-10 md:py-20">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900">Sign In</h2>
            <p className="text-slate-600 text-sm">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 focus:border-red-500 text-slate-900 placeholder-slate-400 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 focus:border-red-500 text-slate-900 placeholder-slate-400 outline-none transition"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all mt-6"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center text-xs text-slate-600">
            <p>Skybound Academy Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
