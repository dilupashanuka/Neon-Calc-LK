'use client';
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('94765646270');

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: pData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      const { data: sData } = await supabase.from('site_settings').select('whatsapp').single();
      const { data: cData } = await supabase.from('categories').select('name');
      
      if (sData && sData.whatsapp) {
        setWhatsappNumber(sData.whatsapp.replace(/\D/g, ''));
      }
      
      if (cData) {
        setCategories(['All', ...cData.map(c => c.name)]);
      }
      
      if (pData) {
        setProducts(pData);
        setFilteredProducts(pData);
      }
      setLoading(false);
    };

    fetchData();

    // SETUP REALTIME SUBSCRIPTIONS
    const shopSub = supabase
      .channel('shop-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(shopSub);
    };
  }, []);

  useEffect(() => {
    let result = products;
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [activeCategory, searchTerm, products]);

  return (
    <div className="pt-32 md:pt-48 pb-20 min-h-screen">
       {/* Animated Background Mesh */}
      <div className="fixed inset-0 z-[-1] opacity-20 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-primary/20 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-blue-900/20 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="mb-16 md:mb-24 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">SUPREME <span className="text-primary uppercase">Collection</span></h1>
            <p className="text-text-dim text-lg md:text-xl max-w-xl">Find the perfect precision instrument for your academic or professional success.</p>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
             <div className="text-text-dim text-sm font-bold uppercase tracking-widest">{filteredProducts.length} Items Found</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="sticky top-24 z-[50] mb-16">
          <div className="glass-panel p-4 md:p-6 rounded-3xl md:rounded-full flex flex-col md:flex-row items-center gap-4 md:gap-8 border border-white/5 backdrop-blur-xl">
            {/* Category Switcher - Mobile friendly scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-3 rounded-full text-sm font-black whitespace-nowrap transition-all uppercase tracking-widest ${activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'bg-white/5 text-text-dim hover:bg-white/10 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="w-full md:w-[1px] h-[1px] md:h-10 bg-white/10 hidden md:block"></div>

            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-dim" size={20} />
              <input 
                className="w-full bg-white/5 border border-white/5 rounded-full py-4 pl-14 pr-6 text-white outline-none focus:border-primary/50 transition-all text-sm font-bold" 
                placeholder="Search products by name..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
            <p className="text-text-dim font-bold tracking-widest uppercase text-xs">Accessing Inventory...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((p, idx) => (
                <motion.div 
                  layout
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="h-full"
                >
                  <ProductCard product={p} whatsappNumber={whatsappNumber} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-40 neon-card">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-text-dim">
                <Search size={40} />
             </div>
             <h2 className="text-3xl font-bold text-white mb-4">No results found</h2>
             <p className="text-text-dim">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
