"use client";

import { useState, useEffect } from "react";

interface DojoInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export default function Header() {
  const [dojoInfo, setDojoInfo] = useState<DojoInfo | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchDojoInfo = async () => {
      try {
        const response = await fetch("/api/dojo-info");
        const data = await response.json();
        setDojoInfo(data[0] || null);
      } catch (error) {
        console.error("Error fetching dojo info:", error);
      }
    };
    fetchDojoInfo();
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo and Name */}
        <div className="flex items-center gap-2 shrink-0 max-w-[200px] md:max-w-[260px]">
          <div className="relative flex-shrink-0">
            <img
              src="/logo_karate.jpg"
              alt="Dojo Logo"
              className="relative h-9 w-9 md:h-10 md:w-10 object-contain rounded-full border border-red-500/30 bg-card p-0.5 shadow-md shadow-red-950/10 dark:shadow-red-950/30"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div className="min-w-0">
            <span className="block text-[11px] leading-tight sm:text-xs md:text-sm font-black tracking-wide bg-gradient-to-r from-foreground via-red-600 to-amber-500 bg-clip-text text-transparent uppercase truncate">
              {dojoInfo?.name || "Sky Bound Martial Arts Academy"}
            </span>
            <span className="hidden sm:block text-[9px] text-red-600 font-mono tracking-widest uppercase">
              Karate Do Sports Federation
            </span>
          </div>
        </div>

        {/* Nav items + Login (Desktop) */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-5 text-xs lg:text-sm font-semibold shrink-0">
          <a href="/" className="text-red-600 hover:text-red-700 transition-colors whitespace-nowrap">Home</a>
          <a href="/announcements" className="text-muted hover:text-red-600 transition-colors whitespace-nowrap">Announcement</a>
          <a href="/belt-details" className="text-muted hover:text-red-600 transition-colors whitespace-nowrap">Belt Details</a>
          <a href="/weapons" className="text-muted hover:text-red-600 transition-colors whitespace-nowrap">Weapons</a>
          <a href="/#contact" className="text-muted hover:text-red-600 transition-colors whitespace-nowrap">Contact</a>
          <a href="/login" className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-4 rounded-lg transition-all text-xs lg:text-sm whitespace-nowrap">Login</a>
        </nav>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex md:hidden p-2 text-foreground focus:outline-none hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-6 py-4 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 text-sm font-semibold">
            <a href="/" onClick={() => setIsMenuOpen(false)} className="text-red-600 hover:text-red-700 py-1 transition-colors">Home</a>
            <a href="/announcements" onClick={() => setIsMenuOpen(false)} className="text-muted hover:text-red-600 py-1 transition-colors">Announcement</a>
            <a href="/belt-details" onClick={() => setIsMenuOpen(false)} className="text-muted hover:text-red-600 py-1 transition-colors">Belt Details</a>
            <a href="/weapons" onClick={() => setIsMenuOpen(false)} className="text-muted hover:text-red-600 py-1 transition-colors">Weapons</a>
            <a href="/#contact" onClick={() => setIsMenuOpen(false)} className="text-muted hover:text-red-600 py-1 transition-colors">Contact</a>
            <a href="/login" onClick={() => setIsMenuOpen(false)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg text-center transition-all text-sm inline-block w-full">
              Login
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
