import { MapPin, Lock, User, Flame, CheckCircle, Phone, Clock, Star } from 'lucide-react';
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
  
  const getStatusInfo = () => {
    if (!isMine) return null;
    
    switch (status) {
      case 'open':
      case 'contacted':
        return { 
          label: 'Prospecto', 
          sub: 'Contacto revelado. ¡Busca cerrar el trato!', 
          color: 'bg-amber-500', 
          border: 'border-amber-100', 
          text: 'text-amber-900',
          bg: 'bg-amber-50',
          icon: <Phone className="w-5 h-5 text-white" />
        };
      case 'agreement_pending':
        return { 
          label: 'Pendiente de Confirmación', 
          sub: 'Esperando que el cliente valide el acuerdo.', 
          color: 'bg-orange-500', 
          border: 'border-orange-100', 
          text: 'text-orange-900',
          bg: 'bg-orange-50',
          icon: <Clock className="w-5 h-5 text-white animate-pulse" />
        };
      case 'in_progress':
        return { 
          label: 'Trabajo en Marcha', 
          sub: '¡Estás a cargo de este servicio!', 
          color: 'bg-emerald-600', 
          border: 'border-emerald-200', 
          text: 'text-emerald-900',
          bg: 'bg-emerald-50',
          icon: <CheckCircle className="w-5 h-5 text-white" />
        };
      case 'review_pending':
        return { 
          label: 'Esperando Reseña', 
          sub: 'El trabajo terminó. ¡Deja tu calificación!', 
          color: 'bg-blue-600', 
          border: 'border-blue-200', 
          text: 'text-blue-900',
          bg: 'bg-blue-50',
          icon: <Star className="w-5 h-5 text-white" />
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo();
  
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
          {statusInfo && (
            <span className={`${statusInfo.color} text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-white/20 whitespace-nowrap shadow-sm`}>
              {statusInfo.label}
            </span>
          )}
          {status === 'contacted' && !isMine && (
            <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-amber-100 whitespace-nowrap">
              En Contacto
            </span>
          )}
        </div>
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter whitespace-nowrap">{timeAgo}</span>
      </div>
      
      <h2 className="text-slate-900 text-xl font-black mb-2 leading-tight">
        {title}
      </h2>
      
      <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed font-medium">
        {description}
      </p>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-1.5 text-slate-500 font-bold">
          <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs">{cleanLocation(location)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 font-bold">
          <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs">Cliente: {isMine ? clientName : maskName(clientName)}</span>
        </div>
      </div>
      
      {/* Solo mostrar el bloque de "Datos Ocultos" si NO es mío */}
      {!isMine && (
        <div className={`${urgent ? 'bg-orange-50/50 border-orange-100' : 'bg-slate-50 border-slate-100'} rounded-2xl p-4 flex flex-col gap-2 mb-6 border`}>
          <div className="flex items-center gap-3">
            <Lock className={`w-4 h-4 ${urgent ? 'text-orange-500' : 'text-brand'}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {status === 'contacted' ? 'Ya hay profesionales interesados' : 'Datos de contacto ocultos'}
            </span>
          </div>
          <p className="text-[10px] leading-tight text-slate-400">
            {status === 'contacted' 
              ? 'Aún puedes tomar este contacto si te interesa competir por el trabajo.' 
              : 'Toma el trabajo para entrar en contacto con el cliente y coordinar la visita.'}
          </p>
        </div>
      )}

      {/* Si es mío, mostramos un indicador de éxito más premium */}
      {isMine && statusInfo && (
        <div className={`${statusInfo.bg} border ${statusInfo.border} rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-inner`}>
          <div className={`w-10 h-10 ${statusInfo.color} rounded-xl flex items-center justify-center shadow-lg`}>
            {statusInfo.icon}
          </div>
          <div>
            <p className={`text-xs font-black ${statusInfo.text} uppercase tracking-wide`}>
              {statusInfo.label}
            </p>
            <p className={`text-[10px] ${statusInfo.text} opacity-70 font-bold`}>
              {statusInfo.sub}
            </p>
          </div>
        </div>
      )}
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/job/${id}`);
        }}
        disabled={(status !== 'open' && status !== 'contacted') && !isMine}
        className={`w-full py-4 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest ${
          (status !== 'open' && status !== 'contacted') && !isMine
            ? 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed'
            : isMine
              ? `${statusInfo?.color || 'bg-emerald-600'} text-white shadow-xl`
              : 'bg-[#EA580C] text-white shadow-orange-500/20 hover:bg-[#c2410c]'
        }`}
      >
        {isMine 
          ? 'Gestionar Trabajito'
          : status === 'open' 
            ? `Tomar el trabajo (${credits} CR)`
            : status === 'contacted'
              ? `Tomar contacto (Competir)`
              : 'Trabajo no disponible'
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
        isMine ? `border-2 ${statusInfo?.border || 'border-emerald-200'} ring-4 ring-slate-50` : ''
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

