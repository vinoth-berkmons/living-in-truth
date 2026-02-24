import { AdminLayout } from '@/components/AdminLayout';
import { getDB } from '@/lib/db';
import { useAdminWorkspaceStore } from '@/stores';
import { getTranslation } from '@/lib/i18n';

const AdminHomeLayout = () => {
  const { selectedWorkspaceId } = useAdminWorkspaceStore();
  const db = getDB();

  if (!db || !selectedWorkspaceId) return <AdminLayout requiredPermission="manage_home_layout"><p className="text-muted-foreground">Select a workspace.</p></AdminLayout>;

  const orderIds = db.homeSections.orderByWorkspaceId[selectedWorkspaceId] || [];
  const sections = orderIds.map(id => db.homeSections.byId[id]).filter(Boolean);

  return (
    <AdminLayout requiredPermission="manage_home_layout">
      <h1 className="font-heading text-2xl font-bold text-foreground">Home Layout</h1>
      <div className="mt-6 space-y-3">
        {sections.map((section, i) => {
          if (!section) return null;
          return (
            <div key={section.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    {section.type === 'hero_slider' ? '🖼 Hero Slider' : `📋 Rail: ${getTranslation(section.titleTranslations, 'en') ?? 'Untitled'}`}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Sort: {section.sortOrder} · Type: {section.type}
                    {section.itemRefs && ` · ${section.itemRefs.length} items`}
                    {section.filter && ` · Filter: ${JSON.stringify(section.filter)}`}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        {sections.length === 0 && <p className="text-muted-foreground">No home sections configured.</p>}
      </div>
    </AdminLayout>
  );
};

export default AdminHomeLayout;
