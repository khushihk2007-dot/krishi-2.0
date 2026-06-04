
export interface FarmEquipment {
  id: string;
  icon: string;
  name: Record<"en" | "kn" | "hi", string>;
  description: Record<"en" | "kn" | "hi", string>;
  priceRange: string;
  availability: "available" | "limited" | "unavailable";
  type: string;
  districts: string[];
  taluks: string[];
  budgetTier: "low" | "mid" | "high";
}

export const rentalPlatforms: Record<string, string> = {
  tractor: "https://www.jfarmservices.in/",
  rotavator: "https://www.jfarmservices.in/",
  cultivator: "https://www.jfarmservices.in/",
  seed_drill: "https://www.trringo.com/",
  power_weeder: "https://www.goldfarmgroup.com/",
  sprayer: "https://www.trringo.com/",
  harvester: "https://www.trringo.com/",
  thresher: "https://www.jfarmservices.in/",
  mini_tractor: "https://www.goldfarmgroup.com/",
  drone_sprayer: "https://www.nurture.farm/",
  default: "https://www.jfarmservices.in/",
};

export const equipmentList: FarmEquipment[] = [
  {
    id: "tractor",
    icon: "🚜",
    name: { en: "Tractor", kn: "ಟ್ರಾಕ್ಟರ್", hi: "ट्रैक्टर" },
    description: {
      en: "Heavy-duty tractor for ploughing, tilling and hauling. 35–55 HP range, ideal for medium to large farms.",
      kn: "ಭಾರೀ ಟ್ರಾಕ್ಟರ್ – ಉಳುಮೆ, ಹದಮಾಡುವಿಕೆ ಮತ್ತು ಸಾಗಣೆಗೆ. 35–55 HP, ಮಧ್ಯಮ ಹಾಗೂ ದೊಡ್ಡ ಹೊಲಗಳಿಗೆ ಸೂಕ್ತ.",
      hi: "भारी ट्रैक्टर – जुताई, बुआई और ढुलाई के लिए। 35–55 HP, मध्यम से बड़े खेतों के लिए।",
    },
    priceRange: "₹800 – ₹1,500/hr",
    availability: "available",
    type: "Tractor",
    districts: ["Mysuru", "Mandya", "Chamarajanagar", "Hassan"],
    taluks: ["Nanjangud", "K.R. Nagar", "Hunsur", "T. Narasipura"],
    budgetTier: "mid",
  },
  {
    id: "rotavator",
    icon: "⚙️",
    name: { en: "Rotavator", kn: "ರೋಟವೇಟರ್", hi: "रोटावेटर" },
    description: {
      en: "Rotary tiller attachment for seedbed preparation. Breaks soil clods in a single pass, saving time and fuel.",
      kn: "ಬೀಜ ಹಾಸಿಗೆ ತಯಾರಿಕೆಗೆ ರೋಟರಿ ಟಿಲ್ಲರ್. ಒಂದೇ ಬಾರಿಗೆ ಮಣ್ಣಿನ ಗಟ್ಟಿಗಳನ್ನು ಪುಡಿಮಾಡುತ್ತದೆ.",
      hi: "बीज क्यारी की तैयारी के लिए रोटरी टिलर। एक बार में मिट्टी के ढेले तोड़ता है।",
    },
    priceRange: "₹600 – ₹1,200/hr",
    availability: "available",
    type: "Tillage",
    districts: ["Mysuru", "Mandya", "Kodagu"],
    taluks: ["Nanjangud", "Srirangapatna", "Pandavapura"],
    budgetTier: "mid",
  },
  {
    id: "cultivator",
    icon: "🌾",
    name: { en: "Cultivator", kn: "ಕಲ್ಟಿವೇಟರ್", hi: "कल्टीवेटर" },
    description: {
      en: "Spring-tine cultivator for secondary tillage and weed control. Works at 10–15 cm depth.",
      kn: "ಎರಡನೇ ಉಳುಮೆ ಮತ್ತು ಕಳೆ ನಿಯಂತ್ರಣಕ್ಕಾಗಿ ಸ್ಪ್ರಿಂಗ್-ಟೈನ್ ಕಲ್ಟಿವೇಟರ್.",
      hi: "द्वितीयक जुताई और खरपतवार नियंत्रण के लिए स्प्रिंग-टाइन कल्टीवेटर।",
    },
    priceRange: "₹500 – ₹900/hr",
    availability: "available",
    type: "Tillage",
    districts: ["Mysuru", "Hassan", "Chamarajanagar"],
    taluks: ["Hunsur", "K.R. Nagar", "Gundlupet"],
    budgetTier: "low",
  },
  {
    id: "seed_drill",
    icon: "🌱",
    name: { en: "Seed Drill", kn: "ಬೀಜ ಡ್ರಿಲ್", hi: "बीज ड्रिल" },
    description: {
      en: "Precision seed drill for row sowing of cereals and pulses. Ensures uniform depth and spacing.",
      kn: "ಧಾನ್ಯ ಮತ್ತು ಬೇಳೆಕಾಳುಗಳ ಸಾಲು ಬಿತ್ತನೆಗಾಗಿ ಬೀಜ ಡ್ರಿಲ್. ಏಕರೂಪ ಆಳ ಮತ್ತು ಅಂತರ.",
      hi: "अनाज और दालों की पंक्ति बुआई के लिए सीड ड्रिल। एक समान गहराई और दूरी।",
    },
    priceRange: "₹500 – ₹1,000/hr",
    availability: "limited",
    type: "Sowing",
    districts: ["Mandya", "Hassan", "Mysuru"],
    taluks: ["Mandya Town", "Maddur", "Srirangapatna"],
    budgetTier: "low",
  },
  {
    id: "power_weeder",
    icon: "🔧",
    name: { en: "Power Weeder", kn: "ಪವರ್ ವೀಡರ್", hi: "पावर वीडर" },
    description: {
      en: "Compact walk-behind power weeder for inter-row weeding. Ideal for vegetable beds and small plots.",
      kn: "ಸಾಲಿನ ನಡುವಿನ ಕಳೆ ತೆಗೆಯಲು ಕಾಂಪ್ಯಾಕ್ಟ್ ಪವರ್ ವೀಡರ್. ತರಕಾರಿ ಬೆಡ್‌ಗಳಿಗೆ ಸೂಕ್ತ.",
      hi: "अंतर-पंक्ति निराई के लिए कॉम्पैक्ट पावर वीडर। सब्जी क्यारियों के लिए उपयुक्त।",
    },
    priceRange: "₹300 – ₹600/hr",
    availability: "available",
    type: "Weeding",
    districts: ["Mysuru", "Chamarajanagar", "Kodagu"],
    taluks: ["Nanjangud", "T. Narasipura", "Periyapatna"],
    budgetTier: "low",
  },
  {
    id: "sprayer",
    icon: "💨",
    name: { en: "Sprayer", kn: "ಸ್ಪ್ರೇಯರ್", hi: "स्प्रेयर" },
    description: {
      en: "Battery/engine-powered knapsack and boom sprayer for pesticide and fertilizer application.",
      kn: "ಕೀಟನಾಶಕ ಮತ್ತು ಗೊಬ್ಬರ ಸಿಂಪಡಣೆಗಾಗಿ ಬ್ಯಾಟರಿ/ಎಂಜಿನ್ ಚಾಲಿತ ಸ್ಪ್ರೇಯರ್.",
      hi: "कीटनाशक और उर्वरक छिड़काव के लिए बैटरी/इंजन चालित स्प्रेयर।",
    },
    priceRange: "₹200 – ₹500/hr",
    availability: "available",
    type: "Spraying",
    districts: ["Mysuru", "Mandya", "Hassan", "Kodagu", "Chamarajanagar"],
    taluks: ["All Taluks"],
    budgetTier: "low",
  },
  {
    id: "harvester",
    icon: "🌾",
    name: { en: "Harvester", kn: "ಹಾರ್ವೆಸ್ಟರ್", hi: "हार्वेस्टर" },
    description: {
      en: "Combine harvester for paddy, wheat and maize. Cuts, threshes and cleans in a single operation.",
      kn: "ಭತ್ತ, ಗೋಧಿ ಮತ್ತು ಜೋಳಕ್ಕಾಗಿ ಕಂಬೈನ್ ಹಾರ್ವೆಸ್ಟರ್. ಒಂದೇ ಬಾರಿಗೆ ಕೊಯ್ಲು, ಒಕ್ಕಣೆ ಮತ್ತು ಸ್ವಚ್ಛಗೊಳಿಸುವಿಕೆ.",
      hi: "धान, गेहूं और मक्का के लिए कंबाइन हार्वेस्टर। एक ही बार में कटाई, मड़ाई और सफाई।",
    },
    priceRange: "₹1,500 – ₹3,000/hr",
    availability: "limited",
    type: "Harvesting",
    districts: ["Mandya", "Hassan", "Mysuru"],
    taluks: ["Mandya Town", "Maddur", "K.R. Nagar"],
    budgetTier: "high",
  },
  {
    id: "thresher",
    icon: "🏭",
    name: { en: "Thresher", kn: "ಥ್ರೆಷರ್", hi: "थ्रेशर" },
    description: {
      en: "Multi-crop thresher for ragi, paddy and pulses. Separates grain from straw efficiently.",
      kn: "ರಾಗಿ, ಭತ್ತ ಮತ್ತು ಬೇಳೆಕಾಳುಗಳಿಗಾಗಿ ಬಹು-ಬೆಳೆ ಥ್ರೆಷರ್.",
      hi: "रागी, धान और दालों के लिए मल्टी-क्रॉप थ्रेशर।",
    },
    priceRange: "₹800 – ₹1,800/hr",
    availability: "available",
    type: "Harvesting",
    districts: ["Mysuru", "Mandya", "Chamarajanagar"],
    taluks: ["Nanjangud", "T. Narasipura", "Kollegal"],
    budgetTier: "mid",
  },
  {
    id: "mini_tractor",
    icon: "🚗",
    name: { en: "Mini Tractor", kn: "ಮಿನಿ ಟ್ರಾಕ್ಟರ್", hi: "मिनी ट्रैक्टर" },
    description: {
      en: "Compact 18–25 HP mini tractor for small farms, orchards and horticulture operations.",
      kn: "ಸಣ್ಣ ಹೊಲ, ತೋಟ ಮತ್ತು ತೋಟಗಾರಿಕೆಗಾಗಿ ಕಾಂಪ್ಯಾಕ್ಟ್ 18–25 HP ಮಿನಿ ಟ್ರಾಕ್ಟರ್.",
      hi: "छोटे खेत, बागान और बागवानी के लिए कॉम्पैक्ट 18–25 HP मिनी ट्रैक्टर।",
    },
    priceRange: "₹600 – ₹1,000/hr",
    availability: "available",
    type: "Tractor",
    districts: ["Kodagu", "Hassan", "Mysuru"],
    taluks: ["Madikeri", "Somwarpet", "Virajpet"],
    budgetTier: "mid",
  },
  {
    id: "drone_sprayer",
    icon: "🚁",
    name: { en: "Drone Sprayer", kn: "ಡ್ರೋನ್ ಸ್ಪ್ರೇಯರ್", hi: "ड्रोन स्प्रेयर" },
    description: {
      en: "Agri drone with 10–16L tank for precision pesticide and nutrient spraying. Covers 1 acre in ~10 min.",
      kn: "ನಿಖರ ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆಗಾಗಿ 10–16L ಟ್ಯಾಂಕ್ ಇರುವ ಕೃಷಿ ಡ್ರೋನ್. ~10 ನಿಮಿಷದಲ್ಲಿ 1 ಎಕರೆ.",
      hi: "सटीक कीटनाशक छिड़काव के लिए 10–16L टैंक वाला कृषि ड्रोन। ~10 मिनट में 1 एकड़।",
    },
    priceRange: "₹400 – ₹700/acre",
    availability: "limited",
    type: "Spraying",
    districts: ["Mysuru", "Mandya", "Hassan"],
    taluks: ["Nanjangud", "Mandya Town", "Holenarasipura"],
    budgetTier: "mid",
  },
];

export const EQUIPMENT_TYPES = [...new Set(equipmentList.map((e) => e.type))];
export const EQUIPMENT_DISTRICTS = [...new Set(equipmentList.flatMap((e) => e.districts))];
export const EQUIPMENT_TALUKS = [...new Set(equipmentList.flatMap((e) => e.taluks))];
