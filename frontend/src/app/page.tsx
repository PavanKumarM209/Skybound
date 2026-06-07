"use client";

import { useEffect, useState } from "react";

interface Affiliation {
  name: string;
}

interface DojoInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  map_embed: string;
  affiliations: Affiliation[];
}

interface Instructor {
  _id?: string;
  name: string;
  rank: string;
  role: string;
  location: string;
  phone: string;
  email: string;
  image_url: string;
}

interface Trustee {
  _id?: string;
  name: string;
  role: string;
  image_url: string;
}

interface NewsItem {
  _id?: string;
  title: string;
  organizer: string;
  date: string;
  description: string;
  image_url: string;
}

export default function Home() {
  const [dojoInfo, setDojoInfo] = useState<DojoInfo | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [supportingInstructors, setSupportingInstructors] = useState<Instructor[]>([]);
  const [trustees, setTrustees] = useState<Trustee[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All");



  // Booking Modal States
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [phone, setPhone] = useState("");
  const [program, setProgram] = useState("Regular Training");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Selected Belt Info State
  const [activeBelt, setActiveBelt] = useState("white");

  const beltData: Record<string, { title: string; kyu: string; desc: string; color: string; border: string }> = {
    white: {
      title: "White Belt",
      kyu: "10th Kyu",
      desc: "Foundation, purity, and the beginning of a practitioner's martial arts journey. Focuses on basic stances, blocks, and strikes.",
      color: "bg-white text-slate-900 border-slate-350 border",
      border: "border-slate-300"
    },
    yellow: {
      title: "Yellow Belt",
      kyu: "9th & 8th Kyu",
      desc: "Represents the first ray of sunlight. Focuses on developing body control, balance, and basic footwork combinations.",
      color: "bg-amber-400 text-slate-950 border border-amber-500",
      border: "border-amber-500"
    },
    orange: {
      title: "Orange Belt",
      kyu: "7th Kyu",
      desc: "Represents the spreading of light. Introduces advanced defensive motions, counter-striking, and basic sparring (Kumite).",
      color: "bg-orange-500 text-white border border-orange-600",
      border: "border-orange-600"
    },
    green: {
      title: "Green Belt",
      kyu: "6th & 5th Kyu",
      desc: "Represents growth and roots digging deep. Focus is placed on power generation, breathing techniques, and Gekisai Katas.",
      color: "bg-emerald-600 text-white border border-emerald-700",
      border: "border-emerald-700"
    },
    blue: {
      title: "Blue Belt",
      kyu: "4th Kyu",
      desc: "Represents the sky towards which the plant grows. Emphasizes fluid movement, agility, and sweep counter-techniques.",
      color: "bg-blue-600 text-white border border-blue-700",
      border: "border-blue-700"
    },
    purple: {
      title: "Purple Belt",
      kyu: "3rd Kyu",
      desc: "Represents transition and depth of technique. Advanced circular movements and defense-to-offense transitions are mastered.",
      color: "bg-purple-600 text-white border border-purple-700",
      border: "border-purple-700"
    },
    brown: {
      title: "Brown Belt",
      kyu: "2nd & 1st Kyu",
      desc: "Represents the ripening of a seed. Focus shifts to internal energy, breathing patterns (Sanchin), and tactical defense.",
      color: "bg-amber-800 text-white border border-amber-950",
      border: "border-amber-955"
    },
    black: {
      title: "Black Belt",
      kyu: "1st Dan & Above",
      desc: "The culmination of core training, representing mastery of the basics and the birth of a true karate practitioner.",
      color: "bg-slate-950 text-amber-400 border border-amber-500/50",
      border: "border-amber-500"
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [infoRes, instRes, newsRes, trusteeRes, supportingRes] = await Promise.all([
          fetch("/api/dojo-info").catch(() => null),
          fetch("/api/instructors").catch(() => null),
          fetch("/api/news").catch(() => null),
          fetch("/api/trustees").catch(() => null),
          fetch("/api/supporting-instructors").catch(() => null)
        ]);

        if (infoRes && infoRes.ok) {
          const infoData = await infoRes.json();
          setDojoInfo(infoData);
        } else {
          setDojoInfo({
            name: "Okinawa Shotokon Karate Do",
            phone: "+91 85100 00838",
            email: "contact@internationalkarate.in",
            address: "X-1/32, Daal Mill Road, Budh Vihar, Phase-1, New Delhi-110086, India",
            map_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.4239857905183!2d77.098485!3d28.736785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d068593a201c1%3A0xe54fb7a28e932ec3!2sBudh%20Vihar%20Phase%20I%2C%20Budh%20Vihar%2C%20Delhi%2C%20110086!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
            affiliations: [
              { name: "Shotokon Karate-Do Sports Federation" },
              { name: "Martial Arts Games Federation of India (MGFI)" },
              { name: "Karate India Organisation (KIO)" },
              { name: "Delhi Olympic Association" }
            ]
          });
        }

        if (instRes && instRes.ok) {
          const instData = await instRes.json();
          setInstructors(instData);
        }

        if (trusteeRes && trusteeRes.ok) {
          const trusteeData = await trusteeRes.json();
          setTrustees(trusteeData);
        } else {
          setTrustees([
            {
              _id: "tr_1",
              name: "Renshi Umapathi S S",
              role: "Founder, President & Chief Coach",
              image_url: "/umapathi_ss.png"
            },
            {
              _id: "tr_2",
              name: "Nethravathi M B",
              role: "Founder / Treasurer",
              image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop"
            },
            {
              _id: "tr_3",
              name: "Somashekhar S S",
              role: "Trustee",
              image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop"
            }
          ]);
        }

        if (supportingRes && supportingRes.ok) {
          const supportingData = await supportingRes.json();
          setSupportingInstructors(supportingData);
        } else {
          setSupportingInstructors([
            {
              _id: "supp_1",
              name: "Sempai Pallavi",
              rank: "Black Belt 1st Dan",
              role: "Supporting Instructor",
              location: "Bangalore, Karnataka",
              phone: "+91 99999 11111",
              email: "pallavi@example.com",
              image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop"
            },
            {
              _id: "supp_2",
              name: "Sempai Yashaswini M",
              rank: "Black Belt 1st Dan",
              role: "Supporting Instructor",
              location: "Bangalore, Karnataka",
              phone: "+91 99999 22222",
              email: "yashaswini@example.com",
              image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop"
            },
            {
              _id: "supp_3",
              name: "Sempai Shravya S Hegde",
              rank: "Black Belt 1st Dan",
              role: "Supporting Instructor",
              location: "Bangalore, Karnataka",
              phone: "+91 99999 33333",
              email: "shravya@example.com",
              image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
            },
            {
              _id: "supp_4",
              name: "Sempai Trisha",
              rank: "Black Belt 1st Dan",
              role: "Supporting Instructor",
              location: "Bangalore, Karnataka",
              phone: "+91 99999 44444",
              email: "trisha@example.com",
              image_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=300&auto=format&fit=crop"
            },
            {
              _id: "supp_5",
              name: "Sempai Phanindra Achari V",
              rank: "Black Belt 1st Dan",
              role: "Supporting Instructor",
              location: "Bangalore, Karnataka",
              phone: "+91 99999 55555",
              email: "phanindra@example.com",
              image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop"
            }
          ]);
        }

        if (newsRes && newsRes.ok) {
          const newsData = await newsRes.json();
          setNews(newsData);
        }
      } catch (error) {
        console.error("Failed to fetch dojo data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);



  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    const age = parseInt(studentAge);
    if (isNaN(age) || age < 4) {
      setBookingError("Karate classes are designed for ages 4 and above.");
      return;
    }

    try {
      setBookingSubmitting(true);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_name: studentName,
          student_age: age,
          phone: phone,
          program: program,
          date: bookingDate,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit booking request. Please check details.");
      }

      setBookingSuccess(true);
      setTimeout(() => {
        // Reset states
        setStudentName("");
        setStudentAge("");
        setPhone("");
        setBookingDate("");
        setBookingSuccess(false);
        setShowBookingModal(false);
      }, 2500);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Something went wrong.";
      setBookingError(errorMsg);
    } finally {
      setBookingSubmitting(false);
    }
  };

  // Extract unique cities from instructors to display in filters
  const cities = ["All", ...Array.from(new Set(instructors.map((inst) => {
    const parts = inst.location.split(",");
    return parts[parts.length - 1].trim();
  })))];

  const filteredInstructors = selectedCity === "All"
    ? instructors
    : instructors.filter((inst) => inst.location.toLowerCase().includes(selectedCity.toLowerCase()));

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-red-500 selection:text-white relative font-sans overflow-x-hidden transition-colors duration-300">
      {/* Background radial glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-red-500/5 dark:bg-red-900/10 blur-[150px] transition-all duration-300" />
        <div className="absolute bottom-[20%] right-[-15%] w-[60%] h-[60%] rounded-full bg-amber-500/5 dark:bg-amber-900/10 blur-[150px] transition-all duration-300" />
      </div>

      {/* Header / Navbar */}
      <header className="border-b border-border bg-header-bg backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group flex-shrink-0">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-red-600 to-amber-500 opacity-70 blur-sm group-hover:opacity-100 transition duration-350 animate-pulse" />
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
            <a href="#home" className="text-red-600 hover:text-red-700 transition-colors">Home</a>
            <a href="#about" className="text-muted hover:text-red-600 transition-colors">Path to Olympics</a>
            <a href="#instructors" className="text-muted hover:text-red-600 transition-colors">Instructors</a>
            <a href="#contact" className="text-muted hover:text-red-600 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-semibold text-muted hover:text-red-600 transition-colors">
              Login
            </a>
            <button
              onClick={() => setShowBookingModal(true)}
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white shadow-lg shadow-red-950/10 dark:shadow-red-950/50 hover:scale-[1.03] transition-all duration-200 active:scale-95 z-10 cursor-pointer"
            >
              Free Trial Class
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full mx-auto relative z-10">
        
        {/* HERO SECTION */}
        <section id="home" className="max-w-7xl mx-auto px-6 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight">
              Learn Real Martial Arts, <br />
              <span className="bg-gradient-to-r from-red-500 via-red-400 to-amber-500 bg-clip-text text-transparent">
                {dojoInfo?.name || "Okinawa Shotokon Karate Do"}
              </span>
            </h1>
            <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Discover self-defense, build bulletproof self-discipline, and walk the path towards local, national, and Olympic karate championships. Learn from highly experienced Senseis.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setShowBookingModal(true)}
                className="px-8 py-3.5 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-950/20 dark:shadow-red-950/40 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                Book Free Trial
              </button>
              <a
                href="#contact"
                className="px-8 py-3.5 rounded-xl font-bold bg-card border border-border hover:bg-slate-50 dark:hover:bg-slate-900 text-foreground transition-all duration-200"
              >
                Contact Dojo
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-foreground">100%</p>
                <p className="text-[10px] sm:text-xs text-muted uppercase tracking-wider font-mono">Self Defense Focused</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-red-500">Every 3m</p>
                <p className="text-[10px] sm:text-xs text-muted uppercase tracking-wider font-mono">Belt Grading Exams</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-amber-500">KIO / WKF</p>
                <p className="text-[10px] sm:text-xs text-muted uppercase tracking-wider font-mono">Official Affiliation</p>
              </div>
            </div>
          </div>

          {/* Hero Images Area */}
          <div className="lg:col-span-5 relative flex items-center justify-center h-[350px] sm:h-[450px]">
            {/* Soft background shape decoration */}
            <div className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-red-600/5 to-amber-500/5 dark:from-red-600/10 dark:to-amber-500/10 blur-3xl -z-10" />
            


            {/* Main Karate Practitioner Image */}
            <div className="relative w-[90%] h-full rounded-2xl overflow-hidden border border-border bg-card shadow-2xl flex items-center justify-center">
              <img
                src="/karate_practitioner.png"
                alt="Karate Practitioner Kick"
                className="object-cover w-full h-full object-center hover:scale-[1.03] transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop";
                }}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xs font-mono text-red-500 uppercase tracking-widest">Okinawa Shotokon</p>
                <h3 className="text-lg font-bold text-foreground">Traditional Kata & Kumite</h3>
              </div>
            </div>
          </div>
        </section>

        {/* AFFILIATIONS LOGO SECTION */}
        <section className="bg-card/45 border-y border-border py-8 relative overflow-hidden transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-[10px] font-mono text-muted uppercase tracking-widest mb-6">
              Recognized & Affiliated Organizations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 opacity-85">
              {dojoInfo?.affiliations.map((aff, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-xl text-xs font-semibold text-foreground shadow-sm hover:border-red-500/30 transition-all duration-205"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {aff.name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PATH TO OLYMPIC GAMES (PROGRAMS) */}
        <section id="about" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-mono text-red-500 uppercase tracking-widest">Training Methodology</h2>
            <p className="text-3xl sm:text-4xl font-black text-foreground">Path to Olympic Games</p>
            <p className="text-muted text-sm">
              We provide structured training programs designed to support our karatekas at every developmental stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Program 1 */}
            <div className="group rounded-2xl bg-card border border-border hover:border-card-hover-border p-8 flex flex-col justify-between shadow-xl transition-all duration-300 hover:translate-y-[-4px]">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  {/* Belt icon */}
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">Belt Grading</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Every 3 months, formal grading exams are conducted under authorized examiners to evaluate student progress and upgrade their belt ranks (Kyu titles).
                </p>
              </div>
              <button 
                onClick={() => setShowBookingModal(true)} 
                className="mt-6 text-xs font-semibold text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 group-hover:underline cursor-pointer"
              >
                Inquire Grading Info &rarr;
              </button>
            </div>

            {/* Program 2 */}
            <div className="group rounded-2xl bg-card border border-border hover:border-card-hover-border p-8 flex flex-col justify-between shadow-xl transition-all duration-300 hover:translate-y-[-4px]">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                  {/* Swords icon */}
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-amber-550 dark:group-hover:text-amber-450 transition-colors">Tournaments</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Students are trained in sport karate tactics (WKF rules) and sponsored to compete in District, Inter-State, National, and International tournaments.
                </p>
              </div>
              <button 
                onClick={() => setShowBookingModal(true)} 
                className="mt-6 text-xs font-semibold text-amber-550 hover:text-amber-600 dark:hover:text-amber-450 flex items-center gap-1 group-hover:underline cursor-pointer"
              >
                View Tournament Schedule &rarr;
              </button>
            </div>

            {/* Program 3 */}
            <div className="group rounded-2xl bg-card border border-border hover:border-card-hover-border p-8 flex flex-col justify-between shadow-xl transition-all duration-300 hover:translate-y-[-4px]">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  {/* Training icon */}
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">Class Training</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Our regular weekly classes focus on fitness, mental focus, basic techniques (Kihon), pre-arranged routines (Kata), and sparring applications (Bunkai).
                </p>
              </div>
              <button 
                onClick={() => setShowBookingModal(true)} 
                className="mt-6 text-xs font-semibold text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 group-hover:underline cursor-pointer"
              >
                Check Weekly Timings &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* INTERACTIVE BELT RANKING SHOWCASE */}
        <section id="belts" className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-xs font-mono text-red-500 uppercase tracking-widest">Kyu & Dan Progression</h2>
              <h3 className="text-3xl sm:text-4xl font-black text-foreground leading-tight">Interactive Belt Syllabus</h3>
              <p className="text-muted text-sm leading-relaxed">
                {"In Shotokon Karate, belts represent a student's technical growth, mental maturity, and duration of training. Click on any belt color to see the requirements and meaning of that level."}
              </p>

              {/* Belt Selector Bar */}
              <div className="flex flex-wrap gap-2.5">
                {Object.keys(beltData).map((colorKey) => {
                  const isActive = activeBelt === colorKey;
                  return (
                    <button
                      key={colorKey}
                      onClick={() => setActiveBelt(colorKey)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all border cursor-pointer ${
                        isActive 
                          ? "bg-red-600 border-red-500 text-white scale-[1.05]" 
                          : "bg-card border-border text-muted hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
                      }`}
                    >
                      {colorKey}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 sm:p-10 relative overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-500/5 blur-[80px]" />
              
              {/* Displaying active belt card details */}
              <div className="space-y-6 relative z-10 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-muted uppercase tracking-wider">RANK LEVEL</span>
                    <h4 className="text-2xl font-black text-foreground">{beltData[activeBelt].title}</h4>
                  </div>
                  <span className="px-3 py-1 rounded-md text-xs font-mono bg-background border border-border text-red-500 dark:text-red-400">
                    {beltData[activeBelt].kyu}
                  </span>
                </div>

                {/* Simulated Belt Strap Visual */}
                <div className="h-10 w-full rounded-md flex items-center justify-between overflow-hidden shadow-inner border border-border relative bg-background/50">
                  <div className={`absolute inset-y-0 left-0 w-[80%] ${beltData[activeBelt].color}`} />
                  <div className="absolute inset-y-0 right-0 w-[20%] bg-background flex items-center justify-center text-[10px] font-bold text-amber-500 border-l border-border">
                    {activeBelt === "black" ? "1st Dan" : "KYU"}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-mono text-muted uppercase tracking-wider block">SYLLABUS FOCUS</span>
                  <p className="text-card-foreground text-sm leading-relaxed">
                    {beltData[activeBelt].desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted">Minimum Training Period:</span>
                  <span className="text-xs font-mono text-foreground font-bold">
                    {activeBelt === "white" ? "None (Entry)" : activeBelt === "black" ? "3-4 Years" : "3-6 Months"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LEADERSHIP & TRUSTEES SECTION */}
        {trustees.length > 0 && (
          <section id="trustees" className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">Leadership & Administration</h2>
              <p className="text-3xl sm:text-4xl font-black text-foreground">Our Leadership</p>
              <p className="text-muted text-sm">
                The governing body guiding the vision, financial integrity, and growth of Sky Bound Martial Arts Academy.
              </p>
            </div>

            {/* Founder / President Section */}
            {trustees.filter(tr => tr.name.toLowerCase().includes("umapathi")).map((tr) => (
              <div key={tr._id} className="max-w-md mx-auto mb-12">
                <article className="group rounded-3xl bg-card border-2 border-red-500/20 hover:border-red-500 overflow-hidden flex flex-col items-center p-8 text-center shadow-2xl transition-all duration-305 hover:translate-y-[-4px]">
                  <span className="mb-3 px-3 py-1 rounded-full text-[9px] font-bold bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 uppercase tracking-widest">
                    Renshi / Chief Coach
                  </span>
                  <div className="relative w-36 h-36 rounded-full overflow-hidden border border-red-500/40 group-hover:border-red-500 ring-4 ring-red-500/10 mb-6 bg-background">
                    <img
                      src={tr.image_url}
                      alt={tr.name}
                      className="object-cover w-full h-full object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop";
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                    {tr.name}
                  </h3>
                  <p className="text-xs font-mono text-muted uppercase tracking-wider mt-1.5">
                    {tr.role}
                  </p>
                </article>
              </div>
            ))}

            {/* Other Trustees Section */}
            {trustees.filter(tr => !tr.name.toLowerCase().includes("umapathi")).length > 0 && (
              <div className="space-y-6 mt-16 pt-8 border-t border-border">
                <h4 className="text-center text-xs font-mono text-muted uppercase tracking-widest mb-8">Board Trustees</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center max-w-3xl mx-auto">
                  {trustees.filter(tr => !tr.name.toLowerCase().includes("umapathi")).map((tr) => (
                    <article
                      key={tr._id}
                      className="group rounded-3xl bg-card border border-border hover:border-card-hover-border overflow-hidden flex flex-col items-center p-6 text-center shadow-xl transition-all duration-300 hover:translate-y-[-4px]"
                    >
                      <div className="relative w-28 h-28 rounded-full overflow-hidden border border-border mb-4 bg-background">
                        <img
                          src={tr.image_url}
                          alt={tr.name}
                          className="object-cover w-full h-full object-center group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop";
                          }}
                        />
                      </div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                        {tr.name}
                      </h3>
                      <p className="text-xs font-mono text-muted uppercase tracking-wider mt-1">
                        {tr.role}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* FINEST COACHES SECTION */}
        <section id="instructors" className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3">
              <h2 className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">Elite Instructors</h2>
              <p className="text-3xl sm:text-4xl font-black text-foreground">Finest Coaches of India</p>
              <p className="text-muted text-sm max-w-xl">
                Our Senseis are affiliated with the Shotokon Karate-Do Sports Federation and carry decades of combined martial arts experience.
              </p>
            </div>

            {/* City Filters */}
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    selectedCity === city
                      ? "bg-red-500/10 border-red-500 text-red-650 dark:text-red-400"
                      : "bg-card border-border text-muted hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            /* Skeleton Loading State */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-3xl bg-card border border-border h-[380px] animate-pulse flex flex-col justify-between p-6">
                  <div className="w-full h-48 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-3 mt-4 flex-1">
                    <div className="h-6 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-md" />
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredInstructors.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border-2 border-dashed border-border bg-card/10">
              <p className="text-muted text-sm">No instructors found for {selectedCity}. You can add them in the admin dashboard.</p>
            </div>
          ) : (
            /* Instructors Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredInstructors.map((inst) => (
                <article
                  key={inst._id}
                  className="group rounded-3xl bg-card border border-border hover:border-card-hover-border overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 hover:translate-y-[-4px]"
                >
                  <div className="relative h-64 w-full overflow-hidden bg-background">
                    <img
                      src={inst.image_url}
                      alt={inst.name}
                      className="object-cover w-full h-full object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-85" />
                    
                    {/* Belt Tag */}
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-lg text-[10px] font-mono font-bold bg-background/80 border border-border text-amber-500 backdrop-blur-md">
                      {inst.rank}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest block">
                        {inst.role}
                      </span>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                        {inst.name}
                      </h3>
                      <p className="text-xs text-muted font-medium">
                        Location: {inst.location}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-muted font-mono">{inst.phone}</span>
                      <a
                        href={`tel:${inst.phone}`}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-background hover:bg-red-650 hover:text-white dark:hover:text-white text-foreground border border-border hover:border-red-650 transition-colors"
                      >
                        Contact Coach
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* SUPPORTING INSTRUCTORS SECTION */}
        {supportingInstructors.length > 0 && (
          <section id="supporting" className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <h2 className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">Supporting Team</h2>
              <p className="text-3xl sm:text-4xl font-black text-foreground">Supporting Instructors</p>
              <p className="text-muted text-sm">
                Our dedicated assistant coaches and trainers helping students master their karate basics.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
              {supportingInstructors.map((inst) => (
                <article
                  key={inst._id}
                  className="group rounded-2xl bg-card border border-border hover:border-card-hover-border p-4 flex flex-col items-center text-center shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
                >
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border mb-3 bg-background">
                    <img
                      src={inst.image_url}
                      alt={inst.name}
                      className="object-cover w-full h-full object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop";
                      }}
                    />
                  </div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors line-clamp-1">
                    {inst.name}
                  </h3>
                  <p className="text-[10px] font-mono text-muted uppercase tracking-wider mt-0.5">
                    {inst.role}
                  </p>
                  <span className="mt-2 px-2 py-0.5 rounded bg-background border border-border text-[9px] font-mono text-amber-505">
                    {inst.rank}
                  </span>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* LATEST NEWS & EVENTS SECTION */}
        <section id="news" className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">Dojo Activities</h2>
            <p className="text-3xl sm:text-4xl font-black text-foreground font-sans">News & Championships</p>
            <p className="text-muted text-sm">
              Stay updated with the latest tournaments, belt grading results, and special seminars conducted by our academy.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
              <div className="bg-card border border-border h-64 rounded-3xl" />
              <div className="bg-card border border-border h-64 rounded-3xl" />
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border-2 border-dashed border-border bg-card/10">
              <p className="text-muted text-sm">No announcements available yet. You can add them in the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {news.map((item) => (
                <article
                  key={item._id}
                  className="group rounded-3xl bg-card border border-border overflow-hidden flex flex-col sm:flex-row hover:border-card-hover-border transition-all duration-300 shadow-lg"
                >
                  <div className="w-full sm:w-2/5 h-48 sm:h-auto overflow-hidden relative bg-background">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop";
                      }}
                    />
                  </div>
                  <div className="p-6 w-full sm:w-3/5 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-muted font-mono">
                        <span>{item.date}</span>
                        <span className="text-red-500 dark:text-red-400 font-bold uppercase">{item.organizer}</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted text-xs leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="text-xs font-semibold text-red-550 hover:text-red-650 dark:hover:text-red-400 flex items-center gap-1 group-hover:underline self-start pt-2 cursor-pointer"
                    >
                      Inquire Details &rarr;
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* CONTACT & DOJO LOCATION MAP SECTION */}
        <section id="contact" className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Dojo Details & Map */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-3">
                <h2 className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">Visit Our Dojo</h2>
                <h3 className="text-3xl font-black text-foreground">Get in Touch</h3>
                <p className="text-muted text-sm">
                  We are open 6 days a week for training. Stop by for a free session or message us for batch details.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-card border border-border p-5 rounded-2xl space-y-1">
                  <span className="text-[10px] font-mono text-muted uppercase">Phone Contact</span>
                  <p className="text-sm font-bold text-foreground">{dojoInfo?.phone || "+91 85100 00838"}</p>
                </div>
                <div className="bg-card border border-border p-5 rounded-2xl space-y-1">
                  <span className="text-[10px] font-mono text-muted uppercase">Email Enquiries</span>
                  <p className="text-sm font-bold text-foreground">{dojoInfo?.email || "contact@internationalkarate.in"}</p>
                </div>
                <div className="bg-card border border-border p-5 rounded-2xl sm:col-span-2 space-y-1">
                  <span className="text-[10px] font-mono text-muted uppercase">Dojo Address</span>
                  <p className="text-sm font-semibold text-card-foreground">
                    {dojoInfo?.address || "X-1/32, Daal Mill Road, Budh Vihar, Phase-1, New Delhi-110086, India"}
                  </p>
                </div>
              </div>

              {/* Google Map iframe */}
              <div className="h-64 w-full rounded-2xl overflow-hidden border border-border shadow-lg">
                <iframe
                  title="Dojo Location Map"
                  src={dojoInfo?.map_embed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.4239857905183!2d77.098485!3d28.736785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d068593a201c1%3A0xe54fb7a28e932ec3!2sBudh%20Vihar%20Phase%20I%2C%20Budh%20Vihar%2C%20Delhi%2C%20110086!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>

            {/* Trial Class Enrollment Box */}
            <div className="lg:col-span-6 bg-card border border-border rounded-3xl p-8 relative flex flex-col justify-between shadow-xl">
              <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-red-500/5 blur-[80px]" />
              
              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-foreground">Enroll in a Free Trial</h4>
                  <p className="text-muted text-xs leading-relaxed">
                    First class is completely free. Fill this quick application form, and our coach will contact you within 24 hours to schedule your session.
                  </p>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase mb-1.5">{"Student's Full Name"}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Rohan Kumar"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-red-500 focus:ring-1 focus:ring-red-500 text-foreground placeholder-muted/50 outline-none text-sm transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-muted uppercase mb-1.5">{"Student's Age (Minimum 4)"}</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g., 8"
                        min="4"
                        value={studentAge}
                        onChange={(e) => setStudentAge(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-red-500 focus:ring-1 focus:ring-red-500 text-foreground placeholder-muted/50 outline-none text-sm transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-muted uppercase mb-1.5">Contact Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g., +91 99999 88888"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-red-500 focus:ring-1 focus:ring-red-500 text-foreground placeholder-muted/50 outline-none text-sm transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-muted uppercase mb-1.5">Preferred Program</label>
                      <select
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-red-500 text-foreground outline-none text-sm transition"
                      >
                        <option value="Regular Training">Regular Training (Weekly)</option>
                        <option value="Belt Grading">Belt Grading (Syllabus)</option>
                        <option value="Tournament Training">Tournament Training (Elite)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-muted uppercase mb-1.5">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-red-500 text-foreground outline-none text-sm transition"
                      />
                    </div>
                  </div>

                  {bookingError && (
                    <p className="text-xs text-red-500 font-mono bg-red-950/20 border border-red-900/30 p-2.5 rounded-lg">
                      {bookingError}
                    </p>
                  )}

                  {bookingSuccess && (
                    <p className="text-xs text-emerald-605 dark:text-emerald-400 font-mono bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-lg flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Class Booked successfully! Coach will call you shortly.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={bookingSubmitting || bookingSuccess}
                    className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    {bookingSubmitting && (
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    {bookingSubmitting ? "Submitting..." : bookingSuccess ? "Request Submitted!" : "Submit Free Trial Application"}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* POPUP MODAL FOR HEADER TRIAL BUTTON */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => {
                setShowBookingModal(false);
                setBookingError(null);
              }}
              className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xl font-black text-foreground">Join A Free Trial Session</h4>
                <p className="text-muted text-xs leading-relaxed">
                  First class is on us. Experience the training under senior Senseis.
                </p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-muted uppercase mb-1">{"Student's Full Name"}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Aarav Sharma"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-red-500 text-foreground placeholder-muted/50 outline-none text-sm transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase mb-1">{"Student's Age"}</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g., 7"
                      min="4"
                      value={studentAge}
                      onChange={(e) => setStudentAge(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-red-500 text-foreground placeholder-muted/50 outline-none text-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase mb-1">Contact Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g., +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-red-500 text-foreground placeholder-muted/50 outline-none text-sm transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase mb-1">Program</label>
                    <select
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-red-500 text-foreground outline-none text-sm transition"
                    >
                      <option value="Regular Training">Regular Training</option>
                      <option value="Belt Grading">Belt Grading</option>
                      <option value="Tournament Training">Tournament Training</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase mb-1">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-red-500 text-foreground outline-none text-sm transition"
                    />
                  </div>
                </div>

                {bookingError && (
                  <p className="text-xs text-red-500 font-mono bg-red-950/20 border border-red-900/30 p-2.5 rounded-lg">
                    {bookingError}
                  </p>
                )}

                {bookingSuccess && (
                  <p className="text-xs text-emerald-605 dark:text-emerald-450 font-mono bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Trial requested successfully! Sensei will call you soon.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={bookingSubmitting || bookingSuccess}
                  className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {bookingSubmitting && (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {bookingSubmitting ? "Scheduling..." : bookingSuccess ? "Booked!" : "Schedule My Free Trial Class"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-footer-bg py-12 text-muted text-xs font-sans transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          <div className="md:col-span-5 space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
              {dojoInfo?.name || "Okinawa Shotokon Karate Do"}
            </h4>
            <p className="text-muted text-xs leading-relaxed max-w-md">
              We provide authentic martial arts and self-defense training to students aged 4+ across India. Build speed, strength, and focus under GKSF affiliated Senseis.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono text-muted uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2 text-muted">
              <li><a href="#home" className="hover:text-red-500 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-red-500 transition-colors">Path to Olympic Games</a></li>
              <li><a href="#belts" className="hover:text-red-555 hover:text-red-500 transition-colors">Belt Syllabus</a></li>
              <li><a href="#instructors" className="hover:text-red-555 hover:text-red-500 transition-colors">Senseis & Coaches</a></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono text-muted uppercase tracking-widest">Office Hours</h4>
            <ul className="space-y-2 text-muted">
              <li>Monday - Friday: 5:00 PM - 8:30 PM</li>
              <li>Saturday: 8:00 AM - 11:30 AM</li>
              <li>Sunday: Weekly Off / Special Seminars</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono">
          <p>© {new Date().getFullYear()} {dojoInfo?.name || "Okinawa Shotokon"}. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-red-500/80">Affiliated with GKSF & KIO</span>
            <span className="text-border">|</span>
            <a href="/admin" className="hover:text-foreground">Admin Login</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
