import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRoleStore } from '../store/useRoleStore';
import JobCard from '../components/ui/JobCard';
import { Briefcase, History, ClipboardCheck } from 'lucide-react';

export default function ProJobsScreen() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const { userId } = useRoleStore();

  useEffect(() => {
    fetchMyJobs();
  }, [activeTab]);

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      // Obtenemos los leads del profesional para saber en qué trabajos está involucrado
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select(`
          job_id,
          jobs (
            *,
            profiles:client_id (
              full_name
            )
          )
        `)
        .eq('pro_id', userId)
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;

      // Transformamos y filtramos según la pestaña
      const allJobs = leadsData
        ?.map(l => l.jobs)
        .filter(job => {
          if (!job) return false;
          
          // Si el trabajo ya tiene un pro seleccionado y NO soy yo, lo ocultamos 
          // (a menos que sea un prospecto revelado antes de la selección)
          if (job.selected_pro_id && job.selected_pro_id !== userId && job.status !== 'contacted') {
            return false;
          }

          if (activeTab === 'active') {
            // Activos: open, contacted, agreement_pending, in_progress, review_pending
            return ['open', 'contacted', 'agreement_pending', 'in_progress', 'review_pending'].includes(job.status);
          } else {
            // Historial: completed
            return job.status === 'completed';
          }
        }) || [];

      setJobs(allJobs);
    } catch (err) {
      console.error('Error fetching pro jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-6 pt-6 pb-32">
      {/* Header Seccion */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
          Mi Agenda
        </h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
          Gestiona tus proyectos y clientes
        </p>
      </div>

      {/* Selector de Pestañas */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex mb-8 border border-slate-200">
        <button 
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            activeTab === 'active' 
              ? 'bg-white text-brand shadow-sm border border-slate-200' 
              : 'text-slate-500 hover:bg-slate-200/50'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          En Marcha
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            activeTab === 'history' 
              ? 'bg-white text-brand shadow-sm border border-slate-200' 
              : 'text-slate-500 hover:bg-slate-200/50'
          }`}
        >
          <History className="w-4 h-4" />
          Historial
        </button>
      </div>

      {/* Lista de Trabajos */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">
            Actualizando tu agenda...
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl border border-slate-100">
              {activeTab === 'active' ? (
                <Briefcase className="w-10 h-10 text-slate-200" />
              ) : (
                <History className="w-10 h-10 text-slate-200" />
              )}
            </div>
            <p className="text-slate-900 font-black mb-2 text-xl italic uppercase tracking-tighter">
              {activeTab === 'active' ? 'Sin proyectos activos' : 'Historial vacío'}
            </p>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              {activeTab === 'active' 
                ? 'Ve al Home y busca nuevas oportunidades para empezar a ganar.' 
                : 'Tus trabajos finalizados aparecerán aquí para que veas tus reseñas.'}
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              category={job.category}
              timeAgo="Reciente"
              title={job.title}
              description={job.description}
              location={job.location}
              clientName={job.profiles?.full_name || 'Usuario'}
              credits={job.is_urgent ? 2 : 1}
              urgent={job.is_urgent}
              status={job.status}
              isMine={true}
            />
          ))
        )}
      </div>
    </main>
  );
}
