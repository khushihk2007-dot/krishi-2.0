import { ReactNode } from "react";
import { LanguageToggle } from "./LanguageToggle";
import { useLang } from "@/hooks/useLang";
import { Sprout } from "lucide-react";
import { Link } from "react-router-dom";

export function AuthShell({ children }: { children: ReactNode }) {
  const { t } = useLang();
  return (
    <div className="min-h-svh w-full bg-gradient-to-br from-background via-background to-secondary/30">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Link to="/welcome" className="flex items-center gap-2 text-primary">
          <Sprout className="h-6 w-6" />
          <span className="font-semibold">{t("app.title")}</span>
        </Link>
        <LanguageToggle />
      </header>
      <main className="flex min-h-[calc(100svh-72px)] items-stretch justify-center px-4 pb-8 sm:items-center">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
