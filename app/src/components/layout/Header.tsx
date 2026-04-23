import { Bell, RefreshCw } from 'lucide-react';
import { useRoleStore } from '../../store/useRoleStore';

export default function Header() {
  const { role, toggleRole, profile } = useRoleStore();
  const isClient = role === 'client';

  return (
    <header className="bg-white/80 backdrop-blur-xl w-full top-0 sticky z-50 shadow-sm flex justify-between items-center h-16 px-6 border-b border-slate-100">
      {/* Lado Izquierdo: Perfil e Identidad */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-brand/10 p-0.5 border-2 border-brand/20 shadow-inner overflow-hidden">
          <img 
            className="w-full h-full object-cover rounded-[14px]" 
            alt="User profile" 
            src={profile?.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-slate-900 text-sm font-bold tracking-tight leading-none truncate max-w-[120px]">
            {profile?.fullName || 'Cargando...'}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] font-black text-brand uppercase tracking-widest opacity-90">
              {isClient ? 'Cliente' : (profile?.profession || 'Profesional')}
            </span>
          </div>
        </div>
      </div>

      {/* Lado Derecho: Acciones y Créditos */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/50">
          <span className="text-sm">🪙</span>
          <span className="text-xs font-bold text-slate-700">{profile?.credits || 0}</span>
        </div>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

        <button 
          onClick={toggleRole}
          className="bg-brand text-white hover:opacity-90 p-2 rounded-xl transition-all active:scale-95 shadow-md shadow-brand/20"
          title="Cambiar Modo"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        
        <button className="text-slate-400 hover:bg-slate-100 p-2 rounded-xl transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
