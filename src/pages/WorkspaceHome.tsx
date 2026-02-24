import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDB } from '@/lib/db';
import type { Workspace } from '@/types/entities';

const WorkspaceHome = () => {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const db = getDB();

  const workspace: Workspace | undefined = db
    ? Object.values(db.workspaces.byId).find(
        w => w.slug === workspaceSlug && w.status === 'active'
      )
    : undefined;

  if (!workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">Site Unavailable</h1>
          <p className="mt-2 text-muted-foreground">This workspace is not available.</p>
          <a href="/" className="mt-6 inline-block text-primary hover:underline">
            ← Back to workspaces
          </a>
        </div>
      </div>
    );
  }

  // Get home sections for this workspace
  const homeSectionIds = db?.homeSections.orderByWorkspaceId[workspace.id] || [];
  const homeSections = homeSectionIds.map(id => db?.homeSections.byId[id]).filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-heading text-lg font-bold text-primary-foreground">
              {workspace.name.charAt(0)}
            </div>
            <span className="font-heading text-xl font-bold text-foreground">{workspace.name}</span>
          </div>
          <nav className="flex items-center gap-4">
            <a href={`/w/${workspace.slug}/explore`} className="text-sm text-muted-foreground hover:text-foreground">Explore</a>
            <a href={`/w/${workspace.slug}/courses`} className="text-sm text-muted-foreground hover:text-foreground">Courses</a>
            <a href={`/w/${workspace.slug}/pricing`} className="text-sm text-muted-foreground hover:text-foreground">Pricing</a>
          </nav>
        </div>
      </header>

      {/* Home Sections */}
      <main className="container mx-auto px-6 py-8">
        {homeSections.map(section => {
          if (!section) return null;

          if (section.type === 'hero_slider' && section.itemRefs) {
            return (
              <section key={section.id} className="mb-12">
                <div className="grid gap-4 md:grid-cols-3">
                  {section.itemRefs.map((ref, i) => {
                    const item = getItemForRef(ref, db!);
                    if (!item) return null;
                    return (
                      <div key={i} className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md">
                        <div className="aspect-video bg-secondary" style={item.coverImageUrl ? { backgroundImage: `url(${item.coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                        </div>
                        <div className="p-4">
                          <span className="text-xs font-medium uppercase tracking-wider text-primary">{ref.entityType}</span>
                          <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">{item.title}</h3>
                          {item.excerpt && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          }

          if (section.type === 'rail') {
            const title = section.titleTranslations?.en || 'Untitled';
            return (
              <section key={section.id} className="mb-12">
                <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">{title}</h2>
                <p className="text-sm text-muted-foreground">Content rail — filtered content will appear here.</p>
              </section>
            );
          }

          return null;
        })}

        {homeSections.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No content configured for this workspace yet.</p>
          </div>
        )}
      </main>
    </div>
  );
};

function getItemForRef(ref: { entityType: string; id: string }, db: any): { title: string; excerpt?: string; coverImageUrl?: string } | null {
  if (ref.entityType === 'content') {
    const item = db.content.byId[ref.id];
    if (!item) return null;
    const t = item.translations?.en;
    return { title: t?.title || 'Untitled', excerpt: t?.excerpt, coverImageUrl: item.coverImageUrl };
  }
  if (ref.entityType === 'video') {
    const item = db.videos.byId[ref.id];
    if (!item) return null;
    const t = item.translations?.en;
    return { title: t?.title || 'Untitled', excerpt: t?.description, coverImageUrl: item.coverImageUrl };
  }
  if (ref.entityType === 'course') {
    const item = db.courses.byId[ref.id];
    if (!item) return null;
    const t = item.translations?.en;
    return { title: t?.title || 'Untitled', excerpt: t?.description };
  }
  return null;
}

export default WorkspaceHome;
