import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import { useRoleStore } from '../../store/useRoleStore';

export default function AppLayout() {
  const role = useRoleStore((state) => state.role);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Si estamos en home o feed y cambiamos de rol, forzamos la redirección
    if (role === 'pro' && location.pathname.includes('/home')) {
      navigate('/app/feed', { replace: true });
    } else if (role === 'client' && location.pathname.includes('/feed')) {
      navigate('/app/home', { replace: true });
    }
    // Si estamos en Perfil, no redirigimos obligatoriamente, pero se aplicará el color.
  }, [role, navigate, location.pathname]);

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col relative ${role === 'pro' ? 'theme-pro' : ''}`}>
      <Header />
      <div className="flex-1 pb-32">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
