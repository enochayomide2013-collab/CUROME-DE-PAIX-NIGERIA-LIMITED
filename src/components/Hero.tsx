import React from 'react';
import { Logo } from './Logo';
import { COMPANY_INFO } from '../data/companyData';
import { getWhatsAppUrl, getPhoneCallUrl } from '../utils/communication';
import {
  ShieldCheck,
  HardHat,
  Eye,
  Footprints,
  Phone,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Factory,
  Award,
  ShoppingBag,
  FileCheck,
  Sparkles,
  Star,
  Flame,
  Truck,
} from 'lucide-react';

interface HeroProps {
  onOpenQuote: () => void;
  onOpenCart: () => void;
  onOpenContract: () => void;
  onNavigateToContact: () => void;
  onNavigateToProducts: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenQuote,
  onOpenCart,
  onOpenContract,
  onNavigateToContact,
  onNavigateToProducts,
}) => {
  return (
    <section
      id="home"
      className="relative pt-32 sm:pt-36 lg:pt-40 pb-16 lg:pb-24 overflow-hidden bg-gradient-to-b from-slate-100/90 via-white to-slate-50"
    >
      {/* Subtle industrial grid background effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* Decorative gradient glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-orange-400/15 via-blue-500/10 to-amber-300/15 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Trust Pill, Ratings Badge & Track Order Pill */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200/80 text-orange-950 text-xs font-bold tracking-wide">
                <span className="flex h-2 w-2 rounded-full bg-orange-600 animate-ping" />
                <span className="uppercase text-[11px] tracking-wider text-orange-900 font-extrabold">
                  RC-7473017 • Port Harcourt Manufacturing & Engineering
                </span>
              </div>

              <a
                href="#orders"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer group"
                id="hero-track-order-pill"
              >
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                <span>Orders & Tracking (1000 - 999T)</span>
              </a>

              <a
                href="#ratings"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300/80 text-amber-950 text-xs font-bold transition-all shadow-2xs cursor-pointer group"
                id="hero-ratings-pill"
                title="View verified client ratings & rate Curome de Paix"
              >
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <span>4.9 / 5.0 Rating</span>
                <span className="text-amber-800 font-semibold group-hover:text-amber-950 underline text-[11px]">
                  • Rate Us
                </span>
              </a>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Industrial Safety PPE & Engineering Built for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-blue-700">
                Nigerian Operations
              </span>
            </h1>

            {/* Short Explanation */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl font-normal">
              <strong className="text-slate-900 font-bold">Curome de Paix Nigeria Limited</strong>{' '}
              (RC-7473017) is your trusted manufacturer and supplier of certified safety workwear, construction boots,
              fire extinguishers, fall protection harnesses, and engineering services in Port Harcourt.
              We specialize in tailor-made <strong className="text-slate-900">heavy-duty coveralls</strong>,{' '}
              <strong className="text-slate-900">high-ankle construction boots</strong>, certified{' '}
              <strong className="text-slate-900">fire extinguishers</strong>, impact{' '}
              <strong className="text-slate-900">safety helmets</strong>, and industrial safety gear—safeguarding teams across
              civil construction, oil & gas, maritime, and manufacturing.
            </p>

            {/* Key product badges highlight */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 pb-2">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Heavy Coveralls</div>
                  <div className="text-[10px] text-slate-500">100% Cotton Twill</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                  <HardHat className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Safety Helmets</div>
                  <div className="text-[10px] text-slate-500">EN 397 / Ratchet</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Safety Harnesses</div>
                  <div className="text-[10px] text-slate-500">EN 361 Fall Arrest</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 shadow-2xs">
                <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-950">Pay on Delivery</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Port Harcourt & Rivers</div>
                </div>
              </div>
            </div>

            {/* Strong Call to Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#orders"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-600/30 hover:shadow-xl transition-all active:scale-95 cursor-pointer"
                id="hero-track-order-cta-btn"
              >
                <Truck className="w-4 h-4 text-white" />
                <span>Orders & Tracking</span>
              </a>

              <button
                onClick={onOpenCart}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                id="hero-open-cart-btn"
              >
                <ShoppingBag className="w-4 h-4 text-orange-400" />
                <span>Procurement Cart</span>
              </button>

              <button
                onClick={onOpenContract}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                id="hero-provision-contract-btn"
              >
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Provision Contract</span>
              </button>

              <button
                onClick={onOpenQuote}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all active:scale-95 cursor-pointer"
                id="hero-get-started-btn"
              >
                <Award className="w-4 h-4 text-orange-600" />
                <span>Request Quote</span>
              </button>

              <a
                href={getWhatsAppUrl(
                  'Hello Curome de Paix Nigeria Limited! I am visiting your website and would like a direct consultation on safety coveralls, helmets, glasses, boots, and engineering services.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-all shadow-xs"
                id="hero-whatsapp-direct-btn"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Trust points footer */}
            <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Direct Port Harcourt Factory Pickup
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Fast 24-48h Delivery across Rivers State
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Custom Corporate Embroidery
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual Card with Brand Logo & Product Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200/80 relative overflow-hidden">
                {/* Accent top banner */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-blue-600" />

                {/* Company Logo Display Card */}
                <div className="text-center pb-5 border-b border-slate-100">
                  <Logo variant="full" size="lg" className="border-0 shadow-none p-0 bg-transparent" />
                  <p className="text-xs font-semibold text-slate-500 mt-2">
                    RC-7473017 • Omodu St off NTA Rd, Port Harcourt
                  </p>
                </div>

                {/* Quick Interactive Summary of Manufacturing Capabilities */}
                <div className="mt-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Core PPE & Engineering Rates
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      Current Market Estimates
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Item 1 */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                          CV
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">Heavy-Duty Coveralls (HD-100)</div>
                          <div className="text-[10px] text-slate-500">100% Cotton, 3M Reflective Striping</div>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 text-right">
                        ₦28,500 <span className="text-[10px] font-normal text-slate-500">/ unit</span>
                      </span>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                          <HardHat className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">Safety Helmets (Ratchet Wheel)</div>
                          <div className="text-[10px] text-slate-500">CE EN 397 & Chin Strap Harness</div>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 text-right">
                        ₦8,500 <span className="text-[10px] font-normal text-slate-500">/ unit</span>
                      </span>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                          <Eye className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">Anti-Fog Safety Glasses</div>
                          <div className="text-[10px] text-slate-500">ANSI Z87.1 Polycarbonate Shield</div>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 text-right">
                        ₦4,200 <span className="text-[10px] font-normal text-slate-500">/ unit</span>
                      </span>
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Footprints className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">Steel-Toe Work Boots (S3)</div>
                          <div className="text-[10px] text-slate-500">Anti-Puncture Kevlar & Oil Resistant</div>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 text-right">
                        ₦38,000 <span className="text-[10px] font-normal text-slate-500">/ unit</span>
                      </span>
                    </div>
                  </div>

                  {/* Action row in card */}
                  <div className="pt-3 flex items-center gap-2">
                    <button
                      onClick={onOpenCart}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-center text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                      id="card-open-cart-btn"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
                      <span>Assemble Cart</span>
                    </button>
                    <button
                      onClick={onNavigateToProducts}
                      className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                      id="card-view-all-products-btn"
                    >
                      View Specs
                    </button>
                  </div>
                </div>

                {/* Direct office badge */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium">Omodu St, Off NTA Rd, PH</span>
                  <a href={getPhoneCallUrl()} className="text-orange-600 font-bold hover:underline">
                    Hotline: {COMPANY_INFO.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
