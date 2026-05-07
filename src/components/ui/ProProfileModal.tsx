import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { X, Star, MapPin, CheckCircle2, ShieldCheck, User } from 'lucide-react';

interface ProProfileModalProps {
  proId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
}

export default function ProProfileModal({ proId, isOpen, onClose, onSelect, isSelected }: ProProfileModalProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && proId) {
      fetchProData();
    }
  }, [isOpen, proId]);

  const fetchProData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('professionals_metadata')
        .select(`
          bio,
          categories,
          avg_rating,
          service_cities,
          identity_verified,
          background_status,
          profiles!inner (
            full_name,
            city_residence,
            avatar_url,
            phone
          )
        `)
        .eq('id', proId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching pro profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-0">
      <div className="bg-white w-full sm:max-w-md rounded-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200 max-h-[85vh] flex flex-col relative">
        
        {/* Botón cerrar fijo */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[70] bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-slate-400 mt-4 uppercase tracking-wider">Cargando perfil...</p>
            </div>
          ) : profile ? (
            <>
              {/* Header con imagen dentro del scroll */}
              <div className="h-32 bg-gradient-to-r from-brand/80 to-[#EA580C]/80 w-full"></div>
              
              <div className="px-6 pb-6">
                {/* Avatar superpuesto */}
                <div className="relative -mt-16 mb-4 flex justify-between items-end">
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 shadow-md flex items-center justify-center overflow-hidden">
                    {profile.profiles.avatar_url ? (
                      <img src={profile.profiles.avatar_url} alt={profile.profiles.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-slate-300" />
                    )}
                  </div>
                  
                  {profile.identity_verified && (
                    <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 mb-2 border border-emerald-100 shadow-sm">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider">Verificado</span>
                    </div>
                  )}
                </div>

                {/* Info principal */}
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-slate-900">{profile.profiles.full_name}</h2>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-lg">
                      <Star className="w-4 h-4 mr-1 fill-amber-500" />
                      {profile.avg_rating || 4.5}
                    </div>
                    <div className="flex items-center text-slate-500 font-medium text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      Vive en: {profile.profiles.city_residence || 'No especificada'}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Sobre mí</h3>
                  <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {profile.bio || 'Este profesional aún no ha escrito su biografía.'}
                  </p>
                </div>

                {/* Categorías */}
                <div className="mb-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Especialidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.categories?.map((cat: string) => (
                      <span key={cat} className="px-3 py-1.5 bg-brand/10 text-brand rounded-lg text-sm font-bold border border-brand/20">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cobertura */}
                <div className="mb-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Ciudades que cubre</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.service_cities?.map((city: string) => (
                      <span key={city} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium border border-slate-200">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-slate-500">No se pudo cargar la información.</div>
          )}
        </div>

        {/* Footer actions */}
        {onSelect && profile && (
          <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
            <button
              onClick={() => {
                onSelect();
                onClose();
              }}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                isSelected 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                  : 'bg-brand text-white shadow-lg shadow-brand/20'
              }`}
            >
              {isSelected ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Profesional Seleccionado
                </>
              ) : (
                'Seleccionar Profesional'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
