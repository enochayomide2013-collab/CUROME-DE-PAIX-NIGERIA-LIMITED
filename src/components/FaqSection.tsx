import React, { useState, useMemo } from 'react';
import { FAQS_DATA, FaqItem } from '../data/faqData';
import { COMPANY_INFO } from '../data/companyData';
import { getWhatsAppUrl, getPhoneCallUrl } from '../utils/communication';
import {
  ChevronDown,
  Search,
  HelpCircle,
  Package,
  Truck,
  Clock,
  FileCheck,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  Bot,
  Layers,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface FaqSectionProps {
  onOpenQuote?: () => void;
  onOpenCuriAI?: (prompt?: string) => void;
  onNavigateToContact?: () => void;
  onNavigateToProducts?: () => void;
  onNavigateToServices?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  onOpenQuote,
  onOpenCuriAI,
  onNavigateToContact,
  onNavigateToProducts,
  onNavigateToServices,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  // Set of open FAQ item IDs (default open the first 2)
  const [openIds, setOpenIds] = useState<Set<string>>(
    new Set(['faq-product-range', 'faq-shipping-rivers-state'])
  );
  // Helpful votes state
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'All Common Inquiries', icon: Layers, count: FAQS_DATA.length },
    {
      id: 'products',
      label: 'Product Range & Standards',
      icon: Package,
      count: FAQS_DATA.filter((f) => f.category === 'products').length,
    },
    {
      id: 'shipping',
      label: 'Shipping to Rivers State',
      icon: Truck,
      count: FAQS_DATA.filter((f) => f.category === 'shipping').length,
    },
    {
      id: 'engineering',
      label: 'Engineering Lead Times',
      icon: Clock,
      count: FAQS_DATA.filter((f) => f.category === 'engineering').length,
    },
    {
      id: 'orders',
      label: 'Orders & Payments',
      icon: FileCheck,
      count: FAQS_DATA.filter((f) => f.category === 'orders').length,
    },
  ];

  // Filter FAQs based on category and search query
  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        item.highlights.some((h) => h.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenIds(new Set(filteredFaqs.map((f) => f.id)));
  };

  const collapseAll = () => {
    setOpenIds(new Set());
  };

  const handleHelpfulClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (votedMap[id]) return;
    setHelpfulVotes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    setVotedMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="faq-section" className="py-20 bg-white border-t border-slate-200 relative">
      {/* Background design texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 border border-orange-200/80 text-orange-900 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
              <span>Knowledge Base & Procurement Guide</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Transparent answers regarding our certified{' '}
              <strong className="text-slate-800 font-semibold">safety PPE product range</strong>, our expedited{' '}
              <strong className="text-slate-800 font-semibold">shipping policies across Rivers State</strong> from
              Omodu Street off NTA Road, and exact{' '}
              <strong className="text-slate-800 font-semibold">lead times for engineering services</strong>.
            </p>
          </div>

          {/* Quick AI Search Trigger */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs max-w-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Have a Specific Question?</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Our <strong>Curi AI</strong> assistant crawls the full Curome website index to answer your custom inquiries in real-time.
            </p>
            {onOpenCuriAI && (
              <button
                onClick={() => onOpenCuriAI('What are your delivery policies to Port Harcourt and Rivers State?')}
                className="w-full py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-orange-400" />
                <span>Ask Curi AI Instantly</span>
              </button>
            )}
          </div>
        </div>

        {/* Controls: Category Filter Tabs + Search Input */}
        <div className="mt-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword: coveralls, NTA Road, shipping to Bonny, fabrication lead time..."
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 text-sm text-slate-900 placeholder:text-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-400' : 'text-slate-500'}`} />
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-slate-800 text-orange-300' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Expand / Collapse All Toggle */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{filteredFaqs.length} questions</span>
              <span className="text-slate-300">•</span>
              <button
                onClick={expandAll}
                className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
              >
                Expand All
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={collapseAll}
                className="text-slate-600 hover:text-slate-800 font-semibold cursor-pointer"
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-6 space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-slate-50 border border-dashed border-slate-200">
              <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No matching questions found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                We couldn't find any FAQs matching "{searchQuery}". You can ask Curi AI directly or message our Port Harcourt team.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Reset Search
                </button>
                {onOpenCuriAI && (
                  <button
                    onClick={() => onOpenCuriAI(searchQuery)}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Ask Curi AI "{searchQuery}"</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIds.has(faq.id);
              const votes = (helpfulVotes[faq.id] || 0);
              const hasVoted = votedMap[faq.id];

              return (
                <div
                  key={faq.id}
                  id={faq.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-white border-orange-200/90 shadow-sm'
                      : 'bg-slate-50/70 hover:bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  {/* Accordion Trigger Button */}
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1.5 pr-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            faq.category === 'products'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : faq.category === 'shipping'
                              ? 'bg-blue-100 text-blue-900 border border-blue-200'
                              : faq.category === 'engineering'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              : 'bg-purple-100 text-purple-900 border border-purple-200'
                          }`}
                        >
                          {faq.category === 'products'
                            ? 'Product Range'
                            : faq.category === 'shipping'
                            ? 'Rivers State Shipping'
                            : faq.category === 'engineering'
                            ? 'Engineering Lead Times'
                            : 'Orders & Payments'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Q{index + 1}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-orange-600 text-white rotate-180'
                          : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Content Body */}
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                      {/* Formatted Answer */}
                      <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
                        {faq.answer}
                      </div>

                      {/* Key Highlights Checklist */}
                      {faq.highlights && faq.highlights.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Key Takeaways & Guarantee:</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                            {faq.highlights.map((h, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer bar for item: tags + helpful vote + contextual action */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {faq.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          {/* Helpful button */}
                          <button
                            onClick={(e) => handleHelpfulClick(faq.id, e)}
                            disabled={hasVoted}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer text-xs ${
                              hasVoted
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold'
                                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                            title="Was this answer helpful?"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{hasVoted ? 'Helpful!' : 'Helpful'}</span>
                            {votes > 0 && <span className="font-mono text-[10px]">({votes})</span>}
                          </button>

                          {/* Contextual Jump Button */}
                          {faq.category === 'products' && onNavigateToProducts && (
                            <button
                              onClick={onNavigateToProducts}
                              className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Products</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

                          {faq.category === 'engineering' && onNavigateToServices && (
                            <button
                              onClick={onNavigateToServices}
                              className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <span>Explore Services</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

                          {faq.category === 'shipping' && onNavigateToContact && (
                            <button
                              onClick={onNavigateToContact}
                              className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <span>Office Location & Map</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Help Desk Card */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg border border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Personalized Industrial Support</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Have a Custom Spec or Urgent Rivers State Tender?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our Port Harcourt technical engineering team and procurement officers are ready to review your Bill of Quantities (BOQ), dispatch fabric swatches, or schedule factory inspection at Omodu Street off NTA Road.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href={getWhatsAppUrl(
                'Hello Curome de Paix Nigeria Limited, I am reviewing your FAQ and have an inquiry regarding product specifications, Rivers State delivery, and lead times.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Direct Desk</span>
            </a>

            {onOpenQuote && (
              <button
                onClick={onOpenQuote}
                className="px-4 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>Request Formal Quote</span>
              </button>
            )}

            <a
              href={getPhoneCallUrl()}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-blue-400" />
              <span>Call: {COMPANY_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
