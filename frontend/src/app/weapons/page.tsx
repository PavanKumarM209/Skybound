"use client";

import Header from "@/components/Header";

export default function Weapons() {
  const techniques = [
    {
      title: "Traditional Kata",
      desc: "Choreographed sequences of movements that combine various techniques. Essential for building muscle memory, balance, and form.",
      icon: "🥋"
    },
    {
      title: "Kumite (Sparring)",
      desc: "Free-form fighting practice between partners. Develops practical fighting skills, timing, distance management, and reactive abilities.",
      icon: "⚔️"
    },
    {
      title: "Shotokon Style",
      desc: "Dynamic and powerful movements emphasizing deep stances and strong strikes. Focuses on both offensive and defensive techniques.",
      icon: "💥"
    },
    {
      title: "Kihon (Basics)",
      desc: "Fundamental techniques including punches, kicks, and blocks. The foundation upon which all other techniques are built.",
      icon: "🛡️"
    }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black text-foreground">Kata & Kumite</h1>
          <p className="text-muted text-lg">Master the techniques of traditional Karate</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {techniques.map((tech, idx) => (
            <div key={idx} className="bg-card border border-border rounded-2xl p-8 space-y-4 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">{tech.icon}</div>
              <h3 className="text-2xl font-bold text-foreground">{tech.title}</h3>
              <p className="text-muted leading-relaxed">{tech.desc}</p>
            </div>
          ))}
        </div>

        {/* Traditional Kata List */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-foreground mb-8 text-center">Traditional Katas</h2>
          <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Gekisai Dai Ichi",
                "Gekisai Dai Ni",
                "Saifa",
                "Seiyunchin",
                "Shisochin",
                "Sanseru",
                "Sepai",
                "Kihon Pattren"
              ].map((kata, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-foreground font-semibold">{kata}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </main>
    </>
  );
}
