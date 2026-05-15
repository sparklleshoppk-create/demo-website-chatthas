'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  variant_label?: string;
  addons?: any[];
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: any, selectedVariant?: any, selectedAddons?: any[]) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chatthas_cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('chatthas_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (dish: any, selectedVariant?: any, selectedAddons?: any[]) => {
    setItems(prev => {
      let finalPrice = parseFloat(dish.price);
      let variantLabel = null;
      let addonList: any[] = [];

      if (selectedVariant) {
        finalPrice += parseFloat(selectedVariant.price_adjustment || 0);
        variantLabel = selectedVariant.name;
      }
      
      if (selectedAddons && selectedAddons.length > 0) {
        selectedAddons.forEach(a => {
          finalPrice += parseFloat(a.price || 0);
          addonList.push({ name: a.name, price: a.price });
        });
      }

      // Check if an EXACT MATCH exists
      const existing = prev.find(i => {
        if (i.menu_item_id !== dish.id) return false;
        if (i.variant_label !== variantLabel) return false;
        
        const existingAddonsStr = JSON.stringify(i.addons || []);
        const newAddonsStr = JSON.stringify(addonList);
        return existingAddonsStr === newAddonsStr;
      });

      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i);
      }

      return [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        menu_item_id: dish.id,
        name: dish.name,
        price: finalPrice,
        quantity: 1,
        image_url: dish.image_url,
        variant_label: variantLabel,
        addons: addonList.length > 0 ? addonList : undefined
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value = React.useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  }), [items, totalItems, totalPrice]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
