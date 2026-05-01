import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export const metadata: Metadata = {
  title: "Neon Calc LK | Premium Casio Calculators & Electronics Sri Lanka",
  description: "Sri Lanka's #1 destination for authentic Casio calculators, scientific calculators, and premium electronics. Island-wide delivery. 100% genuine products. Shop online now.",
  keywords: ["Casio calculator Sri Lanka", "scientific calculator Sri Lanka", "buy calculator online Sri Lanka", "Casio FX-991 Sri Lanka", "Neon Calc LK", "premium electronics Sri Lanka"],
  authors: [{ name: "Neon Calc LK" }],
  openGraph: {
    title: "Neon Calc LK | Premium Casio Calculators Sri Lanka",
    description: "Sri Lanka's #1 destination for authentic Casio calculators and electronics. Island-wide delivery. Shop online now.",
    url: "https://neoncalc.lk",
    siteName: "Neon Calc LK",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Neon Calc LK - Premium Electronics",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neon Calc LK | Premium Casio Calculators Sri Lanka",
    description: "Sri Lanka's #1 destination for authentic Casio calculators. Island-wide delivery.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Navbar />
        {children}
        <Footer />
        
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
