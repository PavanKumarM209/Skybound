"use client";

import { useState } from "react";
import Header from "@/components/Header";

interface BeltInfo {
  id: string;
  title: string;
  kyu: string;
  category: "beginner" | "intermediate" | "advanced";
  desc: string;
  duration: string;
  months: number | string;
  bgColor: string;
  textColor: string;
  stripes: number;
  stripeColor?: string;
  syllabus: string[];
  tips: string;
}

export default function BeltDetails() {
  const [activeCategory, setActiveCategory] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");
  const [selectedBelt, setSelectedBelt] = useState<BeltInfo | null>(null);

  const beltData: BeltInfo[] = [
    {
      id: "white",
      title: "White Belt",
      kyu: "10th Kyu",
      category: "beginner",
      desc: "Represents purity, innocence, and a blank canvas. The practitioner begins their journey, learning basic stances and proper dojo etiquette.",
      duration: "Commencement of training. Ready for grading after basic dojo integration.",
      months: "Start",
      bgColor: "from-white to-slate-100",
      textColor: "text-slate-800",
      stripes: 0,
      syllabus: ["Dojo Bowing & Etiquette", "Seiken Choku-Tsuki (Straight Punch)", "Jodan Uke (High Block)", "Mae-Geri (Front Kick)"],
      tips: "Focus on learning the commands and terminology of the dojo. Stances should be solid and low."
    },
    {
      id: "yellow",
      title: "Yellow Belt",
      kyu: "9th Kyu",
      category: "beginner",
      desc: "Represents the first ray of sunlight. Focuses on developing coordination, balance, and basic footwork transitions.",
      duration: "The beginner's first test will be conducted 4 months after the commencement of the karate training.",
      months: "4 Months",
      bgColor: "from-amber-400 to-amber-500",
      textColor: "text-amber-950",
      stripes: 0,
      syllabus: ["Taikyoku Shodan Kata", "Chudan Uchi-Uke (Inner Block)", "Side Kick Drills", "Step Sparring (Gohon Kumite)"],
      tips: "Keep your guard up and maintain hip rotation during punches."
    },
    {
      id: "orange",
      title: "Orange Belt",
      kyu: "8th Kyu",
      category: "beginner",
      desc: "Represents the spreading of light. Introduces advanced defensive motions, counter-striking, and hip rotation.",
      duration: "The test will be conducted 4 months after the grading of the 9th kyu.",
      months: "4 Months",
      bgColor: "from-orange-400 to-orange-500",
      textColor: "text-white",
      stripes: 0,
      syllabus: ["Taikyoku Nidan Kata", "Soto-Uke (Outer Block)", "Ushiro-Geri (Back Kick)", "Basic Counter Sparring"],
      tips: "Perfect your back stance (Kokutsu-dachi) and ensure blocks stop at shoulder level."
    },
    {
      id: "green",
      title: "Green Belt",
      kyu: "7th Kyu",
      category: "intermediate",
      desc: "Represents growth and deep roots. Focuses on power generation, breathing control, and kata execution.",
      duration: "The test will be conducted 4 months after the grading of the 8th kyu.",
      months: "4 Months",
      bgColor: "from-emerald-500 to-emerald-600",
      textColor: "text-white",
      stripes: 0,
      syllabus: ["Heian Shodan Kata", "Empi (Elbow Strike)", "Mawashi-Geri (Roundhouse Kick)", "Jiyu Ippon Kumite"],
      tips: "Focus on kime (focus/power) at the end of each technique."
    },
    {
      id: "blue",
      title: "Blue Belt",
      kyu: "6th Kyu",
      category: "intermediate",
      desc: "Represents the sky and expansion. Advanced combinations, reaction speed, and control are emphasized.",
      duration: "The test will be conducted 4 months after the grading of the 7th kyu.",
      months: "4 Months",
      bgColor: "from-blue-500 to-blue-600",
      textColor: "text-white",
      stripes: 0,
      syllabus: ["Heian Nidan Kata", "Tobi-Geri (Jumping Kick)", "Ashi-Barai (Foot Sweep)", "Semi-free Sparring"],
      tips: "Ensure fluidity between blocks and counters."
    },
    {
      id: "purple",
      title: "Purple Belt",
      kyu: "5th Kyu",
      category: "intermediate",
      desc: "Represents transition and confidence. Integration of tactical movement and fluid combinations.",
      duration: "The test will be conducted 6 months after the grading of the 6th kyu.",
      months: "6 Months",
      bgColor: "from-purple-500 to-purple-600",
      textColor: "text-white",
      stripes: 0,
      syllabus: ["Heian Sandan Kata", "Ura-ken (Backfist Strike)", "Double Block Combinations", "Advanced Reaction Sparring"],
      tips: "Focus on tempo changes and shifts in center of gravity."
    },
    {
      id: "brown4",
      title: "Brown IV Belt",
      kyu: "4th Kyu",
      category: "advanced",
      desc: "Represents the earth where the seed matures. Emphasizes internal energy, focus, and kata analysis.",
      duration: "The test will be conducted 6 months after the grading of the 5th kyu.",
      months: "6 Months",
      bgColor: "from-amber-800 to-amber-900",
      textColor: "text-white",
      stripes: 1,
      stripeColor: "bg-slate-950",
      syllabus: ["Heian Yondan Kata", "Ura-Mawashi Geri (Hook Kick)", "Takedown Defense", "Assistant Teaching Practice"],
      tips: "Begin to mentor junior students and study the bunkai (application) of Heian katas."
    },
    {
      id: "brown3",
      title: "Brown III Belt",
      kyu: "3rd Kyu",
      category: "advanced",
      desc: "Continued maturation. High emphasis on Kata Bunkai (applications) and kumite tactical strategies.",
      duration: "The test will be conducted 6 months after the grading of the 4th kyu.",
      months: "6 Months",
      bgColor: "from-amber-800 to-amber-900",
      textColor: "text-white",
      stripes: 2,
      stripeColor: "bg-slate-950",
      syllabus: ["Heian Godan Kata", "Closed Combat Tactics", "Pressure Point Defenses", "Advanced Kata Bunkai"],
      tips: "Focus on sparring strategy, timing, and defensive evasion."
    },
    {
      id: "brown2",
      title: "Brown II Belt",
      kyu: "2nd Kyu",
      category: "advanced",
      desc: "Approaching senior candidacy. Physical mastery combined with self-control, respect, and discipline.",
      duration: "The test will be conducted 6 months after the grading of the 3rd kyu.",
      months: "6 Months",
      bgColor: "from-amber-800 to-amber-900",
      textColor: "text-white",
      stripes: 3,
      stripeColor: "bg-slate-950",
      syllabus: ["Bassai Dai Kata", "Grappling Escapes", "Continuous Sparring (2 Mins)", "Class Management Skills"],
      tips: "You should carry yourself with dignity and support instructors during lessons."
    },
    {
      id: "brown1",
      title: "Brown I Belt",
      kyu: "1st Kyu",
      category: "advanced",
      desc: "The final preparation rank. Mental focus, technical precision, and physical resilience are tested.",
      duration: "The test will be conducted 6 months after the grading of the 2nd kyu.",
      months: "6 Months",
      bgColor: "from-amber-800 to-amber-950",
      textColor: "text-white",
      stripes: 4,
      stripeColor: "bg-slate-950",
      syllabus: ["Kanku Dai Kata", "Mastery of all basic Katas", "Full Sparring Evaluation", "Dojo History Exam"],
      tips: "Fine-tune speed, power, and breathing. Prepare yourself mentally for the Black Belt exam."
    },
    {
      id: "black",
      title: "Black Belt",
      kyu: "1st Dan & Above",
      category: "advanced",
      desc: "Mastery of technique and the true beginning of self-discovery. Represents the fusion of all colors.",
      duration: "The test will be conducted after completion of above said syllabus senior grading will be done at the Head Quarters.",
      months: "HQ Exam",
      bgColor: "from-slate-900 to-black",
      textColor: "text-white",
      stripes: 1,
      stripeColor: "bg-amber-500",
      syllabus: ["Tekki Shodan Kata", "Dan Grade Katas", "Master Panel Evaluation", "Lifetime Dojo Pledge"],
      tips: "A Black Belt is a white belt who never gave up. Lead by example and continue training daily."
    }
  ];

  const filteredBelts = activeCategory === "all"
    ? beltData
    : beltData.filter(b => b.category === activeCategory);

  return (
    <>
      <Header />
      {/* Premium Light Background with warm red/amber gradient glows */}
      <main className="min-h-screen bg-linear-to-b from-slate-50 via-rose-50/20 to-slate-50/50 py-16 md:py-24 font-sans antialiased">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-4.5 py-1.5 bg-red-50 text-red-600 font-extrabold text-[10px] rounded-full uppercase tracking-widest border border-red-200/50 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Official Grading Timeline
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-800 leading-none">
              Belt Exam <span className="bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent">Durations</span> & Ranks
            </h1>
            <p className="text-slate-500 text-sm md:text-base font-semibold leading-relaxed">
              Explore the structured intervals and grading requirements of Okinawa Shotokon Karate. Refactored directly from Page 8 of the Dojo handbook.
            </p>
          </div>

          {/* Filter Categories Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {[
              { id: "all", label: "All Belts" },
              { id: "beginner", label: "Beginner Ranks (10th - 8th Kyu)" },
              { id: "intermediate", label: "Intermediate Ranks (7th - 5th Kyu)" },
              { id: "advanced", label: "Advanced Ranks (4th Kyu - Dan)" }
            ].map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-6 py-3 rounded-full text-xs font-black transition-all border cursor-pointer ${
                    isActive
                      ? "bg-slate-900 border-slate-900 text-white shadow-lg scale-102"
                      : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200 shadow-xs"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Belts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBelts.map((belt) => (
              <div
                key={belt.id}
                className="bg-white/90 backdrop-blur-md border border-slate-200/70 rounded-3xl p-6.5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between relative group"
              >
                {/* Woven Fabric Styled Belt Accent */}
                <div
                  className="relative h-7 w-full rounded-lg overflow-hidden border border-slate-300 shadow-xs mb-5 flex items-center justify-end"
                  style={{
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15), inset 0 -1px 3px rgba(255,255,255,0.1)"
                  }}
                >
                  {/* Woven Cross-Hatch Pattern Layer */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${belt.bgColor}`} />
                  <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(45deg, #000 0px, #000 2px, transparent 2px, transparent 6px),
                        repeating-linear-gradient(-45deg, #000 0px, #000 2px, transparent 2px, transparent 6px)
                      `
                    }}
                  />
                  
                  {/* Stripes representation */}
                  {belt.stripes > 0 && belt.stripeColor && (
                    <div className="absolute right-5 flex gap-1 items-center h-full">
                      {Array.from({ length: belt.stripes }).map((_, i) => (
                        <div key={i} className={`w-1 h-full shadow-xs ${belt.stripeColor}`} />
                      ))}
                    </div>
                  )}

                  {/* Black belt tip for colored ranks */}
                  {belt.id !== "white" && belt.id !== "black" && (
                    <div className="absolute right-0 top-0 bottom-0 w-4.5 bg-slate-900 border-l border-slate-950" />
                  )}
                </div>

                {/* Card Main details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-wider text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-md">
                      {belt.kyu}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {belt.category}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-800 group-hover:text-red-600 transition-colors">
                    {belt.title}
                  </h3>
                  
                  <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                    {belt.desc}
                  </p>
                </div>

                {/* Duration info block */}
                <div className="bg-slate-50/80 border border-slate-200/50 rounded-2xl p-4.5 space-y-3 mb-5">
                  <div className="flex items-center justify-between border-b border-slate-200/30 pb-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Exam Duration
                    </span>
                    <span className="text-xs font-black text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-2xs">
                      {belt.months}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs font-bold leading-relaxed">
                    {belt.duration}
                  </p>
                </div>

                {/* Quick actions & checklist */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1">
                    {belt.syllabus.slice(0, 2).map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-extrabold text-slate-500 bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-md max-w-[100px] truncate"
                        title={item}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedBelt(belt)}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition shadow-sm hover:shadow-md shrink-0 cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Milestones Roadmap */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm mt-16 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                  Okinawa Shotokon Career Progression
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Estimated milestones based on perfect grading cycles
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center text-[10px] font-black uppercase">
              {[
                { label: "White Belt", val: "0 Months", bg: "bg-slate-50 text-slate-900" },
                { label: "Yellow Belt", val: "4 Months", bg: "bg-amber-50 text-amber-800" },
                { label: "Orange Belt", val: "8 Months", bg: "bg-orange-50 text-orange-900" },
                { label: "Green / Blue", val: "12 - 16 Months", bg: "bg-blue-50 text-blue-800" },
                { label: "Purple / Brown", val: "22 - 46 Months", bg: "bg-amber-50 text-amber-950" },
                { label: "Black Belt", val: "HQ Grading", bg: "bg-slate-900 text-white" }
              ].map((step, idx) => (
                <div key={idx} className={`border border-slate-200/60 p-3 rounded-2xl space-y-1 ${step.bg} shadow-2xs`}>
                  <span className="block opacity-70">{step.label}</span>
                  <span className="font-extrabold">{step.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Interactive Syllabus Detail Modal */}
      {selectedBelt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 md:p-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Top Close Button */}
            <button
              onClick={() => setSelectedBelt(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div
                className="w-16 h-8 rounded-md border border-slate-300 shadow-xs flex items-center justify-end overflow-hidden shrink-0 relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${selectedBelt.bgColor}`} />
                {/* Woven Cross-Hatch */}
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(45deg, #000 0px, #000 2px, transparent 2px, transparent 6px),
                      repeating-linear-gradient(-45deg, #000 0px, #000 2px, transparent 2px, transparent 6px)
                    `
                  }}
                />
                {selectedBelt.stripes > 0 && selectedBelt.stripeColor && (
                  <div className="absolute right-2.5 flex gap-0.5 items-center h-full">
                    {Array.from({ length: selectedBelt.stripes }).map((_, i) => (
                      <div key={i} className={`w-0.5 h-full ${selectedBelt.stripeColor}`} />
                    ))}
                  </div>
                )}
                {selectedBelt.id !== "white" && selectedBelt.id !== "black" && (
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-slate-900" />
                )}
              </div>

              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded">
                  {selectedBelt.kyu}
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{selectedBelt.title}</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Description</h4>
                <p className="text-slate-600 text-xs md:text-sm font-semibold leading-relaxed">
                  {selectedBelt.desc}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4.5 space-y-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exam Interval Guideline</h4>
                <p className="text-slate-700 text-xs md:text-sm font-extrabold">
                  {selectedBelt.duration}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5">Syllabus Requirements</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedBelt.syllabus.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 bg-slate-50/40 border border-slate-100 p-2.5 rounded-xl">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-700 text-xs font-bold truncate">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Training Tips</h4>
                <p className="text-slate-500 text-xs md:text-sm italic font-medium leading-relaxed">
                  "{selectedBelt.tips}"
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedBelt(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer"
              >
                Close Syllabus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
