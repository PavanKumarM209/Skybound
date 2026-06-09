"use client";

import { useState } from "react";
import Header from "@/components/Header";

export default function BeltDetails() {
  const [activeBelt, setActiveBelt] = useState("white");

  const beltData: Record<string, { title: string; kyu: string; desc: string; color: string }> = {
    white: {
      title: "White Belt",
      kyu: "10th Kyu",
      desc: "Foundation, purity, and the beginning of a practitioner's martial arts journey. Focuses on basic stances, blocks, and strikes.",
      color: "bg-white text-slate-900"
    },
    yellow: {
      title: "Yellow Belt",
      kyu: "9th & 8th Kyu",
      desc: "Represents the first ray of sunlight. Focuses on developing body control, balance, and basic footwork combinations.",
      color: "bg-amber-400 text-slate-950"
    },
    orange: {
      title: "Orange Belt",
      kyu: "7th Kyu",
      desc: "Represents the spreading of light. Introduces advanced defensive motions, counter-striking, and basic sparring (Kumite).",
      color: "bg-orange-500 text-white"
    },
    green: {
      title: "Green Belt",
      kyu: "6th & 5th Kyu",
      desc: "Represents growth and roots digging deep. Focus is placed on power generation, breathing techniques, and Gekisai Katas.",
      color: "bg-emerald-600 text-white"
    },
    blue: {
      title: "Blue Belt",
      kyu: "4th & 3rd Kyu",
      desc: "Represents the sky and expansion. Advanced kata training, combat techniques, and leadership qualities are emphasized.",
      color: "bg-blue-600 text-white"
    },
    brown: {
      title: "Brown Belt",
      kyu: "2nd & 1st Kyu",
      desc: "Represents earth and maturity. Deep understanding of all techniques and preparation for black belt candidacy.",
      color: "bg-amber-900 text-white"
    },
    black: {
      title: "Black Belt",
      kyu: "1st Dan and Above",
      desc: "The pinnacle of Karate. Represents mastery, wisdom, and a lifelong commitment to the martial arts and personal development.",
      color: "bg-slate-900 text-white"
    }
  };

  const belts = Object.keys(beltData);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black text-foreground">Belt System</h1>
          <p className="text-muted text-lg">Journey through the Karate belt ranks</p>
        </div>

        {/* Belt Selection */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {belts.map((belt) => (
            <button
              key={belt}
              onClick={() => setActiveBelt(belt)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeBelt === belt
                  ? `${beltData[belt].color} shadow-lg scale-105`
                  : "bg-card border border-border text-muted hover:text-foreground"
              }`}
            >
              {beltData[belt].title}
            </button>
          ))}
        </div>

        {/* Active Belt Detail */}
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-3xl p-12 text-center space-y-6">
          <div className={`w-32 h-32 rounded-full ${beltData[activeBelt].color} mx-auto flex items-center justify-center shadow-2xl`}>
            <span className="text-2xl font-black">{beltData[activeBelt].kyu}</span>
          </div>
          <h2 className="text-3xl font-black text-foreground">{beltData[activeBelt].title}</h2>
          <p className="text-lg text-muted leading-relaxed">{beltData[activeBelt].desc}</p>
        </div>
        </div>
      </main>
    </>
  );
}
