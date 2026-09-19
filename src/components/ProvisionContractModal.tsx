import React, { useState } from 'react';
import { COMPANY_INFO, PRODUCTS_CATALOG } from '../data/companyData';
import { CartItem } from '../types';
import { formatNaira, getWhatsAppUrl } from '../utils/communication';
import {
  FileCheck,
  Printer,
  Download,
  CheckCircle,
  Shield,
  Building,
  User,
  MapPin,
  Calendar,
  X,
  Send,
  Sparkles,
  AlertTriangle,
  Scale,
} from 'lucide-react';

interface ProvisionContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItems?: CartItem[];
  onDispatchedToEmail?: (contractId: string) => void;
}

export const ProvisionContractModal: React.FC<ProvisionContractModalProps> = ({
  isOpen,
  onClose,
  initialItems,
  onDispatchedToEmail,
}) => {
  const [contractId] = useState(
    () => `CDP-AGR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
  );
  const [clientName, setClientName] = useState('Authorized Client / Procurement Entity');
  const [clientCompany, setClientCompany] = useState('Industrial Contractor & Energy Services');
  const [deliverySite, setDeliverySite] = useState('Port Harcourt Operational Facility / Site, Rivers State');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [thingsNotWanted, setThingsNotWanted] = useState('No unapproved synthetic liners, no non-rated metal eyelets');
  const [isSigned, setIsSigned] = useState(false);
  const [signatureName, setSignatureName] = useState('');

  if (!isOpen) return null;

  // Default contract provisions if no cart items provided
  const contractItems =
    initialItems && initialItems.length > 0
      ? initialItems
      : [
          {
            id: 'item-1',
            productId: 'coveralls-premium-hd',
            name: 'Premium Heavy-Duty Protective Work Coveralls (HD-100)',
            category: 'Coveralls',
            quantity: 50,
            unitPrice: 28500,
            customSpecifications: '3M Reflective tape, embroidered company name, sizes L & XL',
            thingsNotWanted: 'No plastic zippers',
          },
          {
            id: 'item-2',
            productId: 'helmets-vented-pro',
            name: 'Industrial High-Impact Safety Helmets (6-Point Ratchet)',
            category: 'Helmets',
            quantity: 50,
            unitPrice: 8500,
            customSpecifications: 'White with chin strap and CE EN 397 certification',
            thingsNotWanted: 'No pin-lock suspensions',
          },
          {
            id: 'item-3',
            productId: 'glasses-anti-fog-uv',
            name: 'Ballistic Wrap-Around Anti-Fog Safety Glasses',
            category: 'Safety Glasses / Goggles',
            quantity: 50,
            unitPrice: 4200,
            customSpecifications: 'Ultra-clear polycarbonate with UV400 coating',
            thingsNotWanted: 'No dark tint for indoor use',
          },
          {
            id: 'item-4',
            productId: 'boots-steel-toe-oilfield',
            name: 'Apex-Tread Steel-Toe Industrial Work Boots (S3 SRC)',
            category: 'Work Boots',
            quantity: 50,
            unitPrice: 38000,
            customSpecifications: '200J Steel toe cap, Kevlar anti-puncture midsole, sizes 41-45',
            thingsNotWanted: 'No low-cut shoes (must be high ankle)',
          },
        ];

  const contractTotal = contractItems.reduce(
    (sum, it) => sum + it.unitPrice * it.quantity,
    0
  );

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDispatchAgreement = () => {
    const subject = `Executed Provision Contract [${contractId}] - ${clientCompany}`;
    const body = `CUROME DE PAIX NIGERIA LIMITED (${COMPANY_INFO.rcNumber})
FORMAL EQUIPMENT PROVISION CONTRACT
Reference: ${contractId}
Date: ${currentDate}

SUPPLIER: Curome de Paix Nigeria Limited
RC Number: ${COMPANY_INFO.rcNumber}
Address: ${COMPANY_INFO.address}
Email: ${COMPANY_INFO.email}

CLIENT: ${clientName} (${clientCompany})
Phone: ${clientPhone || 'Pending'}
Email: ${clientEmail || 'Pending'}
Delivery Site: ${deliverySite}

PROVISION SCHEDULE:
${contractItems
  .map(
    (it, idx) =>
      `${idx + 1}. ${it.name} (${it.category})
   - Qty: ${it.quantity} units | Unit Price: ₦${it.unitPrice.toLocaleString()} | Subtotal: ₦${(
        it.unitPrice * it.quantity
      ).toLocaleString()}
   - Specs: ${it.customSpecifications || 'Standard catalog'}
   - Excluded Features (Things Not Wanted): ${it.thingsNotWanted || 'Standard'}`
  )
  .join('\n\n')}

TOTAL BASELINE ESTIMATE: ₦${contractTotal.toLocaleString()}
CLIENT SPECIAL EXCLUSIONS: ${thingsNotWanted}

AGREEMENT STATUS: ${isSigned ? `Signed Digitally by: ${signatureName}` : 'Draft Agreement for Review'}
`;

    window.location.href = `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    if (onDispatchedToEmail) {
      onDispatchedToEmail(contractId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Top Control Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Equipment Provision Agreement
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  RC-7473017
                </span>
              </div>
              <p className="text-xs text-slate-400">Ref: {contractId} • Port Harcourt, Nigeria</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            <button
              onClick={handleDispatchAgreement}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Email Agreement</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contract Document Body (Scrollable & Styled like legal tender) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 text-slate-800 bg-slate-50/50 font-serif" id="printable-contract-document">
          {/* Official Document Header */}
          <div className="text-center pb-6 border-b-2 border-slate-900 space-y-2 font-sans">
            <div className="inline-block px-3 py-1 rounded bg-orange-100 text-orange-900 text-xs font-black tracking-widest uppercase mb-1">
              Federal Republic of Nigeria • Corporate Affairs Commission
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
              Curome de Paix Nigeria Limited
            </h1>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Registration Number: {COMPANY_INFO.rcNumber} • Energy & Industrial Services
            </p>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              Operational Facility: {COMPANY_INFO.address}
              <br />
              Email: {COMPANY_INFO.email} | Tel: {COMPANY_INFO.phone} | WhatsApp: {COMPANY_INFO.whatsappNumber}
            </p>
            <div className="pt-3">
              <span className="inline-block px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-extrabold uppercase tracking-wider">
                Commercial Equipment Provision & Technical Services Agreement
              </span>
            </div>
          </div>

          {/* Agreement Identification Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs font-sans text-xs">
            <div className="space-y-2">
              <span className="font-bold text-orange-600 uppercase text-[10px] tracking-wider block">
                Party A: The Contractor / Supplier
              </span>
              <div className="font-extrabold text-sm text-slate-900">
                CUROME DE PAIX NIGERIA LIMITED
              </div>
              <p className="text-slate-600">
                A duly registered limited liability company under Nigerian Law (RC-7473017), operating its
                industrial manufacturing and logistics depot at Omodu Street off NTA Road, Port Harcourt,
                Rivers State.
              </p>
              <div className="pt-1 text-slate-500">
                <strong>Lead Contact:</strong> Engr. Adebayo, MNSE, COREN Reg. / decuromeintl@gmail.com
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-blue-600 uppercase text-[10px] tracking-wider block">
                Party B: The Client / Purchasing Entity
              </span>
              <div className="space-y-2">
                <input
                  type="text"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  placeholder="Enter Client Company / Organization"
                  className="w-full font-extrabold text-sm text-slate-900 border-b border-slate-300 pb-1 focus:outline-hidden focus:border-blue-600 bg-transparent"
                />
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter Representative / Procurement Officer Name"
                  className="w-full text-xs text-slate-700 border-b border-slate-300 pb-1 focus:outline-hidden focus:border-blue-600 bg-transparent"
                />
                <input
                  type="text"
                  value={deliverySite}
                  onChange={(e) => setDeliverySite(e.target.value)}
                  placeholder="Delivery Site / Facility Location"
                  className="w-full text-xs text-slate-500 border-b border-slate-300 pb-1 focus:outline-hidden focus:border-blue-600 bg-transparent"
                />
              </div>
              <div className="pt-1 text-slate-500 flex items-center justify-between text-[11px]">
                <span>
                  <strong>Date:</strong> {currentDate}
                </span>
                <span>
                  <strong>Ref:</strong> {contractId}
                </span>
              </div>
            </div>
          </div>

          {/* Schedule 1: Table of Provision Items (Coveralls, Goggles, Helmets, Boots, etc.) */}
          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-600" />
                <span>Schedule 1: Itemized Equipment & Services Provision</span>
              </h3>
              <span className="text-xs text-slate-500">Subject to Current Nigerian Market Baseline</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Equipment / Service</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Rate (NGN)</th>
                    <th className="p-3 text-right">Extended Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contractItems.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        {item.customSpecifications && (
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            <strong>Specs:</strong> {item.customSpecifications}
                          </div>
                        )}
                        {item.thingsNotWanted && (
                          <div className="text-[11px] text-rose-600 mt-0.5 font-medium">
                            <strong>Excluded:</strong> {item.thingsNotWanted}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase text-[10px] font-bold">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold text-slate-800">{item.quantity}</td>
                      <td className="p-3 text-right font-medium text-slate-600">
                        {formatNaira(item.unitPrice)}
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900">
                        {formatNaira(item.unitPrice * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-900 text-white font-bold">
                  <tr>
                    <td colSpan={5} className="p-3 text-right uppercase text-[11px] text-slate-300">
                      Estimated Contract Provision Sum:
                    </td>
                    <td className="p-3 text-right text-base text-amber-400">
                      {formatNaira(contractTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Legal Clauses */}
          <div className="space-y-4 text-xs leading-relaxed text-slate-700 font-sans">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Terms & Operational Clauses
            </h3>

            {/* Clause 1 */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">
                1. Scope of Provision & Quality Standards
              </h4>
              <p>
                CUROME DE PAIX NIGERIA LIMITED covenants to supply and provision genuine, certified personal
                protective equipment (including coveralls, impact safety helmets, ballistic safety glasses/goggles,
                and steel-toe work boots) manufactured and inspected in conformity with CE EN 397, EN ISO 20345 (S3),
                ANSI Z87.1, and ANSI Z89.1 standards.
              </p>
            </div>

            {/* Clause 2 */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">
                2. Market Price Review & Commercial Terms
              </h4>
              <p>
                Pricing displayed is grounded in current prevailing Nigerian market rates for certified industrial materials.
                The quoted rate is locked upon formal Purchase Order (PO) issuance and agreement execution. Payment terms
                are structured via designated corporate banking conduits under Curome de Paix Nigeria Limited.
              </p>
            </div>

            {/* Clause 3 */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">
                3. Port Harcourt Logistics, Inspection & Dispatch
              </h4>
              <p>
                Goods shall be mobilized from the Curome de Paix operational base situated at Omodu Street off NTA Road,
                Port Harcourt, Rivers State. Dispatch across Rivers State and Niger Delta operational locations is
                executed within 24–48 hours for inventory stock, and within agreed batch tailoring schedules for custom orders.
              </p>
            </div>

            {/* Clause 4 */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">
                4. Warranty & Defect Liability
              </h4>
              <p>
                All provisioned equipment carries a full manufacturer defect replacement guarantee of six (6) to twelve (12)
                months from the date of physical receipt. Defective items will be replaced free of charge within 72 hours
                of inspection.
              </p>
            </div>

            {/* Clause 5: Things NOT Wanted Compliance */}
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1 text-rose-950">
              <h4 className="font-bold flex items-center gap-1.5 text-rose-900">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>5. Enforcement of Prohibited Exclusions ("Things Not Wanted")</span>
              </h4>
              <p>
                The Supplier specifically warrants that all client exclusions, prohibited materials, and non-desired
                features entered by the Client (including: <em>"{thingsNotWanted}"</em>) will be rigorously excluded
                from the production, cutting, and procurement lines.
              </p>
            </div>

            {/* Clause 6 */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">
                6. Governing Law & Jurisdiction
              </h4>
              <p>
                This agreement is governed by and construed in accordance with the Laws of Rivers State and the Federal
                Republic of Nigeria. Both parties submit to the exclusive jurisdiction of the Rivers State High Court in Port Harcourt.
              </p>
            </div>
          </div>

          {/* Interactive Signature Section */}
          <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
            {/* Curome de Paix Stamp */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                For & on behalf of the Supplier:
              </span>
              <div className="space-y-1">
                <div className="font-black text-slate-900 text-sm">
                  CUROME DE PAIX NIGERIA LIMITED
                </div>
                <div className="text-xs text-orange-600 font-bold">
                  Engr. Adebayo, MNSE, COREN Reg. • Managing Director
                </div>
                <div className="text-[11px] text-slate-500">Corporate Seal & RC-7473017</div>
              </div>

              {/* Digital Stamp Graphic */}
              <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Digitally Certified • Port Harcourt Operations Base</span>
              </div>
            </div>

            {/* Client Signature Box */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                For & on behalf of the Client / Purchasing Entity:
              </span>

              {isSigned ? (
                <div className="space-y-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                  <div className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Agreement Digitally Signed</span>
                  </div>
                  <p>
                    <strong>Signatory:</strong> {signatureName}
                  </p>
                  <p>
                    <strong>Timestamp:</strong> {new Date().toLocaleString()}
                  </p>
                  <button
                    onClick={() => setIsSigned(false)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 underline block pt-1"
                  >
                    Edit Signature
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter your Full Legal Name to Sign"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    disabled={!signatureName.trim()}
                    onClick={() => setIsSigned(true)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Digitally Acknowledge & Sign Agreement
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Destination Email: <strong className="text-slate-800">{COMPANY_INFO.email}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              Print
            </button>
            <button
              onClick={handleDispatchAgreement}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Executed Contract to Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
