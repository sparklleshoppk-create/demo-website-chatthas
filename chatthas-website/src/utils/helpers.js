/**
 * Helper functions
 */

export function formatPrice(priceStr) {
  // Common formatting utils can be added here
  return priceStr;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
