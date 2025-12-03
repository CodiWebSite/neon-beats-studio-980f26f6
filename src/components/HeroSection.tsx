import { Button } from "@/components/ui/button";
import { Play, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-dj.jpg";

const HeroSection = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      
      {/* Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-magenta/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: "0.5s" }} />

      {/* Laser Lines */}
      <div className="absolute top-20 left-0 right-0 h-px laser-line" style={{ ["--laser-angle" as string]: "0deg" }} />
      <div className="absolute top-40 left-0 right-0 h-px laser-line" style={{ ["--laser-angle" as string]: "0deg", animationDelay: "1s" }} />
      <div className="absolute bottom-40 left-0 right-0 h-px laser-line" style={{ ["--laser-angle" as string]: "0deg", animationDelay: "2s" }} />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--neon-cyan) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--neon-cyan) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="font-display text-xs tracking-widest text-neon-cyan uppercase">
              Premium DJ Entertainment
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <span className="text-foreground">DJ</span>{" "}
            <span className="gradient-text">FUNKY</span>
            <br />
            <span className="text-foreground text-3xl md:text-5xl lg:text-6xl">EVENTS</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            Transformăm fiecare eveniment într-o experiență memorabilă. 
            Muzică, lumini și energie pentru petreceri de neuitat.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <Button
              variant="neon-filled"
              size="xl"
              onClick={() => scrollToSection("#contact")}
              className="group"
            >
              <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Rezervă Evenimentul
            </Button>
            <Button
              variant="glass"
              size="xl"
              onClick={() => scrollToSection("#gallery")}
              className="group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Vezi Portofoliul
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            {[
              { value: "500+", label: "Evenimente" },
              { value: "15+", label: "Ani Experiență" },
              { value: "100%", label: "Satisfacție" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-neon-cyan text-glow-cyan">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-neon-cyan/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-neon-cyan animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
