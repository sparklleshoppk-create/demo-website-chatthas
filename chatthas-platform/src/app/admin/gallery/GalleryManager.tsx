'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaTrash, FaCloudUploadAlt, FaSave, FaLink } from 'react-icons/fa';
import { addGalleryImage, deleteGalleryImage } from './actions';
import { createClient } from '@/utils/supabase/client';

export default function GalleryManager({ initialImages }: { initialImages: any[] }) {
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
    setUrlInput('');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

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

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const finalUrl = activeMethod === 'upload' ? preview : urlInput;
    if (finalUrl) fd.set('image_url', finalUrl);
    
    const res = await addGalleryImage(fd);
    if (res?.success) {
      setShowAdd(false);
      setPreview(null);
      setUrlInput('');
      setActiveMethod(null);
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-cream">Gallery Management</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-gold flex items-center gap-2">
          <FaPlus size={12} /> Add New Image
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreate} className="bg-dark-card p-6 border border-dark-border rounded-sm space-y-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-bold text-cream/40 uppercase tracking-widest">Image Source</label>
              
              <div className="grid grid-cols-1 gap-4">
                <div 
                  onClick={() => activeMethod !== 'url' && fileInputRef.current?.click()}
                  className={`aspect-video bg-charcoal border-2 border-dashed rounded-sm flex flex-col items-center justify-center transition-all overflow-hidden relative group ${
                    activeMethod === 'url' ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer border-dark-border hover:border-gold-500/40'
                  }`}
                >
                  {activeMethod === 'upload' && preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <FaCloudUploadAlt size={40} className="text-cream/20 mb-2" />
                      <span className="text-xs text-cream/30">{isUploading ? 'Uploading...' : 'Upload File'}</span>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={activeMethod === 'url'} />
                </div>

                <div className="flex items-center gap-4 py-2">
                  <div className="h-px flex-1 bg-dark-border" />
                  <span className="text-[10px] font-bold text-cream/20 uppercase tracking-widest">OR</span>
                  <div className="h-px flex-1 bg-dark-border" />
                </div>

                <div className={`relative ${activeMethod === 'upload' ? 'opacity-20 pointer-events-none' : ''}`}>
                  <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20" size={14} />
                  <input 
                    type="text" 
                    placeholder="Paste external Image URL..." 
                    className="admin-input pl-11" 
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      if (e.target.value) { setActiveMethod('url'); setPreview(e.target.value); }
                      else { setActiveMethod(null); setPreview(null); }
                    }}
                    disabled={activeMethod === 'upload'}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-cream/40 uppercase tracking-widest">Caption (Optional)</label>
                <textarea name="caption" placeholder="Describe this moment..." className="admin-input h-32" />
              </div>
              <p className="text-[10px] text-cream/30 italic">Tip: High-resolution horizontal images look best in the gallery.</p>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-dark-border">
            <button type="submit" className="btn-gold px-12" disabled={isUploading || !preview}>
              <FaSave size={14} /> Add to Gallery
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="text-cream/40 hover:text-cream text-sm transition-colors">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {initialImages.map(img => (
          <div key={img.id} className="relative aspect-square bg-dark-card border border-dark-border rounded-sm overflow-hidden group">
            <img src={img.image_url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <button 
              onClick={() => { if(confirm('Delete this image?')) deleteGalleryImage(img.id).then(() => router.refresh()) }}
              className="absolute top-2 right-2 p-2 bg-ember/90 text-white rounded-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-ember transform translate-y-2 group-hover:translate-y-0"
            >
              <FaTrash size={12} />
            </button>
            {img.caption && (
              <p className="absolute bottom-2 left-2 right-12 text-[10px] text-cream truncate opacity-0 group-hover:opacity-100 transition-opacity">{img.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
