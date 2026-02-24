import { AdminLayout } from '@/components/AdminLayout';
import { getDB } from '@/lib/db';
import { useAdminWorkspaceStore } from '@/stores';
import { getTranslation } from '@/lib/i18n';

const AdminCourses = () => {
  const { selectedWorkspaceId } = useAdminWorkspaceStore();
  const db = getDB();

  if (!db || !selectedWorkspaceId) return <AdminLayout requiredPermission="manage_courses"><p className="text-muted-foreground">Select a workspace.</p></AdminLayout>;

  const courses = Object.values(db.courses.byId).filter(c => c.workspaceId === selectedWorkspaceId);

  return (
    <AdminLayout requiredPermission="manage_courses">
      <h1 className="font-heading text-2xl font-bold text-foreground">Courses</h1>
      <div className="mt-6 space-y-3">
        {courses.map(course => {
          const tr = getTranslation(course.translations, 'en');
          const modules = course.moduleIds.map(id => db.modules.byId[id]).filter(Boolean);
          const lessonCount = modules.reduce((sum, m) => sum + (m?.lessonIds.length ?? 0), 0);
          return (
            <div key={course.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">{tr?.title ?? course.slug}</h3>
                  <p className="text-xs text-muted-foreground">{course.status} · {course.access} · {modules.length} modules · {lessonCount} lessons</p>
                </div>
              </div>
              {modules.map(mod => {
                if (!mod) return null;
                const mTr = getTranslation(mod.translations, 'en');
                return (
                  <div key={mod.id} className="ml-4 mt-2 rounded border border-border bg-surface2 p-3">
                    <p className="text-sm font-medium text-foreground">{mTr?.title ?? 'Module'}</p>
                    <ul className="mt-1 space-y-1">
                      {mod.lessonIds.map(lid => {
                        const lesson = db.lessons.byId[lid];
                        const lTr = lesson ? getTranslation(lesson.translations, 'en') : undefined;
                        return <li key={lid} className="text-xs text-muted-foreground">• {lTr?.title ?? lid} ({lesson?.type})</li>;
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          );
        })}
        {courses.length === 0 && <p className="text-muted-foreground">No courses yet.</p>}
      </div>
    </AdminLayout>
  );
};

export default AdminCourses;
