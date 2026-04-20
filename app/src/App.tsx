import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import FeedScreen from './pages/FeedScreen';
import ClientHomeScreen from './pages/ClientHomeScreen';
import AuthScreen from './pages/auth/AuthScreen';
import UpgradeToProScreen from './pages/auth/UpgradeToProScreen';
import JobDetailScreen from './pages/JobDetailScreen';
import CreateJobScreen from './pages/CreateJobScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas fuera del layout principal (Sin Header ni BottomNav) */}
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/upgrade-to-pro" element={<UpgradeToProScreen />} />
        <Route path="/job/:id" element={<JobDetailScreen />} />
        <Route path="/create-job" element={<CreateJobScreen />} />

        {/* Rutas dentro del layout principal */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/auth" replace />} />
          <Route path="home" element={<ClientHomeScreen />} />
          <Route path="feed" element={<FeedScreen />} />
          <Route path="mis-trabajos" element={<div className="p-6 text-center text-slate-500">Mis Trabajos B2C (Próximamente)</div>} />
          <Route path="agenda" element={<div className="p-6 text-center text-slate-500">Agenda B2B (Próximamente)</div>} />
          <Route path="profile" element={
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Perfil</h2>
              <button 
                onClick={() => window.location.href = '/upgrade-to-pro'} 
                className="w-full bg-[#EA580C]/10 text-[#EA580C] font-bold py-3 rounded-xl border border-[#EA580C]/20"
              >
                Quiero ofrecer mis servicios (B2B)
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
