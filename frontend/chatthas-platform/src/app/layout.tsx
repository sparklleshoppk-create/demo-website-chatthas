import type { Metadata } from "next";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";
import TrackingScripts from "@/components/TrackingScripts";
import ClientLayout from "@/components/layout/ClientLayout";
import { CartProvider } from "@/context/CartContext";
import CartIndicator from "@/components/CartIndicator";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import AbandonedCartBanner from "@/components/AbandonedCartBanner";

export const metadata: Metadata = {
  title: "Chattha's - Making Desi Food Great Again",
  description: "Authentic Pakistani Nashta, Karahi, Handi, BBQ, Biryani, Nihari.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  
  // Fetch tracking settings
  const { data: settings } = await supabase
    .from('website_settings')
    .select('key, value')
    .in('key', ['meta_pixel_id', 'google_analytics_id', 'tiktok_pixel_id']);

  const trackingSettings = settings?.reduce((acc: any, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {}) || {};

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#C5A059" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="bg-charcoal text-cream font-body antialiased min-h-screen flex flex-col">
        <CartProvider>
          <ServiceWorkerRegistration />
          <TrackingScripts settings={trackingSettings} />
          <ClientLayout>
            {children}
          </ClientLayout>
          <CartIndicator />
          <AbandonedCartBanner />
        </CartProvider>
      </body>
    </html>
  );
}
