import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { User, Briefcase } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import { useRoleStore } from './store/useRoleStore';
import FeedScreen from './pages/FeedScreen';
import ClientHomeScreen from './pages/ClientHomeScreen';
import AuthScreen from './pages/auth/AuthScreen';
import UpgradeToProScreen from './pages/auth/UpgradeToProScreen';
import JobDetailScreen from './pages/JobDetailScreen';
import CreateJobScreen from './pages/CreateJobScreen';
import ClientJobsScreen from './pages/ClientJobsScreen';
import RegisterScreen from './pages/auth/RegisterScreen';
import ProOnboardingScreen from './pages/auth/ProOnboardingScreen';
import CreditsScreen from './pages/CreditsScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas fuera del layout principal (Sin Header ni BottomNav) */}
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/upgrade-to-pro" element={<UpgradeToProScreen />} />
        <Route path="/pro-onboarding" element={<ProOnboardingScreen />} />
        <Route path="/job/:id" element={<JobDetailScreen />} />
        <Route path="/create-job" element={<CreateJobScreen />} />
        <Route path="/credits" element={<CreditsScreen />} />

        {/* Rutas dentro del layout principal */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/auth" replace />} />
          <Route path="home" element={<ClientHomeScreen />} />
          <Route path="feed" element={<FeedScreen />} />
          <Route path="mis-trabajos" element={<ClientJobsScreen />} />
          <Route path="agenda" element={<div className="p-6 text-center text-slate-500">Agenda B2B (Próximamente)</div>} />
          <Route path="profile" element={
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Mi Perfil</h2>
              <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{useRoleStore.getState().profile?.fullName || 'Usuario'}</h3>
                    <p className="text-slate-500 text-sm">{useRoleStore.getState().profile?.credits} Créditos</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => window.location.href = '/upgrade-to-pro'} 
                  className="w-full bg-[#EA580C]/10 text-[#EA580C] font-bold py-4 rounded-2xl border border-[#EA580C]/20 hover:bg-[#EA580C]/20 transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-5 h-5" />
                  Quiero ofrecer mis servicios (B2B)
                </button>
              </div>

              <button 
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = '/auth';
                }}
                className="w-full bg-slate-50 text-slate-500 font-bold py-4 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all"
              >
                Cerrar Sesión
              </button>
            </div>
          } />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
