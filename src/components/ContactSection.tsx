import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { SupportMiniChat } from './SupportMiniChat';
import {
  getWhatsAppUrl,
  getPhoneCallUrl,
  getMailToUrl,
  getGmailComposeUrl,
  generateTicketId,
  copyToClipboard,
} from '../utils/communication';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building,
  AlertCircle,
  Sliders,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Bot,
} from 'lucide-react';

interface ContactSectionProps {
  onFormSubmitted: (submission: any) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onFormSubmitted }) => {
  const [activeSupportTab, setActiveSupportTab] = useState<'chat' | 'form'>('chat');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceInterest, setServiceInterest] = useState('Premium Heavy-Duty Protective Coveralls');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [thingsNotWanted, setThingsNotWanted] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    const success = await copyToClipboard(COMPANY_INFO.email);
    if (success) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  // Pre-configured automatic WhatsApp greeting triggers
  const whatsappPresets = [
    {
      title: 'Coveralls Inquiry',
      msg: 'Hello Curome de Paix Nigeria Limited, I am interested in inquiring about your custom heavy-duty coveralls and workwear manufacturing.',
    },
    {
      title: 'Helmets & Glasses Order',
      msg: 'Hello Curome de Paix, I would like to inquire about bulk supply of industrial safety helmets (ratchet suspension) and certified safety glasses/goggles.',
    },
    {
      title: 'Safety Boots Inquiry',
      msg: 'Hello Curome de Paix, I want to check availability and sizing for your steel-toe high-durability work boots and rigger boots.',
    },
    {
      title: 'Engineering Services',
      msg: 'Hello Curome de Paix, we require mechanical engineering and structural steel fabrication services for our ongoing site in Rivers State.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ticketId = generateTicketId();
    const submissionData = {
      id: ticketId,
      fullName,
      companyName: companyName || 'Private Client',
      email,
      phone,
      serviceInterest,
      subject: subject || `Inquiry for ${serviceInterest}`,
      message,
      thingsNotWanted,
      timestamp: new Date().toLocaleString(),
      recipientEmail: COMPANY_INFO.email, // decuromeintl@gmail.com
      status: 'sent',
    };

    const mailtoSubject = `Contact Inquiry [${ticketId}] - ${fullName} - ${serviceInterest}`;
    const mailtoBody = `CUROME DE PAIX NIGERIA LIMITED (${COMPANY_INFO.rcNumber})
CONTACT DESK SUBMISSION
Reference: ${ticketId}
Date: ${submissionData.timestamp}

Full Name: ${fullName}
Company: ${companyName || 'Not specified'}
Email: ${email}
Phone: ${phone}
Service/Product Interest: ${serviceInterest}
Subject: ${submissionData.subject}

Message / Specifications:
${message}

Things NOT Wanted / Excluded Features:
${thingsNotWanted || 'None specified'}

Office & Factory: Omodu Street off NTA Road, Port Harcourt, Rivers State
Recipient Email: ${COMPANY_INFO.email}
`;

    const mailtoUrl = `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
      mailtoSubject
    )}&body=${encodeURIComponent(mailtoBody)}`;

    window.location.href = mailtoUrl;

    setTimeout(() => {
      setIsSubmitting(false);
      onFormSubmitted(submissionData);
      setMessage('');
      setSubject('');
      setThingsNotWanted('');
    }, 450);
  };

  return (
    <section id="contact" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Anchor for direct support navigation */}
      <span id="support" className="absolute -top-24 pointer-events-none" />

      {/* Background ambient accents */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Port Harcourt HSE, Procurement & Live Support Desk</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Contact & Support Desk
          </h2>

          <p className="text-base text-slate-300 leading-relaxed font-normal">
            Ask general questions in our live support mini-chat (automatically saved to our email lead desk at{' '}
            <strong className="text-orange-400 font-semibold">{COMPANY_INFO.email}</strong>), or submit a formal
            equipment bill of quantities. Our Port Harcourt team responds immediately.
          </p>
        </div>

        {/* Two Column Layout: Official Channels vs Support Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contact Info & WhatsApp Integration */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-orange-400" />
                <span>Headquarters & Operational Depot</span>
              </h3>

              {/* Registration Number badge */}
              <div className="p-3 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Corporate Registration No:</span>
                <span className="text-orange-400 font-extrabold">{COMPANY_INFO.rcNumber}</span>
              </div>

              {/* Physical Office Address */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-700/50 border border-slate-600/80">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                    Office & Factory Address
                  </div>
                  <p className="text-slate-100 font-semibold text-sm mt-0.5">
                    Omodu Street off NTA Road, PORT HARCOURT, RIVERS
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Rivers State, Nigeria (Warehouse pickup & visits welcome)
                  </p>
                </div>
              </div>

              {/* Phone Channel */}
              <a
                href={getPhoneCallUrl()}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-700/50 border border-slate-600/80 hover:bg-slate-700 transition-colors group"
                id="contact-phone-block"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                    Direct Phone Line
                  </div>
                  <div className="text-base font-black text-white group-hover:text-orange-400 transition-colors">
                    {COMPANY_INFO.phone}
                  </div>
                  <div className="text-slate-400 text-[11px]">Mon - Sat: 8:00 AM - 5:30 PM</div>
                </div>
              </a>

              {/* WhatsApp Channel */}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/40 transition-colors group"
                id="contact-whatsapp-block"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                    Official WhatsApp Hotline
                  </div>
                  <div className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                    {COMPANY_INFO.whatsappNumber}
                  </div>
                  <div className="text-emerald-400/90 text-[11px] font-semibold">
                    Instant Auto-Greeting Integrated
                  </div>
                </div>
              </a>

              {/* Official Email */}
              <div
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-700/50 border border-slate-600/80 hover:bg-slate-700 transition-colors group"
                id="contact-email-block"
              >
                <a
                  href={getMailToUrl()}
                  className="flex items-center gap-3.5 flex-1 min-w-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-xs min-w-0">
                    <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                      Corporate Email Desk
                    </div>
                    <div className="text-base font-black text-white group-hover:text-amber-400 transition-colors truncate">
                      {COMPANY_INFO.email}
                    </div>
                    <div className="text-slate-400 text-[11px]">Direct recipient for all inquiries & orders</div>
                  </div>
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 ml-2 shrink-0 cursor-pointer"
                  title="Copy email to clipboard"
                  id="btn-copy-contact-email"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* WhatsApp Automatic Greeting Selector Box */}
            <div className="p-5 rounded-3xl bg-slate-800/60 border border-slate-700/70 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Instant WhatsApp Greeting Presets</span>
              </div>
              <p className="text-xs text-slate-300">
                Click any prompt below to launch WhatsApp with a customized greeting ready to send:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {whatsappPresets.map((preset, pIdx) => (
                  <a
                    key={pIdx}
                    href={getWhatsAppUrl(preset.msg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-700/70 hover:bg-emerald-900/60 border border-slate-600 hover:border-emerald-500/60 text-xs font-semibold text-slate-200 hover:text-emerald-300 transition-all flex items-center justify-between"
                  >
                    <span>{preset.title}</span>
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form with Auto-Respond Flow to decuromeintl@gmail.com */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-200 space-y-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-orange-600 font-bold text-xs uppercase tracking-wider">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Transmit to {COMPANY_INFO.email}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  Send an Inquiry / Request Quotation
                </h3>
                <p className="text-xs text-slate-500">
                  Submitting this form immediately transmits your message to{' '}
                  <strong className="text-slate-800 font-bold">{COMPANY_INFO.email}</strong> and
                  automatically generates an official thank-you note with your reference number under {COMPANY_INFO.rcNumber}.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mr. Chidi Amadi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-sm bg-slate-50 focus:bg-white transition-colors"
                      id="input-full-name"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Niger Delta Technical Services"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-sm bg-slate-50 focus:bg-white transition-colors"
                      id="input-company-name"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com (For auto-respond note)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-sm bg-slate-50 focus:bg-white transition-colors"
                      id="input-email"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+234 803 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-sm bg-slate-50 focus:bg-white transition-colors"
                      id="input-phone"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Service / Product Category of Interest
                    </label>
                    <select
                      value={serviceInterest}
                      onChange={(e) => setServiceInterest(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-sm bg-slate-50 focus:bg-white transition-colors"
                      id="input-service-interest"
                    >
                      <option>Premium Heavy-Duty Protective Coveralls (HD-100 Cotton Twill)</option>
                      <option>Industrial Safety Helmets (Ratchet Wheel Suspension)</option>
                      <option>Anti-Fog & UV Safety Glasses / Chemical Splash Goggles</option>
                      <option>Steel-Toe High-Durability Work Boots (S3 SRC) & Rigger Boots</option>
                      <option>Mechanical & Pipeline Engineering Services</option>
                      <option>Structural Steel Fabrication & Welding Services</option>
                      <option>Complete Site PPE Bundle (Coveralls + Helmets + Glasses + Boots)</option>
                      <option>Corporate Branding, Reflective Tape & Logo Embroidery</option>
                      <option>HSE Technical Site Audits & Compliance</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Subject / Brief Summary
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Request for Quote: 50 sets of coveralls and boots"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-sm bg-slate-50 focus:bg-white transition-colors"
                      id="input-subject"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Detailed Message / Project Requirements <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Please specify estimated quantities, required delivery timeline, destination in Rivers State / Nigeria, or custom sizing requirements..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-sm bg-slate-50 focus:bg-white transition-colors"
                      id="input-message"
                    />
                  </div>

                  {/* Things Not Wanted / Prohibited Exclusions */}
                  <div className="sm:col-span-2 p-3 rounded-2xl bg-rose-50 border border-rose-200">
                    <label className="block font-bold text-rose-900 mb-1 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Necessary Things You DON'T Want / Prohibited Specifications</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. No plastic zippers, no synthetic lining, exclude front pocket logos..."
                      value={thingsNotWanted}
                      onChange={(e) => setThingsNotWanted(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-white text-xs focus:ring-2 focus:ring-rose-500 text-slate-800"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-orange-600" />
                    <span>Direct Transmission Guarantee</span>
                  </div>
                  <p className="text-[11px] text-orange-800">
                    Your inquiry is routed directly to <strong>{COMPANY_INFO.email}</strong>. You will immediately
                    receive an automated thank-you note on-screen with your tracking reference number.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                  id="submit-contact-form-btn"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting to {COMPANY_INFO.email}...</span>
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send to {COMPANY_INFO.email} & Auto-Respond</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
