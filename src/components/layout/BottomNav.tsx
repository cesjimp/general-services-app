import { Home, ClipboardList, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useRoleStore } from '../../store/useRoleStore';

export default function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;
  const role = useRoleStore((state) => state.role);
  const isClient = role === 'client';

  const tabs = [
    { 
      name: 'Home', 
      path: isClient ? '/app/home' : '/app/feed', 
      icon: Home 
    },
    { 
      name: 'Trabajos', 
      path: isClient ? '/app/mis-trabajos' : '/app/agenda', 
      icon: ClipboardList 
    },
    { 
      name: 'Perfil', 
      path: '/app/profile', 
      icon: User 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-6 pb-safe bg-white/90 backdrop-blur-2xl h-[72px] z-50 rounded-t-[3rem] shadow-[0_-12px_24px_rgba(0,0,0,0.06)] border-t border-slate-200/10">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentPath.includes(tab.path);
        
        return (
          <Link 
            key={tab.name}
            to={tab.path}
            className={`flex flex-col items-center justify-center transition-all duration-300 w-16 active:scale-90 ${
              isActive 
                ? 'text-brand bg-brand-muted rounded-full px-6 py-2 min-w-[80px]' 
                : 'text-slate-400 hover:text-brand'
            }`}
          >
            <Icon className={`w-6 h-6 mb-1 ${isActive ? 'mx-auto' : ''}`} />
            <span className="text-[11px] font-medium uppercase tracking-wider">{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
