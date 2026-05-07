import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useRoleStore } from '../../store/useRoleStore';
import { User, Mail, Phone, MapPin, Briefcase, ArrowRight, CheckCircle2, Sparkles, Lock, Eye, EyeOff } from 'lucide-react';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const { setUser, setProfile } = useRoleStore();
  
  const [step, setStep] = useState<'client' | 'ask_pro' | 'pro_details' | 'success'>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '', 
    fullName: '',
    phone: '',
    city: '',
    bio: '',
    categories: [] as string[],
    serviceCities: [] as string[]
  });

  const availableCategories = ['Plomería', 'Electricidad', 'Limpieza', 'Pintura', 'Carpintería', 'Mecánica'];
  const availableCities = ['Girardot', 'Flandes', 'Melgar', 'Ricaurte', 'Bogotá', 'Ibagué'];

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Sign up in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No se pudo crear el usuario');

      const userId = authData.user.id;

      // 2. Update/Create profile with additional info (phone, city)
      console.log('Registering profile for UID:', userId);
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: formData.email,
          full_name: formData.fullName,
          phone: formData.phone,
          city_residence: formData.city,
          role: 'client'
        });

      if (profileError) {
        console.error('Profile upsert error:', profileError);
        throw profileError;
      }

      console.log('Profile created/updated successfully');

      // 3. Update store
      setUser('client', userId, false);
      setProfile({
        fullName: formData.fullName,
        credits: 0,
        profession: ''
      });

      setStep('ask_pro');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const handleProSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { userId } = useRoleStore.getState();
      console.log('Registering professional metadata for UID:', userId);
      
      if (!userId) {
        throw new Error('Sesión no encontrada. Intenta registrarte de nuevo.');
      }

      // 1. Create professional metadata
      const { error: metaError } = await supabase
        .from('professionals_metadata')
        .upsert({
          id: userId,
          bio: formData.bio,
          categories: formData.categories,
          credit_balance: 50,
          service_cities: formData.serviceCities // Usamos las seleccionadas
        });

      if (metaError) {
        console.error('Metadata upsert error:', metaError);
        throw metaError;
      }

      // 2. Update profile role to 'pro' and ADD CREDITS
      const { error: roleUpdateError } = await supabase
        .from('profiles')
        .update({ 
          role: 'pro',
          credits_balance: 50 
        })
        .eq('id', userId);

      if (roleUpdateError) console.warn('Could not update role to pro:', roleUpdateError);

      console.log('Professional registration successful');
      
      // Update store to reflect pro status
      const { setProfile: updateProfile, setUser: updateUser, profile: currentProfile } = useRoleStore.getState();
      updateUser('pro', userId, true);
      updateProfile({
        ...currentProfile!,
        credits: 50
      });
      
      setStep('success');
    } catch (err: any) {
      console.error('Pro registration error:', err);
      setError(err.message || 'Error al registrar perfil profesional');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const toggleServiceCity = (city: string) => {
    setFormData(prev => ({
      ...prev,
      serviceCities: prev.serviceCities.includes(city)
        ? prev.serviceCities.filter(c => c !== city)
        : [...prev.serviceCities, city]
    }));
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 flex">
          <div className={`h-full bg-brand transition-all duration-500 ${
            step === 'client' ? 'w-1/4' : step === 'ask_pro' ? 'w-1/2' : step === 'pro_details' ? 'w-3/4' : 'w-full'
          }`}></div>
        </div>

        <div className="p-8">
          {step === 'client' && (
            <form onSubmit={handleClientSubmit} className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-black text-slate-900 mb-2">Crear mi cuenta</h1>
                <p className="text-slate-500 text-sm">Únete a Tuali para encontrar servicios.</p>
              </div>

              {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100">{error}</div>}

              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Nombre Completo"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm font-medium"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Correo Electrónico"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm font-medium"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm font-medium"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="¿En qué ciudad vives?"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm font-medium"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Crea una contraseña"
                    required
                    minLength={6}
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm font-medium"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Creando cuenta...' : 'Continuar'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          )}

          {step === 'ask_pro' && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand">
                <Sparkles className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">¡Cuenta creada!</h2>
              <p className="text-slate-500 text-sm mb-8">
                Ya puedes solicitar servicios. ¿También te gustaría **ofrecer tus servicios** y ganar dinero?
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => setStep('pro_details')}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-5 h-5" />
                  Sí, quiero ser Profesional
                </button>
                <button
                  onClick={() => navigate('/app/home')}
                  className="w-full bg-white text-slate-500 font-bold py-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all"
                >
                  No por ahora, solo buscaré servicios
                </button>
              </div>
            </div>
          )}

          {step === 'pro_details' && (
            <form onSubmit={handleProSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-black text-slate-900 mb-2">Perfil Profesional</h1>
                <p className="text-slate-500 text-sm">Configura tu área de trabajo.</p>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                    Bio / Descripción
                  </label>
                  <textarea
                    required
                    placeholder="Ej: Plomero con 10 años de experiencia..."
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm font-medium h-24 resize-none"
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                    Categorías de servicio
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableCategories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                          formData.categories.includes(cat)
                            ? 'bg-brand text-white border-brand shadow-sm shadow-brand/20'
                            : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-brand/20'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                    Municipios que atiendes
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableCities.map(city => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => toggleServiceCity(city)}
                        className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                          formData.serviceCities.includes(city)
                            ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-sm shadow-orange-200'
                            : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-orange-200'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || formData.categories.length === 0 || formData.serviceCities.length === 0}
                className="w-full bg-brand text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Guardando perfil...' : 'Finalizar Registro'}
                {!loading && <CheckCircle2 className="w-5 h-5" />}
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3">¡Todo listo!</h2>
              <p className="text-slate-500 text-sm mb-8">
                Tu perfil profesional ha sido creado. Te regalamos **50 créditos** para que empieces a postularte a trabajos.
              </p>
              
              <button
                onClick={() => navigate('/app/feed')}
                className="w-full bg-brand text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand/20 active:scale-[0.98] transition-all"
              >
                Ir al Muro de Trabajos
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
