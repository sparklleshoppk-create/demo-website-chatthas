import { PageHero, SectionHeader, FadeUp, StaggerContainer, staggerItem } from '@/components/UI';
import { motion } from 'framer-motion';

export default function StoryPage() {
  const timeline = [
    { year: 2016, title: 'The Beginning', desc: "Waqar Chattha opens the first branch in Tariq Market, F-10/2 — a 40-seat restaurant with one mission: real Pakistani food, zero compromise." },
    { year: 2017, title: 'DAWN Recognition', desc: 'DAWN Magazine calls Chattha\'s the restaurant that "rules the roost" in Islamabad\'s desi food scene. The city is listening.' },
    { year: 2019, title: 'Blue Area Expansion', desc: 'Branch 2 opens at Beverly Centre, F-6 — bringing authentic desi breakfast to Islamabad\'s corporate heartland.' },
    { year: 2022, title: 'Rooftop & Garden', desc: 'The flagship F-10 branch gets a full makeover — rooftop seating added and a garden area for evening dining.' },
    { year: 2024, title: 'Bahria Town Entry', desc: 'Branch 3 opens at Riviera Food Court, Bahria Town Phase 4 — Chattha\'s enters the fastest-growing suburb of Islamabad.' },
    { year: 2025, title: 'Rawalpindi Launch', desc: 'Branch 4 opens in Bahria Phase 7, Rawalpindi — the first branch outside Islamabad.' },
  ];

  return (
    <main className="bg-charcoal">
      <PageHero 
        title="Our Story" 
        subtitle="Every great restaurant begins with a belief. Ours was simple: Pakistan deserves better desi food." 
        breadcrumb="Home / Our Story" 
        image="/story_banner.png"
      />

      {/* Origin */}
      <section className="py-24">
        <div className="container-custom max-w-4xl mx-auto">
          <FadeUp>
            <p className="section-label mb-4 text-center">Where It Began</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream text-center mb-6">
              The <span className="gold-text">Origin</span> Story
            </h2>
            <div className="gold-divider mb-10" />
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="space-y-6 text-cream/60 font-body text-lg leading-relaxed">
              <p>Long before the rooftop at F-10 was built, before the Bahria Town expansion, before 15,000 Foodpanda reviews — there was one man and one belief.</p>
              <p><strong className="text-cream">Waqar Chattha</strong> had spent years in the UK, returned to Pakistan, and found himself teaching at a local Islamabad university. But food — specifically, authentic Pakistani desi food — was always on his mind.</p>
              <p>In 2016, he opened the first <strong className="text-cream">Chattha's</strong> in Tariq Market, F-10/2 — 40 seats, one kitchen, and one unbreakable rule: <em>no shortcuts, ever.</em></p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Founder */}
      <section className="py-24 bg-gradient-to-br from-[#1a1206] to-[#2a1e08]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp delay={0.1}>
              <div className="space-y-6 text-cream/60 font-body text-base leading-relaxed">
                <p className="section-label">The Founder</p>
                <h2 className="font-display text-4xl font-bold text-cream">
                  Waqar Chattha — <span className="gold-text">The Visionary</span>
                </h2>
                <div className="gold-divider ml-0" />
                <p>A professor by profession, a restaurateur by passion, Waqar Chattha is the kind of founder who knows every dish on his menu not just by name — but by the farm it came from.</p>
                <blockquote className="border-l-2 border-gold-500 pl-5 italic text-cream/80 font-display text-xl mt-8">
                  "I wanted to prove that authentic Pakistani food and a world-class dining experience are not mutually exclusive."
                  <cite className="text-gold-500 text-sm block mt-2 not-italic font-body">— Waqar Chattha</cite>
                </blockquote>
              </div>
            </FadeUp>
            <FadeUp>
              <div className="relative aspect-[4/5] bg-dark-card border border-gold-500/20 flex items-center justify-center overflow-hidden rounded-sm">
                <div className="text-center p-12">
                  <div className="w-32 h-32 rounded-full border-2 border-gold-500/40 bg-gold-500/10 flex items-center justify-center mx-auto mb-6">
                    <span className="font-display text-5xl font-bold gold-text">WC</span>
                  </div>
                  <p className="font-display text-2xl font-bold text-cream">Waqar Chattha</p>
                  <p className="text-gold-500 text-sm font-body mt-1">Founder & Visionary</p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Growth Timeline */}
      <section className="py-24 bg-charcoal">
        <div className="container-custom">
          <SectionHeader 
            label="The Growth" 
            title={<>From 40 Seats to <span className="gold-text">4 Branches</span></>}
            subtitle="Every expansion was earned. Every branch is a testament to what happens when a city falls in love with real food." 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {timeline.map((t, i) => (
              <FadeUp key={t.year} delay={i*0.1}>
                <div className="p-8 bg-dark-card border border-dark-border hover:border-gold-500/30 transition-colors rounded-sm">
                  <div className="font-display text-5xl font-black gold-text mb-4 opacity-60">{t.year}</div>
                  <h3 className="font-display text-xl font-bold text-cream mb-3">{t.title}</h3>
                  <p className="text-cream/50 text-sm font-body leading-relaxed">{t.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
