import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useRoleStore } from '../store/useRoleStore';
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
  History
} from 'lucide-react';
import { getCategoryIcon } from '../utils/categoryIcons';

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
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');

  useEffect(() => {
    if (userId) {
      fetchJobs();
    }
  }, [userId]);

  async function fetchJobs() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles:selected_pro_id (
            full_name
          )
        `)
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/home')} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Mis Solicitudes</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'open', 'closed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                filter === f 
                  ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                  : 'bg-white text-slate-500 border border-slate-100 hover:border-brand/20'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'open' ? 'Abiertos' : 'Cerrados'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm mt-4 font-medium">Cargando tu historial...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-200">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold mb-1">No hay trabajos aquí</h3>
            <p className="text-slate-500 text-sm mb-6">Aún no has solicitado servicios de este tipo.</p>
            <button 
              onClick={() => navigate('/create-job')}
              className="bg-brand text-white px-6 py-3 rounded-xl font-bold text-sm"
            >
              Solicitar primer servicio
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div 
                key={job.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${job.status === 'open' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest ${job.status === 'open' ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {job.status === 'open' ? 'Buscando Pro' : 'Servicio Finalizado'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-brand/10 text-brand flex items-center justify-center p-2">
                    {getCategoryIcon(job.category)}
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-brand transition-colors leading-none">{job.title}</h3>
                </div>
                <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1.5">
                    <div className="bg-slate-100 p-1.5 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">{job.location}</span>
                  </div>
                  
                  {job.profiles?.full_name ? (
                    <div className="flex items-center gap-1.5 ml-auto">
                      <div className="bg-brand/10 p-1.5 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-900">Pro: {job.profiles.full_name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 ml-auto text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold">Pendiente</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
