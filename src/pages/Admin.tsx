import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ro } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Status = "free" | "occupied" | "unavailable";
type AvailabilityMap = Record<string, Status>;
type SocialItem = { id: string; platform: "tiktok" | "instagram"; url: string };
type PromoItem = { id: string; title: string; date?: string | null; location?: string | null; link?: string | null };

const isValidTikTokUrl = (url: string) => /\/video\/\d+/.test(url);
const isValidInstagramUrl = (url: string) => /\/p\//.test(url) || /\/reel\//.test(url);
const extractTikTokVideoId = (url: string) => url.match(/video\/(\d+)/)?.[1];

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

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [month, setMonth] = useState<Date>(new Date());
  const [availability, setAvailability] = useState<AvailabilityMap>({});
  const [status, setStatus] = useState<Status>("occupied");
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const [gallery, setGallery] = useState<SocialItem[]>([]);
  const [platform, setPlatform] = useState<"tiktok" | "instagram">("tiktok");
  const [postUrl, setPostUrl] = useState("");

  const [promotions, setPromotions] = useState<PromoItem[]>([]);
  const [promoTitle, setPromoTitle] = useState("");
  const [promoDate, setPromoDate] = useState("");
  const [promoLocation, setPromoLocation] = useState("");
  const [promoLink, setPromoLink] = useState("");

  const [newPassword, setNewPassword] = useState("");

  // Auth check
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) {
        navigate("/auth");
      }
    });
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/auth");
        return;
      }
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (roleError) console.error("Role check error:", roleError);
      setIsAdmin(!!roleData);
      setAuthChecked(true);
    })();
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  // Load data
  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const [a, g, p] = await Promise.all([
        supabase.from("availability").select("*"),
        supabase.from("gallery_items").select("*").order("created_at", { ascending: true }),
        supabase.from("promotions").select("*").order("created_at", { ascending: true }),
      ]);
      const map: AvailabilityMap = {};
      (a.data || []).forEach((r: any) => { map[r.date] = r.status; });
      setAvailability(map);
      setGallery((g.data || []).map((r: any) => ({ id: r.id, platform: r.platform, url: r.url })));
      setPromotions((p.data || []).map((r: any) => ({ id: r.id, title: r.title, date: r.date, location: r.location, link: r.link })));
    })();
  }, [isAdmin]);

  useEffect(() => {
    const ensure = (src: string) => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const s = document.createElement("script");
        s.async = true; s.src = src; document.body.appendChild(s);
      }
    };
    ensure("https://www.instagram.com/embed.js");
    ensure("https://www.tiktok.com/embed.js");
    setTimeout(() => {
      // @ts-expect-error
      if (window.instgrm?.Embeds?.process) window.instgrm.Embeds.process();
    }, 0);
  }, [gallery]);

  const entries = useMemo(() => Object.entries(availability).sort(([a],[b]) => a.localeCompare(b)), [availability]);

  const { freeDates, occupiedDates, unavailableDates } = useMemo(() => {
    const days = getMonthDays(month);
    const free: Date[] = [], occupied: Date[] = [], unavailable: Date[] = [];
    for (const d of days) {
      const key = toISODate(d);
      const dow = d.getDay();
      const def: Status = dow >= 1 && dow <= 4 ? "unavailable" : "free";
      const final = availability[key] ?? def;
      if (final === "occupied") occupied.push(d);
      else if (final === "unavailable") unavailable.push(d);
      else free.push(d);
    }
    return { freeDates: free, occupiedDates: occupied, unavailableDates: unavailable };
  }, [month, availability]);

  async function setDayStatus(d: Date, st: Status) {
    const iso = toISODate(d);
    const { error } = await supabase
      .from("availability")
      .upsert({ date: iso, status: st, updated_at: new Date().toISOString() }, { onConflict: "date" });
    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }
    setAvailability({ ...availability, [iso]: st });
    toast({ title: "Salvat", description: `${iso} → ${st}` });
  }

  async function removeEntry(iso: string) {
    const { error } = await supabase.from("availability").delete().eq("date", iso);
    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }
    const next = { ...availability };
    delete next[iso];
    setAvailability(next);
    toast({ title: "Șters", description: iso });
  }

  function handleDayClick(d: Date) {
    if (bulkMode) {
      const iso = toISODate(d);
      setSelectedDates((prev) =>
        prev.find((x) => toISODate(x) === iso)
          ? prev.filter((x) => toISODate(x) !== iso)
          : [...prev, d]
      );
    } else {
      setDayStatus(d, status);
    }
  }

  async function applyBulkStatus(st: Status) {
    if (selectedDates.length === 0) {
      toast({ title: "Nicio zi selectată", variant: "destructive" });
      return;
    }
    const rows = selectedDates.map((d) => ({
      date: toISODate(d),
      status: st,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from("availability").upsert(rows, { onConflict: "date" });
    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }
    const next = { ...availability };
    rows.forEach((r) => { next[r.date] = r.status as Status; });
    setAvailability(next);
    setSelectedDates([]);
    toast({ title: "Salvat", description: `${rows.length} zile → ${st}` });
  }

  async function clearBulkSelection() {
    if (selectedDates.length === 0) return;
    const isos = selectedDates.map(toISODate);
    const { error } = await supabase.from("availability").delete().in("date", isos);
    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }
    const next = { ...availability };
    isos.forEach((iso) => { delete next[iso]; });
    setAvailability(next);
    setSelectedDates([]);
    toast({ title: "Resetat", description: `${isos.length} zile la implicit` });
  }

  async function resetMonth() {
    const days = getMonthDays(month);
    const isos = days.map(toISODate).filter((iso) => availability[iso] !== undefined);
    if (isos.length === 0) {
      toast({ title: "Nimic de resetat în luna curentă" });
      return;
    }
    const { error } = await supabase.from("availability").delete().in("date", isos);
    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }
    const next = { ...availability };
    isos.forEach((iso) => { delete next[iso]; });
    setAvailability(next);
    toast({ title: "Luna resetată", description: `${isos.length} zile șterse` });
  }

  async function setRangeStatus(st: Status, days: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rows: { date: string; status: Status; updated_at: string }[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      rows.push({ date: toISODate(d), status: st, updated_at: new Date().toISOString() });
    }
    const { error } = await supabase.from("availability").upsert(rows, { onConflict: "date" });
    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }
    const next = { ...availability };
    rows.forEach((r) => { next[r.date] = r.status; });
    setAvailability(next);
    toast({ title: "Salvat", description: `Următoarele ${days} zile → ${st}` });
  }

  async function addSocialItem() {
    const url = postUrl.trim();
    if (!url) return;
    if (platform === "tiktok" && !isValidTikTokUrl(url)) {
      toast({ title: "TikTok nevalid", description: "Folosește linkul cu /video/ID.", variant: "destructive" });
      return;
    }
    if (platform === "instagram" && !isValidInstagramUrl(url)) {
      toast({ title: "Instagram nevalid", description: "Folosește link /p/ sau /reel/.", variant: "destructive" });
      return;
    }
    const { data, error } = await supabase
      .from("gallery_items")
      .insert({ platform, url })
      .select()
      .single();
    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }
    setGallery([...gallery, { id: data.id, platform: data.platform as any, url: data.url }]);
    setPostUrl("");
    toast({ title: "Adăugat" });
  }

  async function removeSocialItem(id: string) {
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }
    setGallery(gallery.filter((g) => g.id !== id));
  }

  async function addPromotion() {
    const t = promoTitle.trim();
    if (!t) {
      toast({ title: "Titlu lipsă", variant: "destructive" });
      return;
    }
    const { data, error } = await supabase
      .from("promotions")
      .insert({
        title: t,
        date: promoDate || null,
        location: promoLocation.trim() || null,
        link: promoLink.trim() || null,
      })
      .select()
      .single();
    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }
    setPromotions([...promotions, data as any]);
    setPromoTitle(""); setPromoDate(""); setPromoLocation(""); setPromoLink("");
    toast({ title: "Promo adăugat" });
  }

  async function removePromotion(id: string) {
    const { error } = await supabase.from("promotions").delete().eq("id", id);
    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }
    setPromotions(promotions.filter((p) => p.id !== id));
  }

  async function changePassword() {
    if (!newPassword || newPassword.length < 6) {
      toast({ title: "Parolă prea scurtă", description: "Minim 6 caractere.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }
    setNewPassword("");
    toast({ title: "Parolă schimbată" });
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate("/auth");
  }

  if (!authChecked) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Se încarcă...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="luxury-card p-8 max-w-md text-center">
          <h1 className="font-display text-2xl gold-text mb-3">Acces interzis</h1>
          <p className="text-muted-foreground mb-4">Contul tău nu are rol de administrator.</p>
          <button onClick={logout} className="px-6 py-2 rounded-lg border border-gold/30 text-gold">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl gold-text">Panou Administrator</h1>
          <button onClick={logout} className="px-4 py-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10">Logout</button>
        </div>

        {/* Schimbare parolă */}
        <div className="luxury-card p-6 mb-8">
          <h2 className="font-display text-xl mb-4 gold-text">Schimbă parola</h2>
          <div className="flex gap-3">
            <input
              type="password"
              placeholder="Parolă nouă (min 6)"
              className="flex-1 h-11 px-3 rounded-lg bg-muted/50 border border-gold/20 text-foreground"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={changePassword} className="h-11 px-6 rounded-lg bg-gradient-to-r from-gold to-champagne text-background font-medium">Salvează</button>
          </div>
        </div>

        {/* Disponibilitate */}
        <h2 className="font-display text-2xl gold-text mb-4">Disponibilitate</h2>
        <div className="luxury-card p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <button className="px-4 py-2 rounded-full border border-gold/20 hover:border-gold/40" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>← Anterior</button>
            <div className="font-display text-lg">{month.toLocaleString("ro-RO", { month: "long", year: "numeric" })}</div>
            <button className="px-4 py-2 rounded-full border border-gold/20 hover:border-gold/40" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>Următor →</button>
          </div>

          <div className="mb-3 flex gap-2 flex-wrap items-center">
            <span className="text-sm text-muted-foreground">Status implicit:</span>
            {(["free","occupied","unavailable"] as Status[]).map((s) => (
              <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1 rounded-full text-sm border ${status===s ? "border-gold bg-gold/20 text-gold" : "border-gold/20 text-muted-foreground"}`}>
                {s === "free" ? "🟢 liber" : s === "occupied" ? "🔴 ocupat" : "⚪ indisponibil"}
              </button>
            ))}
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => { setBulkMode(!bulkMode); setSelectedDates([]); }}
                className={`px-3 py-1 rounded-full text-sm border ${bulkMode ? "border-gold bg-gold/20 text-gold" : "border-gold/20 text-muted-foreground"}`}
              >
                {bulkMode ? "✓ Mod bulk activ" : "Activează bulk"}
              </button>
              <button onClick={resetMonth} className="px-3 py-1 rounded-full text-sm border border-bronze/40 text-bronze hover:bg-bronze/10">
                Reset luna
              </button>
            </div>
          </div>

          {bulkMode && (
            <div className="mb-3 p-3 rounded-lg bg-gold/5 border border-gold/20 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gold">{selectedDates.length} zi(le) selectate.</span>
              <span className="text-xs text-muted-foreground">Aplică:</span>
              <button onClick={() => applyBulkStatus("free")} className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400 border border-green-500/30">🟢 liber</button>
              <button onClick={() => applyBulkStatus("occupied")} className="px-3 py-1 rounded-full text-sm bg-red-500/20 text-red-400 border border-red-500/30">🔴 ocupat</button>
              <button onClick={() => applyBulkStatus("unavailable")} className="px-3 py-1 rounded-full text-sm bg-white/10 text-white border border-white/20">⚪ indisponibil</button>
              <button onClick={clearBulkSelection} className="px-3 py-1 rounded-full text-sm border border-bronze/40 text-bronze">Reset selecție la implicit</button>
              <button onClick={() => setSelectedDates([])} className="px-3 py-1 rounded-full text-sm border border-gold/20 text-muted-foreground">Anulează</button>
            </div>
          )}

          <div className="mb-3 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground">Acțiuni rapide:</span>
            <button onClick={() => setRangeStatus("occupied", 7)} className="px-3 py-1 rounded-full text-xs border border-gold/20 hover:bg-gold/10">Ocupă următoarele 7 zile</button>
            <button onClick={() => setRangeStatus("occupied", 14)} className="px-3 py-1 rounded-full text-xs border border-gold/20 hover:bg-gold/10">Ocupă următoarele 14 zile</button>
            <button onClick={() => setRangeStatus("free", 7)} className="px-3 py-1 rounded-full text-xs border border-gold/20 hover:bg-gold/10">Liber 7 zile</button>
          </div>

          <DayPicker
            mode={bulkMode ? "multiple" : undefined as any}
            selected={bulkMode ? selectedDates : undefined}
            month={month}
            onMonthChange={setMonth}
            locale={ro}
            modifiers={{ free: freeDates, occupied: occupiedDates, unavailable: unavailableDates }}
            modifiersClassNames={{
              free: "bg-green-500 text-background",
              occupied: "bg-red-500 text-background",
              unavailable: "bg-white text-background",
            }}
            onDayClick={handleDayClick}
            className="rdp text-sm"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            {bulkMode
              ? "Click pe zile pentru a le selecta/deselecta, apoi aplică un status în masă."
              : "Click pe o zi pentru a-i seta statusul implicit ales mai sus."}
          </p>
        </div>

        <div className="luxury-card p-6 mb-10">
          <h3 className="font-display text-lg gold-text mb-3">Zile setate manual</h3>
          {entries.length === 0 ? (
            <p className="text-muted-foreground">Nu există zile setate.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {entries.map(([iso, st]) => (
                <div key={iso} className="flex items-center justify-between rounded-lg bg-muted/30 border border-gold/10 px-4 py-2">
                  <div className="font-mono text-sm">{iso}</div>
                  <div className="text-sm capitalize">{st}</div>
                  <button onClick={() => removeEntry(iso)} className="text-bronze hover:text-gold text-sm">Șterge</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Promoții */}
        <h2 className="font-display text-2xl gold-text mb-4">Promo Evenimente</h2>
        <div className="luxury-card p-6 mb-4">
          <div className="grid md:grid-cols-4 gap-4">
            <input className="h-11 px-3 rounded-lg bg-muted/50 border border-gold/20" placeholder="Titlu" value={promoTitle} onChange={(e) => setPromoTitle(e.target.value)} />
            <input type="date" className="h-11 px-3 rounded-lg bg-muted/50 border border-gold/20" value={promoDate} onChange={(e) => setPromoDate(e.target.value)} />
            <input className="h-11 px-3 rounded-lg bg-muted/50 border border-gold/20" placeholder="Locație" value={promoLocation} onChange={(e) => setPromoLocation(e.target.value)} />
            <input className="h-11 px-3 rounded-lg bg-muted/50 border border-gold/20" placeholder="Link" value={promoLink} onChange={(e) => setPromoLink(e.target.value)} />
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={addPromotion} className="h-11 px-6 rounded-lg bg-gradient-to-r from-gold to-champagne text-background font-medium">Adaugă</button>
          </div>
        </div>

        <div className="luxury-card p-6 mb-10">
          {promotions.length === 0 ? (
            <p className="text-muted-foreground">Nu există promoții.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((p) => (
                <div key={p.id} className="rounded-lg bg-muted/30 border border-gold/10 p-4">
                  <div className="font-display text-lg">{p.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{[p.date, p.location].filter(Boolean).join(" • ")}</div>
                  {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-gold mt-2 inline-block">Detalii</a>}
                  <div className="flex justify-end mt-3">
                    <button onClick={() => removePromotion(p.id)} className="text-bronze hover:text-gold text-sm">Șterge</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Galerie */}
        <h2 className="font-display text-2xl gold-text mb-4">Galerie Socială</h2>
        <div className="luxury-card p-6 mb-4">
          <div className="grid md:grid-cols-3 gap-4">
            <select className="h-11 px-3 rounded-lg bg-muted/50 border border-gold/20" value={platform} onChange={(e) => setPlatform(e.target.value as any)}>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
            </select>
            <div className="md:col-span-2 flex gap-3">
              <input className="flex-1 h-11 px-3 rounded-lg bg-muted/50 border border-gold/20" placeholder="URL postare" value={postUrl} onChange={(e) => setPostUrl(e.target.value)} />
              <button onClick={addSocialItem} className="h-11 px-6 rounded-lg bg-gradient-to-r from-gold to-champagne text-background font-medium">Adaugă</button>
            </div>
          </div>
        </div>

        <div className="luxury-card p-6">
          {gallery.length === 0 ? (
            <p className="text-muted-foreground">Galerie goală.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <div key={item.id} className="rounded-lg bg-muted/30 border border-gold/10 p-3">
                  {item.platform === "tiktok" && (
                    <blockquote className="tiktok-embed" cite={item.url} data-video-id={extractTikTokVideoId(item.url) || undefined} style={{ maxWidth: 605, minWidth: 325 }}>
                      <section />
                    </blockquote>
                  )}
                  {item.platform === "instagram" && (
                    <blockquote className="instagram-media" data-instgrm-permalink={item.url} data-instgrm-version="14" />
                  )}
                  <div className="flex justify-end mt-3">
                    <button onClick={() => removeSocialItem(item.id)} className="text-bronze hover:text-gold text-sm">Șterge</button>
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
