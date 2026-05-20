import { Language } from "./krishiMysuru";

export type Listing = {
  id: string;
  farmer_name: string;
  phone: string;
  location_id: string;
  en: { crop_name: string; location: string; grade: string; };
  kn: { crop_name: string; location: string; grade: string; };
  hi: { crop_name: string; location: string; grade: string; };
  price_per_kg: number;
  quantity_kg: number;
  icon: string;
  tag: string;
};

export type FpoLot = {
  id: string;
  fpo_name: string;
  registration_no: string;
  crop_type: string;
  icon: string;
  en: { variety: string; location: string; logistics: string; };
  kn: { variety: string; location: string; logistics: string; };
  hi: { variety: string; location: string; logistics: string; };
  total_available_tons: number;
  min_order_quantity_tons: number;
  price_per_ton: number;
  certified_organic: boolean;
  contact_person: string;
};

export const buyerListings: Listing[] = [
  { "id": "list_001", "farmer_name": "Mahadeva Gowda", "phone": "+91 98450 XXXXX", "location_id": "nanjangud", "en": { "crop_name": "Nanjangud Rasabale Banana", "location": "Nanjangud, Mysuru", "grade": "Export Quality (A-Grade)" }, "kn": { "crop_name": "ನಂಜನಗೂಡು ರಸಬಾಳೆ ಬಾಳೆಹಣ್ಣು", "location": "ನಂಜನಗೂಡು, ಮೈಸೂರು", "grade": "ರಫ್ತು ಗುಣಮಟ್ಟ (ಎ-ಗ್ರೇಡ್)" }, "hi": { "crop_name": "नंजनगुड रसबाले केला", "location": "नंजनगुड, मैसूरु", "grade": "निर्यात गुणवत्ता (A-ग्रेड)" }, "price_per_kg": 85, "quantity_kg": 1200, "icon": "🍌", "tag": "GI Tagged" },
  { "id": "list_002", "farmer_name": "Ningappa K.", "phone": "+91 99001 XXXXX", "location_id": "mandya", "en": { "crop_name": "Organic Chemical-Free Jaggery", "location": "Maddur, Mandya", "grade": "Premium Organic" }, "kn": { "crop_name": "ಸಾವಯವ ರಾಸಾಯನಿಕ ಮುಕ್ತ ಬೆಲ್ಲ", "location": "ಮದ್ದೂರು, ಮಂಡ್ಯ", "grade": "ಪ್ರಿಮಿಯಂ ಸಾವಯವ" }, "hi": { "crop_name": "ऑर्गेनिक रसायन-मुक्त गुड़", "location": "मद्दूर, मांड्या", "grade": "प्रीमियम ऑर्गेनिक" }, "price_per_kg": 65, "quantity_kg": 3500, "icon": "🍯", "tag": "Organic" },
  { "id": "list_003", "farmer_name": "Puttaiah Swamy", "phone": "+91 94482 XXXXX", "location_id": "t_narasipura", "en": { "crop_name": "Sona Masuri Paddy", "location": "T. Narasipura", "grade": "B-Grade (Standard)" }, "kn": { "crop_name": "ಸೋನಾ ಮಸೂರಿ ಭತ್ತ", "location": "ಟಿ. ನರಸೀಪುರ", "grade": "ಬಿ-ಗ್ರೇಡ್ (ಪ್ರಮಾಣಿತ)" }, "hi": { "crop_name": "सोना मसूरी धान", "location": "टी. नरसीपुरा", "grade": "B-ग्रेड (मानक)" }, "price_per_kg": 32, "quantity_kg": 8000, "icon": "🌾", "tag": "Bulk Stable" },
  { "id": "list_004", "farmer_name": "Deviah M.", "phone": "+91 97311 XXXXX", "location_id": "hunsur", "en": { "crop_name": "Red Dragon Fruit", "location": "Hunsur", "grade": "Export Quality (A-Grade)" }, "kn": { "crop_name": "ಕೆಂಪು ಡ್ರಾಗನ್ ಫ್ರೂಟ್", "location": "ಹುಣಸೂರು", "grade": "ರಫ್ತು ಗುಣಮಟ್ಟ (ಎ-ಗ್ರೇಡ್)" }, "hi": { "crop_name": "लाल ड्रैगन फ्रूट", "location": "हुनसूर", "grade": "निर्यात गुणवत्ता (A-ग्रेड)" }, "price_per_kg": 140, "quantity_kg": 500, "icon": "🌵", "tag": "High Profit" },
  { "id": "list_005", "farmer_name": "Chethan Kumar", "phone": "+91 81234 XXXXX", "location_id": "periyapatna", "en": { "crop_name": "Premium Mysore Ginger", "location": "Periyapatna", "grade": "A-Grade washed" }, "kn": { "crop_name": "ಪ್ರಿಮಿಯಂ ಮೈಸೂರು ಶುಂಠಿ", "location": "ಪಿರಿಯಾಪಟ್ಟಣ", "grade": "ಎ-ಗ್ರೇಡ್ ತೊಳೆದದ್ದು" }, "hi": { "crop_name": "प्रीमियम मैसूर अदरक", "location": "पेरियापटना", "grade": "A-ग्रेड धुला हुआ" }, "price_per_kg": 110, "quantity_kg": 2000, "icon": "🌱", "tag": "Trending" },
  { "id": "list_006", "farmer_name": "Subbamma Ravi", "phone": "+91 91410 XXXXX", "location_id": "chamarajanagar", "en": { "crop_name": "High-Curcumin Turmeric", "location": "Chamarajanagar", "grade": "Premium Spices Grade" }, "kn": { "crop_name": "ಹೆಚ್ಚಿನ ಕುರ್ಕ್ಯುಮಿನ್ ಅರಿಶಿನ", "location": "ಚಾಮರಾಜನಗರ", "grade": "ಪ್ರಿಮಿಯಂ ಮಸಾಲೆ ದರ್ಜೆ" }, "hi": { "crop_name": "उच्च करक्यूमिन हल्दी", "location": "चामराजनगर", "grade": "प्रीमियम मसाला ग्रेड" }, "price_per_kg": 95, "quantity_kg": 4000, "icon": "🍂", "tag": "Export Focus" },
  { "id": "list_007", "farmer_name": "Javed Ahmed", "phone": "+91 70223 XXXXX", "location_id": "hassan", "en": { "crop_name": "Table Quality Potatoes", "location": "Hassan City", "grade": "A-Grade Large" }, "kn": { "crop_name": "ಆಲೂಗಡ್ಡೆ", "location": "ಹಾಸನ ನಗರ", "grade": "ಎ-ಗ್ರೇಡ್ ದೊಡ್ಡದು" }, "hi": { "crop_name": "आलू", "location": "हासन शहर", "grade": "A-ग्रेड बड़ा" }, "price_per_kg": 28, "quantity_kg": 10000, "icon": "🥔", "tag": "Mass Volume" },
  { "id": "list_008", "farmer_name": "Vikram Bose", "phone": "+91 94490 XXXXX", "location_id": "kodagu", "en": { "crop_name": "Shade-Grown Arabica Coffee", "location": "Somwarpet, Kodagu", "grade": "Export Premium" }, "kn": { "crop_name": "ನೆರಳಿನಲ್ಲಿ ಬೆಳೆದ ಅರೇಬಿಕಾ ಕಾಫಿ", "location": "ಸೋಮವಾರಪೇಟೆ, ಕೊಡಗು", "grade": "ರಫ್ತು ಪ್ರೀಮಿಯಂ" }, "hi": { "crop_name": "शेड-ग्रोन अरेबिका कॉफी", "location": "सोमवारपेट, कोडगु", "grade": "निर्यात प्रीमियम" }, "price_per_kg": 240, "quantity_kg": 1500, "icon": "☕", "tag": "Luxury Market" },
  { "id": "list_009", "farmer_name": "Ramesh Patel", "phone": "+91 88612 XXXXX", "location_id": "central", "en": { "crop_name": "Hydroponic Salad Greens", "location": "Gokulam, Mysuru", "grade": "Exotic Ultra-Fresh" }, "kn": { "crop_name": "ಹೈಡ್ರೋಪೋನಿಕ್ ಸಲಾಡ್ ಸೊಪ್ಪು", "location": "ಗೋಕುಲಂ, ಮೈಸೂರು", "grade": "ವಿಲಕ್ಷಣ ಅಲ್ಟ್ರಾ-ಫ್ರೆಶ್" }, "hi": { "crop_name": "हाइड्रोपोनिक सलाद साग", "location": "गोकुलम, मैसूरु", "grade": "अल्ट्रा-फ्रेश" }, "price_per_kg": 180, "quantity_kg": 150, "icon": "🥬", "tag": "Urban Farm" },
  { "id": "list_010", "farmer_name": "Anand Raju", "phone": "+91 99456 XXXXX", "location_id": "south", "en": { "crop_name": "Fresh Organic Brinjals", "location": "Srirampura, Mysuru", "grade": "Local Fresh" }, "kn": { "crop_name": "ತಾಜಾ ಸಾವಯವ ಬದನೆಕಾಯಿ", "location": "ಶ್ರೀರಾಂಪುರ, ಮೈಸೂರು", "grade": "ಸ್ಥಳೀಯ ತಾಜಾ" }, "hi": { "crop_name": "ताजा जैविक बैंगन", "location": "श्रीरामपुरा, मैसूरु", "grade": "स्थानीय ताजा" }, "price_per_kg": 40, "quantity_kg": 600, "icon": "🍆", "tag": "Kitchen Garden" }
];

export const fpoBulkLots: FpoLot[] = [
  { "id": "fpo_lot_001", "fpo_name": "Mysuru Progressive Planters FPO", "registration_no": "FPO-MYS-2024-089", "crop_type": "Sugarcane", "icon": "🎋", "en": { "variety": "Co 86032 (High Recovery Juice Variety)", "location": "T. Narasipura Clean Belt, Mysuru", "logistics": "Harvest-to-truck loading included. Ex-farm gate pricing." }, "kn": { "variety": "ಕೋ 86032 (ಹೆಚ್ಚು ರಸ ಇಳುವರಿ ತಳಿ)", "location": "ಟಿ. ನರಸೀಪುರ ಕ್ಲೀನ್ ಬೆಲ್ಟ್, ಮೈಸೂರು", "logistics": "ಕಟಾವಿನಿಂದ ಟ್ರಕ್ ಲೋಡಿಂಗ್ ಒಳಗೊಂಡಿದೆ. ಎಕ್ಸ್-ಫಾರ್ಮ್ ಗೇಟ್ ಬೆಲೆ." }, "hi": { "variety": "Co 86032 (उच्च रस उपज किस्म)", "location": "टी. नरसीपुरा, मैसूरु", "logistics": "कटाई से ट्रक लोडिंग शामिल। एक्स-फार्म गेट कीमत।" }, "total_available_tons": 45.0, "min_order_quantity_tons": 5.0, "price_per_ton": 3400, "certified_organic": false, "contact_person": "Siddaraju M. (Director)" },
  { "id": "fpo_lot_002", "fpo_name": "Chamundeshwari Horticulture FPO", "registration_no": "FPO-MYS-2023-112", "crop_type": "Tomato", "icon": "🍅", "en": { "variety": "Sahu Hybrid (Firm Fruit, High Shelf-Life)", "location": "Hunsur Sorting Yard, Mysuru", "logistics": "Crated in 25kg plastic boxes. Cold storage transport options available." }, "kn": { "variety": "ಸಾಹು ಹೈಬ್ರಿಡ್ (ಗಟ್ಟಿ ಹಣ್ಣು, ದೀರ್ಘ ಶೇಖರಣಾ ಅವಧಿ)", "location": "ಹುಣಸೂರು ಸಾರ್ಟಿಂಗ್ ಯಾರ್ಡ್, ಮೈಸೂರು", "logistics": "25 ಕೆಜಿ ಪ್ಲಾಸ್ಟಿಕ್ ಕ್ರೇಟ್ಗಳಲ್ಲಿ ಪ್ಯಾಕ್ ಮಾಡಲಾಗಿದೆ. ಕೋಲ್ಡ್ ಸ್ಟೋರೇಜ್ ಸಾರಿಗೆ ಲಭ್ಯವಿದೆ." }, "hi": { "variety": "साहू हाइब्रिड (ठोस फल, लंबी शेल्फ-लाइफ)", "location": "हुनसूर सॉर्टिंग यार्ड, मैसूरु", "logistics": "25 किलो प्लास्टिक क्रेट में पैक। कोल्ड स्टोरेज परिवहन उपलब्ध।" }, "total_available_tons": 12.5, "min_order_quantity_tons": 1.0, "price_per_ton": 18000, "certified_organic": true, "contact_person": "Ranganath Swamy (Procurement Head)" },
  { "id": "fpo_lot_003", "fpo_name": "Periyapatna Organic Spices FPO", "registration_no": "FPO-MYS-2025-043", "crop_type": "Ginger", "icon": "🌱", "en": { "variety": "Mysore Local / Mahima Grade-A", "location": "Periyapatna Processing Unit, Mysuru", "logistics": "Washed, sun-dried for 4 hours, packed in 50kg gunny bags." }, "kn": { "variety": "ಮೈಸೂರು ಲೋಕಲ್ / ಮಹಿಮಾ ಗ್ರೇಡ್-ಎ", "location": "ಪಿರಿಯಾಪಟ್ಟಣ ಸಂಸ್ಕರಣಾ ಘಟಕ, ಮೈಸೂರು", "logistics": "ತೊಳೆದು, 4 ಗಂಟೆಗಳ ಕಾಲ ಬಿಸಿಲಿನಲ್ಲಿ ಒಣಗಿಸಿ, 50 ಕೆಜಿ ಗೋಣಿ ಚೀಲಗಳಲ್ಲಿ ಪ್ಯಾಕ್ ಮಾಡಲಾಗಿದೆ." }, "hi": { "variety": "मैसूर लोकल / महिमा ग्रेड-ए", "location": "पेरियापटना प्रसंस्करण इकाई, मैसूरु", "logistics": "धोया हुआ, 4 घंटे धूप में सुखाया हुआ, 50 किलो जूट के बैग में पैक।" }, "total_available_tons": 8.0, "min_order_quantity_tons": 0.5, "price_per_ton": 95000, "certified_organic": true, "contact_person": "Kavitha Reddy (CEO)" }
];

export const activeTracking = {
  order_id: "KM-204",
  crop_name: "Premium Mysore Ginger",
  quantity: "2,000 kg",
  total_amount: "₹2,20,000",
  fpo_or_farmer_name: "Chethan Kumar",
  farmer_phone: "+91 81234 XXXXX",
  current_status: "In Transit",
  status_percentage: 75,
  estimated_delivery: "May 20, 2026 (Tomorrow)",
  status: "In Transit",
  eta: "May 20, 2026 (Tomorrow)",
  farmer_details: {
    name: "Chethan Kumar",
    phone: "+91 81234 XXXXX",
    whatsapp_template_en: "Hi Chethan, I am inquiring about my order #KM-204 on Krishi-Mysuru.",
    whatsapp_template_kn: "ನಮಸ್ಕಾರ ಚೇತನ್, ಕೃಷಿ-ಮೈಸೂರು ಆಪ್ನಲ್ಲಿ ನನ್ನ ಆರ್ಡರ್ #KM-204 ರ ಬಗ್ಗೆ ಮಾಹಿತಿ ಬೇಕಾಗಿತ್ತು.",
    whatsapp_template_hi: "नमस्ते चेतन, मैं कृषि-मैसूर ऐप पर अपने ऑर्डर #KM-204 के बारे में पूछताछ कर रहा हूँ।"
  },
  logistics: {
    driver_name: "Ramesh Kumar",
    driver_phone: "+91 98801 XXXXX",
    vehicle_number: "KA-09-EA-4321",
    vehicle_type: "Tata Ace Mega"
  },
  logistics_details: {
    apmc_clearance_status: "Verified at Gate 2",
    vehicle_number: "KA-09-EA-4321",
    vehicle_type: "Tata Ace Mega",
    driver_name: "Ramesh Kumar",
    driver_phone: "+91 98801 XXXXX"
  },
  milestones: [
    { "id": 1, "title_en": "Order Confirmed", "title_kn": "ಆರ್ಡರ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ", "title_hi": "ऑर्डर की पुष्टि की गई", "time_en": "May 18, 09:30 AM", "time_kn": "ಮೇ 18, 09:30 AM", "time_hi": "18 मई, सुबह 09:30 बजे", "completed": true },
    { "id": 2, "title_en": "Loaded at Farm Gate", "title_kn": "ಫಾರ್ಮ್ ಗೇಟ್ನಲ್ಲಿ ಲೋಡ್ ಮಾಡಲಾಗಿದೆ", "title_hi": "खेत के गेट पर लोड किया गया", "time_en": "May 19, 06:00 AM", "time_kn": "ಮೇ 19, 06:00 AM", "time_hi": "19 मई, सुबह 06:00 बजे", "completed": true },
    { "id": 3, "title_en": "In Transit via Hunsur Road", "title_kn": "ಹುಣಸೂರು ರಸ್ತೆ ಮೂಲಕ ಸಾಗಣೆಯಲ್ಲಿದೆ", "title_hi": "हुनसूर रोड के माध्यम से पारगमन में", "time_en": "May 19, 02:15 PM", "time_kn": "ಮೇ 19, 02:15 PM", "time_hi": "19 मई, दोपहर 02:15 बजे", "completed": true },
    { "id": 4, "title_en": "Out for Delivery", "title_kn": "ವಿತರಣೆಗೆ ಹೊರಟಿದೆ", "title_hi": "वितरण के लिए बाहर", "time_en": "Pending", "time_kn": "ಬಾಕಿ ಇದೆ", "time_hi": "लंबित", "completed": false }
  ]
};

export const trackingLabels = {
  en: { track: "Order Tracking", orderReach: "reaches tomorrow", contact: "Contact farmer", logistics: "Logistics Dispatch Details", vehicle: "Vehicle", driver: "Driver", callDriver: "Call Driver", apmc: "APMC Status", callFarmer: "Call Farmer Directly", waFarmer: "Message on WhatsApp", contactOptions: "Contact Farmer", contactDesc: "How would you like to connect with Chethan Kumar?", close: "Close", expand: "View Details", collapse: "Hide Details" },
  kn: { track: "ಆರ್ಡರ್ ಟ್ರ್ಯಾಕಿಂಗ್", orderReach: "ನಾಳೆ ತಲುಪುತ್ತದೆ", contact: "ರೈತನನ್ನು ಸಂಪರ್ಕಿಸಿ", logistics: "ಸಾರಿಗೆ ರವಾನೆ ವಿವರಗಳು", vehicle: "ವಾಹನ", driver: "ಚಾಲಕ", callDriver: "ಚಾಲಕನಿಗೆ ಕರೆ ಮಾಡಿ", apmc: "ಎಪಿಎಂಸಿ ಸ್ಥಿತಿ", callFarmer: "ನೇರವಾಗಿ ರೈತನಿಗೆ ಕರೆ ಮಾಡಿ", waFarmer: "ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಸಂದೇಶ ಕಳುಹಿಸಿ", contactOptions: "ರೈತರನ್ನು ಸಂಪರ್ಕಿಸಿ", contactDesc: "ಚೇತನ್ ಕುಮಾರ್ ಅವರನ್ನು ನೀವು ಹೇಗೆ ಸಂಪರ್ಕಿಸಲು ಬಯಸುತ್ತೀರಿ?", close: "ಮುಚ್ಚಿ", expand: "ವಿವರಗಳನ್ನು ನೋಡಿ", collapse: "ವಿವರಗಳನ್ನು ಮರೆಮಾಡಿ" },
  hi: { track: "ऑर्डर ट्रैकिंग", orderReach: "कल पहुंचेगा", contact: "किसान से संपर्क करें", logistics: "लॉजिस्टिक्स डिस्पैच विवरण", vehicle: "वाहन", driver: "ड्राइवर", callDriver: "ड्राइवर को कॉल करें", apmc: "APMC स्थिति", callFarmer: "सीधे किसान को कॉल करें", waFarmer: "WhatsApp पर संदेश भेजें", contactOptions: "किसान से संपर्क करें", contactDesc: "आप चेतन कुमार से कैसे संपर्क करना चाहेंगे?", close: "बंद करें", expand: "विवरण देखें", collapse: "विवरण छिपाएं" }
} as const;

