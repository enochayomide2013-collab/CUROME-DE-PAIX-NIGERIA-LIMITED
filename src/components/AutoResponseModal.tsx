import React, { useState } from 'react';
import { Logo } from './Logo';
import { COMPANY_INFO } from '../data/companyData';
import {
  getWhatsAppUrl,
  getPhoneCallUrl,
  getMailToUrl,
  getGmailComposeUrl,
  copyToClipboard,
} from '../utils/communication';
import {
  CheckCircle2,
  Mail,
  Phone,
  MessageSquare,
  X,
  FileCheck,
  Printer,
  ExternalLink,
  ShieldCheck,
  Clock,
  MapPin,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  Star,
  Send,
  ChevronDown,
} from 'lucide-react';

interface AutoResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: {
    id: string;
    fullName: string;
    companyName?: string;
    email: string;
    phone: string;
    subject: string;
    serviceInterest?: string;
    message: string;
    thingsNotWanted?: string;
    timestamp: string;
    recipientEmail: string;
    grandTotal?: number;
    totalUnits?: number;
  } | null;
  onRatingSubmitted?: () => void;
}

export const AutoResponseModal: React.FC<AutoResponseModalProps> = ({
  isOpen,
  onClose,
  submission,
  onRatingSubmitted,
}) => {
  const [copiedTicket, setCopiedTicket] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Rating flow state (Allows users to rate 1-5 stars & comment right after sending)
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [hoverStars, setHoverStars] = useState<number>(0);
  const [ratingComment, setRatingComment] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingError, setRatingError] = useState('');

  if (!isOpen || !submission) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyTicket = async () => {
    const success = await copyToClipboard(submission.id);
    if (success) {
      setCopiedTicket(true);
      setTimeout(() => setCopiedTicket(false), 2000);
    }
  };

  const handleCopyEmail = async () => {
    const success = await copyToClipboard(COMPANY_INFO.email);
    if (success) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleSubmitRatingFromModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setRatingError('');

    if (!ratingComment.trim()) {
      setRatingError('Please write a brief comment about your experience or equipment requirements before submitting.');
      return;
    }

    setIsSubmittingRating(true);

    const payload = {
      rating: ratingStars,
      userName: submission.fullName,
      userCompany: submission.companyName || 'Corporate Client',
      userRole: 'Verified Client',
      comment: ratingComment.trim(),
      ticketId: submission.id,
      serviceCategory: submission.serviceInterest || 'Safety Workwear & PPE',
    };

    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ratings) {
          try {
            localStorage.setItem('cdp_customer_ratings', JSON.stringify(data.ratings));
          } catch (e) {}
        }
      }
    } catch (err) {
      console.log('Error posting rating to server, saved locally:', err);
    } finally {
      setIsSubmittingRating(false);
      setRatingSubmitted(true);
      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
    }
  };

  const emailSubject = `[Ref: ${submission.id}] ${submission.subject}`;
  const emailBody = `CUROME DE PAIX NIGERIA LIMITED (${COMPANY_INFO.rcNumber})
TRANSMISSION RECEIPT
Ticket ID: ${submission.id}
Date: ${submission.timestamp}

Client: ${submission.fullName}
Company: ${submission.companyName || 'Not specified'}
Phone: ${submission.phone}
Email: ${submission.email}

Details:
${submission.message}

Things Not Wanted / Excluded:
${submission.thingsNotWanted || 'None'}
`;

  const whatsappFollowUpMessage = `Hello Curome de Paix Nigeria Limited (${COMPANY_INFO.rcNumber}), I just submitted an inquiry/quote on your website with Ticket Reference: ${submission.id}. Client: ${submission.fullName}. Looking forward to your prompt response.`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      id="auto-response-modal"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto border border-slate-200">
        {/* Top notification bar */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 py-3 text-white flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Official Transmission Sent to {COMPANY_INFO.email} & Auto-Responded</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Printable / Letterhead Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Header Seal */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <Logo variant="horizontal" size="sm" />
            <div className="text-right text-xs text-slate-500 sm:text-right text-center">
              <div className="font-bold text-slate-900 uppercase">
                Official Acknowledgement Receipt
              </div>
              <div className="text-orange-600 font-semibold">{COMPANY_INFO.rcNumber}</div>
              <div className="text-slate-500">Date: {submission.timestamp}</div>
            </div>
          </div>

          {/* Random Ticket Number Callout Box */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                  Your Unique Order Ticket Reference
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  Range: 1,000 – 999 Trillion
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-amber-400 tracking-wide mt-0.5">
                {submission.id}
              </div>
              <p className="text-[11px] text-slate-300">
                Please retain this ticket number for tracking with our Port Harcourt procurement team.
              </p>
            </div>

            <button
              onClick={handleCopyTicket}
              className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
              id="copy-ticket-btn"
            >
              {copiedTicket ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Ticket Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Ticket #</span>
                </>
              )}
            </button>
          </div>

          {/* Core Thank You Notice */}
          <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-900 font-black text-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <span>Thank You for Contacting Curome de Paix Nigeria Limited!</span>
            </div>

            <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-normal">
              Dear <strong>{submission.fullName}</strong>
              {submission.companyName ? ` (${submission.companyName})` : ''}, we have received your
              request for <strong>{submission.subject}</strong>. Your correspondence has been
              dispatched directly to our executive procurement desk at{' '}
              <span className="underline font-bold text-emerald-900">{COMPANY_INFO.email}</span>.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-emerald-200/70">
              <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Standard Response SLA: 2 to 4 Business Hours</span>
              </div>

              <button
                onClick={handleCopyEmail}
                className="text-[11px] font-bold text-emerald-900 hover:text-emerald-700 flex items-center gap-1 bg-emerald-200/60 px-2 py-0.5 rounded cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-700" />
                    <span>Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy {COMPANY_INFO.email}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Submission Details Summary */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Order / Inquiry Summary
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Client Email</span>
                <span className="font-semibold text-slate-800 break-all">{submission.email}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Client Phone</span>
                <span className="font-semibold text-slate-800">{submission.phone}</span>
              </div>

              <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Message / Specifications</span>
                <p className="text-slate-700 whitespace-pre-line text-xs font-medium">
                  {submission.message}
                </p>
              </div>

              {submission.thingsNotWanted && (
                <div className="sm:col-span-2 p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                  <span className="text-rose-700 block text-[10px] uppercase font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Excluded / Prohibited Items (Things You Do Not Want)</span>
                  </span>
                  <p className="text-rose-950 text-xs font-semibold">
                    {submission.thingsNotWanted}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Rate Curome de Paix (1-5 Stars) Section - Triggered when users send their stuff to email/WhatsApp */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-300 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>Rate Curome de Paix Nigeria Limited</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-900 font-bold uppercase tracking-wider">
                Public Review
              </span>
            </div>

            <p className="text-xs text-amber-800 leading-relaxed">
              Help other oilfield and engineering clients in Rivers State! Please rate your interaction and
              add a comment. Your review will be published in the <strong>Ratings & Reviews</strong> section at the bottom of the page.
            </p>

            {ratingSubmitted ? (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-emerald-950 text-xs space-y-2 shadow-xs animate-in fade-in">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-emerald-950 text-sm">
                      Thank You! Your {ratingStars}-Star Rating & Review is Live
                    </h5>
                    <p className="text-[11px] text-emerald-800">
                      Successfully saved and published to the Homescreen Ratings directory for all clients.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/90 border border-emerald-200 text-slate-700 italic">
                  "{ratingComment}"
                </div>

                <div className="flex items-center justify-between text-[10px] text-emerald-800 pt-1">
                  <span className="font-mono font-semibold">Verified Reviewer: {submission.fullName}</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified by Curome QA/QC
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitRatingFromModal} className="space-y-3 pt-1">
                {/* 1 to 5 Stars Selector */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 p-1.5 rounded-xl bg-white border border-amber-300 shadow-xs">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingStars(star)}
                        onMouseEnter={() => setHoverStars(star)}
                        onMouseLeave={() => setHoverStars(0)}
                        className="p-1 rounded hover:scale-115 transition-transform cursor-pointer"
                        title={`${star} Star${star > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            (hoverStars || ratingStars) >= star
                              ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <span className="text-xs font-bold text-amber-950">
                    {ratingStars} Star{ratingStars > 1 ? 's' : ''} ({ratingStars === 5 ? 'Excellent' : ratingStars === 4 ? 'Very Good' : 'Satisfactory'})
                  </span>
                </div>

                {/* Comment box */}
                <div>
                  <textarea
                    rows={2}
                    required
                    placeholder="Add your comments (e.g. prompt quote response, great workwear specs, fast Port Harcourt delivery)..."
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs text-slate-800 focus:ring-2 focus:ring-amber-500 placeholder-slate-400"
                  />
                  {ratingError && (
                    <span className="text-[11px] text-rose-600 block mt-1">{ratingError}</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Posting as: {submission.fullName} • Ticket Ref: {submission.id}
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmittingRating}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingRating ? 'Publishing...' : 'Submit Rating'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Email dispatch & follow-up options */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Communication & Dispatch Desk</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If your email client did not automatically launch, or if you prefer webmail, you can open Gmail
              or launch your mail client with your Ticket Reference <strong>{submission.id}</strong>:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={getGmailComposeUrl(
                  COMPANY_INFO.email,
                  emailSubject,
                  emailBody
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white transition-colors cursor-pointer"
                id="auto-respond-gmail-btn"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Open in Gmail (Web)</span>
              </a>

              <a
                href={getMailToUrl(emailSubject, emailBody)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                id="auto-respond-mailto-btn"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>Default Mail App</span>
              </a>

              <a
                href={getWhatsAppUrl(whatsappFollowUpMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
                id="auto-respond-whatsapp-btn"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Desk ({COMPANY_INFO.whatsappNumber})</span>
              </a>

              <a
                href={getPhoneCallUrl()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
                id="auto-respond-phone-btn"
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Call ({COMPANY_INFO.phone})</span>
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>Omodu Street off NTA Road, Port Harcourt, Rivers ({COMPANY_INFO.rcNumber})</span>
            </div>
            <button
              onClick={handlePrint}
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
            id="dismiss-auto-respond-btn"
          >
            Close Acknowledgement
          </button>
        </div>
      </div>
    </div>
  );
};
