import { createContext, useContext, useMemo } from 'react';
import { initDB } from '@/lib/db';
import { resolveWorkspace, type WorkspaceResolution } from '@/lib/resolveWorkspace';
import type { Workspace } from '@/types/entities';

interface WorkspaceContextValue {
  workspace: Workspace;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace(): Workspace {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return ctx.workspace;
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const resolution = useMemo<WorkspaceResolution>(() => {
    initDB();
    return resolveWorkspace();
  }, []);

  if (resolution.status === 'disabled' || !resolution.workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary font-heading text-lg font-bold text-primary-foreground">LiT</div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Site Unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">This site is currently not available. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <WorkspaceContext.Provider value={{ workspace: resolution.workspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
