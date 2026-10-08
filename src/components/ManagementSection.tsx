import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Globe, MessageCircle, ArrowRight, Check } from "lucide-react";

export const MANAGER = {
  name: "Izabela Stoica",
  role: "Artist Manager — DJ Funky",
  email: "manager@djfunkyevents.ro",
  phone: "+40 769 291 604",
  tel: "+40769291604",
  whatsapp: "https://wa.me/40769291604",
};

const responsibilities = [
  "Management artistic",
  "Booking & Events",
  "Reprezentare profesională",
  "Negocierea colaborărilor",
  "Parteneriate",
  "Licențiere",
  "Copyright & Content ID",
  "Comunicare profesională",
  "Oportunități artistice și comerciale",
];

const flow = ["Artist", "Management", "Booking", "Events", "Collaborations"];

/** Compact homepage block: BOOK DJ FUNKY */
export const BookDjFunky = () => (
  <section id="management" className="relative py-24 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[140px]" />
    <div className="relative z-10 container mx-auto px-4">
      <div className="glass-card max-w-4xl mx-auto p-8 md:p-12 text-center">
        <span className="font-display text-sm tracking-widest text-neon-cyan uppercase">Official Management</span>
        <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
          <span className="text-foreground">BOOK</span> <span className="gradient-text">DJ FUNKY</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Pentru booking-uri, evenimente, colaborări, parteneriate și solicitări profesionale, contactează echipa oficială de management DJ Funky.
        </p>
        <div className="mb-8">
          <div className="font-display text-2xl text-foreground">{MANAGER.name}</div>
          <div className="text-sm tracking-wider text-neon-cyan mt-1">{MANAGER.role}</div>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 mt-4 text-muted-foreground">
            <a href={`mailto:${MANAGER.email}`} className="hover:text-neon-cyan transition-colors">{MANAGER.email}</a>
            <a href={`tel:${MANAGER.tel}`} className="hover:text-neon-cyan transition-colors">{MANAGER.phone}</a>
          </div>
        </div>
        <Button variant="neon-filled" size="lg" asChild>
          <Link to="/management">
            Contact Management <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

/** Full management profile (used on /management) */
const ManagementSection = () => (
  <section className="relative pt-32 pb-24 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
    <div className="absolute top-1/4 left-0 w-80 h-80 bg-neon-cyan/10 rounded-full blur-[120px]" />
    <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-neon-magenta/10 rounded-full blur-[120px]" />

    <div className="relative z-10 container mx-auto px-4">
      <div className="text-center mb-12">
        <span className="font-display text-sm tracking-widest text-neon-cyan uppercase">Management & Booking</span>
        <h1 className="font-display text-4xl md:text-6xl font-bold mt-4 mb-6">
          <span className="text-foreground">DJ FUNKY</span> <span className="gradient-text">Management</span>
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 font-display text-xs md:text-sm tracking-widest text-muted-foreground uppercase">
          {flow.map((f, i) => (
            <span key={f} className="flex items-center gap-2 md:gap-3">
              <span className={i === 0 ? "text-neon-cyan" : ""}>{f}</span>
              {i < flow.length - 1 && <ArrowRight className="w-3 h-3 text-neon-cyan/60" />}
            </span>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
        <div className="glass-card p-8 md:p-10 lg:col-span-3">
          <div className="text-xs tracking-[0.3em] text-neon-cyan uppercase mb-3">Official Management</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">{MANAGER.name}</h2>
          <div className="text-muted-foreground tracking-wider mt-2 mb-6">{MANAGER.role}</div>
          <div className="h-px bg-gradient-to-r from-neon-cyan/40 via-neon-magenta/30 to-transparent mb-6" />
          <p className="text-muted-foreground leading-relaxed mb-8">
            Izabela Stoica se ocupă de managementul și reprezentarea profesională a artistului DJ Funky, inclusiv booking-uri, evenimente, colaborări, parteneriate, oportunități profesionale, licențiere, comunicare privind drepturile de autor și relația profesională cu partenerii din industria muzicală.
          </p>
          <div className="space-y-3 mb-8">
            <a href={`mailto:${MANAGER.email}`} className="flex items-center gap-3 text-foreground hover:text-neon-cyan transition-colors">
              <Mail className="w-5 h-5 text-neon-cyan" /> {MANAGER.email}
            </a>
            <a href={`tel:${MANAGER.tel}`} className="flex items-center gap-3 text-foreground hover:text-neon-cyan transition-colors">
              <Phone className="w-5 h-5 text-neon-cyan" /> {MANAGER.phone} <span className="text-xs text-muted-foreground">(Telefon / WhatsApp)</span>
            </a>
            <a href="https://djfunkyevents.ro" className="flex items-center gap-3 text-foreground hover:text-neon-cyan transition-colors">
              <Globe className="w-5 h-5 text-neon-cyan" /> djfunkyevents.ro
            </a>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="neon-filled" size="lg" asChild>
              <a href={`mailto:${MANAGER.email}`}><Mail className="w-5 h-5 mr-2" /> Contact Management</a>
            </Button>
            <Button variant="glass" size="lg" asChild>
              <a href={MANAGER.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle className="w-5 h-5 mr-2" /> WhatsApp</a>
            </Button>
          </div>
        </div>

        <div className="glass-card p-8 lg:col-span-2">
          <div className="text-xs tracking-[0.3em] text-neon-cyan uppercase mb-6">Responsabilități</div>
          <ul className="space-y-4">
            {responsibilities.map((r) => (
              <li key={r} className="flex items-start gap-3 border-b border-white/5 pb-3 last:border-0">
                <Check className="w-4 h-4 text-neon-cyan mt-1 shrink-0" />
                <span className="font-display text-foreground">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center mt-12">
        <Button variant="neon" size="lg" asChild>
          <Link to="/#contact">Book DJ Funky</Link>
        </Button>
      </div>
    </div>
  </section>
);

export default ManagementSection;
