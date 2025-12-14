import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Radio } from "lucide-react";
import logo from "../../Document.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "Acasă" },
    { href: "#services", label: "Servicii" },
    { href: "#availability", label: "Disponibilitate" },
    { href: "#gallery", label: "Galerie" },
    { href: "#about", label: "Despre" },
    { href: "#contact", label: "Contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#home");
            }}
            className="flex items-center gap-3 group"
          >
            <img
              src={logo}
              alt="DJ Funky Events"
              className="h-20 md:h-24 -my-2 md:-my-4 w-auto rounded-md"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (link.href.startsWith("#")) {
                    scrollToSection(link.href);
                  } else {
                    window.location.href = link.href;
                  }
                }}
                className="font-display text-sm tracking-wider text-muted-foreground hover:text-neon-cyan transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-cyan transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="neon-filled"
              size="default"
              className="text-foreground hover:opacity-90"
              onClick={() => window.open("https://radio.djfunkyevents.ro", "_blank")}
            >
              <Radio className="w-5 h-5 mr-2" />
              Radio
            </Button>
            <Button
              variant="neon"
              onClick={() => scrollToSection("#contact")}
            >
              Rezervă Acum
            </Button>
          </div>

          {/* Mobile: Radio + Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="neon-filled"
              size="sm"
              className="px-3"
              onClick={() => window.open("https://radio.djfunkyevents.ro", "_blank")}
            >
              <Radio className="w-4 h-4 mr-1" />
              Radio
            </Button>
            <button
              className="text-foreground p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 ${
              isMobileMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (link.href.startsWith("#")) {
                      scrollToSection(link.href);
                    } else {
                      window.location.href = link.href;
                    }
                  }}
                  className="font-display text-lg tracking-wider text-muted-foreground hover:text-neon-cyan transition-colors duration-300 py-2"
                >
                  {link.label}
                </a>
              ))}
          <div className="flex flex-col gap-3 mt-2">
            <Button
              variant="neon-filled"
              className="text-foreground hover:opacity-90"
              onClick={() => window.open("https://radio.djfunkyevents.ro", "_blank")}
            >
              <Radio className="w-5 h-5 mr-2" />
              Radio
            </Button>
            <Button
              variant="neon"
              onClick={() => scrollToSection("#contact")}
            >
              Rezervă Acum
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
