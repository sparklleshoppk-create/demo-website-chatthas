import { PageHero, SectionHeader, FadeUp, StaggerContainer, PlatformBadge } from '@/components/UI';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { createClient } from '@/utils/supabase/server';
import ReviewForm from './ReviewForm';

export default async function ReviewsPage() {
  const supabase = createClient();
  const { data: dbReviews } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at, users(full_name)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  const dynamicReviews = dbReviews?.map((r: any) => ({
    id: r.id,
    name: r.users?.full_name || 'Customer',
    platform: 'Website',
    rating: r.rating,
    text: r.comment,
  })) || [];

  const hardcodedReviews = [
    { id: 'hc1', name: 'Shehriyar A.', platform: 'Foodpanda', rating: 5, text: 'Best biryani in Islamabad. Period. Such perfect spice level, great pieces of chicken and a hefty portion that fills you up for sure. Love their food 10/10!' },
    { id: 'hc2', name: 'Hana M.', platform: 'Foodpanda', rating: 5, text: 'Best breakfast in Islamabad! Hands down the best choly! Their serving size is enough for 4 people easily! Will definitely be back.' },
    { id: 'hc3', name: 'Tariq R.', platform: 'Tripadvisor', rating: 5, text: "Chattha's never ceases to impress. Their daal and desi ghee paratha, plus the palak paneer are my go-to items." },
    { id: 'hc4', name: 'Sara K.', platform: 'Google', rating: 5, text: 'Amazing service and just delicious food. This is the best desi food you can find in Islamabad.' },
  ];

  const allReviews = [...dynamicReviews, ...hardcodedReviews];

  return (
    <main className="bg-charcoal">
      <PageHero 
        title="Reviews" 
        subtitle="15,000+ happy customers on Foodpanda alone. Here is what they say." 
        breadcrumb="Home / Reviews" 
      />

      <section className="py-24">
        <div className="container-custom">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <SectionHeader 
                label="Testimonials" 
                title={<>The <span className="gold-text">People's</span> Choice</>}
                subtitle="We don't just serve food; we build relationships. Every review is a story of a meal well served." 
                center={false}
              />
              
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                {allReviews.map((r) => (
                  <div key={r.id} className="bg-dark-card border border-dark-border p-8 rounded-sm relative shadow-card group hover:border-gold-500/30 transition-all">
                    <FaQuoteLeft className="absolute top-6 right-6 text-gold-500/10 group-hover:text-gold-500/20 transition-colors" size={40} />
                    <div className="flex gap-1 mb-4">
                      {[...Array(r.rating)].map((_, i) => <FaStar key={i} className="text-gold-500" size={12} />)}
                    </div>
                    <p className="text-cream/70 font-body text-lg italic leading-relaxed mb-6">"{r.text}"</p>
                    <div className="flex items-center justify-between">
                      <p className="font-display font-bold text-cream">{r.name}</p>
                      {r.platform !== 'Website' && (
                        <PlatformBadge platform={r.platform} />
                      )}
                    </div>
                  </div>
                ))}
              </StaggerContainer>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <ReviewForm />
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
