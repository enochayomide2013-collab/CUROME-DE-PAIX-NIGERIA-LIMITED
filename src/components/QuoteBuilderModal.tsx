import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { ProductItem } from '../types';
import { getAllLiveProducts } from '../utils/productsManager';
import { formatNaira, getWhatsAppUrl, generateTicketId, copyToClipboard } from '../utils/communication';
import {
  X,
  Plus,
  Minus,
  Check,
  Calculator,
  ShieldAlert,
  Send,
  MessageSquare,
  Sparkles,
  Info,
  CheckCircle2,
  Copy,
} from 'lucide-react';

interface QuoteBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: ProductItem | null;
  onCompleteQuote: (quoteData: any) => void;
}

export const QuoteBuilderModal: React.FC<QuoteBuilderModalProps> = ({
  isOpen,
  onClose,
  initialProduct,
  onCompleteQuote,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    const success = await copyToClipboard(COMPANY_INFO.email);
    if (success) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };
  const allProducts = getAllLiveProducts();

  // State for item quantities
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    const prods = getAllLiveProducts();
    prods.forEach((p) => {
      initial[p.id] = initialProduct?.id === p.id ? 20 : 0;
    });
    // If no initial product, set default starter batch on first 2 available items
    if (!initialProduct && prods.length > 0) {
      if (prods[0]) initial[prods[0].id] = 25;
      if (prods[1]) initial[prods[1].id] = 25;
    }
    return initial;
  });

  const [includeCustomEmbroidery, setIncludeCustomEmbroidery] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('Port Harcourt / Niger Delta');
  const [additionalNotes, setAdditionalNotes] = useState('');

  if (!isOpen) return null;

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const setDirectQuantity = (productId: string, val: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, isNaN(val) ? 0 : val),
    }));
  };

  // Calculations
  const selectedItems = allProducts.filter((p) => (quantities[p.id] || 0) > 0);
  const totalUnits = selectedItems.reduce((acc, p) => acc + (quantities[p.id] || 0), 0);

  const rawSubtotal = selectedItems.reduce(
    (acc, p) => acc + p.unitPriceEstimate * (quantities[p.id] || 0),
    0
  );

  // Bulk Discount tiers:
  // 50+ total units = 10% discount
  // 100+ total units = 15% discount
  let discountRate = 0;
  if (totalUnits >= 100) {
    discountRate = 0.15;
  } else if (totalUnits >= 50) {
    discountRate = 0.1;
  } else if (totalUnits >= 20) {
    discountRate = 0.05;
  }

  const discountAmount = rawSubtotal * discountRate;
  const embroideryUnitFee = 1500; // NGN per unit for custom corporate embroidery
  const embroideryTotal = includeCustomEmbroidery ? totalUnits * embroideryUnitFee : 0;
  const grandTotal = Math.max(0, rawSubtotal - discountAmount + embroideryTotal);

  const handleSubmitQuoteEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = generateTicketId();
    const quotePayload = {
      id: ticketId,
      fullName: contactName,
      companyName: companyName || 'Private Corporate Inquiry',
      email: email,
      phone: phone,
      subject: `Formal PPE Quote Estimate (${totalUnits} units)`,
      serviceInterest: 'Bulk PPE Procurement & Custom Tailoring',
      deliveryLocation,
      message: `Quote Request for ${totalUnits} safety items. Total Estimate: ${formatNaira(
        grandTotal
      )}.\nItems:\n${selectedItems
        .map((p) => `- ${p.name}: ${quantities[p.id]} pcs @ ${formatNaira(p.unitPriceEstimate)}`)
        .join('\n')}\nCustom Embroidery: ${
        includeCustomEmbroidery ? 'Yes (+₦1,500/unit)' : 'No'
      }\nNotes: ${additionalNotes || 'Standard delivery requested'}`,
      timestamp: new Date().toLocaleString(),
      recipientEmail: COMPANY_INFO.email,
      totalUnits,
      grandTotal,
      selectedItems: selectedItems.map((p) => ({
        name: p.name,
        qty: quantities[p.id],
        unitPrice: p.unitPriceEstimate,
      })),
      status: 'sent',
    };

    const mailtoSubject = `Formal PPE Quote [${ticketId}] - ${contactName} (${companyName || 'Client'})`;
    const mailtoBody = `CUROME DE PAIX NIGERIA LIMITED (${COMPANY_INFO.rcNumber})
FORMAL PPE QUOTE REQUEST
Ticket ID: ${ticketId}
Date: ${quotePayload.timestamp}

Full Name: ${contactName}
Company: ${companyName || 'Not specified'}
Email: ${email}
Phone: ${phone}
Delivery Location: ${deliveryLocation}

Total Estimate: ${formatNaira(grandTotal)} (${totalUnits} units)
Volume Discount: ${(discountRate * 100).toFixed(0)}% OFF
Custom Corporate Embroidery: ${includeCustomEmbroidery ? 'Yes (+₦1,500/unit)' : 'No'}

Items Breakdown:
${selectedItems
  .map((p) => `• ${p.name}: ${quantities[p.id]} units (~${formatNaira(p.unitPriceEstimate)}/unit)`)
  .join('\n')}

Specific Notes:
${additionalNotes || 'Standard catalog dispatch requested'}

Office: Omodu Street off NTA Road, Port Harcourt, Rivers State
Recipient Email: ${COMPANY_INFO.email}
`;

    const mailtoUrl = `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
      mailtoSubject
    )}&body=${encodeURIComponent(mailtoBody)}`;

    window.location.href = mailtoUrl;

    setTimeout(() => {
      onCompleteQuote(quotePayload);
      onClose();
    }, 400);
  };

  const handleWhatsAppQuote = () => {
    const summaryText = `*CUROME DE PAIX NIGERIA LIMITED - QUOTE REQUEST*\n\n` +
      `*Company:* ${companyName || 'Corporate Client'}\n` +
      `*Contact:* ${contactName} (${phone || 'No phone supplied'})\n` +
      `*Location:* ${deliveryLocation}\n\n` +
      `*Selected Safety Gear (${totalUnits} Units):*\n` +
      selectedItems
        .map((p) => `• ${p.name}: *${quantities[p.id]} pcs* (~${formatNaira(p.unitPriceEstimate)}/pc)`)
        .join('\n') +
      `\n\n*Custom Embroidery:* ${includeCustomEmbroidery ? 'Yes' : 'No'}\n` +
      `*Estimated Total:* *${formatNaira(grandTotal)}*\n` +
      (additionalNotes ? `*Notes:* ${additionalNotes}\n\n` : '\n') +
      `Please confirm official proforma invoice and availability for Port Harcourt dispatch.`;

    window.open(getWhatsAppUrl(summaryText), '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      id="quote-calculator-modal"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto border border-slate-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Interactive PPE Quote Estimator
              </h3>
              <p className="text-xs text-slate-500">
                Direct factory estimates with transparent volume discounts & Port Harcourt delivery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
            id="close-quote-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Step 1: Select Products & Quantities */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Configure Quantities (Boots, Extinguishers, Coveralls, Helmets & PPE)
              </span>
              <span className="text-xs text-slate-500">
                Total selected:{' '}
                <strong className="text-slate-900 font-bold">{totalUnits} units</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {allProducts.map((p) => {
                const qty = quantities[p.id] || 0;
                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      qty > 0
                        ? 'bg-orange-50/50 border-orange-300 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-11 h-11 rounded-lg object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {p.name}
                        </div>
                        <div className="text-[11px] font-semibold text-orange-600">
                          {formatNaira(p.unitPriceEstimate)}
                          <span className="text-slate-400 font-normal"> / pc</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQuantity(p.id, -5)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer"
                        title="Decrease by 5"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="number"
                        min="0"
                        value={qty}
                        onChange={(e) => setDirectQuantity(p.id, parseInt(e.target.value))}
                        className="w-12 text-center text-xs font-bold py-1 border border-slate-300 rounded-md bg-white text-slate-900"
                      />

                      <button
                        type="button"
                        onClick={() => updateQuantity(p.id, 5)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer"
                        title="Increase by 5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Customization & Discounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
            {/* Custom Logo / Embroidery Checkbox */}
            <div
              onClick={() => setIncludeCustomEmbroidery(!includeCustomEmbroidery)}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3 cursor-pointer hover:bg-orange-50/50 hover:border-orange-200 transition-colors"
            >
              <input
                type="checkbox"
                checked={includeCustomEmbroidery}
                onChange={() => {}}
                className="mt-1 rounded text-orange-600 focus:ring-orange-500 h-4 w-4"
              />
              <div className="text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>Add Company Logo Embroidery & Branding</span>
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  High-definition computerized chest/back embroidery (+₦1,500 per unit).
                </p>
              </div>
            </div>

            {/* Bulk Volume Discount Badge */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-bold text-emerald-900">
                  {discountRate > 0
                    ? `Volume Discount Applied: ${(discountRate * 100).toFixed(0)}% OFF`
                    : 'Bulk Discount Available'}
                </div>
                <p className="text-emerald-700 text-[11px] mt-0.5">
                  {discountRate > 0
                    ? `You saved ${formatNaira(discountAmount)} on this order size!`
                    : 'Order 20+ units to unlock 5% to 15% automatic manufacturer discounts.'}
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: Client Details Form */}
          <form id="quote-form" onSubmit={handleSubmitQuoteEmail} className="space-y-4 pt-2 border-t border-slate-200">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Your Contact & Company Details (For Official Proforma)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engr. Boma Peters"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Niger Delta Marine Services"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com (For auto-response receipt)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Phone / WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+234 803 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Delivery Destination / Site Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Omodu St NTA Rd / Trans-Amadi / Bonny Island / Onne Port"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Specific Requirements or Sizing Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Specify color preferences (Navy, Orange), size distribution (L, XL), or urgent dispatch deadline..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 bg-white"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer with Estimated Cost Summary and Submission Buttons */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left w-full sm:w-auto">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Estimated Total ({totalUnits} Items)
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-400">
                {formatNaira(grandTotal)}
              </span>
              {discountRate > 0 && (
                <span className="text-xs text-emerald-400 font-bold">
                  (Saved {formatNaira(discountAmount)})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span>Direct to: <strong className="text-white">{COMPANY_INFO.email}</strong></span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                title="Copy email"
              >
                {copiedEmail ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* WhatsApp Quote Trigger */}
            <button
              type="button"
              onClick={handleWhatsAppQuote}
              disabled={totalUnits === 0}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl font-bold text-xs text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Submit via WhatsApp directly"
            >
              <MessageSquare className="w-4 h-4 text-emerald-900" />
              <span>Send via WhatsApp</span>
            </button>

            {/* Email / Official Proforma Submit */}
            <button
              type="submit"
              form="quote-form"
              disabled={totalUnits === 0}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl font-bold text-xs text-white bg-orange-600 hover:bg-orange-500 transition-colors shadow-lg flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              id="submit-formal-quote-btn"
            >
              <Send className="w-4 h-4" />
              <span>Submit & Auto-Respond</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
