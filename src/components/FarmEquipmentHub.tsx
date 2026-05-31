import React, { useState, useMemo } from "react";
import { Search, ExternalLink, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  equipmentList,
  rentalPlatforms,
  EQUIPMENT_TYPES,
  EQUIPMENT_DISTRICTS,
  EQUIPMENT_TALUKS,
  type FarmEquipment,
} from "@/data/equipmentData";

interface FarmEquipmentHubProps {
  language: "en" | "kn" | "hi";
}

const labels = {
  en: {
    title: "Farm Equipment Rental Hub",
    subtitle: "Rent modern farming equipment at affordable rates from verified third-party platforms.",
    searchPlaceholder: "Search equipment…",
    type: "Equipment Type",
    district: "District",
    taluk: "Taluk",
    budget: "Rental Budget",
    all: "All",
    available: "Available",
    limited: "Limited",
    unavailable: "Unavailable",
    rentNow: "Rent Now",
    priceLabel: "Rental Rate",
    disclaimer: "Equipment rentals are provided by third-party platforms. Krishi-Mysuru does not process rental transactions.",
    noResults: "No equipment matches your filters. Try adjusting your search.",
    budgetLow: "Under ₹600/hr",
    budgetMid: "₹600 – ₹1,500/hr",
    budgetHigh: "Above ₹1,500/hr",
  },
  kn: {
    title: "ಕೃಷಿ ಯಂತ್ರ ಬಾಡಿಗೆ ಕೇಂದ್ರ",
    subtitle: "ಪರಿಶೀಲಿತ ಮೂರನೇ ವ್ಯಕ್ತಿಯ ವೇದಿಕೆಗಳಿಂದ ಕೈಗೆಟುಕುವ ಬೆಲೆಗೆ ಆಧುನಿಕ ಕೃಷಿ ಯಂತ್ರಗಳನ್ನು ಬಾಡಿಗೆಗೆ ಪಡೆಯಿರಿ.",
    searchPlaceholder: "ಯಂತ್ರಗಳನ್ನು ಹುಡುಕಿ…",
    type: "ಯಂತ್ರ ಪ್ರಕಾರ",
    district: "ಜಿಲ್ಲೆ",
    taluk: "ತಾಲೂಕು",
    budget: "ಬಾಡಿಗೆ ಬಜೆಟ್",
    all: "ಎಲ್ಲಾ",
    available: "ಲಭ್ಯವಿದೆ",
    limited: "ಸೀಮಿತ",
    unavailable: "ಲಭ್ಯವಿಲ್ಲ",
    rentNow: "ಈಗ ಬಾಡಿಗೆ",
    priceLabel: "ಬಾಡಿಗೆ ದರ",
    disclaimer: "ಯಂತ್ರ ಬಾಡಿಗೆಗಳನ್ನು ಮೂರನೇ ವ್ಯಕ್ತಿಯ ವೇದಿಕೆಗಳು ಒದಗಿಸುತ್ತವೆ. ಕೃಷಿ-ಮೈಸೂರು ಬಾಡಿಗೆ ವ್ಯವಹಾರಗಳನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುವುದಿಲ್ಲ.",
    noResults: "ನಿಮ್ಮ ಫಿಲ್ಟರ್‌ಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುವ ಯಂತ್ರಗಳಿಲ್ಲ.",
    budgetLow: "₹600/hr ಕೆಳಗೆ",
    budgetMid: "₹600 – ₹1,500/hr",
    budgetHigh: "₹1,500/hr ಮೇಲೆ",
  },
  hi: {
    title: "कृषि उपकरण किराया केंद्र",
    subtitle: "सत्यापित तृतीय-पक्ष प्लेटफ़ॉर्म से किफायती दरों पर आधुनिक कृषि उपकरण किराए पर लें।",
    searchPlaceholder: "उपकरण खोजें…",
    type: "उपकरण प्रकार",
    district: "जिला",
    taluk: "तालुक",
    budget: "किराया बजट",
    all: "सभी",
    available: "उपलब्ध",
    limited: "सीमित",
    unavailable: "अनुपलब्ध",
    rentNow: "अभी किराए पर लें",
    priceLabel: "किराया दर",
    disclaimer: "उपकरण किराया तृतीय-पक्ष प्लेटफ़ॉर्म द्वारा प्रदान किया जाता है। कृषि-मैसूरु किराया लेनदेन प्रोसेस नहीं करता।",
    noResults: "आपके फ़िल्टर से कोई उपकरण मेल नहीं खाता।",
    budgetLow: "₹600/hr से कम",
    budgetMid: "₹600 – ₹1,500/hr",
    budgetHigh: "₹1,500/hr से ऊपर",
  },
} as const;

const AvailabilityBadge = ({
  status,
  lang,
}: {
  status: FarmEquipment["availability"];
  lang: "en" | "kn" | "hi";
}) => {
  const l = labels[lang];
  if (status === "available")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#2E7D32]/10 px-2.5 py-1 text-xs font-black text-[#2E7D32]">
        <CheckCircle className="size-3" /> {l.available}
      </span>
    );
  if (status === "limited")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-black text-amber-600">
        <Clock className="size-3" /> {l.limited}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-black text-red-600">
      {l.unavailable}
    </span>
  );
};

export const FarmEquipmentHub: React.FC<FarmEquipmentHubProps> = ({ language }) => {
  const l = labels[language];
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [talukFilter, setTalukFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");

  const filtered = useMemo(() => {
    return equipmentList.filter((eq) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const nameMatch = eq.name[language].toLowerCase().includes(q);
        const descMatch = eq.description[language].toLowerCase().includes(q);
        if (!nameMatch && !descMatch) return false;
      }
      // Type
      if (typeFilter !== "all" && eq.type !== typeFilter) return false;
      // District
      if (districtFilter !== "all" && !eq.districts.includes(districtFilter)) return false;
      // Taluk
      if (talukFilter !== "all" && !eq.taluks.includes(talukFilter)) return false;
      // Budget
      if (budgetFilter !== "all" && eq.budgetTier !== budgetFilter) return false;
      return true;
    });
  }, [search, typeFilter, districtFilter, talukFilter, budgetFilter, language]);

  const handleRent = (eq: FarmEquipment) => {
    const url = rentalPlatforms[eq.id] || rentalPlatforms.default;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-[1.5rem] border border-glass-border bg-card/88 p-5 shadow-control backdrop-blur-panel">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-black text-primary flex items-center gap-2">
              🚜 {l.title}
            </h2>
            <p className="text-sm font-bold text-muted-foreground mt-1 max-w-xl">
              {l.subtitle}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <label className="relative lg:col-span-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={l.searchPlaceholder}
              className="h-11 w-full rounded-full border border-input bg-background pl-10 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          {/* Equipment Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-11 rounded-full border border-input bg-background px-4 text-sm font-bold"
          >
            <option value="all">{l.type}: {l.all}</option>
            {EQUIPMENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* District */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="h-11 rounded-full border border-input bg-background px-4 text-sm font-bold"
          >
            <option value="all">{l.district}: {l.all}</option>
            {EQUIPMENT_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Taluk */}
          <select
            value={talukFilter}
            onChange={(e) => setTalukFilter(e.target.value)}
            className="h-11 rounded-full border border-input bg-background px-4 text-sm font-bold"
          >
            <option value="all">{l.taluk}: {l.all}</option>
            {EQUIPMENT_TALUKS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Budget */}
          <select
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
            className="h-11 rounded-full border border-input bg-background px-4 text-sm font-bold"
          >
            <option value="all">{l.budget}: {l.all}</option>
            <option value="low">{l.budgetLow}</option>
            <option value="mid">{l.budgetMid}</option>
            <option value="high">{l.budgetHigh}</option>
          </select>
        </div>
      </div>

      {/* Equipment Grid */}
      {filtered.length === 0 ? (
        <p className="col-span-full rounded-2xl border border-dashed border-glass-border bg-card/60 p-6 text-center text-sm font-bold text-muted-foreground">
          {l.noResults}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((eq) => (
            <article
              key={eq.id}
              className="flex flex-col rounded-[1.5rem] border border-glass-border bg-card p-5 shadow-control transition-shadow hover:shadow-glass group"
            >
              {/* Icon + Name + Badge */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-secondary/45 text-3xl shadow-control group-hover:scale-105 transition-transform">
                    {eq.icon}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-black leading-tight">
                      {eq.name[language]}
                    </h3>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                      {eq.type}
                    </p>
                  </div>
                </div>
                <AvailabilityBadge status={eq.availability} lang={language} />
              </div>

              {/* Description */}
              <p className="text-sm font-bold text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                {eq.description[language]}
              </p>

              {/* Price Card */}
              <div className="rounded-2xl bg-secondary/25 p-4 text-center mb-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  {l.priceLabel}
                </p>
                <p className="font-display text-xl font-black text-primary mt-1">
                  {eq.priceRange}
                </p>
              </div>

              {/* Districts & Taluks */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {eq.districts.map((d) => (
                  <span
                    key={d}
                    className="inline-flex rounded-full bg-card border border-glass-border/50 px-2.5 py-0.5 text-[10px] font-black text-primary shadow-sm"
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Rent Now Button */}
              <div className="mt-auto">
                <Button
                  variant="field"
                  className="w-full rounded-full font-black text-base"
                  onClick={() => handleRent(eq)}
                  disabled={eq.availability === "unavailable"}
                >
                  <ExternalLink className="mr-2 size-4" />
                  {l.rentNow}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
        <AlertTriangle className="size-5 shrink-0 text-amber-600 mt-0.5" />
        <p className="text-xs font-bold text-amber-800 leading-relaxed">
          {l.disclaimer}
        </p>
      </div>
    </div>
  );
};
