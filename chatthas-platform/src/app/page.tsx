import { createClient } from '@/utils/supabase/server';
import Hero from '@/components/Hero';
import { SectionHeader, StaggerContainer } from '@/components/UI';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import { getDisplayPrice } from '@/lib/utils';

export const revalidate = 0; 

export default async function Home() {
  const supabase = createClient();
  
  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*, categories(name)')
    .eq('is_featured', true)
    .limit(6);

  return (
    <div className="bg-charcoal">
      <Hero />

      {/* Signature Dishes Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container-custom">
          <SectionHeader 
            label="Signature Dishes" 
            title={<>Our Most <span className="gold-text">Loved</span> Creations</>}
            subtitle="From the karahi that made Islamabad talk, to the halwa puri that brings families together every Sunday." 
          />
          
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {menuItems?.map((dish: any) => (
              <div key={dish.id} className="group bg-dark-card border border-dark-border hover:border-gold-500/40 transition-all duration-400 overflow-hidden card-lift cursor-pointer rounded-sm shadow-card">
                <div className="relative h-60 overflow-hidden bg-charcoal">
                  <Image 
                    src={dish.image_url || '/halwa_puri.png'} 
                    alt={dish.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 flex gap-2 z-10">
                    {dish.badge && <span className="bg-gold-500 text-charcoal text-[10px] font-bold px-2 py-1 uppercase tracking-tighter rounded-xs">{dish.badge}</span>}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-display text-xl font-bold text-cream group-hover:text-gold-400 transition-colors">{dish.name}</h3>
                    <span className="font-body font-bold text-gold-500 whitespace-nowrap">{getDisplayPrice(dish)}</span>
                  </div>
                  <p className="text-cream/50 text-sm font-body leading-relaxed line-clamp-2 mb-6">{dish.description}</p>
                  <Link href="/menu" className="flex items-center gap-1.5 text-xs font-semibold text-gold-500 hover:text-gold-300 transition-colors uppercase tracking-widest">
                    Order Now <FaArrowRight size={10} />
                  </Link>
                </div>
              </div>
            ))}
          </StaggerContainer>

          <div className="text-center mt-16">
            <Link href="/menu" className="btn-outline-gold px-12 py-4 text-sm tracking-widest uppercase">View Full Menu</Link>
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-20 border-t border-dark-border bg-[#141414]">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: '🌿', title: 'Farm-to-Table', desc: 'Own-farm desi ghee, milk & rice' },
              { icon: '🍳', title: 'Traditional', desc: 'Authentic ancestral recipes' },
              { icon: '📍', title: '4 Locations', desc: 'Across Islamabad & Pindi' },
              { icon: '⭐', title: '15,000+', desc: 'Five-star customer reviews' }
            ].map((usp) => (
              <div key={usp.title} className="text-center group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{usp.icon}</div>
                <h4 className="text-cream font-bold text-sm uppercase tracking-wider mb-2">{usp.title}</h4>
                <p className="text-cream/40 text-xs">{usp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
