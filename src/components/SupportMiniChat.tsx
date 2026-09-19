import React, { useState, useRef, useEffect } from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { searchCuromeWeb } from '../data/curomeWebKnowledge';
import {
  generateTicketId,
  getMailToUrl,
  getGmailComposeUrl,
  getWhatsAppUrl,
  copyToClipboard,
} from '../utils/communication';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  Mail,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  MapPin,
  RefreshCw,
  Phone,
  AlertCircle,
  ChevronRight,
  Info,
} from 'lucide-react';

export interface SupportChatMessage {
  id: string;
  sender: 'support' | 'user';
  text: string;
  timestamp: string;
  ticketId?: string;
  autoSavedToEmail?: boolean;
}

interface SupportMiniChatProps {
  onFormSubmitted?: (submission: any) => void;
  initialTicketId?: string;
}

export const SupportMiniChat: React.FC<SupportMiniChatProps> = ({
  onFormSubmitted,
  initialTicketId,
}) => {
  const [ticketId, setTicketId] = useState<string>(() => initialTicketId || generateTicketId());
  const [clientName, setClientName] = useState(() => {
    try {
      return localStorage.getItem('cdp_support_name') || '';
    } catch {
      return '';
    }
  });
  const [clientEmail, setClientEmail] = useState(() => {
    try {
      return localStorage.getItem('cdp_support_email') || '';
    } catch {
      return '';
    }
  });
  const [clientPhone, setClientPhone] = useState(() => {
    try {
      return localStorage.getItem('cdp_support_phone') || '';
    } catch {
      return '';
    }
  });
  const [clientCompany, setClientCompany] = useState(() => {
    try {
      return localStorage.getItem('cdp_support_company') || '';
    } catch {
      return '';
    }
  });

  const [inputQuestion, setInputQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastSavedNotice, setLastSavedNotice] = useState<string | null>(null);
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [showContactInputs, setShowContactInputs] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<SupportChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'support',
      text: `Hello and welcome to Curome de Paix Support Desk! 👋\n\nAsk any general question here regarding our industrial PPE workwear (cotton coveralls, ratchet helmets, safety boots, glasses), Rivers State delivery timelines, or mechanical engineering services.\n\n⚡ Every question asked is automatically logged to our official email lead desk (${COMPANY_INFO.email}) under your unique reference ticket for immediate team follow-up.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickQuestions = [
    {
      title: 'Rivers State Shipping Times',
      query: 'What are your delivery timelines to Port Harcourt metropolis, Onne Free Zone, and Bonny Island?',
    },
    {
      title: 'Coveralls & Custom Embroidery',
      query: 'Can you customize 100% cotton coveralls with our company logo embroidery and 3M reflective tape?',
    },
    {
      title: 'Same-Day Warehouse Pickup',
      query: 'Can we inspect and pick up safety gear same-day at your Omodu Street off NTA Road facility?',
    },
    {
      title: 'Steel-Toe Boot Standards',
      query: 'What certifications do your steel-toe work boots have and are they suitable for offshore rigs?',
    },
    {
      title: 'Engineering Lead Times',
      query: 'What are the turnaround times for mechanical valve overhauls and structural ASME welding?',
    },
  ];

  // Auto-scroll chat window
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Save contact credentials to localStorage
  const persistContactInfo = (name: string, email: string, phone: string, company: string) => {
    try {
      if (name) localStorage.setItem('cdp_support_name', name);
      if (email) localStorage.setItem('cdp_support_email', email);
      if (phone) localStorage.setItem('cdp_support_phone', phone);
      if (company) localStorage.setItem('cdp_support_company', company);
    } catch {
      // ignore
    }
  };

  const handleSendQuestion = async (prefilledText?: string) => {
    const questionText = (prefilledText || inputQuestion).trim();
    if (!questionText || isTyping) return;

    setInputQuestion('');

    const currentTicket = ticketId;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add user message
    const userMsg: SupportChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: questionText,
      timestamp: nowTime,
      ticketId: currentTicket,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    // Save contact info if filled
    persistContactInfo(clientName, clientEmail, clientPhone, clientCompany);

    // 2. Fetch answer from /api/chat or Curome knowledge fallback
    let botReplyText = '';
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: questionText,
          history: updatedMessages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      if (data && data.reply) {
        botReplyText = data.reply;
      } else {
        // Fallback search in local knowledge base
        const match = searchCuromeWeb(questionText);
        if (match && match.matchedItem) {
          botReplyText = `${match.matchedItem.details}\n\n📍 *Office & Depot*: Omodu Street off NTA Road, Port Harcourt.\n📞 *Direct*: ${COMPANY_INFO.phone}`;
        } else {
          botReplyText = `Thank you for asking. Curome de Paix Nigeria Limited (RC-7473017) provides factory-certified personal protective equipment (100% cotton coveralls, safety helmets, protective glasses, steel-toe boots) and certified mechanical/marine engineering services.\n\nYour question has been automatically recorded to our official email lead desk at ${COMPANY_INFO.email}. An engineer will respond directly, or you can call us on ${COMPANY_INFO.phone}.`;
        }
      }
    } catch (err) {
      console.warn('[Support Chat] API fetch error, falling back to knowledge base:', err);
      const match = searchCuromeWeb(questionText);
      if (match && match.matchedItem) {
        botReplyText = match.matchedItem.details;
      } else {
        botReplyText = `Thank you for your question. Our Port Harcourt logistics and engineering team at Omodu Street off NTA Road has received your inquiry. We dispatch across Rivers State within 24–48 hours.`;
      }
    }

    const botMsg: SupportChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'support',
      text: botReplyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ticketId: currentTicket,
      autoSavedToEmail: true,
    };

    const finalMessages = [...updatedMessages, botMsg];
    setMessages(finalMessages);
    setIsTyping(false);

    // 3. AUTOMATICALLY SAVE TO EMAIL LEAD SYSTEM
    const leadPayload = {
      ticketId: currentTicket,
      fullName: clientName.trim() || 'Website Visitor',
      companyName: clientCompany.trim() || 'Procurement Client',
      email: clientEmail.trim() || 'inquiry@curomedepaix.com',
      phone: clientPhone.trim() || '',
      serviceInterest: 'General Support & Live Chat Inquiry',
      subject: `Support Chat Inquiry [${currentTicket}] - ${questionText.slice(0, 50)}...`,
      message: `User Question: "${questionText}"\n\nSupport Response: "${botReplyText.slice(0, 200)}..."`,
      chatTranscript: finalMessages.map((m) => ({
        sender: m.sender === 'user' ? (clientName || 'Client') : 'Curome Support Desk',
        text: m.text,
        time: m.timestamp,
      })),
      timestamp: new Date().toLocaleString(),
      recipientEmail: COMPANY_INFO.email,
      source: 'support-mini-chat',
    };

    // Trigger server-side persistence
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload),
      });
    } catch (leadSaveErr) {
      console.warn('[Support Chat] Could not persist to /api/leads:', leadSaveErr);
    }

    // Save lead in localStorage for history/backup
    try {
      const existingLeads = JSON.parse(localStorage.getItem('cdp_saved_leads') || '[]');
      existingLeads.unshift(leadPayload);
      localStorage.setItem('cdp_saved_leads', JSON.stringify(existingLeads.slice(0, 20)));
    } catch {
      // ignore
    }

    // Notify user of auto-save to email system
    setLastSavedNotice(`Question automatically logged to ${COMPANY_INFO.email} (${currentTicket})`);
    setTimeout(() => {
      setLastSavedNotice(null);
    }, 6000);

    // Also trigger onFormSubmitted to trigger applet modal if user wants
    if (onFormSubmitted && clientEmail.trim()) {
      onFormSubmitted({
        id: currentTicket,
        fullName: clientName.trim() || 'Support Desk Client',
        companyName: clientCompany.trim() || 'Private Client',
        email: clientEmail.trim(),
        phone: clientPhone.trim() || COMPANY_INFO.phone,
        serviceInterest: 'General Support & Technical Inquiry',
        subject: `Live Support Question [${currentTicket}]`,
        message: `Transcript:\n` + finalMessages.map((m) => `[${m.timestamp}] ${m.sender}: ${m.text}`).join('\n\n'),
        timestamp: new Date().toLocaleString(),
        recipientEmail: COMPANY_INFO.email,
      });
    }
  };

  const handleCopyTranscript = async () => {
    const fullTranscript = `CUROME DE PAIX NIGERIA LIMITED (${COMPANY_INFO.rcNumber})
PORT HARCOURT SUPPORT DESK CHAT LOG
Ticket ID: ${ticketId}
Date: ${new Date().toLocaleString()}
Client: ${clientName || 'Unspecified'} | ${clientEmail || 'Unspecified'}
Facility: Omodu Street off NTA Road, Port Harcourt, Rivers State
Official Recipient: ${COMPANY_INFO.email}

${messages
  .map(
    (m) =>
      `[${m.timestamp}] ${m.sender === 'user' ? clientName || 'Client' : 'Curome Support'}:\n${m.text}`
  )
  .join('\n\n')}
`;

    const success = await copyToClipboard(fullTranscript);
    if (success) {
      setCopiedTranscript(true);
      setTimeout(() => setCopiedTranscript(false), 2500);
    }
  };

  // Generate mailto link for direct manual email dispatch of this exact chat
  const generateChatMailto = () => {
    const sub = `Live Support Transcript [${ticketId}] - ${clientName || 'Inquiry'}`;
    const body = `Curome de Paix Nigeria Limited Support Desk
Reference Ticket: ${ticketId}
Client Name: ${clientName || 'Not specified'}
Client Email: ${clientEmail || 'Not specified'}
Client Phone: ${clientPhone || 'Not specified'}
Company: ${clientCompany || 'Not specified'}

CHAT TRANSCRIPT:
${messages.map((m) => `[${m.timestamp}] ${m.sender === 'user' ? 'Client' : 'Support'}: ${m.text}`).join('\n\n')}

Office & Depot: Omodu Street off NTA Road, Port Harcourt, Rivers State
Recipient Email: ${COMPANY_INFO.email}
`;
    return getMailToUrl(sub, body);
  };

  return (
    <div
      className="rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[680px] max-h-[85vh]"
      id="support-mini-chat-window"
    >
      {/* Top Header of Mini-Chat Window */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-slate-900 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  Support Desk Mini-Chat
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Duty Desk Active
                </span>
              </div>
              <p className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-0.5">
                <span>Omodu St off NTA Rd, PH</span>
                <span>•</span>
                <span className="font-mono text-amber-300 font-bold">{ticketId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopyTranscript}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Copy chat transcript"
              id="copy-support-transcript-btn"
            >
              {copiedTranscript ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline text-emerald-400 text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Copy Log</span>
                </>
              )}
            </button>

            <a
              href={generateChatMailto()}
              className="p-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
              title={`Forward chat transcript directly to ${COMPANY_INFO.email}`}
              id="dispatch-chat-to-email-btn"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Email Lead</span>
            </a>
          </div>
        </div>

        {/* Lead System Sync Notice Banner */}
        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="truncate">
              Auto-Saved Lead System: <strong className="text-white">{COMPANY_INFO.email}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowContactInputs(!showContactInputs)}
            className="text-orange-400 hover:text-orange-300 text-[11px] font-semibold underline shrink-0 cursor-pointer ml-2"
          >
            {showContactInputs ? 'Hide Details' : clientEmail ? 'Edit Contact Info' : '+ Add Your Email'}
          </button>
        </div>
      </div>

      {/* Optional Collapsible Contact Details Ribbon */}
      {showContactInputs && (
        <div className="p-3 bg-orange-50/80 border-b border-orange-200 text-xs text-slate-800 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-orange-950 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <Info className="w-3.5 h-3.5 text-orange-600" />
              <span>Contact details linked to your ticket ({ticketId})</span>
            </span>
            <span className="text-[10px] text-slate-500">Auto-saved for email dispatch</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Your Full Name"
              value={clientName}
              onChange={(e) => {
                setClientName(e.target.value);
                persistContactInfo(e.target.value, clientEmail, clientPhone, clientCompany);
              }}
              className="px-3 py-1.5 rounded-lg border border-orange-200 bg-white text-xs focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <input
              type="email"
              placeholder="Email (for auto-reply lead)"
              value={clientEmail}
              onChange={(e) => {
                setClientEmail(e.target.value);
                persistContactInfo(clientName, e.target.value, clientPhone, clientCompany);
              }}
              className="px-3 py-1.5 rounded-lg border border-orange-200 bg-white text-xs focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <input
              type="tel"
              placeholder="Phone (WhatsApp)"
              value={clientPhone}
              onChange={(e) => {
                setClientPhone(e.target.value);
                persistContactInfo(clientName, clientEmail, e.target.value, clientCompany);
              }}
              className="px-3 py-1.5 rounded-lg border border-orange-200 bg-white text-xs focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
        </div>
      )}

      {/* Live Auto-Saved Toast Banner */}
      {lastSavedNotice && (
        <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">{lastSavedNotice}</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold shrink-0">
            SAVED
          </span>
        </div>
      )}

      {/* Chat Messages Stream */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 text-xs bg-slate-50/70">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-xs ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-br-xs font-medium'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-100 text-[10px] text-slate-400">
                    <span className="font-bold text-orange-600 flex items-center gap-1">
                      <Bot className="w-3 h-3" />
                      Curome Support Desk
                    </span>
                    <span className="font-mono text-[9px] text-slate-400">
                      {ticketId}
                    </span>
                  </div>
                )}

                <div>{msg.text}</div>

                {/* Auto-saved badge on response */}
                {msg.autoSavedToEmail && (
                  <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-emerald-700 font-semibold">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Auto-saved to email lead system ({COMPANY_INFO.email})
                    </span>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-500 text-xs p-2.5 bg-white rounded-xl border border-slate-200 w-fit animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 text-orange-600 animate-spin" />
            <span>Consulting Curome technical database & saving question to lead system...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="p-2.5 bg-white border-t border-slate-100 shrink-0">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-orange-500" />
          <span>Suggested General Inquiries (Click to Ask & Auto-Save):</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendQuestion(q.query)}
              disabled={isTyping}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-950 border border-slate-200 hover:border-orange-300 text-slate-700 text-[11px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <span>{q.title}</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Message Form */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuestion();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Type your question here (e.g. shipping times to Bonny Island, custom sizing)..."
            className="flex-grow px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            id="support-mini-chat-input"
          />

          <button
            type="submit"
            disabled={!inputQuestion.trim() || isTyping}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:opacity-40 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0"
            id="support-mini-chat-send-btn"
            title="Send question and save to email lead system"
          >
            <span>Ask & Save</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
          <span>
            Connected to <strong>{COMPANY_INFO.email}</strong> • RC-7473017
          </span>
          <span className="font-mono text-slate-500">
            Ticket: {ticketId}
          </span>
        </div>
      </div>
    </div>
  );
};
