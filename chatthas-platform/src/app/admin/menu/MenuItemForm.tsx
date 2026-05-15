'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createMenuItem, updateMenuItem } from './actions';
import { createClient } from '@/utils/supabase/client';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

interface Category {
  id: string;
  name: string;
}

interface MenuItem {
  id?: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  badge: string | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  image_url: string | null;
  variants?: any[];
  addons?: any[];
}

export default function MenuItemForm({ 
  categories, 
  item 
}: { 
  categories: Category[]; 
  item?: MenuItem;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(item?.image_url || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!item?.id;

  const [variants, setVariants] = useState<any[]>(item?.variants || []);
  const [addons, setAddons] = useState<any[]>(item?.addons || []);

  const supabase = createClient();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setImageFile(file);
    setError(null);

    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `items/${fileName}`;

    setUploadProgress('Uploading image...');

    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Image upload failed: ${error.message}`);
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath);

    setUploadProgress(null);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form) return;

    setIsLoading(true);
    setError(null);

    try {
      // Upload image if a new one was selected
      let imageUrl = item?.image_url || null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      } else if (!imagePreview && item?.image_url) {
        // Image was removed
        imageUrl = null;
      }

      const formData = new FormData(form);
      // Append the image URL to the form data
      if (imageUrl) {
        formData.set('image_url', imageUrl);
      } else {
        formData.set('image_url', '');
      }
      
      formData.set('variants', JSON.stringify(variants));
      formData.set('addons', JSON.stringify(addons));

      let result;
      if (isEditing && item?.id) {
        result = await updateMenuItem(item.id, formData);
      } else {
        result = await createMenuItem(formData);
      }

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        router.push('/admin/menu');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-ember-500/10 border border-ember-500/20 text-ember-400 p-4 rounded-sm text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-cream/80 mb-2">Dish Photo</label>
          <div className="flex items-start gap-6">
            {/* Preview */}
            <div className="relative w-40 h-40 rounded-sm border border-dark-border bg-charcoal overflow-hidden flex-shrink-0">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 p-1 bg-charcoal/80 text-ember-400 rounded-full hover:bg-ember-500/20 transition-colors"
                  >
                    <FaTimes className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-cream/30">
                  <FaCloudUploadAlt className="h-8 w-8 mb-2" />
                  <span className="text-xs">No image</span>
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-dark-border bg-charcoal text-cream/70 rounded-sm cursor-pointer hover:border-gold-500/30 hover:text-cream transition-colors text-sm"
              >
                <FaCloudUploadAlt className="h-4 w-4" />
                {imagePreview ? 'Change Image' : 'Upload Image'}
              </label>
              <p className="text-xs text-cream/40 mt-2">JPG, PNG, or WebP. Max 5MB.</p>
              {uploadProgress && (
                <p className="text-xs text-gold-400 mt-1 animate-pulse">{uploadProgress}</p>
              )}
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-cream/80 mb-1">Dish Name *</label>
          <input
            type="text"
            name="name"
            defaultValue={item?.name || ''}
            required
            className="w-full px-3 py-2.5 border border-dark-border bg-charcoal text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
            placeholder="e.g. Desi Ghee Mutton Karahi"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-cream/80 mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={item?.description || ''}
            className="w-full px-3 py-2.5 border border-dark-border bg-charcoal text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
            placeholder="A short description for the menu page..."
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-cream/80 mb-1">Price (Rs.) *</label>
          <input
            type="number"
            name="price"
            step="0.01"
            min="0"
            defaultValue={item?.price || ''}
            required
            className="w-full px-3 py-2.5 border border-dark-border bg-charcoal text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
            placeholder="450.00"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-cream/80 mb-1">Category *</label>
          <select
            name="category_id"
            defaultValue={item?.category_id || ''}
            required
            className="w-full px-3 py-2.5 border border-dark-border bg-charcoal text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Badge */}
        <div>
          <label className="block text-sm font-medium text-cream/80 mb-1">Badge</label>
          <select
            name="badge"
            defaultValue={item?.badge || ''}
            className="w-full px-3 py-2.5 border border-dark-border bg-charcoal text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
          >
            <option value="">None</option>
            <option value="bestseller">Bestseller</option>
            <option value="new">New</option>
            <option value="spicy">Spicy</option>
            <option value="popular">Popular</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium text-cream/80 mb-1">Sort Order</label>
          <input
            type="number"
            name="sort_order"
            defaultValue={item?.sort_order || 0}
            className="w-full px-3 py-2.5 border border-dark-border bg-charcoal text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
          />
        </div>

        {/* Variants Section */}
        <div className="md:col-span-2 border-t border-dark-border pt-6 mt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-bold text-cream">Variants (e.g. Sizes)</h3>
            <button type="button" onClick={() => setVariants([...variants, { name: '', options: [{ name: '', price_adjustment: 0 }] }])} className="text-sm font-bold text-gold-500 hover:text-gold-400">
              + Add Variant Group
            </button>
          </div>
          {variants.map((variant, vIdx) => (
            <div key={vIdx} className="bg-dark-card border border-dark-border p-4 rounded-sm mb-4">
              <div className="flex gap-4 mb-4">
                <input 
                  type="text" 
                  placeholder="Variant Group Name (e.g. Size)" 
                  value={variant.name} 
                  onChange={(e) => {
                    const newV = [...variants];
                    newV[vIdx].name = e.target.value;
                    setVariants(newV);
                  }}
                  className="flex-1 px-3 py-2 border border-dark-border bg-charcoal text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 text-sm"
                />
                <button type="button" onClick={() => setVariants(variants.filter((_, i) => i !== vIdx))} className="text-ember-500 hover:text-ember-400">Remove Group</button>
              </div>
              <div className="space-y-2 pl-4 border-l-2 border-dark-border">
                {variant.options.map((opt: any, oIdx: number) => (
                  <div key={oIdx} className="flex gap-4 items-center">
                    <input 
                      type="text" 
                      placeholder="Option Name (e.g. Full)" 
                      value={opt.name}
                      onChange={(e) => {
                        const newV = [...variants];
                        newV[vIdx].options[oIdx].name = e.target.value;
                        setVariants(newV);
                      }}
                      className="w-1/2 px-3 py-2 border border-dark-border bg-charcoal text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 text-sm"
                    />
                    <input 
                      type="number" 
                      placeholder="Price Adjustment (Rs)" 
                      value={opt.price_adjustment}
                      onChange={(e) => {
                        const newV = [...variants];
                        newV[vIdx].options[oIdx].price_adjustment = Number(e.target.value);
                        setVariants(newV);
                      }}
                      className="w-1/3 px-3 py-2 border border-dark-border bg-charcoal text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 text-sm"
                    />
                    <button type="button" onClick={() => {
                      const newV = [...variants];
                      newV[vIdx].options = newV[vIdx].options.filter((_: any, i: number) => i !== oIdx);
                      setVariants(newV);
                    }} className="text-ember-500 hover:text-ember-400"><FaTimes /></button>
                  </div>
                ))}
                <button type="button" onClick={() => {
                  const newV = [...variants];
                  newV[vIdx].options.push({ name: '', price_adjustment: 0 });
                  setVariants(newV);
                }} className="text-xs font-bold text-gold-500 hover:text-gold-400 mt-2">
                  + Add Option
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Addons Section */}
        <div className="md:col-span-2 border-t border-dark-border pt-6 mt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-bold text-cream">Add-ons (e.g. Extras)</h3>
            <button type="button" onClick={() => setAddons([...addons, { name: '', price: 0 }])} className="text-sm font-bold text-gold-500 hover:text-gold-400">
              + Add Extra
            </button>
          </div>
          <div className="space-y-2">
            {addons.map((addon, aIdx) => (
              <div key={aIdx} className="flex gap-4 items-center bg-dark-card border border-dark-border p-3 rounded-sm">
                <input 
                  type="text" 
                  placeholder="Add-on Name (e.g. Extra Ghee)" 
                  value={addon.name}
                  onChange={(e) => {
                    const newA = [...addons];
                    newA[aIdx].name = e.target.value;
                    setAddons(newA);
                  }}
                  className="flex-1 px-3 py-2 border border-dark-border bg-charcoal text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 text-sm"
                />
                <input 
                  type="number" 
                  placeholder="Price (Rs)" 
                  value={addon.price}
                  onChange={(e) => {
                    const newA = [...addons];
                    newA[aIdx].price = Number(e.target.value);
                    setAddons(newA);
                  }}
                  className="w-32 px-3 py-2 border border-dark-border bg-charcoal text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 text-sm"
                />
                <button type="button" onClick={() => setAddons(addons.filter((_, i) => i !== aIdx))} className="text-ember-500 hover:text-ember-400"><FaTimes /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="md:col-span-2 flex gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_available"
              defaultChecked={item?.is_available ?? true}
              className="w-4 h-4 rounded border-dark-border bg-charcoal text-gold-500 focus:ring-gold-500"
            />
            <span className="text-sm text-cream/80">Available for ordering</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={item?.is_featured ?? false}
              className="w-4 h-4 rounded border-dark-border bg-charcoal text-gold-500 focus:ring-gold-500"
            />
            <span className="text-sm text-cream/80">Featured on homepage</span>
          </label>
        </div>

        <div className="md:col-span-2 flex items-center gap-8 border-t border-dark-border pt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="track_inventory"
              defaultChecked={item?.track_inventory ?? false}
              className="w-4 h-4 rounded border-dark-border bg-charcoal text-gold-500 focus:ring-gold-500"
            />
            <span className="text-sm text-cream/80">Track Inventory</span>
          </label>
          <div className="flex items-center gap-3">
             <label className="text-xs text-cream/40 uppercase font-bold tracking-widest">Initial Stock</label>
             <input 
               type="number" 
               name="stock_quantity"
               defaultValue={item?.stock_quantity || 0}
               className="w-24 px-3 py-1.5 border border-dark-border bg-charcoal text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 text-sm"
             />
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-4 border-t border-dark-border">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 text-sm font-bold bg-gold-500 text-charcoal rounded-sm hover:bg-gold-400 disabled:opacity-50 transition-colors"
        >
          {isLoading ? (uploadProgress || 'Saving...') : isEditing ? 'Update Item' : 'Create Item'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/menu')}
          className="px-6 py-2.5 text-sm font-medium text-cream/70 bg-dark-border rounded-sm hover:text-cream transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
