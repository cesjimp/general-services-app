import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  ArrowRight, 
  Timer, 
  BadgeCheck, 
  Star, 
  ShieldCheck, 
  CalendarClock, 
  Building2, 
  ReceiptText, 
  Wrench, 
  Wind, 
  Hammer, 
  Sparkles, 
  Quote, 
  ArrowLeft,
  ChevronDown,
  MapPin,
  MessageSquare,
  UsersRound,
  CheckCheck,
  Droplet,
  KeyRound,
  PaintRoller,
  Bug,
  Calendar,
  Check,
  X,
  Coins
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Counters Animation Logic
    function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
    
    function animateCounter(el: HTMLElement) {
      const target = parseFloat(el.dataset.counter || "0");
      const decimals = parseInt(el.dataset.decimal || "0", 10);
      const suffix = el.dataset.suffix || "";
      const prefix = el.dataset.prefix || "";
      const start = performance.now();
      const dur = 1600;

      function step(now: number) {
        const t = Math.min(1, (now - start) / dur);
        const v = target * easeOut(t);
        let value;
        if (decimals > 0) value = (v / 10).toFixed(decimals);
        else value = Math.round(v).toLocaleString();
        el.textContent = prefix + value + suffix;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });

    document.querySelectorAll('[data-counter]').forEach(el => io.observe(el));

    // Stagger fade-up on scroll
    const ioFade = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          const target = e.target as HTMLElement;
          target.style.animationDelay = (i * 0.05) + 's';
          target.classList.add('fade-up');
          ioFade.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('section .clay, section .glass').forEach(el => {
      if (!el.classList.contains('fade-up')) ioFade.observe(el);
    });

    return () => {
      io.disconnect();
      ioFade.disconnect();
    };
  }, []);

  const scrollTestimonials = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const amount = direction === 'left' ? -460 : 460;
      trackRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="overflow-x-hidden font-sans bg-[#F9FAFB] text-[#1F2937]">
      {/* Navbar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(96%,1180px)]">
        <nav className="glass rounded-full pl-5 pr-2 py-2 flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 mr-3" aria-label="Tuali home">
            <div className="relative w-8 h-8 rounded-full clay-orange flex items-center justify-center">
              <span className="font-display font-bold text-white text-[15px]">T</span>
            </div>
            <span className="font-display font-bold text-[18px]">Tuali</span>
          </Link>
          <div className="hidden md:flex items-center gap-1 text-[14px] font-medium text-[#1F2937]/80">
            <a href="#solucion" className="btn-ghost px-3 py-2 rounded-full">Solución</a>
            <a href="#features" className="btn-ghost px-3 py-2 rounded-full">Servicios</a>
            <a href="#pricing" className="btn-ghost px-3 py-2 rounded-full">Smart Credits</a>
            <a href="#trust" className="btn-ghost px-3 py-2 rounded-full">Confianza</a>
            <a href="#" className="btn-ghost px-3 py-2 rounded-full flex items-center gap-1.5">
              Empresas <ChevronDown className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Link to="/auth" className="hidden sm:inline-flex btn-ghost px-4 py-2 rounded-full text-[14px] font-medium">Iniciar sesión</Link>
            <Link to="/auth" className="btn-primary text-white text-[14px] font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-1.5">
              Solicitar acceso
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative min-h-[110vh] flex flex-col justify-between overflow-hidden bg-white pt-32 pb-20">
        {/* Background Layer: The 16:9 Image occupying ~90% width - Hidden on mobile for readability */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full lg:w-[88%] aspect-video pointer-events-none z-0 hidden lg:block">
          <img 
            src="/landing/assets/images/hero1.jpeg" 
            alt="Tuali Hero" 
            className="w-full h-full object-contain mix-blend-multiply lg:translate-x-[5%] max-h-[90vh]"
          />
        </div>

        {/* Brand Accents */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>
        <div className="blob blob-orange w-[520px] h-[520px] -top-40 -left-40 anim-glow-soft opacity-20"></div>

        {/* Content Layer: Overlaid on the image's free zone (left) */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full flex-1 flex flex-col justify-center">
          <div className="max-w-[750px]">
            <div className="fade-up" style={{ animationDelay: '.05s' }}>
              <span className="inline-flex items-center gap-2 glass rounded-full pl-2 pr-4 py-1.5 text-[13px] font-medium mb-8">
                <span className="relative inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15">
                  <span className="relative w-2 h-2 rounded-full bg-emerald-500 pulse-dot"></span>
                </span>
                <span>Tiempo de respuesta promedio: <b className="font-semibold">42 min</b></span>
                <span className="font-mono text-[11px] text-[#1F2937]/50">· LIVE</span>
              </span>
            </div>

            <h1 className="fade-up font-display font-bold kerning-tight text-[clamp(44px,7vw,84px)] leading-[0.98] text-[#1F2937]" style={{ animationDelay: '.15s' }}>
              Tu aliado<br/>
              <span className="relative inline-block">
                resuelve.
                <svg className="absolute left-0 -bottom-2 w-full" viewBox="0 0 320 16" fill="none" preserveAspectRatio="none">
                  <path d="M2 11 C 80 2, 160 2, 318 9" stroke="#EA580C" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
              <span className="block text-[#1F2937]/40 font-medium mt-3">Antes que el problema crezca.</span>
            </h1>

            <p className="fade-up mt-8 text-[18px] md:text-[20px] leading-relaxed text-[#1F2937]/70 max-w-[620px] font-medium" style={{ animationDelay: '.25s' }}>
              Tuali conecta hogares y empresas con una red verificada de profesionales para
              servicios, mantenimientos y emergencias en menos de una hora —
              con garantía y un solo punto de contacto.
            </p>

            <div className="fade-up mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: '.35s' }}>
              <Link to="/auth" className="btn-primary text-white font-black px-8 py-5 rounded-2xl inline-flex items-center gap-3 text-[16px] shadow-xl shadow-orange-200/50">
                <Zap className="w-5 h-5 fill-white" />
                Solicitar un servicio
              </Link>
              <a href="#solucion" className="glass rounded-2xl px-8 py-5 inline-flex items-center gap-2 font-bold text-[16px] btn-ghost border border-slate-200/40 hover:bg-slate-50 transition-all">
                Ver cómo funciona
              </a>
            </div>

            <div className="fade-up mt-16 grid grid-cols-3 gap-8 max-w-[600px] border-t border-slate-100 pt-10" style={{ animationDelay: '.45s' }}>
              <div>
                <div className="font-display font-black text-[32px] text-[#1F2937] ticker" data-counter="5200" data-suffix="+">+5200</div>
                <div className="text-[11px] text-[#1F2937]/45 font-mono uppercase tracking-[0.15em] mt-1">Pros verificados</div>
              </div>
              <div>
                <div className="font-display font-black text-[32px] text-[#1F2937] ticker" data-counter="98" data-suffix="%">98%</div>
                <div className="text-[11px] text-[#1F2937]/45 font-mono uppercase tracking-[0.15em] mt-1">Resolución</div>
              </div>
              <div>
                <div className="font-display font-black text-[32px] text-[#1F2937] ticker" data-counter="60" data-prefix="<" data-suffix="h">&lt;60h</div>
                <div className="text-[11px] text-[#1F2937]/45 font-mono uppercase tracking-[0.15em] mt-1">Emergencias</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Context Badges */}
        <div className="absolute right-[5%] top-[25%] hidden lg:block anim-float z-20">
          <div className="glass rounded-2xl px-3 py-2 flex items-center gap-2 fade-up shadow-lg" style={{ animationDelay: '.6s' }}>
            <div className="w-8 h-8 rounded-xl clay-teal flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#1F2937]/50">Verificado</div>
              <div className="text-[12px] font-bold text-[#1F2937]">Pro #4-A · 4.97★</div>
            </div>
          </div>
        </div>

        <div className="absolute right-[8%] bottom-[25%] hidden lg:block anim-float z-20" style={{ animationDelay: '-1.5s' }}>
          <div className="glass rounded-2xl px-5 py-4 shadow-xl fade-up border border-white/50" style={{ animationDelay: '.8s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl clay-orange flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#1F2937]/50">ETA</div>
                <div className="text-[14px] font-bold text-[#1F2937]">38 min · 2.4 km</div>
              </div>
            </div>
          </div>
        </div>

        {/* Partners: Positioned at the bottom of the Hero section */}
        <div className="relative z-10 w-full pt-12">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex items-center gap-4">
              <span className="text-[12px] font-mono uppercase tracking-[0.18em] text-[#1F2937]/45 whitespace-nowrap">Confían en Tuali</span>
              <div className="hairline flex-1 opacity-50"></div>
            </div>
            <div className="mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
              <div className="marquee flex gap-14 items-center w-max">
                <div className="flex gap-14 items-center shrink-0">
                  <span className="trust-mark font-display font-bold text-[22px] tracking-tight opacity-70">Helix·Co</span>
                  <span className="trust-mark font-display font-bold text-[22px] tracking-tight opacity-70">NÓRDICA</span>
                  <span className="trust-mark font-display font-bold text-[22px] italic opacity-70">veridia</span>
                  <span className="trust-mark font-display font-bold text-[22px] opacity-70">▲ Stratos</span>
                  <span className="trust-mark font-display font-bold text-[22px] tracking-widest opacity-70">PALMARA</span>
                  <span className="trust-mark font-display font-bold text-[22px] opacity-70">⬢ Quanta</span>
                  <span className="trust-mark font-display font-bold text-[22px] tracking-tight opacity-70">Mosaico+</span>
                  <span className="trust-mark font-display font-bold text-[22px] opacity-70">Bóreal/Group</span>
                </div>
                <div className="flex gap-14 items-center shrink-0">
                  <span className="trust-mark font-display font-bold text-[22px] tracking-tight opacity-70">Helix·Co</span>
                  <span className="trust-mark font-display font-bold text-[22px] tracking-tight opacity-70">NÓRDICA</span>
                  <span className="trust-mark font-display font-bold text-[22px] italic opacity-70">veridia</span>
                  <span className="trust-mark font-display font-bold text-[22px] opacity-70">▲ Stratos</span>
                  <span className="trust-mark font-display font-bold text-[22px] tracking-widest opacity-70">PALMARA</span>
                  <span className="trust-mark font-display font-bold text-[22px] opacity-70">⬢ Quanta</span>
                  <span className="trust-mark font-display font-bold text-[22px] tracking-tight opacity-70">Mosaico+</span>
                  <span className="trust-mark font-display font-bold text-[22px] opacity-70">Bóreal/Group</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problema */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <span className="text-[12px] font-mono uppercase tracking-[0.18em] text-[#EA580C]">01 · El Problema</span>
              <h2 className="font-display font-bold kerning-tight text-[clamp(36px,5vw,60px)] leading-[1.02] mt-4">
                Cuando algo<br/>se rompe, todo<br/><span className="text-[#1F2937]/40">se complica.</span>
              </h2>
              <p className="mt-6 text-[16px] leading-relaxed text-[#1F2937]/65 max-w-[440px]">
                La urgencia no espera. Pero la mayoría de servicios sí: llamadas que no contestan, presupuestos opacos, gente que no llega, garantías que no existen.
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: X, title: 'Nadie contesta a las 11pm', desc: 'El 73% de las emergencias domésticas ocurren fuera del horario de oficina.' },
                { icon: ReceiptText, title: 'Cobros impredecibles', desc: 'Pagas el doble por la urgencia y nunca sabes qué incluye el presupuesto.' },
                { icon: UsersRound, title: 'Confías en un desconocido', desc: 'Sin verificación, antecedentes ni reseñas reales. Solo un número en clasificados.' },
                { icon: ShieldCheck, title: 'Si vuelve a fallar, te toca pagar', desc: 'Sin garantía, una reparación de 800 puede convertirse en 2,400 al mes.' }
              ].map((item, i) => (
                <div key={i} className="clay p-6 lg:p-7 lift">
                  <div className="w-11 h-11 rounded-2xl bg-[#1F2937]/8 flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold text-[20px] mt-4">{item.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#1F2937]/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solucion */}
      <section id="solucion" className="relative py-24 md:py-32 overflow-hidden">
        <div className="blob blob-orange w-[420px] h-[420px] top-[10%] -right-40 anim-glow-soft"></div>
        <div className="blob blob-teal w-[380px] h-[380px] bottom-0 -left-40 anim-glow-soft" style={{ animationDelay: '2s' }}></div>

        <div className="relative max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-[760px] mx-auto">
            <span className="text-[12px] font-mono uppercase tracking-[0.18em] text-[#EA580C]">02 · La Solución</span>
            <h2 className="font-display font-bold kerning-tight text-[clamp(36px,5.5vw,68px)] leading-[1.02] mt-4">
              La infraestructura<br/>que <span className="text-[#EA580C]">resuelve por ti.</span>
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-[#1F2937]/65">
              Un solo punto de contacto que despliega un equipo verificado, garantía incluida y respuesta cronometrada — desde un clic.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            <div className="hidden md:block absolute top-[64px] left-[16%] right-[16%] h-px border-t border-dashed border-[#1F2937]/15"></div>
            
            <div className="glass rounded-[28px] p-7 relative lift">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl clay-orange flex items-center justify-center"><MessageSquare className="w-5 h-5 text-white" /></div>
                <span className="font-mono text-[11px] text-[#1F2937]/40">STEP·01</span>
              </div>
              <h3 className="font-display font-semibold text-[22px] mt-5">Describes lo que pasa</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#1F2937]/60">Por chat, voz o foto. Nuestro triage clasifica la urgencia en 90 segundos.</p>
              <div className="mt-5 rounded-2xl bg-white/60 border border-white/80 p-3 font-mono text-[12px] text-[#1F2937]/70 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                <span>"Fuga bajo el lavabo, gotea desde anoche"</span>
              </div>
            </div>

            <div className="glass rounded-[28px] p-7 relative lift">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl clay-teal flex items-center justify-center"><UsersRound className="w-5 h-5 text-white" /></div>
                <span className="font-mono text-[11px] text-[#1F2937]/40">STEP·02</span>
              </div>
              <h3 className="font-display font-semibold text-[22px] mt-5">Asignamos al pro ideal</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#1F2937]/60">Verificados, especializados y a menos de 4 km. Llegan con presupuesto cerrado.</p>
              <div className="mt-5 flex -space-x-2">
                <div className="w-9 h-9 rounded-full bg-orange-200 ring-2 ring-white flex items-center justify-center font-display font-bold text-[12px] text-orange-800">JM</div>
                <div className="w-9 h-9 rounded-full bg-emerald-200 ring-2 ring-white flex items-center justify-center font-display font-bold text-[12px] text-emerald-800">AR</div>
                <div className="w-9 h-9 rounded-full bg-white ring-2 ring-white flex items-center justify-center font-mono text-[11px] text-[#1F2937]/60">+12</div>
              </div>
            </div>

            <div className="glass rounded-[28px] p-7 relative lift">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#1F2937] flex items-center justify-center shadow-inner shadow-white/10"><CheckCheck className="w-5 h-5 text-white" /></div>
                <span className="font-mono text-[11px] text-[#1F2937]/40">STEP·03</span>
              </div>
              <h3 className="font-display font-semibold text-[22px] mt-5">Resuelto y garantizado</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#1F2937]/60">Pago al final, garantía de 90 días por escrito. Si vuelve a fallar, volvemos gratis.</p>
              <div className="mt-5 rounded-2xl p-3 flex items-center gap-2.5 border border-emerald-200/60 bg-emerald-50/60">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span className="text-[12px] font-medium text-emerald-900">Garantía Tuali · 90 días</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 md:py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
            <div>
              <span className="text-[12px] font-mono uppercase tracking-[0.18em] text-[#EA580C]">03 · Capacidades</span>
              <h2 className="font-display font-bold kerning-tight text-[clamp(36px,5vw,60px)] leading-[1.02] mt-4 max-w-[700px]">
                Hecho para urgencias.<br/>Diseñado para la rutina.
              </h2>
            </div>
            <a href="#" className="btn-ghost rounded-full px-5 py-3 inline-flex items-center gap-2 text-[14px] font-semibold border border-[#1F2937]/10">
              Ver catálogo completo
              <ArrowRight className="w-4 h-4 rotate-[-45deg]" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
            <div className="md:col-span-3 row-span-2 rounded-[32px] p-8 lift relative overflow-hidden bg-[#1F2937] shadow-2xl">
              <div className="blob blob-orange w-[300px] h-[300px] -top-20 -right-20 opacity-30"></div>
              <div className="relative">
                <span className="inline-flex items-center gap-2 glass-dark rounded-full px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-white/80">
                  <Zap className="w-3 h-3 text-orange-400" />
                  Emergencia
                </span>
                <h3 className="font-display font-bold text-white text-[36px] leading-[1.05] mt-5 kerning-tight">Respuesta<br/>en menos de 1 hora.</h3>
                <p className="mt-4 text-white/65 text-[15px] leading-relaxed max-w-[420px]">Red activa 24/7 con cobertura en 14 ciudades. SLA cronometrado por categoría.</p>
                <div className="mt-8 inline-flex items-center gap-3 glass-dark rounded-2xl px-4 py-3">
                  <div className="relative w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center"><Timer className="w-5 h-5 text-orange-400" /></div>
                  <div>
                    <div className="font-display font-bold text-white text-[22px] leading-none">42:18</div>
                    <div className="text-white/55 font-mono text-[11px] uppercase tracking-wider mt-1">SLA promedio</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 rounded-[32px] p-7 lift glass">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl clay-teal flex items-center justify-center"><BadgeCheck className="w-5 h-5 text-white" /></div>
                <span className="font-mono text-[11px] text-[#1F2937]/40">100% verificado</span>
              </div>
              <h3 className="font-display font-semibold text-[24px] mt-5">Profesionales con score</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#1F2937]/60">Identidad validada, antecedentes y rating dinámico tras cada servicio.</p>
            </div>

            <div className="md:col-span-3 rounded-[32px] p-7 lift glass">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl clay-orange flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-white" /></div>
                <span className="font-mono text-[11px] text-[#1F2937]/40">90 días</span>
              </div>
              <h3 className="font-display font-semibold text-[24px] mt-5">Garantía por escrito</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#1F2937]/60">Si el problema vuelve dentro de 90 días, regresamos sin costo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section id="trust" className="relative py-24 md:py-32 bg-[#F3F4F6]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-[720px] mx-auto">
            <span className="text-[12px] font-mono uppercase tracking-[0.18em] text-[#EA580C]">04 · Datos duros</span>
            <h2 className="font-display font-bold kerning-tight text-[clamp(36px,5vw,60px)] leading-[1.02] mt-4">
              La confianza no se promete.<br/><span className="text-[#1F2937]/40">Se mide.</span>
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Profesionales activos', value: '5237', suffix: '+' },
              { label: 'Resolución primer intento', value: '98', suffix: '%' },
              { label: 'Tiempo respuesta urgencia', value: '42', suffix: ' min' },
              { label: 'CSAT recurrente', value: '49', decimal: '1' }
            ].map((stat, i) => (
              <div key={i} className="clay p-7 text-left">
                <div className="font-mono text-[11px] uppercase tracking-wider text-[#1F2937]/45">{stat.label}</div>
                <div className="mt-3 font-display font-bold text-[clamp(40px,5vw,56px)] leading-none" 
                     data-counter={stat.value} 
                     data-suffix={stat.suffix}
                     data-decimal={stat.decimal}>0</div>
                <div className="mt-3 h-1 rounded-full bg-[#1F2937]/8 overflow-hidden">
                  <div className="h-full bg-[#EA580C]" style={{ width: '80%' }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-[32px] p-8 lg:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-[#1F2937]">
            <div className="md:col-span-2 text-white">
              <Quote className="w-7 h-7 text-orange-400/80" />
              <p className="font-display font-semibold text-[clamp(22px,2.5vw,30px)] leading-snug mt-3">
                "Migramos 47 sucursales a Tuali. Resolvemos incidentes en horas, no en semanas. Es la única plataforma que se hace responsable hasta el final."
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-display font-bold text-white">MR</div>
                <div>
                  <div className="text-[14px] font-semibold text-white">María Rincón</div>
                  <div className="text-[12px] text-white/50">Head of Operations · Cadena Pacífica</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl glass-dark p-4">
                <div className="text-white/55 font-mono text-[11px] uppercase tracking-wider">Tickets/mes</div>
                <div className="font-display font-bold text-white text-[26px]">2,840</div>
              </div>
              <div className="rounded-2xl glass-dark p-4">
                <div className="text-white/55 font-mono text-[11px] uppercase tracking-wider">SLA</div>
                <div className="font-display font-bold text-white text-[26px]">99.4%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <span className="text-[12px] font-mono uppercase tracking-[0.18em] text-[#EA580C]">05 · Clientes</span>
              <h2 className="font-display font-bold kerning-tight text-[clamp(36px,5vw,60px)] leading-[1.02] mt-4 max-w-[700px]">
                Lo que dicen quienes ya<br/>dejaron de improvisar.
              </h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scrollTestimonials('left')} className="w-12 h-12 rounded-full glass btn-ghost flex items-center justify-center"><ArrowLeft className="w-5 h-5" /></button>
              <button onClick={() => scrollTestimonials('right')} className="w-12 h-12 rounded-full glass btn-ghost flex items-center justify-center"><ArrowRight className="w-5 h-5" /></button>
            </div>
          </div>

          <div ref={trackRef} className="mt-12 flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 scroll-smooth">
            {[1, 2, 3, 4].map(i => (
              <article key={i} className="snap-start shrink-0 w-[88%] md:w-[440px] glass rounded-[28px] p-7">
                <div className="flex items-center gap-1 text-[#EA580C]">
                  {[...Array(5)].map((_, s) => <Star key={s} className="w-4 h-4 fill-[#EA580C]" />)}
                </div>
                <p className="mt-4 font-display text-[20px] italic leading-snug">"Llamé un domingo a las 11pm por una fuga. A las 11:38 ya estaba sellada. La garantía me dio paz."</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-orange-600"></div>
                  <div>
                    <div className="text-[14px] font-semibold">Cliente #{i}</div>
                    <div className="text-[12px] text-[#1F2937]/55">Hogar · Tuali User</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-24 md:py-32 overflow-hidden">
        <div className="relative max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-[760px] mx-auto mb-16">
            <span className="text-[12px] font-mono uppercase tracking-[0.18em] text-[#EA580C]">06 · Smart Credits</span>
            <h2 className="font-display font-bold kerning-tight text-[clamp(36px,5.5vw,68px)] leading-[1.02] mt-4">
              Un crédito.<br/>Cualquier servicio.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {/* Esencial */}
            <div className="clay p-7 lift relative flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display font-semibold text-[20px]">Esencial</div>
                  <div className="text-[13px] text-[#1F2937]/55 mt-0.5">Para hogares</div>
                </div>
                <div className="relative w-16 h-16 rounded-full clay-orange flex items-center justify-center">
                  <span className="font-display font-bold text-white text-[18px]">25</span>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center"><Coins className="w-3 h-3 text-[#EA580C]" /></div>
                </div>
              </div>
              <div className="mt-7 flex items-baseline gap-2">
                <span className="font-display font-bold text-[52px] leading-none">$1,499</span>
                <span className="text-[13px] text-[#1F2937]/55">MXN</span>
              </div>
              <Link to="/auth" className="mt-auto btn-ghost rounded-2xl glass py-3.5 font-semibold text-[14px] flex items-center justify-center gap-2">Comprar <ArrowRight className="w-4 h-4" /></Link>
            </div>

            {/* Pro */}
            <div className="clay p-7 lift relative flex flex-col ring-orange scale-105 z-10 bg-white">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#EA580C] text-white text-[11px] font-bold uppercase font-mono shadow-md">Más popular</div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display font-semibold text-[20px]">Pro</div>
                  <div className="text-[13px] text-[#1F2937]/55 mt-0.5">Para PYMES</div>
                </div>
                <div className="relative w-20 h-20 rounded-full clay-orange flex items-center justify-center anim-float">
                  <span className="font-display font-bold text-white text-[20px]">100</span>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center"><Coins className="w-3.5 h-3.5 text-[#EA580C]" /></div>
                </div>
              </div>
              <div className="mt-7 flex items-baseline gap-2">
                <span className="font-display font-bold text-[52px] leading-none">$4,899</span>
                <span className="text-[13px] text-[#1F2937]/55">MXN</span>
              </div>
              <Link to="/auth" className="mt-auto btn-primary text-white rounded-2xl py-3.5 font-semibold text-[14px] flex items-center justify-center gap-2">Activar Pro <ArrowRight className="w-4 h-4" /></Link>
            </div>

            {/* Enterprise */}
            <div className="clay p-7 lift relative flex flex-col bg-[#1F2937] text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display font-semibold text-[20px]">Enterprise</div>
                  <div className="text-[13px] text-white/55 mt-0.5">Para corporativos</div>
                </div>
                <div className="relative w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-inner shadow-white/20">
                  <span className="font-display font-bold text-white text-[16px]">∞</span>
                </div>
              </div>
              <div className="mt-7 flex items-baseline gap-2"><span className="font-display font-bold text-[40px] leading-none">A medida</span></div>
              <Link to="/auth" className="mt-auto text-white border border-white/15 hover:bg-white/5 rounded-2xl py-3.5 font-semibold text-[14px] flex items-center justify-center gap-2">Ventas <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="relative rounded-[36px] p-10 md:p-14 overflow-hidden text-center bg-[#1F2937]">
            <div className="blob blob-orange w-[400px] h-[400px] -top-20 -right-20 opacity-40"></div>
            <div className="relative z-10">
              <h2 className="font-display font-bold text-[clamp(34px,5vw,58px)] leading-[1.02] text-white">Resolver, por fin,<br/>se siente fácil.</h2>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link to="/auth" className="btn-primary text-white px-7 py-4 rounded-2xl font-semibold inline-flex items-center gap-2">Empezar gratis <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative pt-16 pb-10 border-t border-[#1F2937]/8">
        <div className="max-w-[1200px] mx-auto px-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <div className="w-9 h-9 rounded-full clay-orange flex items-center justify-center"><span className="font-display font-bold text-white">T</span></div>
            <span className="font-display font-bold text-[20px]">Tuali</span>
          </div>
          <p className="text-[12px] text-[#1F2937]/50 font-mono">© 2026 Tuali Tech · Hecho en LATAM</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
