import { Bell, User, Briefcase } from 'lucide-react';
import { useRoleStore } from '../../store/useRoleStore';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const { role, toggleRole, profile, isPro } = useRoleStore();
  const isClient = role === 'client';

  const handleToggle = () => {
    if (isClient && !isPro) {
      navigate('/upgrade-to-pro');
    } else {
      toggleRole();
      // Pequeño delay para navegar si es necesario
      setTimeout(() => {
        navigate(role === 'client' ? '/feed' : '/home');
      }, 10);
    }
  };

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
          <span className="text-slate-900 text-sm font-bold tracking-tight leading-none truncate max-w-[100px] sm:max-w-[150px]">
            {profile?.fullName || 'Cargando...'}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] font-black text-brand uppercase tracking-widest opacity-90">
              {isClient ? 'Cliente' : (profile?.profession || 'Profesional')}
            </span>
          </div>
        </div>
      </div>

      {/* Lado Derecho: Switch y Acciones */}
      <div className="flex items-center gap-3">
        {/* Créditos (Solo para Pros) */}
        {!isClient && (
          <div className="flex items-center gap-1.5 bg-brand/5 px-3 py-1.5 rounded-xl border border-brand/10">
            <span className="text-sm">🪙</span>
            <span className="text-xs font-bold text-brand">{profile?.credits || 0}</span>
          </div>
        )}

        {/* Sleek Toggle Switch */}
        <div 
          onClick={handleToggle}
          className="relative h-9 w-24 bg-slate-100 rounded-full p-1 cursor-pointer transition-all border border-slate-200/50"
        >
          {/* Slider Background */}
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm border border-slate-200 transition-all duration-300 transform ${
              isClient ? 'translate-x-0' : 'translate-x-full'
            }`}
          ></div>
          
          {/* Icons/Labels */}
          <div className="relative flex w-full h-full items-center justify-around z-10">
            <User className={`w-3.5 h-3.5 transition-colors ${isClient ? 'text-brand' : 'text-slate-400'}`} />
            <Briefcase className={`w-3.5 h-3.5 transition-colors ${!isClient ? 'text-[#EA580C]' : 'text-slate-400'}`} />
          </div>
        </div>
        
        <button className="text-slate-400 hover:bg-slate-100 p-2 rounded-xl transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
