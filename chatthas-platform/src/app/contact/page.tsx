import { PageHero, SectionHeader, FadeUp, StaggerContainer, staggerItem } from '@/components/UI';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import ContactForm from './ContactForm';

export default function ContactPage() {
  return (
    <main className="bg-charcoal">
      <PageHero 
        title="Contact Us" 
        subtitle="We're always here to listen. Whether it's a reservation, feedback, or a general inquiry." 
        breadcrumb="Home / Contact" 
        image="/contact_banner.png"
      />

      <section className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <SectionHeader 
                center={false}
                label="Get in Touch" 
                title={<>Reach <span className="gold-text">Out</span></>}
              />
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center flex-shrink-0 border border-gold-500/20">
                    <FaPhoneAlt className="text-gold-500" size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-cream/40 uppercase tracking-widest mb-1">Call Us</p>
                    <p className="text-cream font-medium">+92 51 844 4636</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center flex-shrink-0 border border-gold-500/20">
                    <FaWhatsapp className="text-gold-500" size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-cream/40 uppercase tracking-widest mb-1">WhatsApp</p>
                    <p className="text-cream font-medium">+92 300 1234567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center flex-shrink-0 border border-gold-500/20">
                    <FaEnvelope className="text-gold-500" size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-cream/40 uppercase tracking-widest mb-1">Email</p>
                    <p className="text-cream font-medium">info@chatthas.pk</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
