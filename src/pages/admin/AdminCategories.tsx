import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { getDB } from '@/lib/db';
import { useAdminWorkspaceStore } from '@/stores';
import { getTranslation } from '@/lib/i18n';

const AdminCategories = () => {
  const { selectedWorkspaceId } = useAdminWorkspaceStore();
  const db = getDB();

  if (!db || !selectedWorkspaceId) return <AdminLayout requiredPermission="manage_categories"><p className="text-muted-foreground">Select a workspace.</p></AdminLayout>;

  const categories = Object.values(db.categories.byId).filter(c => c.workspaceId === selectedWorkspaceId).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <AdminLayout requiredPermission="manage_categories">
      <h1 className="font-heading text-2xl font-bold text-foreground">Categories</h1>
      <div className="mt-6 space-y-3">
        {categories.map(cat => {
          const tr = getTranslation(cat.translations, 'en');
          return (
            <div key={cat.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div>
                <h3 className="font-medium text-foreground">{tr?.title ?? cat.slug}</h3>
                <p className="text-xs text-muted-foreground">/{cat.slug} · Sort: {cat.sortOrder}{cat.parentId ? ' · Child' : ''}</p>
              </div>
            </div>
          );
        })}
        {categories.length === 0 && <p className="text-muted-foreground">No categories yet.</p>}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
