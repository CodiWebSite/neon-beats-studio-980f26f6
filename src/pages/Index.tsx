import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import GallerySection from "@/components/GallerySection";
import PromotionsSection from "@/components/PromotionsSection";
import AvailabilitySection from "@/components/AvailabilitySection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="DJ Funky Events | DJ Profesionist pentru Evenimente Premium"
        description="DJ profesionist în Iași pentru nunți, majorate, petreceri private, evenimente corporate și club shows. Rezervă-ți evenimentul de neuitat."
        path="/"
      />
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <AvailabilitySection />
      <PromotionsSection />
      <GallerySection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
