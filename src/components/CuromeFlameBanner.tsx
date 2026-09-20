import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Factory,
  Radio,
} from 'lucide-react';

interface CuromeFlameBannerProps {
  onOpenQuote: () => void;
  onOpenCart?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export const CuromeFlameBanner: React.FC<CuromeFlameBannerProps> = ({
  onOpenQuote,
  onOpenCart,
}) => {
  const [flameLevel, setFlameLevel] = useState<'standard' | 'high' | 'offshore'>('high');
  const [stokeCount, setStokeCount] = useState<number>(0);
  const [isBlazing, setIsBlazing] = useState<boolean>(false);
  const [sparkRipples, setSparkRipples] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState<boolean>(false);

  // Detect when user scrolls near the bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Generate floating spark embers
  const embers: Particle[] = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    x: Math.random() * 90 + 5,
    y: Math.random() * 80 + 20,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 2.5 + 1.8,
    delay: Math.random() * 2,
    opacity: Math.random() * 0.7 + 0.3,
  }));

  const handleStokeFlame = () => {
    setStokeCount((prev) => prev + 1);
    setIsBlazing(true);
    setSparkRipples((prev) => [...prev, Date.now()]);

    setTimeout(() => {
      setIsBlazing(false);
    }, 1200);
  };

  const flameHeight =
    flameLevel === 'offshore' || isBlazing
      ? 'h-48 sm:h-56'
      : flameLevel === 'high'
      ? 'h-40 sm:h-48'
      : 'h-32 sm:h-40';

  const glowIntensity =
    flameLevel === 'offshore' || isBlazing
      ? 'from-amber-400/40 via-orange-600/30 to-red-700/20'
      : flameLevel === 'high'
      ? 'from-amber-400/25 via-orange-600/20 to-red-700/10'
      : 'from-amber-400/15 via-orange-600/10 to-transparent';

  return (
    <section
      ref={containerRef}
      id="curome-flame-forge"
      className="relative overflow-hidden bg-slate-950 text-white py-16 sm:py-24 border-t border-b border-orange-900/40 select-none"
    >
      {/* Background flare heat atmosphere */}
      <div
        className={`absolute inset-0 bg-radial ${glowIntensity} blur-3xl transition-all duration-700 pointer-events-none opacity-80`}
      />

      {/* Industrial lattice texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-25 pointer-events-none" />

      {/* Floating animated spark particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {embers.map((ember) => (
          <motion.div
            key={ember.id}
            className="absolute rounded-full bg-gradient-to-t from-amber-300 to-orange-500 shadow-sm"
            style={{
              left: `${ember.x}%`,
              bottom: '10%',
              width: ember.size,
              height: ember.size * 1.6,
            }}
            animate={{
              y: [0, -180, -320],
              x: [0, (Math.sin(ember.id) * 40), (Math.cos(ember.id) * 70)],
              opacity: [0, ember.opacity, 0],
              scale: [0.5, 1.3, 0.2],
            }}
            transition={{
              duration: ember.duration,
              repeat: Infinity,
              delay: ember.delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Top Flame Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-300 text-xs font-bold tracking-wider uppercase mb-6 shadow-lg shadow-orange-950/50"
        >
          <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
          <span>The Curome Industrial Flare • Port Harcourt Engineering</span>
        </motion.div>

        {/* The Core Flame Visualizer with CUROME Flame Lettering */}
        <div className="relative my-4 flex flex-col items-center justify-center">
          {/* Flame SVG Structure */}
          <div
            onClick={handleStokeFlame}
            className={`relative ${flameHeight} w-full max-w-xl cursor-pointer transition-all duration-500 flex items-end justify-center group`}
            title="Click to stoke the Curome flame!"
          >
            {/* Pulsating radial glow beneath flame */}
            <div className="absolute bottom-2 w-72 h-20 bg-orange-500/50 blur-2xl rounded-full animate-pulse" />

            {/* SVG Animated Flame Tongues */}
            <svg
              viewBox="0 0 400 240"
              className="w-full h-full drop-shadow-[0_0_25px_rgba(249,115,22,0.6)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="flameBack" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#7c2d12" />
                  <stop offset="40%" stopColor="#c2410c" />
                  <stop offset="80%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="flameMid" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#c2410c" />
                  <stop offset="45%" stopColor="#ea580c" />
                  <stop offset="85%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fef08a" />
                </linearGradient>
                <linearGradient id="flameCore" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="90%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>

              {/* Back outer flame tongue (waving) */}
              <motion.path
                d="M130 220 C100 170 120 120 160 80 C180 60 190 20 200 5 C210 20 220 60 240 80 C280 120 300 170 270 220 Z"
                fill="url(#flameBack)"
                opacity="0.85"
                animate={{
                  scaleX: [1, 1.05, 0.95, 1],
                  scaleY: [1, 1.08, 0.96, 1],
                  rotate: [-1.5, 1.5, -1.5],
                }}
                transition={{
                  duration: isBlazing ? 0.6 : 1.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '200px 220px' }}
              />

              {/* Left wing flame */}
              <motion.path
                d="M120 220 C90 180 100 130 135 100 C155 80 160 50 165 35 C175 60 185 90 195 110 C210 140 170 190 120 220 Z"
                fill="url(#flameMid)"
                opacity="0.9"
                animate={{
                  scaleX: [0.95, 1.1, 0.95],
                  scaleY: [0.95, 1.12, 0.95],
                  skewX: [-2, 2, -2],
                }}
                transition={{
                  duration: isBlazing ? 0.5 : 1.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '150px 220px' }}
              />

              {/* Right wing flame */}
              <motion.path
                d="M280 220 C310 180 300 130 265 100 C245 80 240 50 235 35 C225 60 215 90 205 110 C190 140 230 190 280 220 Z"
                fill="url(#flameMid)"
                opacity="0.9"
                animate={{
                  scaleX: [1.08, 0.95, 1.08],
                  scaleY: [1.1, 0.94, 1.1],
                  skewX: [2, -2, 2],
                }}
                transition={{
                  duration: isBlazing ? 0.5 : 1.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '250px 220px' }}
              />

              {/* Mid vibrant tongue */}
              <motion.path
                d="M150 220 C130 170 150 130 180 95 C190 80 195 50 200 35 C205 50 210 80 220 95 C250 130 270 170 250 220 Z"
                fill="url(#flameMid)"
                animate={{
                  scaleX: [1.03, 0.97, 1.03],
                  scaleY: [1, 1.1, 0.98, 1],
                }}
                transition={{
                  duration: isBlazing ? 0.4 : 1.1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '200px 220px' }}
              />

              {/* Core white-hot inner flame */}
              <motion.path
                d="M175 220 C165 180 175 150 190 120 C195 110 198 85 200 75 C202 85 205 110 210 120 C225 150 235 180 225 220 Z"
                fill="url(#flameCore)"
                animate={{
                  scaleX: [0.95, 1.08, 0.95],
                  scaleY: [0.95, 1.15, 0.95],
                }}
                transition={{
                  duration: isBlazing ? 0.3 : 0.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '200px 220px' }}
              />
            </svg>

            {/* Click instruction hint on hover */}
            <div className="absolute -bottom-2 px-3 py-1 rounded-full bg-slate-900/90 border border-orange-500/50 text-[11px] text-orange-300 font-bold opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all shadow-md">
              ⚡️ Tap Flame to Stoke Flare ({stokeCount > 0 ? `Stoked ×${stokeCount}` : 'Click Me'})
            </div>
          </div>

          {/* Glowing Animated CUROME Lettering */}
          <div className="mt-6 relative">
            {/* Heat aura behind typography */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/30 via-amber-400/40 to-orange-600/30 blur-2xl -z-10 animate-pulse" />

            <motion.div
              animate={isBlazing ? { scale: [1, 1.06, 1], rotate: [0, -0.5, 0.5, 0] } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-1 sm:gap-2 tracking-tighter"
            >
              {'CUROME'.split('').map((char, index) => (
                <motion.span
                  key={index}
                  animate={{
                    color: isBlazing
                      ? ['#fef08a', '#f97316', '#ffffff', '#f59e0b']
                      : ['#ffedd5', '#fed7aa', '#f97316', '#ffedd5'],
                    textShadow: isBlazing
                      ? '0 0 25px rgba(251,191,36,0.9), 0 0 50px rgba(249,115,22,0.8)'
                      : '0 0 15px rgba(249,115,22,0.6), 0 0 30px rgba(234,88,12,0.4)',
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.15,
                  }}
                  className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-mono select-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>

            {/* Subtitle with industrial certified flame seal */}
            <p className="text-xs sm:text-sm font-bold tracking-widest text-orange-300/90 uppercase mt-3">
              DE PAIX NIGERIA LIMITED • RC-7473017 • FORGED FOR INDUSTRIAL SAFETY
            </p>
          </div>
        </div>

        {/* Interactive Controls & Engagement Panel */}
        <div className="mt-8 pt-8 border-t border-slate-800/80 max-w-2xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs font-bold text-slate-400">Flare Mode:</span>
            {(['standard', 'high', 'offshore'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setFlameLevel(lvl)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  flameLevel === lvl
                    ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20 scale-105'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/70'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${flameLevel === lvl ? 'text-slate-950' : 'text-orange-400'}`} />
                <span>
                  {lvl === 'standard'
                    ? 'Workshop Forge'
                    : lvl === 'high'
                    ? 'Industrial High Heat'
                    : 'Offshore Rig Flare ⚡️'}
                </span>
              </button>
            ))}

            <button
              type="button"
              onClick={handleStokeFlame}
              className="px-4 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Stoke Flame!</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">Flame-Resistant Specs</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  100% 290 GSM cotton twill boiler suits conforming to NFPA 2112 and EN ISO 11612 standards.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Factory className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">NTA Road Factory</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Local Nigerian manufacturing hub providing rapid batch embroidery and ASME-certified welding.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">24/7 Rapid Requisition</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Emergency shut-down and turnaround supply delivered directly to your site or jetty within hours.
                </p>
              </div>
            </div>
          </div>

          {/* Direct CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenQuote}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-950/80 transition-all cursor-pointer active:scale-98"
            >
              <span>Build Official Requisition Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenCart && (
              <button
                type="button"
                onClick={onOpenCart}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition-all cursor-pointer active:scale-98"
              >
                View Requisition Desk
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
