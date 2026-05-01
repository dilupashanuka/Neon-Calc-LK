'use client';
import { motion } from 'framer-motion';

const HeroAnimation = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="relative"
    >
      <div className="relative z-10 rounded-[40px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)]">
        {/* I'll use a placeholder image for now, user can replace with hero-main.png */}
        <div className="w-full h-[500px] bg-gradient-to-br from-gray-900 to-black flex items-center justify-center border border-[var(--glass-border)]">
          <img 
            src="/logo.png" 
            alt="Supreme Product" 
            className="w-1/2 opacity-20 filter grayscale" 
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-[var(--primary)] text-4xl font-black opacity-50 tracking-widest">NEON CALC</div>
          </div>
        </div>
      </div>
      <div className="absolute -top-[10%] -right-[10%] w-full h-full border-2 border-[var(--primary)] rounded-[40px] z-0 opacity-20"></div>
    </motion.div>
  );
};

export default HeroAnimation;
