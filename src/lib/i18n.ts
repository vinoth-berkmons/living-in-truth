import type { Language } from '@/types/entities';

const strings: Record<string, Partial<Record<Language, string>>> = {
  'nav.home': { en: 'Home', ta: 'முகப்பு', hi: 'होम', ml: 'ഹോം', kn: 'ಮುಖಪುಟ', te: 'హోమ్' },
  'nav.videos': { en: 'Videos', ta: 'வீடியோக்கள்', hi: 'वीडियो', ml: 'വീഡിയോകൾ', kn: 'ವೀಡಿಯೊಗಳು', te: 'వీడియోలు' },
  'nav.articles': { en: 'Articles', ta: 'கட்டுரைகள்', hi: 'लेख', ml: 'ലേഖനങ്ങൾ', kn: 'ಲೇಖನಗಳು', te: 'వ్యాసాలు' },
  'nav.explore': { en: 'Explore', ta: 'ஆராய்க', hi: 'एक्सप्लोर', ml: 'പര്യവേക്ഷണം', kn: 'ಅನ್ವೇಷಿಸಿ', te: 'అన్వేషించు' },
  'nav.courses': { en: 'Courses', ta: 'பாடநெறிகள்', hi: 'कोर्स', ml: 'കോഴ്സുകൾ', kn: 'ಕೋರ್ಸ್‌ಗಳು', te: 'కోర్సులు' },
  'nav.pricing': { en: 'Pricing', ta: 'விலை', hi: 'मूल्य', ml: 'വില', kn: 'ಬೆಲೆ', te: 'ధర' },
  'nav.account': { en: 'Account', ta: 'கணக்கு', hi: 'खाता', ml: 'അക്കൗണ്ട്', kn: 'ಖಾತೆ', te: 'ఖాతా' },
  'nav.login': { en: 'Sign In', ta: 'உள்நுழைக', hi: 'साइन इन', ml: 'സൈൻ ഇൻ', kn: 'ಸೈನ್ ಇನ್', te: 'సైన్ ఇన్' },
  'nav.logout': { en: 'Sign Out', ta: 'வெளியேறு', hi: 'साइन आउट', ml: 'സൈൻ ഔട്ട്', kn: 'ಸೈನ್ ಔಟ್', te: 'సైన్ అవుట్' },
  'nav.admin': { en: 'Admin', ta: 'நிர்வாகம்', hi: 'एडमिन', ml: 'അഡ്മിൻ', kn: 'ಅಡ್ಮಿನ್', te: 'అడ్మిన్' },
  'home.choose': { en: 'Choose Your Space', ta: 'உங்கள் இடத்தை தேர்ந்தெடுங்கள்', hi: 'अपना स्पेस चुनें', ml: 'നിങ്ങളുടെ ഇടം തിരഞ്ഞെടുക്കുക', kn: 'ನಿಮ್ಮ ಸ್ಥಳ ಆಯ್ಕೆಮಾಡಿ', te: 'మీ స్థలాన్ని ఎంచుకోండి' },
  'home.subtitle': { en: 'Select a workspace to explore content, videos, and courses.', ta: 'உள்ளடக்கம், வீடியோக்கள் மற்றும் பாடநெறிகளை ஆராய ஒரு பணியிடத்தைத் தேர்ந்தெடுக்கவும்.', hi: 'सामग्री, वीडियो और कोर्स एक्सप्लोर करने के लिए वर्कस्पेस चुनें।' },
  'common.free': { en: 'Free', ta: 'இலவசம்', hi: 'मुफ़्त', ml: 'സൗജന്യം', kn: 'ಉಚಿತ', te: 'ఉచితం' },
  'common.premium': { en: 'Premium', ta: 'பிரீமியம்', hi: 'प्रीमियम', ml: 'പ്രീമിയം', kn: 'ಪ್ರೀಮಿಯಂ', te: 'ప్రీమియం' },
  'common.back': { en: 'Back', ta: 'பின்செல்', hi: 'वापस', ml: 'തിരികെ', kn: 'ಹಿಂದೆ', te: 'వెనుకకు' },
  'common.watchNow': { en: 'Watch Now', ta: 'இப்போது பாருங்கள்', hi: 'अभी देखें', ml: 'ഇപ്പോൾ കാണുക', kn: 'ಈಗ ನೋಡಿ', te: 'ఇప్పుడు చూడండి' },
  'common.readNow': { en: 'Read Now', ta: 'இப்போது படியுங்கள்', hi: 'अभी पढ़ें', ml: 'ഇപ്പോൾ വായിക്കുക', kn: 'ಈಗ ಓದಿ', te: 'ఇప్పుడు చదవండి' },
  'common.startCourse': { en: 'Start Course', ta: 'பாடத்தைத் தொடங்கு', hi: 'कोर्स शुरू करें', ml: 'കോഴ്‌സ് ആരംഭിക്കുക', kn: 'ಕೋರ್ಸ್ ಪ್ರಾರಂಭಿಸಿ', te: 'కోర్సు ప్రారంభించండి' },
  'common.viewAll': { en: 'View All', ta: 'அனைத்தையும் காண', hi: 'सभी देखें', ml: 'എല്ലാം കാണുക', kn: 'ಎಲ್ಲಾ ನೋಡಿ', te: 'అన్నీ చూడండి' },
  'common.browseAll': { en: 'Browse All', ta: 'அனைத்தையும் உலாவு', hi: 'सभी ब्राउज़ करें', ml: 'എല്ലാം ബ്രൗസ് ചെയ്യുക', kn: 'ಎಲ್ಲಾ ಬ್ರೌಸ್ ಮಾಡಿ', te: 'అన్నీ బ్రౌజ్ చేయండి' },
  'common.subscribe': { en: 'Subscribe to Unlock', ta: 'திறக்க சந்தா செலுத்துங்கள்', hi: 'अनलॉक करने के लिए सब्सक्राइब करें', ml: 'അൺലോക്ക് ചെയ്യാൻ സബ്‌സ്‌ക്രൈബ് ചെയ്യുക', kn: 'ಅನ್‌ಲಾಕ್ ಮಾಡಲು ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ', te: 'అన్‌లాక్ చేయడానికి సబ్‌స్క్రైబ్ చేయండి' },
  'common.search': { en: 'Search...', ta: 'தேடு...', hi: 'खोजें...', ml: 'തിരയുക...', kn: 'ಹುಡುಕಿ...', te: 'శోధించు...' },
  'common.signInRequired': { en: 'Sign in to access this content', ta: 'இந்த உள்ளடக்கத்தை அணுக உள்நுழையவும்', hi: 'इस सामग्री तक पहुँचने के लिए साइन इन करें' },
  'pricing.global': { en: 'All Access Plans', ta: 'அனைத்து அணுகல் திட்டங்கள்', hi: 'सभी एक्सेस प्लान' },
  'pricing.workspace': { en: 'This Workspace', ta: 'இந்த பணியிடம்', hi: 'यह वर्कस्पेस' },
  'pricing.month': { en: '/month', ta: '/மாதம்', hi: '/महीना' },
  'pricing.year': { en: '/year', ta: '/வருடம்', hi: '/साल' },
  'site.unavailable': { en: 'Site Unavailable', ta: 'தளம் கிடைக்கவில்லை', hi: 'साइट उपलब्ध नहीं है' },
  'course.enroll': { en: 'Enroll Now', ta: 'இப்போது சேரவும்', hi: 'अभी नामांकन करें', ml: 'ഇപ്പോൾ ചേരുക', kn: 'ಈಗ ನೋಂದಾಯಿಸಿ', te: 'ఇప్పుడు నమోదు చేయండి' },
  'course.continue': { en: 'Continue Learning', ta: 'தொடர்ந்து கற்கவும்', hi: 'सीखना जारी रखें' },
  'auth.loginWith': { en: 'Sign in with', ta: 'மூலம் உள்நுழையவும்', hi: 'से साइन इन करें' },
  'auth.email': { en: 'Email', ta: 'மின்னஞ்சல்', hi: 'ईमेल' },
  'auth.enterOtp': { en: 'Enter verification code', ta: 'சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்', hi: 'सत्यापन कोड दर्ज करें' },
  'explore.categories': { en: 'Categories', ta: 'வகைகள்', hi: 'श्रेणियाँ', ml: 'വിഭാഗങ്ങൾ', kn: 'ವರ್ಗಗಳು', te: 'వర్గాలు' },
  'explore.all': { en: 'All', ta: 'அனைத்தும்', hi: 'सभी', ml: 'എല്ലാം', kn: 'ಎಲ್ಲಾ', te: 'అన్నీ' },
  'explore.filter.type': { en: 'Type', ta: 'வகை', hi: 'प्रकार' },
  'explore.filter.access': { en: 'Access', ta: 'அணுகல்', hi: 'एक्सेस' },
  'lang.choose': { en: 'Choose Language', ta: 'மொழியைத் தேர்வுசெய்', hi: 'भाषा चुनें', ml: 'ഭാഷ തിരഞ്ഞെടുക്കുക', kn: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ', te: 'భాషను ఎంచుకోండి' },
  'lang.save': { en: 'Save', ta: 'சேமி', hi: 'सहेजें', ml: 'സേവ്', kn: 'ಉಳಿಸಿ', te: 'సేవ్ చేయి' },
  'lang.cancel': { en: 'Cancel', ta: 'ரத்துசெய்', hi: 'रद्द करें', ml: 'റദ്ദാക്കുക', kn: 'ರದ್ದುಮಾಡಿ', te: 'రద్దు చేయండి' },
};

export function t(key: string, lang: Language = 'en'): string {
  return strings[key]?.[lang] ?? strings[key]?.en ?? key;
}

export function getTranslation<T>(translations: Partial<Record<Language, T>> | undefined, lang: Language): T | undefined {
  if (!translations) return undefined;
  return translations[lang] ?? translations.en;
}
