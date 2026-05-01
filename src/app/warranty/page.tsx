import React from 'react';
import { createClient } from '@/utils/supabase/server';
import type { Metadata } from 'next';
import { ShieldCheck, RefreshCw, Package, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Warranty & Returns | Neon Calc LK',
  description: 'Neon Calc LK warranty coverage and returns policy for all Casio calculators and electronics.',
};

export default async function WarrantyPage() {
  const supabase = await createClient();

  let content = {
    warranty_title: 'Our Warranty & Returns',
    warranty_intro: 'Every product we sell is covered by our quality assurance guarantee. We stand behind every item in our catalog.',
    warranty_period: '12 Months',
    warranty_details: 'All Casio calculators and electronics sold by Neon Calc LK come with a manufacturer-backed warranty. Any defect in materials or workmanship will be covered for the stated period from the date of purchase.',
    returns_period: '7 Days',
    returns_details: 'If you receive a damaged or incorrect item, contact us within 7 days. We will arrange a full replacement or refund at no additional cost.',
    exclusions: 'Physical damage caused by the customer, water damage, unauthorized repairs, and consumable components are not covered under warranty.',
    contact_info: 'Contact us via WhatsApp or our contact page to initiate a warranty claim.',
  };

  try {
    const { data: settingsData } = await supabase.from('site_settings').select('*').single();
    if (settingsData) {
      Object.keys(content).forEach((key) => {
        if ((settingsData as any)[key]) (content as any)[key] = (settingsData as any)[key];
      });
    }
  } catch {}

  const highlights = [
    { icon: ShieldCheck, title: `${content.warranty_period} Warranty`, desc: 'Full manufacturer coverage on all products' },
    { icon: RefreshCw, title: `${content.returns_period} Returns`, desc: 'Hassle-free return for defective items' },
    { icon: Package, title: '100% Genuine', desc: 'Every product is authentic and quality-checked' },
    { icon: Clock, title: 'Fast Support', desc: 'Claims processed within 48 hours' },
  ];

  return (
    <div className="min-h-screen bg-bg-dark pt-40 pb-24">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8">
            Your Protection
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">
            {content.warranty_title.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-primary">{content.warranty_title.split(' ').at(-1)}</span>
          </h1>
          <p className="text-text-dim text-lg max-w-2xl mx-auto leading-relaxed">
            {content.warranty_intro}
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {highlights.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="neon-card !p-6 text-center hover:border-primary/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon size={22} className="text-primary" />
              </div>
              <div className="font-black text-white text-sm mb-1">{title}</div>
              <div className="text-text-dim text-xs leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {/* Warranty */}
          <div className="neon-card !p-8 md:!p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <ShieldCheck size={22} className="text-primary" />
              </div>
              <div>
                <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Coverage</div>
                <h2 className="text-2xl font-black tracking-tighter">Warranty Policy</h2>
              </div>
            </div>
            <p className="text-text-dim leading-relaxed text-base">
              {content.warranty_details}
            </p>
          </div>

          {/* Returns */}
          <div className="neon-card !p-8 md:!p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <RefreshCw size={22} className="text-primary" />
              </div>
              <div>
                <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Process</div>
                <h2 className="text-2xl font-black tracking-tighter">Returns & Replacements</h2>
              </div>
            </div>
            <p className="text-text-dim leading-relaxed text-base">
              {content.returns_details}
            </p>
          </div>

          {/* Exclusions */}
          <div className="neon-card !p-8 md:!p-12 border-yellow-500/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle size={22} className="text-yellow-400" />
              </div>
              <div>
                <div className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-1">Important</div>
                <h2 className="text-2xl font-black tracking-tighter">Exclusions</h2>
              </div>
            </div>
            <p className="text-text-dim leading-relaxed text-base">
              {content.exclusions}
            </p>
          </div>

          {/* How to Claim */}
          <div className="neon-card !p-8 md:!p-12 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                <CheckCircle size={22} className="text-primary" />
              </div>
              <div>
                <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Next Steps</div>
                <h2 className="text-2xl font-black tracking-tighter">How to Claim</h2>
              </div>
            </div>
            <p className="text-text-dim leading-relaxed text-base mb-8">
              {content.contact_info}
            </p>
            <a href="/contact" className="neon-btn inline-flex">
              Start a Claim
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
