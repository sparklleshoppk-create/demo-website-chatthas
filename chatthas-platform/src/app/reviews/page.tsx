import { PageHero, SectionHeader, FadeUp, StaggerContainer, staggerItem, PlatformBadge } from '@/components/UI';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

export default function ReviewsPage() {
  const reviews = [
    { id: 1, name: 'Shehriyar A.', platform: 'Foodpanda', rating: 5, text: 'Best biryani in Islamabad. Period. Such perfect spice level, great pieces of chicken and a hefty portion that fills you up for sure. Love their food 10/10!' },
    { id: 2, name: 'Hana M.', platform: 'Foodpanda', rating: 5, text: 'Best breakfast in Islamabad! Hands down the best choly! Their serving size is enough for 4 people easily! Will definitely be back.' },
    { id: 3, name: 'Tariq R.', platform: 'Tripadvisor', rating: 5, text: "Chattha's never ceases to impress. Their daal and desi ghee paratha, plus the palak paneer are my go-to items." },
    { id: 4, name: 'Sara K.', platform: 'Google', rating: 5, text: 'Amazing service and just delicious food. This is the best desi food you can find in Islamabad.' },
  ];

  return (
    <main className="bg-charcoal">
      <PageHero 
        title="Reviews" 
        subtitle="15,000+ happy customers on Foodpanda alone. Here is what they say." 
        breadcrumb="Home / Reviews" 
      />

      <section className="py-24">
        <div className="container-custom">
          <SectionHeader 
            label="Testimonials" 
            title={<>The <span className="gold-text">People's</span> Choice</>}
            subtitle="We don't just serve food; we build relationships. Every review is a story of a meal well served." 
          />
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {reviews.map((r) => (
              <div key={r.id} className="bg-dark-card border border-dark-border p-8 rounded-sm relative shadow-card group hover:border-gold-500/30 transition-all">
                <FaQuoteLeft className="absolute top-6 right-6 text-gold-500/10 group-hover:text-gold-500/20 transition-colors" size={40} />
                <div className="flex gap-1 mb-4">
                  {[...Array(r.rating)].map((_, i) => <FaStar key={i} className="text-gold-500" size={12} />)}
                </div>
                <p className="text-cream/70 font-body text-lg italic leading-relaxed mb-6">"{r.text}"</p>
                <div className="flex items-center justify-between">
                  <p className="font-display font-bold text-cream">{r.name}</p>
                  <PlatformBadge platform={r.platform} />
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </main>
  );
}
