import { Instagram, Facebook, Heart } from "lucide-react";
import logo from "../../Document.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "#home", label: "Acasă" },
    { href: "#services", label: "Servicii" },
    { href: "#gallery", label: "Galerie" },
    { href: "#about", label: "Despre" },
    { href: "#contact", label: "Contact" },
  ];

  const services = [
    "Petreceri Private",
    "Majorate",
    "Nunți",
    "Corporate",
    "Club Shows",
    "Festivaluri",
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative pt-20 pb-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection("#home"); }} className="flex items-center gap-3 mb-6">
              <img src={logo} alt="DJ Funky Events" className="h-20 md:h-24 w-auto rounded-md" />
            </a>
              <p className="text-sm text-muted-foreground">
              Transformăm fiecare eveniment într-o experiență de neuitat. 
              Muzică, lumini și energie pentru cele mai speciale momente din viața ta.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-muted/50 border border-white/10 flex items-center justify-center hover:bg-neon-cyan/10 hover:border-neon-cyan/30 transition-all duration-300 group"
              >
                <Instagram className="w-4 h-4 text-muted-foreground group-hover:text-neon-cyan transition-colors" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-muted/50 border border-white/10 flex items-center justify-center hover:bg-neon-magenta/10 hover:border-neon-magenta/30 transition-all duration-300 group"
              >
                <Facebook className="w-4 h-4 text-muted-foreground group-hover:text-neon-magenta transition-colors" />
              </a>
              
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-6">
              Linkuri Rapide
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                    className="text-muted-foreground hover:text-neon-cyan transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-6">
              Servicii
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-muted-foreground">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-6">
              Contact
            </h4>
            <div className="space-y-3 text-muted-foreground">
              <p>Iași, România</p>
              <p>
                <a href="tel:+40755649856" className="hover:text-neon-cyan transition-colors">
                  +40 755 649 856
                </a>
              </p>
              <p>
                <a href="mailto:contact@djfunyevents.ro" className="hover:text-neon-cyan transition-colors">
                  contact@djfunyevents.ro
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} DJ Funky Events. Toate drepturile rezervate.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-neon-magenta" /> in România
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
