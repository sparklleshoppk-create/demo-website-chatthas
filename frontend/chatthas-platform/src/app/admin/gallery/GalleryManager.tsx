'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaTrash, FaCloudUploadAlt, FaSave, FaLink, FaImage, FaSpinner } from 'react-icons/fa';
import { addGalleryImage, deleteGalleryImage } from './actions';
import { createClient } from '@/utils/supabase/client';

// Shared premium canvas image compressor utility
const compressImage = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.7): Promise<{ file: File; base64: string }> => {
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

export default function GalleryManager({ initialImages }: { initialImages: any[] }) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [activeMethod, setActiveMethod] = useState<'upload' | 'url' | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setActiveMethod('upload');
    setUrlInput('');
    setNotice(null);

    try {
      // Compress the image before uploading to optimize performance and prevent website lag
      const compressed = await compressImage(file);
      
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      // 1. Try Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('website-assets')
        .upload(filePath, compressed.file);

      if (uploadError) {
        // Fall back automatically to optimized compressed Base64
        console.warn('Supabase storage failed, falling back to database base64:', uploadError.message);
        setPreview(compressed.base64);
        setNotice('Notice: Supabase bucket is offline. Image compressed to high-efficiency Base64 and saved directly to the database.');
      } else {
        const { data } = supabase.storage.from('website-assets').getPublicUrl(filePath);
        setPreview(data.publicUrl);
        setNotice('Success: Image compressed and uploaded to secure cloud storage.');
      }
    } catch (err: any) {
      console.error(err);
      alert(`Upload processing failed: ${err.message}`);
      setActiveMethod(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const finalUrl = activeMethod === 'upload' ? preview : urlInput;
    if (finalUrl) fd.set('image_url', finalUrl);
    
    const res = await addGalleryImage(fd);
    if (res?.success) {
      setShowAdd(false);
      setPreview(null);
      setUrlInput('');
      setActiveMethod(null);
      setNotice(null);
      router.refresh();
    } else {
      alert(res?.error || 'Failed to save image.');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-display font-light italic gold-text">Gallery Management</h2>
          <p className="text-base tracking-widest uppercase text-cream/40 mt-2">Manage customer media, dishes, and restaurant moments ({initialImages.length} images)</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-gold flex items-center gap-2">
          <FaPlus size={12} /> Add New Image
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreate} className="bg-charcoal p-8 border border-dark-border rounded-sm space-y-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="text-sm font-display font-light italic gold-text border-b border-dark-border pb-4">Add Media Asset</h3>
          
          {notice && (
            <div className="text-xs text-gold-500/80 bg-gold-500/10 border border-gold-500/20 p-4 rounded-sm">
              {notice}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-base font-bold text-cream/40 uppercase tracking-widest">Image Source</label>
              
              <div className="grid grid-cols-1 gap-4">
                <div 
                  onClick={() => activeMethod !== 'url' && !isUploading && fileInputRef.current?.click()}
                  className={`aspect-video bg-primary-black border-2 border-dashed rounded-sm flex flex-col items-center justify-center transition-all overflow-hidden relative group ${
                    activeMethod === 'url' ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer border-dark-border hover:border-gold-500/40'
                  }`}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <FaSpinner className="animate-spin text-gold-500" size={32} />
                      <span className="text-sm uppercase tracking-widest text-gold-500">Compressing & Uploading...</span>
                    </div>
                  ) : activeMethod === 'upload' && preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <FaCloudUploadAlt size={40} className="text-cream/20 mb-2 group-hover:text-gold-500/50 transition-colors" />
                      <span className="text-sm uppercase tracking-widest text-cream/30 group-hover:text-cream/50 transition-colors">Click to Upload and Compress Image</span>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={activeMethod === 'url' || isUploading} />
                </div>

                <div className="flex items-center gap-4 py-2">
                  <div className="h-px flex-1 bg-dark-border" />
                  <span className="text-sm font-bold text-cream/20 uppercase tracking-widest">OR</span>
                  <div className="h-px flex-1 bg-dark-border" />
                </div>

                <div className={`relative ${activeMethod === 'upload' ? 'opacity-20 pointer-events-none' : ''}`}>
                  <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20" size={12} />
                  <input 
                    type="text" 
                    placeholder="Paste external Image URL..." 
                    className="admin-input pl-11 bg-primary-black" 
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
                <label className="text-sm font-bold text-cream/40 uppercase tracking-widest">Caption (Optional)</label>
                <textarea name="caption" placeholder="Describe this moment..." className="admin-input h-32 bg-primary-black" />
              </div>
              <p className="text-sm text-cream/30 italic">Tip: All images are automatically compressed upon selection to guarantee peak website load speed and dynamic performance.</p>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-dark-border">
            <button type="submit" className="btn-gold px-12" disabled={isUploading || saving || !preview}>
              <FaSave size={12} className="inline mr-1" /> {saving ? 'Saving...' : 'Add to Gallery'}
            </button>
            <button type="button" onClick={() => { setShowAdd(false); setPreview(null); setUrlInput(''); setActiveMethod(null); setNotice(null); }} className="btn-outline-gold">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {initialImages.map(img => (
          <div key={img.id} className="relative aspect-square bg-dark-card border border-dark-border rounded-sm overflow-hidden group shadow-md card-lift">
            <img src={img.image_url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4" />
            
            <button 
              onClick={() => { if(confirm('Delete this image?')) deleteGalleryImage(img.id).then(() => router.refresh()) }}
              className="absolute top-3 right-3 p-2 bg-ember/90 text-white rounded-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-ember transform translate-y-2 group-hover:translate-y-0 shadow-lg"
            >
              <FaTrash size={12} />
            </button>
            
            {img.caption && (
              <p className="absolute bottom-3 left-3 right-3 text-xs text-cream truncate opacity-0 group-hover:opacity-100 transition-opacity font-body tracking-wider">{img.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
