import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge tailwind classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price as Rs. X
 */
export function formatPrice(price: number | string) {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return `Rs. ${num.toLocaleString()}`;
}

/**
 * Calculate the starting price for a dish with variants
 */
export function getDisplayPrice(dish: any) {
  if (!dish.variants || dish.variants.length === 0) return `Rs. ${dish.price}`;
  
  let minPrice = Number(dish.price);
  
  // Find the minimum price adjustment from all variant groups
  for (const vGroup of dish.variants) {
    if (vGroup.options && vGroup.options.length > 0) {
      const minAdj = Math.min(...vGroup.options.map((o: any) => Number(o.price_adjustment) || 0));
      minPrice += minAdj;
    }
  }
  
  return `From Rs. ${minPrice.toLocaleString()}`;
}

/**
 * Deep clone an object safely
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
