import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Instagram, Facebook, Send, Calendar } from "lucide-react";
function TikTokIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={props.className}>
      <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
    </svg>
  );
}
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";


const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", company: "", email: "", phone: "", eventType: "", date: "", location: "", guests: "", budget: "", message: "" });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_requests").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        event_type: formData.eventType || null,
        event_date: formData.date || null,
        message: formData.message || null,
        company: formData.company || null,
        location: formData.location || null,
        guests: formData.guests || null,
        budget: formData.budget || null,
      });
      if (error) throw error;
      toast({ title: "Mesaj trimis cu succes! 🎉", description: "Te vom contacta în cel mai scurt timp posibil." });
      setFormData({ name: "", company: "", email: "", phone: "", eventType: "", date: "", location: "", guests: "", budget: "", message: "" });
    } catch (err: any) {
      toast({ title: "Eroare la trimitere", description: err?.message || "Încearcă din nou sau contactează-ne direct.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-neon-cyan/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-neon-magenta/10 rounded-full blur-[120px]" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-display text-sm tracking-widest text-neon-cyan uppercase">
            Contact
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
            <span className="text-foreground">Hai să facem</span>{" "}
            <span className="gradient-text">Magie Împreună</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ești gata să transformi evenimentul tău într-o experiență de neuitat? 
            Contactează-ne și hai să discutăm despre planurile tale!
            <br />
            <span className="text-foreground">Solicitările se adresează managerului oficial DJ Funky — Izabela Stoica.</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div id="booking-form" className="glass-card p-8 scroll-mt-24">
            <h3 className="font-display text-2xl font-semibold mb-6 text-foreground">
              Solicită o Ofertă
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Nume Complet</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ion Popescu"
                    className="bg-muted/50 border-white/10 focus:border-neon-cyan"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@exemplu.com"
                    className="bg-muted/50 border-white/10 focus:border-neon-cyan"
                    required
                  />
                </div>
              </div>

              <div>
                  <label className="block text-sm text-muted-foreground mb-2">Companie / Organizație</label>
                  <Input name="company" value={formData.company} onChange={handleChange} placeholder="Opțional" className="bg-muted/50 border-white/10 focus:border-neon-cyan" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Telefon</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0721 234 567"
                    className="bg-muted/50 border-white/10 focus:border-neon-cyan"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Tip Eveniment</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full h-11 px-3 rounded-lg bg-muted/50 border border-white/10 text-foreground focus:border-neon-cyan focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Selectează...</option>
                    <option value="Nuntă">Nuntă</option>
                    <option value="Botez">Botez</option>
                    <option value="Majorat">Majorat</option>
                    <option value="Cununie">Cununie</option>
                    <option value="Banchet">Banchet</option>
                    <option value="Eveniment corporate">Eveniment corporate</option>
                    <option value="Club">Club</option>
                    <option value="Festival">Festival</option>
                    <option value="Eveniment privat">Eveniment privat</option>
                    <option value="Altul">Altul</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Locația Evenimentului</label>
                  <Input name="location" type="text" value={formData.location} onChange={handleChange} placeholder="Iași, Hotel ..." className="bg-muted/50 border-white/10 focus:border-neon-cyan" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Număr estimativ invitați</label>
                  <Input name="guests" type="text" value={formData.guests} onChange={handleChange} placeholder="150" className="bg-muted/50 border-white/10 focus:border-neon-cyan" />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Buget</label>
                  <Input name="budget" type="text" value={formData.budget} onChange={handleChange} placeholder="ex. 1500 €" className="bg-muted/50 border-white/10 focus:border-neon-cyan" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Data Evenimentului</label>
                <Input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="bg-muted/50 border-white/10 focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Mesaj</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Spune-ne mai multe despre evenimentul tău..."
                  rows={4}
                  className="bg-muted/50 border-white/10 focus:border-neon-cyan resize-none"
                />
              </div>

              <Button type="submit" variant="neon-filled" size="lg" className="w-full" disabled={submitting}>
                <Send className="w-5 h-5 mr-2" />
                Trimite Cererea
              </Button>
            </form>
            <p className="text-sm text-muted-foreground text-center mt-6">
              Solicitarea va fi preluată de managementul oficial DJ Funky.<br />
              Email: <a href="mailto:manager@djfunkyevents.ro" className="text-neon-cyan hover:underline">manager@djfunkyevents.ro</a>
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            {/* Official Management */}
            <div className="glass-card p-8 border-neon-cyan/20">
              <div className="text-xs tracking-[0.3em] text-neon-cyan uppercase mb-2">DJ Funky Management</div>
              <div className="font-display text-2xl text-foreground">Izabela Stoica — Artist Manager</div>
              <div className="flex flex-col gap-1 mt-3">
                <a href="mailto:manager@djfunkyevents.ro" className="text-foreground hover:text-neon-cyan transition-colors">manager@djfunkyevents.ro</a>
                <a href="tel:+40769291604" className="text-foreground hover:text-neon-cyan transition-colors">+40 769 291 604</a>
              </div>
              <p className="text-sm text-muted-foreground mt-4 mb-3">Punctul oficial de contact pentru:</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Booking-uri", "Evenimente", "Colaborări", "Parteneriate cu branduri", "Remixuri și licențiere", "Presă și media", "Oportunități profesionale", "Solicitări comerciale"].map((t) => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full border border-white/10 text-muted-foreground">{t}</span>
                ))}
              </div>
              <Button variant="neon-filled" className="w-full" onClick={() => document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })}>
                Book DJ Funky
              </Button>
            </div>

            {/* Contact Cards */}
              <div className="glass-card p-6 flex items-center gap-4 hover:border-neon-cyan/30 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-neon-cyan" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Telefon</div>
                  <div className="flex items-center gap-3">
                    <a href="tel:+40769291604" className="font-display text-lg text-foreground hover:text-neon-cyan transition-colors">
                      +40 769 291 604
                    </a>
                    <a
                      href="https://wa.me/40769291604"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm px-3 py-1 rounded-full border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

            <div className="glass-card p-6 flex items-center gap-4 hover:border-neon-magenta/30 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-neon-magenta/10 border border-neon-magenta/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-neon-magenta" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email — se adresează managerului</div>
                <a href="mailto:manager@djfunkyevents.ro" className="font-display text-lg text-foreground hover:text-neon-magenta transition-colors">
                  manager@djfunkyevents.ro
                </a>
              </div>
            </div>

            <div className="glass-card p-6 flex items-center gap-4 hover:border-neon-purple/30 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-neon-purple" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Locație</div>
                <div className="font-display text-lg text-foreground">
                  Iași, România
                </div>
              </div>
            </div>

            <div className="glass-card p-6 flex items-center gap-4 hover:border-neon-pink/30 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-neon-pink" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Program</div>
                <div className="font-display text-lg text-foreground">
                  Non-Stop Disponibil
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-card p-6">
              <div className="text-sm text-muted-foreground mb-4">Urmărește-ne</div>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/instadjfunky/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram DJ Funky Events"
                  className="w-12 h-12 rounded-xl bg-muted/50 border border-white/10 flex items-center justify-center hover:bg-neon-cyan/10 hover:border-neon-cyan/30 transition-all duration-300 group"
                >
                  <Instagram className="w-5 h-5 text-muted-foreground group-hover:text-neon-cyan transition-colors" />
                  <span className="sr-only">Instagram</span>
                </a>
                <a
                  href="https://www.facebook.com/condreacodrin"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook DJ Funky Events"
                  className="w-12 h-12 rounded-xl bg-muted/50 border border-white/10 flex items-center justify-center hover:bg-neon-magenta/10 hover:border-neon-magenta/30 transition-all duration-300 group"
                >
                  <Facebook className="w-5 h-5 text-muted-foreground group-hover:text-neon-magenta transition-colors" />
                  <span className="sr-only">Facebook</span>
                </a>
                <a
                  href="https://tiktok.com/@djfunkyevents"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok DJ Funky Events"
                  className="w-12 h-12 rounded-xl bg-muted/50 border border-white/10 flex items-center justify-center hover:bg-neon-purple/10 hover:border-neon-purple/30 transition-all duration-300 group"
                >
                  <TikTokIcon className="w-5 h-5 text-muted-foreground group-hover:text-neon-purple transition-colors" />
                  <span className="sr-only">TikTok</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
