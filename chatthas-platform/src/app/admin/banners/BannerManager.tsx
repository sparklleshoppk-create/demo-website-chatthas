'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaTrash, FaEye, FaEyeSlash, FaCloudUploadAlt, FaSave, FaLink } from 'react-icons/fa';
import { createBanner, updateBanner, deleteBanner } from './actions';
import { createClient } from '@/utils/supabase/client';

export default function BannerManager({ banners }: { banners: any[] }) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [activeMethod, setActiveMethod] = useState<'upload' | 'url' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setActiveMethod('upload');
    setUrlInput(''); // Clear URL if uploading

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `banners/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('website-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('website-assets').getPublicUrl(filePath);
      setPreview(data.publicUrl);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
      setActiveMethod(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrlInput(val);
    if (val) {
      setActiveMethod('url');
      setPreview(val);
    } else {
      setActiveMethod(null);
      setPreview(null);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const finalUrl = activeMethod === 'upload' ? preview : urlInput;
    if (finalUrl) fd.set('image_url', finalUrl);
    
    await createBanner(fd);
    setShowAdd(false);
    setPreview(null);
    setUrlInput('');
    setActiveMethod(null);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <button onClick={() => setShowAdd(!showAdd)} className="btn-gold flex items-center gap-2">
        <FaPlus size={12} /> Add New Homepage Banner
      </button>

      {showAdd && (
        <form onSubmit={handleCreate} className="bg-dark-card p-6 border border-dark-border rounded-sm space-y-6 shadow-xl">
          <h3 className="text-lg font-display font-bold text-cream">Create New Banner</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Image Selection */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-cream/40 uppercase tracking-widest">Banner Visual</label>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Method 1: Upload */}
                <div 
                  onClick={() => activeMethod !== 'url' && fileInputRef.current?.click()}
                  className={`aspect-video bg-charcoal border-2 border-dashed rounded-sm flex flex-col items-center justify-center transition-all overflow-hidden relative group ${
                    activeMethod === 'url' ? 'opacity-20 cursor-not-allowed border-dark-border' : 'cursor-pointer border-dark-border hover:border-gold-500/40'
                  }`}
                >
                  {activeMethod === 'upload' && preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <FaCloudUploadAlt size={40} className="text-cream/20 mb-2" />
                      <span className="text-xs text-cream/30">{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={activeMethod === 'url'} />
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-dark-border" />
                  <span className="text-[10px] font-bold text-cream/20 uppercase tracking-widest">OR</span>
                  <div className="h-px flex-1 bg-dark-border" />
                </div>

                {/* Method 2: URL */}
                <div className={`relative ${activeMethod === 'upload' ? 'opacity-20 pointer-events-none' : ''}`}>
                  <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20" size={14} />
                  <input 
                    type="text" 
                    placeholder="Paste external Image URL..." 
                    className="admin-input pl-11" 
                    value={urlInput}
                    onChange={handleUrlChange}
                    disabled={activeMethod === 'upload'}
                  />
                </div>
              </div>
            </div>

            {/* Right: Details */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-cream/40 uppercase">Title</label>
                <input name="title" placeholder="Making Desi Food Great Again" className="admin-input" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-cream/40 uppercase">Subtitle</label>
                <textarea name="subtitle" placeholder="Experience authentic flavors..." className="admin-input h-20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-cream/40 uppercase">Button Text</label>
                  <input name="button_text" placeholder="Order Now" className="admin-input" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-cream/40 uppercase">Button Link</label>
                  <input name="button_link" placeholder="/menu" className="admin-input" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-dark-border">
            <button type="submit" className="btn-gold px-12" disabled={isUploading || !activeMethod}>
              <FaSave size={14} /> Save Banner
            </button>
            <button 
              type="button" 
              onClick={() => { setShowAdd(false); setPreview(null); setUrlInput(''); setActiveMethod(null); }} 
              className="text-cream/40 hover:text-cream text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Banner List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map(banner => (
          <div key={banner.id} className="bg-dark-card border border-dark-border rounded-sm overflow-hidden group hover:border-gold-500/20 transition-all">
            <div className="relative h-48">
              <img src={banner.image_url} alt="" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/90 to-transparent">
                <p className="font-display text-xl font-bold text-cream">{banner.title || 'Untitled'}</p>
                <p className="text-[10px] text-gold-500 uppercase tracking-widest font-bold mt-1">{banner.button_text}</p>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => updateBanner(banner.id, { is_active: !banner.is_active }).then(() => router.refresh())} className="p-2.5 bg-charcoal/90 rounded-sm hover:text-gold-500 transition-colors">
                  {banner.is_active ? <FaEye size={14} /> : <FaEyeSlash size={14} className="text-cream/30" />}
                </button>
                <button onClick={() => deleteBanner(banner.id).then(() => router.refresh())} className="p-2.5 bg-charcoal/90 rounded-sm hover:text-ember-500 transition-colors">
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
