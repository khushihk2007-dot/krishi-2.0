import { Link } from "react-router-dom";
import { Sprout, ShoppingBasket, HardHat, ArrowRight } from "lucide-react";
import { LanguageToggle } from "@/components/auth/LanguageToggle";
import { useLang } from "@/hooks/useLang";
import { cn } from "@/lib/utils";

const roles = [
  {
    to: "/auth/farmer",
    icon: Sprout,
    titleKey: "role.farmer",
    descKey: "role.farmer.desc",
    accent: "from-primary/15 to-primary/5",
    iconBg: "bg-primary text-primary-foreground",
  },
  {
    to: "/auth/buyer",
    icon: ShoppingBasket,
    titleKey: "role.buyer",
    descKey: "role.buyer.desc",
    accent: "from-accent/25 to-accent/5",
    iconBg: "bg-accent text-accent-foreground",
  },
  {
    to: "/auth/labourer",
    icon: HardHat,
    titleKey: "role.labourer",
    descKey: "role.labourer.desc",
    accent: "from-earth/25 to-earth/5",
    iconBg: "bg-earth text-earth-foreground",
  },
] as const;

export default function Welcome() {
  const { t } = useLang();
  return (
    <div className="min-h-svh bg-gradient-to-br from-background via-background to-secondary/30">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <div className="flex items-center gap-2 text-primary">
          <Sprout className="h-6 w-6" />
          <span className="font-semibold">{t("app.title")}</span>
        </div>
        <LanguageToggle />
      </header>

      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-16 pt-6 sm:pt-12">
        <h1 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {t("landing.heading")}
        </h1>
        <p className="mt-3 text-center text-base text-muted-foreground sm:text-lg">{t("landing.sub")}</p>

        <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <Link
                key={r.to}
                to={r.to}
                className={cn(
                  "group relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl border border-glass-border bg-gradient-to-br p-6 shadow-glass backdrop-blur-panel lift-btn",
                  r.accent,
                )}
              >
                <span className={cn("flex h-14 w-14 items-center justify-center rounded-xl shadow-control", r.iconBg)}>
                  <Icon className="h-7 w-7" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{t(r.titleKey as any)}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{t(r.descKey as any)}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
