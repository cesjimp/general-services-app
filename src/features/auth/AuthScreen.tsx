import { LogIn, User, Briefcase, RefreshCcw, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useRoleStore } from '../../store/useRoleStore';
import { useState } from 'react';

export default function AuthScreen() {
  const navigate = useNavigate();
  const { setUser, setProfile, role: currentRole } = useRoleStore();
  const [debugMsg, setDebugMsg] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTestLogin = async (role: 'client' | 'pro', email: string) => {
    setDebugMsg('Iniciando sesión de prueba...');

    try {
      // 1. Buscar perfil por Email
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profileData) {
        throw new Error(`Usuario ${email} no encontrado.`);
      }

      const id = profileData.id;

      // 2. Buscar metadatos
      let profession = '';
      const { data: metaData } = await supabase
        .from('professionals_metadata')
        .select('categories')
        .eq('id', id)
        .maybeSingle();
      
      if (metaData && metaData.categories && metaData.categories.length > 0) {
        profession = metaData.categories[0];
      }

      // 3. Actualizar Store
      setUser(role, id, !!metaData);
      setProfile({
        fullName: profileData.full_name,
        avatarUrl: profileData.avatar_url,
        credits: profileData.credits_balance || 0,
        profession: profession,
        categories: metaData?.categories || [],
        location: profileData.location || 'Girardot, Cundinamarca'
      });

      setDebugMsg(`Bienvenido, ${profileData.full_name}`);
      setTimeout(() => {
        navigate(role === 'client' ? '/app/home' : '/app/feed');
      }, 500);
    } catch (err: any) {
      console.error('Login error:', err);
      setDebugMsg(`Error: ${err.message}`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDebugMsg('Validando credenciales...');

    try {
      // 1. Supabase Auth Login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Usuario no encontrado');

      const userId = authData.user.id;

      // 2. Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // 3. Check if professional
      const { data: metaData } = await supabase
        .from('professionals_metadata')
        .select('categories')
        .eq('id', userId)
        .maybeSingle();

      const isPro = !!metaData;
      const role = isPro ? 'pro' : 'client'; // Default to pro if available, but could be selectable

      // 4. Update Store
      setUser(role, userId, isPro);
      setProfile({
        fullName: profileData.full_name,
        avatarUrl: profileData.avatar_url,
        credits: profileData.credits_balance || 0,
        profession: (metaData?.categories?.[0]) || '',
        categories: metaData?.categories || [],
        location: profileData.location || 'Girardot, Cundinamarca'
      });

      setDebugMsg('¡Ingreso exitoso!');
      setTimeout(() => {
        navigate(role === 'client' ? '/app/home' : '/app/feed');
      }, 500);
    } catch (err: any) {
      console.error('Login error:', err);
      setDebugMsg(`Error: ${err.message || 'Credenciales inválidas'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-brand/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-brand/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-sm z-10 flex flex-col items-center">
        {/* Logo/Branding */}
        <div className="w-20 h-20 bg-brand rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-brand/20">
          <span className="text-white text-4xl font-extrabold tracking-tighter">T</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2 text-center">
          Bienvenido a <span className="text-brand">Tuali</span>
        </h1>
        <p className="text-slate-500 text-center text-sm font-medium mb-8">
          Te conectamos con los mejores profesionales para tus arreglitos en casa.
        </p>

        {/* Debug Login Section - NEW SELECTOR */}
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 text-center flex items-center justify-center gap-2">
            <RefreshCcw className="w-3 h-3" />
            Panel de Pruebas (Demo)
          </p>
          
          <div className="space-y-6">
            {/* Profesionales */}
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-2 px-1">Profesionales</p>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => handleTestLogin('pro', 'juan@volta.com')} className="flex flex-col items-center p-2 bg-amber-50 rounded-xl border border-amber-100 hover:bg-amber-100 transition-all">
                  <span className="text-[9px] font-black text-amber-900">JUAN</span>
                  <span className="text-[7px] font-bold text-amber-600 italic truncate w-full text-center">ELÉCTRICO</span>
                </button>
                <button onClick={() => handleTestLogin('pro', 'carlos@ejemplo.com')} className="flex flex-col items-center p-2 bg-amber-50 rounded-xl border border-amber-100 hover:bg-amber-100 transition-all">
                  <span className="text-[9px] font-black text-amber-900">CARLOS</span>
                  <span className="text-[7px] font-bold text-amber-600 italic truncate w-full text-center">ELÉCTRICO</span>
                </button>
                <button onClick={() => handleTestLogin('pro', 'mario@tubo.com')} className="flex flex-col items-center p-2 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all">
                  <span className="text-[9px] font-black text-blue-900">MARIO</span>
                  <span className="text-[7px] font-bold text-blue-600 italic truncate w-full text-center">PLOMERO</span>
                </button>
                <button onClick={() => handleTestLogin('pro', 'pedro@llave.com')} className="flex flex-col items-center p-2 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all">
                  <span className="text-[9px] font-black text-blue-900">PEDRO</span>
                  <span className="text-[7px] font-bold text-blue-600 italic truncate w-full text-center">PLOMERO</span>
                </button>
                <button onClick={() => handleTestLogin('pro', 'pablo@brocha.com')} className="flex flex-col items-center p-2 bg-rose-50 rounded-xl border border-rose-100 hover:bg-rose-100 transition-all">
                  <span className="text-[9px] font-black text-rose-900">PABLO</span>
                  <span className="text-[7px] font-bold text-rose-600 italic truncate w-full text-center">PINTOR</span>
                </button>
                <button onClick={() => handleTestLogin('pro', 'ana@pincel.com')} className="flex flex-col items-center p-2 bg-rose-50 rounded-xl border border-rose-100 hover:bg-rose-100 transition-all">
                  <span className="text-[9px] font-black text-rose-900">ANA</span>
                  <span className="text-[7px] font-bold text-rose-600 italic truncate w-full text-center">PINTORA</span>
                </button>
              </div>
            </div>

            {/* Clientes */}
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-2 px-1">Clientes</p>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleTestLogin('client', 'marta@ejemplo.com')}
                  className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all"
                >
                  <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <User className="w-3 h-3 text-emerald-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] font-black text-slate-900">MARTA</span>
                    <span className="text-[7px] font-bold text-slate-500 uppercase">Residencial</span>
                  </div>
                </button>
                <button 
                  onClick={() => handleTestLogin('client', 'roberto@ejemplo.com')}
                  className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all"
                >
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] font-black text-slate-900">ROBERTO</span>
                    <span className="text-[7px] font-bold text-slate-500 uppercase">Inmobiliaria</span>
                  </div>
                </button>
                <button 
                  onClick={() => handleTestLogin('client', 'cliente1@ejemplo.com')}
                  className="col-span-2 flex items-center justify-center gap-2 p-3 bg-slate-900 rounded-xl text-white hover:bg-slate-800 transition-all mt-2"
                >
                  <User className="w-4 h-4 text-brand" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">JUAN CLIENTE (DEFAULT)</span>
                </button>
              </div>
            </div>
          </div>
          {debugMsg && <p className="text-[10px] text-center mt-4 text-brand font-bold animate-pulse">{debugMsg}</p>}
        </div>

        {/* Real Login Form */}
        <form onSubmit={handleLogin} className="w-full space-y-4 mb-6">
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input 
              type="email" 
              placeholder="Tu correo electrónico"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm font-medium"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Tu contraseña"
              required
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm font-medium"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : <><LogIn className="w-5 h-5" /> Ingresar</>}
          </button>
        </form>

        <div className="w-full flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">o</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <div className="w-full space-y-4">
          <button 
            onClick={() => navigate('/register')}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <User className="w-5 h-5" />
            Crear cuenta nueva
          </button>
          
          <button 
            className="w-full bg-white text-slate-700 border border-slate-200 font-bold py-4 rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuar con Google
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-8 text-center px-4">
          Al ingresar, aceptas nuestros <span className="underline cursor-pointer">Términos y Condiciones</span> y <span className="underline cursor-pointer">Políticas de Privacidad</span>.
        </p>
      </div>
    </main>
  );
}
