'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Props {
  grouped: Record<string, FaqItem[]>;
}

export default function FaqClient({ grouped }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(Object.keys(grouped)[0] || 'General');

  const categories = Object.keys(grouped);

  if (categories.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-text-dim text-lg">No FAQs published yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenId(null); }}
              className={`px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-black'
                  : 'bg-white/5 text-text-dim hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* FAQ Items */}
      <div className="space-y-3">
        {(grouped[activeCategory] || []).map((faq, idx) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`neon-card !p-0 overflow-hidden transition-all ${
              openId === faq.id ? 'border-primary/30' : ''
            }`}
          >
            <button
              className="w-full flex items-center justify-between gap-4 p-6 md:p-8 text-left"
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
            >
              <span className="font-black text-white text-base md:text-lg leading-snug pr-4">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: openId === faq.id ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  openId === faq.id ? 'bg-primary text-black' : 'bg-white/5 text-text-dim'
                }`}
              >
                <ChevronDown size={18} />
              </motion.div>
            </button>

            <AnimatePresence>
              {openId === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-8 pt-0 text-text-dim leading-relaxed border-t border-white/5">
                    <div className="pt-6" dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\n/g, '<br/>') }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
