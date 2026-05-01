import React from 'react';
import { Target, Award, ShieldCheck, Zap } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function AboutPage() {
  const supabase = await createClient();
  
  // Fetch settings safely
  let settings = null;
  try {
    const { data } = await supabase.from('site_settings').select('*').single();
    settings = data;
  } catch (e) {
    // ignore error if table doesn't exist yet
  }

  const aboutIntro = settings?.about_intro || 'THE NEON LEGACY';
  const aboutStory = settings?.about_story || 'Elevating precision in Sri Lanka since our inception. We are more than a store; we are your ultimate tech partner.\n\nWelcome to Neon Calc LK, the premier destination for high-quality electronics and precision instruments in Sri Lanka.\n\nඅපගේ පරමාර්ථය වන්නේ ශ්‍රී ලාංකික සිසුන්ට සහ වෘත්තිකයන්ට අවශ්‍ය ගුණාත්මක තත්ත්වයෙන් ඉහළ Casio ගණක යන්ත්‍ර සහ අනෙකුත් ඉලෙක්ට්‍රොනික මෙවලම් විශ්වාසනීයව ලබා දීමයි.';
  const fbLink = settings?.fb_link || 'https://facebook.com/neoncalclk';

  return (
    <div className="pt-32 md:pt-40 pb-20 min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-[-1] opacity-20 pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-blue-900/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-20 md:mb-32">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-8">
              <span className="text-2xl font-black text-primary">N</span>
           </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">
            {aboutIntro.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-primary">{aboutIntro.split(' ').at(-1)}</span>
          </h1>
          <p className="text-text-dim text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
             Precision instruments. Premium support. Island-wide trust.
          </p>
        </div>

        <div className="neon-card !p-8 md:!p-16 mb-16 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 blur-[100px] group-hover:bg-primary/20 transition-all duration-700"></div>
           <div className="relative z-10 text-lg md:text-xl text-text-dim leading-relaxed space-y-8 font-light">
              <div className="whitespace-pre-wrap">
                {aboutStory}
              </div>
              
              <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                 <span className="text-white font-bold text-sm tracking-widest uppercase">Connect With Us:</span>
                 <a href={fbLink} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                 </a>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="neon-card !p-10 flex flex-col items-start gap-6 hover:border-primary/40 transition-colors">
              <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                 <Target size={28} />
              </div>
              <div>
                 <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
                 <p className="text-text-dim leading-relaxed">To be the undisputed, most trusted tech provider in the island, bridging the gap between global elite brands and local needs with zero compromise.</p>
              </div>
           </div>
           
           <div className="neon-card !p-10 flex flex-col items-start gap-6 hover:border-primary/40 transition-colors">
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
                 <ShieldCheck size={28} />
              </div>
              <div>
                 <h3 className="text-2xl font-bold text-white mb-3">Our Commitment</h3>
                 <p className="text-text-dim leading-relaxed">100% Genuine products, comprehensive factory warranty, and exceptional, lifelong customer service that sets the industry standard.</p>
              </div>
           </div>
        </div>
        
        {/* Core Values */}
        <div className="mt-32 text-center">
           <h2 className="text-3xl md:text-5xl font-black text-white mb-16">CORE <span className="text-primary">VALUES</span></h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
              <div className="flex flex-col items-center gap-4">
                 <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center text-white text-2xl font-black">01</div>
                 <h4 className="text-white font-bold tracking-widest uppercase text-sm">Authenticity</h4>
              </div>
              <div className="flex flex-col items-center gap-4">
                 <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center text-white text-2xl font-black">02</div>
                 <h4 className="text-white font-bold tracking-widest uppercase text-sm">Precision</h4>
              </div>
              <div className="flex flex-col items-center gap-4">
                 <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center text-white text-2xl font-black">03</div>
                 <h4 className="text-white font-bold tracking-widest uppercase text-sm">Velocity</h4>
              </div>
              <div className="flex flex-col items-center gap-4">
                 <div className="w-20 h-20 rounded-full border border-primary text-primary flex items-center justify-center text-2xl font-black">04</div>
                 <h4 className="text-primary font-bold tracking-widest uppercase text-sm">Supremacy</h4>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
