'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaTrash, FaEye, FaEyeSlash, FaCloudUploadAlt, FaSave, FaLink, FaMobileAlt, FaDesktop, FaEdit, FaTimes, FaSpinner } from 'react-icons/fa';
import { createBanner, updateBanner, deleteBanner } from './actions';
import { createClient } from '@/utils/supabase/client';

// Shared premium canvas image compressor utility
const compressImage = (file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.7): Promise<{ file: File; base64: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const compressedFile = new File([u8arr], file.name, { type: mime });
        
        resolve({ file: compressedFile, base64: dataUrl });
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function BannerManager({ banners }: { banners: any[] }) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);

  const [isUploadingDesktop, setIsUploadingDesktop] = useState(false);
  const [isUploadingMobile, setIsUploadingMobile] = useState(false);
  
  const [previewDesktop, setPreviewDesktop] = useState<string | null>(null);
  const [previewMobile, setPreviewMobile] = useState<string | null>(null);
  
  const [notice, setNotice] = useState<string | null>(null);
  
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const editDesktopInputRef = useRef<HTMLInputElement>(null);
  const editMobileInputRef = useRef<HTMLInputElement>(null);
  
  const supabase = createClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile', isEditMode = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'desktop') setIsUploadingDesktop(true);
    else setIsUploadingMobile(true);
    setNotice(null);

    try {
      // Compress both visual assets to ensure high-performance, lag-free slide loads
      const sizeLimit = type === 'desktop' ? 1600 : 800;
      const compressed = await compressImage(file, sizeLimit, sizeLimit, 0.7);

      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${type}_${Math.random()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      // 1. Try Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('website-assets')
        .upload(filePath, compressed.file);

      if (uploadError) {
        console.warn('Storage failed, using fallback Base64 data URL:', uploadError.message);
        if (isEditMode && editingBanner) {
          setEditingBanner((prev: any) => ({
            ...prev,
            [type === 'desktop' ? 'media_url' : 'media_url_mobile']: compressed.base64
          }));
        } else {
          if (type === 'desktop') setPreviewDesktop(compressed.base64);
          else setPreviewMobile(compressed.base64);
        }
        setNotice(`Notice: Asset compressed & stored as fallback local Base64 URL.`);
      } else {
        const { data } = supabase.storage.from('website-assets').getPublicUrl(filePath);
        if (isEditMode && editingBanner) {
          setEditingBanner((prev: any) => ({
            ...prev,
            [type === 'desktop' ? 'media_url' : 'media_url_mobile']: data.publicUrl
          }));
        } else {
          if (type === 'desktop') setPreviewDesktop(data.publicUrl);
          else setPreviewMobile(data.publicUrl);
        }
        setNotice(`Success: Asset compressed and uploaded to cloud.`);
      }
    } catch (err: any) {
      alert(`Visual processing failed: ${err.message}`);
    } finally {
      if (type === 'desktop') setIsUploadingDesktop(false);
      else setIsUploadingMobile(false);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    if (previewDesktop) fd.set('media_url', previewDesktop);
    if (previewMobile) fd.set('media_url_mobile', previewMobile);
    
    if (!previewDesktop) {
      setNotice('Error: Please upload a desktop banner image before publishing.');
      return;
    }

    const res = await createBanner(fd);
    
    if (res?.error) {
      setNotice(`Error: ${res.error}`);
      alert(`Failed to create banner: ${res.error}`);
      return;
    }

    setShowAdd(false);
    setPreviewDesktop(null);
    setPreviewMobile(null);
    setNotice(null);
    router.refresh();
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    const data = {
      title: fd.get('title') as string,
      subtitle: fd.get('subtitle') as string,
      cta_text: fd.get('cta_text') as string,
      cta_url: fd.get('cta_url') as string,
      cta_style: fd.get('cta_style') as string,
      target: fd.get('target') as string,
      animation_type: fd.get('animation_type') as string,
      media_url: editingBanner.media_url,
      media_url_mobile: editingBanner.media_url_mobile,
      start_date: fd.get('start_date') ? new Date(fd.get('start_date') as string).toISOString() : null,
      end_date: fd.get('end_date') ? new Date(fd.get('end_date') as string).toISOString() : null,
      sort_order: parseInt(fd.get('sort_order') as string) || 0,
    };

    const res = await updateBanner(editingBanner.id, data);
    if (res?.error) {
      alert(res.error);
    } else {
      setEditingBanner(null);
      setNotice(null);
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm font-display font-light italic gold-text">Manage Hero campaigns & Banners</h2>
          <p className="text-base tracking-widest uppercase text-cream/40 mt-2">Design homepage slides, responsive banners, and popup prompts</p>
        </div>
        <button onClick={() => { setShowAdd(!showAdd); setEditingBanner(null); }} className="btn-gold flex items-center gap-2">
          <FaPlus size={12} /> Add New Banner
        </button>
      </div>

      {notice && (
        <div className="text-xs text-gold-500/80 bg-gold-500/10 border border-gold-500/20 p-4 rounded-sm">
          {notice}
        </div>
      )}

      {/* Add Banner Form */}
      {showAdd && (
        <form onSubmit={handleCreate} className="bg-charcoal p-8 border border-dark-border rounded-sm shadow-card space-y-8 animate-in fade-in duration-300">
          <h3 className="text-sm font-display font-light italic gold-text border-b border-dark-border/50 pb-4">Create New Campaign</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Media Assets */}
            <div className="space-y-6">
              <label className="text-base font-bold text-cream/40 uppercase tracking-widest block border-b border-dark-border pb-2">1. Visual Assets (Auto-Compressed)</label>
              
              {/* Desktop Upload */}
              <div className="space-y-2">
                <div className="flex justify-between text-base text-cream/60">
                  <span className="flex items-center gap-2"><FaDesktop /> Desktop Banner Asset (1920x800)</span>
                </div>
                <div 
                  onClick={() => !isUploadingDesktop && desktopInputRef.current?.click()}
                  className="aspect-video bg-primary-black border border-dark-border hover:border-gold-500/50 rounded-sm flex flex-col items-center justify-center transition-colors overflow-hidden cursor-pointer group"
                >
                  {isUploadingDesktop ? (
                    <div className="flex flex-col items-center gap-2">
                      <FaSpinner className="animate-spin text-gold-500" />
                      <span className="text-xs uppercase tracking-widest text-cream/30">Optimizing...</span>
                    </div>
                  ) : previewDesktop ? (
                    <img src={previewDesktop} alt="Desktop Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <>
                      <FaCloudUploadAlt size={32} className="text-gold-500/30 mb-2 group-hover:text-gold-500/60 transition-colors" />
                      <span className="text-xs uppercase tracking-widest text-cream/30">Upload Desktop Graphic</span>
                    </>
                  )}
                  <input ref={desktopInputRef} type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'desktop')} accept="image/*" />
                </div>
              </div>

              {/* Mobile Upload */}
              <div className="space-y-2">
                <div className="flex justify-between text-base text-cream/60">
                  <span className="flex items-center gap-2"><FaMobileAlt /> Mobile Banner Asset (768x600)</span>
                </div>
                <div 
                  onClick={() => !isUploadingMobile && mobileInputRef.current?.click()}
                  className="w-1/2 aspect-[4/5] bg-primary-black border border-dark-border hover:border-gold-500/50 rounded-sm flex flex-col items-center justify-center transition-colors overflow-hidden cursor-pointer group"
                >
                  {isUploadingMobile ? (
                    <div className="flex flex-col items-center gap-2">
                      <FaSpinner className="animate-spin text-gold-500" />
                      <span className="text-xs uppercase tracking-widest text-cream/30">Optimizing...</span>
                    </div>
                  ) : previewMobile ? (
                    <img src={previewMobile} alt="Mobile Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <>
                      <FaCloudUploadAlt size={24} className="text-gold-500/30 mb-2 group-hover:text-gold-500/60 transition-colors" />
                      <span className="text-xs uppercase tracking-widest text-cream/30 text-center px-4">Upload Mobile Graphic</span>
                    </>
                  )}
                  <input ref={mobileInputRef} type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'mobile')} accept="image/*" />
                </div>
              </div>
            </div>

            {/* Right: Configuration */}
            <div className="space-y-6">
              <label className="text-base font-bold text-cream/40 uppercase tracking-widest block border-b border-dark-border pb-2">2. Campaign Details</label>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Target Area</label>
                    <select name="target" className="admin-input bg-primary-black text-base uppercase" defaultValue="homepage_hero">
                      <option value="homepage_hero">Homepage Hero</option>
                      <option value="promotional_strip">Promo Strip</option>
                      <option value="popup">Popup Modal</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Animation</label>
                    <select name="animation_type" className="admin-input bg-primary-black text-base uppercase" defaultValue="fade">
                      <option value="fade">Fade In</option>
                      <option value="slide_up">Slide Up</option>
                      <option value="zoom">Zoom Pan</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Headline (Optional)</label>
                  <input name="title" placeholder="A Taste of Luxury" className="admin-input bg-primary-black" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Sub-headline (Optional)</label>
                  <textarea name="subtitle" placeholder="Experience authentic flavors..." className="admin-input bg-primary-black h-16" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1 col-span-1">
                    <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Button Text</label>
                    <input name="cta_text" placeholder="Order Now" className="admin-input bg-primary-black" />
                  </div>
                  <div className="space-y-1 col-span-1">
                    <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Button Link</label>
                    <input name="cta_url" placeholder="/menu" className="admin-input bg-primary-black" />
                  </div>
                  <div className="space-y-1 col-span-1">
                    <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Style</label>
                    <select name="cta_style" className="admin-input bg-primary-black text-base uppercase">
                      <option value="primary">Solid Gold</option>
                      <option value="outline">Outline</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dark-border/50">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Schedule Start</label>
                    <input type="datetime-local" name="start_date" className="admin-input bg-primary-black text-base" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Schedule End</label>
                    <input type="datetime-local" name="end_date" className="admin-input bg-primary-black text-base" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Sort Order</label>
                  <input type="number" name="sort_order" defaultValue="0" className="admin-input bg-primary-black" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-dark-border">
            <button type="submit" className="btn-gold" disabled={isUploadingDesktop || isUploadingMobile}>
              <FaSave size={12} className="inline mr-1" /> Publish Campaign
            </button>
            <button 
              type="button" 
              onClick={() => { setShowAdd(false); setPreviewDesktop(null); setPreviewMobile(null); setNotice(null); }} 
              className="btn-outline-gold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Edit Banner Drawer/Modal */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-charcoal border-l border-dark-border p-8 overflow-y-auto space-y-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-dark-border/60 pb-4">
                <h3 className="text-sm font-display font-light italic gold-text">Edit Campaign Properties</h3>
                <button onClick={() => { setEditingBanner(null); setNotice(null); }} className="text-cream/40 hover:text-cream p-2 bg-primary-black rounded-full border border-dark-border">
                  <FaTimes size={16} />
                </button>
              </div>

              <form id="edit-banner-form" onSubmit={handleUpdateSubmit} className="space-y-6">
                {/* Visual Asset Previews & Uploads */}
                <div className="space-y-4">
                  <label className="text-base font-bold text-cream/40 uppercase tracking-widest block border-b border-dark-border pb-1">Visual Assets (Auto-Compressed)</label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs uppercase tracking-widest text-cream/60 flex items-center gap-1"><FaDesktop /> Desktop</span>
                      <div 
                        onClick={() => !isUploadingDesktop && editDesktopInputRef.current?.click()}
                        className="aspect-video bg-primary-black border border-dark-border hover:border-gold-500/40 rounded-sm relative flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
                      >
                        {isUploadingDesktop ? (
                          <FaSpinner className="animate-spin text-gold-500" />
                        ) : editingBanner.media_url ? (
                          <img src={editingBanner.media_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs uppercase text-cream/20">Empty</span>
                        )}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-cream uppercase font-bold tracking-widest">Replace</span>
                        </div>
                        <input ref={editDesktopInputRef} type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'desktop', true)} accept="image/*" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs uppercase tracking-widest text-cream/60 flex items-center gap-1"><FaMobileAlt /> Mobile</span>
                      <div 
                        onClick={() => !isUploadingMobile && editMobileInputRef.current?.click()}
                        className="aspect-video bg-primary-black border border-dark-border hover:border-gold-500/40 rounded-sm relative flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
                      >
                        {isUploadingMobile ? (
                          <FaSpinner className="animate-spin text-gold-500" />
                        ) : editingBanner.media_url_mobile ? (
                          <img src={editingBanner.media_url_mobile} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs uppercase text-cream/20">Empty</span>
                        )}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-cream uppercase font-bold tracking-widest">Replace</span>
                        </div>
                        <input ref={editMobileInputRef} type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'mobile', true)} accept="image/*" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Target Area</label>
                    <select name="target" className="admin-input bg-primary-black text-base uppercase" defaultValue={editingBanner.target}>
                      <option value="homepage_hero">Homepage Hero</option>
                      <option value="promotional_strip">Promo Strip</option>
                      <option value="popup">Popup Modal</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Animation</label>
                    <select name="animation_type" className="admin-input bg-primary-black text-base uppercase" defaultValue={editingBanner.animation_type}>
                      <option value="fade">Fade In</option>
                      <option value="slide_up">Slide Up</option>
                      <option value="zoom">Zoom Pan</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Headline</label>
                  <input name="title" defaultValue={editingBanner.title || ''} className="admin-input bg-primary-black" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Sub-headline</label>
                  <textarea name="subtitle" defaultValue={editingBanner.subtitle || ''} className="admin-input bg-primary-black h-20" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Button Text</label>
                    <input name="cta_text" defaultValue={editingBanner.cta_text || ''} className="admin-input bg-primary-black" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Button Link</label>
                    <input name="cta_url" defaultValue={editingBanner.cta_url || ''} className="admin-input bg-primary-black" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Style</label>
                    <select name="cta_style" className="admin-input bg-primary-black text-base uppercase" defaultValue={editingBanner.cta_style || 'primary'}>
                      <option value="primary">Solid Gold</option>
                      <option value="outline">Outline</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Schedule Start</label>
                    <input type="datetime-local" name="start_date" defaultValue={editingBanner.start_date ? new Date(editingBanner.start_date).toISOString().slice(0, 16) : ''} className="admin-input bg-primary-black text-base" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Schedule End</label>
                    <input type="datetime-local" name="end_date" defaultValue={editingBanner.end_date ? new Date(editingBanner.end_date).toISOString().slice(0, 16) : ''} className="admin-input bg-primary-black text-base" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Sort Order</label>
                  <input type="number" name="sort_order" defaultValue={editingBanner.sort_order || 0} className="admin-input bg-primary-black" />
                </div>
              </form>
            </div>

            <div className="flex gap-4 border-t border-dark-border pt-6 mt-6">
              <button type="submit" form="edit-banner-form" className="btn-gold flex-1 justify-center py-3">
                <FaSave size={12} className="inline mr-1" /> Save Changes
              </button>
              <button 
                type="button" 
                onClick={() => { setEditingBanner(null); setNotice(null); }} 
                className="btn-outline-gold flex-1 justify-center py-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Card Display List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {banners.map(banner => (
          <div key={banner.id} className="bg-charcoal border border-dark-border rounded-sm overflow-hidden card-lift group flex flex-col justify-between">
            <div className="relative h-60 bg-black/40">
              <img src={banner.media_url} alt="" className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent">
                <span className="text-xs uppercase tracking-[0.2em] text-gold-500 mb-2 font-bold">{banner.target.replace('_', ' ')}</span>
                <p className="font-display text-2xl font-light italic text-cream mb-1">{banner.title || 'Visual Overlay Campaign'}</p>
                {banner.subtitle && <p className="text-xs text-cream/60 truncate font-body mb-2">{banner.subtitle}</p>}
                {banner.cta_text && (
                  <p className="text-[10px] text-gold-500 uppercase tracking-[0.2em] font-bold mt-2 border border-gold-500/20 px-3 py-1 w-max rounded-sm bg-primary-black/35">
                    {banner.cta_text} → {banner.cta_url}
                  </p>
                )}
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => setEditingBanner(banner)}
                  className="p-2.5 bg-black/60 text-cream/60 rounded-sm hover:text-gold-500 hover:bg-gold-500/10 transition-colors backdrop-blur-sm"
                  title="Edit Campaign"
                >
                  <FaEdit size={12} />
                </button>
                <button 
                  onClick={() => updateBanner(banner.id, { is_active: !banner.is_active }).then(() => router.refresh())} 
                  className={`p-2.5 rounded-sm transition-colors backdrop-blur-sm ${banner.is_active ? 'bg-gold-500/20 text-gold-500 hover:bg-gold-500/40' : 'bg-black/60 text-cream/30 hover:text-cream'}`}
                  title="Toggle Visibility"
                >
                  {banner.is_active ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
                </button>
                <button 
                  onClick={() => { if(confirm('Delete this campaign?')) deleteBanner(banner.id).then(() => router.refresh()) }} 
                  className="p-2.5 bg-black/60 text-cream/50 rounded-sm hover:text-ember-500 hover:bg-ember-500/20 transition-colors backdrop-blur-sm"
                  title="Delete Campaign"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
            
            {/* Status Bar */}
            <div className="px-6 py-3 bg-primary-black border-t border-dark-border flex justify-between items-center text-xs font-bold tracking-widest uppercase">
              <span className="text-cream/40 flex items-center gap-3">
                <span className="flex items-center gap-1"><FaDesktop className={banner.media_url ? 'text-gold-500' : 'text-cream/20'} /> Desk</span>
                <span className="flex items-center gap-1"><FaMobileAlt className={banner.media_url_mobile ? 'text-gold-500' : 'text-cream/20'} /> Mob</span>
              </span>
              <span className={banner.is_active ? 'text-green-500' : 'text-ember-500'}>
                {banner.is_active ? '• Active' : '• Paused'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
