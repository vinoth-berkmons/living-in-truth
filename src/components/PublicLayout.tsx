import { Link, useParams } from 'react-router-dom';
import { useThemeStore, useAuthStore, useLanguageStore } from '@/stores';
import { getDB } from '@/lib/db';
import { t } from '@/lib/i18n';
import { hasPermission } from '@/lib/rbac';
import type { Workspace, Language } from '@/types/entities';

interface PublicLayoutProps {
  workspace: Workspace;
  children: React.ReactNode;
}

export const PublicLayout = ({ workspace, children }: PublicLayoutProps) => {
  const { isDark, toggle } = useThemeStore();
  const { session } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const db = getDB();
  const user = session ? db?.users.byId[session.userId] : null;
  const showAdmin = session ? hasPermission(session.userId, workspace.id, 'view_admin') : false;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          <Link to={`/w/${workspace.slug}`} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-heading text-sm font-bold text-primary-foreground">
              {workspace.themeOverride?.logoUrl ? (
                <img src={workspace.themeOverride.logoUrl} alt={workspace.name} className="h-9 w-9 rounded-lg object-cover" />
              ) : (
                workspace.name.charAt(0)
              )}
            </div>
            <span className="font-heading text-lg font-bold text-foreground">{workspace.name}</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link to={`/w/${workspace.slug}/explore`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{t('nav.explore', language)}</Link>
            <Link to={`/w/${workspace.slug}/courses`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{t('nav.courses', language)}</Link>
            <Link to={`/w/${workspace.slug}/pricing`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{t('nav.pricing', language)}</Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            {!workspace.hideLanguageSwitcher && workspace.enabledLanguages.length > 1 && (
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="rounded-input border border-border bg-surface px-2 py-1 text-xs text-foreground"
              >
                {workspace.enabledLanguages.map(lang => (
                  <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                ))}
              </select>
            )}

            {/* Theme Toggle */}
            <button onClick={toggle} className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Toggle theme">
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                {showAdmin && (
                  <Link to="/admin" className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80">
                    {t('nav.admin', language)}
                  </Link>
                )}
                <Link to={`/w/${workspace.slug}/account`} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {user.displayName.charAt(0)}
                </Link>
              </div>
            ) : (
              <Link to={`/w/${workspace.slug}/login`} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                {t('nav.login', language)}
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-border bg-surface py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-primary font-heading text-xs font-bold text-primary-foreground">LiT</div>
              <span className="text-sm text-muted-foreground">Living in Truth © {new Date().getFullYear()}</span>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link to={`/w/${workspace.slug}/explore`}>{t('nav.explore', language)}</Link>
              <Link to={`/w/${workspace.slug}/courses`}>{t('nav.courses', language)}</Link>
              <Link to={`/w/${workspace.slug}/pricing`}>{t('nav.pricing', language)}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
