import React, { useState } from 'react';
import { ENGINEERING_SERVICES, COMPANY_INFO } from '../data/companyData';
import { ServiceItem, CartItem } from '../types';
import { getWhatsAppUrl } from '../utils/communication';
import {
  ShieldCheck,
  HardHat,
  Award,
  Flame,
  CheckCircle,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Wrench,
  Cpu,
  FileCheck,
  ShoppingBag,
  CheckCircle2,
  Maximize2,
  X,
  ZoomIn,
} from 'lucide-react';

interface ServicesSectionProps {
  onOpenQuote: (serviceTitle?: string) => void;
  onAddServiceToCart?: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenQuote,
  onAddServiceToCart,
}) => {
  const [addedServiceId, setAddedServiceId] = useState<string | null>(null);
  const [zoomedService, setZoomedService] = useState<{ title: string; image: string; desc: string } | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const serviceImages: Record<string, string> = {
    'mechanical-equipment-engineering':
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
    'structural-fabrication-welding':
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80',
    'custom-coverall-tailoring':
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=80',
    'full-ppe-procurement':
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=900&q=80',
    'corporate-branding':
      'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=900&q=80',
    'hse-technical-site-audits':
      'https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?auto=format&fit=crop&w=900&q=80',
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench':
        return Wrench;
      case 'Cpu':
        return Cpu;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'HardHat':
        return HardHat;
      case 'Award':
        return Award;
      case 'FileCheck':
        return FileCheck;
      default:
        return Sparkles;
    }
  };

  const handleAddService = (service: ServiceItem) => {
    if (onAddServiceToCart) {
      onAddServiceToCart(service);
      setAddedServiceId(service.id);
      setTimeout(() => setAddedServiceId(null), 2000);
    }
  };

  return (
    <section id="services" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Wrench className="w-3.5 h-3.5 text-blue-600" />
            <span>Industrial Engineering & PPE Services (RC-7473017)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Mechanical Engineering & Industrial Services
          </h2>

          <p className="text-base text-slate-600 leading-relaxed font-normal">
            Beyond PPE manufacturing, Curome de Paix delivers certified mechanical maintenance, structural steel
            fabrication, custom workwear tailoring, and technical site compliance engineering across Port Harcourt
            and the Niger Delta.
          </p>
        </div>

        {/* Services Showcase Cards */}
        <div className="mt-14 space-y-12">
          {ENGINEERING_SERVICES.map((service, index) => {
            const Icon = getServiceIcon(service.iconName);
            const isReversed = index % 2 !== 0;
            const isJustAdded = addedServiceId === service.id;

            return (
              <div
                key={service.id}
                className={`p-6 sm:p-8 rounded-3xl bg-slate-50/70 border border-slate-200/90 hover:border-slate-300 transition-all flex flex-col ${
                  isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
                } gap-8 lg:gap-12 items-center`}
                id={`service-item-${service.id}`}
              >
                {/* Visual Image representation */}
                <div
                  className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-md relative group h-72 sm:h-80 cursor-pointer bg-slate-900"
                  onClick={() =>
                    setZoomedService({
                      title: service.title,
                      image:
                        serviceImages[service.id] ||
                        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
                      desc: service.fullDesc,
                    })
                  }
                >
                  {brokenImages[service.id] ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-300 bg-slate-800">
                      <Wrench className="w-12 h-12 text-orange-400 mb-2" />
                      <span className="font-bold text-xs text-white">{service.title}</span>
                      <span className="text-[10px] text-slate-400 mt-1">Curome Engineering Operations</span>
                    </div>
                  ) : (
                    <img
                      src={
                        serviceImages[service.id] ||
                        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80'
                      }
                      alt={service.title}
                      onError={() => setBrokenImages((prev) => ({ ...prev, [service.id]: true }))}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />
                  )}

                  {/* Interactive Inspect Button */}
                  <div className="absolute top-3 right-3 z-10 opacity-90 group-hover:opacity-100 transition-opacity">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-xs border border-white/20 shadow-md">
                      <Maximize2 className="w-3 h-3 text-orange-400" />
                      <span>Inspect</span>
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                    <div className="text-white space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                        Operational Field Application
                      </div>
                      <div className="text-sm font-semibold flex flex-wrap gap-1.5">
                        {service.industries.map((ind, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs text-[11px]"
                          >
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Text & Deliverables */}
                <div className="w-full lg:w-1/2 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Service Scope #{index + 1}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    {service.fullDesc}
                  </p>

                  {/* Key Deliverables */}
                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Guaranteed Deliverables:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.deliverables.map((deliv, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action row with Add to Cart for Engineer service! */}
                  <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-3">
                    {onAddServiceToCart && (
                      <button
                        onClick={() => handleAddService(service)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                        id={`btn-add-service-cart-${service.id}`}
                      >
                        {isJustAdded ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                            <span>Added to Cart!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
                            <span>Add Service to Cart</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => onOpenQuote(service.title)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                      id={`btn-service-quote-${service.id}`}
                    >
                      <span>Request Proposal</span>
                      <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
                    </button>

                    <a
                      href={getWhatsAppUrl(
                        `Hello Curome de Paix Nigeria Limited, I am interested in discussing your "${service.title}" for our project in Rivers State.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Service Image Zoom Modal */}
      {zoomedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setZoomedService(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full bg-slate-900">
              <img
                src={zoomedService.image}
                alt={zoomedService.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setZoomedService(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 text-xs font-bold uppercase tracking-wider">
                Field Operations & Engineering Delivery
              </div>
              <h3 className="text-xl font-black text-slate-900">{zoomedService.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{zoomedService.desc}</p>
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    const title = zoomedService.title;
                    setZoomedService(null);
                    onOpenQuote(title);
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs cursor-pointer transition-colors shadow-sm"
                >
                  Request Quote for this Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
