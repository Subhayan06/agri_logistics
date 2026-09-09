import { SupportedLanguage, LanguageOption } from '@/types/chat';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', sublabel: 'English', speechCode: 'en-IN' },
  { code: 'bn', label: 'বাংলা', sublabel: 'Bengali', speechCode: 'bn-IN' },
  { code: 'hi', label: 'हिंदी', sublabel: 'Hindi', speechCode: 'hi-IN' },
  { code: 'gu', label: 'ગુજરાતી', sublabel: 'Gujarati', speechCode: 'gu-IN' },
  { code: 'kn', label: 'ಕನ್ನಡ', sublabel: 'Kannada', speechCode: 'kn-IN' },
  { code: 'ta', label: 'தமிழ்', sublabel: 'Tamil', speechCode: 'ta-IN' },
];

export interface TranslationDictionary {
  welcomeMessage: string;
  selectLanguagePrompt: string;
  step1Prompt: string;
  step1Error: string;
  step1Placeholder: string;
  step1Sample: string;
  step2Prompt: string;
  step2Error: string;
  step2Placeholder: string;
  step2Suggestions: string[];
  step3Prompt: string;
  step3Error: string;
  step3Placeholder: string;
  step3Suggestions: string[];
  step4Prompt: string;
  step4Placeholder: string;
  step4Suggestions: string[];
  step5Success: string;
  passCard: {
    badge: string;
    department: string;
    passTitle: string;
    passCodeLabel: string;
    farmerIdLabel: string;
    cropLabel: string;
    quantityLabel: string;
    mandiLabel: string;
    slotLabel: string;
    slotValue: string;
    statusLabel: string;
    statusValue: string;
    verifiedText: string;
    downloadBtn: string;
    shareBtn: string;
    bookAnotherBtn: string;
    directionsBtn: string;
    designatedEntry: string;
    liveGateStatus: string;
    openInGoogleMaps: string;
    closeBtn: string;
    instructionText: string;
  };
  ui: {
    botSubtitle: string;
    typing: string;
    inputPlaceholder: string;
    listening: string;
    today: string;
    encryptionNotice: string;
    speechUnsupported: string;
    copiedNotice: string;
    resetChat: string;
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    welcomeMessage: `🌾 *Welcome to KrishiQ - Official Mandi Bot!*
नमस्ते! কৃষিকিউ-তে স্বাগতম! કૃષિ ક્યૂ માં સ્વાગત છે! ಕೃಷಿಕ್ಯೂಗೆ ಸುಸ್ವಾಗತ! கிருஷிக்யூவுக்கு வரவேற்கிறோம்!

I am your official Mandi Gate Pass assistant. I will help you book an authorized entry slot for your harvest.

Please choose your preferred language to begin:`,
    selectLanguagePrompt: "Please choose your preferred language to begin:",
    step1Prompt: "👨‍🌾 Please enter your **7-digit AgriStack Farmer ID** to verify your registration (e.g. 7842109).",
    step1Error: "⚠️ *Invalid AgriStack ID!* The ID must be strictly a 7-digit numeric string (e.g. 7842109). Please try again.",
    step1Placeholder: "Type 7-digit AgriStack ID...",
    step1Sample: "7842109",
    step2Prompt: "🌾 Great! What crop do you wish to bring to the Mandi for sale?",
    step2Error: "⚠️ *Invalid Crop Name!* Please enter crop letters only (no numbers or digits allowed). Example: Paddy, Wheat, Potato.",
    step2Placeholder: "Type crop name...",
    step2Suggestions: ["Paddy", "Wheat", "Potato", "Cotton", "Mustard", "Onion"],
    step3Prompt: "⚖️ What is the estimated **quantity** of {crop} you will bring? Please specify with unit (e.g., '50 Quintals', '20 Bags', '100 Kg').",
    step3Error: "⚠️ *Invalid Quantity!* Please include both number and unit (e.g., '50 Quintals', '20 bags', '100 kg'). Pure numbers or words without quantity are not accepted.",
    step3Placeholder: "Type quantity with unit (e.g. 50 Quintals)...",
    step3Suggestions: ["50 Quintals", "100 Quintals", "20 Bags", "40 Bags", "150 Kg"],
    step4Prompt: "📍 Which is your preferred or nearest **Mandi (APMC Market)** location?",
    step4Placeholder: "Type Mandi name or town...",
    step4Suggestions: ["Azadpur Mandi", "Burdwan APMC", "Nashik Market", "Indore Mandi", "Karnal APMC"],
    step5Success: "🎉 *Booking Confirmed!* Your authorized KrishiQ Mandi e-Gate Pass has been issued. Present this digital QR pass at the security gate for express entry.",
    passCard: {
      badge: "OFFICIAL GOVERNMENT OF INDIA APMC PASS",
      department: "Ministry of Agriculture & Farmers Welfare • AgriStack",
      passTitle: "MANDI EXPRESS e-GATE PASS",
      passCodeLabel: "Pass Code",
      farmerIdLabel: "AgriStack ID",
      cropLabel: "Crop Name",
      quantityLabel: "Quantity",
      mandiLabel: "Allocated Mandi",
      slotLabel: "Allocated Time Slot",
      slotValue: "Tomorrow, 10:00 AM - 11:00 AM",
      statusLabel: "Status",
      statusValue: "VERIFIED & CONFIRMED",
      verifiedText: "KRISHIQ SECURE VERIFIED",
      downloadBtn: "Download PDF Pass",
      shareBtn: "Share Pass",
      bookAnotherBtn: "Book Another Pass",
      directionsBtn: "📍 Directions to Gate",
      designatedEntry: "Designated Entry: Gate #3 (Weighbridge Inbound)",
      liveGateStatus: "🚦 Live Gate Status: Normal Flow (~2 Trucks Ahead)",
      openInGoogleMaps: "Open in Google Maps",
      closeBtn: "Close",
      instructionText: "Scan this dynamic QR Code at the Mandi boom barrier or weighbridge."
    },
    ui: {
      botSubtitle: "Official Mandi Bot • online",
      typing: "typing...",
      inputPlaceholder: "Type a message...",
      listening: "Listening... Speak now 🎙️",
      today: "TODAY",
      encryptionNotice: "🔒 Messages and calls are end-to-end encrypted. No one outside of this chat can read them.",
      speechUnsupported: "Speech recognition is not supported in this browser.",
      copiedNotice: "Pass details copied to clipboard!",
      resetChat: "Reset / Start Over"
    }
  },

  bn: {
    welcomeMessage: `🌾 *কৃষিকিউ (KrishiQ) - অফিশিয়াল মান্ডি বটে আপনাকে স্বাগতম!*
Welcome! नमस्ते! કૃષિ ક્યૂ માં સ્વાગત છે! ಕೃಷಿಕ್ಯೂಗೆ ಸುಸ್ವಾಗತ! கிருஷிக்யூவுக்கு வரவேற்கிறோம்!

আমি আপনার মান্ডি গেট পাস সহকারী। আপনার ফসলের বিক্রির জন্য অনুমোদিত মান্ডি এন্ট্রি স্লট বুক করতে সাহায্য করব।

অনুগ্রহ করে শুরু করতে আপনার পছন্দের ভাষা বেছে নিন:`,
    selectLanguagePrompt: "অনুগ্রহ করে শুরু করতে আপনার পছন্দের ভাষা বেছে নিন:",
    step1Prompt: "👨‍🌾 আপনার নিবন্ধন যাচাই করতে আপনার **৭-সংখ্যার এগ্রিস্ট্যাক কৃষক আইডি (AgriStack ID)** লিখুন (যেমন: 7842109)।",
    step1Error: "⚠️ *ভুল এগ্রিস্ট্যাক আইডি!* আইডিটি অবশ্যই অবিকল ৭-সংখ্যার সংখ্যাসূচক হতে হবে (যেমন: 7842109)। আবার চেষ্টা করুন।",
    step1Placeholder: "৭-সংখ্যার এগ্রিস্ট্যাক আইডি লিখুন...",
    step1Sample: "7842109",
    step2Prompt: "🌾 চমৎকার! বিক্রির জন্য আপনি মান্ডিতে কোন ফসল আনতে চান?",
    step2Error: "⚠️ *ভুল ফসলের নাম!* ফসলের নামে শুধু অক্ষর বা শব্দ থাকতে হবে (কোনো সংখ্যা দেওয়া যাবে না)। যেমন: ধান, আলু, গম।",
    step2Placeholder: "ফসলের নাম লিখুন...",
    step2Suggestions: ["ধান", "আলু", "গম", "সরিষা", "পাট", "টমেটো"],
    step3Prompt: "⚖️ আপনি কত পরিমাণ **{crop}** আনতে চান? অনুগ্রহ করে একক সহ পরিমাণ উল্লেখ করুন (যেমন: '৫০ কুইন্টাল', '২০ বস্তা', '১০০ কেজি')।",
    step3Error: "⚠️ *ভুল পরিমাণ!* অনুগ্রহ করে সংখ্যা এবং একক উভয়ই উল্লেখ করুন (যেমন: '৫০ কুইন্টাল', '২০ বস্তা', '১০০ কেজি')। শুধু সংখ্যা গ্রহণযোগ্য নয়।",
    step3Placeholder: "একক সহ পরিমাণ লিখুন (যেমন: ৫০ কুইন্টাল)...",
    step3Suggestions: ["৫০ কুইন্টাল", "১০০ কুইন্টাল", "২০ বস্তা", "৫০ বস্তা", "২০০ কেজি"],
    step4Prompt: "📍 আপনার পছন্দের বা নিকটবর্তী **মান্ডি (APMC মার্কেট)** এর নাম বা অবস্থান লিখুন:",
    step4Placeholder: "নিকটবর্তী মান্ডির নাম লিখুন...",
    step4Suggestions: ["বর্ধমান মান্ডি", "শিলিগুড়ি এগ্রি মার্কেট", "মেদিনীপুর কিষাণ মান্ডি", "মালদা মার্কেট", "হুগলী এপিএমসি"],
    step5Success: "🎉 *বুকিং সফলভাবে সম্পন্ন হয়েছে!* আপনার অনুমোদিত কৃষিকিউ মান্ডি ই-গেট পাস ইস্যু করা হয়েছে। মান্ডি প্রবেশের সময় এই ডিজিটাল কিউআর পাস প্রদর্শন করুন।",
    passCard: {
      badge: "অফিশিয়াল ভারত সরকার এপিএমসি পাস",
      department: "কৃষি ও কৃষক কল্যাণ মন্ত্রক • এগ্রিস্ট্যাক",
      passTitle: "মান্ডি এক্সপ্রেস ই-গেট পাস",
      passCodeLabel: "পাস কোড",
      farmerIdLabel: "এগ্রিস্ট্যাক আইডি",
      cropLabel: "ফসলের নাম",
      quantityLabel: "পরিমাণ",
      mandiLabel: "বরাদ্দকৃত মান্ডি",
      slotLabel: "বরাদ্দকৃত সময় স্লট",
      slotValue: "আগামীকাল, সকাল ১০:০০ - ১১:০০",
      statusLabel: "স্ট্যাটাস",
      statusValue: "যাচাইকৃত এবং নিশ্চিত",
      verifiedText: "কৃষিকিউ সুরক্ষিত যাচাইকৃত",
      downloadBtn: "পাস ডাউনলোড করুন",
      shareBtn: "শেয়ার করুন",
      bookAnotherBtn: "নতুন পাস বুক করুন",
      directionsBtn: "📍 গেট নির্দেশিকা",
      designatedEntry: "নির্ধারিত প্রবেশপথ: গেট নং ৩ (ওয়েব্রিজ ইনবাউন্ড)",
      liveGateStatus: "🚦 লাইভ গেট স্ট্যাটাস: স্বাভাবিক ট্র্যাফিক (~২টি ট্রাক আগে আছে)",
      openInGoogleMaps: "গুগল ম্যাপে খুলুন",
      closeBtn: "বন্ধ করুন",
      instructionText: "মান্ডি গেট বা ওজন স্কেলে এই কিউআর কোডটি স্ক্যান করান।"
    },
    ui: {
      botSubtitle: "অফিশিয়াল মান্ডি বট • অনলাইন",
      typing: "টাইপ করছে...",
      inputPlaceholder: "একটি বার্তা লিখুন...",
      listening: "শুনছি... এখন কথা বলুন 🎙️",
      today: "আজ",
      encryptionNotice: "🔒 বার্তাগুলি এন্ড-টু-এন্ড এনক্রিপ্ট করা হয়েছে। বাইরের কেউ এগুলো পড়তে পারবে না।",
      speechUnsupported: "এই ব্রাউজারে ভয়েস রিকগনিশন সমর্থিত নয়।",
      copiedNotice: "পাস তথ্য ক্লিপবোর্ডে কপি করা হয়েছে!",
      resetChat: "পুনরায় শুরু করুন"
    }
  },

  hi: {
    welcomeMessage: `🌾 *कृषि क्यू (KrishiQ) - आधिकारिक मंडी बॉट में आपका स्वागत है!*
Welcome! কৃষিকিউ-তে স্বাগতম! કૃષિ ક્યૂ માં સ્વાગત છે! ಕೃಷಿಕ್ಯೂಗೆ ಸುಸ್ವಾಗತ! கிருஷிக்யூவுக்கு வரவேற்கிறோம்!

मैं आपका आधिकारिक मंडी गेट पास सहायक हूँ। मैं आपकी फसल बिक्री के लिए ई-गेट पास बुक करने में सहायता करूँगा।

कृपया आगे बढ़ने के लिए अपनी पसंदीदा भाषा चुनें:`,
    selectLanguagePrompt: "कृपया आगे बढ़ने के लिए अपनी पसंदीदा भाषा चुनें:",
    step1Prompt: "👨‍🌾 अपना पंजीकरण सत्यापित करने के लिए कृपया अपना **7-अंकों का एग्रीस्टैक किसान आईडी (AgriStack ID)** दर्ज करें (उदा. 7842109)।",
    step1Error: "⚠️ *अमान्य एग्रीस्टैक आईडी!* आईडी केवल 7 अंकों की संख्या होनी चाहिए (जैसे 7842109)। कृपया पुनः प्रयास करें।",
    step1Placeholder: "7-अंकों का एग्रीस्टैक आईडी लिखें...",
    step1Sample: "7842109",
    step2Prompt: "🌾 बहुत बढ़िया! आप मंडी में बिक्री के लिए कौन सी फसल लाना चाहते हैं?",
    step2Error: "⚠️ *अमान्य फसल का नाम!* फसल के नाम में केवल अक्षर होने चाहिए (संख्या या अंक मान्य नहीं हैं)। उदाहरण: धान, गेहूँ, आलू।",
    step2Placeholder: "फसल का नाम लिखें...",
    step2Suggestions: ["धान", "गेहूँ", "आलू", "कपास", "सरसों", "प्याज"],
    step3Prompt: "⚖️ आप कितनी मात्रा में **{crop}** लाना चाहते हैं? कृपया इकाई सहित मात्रा लिखें (उदा. '50 क्विंटल', '20 बोरी', '100 किलो')।",
    step3Error: "⚠️ *अमान्य मात्रा!* कृपया संख्या और इकाई दोनों लिखें (जैसे '50 क्विंटल', '20 बोरी', '100 किलो')। केवल संख्या मान्य नहीं है।",
    step3Placeholder: "मात्रा इकाई के साथ लिखें (उदा. 50 क्विंटल)...",
    step3Suggestions: ["50 क्विंटल", "100 क्विंटल", "20 बोरी", "50 बोरी", "200 किलो"],
    step4Prompt: "📍 आपकी पसंदीदा अथवा निकटतम **मंडी (APMC बाज़ार)** का नाम या स्थान क्या है?",
    step4Placeholder: "निकटतम मंडी का नाम लिखें...",
    step4Suggestions: ["आज़ादपुर मंडी", "इंदौर APMC", "कोटा मंडी", "करनाल मंडी", "नासिक मार्केट"],
    step5Success: "🎉 *बुकिंग सफल!* आपका आधिकारिक कृषि क्यू ई-गेट पास जारी कर दिया गया है। मंडी प्रवेश द्वार पर यह डिजिटल क्यूआर पास दिखाएं।",
    passCard: {
      badge: "भारत सरकार आधिकारिक APMC पास",
      department: "कृषि एवं किसान कल्याण मंत्रालय • एग्रीस्टैक",
      passTitle: "मंडी एक्सप्रेस ई-गेट पास",
      passCodeLabel: "पास कोड",
      farmerIdLabel: "एग्रीस्टैक आईडी",
      cropLabel: "फसल का नाम",
      quantityLabel: "मात्रा",
      mandiLabel: "आवंटित मंडी",
      slotLabel: "आवंटित समय स्लॉट",
      slotValue: "कल, सुबह 10:00 - 11:00",
      statusLabel: "स्थिति",
      statusValue: "सत्यापित एवं सुनिश्चित",
      verifiedText: "कृषि क्यू प्रमाणित सुरक्षित",
      downloadBtn: "पास डाउनलोड करें",
      shareBtn: "पास शेयर करें",
      bookAnotherBtn: "दूसरा पास बुक करें",
      directionsBtn: "📍 गेट के लिए दिशा-निर्देश",
      designatedEntry: "निर्धारित प्रवेश: गेट #3 (धर्मकांटा/वेब्रिज इनबाउंड)",
      liveGateStatus: "🚦 लाइव गेट स्थिति: सामान्य प्रवाह (~2 ट्रक आगे)",
      openInGoogleMaps: "Google मैप्स में खोलें",
      closeBtn: "बंद करें",
      instructionText: "मंडी गेट या तौल कांटे पर इस क्यूआर कोड को स्कैन कराएं।"
    },
    ui: {
      botSubtitle: "आधिकारिक मंडी बॉट • ऑनलाइन",
      typing: "टाइप कर रहा है...",
      inputPlaceholder: "संदेश लिखें...",
      listening: "सुन रहे हैं... अब बोलें 🎙️",
      today: "आज",
      encryptionNotice: "🔒 संदेश एंड-टू-एंड एन्क्रिप्टेड हैं। इस चैट के बाहर कोई इन्हें नहीं पढ़ सकता।",
      speechUnsupported: "इस ब्राउज़र में वॉइस सुविधा उपलब्ध नहीं है।",
      copiedNotice: "पास विवरण कॉपी हो गया!",
      resetChat: "शुरुआत से शुरू करें"
    }
  },

  gu: {
    welcomeMessage: `🌾 *કૃષિ ક્યૂ (KrishiQ) - અધિકૃત મંડી બોટમાં આપનું સ્વાગત છે!*
Welcome! नमस्ते! কৃষিকিউ-তে স্বাগতম! ಕೃಷಿಕ್ಯೂಗೆ ಸುಸ್ವಾಗತ! கிருஷிக்யூவுக்கு வரவேற்கிறோம்!

હું આપનો અધિકૃત મંડી ગેટ પાસ સહાયક છું. પાક વેચાણ માટે સ્લોટ બુક કરવામાં મદદ કરીશ.

કૃપા કરીને શરૂ કરવા માટે આપની પસંદગીની ભાષા પસંદ કરો:`,
    selectLanguagePrompt: "કૃપા કરીને શરૂ કરવા માટે આપની પસંદગીની ભાષા પસંદ કરો:",
    step1Prompt: "👨‍🌾 આપની નોંધણી ચકાસવા માટે કૃપા કરીને આપનો **7-અંકનો એગ્રીસ્ટેક કિસાન આઈડી (AgriStack ID)** દાખલ કરો (દા.ત. 7842109).",
    step1Error: "⚠️ *અમાન્ય એગ્રીસ્ટેક આઈડી!* આઈડી બરાબર 7 અંકોનો નંબર હોવો જોઈએ (દા.ત. 7842109). ફરીથી પ્રયાસ કરો.",
    step1Placeholder: "7-અંકનો એગ્રીસ્ટેક આઈડી લખો...",
    step1Sample: "7842109",
    step2Prompt: "🌾 સરસ! આપ મંડીમાં વેચાણ માટે કયો પાક લાવવા માંગો છો?",
    step2Error: "⚠️ *અમાન્ય પાકનું નામ!* પાકના નામમાં ફક્ત અક્ષરો હોવા જોઈએ (સંખ્યા માન્ય નથી). દાખલા તરીકે: કપાસ, મગફળી, ઘઉં.",
    step2Placeholder: "પાકનું નામ લખો...",
    step2Suggestions: ["કપાસ", "મગફળી", "ઘઉં", "જીરું", "ડુંગળી", "બાજરી"],
    step3Prompt: "⚖️ આપ કેટલી માત્રામાં **{crop}** લાવવા માંગો છો? કૃપા કરીને એકમ સાથે માત્રા લખો (દા.ત. '50 ક્વિન્ટલ', '20 ગુણી', '100 કિલો').",
    step3Error: "⚠️ *અમાન્ય માત્રા!* કૃપા કરીને સંખ્યા અને એકમ બંને લખો (દા.ત. '50 ક્વિન્ટલ', '20 ગુણી'). ફક્ત સંખ્યા માન્ય નથી.",
    step3Placeholder: "એકમ સાથે જથ્થો લખો (દા.ત. 50 ક્વિન્ટલ)...",
    step3Suggestions: ["50 ક્વિન્ટલ", "100 ક્વિન્ટલ", "20 ગુણી", "50 ગુણી", "200 કિલો"],
    step4Prompt: "📍 આપની નજીકની અથવા પસંદગીની **મંડી (APMC માર્કેટ)** નું નામ અથવા સ્થળ જણાવો:",
    step4Placeholder: "નજીકની મંડીનું નામ લખો...",
    step4Suggestions: ["ઊંઝા APMC", "રાજકોટ માર્કેટ યાર્ડ", "ગોંડલ APMC", "અમદાવાદ મંડી", "સુરત APMC"],
    step5Success: "🎉 *બુકિંગ કન્ફર્મ!* આપનો અધિકૃત કૃષિ ક્યૂ ઈ-ગેટ પાસ જારી થઈ ગયો છે. મંડીના પ્રવેશદ્વાર પર આ ડિજિટલ ક્યૂઆર પાસ બતાવો.",
    passCard: {
      badge: "ભારત સરકાર અધિકૃત APMC પાસ",
      department: "કૃષિ અને ખેડૂત કલ્યાણ મંત્રાલય • એગ્રીસ્ટેક",
      passTitle: "મંડી એક્સપ્રેસ ઈ-ગેટ પાસ",
      passCodeLabel: "પાસ કોડ",
      farmerIdLabel: "એગ્રીસ્ટેક આઈડી",
      cropLabel: "પાકનું નામ",
      quantityLabel: "જથ્થો / માત્રા",
      mandiLabel: "મળેલી મંડી",
      slotLabel: "મળેલો સમય સ્લોટ",
      slotValue: "આવતીકાલે, સવારે 10:00 - 11:00",
      statusLabel: "સ્થિતિ",
      statusValue: "ચકાસાયેલ અને પુષ્ટિ થયેલ",
      verifiedText: "કૃષિ ક્યૂ પ્રમાણિત સુરક્ષિત",
      downloadBtn: "પાસ ડાઉનલોડ કરો",
      shareBtn: "શેર કરો",
      bookAnotherBtn: "બીજો પાસ બુક કરો",
      directionsBtn: "📍 ગેટ માટે દિશા-નિર્દેશ",
      designatedEntry: "નિયુક્ત પ્રવેશ: ગેટ #3 (વજન કાંટો ઇનબાઉન્ડ)",
      liveGateStatus: "🚦 લાઈવ ગેટ સ્થિતિ: સામાન્ય પ્રવાહ (~2 ટ્રક આગળ)",
      openInGoogleMaps: "Google Maps માં ખોલો",
      closeBtn: "બંધ કરો",
      instructionText: "મંડી એન્ટ્રી ગેટ અથવા વજન કાંટા પર આ ક્યૂઆર કોડ સ્કેન કરાવો."
    },
    ui: {
      botSubtitle: "અધિકૃત મંડી બોટ • ઓનલાઇન",
      typing: "ટાઇપ કરી રહ્યું છે...",
      inputPlaceholder: "સંદેશ લખો...",
      listening: "સાંભળી રહ્યા છીએ... હવે બોલો 🎙️",
      today: "આજે",
      encryptionNotice: "🔒 સંદેશાઓ એન્ડ-ટુ-એન્ડ એન્ક્રિપ્ટેડ છે. આ ચેટની બહાર કોઈ વાંચી શકતું નથી.",
      speechUnsupported: "આ બ્રાઉઝરમાં વોઇસ સપોર્ટ નથી.",
      copiedNotice: "પાસ વિગત કોપી થઈ ગઈ!",
      resetChat: "ફરીથી શરૂ કરો"
    }
  },

  kn: {
    welcomeMessage: `🌾 *ಕೃಷಿಕ್ಯೂ (KrishiQ) - ಅಧಿಕೃತ ಮಂಡಿ ಬಾಟ್‌ಗೆ ಸುಸ್ವಾಗತ!*
Welcome! नमस्ते! কৃষিকিউ-তে স্বাগতম! કૃષિ ક્યૂ માં સ્વાગત છે! கிருஷிக்யೂவுக்கு வரவேற்கிறோம்!

ನಾನು ನಿಮ್ಮ ಅಧಿಕೃತ ಮಂಡಿ ಗೇಟ್ ಪಾಸ್ ಸಹಾಯಕ. ನಿಮ್ಮ ಬೆಳೆ ಮಾರಾಟಕ್ಕಾಗಿ ಮಂಡಿ ಪ್ರವೇಶ ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.

ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:`,
    selectLanguagePrompt: "ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:",
    step1Prompt: "👨‍🌾 ನಿಮ್ಮ ನೋಂದಣಿಯನ್ನು ದೃಢೀಕರಿಸಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ **7-ಅಂಕಿಯ ಅಗ್ರಿಸ್ಟಾಕ್ ರೈತ ಐಡಿ (AgriStack ID)** ನಮೂದಿಸಿ (ಉದಾ: 7842109).",
    step1Error: "⚠️ *ಅಮಾನ್ಯ ಅಗ್ರಿಸ್ಟಾಕ್ ಐಡಿ!* ಐಡಿಯು ಕಡ್ಡಾಯವಾಗಿ 7 ಅಂಕಿಯ ಸಂಖ್ಯೆಯಾಗಿರಬೇಕು (ಉದಾ: 7842109). ದಯವಿಟ್ಟು ಮರುಪ್ರಯತ್ನಿಸಿ.",
    step1Placeholder: "7-ಅಂಕಿಯ ಅಗ್ರಿಸ್ಟಾಕ್ ಐಡಿ ನಮೂದಿಸಿ...",
    step1Sample: "7842109",
    step2Prompt: "🌾 ಉತ್ತಮ! ನೀವು ಮಾರಾಟಕ್ಕಾಗಿ ಮಂಡಿಗೆ ಯಾವ ಬೆಳೆಯನ್ನು ತರಲು ಬಯಸುತ್ತೀರಿ?",
    step2Error: "⚠️ *ಅಮಾನ್ಯ ಬೆಳೆಯ ಹೆಸರು!* ಬೆಳೆಯ ಹೆಸರು ಕೇವಲ ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು (ಸಂಖ್ಯೆಗಳಿಗೆ ಅವಕಾಶವಿಲ್ಲ). ಉದಾಹರಣೆ: ಭತ್ತ, ಜೋಳ, ಆಲೂಗಡ್ಡೆ.",
    step2Placeholder: "ಬೆಳೆಯ ಹೆಸರು ನಮೂದಿಸಿ...",
    step2Suggestions: ["ಭತ್ತ", "ರಾಗಿ", "ಜೋಳ", "ಹತ್ತಿ", "ಕಬ್ಬು", "ಈರುಳ್ಳಿ"],
    step3Prompt: "⚖️ ನೀವು ಎಷ್ಟು ಪ್ರಮಾಣದಲ್ಲಿ **{crop}** ತರಲು ಬಯಸುತ್ತೀರಿ? ದಯವಿಟ್ಟು ಘಟಕದೊಂದಿಗೆ ಪ್ರಮಾಣವನ್ನು ನಮೂದಿಸಿ (ಉದಾ: '50 ಕ್ವಿಂಟಾಲ್', '20 ಚೀಲ', '100 ಕೆಜಿ').",
    step3Error: "⚠️ *ಅಮಾನ್ಯ ಪ್ರಮಾಣ!* ದಯವಿಟ್ಟು ಸಂಖ್ಯೆ ಮತ್ತು ಘಟಕ ಎರಡನ್ನೂ ನಮೂದಿಸಿ (ಉದಾ: '50 ಕ್ವಿಂಟಾಲ್', '20 ಚೀಲ'). ಕೇವಲ ಸಂಖ್ಯೆಗಳನ್ನು ಸ್ವೀಕರಿಸಲಾಗುವುದಿಲ್ಲ.",
    step3Placeholder: "ಘಟಕದೊಂದಿಗೆ ಪ್ರಮಾಣ ನಮೂದಿಸಿ (ಉದಾ: 50 ಕ್ವಿಂಟಾಲ್)...",
    step3Suggestions: ["50 ಕ್ವಿಂಟಾಲ್", "100 ಕ್ವಿಂಟಾಲ್", "20 ಚೀಲ", "50 ಚೀಲ", "200 ಕೆಜಿ"],
    step4Prompt: "📍 ನಿಮ್ಮ ಹತ್ತಿರದ ಅಥವಾ ಆದ್ಯತೆಯ **ಮಂಡಿ (APMC ಮಾರುಕಟ್ಟೆ)** ಹೆಸರು ಅಥವಾ ಸ್ಥಳ ಯಾವುದು?",
    step4Placeholder: "ಹತ್ತಿರದ ಮಂಡಿಯ ಹೆಸರು ನಮೂದಿಸಿ...",
    step4Suggestions: ["ಯಶವಂತಪುರ APMC", "ಹುಬ್ಬಳ್ಳಿ ಮಂಡಿ", "ದಾವಣಗೆರೆ ಮಾರುಕಟ್ಟೆ", "ಮೈಸೂರು APMC", "ಶಿವಮೊಗ್ಗ ಮಂಡಿ"],
    step5Success: "🎉 *ಬುಕಿಂಗ್ ಖಚಿತಗೊಂಡಿದೆ!* ನಿಮ್ಮ ಅಧಿಕೃತ ಕೃಷಿಕ್ಯೂ ಮಂಡಿ ಇ-ಗೇಟ್ ಪಾಸ್ ನೀಡಲಾಗಿದೆ. ಮಂಡಿ ಪ್ರವೇಶದ್ವಾರದಲ್ಲಿ ಈ ಡಿಜಿಟಲ್ ಕ್ಯೂಆರ್ ಪಾಸ್ ತೋರಿಸಿ.",
    passCard: {
      badge: "ಭಾರತ ಸರ್ಕಾರದ ಅಧಿಕೃತ APMC ಪಾಸ್",
      department: "ಕೃಷಿ ಮತ್ತು ರೈತರ ಕಲ್ಯಾಣ ಸಚಿವಾಲಯ • ಅಗ್ರಿಸ್ಟಾಕ್",
      passTitle: "ಮಂಡಿ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಇ-ಗೇಟ್ ಪಾಸ್",
      passCodeLabel: "ಪಾಸ್ ಕೋಡ್",
      farmerIdLabel: "ಅಗ್ರಿಸ್ಟಾಕ್ ಐಡಿ",
      cropLabel: "ಬೆಳೆಯ ಹೆಸರು",
      quantityLabel: "ಪ್ರಮಾಣ",
      mandiLabel: "ನಿಯೋಜಿತ ಮಂಡಿ",
      slotLabel: "ನಿಯೋಜಿತ ಸಮಯದ ಸ್ಲಾಟ್",
      slotValue: "ನಾಳೆ, ಬೆಳಿಗ್ಗೆ 10:00 - 11:00",
      statusLabel: "ಸ್ಥಿತಿ",
      statusValue: "ದೃಢೀಕರಿಸಲಾಗಿದೆ & ಖಚಿತವಾಗಿದೆ",
      verifiedText: "ಕೃಷಿಕ್ಯೂ ಸುರಕ್ಷಿತ ದೃಢೀಕರಣ",
      downloadBtn: "ಪಾಸ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
      shareBtn: "ಹಂಚಿಕೊಳ್ಳಿ",
      bookAnotherBtn: "ಮತ್ತೊಂದು ಪಾಸ್ ಬುಕ್ ಮಾಡಿ",
      directionsBtn: "📍 ಗೇಟ್ ಮಾರ್ಗದರ್ಶನ",
      designatedEntry: "ನಿಯೋಜಿತ ಪ್ರವೇಶದ್ವಾರ: ಗೇಟ್ #3 (ತೂಕದ ಸೇತುವೆ ಒಳಬರುವ ಮಾರ್ಗ)",
      liveGateStatus: "🚦 ಲೈವ್ ಗೇಟ್ ಸ್ಥಿತಿ: ಸಾಮಾನ್ಯ ಚಲನೆ (~2 ಲಾರಿಗಳು ಮುಂದೆ)",
      openInGoogleMaps: "Google Maps ನಲ್ಲಿ ತೆರೆಯಿರಿ",
      closeBtn: "ಮುಚ್ಚಿ",
      instructionText: "ಮಂಡಿ ಪ್ರವೇಶ ಗೇಟ್ ಅಥವಾ ತೂಕದ ಯಂತ್ರದ ಬಳಿ ಈ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ."
    },
    ui: {
      botSubtitle: "ಅಧಿಕೃತ ಮಂಡಿ ಬಾಟ್ • ಆನ್‌ಲೈನ್",
      typing: "ಟೈಪ್ ಮಾಡುತ್ತಿದೆ...",
      inputPlaceholder: "ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...",
      listening: "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ... ಈಗ ಮಾತನಾಡಿ 🎙️",
      today: "ಇಂದು",
      encryptionNotice: "🔒 ಸಂದೇಶಗಳು ಎಂಡ್-ಟು-ಎಂಡ್ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಆಗಿವೆ. ಈ ಚಾಟ್ ಹೊರಗೆ ಯಾರೂ ಓದಲು ಸಾಧ್ಯವಿಲ್ಲ.",
      speechUnsupported: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಸೌಲಭ್ಯ ಲಭ್ಯವಿಲ್ಲ.",
      copiedNotice: "ಪಾಸ್ ವಿವರಗಳನ್ನು ನಕಲಿಸಲಾಗಿದೆ!",
      resetChat: "ಮರುಪ್ರಾರಂಭಿಸಿ"
    }
  },

  ta: {
    welcomeMessage: `🌾 *கிருஷிக்யூ (KrishiQ) - அதிகாரப்பூர்வ மண்டி பாட்டிற்கு நல்வரவு!*
Welcome! नमस्ते! কৃষিকিউ-তে স্বাগতম! કૃષિ ક્યૂ માં સ્વાગત છે! ಕೃಷಿಕ್ಯೂಗೆ ಸುಸ್ವಾಗತ!

நான் உங்கள் அதிகாரப்பூர்வ மண்டி கேட் பாஸ் உதவியாளர். உங்கள் பயிர் விற்பனைக்கான நுழைவுச் சீட்டைப் பதிவு செய்ய உதவுகிறேன்.

தொடங்க உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்:`,
    selectLanguagePrompt: "தொடங்க உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்:",
    step1Prompt: "👨‍🌾 உங்கள் பதிவைச் சரிபார்க்க உங்கள் **7-இலக்க அக்ரிஸ்டாக் உழவர் ஐடி (AgriStack ID)** ஐ உள்ளிடவும் (எ.கா: 7842109).",
    step1Error: "⚠️ *தவறான அக்ரிஸ்டாக் ஐடி!* ஐடி கண்டிப்பாக 7-இலக்க எண்ணாக மட்டுமே இருக்க வேண்டும் (எ.கா: 7842109). மீண்டும் முயற்சிக்கவும்.",
    step1Placeholder: "7-இலக்க அக்ரிஸ்டாக் ஐடி உள்ளிடவும்...",
    step1Sample: "7842109",
    step2Prompt: "🌾 அற்புதம்! விற்பனைக்காக மண்டிக்கு நீங்கள் என்ன பயிரைக் கொண்டு வர விரும்புகிறீர்கள்?",
    step2Error: "⚠️ *தவறான பயிர் பெயர்!* பயிரின் பெயரில் எழுத்துக்கள் மட்டுமே இருக்க வேண்டும் (எண்களுக்கு அனுமதியில்லை). உதாரணம்: நெல், கரும்பு, உருளைக்கிழங்கு.",
    step2Placeholder: "பயிரின் பெயரை உள்ளிடவும்...",
    step2Suggestions: ["நெல்", "கரும்பு", "மக்காச்சோளம்", "பருத்தி", "வாழை", "வெங்காயம்"],
    step3Prompt: "⚖️ நீங்கள் எவ்வளவு அளவில் **{crop}** கொண்டு வர விரும்புகிறீர்கள்? தயவுசெய்து அலகுடன் அளவைக் குறிப்பிடவும் (எ.கா: '50 குவிண்டால்', '20 மூட்டை', '100 கிலோ').",
    step3Error: "⚠️ *தவறான அளவு!* எண் மற்றும் அலகு இரண்டையும் குறிப்பிடவும் (எ.கா: '50 குவிண்டால்', '20 மூட்டை'). வெறும் எண்கள் ஏற்றுக்கொள்ளப்படாது.",
    step3Placeholder: "அலகுடன் அளவை உள்ளிடவும் (எ.கா: 50 குவிண்டால்)...",
    step3Suggestions: ["50 குவிண்டால்", "100 குவிண்டால்", "20 மூட்டை", "50 மூட்டை", "200 கிலோ"],
    step4Prompt: "📍 உங்கள் அருகிலுள்ள அல்லது விருப்பமான **மண்டி (APMC சந்தை)** பெயர் அல்லது இடத்தை உள்ளிடவும்:",
    step4Placeholder: "அருகிலுள்ள மண்டியின் பெயரை உள்ளிடவும்...",
    step4Suggestions: ["கோயம்பேடு APMC", "மதுரை மண்டி", "ஈரோடு மஞ்சள் சந்தை", "திண்டுக்கல் மார்க்கெட்", "திருச்சி APMC"],
    step5Success: "🎉 *பதிவு உறுதியானது!* உங்கள் அதிகாரப்பூர்வ கிருஷிக்யூ மண்டி இ-கேட் பாஸ் வழங்கப்பட்டுள்ளது. மண்டி நுழைவு வாயிலில் இந்த டிஜிட்டಲ್ க்யூஆர் பாஸைக் காட்டவும்.",
    passCard: {
      badge: "இந்திய அரசு அதிகாரப்பூர்வ APMC பாஸ்",
      department: "வேளாண்மை மற்றும் உழவர் நல அமைச்சகம் • அக்ரிஸ்டாக்",
      passTitle: "மண்டி எக்ஸ்பிரஸ் இ-கேட் பாஸ்",
      passCodeLabel: "பாஸ் குறியீடு",
      farmerIdLabel: "அக்ரிஸ்டாக் ஐடி",
      cropLabel: "பயிரின் பெயர்",
      quantityLabel: "அளவு",
      mandiLabel: "ஒதுக்கப்பட்ட மண்டி",
      slotLabel: "ஒதுக்கப்பட்ட நேர இடைவெளி",
      slotValue: "நாளை, காலை 10:00 - 11:00",
      statusLabel: "நிலை",
      statusValue: "சரிபார்க்கப்பட்டு உறுதியானது",
      verifiedText: "கிருஷிக்யூ பாதுகாப்பு சரிபார்ப்பு",
      downloadBtn: "பாஸ் பதிவிறக்கம்",
      shareBtn: "பகிர்",
      bookAnotherBtn: "மற்றொரு பாஸ் பதிவு செய்",
      directionsBtn: "📍 வாயில் வழிகாட்டுதல்",
      designatedEntry: "ஒதுக்கப்பட்ட நுழைவு: கேட் #3 (எடை பாலம் உட்செல்லும் வழி)",
      liveGateStatus: "🚦 நேரலை கேட் நிலை: இயல்பான ஓட்டம் (~2 லாரிகள் முன்னால்)",
      openInGoogleMaps: "Google Maps இல் திறக்கவும்",
      closeBtn: "மூடு",
      instructionText: "மண்டி நுழைவு வாயிலில் இந்த க்யூஆர் குறியீட்டை ஸ்கேன் செய்யவும்."
    },
    ui: {
      botSubtitle: "அதிகாரப்பூர்வ மண்டி பாட் • ஆன்லைன்",
      typing: "தட்டச்சு செய்கிறது...",
      inputPlaceholder: "ஒரு செய்தியைத் தட்டச்சு செய்க...",
      listening: "கேட்கிறது... இப்போது பேசுங்கள் 🎙️",
      today: "இன்று",
      encryptionNotice: "🔒 செய்திகள் முழுமையாக என்க்ரிப்ட் செய்யப்பட்டுள்ளன. இந்த அரட்டைக்கு வெளியே யாரும் படிக்க முடியாது.",
      speechUnsupported: "இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை.",
      copiedNotice: "பாஸ் விவரங்கள் நகலெடுக்கப்பட்டன!",
      resetChat: "மீண்டும் தொடங்கவும்"
    }
  }
};
