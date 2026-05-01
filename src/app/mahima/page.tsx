'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Plus, Trash2, Share2, Package, LogOut, Loader2, 
  Settings, Save, LayoutGrid, Star, Image as ImageIcon,
  ChevronRight, ArrowLeft, Home, Mail, Edit, X, HelpCircle, FileText,
  Zap, Info
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [fbPosts, setFbPosts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    phone: '', whatsapp: '', email: '', fb_link: '',
    warranty_title: '', warranty_intro: '', warranty_period: '',
    warranty_details: '', returns_period: '', returns_details: '',
    exclusions: '', contact_info: '',
    hero_badge: '', hero_line1: '', hero_line2: '', hero_tagline: '',
    brand_name: '', brand_tagline: '', about_intro: '', about_story: ''
  });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: 'General', display_order: 0 });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainImageFiles, setMainImageFiles] = useState<File[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form states
  const [newProduct, setNewProduct] = useState({ 
    name: '', price: '', category: '', description: '', image_url: '', image_urls: [] as string[] 
  });
  const [newCategory, setNewCategory] = useState('');
  const [newFbPost, setNewFbPost] = useState({ post_url: '' });
  const [newReview, setNewReview] = useState({ customer_name: '', review_text: '', rating: 5 });
  const [newHeroSlide, setNewHeroSlide] = useState({ image_url: '', title: '', subtitle: '' });
  const [heroFile, setHeroFile] = useState<File | null>(null);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchData();

    // SETUP REALTIME SUBSCRIPTIONS
    const productSub = supabase
      .channel('admin-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fb_posts' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'faqs' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hero_slides' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(productSub);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: pData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    const { data: cData } = await supabase.from('categories').select('*').order('name', { ascending: true });
    const { data: fData } = await supabase.from('fb_posts').select('*').order('created_at', { ascending: false });
    const { data: sData } = await supabase.from('site_settings').select('*').single();
    const { data: rData } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    const { data: mData } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    const { data: faqData } = await supabase.from('faqs').select('*').order('display_order', { ascending: true });
    const { data: hData } = await supabase.from('hero_slides').select('*').order('display_order', { ascending: true });
    
    if (pData) setProducts(pData);
    if (cData) {
      setCategories(cData);
      if (cData.length > 0 && !newProduct.category) {
        setNewProduct(prev => ({ ...prev, category: cData[0].name }));
      }
    }
    if (fData) setFbPosts(fData);
    if (sData) setSettings(prev => ({ ...prev, ...sData }));
    if (rData) setReviews(rData);
    if (mData) setMessages(mData);
    if (faqData) setFaqs(faqData);
    if (hData) setHeroSlides(hData);
    setLoading(false);
  };

  const handleAddHeroSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroFile && !newHeroSlide.image_url) return;
    setIsSubmitting(true);

    let finalUrl = newHeroSlide.image_url;

    if (heroFile) {
      const fileExt = heroFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('products')
        .upload(`hero/${fileName}`, heroFile);

      if (uploadError) {
        alert('Upload failed: ' + uploadError.message);
        setIsSubmitting(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(`hero/${fileName}`);
      finalUrl = publicUrl;
    }

    const { error } = await supabase.from('hero_slides').insert([{
      ...newHeroSlide,
      image_url: finalUrl,
      display_order: heroSlides.length
    }]);

    if (!error) {
      setNewHeroSlide({ image_url: '', title: '', subtitle: '' });
      setHeroFile(null);
      await fetchData();
    } else {
      alert('Error adding slide: ' + error.message);
    }
    setIsSubmitting(false);
  };

  const handleDeleteHeroSlide = async (id: string) => {
    if (confirm('Delete this hero slide?')) {
      await supabase.from('hero_slides').delete().eq('id', id);
      await fetchData();
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setIsSubmitting(true);
    const { error } = await supabase.from('categories').insert([{ name: newCategory.trim() }]);
    if (!error) {
      setNewCategory('');
      await fetchData();
    } else {
      alert('Error adding category: ' + error.message);
    }
    setIsSubmitting(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Delete this category? Products in this category will remain but the category label will be gone.')) {
      await supabase.from('categories').delete().eq('id', id);
      fetchData();
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let mainImageUrl = newProduct.image_url;
    let mainUrls: string[] = [];
    let galleryUrls: string[] = [];
    
    setUploadingImage(true);

    // 1. Upload Main Images
    if (mainImageFiles.length > 0) {
      for (const file of mainImageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `product_images/main_${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);
          
        if (!uploadError) {
          const { data } = supabase.storage.from('products').getPublicUrl(filePath);
          mainUrls.push(data.publicUrl);
        }
      }
      if (mainUrls.length > 0) mainImageUrl = mainUrls[0];
    }

    // 2. Upload Gallery Images
    if (galleryFiles.length > 0) {
      for (const file of galleryFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `product_images/gallery_${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);
          
        if (!uploadError) {
          const { data } = supabase.storage.from('products').getPublicUrl(filePath);
          galleryUrls.push(data.publicUrl);
        }
      }
    }
    setUploadingImage(false);

    // Combine all images, putting main ones first
    const allUrls = [...mainUrls, ...galleryUrls];

    const payload = { 
      ...newProduct, 
      image_url: mainImageUrl,
      image_urls: allUrls.length > 0 ? allUrls : [newProduct.image_url].filter(Boolean)
    };

    const { error } = await supabase.from('products').insert([payload]);
    if (!error) {
      setNewProduct({ name: '', price: '', category: categories[0]?.name || '', description: '', image_url: '', image_urls: [] });
      setMainImageFiles([]);
      setGalleryFiles([]);
      await fetchData();
      alert('Product published successfully!');
    } else {
      alert('Error adding product: ' + error.message);
    }
    setIsSubmitting(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchData();
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSubmitting(true);

    const { error } = await supabase
      .from('products')
      .update({
        name: editingProduct.name,
        price: editingProduct.price,
        category: editingProduct.category,
        description: editingProduct.description,
        image_url: editingProduct.image_url,
        image_urls: editingProduct.image_urls
      })
      .eq('id', editingProduct.id);

    if (!error) {
      setEditingProduct(null);
      await fetchData();
      alert('Product updated successfully!');
    } else {
      alert('Error updating product: ' + error.message);
    }
    setIsSubmitting(false);
  };

  const handleAddFbPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from('fb_posts').insert([newFbPost]);
    if (!error) {
      setNewFbPost({ post_url: '' });
      await fetchData();
    }
    setIsSubmitting(false);
  };

  const handleDeleteFbPost = async (id: string) => {
    if (confirm('Delete this social update?')) {
      await supabase.from('fb_posts').delete().eq('id', id);
      fetchData();
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from('reviews').insert([newReview]);
    if (!error) {
      setNewReview({ customer_name: '', review_text: '', rating: 5 });
      await fetchData();
    }
    setIsSubmitting(false);
  };

  const handleDeleteReview = async (id: string) => {
    if (confirm('Delete this review?')) {
      await supabase.from('reviews').delete().eq('id', id);
      fetchData();
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (confirm('Delete this message?')) {
      await supabase.from('contact_messages').delete().eq('id', id);
      fetchData();
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { data: existing } = await supabase.from('site_settings').select('id').single();
    if (existing) {
      const { error } = await supabase.from('site_settings').update(settings).eq('id', existing.id);
      if (error) alert('Error updating settings: ' + error.message);
    } else {
      const { error } = await supabase.from('site_settings').insert([settings]);
      if (error) alert('Error saving settings: ' + error.message);
    }
    alert('Settings updated successfully!');
    setIsSubmitting(false);
    router.refresh();
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { data: existing } = await supabase.from('site_settings').select('id').single();
    if (existing) {
      const { error } = await supabase.from('site_settings').update(settings).eq('id', existing.id);
      if (error) alert('Error: ' + error.message);
      else alert('Site content updated!');
    } else {
      const { error } = await supabase.from('site_settings').insert([settings]);
      if (error) alert('Error: ' + error.message);
      else alert('Site content saved!');
    }
    setIsSubmitting(false);
    router.refresh();
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;
    setIsSubmitting(true);
    const { error } = await supabase.from('faqs').insert([newFaq]);
    if (!error) {
      setNewFaq({ question: '', answer: '', category: 'General', display_order: faqs.length });
      await fetchData();
    } else {
      alert('Error adding FAQ: ' + error.message);
    }
    setIsSubmitting(false);
  };

  const handleDeleteFaq = async (id: string) => {
    if (confirm('Delete this FAQ?')) {
      await supabase.from('faqs').delete().eq('id', id);
      fetchData();
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const NavButton = ({ tab, icon: Icon, label }: { tab: string, icon: any, label: string }) => (
    <button 
      onClick={() => {
        setActiveTab(tab);
        setIsSidebarOpen(false);
      }} 
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black uppercase tracking-widest text-xs ${
        activeTab === tab 
          ? 'bg-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] scale-[1.02]' 
          : 'text-text-dim hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-bg-dark text-white">
      {/* Background Glow */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1001] lg:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-bg-dark border-r border-white/10 z-[1002] lg:hidden p-8 flex flex-col gap-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-black tracking-tighter">NEON <span className="text-primary">ADMIN</span></div>
                <button onClick={() => setIsSidebarOpen(false)} className="text-text-dim hover:text-white p-2">
                  <Plus className="rotate-45" />
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                <NavButton tab="dashboard" icon={LayoutGrid} label="Dashboard" />
                <NavButton tab="hero" icon={ImageIcon} label="Hero Showcase" />
                <NavButton tab="products" icon={Package} label="Inventory" />
                <NavButton tab="categories" icon={LayoutGrid} label="Categories" />
                <NavButton tab="social" icon={Share2} label="Social Feed" />
                <NavButton tab="reviews" icon={Star} label="Reviews" />
                <NavButton tab="messages" icon={Mail} label="Messages" />
                <NavButton tab="faq" icon={HelpCircle} label="FAQ Manager" />
                <NavButton tab="content" icon={FileText} label="Site Content" />
                <NavButton tab="settings" icon={Settings} label="Site Config" />
              </nav>
              <div className="mt-auto border-t border-white/5 pt-8">
                 <button className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all font-black uppercase tracking-widest text-xs w-full">
                    <LogOut size={20} /> Logout
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Burger Menu for Mobile */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
            >
              <LayoutGrid size={20} />
            </button>

            <Link href="/" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-all group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <h1 className="text-3xl font-black tracking-tighter">MAHIMA <span className="text-primary uppercase">Portal</span></h1>
              <p className="text-text-dim text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Secure Administrator Access
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden lg:flex flex-col items-end mr-4">
                <span className="text-xs text-text-dim font-bold uppercase tracking-widest">Active Session</span>
                <span className="text-sm font-mono text-white">ADMIN_X_991</span>
             </div>
             <button className="hidden lg:flex bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-3 rounded-2xl font-bold transition-all items-center gap-2 border border-red-500/20">
               <LogOut size={18} /> Logout
             </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:flex flex-col gap-2">
            <div className="neon-card !p-3 flex flex-col gap-1">
              <NavButton tab="dashboard" icon={LayoutGrid} label="Dashboard" />
              <NavButton tab="hero" icon={ImageIcon} label="Hero Showcase" />
              <NavButton tab="products" icon={Package} label="Inventory" />
              <NavButton tab="categories" icon={LayoutGrid} label="Categories" />
              <NavButton tab="social" icon={Share2} label="Social Feed" />
              <NavButton tab="reviews" icon={Star} label="Reviews" />
              <NavButton tab="messages" icon={Mail} label="Messages" />
              <NavButton tab="faq" icon={HelpCircle} label="FAQ Manager" />
              <NavButton tab="content" icon={FileText} label="Site Content" />
              <NavButton tab="settings" icon={Settings} label="Site Config" />
            </div>
            
            <div className="neon-card !p-6 mt-4">
              <h3 className="text-xs font-black text-text-dim uppercase tracking-[0.2em] mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-dim">Products</span>
                  <span className="text-sm font-mono text-white">{products.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-dim">Messages</span>
                  <span className="text-sm font-mono text-primary">{messages.length}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Content Window */}
          <main className="min-h-[700px]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-40 neon-card">
                  <Loader2 className="animate-spin text-primary mb-6" size={48} />
                  <p className="text-text-dim font-bold tracking-widest uppercase text-sm animate-pulse">Syncing with database...</p>
                </motion.div>
              ) : (
                <motion.div 
                  key={activeTab} 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }} 
                  transition={{ duration: 0.4, ease: "circOut" }}
                  className="space-y-8"
                >
                  
                  {/* TAB: DASHBOARD */}
                  {activeTab === 'dashboard' && (
                    <div className="grid gap-8">
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { label: 'Products', val: products.length, icon: Package, color: 'text-primary' },
                            { label: 'Categories', val: categories.length, icon: LayoutGrid, color: 'text-purple-500' },
                            { label: 'Social', val: fbPosts.length, icon: Share2, color: 'text-blue-500' },
                            { label: 'Reviews', val: reviews.length, icon: Star, color: 'text-yellow-500' }
                          ].map((stat, i) => (
                            <div key={i} className="neon-card !p-6 text-center group hover:border-primary/50 transition-all">
                              <stat.icon className={`mx-auto mb-3 ${stat.color}`} size={24} />
                              <div className="text-3xl font-black text-white">{stat.val}</div>
                              <div className="text-[10px] text-text-dim font-black uppercase tracking-widest mt-1">{stat.label}</div>
                            </div>
                          ))}
                       </div>

                       <div className="neon-card !p-8">
                         <h2 className="text-xl font-black mb-6">Recent Activity</h2>
                         <div className="space-y-4">
                           {products.slice(0, 3).map(p => (
                             <div key={p.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0">
                                  <img src={p.image_url} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-bold text-white">{p.name}</div>
                                  <div className="text-xs text-text-dim">Added {new Date(p.created_at).toLocaleDateString()}</div>
                                </div>
                                <div className="text-primary font-mono font-bold">LKR {p.price}</div>
                             </div>
                           ))}
                         </div>
                       </div>
                    </div>
                  )}

                  {/* TAB: INVENTORY (BULK UPLOAD) */}
                  {activeTab === 'products' && (
                    <div className="space-y-12">
                      <div className="neon-card !p-8">
                        <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                          <Plus className="text-primary" /> New Product
                        </h2>
                        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-6">
                              <div>
                                <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Product Name</label>
                                <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary transition-all outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required placeholder="Enter product name..." />
                              </div>
                              <div>
                                <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Category</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                                  {categories.map(c => <option key={c.id} value={c.name} className="bg-bg-dark">{c.name}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Price (LKR)</label>
                                <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none font-mono" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required placeholder="0.00" />
                              </div>
                           </div>
                           <div className="space-y-6">
                              <div>
                                 <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block text-primary">Primary Showcase Images</label>
                                 <div className="relative group cursor-pointer">
                                   <input 
                                     type="file" 
                                     multiple
                                     accept="image/*"
                                     className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                     onChange={e => e.target.files && setMainImageFiles(Array.from(e.target.files))} 
                                   />
                                   <div className="w-full bg-white/5 border-2 border-dashed border-primary/20 rounded-2xl p-6 text-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                                     <ImageIcon className="mx-auto mb-2 text-text-dim group-hover:text-primary transition-colors" size={24} />
                                     <p className="text-xs font-bold text-text-dim group-hover:text-white transition-colors">
                                       {mainImageFiles.length > 0 ? `${mainImageFiles.length} showcase images` : 'Select Primary Images'}
                                     </p>
                                   </div>
                                 </div>
                              </div>

                               <div>
                                 <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Gallery Images (Bulk)</label>
                                 <div className="relative group cursor-pointer">
                                   <input 
                                     type="file" 
                                     multiple 
                                     accept="image/*"
                                     className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                     onChange={e => e.target.files && setGalleryFiles(Array.from(e.target.files))} 
                                   />
                                   <div className="w-full bg-white/5 border-2 border-dashed border-white/10 rounded-2xl p-8 text-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                                     <ImageIcon className="mx-auto mb-3 text-text-dim group-hover:text-primary transition-colors" size={28} />
                                     <p className="text-sm font-bold text-text-dim group-hover:text-white transition-colors">
                                       {galleryFiles.length > 0 ? `${galleryFiles.length} images selected` : 'Drop gallery images'}
                                     </p>
                                   </div>
                                 </div>
                               </div>
                               <div>
                                 <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Description</label>
                                 <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none min-h-[140px]" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder="Technical details, features..." />
                               </div>
                            </div>
                            <div className="col-span-full flex justify-end">
                               <button type="submit" disabled={isSubmitting || uploadingImage} className="neon-btn !px-12 !py-5 shadow-lg shadow-primary/20">
                                 {isSubmitting || uploadingImage ? <Loader2 className="animate-spin" size={24} /> : <><Plus size={20} /> Publish Product</>}
                               </button>
                            </div>
                         </form>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-text-dim uppercase tracking-[0.2em] px-4">Live Inventory ({products.length})</h3>
                        {products.map(p => (
                          <div key={p.id} className="neon-card !p-4 flex items-center justify-between group hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-6">
                              <div className="w-20 h-20 rounded-2xl bg-black overflow-hidden border border-white/5">
                                <img src={p.image_url} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <div className="text-primary text-[10px] font-black uppercase tracking-widest mb-1">{p.category}</div>
                                <div className="text-lg font-black text-white">{p.name}</div>
                                <div className="text-sm font-mono text-text-dim flex items-center gap-2">
                                  LKR {p.price} • {p.image_urls?.length || 1} Images
                                </div>
                              </div>
                            </div>
                             <div className="flex items-center gap-2">
                               <button 
                                 onClick={() => setEditingProduct(p)} 
                                 className="w-12 h-12 rounded-xl bg-white/5 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center"
                               >
                                 <Edit size={20} />
                               </button>
                               <button 
                                 onClick={() => handleDeleteProduct(p.id)} 
                                 className="w-12 h-12 rounded-xl bg-white/5 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                               >
                                 <Trash2 size={20} />
                               </button>
                             </div>
                           </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB: CATEGORIES */}
                  {activeTab === 'categories' && (
                    <div className="space-y-8">
                       <div className="neon-card !p-8">
                          <h2 className="text-2xl font-black mb-8">Manage Categories</h2>
                          <form onSubmit={handleAddCategory} className="flex gap-4">
                             <input className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none font-bold" placeholder="New category name..." value={newCategory} onChange={e => setNewCategory(e.target.value)} required />
                             <button type="submit" disabled={isSubmitting} className="neon-btn whitespace-nowrap">
                               <Plus size={20} /> Add Category
                             </button>
                          </form>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {categories.map(cat => (
                            <div key={cat.id} className="neon-card !p-6 flex justify-between items-center group">
                               <div className="font-black text-white group-hover:text-primary transition-colors">{cat.name}</div>
                               <button onClick={() => handleDeleteCategory(cat.id)} className="text-text-dim hover:text-red-500 transition-colors p-2">
                                 <Trash2 size={18} />
                               </button>
                            </div>
                          ))}
                       </div>
                    </div>
                  )}

                  {/* TAB: SOCIAL */}
                  {activeTab === 'social' && (
                    <div className="space-y-8">
                      <div className="neon-card !p-8">
                        <h2 className="text-2xl font-black mb-8">Social Feed</h2>
                        <form onSubmit={handleAddFbPost} className="flex gap-4">
                          <input placeholder="Paste Facebook Post URL here..." className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none" value={newFbPost.post_url} onChange={e => setNewFbPost({ post_url: e.target.value })} required />
                          <button type="submit" disabled={isSubmitting} className="neon-btn !bg-[#1877F2]">
                            <Plus size={20} /> Add Post
                          </button>
                        </form>
                      </div>
                      <div className="grid gap-4">
                        {fbPosts.map(post => (
                          <div key={post.id} className="neon-card !p-4 flex justify-between items-center group">
                            <div className="text-text-dim text-sm truncate font-mono max-w-[80%]">{post.post_url}</div>
                            <button onClick={() => handleDeleteFbPost(post.id)} className="w-10 h-10 rounded-lg text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center shrink-0 ml-4">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB: REVIEWS */}
                  {activeTab === 'reviews' && (
                    <div className="space-y-8">
                      <div className="neon-card !p-8">
                        <h2 className="text-2xl font-black mb-8">Add Customer Testimonial</h2>
                        <form onSubmit={handleAddReview} className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Customer Name</label>
                                <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none" value={newReview.customer_name} onChange={e => setNewReview({...newReview, customer_name: e.target.value})} required placeholder="John Doe" />
                              </div>
                              <div>
                                <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Rating</label>
                                <div className="flex gap-2">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <button key={star} type="button" onClick={() => setNewReview({...newReview, rating: star})} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${newReview.rating >= star ? 'bg-yellow-500 text-black' : 'bg-white/5 text-text-dim'}`}>
                                      <Star size={18} fill={newReview.rating >= star ? "currentColor" : "none"} />
                                    </button>
                                  ))}
                                </div>
                              </div>
                           </div>
                           <div>
                              <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Review Message</label>
                              <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none min-h-[100px]" value={newReview.review_text} onChange={e => setNewReview({...newReview, review_text: e.target.value})} required placeholder="Great service, genuine product..." />
                           </div>
                           <div className="flex justify-end">
                              <button type="submit" disabled={isSubmitting} className="neon-btn shadow-lg shadow-yellow-500/10">
                                <Plus size={20} /> Publish Review
                              </button>
                           </div>
                        </form>
                      </div>
                      <div className="grid gap-4">
                        {reviews.map(review => (
                          <div key={review.id} className="neon-card !p-6 flex justify-between items-center">
                            <div>
                              <div className="flex text-yellow-500 mb-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-white/10" : ""} />
                                ))}
                              </div>
                              <div className="text-white font-bold">{review.customer_name}</div>
                              <div className="text-text-dim text-sm mt-1 italic">"{review.review_text}"</div>
                            </div>
                            <button onClick={() => handleDeleteReview(review.id)} className="w-10 h-10 rounded-lg text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center shrink-0 ml-4">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB: MESSAGES */}
                  {activeTab === 'messages' && (
                    <div className="space-y-8">
                       <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-4">
                          <div>
                             <h2 className="text-3xl font-black text-white">Contact <span className="text-primary">Inquiries</span></h2>
                             <p className="text-text-dim text-sm font-bold uppercase tracking-widest mt-2">Messages received via contact form</p>
                          </div>
                       </div>
                       
                       <div className="grid gap-6">
                         {messages.length === 0 ? (
                           <div className="neon-card !p-20 text-center">
                              <Mail size={48} className="mx-auto mb-6 text-white/10" />
                              <div className="text-text-dim font-bold uppercase tracking-widest text-sm">No transmissions received yet.</div>
                           </div>
                         ) : (
                           messages.map(msg => (
                             <div key={msg.id} className="neon-card !p-8 border border-white/5 hover:border-primary/30 transition-all group relative">
                                <div className="absolute top-8 right-8 flex gap-2">
                                   <button 
                                      onClick={() => handleDeleteMessage(msg.id)}
                                      className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                   >
                                      <Trash2 size={18} />
                                   </button>
                                </div>
                                <div className="flex items-start gap-6">
                                   <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                      <Mail size={24} />
                                   </div>
                                   <div className="flex-1 min-w-0">
                                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                                         <h4 className="text-xl font-black text-white truncate">{msg.name}</h4>
                                         <span className="hidden md:block text-white/20">|</span>
                                         <span className="text-sm font-mono text-primary truncate">{msg.email}</span>
                                      </div>
                                      <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white mb-4">
                                         Subject: {msg.subject}
                                      </div>
                                      <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 text-text-dim leading-relaxed font-medium">
                                         {msg.message}
                                      </div>
                                      <div className="mt-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                                         Received: {new Date(msg.created_at).toLocaleString()}
                                      </div>
                                   </div>
                                </div>
                             </div>
                           ))
                         )}
                       </div>
                    </div>
                  )}

                   {/* TAB: FAQ MANAGER */}
                   {activeTab === 'faq' && (
                     <div className="space-y-8">
                       <div className="neon-card !p-8 md:!p-12">
                         <h2 className="text-2xl font-black mb-2">FAQ Manager</h2>
                         <p className="text-text-dim mb-10 text-sm font-bold uppercase tracking-widest">Manage frequently asked questions</p>
                         <form onSubmit={handleAddFaq} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div>
                                  <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Category</label>
                                  <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={newFaq.category} onChange={e => setNewFaq({...newFaq, category: e.target.value})} placeholder="General, Delivery, etc." />
                               </div>
                               <div>
                                  <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Display Order</label>
                                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={newFaq.display_order} onChange={e => setNewFaq({...newFaq, display_order: parseInt(e.target.value)})} />
                               </div>
                            </div>
                            <div>
                               <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Question</label>
                               <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={newFaq.question} onChange={e => setNewFaq({...newFaq, question: e.target.value})} placeholder="How do I track my order?" />
                            </div>
                            <div>
                               <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Answer</label>
                               <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white min-h-[120px]" value={newFaq.answer} onChange={e => setNewFaq({...newFaq, answer: e.target.value})} placeholder="Enter the answer here..." />
                            </div>
                            <div className="flex justify-end">
                               <button type="submit" disabled={isSubmitting} className="neon-btn">
                                 {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Add FAQ</>}
                               </button>
                            </div>
                         </form>
                       </div>

                       <div className="neon-card !p-8 md:!p-12">
                          <h3 className="text-xl font-black mb-8 tracking-tighter uppercase">Existing FAQs</h3>
                          <div className="space-y-4">
                             {faqs.map((faq) => (
                               <div key={faq.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex justify-between items-start gap-4">
                                  <div className="flex-1">
                                     <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">{faq.category}</span>
                                        <span className="text-xs font-mono text-white/40">#{faq.display_order}</span>
                                     </div>
                                     <h4 className="text-white font-black mb-2">{faq.question}</h4>
                                     <p className="text-sm text-text-dim line-clamp-2">{faq.answer}</p>
                                  </div>
                                  <button onClick={() => handleDeleteFaq(faq.id)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shrink-0">
                                     <Trash2 size={18} />
                                  </button>
                               </div>
                             ))}
                          </div>
                       </div>
                     </div>
                   )}

                   {/* TAB: HERO SHOWCASE */}
                  {activeTab === 'hero' && (
                    <div className="space-y-12">
                      <div className="neon-card !p-8">
                        <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                          <ImageIcon className="text-primary" /> New Hero Slide
                        </h2>
                        <form onSubmit={handleAddHeroSlide} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div>
                              <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Image Upload</label>
                              <div className="relative group cursor-pointer">
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                  onChange={e => e.target.files && setHeroFile(e.target.files[0])} 
                                />
                                <div className="w-full bg-white/5 border-2 border-dashed border-primary/20 rounded-2xl p-6 text-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                                  <ImageIcon className="mx-auto mb-2 text-text-dim group-hover:text-primary transition-colors" size={24} />
                                  <p className="text-xs font-bold text-text-dim group-hover:text-white transition-colors">
                                    {heroFile ? heroFile.name : 'Select Hero Image'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Or Image URL</label>
                              <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none font-mono text-sm" value={newHeroSlide.image_url} onChange={e => setNewHeroSlide({...newHeroSlide, image_url: e.target.value})} placeholder="https://..." />
                            </div>
                          </div>
                          <div className="space-y-6">
                            <div>
                              <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Main Title (Optional)</label>
                              <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none" value={newHeroSlide.title} onChange={e => setNewHeroSlide({...newHeroSlide, title: e.target.value})} placeholder="e.g. SUMMER SALE" />
                            </div>
                            <div>
                              <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Subtitle (Optional)</label>
                              <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none" value={newHeroSlide.subtitle} onChange={e => setNewHeroSlide({...newHeroSlide, subtitle: e.target.value})} placeholder="e.g. Up to 50% Off" />
                            </div>
                            <button disabled={isSubmitting} type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-3">
                              {isSubmitting ? <Loader2 className="animate-spin" /> : <><Plus /> Add Hero Slide</>}
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="neon-card !p-8">
                        <h2 className="text-2xl font-black mb-8">Active Slides</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {heroSlides.map((slide, idx) => (
                            <div key={slide.id} className="group relative bg-white/5 rounded-3xl overflow-hidden border border-white/10">
                              <img src={slide.image_url} className="w-full aspect-video object-cover" />
                              <div className="p-6">
                                <div className="text-primary text-[10px] font-black uppercase tracking-widest mb-1">Slide #{idx + 1}</div>
                                <div className="font-bold text-white mb-1 truncate">{slide.title || 'No Title'}</div>
                                <div className="text-xs text-text-dim truncate">{slide.subtitle || 'No Subtitle'}</div>
                              </div>
                              <button onClick={() => handleDeleteHeroSlide(slide.id)} className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-red-500/20 text-red-500 backdrop-blur-xl border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                          {heroSlides.length === 0 && (
                            <div className="col-span-full py-20 text-center text-text-dim italic">No hero slides found. Add one above!</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                   {/* TAB: SITE CONTENT */}
                   {activeTab === 'content' && (
                     <div className="space-y-8">
                       <form onSubmit={handleSaveContent} className="space-y-8">
                          {/* BRAND IDENTITY */}
                          <div className="neon-card !p-8 md:!p-12">
                            <h3 className="text-xl font-black mb-8 tracking-tighter uppercase flex items-center gap-3">
                               <Zap className="text-primary" size={24} /> Brand Identity
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div>
                                  <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Brand Name</label>
                                  <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={settings.brand_name || ''} onChange={e => setSettings({...settings, brand_name: e.target.value})} placeholder="E.g. NEON CALC" />
                               </div>
                               <div>
                                  <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Brand Tagline (Used in Footer)</label>
                                  <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={settings.brand_tagline || ''} onChange={e => setSettings({...settings, brand_tagline: e.target.value})} placeholder="E.g. Premier electronics in Sri Lanka" />
                               </div>
                            </div>
                          </div>

                          {/* HERO SECTION */}
                          <div className="neon-card !p-8 md:!p-12">
                            <h3 className="text-xl font-black mb-8 tracking-tighter uppercase flex items-center gap-3">
                               <LayoutGrid className="text-primary" size={24} /> Hero Section
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div className="col-span-full">
                                  <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Hero Badge Text</label>
                                  <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={settings.hero_badge || ''} onChange={e => setSettings({...settings, hero_badge: e.target.value})} placeholder="E.g. Sri Lanka's #1 Destination" />
                               </div>
                               <div>
                                  <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Heading Line 1</label>
                                  <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={settings.hero_line1 || ''} onChange={e => setSettings({...settings, hero_line1: e.target.value})} placeholder="NEON CALC" />
                               </div>
                               <div>
                                  <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Heading Line 2 (Primary Color)</label>
                                  <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={settings.hero_line2 || ''} onChange={e => setSettings({...settings, hero_line2: e.target.value})} placeholder="PRO SERIES" />
                               </div>
                               <div className="col-span-full">
                                  <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Hero Tagline</label>
                                  <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={settings.hero_tagline || ''} onChange={e => setSettings({...settings, hero_tagline: e.target.value})} placeholder="Enter main hero description..." />
                               </div>
                            </div>
                          </div>

                          {/* ABOUT SECTION */}
                          <div className="neon-card !p-8 md:!p-12">
                            <h3 className="text-xl font-black mb-8 tracking-tighter uppercase flex items-center gap-3">
                               <Info className="text-primary" size={24} /> About Us Page
                            </h3>
                            <div className="space-y-6">
                               <div>
                                  <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Intro Heading</label>
                                  <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={settings.about_intro || ''} onChange={e => setSettings({...settings, about_intro: e.target.value})} placeholder="The Evolution of Precision" />
                               </div>
                               <div>
                                  <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Our Full Story</label>
                                  <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white min-h-[200px]" value={settings.about_story || ''} onChange={e => setSettings({...settings, about_story: e.target.value})} placeholder="Write your brand story here..." />
                               </div>
                            </div>
                          </div>

                          {/* WARRANTY SECTION */}
                          <div className="neon-card !p-8 md:!p-12">
                            <h3 className="text-xl font-black mb-8 tracking-tighter uppercase flex items-center gap-3">
                               <ShieldCheck className="text-primary" size={24} /> Warranty & Returns
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div>
                                  <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Page Title</label>
                                  <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={settings.warranty_title || ''} onChange={e => setSettings({...settings, warranty_title: e.target.value})} />
                               </div>
                               <div>
                                  <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Warranty Period</label>
                                  <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={settings.warranty_period || ''} onChange={e => setSettings({...settings, warranty_period: e.target.value})} placeholder="e.g. 12 Months" />
                               </div>
                               <div>
                                  <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Returns Period</label>
                                  <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={settings.returns_period || ''} onChange={e => setSettings({...settings, returns_period: e.target.value})} placeholder="e.g. 7 Days" />
                               </div>
                               <div className="col-span-full">
                                  <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Warranty Intro</label>
                                  <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={settings.warranty_intro || ''} onChange={e => setSettings({...settings, warranty_intro: e.target.value})} />
                               </div>
                               <div className="col-span-full">
                                  <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Warranty Details</label>
                                  <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white min-h-[100px]" value={settings.warranty_details || ''} onChange={e => setSettings({...settings, warranty_details: e.target.value})} />
                               </div>
                               <div className="col-span-full">
                                  <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Returns Details</label>
                                  <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white min-h-[100px]" value={settings.returns_details || ''} onChange={e => setSettings({...settings, returns_details: e.target.value})} />
                               </div>
                               <div className="col-span-full">
                                  <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Exclusions (Damages not covered)</label>
                                  <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white min-h-[100px]" value={settings.exclusions || ''} onChange={e => setSettings({...settings, exclusions: e.target.value})} />
                               </div>
                               <div className="col-span-full">
                                  <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">How to Claim Claim Instructions</label>
                                  <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={settings.contact_info || ''} onChange={e => setSettings({...settings, contact_info: e.target.value})} />
                               </div>
                            </div>
                          </div>

                          {/* SAVE BUTTON */}
                          <div className="fixed bottom-10 right-10 z-50">
                             <button type="submit" disabled={isSubmitting} className="neon-btn !px-12 !py-5 shadow-2xl shadow-primary/20">
                               {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <><Save size={20} /> Save All Content</>}
                             </button>
                          </div>
                       </form>
                     </div>
                   )}

                  {/* TAB: SETTINGS */}
                  {activeTab === 'settings' && (
                    <div className="neon-card !p-8 md:!p-12">
                      <h2 className="text-2xl font-black mb-2">Global Settings</h2>
                      <p className="text-text-dim mb-10 text-sm font-bold uppercase tracking-widest">Update store contact information</p>
                      <form onSubmit={handleUpdateSettings} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div>
                            <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Direct Contact</label>
                            <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={settings.phone || ''} onChange={e => setSettings({...settings, phone: e.target.value})} placeholder="07x xxx xxxx" />
                         </div>
                         <div>
                            <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">WhatsApp (International Format)</label>
                            <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-mono" value={settings.whatsapp || ''} onChange={e => setSettings({...settings, whatsapp: e.target.value})} placeholder="947xxxxxxxx" />
                         </div>
                         <div>
                            <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Official Email</label>
                            <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={settings.email || ''} onChange={e => setSettings({...settings, email: e.target.value})} placeholder="support@neoncalc.lk" />
                         </div>
                         <div>
                            <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Facebook Page Link</label>
                            <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" value={settings.fb_link || ''} onChange={e => setSettings({...settings, fb_link: e.target.value})} placeholder="https://..." />
                         </div>
                         <div className="col-span-full pt-6 flex justify-end">
                            <button type="submit" disabled={isSubmitting} className="neon-btn !px-12 !py-5">
                              {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <><Save size={20} /> Sync Settings</>}
                            </button>
                         </div>
                      </form>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-bg-dark/80 backdrop-blur-xl border-t border-white/10 z-[1000] px-4 py-2">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {[
            { id: 'dashboard', icon: LayoutGrid, label: 'Dash' },
            { id: 'products', icon: Package, label: 'Items' },
            { id: 'categories', icon: LayoutGrid, label: 'Cats' },
            { id: 'social', icon: Share2, label: 'Social' },
            { id: 'settings', icon: Settings, label: 'Setup' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
                activeTab === item.id ? 'text-primary scale-110' : 'text-text-dim'
              }`}
            >
              <item.icon size={22} strokeWidth={activeTab === item.id ? 3 : 2} />
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* EDIT PRODUCT MODAL */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-bg-dark border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div>
                  <h2 className="text-2xl font-black tracking-tighter uppercase">Edit <span className="text-primary">Product</span></h2>
                  <p className="text-[10px] text-text-dim font-black uppercase tracking-widest">Update specifications and imagery</p>
                </div>
                <button onClick={() => setEditingProduct(null)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-dim hover:text-white transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto">
                <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Product Name</label>
                      <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none font-bold" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} required />
                    </div>
                    <div>
                      <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Category</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none font-bold" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                        {categories.map(c => <option key={c.id} value={c.name} className="bg-bg-dark">{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Price (LKR)</label>
                      <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none font-mono font-bold" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} required />
                    </div>
                    <div>
                      <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block text-primary">Main Image URL</label>
                      <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none font-mono text-xs" value={editingProduct.image_url} onChange={e => setEditingProduct({...editingProduct, image_url: e.target.value})} required />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Description</label>
                      <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none min-h-[120px] font-bold" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                    </div>
                    
                    <div>
                      <label className="text-xs font-black text-text-dim uppercase tracking-widest mb-3 block">Image Gallery</label>
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        {editingProduct.image_urls?.map((url: string, idx: number) => (
                          <div key={idx} className="flex gap-2">
                            <input className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white text-[10px] font-mono" value={url} onChange={e => {
                              const newUrls = [...editingProduct.image_urls];
                              newUrls[idx] = e.target.value;
                              setEditingProduct({...editingProduct, image_urls: newUrls});
                            }} />
                            <button type="button" onClick={() => {
                              const newUrls = editingProduct.image_urls.filter((_: any, i: number) => i !== idx);
                              setEditingProduct({...editingProduct, image_urls: newUrls});
                            }} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 hover:bg-red-500 hover:text-white transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={() => setEditingProduct({...editingProduct, image_urls: [...(editingProduct.image_urls || []), '']})} className="mt-4 text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform origin-left">
                        <Plus size={14} /> Add New Image Slot
                      </button>
                    </div>
                  </div>

                  <div className="col-span-full pt-8 border-t border-white/5 flex justify-end gap-4">
                    <button type="button" onClick={() => setEditingProduct(null)} className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-text-dim hover:text-white transition-all">
                      Discard Changes
                    </button>
                    <button type="submit" disabled={isSubmitting} className="neon-btn !px-12 !py-4 shadow-xl shadow-primary/20">
                      {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Save Changes</>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
