import React, { useState, useRef, useEffect } from 'react';
import { ProductItem } from '../types';
import { formatNaira } from '../utils/communication';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  ShoppingBag,
  FileCheck,
  Check,
  ShieldCheck,
  Eye,
  CheckCircle,
} from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
  onAddToCart?: (product: ProductItem) => void;
  onOpenQuote?: (product: ProductItem) => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
  onOpenQuote,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedColorName, setSelectedColorName] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [addedNotice, setAddedNotice] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom and set default image, color, size when modal opens or product changes
  useEffect(() => {
    if (product) {
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
      setImgError(false);
      setActiveImage(product.selectedColor ? (product.availableColors?.find(c => c.name === product.selectedColor)?.image || product.image) : product.image);
      setSelectedColorName(product.selectedColor || (product.availableColors?.[0]?.name || ''));
      setSelectedSize(product.selectedSize || (product.availableSizes?.[0] || ''));
    }
  }, [isOpen, product]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleAddToCartClick = () => {
    if (onAddToCart) {
      const augmentedProduct: ProductItem = {
        ...product,
        image: activeImage,
        selectedSize: selectedSize || product.selectedSize,
        selectedColor: selectedColorName || product.selectedColor,
      };
      onAddToCart(augmentedProduct);
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      id="interactive-image-lightbox-modal"
    >
      <div
        className="relative w-full max-w-5xl bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  4K Ultra-Clear Equipment Display
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {zoomLevel.toFixed(1)}x Zoom
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white truncate">
                {product.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close image viewer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main 4K Image Display Stage */}
        <div className="relative flex-grow flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-[360px] sm:min-h-[460px]">
          {/* Zoom & Pan Container */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`w-full h-full flex items-center justify-center p-4 relative select-none ${
              zoomLevel > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
            }`}
            onClick={() => {
              if (zoomLevel === 1) handleZoomIn();
            }}
          >
            <div
              style={{
                transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${
                  panPosition.y / zoomLevel
                }px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              }}
              className="relative max-w-full max-h-[58vh] flex items-center justify-center"
            >
              {imgError ? (
                <div className="w-80 h-80 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center p-6 text-center text-slate-300">
                  <ShieldCheck className="w-16 h-16 text-orange-500 mb-3" />
                  <div className="text-base font-bold text-white">{product.name}</div>
                  <div className="text-xs text-slate-400 mt-1">Certified Industrial Safety Equipment</div>
                </div>
              ) : (
                <img
                  src={activeImage || product.image}
                  alt={product.name}
                  onError={() => setImgError(true)}
                  className="max-w-full max-h-[56vh] object-contain rounded-2xl shadow-2xl pointer-events-none"
                  draggable={false}
                />
              )}
            </div>
          </div>

          {/* Floating Zoom Controls Bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 shadow-xl flex items-center gap-2 text-white text-xs z-20">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="font-mono font-bold px-2 text-slate-200">
              {Math.round(zoomLevel * 100)}%
            </span>

            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-700 mx-1" />

            <button
              onClick={handleResetZoom}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset Zoom & Pan"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Color & Size Selection Controls */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {/* Color Swatch Options (e.g. for Coveralls) */}
            {product.availableColors && product.availableColors.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Select Color Variant:
                </span>
                <div className="flex items-center gap-2">
                  {product.availableColors.map((col, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedColorName(col.name);
                        setActiveImage(col.image);
                        handleResetZoom();
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        selectedColorName === col.name
                          ? 'bg-orange-600/30 border-orange-500 text-white shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/40"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Picker */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Select Size:
                </span>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-hidden focus:border-orange-500 cursor-pointer"
                >
                  {product.availableSizes.map((sizeOption, idx) => (
                    <option key={idx} value={sizeOption}>
                      {sizeOption}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Price & Cart Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Baseline Rate</div>
              <div className="text-sm font-bold text-white font-mono">{product.currentMarketPrice || formatNaira(product.unitPriceEstimate)}</div>
            </div>

            {onAddToCart && (
              <button
                onClick={handleAddToCartClick}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {addedNotice ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                <span>{addedNotice ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>
            )}

            {onOpenQuote && (
              <button
                onClick={() => {
                  onClose();
                  onOpenQuote({
                    ...product,
                    selectedSize: selectedSize || product.selectedSize,
                    selectedColor: selectedColorName || product.selectedColor,
                  });
                }}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileCheck className="w-4 h-4 text-blue-400" />
                <span>Request Quote</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
