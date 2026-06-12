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
  const [showBookingModal, setShowBookingModal] = useState(false);

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
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo and Name */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/logo_karate.jpg"
              alt="Dojo Logo"
              className="relative h-12 w-12 object-contain rounded-full border border-red-500/30 bg-card p-0.5 shadow-md shadow-red-950/10 dark:shadow-red-950/30"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div>
            <span className="text-lg font-black tracking-wider bg-gradient-to-r from-foreground via-red-600 to-amber-500 bg-clip-text text-transparent uppercase">
              {dojoInfo?.name || "Okinawa Shotokon"}
            </span>
            <span className="block text-[9px] text-red-600 font-mono tracking-widest uppercase">
              Karate Do Sports Federation
            </span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <a href="/" className="text-red-600 hover:text-red-700 transition-colors">Home</a>
          <a href="/announcements" className="text-muted hover:text-red-600 transition-colors">Announcement</a>
          <a href="/belt-details" className="text-muted hover:text-red-600 transition-colors">Belt Details</a>
          <a href="/weapons" className="text-muted hover:text-red-600 transition-colors">Weapons</a>
          <a href="/#contact" className="text-muted hover:text-red-600 transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          <a href="/login" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all text-sm">
            Login
          </a>
        </div>
      </div>
    </header>
  );
}
