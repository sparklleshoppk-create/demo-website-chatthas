// Tracking utility for firing events across all platforms
// Meta Pixel, Google Analytics 4, TikTok Pixel

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    gtag: (...args: any[]) => void;
    ttq: any;
    _fbq: any;
  }
}

// ==================== META PIXEL EVENTS ====================
export function trackMetaEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.fbq) {
    if (params) {
      window.fbq('track', eventName, params);
    } else {
      window.fbq('track', eventName);
    }
  }
}

// ==================== GOOGLE ANALYTICS EVENTS ====================
export function trackGAEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

// ==================== TIKTOK PIXEL EVENTS ====================
export function trackTikTokEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.ttq) {
    if (params) {
      window.ttq.track(eventName, params);
    } else {
      window.ttq.track(eventName);
    }
  }
}

// ==================== UNIFIED TRACKING ====================
// Fire events on ALL platforms simultaneously

export function trackPageView(pageName?: string) {
  trackMetaEvent('PageView');
  trackGAEvent('page_view', { page_title: pageName });
  trackTikTokEvent('Pageview');
}

export function trackViewContent(item: {
  name: string;
  id: string;
  price: number;
  category?: string;
}) {
  trackMetaEvent('ViewContent', {
    content_name: item.name,
    content_ids: [item.id],
    content_type: 'product',
    value: item.price,
    currency: 'PKR',
  });
  trackGAEvent('view_item', {
    currency: 'PKR',
    value: item.price,
    items: [{ item_id: item.id, item_name: item.name, item_category: item.category, price: item.price }],
  });
  trackTikTokEvent('ViewContent', {
    content_id: item.id,
    content_name: item.name,
    value: item.price,
    currency: 'PKR',
  });
}

export function trackAddToCart(item: {
  name: string;
  id: string;
  price: number;
  quantity: number;
  category?: string;
}) {
  trackMetaEvent('AddToCart', {
    content_name: item.name,
    content_ids: [item.id],
    content_type: 'product',
    value: item.price * item.quantity,
    currency: 'PKR',
    num_items: item.quantity,
  });
  trackGAEvent('add_to_cart', {
    currency: 'PKR',
    value: item.price * item.quantity,
    items: [{ item_id: item.id, item_name: item.name, item_category: item.category, price: item.price, quantity: item.quantity }],
  });
  trackTikTokEvent('AddToCart', {
    content_id: item.id,
    content_name: item.name,
    value: item.price * item.quantity,
    currency: 'PKR',
    quantity: item.quantity,
  });
}

export function trackInitiateCheckout(cart: {
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  total: number;
}) {
  const contentIds = cart.items.map((i) => i.id);
  trackMetaEvent('InitiateCheckout', {
    content_ids: contentIds,
    content_type: 'product',
    value: cart.total,
    currency: 'PKR',
    num_items: cart.items.length,
  });
  trackGAEvent('begin_checkout', {
    currency: 'PKR',
    value: cart.total,
    items: cart.items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })),
  });
  trackTikTokEvent('InitiateCheckout', {
    value: cart.total,
    currency: 'PKR',
    quantity: cart.items.length,
  });
}

export function trackPurchase(order: {
  orderId: string;
  total: number;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
}) {
  const contentIds = order.items.map((i) => i.id);
  trackMetaEvent('Purchase', {
    content_ids: contentIds,
    content_type: 'product',
    value: order.total,
    currency: 'PKR',
    num_items: order.items.length,
    order_id: order.orderId,
  });
  trackGAEvent('purchase', {
    transaction_id: order.orderId,
    currency: 'PKR',
    value: order.total,
    items: order.items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })),
  });
  trackTikTokEvent('CompletePayment', {
    value: order.total,
    currency: 'PKR',
    quantity: order.items.length,
  });
}

export function trackSearch(query: string) {
  trackMetaEvent('Search', { search_string: query });
  trackGAEvent('search', { search_term: query });
  trackTikTokEvent('Search', { query });
}

export function trackContact(method: string) {
  trackMetaEvent('Contact', { contact_method: method });
  trackGAEvent('contact', { method });
  trackTikTokEvent('Contact', { contact_method: method });
}

export function trackSelectBranch(branchName: string, branchId: string) {
  trackMetaEvent('FindLocation', { content_name: branchName });
  trackGAEvent('select_content', { content_type: 'branch', content_id: branchId });
  trackTikTokEvent('ClickButton', { content_name: `Branch: ${branchName}` });
}

export function trackWhatsAppClick() {
  trackMetaEvent('Contact', { contact_method: 'whatsapp' });
  trackGAEvent('contact', { method: 'whatsapp' });
  trackTikTokEvent('Contact', { contact_method: 'whatsapp' });
}

export function trackMenuCategoryView(categoryName: string) {
  trackMetaEvent('ViewContent', { content_category: categoryName, content_type: 'category' });
  trackGAEvent('view_item_list', { item_list_name: categoryName });
  trackTikTokEvent('ViewContent', { content_name: categoryName });
}

export function trackCouponApply(code: string, success: boolean) {
  if (success) {
    trackMetaEvent('CustomEvent', { event_name: 'CouponApplied', coupon_code: code });
    trackGAEvent('select_promotion', { promotion_name: code });
  }
}

export function trackScrollDepth(percentage: number) {
  trackGAEvent('scroll', { percent_scrolled: percentage });
}
