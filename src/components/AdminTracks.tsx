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

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<{ type: "error" | "ok"; text: string } | null>(null);
  const MAX = 200 * 1024 * 1024;

  const validateWav = async (f: File): Promise<string | null> => {
    if (!/\.wav$/i.test(f.name)) return "Fișierul trebuie să aibă extensia .wav.";
    if (f.size === 0) return "Fișierul este gol.";
    if (f.size > MAX) return `Fișierul are ${(f.size / 1048576).toFixed(0)} MB — limita este 200 MB.`;
    const head = new Uint8Array(await f.slice(0, 12).arrayBuffer());
    const txt = (a: number, b: number) => String.fromCharCode(...head.slice(a, b));
    if (txt(0, 4) !== "RIFF" || txt(8, 12) !== "WAVE") return "Fișierul nu este un WAV valid (poate e MP3 redenumit). Exportă-l din nou ca WAV.";
    return null;
  };

  const pickFile = async (f: File | null) => {
    setStatus(null); setProgress(0); setFile(null);
    if (!f) return;
    const err = await validateWav(f);
    if (err) { setStatus({ type: "error", text: err }); return; }
    setFile(f);
  };

  const uploadWithProgress = async (path: string, f: File) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Sesiunea a expirat. Autentifică-te din nou.");
    const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/tracks/${encodeURIComponent(path)}`;
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Authorization", `Bearer ${session.access_token}`);
      xhr.setRequestHeader("apikey", import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
      xhr.setRequestHeader("Content-Type", "audio/wav");
      xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100)); };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) return resolve();
        let msg = `Eroare server (${xhr.status}).`;
        if (xhr.status === 413) msg = "Fișierul este prea mare pentru server.";
        else if (xhr.status === 401 || xhr.status === 403) msg = "Nu ai permisiunea să încarci. Autentifică-te din nou ca admin.";
        else { try { msg = JSON.parse(xhr.responseText).message || msg; } catch {} }
        reject(new Error(msg));
      };
      xhr.onerror = () => reject(new Error("Conexiunea s-a întrerupt. Verifică internetul și încearcă din nou."));
      xhr.send(f);
    });
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true); setProgress(0); setStatus(null);
    try {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${Date.now()}-${safe}`;
      await uploadWithProgress(path, file);
      const { error } = await supabase.from("tracks").insert({
        title: title.trim() || file.name.replace(/\.[^.]+$/, ""),
        artist: artist.trim() || null,
        file_path: path,
        url: path,
      });
      if (error) { await supabase.storage.from("tracks").remove([path]); throw new Error("Piesa nu a putut fi salvată: " + error.message); }
      toast({ title: "Piesă încărcată" });
      setStatus({ type: "ok", text: `„${file.name}” a fost încărcată cu succes.` });
      setTitle(""); setFile(null);
      const el = document.getElementById("track-file") as HTMLInputElement | null;
      if (el) el.value = "";
      load();
    } catch (e: any) {
      setStatus({ type: "error", text: "Încărcarea a eșuat: " + e.message });
      toast({ title: "Încărcarea a eșuat", description: e.message, variant: "destructive" });
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
          <input id="track-file" type="file" accept=".wav,audio/wav,audio/x-wav" disabled={uploading} className="text-sm py-2" onChange={(e) => pickFile(e.target.files?.[0] || null)} />
        </div>
        <button onClick={upload} disabled={!file || uploading} className="px-6 py-2 rounded-lg bg-gradient-to-r from-gold to-champagne text-background font-semibold disabled:opacity-50">
          {uploading ? `Se încarcă... ${progress}%` : "Încarcă piesa"}
        </button>
        {uploading && (
          <div className="space-y-1">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gold to-champagne transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{progress < 100 ? `${progress}% încărcat — nu închide pagina.` : "Se salvează piesa..."}</p>
          </div>
        )}
        {status && (
          <p role="alert" className={`text-sm ${status.type === "error" ? "text-destructive" : "text-gold"}`}>{status.text}</p>
        )}
        <p className="text-xs text-muted-foreground">Doar fișiere WAV, maxim 200 MB per fișier.</p>
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
