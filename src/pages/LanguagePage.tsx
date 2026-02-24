import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGE_META, type Language } from '@/types/entities';
import { t } from '@/lib/i18n';
import { Globe } from 'lucide-react';

const LanguagePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, setLanguage, enabledLanguages, hideLanguageSwitcher } = useLanguage();
  const returnTo = searchParams.get('returnTo') || '/';

  const [selected, setSelected] = useState<Language>(language);

  useEffect(() => {
    if (hideLanguageSwitcher) {
      navigate(returnTo, { replace: true });
    }
  }, [hideLanguageSwitcher, returnTo, navigate]);

  if (hideLanguageSwitcher) return null;

  const handleSave = () => {
    setLanguage(selected);
    navigate(returnTo);
  };

  const handleCancel = () => {
    navigate(returnTo);
  };

  return (
    <PublicLayout>
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-primary" />
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {t('lang.choose', language)}
            </h1>
          </div>

          <div className="space-y-2">
            {enabledLanguages.map(lang => {
              const meta = LANGUAGE_META[lang];
              return (
                <label
                  key={lang}
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                    selected === lang
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-card hover:border-primary/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="language"
                    value={lang}
                    checked={selected === lang}
                    onChange={() => setSelected(lang)}
                    className="sr-only"
                  />
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    selected === lang ? 'border-primary' : 'border-muted-foreground/30'
                  }`}>
                    {selected === lang && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-foreground">{meta.english}</span>
                    {meta.english !== meta.native && (
                      <span className="ml-2 text-sm text-muted-foreground">{meta.native}</span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">{lang}</span>
                </label>
              );
            })}
          </div>

          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex-1 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t('lang.save', language)}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 rounded-lg border border-border bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              {t('lang.cancel', language)}
            </button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default LanguagePage;
