import { SectionHeader } from '@/components/UI';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-charcoal">
      <div className="container-custom">
        <SectionHeader 
          label="Coming Soon" 
          title={<>{title} <span className="gold-text">Page</span></>}
          subtitle={`We are currently porting the ${title} page to our new high-performance platform. Stay tuned!`} 
        />
        <div className="mt-12 flex justify-center">
          <div className="w-24 h-1 bg-gold-500/20 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-gold-500 animate-slide-infinite" />
          </div>
        </div>
      </div>
    </div>
  );
}
