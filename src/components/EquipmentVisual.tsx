import React, { useState, useEffect } from 'react';
import { ProductItem, ColorVariant } from '../types';
import { ShieldCheck, Eye, HardHat, Footprints, Flame, ShieldAlert, Sparkles } from 'lucide-react';

interface EquipmentVisualProps {
  product: ProductItem;
  activeImage: string;
  selectedColor?: ColorVariant | null;
  className?: string;
  showBadge?: boolean;
  altText?: string;
  onClick?: () => void;
  priority?: boolean;
}

export const EquipmentVisual: React.FC<EquipmentVisualProps> = ({
  product,
  activeImage,
  selectedColor,
  className = 'w-full h-full',
  showBadge = true,
  altText,
  onClick,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(activeImage || product.image);
  const [hasFailed, setHasFailed] = useState<boolean>(false);
  const [isColorTransitioning, setIsColorTransitioning] = useState<boolean>(false);

  // When activeImage or selectedColor changes, update imgSrc and reset error
  useEffect(() => {
    setImgSrc(activeImage || product.image);
    setHasFailed(false);
    setIsColorTransitioning(true);
    const timer = setTimeout(() => setIsColorTransitioning(false), 350);
    return () => clearTimeout(timer);
  }, [activeImage, product.image, selectedColor?.name, selectedColor?.hex]);

  const handleImgError = () => {
    // If a variant image failed, fallback to the base product image first
    if (imgSrc !== product.image) {
      setImgSrc(product.image);
      setHasFailed(false);
    } else {
      // If base image also fails, trigger high-fidelity SVG equipment rendering
      setHasFailed(true);
    }
  };

  const hexColor = selectedColor?.hex || product.availableColors?.[0]?.hex;
  const colorName = selectedColor?.name || product.availableColors?.[0]?.name;

  // Determine optimal blend mode based on selected color brightness
  const getBlendStyle = () => {
    if (!hexColor || !selectedColor) return null;
    const lower = hexColor.toLowerCase();
    
    // Light / white colors
    if (lower === '#ffffff' || lower === '#f8fafc' || lower === '#e2e8f0') {
      return {
        backgroundColor: hexColor,
        mixBlendMode: 'screen' as const,
        opacity: 0.35,
      };
    }
    // Very dark / black colors
    if (lower === '#18181b' || lower === '#000000' || lower === '#1e293b' || lower === '#334155') {
      return {
        backgroundColor: hexColor,
        mixBlendMode: 'multiply' as const,
        opacity: 0.55,
      };
    }
    // Rich saturated colors (Red, Navy Blue, Safety Green, Yellow, Orange, Tan)
    return {
      backgroundColor: hexColor,
      mixBlendMode: 'color' as const,
      opacity: 0.65,
    };
  };

  const blendStyle = getBlendStyle();

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden flex items-center justify-center select-none bg-slate-950 ${className}`}
      id={`equipment-visual-${product.id}`}
    >
      {/* Primary Equipment Photo */}
      {!hasFailed ? (
        <img
          src={imgSrc}
          alt={altText || product.name}
          onError={handleImgError}
          className={`w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-105 ${
            isColorTransitioning ? 'scale-[1.02] filter saturate-125' : ''
          }`}
          loading="lazy"
        />
      ) : (
        /* Fallback High-Fidelity SVG Equipment Graphic in the EXACT Selected Color */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 relative">
          <div
            className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-xl mb-3 border border-white/20 transition-all duration-300"
            style={{
              backgroundColor: hexColor || '#f97316',
              boxShadow: `0 10px 25px -5px ${hexColor || '#f97316'}66`,
            }}
          >
            {product.category === 'helmets' && <HardHat className="w-14 h-14 text-white drop-shadow-md" />}
            {product.category === 'boots' && <Footprints className="w-14 h-14 text-white drop-shadow-md" />}
            {product.category === 'extinguishers' && <Flame className="w-14 h-14 text-white drop-shadow-md" />}
            {product.category === 'fall_protection' && <ShieldAlert className="w-14 h-14 text-white drop-shadow-md" />}
            {product.category !== 'helmets' &&
              product.category !== 'boots' &&
              product.category !== 'extinguishers' &&
              product.category !== 'fall_protection' && (
                <ShieldCheck className="w-14 h-14 text-white drop-shadow-md" />
              )}
          </div>
          <span className="font-extrabold text-sm text-white max-w-[80%] line-clamp-1">
            {product.name}
          </span>
          {colorName && (
            <span
              className="text-xs font-bold mt-1 px-2.5 py-0.5 rounded-full border text-white shadow-xs"
              style={{ backgroundColor: `${hexColor}cc`, borderColor: hexColor }}
            >
              Color: {colorName}
            </span>
          )}
          <span className="text-[11px] text-slate-400 mt-1">Curome Certified Equipment (RC-7473017)</span>
        </div>
      )}

      {/* Dynamic Real-Time Color Transformation Layer */}
      {/* Applies the chosen color (Red, Green, Yellow, Navy Blue, Orange, etc.) onto the product */}
      {blendStyle && !hasFailed && (
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-500"
          style={blendStyle}
          aria-hidden="true"
        />
      )}

      {/* Subtle Color Transition Flare on Swatch Change */}
      {isColorTransitioning && hexColor && (
        <div
          className="absolute inset-0 pointer-events-none animate-ping opacity-25"
          style={{ backgroundColor: hexColor }}
          aria-hidden="true"
        />
      )}

      {/* Contrast & Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none opacity-60 group-hover:opacity-75 transition-opacity" />

      {/* Active Colorway Pill on the Image */}
      {showBadge && selectedColor && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md text-[11px] font-bold text-white border border-white/20 shadow-lg animate-in fade-in zoom-in-95 duration-200">
          <span
            className="w-3.5 h-3.5 rounded-full border border-white/80 shrink-0 shadow-xs"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <span className="truncate max-w-[130px]">{selectedColor.name}</span>
          <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
        </div>
      )}
    </div>
  );
};
