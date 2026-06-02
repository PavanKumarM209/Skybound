"use client";

import { useEffect, useState } from "react";

interface Destination {
  _id?: string;
  title: string;
  description: string;
  difficulty: string;
  altitude: string;
  image_url: string;
}

interface HealthStatus {
  status: string;
  database: string;
  service: string;
}

export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [altitude, setAltitude] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch health and destinations
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch from relative endpoints routed through Nginx proxy
      const healthRes = await fetch("/api/health").catch(() => null);
      if (healthRes && healthRes.ok) {
        const healthData = await healthRes.json();
        setHealth(healthData);
      } else {
        setHealth({ status: "offline", database: "offline", service: "Flask API (unreachable)" });
      }

      const destRes = await fetch("/api/destinations");
      if (!destRes.ok) {
        throw new Error("Failed to fetch destinations from backend");
      }
      const destData = await destRes.json();
      setDestinations(destData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while loading data from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/destinations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          difficulty,
          altitude: altitude || "N/A",
          image_url: imageUrl || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add destination");
      }

      const newDest = await res.json();
      setDestinations((prev) => [...prev, newDest]);
      
      // Reset form
      setTitle("");
      setDescription("");
      setDifficulty("Medium");
      setAltitude("");
      setImageUrl("");
      setShowAddForm(false);
    } catch (err: any) {
      alert(err.message || "Failed to submit new destination");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/20 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-violet-400 bg-clip-text text-transparent">
                SKYBOUND
              </span>
              <span className="block text-[10px] text-indigo-400/80 font-mono tracking-widest uppercase">
                Aero Adventures
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Health Indicator Badge */}
            {health && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    health.status === "healthy" ? "bg-emerald-400" : "bg-rose-400"
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    health.status === "healthy" ? "bg-emerald-500" : "bg-rose-500"
                  }`}></span>
                </span>
                <span className="text-slate-400 font-mono">
                  API: {health.status === "healthy" ? "Online" : "Offline"}
                </span>
              </div>
            )}

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white transition-all shadow-md shadow-indigo-950 hover:shadow-indigo-900 active:scale-95"
            >
              {showAddForm ? "Close Form" : "Add Destination"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 relative z-10">
        
        {/* Intro Hero Section */}
        <section className="mb-12 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Explore the World's{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
              Highest Peaks & Wonders
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            A full-stack showcase connecting Next.js, Flask, MongoDB, and Nginx. Explore high-altitude destinations or add your own skybound adventures below.
          </p>
        </section>

        {/* Form Container (Collapsible) */}
        {showAddForm && (
          <section className="mb-12 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300 max-w-2xl">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Add New Skybound Adventure
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">Destination Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Mount Fuji, Japan"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">Altitude / Elevation</label>
                  <input
                    type="text"
                    placeholder="e.g., 3,776m"
                    value={altitude}
                    onChange={(e) => setAltitude(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 outline-none transition"
                  >
                    <option value="Easy">Easy (Leisurely)</option>
                    <option value="Medium">Medium (Moderate Climb)</option>
                    <option value="Hard">Hard (Experienced Hikers)</option>
                    <option value="Extreme">Extreme (Pro Mountaineers)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the adventure, trails, and scenic sky views..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 outline-none transition resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {submitting ? "Adding..." : "Save Destination"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Display Status or Errors */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-rose-950/40 border border-rose-900/50 text-rose-200 flex items-start gap-3">
            <svg className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="font-bold text-sm">Connection Warning</h3>
              <p className="text-xs text-rose-300 mt-1">{error}</p>
              <button 
                onClick={fetchData} 
                className="mt-2 text-xs font-semibold text-rose-400 hover:text-rose-300 underline"
              >
                Retry connection
              </button>
            </div>
          </div>
        )}

        {/* Destinations grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Active Expeditions ({destinations.length})
          </h2>

          {loading ? (
            /* Skeleton Loading State */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-2xl bg-slate-900/40 border border-slate-800/60 overflow-hidden h-[380px] animate-pulse flex flex-col justify-between p-6">
                  <div className="w-full h-44 rounded-xl bg-slate-800" />
                  <div className="space-y-3 mt-4 flex-1">
                    <div className="h-6 w-2/3 bg-slate-800 rounded-md" />
                    <div className="h-4 w-full bg-slate-800 rounded-md" />
                    <div className="h-4 w-4/5 bg-slate-800 rounded-md" />
                  </div>
                  <div className="h-8 w-24 bg-slate-800 rounded-md self-start" />
                </div>
              ))}
            </div>
          ) : destinations.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/10">
              <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              <h3 className="text-lg font-bold text-slate-300">No Expeditions Available</h3>
              <p className="text-slate-500 text-sm mt-1">Be the first to add a high-altitude target!</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 border border-slate-700 transition"
              >
                Create Adventure
              </button>
            </div>
          ) : (
            /* Data Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest, i) => (
                <article
                  key={dest._id || i}
                  className="group rounded-2xl bg-slate-900/40 border border-slate-800/60 overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 hover:translate-y-[-4px] hover:border-slate-750 hover:bg-slate-900/80"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={dest.image_url}
                      alt={dest.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                    
                    {/* Altitude Tag */}
                    <span className="absolute top-4 right-4 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-slate-950/80 border border-slate-800 text-indigo-300 backdrop-blur-md">
                      {dest.altitude}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                        {dest.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-4">
                        {dest.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-850">
                      <span className="text-xs text-slate-500 font-mono">DIFFICULTY</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        dest.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        dest.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        dest.difficulty === "Hard" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                        "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {dest.difficulty}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SKYBOUND Portal. Stack: Next.js + Flask + MongoDB + Nginx.</p>
          <div className="flex items-center gap-6">
            <span className="text-indigo-400">Dockerized Environment Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
