import { AlertTriangle, Droplets, Layers3, MapPin, Phone, Thermometer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRegionContent, Language, Region, RegionId, uiLabels } from "@/data/krishiMysuru";

const phPosition = (ph: number) => `${Math.min(100, Math.max(0, ((ph - 4) / 6) * 100))}%`;
const cropScores = [
  { match: 73, profit: 71 },
  { match: 92, profit: 89 },
  { match: 86, profit: 82 },
  { match: 78, profit: 76 },
];

const cropIcons: Record<string, string> = {
  "अदरक": "🫚",
  "अनार": "🍎",
  "आलू": "🥔",
  "इलायची": "🌿",
  "कपास": "☁️",
  "काली मिर्च": "🫑",
  "केला": "🍌",
  "कॉफी": "☕",
  "गन्ना": "🎋",
  "चमेली": "🌼",
  "टमाटर": "🍅",
  "धान": "🌾",
  "नारियल": "🥥",
  "बैंगन": "🍆",
  "मक्का": "🌽",
  "मिर्च": "🌶️",
  "मूली": "🥕",
  "मेथी": "🌿",
  "शहतूत": "🫐",
  "सूरजमुखी": "🌻",
  "हल्दी": "🫚",
  banana: "🍌",
  beans: "🫛",
  brinjal: "🍆",
  cardamom: "🌿",
  chilli: "🌶️",
  coconut: "🥥",
  coffee: "☕",
  cotton: "☁️",
  ginger: "🫚",
  herbs: "🌿",
  jasmine: "🌼",
  maize: "🌽",
  marigold: "🌼",
  methi: "🌿",
  microgreens: "🌱",
  millets: "🌾",
  moringa: "🌿",
  mulberry: "🫐",
  "organic salads": "🥗",
  paddy: "🌾",
  palak: "🥬",
  papaya: "🥭",
  pepper: "🫑",
  pomegranate: "🍎",
  potato: "🥔",
  radish: "🥕",
  sandalwood: "🌳",
  shrubs: "🌳",
  sugarcane: "🎋",
  sunflowers: "🌻",
  tobacco: "🍃",
  tomato: "🍅",
  turmeric: "🫚",
  "ಅರಿಶಿನ": "🫚",
  "ಆಲೂಗಡ್ಡೆ": "🥔",
  "ಏಲಕ್ಕಿ": "🌿",
  "ಕಬ್ಬು": "🎋",
  "ಕಾಫಿ": "☕",
  "ತೆಂಗು": "🥥",
  "ಟೊಮೆಟೊ": "🍅",
  "ಭತ್ತ": "🌾",
  "ಬಾಳೆ": "🍌",
  "ಮೆಣಸಿನಕಾಯಿ": "🌶️",
  "ಮೆಕ್ಕೆಜೋಳ": "🌽",
  "ಶುಂಠಿ": "🫚",
};

const getCropIcon = (crop: string) => cropIcons[crop.toLowerCase()] ?? "🌱";

export function FieldIntelligencePanel({ region, regionId, language, isExpanded, onToggle }: { region: Region; regionId: RegionId; language: Language; isExpanded?: boolean; onToggle?: () => void }) {
  const labels = uiLabels[language];
  const localized = getRegionContent(region, regionId, language);
  const isAcidic = region.ph < 6;

  return (
    <aside className={`absolute bottom-0 left-0 right-0 z-[820] overflow-y-auto rounded-t-lg border border-glass-border bg-glass/94 p-4 text-glass-foreground shadow-glass backdrop-blur-panel animate-sheet-in md:bottom-6 md:left-auto md:right-6 md:top-6 md:max-h-[calc(100%-3rem)] md:w-[410px] md:rounded-lg md:p-5 md:animate-panel-in ${isExpanded ? "max-h-[72vh]" : "max-h-[148px]"}`}>
      <button className="mx-auto mb-3 block h-1.5 w-16 rounded-full bg-muted-foreground/45 md:hidden" aria-label="Toggle field information" type="button" onClick={onToggle} />
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
            <MapPin className="size-5" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate font-display text-2xl font-black leading-tight">{localized.name}</h2>
            <p className="text-sm font-semibold text-muted-foreground">Field Intelligence</p>
          </div>
        </div>
        <button className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Close panel" type="button" onClick={onToggle}>
          <X className="size-5" />
        </button>
      </div>

      <div className={isExpanded ? "block" : "hidden md:block"}>

      {isAcidic && (
        <div className="mb-5 flex gap-3 rounded-lg bg-warning p-4 text-warning-foreground shadow-control">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <p className="text-sm font-semibold leading-snug">{localized.tip}</p>
        </div>
      )}

      <div className="rounded-lg border border-glass-border bg-card/74 p-4 shadow-control">
        <div className="mb-3 flex items-center justify-between gap-3 font-bold">
          <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">pH Level</span>
          <span className="font-display text-xl font-black">{region.ph.toFixed(1)}</span>
        </div>
        <div className="relative h-4 rounded-full bg-gradient-to-r from-warning via-success to-accent">
          <div className="absolute -top-1 size-6 -translate-x-1/2 rounded-full border-2 border-card bg-background shadow-control" style={{ left: phPosition(region.ph) }} />
        </div>
        <div className="mt-3 flex justify-between text-[11px] font-semibold text-muted-foreground">
          <span>Acidic</span><span>Neutral</span><span>Alkaline</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-4 rounded-lg border border-glass-border bg-card/74 p-4 shadow-control transition-transform hover:-translate-y-0.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-warning/12 text-warning"><Thermometer className="size-5" /></div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">{labels.temp}</p>
            <p className="text-lg font-black">{region.temp}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-lg border border-glass-border bg-card/74 p-4 shadow-control transition-transform hover:-translate-y-0.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary"><Droplets className="size-5" /></div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">{labels.hum}</p>
            <p className="text-lg font-black">{region.hum}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-lg border border-glass-border bg-card/74 p-4 shadow-control">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-accent/14 text-accent"><Layers3 className="size-5" /></div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">{labels.soil}</p>
          <p className="truncate text-base font-black">{localized.soil}</p>
        </div>
      </div>

      {!isAcidic && (
        <div className="mt-4 rounded-lg border border-glass-border bg-card/74 p-4 shadow-control">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 shrink-0">💡</span>
            <p className="text-sm font-semibold italic leading-snug text-muted-foreground">{localized.tip}</p>
          </div>
        </div>
      )}

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">{labels.recommend}</h3>
        </div>
        <div className="grid gap-3">
          {localized.crops.map((crop, index) => (
            <div key={crop} className="rounded-lg border border-glass-border bg-card/74 p-4 shadow-control transition-transform hover:translate-x-1">
              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-2xl">{getCropIcon(crop)}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black">{crop}</p>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-muted-foreground"><span>Match</span><span className="text-primary">{cropScores[index]?.match ?? 78}%</span></div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${cropScores[index]?.match ?? 78}%` }} /></div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-muted-foreground"><span>Profit</span><span className="text-accent">{cropScores[index]?.profit ?? 76}%</span></div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-accent" style={{ width: `${cropScores[index]?.profit ?? 76}%` }} /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button variant="field" className="mt-5 w-full uppercase tracking-[0.04em]"><Phone className="size-4" />{labels.call}</Button>
      </div>
    </aside>
  );
}
