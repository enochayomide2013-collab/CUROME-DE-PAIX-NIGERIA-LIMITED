import React, { useState, useEffect } from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { ProductItem, ColorVariant } from '../types';
import { getAllLiveProducts, subscribeToProducts } from '../utils/productsManager';
import { formatNaira, copyToClipboard } from '../utils/communication';
import { ImageLightboxModal } from './ImageLightboxModal';
import { ProductCompareModal } from './ProductCompareModal';
import { EquipmentVisual } from './EquipmentVisual';
import { motion, AnimatePresence } from 'motion/react';
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
  Scale,
  X,
  ArrowRight,
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

  // Product Comparison state (Side-by-side technical specs)
  const [compareList, setCompareList] = useState<ProductItem[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  const handleToggleCompare = (product: ProductItem) => {
    const isAlreadyIn = compareList.some((item) => item.id === product.id);
    if (isAlreadyIn) {
      setCompareList((prev) => prev.filter((item) => item.id !== product.id));
    } else {
      if (compareList.length >= 3) {
        // Replace first item if full (up to 3 items)
        setCompareList((prev) => [...prev.slice(1), product]);
      } else {
        setCompareList((prev) => [...prev, product]);
      }
    }
  };

  const handleRemoveFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCompare = () => {
    setCompareList([]);
    setIsCompareModalOpen(false);
  };

  // Dynamic live products synced with Admin Adon section
  const [liveProducts, setLiveProducts] = useState<ProductItem[]>(() => getAllLiveProducts());

  useEffect(() => {
    const unsubscribe = subscribeToProducts((updated) => {
      setLiveProducts(updated);
    });
    return unsubscribe;
  }, []);

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
      ? liveProducts
      : liveProducts.filter((p) => p.category === activeCategory);

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleColorChange = (productId: string, color: ColorVariant) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: color }));
    setBrokenImages((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
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
            {/* Direct Side-by-Side Comparison Action */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => {
                  if (compareList.length === 0 && liveProducts.length > 0) {
                    // Pre-select two high-demand industrial items from live products
                    setCompareList([liveProducts[0], liveProducts[1] || liveProducts[0]]);
                  }
                  setIsCompareModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/20 transition-all cursor-pointer"
                id="open-side-by-side-compare-btn"
              >
                <Scale className="w-4 h-4 text-amber-200" />
                <span>
                  {compareList.length >= 2
                    ? `Compare ${compareList.length} Items Side-by-Side`
                    : 'Open Side-by-Side Specs Comparison'}
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[11px]">
                  {compareList.length > 0 ? `${compareList.length}/3 selected` : 'Live Demo'}
                </span>
              </motion.button>
              <span className="text-xs text-slate-500 hidden sm:inline">
                Click <strong>"Compare"</strong> on any product card below to benchmark standards & prices.
              </span>
            </div>
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

        {/* Category Filter Pills with elevated micro-interactions */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
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
                    ? liveProducts.length
                    : liveProducts.filter((p) => p.category === cat.id).length}
                </span>
              </motion.button>
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
            const isCompared = compareList.some((item) => item.id === product.id);

            return (
              <motion.div
                key={product.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`group bg-white rounded-2xl border shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  isCompared
                    ? 'ring-2 ring-orange-500 border-orange-400 shadow-orange-500/10'
                    : 'border-slate-200/90'
                }`}
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
                    <EquipmentVisual
                      product={product}
                      activeImage={activeImage}
                      selectedColor={activeColorObj}
                      showBadge={true}
                      altText={product.name}
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20 pointer-events-none">
                      {product.badges.map((b, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/90 backdrop-blur-xs text-white uppercase tracking-wider shadow-sm"
                        >
                          {b}
                        </span>
                      ))}
                    </div>

                    {/* Stock & Location Tag */}
                    {product.inStock && (
                      <div className="absolute bottom-3 left-3 z-20 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600/95 text-white shadow-sm flex items-center gap-1 pointer-events-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
                        <span>In Stock • Port Harcourt</span>
                      </div>
                    )}

                    {/* Zoom Hint */}
                    <div className="absolute bottom-3 right-3 z-20 text-[10px] text-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-xs font-semibold pointer-events-none">
                      <ZoomIn className="w-3.5 h-3.5 text-orange-400" />
                      <span>4K Preview</span>
                    </div>
                  </div>

                  {/* Content & Options */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCompare(product);
                          }}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                            isCompared
                              ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                              : 'bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 border-slate-200'
                          }`}
                          title="Compare side-by-side technical specs"
                        >
                          <Scale className="w-3 h-3" />
                          <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                        </motion.button>
                        <button
                          type="button"
                          onClick={() => setSelectedProductDetails(product)}
                          className="text-[11px] font-bold text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          Specs
                        </button>
                      </div>
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
                              <motion.button
                                key={idx}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
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

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCartClick(product)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                          : 'bg-orange-600 hover:bg-orange-500 text-white hover:shadow-orange-500/30'
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
                    </motion.button>
                  </div>
                </div>
              </motion.div>
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
                <EquipmentVisual
                  product={selectedProductDetails}
                  activeImage={selectedProductDetails.image}
                  selectedColor={
                    selectedColors[selectedProductDetails.id] ||
                    selectedProductDetails.availableColors?.[0]
                  }
                  showBadge={true}
                  altText={selectedProductDetails.name}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none z-20">
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

        {/* Floating Side-by-Side Comparison Drawer Bar */}
        <AnimatePresence>
          {compareList.length > 0 && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl bg-slate-950/95 text-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-orange-500/40 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white tracking-wide">
                      Technical Compare
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-orange-500 text-slate-950 text-[10px] font-black">
                      {compareList.length} / 3 Items
                    </span>
                  </div>
                  {/* Small thumbnails preview */}
                  <div className="flex items-center gap-1.5 mt-1 overflow-x-auto">
                    {compareList.map((item) => (
                      <div
                        key={item.id}
                        className="relative group flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] text-slate-300"
                      >
                        <span className="truncate max-w-[90px] sm:max-w-[120px] font-medium">{item.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFromCompare(item.id)}
                          className="hover:text-red-400 cursor-pointer ml-1"
                          title="Remove"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleClearCompare}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Clear
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setIsCompareModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-950 transition-all cursor-pointer"
                >
                  <span>Compare Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Technical Product Comparison Modal */}
        <ProductCompareModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          products={compareList}
          onRemoveFromCompare={handleRemoveFromCompare}
          onAddToCart={(product) => {
            handleAddToCartClick(product);
          }}
          onClearCompare={handleClearCompare}
        />
      </div>
    </section>
  );
};
