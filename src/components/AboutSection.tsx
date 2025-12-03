import { Music, Award, Users, Zap } from "lucide-react";

const features = [
  {
    icon: Music,
    title: "Echipament Premium",
    description: "Sistem de sunet profesional și efecte de lumini de ultimă generație.",
  },
  {
    icon: Award,
    title: "Experiență Vastă",
    description: "Peste 15 ani în industria entertainment-ului, cu sute de evenimente de succes.",
  },
  {
    icon: Users,
    title: "Echipă Dedicată",
    description: "Profesioniști pasionați care pun suflet în fiecare eveniment.",
  },
  {
    icon: Zap,
    title: "Energie Pură",
    description: "Creăm atmosfera perfectă care face oamenii să danseze toată noaptea.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      {/* Decorative Orb */}
      <div className="absolute top-1/2 -right-40 w-80 h-80 bg-neon-purple/10 rounded-full blur-[100px]" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="font-display text-sm tracking-widest text-neon-purple uppercase">
              Despre Noi
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
              <span className="text-foreground">Pasiune pentru</span>
              <br />
              <span className="gradient-text">Muzică & Evenimente</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              DJ Funky Events nu este doar un serviciu de DJ – este o experiență completă. 
              Cu peste 15 ani de experiență în industria entertainment-ului, am transformat 
              mii de evenimente în momente de neuitat.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Fie că vorbim de o nuntă romantică, un majorat spectaculos, o petrecere corporate 
              elegantă sau un show de club energic, aducem aceeași pasiune și profesionalism. 
              Echipamentul nostru premium, combinat cu un simț artistic pentru muzică și atmosferă, 
              garantează că fiecare eveniment va fi exact așa cum ai visat.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "500+", label: "Evenimente" },
                { value: "15+", label: "Ani" },
                { value: "50+", label: "Locații Partenere" },
                { value: "100%", label: "Dedicație" },
              ].map((stat, index) => (
                <div key={index} className="glass-card p-4 text-center">
                  <div className="font-display text-2xl font-bold text-neon-cyan">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Features */}
          <div className="grid gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group flex gap-6 glass-card p-6 hover:border-neon-cyan/30 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-neon-cyan" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-neon-cyan transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
