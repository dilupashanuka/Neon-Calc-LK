import React from 'react';
import Link from 'next/link';
import { MessageCircle, Mail, MapPin, Phone } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Footer() {
  const supabase = await createClient();
  
  let settings = null;
  try {
    const { data } = await supabase.from('site_settings').select('*').single();
    settings = data;
  } catch (e) {
    // default
  }

  const phone = settings?.phone || '078 939 5851';
  const whatsapp = settings?.whatsapp || '+94 76 564 6270';
  const email = settings?.email || 'support@neoncalc.lk';
  const fbLink = settings?.fb_link || 'https://facebook.com/neoncalclk';

  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 no-underline inline-block group">
              <img src="/logo.png" alt="Neon Calc" className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:border-primary/50 transition-all" />
              <div className="text-white text-2xl font-black tracking-tighter uppercase">
                <>Neon Calc <span className="text-primary ml-1">LK</span></>
              </div>
            </Link>
            <p className="text-text-dim text-sm leading-relaxed mb-8">
              {settings?.brand_tagline || 'The premier destination for high-quality Casio calculators and precision electronics in Sri Lanka.'}
            </p>
            <div className="flex items-center gap-4">
              <a href={fbLink} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#1877F2] hover:text-white transition-all">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#25d366] hover:text-white transition-all">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-widest uppercase text-sm">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-text-dim hover:text-white transition-colors text-sm no-underline">Browse Collection</Link></li>
              <li><Link href="/faq" className="text-text-dim hover:text-white transition-colors text-sm no-underline">FAQ</Link></li>
              <li><Link href="/warranty" className="text-text-dim hover:text-white transition-colors text-sm no-underline">Warranty & Returns</Link></li>
              <li><Link href="/about" className="text-text-dim hover:text-white transition-colors text-sm no-underline">Our Story</Link></li>
              <li><Link href="/contact" className="text-text-dim hover:text-white transition-colors text-sm no-underline">Support Center</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="text-white font-bold mb-6 tracking-widest uppercase text-sm">Contact Information</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <MapPin size={18} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-text-dim text-sm">Colombo, Sri Lanka<br/>Island-wide Delivery Available</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <span className="text-text-dim text-sm font-mono">{phone}</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <span className="text-text-dim text-sm font-mono">{email}</span>
              </li>
            </ul>
          </div>
          
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-dim text-xs">
            &copy; {new Date().getFullYear()} Neon Calc LK. Developed by Shanuka Digital Solutions
          </p>
          <div className="flex gap-4">
            <span className="text-text-dim text-xs hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="text-text-dim text-xs hover:text-white transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
