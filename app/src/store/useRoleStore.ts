import { create } from 'zustand';

type Role = 'client' | 'pro';

interface UserProfile {
  fullName: string;
  avatarUrl?: string;
  profession?: string;
  credits: number;
  categories?: string[];
  location?: string;
}

interface RoleState {
  role: Role;
  isPro: boolean;
  userId: string | null;
  profile: UserProfile | null;
  toggleRole: () => void;
  setUser: (role: Role, userId: string, isPro?: boolean) => void;
  setProfile: (profile: UserProfile) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  role: 'client',
  isPro: false,
  userId: null,
  profile: null,
  toggleRole: () => set((state) => ({ role: state.role === 'client' ? 'pro' : 'client' })),
  setUser: (role: Role, userId: string, isPro: boolean = false) => set({ role, userId, isPro }),
  setProfile: (profile: UserProfile) => set({ profile }),
}));
