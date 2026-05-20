export type Language = "en" | "kn" | "hi";

export const uiLabels = {
  en: {
    dashboard: "Dashboard",
    health: "Land Health",
    recommend: "Recommended Crops",
    call: "CALL EXPERT",
    hum: "Humidity",
    temp: "Temperature",
    soil: "Soil Type",
  },
  kn: {
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    health: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ",
    recommend: "ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆಗಳು",
    call: "ತಜ್ಞರಿಗೆ ಕರೆ ಮಾಡಿ",
    hum: "ತೇವಾಂಶ",
    temp: "ತಾಪಮಾನ",
    soil: "ಮಣ್ಣಿನ ವಿಧ",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    health: "मिट्टी स्वास्थ्य",
    recommend: "अनुशंसित फसलें",
    call: "विशेषज्ञ को कॉल करें",
    hum: "नमी",
    temp: "तापमान",
    soil: "मिट्टी का प्रकार",
  },
} as const;

export type RegionContent = { name: string; soil: string; crops: string[]; tip: string };
export type Region = { lat: number; lng: number; ph: number; temp: string; hum: string; color: string; en: RegionContent; kn: RegionContent };

export const regions = {
  gokulam: { lat: 12.33, lng: 76.6234, ph: 6.9, temp: "28-35°C", hum: "65%", color: "#9C27B0", en: { name: "Gokulam", soil: "Aged Red Loamy", crops: ["Microgreens", "Herbs"], tip: "Best for Hydroponics." }, kn: { name: "ಗೋಕುಲಂ", soil: "ಹಳೆಯ ಕೆಂಪು ಮಣ್ಣು", crops: ["ಮೈಕ್ರೋಗ್ರೀನ್ಸ್", "ಮೂಲಿಕೆಗಳು"], tip: "ಹೈಡ್ರೋಪೋನಿಕ್ಸ್ ಪದ್ಧತಿಗೆ ಸೂಕ್ತ." } },
  jayalakshmipuram: { lat: 12.321, lng: 76.632, ph: 6.8, temp: "28-35°C", hum: "65%", color: "#9C27B0", en: { name: "Jayalakshmipuram", soil: "Aged Red Loamy", crops: ["Microgreens", "Herbs"], tip: "Ideal for urban rooftop setups." }, kn: { name: "ಜಯಲಕ್ಷ್ಮೀಪುರಂ", soil: "ಹಳೆಯ ಕೆಂಪು ಮಣ್ಣು", crops: ["ಮೈಕ್ರೋಗ್ರೀನ್ಸ್", "ಮೂಲಿಕೆಗಳು"], tip: "ನಗರದ ಮೇಲ್ಛಾವಣಿಯ ಕೃಷಿಗೆ ಸೂಕ್ತ." } },
  vv_puram: { lat: 12.327, lng: 76.64, ph: 7, temp: "28-35°C", hum: "65%", color: "#9C27B0", en: { name: "V.V. Puram", soil: "Aged Red Loamy", crops: ["Organic Salads", "Herbs"], tip: "Focus on high-value urban agri." }, kn: { name: "ವಿ.ವಿ. ಪುರಂ", soil: "ಹಳೆಯ ಕೆಂಪು ಮಣ್ಣು", crops: ["ಸಲಾಡ್", "ಮೂಲಿಕೆಗಳು"], tip: "ನಗರ ಕೃಷಿಯ ಮೇಲೆ ಗಮನಹರಿಸಿ." } },
  hebbal: { lat: 12.35, lng: 76.61, ph: 7.6, temp: "30-37°C", hum: "50%", color: "#E91E63", en: { name: "Hebbal", soil: "Red Gravelly", crops: ["Marigold", "Moringa"], tip: "Hardy plants for industrial soil." }, kn: { name: "ಹೆಬ್ಬಾಳ", soil: "ಕೆಂಪು ಕಲ್ಲು ಮಣ್ಣು", crops: ["ಚೆಂಡು ಹೂ", "ನುಗ್ಗೆಕಾಯಿ"], tip: "ಕೈಗಾರಿಕಾ ಪ್ರದೇಶದ ಸಸ್ಯಗಳಿಗೆ ಸೂಕ್ತ." } },
  metagalli: { lat: 12.345, lng: 76.63, ph: 7.5, temp: "30-37°C", hum: "50%", color: "#E91E63", en: { name: "Metagalli", soil: "Red Gravelly", crops: ["Sunflowers", "Shrubs"], tip: "Low-maintenance vegetation." }, kn: { name: "ಮೆಟಗಳ್ಳಿ", soil: "ಕೆಂಪು ಕಲ್ಲು ಮಣ್ಣು", crops: ["ಸೂರ್ಯಕಾಂತಿ", "ಪೊದೆಗಳು"], tip: "ಕಡಿಮೆ ನಿರ್ವಹಣೆಯ ಸಸ್ಯಗಳಿಗೆ ಸೂಕ್ತ." } },
  belavadi: { lat: 12.34, lng: 76.58, ph: 7.7, temp: "31-37°C", hum: "48%", color: "#E91E63", en: { name: "Belavadi", soil: "Mixed Gravelly", crops: ["Moringa", "Millets"], tip: "Requires soil enrichment." }, kn: { name: "ಬೆಲವಡಿ", soil: "ಮಿಶ್ರಿತ ಕಲ್ಲು ಮಣ್ಣು", crops: ["ನುಗ್ಗೆಕಾಯಿ", "ಸಿರಿಧಾನ್ಯ"], tip: "ಮಣ್ಣಿನ ಪೋಷಣೆ ಅಗತ್ಯವಿದೆ." } },
  srirampura: { lat: 12.27, lng: 76.63, ph: 6.5, temp: "26-33°C", hum: "70%", color: "#4CAF50", en: { name: "Srirampura", soil: "Red Clayey Loam", crops: ["Banana", "Brinjal"], tip: "Excellent moisture retention." }, kn: { name: "ಶ್ರೀರಾಮಪುರ", soil: "ಕೆಂಪು ಜೇಡಿ ಮಣ್ಣು", crops: ["ಬಾಳೆ", "ಬದನೆಕಾಯಿ"], tip: "ತೇವಾಂಶ ಉಳಿಸಿಕೊಳ್ಳುವ ಸಾಮರ್ಥ್ಯ ಹೆಚ್ಚು." } },
  jp_nagar: { lat: 12.26, lng: 76.65, ph: 6.6, temp: "26-33°C", hum: "70%", color: "#4CAF50", en: { name: "J.P. Nagar", soil: "Red Clayey Loam", crops: ["Beans", "Papaya"], tip: "Ideal for backyard orchards." }, kn: { name: "ಜೆ.ಪಿ. ನಗರ", soil: "ಕೆಂಪು ಜೇಡಿ ಮಣ್ಣು", crops: ["ಹುರುಳಿಕಾಯಿ", "ಪಪ್ಪಾಯಿ"], tip: "ಕೈತೋಟದ ಹಣ್ಣಿನ ಮರಗಳಿಗೆ ಸೂಕ್ತ." } },
  vidyaranyapuram: { lat: 12.28, lng: 76.65, ph: 6.4, temp: "26-33°C", hum: "72%", color: "#4CAF50", en: { name: "Vidyaranyapuram", soil: "Red Clayey Loam", crops: ["Tomato", "Chilli"], tip: "Great for intensive vegetable farming." }, kn: { name: "ವಿದ್ಯಾರಣ್ಯಪುರಂ", soil: "ಕೆಂಪು ಜೇಡಿ ಮಣ್ಣು", crops: ["ಟೊಮೆಟೊ", "ಮೆಣಸಿನಕಾಯಿ"], tip: "ತೀವ್ರ ತರಕಾರಿ ಕೃಷಿಗೆ ಉತ್ತಮ." } },
  vijayanagar: { lat: 12.32, lng: 76.6, ph: 7.5, temp: "29-36°C", hum: "55%", color: "#FFEB3B", en: { name: "Vijayanagar", soil: "Red Sandy/Rocky", crops: ["Pomegranate", "Leafy Greens"], tip: "Drip irrigation recommended." }, kn: { name: "ವಿಜಯನಗರ", soil: "ಕೆಂಪು ಮರಳು ಮಣ್ಣು", crops: ["ದಾಳಿಂಬೆ", "ಸೊಪ್ಪು"], tip: "ಹನಿ ನೀರಾವರಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ." } },
  bogadi: { lat: 12.3, lng: 76.6, ph: 7.4, temp: "29-36°C", hum: "55%", color: "#FFEB3B", en: { name: "Bogadi", soil: "Red Sandy/Rocky", crops: ["Beans", "Palak"], tip: "Use raised beds for veggies." }, kn: { name: "ಬೋಗಾದಿ", soil: "ಕೆಂಪು ಮರಳು ಮಣ್ಣು", crops: ["ಹುರುಳಿಕಾಯಿ", "ಪಾಲಕ್"], tip: "ತರಕಾರಿಗಳಿಗಾಗಿ ಎತ್ತರಿಸಿದ ಪಾತಿ ಬಳಸಿ." } },
  hinkal: { lat: 12.325, lng: 76.59, ph: 7.6, temp: "29-36°C", hum: "53%", color: "#FFEB3B", en: { name: "Hinkal", soil: "Red Sandy/Rocky", crops: ["Methi", "Radish"], tip: "Add organic compost regularly." }, kn: { name: "ಹಿಕಲ್", soil: "ಕೆಂಪು ಮರಳು ಮಣ್ಣು", crops: ["ಮೆಂತೆ", "ಮೂಲಂಗಿ"], tip: "ನಿಯಮಿತವಾಗಿ ಸಾವಯವ ಗೊಬ್ಬರ ಬಳಸಿ." } },
  nanjangud: { lat: 12.119, lng: 76.6798, ph: 7.5, temp: "24-34°C", hum: "75%", color: "#00BCD4", en: { name: "Nanjangud", soil: "Black Alluvial", crops: ["Sugarcane", "Banana"], tip: "Kabini water source belt." }, kn: { name: "ನಂಜನಗೂಡು", soil: "ಕಪ್ಪು ಮಣ್ಣು", crops: ["ಕಬ್ಬು", "ಬಾಳೆ"], tip: "ಕಬಿನಿ ನೀರಿನ ಮೂಲದ ಪ್ರದೇಶ." } },
  mandya: { lat: 12.52, lng: 76.89, ph: 7.6, temp: "24-34°C", hum: "74%", color: "#00BCD4", en: { name: "Mandya", soil: "Black Alluvial", crops: ["Sugarcane", "Paddy"], tip: "The Sugar capital logic." }, kn: { name: "ಮಂಡ್ಯ", soil: "ಕಪ್ಪು ಮಣ್ಣು", crops: ["ಕಬ್ಬು", "ಭತ್ತ"], tip: "ಸಕ್ಕರೆ ನಾಡಿನ ಕೃಷಿ ಪದ್ಧತಿ." } },
  t_narasipura: { lat: 12.21, lng: 76.9, ph: 7.4, temp: "24-34°C", hum: "76%", color: "#00BCD4", en: { name: "T. Narasipura", soil: "River Alluvial", crops: ["Paddy", "Jasmine"], tip: "High river-fed fertility." }, kn: { name: "ಟಿ. ನರಸೀಪುರ", soil: "ನದಿಯ ಹೂಳು ಮಣ್ಣು", crops: ["ಭತ್ತ", "ಮಲ್ಲಿಗೆ"], tip: "ನದಿಯ ಫಲವತ್ತಾದ ಮಣ್ಣು." } },
  kr_nagar: { lat: 12.44, lng: 76.38, ph: 7.3, temp: "24-34°C", hum: "75%", color: "#00BCD4", en: { name: "K.R. Nagar", soil: "Black Alluvial", crops: ["Paddy", "Coconut"], tip: "Excellent KRS canal belt." }, kn: { name: "ಕೆ.ಆರ್. ನಗರ", soil: "ಕಪ್ಪು ಮಣ್ಣು", crops: ["ಭತ್ತ", "ತೆಂಗು"], tip: "ಕೆ.ಆರ್.ಎಸ್ ಕಾಲುವೆ ಪ್ರದೇಶ." } },
  kodagu: { lat: 12.4244, lng: 75.7382, ph: 5.2, temp: "15-31°C", hum: "92%", color: "#5D4037", en: { name: "Kodagu", soil: "Acidic Forest Soil", crops: ["Coffee", "Pepper"], tip: "Soil is Acidic. Apply Lime." }, kn: { name: "ಕೊಡಗು", soil: "ಆಮ್ಲೀಯ ಅರಣ್ಯ ಮಣ್ಣು", crops: ["ಕಾಫಿ", "ಮೆಣಸು"], tip: "ಮಣ್ಣು ಆಮ್ಲೀಯವಾಗಿದೆ. ಸುಣ್ಣ ಬಳಸಿ." } },
  sakleshpur: { lat: 12.97, lng: 75.78, ph: 5, temp: "18-28°C", hum: "90%", color: "#5D4037", en: { name: "Sakleshpur", soil: "Laterite Forest", crops: ["Cardamom", "Coffee"], tip: "High focus on spices." }, kn: { name: "ಸಕಲೇಶಪುರ", soil: "ಲ್ಯಾಟರೈಟ್ ಅರಣ್ಯ ಮಣ್ಣು", crops: ["ಏಲಕ್ಕಿ", "ಕಾಫಿ"], tip: "ಮಸಾಲೆ ಬೆಳೆಗಳ ಮೇಲೆ ಗಮನಹರಿಸಿ." } },
  hd_kote: { lat: 12.08, lng: 76.33, ph: 6.2, temp: "21-30°C", hum: "85%", color: "#5D4037", en: { name: "H.D. Kote", soil: "Brown Forest Clay", crops: ["Cotton", "Ginger"], tip: "Suitable for organic ginger." }, kn: { name: "ಎಚ್.ಡಿ. ಕೋಟೆ", soil: "ಕಂದು ಅರಣ್ಯ ಮಣ್ಣು", crops: ["ಹತ್ತಿ", "ಶುಂಠಿ"], tip: "ಸಾವಯವ ಶುಂಠಿಗೆ ಸೂಕ್ತ." } },
  hunsur: { lat: 12.309, lng: 76.289, ph: 6.7, temp: "22-32°C", hum: "65%", color: "#FF9800", en: { name: "Hunsur", soil: "Red Sandy Loam", crops: ["Tobacco", "Maize"], tip: "Moderate rainfall zone." }, kn: { name: "ಹುಣಸೂರು", soil: "ಕೆಂಪು ಮರಳು ಮಿಶ್ರಿತ ಮಣ್ಣು", crops: ["ಹೊಗೆಸೊಪ್ಪು", "ಮೆಕ್ಕೆಜೋಳ"], tip: "ಮಧ್ಯಮ ಮಳೆ ಬೀಳುವ ಪ್ರದೇಶ." } },
  periyapatna: { lat: 12.34, lng: 76.1, ph: 6.8, temp: "22-32°C", hum: "64%", color: "#FF9800", en: { name: "Periyapatna", soil: "Red Sandy Loam", crops: ["Tobacco", "Sandalwood"], tip: "Tobacco heartland." }, kn: { name: "ಪಿರಿಯಾಪಟ್ಟಣ", soil: "ಕೆಂಪು ಮರಳು ಮಿಶ್ರಿತ ಮಣ್ಣು", crops: ["ಹೊಗೆಸೊಪ್ಪು", "ಶ್ರೀಗಂಧ"], tip: "ಹೊಗೆಸೊಪ್ಪಿನ ಪ್ರಮುಖ ಪ್ರದೇಶ." } },
  chamarajanagar: { lat: 11.9261, lng: 76.9437, ph: 7.2, temp: "22-35°C", hum: "52%", color: "#FF9800", en: { name: "Chamarajanagar", soil: "Mixed Loam", crops: ["Turmeric", "Mulberry"], tip: "Arid climate. Use drip." }, kn: { name: "ಚಾಮರಾಜನಗರ", soil: "ಮಿಶ್ರಿತ ಲೋಮ್ ಮಣ್ಣು", crops: ["ಅರಿಶಿನ", "ಹಿಪ್ಪುನೇರಳೆ"], tip: "ಒಣ ಹವಾಮಾನ. ಹನಿ ನೀರಾವರಿ ಬಳಸಿ." } },
  hassan: { lat: 13.0063, lng: 76.1025, ph: 6.1, temp: "20-32°C", hum: "75%", color: "#8BC34A", en: { name: "Hassan", soil: "Red Loamy", crops: ["Potato", "Ginger"], tip: "Watch for fungal blight." }, kn: { name: "ಹಾಸನ", soil: "ಕೆಂಪು ಮಣ್ಣು", crops: ["ಆಲೂಗಡ್ಡೆ", "ಶುಂಠಿ"], tip: "ಕೊಳೆ ರೋಗದ ಬಗ್ಗೆ ಎಚ್ಚರವಿರಲಿ." } },
  holenarasipura: { lat: 12.78, lng: 76.23, ph: 6.4, temp: "21-33°C", hum: "74%", color: "#8BC34A", en: { name: "Holenarasipura", soil: "Red Alluvial", crops: ["Paddy", "Sugarcane"], tip: "Mixed river-fed profiles." }, kn: { name: "ಹೊಳೆನರಸೀಪುರ", soil: "ಕೆಂಪು ಹೂಳು ಮಣ್ಣು", crops: ["ಭತ್ತ", "ಕಬ್ಬು"], tip: "ಮಿಶ್ರಿತ ಕೃಷಿ ಪದ್ಧತಿ." } },
} satisfies Record<string, Region>;

export type RegionId = keyof typeof regions;
export const regionEntries = Object.entries(regions) as [RegionId, Region][];

const hindiRegions: Record<RegionId, RegionContent> = {
  gokulam: { name: "गोकुलम", soil: "पुरानी लाल दोमट", crops: ["माइक्रोग्रीन्स", "जड़ी-बूटियाँ"], tip: "हाइड्रोपोनिक्स के लिए सर्वोत्तम।" },
  jayalakshmipuram: { name: "जयलक्ष्मीपुरम", soil: "पुरानी लाल दोमट", crops: ["माइक्रोग्रीन्स", "जड़ी-बूटियाँ"], tip: "शहरी छत खेती के लिए आदर्श।" },
  vv_puram: { name: "वी.वी. पुरम", soil: "पुरानी लाल दोमट", crops: ["ऑर्गेनिक सलाद", "जड़ी-बूटियाँ"], tip: "उच्च मूल्य वाली शहरी खेती पर ध्यान दें।" },
  hebbal: { name: "हेब्बाल", soil: "लाल कंकरीली मिट्टी", crops: ["गेंदा", "सहजन"], tip: "औद्योगिक मिट्टी के लिए मजबूत पौधे।" },
  metagalli: { name: "मेटागल्ली", soil: "लाल कंकरीली मिट्टी", crops: ["सूरजमुखी", "झाड़ियाँ"], tip: "कम देखभाल वाली वनस्पति।" },
  belavadi: { name: "बेलवाड़ी", soil: "मिश्रित कंकरीली मिट्टी", crops: ["सहजन", "मोटे अनाज"], tip: "मिट्टी में पोषण बढ़ाना आवश्यक है।" },
  srirampura: { name: "श्रीरामपुरा", soil: "लाल चिकनी दोमट", crops: ["केला", "बैंगन"], tip: "नमी रोकने की क्षमता उत्कृष्ट।" },
  jp_nagar: { name: "जे.पी. नगर", soil: "लाल चिकनी दोमट", crops: ["बीन्स", "पपीता"], tip: "घर के बगीचे और फलदार पौधों के लिए आदर्श।" },
  vidyaranyapuram: { name: "विद्यारण्यपुरम", soil: "लाल चिकनी दोमट", crops: ["टमाटर", "मिर्च"], tip: "गहन सब्जी खेती के लिए अच्छा।" },
  vijayanagar: { name: "विजयनगर", soil: "लाल रेतीली/पथरीली", crops: ["अनार", "हरी पत्तेदार सब्जियाँ"], tip: "ड्रिप सिंचाई की सलाह दी जाती है।" },
  bogadi: { name: "बोगादी", soil: "लाल रेतीली/पथरीली", crops: ["बीन्स", "पालक"], tip: "सब्जियों के लिए उठी हुई क्यारियाँ उपयोग करें।" },
  hinkal: { name: "हिंकल", soil: "लाल रेतीली/पथरीली", crops: ["मेथी", "मूली"], tip: "नियमित रूप से जैविक खाद डालें।" },
  nanjangud: { name: "नंजनगुड", soil: "काली जलोढ़ मिट्टी", crops: ["गन्ना", "केला"], tip: "कबिनी जल स्रोत क्षेत्र।" },
  mandya: { name: "मांड्या", soil: "काली जलोढ़ मिट्टी", crops: ["गन्ना", "धान"], tip: "चीनी क्षेत्र की खेती पद्धति।" },
  t_narasipura: { name: "टी. नरसीपुरा", soil: "नदी जलोढ़ मिट्टी", crops: ["धान", "चमेली"], tip: "नदी से पोषित उच्च उर्वरता।" },
  kr_nagar: { name: "के.आर. नगर", soil: "काली जलोढ़ मिट्टी", crops: ["धान", "नारियल"], tip: "उत्कृष्ट KRS नहर क्षेत्र।" },
  kodagu: { name: "कोडगु", soil: "अम्लीय वन मिट्टी", crops: ["कॉफी", "काली मिर्च"], tip: "मिट्टी अम्लीय है। चूना डालें।" },
  sakleshpur: { name: "सकलेशपुर", soil: "लेटराइट वन मिट्टी", crops: ["इलायची", "कॉफी"], tip: "मसाला फसलों पर अधिक ध्यान दें।" },
  hd_kote: { name: "एच.डी. कोटे", soil: "भूरी वन चिकनी मिट्टी", crops: ["कपास", "अदरक"], tip: "जैविक अदरक के लिए उपयुक्त।" },
  hunsur: { name: "हुनसूर", soil: "लाल रेतीली दोमट", crops: ["तंबाकू", "मक्का"], tip: "मध्यम वर्षा क्षेत्र।" },
  periyapatna: { name: "पेरियापटना", soil: "लाल रेतीली दोमट", crops: ["तंबाकू", "चंदन"], tip: "तंबाकू का प्रमुख क्षेत्र।" },
  chamarajanagar: { name: "चामराजनगर", soil: "मिश्रित दोमट", crops: ["हल्दी", "शहतूत"], tip: "शुष्क जलवायु। ड्रिप सिंचाई उपयोग करें।" },
  hassan: { name: "हासन", soil: "लाल दोमट", crops: ["आलू", "अदरक"], tip: "फफूंद रोग पर नज़र रखें।" },
  holenarasipura: { name: "होलेनरसीपुरा", soil: "लाल जलोढ़ मिट्टी", crops: ["धान", "गन्ना"], tip: "मिश्रित नदी-आधारित खेती।" },
};

export const getRegionContent = (region: Region, id: RegionId, language: Language) =>
  language === "hi" ? hindiRegions[id] : region[language];
