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

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    date: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast({ title: "Mesaj trimis cu succes! 🎉", description: "Te vom contacta în cel mai scurt timp posibil." });
        setFormData({ name: "", email: "", phone: "", eventType: "", date: "", message: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        toast({ title: "Eroare la trimitere", description: data?.error || "Încearcă din nou sau contactează-ne direct.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Eroare de rețea", description: "Nu am putut trimite cererea.", variant: "destructive" });
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
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="glass-card p-8">
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
                    <option value="nunta">Nuntă</option>
                    <option value="majorat">Majorat</option>
                    <option value="corporate">Corporate</option>
                    <option value="petrecere">Petrecere Privată</option>
                    <option value="club">Club Show</option>
                    <option value="altul">Altul</option>
                  </select>
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

              <Button type="submit" variant="neon-filled" size="lg" className="w-full">
                <Send className="w-5 h-5 mr-2" />
                Trimite Cererea
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            {/* Contact Cards */}
              <div className="glass-card p-6 flex items-center gap-4 hover:border-neon-cyan/30 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-neon-cyan" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Telefon</div>
                  <div className="flex items-center gap-3">
                    <a href="tel:+40755649856" className="font-display text-lg text-foreground hover:text-neon-cyan transition-colors">
                      +40 755 649 856
                    </a>
                    <a
                      href="https://wa.me/40755649856"
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
                <div className="text-sm text-muted-foreground">Email</div>
                <a href="mailto:contact@djfunyevents.ro" className="font-display text-lg text-foreground hover:text-neon-magenta transition-colors">
                  contact@djfunyevents.ro
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
                  className="w-12 h-12 rounded-xl bg-muted/50 border border-white/10 flex items-center justify-center hover:bg-neon-cyan/10 hover:border-neon-cyan/30 transition-all duration-300 group"
                >
                  <Instagram className="w-5 h-5 text-muted-foreground group-hover:text-neon-cyan transition-colors" />
                </a>
                <a
                  href="https://www.facebook.com/condreacodrin"
                  className="w-12 h-12 rounded-xl bg-muted/50 border border-white/10 flex items-center justify-center hover:bg-neon-magenta/10 hover:border-neon-magenta/30 transition-all duration-300 group"
                >
                  <Facebook className="w-5 h-5 text-muted-foreground group-hover:text-neon-magenta transition-colors" />
                </a>
                <a
                  href="http://tiktok.com/@djfunkyevents"
                  className="w-12 h-12 rounded-xl bg-muted/50 border border-white/10 flex items-center justify-center hover:bg-neon-purple/10 hover:border-neon-purple/30 transition-all duration-300 group"
                >
                  <TikTokIcon className="w-5 h-5 text-muted-foreground group-hover:text-neon-purple transition-colors" />
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
