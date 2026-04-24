import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from '../components/ui/JobCard';
import { Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useRoleStore } from '../store/useRoleStore';

export default function FeedScreen() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'my_jobs'>('available');
  const navigate = useNavigate();
  const { userId, profile } = useRoleStore();

  useEffect(() => {
    fetchJobs();
  }, [activeTab]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      if (activeTab === 'available') {
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
      } else {
        // Pestaña "Mis Trabajos"
        const { data, error } = await supabase
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

        if (error) throw error;

        // Filtrar: Solo mostrar si no hay pro seleccionado O si el pro seleccionado soy YO
        const filteredJobs = data
          ?.map(l => l.jobs)
          .filter(job => {
            if (!job) return false;
            // Si el trabajo ya tiene un pro seleccionado y NO soy yo, lo ocultamos
            if (job.selected_pro_id && job.selected_pro_id !== userId) {
              return false;
            }
            return true;
          }) || [];

        setJobs(filteredJobs);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-6 pt-6">
      {/* Título de Sección */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Nuevas Oportunidades
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Trabajos disponibles en tu área
        </p>
      </div>

      {/* Segmented Control Tabs */}
      <div className="bg-slate-200/50 p-1.5 rounded-2xl flex mb-8">
        <button 
          onClick={() => setActiveTab('available')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'available' 
              ? 'bg-brand text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-200'
          }`}
        >
          Disponibles
        </button>
        <button 
          onClick={() => setActiveTab('my_jobs')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'my_jobs' 
              ? 'bg-brand text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-200'
          }`}
        >
          Mis Trabajos
        </button>
      </div>

      {/* Lista de Trabajos (Feed) */}
      <div className="space-y-4 pb-32">
        {loading ? (
          <div className="text-center py-10 text-slate-400">Cargando trabajos...</div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-bold mb-1">
              {activeTab === 'available' 
                ? 'No hay trabajos disponibles' 
                : 'Aún no has tomado ningún trabajo'}
            </p>
            <p className="text-slate-400 text-sm max-w-[200px]">
              {activeTab === 'available' 
                ? `No encontramos ofertas en: ${(profile?.categories?.join(', ')) || 'Sin categorías'}`
                : 'Tus contactos revelados aparecerán aquí.'}
            </p>
            {!userId && <p className="text-rose-500 text-[10px] mt-4 font-bold uppercase">Sesión no detectada en Store</p>}
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
              isMine={activeTab === 'my_jobs'}
            />
          ))
        )}
      </div>
    </main>
  );
}
