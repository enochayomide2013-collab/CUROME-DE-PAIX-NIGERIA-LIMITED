import { OrderTrackingInfo } from '../types';

/**
 * Escapes a cell value according to RFC 4180 CSV specifications.
 * Handles strings with commas, quotes, and newlines safely.
 */
function escapeCsvValue(val: unknown): string {
  if (val === null || val === undefined) {
    return '""';
  }
  const str = String(val);
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

export interface CsvExportOptions {
  mode?: 'itemized' | 'summary';
  filenamePrefix?: string;
  depotLocation?: string;
}

export interface CsvExportResult {
  success: boolean;
  rowCount: number;
  filename: string;
}

/**
 * Converts order tracking records to a structured CSV string and triggers
 * an automated browser file download for inventory and warehouse tracking.
 */
export function exportOrdersToCsv(
  orders: OrderTrackingInfo[],
  options: CsvExportOptions = {}
): CsvExportResult {
  const mode = options.mode || 'itemized';
  const prefix = options.filenamePrefix || 'curome-inventory-tracking';
  const depot = options.depotLocation || 'Port Harcourt Depot';

  if (!orders || orders.length === 0) {
    return {
      success: false,
      rowCount: 0,
      filename: '',
    };
  }

  // Prepend UTF-8 Byte Order Mark (BOM) to ensure correct encoding in Microsoft Excel, LibreOffice, and Google Sheets
  let csv = '\uFEFF';
  let totalDataRows = 0;

  if (mode === 'itemized') {
    // Each row represents an individual equipment/PPE unit item ordered, ideal for inventory counts and stock reconciliation
    const headers = [
      'Ticket ID',
      'Ticket #',
      'Order Date',
      'Operational Status',
      'Client Name',
      'Company Name',
      'Contact Phone',
      'Contact Email',
      'Delivery Address',
      'Item / Equipment Name',
      'Item Category',
      'Quantity Ordered (Units)',
      'Unit Price (NGN)',
      'Item Subtotal (NGN)',
      'Order Total Amount (NGN)',
      'Selected Size',
      'Selected Color',
      'Item Specifications',
      'Assigned Carrier / Driver',
      'Dispatch Warehouse Depot',
      'Estimated Delivery ETA',
      'Exclusions (Things Not Wanted)',
      'Custom Internal Notes',
    ];

    csv += headers.map(escapeCsvValue).join(',') + '\r\n';

    orders.forEach((order) => {
      const items =
        order.items && order.items.length > 0
          ? order.items
          : [
              {
                name: 'General Industrial Safety Equipment Requisition',
                category: 'Safety Supplies',
                quantity: 1,
                unitPrice: order.totalAmount || 0,
                selectedSize: 'Standard',
                selectedColor: 'Standard',
                specs: 'General requisition',
              },
            ];

      items.forEach((item) => {
        totalDataRows++;
        const qty = item.quantity || 1;
        const unitPrice =
          item.unitPrice !== undefined
            ? item.unitPrice
            : Math.round(order.totalAmount / (items.length || 1));
        const subtotal = qty * unitPrice;

        const row = [
          order.ticketId,
          order.ticketNumber,
          order.dateCreated || 'N/A',
          order.status,
          order.clientName,
          order.companyName || 'N/A',
          order.phone || 'N/A',
          order.email || 'N/A',
          order.deliveryAddress || 'N/A',
          item.name,
          item.category || 'Industrial PPE',
          qty,
          unitPrice,
          subtotal,
          order.totalAmount,
          item.selectedSize || 'Standard',
          item.selectedColor || 'Standard',
          item.specs || 'N/A',
          order.carrierOrDriver || 'Curome Logistics Dispatch',
          order.dispatchLocation || depot,
          order.estimatedDelivery || 'N/A',
          order.thingsNotWanted || '',
          order.customNotes || '',
        ];

        csv += row.map(escapeCsvValue).join(',') + '\r\n';
      });
    });
  } else {
    // Consolidated summary: one row per order ticket with consolidated inventory summary
    const headers = [
      'Ticket ID',
      'Ticket #',
      'Order Date',
      'Operational Status',
      'Client Name',
      'Company Name',
      'Contact Phone',
      'Contact Email',
      'Delivery Address',
      'Total Equipment Quantity (Units)',
      'Itemized Inventory Contents',
      'Order Total Amount (NGN)',
      'Assigned Carrier / Driver',
      'Dispatch Warehouse Depot',
      'Estimated Delivery ETA',
      'Exclusions (Things Not Wanted)',
      'Custom Internal Notes',
    ];

    csv += headers.map(escapeCsvValue).join(',') + '\r\n';

    orders.forEach((order) => {
      totalDataRows++;
      const totalUnits =
        order.items?.reduce((acc, it) => acc + (it.quantity || 1), 0) || 1;

      const itemsSummary =
        order.items && order.items.length > 0
          ? order.items
              .map(
                (it) =>
                  `${it.quantity}x ${it.name}${
                    it.selectedColor ? ` [Color: ${it.selectedColor}]` : ''
                  }${it.selectedSize ? ` (Size: ${it.selectedSize})` : ''}`
              )
              .join('; ')
          : 'General Safety Equipment Requisition';

      const row = [
        order.ticketId,
        order.ticketNumber,
        order.dateCreated || 'N/A',
        order.status,
        order.clientName,
        order.companyName || 'N/A',
        order.phone || 'N/A',
        order.email || 'N/A',
        order.deliveryAddress || 'N/A',
        totalUnits,
        itemsSummary,
        order.totalAmount,
        order.carrierOrDriver || 'Curome Logistics Dispatch',
        order.dispatchLocation || depot,
        order.estimatedDelivery || 'N/A',
        order.thingsNotWanted || '',
        order.customNotes || '',
      ];

      csv += row.map(escapeCsvValue).join(',') + '\r\n';
    });
  }

  // Create downloadable file blob
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `${prefix}-${mode}-${dateStr}.csv`;

  // Trigger browser download via temporary anchor
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return {
    success: true,
    rowCount: totalDataRows,
    filename,
  };
}
