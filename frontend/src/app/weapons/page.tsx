"use client";

import { useState } from "react";
import Header from "@/components/Header";

interface KataInfo {
  number: number;
  name: string;
  meaning: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  description: string;
  steps: number;
}

interface WeaponInfo {
  name: string;
  translation: string;
  desc: string;
  image: string;
  focus: string;
}

export default function WeaponsAndKatas() {
  const [activeTab, setActiveTab] = useState<"katas" | "weapons">("katas");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<"All" | "Beginner" | "Intermediate" | "Advanced">("All");

  const katas: KataInfo[] = [
    { number: 1, name: "Taikyoku Shodan", meaning: "First Cause, First Level", level: "Beginner", image: "/karate_kata_punch.png", description: "The most fundamental kata consisting of basic front stances (Zenkutsu-dachi) and straight punches (Choku-tsuki).", steps: 20 },
    { number: 2, name: "Heian Shodan", meaning: "Peaceful Mind, First Level", level: "Beginner", image: "/karate_kata_punch.png", description: "Introduces the hammer-fist strike, down block, high block, and transitions between stances.", steps: 21 },
    { number: 3, name: "Heian Nidan", meaning: "Peaceful Mind, Second Level", level: "Beginner", image: "/karate_kata_block.png", description: "Introduces back stance (Kokutsu-dachi), knife-hand block (Shuto-uke), and side kicks.", steps: 26 },
    { number: 4, name: "Heian Sandan", meaning: "Peaceful Mind, Third Level", level: "Beginner", image: "/karate_kata_block.png", description: "Focuses on close-range techniques, elbow blocks, joint locks, and fighting in back stances.", steps: 20 },
    { number: 5, name: "Heian Yondan", meaning: "Peaceful Mind, Fourth Level", level: "Intermediate", image: "/karate_kata_kick.png", description: "Features dynamic coordination, cross-leg stances, double-arm blocks, and knee strikes.", steps: 27 },
    { number: 6, name: "Heian Godan", meaning: "Peaceful Mind, Fifth Level", level: "Intermediate", image: "/karate_kata_kick.png", description: "Incorporates a jumping crescent kick, landing in a cross-legged stance, and low-level block counters.", steps: 23 },
    { number: 7, name: "Tekki Shodan", meaning: "Iron Horse, First Level", level: "Intermediate", image: "/karate_kata_block.png", description: "Performed entirely in horse-riding stance (Kiba-dachi), emphasizing lateral hip power.", steps: 29 },
    { number: 8, name: "Tekki Nidan", meaning: "Iron Horse, Second Level", level: "Intermediate", image: "/karate_kata_block.png", description: "Builds upon Tekki Shodan with open-hand sweeps, hook punches, and high blocks.", steps: 24 },
    { number: 9, name: "Tekki Sandan", meaning: "Iron Horse, Third Level", level: "Intermediate", image: "/karate_kata_block.png", description: "Focuses on rapid arm deflections, elbow strikes, and low-level sweeps.", steps: 36 },
    { number: 10, name: "Bassai Dai", meaning: "To Penetrate a Fortress (Major)", level: "Advanced", image: "/karate_kata_kick.png", description: "A strong, powerful kata representing fortress-storming maneuvers using dynamic hip acceleration.", steps: 42 },
    { number: 11, name: "Bassai Sho", meaning: "To Penetrate a Fortress (Minor)", level: "Advanced", image: "/karate_kata_kick.png", description: "Emphasizes quick defenses against stick attacks, utilizing joint locks and rapid level shifts.", steps: 38 },
    { number: 12, name: "Jion", meaning: "Love and Mercy", level: "Advanced", image: "/karate_kata_punch.png", description: "A traditional Shaolin-inspired kata focusing on classic, heavy-rooted Shotokan stances.", steps: 47 },
    { number: 13, name: "Kankū Dai", meaning: "To View the Sky (Major)", level: "Advanced", image: "/karate_kata_kick.png", description: "The longest kata in Shotokan. Simulates combat against eight opponents, starting with looking up to the sky.", steps: 65 },
    { number: 14, name: "Kankū Sho", meaning: "To View the Sky (Minor)", level: "Advanced", image: "/karate_kata_kick.png", description: "Features rapid sequences, high-extension jumps, and ground-level sweeping escapes.", steps: 48 },
    { number: 15, name: "Hangetsu", meaning: "Half Moon", level: "Advanced", image: "/karate_kata_block.png", description: "Characterized by half-moon stepping (Hangetsu-dachi) and deep, controlled breathing (Ibuki).", steps: 41 },
    { number: 16, name: "Empi", meaning: "Flying Swallow", level: "Advanced", image: "/karate_kata_kick.png", description: "Emphasizes the light, quick movements of a swallow, featuring sudden low stances and a flying jump.", steps: 37 },
    { number: 17, name: "Jitte", meaning: "Ten Hands", level: "Advanced", image: "/karate_kata_block.png", description: "Focuses on stick-defense (Bo) techniques, demonstrating the power of a warrior fighting ten men.", steps: 24 },
    { number: 18, name: "Chinte", meaning: "Rare Hand", level: "Advanced", image: "/karate_kata_block.png", description: "Features unique circular hand defenses and double-finger strikes to soft targets.", steps: 32 },
    { number: 19, name: "Gankaku", meaning: "Crane on a Rock", level: "Advanced", image: "/karate_kata_kick.png", description: "A famous kata performed on a single leg (Tsuruashi-dachi), representing a crane balanced on a wave-swept rock.", steps: 42 },
    { number: 20, name: "Sochin", meaning: "Strength and Calmness", level: "Advanced", image: "/karate_kata_punch.png", description: "Maintains an unshakeable rooted stance (Sochin-dachi / Fudo-dachi), reflecting calm power.", steps: 41 },
    { number: 21, name: "Nijushiho", meaning: "Twenty-Four Steps", level: "Advanced", image: "/karate_kata_block.png", description: "Characterized by wave-like, flowing motions simulating the ocean tide shifting between soft and hard power.", steps: 24 },
    { number: 22, name: "Wankan", meaning: "King's Crown", level: "Advanced", image: "/karate_kata_punch.png", description: "The shortest kata in Shotokan. Focuses on single-hand trapping and sudden close-range counterstrikes.", steps: 24 },
    { number: 23, name: "Ji'in", meaning: "Temple Ground", level: "Advanced", image: "/karate_kata_punch.png", description: "Emphasizes heavy, grounded transitions and powerful double-arm blocks.", steps: 35 },
    { number: 24, name: "Meikyo", meaning: "Mirror of the Soul", level: "Advanced", image: "/karate_kata_kick.png", description: "Begins with slow, meditative motions. Features a unique triple-kick jump sequence.", steps: 33 },
    { number: 25, name: "Gojushiho Sho", meaning: "Fifty-Four Steps (Minor)", level: "Advanced", image: "/karate_kata_block.png", description: "A highly advanced kata featuring continuous hand-deflections and spear-hand strikes.", steps: 65 },
    { number: 26, name: "Gojushiho Dai", meaning: "Fifty-Four Steps (Major)", level: "Advanced", image: "/karate_kata_block.png", description: "Shares similarities with Gojushiho Sho but emphasizes aggressive double-arm thrusts.", steps: 67 },
    { number: 27, name: "Unsu", meaning: "Cloud Hands", level: "Advanced", image: "/karate_kata_kick.png", description: "The most advanced and visually spectacular Shotokan kata, featuring a 360-degree jumping spin kick.", steps: 48 }
  ];

  const weapons: WeaponInfo[] = [
    {
      name: "Bo Staff",
      translation: "Rokushaku Bo",
      desc: "A 6-foot wooden staff used to deliver long-range thrusts, sweeps, and blocks. The foundational weapon of Okinawan Kobudo.",
      image: "/weapon_bo.png",
      focus: "Two-handed leverage, rotational force, and long-range defense."
    },
    {
      name: "Sai",
      translation: "Metal Tridents",
      desc: "Pronged metal batons used in pairs. Crucial for trapping opponent weapons, blocking sword attacks, and quick forward thrusts.",
      image: "/weapon_sai.png",
      focus: "Wrist flips, weapon trapping, and close-quarters blocks."
    },
    {
      name: "Nunchaku",
      translation: "Flail sticks",
      desc: "Two wooden sections connected by a cord. Famous for its speed, continuous striking arcs, and flexibility in deflecting strikes.",
      image: "/weapon_nunchaku.png",
      focus: "Velocity control, rebound dynamics, and grip transitions."
    },
    {
      name: "Tonfa",
      translation: "Handle batons",
      desc: "Dual wooden batons with perpendicular handles. Traditionally used to reinforce the forearm for powerful shields and rotating punches.",
      image: "/weapon_tonfa.png",
      focus: "Forearm blocking, spinning strikes, and structural shield alignment."
    }
  ];

  const filteredKatas = katas.filter((kata) => {
    const matchesSearch = kata.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          kata.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === "All" || kata.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 py-16 md:py-24 font-sans antialiased">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-4.5 py-1.5 bg-red-50 text-red-650 font-black text-[10px] rounded-full uppercase tracking-widest border border-red-200/50">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              Syllabus Curriculum
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-800 leading-none">
              Shotokan <span className="bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent">Katas</span> & Weapons
            </h1>
            <p className="text-slate-500 text-sm md:text-base font-semibold leading-relaxed">
              Master the official 27 Shotokan Karate Katas and explore traditional Okinawan Kobudo weapons.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center border-b border-slate-200 mb-12">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("katas")}
                className={`pb-4 text-sm font-black uppercase tracking-wider transition-all border-b-4 cursor-pointer ${
                  activeTab === "katas"
                    ? "border-red-600 text-red-600 scale-102"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                27 Shotokan Katas ({katas.length})
              </button>
              <button
                onClick={() => setActiveTab("weapons")}
                className={`pb-4 text-sm font-black uppercase tracking-wider transition-all border-b-4 cursor-pointer ${
                  activeTab === "weapons"
                    ? "border-red-600 text-red-600 scale-102"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Traditional Weapons ({weapons.length})
              </button>
            </div>
          </div>

          {/* Katas Tab Content */}
          {activeTab === "katas" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Controls bar */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
                <div className="w-full md:w-96 relative">
                  <input
                    type="text"
                    placeholder="Search Katas by name or meaning..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-sm text-slate-800 outline-none transition-all"
                  />
                  <div className="absolute left-3.5 top-3 text-slate-400">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                  {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level as any)}
                      className={`px-4.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition border cursor-pointer shrink-0 ${
                        selectedLevel === level
                          ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                          : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Katas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredKatas.map((kata) => (
                  <div
                    key={kata.number}
                    className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Official Action Stance Photo */}
                    <div className="relative h-56 bg-slate-100 overflow-hidden border-b border-slate-200">
                      <img
                        src={kata.image}
                        alt={kata.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-slate-900/90 text-white px-3 py-1 rounded-lg text-xs font-black shadow-xs">
                        #{kata.number}
                      </div>
                      <div className={`absolute top-4 right-4 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                        kata.level === "Beginner"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : kata.level === "Intermediate"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}>
                        {kata.level}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-800 group-hover:text-red-600 transition-colors">
                          {kata.name}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 italic">
                          "{kata.meaning}"
                        </p>
                        <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                          {kata.description}
                        </p>
                      </div>

                      {/* Stance details */}
                      <div className="bg-slate-50 border border-slate-200/50 p-3.5 rounded-2xl flex items-center justify-between mt-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Syllabus Steps
                        </span>
                        <span className="text-xs font-extrabold text-slate-800 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md shadow-2xs">
                          {kata.steps} movements
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weapons Tab Content */}
          {activeTab === "weapons" && (
            <div className="space-y-12 animate-in fade-in duration-200">
              {/* Hero Weapons Display */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 items-center">
                <div className="lg:col-span-6 h-80 lg:h-full min-h-[350px]">
                  <img
                    src="/karate_weapons.png"
                    alt="Traditional Kobudo Weapons"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="lg:col-span-6 p-8 md:p-12 space-y-6">
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 font-black text-[9px] rounded-full uppercase tracking-wider">
                    Dojo Kobudo
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800">
                    Okinawan Weapons Art
                  </h2>
                  <p className="text-slate-500 text-sm md:text-base font-semibold leading-relaxed">
                    Kobudo is the traditional weapons system developed on the islands of Okinawa. Originally adapted from farm implements, these tools allow advanced karate practitioners to extend their blocks and strikes.
                  </p>
                </div>
              </div>

              {/* Weapons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {weapons.map((weapon, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Weapon Image */}
                    <div className="relative h-64 bg-slate-50 overflow-hidden border-b border-slate-200">
                      <img
                        src={weapon.image}
                        alt={weapon.name}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                    </div>
                    
                    {/* Weapon Details */}
                    <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="text-2xl font-black text-slate-800 group-hover:text-red-650 transition-colors">
                            {weapon.name}
                          </h3>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md">
                            {weapon.translation}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs md:text-sm font-semibold leading-relaxed">
                          {weapon.desc}
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-2xl mt-4">
                        <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                          Curriculum Focus
                        </span>
                        <p className="text-slate-700 text-xs font-bold leading-relaxed">
                          {weapon.focus}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
