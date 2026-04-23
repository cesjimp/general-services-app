import { create } from 'zustand';

type Role = 'client' | 'pro';

interface UserProfile {
  fullName: string;
  avatarUrl?: string;
  profession?: string;
  credits: number;
}

interface RoleState {
  role: Role;
  userId: string | null;
  profile: UserProfile | null;
  toggleRole: () => void;
  setUser: (role: Role, userId: string) => void;
  setProfile: (profile: UserProfile) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  role: 'client',
  userId: null,
  profile: null,
  toggleRole: () => set((state) => ({ role: state.role === 'client' ? 'pro' : 'client' })),
  setUser: (role: Role, userId: string) => set({ role, userId }),
  setProfile: (profile: UserProfile) => set({ profile }),
}));
