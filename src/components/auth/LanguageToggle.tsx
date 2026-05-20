import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/hooks/useLang";

export function LanguageToggle() {
  const { toggle, t } = useLang();
  return (
    <Button variant="glass" size="sm" onClick={toggle} className="gap-2">
      <Languages className="h-4 w-4" />
      {t("lang.toggle")}
    </Button>
  );
}
