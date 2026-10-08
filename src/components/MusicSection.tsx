import { useEffect, useRef, useState } from "react";
import { Play, Pause, Music } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Track = { id: string; title: string; artist: string | null; src: string };

const MusicSection = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("tracks").select("id,title,artist,file_path").order("sort_order").order("created_at", { ascending: false });
      if (!data?.length) return;
      const { data: signed } = await supabase.storage.from("tracks").createSignedUrls(data.map((d) => d.file_path), 60 * 60 * 6);
      setTracks(data.map((d, i) => ({ id: d.id, title: d.title, artist: d.artist, src: signed?.[i]?.signedUrl || "" })));
    })();
  }, []);

  const toggle = (t: Track) => {
    const a = audio.current;
    if (!a) return;
    if (current === t.id) {
      if (a.paused) a.play(); else a.pause();
      return;
    }
    a.src = t.src;
    setCurrent(t.id);
    a.play();
  };

  if (!tracks.length) return null;

  return (
    <section id="music" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="font-display text-sm tracking-widest text-neon-cyan uppercase">Muzică</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-4">
            <span className="text-foreground">Piesele</span> <span className="gradient-text">DJ Funky</span>
          </h2>
          <p className="text-muted-foreground">Ascultă în calitate WAV, fără compresie.</p>
        </div>
        <div className="glass-card max-w-3xl mx-auto p-4 md:p-6">
          <ul className="divide-y divide-white/5">
            {tracks.map((t, i) => {
              const active = current === t.id;
              return (
                <li key={t.id}>
                  <button onClick={() => toggle(t)} className="w-full flex items-center gap-4 py-4 px-2 text-left group">
                    <span className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center border transition-colors ${active ? "border-neon-cyan bg-neon-cyan/10" : "border-white/10 group-hover:border-neon-cyan/50"}`}>
                      {active && playing ? <Pause className="w-4 h-4 text-neon-cyan" /> : <Play className="w-4 h-4 text-neon-cyan ml-0.5" />}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className={`block font-display truncate ${active ? "text-neon-cyan" : "text-foreground"}`}>{t.title}</span>
                      {t.artist && <span className="block text-sm text-muted-foreground truncate">{t.artist}</span>}
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1"><Music className="w-3 h-3" /> WAV · {String(i + 1).padStart(2, "0")}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <audio
            ref={audio}
            controls
            preload="none"
            className={`w-full mt-4 ${current ? "" : "hidden"}`}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              const idx = tracks.findIndex((t) => t.id === current);
              if (idx >= 0 && idx < tracks.length - 1) toggle(tracks[idx + 1]);
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default MusicSection;
