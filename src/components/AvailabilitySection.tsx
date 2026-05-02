import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ro } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import { supabase } from "@/integrations/supabase/client";

type Status = "free" | "occupied" | "unavailable";

type AvailabilityMap = Record<string, Status>; // key: YYYY-MM-DD

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

const AvailabilitySection = () => {
  const [month, setMonth] = useState<Date>(new Date());
  const [availability, setAvailability] = useState<AvailabilityMap>({});

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("availability").select("date,status");
      const map: AvailabilityMap = {};
      (data || []).forEach((r: any) => { map[r.date] = r.status; });
      setAvailability(map);
    })();
  }, []);

  const { freeDates, occupiedDates, unavailableDates } = useMemo(() => {
    const days = getMonthDays(month);
    const free: Date[] = [];
    const occupied: Date[] = [];
    const unavailable: Date[] = [];

    for (const d of days) {
      const key = toISODate(d);
      const dow = d.getDay(); // 0=Sun 1=Mon ... 6=Sat
      const override = availability[key];

      const defaultStatus: Status = dow >= 1 && dow <= 4 ? "unavailable" : "free"; // L–J indisponibil, V–S–D liber
      const finalStatus = override ?? defaultStatus;
      if (finalStatus === "occupied") occupied.push(d);
      else if (finalStatus === "unavailable") unavailable.push(d);
      else free.push(d);
    }
    return { freeDates: free, occupiedDates: occupied, unavailableDates: unavailable };
  }, [month, availability]);

  return (
    <section id="availability" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="font-display text-sm tracking-widest text-neon-cyan uppercase">Disponibilitate</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-4">
            <span className="text-foreground">Calendar</span>{" "}
            <span className="gradient-text">Evenimente</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            🟢 liber (V–S–D) • 🔴 ocupat • ⚪ indisponibil (L–J) — rezervarea se confirmă după mesajul tău cu locație & oră.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <a
              href="https://wa.me/40755649856"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 transition"
            >
              Rezervă pe WhatsApp
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 text-accent hover:bg-accent/10 transition"
            >
              Formular de contact
            </a>
          </div>
        </div>

        <div className="glass-card p-6">
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
            modifiers={{
              free: freeDates,
              occupied: occupiedDates,
              unavailable: unavailableDates,
            }}
            modifiersClassNames={{
              free: "bg-green-500 text-background",
              occupied: "bg-red-500 text-background",
              unavailable: "bg-white text-background",
            }}
            className="rdp text-sm"
          />

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Notă: rezervarea se confirmă după mesajul tău cu locație & oră.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AvailabilitySection;
