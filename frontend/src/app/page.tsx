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
  const [selectedInstructor, setSelectedInstructor] = useState("");

  // Map Modal State
  const [showMapModal, setShowMapModal] = useState(false);

  // Selected Belt Info State
  const [activeBelt, setActiveBelt] = useState("white");

  // Carousel Pause State
  const [carouselPaused, setCarouselPaused] = useState(false);

  const handleInstructorClick = () => {
    setCarouselPaused(true);
    const timer = setTimeout(() => {
      setCarouselPaused(false);
    }, 5000);
    return () => clearTimeout(timer);
  };

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

    if (!selectedInstructor) {
      setBookingError("Please select an instructor.");
      return;
    }

    const age = parseInt(studentAge);
    if (isNaN(age) || age < 4) {
      setBookingError("Karate classes are designed for ages 4 and above.");
      return;
    }

    try {
      setBookingSubmitting(true);
      const res = await fetch("http://localhost:5000/api/bookings", {
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
          instructor_id: selectedInstructor,
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
        setSelectedInstructor("");
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
            <a href="/" className="text-red-600 hover:text-red-700 transition-colors">Home</a>
            <a href="/announcements" className="text-muted hover:text-red-600 transition-colors">Announcement</a>
            <a href="/belt-details" className="text-muted hover:text-red-600 transition-colors">Belt Details</a>
            <a href="/weapons" className="text-muted hover:text-red-600 transition-colors">Weapons</a>
            <a href="#instructors" className="text-muted hover:text-red-600 transition-colors">Instructors</a>
            <a href="#contact" className="text-muted hover:text-red-600 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="/login" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all text-sm">
              Login
            </a>
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

        {/* AFFILIATIONS CAROUSEL SECTION */}
        <section className="w-full bg-gradient-to-r from-background via-card/50 to-background py-12">
          <div className="max-w-7xl mx-auto px-6 mb-8">
            <div className="text-center space-y-2">
              <h2 className="text-xs font-mono text-red-500 uppercase tracking-widest">Recognized & Affiliated</h2>
              <p className="text-2xl font-black text-foreground">Our Partnerships</p>
            </div>
          </div>

          {/* Animated Carousel */}
          <div className="max-w-7xl mx-auto px-6">
            <style>{`
              @keyframes scroll {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(calc(-240px * 4));
                }
              }
              .carousel-wrapper {
                overflow: hidden;
              }
              .carousel-track {
                display: flex;
                animation: scroll 12s linear infinite;
                gap: 0;
              }
              .carousel-track:hover {
                animation-play-state: paused;
              }
              .carousel-logo {
                min-width: 240px;
                height: 120px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            `}</style>

            <div className="carousel-wrapper">
              <div className="carousel-track">
                {/* Set 1 */}
                <div className="carousel-logo">
                  <img
                    src="/shotokon-karate-do-sports-federation.jpeg"
                    alt="Shotokon"
                    className="h-20 object-contain"
                  />
                </div>
                <div className="carousel-logo">
                  <img
                    src="/karate-india-organisation-kio.png"
                    alt="Karate India"
                    className="h-20 object-contain"
                  />
                </div>
                <div className="carousel-logo">
                  <img
                    src="/martial-arts-games-federation-mgfi.webp"
                    alt="MGFI"
                    className="h-20 object-contain"
                  />
                </div>
                <div className="carousel-logo">
                  <img
                    src="/delhi-olympic-association.jpg"
                    alt="Delhi Olympics"
                    className="h-20 object-contain"
                  />
                </div>

                {/* Set 2 - Seamless repeat */}
                <div className="carousel-logo">
                  <img
                    src="/shotokon-karate-do-sports-federation.jpeg"
                    alt="Shotokon"
                    className="h-20 object-contain"
                  />
                </div>
                <div className="carousel-logo">
                  <img
                    src="/karate-india-organisation-kio.png"
                    alt="Karate India"
                    className="h-20 object-contain"
                  />
                </div>
                <div className="carousel-logo">
                  <img
                    src="/martial-arts-games-federation-mgfi.webp"
                    alt="MGFI"
                    className="h-20 object-contain"
                  />
                </div>
                <div className="carousel-logo">
                  <img
                    src="/delhi-olympic-association.jpg"
                    alt="Delhi Olympics"
                    className="h-20 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOUNDER & QUOTE SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Photo */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-amber-500 rounded-full opacity-75 blur-xl" />
                <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-red-500/30 bg-card shadow-2xl flex items-center justify-center">
                  <img
                    src="/umapathi_ss.png"
                    alt="Founder"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right - Quote & Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">Our Founder</h2>
                <div className="space-y-3">
                  <p className="text-xl sm:text-2xl font-black text-foreground leading-tight italic">
                    "Discipline is the bridge between goals and accomplishment. We build champions of character."
                  </p>
                  <div className="space-y-0.5 pt-4 border-t border-border">
                    <p className="text-base font-bold text-foreground">Renshi Umapathi S S</p>
                    <p className="text-xs text-red-500 uppercase tracking-wider font-semibold">Founder, President & Chief Coach</p>
                    <p className="text-[10px] text-muted">Sky Bound Martial Arts Academy</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card border border-border p-3 rounded-lg space-y-1">
                  <p className="text-xl font-black text-red-500">25+</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Years Experience</p>
                </div>
                <div className="bg-card border border-border p-3 rounded-lg space-y-1">
                  <p className="text-xl font-black text-amber-500">1000+</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Students Trained</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INSTRUCTORS SECTION */}
        {instructors.length > 0 && (
          <section id="instructors" className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">Elite Instructors</h2>
              <p className="text-3xl sm:text-4xl font-black text-foreground">Our Expert Coaches</p>
              <p className="text-muted text-sm">
                Highly qualified Senseis affiliated with the Shotokon Karate-Do Sports Federation.
              </p>
            </div>

            <style>{`
              @keyframes scrollInstructors {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(calc(-280px * ${instructors.length}));
                }
              }
              .instructors-track {
                display: flex;
                animation: scrollInstructors 30s linear infinite;
                gap: 3rem;
              }
              .instructors-track.paused {
                animation-play-state: paused;
              }
            `}</style>

            {/* Instructors Carousel - Auto-scrolling Left to Right */}
            <div className="overflow-hidden">
              <div className={`instructors-track ${carouselPaused ? 'paused' : ''}`}>
                {[...instructors, ...instructors].map((inst, idx) => (
                  <div
                    key={`${inst._id}-${idx}`}
                    onClick={handleInstructorClick}
                    className="text-center space-y-3 flex flex-col items-center flex-shrink-0 w-72 cursor-pointer">
                    {/* Circular Image */}
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-red-500/30 hover:border-red-500 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/20 flex items-center justify-center bg-background">
                        <img
                          src={inst.image_url}
                          alt={inst.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop";
                          }}
                        />
                      </div>
                    </div>

                    {/* Info Below Image */}
                    <div className="space-y-1.5 max-w-xs">
                      {/* Name */}
                      <h3 className="text-base font-bold text-foreground">
                        {inst.name}
                      </h3>

                      {/* Location */}
                      <p className="text-xs text-muted">
                        {inst.location}
                      </p>

                      {/* Belt */}
                      <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        {inst.rank}
                      </p>

                      {/* Phone */}
                      <a
                        href={`tel:${inst.phone}`}
                        className="text-xs text-red-500 hover:text-red-600 font-semibold transition-colors"
                      >
                        {inst.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

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

                <div>
                  <label className="block text-[10px] font-mono text-muted uppercase mb-1">Select Instructor / Admin</label>
                  <select
                    value={selectedInstructor}
                    onChange={(e) => setSelectedInstructor(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-red-500 text-foreground outline-none text-sm transition"
                  >
                    <option value="">Choose an instructor or admin...</option>
                    {instructors.length > 0 && (
                      <>
                        <optgroup label="Instructors">
                          {instructors.map((inst) => (
                            <option key={inst._id} value={inst._id}>
                              {inst.name} - {inst.rank}
                            </option>
                          ))}
                        </optgroup>
                      </>
                    )}
                  </select>
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
      <footer id="contact" className="mt-auto bg-slate-950 py-16 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Contact Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact Us</h4>
              <div className="space-y-3">
                <div
                  className="flex items-start gap-3 cursor-pointer hover:text-red-400 transition-colors group"
                  onClick={() => setShowMapModal(true)}
                >
                  <span className="text-red-500 text-lg mt-1">📍</span>
                  <p className="text-xs leading-relaxed text-gray-300 group-hover:text-red-400">
                    {dojoInfo?.address || "X-1/32, Daal Mill Road, Budh Vihar, Phase-1, New Delhi-110086, India"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-red-500 text-lg">📞</span>
                  <a href={`tel:${dojoInfo?.phone}`} className="text-gray-300 hover:text-red-400 transition-colors">
                    {dojoInfo?.phone || "+91 85100 00838"}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 text-lg">✉️</span>
                  <a href={`mailto:${dojoInfo?.email}`} className="text-gray-300 hover:text-red-400 transition-colors break-all">
                    {dojoInfo?.email || "contact@skyboundkarate.in"}
                  </a>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">About</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#home" className="hover:text-red-400 transition-colors">Home</a></li>
                <li><a href="#home" className="hover:text-red-400 transition-colors">About Us</a></li>
                <li><a href="#home" className="hover:text-red-400 transition-colors">Our Mission</a></li>
                <li><a href="#home" className="hover:text-red-400 transition-colors">Testimonials</a></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#home" className="hover:text-red-400 transition-colors">Programs</a></li>
                <li><a href="#home" className="hover:text-red-400 transition-colors">Schedule</a></li>
                <li><a href="#home" className="hover:text-red-400 transition-colors">Pricing</a></li>
                <li><a href="#home" className="hover:text-red-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Info Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Hours</h4>
              <ul className="space-y-2 text-gray-300 text-xs">
                <li>Mon - Fri: 5:00 PM - 8:30 PM</li>
                <li>Saturday: 8:00 AM - 11:30 AM</li>
                <li>Sunday: Off / Seminars</li>
                <li className="pt-2">Phone: 6 days a week</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-gray-400">© {new Date().getFullYear()} {dojoInfo?.name || "Okinawa Shotokon"}. All Rights Reserved.</p>
            <span className="text-[10px] text-red-500">Affiliated with GKSF & KIO</span>
          </div>
        </div>
      </footer>

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
            <div className="h-96 w-full relative">
              <button
                onClick={() => setShowMapModal(false)}
                className="absolute top-4 right-4 z-10 bg-slate-950/80 text-white rounded-full p-2 hover:bg-slate-950 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <iframe
                title="Dojo Location"
                src={dojoInfo?.map_embed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.4239857905183!2d77.098485!3d28.736785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d068593a201c1%3A0xe54fb7a28e932ec3!2sBudh%20Vihar%20Phase%20I%2C%20Budh%20Vihar%2C%20Delhi%2C%20110086!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
