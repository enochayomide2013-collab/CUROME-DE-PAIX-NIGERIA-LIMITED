import React, { useState, useEffect } from 'react';
import { ProductItem, ColorVariant } from '../types';
import { getAllLiveProducts, publishAdonProduct, deleteLiveProduct, subscribeToProducts } from '../utils/productsManager';
import { formatNaira } from '../utils/communication';
import {
  PackagePlus,
  Sparkles,
  Check,
  Trash2,
  Image as ImageIcon,
  Layers,
  Tag,
  Shield,
  Palette,
  Ruler,
  AlertCircle,
  ExternalLink,
  Eye,
  RefreshCw,
  Plus,
  X,
  Footprints,
  Flame,
  ShieldAlert,
  HardHat,
} from 'lucide-react';

const PRESET_PHOTOS = [
  {
    label: 'Heavy-Duty Site Boot',
    category: 'boots',
    url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Rigger Pull-On Boot',
    category: 'boots',
    url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Refinery Workwear / Coverall',
    category: 'coveralls',
    url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Orange Boiler Suit',
    category: 'coveralls',
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Safety Hard Hat',
    category: 'helmets',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Full-Brim Helmet',
    category: 'helmets',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Ballistic Glasses',
    category: 'glasses',
    url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Fall Arrest Harness',
    category: 'fall_protection',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Fire Extinguisher',
    category: 'extinguishers',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'High-Vis Safety Vest',
    category: 'safety_gear',
    url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1000&q=80',
  },
];

const PRESET_COLORS: ColorVariant[] = [
  { name: 'Petroleum Orange', hex: '#c2410c', image: '' },
  { name: 'Royal Navy Blue', hex: '#1d4ed8', image: '' },
  { name: 'High-Vis Yellow', hex: '#eab308', image: '' },
  { name: 'Safety Green', hex: '#15803d', image: '' },
  { name: 'Industrial Red', hex: '#b91c1c', image: '' },
  { name: 'Matte Oilfield Black', hex: '#18181b', image: '' },
  { name: 'Industrial White', hex: '#ffffff', image: '' },
  { name: 'Heavy Oiled Tan Brown', hex: '#78350f', image: '' },
];

const BOOT_SIZES = ['Euro 38', 'Euro 39', 'Euro 40', 'Euro 41', 'Euro 42', 'Euro 43', 'Euro 44', 'Euro 45', 'Euro 46', 'Euro 47', 'Euro 48'];
const CLOTHING_SIZES = ['Small (S)', 'Medium (M)', 'Large (L)', 'Extra Large (XL)', '2X-Large (2XL)', '3X-Large (3XL)', '4X-Large (4XL)'];
const UNIVERSAL_SIZES = ['Universal Standard Fit', 'Adjustable (52 - 64 cm)', 'Wide Frame Fit'];

interface AdonProductPublisherProps {
  onProductPublished?: (product: ProductItem) => void;
}

export const AdonProductPublisher: React.FC<AdonProductPublisherProps> = ({ onProductPublished }) => {
  // Live products in store
  const [liveProducts, setLiveProducts] = useState<ProductItem[]>(() => getAllLiveProducts());

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductItem['category']>('boots');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [unitPrice, setUnitPrice] = useState<number>(35000);
  const [marketPrice, setMarketPrice] = useState('₦32,000 - ₦38,000');
  const [minQty, setMinQty] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState(PRESET_PHOTOS[0].url);
  const [inStock, setInStock] = useState<boolean>(true);

  // Specifications
  const [specs, setSpecs] = useState<string[]>([
    'Safety Rating: S3 SRC Certified',
    'Toe Protection: 200 Joules forged steel cap with rubber bumper',
    'Sole: Deep mud cleats, puncture-resistant steel midsole',
  ]);
  const [newSpecInput, setNewSpecInput] = useState('');

  // Sizes
  const [selectedSizes, setSelectedSizes] = useState<string[]>([
    'Euro 40', 'Euro 41', 'Euro 42', 'Euro 43', 'Euro 44', 'Euro 45'
  ]);
  const [customSizeInput, setCustomSizeInput] = useState('');

  // Colors
  const [selectedColors, setSelectedColors] = useState<ColorVariant[]>([
    { name: 'Heavy Oiled Tan Brown', hex: '#78350f', image: PRESET_PHOTOS[0].url },
    { name: 'Matte Oilfield Black', hex: '#18181b', image: PRESET_PHOTOS[1].url },
  ]);

  // Standards and Badges
  const [standards, setStandards] = useState<string>('EN ISO 20345:2011 S3 SRC, CE Certified Site Safety');
  const [badges, setBadges] = useState<string>('Adon Published, Heavy Duty, Fast Dispatch');

  // Feedback states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub = subscribeToProducts((updated) => {
      setLiveProducts(updated);
    });
    return unsub;
  }, []);

  // Category change helper to adjust default sizes and specs
  const handleCategoryChange = (newCat: ProductItem['category']) => {
    setCategory(newCat);
    if (newCat === 'boots') {
      setSelectedSizes(['Euro 40', 'Euro 41', 'Euro 42', 'Euro 43', 'Euro 44', 'Euro 45']);
      setSpecs([
        'Safety Rating: EN ISO 20345:2011 S3 SRC',
        'Impact Protection: 200J steel toe cap with scuff guard',
        'Midsole: High-tensile steel puncture-resistant underplate',
        'Tread: Oil, acid & slip-resistant polyurethane cleat tread',
      ]);
      const match = PRESET_PHOTOS.find((p) => p.category === 'boots');
      if (match) setImageUrl(match.url);
    } else if (newCat === 'coveralls') {
      setSelectedSizes(['Medium (M)', 'Large (L)', 'Extra Large (XL)', '2X-Large (2XL)']);
      setSpecs([
        'Material: 260 GSM Heavy-Duty Poly-Cotton Twill weave',
        'Reflective: 50mm Hi-Vis 3M industrial wash silver stripes',
        'Hardware: Dual two-way heavy-duty brass zippers & reinforced stress seams',
      ]);
      const match = PRESET_PHOTOS.find((p) => p.category === 'coveralls');
      if (match) setImageUrl(match.url);
    } else if (newCat === 'helmets') {
      setSelectedSizes(['Standard Adjustable (52 - 64 cm)', 'Large / Extra Large']);
      setSpecs([
        'Impact Rating: EN 397:2012 Certified HDPE shell',
        'Suspension: 6-point textile cradle with ratchet wheel knob',
        'Accessories: Universal 30mm side slots for ear defenders and visors',
      ]);
      const match = PRESET_PHOTOS.find((p) => p.category === 'helmets');
      if (match) setImageUrl(match.url);
    } else if (newCat === 'glasses') {
      setSelectedSizes(['Universal Ergonomic Fit', 'Over-The-Glasses (OTG) Fit']);
      setSpecs([
        'Lens: 2.2mm Ballistic optical-grade polycarbonate',
        'Coating: Anti-fog hydrophobic barrier + scratch-resistant coating',
        'Filtration: 99.9% UVA/UVB protection (UV400)',
      ]);
      const match = PRESET_PHOTOS.find((p) => p.category === 'glasses');
      if (match) setImageUrl(match.url);
    } else {
      setSelectedSizes(['Universal Standard Fit']);
      setSpecs([
        'Industrial standard specification certified for Nigerian field operations',
        'Heavy-duty construction tested for durability and safety compliance',
      ]);
    }
  };

  // Spec management
  const handleAddSpec = () => {
    if (!newSpecInput.trim()) return;
    setSpecs([...specs, newSpecInput.trim()]);
    setNewSpecInput('');
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  // Size management
  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleAddCustomSize = () => {
    if (!customSizeInput.trim()) return;
    if (!selectedSizes.includes(customSizeInput.trim())) {
      setSelectedSizes([...selectedSizes, customSizeInput.trim()]);
    }
    setCustomSizeInput('');
  };

  // Color management
  const toggleColorPreset = (preset: ColorVariant) => {
    const exists = selectedColors.some((c) => c.name === preset.name);
    if (exists) {
      setSelectedColors(selectedColors.filter((c) => c.name !== preset.name));
    } else {
      setSelectedColors([...selectedColors, { ...preset, image: imageUrl }]);
    }
  };

  // Publish handler
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter a product name.');
      return;
    }

    if (!imageUrl.trim()) {
      setErrorMsg('Please provide a picture/image URL.');
      return;
    }

    if (!unitPrice || unitPrice <= 0) {
      setErrorMsg('Please enter a valid unit price.');
      return;
    }

    setIsSubmitting(true);

    try {
      const parsedStandards = standards
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const parsedBadges = badges
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean);

      const newProduct: Omit<ProductItem, 'id'> = {
        name: name.trim(),
        category,
        subtitle: subtitle.trim() || `${name.trim()} - Industrial Safety Standard`,
        description:
          description.trim() ||
          `Engineered for rigorous industrial and construction environments across Nigeria. Manufactured with premium materials for maximum protection and durability.`,
        specifications: specs.length > 0 ? specs : ['Complies with factory safety and durability specifications.'],
        safetyStandards: parsedStandards.length > 0 ? parsedStandards : ['CE Certified', 'Factory Quality Assured'],
        unitPriceEstimate: Number(unitPrice),
        currentMarketPrice: marketPrice.trim() || `₦${(unitPrice * 0.95).toLocaleString()} - ₦${(unitPrice * 1.1).toLocaleString()}`,
        minOrderQty: Math.max(1, Number(minQty) || 1),
        image: imageUrl.trim(),
        badges: parsedBadges.length > 0 ? parsedBadges : ['Adon Published', 'In Stock'],
        inStock,
        availableSizes: selectedSizes.length > 0 ? selectedSizes : ['Standard Universal Fit'],
        availableColors:
          selectedColors.length > 0
            ? selectedColors.map((c) => ({ ...c, image: c.image || imageUrl.trim() }))
            : [{ name: 'Standard Industrial', hex: '#c2410c', image: imageUrl.trim() }],
      };

      const published = publishAdonProduct(newProduct);
      setSuccessMsg(`"${published.name}" has been published and is now immediately live on the Curome page!`);

      if (onProductPublished) {
        onProductPublished(published);
      }

      // Reset main input fields for next entry
      setName('');
      setSubtitle('');
      setDescription('');

      setTimeout(() => {
        setSuccessMsg(null);
      }, 5000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to publish item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete/unpublish handler
  const handleDelete = (productId: string, productName: string) => {
    if (confirm(`Remove "${productName}" from the live Curome store?`)) {
      deleteLiveProduct(productId);
      setSuccessMsg(`"${productName}" has been unpublished from the store.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-950/70 via-slate-900 to-amber-950/40 p-4 sm:p-5 rounded-2xl border border-orange-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-orange-600 text-white text-[11px] font-black uppercase tracking-wider">
              Adon Inventory Publisher
            </span>
            <span className="text-xs text-orange-300 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Instant Live Website Deployment
            </span>
          </div>
          <h4 className="text-lg sm:text-xl font-black text-white mt-1">
            Add New Equipment to Curome Web Store
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Publish new boots, coveralls, helmets, safety goggles, or gear with photos, colors, specs, and size options. Items appear immediately across the site.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-right shrink-0">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Live Products</div>
          <div className="text-xl font-black text-amber-400 font-mono">{liveProducts.length} Items</div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5 font-bold">
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="p-1 rounded hover:bg-emerald-900/60 text-emerald-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/90 border border-red-500/80 text-red-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5 font-bold">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="p-1 rounded hover:bg-red-900/60 text-red-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column (7 cols) */}
        <form onSubmit={handlePublish} className="lg:col-span-7 space-y-5">
          {/* Section 1: Basic Info */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
              <PackagePlus className="w-4 h-4" />
              <span>1. Item Name & Category</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Steel-Toe Rigmaster Mud Boot S3 SRC"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Store Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value as ProductItem['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    <option value="boots">Boots (Construction & Rig Safety Boots)</option>
                    <option value="coveralls">Coveralls (Heavy-Duty Workwear & Suits)</option>
                    <option value="helmets">Helmets (Safety Helmets & Hard Hats)</option>
                    <option value="glasses">Glasses (Safety Glasses & Goggles)</option>
                    <option value="fall_protection">Fall Protection (Harnesses & Lanyards)</option>
                    <option value="extinguishers">Extinguishers (Fire Suppression)</option>
                    <option value="safety_gear">Safety Gear (PPE Vests & First Aid)</option>
                    <option value="accessories">Accessories & Spares</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Subtitle / Quick Highlight
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. 200J Steel Cap with Deep Mud Cleats"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Unit Price (₦ NGN) *
                  </label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    min={500}
                    step={500}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Market Price Range
                  </label>
                  <input
                    type="text"
                    value={marketPrice}
                    onChange={(e) => setMarketPrice(e.target.value)}
                    placeholder="e.g. ₦34,000 - ₦38,000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Min Order Qty (MOQ)
                  </label>
                  <input
                    type="number"
                    value={minQty}
                    onChange={(e) => setMinQty(Number(e.target.value))}
                    min={1}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Picture Selection & Presets */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                <ImageIcon className="w-4 h-4" />
                <span>2. Picture & Equipment Photo</span>
              </div>
              <span className="text-[11px] text-slate-400">Click preset or paste URL</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Image Web URL *
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Quick 1-Click Photo Presets */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 mb-2">
                Fast 1-Click Equipment Photos:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {PRESET_PHOTOS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer group flex flex-col items-center ${
                      imageUrl === preset.url
                        ? 'border-orange-500 bg-orange-950/40 ring-2 ring-orange-500/50'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-600'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-12 rounded-lg object-cover"
                    />
                    <span className="text-[10px] font-bold text-slate-300 text-center truncate w-full mt-1">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Available Sizes (Options that can be picked from) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                <Ruler className="w-4 h-4" />
                <span>3. Available Sizes (Options Customers Can Pick)</span>
              </div>
              <span className="text-[11px] text-amber-400 font-bold font-mono">
                {selectedSizes.length} sizes active
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Select which sizes will appear in the customer's size dropdown selector on the website:
            </p>

            {/* Presets by Type */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400">Quick Footwear Sizes (Euro):</div>
              <div className="flex flex-wrap gap-1.5">
                {BOOT_SIZES.map((sz) => {
                  const isSelected = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] font-bold text-slate-400 pt-2">Clothing / Workwear Sizes:</div>
              <div className="flex flex-wrap gap-1.5">
                {CLOTHING_SIZES.map((sz) => {
                  const isSelected = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] font-bold text-slate-400 pt-2">Universal / Adjustable:</div>
              <div className="flex flex-wrap gap-1.5">
                {UNIVERSAL_SIZES.map((sz) => {
                  const isSelected = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom size addition */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={customSizeInput}
                onChange={(e) => setCustomSizeInput(e.target.value)}
                placeholder="Add custom size (e.g. 5XL or 6kg Cylinder)"
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSize();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCustomSize}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                + Add Size
              </button>
            </div>
          </div>

          {/* Section 4: Available Colors */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                <Palette className="w-4 h-4" />
                <span>4. Available Colors (Customer Swatch Options)</span>
              </div>
              <span className="text-[11px] text-amber-400 font-bold font-mono">
                {selectedColors.length} colors active
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Click to toggle which color variants are available for this product:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_COLORS.map((color) => {
                const isSelected = selectedColors.some((c) => c.name === color.name);
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => toggleColorPreset(color)}
                    className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'border-orange-500 bg-orange-950/30'
                        : 'border-slate-800 bg-slate-900/60 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white/30 shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs font-bold text-slate-200 truncate">{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Description & Specs */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
              <Shield className="w-4 h-4" />
              <span>5. Description & Technical Specifications</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Detailed Product Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe features, fabric weight, protection rating, oilfield resilience..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Specifications bullet points */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Technical Specifications (Bullet Points):
              </label>
              <div className="space-y-1.5 mb-3">
                {specs.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                      <span className="truncate">{spec}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(index)}
                      className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpecInput}
                  onChange={(e) => setNewSpecInput(e.target.value)}
                  placeholder="e.g. Breathable sweat-absorbing padded collar"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSpec();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  + Add Spec
                </button>
              </div>
            </div>

            {/* Standards & Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Safety Standards (comma-separated)
                </label>
                <input
                  type="text"
                  value={standards}
                  onChange={(e) => setStandards(e.target.value)}
                  placeholder="EN ISO 20345:2011, CE Certified"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Marketing Badges (comma-separated)
                </label>
                <input
                  type="text"
                  value={badges}
                  onChange={(e) => setBadges(e.target.value)}
                  placeholder="Adon Published, Heavy Duty, In Stock"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-orange-600/30 hover:scale-[1.01] active:scale-99 transition-all cursor-pointer"
              id="adon-publish-submit-btn"
            >
              <PackagePlus className="w-5 h-5" />
              <span>Publish Immediately to Curome Page</span>
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              Once published, this item instantly appears in the store, quote builder, and cart with selected sizes & colors!
            </p>
          </div>
        </form>

        {/* Live Preview Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-orange-400" />
                <span>Live Website Card Preview</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                Real-Time Render
              </span>
            </div>

            {/* Mocked Website Card */}
            <div className="rounded-2xl border border-slate-800 bg-white text-slate-900 shadow-2xl overflow-hidden">
              {/* Product Image Stage */}
              <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                <img
                  src={imageUrl || PRESET_PHOTOS[0].url}
                  alt={name || 'New Equipment'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PRESET_PHOTOS[0].url;
                  }}
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-orange-600 text-white text-[10px] font-bold shadow-md">
                    Adon Published
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold">
                    MOQ: {minQty} pcs
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-xs text-white text-xs font-mono font-bold">
                  {formatNaira(unitPrice)}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                    {category.toUpperCase()}
                  </span>
                  <h5 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                    {name || 'Sample Product Title (e.g. Steel-Toe Rig Boot)'}
                  </h5>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {subtitle || 'High-specification engineering PPE for Port Harcourt operations'}
                  </p>
                </div>

                {/* Size Preview */}
                <div>
                  <div className="text-[10px] font-bold text-slate-600 mb-1">
                    Available Size Options ({selectedSizes.length}):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedSizes.slice(0, 5).map((sz) => (
                      <span
                        key={sz}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                      >
                        {sz}
                      </span>
                    ))}
                    {selectedSizes.length > 5 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-600 text-[9px] font-bold">
                        +{selectedSizes.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Color Swatches */}
                <div>
                  <div className="text-[10px] font-bold text-slate-600 mb-1">
                    Colors ({selectedColors.length}):
                  </div>
                  <div className="flex items-center gap-1.5">
                    {selectedColors.map((col) => (
                      <span
                        key={col.name}
                        title={col.name}
                        className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: col.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Button Mock */}
                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <div className="flex-1 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs text-center">
                    Add to Requisition
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs text-center">
                    Quote
                  </div>
                </div>
              </div>
            </div>

            {/* Current Active Catalog Summary */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Store Inventory Management
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {liveProducts.length} Items Live
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {liveProducts.map((p) => {
                  const isCustom = p.id.startsWith('adon-');
                  return (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-700"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-200 truncate">{p.name}</div>
                          <div className="text-[10px] text-orange-400 font-mono">
                            {formatNaira(p.unitPriceEstimate)} • {p.category}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isCustom && (
                          <span className="px-1.5 py-0.5 rounded-md bg-orange-950 text-orange-400 text-[9px] font-bold border border-orange-800/40">
                            Custom Adon
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Unpublish from store"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
