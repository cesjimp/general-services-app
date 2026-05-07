import { useState, useEffect } from 'react';
import { ArrowLeft, PenTool, Wrench, Zap, Paintbrush, ShieldCheck, Star, Sparkles, Loader2, Plus, CheckCircle2, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ClientHomeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [aiState, setAiState] = useState<'idle' | 'analyzing' | 'result'>('idle');
  const [aiResult, setAiResult] = useState<{ category: string, message: string, title?: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success')) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        navigate('/home', { replace: true });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  const categories = [
    { icon: <Zap className="w-5 h-5" />, name: 'Electricidad' },
    { icon: <Wrench className="w-5 h-5" />, name: 'Plomería' },
    { icon: <Paintbrush className="w-5 h-5" />, name: 'Pintura' },
    { icon: <PenTool className="w-5 h-5" />, name: 'Carpintería' },
  ];

  const handleCategoryClick = (catName: string) => {
    setAiResult({ 
      category: catName, 
      message: `Has seleccionado la categoría ${catName}. Puedes publicar tu solicitud ahora para recibir propuestas de expertos calificados.`,
      title: `Servicio de ${catName}`
    });
    setAiState('result');
  };

  const handleMagicSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setAiState('analyzing');
    
    // Simulamos el retraso de una API de IA
    setTimeout(() => {
      const query = searchQuery.toLowerCase();
      let category = 'General';
      let message = 'Entendemos lo que necesitas. Te mostraremos a los mejores profesionales para tu solicitud.';
      let suggestedTitle = 'Mantenimiento General';

      if (query.includes('agua') || query.includes('tubo') || query.includes('fuga') || query.includes('lavamanos') || query.includes('gotera') || query.includes('cisterna')) {
        category = 'Plomería';
        message = 'Entiendo, tienes un problema de plomería o filtración. Para esto, el profesional más apropiado es un Plomero certificado.';
        suggestedTitle = query.includes('fuga') ? 'Reparar fuga agua' : 'Servicio de plomería';
      } else if (query.includes('luz') || query.includes('cable') || query.includes('enchufe') || query.includes('corto') || query.includes('apagón')) {
        category = 'Electricidad';
        message = 'Veo que tienes un problema eléctrico. La persona idónea para este trabajo de forma segura es un Electricista.';
        suggestedTitle = 'Reparación falla eléctrica';
      } else if (query.includes('pintar') || query.includes('pared') || query.includes('color') || query.includes('humedad')) {
        category = 'Pintura';
        message = '¡Claro! Quieres darle nueva vida a tu espacio. El experto ideal para este trabajo es un Pintor.';
        suggestedTitle = 'Pintar paredes interiores';
      } else if (query.includes('closet') || query.includes('mueble') || query.includes('madera') || query.includes('mesa') || query.includes('silla')) {
        category = 'Carpintería';
        message = 'Veo que buscas un trabajo en madera. El experto ideal para diseñar o arreglar tu mueble es un Carpintero.';
        suggestedTitle = 'Reparación muebles madera';
      }

      setAiResult({ category, message, title: suggestedTitle });
      setAiState('result');
    }, 1500);
  };

  const resetSearch = () => {
    setSearchQuery('');
    setAiState('idle');
    setAiResult(null);
  };

  const reviews = [
    { id: '1', type: 'client', rating: 5, text: "Excelente atención, el técnico resolvió el problema de inmediato." },
    { id: '2', type: 'pro', rating: 5, text: "Cliente puntual y muy claro con las especificaciones del trabajo." },
    { id: '3', type: 'client', rating: 4, text: "Muy profesional, usaron materiales de alta calidad." },
    { id: '4', type: 'pro', rating: 5, text: "Excelente comunicación y pago rápido a través de la plataforma." },
    { id: '5', type: 'client', rating: 5, text: "La IA me ayudó a encontrar al experto exacto que necesitaba." },
  ];

  return (
    <>
      <main className="max-w-md mx-auto px-6 pt-6 pb-32">
        {/* Saludo */}
        <div className="mb-6">
          <h1 className="text-slate-900 text-3xl font-extrabold tracking-tight leading-tight">
            ¿Qué <span className="text-brand">trabajito</span> <br/> necesitas hoy?
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Describe tu problema y nuestra IA encontrará al experto.</p>
        </div>

        {/* Notificación de éxito */}
        {showSuccess && (
          <div className="mb-6 animate-in zoom-in-95 fade-in duration-300">
            <div className="bg-[#10B981] text-white p-4 rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-200">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-sm">¡Publicado con éxito!</p>
                <p className="text-xs opacity-90">Los expertos han sido notificados.</p>
              </div>
            </div>
          </div>
        )}

        {/* Buscador de IA */}
        <form onSubmit={handleMagicSearch} className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Sparkles className="h-5 w-5 text-brand" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-24 py-4 bg-white border-none rounded-2xl shadow-[0_8px_16px_rgba(0,0,0,0.03)] text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand transition-all font-medium outline-none"
            placeholder="Ej. Mi lavamanos bota agua por debajo..."
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            {aiState === 'analyzing' ? (
              <div className="bg-brand/10 p-2 rounded-xl">
                <Loader2 className="h-5 w-5 text-brand animate-spin" />
              </div>
            ) : (
              <button 
                type="submit"
                disabled={!searchQuery.trim()}
                className="bg-brand text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md disabled:opacity-50 active:scale-95 transition-all"
              >
                Buscar
              </button>
            )}
          </div>
        </form>

        {/* Estado de Análisis IA */}
        {aiState === 'analyzing' && (
          <div className="bg-brand/5 border border-brand/10 rounded-2xl p-6 mb-8 text-center animate-pulse">
            <Sparkles className="w-8 h-8 text-brand mx-auto mb-3 animate-bounce" />
            <p className="text-brand font-bold text-sm">Tuali AI está analizando tu solicitud...</p>
            <p className="text-slate-500 text-xs mt-1">Buscando la categoría perfecta</p>
          </div>
        )}

        {/* Resultado de IA / Categoría Seleccionada */}
        {aiState === 'result' && aiResult && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-br from-brand to-brand/80 rounded-2xl p-6 shadow-xl shadow-brand/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Sparkles className="w-24 h-24 text-white" />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-[0.2em] px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                    {searchQuery ? 'Análisis Tuali AI' : 'Selección Directa'}
                  </span>
                  <button 
                    onClick={resetSearch} 
                    className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all border border-white/10 active:scale-90"
                    title="Cambiar categoría"
                  >
                    <ArrowLeft className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-white text-sm font-medium leading-relaxed mb-4">
                  "{aiResult.message}"
                </p>
                <div className="bg-white rounded-xl p-3 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand/10 p-2 rounded-lg">
                      <ShieldCheck className="w-5 h-5 text-brand" />
                    </div>
                    <span className="font-bold text-slate-900">{aiResult.category}</span>
                  </div>
                  <span className="text-xs font-bold text-brand bg-brand/10 px-2 py-1 rounded-md">
                    Disponibles
                  </span>
                </div>
                <button 
                  onClick={() => navigate(`/create-job?category=${aiResult.category}&title=${aiResult.title || ''}`)}
                  className="w-full bg-white text-brand font-bold py-3 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Publicar este trabajito
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vista Default (Si no hay búsqueda IA activa) */}
        {aiState === 'idle' && (
          <div className="animate-in fade-in duration-300">
            {/* Categorías */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-slate-900 font-bold text-lg">Categorías</h3>
                <button className="text-[#EA580C] text-sm font-bold">Ver todas</button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {categories.map((cat, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleCategoryClick(cat.name)}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-slate-600 shadow-sm border border-slate-100 group-hover:border-[#EA580C] group-hover:text-[#EA580C] transition-all">
                      {cat.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Banner Promocional */}
            <div className="bg-brand rounded-2xl p-6 mb-10 relative overflow-hidden shadow-xl shadow-brand/20">
              <div className="absolute -right-4 -top-4 opacity-10">
                <ShieldCheck className="w-32 h-32 text-white" />
              </div>
              <div className="relative z-10">
                <span className="bg-[#10B981] text-white text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-md mb-3 inline-block">
                  Garantizado
                </span>
                <h2 className="text-white text-lg font-bold mb-2">Tu primer arreglito asegurado</h2>
                <p className="text-brand-light text-sm mb-4 opacity-90">Validamos a todos nuestros profesionales.</p>
                <button className="bg-white text-brand text-sm font-bold py-2 px-5 rounded-xl shadow-sm active:scale-95 transition-all">
                  Ver garantías
                </button>
              </div>
            </div>

            {/* Comunidad Tuali (Reviews Carousel) */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-slate-900 font-bold text-lg">Comunidad Tuali</h3>
                <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                <span className="text-slate-500 text-xs font-semibold">Transparencia real</span>
              </div>
              
              <div className="relative overflow-hidden -mx-6">
                <div className="animate-scroll flex gap-4 px-6">
                  {/* Duplicamos la lista para el efecto de scroll infinito */}
                  {[...reviews, ...reviews].map((review, idx) => (
                    <div 
                      key={`${review.id}-${idx}`}
                      className={`w-64 shrink-0 p-4 rounded-2xl border ${
                        review.type === 'client' 
                          ? 'bg-blue-50 border-blue-100' 
                          : 'bg-orange-50 border-orange-100'
                      } flex flex-col justify-between h-36`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            review.type === 'client' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {review.type === 'client' ? 'Cliente' : 'Profesional'}
                          </span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-700 text-xs italic font-medium leading-relaxed line-clamp-3">
                          "{review.text}"
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          review.type === 'client' ? 'bg-blue-200' : 'bg-orange-200'
                        }`}>
                          <User className={`w-3.5 h-3.5 ${review.type === 'client' ? 'text-blue-700' : 'text-orange-700'}`} />
                        </div>
                        <span className="text-slate-500 text-[10px] font-bold italic">Usuario Anónimo</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Floating Action Button (FAB) para crear trabajo */}
      <div className="fixed bottom-24 right-6 z-30">
        <button 
          onClick={() => navigate('/create-job')}
          className="bg-[#EA580C] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all hover:scale-110"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>
    </>
  );
}
