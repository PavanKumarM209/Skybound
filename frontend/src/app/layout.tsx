import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skybound Martial Arts Academy | Best Karate Class in Bengaluru",
  description: "Skybound Martial Arts Academy is the best karate & martial arts class near or in Yelahanka, Bengaluru. Join today for Okinawa Shotokan Karate-Do, self-defense training, and championship coaching.",
  keywords: [
    "Skybound Martial Arts Academy",
    "best martial arts class near or in Yelahanka",
    "best karate class in Bengaluru",
    "Skybound",
    "Karate class Yelahanka",
    "Martial arts Bangalore",
    "Self defense training Bengaluru",
    "Shotokan Karate Bangalore"
  ],
  openGraph: {
    title: "Skybound Martial Arts Academy",
    description: "Learn real martial arts from experienced Senseis at Skybound in Yelahanka, Bengaluru.",
    url: "https://skyboundmartialarts.online",
    siteName: "Skybound Martial Arts Academy",
    locale: "en_IN",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
