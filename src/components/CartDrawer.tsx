import React, { useState } from 'react';
import { CartItem, CartSubmission } from '../types';
import { COMPANY_INFO } from '../data/companyData';
import {
  formatNaira,
  getWhatsAppUrl,
  generateTicketId,
  copyToClipboard,
  getGmailComposeUrl,
} from '../utils/communication';
import { downloadPdfQuote, PdfQuoteData } from '../utils/pdfQuoteGenerator';
import { PrintReadyQuoteModal } from './PrintReadyQuoteModal';
import { createOrder } from '../utils/ordersApi';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  X,
  Send,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Sliders,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Download,
  Printer,
  FileDown,
  Tag,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onSubmitCartOrder: (submission: CartSubmission) => void;
  onOpenContractWithCart?: (items: CartItem[]) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSubmitCartOrder,
  onOpenContractWithCart,
}) => {
  // Assigned ticket number generated uniquely for this procurement session
  const [assignedTicketId] = useState<string>(() => generateTicketId());
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [pdfDownloadNotice, setPdfDownloadNotice] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    deliveryAddress: 'Port Harcourt, Rivers State',
    generalSpecifications: '',
    generalThingsNotWanted: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    const success = await copyToClipboard(COMPANY_INFO.email);
    if (success) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  if (!isOpen) return null;

  const grandTotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Please enter your full name';
    if (!formData.email.trim() || !formData.email.includes('@'))
      errors.email = 'Please provide a valid email address';
    if (!formData.phone.trim()) errors.phone = 'Please provide your phone number';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getQuoteData = (): PdfQuoteData => ({
    ticketNumber: assignedTicketId,
    clientName: formData.fullName.trim() || 'Authorized Client / Procurement Entity',
    companyName: formData.companyName.trim() || 'Private Industrial Client',
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    deliveryAddress: formData.deliveryAddress.trim() || 'Port Harcourt, Rivers State',
    generalSpecifications: formData.generalSpecifications,
    generalThingsNotWanted: formData.generalThingsNotWanted,
    items: cartItems,
    grandTotal,
    dateStr: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  });

  const handleDownloadPdfQuote = () => {
    if (cartItems.length === 0) return;
    setIsGeneratingPdf(true);
    try {
      const data = getQuoteData();
      const result = downloadPdfQuote(data);
      if (result.success) {
        setPdfDownloadNotice(`Downloaded: ${result.filename} (Assigned Ticket: ${assignedTicketId})`);
        setTimeout(() => setPdfDownloadNotice(null), 6000);
      }
    } catch (err) {
      console.error('Failed to generate PDF quote:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const submission: CartSubmission = {
      id: assignedTicketId,
      fullName: formData.fullName,
      companyName: formData.companyName || 'Private Procurement',
      email: formData.email,
      phone: formData.phone,
      deliveryAddress: formData.deliveryAddress,
      items: cartItems,
      generalSpecifications: formData.generalSpecifications,
      generalThingsNotWanted: formData.generalThingsNotWanted,
      grandTotal,
      timestamp: new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }),
      recipientEmail: COMPANY_INFO.email, // decuromeintl@gmail.com
    };

    // Prepare email body formatted for decuromeintl@gmail.com
    const itemSummary = cartItems
      .map(
        (it, idx) =>
          `${idx + 1}. [${it.category.toUpperCase()}] ${it.name}\n   - Quantity: ${it.quantity} units\n   - Estimated Unit Price: ₦${it.unitPrice.toLocaleString()}\n   - Subtotal: ₦${(it.unitPrice * it.quantity).toLocaleString()}\n   - Item Specifics: ${it.customSpecifications || 'Standard catalog spec'}\n   - Specifics Not Wanted: ${it.thingsNotWanted || 'None specified'}`
      )
      .join('\n\n');

    const mailtoSubject = `Procurement Cart Order [${submission.id}] - ${formData.fullName} - Curome de Paix`;
    const mailtoBody = `CUROME DE PAIX NIGERIA LIMITED (${COMPANY_INFO.rcNumber})
OFFICIAL PROCUREMENT CART SUBMISSION
Destination: ${COMPANY_INFO.email}
Reference: ${submission.id}
Date: ${submission.timestamp}

--------------------------------------------------
CLIENT & CONTACT DETAILS:
--------------------------------------------------
Full Name: ${formData.fullName}
Company / Entity: ${formData.companyName || 'Not specified'}
Email Address: ${formData.email}
Phone Number: ${formData.phone}
Delivery Address: ${formData.deliveryAddress}

--------------------------------------------------
ORDERED ITEMS (Coveralls, Helmets, Glasses, Boots, Engineering Services):
--------------------------------------------------
${itemSummary}

--------------------------------------------------
ORDER TOTAL:
--------------------------------------------------
Estimated Baseline Total: ₦${grandTotal.toLocaleString()} (Subject to current market review & volume discounts)

--------------------------------------------------
CLIENT SPECIFICATIONS:
--------------------------------------------------
${formData.generalSpecifications || 'Standard manufacturing specifications requested.'}

--------------------------------------------------
THINGS NOT WANTED / PROHIBITED EXCLUSIONS:
--------------------------------------------------
${formData.generalThingsNotWanted || 'No specific exclusions noted.'}

--------------------------------------------------
Office & Factory: Omodu Street off NTA Road, Port Harcourt, Rivers State
Phone: ${COMPANY_INFO.phone} | WhatsApp: ${COMPANY_INFO.whatsappNumber}
Official Email: ${COMPANY_INFO.email}
`;

    const mailtoUrl = `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
      mailtoSubject
    )}&body=${encodeURIComponent(mailtoBody)}`;

    // Also register order in the order tracking system
    createOrder({
      ticketNumber: assignedTicketId,
      clientName: formData.fullName,
      companyName: formData.companyName || 'Private Procurement',
      email: formData.email,
      phone: formData.phone,
      deliveryAddress: formData.deliveryAddress || 'Port Harcourt, Rivers State',
      items: cartItems.map((ci) => ({
        name: ci.name,
        category: ci.category,
        quantity: ci.quantity,
        unitPrice: ci.unitPrice,
        specs: ci.customSpecifications || 'Standard',
      })),
      totalAmount: grandTotal,
      customNotes: `Requisition created via web cart. Specs: ${formData.generalSpecifications || 'Standard'}`,
    }).catch((err) => console.log('Auto order tracking registry:', err));

    // Open user's email client
    window.location.href = mailtoUrl;

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitCartOrder(submission);
      onClose();
    }, 400);
  };

  const handleWhatsAppSend = () => {
    const itemSummary = cartItems
      .map(
        (it, idx) =>
          `*${idx + 1}. ${it.name}* (Qty: ${it.quantity}) - ₦${(it.unitPrice * it.quantity).toLocaleString()}`
      )
      .join('\n');

    const text = `*CUROME DE PAIX NIGERIA LIMITED (${COMPANY_INFO.rcNumber})*
*Procurement Cart Order*

*Client:* ${formData.fullName || 'Prospective Client'}
*Phone:* ${formData.phone || 'Pending'}
*Email:* ${formData.email || 'Pending'}
*Delivery Location:* ${formData.deliveryAddress}

*Selected Items:*
${itemSummary}

*Estimated Baseline Total:* ₦${grandTotal.toLocaleString()}
*Specifications:* ${formData.generalSpecifications || 'Standard'}
*Things NOT Wanted / Exclusions:* ${formData.generalThingsNotWanted || 'None'}

Please confirm availability and dispatch from Omodu Street off NTA Road, Port Harcourt.`;

    window.open(getWhatsAppUrl(text), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">Procurement Cart</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-slate-400">
                    Curome de Paix Nigeria Limited • RC-7473017
                  </p>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 border border-slate-700 font-semibold hidden sm:inline-block">
                    Ticket: {assignedTicketId}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-rose-950/40"
                  title="Clear Cart"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Your Procurement Cart is Empty</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Explore our coveralls, safety helmets, protective goggles, boots, and engineering services
                  to assemble your equipment requirements.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <>
                {/* Download PDF Quote & Ticket Header Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white border border-slate-700 shadow-md space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0">
                        <Tag className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                          Assigned Procurement Ticket
                        </span>
                        <span className="font-mono text-xs sm:text-sm font-extrabold text-amber-300">
                          {assignedTicketId}
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right text-[11px] text-slate-300">
                      <span className="text-slate-400">Baseline Total: </span>
                      <span className="font-bold text-amber-400 font-mono text-xs">
                        {formatNaira(grandTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadPdfQuote}
                      disabled={isGeneratingPdf}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                      id="cart-top-download-pdf-btn"
                      title="Download professional vector-ready PDF quote"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Quote'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPreviewModalOpen(true)}
                      className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Preview printable proforma document"
                    >
                      <Printer className="w-4 h-4 text-slate-400" />
                      <span>Preview Document</span>
                    </button>
                  </div>

                  {pdfDownloadNotice && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">{pdfDownloadNotice}</span>
                    </div>
                  )}
                </div>

                {/* Notice banner */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Direct Email Order to decuromeintl@gmail.com:</strong> Enter your details below,
                    specify your precise requirements, and state <em>any things you do NOT want</em>. We will
                    review and issue an immediate formal invoice and dispatch timeline.
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span>Selected Equipment & Services</span>
                    <span>Current Market Est.</span>
                  </div>

                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 uppercase">
                            {item.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">{item.name}</h4>
                          <p className="text-xs text-slate-500">
                            Unit Baseline: ₦{item.unitPrice.toLocaleString()}
                          </p>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity & Subtotal Row */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-600 font-medium">Quantity:</span>
                          <div className="flex items-center rounded-lg bg-white border border-slate-300">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="p-1.5 text-slate-600 hover:text-slate-900"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 font-bold text-slate-900 min-w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="p-1.5 text-slate-600 hover:text-slate-900"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Subtotal</span>
                          <span className="text-sm font-extrabold text-slate-900">
                            ₦{(item.unitPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Item-specific exclusions / notes if entered */}
                      {item.thingsNotWanted && (
                        <div className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                          <strong>Exclusions for this item:</strong> {item.thingsNotWanted}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Payment Guarantee Notice */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/90 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-emerald-950">
                    <div className="font-extrabold flex items-center gap-1.5 text-emerald-900">
                      <span>Payment on Delivery (POD) Available</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-200/80 text-[10px] text-emerald-950 uppercase font-bold">
                        Zero Risk Guarantee
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Inspect equipment at your site in Port Harcourt or dispatch location before payment release. Bank Transfer on Delivery or Corporate LPO terms accepted.
                    </p>
                  </div>
                </div>

                {/* Provision Contract Callout button */}
                {onOpenContractWithCart && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase">
                        <FileCheck className="w-4 h-4" />
                        <span>Need a Formal Agreement?</span>
                      </div>
                      <p className="text-xs text-blue-100">
                        View or print a legally binding <strong>Provision Contract</strong> with these {cartItems.length} items.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenContractWithCart(cartItems)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-amber-400 transition-colors shrink-0 shadow-xs"
                    >
                      View Contract
                    </button>
                  </div>
                )}

                {/* Client Information Form */}
                <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-orange-600" />
                      <span>Client & Procurement Contact Details</span>
                    </h3>
                    <span className="text-[11px] text-slate-400">* Required</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Engr. Michael Okon"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className={`w-full px-3 py-2 rounded-xl border text-xs ${
                          formErrors.fullName
                            ? 'border-rose-500 bg-rose-50'
                            : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                        }`}
                      />
                      {formErrors.fullName && (
                        <p className="text-[10px] text-rose-600 mt-1">{formErrors.fullName}</p>
                      )}
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Company / Contractor Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. TotalEnergies EPC / Onshore Ltd"
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({ ...formData, companyName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Work Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. procurement@company.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={`w-full px-3 py-2 rounded-xl border text-xs ${
                          formErrors.email
                            ? 'border-rose-500 bg-rose-50'
                            : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-[10px] text-rose-600 mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +234 803 000 0000"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className={`w-full px-3 py-2 rounded-xl border text-xs ${
                          formErrors.phone
                            ? 'border-rose-500 bg-rose-50'
                            : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-[10px] text-rose-600 mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Site Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Delivery Location / Warehouse Address in Nigeria
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Trans-Amadi Industrial Layout, Port Harcourt"
                      value={formData.deliveryAddress}
                      onChange={(e) =>
                        setFormData({ ...formData, deliveryAddress: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Custom Specifications */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-blue-600" />
                        <span>Any Custom Specifications / Inclusions Needed</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Size 44 for boots, XL for coveralls, corporate logo embroidered on left chest, high-vis orange helmets with chin straps..."
                      value={formData.generalSpecifications}
                      onChange={(e) =>
                        setFormData({ ...formData, generalSpecifications: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* CRITICAL: Things Not Wanted (Explicitly requested by user) */}
                  <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200">
                    <label className="block text-xs font-bold text-rose-900 mb-1 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Necessary Things You DON'T Want / Prohibited Features</span>
                    </label>
                    <p className="text-[11px] text-rose-700 mb-2">
                      Please state any specifications, materials, or features you strictly want excluded
                      (e.g., <em>no metallic buttons, no plastic visors, no fur lining in boots, exclude back pockets</em>).
                    </p>
                    <textarea
                      rows={2}
                      placeholder="e.g. Do NOT include metal zippers (must be non-sparking nylon), NO heavy fur lining in boots, DO NOT include front company embroidery..."
                      value={formData.generalThingsNotWanted}
                      onChange={(e) =>
                        setFormData({ ...formData, generalThingsNotWanted: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-white text-xs focus:ring-2 focus:ring-rose-500 text-slate-800"
                    />
                  </div>

                  {/* Grand Total & Dispatch Bar */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block uppercase">
                          Estimated Order Baseline
                        </span>
                        <span className="text-2xl font-black text-amber-400">
                          {formatNaira(grandTotal)}
                        </span>
                      </div>
                      <div className="text-right text-[11px] text-slate-400 flex items-center gap-1.5">
                        <span>Direct to: </span>
                        <span className="text-white font-bold">{COMPANY_INFO.email}</span>
                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                          title="Copy email"
                        >
                          {copiedEmail ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    {/* Download PDF Quote Button in bottom action bar */}
                    <button
                      type="button"
                      onClick={handleDownloadPdfQuote}
                      disabled={isGeneratingPdf}
                      className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-orange-500/60 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                      id="cart-download-pdf-quote-btn"
                      title="Generate and download print-ready PDF Quote document"
                    >
                      <Download className="w-4 h-4 text-orange-400" />
                      <span>
                        {isGeneratingPdf
                          ? 'Generating PDF Quote...'
                          : `Download PDF Quote (${assignedTicketId})`}
                      </span>
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {/* Submit & Dispatch to Email */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                        id="cart-submit-email-btn"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isSubmitting ? 'Dispatching...' : 'Send Order to Email'}</span>
                      </button>

                      {/* WhatsApp Instant Forward */}
                      <button
                        type="button"
                        onClick={handleWhatsAppSend}
                        className="w-full py-3 px-4 rounded-xl text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                        id="cart-send-whatsapp-btn"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-900" />
                        <span>Send to WhatsApp</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Assigned Ticket: <strong className="font-mono text-slate-300">{assignedTicketId}</strong></span>
                      <button
                        type="button"
                        onClick={() => setIsPreviewModalOpen(true)}
                        className="text-orange-400 hover:text-orange-300 underline cursor-pointer"
                      >
                        Preview Print-Ready Doc
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 text-center">
                      Auto-responder confirmation ticket generated upon submission • RC-7473017
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Print-Ready Quote Document Modal */}
      <PrintReadyQuoteModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        quoteData={getQuoteData()}
      />
    </div>
  );
};
