import { Link, useLocation } from 'react-router-dom';
import { useThemeStore, useAuthStore, useLanguageStore } from '@/stores';
import { getDB } from '@/lib/db';
import { t } from '@/lib/i18n';
import { hasPermission } from '@/lib/rbac';
import { Sun, Moon, Search, Globe, User, Menu, X, Shield } from 'lucide-react';
import type { Workspace, Language } from '@/types/entities';
import { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  const workspace = useWorkspace();
  const { isDark, toggle } = useThemeStore();
  const { session } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const location = useLocation();
  const db = getDB();
  const user = session ? db?.users.byId[session.userId] : null;
  const showAdmin = session ? hasPermission(session.userId, workspace.id, 'view_admin') : false;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t('nav.home', language), to: '/' },
    { label: t('nav.videos', language), to: '/explore?type=video' },
    { label: t('nav.courses', language), to: '/courses' },
    { label: t('nav.articles', language), to: '/explore?type=article' },
    { label: t('nav.explore', language), to: '/explore' },
  ];

  const isActive = (to: string) => {
    if (to.includes('?')) return location.pathname + location.search === to;
    return location.pathname === to;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4 md:px-8">
          {/* Left: Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5">
              {workspace.themeOverride?.logoUrl ? (
                <img src={workspace.themeOverride.logoUrl} alt="Living in Truth" className="h-8 w-8 rounded-lg object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-heading text-sm font-bold text-primary-foreground">
                  LiT
                </div>
              )}
              <span className="hidden font-heading text-base font-bold text-foreground sm:block">Living in Truth</span>
            </Link>

            {/* Center nav — desktop */}
            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <span className="mt-0.5 block h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Link to="/explore" className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground">
              <Search className="h-4 w-4" />
            </Link>

            {/* Language */}
            {!workspace.hideLanguageSwitcher && workspace.enabledLanguages.length > 1 && (
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="cursor-pointer appearance-none rounded-lg bg-transparent px-2 py-1.5 pr-6 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {workspace.enabledLanguages.map(lang => (
                    <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                  ))}
                </select>
                <Globe className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              </div>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                {showAdmin && (
                  <Link to="/admin" className="hidden rounded-md bg-secondary px-2.5 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 sm:inline-flex sm:items-center sm:gap-1">
                    <Shield className="h-3 w-3" />
                    {t('nav.admin', language)}
                  </Link>
                )}
                <Link to="/account" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground transition-transform hover:scale-110">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    user.displayName.charAt(0)
                  )}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  {t('nav.login', language)}
                </Link>
                <Link to="/signup" className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-muted-foreground lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-surface px-4 py-3 lg:hidden animate-fade-in">
            <nav className="flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${isActive(link.to) ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-foreground">
                {t('nav.pricing', language)}
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-surface/50 py-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-primary font-heading text-xs font-bold text-primary-foreground">LiT</div>
                <span className="font-heading text-sm font-bold text-foreground">Living in Truth</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">A premium faith-based content platform with videos, articles, and courses.</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Content</h4>
              <nav className="mt-3 flex flex-col gap-2">
                <Link to="/explore" className="text-sm text-foreground/70 hover:text-foreground">{t('nav.explore', language)}</Link>
                <Link to="/courses" className="text-sm text-foreground/70 hover:text-foreground">{t('nav.courses', language)}</Link>
              </nav>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account</h4>
              <nav className="mt-3 flex flex-col gap-2">
                <Link to="/pricing" className="text-sm text-foreground/70 hover:text-foreground">{t('nav.pricing', language)}</Link>
                <Link to="/account" className="text-sm text-foreground/70 hover:text-foreground">{t('nav.account', language)}</Link>
              </nav>
            </div>
          </div>
          <div className="mt-8 border-t border-border/50 pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Living in Truth. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
