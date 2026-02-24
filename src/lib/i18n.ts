import type { Language } from '@/types/entities';

const strings: Record<string, Record<Language, string>> = {
  'nav.explore': { en: 'Explore', ar: 'استكشف', fr: 'Explorer', es: 'Explorar', de: 'Entdecken', tr: 'Keşfet' },
  'nav.courses': { en: 'Courses', ar: 'الدورات', fr: 'Cours', es: 'Cursos', de: 'Kurse', tr: 'Kurslar' },
  'nav.pricing': { en: 'Pricing', ar: 'الأسعار', fr: 'Tarifs', es: 'Precios', de: 'Preise', tr: 'Fiyatlar' },
  'nav.account': { en: 'Account', ar: 'الحساب', fr: 'Compte', es: 'Cuenta', de: 'Konto', tr: 'Hesap' },
  'nav.login': { en: 'Sign In', ar: 'تسجيل الدخول', fr: 'Connexion', es: 'Iniciar sesión', de: 'Anmelden', tr: 'Giriş' },
  'nav.logout': { en: 'Sign Out', ar: 'تسجيل الخروج', fr: 'Déconnexion', es: 'Cerrar sesión', de: 'Abmelden', tr: 'Çıkış' },
  'nav.admin': { en: 'Admin', ar: 'الإدارة', fr: 'Admin', es: 'Admin', de: 'Admin', tr: 'Yönetim' },
  'home.choose': { en: 'Choose Your Space', ar: 'اختر مساحتك', fr: 'Choisissez votre espace', es: 'Elige tu espacio', de: 'Wähle deinen Bereich', tr: 'Alanınızı seçin' },
  'home.subtitle': { en: 'Select a workspace to explore content, videos, and courses.', ar: 'اختر مساحة عمل لاستكشاف المحتوى والفيديوهات والدورات.', fr: 'Sélectionnez un espace pour explorer le contenu.', es: 'Selecciona un espacio para explorar contenido.', de: 'Wähle einen Bereich zum Erkunden.', tr: 'İçerik keşfetmek için bir alan seçin.' },
  'common.free': { en: 'Free', ar: 'مجاني', fr: 'Gratuit', es: 'Gratis', de: 'Kostenlos', tr: 'Ücretsiz' },
  'common.premium': { en: 'Premium', ar: 'مميز', fr: 'Premium', es: 'Premium', de: 'Premium', tr: 'Premium' },
  'common.back': { en: '← Back', ar: '← رجوع', fr: '← Retour', es: '← Volver', de: '← Zurück', tr: '← Geri' },
  'pricing.global': { en: 'All Access Plans', ar: 'خطط الوصول الكامل', fr: 'Plans Accès Total', es: 'Planes de Acceso Total', de: 'Voller Zugang', tr: 'Tam Erişim Planları' },
  'pricing.workspace': { en: 'This Workspace', ar: 'هذه المساحة', fr: 'Cet espace', es: 'Este espacio', de: 'Dieser Bereich', tr: 'Bu Alan' },
  'pricing.month': { en: '/month', ar: '/شهر', fr: '/mois', es: '/mes', de: '/Monat', tr: '/ay' },
  'pricing.year': { en: '/year', ar: '/سنة', fr: '/an', es: '/año', de: '/Jahr', tr: '/yıl' },
  'site.unavailable': { en: 'Site Unavailable', ar: 'الموقع غير متاح', fr: 'Site indisponible', es: 'Sitio no disponible', de: 'Seite nicht verfügbar', tr: 'Site kullanılamıyor' },
  'course.enroll': { en: 'Enroll Now', ar: 'سجل الآن', fr: "S'inscrire", es: 'Inscríbete', de: 'Jetzt einschreiben', tr: 'Şimdi kaydol' },
  'course.continue': { en: 'Continue Learning', ar: 'تابع التعلم', fr: 'Continuer', es: 'Continuar', de: 'Weiterlernen', tr: 'Öğrenmeye devam et' },
  'auth.loginWith': { en: 'Sign in with', ar: 'تسجيل الدخول بـ', fr: 'Se connecter avec', es: 'Iniciar sesión con', de: 'Anmelden mit', tr: 'İle giriş yap' },
  'auth.email': { en: 'Email', ar: 'البريد الإلكتروني', fr: 'Email', es: 'Email', de: 'E-Mail', tr: 'E-posta' },
  'auth.enterOtp': { en: 'Enter verification code', ar: 'أدخل رمز التحقق', fr: 'Entrez le code', es: 'Ingrese el código', de: 'Code eingeben', tr: 'Doğrulama kodunu girin' },
};

export function t(key: string, lang: Language = 'en'): string {
  return strings[key]?.[lang] ?? strings[key]?.en ?? key;
}

export function getTranslation<T>(translations: Partial<Record<Language, T>> | undefined, lang: Language): T | undefined {
  if (!translations) return undefined;
  return translations[lang] ?? translations.en;
}
