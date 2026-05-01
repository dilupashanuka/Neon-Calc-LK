'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingBag, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: string | number;
    image_url: string;
    image_urls?: string[];
    description: string;
    category: string;
  };
  whatsappNumber: string;
}

export default function ProductCard({ product, whatsappNumber }: ProductCardProps) {
  const images = product.image_urls && product.image_urls.length > 0 
    ? product.image_urls 
    : [product.image_url];
    
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide images only when hovered
  useEffect(() => {
    if (!isHovered || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    if (showLightbox) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLightbox]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi Neon Calc, I want to buy ${product.name} for LKR ${product.price}.`
  )}`;

  return (
    <>
      <motion.div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowLightbox(true)}
        className="neon-card !p-0 group relative overflow-hidden flex flex-col h-full border border-white/5 hover:border-primary/50 transition-all duration-500 cursor-zoom-in"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIdx}
              src={images[currentIdx]}
              alt={product.name}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: "circOut" }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Floating Category Tag */}
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg shadow-primary/20">
              {product.category}
            </div>
          </div>

          {/* Carousel Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === currentIdx ? 'w-6 bg-primary' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Quick View Navigation */}
          {images.length > 1 && isHovered && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 z-30 pointer-events-none">
              <button 
                onClick={prevImage} 
                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-primary transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={nextImage} 
                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-primary transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Animated Description Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10 flex flex-col justify-end p-6"
              >
                <div className="text-white text-sm font-medium leading-relaxed mb-12">
                  {product.description}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Details Area */}
        <div className="p-6 flex flex-col flex-1 relative z-20 bg-bg-dark">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors leading-tight">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 text-yellow-500 shrink-0 ml-2">
              <Star size={14} fill="currentColor" />
              <span className="text-xs font-bold">5.0</span>
            </div>
          </div>

          <div className="mt-auto pt-6 flex items-center justify-between">
            <div>
              <span className="text-text-dim text-[10px] font-black uppercase tracking-[0.2em] block mb-1">Unit Price</span>
              <div className="text-2xl font-black text-white">
                <span className="text-xs text-primary mr-1">LKR</span>
                {product.price}
              </div>
            </div>
            
            <a 
              href={whatsappLink} 
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white hover:scale-110 transition-all duration-300 shadow-xl shadow-black/50 group/btn"
              title="Order on WhatsApp"
            >
              <ShoppingBag size={24} className="group-hover/btn:rotate-12 transition-transform" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-10"
            onClick={() => setShowLightbox(false)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors p-4 z-[1001]"
              onClick={() => setShowLightbox(false)}
            >
              <Plus className="rotate-45" size={40} />
            </button>

            {/* Main Image */}
            <div className="relative w-full max-w-5xl h-full flex items-center justify-center select-none" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIdx}
                  src={images[currentIdx]}
                  className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all -translate-x-1/2 md:translate-x-0"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all translate-x-1/2 md:translate-x-0"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
            </div>

            {/* Footer Info */}
            <div className="mt-8 text-center" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">{product.name}</h2>
              <p className="text-text-dim max-w-2xl mx-auto mb-8 font-medium italic">"{product.description}"</p>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-4 justify-center">
                  {images.map((img, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentIdx(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === currentIdx ? 'border-primary scale-110 shadow-lg shadow-primary/20' : 'border-white/10 opacity-50 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
