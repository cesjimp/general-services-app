import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useRoleStore } from '../../store/useRoleStore';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  User, 
  ChevronRight, 
  MapPin,
  ArrowLeft,
  Briefcase,
  History,
  Star
} from 'lucide-react';
import { getCategoryIcon } from '../../utils/categoryIcons';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: 'open' | 'closed';
  created_at: string;
  selected_pro_id: string | null;
  profiles?: {
    full_name: string;
  } | null;
}

export default function ClientJobsScreen() {
  const navigate = useNavigate();
  const { userId } = useRoleStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'active' | 'history'>('active');

  useEffect(() => {
    if (userId) {
      fetchJobs();
    }
  }, [userId, filter]);

  async function fetchJobs() {
    setLoading(true);
    try {
      let query = supabase
        .from('jobs')
        .select(`
          *,
          profiles:selected_pro_id (
            full_name
          )
        `)
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (filter === 'active') {
        query = query.in('status', ['open', 'contacted', 'agreement_pending', 'in_progress', 'review_pending']);
      } else {
        query = query.in('status', ['completed', 'cancelled']);
      }

      const { data, error } = await query;
      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open':
        return { label: 'Buscando Pro', color: 'text-emerald-600 bg-emerald-50', dot: 'bg-emerald-500 animate-pulse' };
      case 'contacted':
        return { label: 'En Contacto', color: 'text-amber-600 bg-amber-50', dot: 'bg-amber-500' };
      case 'agreement_pending':
        return { label: 'Confirmar Acuerdo', color: 'text-orange-600 bg-orange-50 border border-orange-200', dot: 'bg-orange-500 animate-ping' };
      case 'in_progress':
        return { label: 'En Proceso', color: 'text-blue-600 bg-blue-50', dot: 'bg-blue-500' };
      case 'review_pending':
        return { label: 'Calificar Servicio', color: 'text-indigo-600 bg-indigo-50 border border-indigo-200', dot: 'bg-indigo-500 animate-pulse' };
      case 'completed':
        return { label: 'Completado', color: 'text-slate-600 bg-slate-100', dot: 'bg-slate-400' };
      case 'cancelled':
        return { label: 'Cancelado', color: 'text-rose-600 bg-rose-50', dot: 'bg-rose-500' };
      default:
        return { label: status, color: 'text-slate-600 bg-slate-100', dot: 'bg-slate-400' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/app/home')} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Mis Solicitudes</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6">
        {/* Tab Selector */}
        <div className="bg-slate-200/50 p-1.5 rounded-2xl flex mb-8">
          <button 
            onClick={() => setFilter('active')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              filter === 'active' 
                ? 'bg-brand text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Activas
          </button>
          <button 
            onClick={() => setFilter('history')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              filter === 'history' 
                ? 'bg-brand text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            Historial
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm mt-4 font-bold uppercase tracking-widest">Sincronizando...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-200 shadow-sm">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold mb-1">No hay {filter === 'active' ? 'trabajos activos' : 'historial'}</h3>
            <p className="text-slate-500 text-sm mb-6">
              {filter === 'active' ? 'Cuando publiques una solicitud aparecerá aquí.' : 'Tus trabajos finalizados se guardan aquí.'}
            </p>
            {filter === 'active' && (
              <button 
                onClick={() => navigate('/app/create-job')}
                className="bg-brand text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-brand/20 active:scale-95 transition-all"
              >
                Publicar un trabajito
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const config = getStatusConfig(job.status);
              return (
                <div 
                  key={job.id}
                  onClick={() => navigate(`/app/job/${job.id}`)}
                  className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer active:scale-[0.99] relative overflow-hidden"
                >
                  {/* Status Indicator */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {config.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center p-3 group-hover:bg-brand/10 group-hover:text-brand transition-all">
                      {getCategoryIcon(job.category)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 group-hover:text-brand transition-colors text-lg leading-tight mb-1">
                        {job.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mb-2 font-medium leading-relaxed">
                        {job.description}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{job.location}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand transition-all" />
                  </div>

                  {/* Professional Info / Action Call */}
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    {job.status === 'review_pending' ? (
                      <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 w-full p-2 rounded-xl border border-indigo-100">
                        <Star className="w-4 h-4 fill-indigo-600" />
                        <span className="text-[10px] font-black uppercase tracking-tight">¡Califica el servicio para finalizar!</span>
                      </div>
                    ) : job.status === 'agreement_pending' ? (
                      <div className="flex items-center gap-2 text-orange-600 bg-orange-50 w-full p-2 rounded-xl border border-orange-100">
                        <User className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-tight">¡Confirma el acuerdo con el experto!</span>
                      </div>
                    ) : job.profiles?.full_name ? (
                      <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                        <div className="w-5 h-5 rounded-lg bg-brand/10 flex items-center justify-center">
                          <User className="w-3 h-3 text-brand" />
                        </div>
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">
                          {job.status === 'completed' ? 'Atendido por' : 'Experto asignado'}: {job.profiles.full_name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-tight">Esperando expertos interesados...</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
