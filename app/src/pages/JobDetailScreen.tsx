import { ArrowLeft, MapPin, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function JobDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Datos simulados para la maqueta
  const job = {
    id,
    title: 'Reparación de tubería principal',
    category: 'Plomería',
    description: 'Tengo una fuga grande en el baño principal. El agua se está filtrando al piso de abajo. Necesito a alguien urgente que pueda sellar o cambiar la tubería hoy mismo.',
    location: 'Barrio El Poblado, a 2.5 km',
    timePosted: 'Hace 15 min',
    isUrgent: true,
    creditCost: 1,
    clientName: 'María G.'
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-32">
      {/* Navbar Superior (Específico para esta vista) */}
      <div className="bg-white sticky top-0 z-10 px-4 h-16 flex items-center border-b border-slate-200">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="ml-4 font-bold text-slate-900 text-lg">Detalle del Trabajito</h1>
      </div>

      <div className="p-6">
        {/* Cabecera del trabajo */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {job.category}
            </span>
            {job.isUrgent && (
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Urgente
              </span>
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 leading-tight mb-4">
            {job.title}
          </h2>
          
          <div className="flex flex-col gap-3 text-slate-500 text-sm font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand" />
              <span>Publicado {job.timePosted}</span>
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

        {/* Información del Cliente (Oculta) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-slate-500 font-bold text-lg">{job.clientName.charAt(0)}</span>
            </div>
            <div>
              <p className="font-bold text-slate-900">{job.clientName}</p>
              <div className="flex items-center gap-1 text-xs font-bold text-[#10B981] mt-0.5">
                <ShieldCheck className="w-3 h-3" />
                <span>Cliente Verificado</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium mb-1">Teléfono</p>
            <p className="font-mono font-bold text-slate-300 tracking-widest">*** *** ****</p>
          </div>
        </div>
      </div>

      {/* Floating Action Button (Call to Action) */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-white border-t border-slate-200 pb-safe z-20">
        <div className="flex justify-between items-center mb-4">
          <span className="text-slate-600 font-medium">Costo de contacto:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🪙</span>
            <span className="font-mono font-bold text-slate-900 text-lg">{job.creditCost} Crédito</span>
          </div>
        </div>
        <button className="w-full bg-brand text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          Desbloquear Contacto
        </button>
      </div>
    </main>
  );
}
