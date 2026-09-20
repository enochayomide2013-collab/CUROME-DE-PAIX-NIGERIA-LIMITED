import React from 'react';
import { ProductItem } from '../types';
import { formatNaira } from '../utils/communication';
import { EquipmentVisual } from './EquipmentVisual';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Check,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  onRemoveFromCompare: (productId: string) => void;
  onAddToCart: (product: ProductItem) => void;
  onClearCompare: () => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  onClose,
  products,
  onRemoveFromCompare,
  onAddToCart,
  onClearCompare,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Modal Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                    Technical Specifications Comparison
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-[11px] font-bold">
                    {products.length} {products.length === 1 ? 'Item' : 'Items'} Selected
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Side-by-side compliance, material durability, and procurement metrics for engineering sign-off.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {products.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCompare}
                  className="hidden sm:inline-flex text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Comparison"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body: Side-by-side comparison table */}
          <div className="p-4 sm:p-6 overflow-x-auto overflow-y-auto flex-grow">
            {products.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Scale className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No items selected to compare</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the "Compare" checkbox on any two safety gear or equipment cards to view their technical specifications side-by-side.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="min-w-[620px]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="w-1/4 p-4 text-left text-xs font-black uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-200 rounded-tl-2xl">
                        Product Specification
                      </th>
                      {products.map((prod) => (
                        <th
                          key={prod.id}
                          className="w-3/8 p-4 text-left bg-slate-50 border-b border-slate-200 first:border-l last:rounded-tr-2xl"
                        >
                          <div className="space-y-3">
                            <div className="relative group">
                              <div className="w-full h-36 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80">
                                <EquipmentVisual
                                  product={prod}
                                  activeImage={prod.image}
                                  selectedColor={
                                    prod.selectedColor
                                      ? prod.availableColors?.find((c) => c.name === prod.selectedColor)
                                      : prod.availableColors?.[0]
                                  }
                                  showBadge={false}
                                  altText={prod.name}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => onRemoveFromCompare(prod.id)}
                                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-slate-950/80 hover:bg-red-600 text-white flex items-center justify-center text-xs transition-colors cursor-pointer shadow-md z-20"
                                title="Remove from comparison"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                                {prod.category}
                              </span>
                              <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mt-0.5">
                                {prod.name}
                              </h4>
                              <div className="text-base font-black text-slate-900 mt-1">
                                {formatNaira(prod.unitPriceEstimate)}
                                <span className="text-[11px] font-normal text-slate-500 block">
                                  Market: {prod.currentMarketPrice}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => onAddToCart(prod)}
                              className="w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Requisition</span>
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="text-xs divide-y divide-slate-100">
                    {/* Safety Standards */}
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-bold text-slate-700 bg-slate-50/50 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-orange-600" />
                        <span>Safety Standards & Certifications</span>
                      </td>
                      {products.map((prod) => (
                        <td key={prod.id} className="p-4 align-top">
                          <div className="flex flex-wrap gap-1.5">
                            {prod.safetyStandards.map((std, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1"
                              >
                                <Check className="w-3 h-3 text-emerald-600" />
                                {std}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Minimum Order Qty */}
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-bold text-slate-700 bg-slate-50/50">
                        Minimum Order Quantity (MOQ)
                      </td>
                      {products.map((prod) => (
                        <td key={prod.id} className="p-4 align-top font-bold text-slate-900">
                          {prod.minOrderQty} {prod.minOrderQty > 1 ? 'Units' : 'Unit'} (Standard Pack)
                        </td>
                      ))}
                    </tr>

                    {/* Stock Status & Origin */}
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-bold text-slate-700 bg-slate-50/50 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>Stock & Dispatch SLA</span>
                      </td>
                      {products.map((prod) => (
                        <td key={prod.id} className="p-4 align-top">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                              In-Stock at Port Harcourt Warehouse
                            </span>
                            <p className="text-[11px] text-slate-500">
                              Omodu Street off NTA Road. Dispatched within 24–48 hours across Rivers State.
                            </p>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Key Technical Specs */}
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-bold text-slate-700 bg-slate-50/50 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-600" />
                        <span>Technical Specifications</span>
                      </td>
                      {products.map((prod) => (
                        <td key={prod.id} className="p-4 align-top">
                          <ul className="space-y-1.5 text-slate-600">
                            {prod.specifications.map((spec, specIdx) => (
                              <li key={specIdx} className="flex items-start gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                                <span>{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    {/* Color & Size Options */}
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-bold text-slate-700 bg-slate-50/50">
                        Available Variants & Sizing
                      </td>
                      {products.map((prod) => (
                        <td key={prod.id} className="p-4 align-top space-y-2">
                          {prod.availableColors && prod.availableColors.length > 0 ? (
                            <div>
                              <span className="text-[11px] font-bold text-slate-500 block mb-1">
                                Colors ({prod.availableColors.length}):
                              </span>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {prod.availableColors.map((col, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-800"
                                  >
                                    <span
                                      className="w-2 h-2 rounded-full border border-slate-400"
                                      style={{ backgroundColor: col.hex }}
                                    />
                                    {col.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Standard corporate colorway</span>
                          )}

                          {prod.availableSizes && prod.availableSizes.length > 0 && (
                            <div className="pt-1">
                              <span className="text-[11px] font-bold text-slate-500 block mb-1">
                                Sizing Range:
                              </span>
                              <p className="text-[11px] text-slate-700 font-semibold">
                                {prod.availableSizes.join(', ')}
                              </p>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Industrial Badges */}
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-bold text-slate-700 bg-slate-50/50 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Recommended Field Usage</span>
                      </td>
                      {products.map((prod) => (
                        <td key={prod.id} className="p-4 align-top">
                          <div className="flex flex-wrap gap-1.5">
                            {prod.badges.map((b, bIdx) => (
                              <span
                                key={bIdx}
                                className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
              <span>
                Need custom embroidery, corporate batch sizing, or an official Proforma Invoice? Our team responds within 30 minutes.
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
