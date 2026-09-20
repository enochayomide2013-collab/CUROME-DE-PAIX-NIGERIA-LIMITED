import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Plus,
  Edit3,
  RefreshCw,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  User,
  Building2,
  AlertTriangle,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Sliders,
  Check,
  LogOut,
  ShieldCheck,
  FileText,
  Download,
  FileSpreadsheet,
  ChevronDown,
} from 'lucide-react';
import { OrderTrackingInfo, OrderStatus } from '../types';
import { fetchAllOrders, updateOrderStatus, createOrder } from '../utils/ordersApi';
import { formatNaira, generateRandomTicketNumber } from '../utils/communication';
import { exportOrdersToCsv } from '../utils/csvExport';
import { AdonProductPublisher } from './AdonProductPublisher';

interface SecretAdminOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrderInTracker?: (ticketId: string) => void;
}

export const SecretAdminOrdersModal: React.FC<SecretAdminOrdersModalProps> = ({
  isOpen,
  onClose,
  onTrackOrderInTracker,
}) => {
  // Authentication State (Password is strictly 2013)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('curome_admin_auth_code') === '2013';
  });
  const [enteredPassword, setEnteredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Orders Management State
  const [orders, setOrders] = useState<OrderTrackingInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [adminTab, setAdminTab] = useState<'orders' | 'adon'>('orders');

  // New manual order creation state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newPhone, setNewPhone] = useState('+234 ');
  const [newAddress, setNewAddress] = useState('Port Harcourt, Rivers State');
  const [newItemName, setNewItemName] = useState('Heavy-Duty S3 Safety Boots & Coveralls');
  const [newItemQty, setNewItemQty] = useState(50);
  const [newAmount, setNewAmount] = useState(1500000);
  const [newInitialStatus, setNewInitialStatus] = useState<OrderStatus>('Processing');

  useEffect(() => {
    if (isOpen) {
      if (sessionStorage.getItem('curome_admin_auth_code') === '2013') {
        setIsAuthenticated(true);
        loadOrdersList();
      } else {
        setIsAuthenticated(false);
        setEnteredPassword('');
        setAuthError(null);
      }
    }
  }, [isOpen]);

  const handleVerifyPassword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsVerifying(true);
    setAuthError(null);

    setTimeout(() => {
      if (enteredPassword.trim() === '2013') {
        sessionStorage.setItem('curome_admin_auth_code', '2013');
        setIsAuthenticated(true);
        setAuthError(null);
        loadOrdersList();
      } else {
        setAuthError('Access Denied: Invalid Security Password. Please enter the authorized supervisor password.');
      }
      setIsVerifying(false);
    }, 250);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('curome_admin_auth_code');
    setIsAuthenticated(false);
    setEnteredPassword('');
    setAuthError(null);
  };

  const loadOrdersList = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (e) {
      console.error('Failed to load admin orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (
    order: OrderTrackingInfo,
    newStatus: OrderStatus
  ) => {
    setUpdatingId(order.id);
    try {
      const updated = await updateOrderStatus(order.id, newStatus);
      if (updated) {
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? updated : o))
        );
        showNotification(
          `Status updated: Ticket [${order.ticketId}] is now marked as "${newStatus.toUpperCase()}".`
        );
      }
    } catch (err) {
      console.error('Status change error:', err);
      alert('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const handleExportCsv = (
    mode: 'itemized' | 'summary' = 'itemized',
    scope: 'all' | 'filtered' = 'all'
  ) => {
    const targetOrders = scope === 'filtered' ? filteredOrders : orders;
    if (!targetOrders || targetOrders.length === 0) {
      alert('No orders available to export in the selected view.');
      return;
    }

    const result = exportOrdersToCsv(targetOrders, {
      mode,
      filenamePrefix: `curome-inventory-orders-${scope}`,
      depotLocation: 'Port Harcourt Logistics Depot (RC-7473017)',
    });

    if (result.success) {
      showNotification(
        `Exported ${result.rowCount} ${
          mode === 'itemized' ? 'PPE / equipment item(s)' : 'order summary record(s)'
        } to "${result.filename}" for inventory tracking.`
      );
    }
    setShowExportMenu(false);
  };

  const handleCreateNewOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) {
      alert('Please provide client name.');
      return;
    }

    const randomTicketNum = generateRandomTicketNumber();
    const newTicketId = `CDP-TICKET-${randomTicketNum}`;

    const created = await createOrder({
      ticketId: newTicketId,
      ticketNumber: randomTicketNum,
      clientName: newClientName.trim(),
      companyName: newCompanyName.trim() || 'Client Entity',
      phone: newPhone.trim(),
      deliveryAddress: newAddress.trim(),
      status: newInitialStatus,
      totalAmount: newAmount,
      items: [
        {
          name: newItemName,
          quantity: newItemQty,
          unitPrice: Math.round(newAmount / (newItemQty || 1)),
          specs: 'Custom order created from Admin Logistics Portal',
        },
      ],
      source: 'admin-portal',
    });

    setOrders((prev) => [created, ...prev]);
    setShowAddModal(false);
    showNotification(`New active order created with Ticket [${newTicketId}]!`);
  };

  if (!isOpen) return null;

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      o.ticketId.toLowerCase().includes(q) ||
      o.clientName.toLowerCase().includes(q) ||
      (o.companyName && o.companyName.toLowerCase().includes(q)) ||
      String(o.ticketNumber).includes(q) ||
      o.deliveryAddress.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'all' || o.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'Packed':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'Dispatched':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300 font-bold';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
      case 'Quality Check':
        return 'bg-blue-100 text-blue-900 border-blue-300 font-bold';
      case 'Processing':
        return 'bg-sky-100 text-sky-900 border-sky-300 font-bold';
      case 'Received':
        return 'bg-slate-100 text-slate-800 border-slate-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-3xl border border-red-500/40 shadow-2xl w-full max-w-5xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Secret Admin Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border-b border-red-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
              {isAuthenticated ? <Unlock className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-red-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-500/40">
                  Curome Internal Secret Logistics Desk
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block">
                  RC-7473017 • Port Harcourt Depot
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-extrabold text-white">
                {isAuthenticated ? 'Active User Orders & Tracking Status Controller' : 'Logistics Admin Authorization'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={loadOrdersList}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Refresh Orders"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-orange-400' : ''}`} />
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-900/60 border border-slate-700 text-slate-300 hover:text-red-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Lock Admin Terminal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lock Desk</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTHENTICATION GATE IF NOT SIGNED IN WITH 2013 */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 my-auto max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 shadow-xl shadow-red-950/50">
              <KeyRound className="w-8 h-8 text-red-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-black text-white">Enter Admin Password</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                This administrative controller is reserved for authorized Curome de Paix logistics and dispatch personnel. Please enter your security password to proceed.
              </p>
            </div>

            <form onSubmit={handleVerifyPassword} className="w-full space-y-4">
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={enteredPassword}
                  onChange={(e) => {
                    setEnteredPassword(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="Enter Admin Password"
                  autoFocus
                  maxLength={12}
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-center text-xl font-mono tracking-widest text-white placeholder:text-slate-600 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Numpad */}
              <div className="grid grid-cols-3 gap-2 pt-2 max-w-xs mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => {
                      setEnteredPassword((prev) => prev + digit);
                      if (authError) setAuthError(null);
                    }}
                    className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white font-mono text-lg font-bold transition-colors cursor-pointer"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setEnteredPassword('');
                    setAuthError(null);
                  }}
                  className="py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white font-mono text-xs font-bold transition-colors cursor-pointer"
                >
                  CLEAR
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEnteredPassword((prev) => prev + '0');
                    if (authError) setAuthError(null);
                  }}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white font-mono text-lg font-bold transition-colors cursor-pointer"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEnteredPassword((prev) => prev.slice(0, -1));
                    if (authError) setAuthError(null);
                  }}
                  className="py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white font-mono text-sm font-bold transition-colors cursor-pointer"
                  title="Backspace"
                >
                  ⌫
                </button>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-200 text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in duration-200">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying || !enteredPassword}
                  className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>Unlock Desk</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="pt-2 text-slate-500 text-xs flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span>Authorized Security Key Required • Restricted Logistics Access</span>
            </div>
          </div>
        ) : (
          <>
            {/* Top Navigation Tabs: Orders Controller vs Adon Inventory Publisher */}
            <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 bg-slate-950 border-b border-slate-800">
              <button
                type="button"
                onClick={() => setAdminTab('orders')}
                className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border-t border-x ${
                  adminTab === 'orders'
                    ? 'bg-slate-900 text-white border-slate-700 shadow-xs'
                    : 'bg-transparent text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50'
                }`}
                id="admin-tab-orders"
              >
                <Package className="w-4 h-4 text-orange-400" />
                <span>Orders & Tracking Controller</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 text-[10px] font-mono font-bold">
                  {orders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAdminTab('adon')}
                className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border-t border-x ${
                  adminTab === 'adon'
                    ? 'bg-slate-900 text-orange-400 border-orange-500/50 shadow-xs'
                    : 'bg-transparent text-slate-400 hover:text-orange-300 border-transparent hover:bg-slate-900/50'
                }`}
                id="admin-tab-adon"
              >
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Adon (Product & Inventory Publisher)</span>
                <span className="px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider">
                  Live
                </span>
              </button>
            </div>

            {adminTab === 'adon' ? (
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(92vh-160px)]">
                <AdonProductPublisher />
              </div>
            ) : (
              <>
                {/* Categorized Active Orders Status Summary Card */}
                <div className="p-4 sm:p-6 bg-slate-950/90 border-b border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-red-500" />
                    <span>Active Orders Status Breakdown</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Live distribution of requisitions categorized by operational stage
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                    Total Active: <strong className="text-white font-bold">{orders.length}</strong>
                  </span>

                  {/* Download CSV Dropdown for Inventory Tracking */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowExportMenu((prev) => !prev)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-98 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-950/40 border border-emerald-500/30"
                      title="Download orders list as CSV spreadsheet for inventory tracking"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Download CSV</span>
                      <ChevronDown
                        className={`w-3 h-3 text-emerald-200 transition-transform duration-150 ${
                          showExportMenu ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {showExportMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowExportMenu(false)}
                        />
                        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-950 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-3 py-1.5 border-b border-slate-800 flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                            Inventory Export Format
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">
                            CSV (RFC-4180)
                          </span>
                        </div>

                        <div className="py-1 space-y-1">
                          <button
                            type="button"
                            onClick={() => handleExportCsv('itemized', 'all')}
                            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 text-xs text-white flex flex-col gap-0.5 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center justify-between font-bold text-emerald-400">
                              <span className="flex items-center gap-1.5">
                                <Download className="w-3.5 h-3.5" />
                                <span>Itemized Stock Breakdown</span>
                              </span>
                              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
                                All ({orders.length})
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              Detailed row per safety item with quantity, sizes, colors & pricing
                            </span>
                          </button>

                          {filteredOrders.length !== orders.length && (
                            <button
                              type="button"
                              onClick={() => handleExportCsv('itemized', 'filtered')}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 text-xs text-white flex flex-col gap-0.5 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center justify-between font-bold text-sky-400">
                                <span className="flex items-center gap-1.5">
                                  <Filter className="w-3.5 h-3.5" />
                                  <span>Filtered View Itemized</span>
                                </span>
                                <span className="text-[10px] font-mono bg-sky-950 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800">
                                  {filteredOrders.length}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400">
                                Export only currently matched orders from search & status filters
                              </span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleExportCsv('summary', 'all')}
                            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 text-xs text-white flex flex-col gap-0.5 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center justify-between font-bold text-amber-400">
                              <span className="flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5" />
                                <span>Orders Summary Report</span>
                              </span>
                              <span className="text-[10px] font-mono bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800">
                                Summary
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              Single row per order ticket with total items count and financials
                            </span>
                          </button>
                        </div>
                      </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Order</span>
                  </button>
                </div>
              </div>

              {/* 4 Categorized Status Metric Cards: Received, Processing, Quality Check, Dispatched */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Received */}
                <button
                  type="button"
                  onClick={() => setStatusFilter(statusFilter.toLowerCase() === 'received' ? 'all' : 'Received')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer group ${
                    statusFilter.toLowerCase() === 'received'
                      ? 'bg-amber-950/70 border-amber-500 ring-2 ring-amber-500/40'
                      : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider">
                      Received
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-amber-400" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                      {orders.filter((o) => o.status === 'Received').length}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">orders</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">New requisitions logged</span>
                </button>

                {/* 2. Processing */}
                <button
                  type="button"
                  onClick={() => setStatusFilter(statusFilter.toLowerCase() === 'processing' ? 'all' : 'Processing')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer group ${
                    statusFilter.toLowerCase() === 'processing'
                      ? 'bg-sky-950/70 border-sky-500 ring-2 ring-sky-500/40'
                      : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-sky-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-sky-400 uppercase tracking-wider">
                      Processing
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                      <Package className="w-4 h-4 text-sky-400" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                      {orders.filter((o) => o.status === 'Processing').length}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">orders</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Factory tailoring & sizing</span>
                </button>

                {/* 3. Quality Check */}
                <button
                  type="button"
                  onClick={() => setStatusFilter(statusFilter.toLowerCase() === 'quality check' ? 'all' : 'Quality Check')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer group ${
                    statusFilter.toLowerCase() === 'quality check'
                      ? 'bg-blue-950/70 border-blue-500 ring-2 ring-blue-500/40'
                      : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-blue-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-blue-400 uppercase tracking-wider">
                      Quality Check
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                      {orders.filter((o) => o.status === 'Quality Check').length}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">orders</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">HSE & ISO compliance checks</span>
                </button>

                {/* 4. Dispatched */}
                <button
                  type="button"
                  onClick={() => setStatusFilter(statusFilter.toLowerCase() === 'dispatched' ? 'all' : 'Dispatched')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer group ${
                    statusFilter.toLowerCase() === 'dispatched'
                      ? 'bg-indigo-950/70 border-indigo-500 ring-2 ring-indigo-500/40'
                      : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-indigo-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-indigo-400 uppercase tracking-wider">
                      Dispatched
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-indigo-400" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                      {orders.filter((o) => o.status === 'Dispatched').length}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">orders</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">In transit across Rivers State</span>
                </button>
              </div>
            </div>

        {/* Success Toast */}
        {successToast && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-850 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Ticket # (e.g. CDP-TICKET-84291), Client, Company, or Location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Status Filter Tabs & Quick CSV Export */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'Packed', 'Dispatched', 'Delivered', 'Processing', 'Quality Check'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter.toLowerCase() === st.toLowerCase()
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {st === 'all' ? 'All Orders' : st}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handleExportCsv('itemized', 'filtered')}
              className="px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer bg-slate-800 hover:bg-emerald-900/60 text-slate-300 hover:text-emerald-200 border border-slate-700 flex items-center gap-1.5 ml-1"
              title={`Download CSV for ${filteredOrders.length} orders in this view`}
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
              <span className="font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-emerald-400">
                {filteredOrders.length}
              </span>
            </button>
          </div>
        </div>

        {/* Active Orders List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Package className="w-12 h-12 mx-auto text-slate-600" />
              <p className="text-sm font-semibold">No active orders matching criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="text-xs text-red-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isUpdating = updatingId === order.id;

              return (
                <div
                  key={order.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-850 border border-slate-700/80 hover:border-slate-600 transition-all space-y-4 shadow-md"
                >
                  {/* Order Top Line */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/50 pb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-extrabold text-orange-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
                        {order.ticketId}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-orange-400" />
                        <span className="text-base font-bold text-white">{order.clientName}</span>
                      </div>
                      {order.companyName && (
                        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {order.companyName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {order.dateCreated?.slice(0, 16) || 'Recent'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-md text-xs border ${getStatusBadgeStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Core Admin Fields: User Name, Email, Phone Number, Delivery Address, Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                    {/* User & Contact & Delivery Info */}
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <User className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">User's Name</span>
                          <p className="font-bold text-white text-sm">{order.clientName}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Email</span>
                          {order.email ? (
                            <a href={`mailto:${order.email}`} className="font-medium text-sky-300 hover:underline">
                              {order.email}
                            </a>
                          ) : (
                            <span className="text-slate-500 italic">No email provided</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Phone Number</span>
                          {order.phone ? (
                            <a href={`tel:${order.phone}`} className="font-medium text-emerald-300 hover:underline font-mono">
                              {order.phone}
                            </a>
                          ) : (
                            <span className="text-slate-500 italic">No phone number provided</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Delivery Address</span>
                          <p className="font-medium text-slate-200 leading-relaxed">{order.deliveryAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Their Details (Items, Specs, Notes) */}
                    <div className="space-y-2.5 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
                      <div className="flex items-start gap-2.5">
                        <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div className="w-full">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Their Details & Requisition</span>
                            {order.totalAmount > 0 && (
                              <span className="text-xs font-mono font-bold text-orange-400">
                                {formatNaira(order.totalAmount)}
                              </span>
                            )}
                          </div>

                          {order.items && order.items.length > 0 ? (
                            <div className="mt-1.5 space-y-1.5">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-[11px]">
                                  <div className="flex justify-between items-start">
                                    <span className="font-semibold text-slate-200">
                                      {it.quantity}x {it.name}
                                    </span>
                                    {it.unitPrice !== undefined && it.unitPrice > 0 && (
                                      <span className="text-orange-400 font-mono shrink-0 ml-2">
                                        {formatNaira(it.unitPrice * it.quantity)}
                                      </span>
                                    )}
                                  </div>
                                  {it.specs && (
                                    <p className="text-[10px] text-slate-400 mt-1 italic leading-tight">
                                      Specs: {it.specs}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-slate-400 italic text-[11px] mt-1">General Safety & Protective Workwear Order</p>
                          )}

                          {order.thingsNotWanted && (
                            <div className="mt-2 text-[10px] bg-red-950/40 border border-red-900/40 text-red-300 p-2 rounded-lg">
                              <strong>Excluded / Not Wanted:</strong> {order.thingsNotWanted}
                            </div>
                          )}

                          {order.customNotes && (
                            <div className="mt-1.5 text-[10px] bg-slate-950 p-2 rounded-lg text-slate-400 border border-slate-800">
                              <strong>Custom Notes:</strong> {order.customNotes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STATUS CONTROLLER - The 3 Key Buttons: Packed, Dispatched, Delivered + Track */}
                  <div className="pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                        Change Status:
                      </span>

                      {/* 1. PACKED */}
                      <button
                        onClick={() => handleStatusChange(order, 'Packed')}
                        disabled={isUpdating}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          order.status === 'Packed'
                            ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 ring-2 ring-amber-300'
                            : 'bg-slate-800 text-amber-300 hover:bg-amber-950/70 border border-amber-600/40'
                        }`}
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Packed</span>
                      </button>

                      {/* 2. DISPATCHED */}
                      <button
                        onClick={() => handleStatusChange(order, 'Dispatched')}
                        disabled={isUpdating}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          order.status === 'Dispatched'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400'
                            : 'bg-slate-800 text-indigo-300 hover:bg-indigo-950/70 border border-indigo-600/40'
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Dispatched</span>
                      </button>

                      {/* 3. DELIVERED */}
                      <button
                        onClick={() => handleStatusChange(order, 'Delivered')}
                        disabled={isUpdating}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400'
                            : 'bg-slate-800 text-emerald-300 hover:bg-emerald-950/70 border border-emerald-600/40'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Delivered</span>
                      </button>

                      {/* Dropdown for other states if needed */}
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                        className="bg-slate-900 border border-slate-700 text-slate-300 text-xs px-2 py-1.5 rounded-lg"
                      >
                        <option value="Received">Received</option>
                        <option value="Processing">Processing</option>
                        <option value="Quality Check">Quality Check</option>
                        <option value="Packed">Packed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>

                    {/* Actions: Export Order CSV & View in Tracker */}
                    <div className="flex items-center gap-3 ml-auto flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          const res = exportOrdersToCsv([order], {
                            mode: 'itemized',
                            filenamePrefix: `curome-order-${order.ticketId}`,
                            depotLocation: 'Port Harcourt Logistics Depot (RC-7473017)',
                          });
                          if (res.success) {
                            showNotification(`Downloaded CSV inventory sheet for [${order.ticketId}]!`);
                          }
                        }}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                        title="Download CSV for this individual order"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Order CSV</span>
                      </button>

                      <button
                        onClick={() => {
                          onClose();
                          if (onTrackOrderInTracker) {
                            onTrackOrderInTracker(order.ticketId);
                          }
                          const el = document.getElementById('order-tracking');
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <span>View in Public Tracker</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
              </>
            )}
          </>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected to Local Logistics Database (/api/orders)</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close Admin Desk
          </button>
        </div>
      </div>

      {/* Nested Add Order Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-extrabold text-white text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-400" />
                <span>Create New Active Order</span>
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewOrder} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Engr. Victor Peters"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Company</label>
                  <input
                    type="text"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="e.g. TotalEnergies Contractor"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Delivery Address (Rivers State)</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="e.g. Trans-Amadi Yard / Onne Port"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Items Description</label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Initial Status</label>
                <select
                  value={newInitialStatus}
                  onChange={(e) => setNewInitialStatus(e.target.value as OrderStatus)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                >
                  <option value="Received">Received</option>
                  <option value="Processing">Processing</option>
                  <option value="Quality Check">Quality Check</option>
                  <option value="Packed">Packed</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
