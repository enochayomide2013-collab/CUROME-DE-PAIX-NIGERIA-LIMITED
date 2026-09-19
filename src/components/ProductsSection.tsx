import React, { useState } from 'react';
import { PRODUCTS_CATALOG, COMPANY_INFO } from '../data/companyData';
import { ProductItem, ColorVariant } from '../types';
import { formatNaira, copyToClipboard } from '../utils/communication';
import { ImageLightboxModal } from './ImageLightboxModal';
import {
  ShieldCheck,
  HardHat,
  Eye,
  Footprints,
  Check,
  ShoppingBag,
  Info,
  Layers,
  Copy,
  ZoomIn,
  Flame,
  ShieldAlert,
  Package,
} from 'lucide-react';

interface ProductsSectionProps {
  onOpenQuoteWithProduct: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  onOpenQuoteWithProduct,
  onAddToCart,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProductDetails, setSelectedProductDetails] = useState<ProductItem | null>(null);
  const [lightboxProduct, setLightboxProduct] = useState<ProductItem | null>(null);
  const [addedNoticeId, setAddedNoticeId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Local state for size and color selection per product ID
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, ColorVariant>>({});

  const categories = [
    { id: 'all', label: 'All Safety Equipment & Workwear', icon: Layers },
    { id: 'boots', label: 'Construction & Rig Safety Boots', icon: Footprints },
    { id: 'extinguishers', label: 'Fire Extinguishers & Blankets', icon: Flame },
    { id: 'fall_protection', label: 'Fall Protection & Harnesses', icon: ShieldAlert },
    { id: 'safety_gear', label: 'Site PPE, Vests & Medical', icon: Package },
    { id: 'coveralls', label: 'Heavy-Duty Coveralls', icon: ShieldCheck },
    { id: 'helmets', label: 'Safety Helmets', icon: HardHat },
    { id: 'glasses', label: 'Safety Glasses & Goggles', icon: Eye },
  ];

  const filteredProducts =
    activeCategory === 'all'
      ? PRODUCTS_CATALOG
      : PRODUCTS_CATALOG.filter((p) => p.category === activeCategory);

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleColorChange = (productId: string, color: ColorVariant) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: color }));
  };

  const handleAddToCartClick = (product: ProductItem) => {
    const chosenSize = selectedSizes[product.id] || (product.availableSizes?.[0] || '');
    const chosenColorObj = selectedColors[product.id];
    const chosenColorName = chosenColorObj ? chosenColorObj.name : (product.availableColors?.[0]?.name || '');
    const chosenImage = chosenColorObj ? chosenColorObj.image : product.image;

    const augmentedProduct: ProductItem = {
      ...product,
      image: chosenImage,
      selectedSize: chosenSize,
      selectedColor: chosenColorName,
    };

    onAddToCart(augmentedProduct);
    setAddedNoticeId(product.id);
    setTimeout(() => setAddedNoticeId(null), 2000);
  };

  const handleCopyEmail = async () => {
    const success = await copyToClipboard(COMPANY_INFO.email);
    if (success) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleImageError = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="products" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-slate-200">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-900 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                <span>Certified Industrial Protective Equipment (RC-7473017)</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-extrabold uppercase tracking-wider shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Payment on Delivery (POD) Available</span>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Safety Boots, Extinguishers, Coveralls & Site Equipment
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Manufactured and supplied directly from our Port Harcourt facility off NTA Road. Fully equipped with
              certified construction steel-toe boots, DCP & CO2 fire extinguishers, fall arrest safety harnesses,
              heavy-duty work coveralls (in multiple 4K color display options), impact helmets, anti-fog eye protection, high-visibility vests, and site safety gear.
              Pick your required equipment size and color, click any item for a high-res display preview, and transmit your procurement cart.
            </p>
          </div>

          {/* Pricing & Transmission Note */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-xs text-slate-600 max-w-xs space-y-2">
            <div className="font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-orange-600" />
                <span>Market Pricing Baseline</span>
              </span>
              <button
                onClick={handleCopyEmail}
                className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200"
                title="Copy company email"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
              </button>
            </div>
            <p className="text-[11px] leading-relaxed">
              Rates reflect prevailing Nigerian market benchmarks. Assemble your cart to transmit custom specifications
              directly to <strong className="text-slate-800 font-mono">{COMPANY_INFO.email}</strong>.
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
                id={`product-tab-${cat.id}`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-orange-400' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-slate-800 text-orange-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {cat.id === 'all'
                    ? PRODUCTS_CATALOG.length
                    : PRODUCTS_CATALOG.filter((p) => p.category === cat.id).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isJustAdded = addedNoticeId === product.id;
            const isImgBroken = brokenImages[product.id];
            const activeColorObj = selectedColors[product.id];
            const activeImage = activeColorObj ? activeColorObj.image : product.image;
            const currentSelectedSize = selectedSizes[product.id] || (product.availableSizes?.[0] || '');

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
                id={`product-card-${product.id}`}
              >
                <div>
                  {/* Interactive Product Image Container */}
                  <div
                    className="relative h-64 w-full overflow-hidden bg-slate-900 cursor-pointer select-none"
                    onClick={() => {
                      const activeColor = selectedColors[product.id]?.name;
                      setLightboxProduct({
                        ...product,
                        image: activeImage,
                        selectedSize: currentSelectedSize,
                        selectedColor: activeColor,
                      });
                    }}
                  >
                    {isImgBroken ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-300 bg-slate-800">
                        <ShieldCheck className="w-12 h-12 text-orange-400 mb-2" />
                        <span className="font-bold text-xs text-white">{product.name}</span>
                        <span className="text-[10px] text-slate-400 mt-1">Certified Industrial Gear</span>
                      </div>
                    ) : (
                      <img
                        src={activeImage}
                        alt={product.name}
                        onError={() => handleImageError(product.id)}
                        className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                      {product.badges.map((b, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/90 backdrop-blur-xs text-white uppercase tracking-wider shadow-sm"
                        >
                          {b}
                        </span>
                      ))}
                    </div>

                    {/* Active Selected Color Badge on Image */}
                    {product.availableColors && product.availableColors.length > 0 && (
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md text-[10px] font-bold text-white border border-slate-700/80 shadow-md animate-in fade-in">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/60 shrink-0"
                          style={{ backgroundColor: activeColorObj?.hex || product.availableColors[0]?.hex }}
                        />
                        <span>{activeColorObj?.name || product.availableColors[0]?.name}</span>
                      </div>
                    )}

                    {/* Stock & Location Tag */}
                    {product.inStock && (
                      <div className="absolute bottom-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600/95 text-white shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
                        <span>In Stock • Port Harcourt</span>
                      </div>
                    )}

                    {/* Zoom Hint */}
                    <div className="absolute bottom-3 right-3 text-[10px] text-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-xs font-semibold">
                      <ZoomIn className="w-3.5 h-3.5 text-orange-400" />
                      <span>4K Preview</span>
                    </div>
                  </div>

                  {/* Content & Options */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                        {product.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedProductDetails(product)}
                        className="text-[11px] font-bold text-slate-500 hover:text-orange-600 transition-colors cursor-pointer"
                      >
                        Details & Standards
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{product.subtitle}</p>

                    {/* Color Swatch Options (e.g. Red, Blue, Yellow, Green, Orange Coveralls) */}
                    {product.availableColors && product.availableColors.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-700">Color Variant:</span>
                          <span className="font-semibold text-orange-600">
                            {activeColorObj?.name || product.availableColors[0]?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {product.availableColors.map((col, idx) => {
                            const isSelected = (activeColorObj?.name || product.availableColors![0]?.name) === col.name;
                            return (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleColorChange(product.id, col);
                                }}
                                className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                                  isSelected ? 'scale-125 border-orange-600 ring-2 ring-orange-200' : 'border-white hover:scale-110 shadow-xs'
                                }`}
                                style={{ backgroundColor: col.hex }}
                                title={col.name}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Size Selector for Equipment */}
                    {product.availableSizes && product.availableSizes.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <label className="block text-[11px] font-bold text-slate-700">
                          Select Size / Fit:
                        </label>
                        <select
                          value={currentSelectedSize}
                          onChange={(e) => handleSizeChange(product.id, e.target.value)}
                          className="w-full p-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-inner"
                        >
                          {product.availableSizes.map((sz, idx) => (
                            <option key={idx} value={sz}>
                              {sz}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Specifications List preview */}
                    <ul className="space-y-1 text-xs text-slate-600 pt-1">
                      {product.specifications.slice(0, 2).map((spec, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer of Card with Pricing and Action Buttons */}
                <div className="p-5 pt-0 border-t border-slate-100 mt-2">
                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                        Prevailing Rate
                      </span>
                      <span className="text-base font-extrabold text-slate-900 font-mono">
                        {product.currentMarketPrice || formatNaira(product.unitPriceEstimate)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Min. Order: {product.minOrderQty} pcs
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCartClick(product)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-orange-600 hover:bg-orange-500 text-white hover:shadow-orange-500/30 active:scale-95'
                      }`}
                      title="Add selected size & color to procurement cart"
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Image Lightbox Modal */}
        <ImageLightboxModal
          isOpen={lightboxProduct !== null}
          onClose={() => setLightboxProduct(null)}
          product={lightboxProduct}
          onAddToCart={onAddToCart}
          onOpenQuote={onOpenQuoteWithProduct}
        />

        {/* Detailed Specs Modal */}
        {selectedProductDetails && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setSelectedProductDetails(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                    Product Technical Sheet • RC-7473017
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    {selectedProductDetails.name}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedProductDetails.subtitle}</p>
                </div>
                <button
                  onClick={() => setSelectedProductDetails(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Clickable Image Preview with Lightbox Trigger */}
              <div
                className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group"
                onClick={() => {
                  const p = selectedProductDetails;
                  setSelectedProductDetails(null);
                  setLightboxProduct(p);
                }}
              >
                <img
                  src={selectedProductDetails.image}
                  alt={selectedProductDetails.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="px-4 py-2 rounded-xl bg-slate-900/90 text-white text-xs font-bold flex items-center gap-2 shadow-lg group-hover:scale-105 transition-transform">
                    <ZoomIn className="w-4 h-4 text-orange-400" />
                    <span>View High-Resolution 4K Equipment Display</span>
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-700">
                <p className="leading-relaxed">{selectedProductDetails.description}</p>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 text-xs uppercase tracking-wider">
                    Full Technical Specifications
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {selectedProductDetails.specifications.map((spec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-2 text-xs uppercase tracking-wider">
                    Compliance & Safety Accreditations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProductDetails.safetyStandards.map((std, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-white text-blue-800 font-bold text-xs border border-blue-200 shadow-2xs"
                      >
                        {std}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400 block">Current Market Price Baseline:</span>
                    <span className="text-xl font-black text-amber-400 font-mono">
                      {selectedProductDetails.currentMarketPrice ||
                        formatNaira(selectedProductDetails.unitPriceEstimate)}
                    </span>
                    <span className="text-xs text-slate-400 block">
                      Minimum order quantity: {selectedProductDetails.minOrderQty} units
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        handleAddToCartClick(selectedProductDetails);
                        setSelectedProductDetails(null);
                      }}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 font-bold text-xs text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => {
                        const prod = selectedProductDetails;
                        setSelectedProductDetails(null);
                        onOpenQuoteWithProduct(prod);
                      }}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white transition-colors cursor-pointer"
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
