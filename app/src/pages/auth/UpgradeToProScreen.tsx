import { ShieldCheck, Briefcase, Camera, Wand2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRoleStore } from '../../store/useRoleStore';

export default function UpgradeToProScreen() {
  const navigate = useNavigate();
  const { isPro } = useRoleStore();

  const handleStartOnboarding = () => {
    if (isPro) {
      navigate('/feed');
      return;
    }
    navigate('/pro-onboarding');
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col p-6 pb-12">
      {/* Header Area */}
      <div className="mt-8 mb-10 text-center">
        <div className="w-20 h-20 bg-brand/10 text-brand rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand/5 border border-brand/10 animate-pulse">
          <Briefcase className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          Conviértete en un <br/> <span className="text-brand">Tualiado Profesional</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-xs mx-auto">
          Para garantizar la mejor experiencia, el proceso de registro consta de 3 simples pasos:
        </p>
      </div>

      {/* Info Cards */}
      <div className="space-y-4 flex-1">
        
        {/* Step 1 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex gap-5">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">1. Validar tu identidad</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Necesitaremos que tengas a la mano tu documento oficial para tomarle una foto. Esto nos ayuda a mantener una comunidad segura.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex gap-5">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">2. Foto de Perfil</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Te pediremos una selfie clara. Un perfil con foto real genera hasta un <span className="text-blue-600 font-bold">80% más de confianza</span> en los clientes.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex gap-5">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Wand2 className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">3. Presentación de Servicios</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Cuéntanos qué haces. Si te cuesta describirte, ¡No te preocupes! Nuestra <span className="text-purple-600 font-bold">IA Tuali</span> te ayudará a optimizar tu perfil para que luzcas como un experto.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="mt-10">
        <div className="bg-brand/5 p-4 rounded-2xl mb-6 border border-brand/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <p className="text-[11px] font-bold text-brand uppercase tracking-wider leading-none">
            ¡Recibe 50 créditos de regalo al completar tu registro!
          </p>
        </div>

        <button 
          onClick={handleStartOnboarding}
          className="w-full bg-brand text-white font-black py-5 rounded-[2rem] shadow-xl shadow-brand/30 active:scale-[0.97] hover:brightness-110 transition-all flex items-center justify-center gap-3 text-lg"
        >
          ¡Sí, quiero ser Tualiado profesional!
        </button>
        
        <button 
          onClick={() => navigate(-1)}
          className="w-full mt-4 text-slate-400 font-bold py-2 hover:text-slate-600 transition-colors text-sm"
        >
          Tal vez más tarde
        </button>
      </div>
    </main>
  );
}
