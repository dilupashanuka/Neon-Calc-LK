'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Zap, Truck, ShoppingBag, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [fbPosts, setFbPosts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [heroIdx, setHeroIdx] = useState(0);
  const [whatsappNumber, setWhatsappNumber] = useState('94765646270');
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: pData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      const { data: fData } = await supabase.from('fb_posts').select('*').limit(3).order('created_at', { ascending: false });
      const { data: sData } = await supabase.from('site_settings').select('*').single();
      const { data: rData } = await supabase.from('reviews').select('*').limit(6).order('created_at', { ascending: false });
      const { data: hData } = await supabase.from('hero_slides').select('*').order('display_order', { ascending: true });
      
      if (sData) {
        setSettings(sData);
        if (sData.whatsapp) setWhatsappNumber(sData.whatsapp.replace(/\D/g, ''));
      }
      
      if (pData) {
        setProducts(pData.slice(0, 6));
      }

      if (hData && hData.length > 0) {
        setHeroSlides(hData);
      } else if (pData) {
        // Fallback to premium products if no custom slides
        const premium = pData.filter(p => 
          p.category?.toLowerCase().includes('premium') || 
          p.category?.toLowerCase().includes('featured')
        );
        const heroList = premium.length > 0 ? premium : pData.slice(0, 3);
        // Map products to slide format
        setHeroSlides(heroList.map(p => ({
          image_url: p.image_url,
          title: p.name,
          subtitle: `LKR ${p.price}`,
          button_text: 'Shop Now',
          button_link: '/products'
        })));
      }

      if (fData) setFbPosts(fData);
      if (rData) setReviews(rData);
    };

    fetchData();

    // SETUP REALTIME SUBSCRIPTIONS
    const supabase = createClient();
    const homeSub = supabase
      .channel('home-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fb_posts' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hero_slides' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(homeSub);
    };
  }, []);

  // Hero Carousel Logic
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    
    const interval = setInterval(() => {
      setHeroIdx(prev => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [heroSlides]);

  const nextHero = () => setHeroIdx(prev => (prev + 1) % heroSlides.length);
  const prevHero = () => setHeroIdx(prev => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div className="min-h-screen bg-bg-dark text-white">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-blue-900/10 blur-[150px] rounded-full animate-pulse-slow" style={{ animationDelay: '-5s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-screen flex items-center z-10">
        <div className="container mx-auto px-6 relative z-20">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-xl">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                <span className="text-white text-[10px] font-black tracking-[0.4em] uppercase">Premium Electronics Sri Lanka</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.85] mb-12 tracking-tighter uppercase italic">
                ELITE <br/> 
                <span className="text-primary not-italic bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-500 to-primary animate-gradient-x">
                  ELECTRONICS
                </span>
              </h1>
              
              <p className="text-text-dim text-lg md:text-2xl mb-14 max-w-3xl mx-auto leading-relaxed font-bold tracking-tight">
                {settings.hero_tagline || 'Redefining mathematical precision. Sri Lanka\'s premier destination for authentic electronic instruments and elite precision tools.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <Link href="/products" className="neon-btn !px-16 !py-6 group no-underline text-white text-sm tracking-[0.2em] shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]">
                  EXPLORE COLLECTION <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link href="/contact" className="px-12 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center no-underline backdrop-blur-md">
                  SUPPORT CENTER
                </Link>
              </div>

              <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 text-[10px] text-white/40 font-black tracking-[0.3em] uppercase">
                <div className="flex flex-col items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:text-primary transition-colors border border-white/5">
                    <ShieldCheck size={24}/>
                  </div>
                  100% Genuine
                </div>
                <div className="flex flex-col items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:text-primary transition-colors border border-white/5">
                    <Truck size={24}/>
                  </div>
                  Island-wide Ship
                </div>
                <div className="flex flex-col items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:text-primary transition-colors border border-white/5">
                    <Zap size={24}/>
                  </div>
                  Fast Support
                </div>
                <div className="flex flex-col items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:text-primary transition-colors border border-white/5">
                    <Star size={24}/>
                  </div>
                  Elite Warranty
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Cinematic Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
          <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white to-transparent animate-pulse"></div>
          <span className="text-[10px] font-black tracking-[0.5em] uppercase">Scroll</span>
        </div>
      </section>

      {/* Supreme Advantages */}
      <section className="py-20 relative z-10 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: ShieldCheck, title: "100% Genuine", desc: "Every product is verified authentic from the manufacturer." },
              { icon: Zap, title: "Direct Support", desc: "Expert technical assistance via WhatsApp and Phone." },
              { icon: Truck, title: "Island-wide", desc: "Fast and secure delivery to every corner of Sri Lanka." },
              { icon: Star, title: "Elite Warranty", desc: "Peace of mind with our comprehensive local warranty." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg shadow-primary/5">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-lg font-black text-white mb-3 uppercase tracking-widest">{feature.title}</h3>
                <p className="text-text-dim text-sm font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
               <div className="text-primary text-xs font-black uppercase tracking-[0.4em] mb-4">Latest Additions</div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">NEW <span className="text-primary">ARRIVALS</span></h2>
              <p className="text-text-dim text-lg font-bold">Discover our most recent high-performance instruments.</p>
            </div>
            <Link href="/products" className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-primary transition-all font-black uppercase text-xs tracking-widest no-underline shadow-xl shadow-black/20">
              View All Collection <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((p, i) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="h-full"
              >
                <ProductCard product={p} whatsappNumber={whatsappNumber} />
              </motion.div>
            ))}
            
            {products.length === 0 && (
              [1,2,3].map(i => (
                <div key={i} className="neon-card animate-pulse aspect-[3/4] flex items-center justify-center bg-white/5 border-white/5 rounded-[2rem]">
                  <Loader2 className="animate-spin text-white/20" size={32} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Social Feed */}
      {fbPosts.length > 0 && (
        <section className="py-32 relative z-10 bg-black/40 border-y border-white/5">
          <div className="container mx-auto px-6">
             <div className="text-center mb-20">
                <div className="text-[#1877F2] text-xs font-black uppercase tracking-[0.4em] mb-4">Stay Connected</div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6">SOCIAL <span className="text-[#1877F2]">Feed</span></h2>
                <p className="text-text-dim font-bold">Real-time updates from our official channels.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {fbPosts.map(post => (
                 <motion.div 
                   key={post.id} 
                   whileHover={{ y: -10 }}
                   className="neon-card !p-0 overflow-hidden relative group border border-white/5 hover:border-[#1877F2]/50 transition-all"
                 >
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#1877F2] shadow-[0_0_10px_rgba(24,119,242,0.5)]"></div>
                    <div className="p-10">
                      <div className="w-14 h-14 bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </div>
                      <p className="text-white font-medium mb-8 line-clamp-4 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                        "Stay tuned for exclusive offers and product unveilings. Follow us on Facebook for more supreme updates."
                      </p>
                      <a href={post.post_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest hover:text-[#1877F2] transition-colors no-underline">
                        Explore Full Post <ArrowRight size={14} />
                      </a>
                    </div>
                 </motion.div>
               ))}
             </div>
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      {reviews.length > 0 && (
        <section className="py-32 relative z-10 overflow-hidden">
          <div className="container mx-auto px-6">
             <div className="text-center mb-20">
                <div className="text-yellow-500 text-xs font-black uppercase tracking-[0.4em] mb-4">Supreme Service</div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6">CLIENT <span className="text-yellow-500">VOICES</span></h2>
                <p className="text-text-dim font-bold">Why thousands trust Neon Calc Pro.</p>
             </div>
             
             <div className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory no-scrollbar">
               {reviews.map(review => (
                 <motion.div 
                   key={review.id} 
                   whileHover={{ scale: 1.02 }}
                   className="neon-card min-w-[320px] md:min-w-[450px] snap-center shrink-0 !p-10 border border-white/5 hover:border-yellow-500/30 transition-all"
                 >
                    <div className="flex text-yellow-500 mb-8 gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={20} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-white/10" : "drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]"} />
                      ))}
                    </div>
                    <p className="text-white text-xl font-bold leading-relaxed mb-10 italic">"{review.review_text}"</p>
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-yellow-500 text-black flex items-center justify-center font-black text-xl shadow-lg shadow-yellow-500/20">
                        {review.customer_name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-black text-lg tracking-tight">{review.customer_name}</div>
                        <div className="text-text-dim text-[10px] tracking-[0.3em] uppercase font-black">Elite Member</div>
                      </div>
                    </div>
                 </motion.div>
               ))}
             </div>
          </div>
        </section>
      )}
    </div>
  );
}

