import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LanguageToggle } from "@/components/auth/LanguageToggle";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/hooks/useLang";
import { supabase } from "@/integrations/supabase/client";
import { Search, MapPin, IndianRupee, Clock, LogOut, HardHat } from "lucide-react";

const DEMO_JOBS = [
  { id: 1, title: "Sugarcane Harvesting", village: "Hunsur", distance: "4 km", pay: 650, hours: "6:00 AM – 2:00 PM", skill: "harvesting" },
  { id: 2, title: "Paddy Sowing Crew", village: "Periyapatna", distance: "9 km", pay: 550, hours: "7:00 AM – 3:00 PM", skill: "sowing" },
  { id: 3, title: "Tractor Operator (Plough)", village: "T. Narsipur", distance: "12 km", pay: 900, hours: "Full day", skill: "machine_operator" },
  { id: 4, title: "Loading – Vegetable Mandi", village: "Mysuru APMC", distance: "3 km", pay: 700, hours: "5:00 AM – 11:00 AM", skill: "loading" },
];

export default function WorkFeed() {
  const { user, loading, signOut } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/welcome", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("labourer_skills").select("skill").eq("user_id", user.id)
      .then(({ data }) => setSkills((data ?? []).map((r: any) => r.skill)));
  }, [user]);

  const matched = skills.length
    ? DEMO_JOBS.filter((j) => skills.includes(j.skill))
    : DEMO_JOBS;

  const handleLogout = async () => {
    await signOut();
    navigate("/welcome", { replace: true });
  };

  return (
    <div className="min-h-svh bg-gradient-to-br from-background via-background to-earth/10">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <div className="flex items-center gap-2 text-earth">
          <HardHat className="h-6 w-6" />
          <span className="font-semibold">{t("app.title")}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Button variant="glass" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> {t("logout")}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-12">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-earth text-earth-foreground shadow-marker">
            <Search className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{t("feed.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("feed.sub")}</p>
          </div>
        </div>

        <div className="space-y-3">
          {matched.map((j) => (
            <div key={j.id} className="rounded-2xl border-2 border-earth/20 bg-card p-5 shadow-control lift-btn">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{j.title}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {j.village} · {j.distance}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-primary/15 text-primary capitalize">
                  {j.skill.replace("_", " ")}
                </Badge>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-sm">
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                    <IndianRupee className="h-4 w-4" />{j.pay}/day
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />{j.hours}
                  </span>
                </div>
                <Button size="sm" className="rounded-xl lift-btn">Apply</Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
