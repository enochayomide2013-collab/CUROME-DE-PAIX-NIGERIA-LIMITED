import React, { useState, useEffect } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Calendar,
  Phone,
  ArrowRight,
  ExternalLink,
  FileText,
  UserCheck,
  ChevronRight,
  Copy,
  Check,
  Building2,
  Filter,
  Eye,
  RefreshCw,
  ShoppingBag,
  User,
  Mail,
  PlusCircle,
} from 'lucide-react';
import { OrderTrackingInfo, OrderStatus } from '../types';
import { trackOrderByTicket, fetchUserOrders, saveUserTicket } from '../utils/ordersApi';
import { COMPANY_INFO } from '../data/companyData';
import { formatNaira, copyToClipboard, getWhatsAppUrl } from '../utils/communication';

interface OrderTrackingSectionProps {
  initialTicketId?: string | null;
  onOpenQuoteModal?: () => void;
  onOpenContractModal?: () => void;
}

export const OrderTrackingSection: React.FC<OrderTrackingSectionProps> = ({
  initialTicketId,
  onOpenQuoteModal,
  onOpenContractModal,
}) => {
  // Navigation tab: 'tracker' (single ticket search/view) or 'my-orders' (only current user's orders)
  const [activeTab, setActiveTab] = useState<'my-orders' | 'tracker'>('my-orders');

  const [searchTicket, setSearchTicket] = useState(initialTicketId || '');
  const [currentOrder, setCurrentOrder] = useState<OrderTrackingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [copiedTicketId, setCopiedTicketId] = useState<string | null>(null);

  // User's own orders list state
  const [myOrders, setMyOrders] = useState<OrderTrackingInfo[]>([]);
  const [isLoadingMyOrders, setIsLoadingMyOrders] = useState(false);
  const [myOrdersFilter, setMyOrdersFilter] = useState<string>('all');
  const [myOrdersSearch, setMyOrdersSearch] = useState<string>('');

  // Load user's orders on mount
  useEffect(() => {
    loadUserOrders();
  }, [initialTicketId]);

  const loadUserOrders = async () => {
    setIsLoadingMyOrders(true);
    try {
      const userOrders = await fetchUserOrders();
      setMyOrders(userOrders);

      if (initialTicketId) {
        handleTrack(initialTicketId, false);
      } else if (userOrders.length > 0 && !currentOrder) {
        // Set their latest order as the current order in the tracker
        setCurrentOrder(userOrders[0]);
        setSearchTicket(userOrders[0].ticketId);
      }
    } catch (e) {
      console.warn('Error loading user orders:', e);
    } finally {
      setIsLoadingMyOrders(false);
    }
  };

  const handleTrack = async (ticketQuery?: string, isManualSearch = true) => {
    const query = ticketQuery !== undefined ? ticketQuery : searchTicket;
    const clean = query.trim();

    if (!clean) {
      setSearchError('Please enter your Ticket Number (1000 to 999000000000000).');
      return;
    }

    setIsLoading(true);
    setSearchError(null);

    try {
      const result = await trackOrderByTicket(clean);
      if (result) {
        setCurrentOrder(result);
        setSearchTicket(result.ticketId);
        saveUserTicket(result.ticketId);
        // Refresh my orders list so this tracked ticket appears in their personal history
        const updated = await fetchUserOrders();
        setMyOrders(updated);
        setActiveTab('tracker'); // switch to detailed view
      } else {
        setSearchError(
          `No active record found for ticket "${clean}". Please verify your ticket number or contact the dispatch desk.`
        );
      }
    } catch (err) {
      console.error('Track order error:', err);
      setSearchError('Unable to connect to logistics server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTicket = (ticket: string) => {
    copyToClipboard(ticket);
    setCopiedTicketId(ticket);
    setTimeout(() => setCopiedTicketId(null), 2500);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Received':
        return {
          label: 'Order Received',
          color: 'bg-slate-100 text-slate-800 border-slate-300',
          desc: 'Requisition logged and being verified by Port Harcourt desk.',
          icon: Clock,
        };
      case 'Processing':
        return {
          label: 'Processing & Tailoring',
          color: 'bg-sky-100 text-sky-800 border-sky-300',
          desc: 'Factory size allocation, cutting, and embroidery active.',
          icon: Package,
        };
      case 'Quality Check':
        return {
          label: 'QA / QC Certified',
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          desc: 'Passed impact, stitch tension, and compliance checks.',
          icon: ShieldCheck,
        };
      case 'Packed':
        return {
          label: 'Packed & Staged',
          color: 'bg-amber-100 text-amber-900 border-amber-300',
          desc: 'Packed in weatherproof export boxes ready for dispatch.',
          icon: Package,
        };
      case 'Dispatched':
        return {
          label: 'Dispatched & In Transit',
          color: 'bg-indigo-100 text-indigo-900 border-indigo-300 animate-pulse',
          desc: 'On board delivery van en route across Rivers State.',
          icon: Truck,
        };
      case 'Delivered':
        return {
          label: 'Delivered & Signed',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          desc: 'Handover complete and certified on site.',
          icon: CheckCircle2,
        };
      default:
        return {
          label: status,
          color: 'bg-slate-100 text-slate-800 border-slate-300',
          desc: 'Order in active logistics queue.',
          icon: Clock,
        };
    }
  };

  const stagesOrder: OrderStatus[] = [
    'Received',
    'Processing',
    'Quality Check',
    'Packed',
    'Dispatched',
    'Delivered',
  ];

  const getStageIndex = (status: OrderStatus) => {
    const idx = stagesOrder.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  const activeStageIdx = currentOrder ? getStageIndex(currentOrder.status) : 0;

  // Filtered orders for the "My Orders" tab
  const filteredMyOrders = myOrders.filter((ord) => {
    const q = myOrdersSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      ord.ticketId.toLowerCase().includes(q) ||
      String(ord.ticketNumber).includes(q) ||
      ord.clientName.toLowerCase().includes(q) ||
      (ord.companyName && ord.companyName.toLowerCase().includes(q)) ||
      ord.deliveryAddress.toLowerCase().includes(q);

    const matchesFilter =
      myOrdersFilter === 'all' || ord.status.toLowerCase() === myOrdersFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  return (
    <section
      id="orders"
      className="py-14 sm:py-20 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800 scroll-mt-16"
    >
      {/* Anchor support for #order-tracking */}
      <div id="order-tracking" className="sr-only" />

      {/* Background Subtle Grid & Accent Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
        {/* Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>Port Harcourt Central Dispatch & Logistics Desk</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Orders & Requisition Tracking Hub
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Track and manage your own safety gear orders, equipment requisitions, and delivery timelines across Port Harcourt and Rivers State.
          </p>

          {/* Section Navigation Tabs: My Orders VS Track by Ticket */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex p-1 rounded-2xl bg-slate-950 border border-slate-700 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('my-orders');
                  loadUserOrders();
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'my-orders'
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>My Orders ({myOrders.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tracker')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'tracker'
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Track by Ticket</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: USER'S OWN ORDERS ("MY ORDERS") */}
        {/* ========================================================================= */}
        {activeTab === 'my-orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {myOrders.length > 0 && (
              /* Search and Filters Bar for User Orders */
              <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={myOrdersSearch}
                    onChange={(e) => setMyOrdersSearch(e.target.value)}
                    placeholder="Search your orders by ticket number or item..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Filter className="w-3.5 h-3.5 text-orange-400" />
                    <span>Status:</span>
                  </div>
                  <select
                    value={myOrdersFilter}
                    onChange={(e) => setMyOrdersFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Received">Received</option>
                    <option value="Processing">Processing</option>
                    <option value="Quality Check">Quality Check</option>
                    <option value="Packed">Packed</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                  </select>

                  <button
                    type="button"
                    onClick={loadUserOrders}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Refresh My Orders"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingMyOrders ? 'animate-spin text-orange-400' : ''}`} />
                  </button>
                </div>
              </div>
            )}

            {/* If user has no orders saved on this device */}
            {myOrders.length === 0 ? (
              <div className="p-10 sm:p-14 text-center bg-slate-800/60 backdrop-blur-md rounded-3xl border border-slate-700/70 space-y-6 max-w-2xl mx-auto shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mx-auto text-orange-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white">No Orders on this Device Yet</h3>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-lg mx-auto">
                    When you place an equipment order, contract, or custom quote, your tracking ticket and order progress will be saved here automatically.
                  </p>
                </div>

                {/* Quick Link/Search Existing Ticket */}
                <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
                    Have an existing order or ticket number?
                  </span>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleTrack();
                    }}
                    className="flex flex-col sm:flex-row gap-2"
                  >
                    <input
                      type="text"
                      value={searchTicket}
                      onChange={(e) => setSearchTicket(e.target.value)}
                      placeholder="Enter Ticket # (e.g. 1000 - 999000000000000)"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Lookup Ticket</span>
                    </button>
                  </form>
                </div>

                {/* Quick CTAs */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href="#products"
                    className="px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Browse Safety Gear Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  {onOpenQuoteModal && (
                    <button
                      type="button"
                      onClick={onOpenQuoteModal}
                      className="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-600/30"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Request Custom Quote</span>
                    </button>
                  )}
                </div>
              </div>
            ) : filteredMyOrders.length === 0 ? (
              <div className="p-10 text-center bg-slate-800/50 rounded-3xl border border-slate-700/60 space-y-3">
                <Package className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="font-bold text-white text-base">No Matching Orders Found</h4>
                <p className="text-slate-400 text-xs">
                  Try clearing your search keyword or selecting "All Statuses".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMyOrdersSearch('');
                    setMyOrdersFilter('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-700 text-white text-xs font-bold cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              /* User's Orders Cards */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMyOrders.map((ord) => {
                  const badge = getStatusBadge(ord.status);
                  const Icon = badge.icon;
                  const isCopied = copiedTicketId === ord.ticketId;

                  return (
                    <div
                      key={ord.id}
                      className="bg-slate-800/95 hover:bg-slate-800 rounded-2xl border border-slate-700/80 hover:border-orange-500/50 p-5 space-y-4 transition-all shadow-lg flex flex-col justify-between group"
                    >
                      {/* Top Header with Ticket Code and Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                            Your Ticket Number:
                          </span>
                          {/* Monospace Ticket Code with 1-Click Copy */}
                          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700">
                            <span className="font-mono text-sm sm:text-base font-extrabold text-white tracking-wider">
                              {ord.ticketId}
                            </span>
                            <button
                              onClick={() => handleCopyTicket(ord.ticketId)}
                              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer border border-slate-600"
                              title="Copy Ticket ID"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div
                          className={`px-3 py-1.5 rounded-xl text-xs font-black border ${badge.color} flex items-center gap-1.5 shrink-0`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="uppercase">{ord.status}</span>
                        </div>
                      </div>

                      {/* Client Info & Destination */}
                      <div className="space-y-1.5 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-orange-400" />
                            <span>{ord.clientName}</span>
                          </h4>
                          {ord.companyName && (
                            <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                              {ord.companyName}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          <span className="truncate">{ord.deliveryAddress}</span>
                        </p>
                      </div>

                      {/* Items Summary & Total */}
                      <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                        <div className="text-slate-300">
                          <span className="text-slate-400 font-medium">Requisition:</span>{' '}
                          <strong className="text-white">
                            {ord.items?.length || 1} product line(s)
                          </strong>
                        </div>
                        {ord.totalAmount > 0 && (
                          <div className="font-mono font-bold text-orange-400 text-sm">
                            {formatNaira(ord.totalAmount)}
                          </div>
                        )}
                      </div>

                      {/* Action: Track This Specific Order */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSearchTicket(ord.ticketId);
                            handleTrack(ord.ticketId);
                          }}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Track Live Status & Stages</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SINGLE TICKET TRACKER VIEW */}
        {/* ========================================================================= */}
        {activeTab === 'tracker' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Search Bar Input Container */}
            <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-slate-700 shadow-2xl max-w-3xl mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTrack();
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTicket}
                    onChange={(e) => setSearchTicket(e.target.value)}
                    placeholder="Enter your Ticket # (e.g. 1000 - 999000000000000 or CDP-TICKET-...)"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950 border border-slate-600 text-white placeholder:text-slate-500 text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono tracking-wide"
                    id="order-tracking-search-input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg shadow-orange-600/30 hover:scale-[1.02] active:scale-98 disabled:opacity-50"
                  id="order-tracking-submit-btn"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Checking Status...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Track Status</span>
                    </>
                  )}
                </button>
              </form>

              {searchError && (
                <div className="mt-3 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}
            </div>

            {/* Order Tracking Display Card */}
            {currentOrder && (
              <div className="bg-slate-800/95 backdrop-blur-md rounded-3xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Top Banner: Ticket Number, 1-Click Copy, and Current Status */}
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 border-b border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
                        Requisition Ticket Code
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-400 font-mono">
                        Date: {currentOrder.dateCreated}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-orange-500/40 shadow-inner">
                        <span className="font-mono text-lg sm:text-2xl font-black text-white tracking-wider">
                          {currentOrder.ticketId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyTicket(currentOrder.ticketId)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Copy Ticket ID to Clipboard"
                        >
                          {copiedTicketId === currentOrder.ticketId ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {copiedTicketId === currentOrder.ticketId && (
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 animate-pulse">
                          <Check className="w-3.5 h-3.5" /> Ticket Copied!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Big Status Badge */}
                  <div className="flex items-center gap-3">
                    {(() => {
                      const badge = getStatusBadge(currentOrder.status);
                      const BadgeIcon = badge.icon;
                      return (
                        <div
                          className={`px-5 py-3 rounded-2xl border ${badge.color} shadow-lg flex items-center gap-3`}
                        >
                          <div className="p-2 rounded-xl bg-white/80 shrink-0">
                            <BadgeIcon className="w-6 h-6 text-slate-900" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                              Current Logistics State
                            </span>
                            <span className="text-base sm:text-lg font-black tracking-tight">
                              {badge.label}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Horizontal Visual Progress Pipeline (6 Stages) */}
                <div className="p-6 sm:p-8 bg-slate-900/60 border-b border-slate-700/60">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-orange-400" />
                    <span>Industrial Dispatch Pipeline & Verification Stages</span>
                  </h4>

                  {/* Desktop / Tablet Stepper */}
                  <div className="hidden sm:grid sm:grid-cols-6 gap-2 relative">
                    {/* Background Progress Bar Track */}
                    <div className="absolute top-5 left-6 right-6 h-1 bg-slate-700 -z-0">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 transition-all duration-500"
                        style={{
                          width: `${(activeStageIdx / (stagesOrder.length - 1)) * 100}%`,
                        }}
                      />
                    </div>

                    {stagesOrder.map((stage, idx) => {
                      const isCompleted = idx < activeStageIdx;
                      const isCurrent = idx === activeStageIdx;
                      const isPending = idx > activeStageIdx;

                      return (
                        <div key={stage} className="flex flex-col items-center text-center relative z-10 space-y-2">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                              isCompleted
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                                : isCurrent
                                ? 'bg-orange-500 text-white ring-4 ring-orange-500/30 scale-110 shadow-lg shadow-orange-500/40 animate-pulse'
                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                            }`}
                          >
                            {isCompleted ? <Check className="w-5 h-5" /> : idx + 1}
                          </div>
                          <div>
                            <span
                              className={`text-xs font-bold block ${
                                isCurrent
                                  ? 'text-orange-400'
                                  : isCompleted
                                  ? 'text-emerald-400'
                                  : 'text-slate-500'
                              }`}
                            >
                              {stage}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {isCompleted
                                ? 'Done'
                                : isCurrent
                                ? 'In Progress'
                                : 'Queued'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile Stepper (Vertical summary) */}
                  <div className="sm:hidden space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                      <span>Stage {activeStageIdx + 1} of 6</span>
                      <span className="font-bold text-orange-400">{currentOrder.status}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-emerald-500"
                        style={{ width: `${((activeStageIdx + 1) / 6) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Consignment & Delivery Details Grid */}
                <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Column 1 & 2: Client Details & Requisition Items */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Client & Destination Card */}
                    <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-700/80 space-y-4">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
                        <Building2 className="w-4 h-4 text-orange-400" />
                        <span>Client Requisition Profile</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 block font-medium">Recipient Name:</span>
                          <span className="font-bold text-white text-sm">{currentOrder.clientName}</span>
                          {currentOrder.companyName && (
                            <span className="text-slate-400 block text-[11px]">
                              {currentOrder.companyName}
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="text-slate-400 block font-medium">Contact Phone:</span>
                          <span className="font-mono text-emerald-400 font-bold">
                            {currentOrder.phone || COMPANY_INFO.phone}
                          </span>
                        </div>

                        <div className="sm:col-span-2">
                          <span className="text-slate-400 block font-medium flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-orange-400" /> Delivery Destination:
                          </span>
                          <span className="font-medium text-slate-200 text-xs sm:text-sm">
                            {currentOrder.deliveryAddress}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items Breakdown */}
                    <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-700/80 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          <Package className="w-4 h-4 text-orange-400" />
                          <span>Requisition Consignment Breakdown</span>
                        </h4>
                        <span className="text-xs text-slate-400 font-mono">
                          {currentOrder.items?.length || 0} item(s)
                        </span>
                      </div>

                      <div className="space-y-3">
                        {currentOrder.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <div className="font-bold text-white text-sm">{item.name}</div>
                              {item.specs && (
                                <div className="text-slate-400 text-[11px] leading-relaxed">
                                  <strong>Specs:</strong> {item.specs}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-4 shrink-0 sm:text-right">
                              <div className="px-2.5 py-1 rounded-lg bg-slate-800 font-mono font-bold text-orange-400">
                                Qty: {item.quantity}
                              </div>
                              {item.unitPrice && item.unitPrice > 0 && (
                                <div className="font-mono text-white font-semibold">
                                  {formatNaira(item.unitPrice * item.quantity)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total Amount */}
                      {currentOrder.totalAmount > 0 && (
                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-xs text-slate-400 font-medium">Estimated Consignment Total:</span>
                          <span className="font-mono text-lg font-black text-orange-400">
                            {formatNaira(currentOrder.totalAmount)}
                          </span>
                        </div>
                      )}

                      {/* Exclusions or Notes */}
                      {currentOrder.thingsNotWanted && (
                        <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/40 text-red-300 text-xs">
                          <strong>Specified Exclusions / Not Wanted:</strong> {currentOrder.thingsNotWanted}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Column 3: Logistics Fleet & ETA Card */}
                  <div className="space-y-6">
                    <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-700/80 space-y-4 text-xs">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
                        <Truck className="w-4 h-4 text-orange-400" />
                        <span>Logistics & Dispatch Fleet</span>
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <span className="text-slate-400 block font-medium">Estimated Arrival / ETA:</span>
                          <span className="font-bold text-emerald-400 text-sm">
                            {currentOrder.estimatedDelivery || 'Standard 24-48 Hours'}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-medium">Assigned Carrier / Fleet:</span>
                          <span className="font-medium text-slate-200">
                            {currentOrder.carrierOrDriver || 'Curome Dedicated Van Transit Desk'}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-medium">Origin Facility:</span>
                          <span className="font-medium text-slate-300">
                            {currentOrder.dispatchLocation || 'Omodu St Depot off NTA Road, Port Harcourt'}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-800">
                          <span className="text-slate-400 block font-medium">QA Certification Stamp:</span>
                          <span className="text-slate-300 flex items-center gap-1 font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                            Inspected by Engr. Adebayo (QA Lead)
                          </span>
                        </div>
                      </div>

                      {/* WhatsApp Dispatch Button */}
                      <div className="pt-2">
                        <a
                          href={getWhatsAppUrl(
                            `Hello Curome Logistics Desk, I am tracking my procurement ticket [${currentOrder.ticketId}] for ${currentOrder.clientName}. Current status shows: ${currentOrder.status}. Can I get a real-time driver update?`
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>WhatsApp Dispatch Desk</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Live Audit Logs */}
                {currentOrder.trackingSteps && currentOrder.trackingSteps.length > 0 && (
                  <div className="p-6 bg-slate-900 border-t border-slate-700/80">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-orange-400" />
                      <span>Certified Logistics Audit Trail</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {currentOrder.trackingSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border text-xs space-y-1 ${
                            step.status === 'completed'
                              ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                              : step.status === 'current'
                              ? 'bg-orange-950/40 border-orange-500/50 text-orange-100 ring-1 ring-orange-500/30'
                              : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-[11px] flex items-center gap-1">
                              {step.status === 'completed' && (
                                <Check className="w-3 h-3 text-emerald-400" />
                              )}
                              {step.status === 'current' && (
                                <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping inline-block mr-1" />
                              )}
                              <span>{step.stage}</span>
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {step.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] leading-snug text-slate-300">{step.note}</p>
                          <div className="text-[10px] text-slate-500 pt-0.5">
                            <strong>Location:</strong> {step.location}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
