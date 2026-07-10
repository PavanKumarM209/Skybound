"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";

interface NewsItem {
  _id?: string;
  title: string;
  organizer: string;
  date: string;
  description: string;
  image_url: string;
}

const renderFormattedDescription = (text: string) => {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 font-sans">
      {lines.map((line, index) => {
        const cleanLine = line.replace(/^\u200b/, '').trim();
        if (!cleanLine) return <div key={index} className="h-2" />;

        // Check if it's a bullet point
        if (cleanLine.startsWith('-') || cleanLine.startsWith('•')) {
          const content = cleanLine.substring(1).trim();
          return (
            <div key={index} className="flex items-start gap-2 pl-2 text-muted">
              <span className="text-red-500 font-bold mt-0.5">•</span>
              <span className="text-xs md:text-sm">{content}</span>
            </div>
          );
        }

        // Check if there is a colon
        const colonIndex = cleanLine.indexOf(':');
        if (colonIndex > 0) {
          const label = cleanLine.substring(0, colonIndex).trim();
          const value = cleanLine.substring(colonIndex + 1).trim();

          let labelClass = "font-bold text-foreground text-xs md:text-sm";
          let valueClass = "text-muted text-xs md:text-sm";

          const lowerLabel = label.toLowerCase();
          
          if (lowerLabel.includes('phone') || lowerLabel.includes('email') || lowerLabel.includes('contact')) {
            valueClass = "font-bold text-red-600 dark:text-red-400 text-xs md:text-sm";
          } else if (lowerLabel.includes('guest') || lowerLabel.includes('organizer') || lowerLabel.includes('organised')) {
            valueClass = "font-bold text-foreground text-xs md:text-sm";
          } else if (lowerLabel.includes('dates') || lowerLabel.includes('venue')) {
            valueClass = "font-semibold text-foreground/80 text-xs md:text-sm";
          }

          return (
            <div key={index} className="leading-relaxed">
              <span className={labelClass}>{label}: </span>
              <span className={valueClass}>{value}</span>
            </div>
          );
        }

        // Header or plain line (e.g. title)
        const isTitleLine = index === 0;
        return (
          <div 
            key={index} 
            className={isTitleLine 
              ? "font-extrabold text-foreground border-b border-border pb-1 mb-2 text-sm md:text-base" 
              : "font-semibold text-foreground/85 text-xs md:text-sm mt-1"
            }
          >
            {cleanLine}
          </div>
        );
      })}
    </div>
  );
};

export default function Announcements() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black text-foreground">Announcements</h1>
          <p className="text-muted text-lg">Latest news and updates from Skybound Academy</p>
        </div>

        {loading ? (
          <div className="text-center text-muted">Loading announcements...</div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <div key={item._id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop";
                  }}
                />
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted">{item.date} • {item.organizer}</p>
                  <div className="text-sm">{renderFormattedDescription(item.description)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted">No announcements available</div>
        )}
        </div>
      </main>
    </>
  );
}
