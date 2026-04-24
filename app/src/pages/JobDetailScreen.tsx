import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, ShieldCheck, AlertCircle, User, Star } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useRoleStore } from '../store/useRoleStore';

interface Lead {
  id: string;
  pro_id: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

interface Job {
  id: string;
  client_id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  selected_pro_id: string | null;
}

export default function JobDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userId, role } = useRoleStore();
  
  const [job, setJob] = useState<Job | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id, userId]);

  async function fetchJobDetails() {
    setLoading(true);
    try {
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (jobError) throw jobError;
      setJob(jobData);

      // Si el usuario es el cliente dueño del trabajo, cargamos los leads
      if (jobData.client_id === userId) {
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select(`
            id,
            pro_id,
            profiles:pro_id (
              full_name,
              avatar_url
            )
          `)
          .eq('job_id', id);

        if (leadsError) throw leadsError;
        setLeads(leadsData as any || []);
      }

      // Si el usuario es PRO, verificamos si ya se postuló
      if (role === 'pro' && userId) {
        const { data: leadData, error: leadError } = await supabase
          .from('leads')
          .select('id')
          .eq('job_id', id)
          .eq('pro_id', userId)
          .maybeSingle();

        if (leadError) throw leadError;
        setHasApplied(!!leadData);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  }

  async function selectProfessional(proId: string) {
    if (!job) return;
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ 
          selected_pro_id: proId,
          status: 'in_progress'
        })
        .eq('id', job.id);

      if (error) throw error;
      
      // Refresh data
      await fetchJobDetails();
      alert('¡Profesional seleccionado con éxito!');
    } catch (error) {
      console.error('Error selecting professional:', error);
      alert('Error al seleccionar profesional');
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleApply() {
    if (!job || !userId) return;
    setIsProcessing(true);
    try {
      const { error } = await supabase.rpc('apply_to_job', {
        p_job_id: job.id,
        p_pro_id: userId
      });

      if (error) throw error;

      // Update store credits
      const { data: profileData } = await supabase
        .from('profiles')
        .select('credits_balance')
        .eq('id', userId)
        .single();
      
      if (profileData) {
        useRoleStore.getState().setProfile({
          ...useRoleStore.getState().profile!,
          credits: profileData.credits_balance
        });
      }

      alert('¡Postulación exitosa! Ahora puedes ver los datos del cliente.');
      await fetchJobDetails();
    } catch (error: any) {
      console.error('Error applying to job:', error);
      alert(error.message || 'Error al postularse');
    } finally {
      setIsProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Trabajo no encontrado</h2>
        <button onClick={() => navigate(-1)} className="text-brand font-bold">Volver atrás</button>
      </div>
    );
  }

  const isOwner = job.client_id === userId;

  return (
    <main className="min-h-screen bg-slate-50 pb-32">
      {/* Navbar Superior */}
      <div className="bg-white sticky top-0 z-10 px-4 h-16 flex items-center border-b border-slate-200">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="ml-4 font-bold text-slate-900 text-lg">Detalle del Trabajito</h1>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        {/* Cabecera del trabajo */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {job.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              job.status === 'open' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
            }`}>
              {job.status === 'open' ? 'Abierto' : job.status === 'in_progress' ? 'En Progreso' : 'Finalizado'}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 leading-tight mb-4">
            {job.title}
          </h2>
          
          <div className="flex flex-col gap-3 text-slate-500 text-sm font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand" />
              <span>
                {(!isOwner && role === 'pro' && !hasApplied) 
                  ? job.location.split(' - ')[0].trim() 
                  : job.location}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand" />
              <span>Publicado {new Date(job.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <hr className="border-slate-200 my-6" />

        {/* Descripción */}
        <div className="mb-8">
          <h3 className="font-bold text-slate-900 mb-3 text-lg">¿Qué se necesita?</h3>
          <p className="text-slate-600 leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Sección de Leads para el Cliente */}
        {isOwner && job.status === 'open' && (
          <div className="mb-8">
            <h3 className="font-bold text-slate-900 mb-4 text-lg">Postulados ({leads.length})</h3>
            {leads.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center">
                <p className="text-slate-400 text-sm">Aún nadie se ha postulado. Te avisaremos cuando haya interesados.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center overflow-hidden">
                        {lead.profiles.avatar_url ? (
                          <img src={lead.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-brand" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{lead.profiles.full_name}</p>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span>4.8 (12 trabajos)</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => selectProfessional(lead.pro_id)}
                      disabled={isProcessing}
                      className="bg-brand text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md shadow-brand/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isProcessing ? 'Procesando...' : 'Seleccionar'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Información del Cliente (Visible si ya se postuló o si es el dueño) */}
        {(isOwner || hasApplied) && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="text-slate-500 w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{isOwner ? 'Tú (Cliente)' : 'Contacto del Cliente'}</p>
                <div className="flex items-center gap-1 text-xs font-bold text-[#10B981] mt-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verificado</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-medium mb-1">Teléfono</p>
              <p className="font-mono font-bold text-brand tracking-widest">312 456 7890</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer solo para Pros (para aplicar) */}
      {!isOwner && role === 'pro' && job.status === 'open' && !hasApplied && (
        <div className="fixed bottom-0 left-0 w-full p-6 bg-white border-t border-slate-200 pb-safe z-20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-600 font-medium">Costo de contacto:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xl">🪙</span>
              <span className="font-mono font-bold text-slate-900 text-lg">1 Crédito</span>
            </div>
          </div>
          <button 
            onClick={handleApply}
            disabled={isProcessing}
            className="w-full bg-brand text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? 'Procesando...' : 'Desbloquear Contacto'}
          </button>
        </div>
      )}
    </main>
  );
}
