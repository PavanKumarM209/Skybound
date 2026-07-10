"use client";

import { useEffect, useRef, useState } from "react";

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
  instagram?: string;
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
  const [recognizationImages] = useState<string[]>([
    "/recognization/logo1_kska.png",
    "/recognization/logo2_wako_india.png",
    "/recognization/logo3_khelo_india.png",
    "/recognization/logo4_skif.png",
    "/recognization/logo5_sai.png",
    "/recognization/logo6_karate_india.png",
  ]);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);



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
  const [minDate, setMinDate] = useState("");

  // Map Modal State
  const [showMapModal, setShowMapModal] = useState(false);

  // Selected Belt Info State
  const [activeBelt, setActiveBelt] = useState("white");

  // Hero image slideshow
  const heroImages = [
    "/images/image copy 5.png",
    "/images/image.png",
    "/images/image copy.png",
    "/images/image copy 2.png",
    "/images/image copy 3.png",
    "/images/image copy 4.png",
    "/images/image copy 6.png",
    "/images/image copy 7.png",
    "/images/image copy 8.png",
    "/images/image copy 9.png",
  ];
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPrev, setHeroPrev] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((i) => {
        setHeroPrev(i);
        return (i + 1) % heroImages.length;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const carouselScrollRef = useRef<HTMLDivElement>(null); // outer overflow-hidden div
  const carouselInnerRef = useRef<HTMLDivElement>(null);  // inner flex div with cards
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [CARDS_VISIBLE, setCardsVisible] = useState(4);
  useEffect(() => {
    const update = () => setCardsVisible(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const scrollToIndex = (idx: number) => {
    const scroller = carouselScrollRef.current;
    const inner = carouselInnerRef.current;
    if (!scroller || !inner) return;
    const card = inner.children[idx] as HTMLElement;
    if (card) scroller.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  };

  const scrollInstructors = (dir: "left" | "right") => {
    setCarouselPaused(true);
    setCarouselIndex((prev) => {
      const max = Math.max(0, instructors.length - CARDS_VISIBLE);
      const next = dir === "right" ? Math.min(prev + 1, max) : Math.max(prev - 1, 0);
      setTimeout(() => scrollToIndex(next), 0);
      return next;
    });
    setTimeout(() => setCarouselPaused(false), 3000);
  };

  useEffect(() => {
    if (instructors.length === 0) return;
    if (carouselPaused) return;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => {
        const max = Math.max(0, instructors.length - CARDS_VISIBLE);
        if (prev >= max) return prev;
        const next = prev + 1;
        setTimeout(() => scrollToIndex(next), 0);
        return next;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [instructors.length, carouselPaused]);

  const handleInstructorClick = () => {
    setCarouselPaused(true);
    setTimeout(() => setCarouselPaused(false), 5000);
  };

  const beltData: Record<string, { title: string; kyu: string; desc: string; color: string; border: string }> = {
    white: {
      title: "White Belt",
      kyu: "10th Kyu",
      desc: "Foundation, purity, and the beginning of a practitioner's martial arts journey. Focuses on basic stances, blocks, and strikes.",
      color: "bg-white text-slate-900 border-slate-300 border",
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
      border: "border-amber-950"
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
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setMinDate(`${yyyy}-${mm}-${dd}`);

    async function loadData() {
      try {
        setLoading(true);
        const [infoRes, instRes, newsRes, trusteeRes, supportingRes] = await Promise.all([
          fetch("/api/dojo-info").catch(() => null),
          fetch("/api/instructors").catch(() => null),
          fetch("/api/news").catch(() => null),
          fetch("/api/trustees").catch(() => null),
          fetch("/api/supporting-instructors").catch(() => null),
        ]);

        if (infoRes && infoRes.ok) {
          const infoData = await infoRes.json();
          setDojoInfo(infoData);
        } else {
          setDojoInfo({
            name: "Sky Bound Martial Arts Academy",
            phone: "+91 90357 07028",
            email: "skyboundmartialartsacademy@gmail.com",
            address: "Chandu Dance Studio, near Mandara school, Doddabidarakallu, Bengaluru, Karnataka 560073",
            instagram: "sky_bound_martial_arts_academy",
            map_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.685387063688!2d77.5029497!3d13.0238805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3d5ab7d018f5%3A0x3a89d87e00454a35%2sChandu+Dance+Studio!5e0!3m2!1sen!2sin!4v1700000000000",
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
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0 max-w-[70%] md:max-w-[260px]">
            <div className="relative group flex-shrink-0">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-red-600 to-amber-500 opacity-70 blur-sm group-hover:opacity-100 transition duration-350 animate-pulse" />
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
            <a href="#instructors" className="text-muted hover:text-red-600 transition-colors whitespace-nowrap">Instructors</a>
            <a href="#contact" className="text-muted hover:text-red-600 transition-colors whitespace-nowrap">Contact</a>
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
          <div className="md:hidden border-t border-border bg-header-bg/95 backdrop-blur-md px-6 py-4 space-y-4 animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-4 text-sm font-semibold">
              <a href="/" onClick={() => setIsMenuOpen(false)} className="text-red-600 hover:text-red-700 py-1 transition-colors">Home</a>
              <a href="/announcements" onClick={() => setIsMenuOpen(false)} className="text-muted hover:text-red-600 py-1 transition-colors">Announcement</a>
              <a href="/belt-details" onClick={() => setIsMenuOpen(false)} className="text-muted hover:text-red-600 py-1 transition-colors">Belt Details</a>
              <a href="/weapons" onClick={() => setIsMenuOpen(false)} className="text-muted hover:text-red-600 py-1 transition-colors">Weapons</a>
              <a href="#instructors" onClick={() => setIsMenuOpen(false)} className="text-muted hover:text-red-600 py-1 transition-colors">Instructors</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-muted hover:text-red-600 py-1 transition-colors">Contact</a>
              <a href="/login" onClick={() => setIsMenuOpen(false)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg text-center transition-all text-sm inline-block w-full">
                Login
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full mx-auto relative z-10">
        
        {/* HERO SECTION */}
        <section id="home" className="max-w-7xl mx-auto px-6 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight">
              Learn Real Martial Arts, <br />
              <span className="bg-gradient-to-r from-red-500 via-red-400 to-amber-500 bg-clip-text text-transparent">
                {dojoInfo?.name || "Sky Bound Martial Arts Academy"}
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
            <div className="flex flex-wrap justify-between gap-4 pt-8 border-t border-border max-w-md mx-auto lg:mx-0">
              <div className="flex-1 min-w-[90px]">
                <p className="text-lg sm:text-2xl md:text-3xl font-black text-foreground">100%</p>
                <p className="text-[9px] sm:text-xs text-muted uppercase tracking-wider font-mono">Self Defense Focused</p>
              </div>
              <div className="flex-1 min-w-[110px]">
                <p className="text-lg sm:text-2xl md:text-3xl font-black text-red-500">Every 6 months</p>
                <p className="text-[9px] sm:text-xs text-muted uppercase tracking-wider font-mono">Belt Grading Exams</p>
              </div>
              <div className="flex-1 min-w-[90px]">
                <p className="text-lg sm:text-2xl md:text-3xl font-black text-amber-500">WKF</p>
                <p className="text-[9px] sm:text-xs text-muted uppercase tracking-wider font-mono">Official Affiliation</p>
              </div>
            </div>
          </div>

          {/* Hero Images Area */}
          <div className="lg:col-span-5 order-1 lg:order-2 relative flex items-center justify-center h-[350px] sm:h-[450px]">
            {/* Soft background shape decoration */}
            <div className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-red-600/5 to-amber-500/5 dark:from-red-600/10 dark:to-amber-500/10 blur-3xl -z-10" />
            


            {/* Hero Slideshow */}
            <div className="relative w-[90%] h-full rounded-2xl overflow-hidden border border-border bg-card shadow-2xl">
              {/* Previous image fading out */}
              {heroPrev !== null && (
                <img
                  key={`prev-${heroPrev}`}
                  src={heroImages[heroPrev]}
                  alt="Karate Training"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 opacity-0"
                />
              )}
              {/* Current image fading in */}
              <img
                key={`cur-${heroIndex}`}
                src={heroImages[heroIndex]}
                alt="Karate Training"
                className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 opacity-100"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

              {/* Dot indicators */}
              <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-1.5 z-10">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setHeroPrev(heroIndex); setHeroIndex(i); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIndex ? "bg-red-500 w-4" : "bg-white/40 w-1.5"}`}
                  />
                ))}
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-10">
                <p className="text-xs font-mono text-red-500 uppercase tracking-widest">Sky Bound Martial Arts</p>
                <h3 className="text-lg font-bold text-foreground">Traditional Kata & Kumite</h3>
              </div>
            </div>
          </div>
        </section>

        {/* AFFILIATIONS CAROUSEL SECTION */}
        <section className="w-full bg-gradient-to-r from-background via-card/50 to-background py-12">
          <div className="text-center space-y-2 mb-8 px-6">
            <h2 className="text-xs font-mono text-red-500 uppercase tracking-widest">Recognized & Affiliated</h2>
            <p className="text-2xl font-black text-foreground">Our Recognitions</p>
          </div>

          {/* Animated Carousel - full width */}
          <div className="w-full overflow-hidden">
            <style>{`
              @keyframes recog-scroll {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .recog-track {
                display: flex;
                width: max-content;
                animation: recog-scroll ${Math.max(12, recognizationImages.length * 3)}s linear infinite;
              }
              .recog-track:hover {
                animation-play-state: paused;
              }
              .recog-logo {
                min-width: 200px;
                height: 120px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 2rem;
              }
            `}</style>
            <div className="recog-track">
              {[...recognizationImages, ...recognizationImages].map((imgUrl, idx) => (
                <div key={idx} className="recog-logo">
                  <img
                    src={imgUrl}
                    alt={`Recognition ${idx}`}
                    className="h-20 max-w-[180px] object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => setSelectedGalleryImage(imgUrl)}
                  />
                </div>
              ))}
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
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-red-500/30 bg-card shadow-2xl flex items-center justify-center">
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
            <div className="space-y-6 relative z-10">
              <div className="space-y-4">
                <h2 className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">Our Founder</h2>
                <div className="space-y-3">
                  <p className="text-xl sm:text-2xl font-black text-foreground leading-tight italic">
                    "Discipline is the bridge between goals and accomplishment. We build champions of character."
                  </p>
                  <div className="space-y-0.5 pt-4 border-t border-border">
                    <p className="text-xl sm:text-2xl font-black text-foreground">Master Umapathi S S</p>
                    <p className="text-xs text-red-500 uppercase tracking-wider font-semibold">Founder, President & Chief Coach</p>
                <p className="text-[10px] text-muted block">Sky Bound Martial Arts Academy</p>
                    <div className="pt-2 flex flex-col space-y-1 text-xs">
                      <a href="tel:+919035707028" className="text-red-500 hover:text-red-600 font-semibold transition-colors flex items-center gap-1.5 w-fit">
                        <svg className="w-3.5 h-3.5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 01-7.147-7.147c-.155-.441.011-.928.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        +91 90357 07028
                      </a>
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=ussumesh@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 hover:text-red-600 font-semibold transition-colors flex items-center gap-1.5 w-fit"
                      >
                        <svg className="w-3.5 h-3.5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        ussumesh@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card border border-border p-3 rounded-lg space-y-1">
                  <p className="text-xl font-black text-red-500">30+</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Years of Experience</p>
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
          <section id="instructors" className="py-20 border-t border-border">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3 px-6">
              <h2 className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">Elite Instructors</h2>
              <p className="text-3xl sm:text-4xl font-black text-foreground">Our Expert Coaches</p>
              <p className="text-muted text-sm">
                Highly qualified Senseis affiliated with the Shotokon Karate-Do Sports Federation.
              </p>
            </div>

            {/* Instructors Carousel - Auto-scrolling right to left */}
            <div className="relative px-8">
              {/* Left Arrow */}
              <button
                onClick={() => scrollInstructors("left")}
                disabled={carouselIndex === 0}
                className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-background border border-border shadow-lg hover:border-red-500 hover:text-red-500 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-foreground"
                aria-label="Scroll left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="overflow-x-auto w-full scrollbar-hide" ref={carouselScrollRef} style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}>
              <div className="flex gap-6 sm:gap-10" style={{ width: "max-content" }} ref={carouselInnerRef}>
                {instructors.map((inst, idx) => (
                  <div
                    key={inst._id}
                    onClick={handleInstructorClick}
                    style={{ scrollSnapAlign: "start" }}
                    className="text-center space-y-3 flex flex-col items-center flex-shrink-0 w-56 sm:w-64 lg:w-72 cursor-pointer">
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

                      {/* Role */}
                      {inst.role && (
                        <p className="text-xs font-semibold text-red-500">
                          {inst.role}
                        </p>
                      )}

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

              {/* Right Arrow */}
              <button
                onClick={() => scrollInstructors("right")}
                disabled={carouselIndex >= instructors.length - CARDS_VISIBLE}
                className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-background border border-border shadow-lg hover:border-red-500 hover:text-red-500 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-foreground"
                aria-label="Scroll right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </section>
        )}



      </main>

      {/* POPUP MODAL FOR HEADER TRIAL BUTTON */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl relative">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <optgroup label="Instructors">
                        {instructors.map((inst) => (
                          <option key={inst._id} value={inst._id}>
                            {inst.name} - {inst.rank}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="Master Class / Admin">
                      <option value="umapathi_master_class">Umapathi Master Class</option>
                    </optgroup>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      min={minDate}
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
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-lg flex items-center gap-2">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mb-12">
            {/* Contact Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact Us</h4>
              <div className="space-y-3">
                <a
                  href="https://maps.app.goo.gl/DAb6nLMFRbYg9wGUA?g_st=aw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 hover:text-red-400 transition-colors group"
                >
                  <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-xs leading-relaxed text-gray-300 group-hover:text-red-400">
                    {dojoInfo?.address || "Chandu Dance Studio, near Mandara school, Doddabidarakallu, Bengaluru, Karnataka 560073"}
                  </p>
                </a>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${dojoInfo?.phone || "+919035707028"}`} className="text-gray-300 hover:text-red-400 transition-colors">
                    {dojoInfo?.phone || "+91 90357 07028"}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${dojoInfo?.email || "skyboundmartialartsacademy@gmail.com"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-red-400 transition-colors break-all"
                  >
                    {dojoInfo?.email || "skyboundmartialartsacademy@gmail.com"}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <a href={`https://instagram.com/${dojoInfo?.instagram || "sky_bound_martial_arts_academy"}`} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-red-400 transition-colors">
                    {dojoInfo?.instagram || "sky_bound_martial_arts_academy"}
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

          <div className="pt-8 flex flex-col items-center justify-center gap-1.5 text-center">
            <p className="text-[10px] text-gray-400">
              © {new Date().getFullYear()} {dojoInfo?.name || "Sky Bound Martial Arts Academy"}. All Rights Reserved.
            </p>
            <p className="text-[10px] text-red-500/80 font-medium">
              Developed by @Pavan Kumar M
            </p>
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

      {/* GALLERY LIGHTBOX MODAL */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xs p-4" onClick={() => setSelectedGalleryImage(null)}>
          <div className="relative max-w-4xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedGalleryImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors p-2 text-sm font-black cursor-pointer flex items-center gap-1 bg-slate-900/50 px-3 py-1.5 rounded-xl border border-white/10"
            >
              <span>Close</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-1 max-h-[80vh] flex items-center justify-center">
              <img
                src={selectedGalleryImage}
                alt="Selected Recognition"
                className="max-h-[75vh] max-w-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
