import { Bell, RefreshCw } from 'lucide-react';
import { useRoleStore } from '../../store/useRoleStore';

export default function Header() {
  const { role, toggleRole } = useRoleStore();
  const isClient = role === 'client';

  return (
    <header className="bg-white/80 backdrop-blur-xl w-full top-0 sticky z-50 shadow-sm flex justify-between items-center h-16 px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center overflow-hidden">
          <img 
            className="w-full h-full object-cover" 
            alt="User profile" 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-brand text-xl font-extrabold tracking-tight leading-none">Tuali</span>
          <span className="text-[10px] font-bold text-brand uppercase tracking-wider opacity-80 mt-0.5">
            {isClient ? 'Modo Búsqueda' : 'Modo Trabajo'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={toggleRole}
          className="bg-brand-muted text-brand hover:opacity-80 p-2 rounded-full transition-all active:scale-95 flex items-center gap-1"
          title="Cambiar Modo"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button className="text-slate-500 hover:bg-slate-100/50 p-2 rounded-full transition-transform active:scale-95">
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
