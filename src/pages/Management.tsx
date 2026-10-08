import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ManagementSection from "@/components/ManagementSection";
import { SEO } from "@/components/SEO";

const Management = () => (
  <main className="min-h-screen bg-background overflow-x-hidden">
    <SEO
      title="DJ Funky Management | Booking & Artist Management România"
      description="Contactează managementul oficial DJ Funky pentru booking, evenimente, colaborări, parteneriate, licențiere și oportunități profesionale."
      path="/management"
    />
    <Helmet>
      <meta
        name="keywords"
        content="DJ Funky booking, DJ Funky management, DJ Funky România, DJ booking România, Afro House DJ România, DJ evenimente România, artist management România, DJ Funky Events"
      />
    </Helmet>
    <Navbar />
    <ManagementSection />
    <Footer />
  </main>
);

export default Management;
