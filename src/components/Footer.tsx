import React, { useState } from 'react';
import { Logo } from './Logo';
import { COMPANY_INFO } from '../data/companyData';
import { getWhatsAppUrl, getPhoneCallUrl, getMailToUrl, copyToClipboard } from '../utils/communication';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  Clock,
  ArrowUp,
  Heart,
  ShoppingBag,
  Bot,
  FileCheck,
  Copy,
  Check,
  Star,
} from 'lucide-react';

interface FooterProps {
  onOpenQuote: () => void;
  onOpenCart?: () => void;
  onOpenContract?: () => void;
  onOpenCuriAI?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenQuote,
  onOpenCart,
  onOpenContract,
  onOpenCuriAI,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    const success = await copyToClipboard(COMPANY_INFO.email);
    if (success) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      {/* Top Banner with Trust Badges */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200">Certified PPE Standards</div>
              <div className="text-[11px] text-slate-500">EN 397, ANSI Z87.1, ASTM F2413 / S3</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200">Port Harcourt Base</div>
              <div className="text-[11px] text-slate-500">Omodu Street off NTA Road, Rivers State</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200">Rapid Dispatch</div>
              <div className="text-[11px] text-slate-500">24-48 Hours across Rivers & Niger Delta</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200">Indigenous Capacity (RC-7473017)</div>
              <div className="text-[11px] text-slate-500">NOGICD Act Aligned Manufacturing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-4 space-y-4">
            <Logo variant="horizontal" size="md" theme="dark" />
            <p className="text-slate-400 leading-relaxed font-normal text-xs pr-4">
              <strong>Curome de Paix Nigeria Limited</strong> (trading as Curome de Paix Energy Nigeria Limited,{' '}
              <strong className="text-slate-300">{COMPANY_INFO.rcNumber}</strong>) is a premier
              Nigerian industrial safety workwear manufacturer and engineering solutions partner. Delivering
              heavy-duty coveralls, cranial impact helmets, ballistic glasses, and heavy-durability work boots directly
              from Port Harcourt.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-orange-400 text-[10px] font-bold uppercase tracking-wider">
                {COMPANY_INFO.rcNumber}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-orange-950/80 text-orange-300 text-[10px] font-bold uppercase tracking-wider border border-orange-800/50">
                Port Harcourt, Rivers State
              </span>
            </div>
          </div>

          {/* Col 2: Core Safety Products */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Safety PPE Products
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#products" className="hover:text-orange-400 transition-colors">
                  Heavy-Duty Cotton Twill Coveralls
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-orange-400 transition-colors">
                  Safety Helmets with Wheel Ratchet Suspension
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-orange-400 transition-colors">
                  Anti-Fog & UV Safety Glasses / Goggles
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-orange-400 transition-colors">
                  Steel-Toe Industrial Work Boots (S3 SRC)
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-orange-400 transition-colors">
                  Offshore Pull-On Heavy Rigger Boots
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Tools */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Tools & Services
            </h4>
            <ul className="space-y-2 text-slate-400">
              {onOpenCart && (
                <li>
                  <button
                    onClick={onOpenCart}
                    className="hover:text-orange-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
                    <span>Procurement Cart</span>
                  </button>
                </li>
              )}
              {onOpenContract && (
                <li>
                  <button
                    onClick={onOpenContract}
                    className="hover:text-orange-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Provision Contract</span>
                  </button>
                </li>
              )}
              {onOpenCuriAI && (
                <li>
                  <button
                    onClick={onOpenCuriAI}
                    className="hover:text-orange-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Curi AI Assistant</span>
                  </button>
                </li>
              )}
              <li>
                <a href="#ratings" className="hover:text-amber-400 text-amber-300 font-semibold transition-colors flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Ratings & Client Reviews</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-orange-400 transition-colors">
                  Mechanical Engineering
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-orange-400 transition-colors">
                  Structural Steel Fabrication
                </a>
              </li>
              <li>
                <a href="#faq-section" className="hover:text-orange-400 transition-colors">
                  Frequently Asked Questions (FAQ)
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenQuote}
                  className="text-orange-400 hover:text-orange-300 font-bold transition-colors cursor-pointer"
                >
                  Quote Estimator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Direct Contact Desk
            </h4>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Omodu Street off NTA Road, PORT HARCOURT RIVERS</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <a href={getPhoneCallUrl()} className="hover:text-white font-semibold">
                  {COMPANY_INFO.phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 font-semibold text-emerald-400"
                >
                  WhatsApp: {COMPANY_INFO.whatsappNumber}
                </a>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                  <a href={getMailToUrl()} className="hover:text-white font-semibold truncate text-xs">
                    {COMPANY_INFO.email}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  title="Copy email address"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenQuote}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Launch Quote Estimator</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} <strong>Curome de Paix Nigeria Limited</strong> ({COMPANY_INFO.rcNumber}). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Port Harcourt, Rivers State</span>
            <span>•</span>
            <span>Quality HSE Equipment & Technical Engineering</span>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors ml-2"
              title="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
