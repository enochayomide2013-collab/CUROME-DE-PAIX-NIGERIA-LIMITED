import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, ArrowUp, Sparkles } from 'lucide-react';

export const CuromeFlameElevate: React.FC = () => {
  const [isNearBottom, setIsNearBottom] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isElevating, setIsElevating] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // When within 600px of the bottom
      if (scrollY + windowHeight >= docHeight - 550) {
        setIsNearBottom(true);
      } else {
        setIsNearBottom(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleElevate = () => {
    setIsElevating(true);
    setClickCount((c) => c + 1);

    // Procedural flame whoosh audio
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // Audio fallback
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setIsElevating(false);
    }, 1200);
  };

  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black py-10 border-t border-orange-500/20">
      {/* Background Ambient Heat Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className={`w-96 h-40 bg-orange-600/20 rounded-full blur-3xl transition-opacity duration-700 ${
            isNearBottom ? 'opacity-100' : 'opacity-40'
          }`}
        />
        <div className="w-64 h-24 bg-amber-500/15 rounded-full blur-2xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        {/* Flame Badge */}
        <motion.div
          animate={
            isHovered || isElevating
              ? { scale: [1, 1.12, 1.05], y: [-2, -8, -4] }
              : { scale: [1, 1.03, 1], y: [0, -3, 0] }
          }
          transition={{
            repeat: Infinity,
            duration: isHovered ? 0.8 : 2,
            ease: 'easeInOut',
          }}
          className="relative cursor-pointer select-none mb-3 group"
          onClick={handleElevate}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Flame aura rings */}
          <div className="absolute -inset-4 bg-gradient-to-t from-orange-600/40 via-amber-500/20 to-transparent rounded-full blur-lg group-hover:from-orange-500/60 transition-all duration-300" />

          {/* Animated Fiery Flame Icon */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-t from-red-600 via-orange-500 to-amber-400 p-0.5 shadow-2xl shadow-orange-600/50 flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Internal Flame Graphic */}
              <motion.div
                animate={{
                  y: [0, -2, 1, -1, 0],
                  scale: [1, 1.06, 0.98, 1.04, 1],
                  rotate: [0, -2, 2, -1, 0],
                }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                className="text-orange-500"
              >
                <Flame className="w-9 h-9 sm:w-11 sm:h-11 fill-orange-500 text-amber-300 drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
              </motion.div>

              {/* Sparks Particles */}
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping opacity-75" />
              <span className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-orange-400 animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Fiery "CUROME" Typography */}
        <div
          onClick={handleElevate}
          className="cursor-pointer group select-none flex flex-col items-center"
        >
          <div className="flex items-center gap-2">
            <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-orange-500" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-orange-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Nigerian Engineering & PPE Vanguard</span>
            </span>
            <span className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-orange-500" />
          </div>

          <motion.h3
            animate={
              isHovered
                ? { textShadow: '0 0 25px rgba(249, 115, 22, 0.9), 0 0 40px rgba(245, 158, 11, 0.6)' }
                : { textShadow: '0 0 16px rgba(249, 115, 22, 0.5)' }
            }
            className="text-3xl sm:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 mt-1 uppercase"
          >
            CUROME
          </motion.h3>

          <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-1 max-w-md">
            Heavy-Duty Industrial Safety Workwear & Cranial Defense • Port Harcourt
          </p>
        </div>

        {/* Elevate Button Micro-Interaction */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleElevate}
          className="mt-5 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2.5 shadow-lg shadow-orange-600/30 border border-orange-400/30 transition-all cursor-pointer group"
          id="curome-elevate-flame-btn"
        >
          <motion.div
            animate={isElevating ? { y: -4, rotate: [0, -10, 10, 0] } : { y: 0 }}
            transition={{ repeat: Infinity, duration: 0.3 }}
          >
            <ArrowUp className="w-4 h-4 text-white group-hover:-translate-y-0.5 transition-transform" />
          </motion.div>
          <span>ELEVATE TO TOP</span>
          <Flame className="w-4 h-4 text-amber-200 fill-amber-200" />
        </motion.button>

        {clickCount > 0 && (
          <span className="text-[10px] text-orange-300 font-mono mt-2 animate-in fade-in">
            ⚡ Elevated {clickCount} {clickCount === 1 ? 'time' : 'times'} to Central Depot
          </span>
        )}
      </div>
    </div>
  );
};
