import { Bell, User, Briefcase, Zap, Droplets, Paintbrush, MapPin } from 'lucide-react';
import { useRoleStore } from '../../store/useRoleStore';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const { role, toggleRole, profile, isPro } = useRoleStore();
  const isClient = role === 'client';

  const handleToggle = () => {
    if (isClient && !isPro) {
      navigate('/app/upgrade-to-pro');
    } else {
      toggleRole();
      setTimeout(() => {
        navigate(role === 'client' ? '/app/feed' : '/app/home');
      }, 10);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat.toUpperCase()) {
      case 'ELECTRICIDAD': return <Zap className="w-2.5 h-2.5" />;
      case 'PLOMERIA': return <Droplets className="w-2.5 h-2.5" />;
      case 'PINTURA': return <Paintbrush className="w-2.5 h-2.5" />;
      default: return null;
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-xl w-full top-0 sticky z-50 shadow-sm flex justify-between items-center py-5 px-4 border-b border-slate-100">
      {/* Lado Izquierdo: Perfil e Identidad */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <div className="w-13 h-13 rounded-2xl bg-brand/10 p-0.5 border border-brand/20 shadow-sm overflow-hidden">
            <img 
              className="w-full h-full object-cover rounded-[14px]" 
              alt="User profile" 
              src={profile?.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"}
            />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-lg flex items-center justify-center border-2 border-white shadow-sm ${isClient ? 'bg-slate-500' : 'bg-brand'}`}>
            {isClient ? <User className="w-3 h-3 text-white" /> : <Briefcase className="w-3 h-3 text-white" />}
          </div>
        </div>

        <div className="flex flex-col justify-center min-w-0">
          <h2 className="text-slate-900 text-[15px] font-black tracking-tight leading-tight truncate">
            {profile?.fullName || 'Usuario'}
          </h2>
          
          <div className="flex flex-col mt-0.5">
            {isClient ? (
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded-md w-fit">
                  Cliente
                </span>
                <div className="flex items-center gap-1 text-[9px] text-slate-400 font-medium mt-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  <span className="truncate">{profile?.location || 'Girardot, Cund.'}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex flex-wrap gap-1.5 py-0.5">
                  {profile?.categories?.map((cat, i) => (
                    <div 
                      key={i} 
                      className="w-6 h-6 rounded-full flex items-center justify-center bg-brand/5 text-brand border border-brand/20 shadow-sm flex-shrink-0"
                      title={cat}
                    >
                      {getCategoryIcon(cat)}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[9px] text-slate-400 font-medium mt-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  <span className="truncate">{profile?.location || 'Girardot, Cund.'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lado Derecho: Créditos y Acciones */}
      <div className="flex items-center gap-2 ml-2 flex-shrink-0">
        {!isClient && (
          <button 
            onClick={() => navigate('/app/credits')}
            className="flex items-center gap-1.5 bg-amber-400/10 px-2.5 py-1.5 rounded-xl border border-amber-400/20 active:scale-95 group"
          >
            <div className="w-4.5 h-4.5 bg-amber-400 rounded-full flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
              <span className="text-[9px] font-black text-amber-900">C</span>
            </div>
            <span className="text-xs font-black text-amber-600">{profile?.credits || 0}</span>
          </button>
        )}

        <div className="flex items-center gap-1.5">
          <button 
            onClick={handleToggle}
            className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 active:scale-90 transition-all"
            title={isClient ? "Cambiar a Profesional" : "Cambiar a Cliente"}
          >
            {isClient ? <Briefcase className="w-4.5 h-4.5 text-slate-400" /> : <User className="w-4.5 h-4.5 text-slate-400" />}
          </button>
          
          <button className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 relative active:scale-90 transition-all">
            <Bell className="w-4.5 h-4.5 text-slate-400" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
