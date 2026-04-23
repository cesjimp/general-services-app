import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Sparkles, CheckCircle2, User, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useRoleStore } from '../store/useRoleStore';
import { getCategoryIcon } from '../utils/categoryIcons';

export default function CreateJobScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useRoleStore(state => state.userId);
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form States
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [department, setDepartment] = useState('');
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const municipalities: Record<string, string[]> = {
    'Tolima': ['Ibagué', 'Melgar', 'Espinal', 'Flandes'],
    'Cundinamarca': ['Girardot', 'Ricaurte', 'Fusagasugá', 'Villeta']
  };

  // ... (dentro del componente)
  
  const [isCategoryLocked, setIsCategoryLocked] = useState(false);
  const [notificationType, setNotificationType] = useState<'all' | 'manual' | 'suggested'>('all');
  const [selectedPros, setSelectedPros] = useState<string[]>([]);
  const [availablePros, setAvailablePros] = useState<any[]>([]);
  const [loadingPros, setLoadingPros] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');
    if (catParam) {
      // Normalizamos: minúsculas y quitar tildes para coincidir con el select
      const normalizedCat = catParam
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      
      setCategory(normalizedCat);
      setIsCategoryLocked(true);
      setNotificationType('suggested');
    }
  }, [location]);

  // Cargar profesionales cuando cambia la categoría o la ubicación
  useEffect(() => {
    if (category && locationName) {
      fetchAvailablePros();
    }
  }, [category, locationName]);

  async function fetchAvailablePros() {
    setLoadingPros(true);
    try {
      // Normalizamos la categoría: quitamos tildes y pasamos a minúsculas
      const catToSearch = category
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const { data, error } = await supabase
        .from('professionals_metadata')
        .select(`
          id,
          categories,
          avg_rating,
          service_cities,
          profiles!inner (
            full_name,
            city_residence
          )
        `)
        .contains('categories', [catToSearch])
        .contains('service_cities', [locationName])
        .order('avg_rating', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Mapear los datos para que mantengan la estructura esperada por la UI
      const formattedData = data?.map(item => ({
        id: item.id,
        full_name: item.profiles.full_name,
        city_residence: item.profiles.city_residence,
        professionals_metadata: {
          categories: item.categories,
          avg_rating: item.avg_rating,
          service_cities: item.service_cities
        }
      })) || [];

      setAvailablePros(formattedData);
    } catch (error) {
      console.error('Error fetching pros:', error);
    } finally {
      setLoadingPros(false);
    }
  }

  const toggleProSelection = (id: string) => {
    if (selectedPros.includes(id)) {
      setSelectedPros(selectedPros.filter(p => p !== id));
    } else if (selectedPros.length < 3) {
      setSelectedPros([...selectedPros, id]);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert('Debes estar logueado para publicar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('jobs').insert({
        client_id: userId,
        category,
        description: `${title}\n\n${description}\n\nInstrucciones: ${specialInstructions}`,
        location: `${locationName} - ${address} (Persona: ${receiverName})`,
        status: 'open'
      });

      if (error) throw error;

      navigate('/home?success=true');
    } catch (err: any) {
      console.error('Error creando trabajo:', err);
      alert('Hubo un error al publicar el trabajo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navbar Superior */}
      <div className="bg-white sticky top-0 z-10 px-4 h-16 flex items-center justify-between border-b border-slate-200">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <div className="flex gap-1">
          <div className={`h-2 w-8 rounded-full ${step >= 1 ? 'bg-brand' : 'bg-slate-200'}`}></div>
          <div className={`h-2 w-8 rounded-full ${step >= 2 ? 'bg-brand' : 'bg-slate-200'}`}></div>
          <div className={`h-2 w-8 rounded-full ${step >= 3 ? 'bg-brand' : 'bg-slate-200'}`}></div>
        </div>
      </div>

      <div className="p-6 pb-32">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Publicar un Trabajito</h1>
        <p className="text-slate-500 mb-8 font-medium">
          {step < 3 ? 'Describe lo que necesitas.' : '¿A quién quieres avisarle?'}
        </p>

        <form onSubmit={handleFinalSubmit}>
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-brand/5 border border-brand/10 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-slate-700">
                  Tip: Entre más específico seas, más rápido un profesional tomará tu solicitud.
                </p>
              </div>

              <div className="space-y-6">
                {/* Categoría del trabajo (Movida al Paso 1) */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-700">Categoría del trabajo</label>
                    {isCategoryLocked && (
                      <button 
                        type="button"
                        onClick={() => setIsCategoryLocked(false)}
                        className="text-brand text-xs font-bold hover:underline"
                      >
                        Editar
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      disabled={isCategoryLocked}
                      className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed transition-all`}
                    >
                      <option value="">Selecciona una categoría</option>
                      <option value="plomeria">Plomería</option>
                      <option value="electricidad">Electricidad</option>
                      <option value="pintura">Pintura</option>
                      <option value="carpinteria">Carpintería</option>
                      <option value="general">Mantenimiento General</option>
                    </select>
                    {!isCategoryLocked && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Título de la solicitud</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Fuga de agua en lavaplatos" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Descripción detallada</label>
                  <textarea 
                    placeholder="Explica qué está sucediendo, desde cuándo, y qué necesitas que hagan..." 
                    rows={4}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                {/* Urgencia (Movida al Paso 1) */}
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <input 
                      type="checkbox" 
                      id="urgent"
                      className="w-5 h-5 accent-brand rounded-md"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                    />
                    <label htmlFor="urgent" className="text-sm font-extrabold text-orange-900">
                      ¡Es Urgente! (Atención en menos de 2h)
                    </label>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] text-orange-700 leading-tight">
                      <span className="font-bold">Aviso para ti:</span> Los trabajos urgentes pueden tener un recargo adicional por parte del profesional.
                    </p>
                    <p className="text-[11px] text-orange-600 italic leading-tight border-t border-orange-100 pt-2">
                      <span className="font-bold">Info Pro:</span> Aceptar esta tarea costará 2 créditos, pero te permite aplicar tarifa de urgencia.
                    </p>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-[#EA580C] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 active:scale-[0.98] transition-all"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Departamento</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand appearance-none"
                        value={department}
                        onChange={(e) => {
                          setDepartment(e.target.value);
                          setLocationName(''); // Reset municipio
                        }}
                      >
                        <option value="">Selecciona</option>
                        <option value="Tolima">Tolima</option>
                        <option value="Cundinamarca">Cundinamarca</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Municipio / Ciudad</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand appearance-none disabled:bg-slate-50 disabled:text-slate-400"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        disabled={!department}
                      >
                        <option value="">Selecciona</option>
                        {department && municipalities[department].map(muni => (
                          <option key={muni} value={muni}>{muni}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Dirección exacta</label>
                  <input 
                    type="text" 
                    placeholder="Calle, Carrera, Edificio, Apto..." 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">¿Quién recibirá el servicio?</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Nombre de la persona en el lugar" 
                      className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-900 focus:outline-none focus:border-brand"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Indicaciones especiales</label>
                  <textarea 
                    placeholder="Ej: Tocar el timbre que dice 201, entrar por la portería lateral..." 
                    rows={3}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand resize-none"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-slate-100 text-slate-700 font-bold py-4 rounded-xl active:scale-[0.98] transition-all"
                  >
                    Atrás
                  </button>
                  <button 
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-2/3 bg-[#EA580C] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 active:scale-[0.98] transition-all"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {/* Opción Sugerida (si viene de IA) */}
                {category && (
                  <button 
                    type="button"
                    onClick={() => setNotificationType('suggested')}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${notificationType === 'suggested' ? 'border-brand bg-brand/5' : 'border-slate-100 bg-white'}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${notificationType === 'suggested' ? 'bg-brand text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-900">Expertos Sugeridos</span>
                      {notificationType === 'suggested' && <CheckCircle2 className="w-5 h-5 text-brand ml-auto" />}
                    </div>
                    <p className="text-xs text-slate-500">Notificar directamente a los expertos recomendados por la IA para este trabajo.</p>
                  </button>
                )}

                {/* Opción Masiva */}
                <button 
                  type="button"
                  onClick={() => setNotificationType('all')}
                  className={`p-4 rounded-2xl border-2 transition-all text-left ${notificationType === 'all' ? 'border-brand bg-brand/5' : 'border-slate-100 bg-white'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${notificationType === 'all' ? 'bg-brand text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900">Notificar a todos</span>
                    {notificationType === 'all' && <CheckCircle2 className="w-5 h-5 text-brand ml-auto" />}
                  </div>
                  <p className="text-xs text-slate-500">Enviar alerta a todos los {category || 'profesionales'} disponibles en tu zona.</p>
                </button>

                {/* Opción Manual */}
                <button 
                  type="button"
                  onClick={() => setNotificationType('manual')}
                  className={`p-4 rounded-2xl border-2 transition-all text-left ${notificationType === 'manual' ? 'border-brand bg-brand/5' : 'border-slate-100 bg-white'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${notificationType === 'manual' ? 'bg-brand text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <User className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900">Seleccionar manualmente</span>
                    {notificationType === 'manual' && <CheckCircle2 className="w-5 h-5 text-brand ml-auto" />}
                  </div>
                  <p className="text-xs text-slate-500">Elige hasta 3 expertos específicos de la lista.</p>
                </button>
              </div>

              {/* Lista de selección manual */}
              {notificationType === 'manual' && (
                <div className="animate-in zoom-in-95 duration-200 space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expertos en tu zona</p>
                    <p className="text-xs font-bold text-brand">{selectedPros.length}/3 seleccionados</p>
                  </div>
                  {loadingPros ? (
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="w-6 h-6 border-2 border-brand/20 border-t-brand rounded-full animate-spin"></div>
                      <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">Buscando expertos...</p>
                    </div>
                  ) : availablePros.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                      <p className="text-xs text-slate-500">No encontramos expertos en esta categoría todavía.</p>
                    </div>
                  ) : (
                    availablePros.map(pro => (
                      <div 
                        key={pro.id}
                        onClick={() => toggleProSelection(pro.id)}
                        className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${selectedPros.includes(pro.id) ? 'border-brand bg-brand/5' : 'border-slate-100 bg-white'}`}
                      >
                        <div className="bg-brand/10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-brand p-2.5">
                          {getCategoryIcon(category)}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 text-sm">{pro.full_name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[10px] text-slate-500 font-medium">{category} • {pro.professionals_metadata?.avg_rating || 4.5} ★</p>
                            <span className="text-[10px] text-slate-300">•</span>
                            <p className="text-[10px] text-slate-500 font-medium">Vive en: {pro.city_residence || 'No especificada'}</p>
                          </div>
                          <div className="flex gap-1 mt-1.5 overflow-x-auto no-scrollbar">
                            <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold whitespace-nowrap">
                              Cubre {locationName}
                            </span>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPros.includes(pro.id) ? 'bg-brand border-brand text-white' : 'border-slate-200'}`}>
                          {selectedPros.includes(pro.id) && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 bg-slate-100 text-slate-700 font-bold py-4 rounded-xl active:scale-[0.98] transition-all"
                >
                  Atrás
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || (notificationType === 'manual' && selectedPros.length === 0)}
                  className="w-2/3 bg-[#EA580C] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    'Notificando...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Finalizar y Avisar
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
