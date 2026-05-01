'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, Home, Info, Mail, ShieldCheck, Search as SearchIcon, ArrowRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('brand_name').single();
      if (data) setSettings(data);
    };
    fetchSettings();

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const fetchResults = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${searchQuery}%`)
        .limit(5);
      if (data) setSearchResults(data);
    };
    
    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/products', icon: ShoppingBag },
    { name: 'FAQ', path: '/faq', icon: Info },
    { name: 'Warranty', path: '/warranty', icon: ShieldCheck },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${isScrolled ? 'py-4 bg-bg-dark/80 backdrop-blur-2xl border-b border-white/5' : 'py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4 group no-underline">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img src="/logo.png" alt="Neon Calc" className="h-10 w-10 rounded-full object-cover relative z-10 border border-white/10" />
            </div>
            <div className="text-white text-2xl font-black tracking-tighter uppercase">
              {settings?.brand_name ? (
                <>
                  {settings.brand_name.split(' ').slice(0, -1).join(' ')}
                  <span className="text-primary ml-2">{settings.brand_name.split(' ').at(-1)}</span>
                </>
              ) : (
                <>Neon Calc <span className="text-primary ml-1">LK</span></>
              )}
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path} 
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all no-underline ${pathname === link.path ? 'text-white bg-white/5' : 'text-text-dim hover:text-white'}`}
              >
                {link.name}
              </Link>
            ))}
            
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="ml-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-dim hover:text-white hover:bg-white/10 transition-all"
            >
              <SearchIcon size={18} />
            </button>
          </div>

          {/* Mobile Toggle & Search */}
          <div className="md:hidden flex items-center gap-4">
            <button className="text-white" onClick={() => setIsSearchOpen(true)}>
              <SearchIcon size={20} />
            </button>
            <button className="text-white" onClick={() => setIsMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bg-dark/95 backdrop-blur-2xl z-[2000] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-16">
              <div className="text-white text-2xl font-black">Neon Calc <span className="text-primary ml-1">LK</span></div>
              <button onClick={() => setIsMenuOpen(false)} className="text-white p-2">
                <X size={32} />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    href={link.path} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl md:text-3xl font-black text-white no-underline hover:text-primary transition-colors flex items-center gap-4 py-2"
                  >
                    <span className="text-sm text-white/20 font-mono">0{i+1}</span> {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spotlight Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[3000] flex items-start justify-center pt-20 px-4 sm:px-0"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center px-4 py-4 border-b border-white/10">
                <SearchIcon className="text-text-dim mr-4" size={24} />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search products... (Press Esc to close)"
                  className="flex-1 bg-transparent border-none outline-none text-xl text-white placeholder:text-white/20"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <div className="hidden sm:flex items-center gap-1 text-[10px] text-text-dim font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                  <span>ESC</span>
                </div>
              </div>

              {searchQuery && (
                <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      {searchResults.map(product => (
                        <Link 
                          key={product.id} 
                          href="/products" 
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors no-underline group"
                        >
                          <div className="w-12 h-12 rounded-lg bg-black overflow-hidden shrink-0">
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-bold group-hover:text-primary transition-colors">{product.name}</div>
                            <div className="text-text-dim text-xs">LKR {product.price}</div>
                          </div>
                          <ArrowRight size={18} className="text-white/20 group-hover:text-primary transition-colors" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-text-dim">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
