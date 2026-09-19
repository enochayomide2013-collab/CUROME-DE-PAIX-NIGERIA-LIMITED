import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { getWhatsAppUrl } from '../utils/communication';
import { MessageSquare, X, Send, Sparkles, Clock, CheckCheck, ShieldCheck, ChevronRight, ShieldAlert } from 'lucide-react';
import { SecretAdminOrdersModal } from './SecretAdminOrdersModal';

interface FloatingWhatsAppProps {
  onTrackOrderInTracker?: (ticketId: string) => void;
  isOpenAdmin?: boolean;
  onOpenAdmin?: () => void;
  onCloseAdmin?: () => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  onTrackOrderInTracker,
  isOpenAdmin,
  onOpenAdmin,
  onCloseAdmin,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(COMPANY_INFO.defaultWhatsAppGreeting);
  const [internalAdminOpen, setInternalAdminOpen] = useState(false);

  const isAdminOpen = isOpenAdmin !== undefined ? isOpenAdmin : internalAdminOpen;

  const playAudioFeedback = (type: 'hover' | 'click') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.18);
      }
    } catch {
      // Safe fallback if audio context blocked
    }
  };

  const handleOpenAdmin = () => {
    if (onOpenAdmin) {
      onOpenAdmin();
    } else {
      setInternalAdminOpen(true);
    }
  };
  const handleCloseAdmin = () => {
    if (onCloseAdmin) {
      onCloseAdmin();
    } else {
      setInternalAdminOpen(false);
    }
  };

  const quickPrompts = [
    {
      label: 'Standard Inquiries',
      text: 'Hello Curome de Paix Nigeria Limited, I am reaching out from your website to inquire about your industrial safety products and engineering services.',
    },
    {
      label: 'Coveralls & Workwear',
      text: 'Hello Curome de Paix, I would like to inquire about ordering custom heavy-duty protective work coveralls with corporate embroidery.',
    },
    {
      label: 'Helmets & Safety Glasses',
      text: 'Hello Curome de Paix, we need a price quote for ratchet safety helmets (with chin straps) and anti-fog safety glasses.',
    },
    {
      label: 'Steel-Toe Work Boots',
      text: 'Hello Curome de Paix, I want to check availability for heavy-duty steel-toe work boots in Port Harcourt.',
    },
    {
      label: 'Emergency Site Supply',
      text: 'URGENT: Hello Curome de Paix team, we have an emergency PPE supply need for an ongoing site in Rivers State.',
    },
  ];

  const handleLaunchWhatsApp = (textToSend?: string) => {
    const msg = textToSend || selectedMessage;
    window.open(getWhatsAppUrl(msg), '_blank');
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2" id="floating-whatsapp-widget">
        {/* Secret small red icon that looks like a subtle hardware status indicator */}
        <button
          onClick={() => {
            playAudioFeedback('click');
            handleOpenAdmin();
          }}
          onMouseEnter={() => playAudioFeedback('hover')}
          className="group relative w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-red-600/90 hover:bg-red-500 hover:scale-125 transition-all duration-300 flex items-center justify-center shadow-lg border border-red-400/80 cursor-pointer"
          title="Logistics Gateway Indicator"
          aria-label="Internal Logistics Operations Console"
          id="secret-logistics-admin-trigger"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white opacity-90 group-hover:animate-ping" />
          <span className="sr-only">Secret Admin Logistics Portal</span>
        </button>

        {/* Expanded Quick Message Dialog */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 mb-2 w-80 sm:w-96 rounded-3xl bg-white shadow-2xl border border-slate-300/80 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
            {/* Chat Header with Response Time & Trust Indicators */}
            <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-white/20 ring-2 ring-white/30 flex items-center justify-center font-bold text-base shadow-inner">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-emerald-900 shadow-xs" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm leading-tight text-white flex items-center gap-1.5">
                      <span>Curome de Paix WhatsApp Desk</span>
                    </h4>
                    <p className="text-[11px] text-emerald-100 font-medium flex items-center gap-1 mt-0.5">
                      <span>Port Harcourt Duty Desk</span>
                      <span>•</span>
                      <span className="text-emerald-200 font-semibold">Active Now</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-emerald-900/50 transition-colors"
                  aria-label="Close WhatsApp chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Response Time Indicator Badge for Extra Trust in Port Harcourt */}
              <div className="mt-3 pt-2.5 border-t border-emerald-600/60 flex items-center justify-between text-[11px] text-emerald-50 bg-emerald-900/40 px-2.5 py-1.5 rounded-xl">
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span>Response time: <strong className="text-white font-bold">Typically under 5 mins</strong></span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-300 font-bold bg-emerald-800/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  <CheckCheck className="w-3 h-3" />
                  <span>Online Desk</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 bg-slate-50 space-y-3 max-h-80 overflow-y-auto">
              <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-xs text-slate-700 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px] text-emerald-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Direct Technical Desk (Rivers State)</span>
                </div>
                <p className="leading-relaxed">
                  Connect directly with our local Port Harcourt procurement officers. Select a topic or type your specifications below:
                </p>
              </div>

              {/* Quick Greeting Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Quick Greeting Topics:
                </span>
                <div className="space-y-1">
                  {quickPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedMessage(p.text);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                        selectedMessage === p.text
                          ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span>{p.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message preview / edit box */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Message Preview:
                </span>
                <textarea
                  rows={3}
                  value={selectedMessage}
                  onChange={(e) => setSelectedMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-normal shadow-inner"
                />
              </div>
            </div>

            {/* Footer Trigger with High Contrast and Font Weight */}
            <div className="p-3 bg-white border-t border-slate-200">
              <button
                onClick={() => handleLaunchWhatsApp()}
                className="w-full py-3.5 px-4 rounded-xl font-black text-xs text-white bg-emerald-950 hover:bg-black transition-all duration-200 flex items-center justify-center gap-2 shadow-xl border-2 border-emerald-500 hover:border-emerald-400 cursor-pointer active:scale-98 tracking-wide uppercase"
                id="send-whatsapp-floating-btn"
              >
                <Send className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-white drop-shadow-xs">Launch WhatsApp Chat (+234 9169039015)</span>
              </button>
            </div>
          </div>
        )}

        {/* Floating Pill / Button with Smooth Scale-Up Animation on Hover */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 ease-out cursor-pointer hover:scale-105 active:scale-95 ring-2 ring-white/80"
          id="floating-whatsapp-toggle-btn"
          aria-label="Chat with Curome de Paix on WhatsApp"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-6" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
          </div>
          <div className="text-left leading-tight hidden sm:block">
            <div className="text-xs font-extrabold tracking-tight">Chat on WhatsApp</div>
            <div className="text-[10px] text-emerald-100 font-semibold flex items-center gap-1">
              <span>+234 9169039015</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
            </div>
          </div>
        </button>
      </div>

      {/* Secret Admin Modal */}
      <SecretAdminOrdersModal
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
        onTrackOrderInTracker={onTrackOrderInTracker}
      />
    </>
  );
};

