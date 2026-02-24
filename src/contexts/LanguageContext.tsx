import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { getStoredLanguage, setStoredLanguage, normalizeHostname } from '@/lib/languageStorage';
import type { Language } from '@/types/entities';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  enabledLanguages: Language[];
  hideLanguageSwitcher: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const workspace = useWorkspace();

  const enabledLanguages = useMemo<Language[]>(() => {
    const langs = [...workspace.enabledLanguages];
    if (!langs.includes('en')) langs.unshift('en');
    return langs;
  }, [workspace.enabledLanguages]);

  const hostname = useMemo(() => normalizeHostname(window.location.hostname), []);

  const [language, setLanguageState] = useState<Language>(() => {
    const stored = getStoredLanguage(window.location.hostname);
    if (stored && enabledLanguages.includes(stored)) return stored;
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    if (!enabledLanguages.includes(lang)) return;
    setLanguageState(lang);
    setStoredLanguage(hostname, lang);
  }, [enabledLanguages, hostname]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    enabledLanguages,
    hideLanguageSwitcher: workspace.hideLanguageSwitcher ?? false,
  }), [language, setLanguage, enabledLanguages, workspace.hideLanguageSwitcher]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
