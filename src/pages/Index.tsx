import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, Award, Briefcase, Calendar, CheckCircle, ChevronDown, ChevronUp, CloudSun, Globe2, IndianRupee, Leaf, LockKeyhole, LogOut, Map as MapIcon, MapPin, MessageCircle, Mic, Moon, Package, Phone, Search, ShieldCheck, ShoppingCart, Sprout, Star, Sun, Tractor, Truck, User, UserRound, Users, X } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FieldIntelligencePanel } from "@/components/FieldIntelligencePanel";
import { KrishiMap } from "@/components/KrishiMap";
import { getRegionContent, Language, RegionId, regions } from "@/data/krishiMysuru";
import { fpos } from "@/data/fpos";
import { buyerListings, fpoBulkLots, activeTracking, trackingLabels, type Listing } from "@/data/buyerData";
import { liveMandiPrices, rentalVehicles } from "@/data/marketData";
import { availableLabour } from "@/data/labourCrewData";
import { getCrops } from "@/services/cropService";

type AuthRole = "farmer" | "buyer" | "labourer";
type Role = "home" | "farmer" | "buyer" | "labourer" | "farmerAuth" | "buyerAuth" | "labourerAuth" | "farmerProfile";
type FarmerTab = "field" | "export" | "market" | "rent" | "fpo" | "labour" | "schemes";
type ViewState = { role: Role; farmerTab: FarmerTab };
type SchemeContent = { title: string; benefit: string; eligibility: string; description: string; tag: string; icon: string };
type Scheme = Record<Language, SchemeContent> & { id: string };
type ExportCropContent = { crop: string; destination: string; demand: string; profit: string; reason: string; tag: string; icon: string };
type ExportCrop = { district: string; id: string; flags: string } & Record<Language, ExportCropContent>;
type LabourJob = { id: number; title: Record<"en" | "kn", string>; location: Record<"en" | "kn", string>; wage: string; date: string; workTime?: string; perks?: string[]; totalSlots: number; filledSlots: number; isApplied: boolean };

const copy = {
  en: {
    hero: "Increase your income with smart farming",
    sub: "A smart farming companion for crops, climate, prices, buyers, labour and schemes.",
    farmer: "I am a Farmer", buyer: "I am a Buyer", labourer: "I am a Labourer", voice: "Voice help",
    stats: ["₹3,250/qtl tomato", "UAE demand ↑", "Ginger best crop"],
    tabs: { field: "Field Intelligence", export: "Export", market: "Prices", rent: "Rent", fpo: "FPO", labour: "Labour", schemes: "Schemes" },
    demand: "High Demand Crops Abroad", climate: "Climate & Prediction", market: "Market Intelligence", direct: "Direct Selling", fpo: "Farmer Groups", labour: "Labour Marketplace", schemes: "Government Schemes",
    best: "Best crop this month", sellNow: "Best time to sell", apply: "Apply now", contact: "Contact farmer", nearby: "Nearby jobs", wage: "Daily wage", track: "Order tracking", browse: "Browse crops",
    benefit: "Benefit", eligibility: "Eligibility", details: "Details", destination: "Target countries", profit: "Profit", reason: "Reason for demand",
    header: { welcome: "Welcome Back", logout: "Logout", buyerRole: "Buyer/Exporter", labourRole: "Agri-Labourer", guest: "Guest" },
  },
  kn: {
    hero: "ಸ್ಮಾರ್ಟ್ ಕೃಷಿಯಿಂದ ನಿಮ್ಮ ಆದಾಯ ಹೆಚ್ಚಿಸಿ",
    sub: "ಬೆಳೆ, ಹವಾಮಾನ, ಬೆಲೆ, ಖರೀದಿದಾರರು, ಕಾರ್ಮಿಕರು ಮತ್ತು ಯೋಜನೆಗಳಿಗೆ ಕೃಷಿ ಸಹಾಯಕ.",
    farmer: "ನಾನು ರೈತ", buyer: "ನಾನು ಖರೀದಿದಾರ", labourer: "ನಾನು ಕಾರ್ಮಿಕ", voice: "ಧ್ವನಿ ಸಹಾಯ",
    stats: ["ಟೊಮೆಟೊ ₹3,250/qtl", "UAE ಬೇಡಿಕೆ ↑", "ಶುಂಠಿ ಉತ್ತಮ ಬೆಳೆ"],
    tabs: { field: "ಕ್ಷೇತ್ರ ಮಾಹಿತಿ", export: "ರಫ್ತು", market: "ಬೆಲೆಗಳು", rent: "ಬಾಡಿಗೆ", fpo: "FPO", labour: "ಕಾರ್ಮಿಕ", schemes: "ಯೋಜನೆಗಳು" },
    demand: "ವಿದೇಶದಲ್ಲಿ ಹೆಚ್ಚು ಬೇಡಿಕೆಯ ಬೆಳೆಗಳು", climate: "ಹವಾಮಾನ ಮತ್ತು ಮುನ್ಸೂಚನೆ", market: "ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ", direct: "ನೇರ ಮಾರಾಟ", fpo: "ರೈತ ಗುಂಪುಗಳು", labour: "ಕಾರ್ಮಿಕ ಮಾರುಕಟ್ಟೆ", schemes: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    best: "ಈ ತಿಂಗಳ ಉತ್ತಮ ಬೆಳೆ", sellNow: "ಮಾರಾಟಕ್ಕೆ ಉತ್ತಮ ಸಮಯ", apply: "ಈಗ ಅರ್ಜಿ", contact: "ರೈತನನ್ನು ಸಂಪರ್ಕಿಸಿ", nearby: "ಹತ್ತಿರದ ಕೆಲಸಗಳು", wage: "ದಿನ ಕೂಲಿ", track: "ಆರ್ಡರ್ ಟ್ರ್ಯಾಕಿಂಗ್", browse: "ಬೆಳೆಗಳನ್ನು ನೋಡಿ",
    benefit: "ಲಾಭ", eligibility: "ಅರ್ಹತೆ", details: "ವಿವರಗಳು", destination: "ಗುರಿ ದೇಶಗಳು", profit: "ಲಾಭ", reason: "ಬೇಡಿಕೆಯ ಕಾರಣ",
    header: { welcome: "ಸ್ವಾಗತ", logout: "ಲಾಗ್ ಔಟ್", buyerRole: "ಖರೀದಿದಾರ/ರಫ್ತುದಾರ", labourRole: "ಕೃಷಿ ಕಾರ್ಮಿಕ", guest: "ಅತಿಥಿ" },
  },
  hi: {
    hero: "स्मार्ट खेती से अपनी आय बढ़ाएँ",
    sub: "फसल, मौसम, कीमत, खरीदार, मजदूर और योजनाओं के लिए स्मार्ट कृषि साथी।",
    farmer: "मैं किसान हूँ", buyer: "मैं खरीदार हूँ", labourer: "मैं मजदूर हूँ", voice: "वॉयस सहायता",
    stats: ["टमाटर ₹3,250/qtl", "UAE मांग ↑", "अदरक श्रेष्ठ फसल"],
    tabs: { field: "फील्ड इंटेलिजेंस", export: "निर्यात", market: "कीमतें", rent: "किराया", fpo: "FPO", labour: "मजदूर", schemes: "योजनाएँ" },
    demand: "विदेश में अधिक मांग वाली फसलें", climate: "मौसम और पूर्वानुमान", market: "बाज़ार जानकारी", direct: "सीधी बिक्री", fpo: "किसान समूह", labour: "मजदूर बाज़ार", schemes: "सरकारी योजनाएँ",
    best: "इस महीने की श्रेष्ठ फसल", sellNow: "बेचने का अच्छा समय", apply: "अभी आवेदन", contact: "किसान से संपर्क", nearby: "नज़दीकी काम", wage: "दैनिक मज़दूरी", track: "ऑर्डर ट्रैकिंग", browse: "फसलें देखें",
    benefit: "लाभ", eligibility: "पात्रता", details: "विवरण", destination: "लक्ष्य देश", profit: "लाभ", reason: "मांग का कारण",
    header: { welcome: "वापसी पर स्वागत है", logout: "लॉग आउट", buyerRole: "खरीदार/निर्यातक", labourRole: "कृषि-मजदूर", guest: "अतिथि" },
  },
} as const;

const exportCrops = [
  { district: "Mysuru", id: "mys_banana", flags: "🇦🇪 🇪🇺 🇺🇸", en: { crop: "Nanjangud Rasabale (Banana)", destination: "UAE, Europe, USA", demand: "Very High", profit: "+45%", reason: "Unique aroma and GI status; preferred as a luxury dessert fruit.", tag: "GI Protected", icon: "🍌" }, kn: { crop: "ನಂಜನಗೂಡು ರಸಬಾಳೆ", destination: "ಯುಎಇ, ಯುರೋಪ್, ಅಮೇರಿಕಾ", demand: "ಅತಿ ಹೆಚ್ಚು", profit: "+45%", reason: "ವಿಶಿಷ್ಟ ಸುಗಂಧ ಮತ್ತು ಜಿಐ ಟ್ಯಾಗ್; ಐಷಾರಾಮಿ ಹಣ್ಣಾಗಿ ವಿದೇಶಗಳಲ್ಲಿ ಬಳಕೆ.", tag: "ಜಿಕಾಯ್ ರಕ್ಷಿತ", icon: "🍌" }, hi: { crop: "नंजनगुड रसबाले केला", destination: "UAE, यूरोप, अमेरिका", demand: "बहुत अधिक", profit: "+45%", reason: "विशिष्ट सुगंध और GI टैग के कारण विदेशों में लक्ज़री फल के रूप में पसंद।", tag: "GI संरक्षित", icon: "🍌" } },
  { district: "Mandya", id: "man_jaggery", flags: "🇦🇪 🇰🇼 🇬🇧", en: { crop: "Organic Jaggery (Block/Powder)", destination: "UAE, Kuwait, UK", demand: "High", profit: "+35%", reason: "Chemical-free process; high demand in health-conscious Middle East markets.", tag: "Health-Tech", icon: "🍯" }, kn: { crop: "ಸಾವಯವ ಬೆಲ್ಲ", destination: "ಯುಎಇ, ಕುವೈತ್, ಯುಕೆ", demand: "ಹೆಚ್ಚು", profit: "+35%", reason: "ರಾಸಾಯನಿಕ ಮುಕ್ತ ತಯಾರಿ; ಅರಬ್ ದೇಶಗಳಲ್ಲಿ ಆರೋಗ್ಯಕರ ಸಕ್ಕರೆಯಾಗಿ ಬಳಕೆ.", tag: "ಹೆಲ್ತ್-ಟೆಕ್", icon: "🍯" }, hi: { crop: "ऑर्गेनिक गुड़", destination: "UAE, कुवैत, UK", demand: "अधिक", profit: "+35%", reason: "रसायन-मुक्त प्रक्रिया के कारण स्वास्थ्य-सचेत Middle East बाजारों में मांग।", tag: "हेल्थ-टेक", icon: "🍯" } },
  { district: "Chamarajanagar", id: "cha_turmeric", flags: "🇺🇸 🇩🇪 🇯🇵", en: { crop: "High-Curcumin Turmeric", destination: "USA, Germany, Japan", demand: "Very High", profit: "+40%", reason: "High curcumin content used in global pharmaceutical and cosmetic industries.", tag: "Industrial Grade", icon: "🌶️" }, kn: { crop: "ಅರಿಶಿನ (ಹೆಚ್ಚಿನ ಕುರ್ಕ್ಯುಮಿನ್)", destination: "ಅಮೇರಿಕಾ, ಜರ್ಮನಿ, ಜಪಾನ್", demand: "ಅತಿ ಹೆಚ್ಚು", profit: "+40%", reason: "ಔಷಧೀಯ ಮತ್ತು ಸೌಂದರ್ಯವರ್ಧಕ ಉದ್ದೇಶಗಳಿಗಾಗಿ ಜಾಗತಿಕ ಬೇಡಿಕೆ.", tag: "ಕೈಗಾರಿಕಾ ದರ್ಜೆ", icon: "🌶️" }, hi: { crop: "उच्च करक्यूमिन हल्दी", destination: "अमेरिका, जर्मनी, जापान", demand: "बहुत अधिक", profit: "+40%", reason: "अधिक करक्यूमिन के कारण फार्मा और कॉस्मेटिक उद्योगों में वैश्विक मांग।", tag: "औद्योगिक ग्रेड", icon: "🌶️" } },
  { district: "Kodagu", id: "kod_coffee", flags: "🇮🇹 🇳🇴 🇯🇵", en: { crop: "Monsooned Malabar Coffee", destination: "Italy, Norway, Japan", demand: "Stable/Premium", profit: "+50%", reason: "Unique processing method; high value in specialty coffee shops abroad.", tag: "Premium Blend", icon: "☕" }, kn: { crop: "ಮಾನ್ಸೂನ್ ಮಲಬಾರ್ ಕಾಫಿ", destination: "ಇಟಲಿ, ನಾರ್ವೆ, ಜಪಾನ್", demand: "ಸ್ಥಿರ/ಪ್ರೀಮಿಯಂ", profit: "+50%", reason: "ವಿಶಿಷ್ಟ ಸಂಸ್ಕರಣಾ ವಿಧಾನ; ವಿದೇಶಿ ಕೆಫೆಗಳಲ್ಲಿ ಅತ್ಯಂತ ಹೆಚ್ಚಿನ ಬೆಲೆ.", tag: "ಪ್ರೀಮಿಯಂ ಬ್ಲೆಂಡ್", icon: "☕" }, hi: { crop: "मॉनसून्ड मालाबार कॉफी", destination: "इटली, नॉर्वे, जापान", demand: "स्थिर/प्रीमियम", profit: "+50%", reason: "विशिष्ट प्रोसेसिंग के कारण विदेशों के specialty coffee shops में उच्च मूल्य।", tag: "प्रीमियम ब्लेंड", icon: "☕" } },
  { district: "Haveri (Byadgi)", id: "hav_chilli", flags: "🇺🇸 🇪🇺 🌏", en: { crop: "Byadgi Chilli (Oleoresin)", destination: "USA, Europe, Southeast Asia", demand: "Very High", profit: "+55%", reason: "Used for natural food coloring (Oleoresin) with zero heat/pungency.", tag: "Global GI", icon: "🌶️" }, kn: { crop: "ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ", destination: "ಅಮೇರಿಕಾ, ಯುರೋಪ್", demand: "ಅತಿ ಹೆಚ್ಚು", profit: "+55%", reason: "ನೈಸರ್ಗಿಕ ಆಹಾರ ಬಣ್ಣ ತಯಾರಿಸಲು ಅಂತರಾಷ್ಟ್ರೀಯ ಮಟ್ಟದಲ್ಲಿ ಬಳಕೆ.", tag: "ಜಾಗತಿಕ ಜಿಐ", icon: "🌶️" }, hi: { crop: "ब्याडगी मिर्च", destination: "अमेरिका, यूरोप, दक्षिण-पूर्व एशिया", demand: "बहुत अधिक", profit: "+55%", reason: "प्राकृतिक food coloring oleoresin के लिए अंतरराष्ट्रीय उपयोग।", tag: "वैश्विक GI", icon: "🌶️" } },
  { district: "Hassan", id: "has_potato", flags: "🇸🇬 🇱🇰", en: { crop: "Processing-Grade Potato", destination: "Singapore, Sri Lanka", demand: "Moderate", profit: "+25%", reason: "High starch content ideal for making chips and processed snacks.", tag: "Value Chain", icon: "🥔" }, kn: { crop: "ಸಂಸ್ಕರಣಾ ದರ್ಜೆಯ ಆಲೂಗಡ್ಡೆ", destination: "ಸಿಂಗಾಪುರ, ಶ್ರೀಲಂಕಾ", demand: "ಮಧ್ಯಮ", profit: "+25%", reason: "ಚಿಪ್ಸ್ ಮತ್ತು ಸಂಸ್ಕರಿಸಿದ ತಿಂಡಿಗಳ ತಯಾರಿಕೆಗೆ ಹೆಚ್ಚು ಸೂಕ್ತ.", tag: "ಮೌಲ್ಯವರ್ಧನೆ", icon: "🥔" }, hi: { crop: "प्रोसेसिंग-ग्रेड आलू", destination: "सिंगापुर, श्रीलंका", demand: "मध्यम", profit: "+25%", reason: "अधिक स्टार्च के कारण chips और processed snacks के लिए उपयुक्त।", tag: "वैल्यू चेन", icon: "🥔" } },
  { district: "Vijayapura/Bagalkot", id: "vij_grapes", flags: "🇳🇱 🇧🇩 🇦🇪", en: { crop: "Seedless Grapes / Pomegranate", destination: "Netherlands, Bangladesh, UAE", demand: "High", profit: "+38%", reason: "Excellent shelf life and size; high sugar content (Brix level).", tag: "Export Quality", icon: "🍇" }, kn: { crop: "ಬೀಜವಿಲ್ಲದ ದ್ರಾಕ್ಷಿ / ದಾಳಿಂಬೆ", destination: "ನೆದರ್ಲ್ಯಾಂಡ್ಸ್, ಬಾಂಗ್ಲಾದೇಶ, ಯುಎಇ", demand: "ಹೆಚ್ಚು", profit: "+38%", reason: "ದೀರ್ಘ ಬಾಳಿಕೆ ಮತ್ತು ಸಿಹಿ ಅಂಶ (Brix level) ಹೆಚ್ಚಿರುವುದರಿಂದ ಬೇಡಿಕೆ.", tag: "ರಫ್ತು ಗುಣಮಟ್ಟ", icon: "🍇" }, hi: { crop: "बीजरहित अंगूर / अनार", destination: "नीदरलैंड, बांग्लादेश, UAE", demand: "अधिक", profit: "+38%", reason: "बेहतरीन shelf life, आकार और अधिक मिठास (Brix level) के कारण मांग।", tag: "निर्यात गुणवत्ता", icon: "🍇" } },
] satisfies ExportCrop[];
const priceTrend = [{ v: 28 }, { v: 34 }, { v: 31 }, { v: 42 }, { v: 48 }, { v: 54 }, { v: 61 }];
const initialLabourJobs: LabourJob[] = [
  { id: 1, title: { en: "Banana Harvesting", kn: "ಬಾಳೆಹಣ್ಣು ಕೊಯ್ಲು" }, location: { en: "Nanjangud, Mysuru", kn: "ನಂಜನಗೂಡು, ಮೈಸೂರು" }, wage: "650", date: "2026-05-12", totalSlots: 10, filledSlots: 7, isApplied: false },
  { id: 2, title: { en: "Coffee Bean Picking", kn: "ಕಾಫಿ ಬೀಜ ಆರಿಸುವುದು" }, location: { en: "Somwarpet, Kodagu", kn: "ಸೋಮವಾರಪೇಟೆ, ಕೊಡಗು" }, wage: "550", date: "2026-05-15", totalSlots: 20, filledSlots: 18, isApplied: false },
  { id: 3, title: { en: "Silk Cocoon Sorting", kn: "ರೇಷ್ಮೆ ಗೂಡು ವಿಂಗಡಣೆ" }, location: { en: "Ramanagara / Mysuru", kn: "ರಾಮನಗರ / ಮೈಸೂರು" }, wage: "500", date: "2026-05-18", workTime: "9 AM - 5 PM", perks: ["meals"], totalSlots: 15, filledSlots: 5, isApplied: false },
  { id: 4, title: { en: "Turmeric Cleaning & Boiling", kn: "ಅರಿಶಿನ ಸ್ವಚ್ಛಗೊಳಿಸುವಿಕೆ" }, location: { en: "Chamarajanagar", kn: "ಚಾಮರಾಜನಗರ" }, wage: "700", date: "2026-05-20", workTime: "8 AM - 4 PM", perks: ["meals", "transport"], totalSlots: 12, filledSlots: 2, isApplied: false },
  { id: 5, title: { en: "Areca Nut Peeling", kn: "ಅಡಿಕೆ ಸುಲಿಯುವುದು" }, location: { en: "Shivamogga / Chikmagalur", kn: "ಶಿವಮೊಗ್ಗ / ಚಿಕ್ಕಮಗಳೂರು" }, wage: "450", date: "2026-05-22", workTime: "8 AM - 5 PM", perks: ["equipment"], totalSlots: 30, filledSlots: 25, isApplied: false },
  { id: 6, title: { en: "Sugarcane Cutting", kn: "ಕಬ್ಬು ಕಟಾವು ಮಾಡುವುದು" }, location: { en: "Mandya", kn: "ಮಂಡ್ಯ" }, wage: "800", date: "2026-05-14", workTime: "6 AM - 2 PM", perks: ["transport", "meals"], totalSlots: 25, filledSlots: 10, isApplied: false },
  { id: 7, title: { en: "Black Pepper Harvesting", kn: "ಕಪ್ಪು ಮೆಣಸು ಕೊಯ್ಲು" }, location: { en: "Madikeri, Kodagu", kn: "ಮಡಿಕೇರಿ, ಕೊಡಗು" }, wage: "600", date: "2026-05-25", workTime: "8 AM - 4 PM", perks: ["equipment", "meals"], totalSlots: 8, filledSlots: 3, isApplied: false },
  { id: 8, title: { en: "Tobacco Leaf Curing", kn: "ಹೊಗೆಸೊಪ್ಪು ಹದ ಮಾಡುವುದು" }, location: { en: "Hunsur / Periyapatna", kn: "ಹುಣಸೂರು / ಪಿರಿಯಾಪಟ್ಟಣ" }, wage: "750", date: "2026-05-16", workTime: "10 AM - 6 PM", perks: ["transport"], totalSlots: 20, filledSlots: 12, isApplied: false },
  { id: 9, title: { en: "Jasmine Flower Plucking", kn: "ಮಲ್ಲಿಗೆ ಹೂವು ಕೀಳುವುದು" }, location: { en: "Mysuru City Outskirts", kn: "ಮೈಸೂರು ಹೊರವಲಯ" }, wage: "400", date: "2026-05-11", workTime: "5 AM - 10 AM", perks: ["transport"], totalSlots: 50, filledSlots: 40, isApplied: false },
  { id: 10, title: { en: "Tractor Driver", kn: "ಟ್ರಾಕ್ಟರ್ ಚಾಲಕ" }, location: { en: "K.R. Nagar", kn: "ಕೆ.ಆರ್. ನಗರ" }, wage: "900", date: "2026-05-13", workTime: "8 AM - 5 PM", perks: ["meals"], totalSlots: 2, filledSlots: 1, isApplied: false },
  { id: 11, title: { en: "Warehouse Loading", kn: "ಗೋದಾಮು ಲೋಡಿಂಗ್" }, location: { en: "APMC Bandipalya, Mysuru", kn: "ಬಂದಿಪಾಳ್ಯ ಎಪಿಎಂಸಿ" }, wage: "850", date: "2026-05-14", workTime: "9 AM - 6 PM", perks: ["equipment"], totalSlots: 40, filledSlots: 20, isApplied: false },
  { id: 12, title: { en: "Drip Irrigation Setup", kn: "ಹನಿ ನೀರಾವರಿ ಅಳವಡಿಕೆ" }, location: { en: "T. Narasipura", kn: "ಟಿ. ನರಸೀಪುರ" }, wage: "750", date: "2026-05-19", workTime: "8 AM - 4 PM", perks: ["transport", "equipment"], totalSlots: 5, filledSlots: 0, isApplied: false },
];
const labourCopy = {
  en: { wage: "per day", apply: "Apply Now", applied: "Applied", slots: "Slots Left", find: "Find Nearby Work" },
  kn: { wage: "ಪ್ರತಿದಿನ", apply: "ಈಗಲೇ ಅನ್ವಯಿಸಿ", applied: "ಅನ್ವಯಿಸಲಾಗಿದೆ", slots: "ಖಾಲಿ ಇರುವ ಸ್ಥಾನಗಳು", find: "ಹತ್ತಿರದ ಕೆಲಸ ಹುಡುಕಿ" },
  hi: { wage: "per day", apply: "Apply Now", applied: "Applied", slots: "Slots Left", find: "Find Nearby Work" },
} as const;

const loginLabels = {
  en: { title: "Farmer Login", welcome: "Welcome back, Farmer", subtitle: "Access your smart farm intelligence", phonePlaceholder: "Enter 10-digit mobile number", aadhaarLogin: "Login with Aadhaar Number", btnRequest: "Send OTP", btnVerify: "Verify & Enter", resend: "Resend OTP", newMember: "New Farmer? Create Account", registerTitle: "Create Farmer Account", fullName: "Full Name", district: "District", crop: "Primary Crop", fid: "Link your FID (Farmer ID)", register: "Register & Verify", secureNote: "Your data is secured by 256-bit encryption", profile: "Farmer Profile", dashboard: "Enter Farmer Dashboard", logout: "Logout" },
  kn: { title: "ರೈತರ ಲಾಗಿನ್", welcome: "ಮತ್ತೆ ಸ್ವಾಗತ, ರೈತರೆ", subtitle: "ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಫಾರ್ಮ್ ಮಾಹಿತಿಯನ್ನು ಪ್ರವೇಶಿಸಿ", phonePlaceholder: "10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ", aadhaarLogin: "ಆಧಾರ್ ಸಂಖ್ಯೆಯಿಂದ ಲಾಗಿನ್", btnRequest: "OTP ಕಳುಹಿಸಿ", btnVerify: "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಪ್ರವೇಶಿಸಿ", resend: "OTP ಮತ್ತೆ ಕಳುಹಿಸಿ", newMember: "ಹೊಸ ರೈತರೇ? ಖಾತೆಯನ್ನು ರಚಿಸಿ", registerTitle: "ರೈತರ ಖಾತೆ ರಚಿಸಿ", fullName: "ಪೂರ್ಣ ಹೆಸರು", district: "ಜಿಲ್ಲೆ", crop: "ಮುಖ್ಯ ಬೆಳೆ", fid: "ನಿಮ್ಮ FID (ರೈತ ಐಡಿ) ಲಿಂಕ್ ಮಾಡಿ", register: "ನೋಂದಣಿ ಮಾಡಿ", secureNote: "ನಿಮ್ಮ ಡೇಟಾ ಸುರಕ್ಷಿತವಾಗಿದೆ", profile: "ರೈತರ ಪ್ರೊಫೈಲ್", dashboard: "ರೈತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ", logout: "ಲಾಗೌಟ್" },
  hi: { title: "किसान लॉगिन", welcome: "वापसी पर स्वागत है, किसान", subtitle: "अपनी स्मार्ट फार्म जानकारी देखें", phonePlaceholder: "10 अंकों का मोबाइल नंबर डालें", aadhaarLogin: "आधार नंबर से लॉगिन", btnRequest: "OTP भेजें", btnVerify: "सत्यापित करें", resend: "OTP फिर भेजें", newMember: "नए किसान? खाता बनाएँ", registerTitle: "किसान खाता बनाएँ", fullName: "पूरा नाम", district: "जिला", crop: "मुख्य फसल", fid: "अपना FID (Farmer ID) लिंक करें", register: "रजिस्टर करें", secureNote: "आपका डेटा सुरक्षित है", profile: "किसान प्रोफाइल", dashboard: "किसान डैशबोर्ड खोलें", logout: "लॉगआउट" },
} as const;

const buyerLoginLabels = {
  en: { title: "Buyer Login", welcome: "Welcome back, Buyer", subtitle: "Source crops directly from verified farmers", phonePlaceholder: "Enter 10-digit mobile number", aadhaarLogin: "Login with GSTIN", btnRequest: "Send OTP", btnVerify: "Verify & Enter", resend: "Resend OTP", newMember: "New Buyer? Create Account", registerTitle: "Create Buyer Account", fullName: "Full Name", district: "District", company: "Company / Business Name", gstin: "GSTIN (optional)", register: "Register & Verify", secureNote: "Your data is secured by 256-bit encryption", profile: "Buyer Profile", dashboard: "Enter Buyer Dashboard", logout: "Logout" },
  kn: { title: "ಖರೀದಿದಾರರ ಲಾಗಿನ್", welcome: "ಮತ್ತೆ ಸ್ವಾಗತ, ಖರೀದಿದಾರರೆ", subtitle: "ಪರಿಶೀಲಿತ ರೈತರಿಂದ ನೇರವಾಗಿ ಬೆಳೆಗಳನ್ನು ಖರೀದಿಸಿ", phonePlaceholder: "10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ", aadhaarLogin: "GSTIN ಯಿಂದ ಲಾಗಿನ್", btnRequest: "OTP ಕಳುಹಿಸಿ", btnVerify: "ಪರಿಶೀಲಿಸಿ", resend: "OTP ಮತ್ತೆ ಕಳುಹಿಸಿ", newMember: "ಹೊಸ ಖರೀದಿದಾರರೇ? ಖಾತೆ ರಚಿಸಿ", registerTitle: "ಖರೀದಿದಾರ ಖಾತೆ ರಚಿಸಿ", fullName: "ಪೂರ್ಣ ಹೆಸರು", district: "ಜಿಲ್ಲೆ", company: "ಕಂಪನಿ / ವ್ಯವಹಾರ ಹೆಸರು", gstin: "GSTIN (ಐಚ್ಛಿಕ)", register: "ನೋಂದಣಿ ಮಾಡಿ", secureNote: "ನಿಮ್ಮ ಡೇಟಾ ಸುರಕ್ಷಿತ", profile: "ಖರೀದಿದಾರ ಪ್ರೊಫೈಲ್", dashboard: "ಖರೀದಿದಾರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ", logout: "ಲಾಗೌಟ್" },
  hi: { title: "खरीदार लॉगिन", welcome: "वापसी पर स्वागत है, खरीदार", subtitle: "सत्यापित किसानों से सीधे फसल खरीदें", phonePlaceholder: "10 अंकों का मोबाइल नंबर डालें", aadhaarLogin: "GSTIN से लॉगिन", btnRequest: "OTP भेजें", btnVerify: "सत्यापित करें", resend: "OTP फिर भेजें", newMember: "नए खरीदार? खाता बनाएँ", registerTitle: "खरीदार खाता बनाएँ", fullName: "पूरा नाम", district: "जिला", company: "कंपनी / व्यवसाय नाम", gstin: "GSTIN (वैकल्पिक)", register: "रजिस्टर करें", secureNote: "आपका डेटा सुरक्षित है", profile: "खरीदार प्रोफाइल", dashboard: "खरीदार डैशबोर्ड खोलें", logout: "लॉगआउट" },
} as const;

const labourerLoginLabels = {
  en: { title: "Labourer Login", welcome: "Welcome back, Worker", subtitle: "Find verified daily wage work near you", phonePlaceholder: "Enter 10-digit mobile number", aadhaarLogin: "Login with Aadhaar Number", btnRequest: "Send OTP", btnVerify: "Verify & Enter", resend: "Resend OTP", newMember: "New Worker? Create Account", registerTitle: "Create Worker Account", fullName: "Full Name", district: "District", skills: "Skills (Harvesting, Sowing, Driver…)", experience: "Years of experience", register: "Register & Verify", secureNote: "Your data is secured by 256-bit encryption", profile: "Worker Profile", dashboard: "Find Nearby Work", logout: "Logout" },
  kn: { title: "ಕಾರ್ಮಿಕರ ಲಾಗಿನ್", welcome: "ಮತ್ತೆ ಸ್ವಾಗತ", subtitle: "ನಿಮ್ಮ ಹತ್ತಿರದ ಪರಿಶೀಲಿತ ದಿನಗೂಲಿ ಕೆಲಸ ಹುಡುಕಿ", phonePlaceholder: "10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ", aadhaarLogin: "ಆಧಾರ್ ಸಂಖ್ಯೆಯಿಂದ ಲಾಗಿನ್", btnRequest: "OTP ಕಳುಹಿಸಿ", btnVerify: "ಪರಿಶೀಲಿಸಿ", resend: "OTP ಮತ್ತೆ ಕಳುಹಿಸಿ", newMember: "ಹೊಸ ಕಾರ್ಮಿಕರೇ? ಖಾತೆ ರಚಿಸಿ", registerTitle: "ಕಾರ್ಮಿಕ ಖಾತೆ ರಚಿಸಿ", fullName: "ಪೂರ್ಣ ಹೆಸರು", district: "ಜಿಲ್ಲೆ", skills: "ಕೌಶಲ್ಯಗಳು (ಕೊಯ್ಲು, ಬಿತ್ತನೆ…)", experience: "ಅನುಭವದ ವರ್ಷಗಳು", register: "ನೋಂದಣಿ ಮಾಡಿ", secureNote: "ನಿಮ್ಮ ಡೇಟಾ ಸುರಕ್ಷಿತ", profile: "ಕಾರ್ಮಿಕ ಪ್ರೊಫೈಲ್", dashboard: "ಹತ್ತಿರದ ಕೆಲಸ ಹುಡುಕಿ", logout: "ಲಾಗೌಟ್" },
  hi: { title: "मजदूर लॉगिन", welcome: "वापसी पर स्वागत है", subtitle: "अपने पास सत्यापित दैनिक काम खोजें", phonePlaceholder: "10 अंकों का मोबाइल नंबर डालें", aadhaarLogin: "आधार नंबर से लॉगिन", btnRequest: "OTP भेजें", btnVerify: "सत्यापित करें", resend: "OTP फिर भेजें", newMember: "नए मजदूर? खाता बनाएँ", registerTitle: "मजदूर खाता बनाएँ", fullName: "पूरा नाम", district: "जिला", skills: "कौशल (कटाई, बुवाई, ड्राइवर…)", experience: "अनुभव (वर्ष)", register: "रजिस्टर करें", secureNote: "आपका डेटा सुरक्षित है", profile: "मजदूर प्रोफाइल", dashboard: "नज़दीकी काम खोजें", logout: "लॉगआउट" },
} as const;

const profileLabels = {
  en: { title: "Professional Farmer Profile", verified: "Verified Farmer", fid: "Unique Farmer ID", member: "Member Since", location: "Location", experience: "Experience", land: "Land Area", crops: "Primary Crops", soil: "Soil Health", gi: "GI-Tag Crop Highlight", rating: "Community Rating", achievements: "Achievements", portfolio: "Digital Farm Card", logout: "Logout", confirmTitle: "Are you sure you want to logout?", confirmBody: "Your secure farmer session will be cleared and you will return to role selection.", cancel: "Cancel", confirm: "Yes, logout" },
  kn: { title: "ವೃತ್ತಿಪರ ರೈತ ಪ್ರೊಫೈಲ್", verified: "ಪರಿಶೀಲಿಸಿದ ರೈತ", fid: "ವಿಶಿಷ್ಟ ರೈತ ಐಡಿ", member: "ಸದಸ್ಯರಾದ ವರ್ಷ", location: "ಸ್ಥಳ", experience: "ಅನುಭವ", land: "ಭೂಮಿ ವಿಸ್ತೀರ್ಣ", crops: "ಮುಖ್ಯ ಬೆಳೆಗಳು", soil: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ", gi: "ಜಿಐ ಟ್ಯಾಗ್ ಬೆಳೆ ವಿಶೇಷತೆ", rating: "ಸಮುದಾಯ ರೇಟಿಂಗ್", achievements: "ಸಾಧನೆಗಳು", portfolio: "ಡಿಜಿಟಲ್ ಫಾರ್ಮ್ ಕಾರ್ಡ್", logout: "ಲಾಗ್ ಔಟ್", confirmTitle: "ನೀವು ಲಾಗ್ ಔಟ್ ಮಾಡಲು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?", confirmBody: "ನಿಮ್ಮ ಸುರಕ್ಷಿತ ರೈತ ಸೆಷನ್ ತೆರವುಗೊಳ್ಳುತ್ತದೆ ಮತ್ತು ಪಾತ್ರ ಆಯ್ಕೆ ಪುಟಕ್ಕೆ ಮರಳುತ್ತೀರಿ.", cancel: "ರದ್ದು", confirm: "ಹೌದು, ಲಾಗ್ ಔಟ್" },
  hi: { title: "Professional Farmer Profile", verified: "Verified Farmer", fid: "Unique Farmer ID", member: "Member Since", location: "Location", experience: "Experience", land: "Land Area", crops: "Primary Crops", soil: "Soil Health", gi: "GI-Tag Crop Highlight", rating: "Community Rating", achievements: "Achievements", portfolio: "Digital Farm Card", logout: "Logout", confirmTitle: "Are you sure you want to logout?", confirmBody: "Your secure farmer session will be cleared and you will return to role selection.", cancel: "Cancel", confirm: "Yes, logout" },
} as const;

const professionalFarmer = {
  name: "Basavaraju M",
  fid: "KA-MYS-2026-889",
  location: { en: "Nanjangud, Mysuru", kn: "ನಂಜನಗೂಡು, ಮೈಸೂರು", hi: "Nanjangud, Mysuru" },
  experience: "15 Years",
  achievements: ["Organic Pioneer", "Top Employer", "Quality Certified", "Best Yield 2025"],
  farm: { size: "4.5 Acres", soil: { en: "Red Clayey Loam", kn: "ಕೆಂಪು ಜೇಡಿ ಮಣ್ಣು", hi: "Red Clayey Loam" }, crops: ["Banana", "Silk"] },
};

const governmentSchemes = [
  { id: "pm_kisan", en: { title: "PM-KISAN", benefit: "₹6,000 yearly", eligibility: "Landholding farmers", description: "Direct income support in 3 equal installments.", tag: "Central Sector", icon: "💰" }, kn: { title: "ಪಿಎಂ-ಕಿಸಾನ್", benefit: "ವರ್ಷಕ್ಕೆ ₹6,000", eligibility: "ಭೂಮಿ ಹೊಂದಿರುವ ರೈತರು", description: "3 ಸಮಾನ ಕಂತುಗಳಲ್ಲಿ ನೇರ ಆದಾಯ ಬೆಂಬಲ.", tag: "ಕೇಂದ್ರ ವಲಯ", icon: "💰" }, hi: { title: "पीएम-किसान", benefit: "₹6,000 प्रति वर्ष", eligibility: "भूमि रखने वाले किसान", description: "3 समान किस्तों में सीधा आय समर्थन।", tag: "केंद्रीय क्षेत्र", icon: "💰" } },
  { id: "pm_kmy", en: { title: "PM Kisan Maandhan (PM-KMY)", benefit: "₹3,000 monthly pension", eligibility: "Small farmers (Age 18-40)", description: "Old age pension security after attaining 60 years.", tag: "Pension", icon: "👴" }, kn: { title: "ಪಿಎಂ ಕಿಸಾನ್ ಮಾಂಧನ್", benefit: "₹3,000 ಮಾಸಿಕ ಪಿಂಚಣಿ", eligibility: "ಸಣ್ಣ ರೈತರು (ವಯಸ್ಸು 18-40)", description: "60 ವರ್ಷ ತುಂಬಿದ ನಂತರ ವೃದ್ಧಾಪ್ಯ ಪಿಂಚಣಿ ಭದ್ರತೆ.", tag: "ಪಿಂಚಣಿ", icon: "👴" }, hi: { title: "पीएम किसान मानधन", benefit: "₹3,000 मासिक पेंशन", eligibility: "छोटे किसान (उम्र 18-40)", description: "60 वर्ष के बाद वृद्धावस्था पेंशन सुरक्षा।", tag: "पेंशन", icon: "👴" } },
  { id: "pmfby", en: { title: "PM Fasal Bima Yojana", benefit: "Comprehensive Insurance", eligibility: "All notified crops", description: "Insurance against all natural risks from pre-sowing to harvest.", tag: "Insurance", icon: "🛡️" }, kn: { title: "ಪಿಎಂ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ", benefit: "ಸಮಗ್ರ ವಿಮೆ", eligibility: "ಅಧಿಸೂಚಿತ ಬೆಳೆಗಳು", description: "ಬಿತ್ತನೆಯಿಂದ ಕೊಯ್ಲಿನವರೆಗಿನ ಎಲ್ಲಾ ನೈಸರ್ಗಿಕ ಅಪಾಯಗಳ ವಿರುದ್ಧ ವಿಮೆ.", tag: "ವಿಮೆ", icon: "🛡️" }, hi: { title: "पीएम फसल बीमा योजना", benefit: "व्यापक बीमा", eligibility: "सभी अधिसूचित फसलें", description: "बुवाई से कटाई तक प्राकृतिक जोखिमों के विरुद्ध बीमा।", tag: "बीमा", icon: "🛡️" } },
  { id: "miss_loan", en: { title: "Modified Interest Subvention", benefit: "Loans at 4% interest", eligibility: "Short term crop loans", description: "3% additional subvention for prompt repayment on loans up to ₹3L.", tag: "Credit", icon: "🏦" }, kn: { title: "ಬಡ್ಡಿ ಸಹಾಯಧನ ಯೋಜನೆ", benefit: "4% ಬಡ್ಡಿಯಲ್ಲಿ ಸಾಲ", eligibility: "ಅಲ್ಪಾವಧಿ ಬೆಳೆ ಸಾಲಗಳು", description: "ಸಕಾಲದಲ್ಲಿ ಮರುಪಾವತಿ ಮಾಡಿದರೆ ಹೆಚ್ಚುವರಿ 3% ಬಡ್ಡಿ ರಿಯಾಯಿತಿ.", tag: "ಸಾಲ", icon: "🏦" }, hi: { title: "ब्याज सहायता योजना", benefit: "4% ब्याज पर ऋण", eligibility: "अल्पकालिक फसल ऋण", description: "₹3 लाख तक के ऋण पर समय पर भुगतान के लिए 3% अतिरिक्त छूट।", tag: "ऋण", icon: "🏦" } },
  { id: "aif", en: { title: "Agri Infra Fund (AIF)", benefit: "3% Interest Subvention", eligibility: "Startups, FPOs, PACS", description: "Medium-long term debt for post-harvest management infrastructure.", tag: "Infrastructure", icon: "🏭" }, kn: { title: "ಕೃಷಿ ಮೂಲಸೌಕರ್ಯ ನಿಧಿ", benefit: "3% ಬಡ್ಡಿ ಸಹಾಯಧನ", eligibility: "ಸ್ಟಾರ್ಟ್‌ಅಪ್‌ಗಳು, FPO ಗಳು", description: "ಕೊಯ್ಲಿನ ನಂತರದ ಮೂಲಸೌಕರ್ಯ ನಿರ್ವಹಣೆಗಾಗಿ ದೀರ್ಘಾವಧಿ ಸಾಲ.", tag: "ಮೂಲಸೌಕರ್ಯ", icon: "🏭" }, hi: { title: "कृषि इंफ्रा फंड", benefit: "3% ब्याज सहायता", eligibility: "स्टार्टअप, FPO, PACS", description: "कटाई के बाद प्रबंधन ढांचे के लिए मध्यम-दीर्घकालिक ऋण।", tag: "इंफ्रास्ट्रक्चर", icon: "🏭" } },
  { id: "fpo_promotion", en: { title: "10,000 FPOs Scheme", benefit: "₹18 Lakh financial aid", eligibility: "Groups of farmers", description: "Professional support to form Farmer Producer Organizations.", tag: "Group Farming", icon: "🤝" }, kn: { title: "10,000 FPO ಗಳ ರಚನೆ", benefit: "₹18 ಲಕ್ಷ ಆರ್ಥಿಕ ನೆರವು", eligibility: "ರೈತ ಗುಂಪುಗಳು", description: "ರೈತ ಉತ್ಪಾದಕ ಸಂಸ್ಥೆಗಳನ್ನು ರಚಿಸಲು ವೃತ್ತಿಪರ ಬೆಂಬಲ.", tag: "ಗುಂಪು ಕೃಷಿ", icon: "🤝" }, hi: { title: "10,000 FPO योजना", benefit: "₹18 लाख वित्तीय सहायता", eligibility: "किसान समूह", description: "किसान उत्पादक संगठन बनाने के लिए पेशेवर समर्थन।", tag: "समूह खेती", icon: "🤝" } },
  { id: "nbhm", en: { title: "Honey Mission (NBHM)", benefit: "Scientific Beekeeping Support", eligibility: "Registered beekeepers", description: "Promotion of 'Sweet Revolution' through scientific apiculture.", tag: "Beekeeping", icon: "🐝" }, kn: { title: "ಜೇನು ಸಾಕಣೆ ಮಿಷನ್", benefit: "ವೈಜ್ಞಾನಿಕ ಜೇನುಸಾಕಣೆ ಬೆಂಬಲ", eligibility: "ನೋಂದಾಯಿತ ಜೇನುಸಾಕಣೆದಾರರು", description: "ವೈಜ್ಞಾನಿಕ ಕೃಷಿಯ ಮೂಲಕ 'ಸಿಹಿ ಕ್ರಾಂತಿ'ಯ ಪ್ರಚಾರ.", tag: "ಜೇನು ಸಾಕಣೆ", icon: "🐝" }, hi: { title: "हनी मिशन", benefit: "वैज्ञानिक मधुमक्खी पालन समर्थन", eligibility: "पंजीकृत मधुमक्खी पालक", description: "वैज्ञानिक मधुमक्खी पालन से स्वीट रिवोल्यूशन को बढ़ावा।", tag: "मधुमक्खी पालन", icon: "🐝" } },
  { id: "drone_didi", en: { title: "Namo Drone Didi", benefit: "80% Subsidy on Drones", eligibility: "Women SHGs", description: "Providing drones for rental services to local farmers.", tag: "Technology", icon: "🚁" }, kn: { title: "ನಮೋ ಡ್ರೋನ್ ದೀದಿ", benefit: "80% ಡ್ರೋನ್ ಸಹಾಯಧನ", eligibility: "ಮಹಿಳಾ ಸ್ವಸಹಾಯ ಸಂಘಗಳು", description: "ಸ್ಥಳೀಯ ರೈತರಿಗೆ ಬಾಡಿಗೆ ಸೇವೆ ನೀಡಲು ಡ್ರೋನ್ ಒದಗಿಸುವುದು.", tag: "ತಂತ್ರಜ್ಞಾನ", icon: "🚁" }, hi: { title: "नमो ड्रोन दीदी", benefit: "ड्रोन पर 80% सब्सिडी", eligibility: "महिला स्वयं सहायता समूह", description: "स्थानीय किसानों को किराये की सेवा के लिए ड्रोन।", tag: "तकनीक", icon: "🚁" } },
  { id: "rkvy_dpr", en: { title: "RKVY-DPR", benefit: "Infrastructure Grants", eligibility: "States & Agri-Startups", description: "Support for pre & post-harvest infrastructure creation.", tag: "Development", icon: "🏗️" }, kn: { title: "RKVY-DPR", benefit: "ಮೂಲಸೌಕರ್ಯ ಅನುದಾನ", eligibility: "ರಾಜ್ಯಗಳು ಮತ್ತು ಸ್ಟಾರ್ಟ್‌ಅಪ್‌ಗಳು", description: "ಕೊಯ್ಲಿಗೆ ಮೊದಲು ಮತ್ತು ನಂತರದ ಮೂಲಸೌಕರ್ಯ ರಚನೆಗೆ ಬೆಂಬಲ.", tag: "ಅಭಿವೃದ್ಧಿ", icon: "🏗️" }, hi: { title: "RKVY-DPR", benefit: "इंफ्रास्ट्रक्चर अनुदान", eligibility: "राज्य और कृषि स्टार्टअप", description: "कटाई से पहले और बाद के ढांचे के लिए समर्थन।", tag: "विकास", icon: "🏗️" } },
  { id: "shc", en: { title: "Soil Health Card (SHC)", benefit: "Free Soil Testing", eligibility: "All Farmers", description: "Nutrient status report with dosage recommendations.", tag: "Soil Health", icon: "🌱" }, kn: { title: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್", benefit: "ಉಚಿತ ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ", eligibility: "ಎಲ್ಲಾ ರೈತರು", description: "ಪೋಷಕಾಂಶಗಳ ಸ್ಥಿತಿ ಮತ್ತು ಶಿಫಾರಸುಗಳ ವರದಿ.", tag: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ", icon: "🌱" }, hi: { title: "मृदा स्वास्थ्य कार्ड", benefit: "मुफ्त मिट्टी परीक्षण", eligibility: "सभी किसान", description: "पोषक तत्व स्थिति और मात्रा सिफारिश रिपोर्ट।", tag: "मिट्टी स्वास्थ्य", icon: "🌱" } },
  { id: "pdmc", en: { title: "Per Drop More Crop", benefit: "Micro Irrigation Subsidy", eligibility: "Individual Farmers", description: "Drip and Sprinkler systems to improve water efficiency.", tag: "Water", icon: "💧" }, kn: { title: "ಪ್ರತಿ ಹನಿ ಹೆಚ್ಚು ಬೆಳೆ", benefit: "ಸೂಕ್ಷ್ಮ ನೀರಾವರಿ ಸಹಾಯಧನ", eligibility: "ವೈಯಕ್ತಿಕ ರೈತರು", description: "ಹನಿ ಮತ್ತು ತುಂತುರು ನೀರಾವರಿ ಮೂಲಕ ನೀರಿನ ಉಳಿತಾಯ.", tag: "ನೀರು", icon: "💧" }, hi: { title: "पर ड्रॉप मोर क्रॉप", benefit: "सूक्ष्म सिंचाई सब्सिडी", eligibility: "व्यक्तिगत किसान", description: "ड्रिप और स्प्रिंकलर से जल दक्षता बढ़ाना।", tag: "पानी", icon: "💧" } },
  { id: "pkvy", en: { title: "Paramparagat Krishi (PKVY)", benefit: "₹31,500/ha assistance", eligibility: "Organic clusters", description: "Financial aid for organic practices and certification.", tag: "Organic", icon: "🌿" }, kn: { title: "ಪರಂಪರಾಗತ ಕೃಷಿ ವಿಕಾಸ", benefit: "₹31,500/ಹೆಕ್ಟೇರ್ ನೆರವು", eligibility: "ಸಾವಯವ ಗುಂಪುಗಳು", description: "ಸಾವಯವ ಕೃಷಿ ಮತ್ತು ಪ್ರಮಾಣೀಕರಣಕ್ಕಾಗಿ ಆರ್ಥಿಕ ನೆರವು.", tag: "ಸಾವಯವ", icon: "🌿" }, hi: { title: "परंपरागत कृषि विकास", benefit: "₹31,500/हेक्टेयर सहायता", eligibility: "जैविक क्लस्टर", description: "जैविक खेती और प्रमाणन के लिए वित्तीय सहायता।", tag: "जैविक", icon: "🌿" } },
  { id: "smam", en: { title: "Agri Mechanization (SMAM)", benefit: "Machinery Subsidies", eligibility: "Small/Marginal Farmers", description: "Subsidies for Tractors and Custom Hiring Centres.", tag: "Machinery", icon: "🚜" }, kn: { title: "ಕೃಷಿ ಯಾಂತ್ರೀಕರಣ", benefit: "ಯಂತ್ರೋಪಕರಣ ಸಹಾಯಧನ", eligibility: "ಸಣ್ಣ ರೈತರು", description: "ಟ್ರಾಕ್ಟರ್ ಮತ್ತು ಬಾಡಿಗೆ ಕೇಂದ್ರಗಳಿಗೆ ಸಹಾಯಧನ.", tag: "ಯಂತ್ರೋಪಕರಣ", icon: "🚜" }, hi: { title: "कृषि यंत्रीकरण", benefit: "मशीनरी सब्सिडी", eligibility: "छोटे/सीमांत किसान", description: "ट्रैक्टर और कस्टम हायरिंग केंद्रों के लिए सब्सिडी।", tag: "मशीनरी", icon: "🚜" } },
  { id: "nfsm", en: { title: "Food Security (NFSM)", benefit: "Production Support", eligibility: "Pulse & Millet Farmers", description: "Restoring soil fertility and enhancing farm economy.", tag: "Food Security", icon: "🌾" }, kn: { title: "ರಾಷ್ಟ್ರೀಯ ಆಹಾರ ಭದ್ರತೆ", benefit: "ಉತ್ಪಾದನಾ ಬೆಂಬಲ", eligibility: "ಧಾನ್ಯ ಮತ್ತು ಸಿರಿಧಾನ್ಯ ರೈತರು", description: "ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಮತ್ತು ಕೃಷಿ ಆರ್ಥಿಕತೆ ಸುಧಾರಣೆ.", tag: "ಆಹಾರ ಭದ್ರತೆ", icon: "🌾" }, hi: { title: "राष्ट्रीय खाद्य सुरक्षा", benefit: "उत्पादन समर्थन", eligibility: "दलहन और मोटा अनाज किसान", description: "मिट्टी की उर्वरता और कृषि अर्थव्यवस्था सुधारना।", tag: "खाद्य सुरक्षा", icon: "🌾" } },
  { id: "midh", en: { title: "Horticulture Mission (MIDH)", benefit: "Orchard/Garden Grants", eligibility: "Fruit/Veg growers", description: "Holistic growth of fruits, vegetables, and spices.", tag: "Horticulture", icon: "🍎" }, kn: { title: "ತೋಟಗಾರಿಕೆ ಮಿಷನ್", benefit: "ಹಣ್ಣು/ತರಕಾರಿ ಕೃಷಿ ಅನುದಾನ", eligibility: "ತೋಟಗಾರಿಕೆ ರೈತರು", description: "ಹಣ್ಣು, ತರಕಾರಿ ಮತ್ತು ಮಸಾಲೆ ಪದಾರ್ಥಗಳ ಸಮಗ್ರ ಬೆಂಬಲ.", tag: "ತೋಟಗಾರಿಕೆ", icon: "🍎" }, hi: { title: "बागवानी मिशन", benefit: "बाग/उद्यान अनुदान", eligibility: "फल/सब्जी उत्पादक", description: "फल, सब्ज़ी और मसालों का समग्र विकास।", tag: "बागवानी", icon: "🍎" } },
  { id: "enam", en: { title: "e-NAM", benefit: "Online Trading Access", eligibility: "All Mandi Users", description: "Electronic trading portal for unified national market.", tag: "Marketing", icon: "📱" }, kn: { title: "ಇ-ನ್ಯಾಮ್ (e-NAM)", benefit: "ಆನ್‌ಲೈನ್ ಮಾರುಕಟ್ಟೆ ಪ್ರವೇಶ", eligibility: "ಮಂಡಿ ಬಳಕೆದಾರರು", description: "ಏಕೀಕೃತ ರಾಷ್ಟ್ರೀಯ ಮಾರುಕಟ್ಟೆಗಾಗಿ ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಪೋರ್ಟಲ್.", tag: "ಮಾರುಕಟ್ಟೆ", icon: "📱" }, hi: { title: "ई-नाम", benefit: "ऑनलाइन व्यापार पहुंच", eligibility: "सभी मंडी उपयोगकर्ता", description: "एकीकृत राष्ट्रीय बाजार के लिए इलेक्ट्रॉनिक पोर्टल।", tag: "मार्केटिंग", icon: "📱" } },
  { id: "fruits_ka", en: { title: "FRUITS Karnataka", benefit: "Single Window Subsidy", eligibility: "KA Registered Farmers", description: "Unified information system for all state agri-benefits.", tag: "State Govt", icon: "📑" }, kn: { title: "ಫ್ರೂಟ್ಸ್ ಕರ್ನಾಟಕ", benefit: "ಏಕಗವಾಕ್ಷಿ ಸಹಾಯಧನ", eligibility: "ಕರ್ನಾಟಕದ ರೈತರು", description: "ರಾಜ್ಯದ ಎಲ್ಲಾ ಕೃಷಿ ಸೌಲಭ್ಯಗಳಿಗೆ ಏಕೀಕೃತ ವ್ಯವಸ್ಥೆ.", tag: "ರಾಜ್ಯ ಸರ್ಕಾರ", icon: "📑" }, hi: { title: "FRUITS Karnataka", benefit: "सिंगल विंडो सब्सिडी", eligibility: "कर्नाटक पंजीकृत किसान", description: "राज्य कृषि लाभों के लिए एकीकृत सूचना प्रणाली।", tag: "राज्य सरकार", icon: "📑" } },
  { id: "vidya_nidhi", en: { title: "Raitha Vidya Nidhi", benefit: "Scholarships up to ₹11k", eligibility: "Farmers' Children", description: "Financial aid for higher education (ITI, PUC, Degree).", tag: "Education", icon: "🎓" }, kn: { title: "ರೈತ ವಿದ್ಯಾ ನಿಧಿ", benefit: "₹11,000 ವರೆಗೆ ವಿದ್ಯಾರ್ಥಿವೇತನ", eligibility: "ರೈತರ ಮಕ್ಕಳು", description: "ಉನ್ನತ ಶಿಕ್ಷಣಕ್ಕಾಗಿ (ITI, PUC, ಪದವಿ) ಆರ್ಥಿಕ ನೆರವು.", tag: "ಶಿಕ್ಷಣ", icon: "🎓" }, hi: { title: "रैथा विद्या निधि", benefit: "₹11,000 तक छात्रवृत्ति", eligibility: "किसानों के बच्चे", description: "उच्च शिक्षा (ITI, PUC, डिग्री) के लिए वित्तीय सहायता।", tag: "शिक्षा", icon: "🎓" } },
  { id: "ksheera_siri", en: { title: "Ksheera Siri", benefit: "₹5/Litre Milk Incentive", eligibility: "KMF Dairy Farmers", description: "Direct financial incentive to boost milk production.", tag: "Dairy", icon: "🥛" }, kn: { title: "ಕ್ಷೀರ ಸಿರಿ", benefit: "ಲೀಟರ್‌ಗೆ ₹5 ಪ್ರೋತ್ಸಾಹಧನ", eligibility: "ಹೈನುಗಾರರು", description: "ಹಾಲು ಉತ್ಪಾದನೆ ಹೆಚ್ಚಿಸಲು ನೇರ ಆರ್ಥಿಕ ಪ್ರೋತ್ಸಾಹ.", tag: "ಹೈನುಗಾರಿಕೆ", icon: "🥛" }, hi: { title: "क्षीर सिरी", benefit: "₹5/लीटर दूध प्रोत्साहन", eligibility: "KMF डेयरी किसान", description: "दूध उत्पादन बढ़ाने के लिए सीधा वित्तीय प्रोत्साहन।", tag: "डेयरी", icon: "🥛" } },
  { id: "sasya_sanjeevini", en: { title: "Sasya Sanjeevini", benefit: "Pest Identification Mobile Units", eligibility: "All Farmers", description: "Tech-driven units to identify and control crop pests.", tag: "Plant Health", icon: "🌿" }, kn: { title: "ಸಸ್ಯ ಸಂಜೀವಿನಿ", benefit: "ರೋಗ ಪತ್ತೆ ಸಂಚಾರಿ ಘಟಕಗಳು", eligibility: "ಎಲ್ಲಾ ರೈತರು", description: "ಬೆಳೆ ಕೀಟಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಲು ಮತ್ತು ನಿಯಂತ್ರಿಸಲು ತಂತ್ರಜ್ಞಾನ.", tag: "ಸಸ್ಯ ಆರೋಗ್ಯ", icon: "🌿" }, hi: { title: "सस्य संजीविनी", benefit: "कीट पहचान मोबाइल यूनिट", eligibility: "सभी किसान", description: "फसल कीटों की पहचान और नियंत्रण के लिए तकनीक आधारित इकाइयाँ।", tag: "पौधा स्वास्थ्य", icon: "🌿" } },
  { id: "krishi_bhagya", en: { title: "Krishi Bhagya", benefit: "90% Farm Pond Subsidy", eligibility: "Dry-land Farmers", description: "Support for Krishi Honda and lift pumps.", tag: "Water", icon: "💧" }, kn: { title: "ಕೃಷಿ ಭಾಗ್ಯ", benefit: "ಕೃಷಿ ಹೊಂಡಕ್ಕೆ 90% ಸಹಾಯಧನ", eligibility: "ಒಣಭೂಮಿ ರೈತರು", description: "ಕೃಷಿ ಹೊಂಡ ಮತ್ತು ಲಿಫ್ಟ್ ಪಂಪ್‌ಗಳಿಗೆ ಬೆಂಬಲ.", tag: "ನೀರು", icon: "💧" }, hi: { title: "कृषि भाग्य", benefit: "फार्म पॉन्ड पर 90% सब्सिडी", eligibility: "सूखी भूमि के किसान", description: "कृषि होंडा और लिफ्ट पंप के लिए समर्थन।", tag: "पानी", icon: "💧" } },
  { id: "kusum_solar", en: { title: "PM-KUSUM", benefit: "Up to 90% Solar Subsidy", eligibility: "Borewell Owners", description: "De-dieselizing farms with solar irrigation pumps.", tag: "Energy", icon: "☀️" }, kn: { title: "ಪಿಎಂ-ಕುಸುಮ್", benefit: "90% ಸೌರ ಸಹಾಯಧನ", eligibility: "ಬೋರೆವೆಲ್ ಮಾಲೀಕರು", description: "ಸೌರ ಪಂಪ್‌ಗಳ ಮೂಲಕ ಕೃಷಿ ವಲಯದ ಆಧುನೀಕರಣ.", tag: "ಇಂಧನ", icon: "☀️" }, hi: { title: "पीएम-कुसुम", benefit: "90% तक सौर सब्सिडी", eligibility: "बोरवेल मालिक", description: "सोलर सिंचाई पंपों से खेतों का आधुनिकीकरण।", tag: "ऊर्जा", icon: "☀️" } },
  { id: "agri_digital", en: { title: "Digital Agriculture", benefit: "AgriStack ID access", eligibility: "All Tech-users", description: "Open standard infrastructure for inclusive solutions.", tag: "Digital", icon: "🌐" }, kn: { title: "ಡಿಜಿಟಲ್ ಕೃಷಿ", benefit: "ಅಗ್ರಿಸ್ಟ್ಯಾಕ್ ಐಡಿ ಪ್ರವೇಶ", eligibility: "ತಂತ್ರಜ್ಞಾನ ಬಳಕೆದಾರರು", description: "ರೈತ ಸ್ನೇಹಿ ಪರಿಹಾರಗಳಿಗಾಗಿ ಡಿಜಿಟಲ್ ಮೂಲಸೌಕರ್ಯ.", tag: "ಡಿಜಿಟಲ್", icon: "🌐" }, hi: { title: "डिजिटल कृषि", benefit: "AgriStack ID पहुंच", eligibility: "सभी तकनीक उपयोगकर्ता", description: "समावेशी समाधान के लिए डिजिटल इंफ्रास्ट्रक्चर।", tag: "डिजिटल", icon: "🌐" } },
  { id: "mif_fund", en: { title: "Micro Irrigation Fund", benefit: "Low interest capital", eligibility: "State Agencies", description: "MIF provides low-cost funds to states for micro-irrigation.", tag: "Water", icon: "⛲" }, kn: { title: "ಸೂಕ್ಷ್ಮ ನೀರಾವರಿ ನಿಧಿ", benefit: "ಕಡಿಮೆ ಬಡ್ಡಿ ಬಂಡವಾಳ", eligibility: "ರಾಜ್ಯ ಏಜೆನ್ಸಿಗಳು", description: "ಸೂಕ್ಷ್ಮ ನೀರಾವರಿ ವಿಸ್ತರಿಸಲು ರಾಜ್ಯಗಳಿಗೆ ಕಡಿಮೆ ಬಡ್ಡಿಯ ನಿಧಿ.", tag: "ನೀರು", icon: "⛲" }, hi: { title: "सूक्ष्म सिंचाई निधि", benefit: "कम ब्याज पूंजी", eligibility: "राज्य एजेंसियाँ", description: "सूक्ष्म सिंचाई के लिए राज्यों को कम लागत निधि।", tag: "पानी", icon: "⛲" } },
  { id: "nbm_bamboo", en: { title: "Bamboo Mission", benefit: "Plantation Grants", eligibility: "Bamboo Growers", description: "Linking growers with consumers via cluster approach.", tag: "Alternative", icon: "🎋" }, kn: { title: "ಬಿದಿರು ಮಿಷನ್", benefit: "ಬಿದಿರು ಬೆಳೆ ಅನುದಾನ", eligibility: "ಬಿದಿರು ಬೆಳೆಗಾರರು", description: "ಬೆಳೆಗಾರರನ್ನು ಗ್ರಾಹಕರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವ ಯೋಜನೆ.", tag: "ಪರ್ಯಾಯ ಬೆಳೆ", icon: "🎋" }, hi: { title: "बांस मिशन", benefit: "रोपण अनुदान", eligibility: "बांस उत्पादक", description: "क्लस्टर दृष्टिकोण से उत्पादकों को उपभोक्ताओं से जोड़ना।", tag: "वैकल्पिक", icon: "🎋" } },
  { id: "mis_pss", en: { title: "Price Support (PSS)", benefit: "Minimum Support Price", eligibility: "Perishable crop growers", description: "Prevents distress sale during bumper crop arrivals.", tag: "Finance", icon: "⚖️" }, kn: { title: "ಬೆಲೆ ಬೆಂಬಲ ಯೋಜನೆ (PSS)", benefit: "ಕನಿಷ್ಠ ಬೆಂಬಲ ಬೆಲೆ", eligibility: "ತರಕಾರಿ/ಹಣ್ಣು ಬೆಳೆಗಾರರು", description: "ಹೆಚ್ಚು ಇಳುವರಿ ಬಂದಾಗ ಬೆಲೆ ಕುಸಿತದಿಂದ ರಕ್ಷಣೆ.", tag: "ಹಣಕಾಸು", icon: "⚖️" }, hi: { title: "मूल्य समर्थन योजना", benefit: "न्यूनतम समर्थन मूल्य", eligibility: "नाशवान फसल उत्पादक", description: "अधिक आवक पर मजबूरी में बिक्री से बचाव।", tag: "वित्त", icon: "⚖️" } },
  { id: "krishi_yantra", en: { title: "Krishi Yantra Dhare", benefit: "Low cost rental", eligibility: "Small Farmers", description: "Custom Hire Centres for tractors and tillers.", tag: "Machinery", icon: "🚜" }, kn: { title: "ಕೃಷಿ ಯಂತ್ರಧಾರೆ", benefit: "ಕಡಿಮೆ ಬಾಡಿಗೆ ಯಂತ್ರಗಳು", eligibility: "ಸಣ್ಣ ರೈತರು", description: "ಟ್ರಾಕ್ಟರ್ ಮತ್ತು ಟಿಲ್ಲರ್‌ಗಳ ಬಾಡಿಗೆ ಕೇಂದ್ರಗಳು.", tag: "ಯಂತ್ರೋಪಕರಣ", icon: "🚜" }, hi: { title: "कृषि यंत्र धारे", benefit: "कम लागत किराया", eligibility: "छोटे किसान", description: "ट्रैक्टर और टिलर के लिए कस्टम हायर केंद्र।", tag: "मशीनरी", icon: "🚜" } },
] satisfies Array<Record<Language, { title: string; benefit: string; eligibility: string; description: string; tag: string; icon: string }> & { id: string }>;

const Index = () => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("krishi-language");
    return saved === "kn" || saved === "hi" || saved === "en" ? saved : "en";
  });
  const [schemeSearch, setSchemeSearch] = useState("");
  const [schemeCategory, setSchemeCategory] = useState("all");
  const [schemeEligibility, setSchemeEligibility] = useState("all");
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [applyingScheme, setApplyingScheme] = useState<Scheme | null>(null);
  const [exportCountry, setExportCountry] = useState("all");
  const [exportDemand, setExportDemand] = useState("all");
  const [exportProfit, setExportProfit] = useState("all");
  const [selectedCrop, setSelectedCrop] = useState<ExportCrop | null>(null);
  const [sellingCrop, setSellingCrop] = useState<ExportCrop | null>(null);
  const [role, setRole] = useState<Role>("home");
  const [farmerTab, setFarmerTab] = useState<FarmerTab>("field");
  const [selectedId, setSelectedId] = useState<RegionId>("gokulam");
  const [history, setHistory] = useState<ViewState[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">(() => localStorage.getItem("krishi-theme") === "dark" ? "dark" : "light");
  const [fieldPanelOpen, setFieldPanelOpen] = useState(false);
  const [labourJobs, setLabourJobs] = useState<LabourJob[]>(initialLabourJobs);
  const [authStep, setAuthStep] = useState<"phone" | "otp" | "success" | "register">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [resendTimer, setResendTimer] = useState(60);
  const [farmerProfile, setFarmerProfile] = useState({ name: "", district: "Mysuru", crop: "Tomato", fid: "" });
  const [buyerProfile, setBuyerProfile] = useState({ name: "", district: "Mysuru", company: "", gstin: "" });
  const [labourerProfile, setLabourerProfile] = useState({ name: "", district: "Mysuru", skills: "", experience: "" });
  const [authRole, setAuthRole] = useState<AuthRole>("farmer");
  const [fpoSearch, setFpoSearch] = useState("");
  const [isTrackingExpanded, setIsTrackingExpanded] = useState(false);
  const [priceUnit, setPriceUnit] = useState<"qtl" | "kg">("qtl");
  const [rentDistance, setRentDistance] = useState<number>(10);
  const [expandedMarketCards, setExpandedMarketCards] = useState<Record<string, boolean>>({});
  const [labourCrewFilter, setLabourCrewFilter] = useState<string>("all");
  const [crewEstimatedDays, setCrewEstimatedDays] = useState<Record<string, number>>({});
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [minQuantity, setMinQuantity] = useState<number>(0);
  const [priceSort, setPriceSort] = useState<"asc" | "desc">("asc");
  const [fpoTons, setFpoTons] = useState<Record<string, number>>({
    fpo_lot_001: 5.0,
    fpo_lot_002: 1.0,
    fpo_lot_003: 0.5
  });
  const [expandedCropCards, setExpandedCropCards] = useState<Record<string, boolean>>({});
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const browseCropsRef = useRef<HTMLDivElement>(null);
  const fpoLotsRef = useRef<HTMLDivElement>(null);
  const trackingRef = useRef<HTMLDivElement>(null);

  const [cropsList, setCropsList] = useState<Listing[]>(buyerListings);

  useEffect(() => {
    const fetchDBCrops = async () => {
      try {
        const dbData = await getCrops();
        if (dbData && dbData.length > 0) {
          const mappedCrops: Listing[] = dbData.map((dbCrop: any) => ({
            id: dbCrop.id,
            farmer_name: dbCrop.farmer_name || "Verified Farmer",
            phone: dbCrop.phone || "+91 99999 XXXXX",
            location_id: (dbCrop.location || "mysuru").toLowerCase(),
            en: {
              crop_name: dbCrop.crop_name || dbCrop.crop || "Crop Listing",
              location: dbCrop.location || "Mysuru",
              grade: "Grade-A washed"
            },
            kn: {
              crop_name: dbCrop.crop_name || dbCrop.crop || "ಬೆಳೆ ಪಟ್ಟಿ",
              location: dbCrop.location || "ಮೈಸೂರು",
              grade: "ಎ-ಗ್ರೇಡ್"
            },
            hi: {
              crop_name: dbCrop.crop_name || dbCrop.crop || "फसल सूची",
              location: dbCrop.location || "मैसूरु",
              grade: "A-ग्रेड"
            },
            price_per_kg: Number(dbCrop.price_per_kg || dbCrop.price_per_unit || 50),
            quantity_kg: Number(dbCrop.quantity || 100),
            icon: "🌱",
            tag: "Live"
          }));
          
          setCropsList([...mappedCrops, ...buyerListings]);
        }
      } catch (err) {
        console.error("Error loading DB crops:", err);
      }
    };
    fetchDBCrops();
  }, []);

  const uniqueLocations = useMemo(() => {
    const locationsMap = new Map<string, { en: string; kn: string; hi: string }>();
    cropsList.forEach(item => {
      if (!locationsMap.has(item.location_id)) {
        locationsMap.set(item.location_id, {
          en: item.en.location.split(",")[0].trim(),
          kn: item.kn.location.split(",")[0].trim(),
          hi: item.hi.location.split(",")[0].trim()
        });
      }
    });
    return Array.from(locationsMap.entries()).map(([id, names]) => ({
      id,
      label: language === "kn" ? names.kn : language === "hi" ? names.hi : names.en
    }));
  }, [language, cropsList]);

  const filteredCrops = useMemo(() => {
    let list = [...cropsList];
    if (selectedLocations.length > 0) {
      list = list.filter(item => selectedLocations.includes(item.location_id));
    }
    list = list.filter(item => item.quantity_kg >= minQuantity);
    list.sort((a, b) => {
      return priceSort === "asc" 
        ? a.price_per_kg - b.price_per_kg 
        : b.price_per_kg - a.price_per_kg;
    });
    return list;
  }, [selectedLocations, minQuantity, priceSort, cropsList]);

  const fpoLang: "en" | "kn" = language === "kn" ? "kn" : "en";
  const filteredFpos = useMemo(() => {
    const q = fpoSearch.trim().toLowerCase();
    if (!q) return fpos;
    return fpos.filter((f) => [f.district, f.location, f.promoter, f[fpoLang].fpo_name, ...f[fpoLang].crops_handled].join(" ").toLowerCase().includes(q));
  }, [fpoSearch, fpoLang]);
  const selectedRegion = regions[selectedId];
  const selectedContent = getRegionContent(selectedRegion, selectedId, language);
  const t = copy[language];
  const labourLabels = labourCopy[language];
  const trackingLabel = trackingLabels[language] || trackingLabels.en;
  
  const profileText = profileLabels[language];

  const login = (authRole === "buyer" ? buyerLoginLabels : authRole === "labourer" ? labourerLoginLabels : loginLabels)[language];
  const authIcon = authRole === "buyer" ? "🛒" : authRole === "labourer" ? "👷" : "👨‍🌾";
  const authFields: { key: string; label: string; profile: Record<string, string>; setter: (updater: (prev: any) => any) => void }[] =
    authRole === "farmer"
      ? [{ key: "name", label: login.fullName, profile: farmerProfile, setter: setFarmerProfile as any }, { key: "crop", label: (login as any).crop, profile: farmerProfile, setter: setFarmerProfile as any }, { key: "fid", label: (login as any).fid, profile: farmerProfile, setter: setFarmerProfile as any }]
      : authRole === "buyer"
      ? [{ key: "name", label: login.fullName, profile: buyerProfile, setter: setBuyerProfile as any }, { key: "company", label: (login as any).company, profile: buyerProfile, setter: setBuyerProfile as any }, { key: "gstin", label: (login as any).gstin, profile: buyerProfile, setter: setBuyerProfile as any }]
      : [{ key: "name", label: login.fullName, profile: labourerProfile, setter: setLabourerProfile as any }, { key: "skills", label: (login as any).skills, profile: labourerProfile, setter: setLabourerProfile as any }, { key: "experience", label: (login as any).experience, profile: labourerProfile, setter: setLabourerProfile as any }];
  const authDistrict = authRole === "farmer" ? farmerProfile.district : authRole === "buyer" ? buyerProfile.district : labourerProfile.district;
  const setAuthDistrict = (d: string) => {
    if (authRole === "farmer") setFarmerProfile((p) => ({ ...p, district: d }));
    else if (authRole === "buyer") setBuyerProfile((p) => ({ ...p, district: d }));
    else setLabourerProfile((p) => ({ ...p, district: d }));
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("krishi-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (authStep !== "otp" || resendTimer <= 0) return;
    const timer = window.setTimeout(() => setResendTimer((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [authStep, resendTimer]);

  useEffect(() => {
    if (authStep !== "success") return;
    const dest: Role = authRole === "farmer" ? "farmerProfile" : authRole === "buyer" ? "buyer" : "labourer";
    const timer = window.setTimeout(() => navigateTo(dest), 1300);
    return () => window.clearTimeout(timer);
  }, [authStep]);

  useEffect(() => {
    if (role === "buyer" && !buyerProfile.name) {
      setRole("home");
    } else if (role === "labourer" && !labourerProfile.name) {
      setRole("home");
    }
  }, [role, buyerProfile.name, labourerProfile.name]);

  const navigateTo = (nextRole: Role, nextTab = farmerTab) => {
    setHistory((items) => [...items, { role, farmerTab }].slice(-12));
    setRole(nextRole);
    if (nextRole === "farmer") setFarmerTab(nextTab);
  };
  const goBack = () => {
    const previous = history[history.length - 1];
    if (!previous) return;
    setHistory((items) => items.slice(0, -1));
    setRole(previous.role);
    setFarmerTab(previous.farmerTab);
  };
  const handleApplyJob = (id: number) => setLabourJobs((jobs) => jobs.map((job) => job.id === id ? { ...job, isApplied: true, filledSlots: Math.min(job.totalSlots, job.filledSlots + 1) } : job));
  const goFarmerTab = (tab: FarmerTab) => navigateTo("farmer", tab);
  const requestOtp = () => {
    setAuthStep("otp");
    setResendTimer(60);
    window.setTimeout(() => otpRefs.current[0]?.focus(), 80);
  };
  const verifyOtp = () => setAuthStep("success");
  const updateOtp = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((digits) => digits.map((currentDigit, current) => current === index ? digit : currentDigit));
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };
  const handleOtpKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };
  const logoutUser = () => {
    localStorage.removeItem("krishi-session");
    setPhoneNumber("");
    setOtp(Array(6).fill(""));
    setAuthStep("phone");
    setHistory([]);
    setFarmerProfile({ name: "", district: "Mysuru", crop: "Tomato", fid: "" });
    setBuyerProfile({ name: "", district: "Mysuru", company: "", gstin: "" });
    setLabourerProfile({ name: "", district: "Mysuru", skills: "", experience: "" });
    setRole("home");
  };
  const logoutFarmer = logoutUser;
  const startLogin = (nextRole: AuthRole) => {
    setAuthRole(nextRole);
    setAuthStep("phone");
    setPhoneNumber("");
    setOtp(Array(6).fill(""));
    navigateTo(`${nextRole}Auth` as Role);
  };

  const setLanguage = (lng: Language) => {
    setLanguageState(lng);
    localStorage.setItem("krishi-language", lng);
  };

  const schemeCategories = useMemo(() => ["all", ...Array.from(new Set(governmentSchemes.map((scheme) => scheme[language].tag)))], [language]);
  const schemeEligibilityOptions = useMemo(() => ["all", ...Array.from(new Set(governmentSchemes.map((scheme) => scheme[language].eligibility)))], [language]);
  const filteredSchemes = governmentSchemes.filter((scheme) => {
    const content = scheme[language];
    const haystack = `${content.title} ${content.benefit} ${content.eligibility} ${content.description} ${content.tag}`.toLowerCase();
    return (
      haystack.includes(schemeSearch.toLowerCase()) &&
      (schemeCategory === "all" || content.tag === schemeCategory) &&
      (schemeEligibility === "all" || content.eligibility === schemeEligibility)
    );
  });

  const countryOptions = useMemo(() => ["all", "UAE", "Europe", "USA", "Japan", "Middle East", "Southeast Asia"], []);
  const demandOptions = useMemo(() => ["all", "Very High", "High", "Moderate", "Stable/Premium"], []);
  const filteredExportCrops = exportCrops.filter((crop) => {
    const content = crop[language];
    const profitValue = Number(content.profit.replace(/[^0-9]/g, ""));
    return (
      (exportCountry === "all" || content.destination.toLowerCase().includes(exportCountry.toLowerCase())) &&
      (exportDemand === "all" || crop.en.demand === exportDemand || content.demand === exportDemand) &&
      (exportProfit === "all" || profitValue >= Number(exportProfit))
    );
  });

  const getSeasonBadge = (cropId: string) => {
    const month = new Date().getMonth();
    const summer = month >= 2 && month <= 5;
    const monsoon = month >= 5 && month <= 9;
    const badge = cropId.includes("banana") || cropId.includes("turmeric") ? (monsoon ? "Best season · low risk" : "Irrigation needed") : summer ? "Harvest window · heat risk" : "Export-ready window";
    return language === "kn" ? badge.replace("Best season · low risk", "ಉತ್ತಮ ಋತು · ಕಡಿಮೆ ಅಪಾಯ").replace("Irrigation needed", "ನೀರಾವರಿ ಅಗತ್ಯ").replace("Harvest window · heat risk", "ಕೊಯ್ಲು ಸಮಯ · ಬಿಸಿಲಿನ ಅಪಾಯ").replace("Export-ready window", "ರಫ್ತು ಸಿದ್ಧ ಸಮಯ") : badge;
  };

  const Card = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
    <section className="rounded-[1.5rem] border border-glass-border bg-card/88 p-4 shadow-control backdrop-blur-panel">
      <div className="mb-3 flex items-center gap-2"><span className="text-2xl">{icon}</span><h2 className="font-display text-lg font-black">{title}</h2></div>{children}
    </section>
  );

  const roleButtons = (
    <div className="grid gap-3 sm:grid-cols-3">
      <Button variant="field" className="h-14 rounded-full text-base font-black" onClick={() => startLogin("farmer")}><Sprout />{t.farmer}</Button>
      <Button variant="secondaryFarm" className="h-14 rounded-full text-base font-black" onClick={() => startLogin("buyer")}><ShoppingCart />{t.buyer}</Button>
      <Button variant="secondaryFarm" className="h-14 rounded-full text-base font-black" onClick={() => startLogin("labourer")}><Briefcase />{t.labourer}</Button>
    </div>
  );

  const renderLiveMarketRates = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-[1.5rem] border border-glass-border bg-card/88 p-4 shadow-control backdrop-blur-panel">
        <h2 className="font-display text-xl font-black text-primary">Govt APMC Daily Rates</h2>
        <div className="flex items-center rounded-full border border-glass-border bg-secondary/30 p-1">
          <button onClick={() => setPriceUnit("qtl")} className={`rounded-full px-4 py-2 text-sm font-black transition-colors ${priceUnit === "qtl" ? "bg-card text-foreground shadow-control" : "text-muted-foreground"}`}>Per Quintal (100kg)</button>
          <button onClick={() => setPriceUnit("kg")} className={`rounded-full px-4 py-2 text-sm font-black transition-colors ${priceUnit === "kg" ? "bg-card text-foreground shadow-control" : "text-muted-foreground"}`}>Per KG</button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {liveMandiPrices.map((crop) => {
          const l = crop[language as "en" | "kn" | "hi"] || crop.en;
          const altL = crop.alternative_market[('name_' + language) as keyof typeof crop.alternative_market] || crop.alternative_market.name_en;
          const divisor = priceUnit === "qtl" ? 1 : 100;
          const modalPrice = crop.modal_price_qtl / divisor;
          const minPrice = crop.min_price_qtl / divisor;
          const maxPrice = crop.max_price_qtl / divisor;
          const altModalPrice = crop.alternative_market.modal_qtl / divisor;
          const suffix = priceUnit === "qtl" ? "/qtl" : "/kg";
          const isUp = crop.trend === "up";
          const isDown = crop.trend === "down";
          const expanded = expandedMarketCards[crop.crop_id] || false;

          return (
            <article key={crop.crop_id} className="rounded-[1.25rem] border border-glass-border bg-card p-4 shadow-control transition-shadow hover:shadow-glass">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2"><span className="text-3xl">{crop.icon}</span><h3 className="font-display text-lg font-black">{l.crop_name}</h3></div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-black ${isUp ? "bg-[#2E7D32]/10 text-[#2E7D32]" : isDown ? "bg-[#D32F2F]/10 text-[#D32F2F]" : "bg-secondary text-muted-foreground"}`}>
                  {crop.pct_change > 0 ? "+" : ""}{crop.pct_change}% {isUp ? <ChevronUp className="size-3" /> : isDown ? <ChevronDown className="size-3" /> : ""}
                </span>
              </div>
              <p className="mb-3 text-xs font-bold text-muted-foreground"><MapPin className="mr-1 inline size-3 text-primary" />{l.market}</p>
              <div className="mb-3 rounded-2xl bg-secondary/25 p-3 text-center">
                <p className="text-xs font-black uppercase text-muted-foreground">Modal Price</p>
                <p className="font-display text-2xl font-black text-primary"><IndianRupee className="inline size-5" />{modalPrice.toLocaleString()}{suffix}</p>
                <div className="mt-2 flex justify-center gap-4 text-xs font-bold text-muted-foreground">
                  <span>Min: ₹{minPrice.toLocaleString()}</span>
                  <span>Max: ₹{maxPrice.toLocaleString()}</span>
                </div>
              </div>
              
              <button className="flex w-full items-center justify-between rounded-xl border border-glass-border bg-secondary/10 px-4 py-3 text-sm font-bold transition-colors hover:bg-secondary/30" onClick={() => setExpandedMarketCards(prev => ({ ...prev, [crop.crop_id]: !expanded }))}>
                <span>Check Alternative Mandi</span>
                {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </button>
              {expanded && (
                <div className="mt-2 animate-in fade-in slide-in-from-top-2 rounded-xl bg-accent/15 p-3 shadow-inner">
                  <p className="text-xs font-bold uppercase text-accent-foreground">{altL}</p>
                  <p className="mt-1 font-black"><IndianRupee className="inline size-4 text-muted-foreground" />{altModalPrice.toLocaleString()}{suffix}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );

  const renderRentalVehicles = () => (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-[1.5rem] border border-glass-border bg-card/88 p-5 shadow-control backdrop-blur-panel sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-black text-primary">Rent Vehicles / Logistics Marketplace</h2>
          <p className="text-sm font-bold text-muted-foreground">Find transport for your harvest</p>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-input bg-background p-2">
          <label htmlFor="distance" className="pl-3 text-sm font-bold text-muted-foreground">Distance (KM):</label>
          <input id="distance" type="number" min="1" max="1000" value={rentDistance} onChange={(e) => setRentDistance(Number(e.target.value) || 10)} className="w-20 rounded-full bg-secondary/30 px-3 py-1 font-black outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rentalVehicles.map(vehicle => {
          const v = vehicle[language as "en" | "kn" | "hi"] || vehicle.en;
          const typeName = vehicle[('type_' + language) as keyof typeof vehicle] || vehicle.type_en;
          const totalFare = vehicle.base_fare + (rentDistance * vehicle.per_km_charge);
          
          return (
            <article key={vehicle.vehicle_id} className="flex flex-col rounded-[1.5rem] border border-glass-border bg-card p-5 shadow-control transition-shadow hover:shadow-glass">
              <div className="mb-4 flex items-start justify-between">
                <span className="text-4xl">{vehicle.icon}</span>
                <span className="inline-flex rounded-full bg-accent/20 px-3 py-1 text-xs font-black text-accent-foreground">{vehicle.capacity}</span>
              </div>
              <h3 className="font-display text-lg font-black leading-tight">{String(typeName)}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs font-bold text-muted-foreground"><MapPin className="size-3 text-primary" /> {v.current_location}</p>
              
              <div className="mt-4 rounded-2xl bg-secondary/35 p-4 text-center">
                <p className="text-xs font-black uppercase text-muted-foreground">Estimated Fare</p>
                <p className="font-display text-2xl font-black text-primary"><IndianRupee className="inline size-5" />{totalFare.toLocaleString()}</p>
                <p className="mt-1 text-xs font-bold text-muted-foreground">Base ₹{vehicle.base_fare} + ₹{vehicle.per_km_charge}/km</p>
              </div>

              <div className="mt-4 flex flex-col gap-2 border-t border-glass-border pt-4">
                <p className="flex items-center justify-between text-sm font-bold"><span className="text-muted-foreground">Driver</span> {v.driver_name}</p>
                <p className="flex items-center justify-between text-sm font-bold"><span className="text-muted-foreground">Rating</span> <span>⭐ {vehicle.rating}</span></p>
                {vehicle.labour_available && <p className="flex items-center justify-between text-sm font-bold"><span className="text-muted-foreground">Loading Labour</span> <CheckCircle className="size-4 text-success" /></p>}
              </div>

              <a href={`tel:${vehicle.phone}`} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-black text-primary-foreground shadow-control transition-transform hover:-translate-y-0.5">
                <Phone className="size-4" /> Call to Book Vehicle
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );

  const renderRecruitLabour = () => {
    const filters = ["all", "Sugarcane Harvesting", "Paddy Sowing", "Vegetable Picking"];
    
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 rounded-[1.5rem] border border-glass-border bg-card/88 p-5 shadow-control backdrop-blur-panel sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-black text-primary">Hire Verified Farm Labour / ಕಾರ್ಮಿಕರ ನೇಮಕಾತಿ</h2>
            <p className="text-sm font-bold text-muted-foreground">Find experienced labour crews near your farm</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {filters.map(filter => (
            <button key={filter} onClick={() => setLabourCrewFilter(filter)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black transition-colors ${labourCrewFilter === filter ? "bg-primary text-primary-foreground shadow-control" : "bg-card text-muted-foreground border border-glass-border hover:bg-secondary"}`}>
              {filter === "all" ? "All Skills" : filter}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {availableLabour.filter(crew => labourCrewFilter === "all" || crew.skills_en.includes(labourCrewFilter)).map(crew => {
            const loc = crew[language as "en" | "kn" | "hi"] || crew.en;
            const skills = crew[('skills_' + language) as keyof typeof crew] as string[] || crew.skills_en;
            const days = crewEstimatedDays[crew.labour_id] || 1;
            const estimatedTotal = crew.group_size * crew.daily_wage_per_head * days;
            
            return (
              <article key={crew.labour_id} className="flex flex-col rounded-[1.5rem] border border-glass-border bg-card p-5 shadow-control transition-shadow hover:shadow-glass">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-black leading-tight flex items-center gap-2">{crew.leader_name} <CheckCircle className="size-4 text-success" aria-label="Verified Field History" /></h3>
                    <p className="mt-1 text-xs font-black text-muted-foreground">Group of {crew.group_size} workers</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent/20 px-2 py-1 text-xs font-black text-accent-foreground">⭐ {crew.rating}</span>
                </div>
                
                <p className="mb-3 flex items-center gap-1 text-sm font-bold text-muted-foreground"><MapPin className="size-4 text-primary" /> {loc.location_name}</p>
                <p className="mb-4 text-sm font-bold text-success">{loc.availability}</p>
                
                <div className="mb-4 flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <span key={skill} className="inline-flex rounded-md bg-[#E8F5E9] px-2 py-1 text-xs font-black text-[#2E7D32]">{skill}</span>
                  ))}
                </div>

                <div className="mt-auto rounded-2xl bg-secondary/35 p-4">
                  <div className="flex items-center justify-between mb-3 text-sm font-black">
                    <span className="text-muted-foreground">Daily Wage per Head:</span>
                    <span><IndianRupee className="inline size-4" />{crew.daily_wage_per_head}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor={`days-${crew.labour_id}`} className="text-xs font-black text-muted-foreground uppercase">Est. Days Needed</label>
                    <input id={`days-${crew.labour_id}`} type="number" min="1" max="60" value={days} onChange={(e) => setCrewEstimatedDays(prev => ({...prev, [crew.labour_id]: Number(e.target.value) || 1}))} className="w-16 rounded-lg bg-background px-2 py-1 text-center font-black outline-none border border-input focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="border-t border-glass-border pt-3 flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-muted-foreground">Estimated Combined Outlay</span>
                    <span className="font-display text-xl font-black text-primary"><IndianRupee className="inline size-5" />{estimatedTotal.toLocaleString()}</span>
                  </div>
                </div>

                <a href={`tel:${crew.phone}`} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#2E7D32] font-black text-white shadow-control transition-transform hover:-translate-y-0.5">
                  <Phone className="size-4" /> Call Crew Leader
                </a>
              </article>
            );
          })}
        </div>
      </div>
    );
  };
  const TopHeader = ({ userName, roleLabel, roleDetail }: { userName: string; roleLabel: string; roleDetail: string }) => (
    <div className="mb-6 flex flex-col gap-4 rounded-[1.5rem] border border-glass-border bg-card/88 p-5 shadow-control backdrop-blur-panel sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-black md:text-3xl">
          {t.header.welcome}, {userName || t.header.guest} 👋
        </h1>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">
            Role: {roleLabel}
          </span>
          <span className="inline-flex items-center rounded-full bg-secondary/35 px-3 py-1 text-xs font-black text-muted-foreground">
            <MapPin className="mr-1 size-3" /> {roleDetail}
          </span>
        </div>
      </div>
      <Button variant="ghost" onClick={logoutUser} className="h-11 shrink-0 rounded-full border-2 border-destructive text-sm font-black text-destructive hover:bg-destructive hover:text-destructive-foreground">
        <LogOut className="mr-2 size-4" /> {t.header.logout}
      </Button>
    </div>
  );

  return (
    <main className="min-h-[100svh] overflow-hidden bg-background text-foreground">
      <header className="sticky top-0 z-[950] border-b border-glass-border bg-glass/92 px-3 py-2 shadow-control backdrop-blur-panel sm:px-4 sm:py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2"><Button variant="glass" size="icon" className="size-10 shrink-0 rounded-full sm:size-11" onClick={goBack} disabled={!history.length} aria-label="Go back"><ArrowLeft className="size-5" /></Button><button className="flex min-w-0 items-center gap-2 text-left sm:gap-3" onClick={() => navigateTo("home")}><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-control sm:size-11"><Leaf className="size-5 sm:size-6" /></span><span className="min-w-0"><strong className="block truncate font-display text-base leading-tight sm:text-lg">Krishi-Mysuru</strong><small className="hidden font-bold text-muted-foreground sm:block">Smart Farm Companion</small></span></button></div>
          <nav className="flex shrink-0 items-center gap-1 rounded-full border border-glass-border bg-card/80 p-1 sm:gap-2">
            <Button variant="ghost" size="icon" className="size-9 rounded-full sm:size-10" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">{theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}</Button>
            {(["en", "kn", "hi"] as Language[]).map((lng) => <Button key={lng} variant={language === lng ? "field" : "ghost"} size="sm" className="h-9 rounded-full px-3 text-sm font-black sm:h-10 sm:px-4" onClick={() => setLanguage(lng)}>{lng === "en" ? "EN" : lng === "kn" ? <><span className="sm:hidden">ಕ</span><span className="hidden sm:inline">ಕನ್ನಡ</span></> : <><span className="sm:hidden">हि</span><span className="hidden sm:inline">हिंदी</span></>}</Button>)}
          </nav>
        </div>
      </header>

      {role === "home" && <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[1.1fr_0.9fr] md:py-10"><div className="rounded-[2rem] border border-glass-border bg-gradient-to-br from-card via-secondary/45 to-background p-6 shadow-glass md:p-10"><div className="mb-5 inline-flex items-center gap-2 rounded-full bg-secondary/60 px-4 py-2 text-sm font-black"><Globe2 className="size-4" /> EN · ಕನ್ನಡ · हिंदी</div><h1 className="font-display text-4xl font-black leading-tight md:text-6xl">{t.hero}</h1><p className="mt-4 max-w-2xl text-lg font-semibold text-muted-foreground">{t.sub}</p><div className="mt-7">{roleButtons}</div></div><div className="grid gap-4">{t.stats.map((stat) => <Card key={stat} title={stat} icon="🌾"><p className="text-sm font-bold text-muted-foreground">Live demand signal for Mysuru farmers</p></Card>)}<Button variant="secondaryFarm" className="h-14 rounded-full text-base font-black"><Mic />{t.voice}</Button></div></section>}

      {(role === "farmerAuth" || role === "buyerAuth" || role === "labourerAuth") && (
        <section className="relative mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-7xl items-center justify-center overflow-hidden px-4 py-6">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[18rem] opacity-[0.045] md:text-[28rem]">🌿</div>
          <div className="relative grid w-full max-w-5xl gap-4 md:grid-cols-[1fr_0.95fr]">
            <div className="rounded-[2rem] border border-glass-border bg-card/88 p-5 shadow-glass backdrop-blur-panel sm:p-7">
              <div className="mb-5 flex items-center gap-3"><span className="flex size-14 items-center justify-center rounded-2xl bg-secondary/45 text-3xl shadow-control">{authIcon}</span><div><p className="text-xs font-black uppercase text-muted-foreground">{login.title}</p><h1 className="font-display text-2xl font-black leading-tight sm:text-3xl">{authStep === "register" ? login.registerTitle : login.welcome}</h1><p className="mt-1 text-sm font-bold text-muted-foreground">{login.subtitle}</p></div></div>
              {authStep === "phone" && <div className="space-y-4"><label className="grid gap-2 text-sm font-black"><span>{login.phonePlaceholder}</span><div className="flex min-h-12 overflow-hidden rounded-2xl border border-input bg-background shadow-control"><span className="flex min-w-16 items-center justify-center border-r border-input text-base font-black text-primary">+91</span><input type="tel" inputMode="numeric" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder={login.phonePlaceholder} className="min-h-12 w-full bg-transparent px-4 text-base font-black outline-none" /></div></label><Button variant="field" className="min-h-12 w-full rounded-2xl text-base font-black" onClick={requestOtp} disabled={phoneNumber.length < 10}><Phone />{login.btnRequest}</Button><button className="w-full text-sm font-black text-primary underline-offset-4 hover:underline" onClick={requestOtp}>{login.aadhaarLogin}</button></div>}
              {authStep === "otp" && <div className="space-y-4"><div className="grid grid-cols-6 gap-2">{otp.map((digit, index) => <input key={index} ref={(node) => { otpRefs.current[index] = node; }} value={digit} onChange={(e) => updateOtp(index, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(index, e)} inputMode="numeric" pattern="[0-9]*" autoComplete={index === 0 ? "one-time-code" : "off"} maxLength={1} aria-label={`OTP digit ${index + 1}`} className="aspect-square min-h-12 rounded-2xl border border-input bg-background text-center text-xl font-black outline-none focus:ring-2 focus:ring-ring" />)}</div><div className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/30 p-3 text-sm font-black"><span>OTP · {phoneNumber ? `+91 ${phoneNumber}` : "Aadhaar"}</span><button disabled={resendTimer > 0} onClick={() => setResendTimer(60)} className="text-primary disabled:text-muted-foreground">{resendTimer > 0 ? `${resendTimer}s` : login.resend}</button></div><Button variant="field" className="min-h-12 w-full rounded-2xl text-base font-black" onClick={verifyOtp}><LockKeyhole />{login.btnVerify}</Button></div>}
              {authStep === "success" && <div className="flex min-h-56 flex-col items-center justify-center rounded-[1.5rem] bg-secondary/30 p-6 text-center"><div className="growing-plant text-7xl">🌱</div><p className="mt-5 font-display text-2xl font-black text-primary">{login.profile}</p></div>}
              <div className="mt-5 flex flex-col gap-3 border-t border-glass-border pt-4"><button className="text-sm font-black text-primary underline-offset-4 hover:underline" onClick={() => setAuthStep(authStep === "register" ? "phone" : "register")}>{authStep === "register" ? login.title : login.newMember}</button><span className="inline-flex items-center justify-center gap-2 rounded-full bg-background px-3 py-2 text-xs font-black text-muted-foreground"><ShieldCheck className="size-4 text-primary" />{login.secureNote}</span></div>
            </div>
            <form className="rounded-[2rem] border border-glass-border bg-card/72 p-5 shadow-control backdrop-blur-panel sm:p-7" onSubmit={(e) => { e.preventDefault(); setAuthStep("success"); }}>
              <h2 className="mb-4 font-display text-xl font-black">{login.registerTitle}</h2>
              <div className="grid gap-3">
                {authFields.map((f) => (
                  <label key={f.key} className="grid gap-2 text-sm font-black"><span>{f.label}</span><input value={f.profile[f.key] ?? ""} onChange={(e) => { const v = e.target.value; f.setter((prev: any) => ({ ...prev, [f.key]: v })); }} className="min-h-12 rounded-2xl border border-input bg-background px-4 text-base font-bold outline-none focus:ring-2 focus:ring-ring" /></label>
                ))}
                <label className="grid gap-2 text-sm font-black"><span>{login.district}</span><select value={authDistrict} onChange={(e) => setAuthDistrict(e.target.value)} className="min-h-12 rounded-2xl border border-input bg-background px-4 text-base font-bold outline-none focus:ring-2 focus:ring-ring"><option>Mysuru</option><option>Mandya</option><option>Chamarajanagar</option><option>Kodagu</option><option>Hassan</option></select></label>
                <Button type="submit" variant="secondaryFarm" className="mt-2 min-h-12 rounded-2xl text-base font-black"><UserRound />{login.register}</Button>
              </div>
            </form>
          </div>
        </section>
      )}

      {role === "farmerProfile" && <section className="relative mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-5xl flex-col px-4 py-5 pb-8"><div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[16rem] opacity-[0.045] md:text-[30rem]">🌿</div><div className="relative ml-auto mb-4 flex w-fit rounded-full border border-glass-border bg-card/90 p-1 shadow-control backdrop-blur-panel">{(["en", "kn"] as Language[]).map((lng) => <Button key={lng} variant={language === lng ? "field" : "ghost"} size="sm" className="h-11 min-w-14 rounded-full font-black" onClick={() => setLanguage(lng)}>{lng === "en" ? "EN" : "ಕನ್ನಡ"}</Button>)}</div><div className="relative flex flex-1 flex-col gap-4"><div className="rounded-[2rem] border border-glass-border bg-card/88 p-5 shadow-glass backdrop-blur-panel sm:p-7"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><div className="flex size-20 shrink-0 items-center justify-center rounded-full border-4 border-secondary bg-background shadow-control sm:size-24"><User className="size-10 text-primary sm:size-12" /></div><div><p className="text-xs font-black uppercase text-muted-foreground">{profileText.title}</p><div className="mt-1 flex flex-wrap items-center gap-2"><h1 className="font-display text-2xl font-black sm:text-4xl">{farmerProfile.name || professionalFarmer.name}</h1><span className="inline-flex items-center gap-1 rounded-full bg-secondary/45 px-3 py-1 text-xs font-black text-primary"><ShieldCheck className="size-4" />{profileText.verified}</span></div><p className="mt-2 flex items-center gap-2 text-sm font-bold text-muted-foreground"><MapPin className="size-4 text-primary" />{professionalFarmer.location[language]}</p></div></div><Button variant="field" className="min-h-12 rounded-full font-black" onClick={() => navigateTo("farmer")}>{login.dashboard}</Button></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-secondary/25 p-4"><p className="text-xs font-black uppercase text-muted-foreground">{profileText.fid}</p><p className="mt-1 font-black">{farmerProfile.fid || professionalFarmer.fid}</p></div><div className="rounded-2xl bg-secondary/25 p-4"><p className="text-xs font-black uppercase text-muted-foreground">{profileText.member}</p><p className="mt-1 font-black">2026</p></div><div className="rounded-2xl bg-secondary/25 p-4"><p className="text-xs font-black uppercase text-muted-foreground">{profileText.experience}</p><p className="mt-1 font-black">{professionalFarmer.experience}</p></div></div></div><div className="grid gap-4 md:grid-cols-3"><div className="rounded-[1.5rem] border border-glass-border bg-card/88 p-4 shadow-control backdrop-blur-panel"><Tractor className="mb-3 size-7 text-primary" /><p className="text-xs font-black uppercase text-muted-foreground">{profileText.land}</p><p className="mt-1 text-xl font-black">{professionalFarmer.farm.size}</p></div><div className="rounded-[1.5rem] border border-glass-border bg-card/88 p-4 shadow-control backdrop-blur-panel"><Leaf className="mb-3 size-7 text-primary" /><p className="text-xs font-black uppercase text-muted-foreground">{profileText.crops}</p><p className="mt-1 text-xl font-black">🍌 Banana, 🐛 Silk</p></div><div className="rounded-[1.5rem] border border-glass-border bg-card/88 p-4 shadow-control backdrop-blur-panel"><Sprout className="mb-3 size-7 text-primary" /><p className="text-xs font-black uppercase text-muted-foreground">{profileText.soil}</p><p className="mt-1 text-xl font-black">{professionalFarmer.farm.soil[language]}</p></div></div><div className="rounded-[1.5rem] border-2 border-accent bg-accent/15 p-4 shadow-control"><p className="flex items-center gap-2 text-sm font-black uppercase text-accent-foreground"><Award className="size-5" />{profileText.gi}</p><p className="mt-2 text-lg font-black">🍌 Nanjangud Rasabale</p></div><div className="rounded-[1.5rem] border border-glass-border bg-card/88 p-4 shadow-control backdrop-blur-panel"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-xl font-black">{profileText.rating}</h2><div className="flex items-center gap-1 text-accent">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="size-5 fill-current" />)}<span className="ml-2 font-black text-foreground">5.0</span></div></div><p className="mb-3 text-xs font-black uppercase text-muted-foreground">{profileText.achievements}</p><div className="flex gap-3 overflow-x-auto pb-2">{professionalFarmer.achievements.map((badge) => <span key={badge} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-glass-border bg-secondary/35 px-4 text-sm font-black"><Award className="size-4 text-primary" />{badge}</span>)}</div></div><AlertDialog><AlertDialogContent className="rounded-[1.5rem]"><AlertDialogHeader><AlertDialogTitle>{profileText.confirmTitle}</AlertDialogTitle><AlertDialogDescription>{profileText.confirmBody}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{profileText.cancel}</AlertDialogCancel><AlertDialogAction onClick={logoutFarmer} className="border border-destructive bg-background text-destructive hover:bg-destructive hover:text-destructive-foreground">{profileText.confirm}</AlertDialogAction></AlertDialogFooter></AlertDialogContent><AlertDialogTrigger asChild><Button variant="ghost" className="mt-auto min-h-14 w-full rounded-2xl border-2 border-destructive text-base font-black uppercase tracking-wide text-destructive hover:bg-destructive hover:text-destructive-foreground"><LogOut className="size-5" />{profileText.logout}</Button></AlertDialogTrigger></AlertDialog></div></section>}

      {role === "farmer" && (
        <section className="mx-auto max-w-7xl px-4 py-5">
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
            {(Object.keys(t.tabs) as FarmerTab[]).map((tab) => (
              <Button key={tab} variant={farmerTab === tab ? "field" : "glass"} className="rounded-full" onClick={() => navigateTo("farmer", tab)}>
                {tab === "field" && <MapIcon />}
                {tab === "export" && <Package />}
                {t.tabs[tab]}
              </Button>
            ))}
            <Button variant="glass" className="rounded-full" onClick={() => navigateTo("farmerProfile")}>
              <UserRound />
              {login.profile}
            </Button>
          </div>

          {farmerTab === "field" ? (
            <div className="relative h-[calc(100svh-9.5rem)] min-h-[560px] overflow-hidden rounded-[2rem] border border-glass-border shadow-glass max-md:h-[calc(100svh-8rem)] max-md:min-h-0 max-md:rounded-none max-md:border-x-0">
              <KrishiMap selectedId={selectedId} language={language} onSelect={setSelectedId} />
              <div className="absolute left-4 top-4 z-[850] rounded-[1.25rem] border border-glass-border bg-glass/92 p-4 shadow-control backdrop-blur-panel max-md:right-4 max-md:p-3">
                <p className="text-xs font-black uppercase text-muted-foreground">Live Field</p>
                <p className="font-display text-xl font-black">{selectedContent.name}</p>
                <p className="text-sm font-bold text-muted-foreground">{selectedContent.soil}</p>
              </div>
              <FieldIntelligencePanel region={selectedRegion} regionId={selectedId} language={language} isExpanded={fieldPanelOpen} onToggle={() => setFieldPanelOpen((open) => !open)} />
            </div>
          ) : farmerTab === "schemes" ? (
            <div className="space-y-4">
              <div className="grid gap-3 rounded-[1.5rem] border border-glass-border bg-card/90 p-4 shadow-control backdrop-blur-panel md:grid-cols-[1fr_220px_220px]">
                <label className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={schemeSearch} onChange={(e) => setSchemeSearch(e.target.value)} placeholder={language === "kn" ? "ವಿಮೆ, ಸೌರ... ಹುಡುಕಿ" : "Search insurance, solar..."} className="h-11 w-full rounded-full border border-input bg-background pl-10 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-ring" /></label>
                <select value={schemeCategory} onChange={(e) => setSchemeCategory(e.target.value)} className="h-11 rounded-full border border-input bg-background px-4 text-sm font-bold"><option value="all">{language === "kn" ? "ಎಲ್ಲಾ ವರ್ಗಗಳು" : "All categories"}</option>{schemeCategories.slice(1).map((item) => <option key={item} value={item}>{item}</option>)}</select>
                <select value={schemeEligibility} onChange={(e) => setSchemeEligibility(e.target.value)} className="h-11 rounded-full border border-input bg-background px-4 text-sm font-bold"><option value="all">{language === "kn" ? "ಎಲ್ಲಾ ಅರ್ಹತೆ" : "All eligibility"}</option>{schemeEligibilityOptions.slice(1).map((item) => <option key={item} value={item}>{item}</option>)}</select>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredSchemes.map((scheme) => {
                const content = scheme[language];
                return (
                  <article key={scheme.id} className="rounded-[1.5rem] border border-glass-border bg-card/90 p-4 shadow-control backdrop-blur-panel">
                    <div className="mb-4 flex items-start gap-3">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/45 text-2xl shadow-control">{content.icon}</span>
                      <div>
                        <p className="mb-1 inline-flex rounded-full bg-accent/35 px-3 py-1 text-xs font-black text-accent-foreground">{content.tag}</p>
                        <h2 className="font-display text-lg font-black leading-tight">{content.title}</h2>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm font-bold">
                      <p className="rounded-2xl bg-secondary/30 p-3"><span className="block text-xs uppercase text-muted-foreground">{t.benefit}</span>{content.benefit}</p>
                      <p><span className="font-black text-primary">{t.eligibility}: </span>{content.eligibility}</p>
                      <p className="text-muted-foreground"><span className="font-black text-foreground">{t.details}: </span>{content.description}</p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2"><Button variant="secondaryFarm" className="rounded-full" onClick={() => setSelectedScheme(scheme)}>{t.details}</Button><Button variant="field" className="rounded-full" onClick={() => setApplyingScheme(scheme)}>{t.apply}</Button></div>
                  </article>
                );
              })}
              </div>
            </div>
          ) : farmerTab === "export" ? (
            <div className="grid gap-4 lg:grid-cols-3">
              <section className="rounded-[1.5rem] border border-glass-border bg-card/88 p-4 shadow-control backdrop-blur-panel lg:col-span-3">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2"><span className="text-2xl">🌱</span><h2 className="font-display text-lg font-black">{t.demand}</h2></div>
                  <div className="flex flex-wrap gap-2">
                    <select value={exportCountry} onChange={(e) => setExportCountry(e.target.value)} className="h-10 rounded-full border border-input bg-background px-3 text-sm font-bold"><option value="all">{language === "kn" ? "ಎಲ್ಲಾ ದೇಶಗಳು" : "All markets"}</option>{countryOptions.slice(1).map((item) => <option key={item} value={item}>{item}</option>)}</select>
                    <select value={exportDemand} onChange={(e) => setExportDemand(e.target.value)} className="h-10 rounded-full border border-input bg-background px-3 text-sm font-bold"><option value="all">{language === "kn" ? "ಎಲ್ಲಾ ಬೇಡಿಕೆ" : "All demand"}</option>{demandOptions.slice(1).map((item) => <option key={item} value={item}>{item}</option>)}</select>
                    <select value={exportProfit} onChange={(e) => setExportProfit(e.target.value)} className="h-10 rounded-full border border-input bg-background px-3 text-sm font-bold"><option value="all">{language === "kn" ? "ಎಲ್ಲಾ ಲಾಭ" : "All profit"}</option><option value="35">35%+</option><option value="45">45%+</option><option value="50">50%+</option></select>
                  </div>
                </div>
                <div className="grid max-h-[calc(100svh-18rem)] gap-4 overflow-y-auto pr-1 md:grid-cols-2">
                  {filteredExportCrops.map((crop) => {
                    const c = crop[language];
                    return (
                      <article key={crop.id} className="rounded-[1.25rem] border border-glass-border bg-secondary/25 p-4 shadow-control">
                        <button className="w-full text-left" onClick={() => setSelectedCrop(crop)}>
                          <div className="mb-3 flex items-start justify-between gap-3"><span className="text-4xl">{c.icon}</span><b className="rounded-full bg-card px-3 py-1 text-success shadow-control">{c.profit}</b></div>
                          <div className="flex flex-wrap gap-2"><p className="inline-flex rounded-full bg-accent/35 px-3 py-1 text-xs font-black text-accent-foreground">{c.tag}</p><p className="inline-flex rounded-full bg-card px-3 py-1 text-xs font-black text-primary">{getSeasonBadge(crop.id)}</p></div>
                          <h3 className="mt-2 font-display text-lg font-black leading-tight">{c.crop}</h3>
                          <p className="mt-1 text-xs font-black uppercase text-muted-foreground">{crop.district}</p>
                          <div className="mt-3 rounded-2xl bg-card/75 p-3"><p className="text-lg">{crop.flags}</p><p className="text-sm font-bold text-muted-foreground">{c.destination}</p></div>
                          <p className="mt-3 line-clamp-3 text-sm font-bold"><span className="text-primary">{t.reason}: </span>{c.reason}</p>
                        </button>
                        <Button variant="field" className="mt-4 w-full rounded-full" onClick={() => setSellingCrop(crop)}>{language === "kn" ? "ರಫ್ತು ಬೆಳೆ ಮಾರಾಟ" : "Sell Export Produce"}</Button>
                      </article>
                    );
                  })}
                </div>
              </section>
              {selectedCrop && <Card title={language === "kn" ? "ರಫ್ತು ಪರಿಶೀಲನಾ ಪಟ್ಟಿ" : "Export checklist"} icon={selectedCrop[language].icon}><div className="space-y-3 text-sm font-bold"><p><span className="text-primary">{language === "kn" ? "ಪ್ರಮಾಣಪತ್ರಗಳು" : "Certifications"}: </span>APEDA, FSSAI, Phytosanitary, {selectedCrop[language].tag}</p><p><span className="text-primary">{language === "kn" ? "ಪ್ಯಾಕಿಂಗ್" : "Packaging"}: </span>{language === "kn" ? "ಗ್ರೇಡಿಂಗ್, ತೇವಾಂಶ ನಿಯಂತ್ರಣ, ರಫ್ತು ಲೇಬಲ್" : "Grading, moisture control, export labels and ventilated cartons."}</p><ol className="list-decimal space-y-1 pl-5 text-muted-foreground"><li>{language === "kn" ? "ಖರೀದಿದಾರರನ್ನು ದೃಢೀಕರಿಸಿ" : "Confirm buyer and target market"}</li><li>{language === "kn" ? "ಗುಣಮಟ್ಟ ಪರೀಕ್ಷೆ ಮಾಡಿ" : "Complete quality testing"}</li><li>{language === "kn" ? "ದಾಖಲೆ ಮತ್ತು ಶಿಪ್ಪಿಂಗ್ ಬುಕ್ ಮಾಡಿ" : "Prepare documents and book shipment"}</li></ol></div></Card>}
            </div>
          ) : farmerTab === "fpo" ? (
            <div className="space-y-4">
              <div className="rounded-[1.5rem] border border-glass-border bg-card/90 p-4 shadow-control backdrop-blur-panel">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2"><span className="text-2xl">🏢</span><h2 className="font-display text-lg font-black">{t.fpo}</h2><span className="rounded-full bg-secondary/45 px-3 py-1 text-xs font-black text-primary">{filteredFpos.length}</span></div>
                  <label className="relative w-full max-w-sm"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={fpoSearch} onChange={(e) => setFpoSearch(e.target.value)} placeholder={language === "kn" ? "ಜಿಲ್ಲೆ, ಬೆಳೆ, FPO ಹೆಸರು..." : "Search district, crop, FPO name..."} className="h-11 w-full rounded-full border border-input bg-background pl-10 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-ring" /></label>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredFpos.map((fpo) => {
                    const f = fpo[fpoLang];
                    return (
                      <article key={fpo.fpo_id} className="flex flex-col rounded-[1.25rem] border border-glass-border bg-secondary/25 p-4 shadow-control">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <span className="inline-flex rounded-full bg-accent/35 px-3 py-1 text-xs font-black text-accent-foreground">{fpo.promoter}</span>
                          <span className="text-xs font-black text-muted-foreground">{fpo.fpo_id}</span>
                        </div>
                        <h3 className="font-display text-base font-black leading-tight">{f.fpo_name}</h3>
                        <p className="mt-1 text-xs font-black uppercase text-muted-foreground">{fpo.district} · {fpo.location}</p>
                        <p className="mt-3 flex items-start gap-2 text-sm font-bold text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" />{f.address}</p>
                        <p className="mt-3 text-sm font-bold"><span className="text-primary">CEO: </span>{f.ceo_name}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {f.crops_handled.map((c) => <span key={c} className="inline-flex rounded-full bg-card px-3 py-1 text-xs font-black text-primary shadow-control">{c}</span>)}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <a href={`tel:${fpo.contact.phone}`} className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-3 text-sm font-black text-primary-foreground shadow-control transition-transform hover:-translate-y-0.5"><Phone className="size-4" />{fpo.contact.phone}</a>
                          <a href={`mailto:${fpo.contact.email}`} className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-card px-3 text-sm font-black text-primary shadow-control transition-transform hover:-translate-y-0.5 truncate" title={fpo.contact.email}><span className="truncate">{language === "kn" ? "ಇಮೇಲ್" : "Email"}</span></a>
                        </div>
                      </article>
                    );
                  })}
                  {filteredFpos.length === 0 && (
                    <p className="col-span-full rounded-2xl border border-dashed border-glass-border bg-card/60 p-6 text-center text-sm font-bold text-muted-foreground">{language === "kn" ? "ಯಾವುದೇ FPO ಸಿಗಲಿಲ್ಲ" : "No FPOs match your search."}</p>
                  )}
                </div>
              </div>
            </div>
          ) : farmerTab === "market" ? (
            renderLiveMarketRates()
          ) : farmerTab === "rent" ? (
            renderRentalVehicles()
          ) : farmerTab === "labour" ? (
            renderRecruitLabour()
          ) : null}
        </section>
      )}

      {role === "buyer" && (
        <section className="mx-auto max-w-7xl space-y-8 px-4 py-6">
          <TopHeader userName={buyerProfile.name} roleLabel={t.header.buyerRole} roleDetail={buyerProfile.district} />
          {renderLiveMarketRates()}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Card 1: Browse Crops */}
            <div 
              onClick={() => browseCropsRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-[1.5rem] border border-glass-border bg-[#F1F8E9] p-5 shadow-control backdrop-blur-panel cursor-pointer hover:shadow-glass hover:scale-[1.01] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">🍌</span>
                  <h3 className="font-display text-lg font-black text-slate-800">
                    {language === "kn" ? "ಬೆಳೆಗಳನ್ನು ನೋಡಿ" : language === "hi" ? "फसलें देखें" : "Browse Crops"}
                  </h3>
                </div>
                <p className="text-xs font-bold text-slate-600">
                  {language === "kn" ? "ಪರಿಶೀಲಿಸಿದ ರೈತರಿಂದ ನೇರವಾಗಿ ತಾಜಾ ಕೃಷಿ ಉತ್ಪನ್ನಗಳನ್ನು ಖರೀದಿಸಿ." : language === "hi" ? "सत्यापित स्थानीय किसानों से सीधे ताजा फसलें खरीदें।" : "Source fresh produce directly from verified local farmers."}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-black text-[#2E7D32]">
                {language === "kn" ? "ಲೈವ್ ಬೆಳೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ" : language === "hi" ? "लाइव सूची देखें" : "View Live Listings"} &rarr;
              </div>
            </div>

            {/* Card 2: Bulk Purchase via FPO */}
            <div 
              onClick={() => fpoLotsRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-[1.5rem] border border-glass-border bg-card p-5 shadow-control backdrop-blur-panel cursor-pointer hover:shadow-glass hover:scale-[1.01] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">👥</span>
                  <h3 className="font-display text-lg font-black text-slate-800">
                    {language === "kn" ? "FPO ಸಗಟು ಖರೀದಿ" : language === "hi" ? "FPO थोक खरीद" : "FPO Bulk Purchase"}
                  </h3>
                </div>
                <p className="text-xs font-bold text-slate-600">
                  {language === "kn" ? "ಸಹಕಾರಿ ಕೃಷಿ ಸಂಘಗಳಿಂದ ದೊಡ್ಡ ಪ್ರಮಾಣದಲ್ಲಿ ಜಿಐ ಮತ್ತು ಸಾವಯವ ಉತ್ಪನ್ನಗಳನ್ನು ಪಡೆಯಿರಿ." : language === "hi" ? "सत्यापित एफपीओ से उच्च मात्रा में प्रमाणित उत्पाद खरीदें।" : "Procure high volume certified produce from verified FPOs."}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-black text-[#2E7D32]">
                {language === "kn" ? "ಸಗಟು ಪಟ್ಟಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ" : language === "hi" ? "थोक स्टॉक देखें" : "View Bulk Lots"} &rarr;
              </div>
            </div>

            {/* Card 3: Order Tracking Simplified Card */}
            <div 
              onClick={() => trackingRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-[1.5rem] border border-glass-border bg-card p-5 shadow-control backdrop-blur-panel cursor-pointer hover:shadow-glass hover:scale-[1.01] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">📦</span>
                  <h3 className="font-display text-lg font-black text-slate-800">
                    {language === "kn" ? "ಸಕ್ರಿಯ ಆರ್ಡರ್" : language === "hi" ? "सक्रिय ऑर्डर" : "Active Order"}
                  </h3>
                </div>
                <p className="text-xs font-bold text-slate-600">
                  {language === "kn" ? `ಆರ್ಡರ್ #${activeTracking.order_id} ಗಾಗಿ ಲೈವ್ ಸಾರಿಗೆ ಮತ್ತು ವಾಹನ ಟ್ರ್ಯಾಕಿಂಗ್ ಸ್ಥಿತಿ.` : language === "hi" ? `ऑर्डर #${activeTracking.order_id} के लिए लाइव पारगमन और वाहन स्थिति।` : `Live transit and vehicle status for Order #${activeTracking.order_id}.`}
                </p>
                <div className="mt-2 text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] py-1 px-2.5 rounded-lg inline-block">
                  {language === "kn" ? "ಸ್ಥಿತಿ: ಸಾಗಣೆಯಲ್ಲಿದೆ" : language === "hi" ? "स्थिति: पारगमन में" : `Status: ${activeTracking.status}`}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-black text-[#2E7D32]">
                {language === "kn" ? "ಆರ್ಡರ್ ವಿವರಗಳು" : language === "hi" ? "शिपमेंट विवरण देखें" : "View Shipment Details"} &rarr;
              </div>
            </div>
          </div>
          
          {/* Order Tracking Milestone View */}
          <div ref={trackingRef} className="pt-2">
            <div className="rounded-[1.5rem] border border-glass-border bg-card/90 p-6 shadow-glass backdrop-blur-panel">
              <div className="mb-4 flex items-center justify-between gap-2 border-b border-glass-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📦</span>
                  <h2 className="font-display text-lg font-black text-slate-800">
                    {language === "kn" ? "ಆರ್ಡರ್ ಟ್ರ್ಯಾಕಿಂಗ್ - ಆಕ್ಟಿವ್ ಸಾಗಣೆ" : "Order Tracking - Active Shipment"}
                  </h2>
                </div>
                <span className="inline-flex rounded-full bg-[#E8F5E9] border border-[#2E7D32]/20 px-3 py-1 text-xs font-black text-[#2E7D32]">
                  {language === "kn" ? `ಆರ್ಡರ್: #${activeTracking.order_id}` : `Order #${activeTracking.order_id}`}
                </span>
              </div>
              
              <div className="grid gap-6 md:grid-cols-12">
                {/* Summary & Live vehicle info */}
                <div className="md:col-span-5 space-y-4">
                  <div className="rounded-2xl bg-[#F1F8E9] border border-[#2E7D32]/10 p-4">
                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-wider">
                      {language === "kn" ? "ಬೆಳೆ ವಿವರ ಮತ್ತು ಪ್ರಮಾಣ" : "Crop & Quantity Details"}
                    </p>
                    <p className="text-base font-black text-slate-800 mt-0.5">
                      {language === "kn" ? "ಪ್ರಿಮಿಯಂ ಮೈಸೂರು ಶುಂಠಿ" : activeTracking.crop_name}
                    </p>
                    <p className="text-xs font-bold text-slate-600 mt-0.5">
                      {language === "kn" ? `ಪ್ರಮಾಣ: ${activeTracking.quantity}` : `Quantity: ${activeTracking.quantity}`} • {language === "kn" ? `ಒಟ್ಟು ಮೊತ್ತ: ${activeTracking.total_amount}` : `Total Value: ${activeTracking.total_amount}`}
                    </p>
                  </div>

                  {/* Live Vehicle Tracking Status Card */}
                  <div className="rounded-2xl border-2 border-[#2E7D32]/25 bg-white p-4 shadow-sm flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F5E9]">
                      <Truck className="size-6 text-[#2E7D32] animate-bounce" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                        {language === "kn" ? "ವಾಹನದ ಲೈವ್ ಸ್ಥಿತಿ" : "Live Vehicle Status"}
                      </p>
                      <p className="mt-0.5 font-black text-[#2E7D32] text-sm flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D32] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2E7D32]"></span>
                        </span>
                        {activeTracking.logistics_details.vehicle_number} — {language === "kn" ? "ಸಾಗಣೆಯಲ್ಲಿದೆ" : "In Transit"}
                      </p>
                      <p className="text-xs font-bold text-slate-500">
                        {language === "kn" ? "ವಾಹನ: ಟಾಟಾ ಏಸ್ ಮೆಗಾ" : `Vehicle: ${activeTracking.logistics_details.vehicle_type}`}
                      </p>
                    </div>
                  </div>

                  {/* Logistics Info Card */}
                  <div className="rounded-2xl bg-secondary/15 p-4 space-y-2 text-xs font-bold text-slate-600 border border-glass-border">
                    <div className="flex justify-between items-center">
                      <span>{language === "kn" ? "ಚಾಲಕನ ಹೆಸರು" : "Driver Name"}:</span>
                      <span className="font-extrabold text-slate-800">{language === "kn" ? "ರಮೇಶ್ ಕುಮಾರ್" : activeTracking.logistics_details.driver_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{language === "kn" ? "ಅಂದಾಜು ತಲುಪುವಿಕೆ" : "Estimated Delivery"}:</span>
                      <span className="font-extrabold text-slate-800">{language === "kn" ? "ಮೇ 20, 2026 (ನಾಳೆ)" : activeTracking.estimated_delivery}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{language === "kn" ? "APMC ಗೇಟ್ ಪರಿಶೀಲನೆ ಸ್ಥಿತಿ" : "APMC Clearance Status"}:</span>
                      <span className="text-[#2E7D32] flex items-center gap-1"><CheckCircle className="size-3.5" /> {language === "kn" ? "ಗೇಟ್ 2 ರಲ್ಲಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ" : activeTracking.logistics_details.apmc_clearance_status}</span>
                    </div>
                  </div>

                  {/* Responsive Split Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <a 
                      href={`tel:${activeTracking.farmer_phone}`} 
                      className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#2E7D32] text-white font-black shadow-sm hover:bg-[#1B5E20] transition-colors text-sm"
                    >
                      <Phone className="size-4" />
                      {language === "kn" ? "ರೈತರಿಗೆ ಕರೆ" : "Call Farmer"}
                    </a>
                    <a 
                      href={`tel:${activeTracking.logistics_details.driver_phone}`} 
                      className="flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#2E7D32] text-[#2E7D32] font-black hover:bg-[#E8F5E9] transition-colors text-sm bg-white"
                    >
                      <Phone className="size-4" />
                      {language === "kn" ? "ಚಾಲಕನಿಗೆ ಕರೆ" : "Call Driver"}
                    </a>
                  </div>
                </div>

                {/* Timeline Milestone Tracker */}
                <div className="md:col-span-7 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-slate-200/80 pt-6 md:pt-0">
                  <p className="text-[10px] uppercase font-black text-slate-500 tracking-wider mb-4 px-1">
                    {language === "kn" ? "ಆರ್ಡರ್ ಮೈಲಿಗಲ್ಲುಗಳು" : "Order Milestones"}
                  </p>
                  
                  <div className="relative pl-7 space-y-6">
                    {/* Progress Line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200">
                      <div 
                        className="w-full bg-[#2E7D32] transition-all duration-500" 
                        style={{ height: `${activeTracking.status_percentage}%` }}
                      />
                    </div>
                    
                    {activeTracking.milestones.map((milestone) => {
                      const title = language === "kn" ? milestone.title_kn : language === "hi" ? milestone.title_hi : milestone.title_en;
                      const time = language === "kn" ? milestone.time_kn : language === "hi" ? milestone.time_hi : milestone.time_en;
                      const isCompleted = milestone.completed;
                      
                      return (
                        <div key={milestone.id} className="relative flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4 group">
                          {/* Dot */}
                          <div className={`absolute -left-[24px] top-1 md:top-auto flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 ${
                            isCompleted 
                              ? "bg-[#2E7D32] text-white shadow-sm ring-4 ring-[#E8F5E9]" 
                              : "bg-white border-2 border-slate-300 text-slate-400"
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="size-3.5 text-white" />
                            ) : (
                              <div className="size-1.5 rounded-full bg-slate-300" />
                            )}
                          </div>
                          
                          {/* Milestone text */}
                          <div>
                            <p className={`font-bold text-sm transition-colors ${
                              isCompleted ? "text-slate-800 font-extrabold" : "text-slate-400"
                            }`}>
                              {title}
                            </p>
                          </div>
                          
                          {/* Time tag */}
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full self-start md:self-auto ${
                            isCompleted 
                              ? "bg-[#E8F5E9] text-[#2E7D32]" 
                              : "bg-slate-100 text-slate-400"
                          }`}>
                            {time}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Browse Crops Grid Section */}
          <div ref={browseCropsRef} className="space-y-6 pt-2">
            <div className="border-t border-glass-border pt-6" />
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="flex items-center gap-2 font-display text-2xl font-black text-primary">
                  <ShoppingCart className="size-7" /> 
                  {t.browse}
                </h2>
                <p className="text-xs font-bold text-muted-foreground mt-0.5">
                  {language === "kn" ? "ಲಭ್ಯವಿರುವ ಬೆಳೆಗಳು ಮತ್ತು ಸಾವಯವ ಪ್ರಮಾಣೀಕೃತ ಲೈವ್ ಉತ್ಪನ್ನಗಳು." : "Live organic and certified crops available for direct sourcing."}
                </p>
              </div>
              
              {/* Filter Header Toolbar */}
              <div className="flex flex-wrap items-center gap-3 bg-secondary/15 p-2 rounded-2xl border border-glass-border">
                {/* Location Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                    className="flex h-11 items-center justify-between gap-2 rounded-full border border-[#2E7D32]/35 bg-card px-4 text-xs font-black text-primary shadow-sm hover:bg-[#F1F8E9] transition-all"
                  >
                    <span>
                      {language === "kn" ? "ಸ್ಥಳಗಳು" : "Locations"} 
                      {selectedLocations.length > 0 ? ` (${selectedLocations.length})` : ""}
                    </span>
                    <ChevronDown className="size-3.5 text-[#2E7D32]" />
                  </button>
                  
                  {locationDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setLocationDropdownOpen(false)} 
                      />
                      <div className="absolute right-0 md:left-0 mt-2 z-50 w-64 rounded-2xl border border-glass-border bg-card p-3 shadow-glass animate-in fade-in slide-in-from-top-1">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2 px-1">
                          {language === "kn" ? "ಸ್ಥಳ ಆಯ್ಕೆಮಾಡಿ" : "Filter by Location"}
                        </p>
                        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                          {uniqueLocations.map((loc) => {
                            const isSelected = selectedLocations.includes(loc.id);
                            return (
                              <label 
                                key={loc.id} 
                                className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-xs font-bold cursor-pointer hover:bg-[#F1F8E9] transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {
                                    if (isSelected) {
                                      setSelectedLocations(selectedLocations.filter(id => id !== loc.id));
                                    } else {
                                      setSelectedLocations([...selectedLocations, loc.id]);
                                    }
                                  }}
                                  className="rounded border-[#2E7D32] text-[#2E7D32] focus:ring-[#2E7D32] size-4 accent-[#2E7D32]"
                                />
                                <span className={isSelected ? "text-[#2E7D32] font-black" : "text-slate-700"}>
                                  {loc.label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                        {selectedLocations.length > 0 && (
                          <button
                            onClick={() => setSelectedLocations([])}
                            className="w-full mt-2 rounded-xl py-1 text-center text-xs font-black text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            {language === "kn" ? "ತೆರವುಗೊಳಿಸಿ" : "Clear All"}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Quantity Slider */}
                <div className="flex flex-col gap-0.5 px-3 min-w-[150px] sm:min-w-[180px] py-1 border-x border-glass-border">
                  <span className="text-[10px] font-black text-[#2E7D32] uppercase">
                    {language === "kn" ? "ಕನಿಷ್ಠ ಪ್ರಮಾಣ" : "Min Quantity"}: {minQuantity.toLocaleString()} kg
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="500"
                    value={minQuantity}
                    onChange={(e) => setMinQuantity(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#E8F5E9] rounded-lg appearance-none cursor-pointer accent-[#2E7D32]"
                  />
                </div>

                {/* Price Sorting Toggle */}
                <button
                  onClick={() => setPriceSort(priceSort === "asc" ? "desc" : "asc")}
                  className="flex h-11 items-center gap-1.5 rounded-full border border-[#2E7D32]/35 bg-card px-4 text-xs font-black text-primary shadow-sm hover:bg-[#F1F8E9] transition-all"
                >
                  <span>
                    {language === "kn" ? "ಬೆಲೆ: " : "Price: "}
                    {priceSort === "asc" 
                      ? (language === "kn" ? "ಕಡಿಮೆಯಿಂದ ಹೆಚ್ಚು" : "Low to High") 
                      : (language === "kn" ? "ಹೆಚ್ಚಿನಿಂದ ಕಡಿಮೆ" : "High to Low")}
                  </span>
                  <span className="text-xs font-black text-[#2E7D32]">
                    {priceSort === "asc" ? "↑" : "↓"}
                  </span>
                </button>
              </div>
            </div>

            {/* Crop Products Grid */}
            {filteredCrops.length === 0 ? (
              <div className="text-center py-12 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/50">
                <p className="text-sm font-bold text-slate-500">
                  {language === "kn" ? "ಯಾವುದೇ ಬೆಳೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಬದಲಾಯಿಸಿ." : "No crop listings found matching your filters."}
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCrops.map(listing => {
                  const l = listing[language];
                  const isExpanded = expandedCropCards[listing.id];
                  return (
                    <article 
                      key={listing.id} 
                      onClick={() => setExpandedCropCards(prev => ({ ...prev, [listing.id]: !prev[listing.id] }))}
                      className="flex flex-col cursor-pointer bg-[#F1F8E9] border border-[#2E7D32]/10 p-5 shadow-control transition-all duration-300 hover:shadow-glass hover:scale-[1.01]"
                      style={{ borderRadius: "2rem 0 2rem 0" }}
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm text-3xl">
                          {listing.icon}
                        </div>
                        <span className="inline-flex rounded-full bg-[#2E7D32]/10 px-3 py-0.5 text-[10px] font-black text-[#2E7D32] border border-[#2E7D32]/10 shadow-sm uppercase tracking-wider">
                          {listing.tag}
                        </span>
                      </div>
                      
                      <h3 className="font-display text-base font-black leading-tight text-slate-800">
                        {l.crop_name}
                      </h3>
                      
                      <p className="mt-1 text-xs font-bold text-slate-500 flex items-center gap-1">
                        <MapPin className="size-3 text-red-500 shrink-0" />
                        {l.location}
                      </p>
                      
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold">
                        <div className="rounded-xl bg-white/80 p-2 text-center shadow-sm">
                          <span className="block text-[9px] uppercase text-slate-400 font-black">
                            {language === "kn" ? "ಬೆಲೆ / ಕೆಜಿ" : "Price / KG"}
                          </span>
                          <span className="text-[#2E7D32] font-black text-sm flex items-center justify-center gap-0.5">
                            <IndianRupee className="size-3" />
                            {listing.price_per_kg}
                          </span>
                        </div>
                        <div className="rounded-xl bg-white/80 p-2 text-center shadow-sm">
                          <span className="block text-[9px] uppercase text-slate-400 font-black">
                            {language === "kn" ? "ಲಭ್ಯ ಪ್ರಮಾಣ" : "Available"}
                          </span>
                          <span className="text-slate-700 font-black text-sm">
                            {listing.quantity_kg.toLocaleString()} kg
                          </span>
                        </div>
                      </div>
                      
                      <p className="mt-3 text-xs font-bold text-slate-600">
                        <span className="text-[#2E7D32]">{language === "kn" ? "ದರ್ಜೆ" : "Grade"}:</span> {l.grade}
                      </p>
                      
                      {/* Expandable Farmer Detail Panel */}
                      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-36 opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
                        <div className="border-t border-[#2E7D32]/10 pt-3 space-y-2">
                          <div className="flex justify-between items-center text-xs font-black text-slate-700 bg-white/50 p-2 rounded-xl">
                            <span>{language === "kn" ? "ರೈತ" : "Farmer"}:</span>
                            <span className="text-[#2E7D32]">{listing.farmer_name}</span>
                          </div>
                          <a
                            href={`tel:${listing.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#2E7D32] text-white text-xs font-black shadow-sm hover:bg-[#1B5E20] transition-colors"
                          >
                            <Phone className="size-3.5" />
                            {language === "kn" ? "ರೈತನನ್ನು ಸಂಪರ್ಕಿಸಿ" : "Contact Farmer"}
                          </a>
                        </div>
                      </div>
                      
                      {/* Dropdown Chevron indicator */}
                      <div className="mt-2 text-center text-slate-400">
                        <ChevronDown className={`mx-auto size-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180 text-[#2E7D32]" : ""}`} />
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* FPO Bulk Lots Section */}
          <div ref={fpoLotsRef} className="space-y-6 pt-2">
            <div className="border-t border-glass-border pt-6" />
            <div>
              <h2 className="flex items-center gap-2 font-display text-2xl font-black text-primary">
                <Users className="size-7" /> 
                {language === "kn" ? "FPO ಮೂಲಕ ಸಗಟು ಖರೀದಿ (B2B)" : "Bulk Purchase via FPO (B2B)"}
              </h2>
              <p className="text-xs font-bold text-muted-foreground mt-0.5">
                {language === "kn" ? "ನೋಂದಾಯಿತ ರೈತ ಉತ್ಪಾದಕ ಸಂಸ್ಥೆಗಳಿಂದ ಸಗಟು ಪ್ರಮಾಣದ ಕೃಷಿ ಉತ್ಪನ್ನಗಳ ನೇರ ಸಂಗ್ರಹಣೆ." : "Procure large-scale lots securely with registered Farmer Producer Organizations."}
              </p>
            </div>
            
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {fpoBulkLots.map(fpo => {
                const l = fpo[language];
                const tons = fpoTons[fpo.id] || fpo.min_order_quantity_tons;
                const totalPrice = tons * fpo.price_per_ton;
                
                return (
                  <article 
                    key={fpo.id} 
                    className="flex flex-col rounded-3xl border border-glass-border bg-card p-5 shadow-glass transition-all hover:shadow-card"
                  >
                    {/* Icon and trust badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F5E9] shadow-sm text-4xl">
                        {fpo.icon}
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[9px] font-black text-blue-600 border border-blue-100 shadow-sm uppercase tracking-wider">
                          <ShieldCheck className="size-3 text-blue-600" />
                          {language === "kn" ? "ಪರಿಶೀಲಿಸಿದ FPO" : "Verified FPO"}
                        </span>
                        {fpo.certified_organic && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5E9] px-2.5 py-0.5 text-[9px] font-black text-[#2E7D32] border border-[#2E7D32]/10 shadow-sm uppercase tracking-wider">
                            <Leaf className="size-2.5 text-[#2E7D32]" />
                            {language === "kn" ? "ಸಾವಯವ" : "Organic"}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* FPO Registration Title */}
                    <div className="space-y-1">
                      <h3 className="font-display text-base font-black leading-tight text-slate-800">
                        {fpo.fpo_name}
                      </h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        {language === "kn" ? "ನೋಂದಣಿ ಸಂಖ್ಯೆ" : "Reg No"}: <span className="font-black text-[#2E7D32] bg-[#E8F5E9]/50 px-2 py-0.5 rounded-md">{fpo.registration_no}</span>
                      </p>
                    </div>

                    <div className="border-t border-dashed border-slate-200 my-4" />

                    {/* Dynamic translations for Variety / Location / Logistics */}
                    <div className="space-y-2 text-xs font-bold text-slate-600 flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="text-[#2E7D32]">{language === "kn" ? "ತಳಿ" : "Variety"}:</span>
                        <span className="text-slate-800 font-extrabold">{l.variety}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#2E7D32] shrink-0">{language === "kn" ? "ಸ್ಥಳ" : "Location"}:</span>
                        <span className="text-slate-700 flex items-center gap-1"><MapPin className="size-3 text-red-500 shrink-0" /> {l.location}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-secondary/20 text-slate-600 mt-2 border border-secondary/30">
                        <span className="text-[#2E7D32] font-black block mb-0.5">{language === "kn" ? "ಸಾಗಣೆ ಮತ್ತು ಪ್ಯಾಕಿಂಗ್" : "Logistics & Packing"}:</span>
                        {l.logistics}
                      </div>
                    </div>

                    {/* Procurement Target Tons Slider */}
                    <div className="mt-4 space-y-2 rounded-2xl bg-[#F1F8E9]/45 p-4 border border-[#2E7D32]/10">
                      <div className="flex justify-between items-center text-xs font-black text-slate-700">
                        <span>{language === "kn" ? "ಖರೀದಿ ಗುರಿ ಆಯ್ಕೆಮಾಡಿ (ಟನ್ಗಳು)" : "Select Procurement Target (Tons)"}</span>
                        <span className="text-[#2E7D32] text-xs font-extrabold bg-white px-2 py-0.5 rounded-full shadow-sm">
                          {tons.toFixed(1)} {language === "kn" ? "ಟನ್" : "Tons"}
                        </span>
                      </div>
                      
                      <input
                        type="range"
                        min={fpo.min_order_quantity_tons}
                        max={fpo.total_available_tons}
                        step="0.5"
                        value={tons}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setFpoTons(prev => ({ ...prev, [fpo.id]: val }));
                        }}
                        className="w-full h-2 bg-[#E8F5E9] rounded-lg appearance-none cursor-pointer accent-[#2E7D32]"
                      />
                      
                      <div className="flex justify-between text-[9px] font-bold text-slate-500">
                        <span>{language === "kn" ? "ಕನಿಷ್ಠ" : "Min"}: {fpo.min_order_quantity_tons}T</span>
                        <span>{language === "kn" ? "ಲಭ್ಯ" : "Available"}: {fpo.total_available_tons}T</span>
                      </div>
                    </div>

                    {/* Dynamic pricing calculation matrix footer */}
                    <div className="mt-4 rounded-2xl bg-[#2E7D32] p-4 text-white shadow-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="block text-[9px] uppercase font-bold text-[#E8F5E9]">
                            {language === "kn" ? "ದರ ಪ್ರತಿ ಟನ್‌ಗೆ" : "Price / Ton"}
                          </span>
                          <span className="text-sm font-extrabold flex items-center gap-0.5">
                            <IndianRupee className="size-3" />
                            {fpo.price_per_ton.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[9px] uppercase font-bold text-[#E8F5E9]">
                            {language === "kn" ? "ಒಟ್ಟು ಮೊತ್ತ" : "Total Gross Value"}
                          </span>
                          <span className="text-base font-black flex items-center justify-end gap-0.5 text-white">
                            <IndianRupee className="size-3.5" />
                            {totalPrice.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                      <a 
                        href={`tel:+918888888888`}
                        className="mt-3 flex h-8 w-full items-center justify-center gap-1.5 rounded-xl bg-white text-[#2E7D32] text-xs font-black shadow-sm hover:bg-[#E8F5E9] transition-colors"
                      >
                        <Phone className="size-3" />
                        {language === "kn" ? `${fpo.contact_person} ಸಂಪರ್ಕಿಸಿ` : `Contact ${fpo.contact_person}`}
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {role === "labourer" && <section className="mx-auto max-w-7xl px-4 py-6"><TopHeader userName={labourerProfile.name} roleLabel={t.header.labourRole} roleDetail={labourerProfile.skills || t.labourer} /><h2 className="mb-6 flex items-center gap-2 font-display text-2xl font-black text-primary"><Users className="size-7" /> {labourLabels.find}</h2><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{labourJobs.map((job) => { const slotsRemaining = job.totalSlots - job.filledSlots; const isLow = slotsRemaining <= 3; const localized = language === "kn" ? "kn" : "en"; return <article key={job.id} className="rounded-[1.25rem] border border-glass-border bg-card p-5 shadow-control transition-shadow hover:shadow-glass"><div className="mb-4 flex items-start justify-between gap-3"><h3 className="font-display text-lg font-black leading-tight">{job.title[localized]}</h3><span className={`rounded-full px-3 py-1 text-xs font-black ${isLow ? "bg-warning/18 text-warning" : "bg-secondary/45 text-primary"}`}>{slotsRemaining} {labourLabels.slots}</span></div><div className="mb-6 space-y-2"><p className="flex items-center gap-2 text-sm font-bold text-muted-foreground"><MapPin className="size-4 text-primary" />{job.location[localized]}</p><p className="flex items-center gap-2 text-sm font-bold text-muted-foreground"><Calendar className="size-4 text-primary" />{job.date}</p><p className="flex items-center gap-2 font-black text-primary"><IndianRupee className="size-4" />{job.wage}<span className="text-xs font-bold text-muted-foreground">/ {labourLabels.wage}</span></p></div><div className="mb-6 h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full transition-all duration-500 ${isLow ? "bg-warning" : "bg-primary"}`} style={{ width: `${(job.filledSlots / job.totalSlots) * 100}%` }} /></div><Button disabled={job.isApplied || slotsRemaining === 0} onClick={() => handleApplyJob(job.id)} variant={job.isApplied ? "secondaryFarm" : "field"} className="w-full rounded-xl font-black">{job.isApplied ? <><CheckCircle className="size-5" />{labourLabels.applied}</> : labourLabels.apply}</Button></article>; })}</div></section>}

      {(selectedScheme || applyingScheme || selectedCrop || sellingCrop) && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-foreground/35 p-4 backdrop-blur-sm">
          <div className="max-h-[88svh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] border border-glass-border bg-card p-5 shadow-glass">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-muted-foreground">Krishi-Mysuru</p>
                <h2 className="font-display text-2xl font-black">
                  {selectedScheme?.[language].title || applyingScheme?.[language].title || selectedCrop?.[language].crop || sellingCrop?.[language].crop}
                </h2>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { setSelectedScheme(null); setApplyingScheme(null); setSelectedCrop(null); setSellingCrop(null); }}><X /></Button>
            </div>

            {selectedScheme && <div className="space-y-3 font-bold"><p className="text-5xl">{selectedScheme[language].icon}</p><p className="inline-flex rounded-full bg-accent/35 px-3 py-1 text-xs font-black text-accent-foreground">{selectedScheme[language].tag}</p><p className="rounded-2xl bg-secondary/35 p-3"><span className="block text-xs uppercase text-muted-foreground">{t.benefit}</span>{selectedScheme[language].benefit}</p><p><span className="text-primary">{t.eligibility}: </span>{selectedScheme[language].eligibility}</p><p className="text-muted-foreground">{selectedScheme[language].description}</p><ol className="list-decimal space-y-1 pl-5 text-muted-foreground"><li>{language === "kn" ? "FRUITS ಐಡಿ ಮತ್ತು ಆಧಾರ್ ಪರಿಶೀಲಿಸಿ" : "Verify FRUITS ID and Aadhaar"}</li><li>{language === "kn" ? "ಭೂಮಿ ಮತ್ತು ಬೆಳೆ ವಿವರಗಳನ್ನು ಸೇರಿಸಿ" : "Add land and crop details"}</li><li>{language === "kn" ? "ಹತ್ತಿರದ ಕೃಷಿ ಕಚೇರಿಗೆ ಸಲ್ಲಿಸಿ" : "Submit through local agriculture office"}</li></ol><Button variant="field" className="w-full rounded-full" onClick={() => { setApplyingScheme(selectedScheme); setSelectedScheme(null); }}>{t.apply}</Button></div>}

            {applyingScheme && <form className="grid gap-3 font-bold"><p className="text-5xl">{applyingScheme[language].icon}</p>{[language === "kn" ? "ಹೆಸರು" : "Name", "Aadhaar", language === "kn" ? "ಕೃಷಿ ಸ್ಥಳ" : "Farm location", language === "kn" ? "ಬೆಳೆ" : "Crop"].map((label) => <label key={label} className="grid gap-1 text-sm"><span>{label}</span><input required defaultValue={label === (language === "kn" ? "ಕೃಷಿ ಸ್ಥಳ" : "Farm location") ? "Mysuru" : ""} className="h-11 rounded-full border border-input bg-background px-4 outline-none focus:ring-2 focus:ring-ring" /></label>)}<Button type="submit" variant="field" className="mt-2 rounded-full">{language === "kn" ? "ಅರ್ಜಿಯನ್ನು ಸಲ್ಲಿಸಿ" : "Submit application"}</Button></form>}

            {selectedCrop && <div className="space-y-4 font-bold"><div className="flex items-center gap-4"><span className="text-6xl">{selectedCrop[language].icon}</span><div><p className="text-2xl">{selectedCrop.flags}</p><p className="text-muted-foreground">{selectedCrop[language].destination}</p></div></div><div className="grid gap-3 sm:grid-cols-3"><p className="rounded-2xl bg-secondary/35 p-3"><span className="block text-xs uppercase text-muted-foreground">Demand</span>{selectedCrop[language].demand}</p><p className="rounded-2xl bg-card p-3 text-success shadow-control"><span className="block text-xs uppercase text-muted-foreground">{t.profit}</span>{selectedCrop[language].profit}</p><p className="rounded-2xl bg-accent/35 p-3"><span className="block text-xs uppercase text-muted-foreground">Tag</span>{selectedCrop[language].tag}</p></div><p><span className="text-primary">{t.reason}: </span>{selectedCrop[language].reason}</p><Button variant="field" className="w-full rounded-full" onClick={() => { setSellingCrop(selectedCrop); setSelectedCrop(null); }}>{language === "kn" ? "ರಫ್ತು ಬೆಳೆ ಮಾರಾಟ" : "Sell Export Produce"}</Button></div>}

            {sellingCrop && <form className="grid gap-3 font-bold"><p className="text-5xl">{sellingCrop[language].icon}</p>{[language === "kn" ? "ರೈತನ ಹೆಸರು" : "Farmer name", language === "kn" ? "ಫೋನ್ ಸಂಖ್ಯೆ" : "Phone number", language === "kn" ? "ಲಭ್ಯ ಪ್ರಮಾಣ" : "Available quantity", language === "kn" ? "ಗ್ರಾಮ / ತಾಲ್ಲೂಕು" : "Village / Taluk"].map((label) => <label key={label} className="grid gap-1 text-sm"><span>{label}</span><input required className="h-11 rounded-full border border-input bg-background px-4 outline-none focus:ring-2 focus:ring-ring" /></label>)}<p className="rounded-2xl bg-secondary/35 p-3 text-sm">{sellingCrop.flags} {sellingCrop[language].destination}</p><Button type="submit" variant="field" className="mt-2 rounded-full">{language === "kn" ? "ಖರೀದಿದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ" : "Connect with buyers"}</Button></form>}
          </div>
        </div>
      )}

    </main>
  );
};

export default Index;
