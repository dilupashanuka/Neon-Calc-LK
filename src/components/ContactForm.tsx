'use client';
import React, { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    
    const { error: submitError } = await supabase
      .from('contact_messages')
      .insert([
        { 
          name, 
          email, 
          subject, 
          message,
          created_at: new Date().toISOString()
        }
      ]);

    if (submitError) {
      console.error('Error submitting message:', submitError);
      // If table doesn't exist, we might get 404 or 42P01
      setError('System transmission failed. Please try again or use direct contact.');
      setLoading(false);
    } else {
      setSubmitted(true);
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8 animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Transmission Successful</h3>
        <p className="text-text-dim max-w-sm">Your message has been successfully routed to our support team. We will respond shortly.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-10 text-primary font-black uppercase tracking-widest text-xs hover:underline"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-text-dim uppercase tracking-widest mb-3 pl-2">Designation / Name</label>
          <input 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe" 
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-mono" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-dim uppercase tracking-widest mb-3 pl-2">Return Address (Email)</label>
          <input 
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com" 
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-mono" 
          />
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-bold text-text-dim uppercase tracking-widest mb-3 pl-2">Subject Matter</label>
        <input 
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Inquiry regarding Order #1004" 
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-mono" 
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-text-dim uppercase tracking-widest mb-3 pl-2">Transmission Content</label>
        <textarea 
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="State your requirements..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary/50 focus:bg-white/10 transition-all min-h-[180px] resize-y font-mono"
        ></textarea>
      </div>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-bold">
          {error}
        </div>
      )}

      <div className="pt-4">
        <button 
          disabled={loading}
          type="submit" 
          className="neon-btn w-full md:w-auto !py-4 !px-12 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>Processing... <Loader2 className="animate-spin" size={18} /></>
          ) : (
            <>Initiate Transfer <Send size={18} /></>
          )}
        </button>
      </div>
    </form>
  );
}
