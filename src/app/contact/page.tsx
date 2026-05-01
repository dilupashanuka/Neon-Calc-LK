import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, Send } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import ContactForm from '@/components/ContactForm';

export default async function ContactPage() {
  const supabase = await createClient();
  
  // Fetch settings safely
  let settings = null;
  try {
    const { data } = await supabase.from('site_settings').select('*').single();
    settings = data;
  } catch (e) {
    // ignore error if table doesn't exist yet
  }

  const phone = settings?.phone || '078 939 5851';
  const whatsapp = settings?.whatsapp || '+94 76 564 6270';
  const email = settings?.email || 'support@neoncalc.lk';
  const fbLink = settings?.fb_link || 'https://facebook.com/neoncalclk';
  // format whatsapp for link (remove spaces and +)
  const waLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`;

  return (
    <div className="pt-32 md:pt-40 pb-20 min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-[-1] opacity-20 pointer-events-none">
        <div className="absolute top-[30%] left-[5%] w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-blue-900/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20 md:mb-24">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">ESTABLISH <span className="text-primary">CONTACT</span></h1>
          <p className="text-text-dim text-lg md:text-xl max-w-2xl mx-auto">
            Our elite support team is on standby to assist you with any inquiries or technical guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="group neon-card !p-8 flex items-center gap-8 hover:bg-white/5 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all group-hover:scale-110">
                <Phone size={28} />
              </div>
              <div>
                <h4 className="text-white font-bold text-xl mb-1 uppercase tracking-wider text-sm">Direct Line</h4>
                <p className="text-text-dim font-mono text-lg group-hover:text-white transition-colors">{phone}</p>
              </div>
            </div>
            
            <a href={waLink} target="_blank" rel="noreferrer" className="block no-underline">
              <div className="group neon-card !p-8 flex items-center gap-8 hover:bg-white/5 transition-all cursor-pointer border-[#25d366]/20 hover:border-[#25d366]/50">
                <div className="w-16 h-16 bg-[#25d366]/10 rounded-2xl flex items-center justify-center text-[#25d366] group-hover:bg-[#25d366] group-hover:text-white transition-all group-hover:scale-110 shadow-[0_0_20px_rgba(37,211,102,0)] group-hover:shadow-[0_0_30px_rgba(37,211,102,0.4)]">
                  <MessageCircle size={28} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xl mb-1 uppercase tracking-wider text-sm">WhatsApp Priority</h4>
                  <p className="text-text-dim font-mono text-lg group-hover:text-white transition-colors">{whatsapp}</p>
                </div>
              </div>
            </a>

            <div className="group neon-card !p-8 flex items-center gap-8 hover:bg-white/5 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all group-hover:scale-110">
                <Mail size={28} />
              </div>
              <div>
                <h4 className="text-white font-bold text-xl mb-1 uppercase tracking-wider text-sm">Electronic Mail</h4>
                <p className="text-text-dim font-mono text-lg group-hover:text-white transition-colors">{email}</p>
              </div>
            </div>
            
            <a href={fbLink} target="_blank" rel="noreferrer" className="block no-underline">
              <div className="group neon-card !p-8 flex items-center gap-8 hover:bg-white/5 transition-all cursor-pointer border-[#1877F2]/20 hover:border-[#1877F2]/50">
                <div className="w-16 h-16 bg-[#1877F2]/10 rounded-2xl flex items-center justify-center text-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white transition-all group-hover:scale-110 shadow-[0_0_20px_rgba(24,119,242,0)] group-hover:shadow-[0_0_30px_rgba(24,119,242,0.4)]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-xl mb-1 uppercase tracking-wider text-sm">Facebook</h4>
                  <p className="text-text-dim font-mono text-lg group-hover:text-white transition-colors">Join our community</p>
                </div>
              </div>
            </a>
            
            <div className="group neon-card !p-8 flex items-center gap-8 hover:bg-white/5 transition-all">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all group-hover:scale-110">
                <MapPin size={28} />
              </div>
              <div>
                <h4 className="text-white font-bold text-xl mb-1 uppercase tracking-wider text-sm">Headquarters</h4>
                <p className="text-text-dim font-mono text-lg group-hover:text-white transition-colors">Colombo, Sri Lanka</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="neon-card !p-10 md:!p-16 relative overflow-hidden bg-black/40">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-primary bg-[length:200%_auto] animate-[shine_5s_linear_infinite]"></div>
              
              <div className="mb-10">
                 <h3 className="text-3xl font-black text-white mb-3">TRANSMIT <span className="text-primary">MESSAGE</span></h3>
                 <p className="text-text-dim">Fill out the form below and our system will route it to the appropriate operative.</p>
              </div>

              <ContactForm />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
