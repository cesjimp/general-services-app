import JobCard from '../components/ui/JobCard';

export default function FeedScreen() {
  return (
    <main className="max-w-md mx-auto px-6 pt-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-slate-900 text-2xl font-extrabold tracking-tight">Hola, Juan</h1>
          <p className="text-slate-500 text-sm">Explora nuevas oportunidades</p>
        </div>
        <div className="bg-white shadow-sm rounded-full px-4 py-2 flex items-center gap-2 border border-slate-200">
          <span className="text-lg">🪙</span>
          <span className="font-mono text-sm font-semibold text-brand">12 Créditos</span>
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
        <JobCard
          id="job-1"
          category="Plomería"
          timeAgo="Hace 10 min"
          title="Fuga de agua en lavabo principal"
          location="Barrio El Poblado"
          distance="A 2.5 km de ti"
          credits={1}
          urgent={true}
        />
        
        <JobCard
          id="job-2"
          category="Electricidad"
          timeAgo="Hace 45 min"
          title="Instalación de 4 lámparas de techo"
          location="Centro Histórico"
          distance="A 4.1 km de ti"
          credits={1}
        />

        <JobCard
          id="job-3"
          category="Pintura"
          timeAgo="Hace 2 horas"
          title="Pintar fachada de casa (2 pisos)"
          location="Barrio Laureles"
          distance="A 5.0 km de ti"
          credits={2}
        />
      </div>
    </main>
  );
}
