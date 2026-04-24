import { useState, useEffect } from 'react';
import JobCard from '../components/ui/JobCard';
import { supabase } from '../lib/supabaseClient';
import { useRoleStore } from '../store/useRoleStore';

export default function FeedScreen() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId, profile } = useRoleStore();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles:client_id (
            full_name
          )
        `)
        .eq('status', 'open')
        .neq('client_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-6 pt-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-slate-900 text-2xl font-extrabold tracking-tight">Hola, {profile?.fullName?.split(' ')[0] || 'Profesional'}</h1>
          <p className="text-slate-500 text-sm">Explora nuevas oportunidades</p>
        </div>
        <div className="bg-brand/5 rounded-full px-4 py-2 flex items-center gap-2 border border-brand/10">
          <span className="text-lg">🪙</span>
          <span className="font-bold text-brand">{profile?.credits || 0} Créditos</span>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="bg-slate-200/50 p-1.5 rounded-2xl flex mb-8">
        <button className="flex-1 bg-brand text-white py-2.5 rounded-xl text-sm font-bold shadow-md transition-all">
          Disponibles
        </button>
        <button className="flex-1 text-slate-500 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all">
          Mis Trabajos
        </button>
      </div>

      {/* Lista de Trabajos (Feed) */}
      <div className="space-y-4 pb-32">
        {loading ? (
          <div className="text-center py-10 text-slate-400">Cargando trabajos...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-10 text-slate-400">No hay trabajos disponibles.</div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              category={job.category}
              timeAgo="Reciente"
              title={job.description.split('\n')[0].substring(0, 40)}
              description={job.description}
              location={job.location}
              clientName={job.profiles?.full_name || 'Usuario'}
              credits={1}
              urgent={job.description.includes('¡Es Urgente!')}
            />
          ))
        )}
      </div>
    </main>
  );
}
