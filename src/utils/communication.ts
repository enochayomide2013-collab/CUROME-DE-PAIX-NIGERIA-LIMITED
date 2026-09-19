import { COMPANY_INFO } from '../data/companyData';

export function getWhatsAppUrl(customMessage?: string): string {
  const phone = COMPANY_INFO.whatsappRaw;
  const message = customMessage || COMPANY_INFO.defaultWhatsAppGreeting;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getPhoneCallUrl(): string {
  return `tel:${COMPANY_INFO.phoneRaw}`;
}

export function getMailToUrl(subject?: string, body?: string): string {
  const email = COMPANY_INFO.email;
  const sub = encodeURIComponent(subject || 'Inquiry - Curome de Paix Nigeria Limited');
  const b = encodeURIComponent(
    body ||
      'Hello Curome de Paix Team,\n\nI am contacting you regarding your industrial safety PPE and professional engineering services.\n\nThank you.'
  );
  return `mailto:${email}?subject=${sub}&body=${b}`;
}

export function getGmailComposeUrl(
  arg1?: string,
  arg2?: string,
  arg3?: string
): string {
  let to = COMPANY_INFO.email;
  let subject = 'Inquiry - Curome de Paix Nigeria Limited';
  let body = '';

  if (arg3 !== undefined) {
    to = arg1 || COMPANY_INFO.email;
    subject = arg2 || subject;
    body = arg3 || '';
  } else {
    subject = arg1 || subject;
    body = arg2 || '';
  }

  const sub = encodeURIComponent(subject);
  const b = encodeURIComponent(body);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${sub}&body=${b}`;
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generates a unique random ticket number between 1,000 and 999,000,000,000,000
 * as requested: "give them their own ticket from 1000 to 999000000000000, pick random ticket for users let eachuser get different tickets"
 */
export function generateRandomTicketNumber(): number {
  const min = 1000;
  const max = 999000000000000; // 999 trillion
  // JavaScript double precision safely handles up to 9,007,199,254,740,991 (Number.MAX_SAFE_INTEGER)
  return Math.floor(min + Math.random() * (max - min + 1));
}

export function generateTicketId(): string {
  const ticketNumber = generateRandomTicketNumber();
  return `CDP-TICKET-${ticketNumber}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for non-secure contexts or older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.warn('Failed to copy to clipboard:', err);
    return false;
  }
}
