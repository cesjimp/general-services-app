import { MapPin, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCategoryIcon } from '../../utils/categoryIcons';

interface JobCardProps {
  id: string;
  category: string;
  timeAgo: string;
  title: string;
  description: string;
  location: string;
  clientName: string;
  credits: number;
  urgent?: boolean;
}

export default function JobCard({ 
  id, category, timeAgo, title, description, location, clientName, credits, urgent = false 
}: JobCardProps) {
  const navigate = useNavigate();

  // Función para limpiar la ubicación y dejar SOLO el municipio/ciudad
  const cleanLocation = (loc: string) => {
    if (!loc) return '';
    // Formato esperado: "Girardot - Calle 10 (Persona: Cesar Jimenez)"
    // Tomamos solo lo que está antes del primer guion
    return loc.split(' - ')[0].trim();
  };

  // Función para enmascarar el nombre (ej: Cesar -> ***ar)
  const maskName = (name: string) => {
    if (!name) return '***';
    const parts = name.split(' ');
    const firstPart = parts[0];
    if (firstPart.length <= 2) return '***';
    return '***' + firstPart.slice(-2);
  };
  
  const CardContent = () => (
    <>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 ${urgent ? 'text-orange-400' : 'text-brand'}`}>
            {getCategoryIcon(category)}
          </div>
          <span className={`${urgent ? 'bg-orange-500/20 text-orange-200' : 'bg-brand/10 text-brand'} px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest`}>
            {category}
          </span>
        </div>
        <span className={`${urgent ? 'text-blue-100/60' : 'text-slate-500'} text-xs font-medium`}>{timeAgo}</span>
      </div>
      
      <h2 className={`${urgent ? 'text-white' : 'text-slate-900'} text-xl font-black mb-2 leading-tight`}>{title}</h2>
      
      <p className={`${urgent ? 'text-blue-50/70' : 'text-slate-600'} text-sm mb-4 line-clamp-2`}>
        {description}
      </p>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className={`flex items-center gap-1.5 ${urgent ? 'text-blue-100' : 'text-slate-500'}`}>
          <MapPin className="w-4 h-4" />
          <span className="text-xs font-bold">{cleanLocation(location)}</span>
        </div>
        <div className={`flex items-center gap-1.5 ${urgent ? 'text-blue-100' : 'text-slate-500'}`}>
          <User className="w-4 h-4" />
          <span className="text-xs font-bold">Cliente: {maskName(clientName)}</span>
        </div>
      </div>
      
      <div className={`${urgent ? 'bg-white/10' : 'bg-slate-50'} rounded-2xl p-4 flex flex-col gap-2 mb-6 border ${urgent ? 'border-white/10' : 'border-slate-100'}`}>
        <div className="flex items-center gap-3">
          <Lock className={`w-4 h-4 ${urgent ? 'text-orange-400' : 'text-brand'}`} />
          <span className={`text-xs font-bold uppercase tracking-wider ${urgent ? 'text-white' : 'text-slate-700'}`}>Datos de contacto ocultos</span>
        </div>
        <p className={`text-[10px] leading-tight ${urgent ? 'text-blue-100/60' : 'text-slate-400'}`}>
          Toma el trabajo para entrar en contacto con el cliente y coordinar la visita.
        </p>
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/job/${id}`);
        }}
        className={`w-full py-4 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-95 ${
          urgent 
            ? 'bg-white text-blue-900 shadow-white/10' 
            : 'bg-[#EA580C] text-white shadow-orange-500/20 hover:bg-[#c2410c]'
        }`}
      >
        Tomar el trabajo ({credits} {credits === 1 ? 'Crédito' : 'Créditos'})
      </button>
    </>
  );

  return (
    <div 
      onClick={() => navigate(`/job/${id}`)}
      className={`relative overflow-hidden rounded-3xl p-6 shadow-xl border cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
        urgent 
          ? 'bg-gradient-to-br from-blue-900 to-blue-950 border-blue-800' 
          : 'bg-white border-slate-100'
      }`}
    >
      <CardContent />
    </div>
  );
}

