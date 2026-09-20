import React from 'react';
import { COMPANY_INFO, COMPANY_VALUES, LEADERSHIP_TEAM } from '../data/companyData';
import { Logo } from './Logo';
import {
  ShieldCheck,
  Target,
  Compass,
  MapPin,
  Award,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  Layers,
  HeartHandshake,
} from 'lucide-react';

export const AboutUsSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-slate-100/70 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-20">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-900 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
            <span>Our Heritage & Purpose</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            About Curome de Paix Nigeria Limited
          </h2>

          <p className="text-base text-slate-600 leading-relaxed font-normal">
            Rooted in Port Harcourt, Rivers State (RC-7473017)—empowering Nigeria's critical energy, fabrication, and
            industrial workforces with durable, certified personal protective equipment and engineering services.
          </p>
        </div>

        {/* 1. Company Story & What We Specialize In */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              The Journey & Foundation
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              Bridging the Gap Between International Safety Standards and Nigerian Craftsmanship
            </h3>

            <div className="text-sm sm:text-base text-slate-600 space-y-4 leading-relaxed font-normal">
              <p>
                <strong>Curome de Paix Nigeria Limited</strong> (trading as <em>Curome de Paix Energy Nigeria Limited / CPD Energy</em>, RC-7473017)
                was established in the industrial corridor of Port Harcourt to solve a major industry challenge:
                the dangerous prevalence of substandard safety gear and lengthy import delays that stalled oilfield and
                construction schedules.
              </p>
              <p>
                By establishing an agile garment tailoring and technical facility directly on <strong>Omodu Street off NTA Road, Port Harcourt</strong>,
                we combined precision pattern drafting, certified heavy-duty textiles, and heavy industrial sewing equipment.
                Today, we supply prominent engineering contractors, oil majors, maritime operators, and local enterprises
                with world-class PPE and engineering support delivered on demand.
              </p>
            </div>

            {/* Specialization Bullet Matrix */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-600" />
                <span>Core Areas of Specialization</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Heavy-Duty Industrial Cotton Coveralls</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cranial Impact Helmets with Ratchet</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Anti-Fog & UV Safety Eye Protection & Goggles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Puncture-Proof Steel-Toe Work Boots</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Computerized Corporate Logo Embroidery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mechanical & Structural Engineering Services</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-white relative">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
                alt="Curome de Paix Manufacturing & Inspection in Port Harcourt"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="p-6 bg-white space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-700">Headquarters & Operational Base:</span>
                  <span className="text-orange-600 font-bold">Port Harcourt, Rivers State</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our facility houses dedicated textile cutting tables, 12-needle industrial embroidery stations,
                  safety visor testing benches, and buffer warehousing for immediate Niger Delta site replenishment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl" />
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Corporate Mission</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To deliver uncompromising personal protective equipment and responsive technical engineering services
              that safeguards every worker on Nigerian soil—blending international HSE compliance with local
              Port Harcourt craftsmanship, rapid dispatch, and accessible current market pricing.
            </p>
          </div>

          {/* Vision */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Corporate Vision</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To be the most respected indigenous safety manufacturer and engineering partner across West Africa,
              setting the gold standard for domestic capacity, zero-tolerance quality control, and enduring client
              partnerships.
            </p>
          </div>
        </div>

        {/* 3. Company Values */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Core Cultural Pillars
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              The Values That Guide Every Garment & Contract
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COMPANY_VALUES.map((val, vIdx) => (
              <div
                key={vIdx}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 hover:border-orange-300 transition-colors"
              >
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200/60 uppercase">
                  {val.highlight}
                </span>
                <h4 className="text-base font-bold text-slate-900">{val.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Leadership & Key Team */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Management & Technical Direction
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              Executive Leadership
            </h3>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Our executive management is spearheaded by Engr. Adebayo, driving technical HSE standards and industrial procurement.
            </p>
          </div>

          <div className="flex justify-center">
            {LEADERSHIP_TEAM.map((member, mIdx) => (
              <div
                key={mIdx}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4 max-w-md w-full"
              >
                <div className="space-y-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                    {member.name.includes('Adebayo') ? (
                      <Logo />
                    ) : (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{member.name}</h4>
                    <p className="text-xs font-semibold text-orange-600">{member.role}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{member.experience}</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{member.bio}</p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                    Core Focus:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {member.expertise.map((exp, eIdx) => (
                      <span
                        key={eIdx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
