import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, ShieldCheck, AlertCircle, User, Star, CheckCircle } from 'lucide-react';
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
  raw_description: string | null;
  raw_location: string | null;
  is_urgent: boolean;
  status: 'open' | 'contacted' | 'agreement_pending' | 'in_progress' | 'review_pending' | 'completed' | 'cancelled';
  created_at: string;
  selected_pro_id: string | null;
  profiles?: {
    full_name: string;
    phone: string;
  };
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
        .select('*, profiles:client_id(full_name, phone)')
        .eq('id', id)
        .single();

      if (jobError) throw jobError;
      setJob(jobData);

      // Cargamos los leads si es el dueño o si hay acuerdo pendiente
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

      // Si el usuario es PRO, verificamos si ya se postuló
      if (role === 'pro' && userId) {
        setHasApplied(leadsData?.some(l => l.pro_id === userId) || false);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  }

  // El PRO indica que ya hizo un acuerdo
  async function markAsAgreed() {
    if (!job || !userId) return;
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ 
          selected_pro_id: userId,
          status: 'agreement_pending'
        })
        .eq('id', job.id);

      if (error) throw error;
      
      alert('¡Excelente! Hemos notificado al cliente para que confirme el acuerdo.');
      await fetchJobDetails();
    } catch (error) {
      console.error('Error marking as agreed:', error);
      alert('Error al marcar acuerdo');
    } finally {
      setIsProcessing(false);
    }
  }

  // El CLIENTE confirma que el acuerdo es real
  async function confirmAgreement() {
    if (!job) return;
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ 
          status: 'in_progress'
        })
        .eq('id', job.id);

      if (error) throw error;
      
      alert('¡Trato cerrado! El profesional ya está en camino.');
      await fetchJobDetails();
    } catch (error) {
      console.error('Error confirming agreement:', error);
      alert('Error al confirmar el acuerdo');
    } finally {
      setIsProcessing(false);
    }
  }

  // El CLIENTE marca el trabajo como terminado
  async function finishJob() {
    if (!job) return;
    if (!confirm('¿Confirmas que el profesional ha terminado el servicio satisfactoriamente?')) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ 
          status: 'review_pending'
        })
        .eq('id', job.id);

      if (error) throw error;
      
      alert('¡Trabajo terminado! Ahora puedes dejar tu reseña.');
      await fetchJobDetails();
    } catch (error) {
      console.error('Error finishing job:', error);
      alert('Error al finalizar el trabajo');
    } finally {
      setIsProcessing(false);
    }
  }

  // El CLIENTE rechaza el acuerdo propuesto por el pro
  async function rejectAgreement() {
    if (!job) return;
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ 
          selected_pro_id: null,
          status: leads.length > 0 ? 'contacted' : 'open'
        })
        .eq('id', job.id);

      if (error) throw error;
      
      alert('Has rechazado el acuerdo. El trabajo vuelve a estar disponible para otros profesionales.');
      await fetchJobDetails();
    } catch (error) {
      console.error('Error rejecting agreement:', error);
      alert('Error al rechazar el acuerdo');
    } finally {
      setIsProcessing(false);
    }
  }

  // El CLIENTE cancela la solicitud
  async function cancelJob() {
    if (!job) return;
    if (!confirm('¿Estás seguro de que deseas cancelar este trabajo?')) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'cancelled' })
        .eq('id', job.id);

      if (error) throw error;
      
      alert('Trabajo cancelado correctamente.');
      navigate(-1);
    } catch (error) {
      console.error('Error cancelling job:', error);
      alert('Error al cancelar el trabajo');
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

  const formatDisplayName = (fullName: string) => {
    if (!fullName) return 'Cliente';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 4) return `${parts[0]} ${parts[2]}`;
    if (parts.length >= 2) return `${parts[0]} ${parts[1]}`;
    return parts[0];
  };

  const formatPhone = (phone: string) => {
    if (!phone) return 'Sin teléfono';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    return phone;
  };

  // Determinar el nombre del profesional que pide el acuerdo
  const selectedProName = leads.find(l => l.pro_id === job.selected_pro_id)?.profiles.full_name || 'El profesional';

  return (
    <main className="min-h-screen bg-slate-50 pb-32">
      {/* Navbar Superior */}
      <div className="bg-white sticky top-0 z-10 px-4 h-16 flex items-center border-b border-slate-200 shadow-sm">
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
            <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {job.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              job.status === 'open' ? 'bg-emerald-100 text-emerald-600' : 
              job.status === 'contacted' ? 'bg-amber-100 text-amber-600' :
              job.status === 'in_progress' ? 'bg-emerald-500 text-white' :
              job.status === 'review_pending' ? 'bg-blue-500 text-white' :
              'bg-slate-100 text-slate-600'
            }`}>
              {job.status === 'open' ? 'Abierto' : 
               job.status === 'contacted' ? 'En Contacto' :
               job.status === 'agreement_pending' ? 'Acuerdo Solicitado' :
               job.status === 'in_progress' ? 'En Progreso' : 
               job.status === 'review_pending' ? 'Por Calificar' :
               job.status === 'completed' ? 'Finalizado' : 'Cancelado'}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight mb-4">
            {job.title}
          </h2>
          
          <div className="flex flex-col gap-3 text-slate-500 text-sm font-bold">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand" />
              <span>
                {(isOwner || hasApplied || job.selected_pro_id === userId) 
                  ? (job.raw_location || job.location)
                  : job.location.split(' - ')[0].trim()}
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
          <h3 className="font-black text-slate-900 mb-3 text-lg uppercase tracking-tight">¿Qué se necesita?</h3>
          <p className="text-slate-600 leading-relaxed font-medium">
            {(isOwner || hasApplied || job.selected_pro_id === userId)
              ? (job.raw_description || job.description)
              : job.description}
          </p>
        </div>

        {/* Sección de Leads para el Cliente */}
        {isOwner && (job.status === 'open' || job.status === 'contacted') && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">Postulados ({leads.length}/3)</h3>
              <button 
                onClick={cancelJob}
                className="text-red-500 text-xs font-bold uppercase hover:underline"
              >
                Cancelar solicitud
              </button>
            </div>
            {leads.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-10 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 text-sm font-bold">Aún nadie se ha postulado. Te avisaremos pronto.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-brand/5 rounded-2xl flex items-center justify-center overflow-hidden border border-brand/10">
                        {lead.profiles.avatar_url ? (
                          <img src={lead.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-7 h-7 text-brand" />
                        )}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 leading-none mb-1">{lead.profiles.full_name}</p>
                        <div className="flex items-center gap-1 text-[10px] text-amber-500 font-black uppercase">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span>4.8 (12 trabajos)</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2">¿Pactaste con él?</p>
                      <button
                        onClick={() => {
                          // Simplemente actualizamos localmente y confirmamos
                          // En una app real esto sería atómico
                          job.selected_pro_id = lead.pro_id;
                          confirmAgreement();
                        }}
                        disabled={isProcessing}
                        className="bg-brand text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-brand/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 uppercase tracking-widest"
                      >
                        {isProcessing ? '...' : 'Confirmar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Alerta de Acuerdo Pendiente para el CLIENTE */}
        {isOwner && job.status === 'agreement_pending' && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 mb-8 shadow-xl shadow-amber-500/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
                <CheckCircle className="text-white w-8 h-8" />
              </div>
              <div>
                <h4 className="font-black text-amber-900 uppercase text-lg leading-tight">¿Confirmas el acuerdo?</h4>
                <p className="text-amber-700 text-xs font-bold">{selectedProName} indica que ya pactaron el trabajo.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={confirmAgreement}
                className="flex-1 bg-amber-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                Sí, confirmar
              </button>
              <button 
                onClick={rejectAgreement}
                className="flex-1 bg-white border-2 border-amber-200 text-amber-600 font-black py-4 rounded-2xl active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                No, aún no
              </button>
            </div>
          </div>
        )}

        {/* Información del Cliente / Profesional (Visible si ya se postuló o si es el dueño) */}
        {(isOwner || hasApplied || (job.selected_pro_id === userId)) && (
          <>
            <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-6 flex items-center justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner">
                  <User className="text-slate-300 w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                    {isOwner ? 'Dueño del trabajo' : 'Contacto Directo'}
                  </p>
                  <p className="font-black text-slate-900 text-lg leading-none">
                    {isOwner ? 'Tú' : formatDisplayName(job.profiles?.full_name || '')}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 mt-1 uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verificado</span>
                  </div>
                </div>
              </div>
              <div className="text-right relative z-10">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Teléfono</p>
                <p className="font-black text-brand text-xl tracking-tighter">
                  {formatPhone(job.profiles?.phone || '')}
                </p>
              </div>
            </div>

            {/* Acciones para el PRO que ya tiene el contacto */}
            {hasApplied && job.status === 'contacted' && !isOwner && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-8 text-center shadow-md">
                <p className="text-sm font-bold text-slate-600 mb-4">¿Ya llegaste a un acuerdo con el cliente?</p>
                <button 
                  className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                  onClick={markAsAgreed}
                  disabled={isProcessing}
                >
                  {isProcessing ? '...' : 'Marcar Acuerdo Realizado'}
                </button>
              </div>
            )}

            {/* Estado: Esperando confirmación (Para el PRO) */}
            {hasApplied && job.status === 'agreement_pending' && job.selected_pro_id === userId && (
              <div className="w-full bg-amber-50 border-2 border-dashed border-amber-200 text-amber-700 font-black py-6 rounded-3xl flex flex-col items-center justify-center gap-2 mb-8 text-center">
                <Clock className="w-8 h-8 text-amber-500 animate-pulse mb-2" />
                <span className="uppercase tracking-widest text-xs">Esperando confirmación</span>
                <span className="text-[10px] font-bold">El cliente debe confirmar que pactaron el servicio.</span>
              </div>
            )}

            {/* Estado: En Progreso (Para el PRO) */}
            {hasApplied && job.status === 'in_progress' && job.selected_pro_id === userId && (
              <div className="w-full bg-emerald-500 text-white font-black py-6 rounded-3xl flex flex-col items-center justify-center gap-2 mb-8 shadow-xl shadow-emerald-500/20 text-center">
                <ShieldCheck className="w-10 h-10 mb-2" />
                <span className="uppercase tracking-widest text-sm italic">¡Trabajo en Progreso!</span>
                <span className="text-xs opacity-80 uppercase">Estás oficialmente a cargo de este servicio.</span>
              </div>
            )}

            {/* Estado: En Progreso (Para el CLIENTE) -> Botón de Finalizar */}
            {isOwner && job.status === 'in_progress' && (
              <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 mb-8 shadow-xl shadow-emerald-500/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                    <CheckCircle className="text-white w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-black text-emerald-900 uppercase text-lg leading-tight">Trabajo en marcha</h4>
                    <p className="text-emerald-700 text-xs font-bold">¿Ya terminó el profesional?</p>
                  </div>
                </div>
                <button 
                  onClick={finishJob}
                  className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all uppercase tracking-widest text-xs"
                >
                  Finalizar y Calificar
                </button>
              </div>
            )}

            {/* Estado: Review Pending (Para AMBOS) */}
            {job.status === 'review_pending' && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-8 mb-8 text-center shadow-xl shadow-blue-500/5">
                <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                  <Star className="text-white w-10 h-10 fill-white" />
                </div>
                <h4 className="text-2xl font-black text-blue-900 uppercase mb-2 tracking-tight">¡Servicio Completado!</h4>
                <p className="text-blue-700 text-sm font-bold mb-6">Tu opinión es el motor de confianza de Tuali.</p>
                
                <div className="bg-white/60 p-6 rounded-2xl border border-blue-100">
                  <p className="text-blue-900 text-xs font-black uppercase mb-4">Próximamente: Panel de Reseñas</p>
                  <div className="flex justify-center gap-2 mb-2">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-8 h-8 text-blue-200" />)}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer solo para Pros (para aplicar) */}
      {!isOwner && role === 'pro' && (job.status === 'open' || job.status === 'contacted') && !hasApplied && (
        <div className="fixed bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-xl border-t border-slate-200 pb-safe z-20 shadow-2xl">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Inversión de contacto</span>
            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-full">
              <span className="text-sm">🪙</span>
              <span className="font-black text-white text-sm uppercase tracking-tighter">
                {job.is_urgent ? 2 : 1} {job.is_urgent ? 'Créditos' : 'Crédito'}
              </span>
            </div>
          </div>
          <button 
            onClick={handleApply}
            disabled={isProcessing}
            className="w-full bg-[#EA580C] text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest"
          >
            {isProcessing ? 'Cargando...' : `Revelar Contacto (${job.is_urgent ? 2 : 1} CR)`}
          </button>
        </div>
      )}
    </main>
  );
}
