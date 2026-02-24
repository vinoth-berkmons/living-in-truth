import { useCallback } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { EventRepo } from '@/repos';

export function useTrackEvent() {
  const workspace = useWorkspace();
  const { language } = useLanguage();

  return useCallback(
    (type: string, metadata?: Record<string, unknown>) => {
      EventRepo.track({
        type,
        workspaceId: workspace.id,
        language,
        metadata,
      });
    },
    [workspace.id, language]
  );
}
