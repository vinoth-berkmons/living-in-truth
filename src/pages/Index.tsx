import { useEffect } from 'react';
import { initDB, getDB } from '@/lib/db';
import { useThemeStore } from '@/stores';
import type { Workspace } from '@/types/entities';
import { useNavigate } from 'react-router-dom';

const WorkspaceSelector = () => {
  const navigate = useNavigate();
  const db = getDB();

  const activeWorkspaces: Workspace[] = db
    ? Object.values(db.workspaces.byId).filter(w => w.status === 'active')
    : [];

  // Single-workspace shortcut
  useEffect(() => {
    if (activeWorkspaces.length === 1) {
      navigate(`/w/${activeWorkspaces[0].slug}`, { replace: true });
    }
  }, [activeWorkspaces, navigate]);

  if (activeWorkspaces.length === 1) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-heading text-lg font-bold text-primary-foreground">
              LiT
            </div>
            <span className="font-heading text-xl font-bold text-foreground">Living in Truth</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Choose Your Space
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Select a workspace to explore content, videos, and courses.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeWorkspaces.map(ws => (
            <a
              key={ws.id}
              href={`/w/${ws.slug}`}
              className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 font-heading text-lg font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {ws.name.charAt(0)}
              </div>
              <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">
                {ws.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {ws.enabledLanguages.map(l => l.toUpperCase()).join(' · ')}
              </p>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
};

const ThemeToggle = () => {
  const { isDark, toggle } = useThemeStore();
  return (
    <button
      onClick={toggle}
      className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      )}
    </button>
  );
};

const Index = () => {
  // Initialize DB on mount
  useEffect(() => {
    initDB();
  }, []);

  // Restore theme
  const { isDark } = useThemeStore();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return <WorkspaceSelector />;
};

export default Index;
