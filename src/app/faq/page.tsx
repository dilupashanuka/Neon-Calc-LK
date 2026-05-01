import React from 'react';
import { createClient } from '@/utils/supabase/server';
import type { Metadata } from 'next';
import FaqClient from '@/components/FaqClient';

export const metadata: Metadata = {
  title: 'FAQ | Neon Calc LK',
  description: 'Frequently asked questions about Neon Calc LK — delivery, warranty, payments, and more.',
};

export default async function FaqPage() {
  const supabase = await createClient();
  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .order('display_order', { ascending: true });

  const grouped: Record<string, any[]> = {};
  (faqs || []).forEach((f) => {
    const cat = f.category || 'General';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(f);
  });

  return (
    <div className="min-h-screen bg-bg-dark pt-40 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8">
            Help Centre
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">
            Frequently <span className="text-primary">Asked</span>
          </h1>
          <p className="text-text-dim text-lg max-w-xl mx-auto">
            Everything you need to know before ordering. Can&apos;t find your answer? Contact us directly.
          </p>
        </div>

        {/* FAQ Accordion */}
        <FaqClient grouped={grouped} />

        {/* CTA */}
        <div className="mt-20 neon-card !p-10 text-center">
          <h3 className="text-2xl font-black mb-4 tracking-tighter">Still have questions?</h3>
          <p className="text-text-dim mb-8">Our team is ready to help you with any enquiry.</p>
          <a href="/contact" className="neon-btn inline-flex">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
