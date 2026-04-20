import { ShieldCheck, Briefcase, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRoleStore } from '../../store/useRoleStore';

export default function UpgradeToProScreen() {
  const navigate = useNavigate();
  const toggleRole = useRoleStore((state) => state.toggleRole);

  const handleRegisterAsPro = () => {
    // Simulamos que el usuario completó el registro y le forzamos el modo Pro
    if (useRoleStore.getState().role === 'client') {
      toggleRole();
    }
    navigate('/feed');
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col p-6 pb-safe">
      <div className="flex-1 mt-8">
        <div className="w-16 h-16 bg-[#EA580C]/10 text-[#EA580C] rounded-2xl flex items-center justify-center mb-6">
          <Briefcase className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          Gana dinero <br/> <span className="text-[#EA580C]">ofreciendo tus servicios</span>
        </h1>
        <p className="text-slate-500 mb-8 font-medium">
          Completa tu perfil profesional para empezar a recibir solicitudes de trabajos.
        </p>

        <div className="space-y-6">
          {/* Paso 1 */}
          <div className="flex gap-4">
            <div className="mt-1 bg-white border-2 border-[#10B981] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Validación de Identidad</h3>
              <p className="text-sm text-slate-500 mt-1">Sube una foto de tu documento oficial para garantizar la seguridad de la comunidad.</p>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="flex gap-4">
            <div className="mt-1 bg-white border-2 border-slate-200 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-slate-400 font-bold text-sm">2</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Foto de Perfil</h3>
              <p className="text-sm text-slate-500 mt-1">Una foto clara tuya genera mucha más confianza a los clientes.</p>
              <button className="mt-3 flex items-center gap-2 text-sm font-bold text-[#EA580C] bg-[#EA580C]/10 px-4 py-2 rounded-xl">
                <Camera className="w-4 h-4" /> Tomar foto
              </button>
            </div>
          </div>

          {/* Paso 3 */}
          <div className="flex gap-4">
            <div className="mt-1 bg-white border-2 border-slate-200 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-slate-400 font-bold text-sm">3</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">¿Qué servicios ofreces?</h3>
              <p className="text-sm text-slate-500 mt-1">Selecciona tus especialidades.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-[#EA580C] text-white px-3 py-1.5 rounded-lg text-xs font-bold">Electricidad</span>
                <span className="bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300">Plomería</span>
                <span className="bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300">Pintura</span>
                <span className="bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300">Carpintería</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 sticky bottom-6">
        <button 
          onClick={handleRegisterAsPro}
          className="w-full bg-[#EA580C] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#EA580C]/20 active:scale-[0.98] transition-all"
        >
          Completar Registro Profesional
        </button>
      </div>
    </main>
  );
}
