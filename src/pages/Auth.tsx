import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate("/admin");
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin");
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (data.session) {
          toast({ title: "Cont creat", description: "Bun venit!" });
          navigate("/admin");
        } else {
          toast({ title: "Cont creat", description: "Verifică emailul pentru confirmare sau autentifică-te." });
          setMode("login");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/admin");
      }
    } catch (err: any) {
      toast({ title: "Eroare", description: err.message || "Încearcă din nou.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="luxury-card p-8 w-full max-w-md">
        <h1 className="font-display text-3xl mb-2 gold-text">Administrator</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {mode === "login" ? "Autentifică-te pentru acces." : "Creează contul de admin (primul cont primește automat rol admin)."}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            className="w-full h-11 px-3 rounded-lg bg-muted/50 border border-gold/20 text-foreground"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            minLength={6}
            className="w-full h-11 px-3 rounded-lg bg-muted/50 border border-gold/20 text-foreground"
            placeholder="Parolă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-gradient-to-r from-gold to-champagne text-background font-medium disabled:opacity-50"
          >
            {loading ? "..." : mode === "login" ? "Autentificare" : "Creează cont"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 text-sm text-gold hover:underline w-full text-center"
        >
          {mode === "login" ? "Nu ai cont? Creează-l" : "Ai deja cont? Autentifică-te"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
