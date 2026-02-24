import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session } from '@/types/entities';

// ========== Theme Store ==========
interface ThemeState {
  isDark: boolean;
  toggle: () => void;
  setDark: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: true,
      toggle: () => set((s) => {
        const next = !s.isDark;
        document.documentElement.classList.toggle('dark', next);
        return { isDark: next };
      }),
      setDark: (dark) => {
        document.documentElement.classList.toggle('dark', dark);
        set({ isDark: dark });
      },
    }),
    { name: 'lit-theme' }
  )
);

// ========== Auth Store ==========
interface AuthState {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
    }),
    { name: 'lit-auth' }
  )
);

// ========== Admin Workspace Preference ==========
interface AdminWorkspaceState {
  selectedWorkspaceId: string | null;
  setSelectedWorkspaceId: (id: string | null) => void;
}

export const useAdminWorkspaceStore = create<AdminWorkspaceState>()(
  persist(
    (set) => ({
      selectedWorkspaceId: null,
      setSelectedWorkspaceId: (id) => set({ selectedWorkspaceId: id }),
    }),
    { name: 'lit-admin-workspace' }
  )
);
