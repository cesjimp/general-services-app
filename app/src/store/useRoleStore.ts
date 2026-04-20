import { create } from 'zustand';

type Role = 'client' | 'pro';

interface RoleState {
  role: Role;
  toggleRole: () => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  role: 'client', // Por defecto inicia como Cliente B2C
  toggleRole: () => set((state) => ({ role: state.role === 'client' ? 'pro' : 'client' })),
}));
