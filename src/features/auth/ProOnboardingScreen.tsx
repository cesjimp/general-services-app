import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useRoleStore } from '../../store/useRoleStore';
import { ArrowLeft, CheckCircle2, MapPin, Briefcase, Sparkles, Wand2, ShieldCheck, Camera, User } from 'lucide-react';

export default function ProOnboardingScreen() {
  const navigate = useNavigate();
  const { userId, setUser, setProfile, profile } = useRoleStore();
  
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'success'>('form');

  useEffect(() => {
    const initSession = async () => {
      if (!userId) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Re-hidratar el store si perdimos el userId por refresh
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser('client', session.user.id, false);
          if (profileData) {
            setProfile({
              fullName: profileData.full_name,
              avatarUrl: profileData.avatar_url,
              credits: profileData.credits_balance || 0,
              profession: ''
            });
          }
        } else {
          // Si no hay sesión, al login
          navigate('/auth');
        }
      }
      setInitLoading(false);
    };

    initSession();
  }, [userId, navigate, setUser, setProfile]);

  const [formData, setFormData] = useState({
    bio: '',
    categories: [] as string[],
    serviceCities: [] as string[],
    idPhoto: null as string | null,
    profilePhoto: null as string | null
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showAINotice, setShowAINotice] = useState(false);

  const simulateUpload = (field: 'idPhoto' | 'profilePhoto') => {
    setLoading(true);
    setTimeout(() => {
      setFormData(prev => ({ 
        ...prev, 
        [field]: field === 'idPhoto' 
          ? 'https://images.unsplash.com/photo-1621252179027-94459d278660?q=80\u0026w=600' 
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80\u0026w=200\u0026h=200\u0026auto=format\u0026fit=crop'
      }));
      setLoading(false);
    }, 800);
  };

  const simulateAIOptimization = () => {
    if (!formData.bio) return;
    setIsOptimizing(true);
    setShowAINotice(false);
    
    setTimeout(() => {
      const bioLower = formData.bio.toLowerCase();
      
      // 1. Optimizar el texto
      const optimizedBio = `Especialista profesional con amplia trayectoria. Me enfoco en brindar soluciones de alta calidad en ${formData.bio}, garantizando puntualidad y excelencia. Mi compromiso es la satisfacción total del cliente en cada servicio realizado.`;
      
      // 2. Detectar Categorías
      const detectedCats: string[] = [];
      if (bioLower.includes('plom') || bioLower.includes('agua') || bioLower.includes('gas')) detectedCats.push('Plomería');
      if (bioLower.includes('electr') || bioLower.includes('luz') || bioLower.includes('cable')) detectedCats.push('Electricidad');
      if (bioLower.includes('limp') || bioLower.includes('aseo')) detectedCats.push('Limpieza');
      if (bioLower.includes('pint') || bioLower.includes('muro')) detectedCats.push('Pintura');
      if (bioLower.includes('carp') || bioLower.includes('madera')) detectedCats.push('Carpintería');
      if (bioLower.includes('mec') || bioLower.includes('carro') || bioLower.includes('moto')) detectedCats.push('Mecánica');

      // 3. Detectar Ciudades
      const detectedCities: string[] = [];
      const cityList = ['Girardot', 'Flandes', 'Melgar', 'Ricaurte', 'Bogotá', 'Ibagué'];
      cityList.forEach(city => {
        if (bioLower.includes(city.toLowerCase())) detectedCities.push(city);
      });

      setFormData(prev => ({ 
        ...prev, 
        bio: optimizedBio,
        categories: [...new Set([...prev.categories, ...detectedCats])].slice(0, 5),
        serviceCities: [...new Set([...prev.serviceCities, ...detectedCities])]
      }));
      
      setIsOptimizing(false);
      setShowAINotice(true);
    }, 1500);
  };

  const availableCategories = ['Plomería', 'Electricidad', 'Limpieza', 'Pintura', 'Carpintería', 'Mecánica'];
  const availableCities = ['Girardot', 'Flandes', 'Melgar', 'Ricaurte', 'Bogotá', 'Ibagué'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError('Sesión expirada. Por favor, reingresa.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // 1. Ensure profile exists and update role (vital for dev mode test users)
      const { error: roleError } = await supabase
        .from('profiles')
        .upsert({ 
          id: userId,
          email: `${userId}@test.com`, // Fallback para usuarios mock de desarrollo
          full_name: profile?.fullName || 'Profesional Nuevo',
          role: 'pro',
          credits_balance: 50,
          avatar_url: formData.profilePhoto
        });

      if (roleError) throw roleError;

      // 2. Create professional metadata
      const { error: metaError } = await supabase
        .from('professionals_metadata')
        .upsert({
          id: userId,
          bio: formData.bio,
          categories: formData.categories,
          credit_balance: 50,
          service_cities: formData.serviceCities,
          identity_verified: !!formData.idPhoto
        });

      if (metaError) throw metaError;

      // 3. Update Store
      setUser('pro', userId, true);
      setProfile({
        fullName: profile?.fullName || 'Profesional',
        credits: 50,
        profession: formData.categories[0],
        avatarUrl: formData.profilePhoto || profile?.avatarUrl
      });

      setStep('success');
    } catch (err: any) {
      console.error('Onboarding error:', err);
      setError(err.message || 'Error al guardar perfil profesional');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (cat: string) => {
    setFormData(prev => {
      if (!prev.categories.includes(cat) && prev.categories.length >= 5) return prev;
      return {
        ...prev,
        categories: prev.categories.includes(cat)
          ? prev.categories.filter(c => c !== cat)
          : [...prev.categories, cat]
      };
    });
  };

  const toggleCity = (city: string) => {
    setFormData(prev => ({
      ...prev,
      serviceCities: prev.serviceCities.includes(city)
        ? prev.serviceCities.filter(c => c !== city)
        : [...prev.serviceCities, city]
    }));
  };
  if (initLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mb-8 text-emerald-600 shadow-xl shadow-emerald-100/50 border border-emerald-200 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">¡Bienvenido, Tualiado!</h2>
        <p className="text-slate-500 mb-10 max-w-xs font-medium leading-relaxed">
          Tu perfil profesional ha sido verificado. Te hemos acreditado <span className="text-emerald-600 font-bold">50 créditos</span> para que empieces a ganar hoy mismo.
        </p>
        <button
          onClick={() => navigate('/app/feed')}
          className="w-full max-w-xs bg-brand text-white font-black py-5 rounded-[2rem] shadow-xl shadow-brand/30 active:scale-[0.97] transition-all text-lg"
        >
          Ver trabajos ahora
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white sticky top-0 z-20 px-6 h-20 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="font-black text-slate-900 text-lg">Perfil Profesional</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Último paso</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-brand/5 rounded-xl flex items-center justify-center border border-brand/10">
          <Sparkles className="w-5 h-5 text-brand" />
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8 mt-4">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 animate-shake">{error}</div>}

          <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> 1. Validación de Identidad
            </label>
            <div 
              className={`w-full aspect-[16/9] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all ${
                formData.idPhoto ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'
              }`}
            >
              {formData.idPhoto ? (
                <div className="text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-emerald-600">Documento Cargado</p>
                </div>
              ) : (
                <>
                  <Camera className="w-8 h-8 text-slate-300" />
                  <button 
                    type="button"
                    onClick={() => simulateUpload('idPhoto')}
                    className="text-xs font-bold text-brand bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"
                  >
                    Tomar foto de Documento
                  </button>
                </>
              )}
            </div>
          </section>

          <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block flex items-center gap-2">
              <User className="w-3 h-3" /> 2. Foto de Perfil
            </label>
            <div 
              className={`flex items-center gap-6 p-4 rounded-2xl border-2 border-dashed transition-all ${
                formData.profilePhoto ? 'border-emerald-200 bg-emerald-50' : 'border-transparent bg-transparent'
              }`}
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                {formData.profilePhoto ? (
                  <img src={formData.profilePhoto} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-slate-300" />
                )}
              </div>
              <div className="space-y-2">
                <button 
                  type="button"
                  onClick={() => simulateUpload('profilePhoto')}
                  className="text-xs font-bold text-brand bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2"
                >
                  <Camera className="w-3 h-3" />
                  {formData.profilePhoto ? 'Cambiar foto' : 'Subir mi foto'}
                </button>
                {formData.profilePhoto && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" /> Foto lista
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                3. Presentación Profesional
              </label>
              <button 
                type="button"
                onClick={simulateAIOptimization}
                disabled={!formData.bio || isOptimizing}
                className="flex items-center gap-2 text-[10px] font-black text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors disabled:opacity-30 border border-purple-100"
              >
                <Wand2 className={`w-3 h-3 ${isOptimizing ? 'animate-spin' : ''}`} />
                {isOptimizing ? 'OPTIMIZANDO...' : 'OPTIMIZAR CON IA'}
              </button>
            </div>
            <textarea
              required
              placeholder="Ej: Plomero con experiencia en Girardot..."
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand/5 focus:border-brand outline-none transition-all text-sm font-medium h-32 resize-none"
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
            />

            {showAINotice && (
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 flex gap-3 animate-in fade-in slide-in-from-top-2">
                <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <p className="text-[10px] text-purple-700 font-bold leading-tight">
                  ¡IA Tuali activa! He optimizado tu bio y pre-seleccionado categorías y ciudades basadas en tu descripción. Puedes ajustarlas si lo deseas.
                </p>
              </div>
            )}
          </section>

          <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block flex items-center gap-2">
                <Briefcase className="w-3 h-3" /> Categorías (Max 5)
              </label>
              <span className="text-[10px] font-bold text-slate-400">{formData.categories.length}/5</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {availableCategories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`p-3.5 rounded-2xl text-xs font-bold border transition-all ${
                    formData.categories.includes(cat)
                      ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20 scale-[1.02]'
                      : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-brand/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block flex items-center gap-2">
              <MapPin className="w-3 h-3" /> Ciudades
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableCities.map(city => (
                <button
                  key={city}
                  type="button"
                  onClick={() => toggleCity(city)}
                  className={`p-3.5 rounded-2xl text-xs font-bold border transition-all ${
                    formData.serviceCities.includes(city)
                      ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-lg shadow-orange-100 scale-[1.02]'
                      : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-orange-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </section>

          <button
            type="submit"
            disabled={loading || formData.categories.length === 0 || formData.serviceCities.length === 0 || !formData.idPhoto || !formData.profilePhoto}
            className="w-full bg-brand text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-brand/30 active:scale-[0.97] transition-all flex items-center justify-center gap-3 disabled:opacity-40 text-lg mt-4"
          >
            {loading ? 'Guardando perfil...' : 'Finalizar y empezar'}
            {!loading && <CheckCircle2 className="w-6 h-6" />}
          </button>
        </form>
      </div>
    </main>
  );
}
