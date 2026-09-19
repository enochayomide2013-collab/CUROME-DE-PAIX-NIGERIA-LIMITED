import React from 'react';

interface LogoProps {
  variant?: 'full' | 'horizontal' | 'icon-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  theme?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  theme = 'light',
}) => {
  // Size dimensions
  const dimensions = {
    sm: { icon: 34, text: 'text-sm', subText: 'text-[9px]' },
    md: { icon: 46, text: 'text-base', subText: 'text-[10px]' },
    lg: { icon: 64, text: 'text-xl', subText: 'text-xs' },
    xl: { icon: 88, text: 'text-2xl', subText: 'text-sm' },
  }[size];

  // SVG Icon definition
  const IconGraphic = ({ width = dimensions.icon, height = dimensions.icon }: { width?: number; height?: number }) => (
    <svg
      viewBox="0 0 380 280"
      width={width}
      height={height}
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cGradComp" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
        <linearGradient id="pGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="flameGradComp" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="45%" stopColor="#EA580C" />
          <stop offset="85%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>
        <linearGradient id="innerFlameComp" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>

      {/* C Form */}
      <path
        d="M 115 35 C 45 35 15 80 15 145 C 15 210 45 255 115 255 C 142 255 162 245 174 232 C 140 225 112 200 108 168 C 135 168 152 158 164 140 C 130 140 82 130 82 92 C 82 62 100 44 122 36 Z"
        fill="url(#cGradComp)"
      />

      {/* P Form */}
      <path
        d="M 175 35 L 280 35 C 330 35 365 70 365 120 C 365 170 330 205 280 205 L 235 205 L 235 255 L 175 255 Z M 235 90 L 275 90 C 295 90 310 102 310 120 C 310 138 295 150 275 150 L 235 150 Z"
        fill="url(#pGradComp)"
      />

      {/* Flame rising between C and P */}
      <path
        d="M 170 240 C 145 220 135 180 150 145 C 155 132 165 120 167 100 C 169 85 165 65 155 50 C 175 65 190 90 190 115 C 190 128 185 140 190 152 C 195 165 207 178 210 195 C 215 220 195 245 170 240 Z"
        fill="url(#flameGradComp)"
      />

      {/* Inner White/Yellow Flare */}
      <path
        d="M 170 225 C 158 210 154 185 162 165 C 166 156 174 148 174 135 C 178 148 184 160 184 175 C 184 185 180 195 182 205 C 184 216 178 225 170 225 Z"
        fill="url(#innerFlameComp)"
      />
    </svg>
  );

  if (variant === 'icon-only') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`} id="brand-logo-icon">
        <IconGraphic />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div
        className={`flex flex-col items-center text-center p-4 bg-white/80 rounded-2xl border border-slate-200/80 shadow-sm ${className}`}
        id="brand-logo-full"
      >
        <IconGraphic width={80} height={60} />
        <div className="mt-2 tracking-widest font-black text-2xl text-slate-900">
          ENERGY
        </div>
        <div className="w-full max-w-[280px] h-[1.5px] bg-gradient-to-r from-orange-400 via-blue-600 to-orange-400 my-2 opacity-60" />
        <div className="text-[11px] font-bold tracking-wider uppercase text-slate-700">
          Curome de Paix Energy Nigeria Limited
        </div>
      </div>
    );
  }

  // Default: Horizontal navbar / header format
  return (
    <div
      className={`group flex items-center gap-3 cursor-pointer ${className}`}
      id="brand-logo-nav"
    >
      <div className="relative p-1 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center">
        <IconGraphic />
      </div>
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-black tracking-tight ${dimensions.text} ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            CUROME DE PAIX
          </span>
          <span className="font-extrabold text-orange-600 text-xs px-1.5 py-0.5 rounded bg-orange-50 border border-orange-200/60 uppercase tracking-wide">
            ENERGY
          </span>
        </div>
        <span
          className={`font-semibold tracking-wider uppercase mt-1 ${dimensions.subText} ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          Nigeria Limited • Safety PPE & Services
        </span>
      </div>
    </div>
  );
};
