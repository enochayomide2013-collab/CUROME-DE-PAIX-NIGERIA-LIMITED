import React from 'react';
import { COMPANY_VALUES } from '../data/companyData';
import {
  ShieldCheck,
  Zap,
  MapPin,
  TrendingDown,
  Award,
  Users,
  CheckCircle,
  Sparkles,
  Truck,
  Flame,
} from 'lucide-react';

interface WhyChooseUsProps {
  onOpenQuote: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onOpenQuote }) => {
  const competitiveAdvantages = [
    {
      title: 'In-House Port Harcourt Manufacturing',
      desc: 'Unlike brokers who depend solely on foreign imports, Curome de Paix operates an active industrial garment and assembly facility in Port Harcourt. We cut, stitch, reinforce, and brand coveralls locally—delivering rapid turnaround when shutdown emergencies arise.',
      icon: MapPin,
      badge: 'Local Production Facility',
    },
    {
      title: 'International Safety Certified Standards',
      desc: 'Our workwear and PPE comply with global occupational health and safety benchmarks: EN ISO 11612 (Flame & Heat), NFPA 2112, ANSI Z89.1 (Helmets), ANSI Z87.1 (Eye Protection), and EN ISO 20345 (Steel-Toe Boots).',
      icon: Award,
      badge: 'Certified HSE Quality',
    },
    {
      title: 'Factory-Direct Pricing Without Middlemen',
      desc: 'Procure high-specification protective equipment at transparent, domestic rates. By cutting unnecessary broker markups, we protect your project budgets while providing superior material grades that outlast cheaper imports.',
      icon: TrendingDown,
      badge: 'Cost Optimization',
    },
    {
      title: 'Rapid 24–48h Dispatch in Rivers State & Niger Delta',
      desc: 'Strategically located off NTA Road, Port Harcourt, we maintain ready stock of helmets, glasses, safety boots, and standard coveralls. Emergency deliveries reach Bonny, Onne, Trans-Amadi, and Warri with minimal downtime.',
      icon: Truck,
      badge: 'Fast-Track Logistics',
    },
    {
      title: 'Precision Corporate Branding & Embroidery',
      desc: 'Equip your staff with pride. We provide high-density computerized embroidery, flame-resistant logo patches, heat-transferred reflective badges, and personalized personnel name/blood group tagging.',
      icon: Sparkles,
      badge: 'Custom Corporate Identity',
    },
    {
      title: 'Field-Proven in Harsh Oilfield Conditions',
      desc: 'Our fabrics and boot leathers are specifically tested to resist the humidity, corrosive saline offshore air, intense sun, mud, and oil chemicals encountered in Nigerian industrial environments.',
      icon: Flame,
      badge: 'Tested for Niger Delta',
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Curome de Paix Difference</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Why Leading Nigerian Companies{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              Trust Our Safety Gear
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            In high-risk energy, construction, and manufacturing operations, substandard safety gear is a
            liability. We combine authentic Nigerian craftsmanship with stringent global safety benchmarks to
            guarantee zero-compromise workforce protection.
          </p>
        </div>

        {/* 6 Grid Feature Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitiveAdvantages.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-orange-500/50 hover:bg-slate-800 transition-all duration-300 flex flex-col justify-between space-y-4 relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-700/90 text-slate-300 border border-slate-600">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center text-xs font-semibold text-orange-400">
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                  Guaranteed Compliance
                </div>
              </div>
            );
          })}
        </div>

        {/* Local Content Callout Bar */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-800 via-slate-800/95 to-slate-800 border border-orange-500/30 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Nigerian Oil & Gas Industry Content Development (NOGICD) Aligned</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Supporting Local Nigerian Capacity with Every Garment
            </h3>
            <p className="text-sm text-slate-300 max-w-2xl">
              By choosing Curome de Paix Nigeria Limited, you fulfill corporate Nigerian Content quotas, empower
              local Port Harcourt textile artisans, and ensure rapid, dependable supply chains.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={onOpenQuote}
              className="px-6 py-3 rounded-xl font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md text-sm active:scale-95 cursor-pointer"
              id="why-choose-us-quote-btn"
            >
              Request Company Proposal
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
