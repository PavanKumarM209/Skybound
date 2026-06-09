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

export default function Announcements() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/news");
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
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop";
                  }}
                />
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted">{item.date} • {item.organizer}</p>
                  <p className="text-sm text-muted">{item.description}</p>
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
