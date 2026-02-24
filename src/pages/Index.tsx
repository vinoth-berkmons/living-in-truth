import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { initDB, getDB } from '@/lib/db';
import { useThemeStore, useLanguageStore } from '@/stores';
import { t } from '@/lib/i18n';
import type { Workspace } from '@/types/entities';

const Index = () => {
  const navigate = useNavigate();
  const { isDark } = useThemeStore();
  const { language } = useLanguageStore();

  useEffect(() => { initDB(); }, []);
  useEffect(() => { document.documentElement.classList.toggle('dark', isDark); }, [isDark]);

  const activeWorkspaces = useMemo(() => {
    const db = getDB();
    return db ? Object.values(db.workspaces.byId).filter(w => w.status === 'active') : [];
  }, []);

  useEffect(() => {
    if (activeWorkspaces.length === 1) {
      navigate(`/w/${activeWorkspaces[0].slug}`, { replace: true });
    }
  }, [activeWorkspaces, navigate]);

  if (activeWorkspaces.length === 1) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-heading text-lg font-bold text-primary-foreground">LiT</div>
            <span className="font-heading text-xl font-bold text-foreground">Living in Truth</span>
          </div>
          <button onClick={useThemeStore.getState().toggle} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-secondary" aria-label="Toggle theme">
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>
      <main className="container mx-auto px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{t('home.choose', language)}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t('home.subtitle', language)}</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeWorkspaces.map(ws => (
            <a key={ws.id} href={`/w/${ws.slug}`} className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 font-heading text-lg font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">{ws.name.charAt(0)}</div>
              <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">{ws.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{ws.enabledLanguages.map(l => l.toUpperCase()).join(' · ')}</p>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
