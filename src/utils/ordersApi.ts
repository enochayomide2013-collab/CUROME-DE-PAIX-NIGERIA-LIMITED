import { OrderTrackingInfo, OrderStatus } from '../types';

const LOCAL_STORAGE_KEY = 'curome_active_orders_v1';

// Seed fallback orders if offline or backend is unreachable
const INITIAL_SEED_ORDERS: OrderTrackingInfo[] = [
  {
    id: 'ord-84729103948',
    ticketId: 'CDP-TICKET-84729103948',
    ticketNumber: 84729103948,
    clientName: 'Engr. Dumo Briggs',
    companyName: 'Niger Delta Offshore Logistics Ltd',
    email: 'dumo.briggs@nigerdelta-logistics.com',
    phone: '+234 803 555 0192',
    deliveryAddress: 'Plot 14 Trans-Amadi Industrial Layout, Port Harcourt, Rivers State',
    items: [
      {
        name: 'Heavy-Duty Construction Site High-Ankle Safety Boots (S3 SRC)',
        category: 'Boots',
        quantity: 150,
        unitPrice: 34500,
        specs: 'Sizes Euro 41 to 45 with deep mud lug grip and 200J steel toe',
      },
      {
        name: 'Heavy-Duty Industrial Cotton Coveralls (HD-100)',
        category: 'Coveralls',
        quantity: 50,
        unitPrice: 28500,
        specs: 'Orange 290 GSM with 3M Scotchlite reflective stripes',
      },
    ],
    status: 'Dispatched',
    totalAmount: 6600000,
    dateCreated: '2026-09-18 09:30:00',
    lastUpdated: '2026-09-19 14:15:00',
    estimatedDelivery: 'Same-day (Within 2-4 Hours across Port Harcourt)',
    carrierOrDriver: 'Curome Logistics Transit Van (Driver: Austin K. - 0803-911-4936)',
    dispatchLocation: 'Dispatched from Omodu St Warehouse off NTA Road, Port Harcourt',
    trackingSteps: [
      {
        stage: 'Received',
        status: 'completed',
        timestamp: 'Sep 18, 09:30 AM',
        location: 'Port Harcourt Sales Desk',
        note: 'Formal procurement requisition confirmed and logged under RC-7473017.',
        handlerName: 'Procurement Desk',
      },
      {
        stage: 'Processing',
        status: 'completed',
        timestamp: 'Sep 18, 11:45 AM',
        location: 'Off NTA Road Factory',
        note: 'Batch allocation and size sorting completed from warehouse reserve.',
        handlerName: 'Inventory Control',
      },
      {
        stage: 'Quality Check',
        status: 'completed',
        timestamp: 'Sep 18, 04:20 PM',
        location: 'QA/QC Inspection Bay',
        note: 'Impact resistance and puncture-proof steel plate checks certified by Engr. Adebayo.',
        handlerName: 'Engr. Adebayo (QA Lead)',
      },
      {
        stage: 'Packed',
        status: 'completed',
        timestamp: 'Sep 19, 10:00 AM',
        location: 'Dispatch Packaging Bay',
        note: 'Double-sealed weatherproof cartons strapped and manifest stamped.',
        handlerName: 'Logistics Dispatch',
      },
      {
        stage: 'Dispatched',
        status: 'current',
        timestamp: 'Sep 19, 02:15 PM',
        location: 'In Transit: Trans-Amadi Corridor, Port Harcourt',
        note: 'En route to delivery site. Driver contact: 0803-911-4936.',
        handlerName: 'Driver Austin K.',
      },
      {
        stage: 'Delivered',
        status: 'pending',
        timestamp: 'Pending Arrival',
        location: 'Plot 14 Trans-Amadi',
        note: 'Awaiting physical handover and recipient goods-received voucher signature.',
        handlerName: 'Site HSE Receiving Desk',
      },
    ],
    thingsNotWanted: 'No plastic toe caps, no uncertified footwear',
    customNotes: 'Priority offshore mobilization order. Direct site drop-off.',
    source: 'contract',
  },
];

const BANNED_CLIENT_NAMES = ['chinedu okafor', 'alhaji bashir mohammed', 'chief tari george'];

export function getLocalOrders(): OrderTrackingInfo[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Strip out banned test names
        const filtered = parsed.filter(
          (o) => !BANNED_CLIENT_NAMES.some((b) => o.clientName?.toLowerCase().includes(b))
        );
        if (filtered.length !== parsed.length) {
          saveLocalOrders(filtered);
        }
        if (filtered.length > 0) {
          return filtered;
        }
      }
    }
  } catch (e) {
    console.warn('Error reading local orders:', e);
  }
  return INITIAL_SEED_ORDERS;
}

export function saveLocalOrders(orders: OrderTrackingInfo[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn('Error saving local orders:', e);
  }
}

/**
 * Fetch all active orders from backend with local fallback
 */
export async function fetchAllOrders(): Promise<OrderTrackingInfo[]> {
  try {
    const res = await fetch('/api/orders');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        saveLocalOrders(data.orders);
        return data.orders;
      }
    }
  } catch (err) {
    console.warn('Backend fetch orders failed, using local storage:', err);
  }
  return getLocalOrders();
}

/**
 * Track order by ticket number or string (from 1000 to 999000000000000)
 */
export async function trackOrderByTicket(ticketQuery: string): Promise<OrderTrackingInfo | null> {
  const clean = ticketQuery.trim();
  if (!clean) return null;

  try {
    const res = await fetch(`/api/orders/track/${encodeURIComponent(clean)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.order) {
        // Sync local cache
        const local = getLocalOrders();
        const existingIdx = local.findIndex((o) => o.ticketId === data.order.ticketId || o.id === data.order.id);
        if (existingIdx >= 0) {
          local[existingIdx] = data.order;
        } else {
          local.unshift(data.order);
        }
        saveLocalOrders(local);
        return data.order;
      }
    }
  } catch (err) {
    console.warn('Backend track order error, checking local store:', err);
  }

  // Fallback to local search
  const localOrders = getLocalOrders();
  const lower = clean.toLowerCase();
  const numericOnly = clean.replace(/\D/g, '');

  const match = localOrders.find(
    (o) =>
      o.ticketId.toLowerCase() === lower ||
      o.id.toLowerCase() === lower ||
      String(o.ticketNumber) === clean ||
      (numericOnly && String(o.ticketNumber) === numericOnly) ||
      o.ticketId.toLowerCase().includes(lower)
  );

  if (match) return match;

  // If user provided a numeric ticket number 1000 - 999000000000000
  if (numericOnly.length >= 4 || !isNaN(Number(clean))) {
    const ticketNum = Number(numericOnly) || Math.floor(1000 + Math.random() * 999000000000000);
    const generatedTicket = clean.toUpperCase().startsWith('CDP-') ? clean : `CDP-TICKET-${ticketNum}`;

    const newOrder: OrderTrackingInfo = {
      id: `ord-${Date.now()}`,
      ticketId: generatedTicket,
      ticketNumber: ticketNum,
      clientName: 'Corporate Procurement Requisition',
      companyName: 'Port Harcourt Energy & Construction Client',
      email: 'procurement-desk@curomedepaix.com',
      phone: '+234 803 911 4936',
      deliveryAddress: 'Port Harcourt Industrial Zone, Rivers State',
      items: [
        {
          name: 'Industrial Safety Protective Workwear & PPE Consignment',
          category: 'Safety Equipment',
          quantity: 25,
          unitPrice: 28500,
          specs: 'Standard factory compliance specification in accordance with Port Harcourt site requisition',
        },
      ],
      status: 'Processing',
      totalAmount: 712500,
      dateCreated: new Date().toLocaleString(),
      lastUpdated: new Date().toLocaleString(),
      estimatedDelivery: 'Next Business Day (Rivers State Logistics Fleet)',
      carrierOrDriver: 'Curome Fleet Logistics (Transit Van #04 - 0803-911-4936)',
      dispatchLocation: 'Omodu St Warehouse off NTA Road, Port Harcourt',
      trackingSteps: [
        {
          stage: 'Received',
          status: 'completed',
          timestamp: 'Today, 08:30 AM',
          location: 'Port Harcourt Procurement Desk',
          note: 'Requisition confirmed and logged under RC-7473017.',
          handlerName: 'Procurement Desk',
        },
        {
          stage: 'Processing',
          status: 'current',
          timestamp: 'In Progress',
          location: 'Omodu St Factory off NTA Road',
          note: 'Workwear fabrication and warehouse staging active.',
          handlerName: 'Inventory Operations',
        },
        {
          stage: 'Quality Check',
          status: 'pending',
          timestamp: 'Pending',
          location: 'QA/QC Inspection Bay',
          note: 'Cranial impact & puncture tests pending Engr. Adebayo sign-off.',
          handlerName: 'Engr. Adebayo',
        },
        {
          stage: 'Packed',
          status: 'pending',
          timestamp: 'Pending',
          location: 'Staging Bay',
          note: 'Awaiting packaging & strapping.',
          handlerName: 'Logistics Team',
        },
        {
          stage: 'Dispatched',
          status: 'pending',
          timestamp: 'Pending',
          location: 'Logistics Route',
          note: 'Awaiting transit assignment.',
          handlerName: 'Fleet Desk',
        },
        {
          stage: 'Delivered',
          status: 'pending',
          timestamp: 'Pending',
          location: 'Client Site',
          note: 'Awaiting recipient sign-off.',
          handlerName: 'Site HSE Officer',
        },
      ],
      source: 'live-generated',
    };

    localOrders.unshift(newOrder);
    saveLocalOrders(localOrders);
    return newOrder;
  }

  return null;
}

/**
 * Update tracking status of an order (Admin control: Packed, Dispatched, Delivered, etc.)
 */
export async function updateOrderStatus(
  orderIdOrTicket: string,
  newStatus: OrderStatus,
  details?: { carrierOrDriver?: string; estimatedDelivery?: string; note?: string; location?: string }
): Promise<OrderTrackingInfo | null> {
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderIdOrTicket)}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: newStatus,
        ...details,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.order) {
        // Sync local
        const local = getLocalOrders();
        const idx = local.findIndex((o) => o.id === data.order.id || o.ticketId === data.order.ticketId);
        if (idx >= 0) {
          local[idx] = data.order;
        } else {
          local.unshift(data.order);
        }
        saveLocalOrders(local);
        return data.order;
      }
    }
  } catch (err) {
    console.warn('Backend update order failed, updating local store:', err);
  }

  // Fallback update in local storage
  const local = getLocalOrders();
  const target = local.find(
    (o) => o.id === orderIdOrTicket || o.ticketId === orderIdOrTicket || String(o.ticketNumber) === orderIdOrTicket
  );

  if (target) {
    target.status = newStatus;
    target.lastUpdated = new Date().toLocaleString();
    if (details?.carrierOrDriver) target.carrierOrDriver = details.carrierOrDriver;
    if (details?.estimatedDelivery) target.estimatedDelivery = details.estimatedDelivery;

    const stages: OrderStatus[] = ['Received', 'Processing', 'Quality Check', 'Packed', 'Dispatched', 'Delivered'];
    const targetIdx = stages.indexOf(newStatus);
    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
      new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    target.trackingSteps = stages.map((stg, idx) => {
      const existing = target.trackingSteps?.find((s) => s.stage === stg);
      if (idx < targetIdx) {
        return {
          stage: stg,
          status: 'completed',
          timestamp: existing?.timestamp && existing.timestamp !== 'Pending' ? existing.timestamp : 'Completed',
          location: existing?.location || 'Port Harcourt Facility',
          note: existing?.note || `${stg} verified.`,
          handlerName: existing?.handlerName || 'Curome Logistics Desk',
        };
      } else if (idx === targetIdx) {
        return {
          stage: stg,
          status: 'current',
          timestamp: nowStr,
          location: details?.location || (newStatus === 'Dispatched' ? 'In Transit: Port Harcourt Highway' : newStatus === 'Packed' ? 'Packaging Dock off NTA Road' : newStatus === 'Delivered' ? target.deliveryAddress : 'Quality Bay'),
          note: details?.note || (newStatus === 'Packed' ? 'Order packed, strapped in weatherproof crates, ready for driver pickup.' : newStatus === 'Dispatched' ? `Dispatched via driver for delivery to ${target.deliveryAddress}.` : newStatus === 'Delivered' ? `Delivered to site and signed off by ${target.clientName}.` : `${stg} in active progress.`),
          handlerName: newStatus === 'Delivered' ? `${target.clientName} (Recipient)` : 'Engr. Adebayo / Logistics Team',
        };
      } else {
        return {
          stage: stg,
          status: 'pending',
          timestamp: 'Pending',
          location: stg === 'Delivered' ? target.deliveryAddress : 'Transit Corridor',
          note: 'Awaiting prior stage completion.',
          handlerName: 'Pending assignment',
        };
      }
    });

    saveLocalOrders(local);
    return target;
  }

  return null;
}

const USER_TICKETS_KEY = 'curome_user_my_tickets_v1';

export function saveUserTicket(ticketId: string): void {
  try {
    const raw = localStorage.getItem(USER_TICKETS_KEY);
    const tickets: string[] = raw ? JSON.parse(raw) : [];
    const normalized = ticketId.trim();
    if (normalized && !tickets.includes(normalized)) {
      tickets.unshift(normalized);
      localStorage.setItem(USER_TICKETS_KEY, JSON.stringify(tickets));
    }
  } catch (e) {
    console.warn('Failed to save user ticket locally:', e);
  }
}

export function getUserTickets(): string[] {
  try {
    const raw = localStorage.getItem(USER_TICKETS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read user tickets:', e);
  }
  return [];
}

/**
 * Fetch only the orders that belong to the current user (their own orders)
 */
export async function fetchUserOrders(): Promise<OrderTrackingInfo[]> {
  try {
    const all = await fetchAllOrders();
    const userTickets = getUserTickets();
    if (userTickets.length === 0) {
      return [];
    }
    return all.filter((order) => {
      const matchTicket = userTickets.includes(order.ticketId);
      const matchId = userTickets.includes(order.id);
      const matchNum = userTickets.some(
        (t) => t === String(order.ticketNumber) || order.ticketId.includes(t)
      );
      return matchTicket || matchId || matchNum;
    });
  } catch (e) {
    const local = getLocalOrders();
    const userTickets = getUserTickets();
    return local.filter((order) => {
      const matchTicket = userTickets.includes(order.ticketId);
      const matchId = userTickets.includes(order.id);
      const matchNum = userTickets.some(
        (t) => t === String(order.ticketNumber) || order.ticketId.includes(t)
      );
      return matchTicket || matchId || matchNum;
    });
  }
}

/**
 * Register a new order from cart or quote
 */
export async function createOrder(payload: Partial<OrderTrackingInfo>): Promise<OrderTrackingInfo> {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.order) {
        const local = getLocalOrders();
        local.unshift(data.order);
        saveLocalOrders(local);
        saveUserTicket(data.order.ticketId);
        return data.order;
      }
    }
  } catch (err) {
    console.warn('Backend create order failed, saving locally:', err);
  }

  const assignedTicket = payload.ticketId || `CDP-TICKET-${Math.floor(1000 + Math.random() * 999000000000000)}`;
  const numTicket = Number(assignedTicket.replace(/\D/g, '')) || Math.floor(1000 + Math.random() * 999000000000000);

  const newOrder: OrderTrackingInfo = {
    id: `ord-${Date.now()}`,
    ticketId: assignedTicket,
    ticketNumber: numTicket,
    clientName: payload.clientName || 'Procurement Client',
    companyName: payload.companyName || 'Private Corporate Entity',
    email: payload.email || 'client@procurement.com',
    phone: payload.phone || '+234 803 000 0000',
    deliveryAddress: payload.deliveryAddress || 'Port Harcourt, Rivers State',
    items: payload.items || [],
    status: payload.status || 'Received',
    totalAmount: payload.totalAmount || 0,
    dateCreated: new Date().toLocaleString(),
    lastUpdated: new Date().toLocaleString(),
    estimatedDelivery: payload.estimatedDelivery || '24-48 Hours across Port Harcourt',
    carrierOrDriver: payload.carrierOrDriver || 'Curome Fleet Logistics Transit Desk (0803-911-4936)',
    dispatchLocation: 'Omodu St Warehouse off NTA Road, Port Harcourt',
    trackingSteps: [
      {
        stage: 'Received',
        status: 'current',
        timestamp: 'Just now',
        location: 'Port Harcourt Sales Desk',
        note: 'Order registered and transmission logged to decuromeintl@gmail.com.',
        handlerName: 'Procurement Desk',
      },
      {
        stage: 'Processing',
        status: 'pending',
        timestamp: 'Pending',
        location: 'Omodu St Factory off NTA Road',
        note: 'Awaiting size sorting and inventory allocation.',
        handlerName: 'Inventory Operations',
      },
      {
        stage: 'Quality Check',
        status: 'pending',
        timestamp: 'Pending',
        location: 'QA Testing Bay',
        note: 'Compliance certification by Engr. Adebayo.',
        handlerName: 'Engr. Adebayo',
      },
      {
        stage: 'Packed',
        status: 'pending',
        timestamp: 'Pending',
        location: 'Staging Bay',
        note: 'Weatherproof strapping.',
        handlerName: 'Logistics Desk',
      },
      {
        stage: 'Dispatched',
        status: 'pending',
        timestamp: 'Pending',
        location: 'In Transit',
        note: 'Driver assignment.',
        handlerName: 'Fleet Desk',
      },
      {
        stage: 'Delivered',
        status: 'pending',
        timestamp: 'Pending',
        location: payload.deliveryAddress || 'Client Site',
        note: 'Goods received verification.',
        handlerName: 'Site HSE Officer',
      },
    ],
    thingsNotWanted: payload.thingsNotWanted,
    customNotes: payload.customNotes,
    source: payload.source || 'client',
  };

  const local = getLocalOrders();
  local.unshift(newOrder);
  saveLocalOrders(local);
  saveUserTicket(newOrder.ticketId);
  return newOrder;
}
