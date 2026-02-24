import { AdminLayout } from '@/components/AdminLayout';
import { getDB } from '@/lib/db';
import { useAdminWorkspaceStore } from '@/stores';

const AdminDashboard = () => {
  const { selectedWorkspaceId } = useAdminWorkspaceStore();
  const db = getDB();

  if (!db || !selectedWorkspaceId) return <AdminLayout><p className="text-muted-foreground">Select a workspace.</p></AdminLayout>;

  const ws = db.workspaces.byId[selectedWorkspaceId];
  const contentCount = Object.values(db.content.byId).filter(c => c.workspaceId === selectedWorkspaceId).length;
  const videoCount = Object.values(db.videos.byId).filter(v => v.workspaceId === selectedWorkspaceId).length;
  const courseCount = Object.values(db.courses.byId).filter(c => c.workspaceId === selectedWorkspaceId).length;
  const eventCount = db.events.filter(e => e.workspaceId === selectedWorkspaceId).length;

  const stats = [
    { label: 'Content Items', value: contentCount },
    { label: 'Videos', value: videoCount },
    { label: 'Courses', value: courseCount },
    { label: 'Events', value: eventCount },
  ];

  return (
    <AdminLayout requiredPermission="view_analytics">
      <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard — {ws?.name}</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-heading text-3xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
