import { useParams } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useLanguageStore } from '@/stores';
import { getTranslation } from '@/lib/i18n';
import type { Workspace, HomeSection, ItemRef } from '@/types/entities';
import type { AppDatabase } from '@/types/db';

const WorkspaceHome = () => {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { language } = useLanguageStore();
  const db = getDB();

  const workspace = db ? Object.values(db.workspaces.byId).find(w => w.slug === workspaceSlug && w.status === 'active') : undefined;

  if (!workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">Site Unavailable</h1>
          <p className="mt-2 text-muted-foreground">This workspace is not available.</p>
          <a href="/" className="mt-6 inline-block text-primary hover:underline">← Back to workspaces</a>
        </div>
      </div>
    );
  }

  const sectionIds = db?.homeSections.orderByWorkspaceId[workspace.id] || [];
  const sections = sectionIds.map(id => db?.homeSections.byId[id]).filter(Boolean) as HomeSection[];

  return (
    <PublicLayout workspace={workspace}>
      <div className="container mx-auto px-6 py-8">
        {sections.map(section => {
          if (section.type === 'hero_slider' && section.itemRefs) {
            return (
              <section key={section.id} className="mb-12">
                <div className="grid gap-4 md:grid-cols-3">
                  {section.itemRefs.map((ref, i) => {
                    const item = resolveItemRef(ref, db!, language);
                    if (!item) return null;
                    return (
                      <a key={i} href={item.href} className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md">
                        {item.coverImageUrl && (
                          <div className="aspect-video bg-secondary" style={{ backgroundImage: `url(${item.coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        )}
                        <div className="p-4">
                          <span className="text-xs font-medium uppercase tracking-wider text-primary">{ref.entityType}</span>
                          <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">{item.title}</h3>
                          {item.excerpt && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>
            );
          }

          if (section.type === 'rail') {
            const title = getTranslation(section.titleTranslations, language) ?? 'Untitled';
            const railItems = getRailItems(section, db!, workspace.id, language);
            return (
              <section key={section.id} className="mb-12">
                <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">{title}</h2>
                {railItems.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {railItems.map(item => (
                      <a key={item.id} href={item.href} className="min-w-[240px] flex-shrink-0 overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md">
                        {item.coverImageUrl && (
                          <div className="aspect-video bg-secondary" style={{ backgroundImage: `url(${item.coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        )}
                        <div className="p-3">
                          <h3 className="font-heading text-sm font-semibold text-foreground line-clamp-2">{item.title}</h3>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No content yet.</p>
                )}
              </section>
            );
          }
          return null;
        })}
        {sections.length === 0 && <div className="py-16 text-center"><p className="text-muted-foreground">No content configured yet.</p></div>}
      </div>
    </PublicLayout>
  );
};

function resolveItemRef(ref: ItemRef, db: AppDatabase, lang: string) {
  const l = lang as any;
  if (ref.entityType === 'content') {
    const item = db.content.byId[ref.id];
    if (!item) return null;
    const tr = getTranslation(item.translations, l);
    const ws = db.workspaces.byId[item.workspaceId];
    return { title: tr?.title ?? 'Untitled', excerpt: tr?.excerpt, coverImageUrl: item.coverImageUrl, href: `/w/${ws?.slug}/read/${item.slug}` };
  }
  if (ref.entityType === 'video') {
    const item = db.videos.byId[ref.id];
    if (!item) return null;
    const tr = getTranslation(item.translations, l);
    const ws = db.workspaces.byId[item.workspaceId];
    return { title: tr?.title ?? 'Untitled', excerpt: tr?.description, coverImageUrl: item.coverImageUrl, href: `/w/${ws?.slug}/watch/${item.slug}` };
  }
  if (ref.entityType === 'course') {
    const item = db.courses.byId[ref.id];
    if (!item) return null;
    const tr = getTranslation(item.translations, l);
    const ws = db.workspaces.byId[item.workspaceId];
    return { title: tr?.title ?? 'Untitled', excerpt: tr?.description, coverImageUrl: undefined, href: `/w/${ws?.slug}/course/${item.slug}` };
  }
  return null;
}

function getRailItems(section: HomeSection, db: AppDatabase, workspaceId: string, lang: string) {
  const l = lang as any;
  const results: { id: string; title: string; coverImageUrl?: string; href: string }[] = [];
  const filter = section.filter;

  // Get content items matching filter
  if (!filter?.format) {
    const items = Object.values(db.content.byId).filter(c => {
      if (c.workspaceId !== workspaceId || c.status !== 'published') return false;
      if (filter?.categoryId && !c.categoryIds.includes(filter.categoryId)) return false;
      if (filter?.type && c.type !== filter.type) return false;
      return true;
    });
    const ws = db.workspaces.byId[workspaceId];
    items.forEach(item => {
      const tr = getTranslation(item.translations, l);
      results.push({ id: item.id, title: tr?.title ?? 'Untitled', coverImageUrl: item.coverImageUrl, href: `/w/${ws?.slug}/read/${item.slug}` });
    });
  }

  // Get video items matching filter
  if (!filter?.type) {
    const vids = Object.values(db.videos.byId).filter(v => {
      if (v.workspaceId !== workspaceId || v.status !== 'published') return false;
      if (filter?.categoryId && !v.categoryIds.includes(filter.categoryId)) return false;
      if (filter?.format && v.format !== filter.format) return false;
      return true;
    });
    const ws = db.workspaces.byId[workspaceId];
    vids.forEach(item => {
      const tr = getTranslation(item.translations, l);
      results.push({ id: item.id, title: tr?.title ?? 'Untitled', coverImageUrl: item.coverImageUrl, href: `/w/${ws?.slug}/watch/${item.slug}` });
    });
  }

  return results;
}

export default WorkspaceHome;
