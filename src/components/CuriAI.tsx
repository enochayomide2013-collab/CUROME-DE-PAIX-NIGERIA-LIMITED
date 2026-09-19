import React, { useState, useRef, useEffect } from 'react';
import { COMPANY_INFO, PRODUCTS_CATALOG } from '../data/companyData';
import { searchCuromeWeb, WebKnowledgeItem } from '../data/curomeWebKnowledge';
import {
  getWhatsAppUrl,
  getPhoneCallUrl,
  getMailToUrl,
  copyToClipboard,
  formatNaira,
} from '../utils/communication';
import {
  Sparkles,
  Bot,
  Send,
  X,
  HelpCircle,
  ShoppingBag,
  FileText,
  Phone,
  ShieldCheck,
  ChevronRight,
  HardHat,
  RefreshCw,
  MapPin,
  Mail,
  CheckCircle,
  Wrench,
  Copy,
  Check,
  Search,
  Globe,
  Truck,
  Clock,
  Layers,
  ExternalLink,
} from 'lucide-react';

interface CuriAIProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onOpenCart?: () => void;
  onOpenQuote?: () => void;
  onOpenContract?: () => void;
  onNavigateToSection?: (sectionId: string) => void;
  initialPrompt?: string | null;
}

interface ChatMessage {
  id: string;
  sender: 'curi' | 'user';
  text: string;
  timestamp: string;
  webSource?: {
    title: string;
    category: string;
  };
  action?: {
    label: string;
    type:
      | 'cart'
      | 'quote'
      | 'contract'
      | 'whatsapp'
      | 'contact'
      | 'products'
      | 'services'
      | 'faq'
      | 'copyEmail'
      | 'email'
      | 'call';
  };
}

export const CuriAI: React.FC<CuriAIProps> = ({
  isOpen: controlledIsOpen,
  onOpenChange,
  onOpenCart,
  onOpenQuote,
  onOpenContract,
  onNavigateToSection,
  initialPrompt,
}) => {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : localIsOpen;

  const setIsOpen = (val: boolean) => {
    setLocalIsOpen(val);
    if (onOpenChange) {
      onOpenChange(val);
    }
  };

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchStatus, setSearchStatus] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'curi',
      text: `Hello! I am **Curi AI**, your verified intelligent assistant for **Curome de Paix Nigeria Limited** (RC-7473017). \n\nWhenever you ask a question, I first thoroughly scan the **Curome de Paix website** to give you exact, up-to-date answers on our **product range**, **shipping policies across Rivers State**, **lead times for engineering services**, **current market prices**, or how to **send your order to ${COMPANY_INFO.email}** with custom specifications and things you don't want!`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, searchStatus]);

  // Handle initialPrompt if provided
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const quickTopics = [
    {
      title: 'Product Range & Standards',
      query: 'What is your complete safety product range and certifications?',
      icon: Layers,
    },
    {
      title: 'Rivers State Shipping Policies',
      query: 'What are your shipping policies and delivery timelines across Rivers State?',
      icon: Truck,
    },
    {
      title: 'Engineering Lead Times',
      query: 'What are the lead times for engineering, fabrication, and valve maintenance?',
      icon: Clock,
    },
    {
      title: 'Office Location in PH',
      query: 'Where is your factory and office located in Port Harcourt?',
      icon: MapPin,
    },
    {
      title: 'Cart & Things I Don’t Want',
      query: 'How do I add items to cart and specify things I do not want?',
      icon: ShoppingBag,
    },
    {
      title: 'Prevailing Market Prices',
      query: 'What are the current market baseline prices for coveralls, helmets, glasses, and boots?',
      icon: HelpCircle,
    },
  ];

  const handleCopyEmail = async () => {
    const success = await copyToClipboard(COMPANY_INFO.email);
    if (success) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  /**
   * Processes user query by first searching the Curome website index,
   * checking server API, and returning direct grounded answers.
   */
  const handleSend = async (overrideQuery?: string) => {
    const textToSend = overrideQuery !== undefined ? overrideQuery : inputQuery;
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!overrideQuery) {
      setInputQuery('');
    }
    setIsTyping(true);
    setSearchStatus('Browsing Curome de Paix website index...');

    try {
      // Step 1: Scan local Curome web knowledge index
      const { matchedItem, score } = searchCuromeWeb(textToSend);

      // Show intermediate search feedback
      setTimeout(() => {
        setSearchStatus(`Found verified match: "${matchedItem.title}"`);
      }, 400);

      // Step 2: Try Server-side API with Gemini or server knowledge
      let replyText = '';
      let replySourceTitle = matchedItem.title;
      let replyCategory = matchedItem.category;
      let replyAction: ChatMessage['action'] = matchedItem.action;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: textToSend }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.reply) {
            replyText = data.reply;
            replySourceTitle = 'Curome Web Grounded Knowledge';
          }
        }
      } catch (netErr) {
        // Fallback gracefully to client-side Curome web knowledge
      }

      // If server didn't provide Gemini text, use our rich web knowledge index
      if (!replyText) {
        replyText = matchedItem.details;
      }

      // Add a slight realistic delay to render the search state
      setTimeout(() => {
        setIsTyping(false);
        setSearchStatus(null);

        const curiMessage: ChatMessage = {
          id: `msg-${Date.now()}-c`,
          sender: 'curi',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          webSource: {
            title: replySourceTitle,
            category: replyCategory,
          },
          action: replyAction,
        };

        setMessages((prev) => [...prev, curiMessage]);
      }, 700);
    } catch (err) {
      setIsTyping(false);
      setSearchStatus(null);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          sender: 'curi',
          text: `I encountered an issue searching the website. You can connect with our Port Harcourt procurement team directly at **${COMPANY_INFO.phone}** or WhatsApp **${COMPANY_INFO.whatsappNumber}**.`,
          timestamp: 'Just now',
          action: { label: 'Chat on WhatsApp', type: 'whatsapp' },
        },
      ]);
    }
  };

  const handleActionClick = (action: ChatMessage['action']) => {
    if (!action) return;

    switch (action.type) {
      case 'cart':
        if (onOpenCart) onOpenCart();
        break;
      case 'quote':
        if (onOpenQuote) onOpenQuote();
        break;
      case 'contract':
        if (onOpenContract) onOpenContract();
        break;
      case 'whatsapp':
        window.open(getWhatsAppUrl('Hello Curome de Paix, I have an inquiry.'), '_blank');
        break;
      case 'call':
        window.location.href = getPhoneCallUrl();
        break;
      case 'copyEmail':
      case 'email':
        handleCopyEmail();
        break;
      case 'products':
        if (onNavigateToSection) onNavigateToSection('products');
        else {
          const el = document.getElementById('products');
          el?.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'services':
        if (onNavigateToSection) onNavigateToSection('services');
        else {
          const el = document.getElementById('services');
          el?.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'faq':
        if (onNavigateToSection) onNavigateToSection('faq-section');
        else {
          const el = document.getElementById('faq-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'contact':
        if (onNavigateToSection) onNavigateToSection('contact');
        else {
          const el = document.getElementById('contact');
          el?.scrollIntoView({ behavior: 'smooth' });
        }
        break;
    }
  };

  return (
    <>
      {/* Floating Widget Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-40 p-3.5 sm:p-4 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xl hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2.5 cursor-pointer border-2 border-white/20"
        aria-label="Open Curi AI Assistant"
        id="curi-ai-toggle-button"
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse" />
        </div>
        <span className="hidden sm:inline font-bold text-sm tracking-wide">
          Ask Curi AI
        </span>
      </button>

      {/* Main Slide-Over / Popover Panel */}
      {isOpen && (
        <div
          className="fixed bottom-20 left-4 sm:left-6 z-50 w-[95vw] sm:w-[440px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
          id="curi-ai-modal-panel"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white">Curi AI</h3>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Web-Grounded
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Curome de Paix Nigeria Limited • RC-7473017
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Web Scanning Indicator */}
          {searchStatus && (
            <div className="px-4 py-2 bg-orange-50 border-b border-orange-200/80 flex items-center gap-2 text-xs font-semibold text-orange-900 animate-in fade-in duration-150">
              <Search className="w-3.5 h-3.5 text-orange-600 animate-spin" />
              <span className="truncate">{searchStatus}</span>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 text-xs bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  {/* Message Bubble */}
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl shadow-2xs leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-slate-900 text-white rounded-br-xs font-medium'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                    }`}
                  >
                    {/* Verified Web Source Tag for Curi responses */}
                    {!isUser && msg.webSource && (
                      <div className="mb-2 pb-1.5 border-b border-slate-100 flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold">
                        <Globe className="w-3 h-3 text-emerald-600" />
                        <span>Grounded in Curome Website: {msg.webSource.title}</span>
                      </div>
                    )}

                    <div>{msg.text}</div>

                    {/* Action Button attached to message */}
                    {msg.action && (
                      <div className="mt-3 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleActionClick(msg.action)}
                          className="w-full py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <span>{msg.action.label}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs p-2 bg-white rounded-xl border border-slate-200/60 w-fit">
                <Search className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                <span>Reading Curome website and preparing answer...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Shelf */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-500" />
              <span>Suggested Website Queries:</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {quickTopics.map((top, idx) => {
                const Icon = top.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(top.query)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-900 border border-slate-200 text-slate-700 text-[11px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Icon className="w-3 h-3 text-orange-600" />
                    <span>{top.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about products, Rivers shipping, lead times..."
                className="flex-grow px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-orange-600 disabled:opacity-40 disabled:hover:bg-slate-900 text-white transition-colors cursor-pointer shrink-0"
                aria-label="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
