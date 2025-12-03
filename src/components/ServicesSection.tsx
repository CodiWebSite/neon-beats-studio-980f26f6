import { PartyPopper, Heart, Building2, Disc3, Users, Sparkles } from "lucide-react";

const services = [
  {
    icon: PartyPopper,
    title: "Petreceri Private",
    description: "Zile de naștere, aniversări și evenimente speciale cu muzică personalizată și atmosferă perfectă.",
    color: "neon-cyan",
  },
  {
    icon: Sparkles,
    title: "Majorate",
    description: "Show-uri spectaculoase pentru majoratul tău, cu efecte speciale și playlist personalizat.",
    color: "neon-magenta",
  },
  {
    icon: Heart,
    title: "Nunți",
    description: "Creăm momentele muzicale perfecte pentru cea mai importantă zi din viața ta.",
    color: "neon-pink",
  },
  {
    icon: Building2,
    title: "Corporate",
    description: "Evenimente de firmă, team building-uri și gale cu profesionalism și eleganță.",
    color: "neon-purple",
  },
  {
    icon: Disc3,
    title: "Club Shows",
    description: "Set-uri energice pentru cele mai tari cluburi și festivaluri din țară.",
    color: "neon-blue",
  },
  {
    icon: Users,
    title: "Festivaluri",
    description: "Experiențe de neuitat pe scene mari, cu echipament profesional și efecte vizuale.",
    color: "neon-cyan",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-background" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-magenta/50 to-transparent" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-display text-sm tracking-widest text-neon-cyan uppercase">
            Ce Oferim
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
            <span className="text-foreground">Servicii</span>{" "}
            <span className="gradient-text">Premium</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            De la petreceri intime la evenimente grandioase, oferim soluții complete 
            de entertainment pentru orice ocazie.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group glass-card p-8 hover:border-neon-cyan/30 transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-${service.color}/10 border border-${service.color}/20 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className={`w-7 h-7 text-${service.color}`} />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold mb-3 text-foreground group-hover:text-neon-cyan transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>

              {/* Hover Line */}
              <div className="h-0.5 w-0 bg-gradient-to-r from-neon-cyan to-neon-magenta mt-6 group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
