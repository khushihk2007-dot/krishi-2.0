import { useEffect, useState, useCallback } from "react";
import { dict, type Lang, type DictKey } from "@/lib/i18n";

const KEY = "krishi.lang";

export function useLang() {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem(KEY) as Lang) || "en";
  });

  useEffect(() => {
    localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(() => setLangState((l) => (l === "en" ? "kn" : "en")), []);
  const t = useCallback((k: DictKey) => dict[lang][k] ?? k, [lang]);

  return { lang, setLang, toggle, t };
}
