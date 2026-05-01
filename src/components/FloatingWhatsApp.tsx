'use client';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  
  // Hide on admin routes
  if (pathname?.startsWith('/mahima') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <a 
      href="https://wa.me/94765646270" 
      className="fixed bottom-8 right-8 w-16 h-16 bg-[#25d366] rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(37,211,102,0.4)] z-[1000] hover:scale-110 transition-transform"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact on WhatsApp"
    >
      <i className="fab fa-whatsapp text-3xl"></i>
    </a>
  );
}
