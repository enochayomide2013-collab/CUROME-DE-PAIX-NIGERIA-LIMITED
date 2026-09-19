import React, { useRef } from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { CartItem } from '../types';
import { formatNaira } from '../utils/communication';
import { PdfQuoteData, downloadPdfQuote } from '../utils/pdfQuoteGenerator';
import {
  Download,
  Printer,
  X,
  FileCheck,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface PrintReadyQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteData: PdfQuoteData;
}

export const PrintReadyQuoteModal: React.FC<PrintReadyQuoteModalProps> = ({
  isOpen,
  onClose,
  quoteData,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    downloadPdfQuote(quoteData);
  };

  const handlePrint = () => {
    window.print();
  };

  const subtotal = quoteData.grandTotal;
  const vatAmount = Math.round(subtotal * 0.075);
  const totalWithVat = subtotal + vatAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Control Bar Floating on Top */}
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Top Actions Header */}
        <div className="p-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-sm">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Official Print-Ready Document Preview
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono">
                  {quoteData.ticketNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Curome de Paix Nigeria Limited • RC-7473017 • Port Harcourt Facility
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              id="quote-modal-download-btn"
            >
              <Download className="w-4 h-4" />
              <span className="hidden xs:inline">Download PDF Quote</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
              title="Print Document or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Canvas (Printable Sheet) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center">
          <div
            ref={printAreaRef}
            className="w-full max-w-3xl bg-white rounded-2xl shadow-md border border-slate-200 p-6 sm:p-10 space-y-6 text-slate-800 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none"
            id="printable-quote-document"
          >
            {/* Top Brand Banner */}
            <div className="border-b-2 border-orange-600 pb-5 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-950 text-[10px] font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                  <span>CAC Verified Industrial Supplier • RC-7473017</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  CUROME DE PAIX NIGERIA LIMITED
                </h1>
                <p className="text-xs font-semibold text-slate-600">
                  Trading as Curome de Paix Energy Nigeria Limited
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Omodu Street off NTA Road, Port Harcourt, Rivers State, Nigeria
                </p>
                <p className="text-xs text-slate-500">
                  Phone: {COMPANY_INFO.phone} | WhatsApp: {COMPANY_INFO.whatsappNumber} | Email:{' '}
                  <strong className="text-slate-700">{COMPANY_INFO.email}</strong>
                </p>
              </div>

              {/* Document Stamp Box */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-white text-right space-y-1 sm:min-w-56">
                <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider block">
                  Official Proforma Quote
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-white block">
                  {quoteData.ticketNumber}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Date: {quoteData.dateStr || new Date().toLocaleDateString('en-GB')}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 block">
                  Valid for 30 Calendar Days
                </span>
              </div>
            </div>

            {/* Client & Delivery Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs">
              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block border-b border-slate-200 pb-1">
                  Client / Procurement Entity
                </span>
                <div className="text-slate-700 space-y-0.5">
                  <p>
                    <strong className="text-slate-900">Name:</strong>{' '}
                    {quoteData.clientName || 'Authorized Procurement Representative'}
                  </p>
                  <p>
                    <strong className="text-slate-900">Company:</strong>{' '}
                    {quoteData.companyName || 'Private Industrial Client'}
                  </p>
                  <p>
                    <strong className="text-slate-900">Email:</strong>{' '}
                    {quoteData.email || 'Pending formal transmission'}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block border-b border-slate-200 pb-1">
                  Delivery Site & Logistics
                </span>
                <div className="text-slate-700 space-y-0.5">
                  <p>
                    <strong className="text-slate-900">Phone:</strong>{' '}
                    {quoteData.phone || 'Pending confirmation'}
                  </p>
                  <p>
                    <strong className="text-slate-900">Delivery Address:</strong>{' '}
                    {quoteData.deliveryAddress || 'Port Harcourt, Rivers State'}
                  </p>
                  <p>
                    <strong className="text-slate-900">Dispatch Origin:</strong>{' '}
                    Omodu Street off NTA Road, Port Harcourt
                  </p>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Selected Equipment, Workwear & Engineering Services
                </h4>
                <span className="text-[11px] text-slate-500 font-mono">
                  {quoteData.items.length} {quoteData.items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white text-[11px]">
                      <th className="py-2.5 px-3 font-semibold text-center w-8">#</th>
                      <th className="py-2.5 px-3 font-semibold">Item & Category</th>
                      <th className="py-2.5 px-3 font-semibold">Custom Specifications</th>
                      <th className="py-2.5 px-3 font-semibold text-rose-300">Things Not Wanted</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Unit Price</th>
                      <th className="py-2.5 px-3 font-semibold text-center w-12">Qty</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {quoteData.items.map((it, idx) => {
                      const lineTotal = it.unitPrice * it.quantity;
                      return (
                        <tr key={it.id} className="hover:bg-slate-50/70">
                          <td className="py-3 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                          <td className="py-3 px-3 font-medium text-slate-900">
                            <div>{it.name}</div>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 uppercase">
                              {it.category}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 text-[11px]">
                            {it.customSpecifications ? (
                              <span>{it.customSpecifications}</span>
                            ) : (
                              <span className="text-slate-400 italic">Standard Catalog Spec</span>
                            )}
                            {it.selectedSize && (
                              <span className="block text-slate-500">Size: {it.selectedSize}</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-rose-700 text-[11px] font-medium">
                            {it.thingsNotWanted ? (
                              <span>{it.thingsNotWanted}</span>
                            ) : (
                              <span className="text-slate-400 font-normal italic">None</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-slate-700">
                            {formatNaira(it.unitPrice)}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-slate-900 font-mono">
                            {it.quantity}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                            {formatNaira(lineTotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary & Exclusions Notice Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              {/* Left Column: Exclusions & Inclusions Box */}
              <div className="space-y-3">
                {quoteData.generalThingsNotWanted && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-rose-800 uppercase tracking-wide text-[10px]">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Prohibited Exclusions / Things NOT Wanted:</span>
                    </div>
                    <p className="text-rose-700 leading-relaxed font-medium">
                      {quoteData.generalThingsNotWanted}
                    </p>
                  </div>
                )}

                {quoteData.generalSpecifications && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-1">
                    <div className="font-bold text-slate-900 uppercase tracking-wide text-[10px]">
                      General Inclusions & Technical Specifications:
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {quoteData.generalSpecifications}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Calculations & Total */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Baseline Subtotal:</span>
                  <span className="font-mono font-bold text-slate-800">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Nigerian VAT (7.5%):</span>
                  <span className="font-mono font-bold text-slate-800">{formatNaira(vatAmount)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-extrabold text-slate-900 text-sm">Estimated Total (NGN):</span>
                  <span className="text-lg font-black text-orange-600 font-mono">
                    {formatNaira(totalWithVat)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 text-right">
                  Subject to current market review & bulk procurement discounts
                </p>
              </div>
            </div>

            {/* Delivery Terms & Lead Times */}
            <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-1.5">
              <span className="font-bold text-orange-400 text-[10px] uppercase tracking-wider block">
                Rivers State Shipping & Lead Times (From NTA Road PH Warehouse)
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                • <strong>Port Harcourt Metropolis:</strong> Delivered within 24 hours (Trans-Amadi, Obio/Akpor, Old GRA, Township, Woji).<br />
                • <strong>Industrial Hubs:</strong> Onne Oil & Gas Free Zone (FLT/FOT) & Eleme Petrochemicals dispatched within 24–48 hours.<br />
                • <strong>Riverine & Bonny Island:</strong> Consolidated to marine cargo terminals within 24–48 hours.<br />
                • <strong>Same-day pickup:</strong> Available at Omodu Street off NTA Road, Port Harcourt for orders placed before 1:00 PM.
              </p>
            </div>

            {/* Authorization & Seal Footer */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-slate-600">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 block text-[11px] uppercase">
                  Issued & Certified By:
                </span>
                <p className="font-semibold text-slate-900">Engr. Adebayo, MNSE, COREN Reg.</p>
                <p className="text-[11px] text-slate-500">Managing Director, Curome de Paix Nigeria Limited</p>
              </div>

              {/* Stamp Badge */}
              <div className="p-3 rounded-lg border-2 border-dashed border-orange-500/80 bg-orange-50/50 text-center min-w-44 space-y-0.5">
                <span className="text-[9px] font-black uppercase text-orange-700 tracking-widest block">
                  CUROME DE PAIX NIGERIA LTD
                </span>
                <span className="text-[10px] font-bold text-slate-900 block">
                  RC-7473017
                </span>
                <span className="text-[9px] text-orange-800 block">
                  VERIFIED PROCUREMENT DESK
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            Assigned Ticket: <strong className="font-mono text-slate-900">{quoteData.ticketNumber}</strong>. Transmit this document to <strong className="text-slate-800 font-mono">{COMPANY_INFO.email}</strong>.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Quote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
