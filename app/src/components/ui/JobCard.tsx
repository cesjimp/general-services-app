import { MapPin, Ruler, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCategoryIcon } from '../../utils/categoryIcons';

interface JobCardProps {
  id: string;
  category: string;
  timeAgo: string;
  title: string;
  location: string;
  distance: string;
  credits: number;
  urgent?: boolean;
}

export default function JobCard({ 
  id, category, timeAgo, title, location, distance, credits, urgent = false 
}: JobCardProps) {
  const navigate = useNavigate();
  
  if (urgent) {
    return (
      <div 
        onClick={() => navigate(`/job/${id}`)}
        className="relative overflow-hidden bg-[#1E3A8A] rounded-xl p-6 shadow-xl border border-blue-900/20 group cursor-pointer active:scale-[0.98] transition-all"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <div className="w-24 h-24 text-white">
            {getCategoryIcon(category)}
          </div>
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 text-[#EA580C]">
                {getCategoryIcon(category)}
              </div>
              <span className="bg-[#EA580C] text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                {category}
              </span>
            </div>
            <span className="text-blue-100 text-xs font-medium opacity-80">{timeAgo}</span>
          </div>
          <h2 className="text-white text-xl font-bold mb-3 leading-tight">{title}</h2>
          
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-blue-100">
              <MapPin className="w-[18px] h-[18px]" />
              <span className="text-sm font-medium">{location}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <Ruler className="w-[18px] h-[18px]" />
              <span className="font-mono text-xs font-semibold">{distance}</span>
            </div>
          </div>
          
          <button className="w-full bg-white text-[#1E3A8A] hover:bg-gray-50 py-4 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all">
            Ver detalles premium
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_12px_24px_rgba(0,0,0,0.04)] border border-slate-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 text-brand">
            {getCategoryIcon(category)}
          </div>
          <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
            {category}
          </span>
        </div>
        <span className="text-slate-500 text-xs font-medium">{timeAgo}</span>
      </div>
      
      <h2 className="text-slate-900 text-xl font-bold mb-3 leading-tight">{title}</h2>
      
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-slate-500">
          <MapPin className="w-[18px] h-[18px]" />
          <span className="text-sm font-medium">{location}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Ruler className="w-[18px] h-[18px]" />
          <span className="font-mono text-xs font-semibold">{distance}</span>
        </div>
      </div>
      
      <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-3 mb-6">
        <Lock className="w-5 h-5 text-brand" />
        <span className="text-xs text-slate-500 font-medium">Datos de contacto ocultos</span>
      </div>
      
      <button className="w-full bg-[#EA580C] hover:bg-[#c2410c] text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
        Tomar el trabajo ({credits} Créditos)
      </button>
    </div>
  );
}
