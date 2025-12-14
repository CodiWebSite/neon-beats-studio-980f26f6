import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ro } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

type Status = "free" | "occupied" | "unavailable";

type AvailabilityMap = Record<string, Status>;

type SocialItem = { id: string; platform: "tiktok" | "instagram"; url: string };
type PromoItem = { id: string; title: string; date?: string; location?: string; link?: string };

function isValidTikTokUrl(url: string): boolean {
  return /\/video\/\d+/.test(url);
}

function isValidInstagramUrl(url: string): boolean {
  return /\/p\//.test(url) || /\/reel\//.test(url);
}

function extractTikTokVideoId(url: string): string | undefined {
  const m = url.match(/video\/(\d+)/);
  return m?.[1];
}

function toISO(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getMonthDays(month: Date): Date[] {
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const result: Date[] = [];
  const m = start.getMonth();
  const d = new Date(start);
  while (d.getMonth() === m) {
    result.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return result;
}

function inferTitleFromLink(u: string): string {
  try {
    const url = new URL(u);
    const host = url.hostname.replace("www.", "");
    const last = url.pathname.split("/").filter(Boolean).pop() || "";
    const base = (last || host).trim();
    if (!base) return "Detalii";
    return base.charAt(0).toUpperCase() + base.slice(1);
  } catch {
    return "Detalii";
  }
}

const Admin = () => {
  const { toast } = useToast();
  const [month, setMonth] = useState<Date>(new Date());
  const [unlocked, setUnlocked] = useState(false);
  const [hasPass, setHasPass] = useState(false);
  const [setupPass, setSetupPass] = useState("");
  const [inputPass, setInputPass] = useState("");
  const [adminPass, setAdminPass] = useState("");

  const [date, setDate] = useState("");
  const [status, setStatus] = useState<Status>("occupied");
  const [availability, setAvailability] = useState<AvailabilityMap>({});

  const [platform, setPlatform] = useState<"tiktok" | "instagram">("tiktok");
  const [postUrl, setPostUrl] = useState("");
  const [gallery, setGallery] = useState<SocialItem[]>([]);
  const [promotions, setPromotions] = useState<PromoItem[]>([]);
  const [promoTitle, setPromoTitle] = useState("");
  const [promoDate, setPromoDate] = useState("");
  const [promoLocation, setPromoLocation] = useState("");
  const [promoLink, setPromoLink] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin_get.php");
        const data = await res.json();
        setAvailability(data?.availability || {});
        setGallery(data?.gallery || []);
        setPromotions(data?.promotions || []);
        setHasPass(Boolean(data?.hasPass));
      } catch (e) {
        setAvailability({});
        setGallery([]);
        setHasPass(false);
      }
    })();
  }, []);

  useEffect(() => {
    const ensureScript = (src: string) => {
      const exists = document.querySelector(`script[src="${src}"]`);
      if (!exists) {
        const s = document.createElement("script");
        s.async = true;
        s.src = src;
        document.body.appendChild(s);
      }
    };
    ensureScript("https://www.instagram.com/embed.js");
    ensureScript("https://www.tiktok.com/embed.js");
    setTimeout(() => {
      // @ts-expect-error Instagram embed runtime injected by external script
      if (window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
        // @ts-expect-error Instagram embed runtime injected by external script
        window.instgrm.Embeds.process();
      }
    }, 0);
  }, [gallery]);

  const entries = useMemo(() => Object.entries(availability).sort(([a],[b]) => a.localeCompare(b)), [availability]);

  const { freeDates, occupiedDates, unavailableDates } = useMemo(() => {
    const days = getMonthDays(month);
    const free: Date[] = [];
    const occupied: Date[] = [];
    const unavailable: Date[] = [];
    for (const d of days) {
      const key = toISODate(d);
      const dow = d.getDay();
      const override = availability[key];
      const defaultStatus: Status = dow >= 1 && dow <= 4 ? "unavailable" : "free";
      const finalStatus = override ?? defaultStatus;
      if (finalStatus === "occupied") occupied.push(d);
      else if (finalStatus === "unavailable") unavailable.push(d);
      else free.push(d);
    }
    return { freeDates: free, occupiedDates: occupied, unavailableDates: unavailable };
  }, [month, availability]);

  async function handleSetupPass() {
    if (!setupPass) return;
    try {
      const res = await fetch("/api/admin_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setup", password: setupPass }),
      });
      if (res.ok) {
        setHasPass(true);
        setUnlocked(true);
        setAdminPass(setupPass);
        setSetupPass("");
        toast({ title: "Parolă setată", description: "Acces administrator activat." });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: "Eroare", description: String(err?.error || "Nu am putut seta parola."), variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Eroare", description: "Conexiune indisponibilă.", variant: "destructive" });
    }
  }

  async function handleUnlock() {
    if (!inputPass) return;
    try {
      const res = await fetch("/api/admin_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", password: inputPass }),
      });
      if (res.ok) {
        setUnlocked(true);
        setAdminPass(inputPass);
        setInputPass("");
        toast({ title: "Autentificare reușită", description: "Bine ai venit în admin." });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: "Parolă greșită", description: String(err?.error || "Încearcă din nou."), variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Eroare", description: "Conexiune indisponibilă.", variant: "destructive" });
    }
  }

  async function saveAvailability() {
    const iso = toISO(date);
    if (!iso) {
      toast({ title: "Dată invalidă", description: "Selectează o dată corectă.", variant: "destructive" });
      return;
    }
    const next = { ...availability, [iso]: status };
    try {
      const res = await fetch("/api/admin_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveAvailability", password: adminPass, availability: next }),
      });
      if (res.ok) {
        setAvailability(next);
        toast({ title: "Salvat", description: `${iso} → ${status}` });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: "Eroare salvare", description: String(err?.error || "Verifică parola și încearcă din nou."), variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Eroare", description: "Conexiune indisponibilă.", variant: "destructive" });
    }
  }

  async function setDayStatus(d: Date, st: Status) {
    const iso = toISODate(d);
    const next = { ...availability, [iso]: st };
    try {
      const res = await fetch("/api/admin_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveAvailability", password: adminPass, availability: next }),
      });
      if (res.ok) {
        setAvailability(next);
        toast({ title: "Salvat", description: `${iso} → ${st}` });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: "Eroare salvare", description: String(err?.error || "Verifică parola."), variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Eroare", description: "Conexiune indisponibilă.", variant: "destructive" });
    }
  }

  async function removeEntry(iso: string) {
    const next = { ...availability };
    delete next[iso];
    try {
      const res = await fetch("/api/admin_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveAvailability", password: adminPass, availability: next }),
      });
      if (res.ok) {
        setAvailability(next);
        toast({ title: "Șters", description: iso });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: "Eroare salvare", description: String(err?.error || "Verifică parola."), variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Eroare", description: "Conexiune indisponibilă.", variant: "destructive" });
    }
  }

  async function addSocialItem() {
    if (!postUrl.trim()) {
      toast({ title: "Link invalid", description: "Adaugă URL complet al postării.", variant: "destructive" });
      return;
    }
    if (platform === "tiktok" && !isValidTikTokUrl(postUrl.trim())) {
      toast({ title: "TikTok nevalid", description: "Folosește linkul complet cu /video/ID.", variant: "destructive" });
      return;
    }
    if (platform === "instagram" && !isValidInstagramUrl(postUrl.trim())) {
      toast({ title: "Instagram nevalid", description: "Folosește link de postare /p/ sau /reel/.", variant: "destructive" });
      return;
    }
    const id = `${platform}-${Date.now()}`;
    const next = [...gallery, { id, platform, url: postUrl.trim() }];
    try {
      const res = await fetch("/api/admin_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveGallery", password: adminPass, gallery: next }),
      });
      if (res.ok) {
        setGallery(next);
        setPostUrl("");
        toast({ title: "Adăugat", description: `${platform} → element în galerie` });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: "Eroare salvare", description: String(err?.error || "Verifică parola."), variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Eroare", description: "Conexiune indisponibilă.", variant: "destructive" });
    }
  }

  async function removeSocialItem(id: string) {
    const next = gallery.filter((it) => it.id !== id);
    try {
      const res = await fetch("/api/admin_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveGallery", password: adminPass, gallery: next }),
      });
      if (res.ok) {
        setGallery(next);
        toast({ title: "Șters", description: id });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: "Eroare salvare", description: String(err?.error || "Verifică parola."), variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Eroare", description: "Conexiune indisponibilă.", variant: "destructive" });
    }
  }

  async function addPromotion() {
    const t = promoTitle.trim();
    const l = promoLink.trim();
    if (!t && !l) {
      toast({ title: "Titlu sau link lipsă", description: "Completează cel puțin titlul sau linkul.", variant: "destructive" });
      return;
    }
    const id = `promo-${Date.now()}`;
    const title = t || inferTitleFromLink(l);
    const link = l || undefined;
    const next = [...promotions, { id, title, date: promoDate || undefined, location: promoLocation || undefined, link }];
    try {
      const res = await fetch("/api/admin_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "savePromotions", password: adminPass, promotions: next }),
      });
      if (res.ok) {
        setPromotions(next);
        setPromoTitle("");
        setPromoDate("");
        setPromoLocation("");
        setPromoLink("");
        toast({ title: "Promo adăugat", description: promoTitle });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: "Eroare salvare", description: String(err?.error || "Verifică parola."), variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Eroare", description: "Conexiune indisponibilă.", variant: "destructive" });
    }
  }

  async function removePromotion(id: string) {
    const next = promotions.filter((p) => p.id !== id);
    try {
      const res = await fetch("/api/admin_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "savePromotions", password: adminPass, promotions: next }),
      });
      if (res.ok) {
        setPromotions(next);
        toast({ title: "Șters", description: id });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: "Eroare salvare", description: String(err?.error || "Verifică parola."), variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Eroare", description: "Conexiune indisponibilă.", variant: "destructive" });
    }
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-card p-8 w-full max-w-md">
          <h1 className="font-display text-2xl mb-4">Administrator</h1>
          {!hasPass ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Setează o parolă pentru accesul admin.</p>
              <input
                type="password"
                className="w-full h-11 px-3 rounded-lg bg-muted/50 border border-white/10 text-foreground"
                placeholder="Parolă nouă"
                value={setupPass}
                onChange={(e) => setSetupPass(e.target.value)}
              />
              <button onClick={handleSetupPass} className="w-full h-11 rounded-lg border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10">Salvează parola</button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Introdu parola pentru acces.</p>
              <input
                type="password"
                className="w-full h-11 px-3 rounded-lg bg-muted/50 border border-white/10 text-foreground"
                placeholder="Parolă"
                value={inputPass}
                onChange={(e) => setInputPass(e.target.value)}
              />
              <button onClick={handleUnlock} className="w-full h-11 rounded-lg border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10">Autentifică</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-display text-3xl mb-6">Setări Disponibilitate</h1>
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              className="px-4 py-2 rounded-full border border-white/10 hover:border-neon-cyan/40 hover:bg-muted"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            >
              ← Luna anterioară
            </button>
            <div className="font-display text-lg">
              {month.toLocaleString("ro-RO", { month: "long", year: "numeric" })}
            </div>
            <button
              className="px-4 py-2 rounded-full border border-white/10 hover:border-neon-cyan/40 hover:bg-muted"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            >
              Luna următoare →
            </button>
          </div>

          <DayPicker
            month={month}
            onMonthChange={setMonth}
            locale={ro}
            modifiers={{ free: freeDates, occupied: occupiedDates, unavailable: unavailableDates }}
            modifiersClassNames={{
              free: "bg-green-500 text-background",
              occupied: "bg-red-500 text-background",
              unavailable: "bg-white text-background",
            }}
            onDayClick={(d) => setDayStatus(d, status)}
            className="rdp text-sm"
          />

          <p className="mt-4 text-sm text-muted-foreground text-center">🟢 liber (V–S–D) • 🔴 ocupat • ⚪ indisponibil (L–J)</p>
        </div>
        <div className="glass-card p-6 mb-8">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Data</label>
              <input type="date" className="w-full h-11 px-3 rounded-lg bg-muted/50 border border-white/10 text-foreground" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Status</label>
              <select className="w-full h-11 px-3 rounded-lg bg-muted/50 border border-white/10 text-foreground" value={status} onChange={(e) => setStatus(e.target.value as Status)}>
                <option value="free">liber</option>
                <option value="occupied">ocupat</option>
                <option value="unavailable">indisponibil</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={saveAvailability} className="w-full h-11 rounded-lg bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta text-background">Salvează</button>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="font-display text-xl mb-4">Zile setate</h2>
          {entries.length === 0 ? (
            <p className="text-muted-foreground">Nu există zile setate.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {entries.map(([iso, st]) => (
                <div key={iso} className="flex items-center justify-between rounded-lg bg-muted/50 border border-white/10 px-4 py-2">
                  <div className="font-mono text-sm">{iso}</div>
                  <div className="text-sm capitalize">{st}</div>
                  <button onClick={() => removeEntry(iso)} className="text-neon-magenta hover:underline">Șterge</button>
                </div>
              ))}
            </div>
          )}
          <p className="mt-4 text-sm text-muted-foreground">Implicit: L–J indisponibil, V–S–D liber. Zilele setate în admin suprascriu implicitul.</p>
        </div>

        <h1 className="font-display text-3xl mt-10 mb-6">Promo Evenimente</h1>
        <div className="glass-card p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Titlu</label>
              <input className="w-full h-11 px-3 rounded-lg bg-muted/50 border border-white/10 text-foreground" value={promoTitle} onChange={(e) => setPromoTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Data</label>
              <input type="date" className="w-full h-11 px-3 rounded-lg bg-muted/50 border border-white/10 text-foreground" value={promoDate} onChange={(e) => setPromoDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Locație</label>
              <input className="w-full h-11 px-3 rounded-lg bg-muted/50 border border-white/10 text-foreground" value={promoLocation} onChange={(e) => setPromoLocation(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Link</label>
              <input className="w-full h-11 px-3 rounded-lg bg-muted/50 border border-white/10 text-foreground" placeholder="https://..." value={promoLink} onChange={(e) => setPromoLink(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={addPromotion} className="h-11 px-6 rounded-lg bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta text-background">Adaugă</button>
          </div>
        </div>

        <div className="glass-card p-6">
          {promotions.length === 0 ? (
            <p className="text-muted-foreground">Nu există promoții.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((p) => (
                <div key={p.id} className="glass-card p-4">
                  <div className="font-display text-lg text-foreground">{p.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{[p.date, p.location].filter(Boolean).join(" • ")}</div>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-neon-cyan mt-2 inline-block">Detalii</a>
                  )}
                  <div className="flex justify-end mt-3">
                    <button onClick={() => removePromotion(p.id)} className="px-3 py-1 rounded-md border border-white/10 text-muted-foreground hover:text-neon-magenta">Șterge</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <h1 className="font-display text-3xl mt-10 mb-6">Galerie Socială</h1>
        <div className="glass-card p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Platformă</label>
              <select className="w-full h-11 px-3 rounded-lg bg-muted/50 border border-white/10 text-foreground" value={platform} onChange={(e) => setPlatform(e.target.value as "tiktok" | "instagram")}>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-muted-foreground mb-2">URL postare</label>
              <div className="flex gap-3">
                <input className="flex-1 h-11 px-3 rounded-lg bg-muted/50 border border-white/10 text-foreground" placeholder="https://www.tiktok.com/... sau https://www.instagram.com/p/..." value={postUrl} onChange={(e) => setPostUrl(e.target.value)} />
                <button onClick={addSocialItem} className="h-11 px-6 rounded-lg bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta text-background">Adaugă</button>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          {gallery.length === 0 ? (
            <p className="text-muted-foreground">Nu există elemente în galerie.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
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
                  <div className="flex justify-end mt-3">
                    <button onClick={() => removeSocialItem(item.id)} className="px-3 py-1 rounded-md border border-white/10 text-muted-foreground hover:text-neon-magenta">Șterge</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
