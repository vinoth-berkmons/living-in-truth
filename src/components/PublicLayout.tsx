import { Link, useLocation } from 'react-router-dom';
import { useThemeStore, useAuthStore } from '@/stores';
import { getDB } from '@/lib/db';
import { t } from '@/lib/i18n';
import { hasPermission } from '@/lib/rbac';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGE_META, type Language } from '@/types/entities';
import { Sun, Moon, Search, Globe, Menu, X, Shield } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  const workspace = useWorkspace();
  const { isDark, toggle } = useThemeStore();
  const { session } = useAuthStore();
  const { language, setLanguage, enabledLanguages, hideLanguageSwitcher } = useLanguage();
  const location = useLocation();
  const db = getDB();
  const user = session ? db?.users.byId[session.userId] : null;
  const showAdmin = session ? hasPermission(session.userId, workspace.id, 'view_admin') : false;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDialogOpen, setLangDialogOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Track scroll for header glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const navLinks = [
    { label: t('nav.home', language), to: '/' },
    { label: t('nav.videos', language), to: '/videos' },
    { label: t('nav.courses', language), to: '/courses' },
    { label: t('nav.articles', language), to: '/articles' },
    { label: t('nav.explore', language), to: '/explore' },
  ];

  const isActive = (to: string) => {
    if (to.includes('?')) return location.pathname + location.search === to;
    return location.pathname === to;
  };

  const showLanguageButton = !hideLanguageSwitcher && enabledLanguages.length > 1;

  const handleLangSave = () => {
    setLanguage(selectedLang);
    setLangDialogOpen(false);
  };

  const handleLangOpen = () => {
    setSelectedLang(language);
    setLangDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header with glass morphism */}
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass border-b border-border/30 shadow-lg shadow-background/20'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 md:px-8">
          {/* Left: Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="group flex items-center gap-2.5 transition-transform duration-300 hover:scale-105">
              {workspace.themeOverride?.logoUrl ? (
                <img src={workspace.themeOverride.logoUrl} alt="Living in Truth" className="h-9 w-9 rounded-xl object-cover ring-2 ring-primary/20 transition-all group-hover:ring-primary/50" />
              ) : (
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-heading text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all group-hover:shadow-primary/40">
                  LiT
                  <div className="absolute inset-0 rounded-xl bg-primary/50 blur-lg opacity-0 transition-opacity group-hover:opacity-50" />
                </div>
              )}
              <span className="hidden font-heading text-lg font-bold text-foreground tracking-tight sm:block">
                Living in Truth
              </span>
            </Link>

            {/* Center nav — desktop with animated underlines */}
            <nav className="hidden items-center gap-0.5 lg:flex">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link-animated ${
                    isActive(link.to)
                      ? 'text-foreground active'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            {/* Search */}
            <Link
              to="/explore"
              className="group relative rounded-xl p-2.5 text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-primary/5"
            >
              <Search className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            </Link>

            {/* Language */}
            {showLanguageButton && (
              <button
                onClick={handleLangOpen}
                className="group flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-primary/5"
              >
                <Globe className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-[20deg]" />
                <span className="uppercase tracking-wider">{language}</span>
              </button>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="group relative rounded-xl p-2.5 text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-primary/5"
              aria-label="Toggle theme"
            >
              <div className="relative h-4 w-4">
                {isDark ? (
                  <Sun className="h-4 w-4 transition-all duration-500 group-hover:rotate-90 group-hover:text-yellow-400" />
                ) : (
                  <Moon className="h-4 w-4 transition-all duration-500 group-hover:-rotate-12 group-hover:text-indigo-400" />
                )}
              </div>
            </button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2 ml-1">
                {showAdmin && (
                  <Link to="/admin" className="hidden rounded-xl bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary sm:inline-flex sm:items-center sm:gap-1.5">
                    <Shield className="h-3 w-3" />
                    {t('nav.admin', language)}
                  </Link>
                )}
                <Link to="/account" className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground ring-2 ring-primary/20 transition-all duration-300 hover:ring-primary/60 hover:scale-110">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    user.displayName.charAt(0)
                  )}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link to="/login" className="hidden rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground sm:block">
                  {t('nav.login', language)}
                </Link>
                <Link to="/signup" className="btn-premium !rounded-xl !px-5 !py-2 !text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative rounded-xl p-2.5 text-muted-foreground transition-all duration-300 hover:text-foreground lg:hidden"
            >
              <div className="relative h-5 w-5">
                <span className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${mobileMenuOpen ? 'top-[9px] rotate-45' : 'top-1'}`} />
                <span className={`absolute left-0 top-[9px] block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'}`} />
                <span className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${mobileMenuOpen ? 'top-[9px] -rotate-45' : 'top-[17px]'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile nav — slide down with stagger */}
        <div className={`overflow-hidden transition-all duration-500 ease-out lg:hidden ${mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="glass border-t border-border/30 px-4 py-4">
            <nav className="flex flex-col gap-1 stagger-children">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    isActive(link.to)
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-primary/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/5 transition-all duration-300"
              >
                {t('nav.pricing', language)}
              </Link>
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
                >
                  {t('nav.login', language)}
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="animate-fade-in">{children}</main>

      {/* Language Dialog */}
      <Dialog open={langDialogOpen} onOpenChange={setLangDialogOpen}>
        <DialogContent className="sm:max-w-md glass-card !bg-card/95 !backdrop-blur-xl border-primary/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-heading">
              <Globe className="h-5 w-5 text-primary" />
              {t('lang.choose', language)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2 stagger-children">
            {enabledLanguages.map(lang => {
              const meta = LANGUAGE_META[lang];
              return (
                <label
                  key={lang}
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all duration-300 ${
                    selectedLang === lang
                      ? 'border-primary bg-primary/5 shadow-sm glow-sm'
                      : 'border-border bg-card hover:border-primary/30 hover:bg-primary/5'
                  }`}
                >
                  <input type="radio" name="language" value={lang} checked={selectedLang === lang} onChange={() => setSelectedLang(lang)} className="sr-only" />
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    selectedLang === lang ? 'border-primary scale-110' : 'border-muted-foreground/30'
                  }`}>
                    {selectedLang === lang && <div className="h-2.5 w-2.5 rounded-full bg-primary animate-scale-in" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-foreground">{meta.english}</span>
                    {meta.english !== meta.native && (
                      <span className="ml-2 text-sm text-muted-foreground">{meta.native}</span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{lang}</span>
                </label>
              );
            })}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleLangSave} className="btn-premium flex-1 justify-center !py-3">
              {t('lang.save', language)}
            </button>
            <button
              onClick={() => setLangDialogOpen(false)}
              className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-all duration-300 hover:bg-secondary"
            >
              {t('lang.cancel', language)}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="relative border-t border-border/30 bg-surface/50 py-12 overflow-hidden">
        {/* Subtle glow decoration */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container relative mx-auto px-6 md:px-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary font-heading text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20">LiT</div>
                <span className="font-heading text-base font-bold text-foreground tracking-tight">Living in Truth</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">A premium faith-based content platform with videos, articles, and courses for Catholic families worldwide.</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Content</h4>
              <nav className="mt-4 flex flex-col gap-3">
                <Link to="/explore" className="text-sm text-foreground/70 hover:text-primary transition-colors duration-300">{t('nav.explore', language)}</Link>
                <Link to="/courses" className="text-sm text-foreground/70 hover:text-primary transition-colors duration-300">{t('nav.courses', language)}</Link>
                <Link to="/videos" className="text-sm text-foreground/70 hover:text-primary transition-colors duration-300">{t('nav.videos', language)}</Link>
              </nav>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Account</h4>
              <nav className="mt-4 flex flex-col gap-3">
                <Link to="/pricing" className="text-sm text-foreground/70 hover:text-primary transition-colors duration-300">{t('nav.pricing', language)}</Link>
                <Link to="/account" className="text-sm text-foreground/70 hover:text-primary transition-colors duration-300">{t('nav.account', language)}</Link>
              </nav>
            </div>
          </div>
          <div className="mt-10 border-t border-border/30 pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Living in Truth. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
