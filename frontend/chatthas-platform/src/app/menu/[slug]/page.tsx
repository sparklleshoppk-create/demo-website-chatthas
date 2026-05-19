import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { PageHero, SpiceLevel, Tag } from '@/components/UI';
import Link from 'next/link';
import { FaChevronLeft, FaShoppingBag } from 'react-icons/fa';
import AddToCartButton from './AddToCartButton';

import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient();
  const { data: item } = await supabase
    .from('menu_items')
    .select('*, categories(name)')
    .eq('slug', params.slug)
    .single();

  return {
    title: `${item?.name || 'Dish'} | Chattha's Restaurant`,
    description: item?.description || `Authentic ${item?.categories?.name} prepared with organic desi ghee.`,
  };
}

export default async function MenuItemPage({ params }: { params: { slug: string } }) {

  const supabase = createClient();
  
  const { data: item } = await supabase
    .from('menu_items')
    .select('*, categories(name)')
    .eq('slug', params.slug)
    .single();

  if (!item) notFound();

  return (
    <main className="bg-charcoal min-h-screen pb-20">
      <PageHero 
        title={item.name}
        subtitle={item.categories?.name}
        breadcrumb={`Menu / ${item.name}`}
        image={item.image_url || '/menu_banner.png'}
      />

      <div className="container-custom py-20">
        <Link href="/menu" className="inline-flex items-center gap-2 text-gold-500/60 text-xs font-bold uppercase tracking-[0.2em] mb-12 hover:text-gold-500 transition-colors group">
          <FaChevronLeft size={10} className="group-hover:-translate-x-1 transition-transform" /> Back to Menu
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">
          {/* Image Section */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gold-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="bg-dark-card border border-dark-border rounded-sm overflow-hidden aspect-square flex items-center justify-center relative z-10 shadow-2xl">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="text-cream/10 text-9xl">🍽️</div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-10 lg:pt-4">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                {item.badge && <Tag type="bestseller" label={item.badge} />}
                {item.is_featured && <Tag type="signature" label="Signature" />}
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-display font-bold text-cream tracking-tight leading-tight">{item.name}</h1>
                <p className="text-3xl font-display font-bold text-gold-500 italic">Rs. {item.price}</p>
              </div>
              
              <div className="gold-divider ml-0 w-20 h-[1px]" />
            </div>

            <div className="space-y-6">
              <p className="text-cream/80 font-body text-lg leading-relaxed max-w-xl">
                {item.description || "Experience the true essence of traditional flavors. Our recipes are passed down through generations, prepared with farm-sourced organic desi ghee and hand-picked spices."}
              </p>
              
              <div className="flex items-center gap-4 text-xs font-bold text-gold-500/60 uppercase tracking-widest">
                <span className="w-8 h-px bg-gold-500/20" />
                <span>Farm to Table Authenticity</span>
              </div>
            </div>

            {item.spice_level > 0 && (
              <div className="bg-dark-card/50 border border-dark-border p-6 rounded-sm inline-block">
                <p className="text-[10px] font-bold text-cream/30 uppercase tracking-[0.2em] mb-3">Spice Intensity</p>
                <SpiceLevel level={item.spice_level} />
              </div>
            )}

            <div className="pt-4">
              <AddToCartButton item={item} />
              <p className="text-[10px] text-cream/30 mt-4 italic">* Prepared fresh on order using organic desi ghee.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
