import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { COMPANY_INFO } from '../data/companyData';
import { CartItem } from '../types';
import { formatNaira } from './communication';

export interface PdfQuoteData {
  ticketNumber: string;
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  generalSpecifications?: string;
  generalThingsNotWanted?: string;
  items: CartItem[];
  grandTotal: number;
  dateStr?: string;
}

/**
 * Generates a professional, vector-sharp PDF Quotation document
 * containing selected items, specifications, exclusions, and assigned ticket number.
 */
export function generatePdfQuote(data: PdfQuoteData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const dateIssued =
    data.dateStr ||
    new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  // --- 1. Top Decorative Brand Bar & Header ---
  // Deep navy brand header bar
  doc.setFillColor(15, 23, 42); // #0f172a slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Orange accent strip
  doc.setFillColor(234, 88, 12); // #ea580c orange-600
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('CUROME DE PAIX NIGERIA LIMITED', margin, 12);

  // Subtitle / Trading As & CAC
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240); // slate-200
  doc.text(
    `Trading as Curome de Paix Energy Nigeria Limited  •  Registration: ${COMPANY_INFO.rcNumber}`,
    margin,
    18
  );
  doc.text(
    `${COMPANY_INFO.address}  •  ${COMPANY_INFO.email}`,
    margin,
    23
  );

  // Top Right Official Badge on Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(251, 146, 60); // orange-400
  doc.text('OFFICIAL PROFORMA QUOTE', pageWidth - margin, 12, { align: 'right' });
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Phone: ${COMPANY_INFO.phone}`, pageWidth - margin, 18, { align: 'right' });
  doc.text(`WhatsApp: ${COMPANY_INFO.whatsappNumber}`, pageWidth - margin, 23, { align: 'right' });

  // --- 2. Quote Meta & Ticket Number Ribbon ---
  let cursorY = 36;

  // Ticket Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.roundedRect(margin, cursorY, contentWidth, 18, 2, 2, 'FD');

  // Assigned Ticket Label & Value
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(234, 88, 12);
  doc.text('ASSIGNED PROCUREMENT TICKET NUMBER:', margin + 4, cursorY + 6);

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(data.ticketNumber, margin + 4, cursorY + 13);

  // Issue Date & Validity on right
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Date Issued: ${dateIssued}`, pageWidth - margin - 4, cursorY + 6, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(4, 120, 87); // emerald-700
  doc.text('Validity: 30 Calendar Days (Commercial Baseline)', pageWidth - margin - 4, cursorY + 13, {
    align: 'right',
  });

  cursorY += 23;

  // --- 3. Client & Delivery Details Box ---
  const boxWidth = (contentWidth - 6) / 2;

  // Left Column: Client & Organization
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, cursorY, boxWidth, 26, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CLIENT & PROCUREMENT ENTITY', margin + 3.5, cursorY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Name: ${data.clientName || 'Authorized Procurement Officer'}`, margin + 3.5, cursorY + 11);
  doc.text(`Company: ${data.companyName || 'Private Enterprise / Client'}`, margin + 3.5, cursorY + 16);
  doc.text(`Email: ${data.email || 'Pending formal transmission'}`, margin + 3.5, cursorY + 21);

  // Right Column: Delivery Location & Logistics Contact
  doc.roundedRect(margin + boxWidth + 6, cursorY, boxWidth, 26, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('DELIVERY SITE & CONTACT', margin + boxWidth + 9.5, cursorY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Phone: ${data.phone || 'Pending confirmation'}`, margin + boxWidth + 9.5, cursorY + 11);
  
  // Truncate address if too long
  const addressText = doc.splitTextToSize(
    `Site: ${data.deliveryAddress || 'Port Harcourt, Rivers State, Nigeria'}`,
    boxWidth - 7
  );
  doc.text(addressText, margin + boxWidth + 9.5, cursorY + 16);

  cursorY += 31;

  // --- 4. Selected Items Table using jspdf-autotable ---
  const tableRows = data.items.map((item, idx) => {
    const specsList: string[] = [];
    if (item.customSpecifications && item.customSpecifications.trim()) {
      specsList.push(`Spec: ${item.customSpecifications.trim()}`);
    }
    if (item.selectedSize) specsList.push(`Size: ${item.selectedSize}`);
    if (item.selectedColor) specsList.push(`Color: ${item.selectedColor}`);
    if (item.customLogo) specsList.push('Logo: Corporate Embroidery');

    const specsText = specsList.length > 0 ? specsList.join(' | ') : 'Standard Catalog Specification';
    const exclusionText = item.thingsNotWanted && item.thingsNotWanted.trim()
      ? `EXCLUDE: ${item.thingsNotWanted.trim()}`
      : 'None specified';

    const subtotal = item.unitPrice * item.quantity;

    return [
      String(idx + 1),
      `${item.name}\n[Category: ${item.category.toUpperCase()}]`,
      specsText,
      exclusionText,
      formatNaira(item.unitPrice),
      String(item.quantity),
      formatNaira(subtotal),
    ];
  });

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    head: [
      ['#', 'Item Description', 'Specifications / Inclusions', 'Things Not Wanted', 'Unit Price', 'Qty', 'Subtotal']
    ],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42], // Slate 900
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left',
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.5,
      overflow: 'linebreak',
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 46 },
      2: { cellWidth: 42 },
      3: { cellWidth: 32, textColor: [190, 18, 60] }, // Rose-700 for exclusions
      4: { cellWidth: 20, halign: 'right' },
      5: { cellWidth: 12, halign: 'center' },
      6: { cellWidth: 22, halign: 'right', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  // Get final Y from autoTable
  // @ts-ignore
  const finalTableY = (doc as any).lastAutoTable?.finalY || (cursorY + 40);
  cursorY = finalTableY + 4;

  // Check if we need to add a new page before notes and totals
  if (cursorY > pageHeight - 65) {
    doc.addPage();
    cursorY = 18;
  }

  // --- 5. Financial Totals & Grand Total Summary Bar ---
  const subtotal = data.grandTotal;
  const vatAmount = Math.round(subtotal * 0.075); // 7.5% Nigerian VAT
  const totalWithVat = subtotal + vatAmount;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(pageWidth - margin - 75, cursorY, 75, 26, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal (Market Baseline):', pageWidth - margin - 71, cursorY + 6);
  doc.text(formatNaira(subtotal), pageWidth - margin - 4, cursorY + 6, { align: 'right' });

  doc.text('Estimated VAT (7.5%):', pageWidth - margin - 71, cursorY + 12);
  doc.text(formatNaira(vatAmount), pageWidth - margin - 4, cursorY + 12, { align: 'right' });

  // Total Divider line
  doc.setDrawColor(203, 213, 225);
  doc.line(pageWidth - margin - 72, cursorY + 15, pageWidth - margin - 3, cursorY + 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Total Estimated:', pageWidth - margin - 71, cursorY + 21);
  doc.setTextColor(234, 88, 12);
  doc.text(formatNaira(totalWithVat), pageWidth - margin - 4, cursorY + 21, { align: 'right' });

  // --- 6. Custom Inclusions & Things Not Wanted Boxes (Left side) ---
  const notesWidth = contentWidth - 80;

  // Things Not Wanted / Prohibited Exclusions Notice Box
  if (data.generalThingsNotWanted && data.generalThingsNotWanted.trim()) {
    doc.setFillColor(255, 241, 242); // rose-50
    doc.setDrawColor(254, 205, 211); // rose-200
    doc.roundedRect(margin, cursorY, notesWidth, 15, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(190, 18, 60); // rose-700
    doc.text('CRITICAL EXCLUSIONS / THINGS NOT WANTED:', margin + 3, cursorY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(159, 18, 57);
    const exclusionLines = doc.splitTextToSize(data.generalThingsNotWanted, notesWidth - 6);
    doc.text(exclusionLines.slice(0, 3), margin + 3, cursorY + 9);
  } else {
    // Standard Specifications Note
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, cursorY, notesWidth, 15, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text('ORDER SPECIFICATIONS & INCLUSIONS:', margin + 3, cursorY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    const specLines = doc.splitTextToSize(
      data.generalSpecifications || 'Standard manufacturing and industrial PPE compliance requested.',
      notesWidth - 6
    );
    doc.text(specLines.slice(0, 3), margin + 3, cursorY + 9);
  }

  cursorY += 29;

  // Check page overflow before logistics & signature
  if (cursorY > pageHeight - 48) {
    doc.addPage();
    cursorY = 18;
  }

  // --- 7. Logistics, Port Harcourt Dispatch & Transmission Terms ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, cursorY, contentWidth, 18, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('PORT HARCOURT DISPATCH & PROCUREMENT TERMS (RC-7473017):', margin + 3.5, cursorY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text(
    '• Dispatch Hub: Omodu Street off NTA Road, Port Harcourt. Deliveries within Port Harcourt metropolis completed within 24 hours.',
    margin + 3.5,
    cursorY + 9.5
  );
  doc.text(
    '• Industrial Hubs: Onne Oil & Gas Free Zone (FLT/FOT) & Eleme Petrochemicals delivered within 24-48 hours. Marine consolidations to Bonny Island.',
    margin + 3.5,
    cursorY + 13
  );
  doc.text(
    `• Final Transmission: Email this quote with PO to ${COMPANY_INFO.email} or WhatsApp ${COMPANY_INFO.whatsappNumber} for signed proforma invoice.`,
    margin + 3.5,
    cursorY + 16.5
  );

  cursorY += 22;

  // --- 8. Signature & Corporate Stamp Block ---
  const signColWidth = contentWidth / 2;

  // Left: Authorized Curome Signatory
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ISSUED & CERTIFIED BY:', margin, cursorY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Engr. Adebayo, MNSE, COREN Reg.', margin, cursorY + 9);
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('Managing Director, Curome de Paix Nigeria Limited', margin, cursorY + 13.5);

  // Signatory Stamp Box
  doc.setDrawColor(234, 88, 12);
  doc.setLineWidth(0.3);
  doc.rect(margin + 75, cursorY + 1, 30, 15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(234, 88, 12);
  doc.text('CUROME DE PAIX', margin + 90, cursorY + 5.5, { align: 'center' });
  doc.text('RC-7473017', margin + 90, cursorY + 9, { align: 'center' });
  doc.text('OFFICIAL SEAL', margin + 90, cursorY + 12.5, { align: 'center' });

  // Right: Client Confirmation & Acceptance space
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CLIENT PURCHASE CONFIRMATION:', margin + signColWidth + 10, cursorY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Authorized Signature: _______________________', margin + signColWidth + 10, cursorY + 10);
  doc.text('Date of Acceptance:   _______________________', margin + signColWidth + 10, cursorY + 15);

  // --- 9. Bottom Footer Bar ---
  doc.setFillColor(15, 23, 42);
  doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    `Curome de Paix Nigeria Limited  •  RC-7473017  •  Omodu Street off NTA Road, Port Harcourt  •  ${COMPANY_INFO.email}`,
    pageWidth / 2,
    pageHeight - 3,
    { align: 'center' }
  );

  return doc;
}

/**
 * Convenience helper to generate and trigger instant download of the PDF Quote.
 */
export function downloadPdfQuote(data: PdfQuoteData): { filename: string; success: boolean } {
  try {
    const doc = generatePdfQuote(data);
    const sanitizedTicket = data.ticketNumber.replace(/[^a-zA-Z0-9-_]/g, '_');
    const filename = `Curome_de_Paix_Quote_${sanitizedTicket}.pdf`;
    doc.save(filename);
    return { filename, success: true };
  } catch (error) {
    console.error('[PDF Generation] Error generating PDF quote:', error);
    return { filename: '', success: false };
  }
}
