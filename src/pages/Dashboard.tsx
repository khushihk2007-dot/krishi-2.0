import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/auth/LanguageToggle";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/hooks/useLang";
import { supabase } from "@/integrations/supabase/client";
import { Sprout, LogOut } from "lucide-react";

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string | null; role: string; district: string | null } | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/welcome", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, role, district").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data as any));
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/welcome", { replace: true });
  };

  return (
    <div className="min-h-svh bg-gradient-to-br from-background via-background to-secondary/30">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <div className="flex items-center gap-2 text-primary">
          <Sprout className="h-6 w-6" />
          <span className="font-semibold">{t("app.title")}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Button variant="glass" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> {t("logout")}
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="glass-card rounded-2xl p-8">
          <h1 className="text-3xl font-bold">{t("dash.title")}{profile?.full_name ? `, ${profile.full_name}` : ""} 👋</h1>
          <p className="mt-2 text-muted-foreground">{t("dash.sub")}</p>
          {profile && (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Stat label="Role" value={profile.role} />
              {profile.district && <Stat label="District" value={profile.district} />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-glass-border bg-background/60 p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold capitalize">{value}</p>
    </div>
  );
}
