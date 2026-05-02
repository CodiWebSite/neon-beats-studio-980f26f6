import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type SocialItem = { id: string; platform: "tiktok" | "instagram"; url: string };

function ensureScript(src: string) {
  const exists = document.querySelector(`script[src="${src}"]`);
  if (!exists) {
    const s = document.createElement("script");
    s.async = true;
    s.src = src;
    document.body.appendChild(s);
  }
}

function extractTikTokVideoId(url: string): string | undefined {
  const m = url.match(/video\/(\d+)/);
  return m?.[1];
}

const GallerySection = () => {
  const [items, setItems] = useState<SocialItem[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("gallery_items")
        .select("id,platform,url")
        .order("created_at", { ascending: true });
      setItems((data || []) as SocialItem[]);
    })();
  }, []);

  useEffect(() => {
    ensureScript("https://www.instagram.com/embed.js");
    ensureScript("https://www.tiktok.com/embed.js");
    // Instagram requires explicit process for dynamically added embeds
    setTimeout(() => {
      // @ts-expect-error Instagram embed runtime injected by external script
      if (window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
        // @ts-expect-error Instagram embed runtime injected by external script
        window.instgrm.Embeds.process();
      }
    }, 0);
  }, [items]);

  const hasItems = useMemo(() => items.length > 0, [items]);

  return (
    <section id="gallery" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="font-display text-sm tracking-widest text-neon-magenta uppercase">
            Portofoliu
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
            <span className="text-foreground">Galerie</span>{" "}
            <span className="gradient-text">Evenimente</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fiecare eveniment spune o poveste. Descoperă momentele memorabile pe care le-am creat împreună cu clienții noștri.
          </p>
        </div>

        

        {hasItems ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="glass-card p-3">
                {item.platform === "tiktok" && (
                  <blockquote
                    className="tiktok-embed"
                    cite={item.url}
                    data-video-id={extractTikTokVideoId(item.url) || undefined}
                    style={{ maxWidth: 605, minWidth: 325 }}
                  >
                    <section />
                  </blockquote>
                )}
                {item.platform === "instagram" && (
                  <blockquote className="instagram-media" data-instgrm-permalink={item.url} data-instgrm-version="14" />
                )}
                
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-10 text-center">
            <div className="font-display text-xl text-foreground mb-2">Galerie în curând</div>
            <p className="text-muted-foreground">Adaugă linkuri de TikTok sau Instagram mai sus.</p>
          </div>
        )}

        
      </div>

      
    </section>
  );
};

export default GallerySection;
