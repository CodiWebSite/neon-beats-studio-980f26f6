import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Track = { id: string; title: string; artist: string | null; file_path: string };

const AdminTracks = () => {
  const { toast } = useToast();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("DJ Funky");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("tracks").select("id,title,artist,file_path").order("sort_order").order("created_at", { ascending: false });
    setTracks((data || []) as Track[]);
  };
  useEffect(() => { load(); }, []);

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${Date.now()}-${safe}`;
      const { error: upErr } = await supabase.storage.from("tracks").upload(path, file, { contentType: file.type || "audio/wav" });
      if (upErr) throw upErr;
      const { error } = await supabase.from("tracks").insert({
        title: title.trim() || file.name.replace(/\.[^.]+$/, ""),
        artist: artist.trim() || null,
        file_path: path,
        url: path,
      });
      if (error) throw error;
      toast({ title: "Piesă încărcată" });
      setTitle(""); setFile(null);
      (document.getElementById("track-file") as HTMLInputElement | null)?.value && ((document.getElementById("track-file") as HTMLInputElement).value = "");
      load();
    } catch (e: any) {
      toast({ title: "Eroare", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const remove = async (t: Track) => {
    if (!confirm(`Ștergi „${t.title}”?`)) return;
    await supabase.storage.from("tracks").remove([t.file_path]);
    const { error } = await supabase.from("tracks").delete().eq("id", t.id);
    if (error) return toast({ title: "Eroare", description: error.message, variant: "destructive" });
    load();
  };

  return (
    <>
      <h2 className="font-display text-2xl gold-text mb-4">Muzica mea (WAV)</h2>
      <div className="luxury-card p-6 mb-10 space-y-4">
        <div className="grid md:grid-cols-3 gap-3">
          <input className="h-11 px-3 rounded-lg bg-muted/50 border border-gold/20" placeholder="Titlu piesă" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="h-11 px-3 rounded-lg bg-muted/50 border border-gold/20" placeholder="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} />
          <input id="track-file" type="file" accept=".wav,audio/wav,audio/x-wav,audio/*" className="text-sm py-2" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
        <button onClick={upload} disabled={!file || uploading} className="px-6 py-2 rounded-lg bg-gradient-to-r from-gold to-champagne text-background font-semibold disabled:opacity-50">
          {uploading ? "Se încarcă..." : "Încarcă piesa"}
        </button>
        <p className="text-xs text-muted-foreground">Maxim 200 MB per fișier.</p>
        <ul className="divide-y divide-gold/10">
          {tracks.map((t) => (
            <li key={t.id} className="flex items-center justify-between py-3">
              <span>{t.title}{t.artist && <span className="text-muted-foreground"> — {t.artist}</span>}</span>
              <button onClick={() => remove(t)} className="text-sm text-destructive hover:underline">Șterge</button>
            </li>
          ))}
          {tracks.length === 0 && <li className="py-3 text-muted-foreground">Nicio piesă încărcată.</li>}
        </ul>
      </div>
    </>
  );
};

export default AdminTracks;
