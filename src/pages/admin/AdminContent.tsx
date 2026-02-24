import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { getDB } from '@/lib/db';
import { useAdminWorkspaceStore } from '@/stores';
import { getTranslation } from '@/lib/i18n';
import { ContentRepo, VideoRepo } from '@/repos';

const AdminContent = () => {
  const { selectedWorkspaceId } = useAdminWorkspaceStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [tab, setTab] = useState<'content' | 'videos'>('content');
  const db = getDB();

  if (!db || !selectedWorkspaceId) return <AdminLayout requiredPermission="manage_content"><p className="text-muted-foreground">Select a workspace.</p></AdminLayout>;

  const contentItems = Object.values(db.content.byId).filter(c => c.workspaceId === selectedWorkspaceId);
  const videoItems = Object.values(db.videos.byId).filter(v => v.workspaceId === selectedWorkspaceId);

  const handlePublish = async (id: string, type: 'content' | 'video') => {
    if (type === 'content') await ContentRepo.publish(id);
    else await VideoRepo.publish(id);
    setRefreshKey(k => k + 1);
  };

  const handleArchive = async (id: string, type: 'content' | 'video') => {
    if (type === 'content') await ContentRepo.archive(id);
    else await VideoRepo.archive(id);
    setRefreshKey(k => k + 1);
  };

  return (
    <AdminLayout requiredPermission="manage_content">
      <h1 className="font-heading text-2xl font-bold text-foreground">Content & Videos</h1>
      <div className="mt-4 flex gap-2">
        <button onClick={() => setTab('content')} className={`rounded-lg px-4 py-2 text-sm ${tab === 'content' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>Content ({contentItems.length})</button>
        <button onClick={() => setTab('videos')} className={`rounded-lg px-4 py-2 text-sm ${tab === 'videos' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>Videos ({videoItems.length})</button>
      </div>

      <div className="mt-6 space-y-3" key={refreshKey}>
        {tab === 'content' && contentItems.map(item => {
          const tr = getTranslation(item.translations, 'en');
          return (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div>
                <h3 className="font-medium text-foreground">{tr?.title ?? item.slug}</h3>
                <p className="text-xs text-muted-foreground">{item.type} · {item.status} · {item.access}</p>
              </div>
              <div className="flex gap-2">
                {item.status !== 'published' && <button onClick={() => handlePublish(item.id, 'content')} className="rounded border border-border px-3 py-1 text-xs text-primary hover:bg-primary/5">Publish</button>}
                {item.status !== 'archived' && <button onClick={() => handleArchive(item.id, 'content')} className="rounded border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-secondary">Archive</button>}
              </div>
            </div>
          );
        })}
        {tab === 'videos' && videoItems.map(item => {
          const tr = getTranslation(item.translations, 'en');
          return (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div>
                <h3 className="font-medium text-foreground">{tr?.title ?? item.slug}</h3>
                <p className="text-xs text-muted-foreground">{item.format} · {item.status} · {item.access}</p>
              </div>
              <div className="flex gap-2">
                {item.status !== 'published' && <button onClick={() => handlePublish(item.id, 'video')} className="rounded border border-border px-3 py-1 text-xs text-primary hover:bg-primary/5">Publish</button>}
                {item.status !== 'archived' && <button onClick={() => handleArchive(item.id, 'video')} className="rounded border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-secondary">Archive</button>}
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
