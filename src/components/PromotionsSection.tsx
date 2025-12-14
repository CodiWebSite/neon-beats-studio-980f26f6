import { useEffect, useState } from "react";

type PromoItem = { id: string; title: string; date?: string; location?: string; link?: string };

const PromotionsSection = () => {
  const [items, setItems] = useState<PromoItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin_get.php");
        const data = await res.json();
        setItems(data?.promotions || []);
      } catch (e) {
        setItems([]);
      }
    })();
  }, []);

  return (
    <section id="promotions" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="font-display text-sm tracking-widest text-neon-purple uppercase">Evenimente</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
            <span className="text-foreground">Promo</span>{" "}
            <span className="gradient-text">Speciale</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descoperă evenimentele pe care le promovăm în perioada următoare.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <div className="font-display text-xl text-foreground mb-2">În curând</div>
            <p className="text-muted-foreground">Momentan nu există promoții active.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <div key={p.id} className="glass-card p-6">
                <div className="font-display text-xl text-foreground">{p.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{[p.date, p.location].filter(Boolean).join(" • ")}</div>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 px-4 py-2 rounded-full border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 transition">
                    Detalii
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PromotionsSection;

