import { MapPin, Lock, User, Flame, CheckCircle, Phone } from 'lucide-react';
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
  status?: string;
  isMine?: boolean;
}

export default function JobCard({ 
  id, category, timeAgo, title, description, location, clientName, credits, urgent = false, status = 'open', isMine = false 
}: JobCardProps) {
  const navigate = useNavigate();

  // Función para limpiar la ubicación y dejar SOLO el municipio/ciudad
  const cleanLocation = (loc: string) => {
    if (!loc) return '';
    return loc.split(' - ')[0].trim();
  };

  // Función para enmascarar el nombre
  const maskName = (name: string) => {
    if (!name) return '***';
    const parts = name.split(' ');
    const firstPart = parts[0];
    if (firstPart.length <= 2) return '***';
    return '***' + firstPart.slice(-2);
  };
  
  const CardContent = () => (
    <>
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className={`w-5 h-5 ${urgent ? 'text-orange-500' : 'text-brand'}`}>
            {getCategoryIcon(category)}
          </div>
          <span className={`${urgent ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-brand/10 text-brand'} px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap`}>
            {category}
          </span>
          {urgent && (
            <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 animate-pulse border border-red-100 whitespace-nowrap">
              <Flame className="w-3 h-3 fill-red-600" />
              Urgente
            </span>
          )}
          {isMine && (
            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 border border-emerald-600 whitespace-nowrap shadow-sm">
              <CheckCircle className="w-3 h-3" />
              Tu contacto
            </span>
          )}
        </div>
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter whitespace-nowrap">{timeAgo}</span>
      </div>
      
      <h2 className="text-slate-900 text-xl font-black mb-2 leading-tight">
        {title}
      </h2>
      
      <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-1.5 text-slate-500">
          <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold">{cleanLocation(location)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold">Cliente: {maskName(clientName)}</span>
        </div>
      </div>
      
      {/* Solo mostrar el bloque de "Datos Ocultos" si NO es mío */}
      {!isMine && (
        <div className={`${urgent ? 'bg-orange-50/50 border-orange-100' : 'bg-slate-50 border-slate-100'} rounded-2xl p-4 flex flex-col gap-2 mb-6 border`}>
          <div className="flex items-center gap-3">
            <Lock className={`w-4 h-4 ${urgent ? 'text-orange-500' : 'text-brand'}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Datos de contacto ocultos</span>
          </div>
          <p className="text-[10px] leading-tight text-slate-400">
            Toma el trabajo para entrar en contacto con el cliente y coordinar la visita.
          </p>
        </div>
      )}

      {/* Si es mío, mostramos un indicador de éxito más premium */}
      {isMine && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Phone className="text-white w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-black text-emerald-900 uppercase tracking-wide">¡Contacto Revelado!</p>
            <p className="text-[10px] text-emerald-600 font-bold">Ya puedes ver el teléfono en detalles.</p>
          </div>
        </div>
      )}
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/job/${id}`);
        }}
        disabled={status !== 'open' && !isMine}
        className={`w-full py-4 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
          status !== 'open' && !isMine
            ? 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed'
            : isMine
              ? 'bg-emerald-600 text-white shadow-emerald-500/20 hover:bg-emerald-700'
              : 'bg-[#EA580C] text-white shadow-orange-500/20 hover:bg-[#c2410c]'
        }`}
      >
        {isMine 
          ? 'Ver contacto / Detalles'
          : status === 'open' 
            ? `Tomar el trabajo (${credits} ${credits === 1 ? 'Crédito' : 'Créditos'})`
            : 'Ya tiene un profesional en contacto'
        }
      </button>
    </>
  );

  return (
    <div 
      onClick={() => navigate(`/job/${id}`)}
      className={`relative overflow-hidden rounded-3xl p-6 shadow-xl border cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white ${
        status !== 'open' && !isMine ? 'opacity-60 grayscale-[0.3]' : ''
      } ${
        isMine ? 'border-emerald-200 shadow-emerald-500/5 ring-4 ring-emerald-50' : ''
      } ${
        urgent 
          ? 'border-orange-400 shadow-orange-500/10 ring-4 ring-orange-50' 
          : 'border-slate-100'
      }`}
    >
      <CardContent />
    </div>
  );
}

