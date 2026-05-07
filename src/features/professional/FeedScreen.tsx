import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from '../../components/ui/JobCard';
import { Briefcase } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useRoleStore } from '../../store/useRoleStore';

export default function FeedScreen() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userId, profile } = useRoleStore();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // 1. Obtener las categorías del profesional
      const { data: proMeta } = await supabase
        .from('professionals_metadata')
        .select('categories')
        .eq('id', userId)
        .single();

      const proCategories = proMeta?.categories || [];

      // 2. Obtener IDs de trabajos que YO ya tomé
      const { data: myLeads } = await supabase
        .from('leads')
        .select('job_id')
        .eq('pro_id', userId);
      
      const myTakenIds = myLeads?.map(l => l.job_id) || [];

      // 3. Obtener trabajos que ya tienen 3 o más leads
      const { data: leadCounts } = await supabase
        .from('leads')
        .select('job_id');
      
      const counts: Record<string, number> = {};
      leadCounts?.forEach(l => {
        counts[l.job_id] = (counts[l.job_id] || 0) + 1;
      });
      
      const fullJobIds = Object.keys(counts).filter(id => counts[id] >= 3);

      // 4. Consulta de disponibles
      let query = supabase
        .from('jobs')
        .select(`
          *,
          profiles:client_id (
            full_name
          )
        `)
        .in('status', ['open', 'contacted'])
        .neq('client_id', userId)
        .order('created_at', { ascending: false });

      // Solo excluir si hay IDs para excluir
      if (myTakenIds && myTakenIds.length > 0) {
        query = query.not('id', 'in', `(${myTakenIds.join(',')})`);
      }

      if (fullJobIds && fullJobIds.length > 0) {
        query = query.not('id', 'in', `(${fullJobIds.join(',')})`);
      }

      // Filtrar por categorías solo si el pro tiene categorías asignadas
      if (proCategories && proCategories.length > 0) {
        query = query.in('category', proCategories);
      }

      const { data, error } = await query;
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
      {/* Título de Sección */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
          Oportunidades
        </h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
          Trabajos disponibles en tu área
        </p>
      </div>

      {/* Lista de Trabajos (Feed) */}
      <div className="space-y-4 pb-32">
        {loading ? (
          <div className="text-center py-10 text-slate-400 font-bold uppercase text-xs tracking-widest">Buscando trabajitos...</div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 border border-slate-200 shadow-inner">
              <Briefcase className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-black mb-1 text-lg">
              No hay trabajos disponibles
            </p>
            <p className="text-slate-400 text-sm max-w-[240px] font-medium">
              Vuelve más tarde o revisa tus categorías en el perfil.
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
              isMine={false}
            />
          ))
        )}
      </div>
    </main>
  );
}
