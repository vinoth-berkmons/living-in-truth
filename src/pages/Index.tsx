import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { initDB, getDB } from '@/lib/db';
import { useThemeStore } from '@/stores';
import { ArrowRight } from 'lucide-react';

const WORKSPACE_COLORS: Record<string, string> = {
  'ws-global-001': 'from-teal-500 to-emerald-600',
  'ws-kids-002': 'from-amber-400 to-orange-500',
  'ws-youth-003': 'from-violet-500 to-purple-600',
  'ws-singles-004': 'from-rose-500 to-pink-600',
  'ws-couples-005': 'from-red-500 to-rose-600',
  'ws-handmades-006': 'from-orange-500 to-amber-600',
  'ws-servants-007': 'from-blue-500 to-indigo-600',
};

const WORKSPACE_ICONS: Record<string, string> = {
  Global: '🌍',
  Kids: '🧒',
  Youth: '⚡',
  Singles: '💫',
  Couples: '💕',
  Handmades: '🎨',
  Servants: '🙏',
};

const Index = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = useThemeStore();

  useEffect(() => { document.documentElement.classList.toggle('dark', isDark); }, [isDark]);

  const activeWorkspaces = useMemo(() => {
    initDB();
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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-heading text-sm font-bold text-primary-foreground">LiT</div>
            <span className="font-heading text-base font-bold text-foreground">Living in Truth</span>
          </div>
          <button onClick={toggle} className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground" aria-label="Toggle theme">
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-20 md:px-12 md:pt-28">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            7 Spaces Available
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Living in <span className="text-gradient">Truth</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground md:text-lg">
            Premium faith-based content across multiple communities. Videos, articles, courses — all in one place.
          </p>
        </div>
      </section>

      {/* Workspace Grid */}
      <section className="px-6 pb-20 md:px-12">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeWorkspaces.map((ws, i) => (
            <a
              key={ws.id}
              href={`/w/${ws.slug}`}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Gradient accent bar */}
              <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${WORKSPACE_COLORS[ws.id] ?? 'from-primary to-accent'} opacity-60 transition-opacity group-hover:opacity-100`} />

              <div className="flex items-start justify-between">
                <div className="text-3xl">{WORKSPACE_ICONS[ws.name] ?? '📖'}</div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
              </div>
              <h2 className="mt-3 font-heading text-xl font-bold text-foreground">{ws.name}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {ws.enabledLanguages.map(l => l.toUpperCase()).join(' · ')}
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
