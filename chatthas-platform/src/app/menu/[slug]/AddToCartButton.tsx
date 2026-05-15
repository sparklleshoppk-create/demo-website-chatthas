'use client';

import { useCart } from '@/context/CartContext';
import { FaUtensils } from 'react-icons/fa';
import { useState } from 'react';

export default function AddToCartButton({ item }: { item: any }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  
  // Variants state
  const hasVariants = item.variants && item.variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState<any>(hasVariants ? item.variants[0].options[0] : null);
  
  // Addons state
  const hasAddons = item.addons && item.addons.length > 0;
  const [selectedAddons, setSelectedAddons] = useState<any[]>([]);

  const handleAdd = () => {
    addToCart(item, selectedVariant, selectedAddons);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleAddon = (addon: any) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.name === addon.name);
      if (exists) return prev.filter(a => a.name !== addon.name);
      return [...prev, addon];
    });
  };

  let displayPrice = Number(item.price);
  if (selectedVariant) displayPrice += Number(selectedVariant.price_adjustment || 0);
  selectedAddons.forEach(a => displayPrice += Number(a.price || 0));

  return (
    <div className="space-y-6">
      {hasVariants && (
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-cream/40 uppercase tracking-widest">{item.variants[0].name}</p>
          <div className="flex flex-wrap gap-3">
            {item.variants[0].options.map((opt: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedVariant(opt)}
                className={`px-4 py-2 border rounded-sm text-sm font-medium transition-all ${selectedVariant?.name === opt.name ? 'border-gold-500 bg-gold-500/10 text-gold-500' : 'border-dark-border text-cream/60 hover:text-cream'}`}
              >
                {opt.name} {opt.price_adjustment > 0 ? `(+Rs. ${opt.price_adjustment})` : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasAddons && (
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-cream/40 uppercase tracking-widest">Add-ons</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {item.addons.map((addon: any, idx: number) => {
              const isSelected = selectedAddons.some(a => a.name === addon.name);
              return (
                <button
                  key={idx}
                  onClick={() => toggleAddon(addon)}
                  className={`flex items-center justify-between p-3 border rounded-sm text-sm transition-all ${isSelected ? 'border-gold-500 bg-gold-500/10 text-gold-500' : 'border-dark-border text-cream/60 hover:text-cream'}`}
                >
                  <span>{addon.name}</span>
                  <span>+Rs. {addon.price}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="pt-4 flex items-center justify-between">
        <div className="text-xl font-display font-bold text-gold-500">
          Rs. {displayPrice}
        </div>
        <button 
          onClick={handleAdd}
          className={`btn-gold px-8 py-4 flex items-center justify-center gap-3 group transition-all duration-300 ${added ? 'bg-green-600' : ''}`}
          style={added ? { background: '#2D6A4F', color: 'white' } : {}}
        >
          <FaUtensils size={16} className={added ? '' : 'group-hover:rotate-12 transition-transform'} />
          <span className="font-bold tracking-widest uppercase text-sm">
            {added ? 'Added!' : 'Add to Plate'}
          </span>
        </button>
      </div>
    </div>
  );
}
