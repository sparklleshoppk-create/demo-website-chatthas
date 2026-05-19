import { createClient } from '@/utils/supabase/server';
import { PageHero, SectionHeader, FadeUp, StaggerContainer, staggerItem } from '@/components/UI';
import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaStar } from 'react-icons/fa';

export default async function BranchesPage() {
  const supabase = createClient();
  const { data: branches } = await supabase
    .from('branches')
    .select('*')
    .order('is_featured', { ascending: false });

  return (
    <main className="bg-charcoal">
      <PageHero 
        title="Find Us" 
        subtitle="4 locations across the twin cities. One uncompromised taste." 
        breadcrumb="Home / Branches" 
      />

      <section className="py-24">
        <div className="container-custom">
          {/* Featured Branches */}
          {branches?.filter(b => b.is_featured).map((branch) => (
            <FadeUp key={branch.id} className="mb-20">
              <div className="bg-gradient-to-br from-[#2a1e08] to-dark-card border border-gold-500/40 p-8 md:p-12 relative overflow-hidden rounded-sm">
                <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                  <span className="bg-gold-500 text-charcoal text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm">Flagship</span>
                  {branch.ratings?.rating && (
                    <div className="flex items-center gap-1.5 bg-charcoal/50 px-2 py-1 rounded-sm border border-gold-500/20">
                      <FaStar className="text-gold-500" size={10} />
                      <span className="text-gold-500 text-xs font-bold">{branch.ratings.rating}</span>
                      <span className="text-cream/40 text-[10px]">({branch.ratings.reviews})</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <p className="text-gold-500 text-xs font-bold uppercase tracking-[0.2em] mb-3">{branch.city || 'Islamabad'}</p>
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-6">{branch.name}</h2>
                    <p className="text-cream/60 font-body text-lg mb-8 leading-relaxed">
                      {branch.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {branch.services?.dineIn && <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-gold-500/10 text-gold-500 border border-gold-500/20">Dine-In</span>}
                      {branch.services?.delivery && <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20">Delivery</span>}
                      {branch.services?.takeaway && <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20">Takeaway</span>}
                      {branch.services?.outdoorSeating && <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-charcoal text-cream/40 border border-dark-border">Outdoor</span>}
                    </div>

                    <div className="space-y-4 mb-10">
                      <div className="flex items-start gap-4 text-cream/80">
                        <FaMapMarkerAlt className="text-gold-500 mt-1" size={18} />
                        <p className="font-body text-sm leading-relaxed">{branch.address}</p>
                      </div>
                      <div className="flex items-center gap-4 text-cream/80">
                        <FaPhoneAlt className="text-gold-500" size={16} />
                        <p className="font-body text-sm">{branch.phone}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <a href={branch.map_url} target="_blank" rel="noopener noreferrer" className="btn-gold">View on Maps</a>
                      <a href={`https://wa.me/${branch.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-outline-gold flex items-center gap-2">
                        <FaWhatsapp size={16} /> WhatsApp
                      </a>
                      {branch.online_ordering?.foodpanda && (
                        <a href={branch.online_ordering.foodpanda} target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-[#D70F64] text-[#D70F64] hover:bg-[#D70F64] hover:text-white transition-all text-xs font-bold tracking-widest uppercase rounded-sm">
                          Foodpanda
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="h-80 md:h-[450px] w-full rounded-sm overflow-hidden border border-dark-border shadow-2xl">
                    <iframe 
                      src={branch.map_embed_url} 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} 
                      allowFullScreen 
                      loading="lazy" 
                    />
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}

          {/* All Branches Grid */}
          <SectionHeader 
            title={<>Our <span className="gold-text">Twin City</span> Locations</>}
            subtitle="Whether you're in the heart of Islamabad or the suburbs of Bahria Town, the authentic taste of Chattha's is never far away."
            className="mb-16"
          />

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
            {branches?.filter(b => !b.is_featured).map((branch) => (
              <div key={branch.id} className="bg-dark-card border border-dark-border hover:border-gold-500/30 transition-all group rounded-sm shadow-card flex flex-col overflow-hidden">
                {/* Branch Map Header */}
                <div className="h-48 w-full border-b border-dark-border overflow-hidden">
                  <iframe 
                    src={branch.map_embed_url} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} 
                    allowFullScreen 
                    loading="lazy" 
                  />
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-display text-2xl font-bold text-cream group-hover:text-gold-400 transition-colors leading-tight">{branch.name}</h3>
                    {branch.ratings?.rating && (
                      <div className="flex items-center gap-1 text-gold-500 text-xs font-bold bg-gold-500/5 px-2 py-1 rounded-xs">
                        <FaStar size={10} /> {branch.ratings.rating}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {branch.services?.delivery && <span className="text-[8px] font-black uppercase tracking-tighter text-green-400/60 border border-green-500/20 px-1.5 rounded-xs">Delivery</span>}
                    {branch.services?.dineIn && <span className="text-[8px] font-black uppercase tracking-tighter text-gold-500/60 border border-gold-500/20 px-1.5 rounded-xs">Dine-In</span>}
                  </div>

                  <div className="space-y-4 mb-8 flex-grow">
                    <div className="flex items-start gap-3 text-cream/50 text-sm">
                      <FaMapMarkerAlt className="text-gold-500 mt-0.5 flex-shrink-0" size={14} />
                      <p className="leading-relaxed">{branch.address}</p>
                    </div>
                    <div className="flex items-center gap-3 text-cream/50 text-sm">
                      <FaPhoneAlt className="text-gold-500 flex-shrink-0" size={12} />
                      <p>{branch.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-dark-border/50">
                    <div className="flex gap-4">
                      <a href={branch.map_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-gold-500 uppercase tracking-widest hover:text-gold-300">Directions</a>
                      <a href={`https://wa.me/${branch.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-cream/30 uppercase tracking-widest hover:text-cream">Contact</a>
                    </div>
                    {branch.online_ordering?.foodpanda && (
                      <a href={branch.online_ordering.foodpanda} target="_blank" rel="noopener noreferrer" title="Order on Foodpanda">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/ed/Foodpanda_logo.png" alt="Foodpanda" className="h-4 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </main>
  );
}
