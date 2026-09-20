import React, { useState, useEffect } from 'react';
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

  // Accessibility: Lock background scroll on small screens when drawer is open, and handle Escape key
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      if (window.innerWidth < 640) {
        document.body.style.overflow = 'hidden';
      }
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          playSoftPop();
          setIsOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  // Synthesize a soft, organic 'pop' / bubble sound effect using Web Audio API
  const playSoftPop = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Resonant lowpass filter to produce a warm, gentle acoustic pop without harsh high frequencies
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.Q.setValueAtTime(3, now);

      // Sine wave oscillator with frequency contour simulating a bubble pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pitch contour: quick upward swoop then swift gentle drop
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.022);
      osc.frequency.exponentialRampToValueAtTime(290, now + 0.08);

      // Smooth attack and decay envelope
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.095);
    } catch {
      // Safe fallback if audio context blocked
    }
  };

  const handleToggleChat = () => {
    playSoftPop();
    setIsOpen((prev) => !prev);
  };

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

        {/* Expanded Quick Message Dialog / Full-Height Drawer on Mobile Devices */}
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex flex-col h-[100dvh] w-full bg-white sm:h-auto sm:max-h-[38rem] sm:absolute sm:inset-auto sm:bottom-16 sm:right-0 sm:mb-2 sm:w-96 sm:rounded-3xl sm:border sm:border-slate-300/80 sm:shadow-2xl sm:overflow-hidden animate-in fade-in zoom-in-95 sm:origin-bottom-right duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Curome de Paix WhatsApp Procurement Desk"
            id="floating-whatsapp-drawer"
          >
            {/* Chat Header with Response Time & Trust Indicators */}
            <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-4 text-white shrink-0 sm:rounded-t-3xl shadow-md sm:shadow-none">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full bg-white/20 ring-2 ring-white/30 flex items-center justify-center font-bold text-base shadow-inner">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-emerald-900 shadow-xs" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm sm:text-base leading-tight text-white truncate flex items-center gap-1.5">
                      <span>Curome de Paix WhatsApp Desk</span>
                    </h4>
                    <p className="text-[11px] sm:text-xs text-emerald-100 font-medium flex items-center gap-1.5 mt-0.5">
                      <span>Port Harcourt Duty Desk</span>
                      <span>•</span>
                      <span className="text-emerald-200 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        Active Now
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playSoftPop();
                    setIsOpen(false);
                  }}
                  className="text-white/80 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-emerald-900/50 transition-colors cursor-pointer shrink-0"
                  aria-label="Close WhatsApp chat drawer"
                  id="close-whatsapp-chat-btn"
                >
                  <X className="w-6 h-6 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Response Time Indicator Badge for Extra Trust in Port Harcourt */}
              <div className="mt-3 pt-2.5 border-t border-emerald-600/60 flex items-center justify-between text-[11px] sm:text-xs text-emerald-50 bg-emerald-900/40 px-3 py-1.5 rounded-xl">
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

            {/* Body: Stretches smoothly to fill full screen height on mobile while maintaining desktop scroll box */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-4 bg-slate-50 space-y-4 sm:space-y-3 sm:max-h-80 overscroll-contain">
              <div className="p-3.5 sm:p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-xs text-slate-700 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-emerald-700">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Direct Technical Desk (Rivers State)</span>
                </div>
                <p className="leading-relaxed text-slate-600">
                  Connect directly with our local Port Harcourt procurement officers. Select a topic or type your specifications below:
                </p>
              </div>

              {/* Quick Greeting Chips */}
              <div className="space-y-2 sm:space-y-1.5">
                <span className="text-[11px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Quick Greeting Topics:
                </span>
                <div className="space-y-2 sm:space-y-1">
                  {quickPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        playSoftPop();
                        setSelectedMessage(p.text);
                      }}
                      className={`w-full text-left p-3 sm:p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer min-h-[44px] ${
                        selectedMessage === p.text
                          ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 active:bg-slate-100'
                      }`}
                    >
                      <span className="font-semibold pr-2">{p.label}</span>
                      <ChevronRight className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message preview / edit box */}
              <div className="space-y-2 sm:space-y-1">
                <span className="text-[11px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Message Preview / Custom Specifications:
                </span>
                <textarea
                  rows={4}
                  value={selectedMessage}
                  onChange={(e) => setSelectedMessage(e.target.value)}
                  className="w-full p-3 sm:p-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-normal shadow-inner leading-relaxed min-h-[90px] sm:min-h-[72px]"
                  placeholder="Type your message for Curome de Paix..."
                />
              </div>
            </div>

            {/* Footer Trigger with High Contrast, Finger-friendly Height and Safe Area Padding */}
            <div className="p-4 sm:p-3 bg-white border-t border-slate-200 shrink-0 sm:rounded-b-3xl pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-3">
              <button
                onClick={() => handleLaunchWhatsApp()}
                className="w-full py-4 sm:py-3.5 px-4 rounded-2xl sm:rounded-xl font-black text-xs sm:text-xs text-white bg-emerald-950 hover:bg-black transition-all duration-200 flex items-center justify-center gap-2 shadow-xl border-2 border-emerald-500 hover:border-emerald-400 cursor-pointer active:scale-98 tracking-wide uppercase min-h-[48px]"
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
          onClick={handleToggleChat}
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

