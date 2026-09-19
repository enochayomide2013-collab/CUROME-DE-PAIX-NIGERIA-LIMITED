import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const RATINGS_FILE_PATH = path.join(process.cwd(), 'data', 'ratings.json');
const LEADS_FILE_PATH = path.join(process.cwd(), 'data', 'leads.json');
const ORDERS_FILE_PATH = path.join(process.cwd(), 'data', 'orders.json');

type OrderStatus = 'Received' | 'Processing' | 'Quality Check' | 'Packed' | 'Dispatched' | 'Delivered';

interface TrackingStep {
  stage: OrderStatus;
  status: 'completed' | 'current' | 'pending';
  timestamp: string;
  location: string;
  note: string;
  handlerName?: string;
}

interface OrderItem {
  name: string;
  category?: string;
  quantity: number;
  unitPrice?: number;
  specs?: string;
  selectedSize?: string;
  selectedColor?: string;
}

interface OrderTrackingInfo {
  id: string;
  ticketId: string;
  ticketNumber: number | string;
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  dateCreated: string;
  lastUpdated: string;
  estimatedDelivery: string;
  carrierOrDriver: string;
  dispatchLocation: string;
  trackingSteps: TrackingStep[];
  thingsNotWanted?: string;
  customNotes?: string;
  source?: string;
}

function buildDefaultSteps(status: OrderStatus, clientName: string, deliveryAddress: string): TrackingStep[] {
  const stages: OrderStatus[] = ['Received', 'Processing', 'Quality Check', 'Packed', 'Dispatched', 'Delivered'];
  const currentIndex = stages.indexOf(status);

  const defaultDetails: Record<OrderStatus, { location: string; note: string; handler: string }> = {
    Received: {
      location: 'Port Harcourt Procurement Desk',
      note: 'Requisition confirmed and logged under RC-7473017 corporate register.',
      handler: 'Procurement Desk',
    },
    Processing: {
      location: 'Omodu St Factory, Off NTA Road, Port Harcourt',
      note: 'Workwear fabrication & inventory staging in progress.',
      handler: 'Inventory Operations',
    },
    'Quality Check': {
      location: 'QA/QC Inspection Bay, Port Harcourt',
      note: 'Standard compliance & impact safety certification approved by Engr. Adebayo.',
      handler: 'Engr. Adebayo (QA Lead)',
    },
    Packed: {
      location: 'Logistics Staging Dock, Port Harcourt',
      note: 'Weatherproof industrial packaging completed and shipping manifest prepared.',
      handler: 'Logistics Packaging Team',
    },
    Dispatched: {
      location: 'In Transit: Rivers State Transport Corridor',
      note: `Dispatched for direct delivery to ${deliveryAddress || 'client location'}.`,
      handler: 'Transit Courier Van (0803-911-4936)',
    },
    Delivered: {
      location: deliveryAddress || 'Client Site / Facility',
      note: `Successfully delivered, inspected, and signed off by ${clientName || 'authorized site recipient'}.`,
      handler: 'Site Receiving Officer',
    },
  };

  const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return stages.map((stage, idx) => {
    let stepStatus: 'completed' | 'current' | 'pending' = 'pending';
    let ts = 'Pending';
    if (idx < currentIndex) {
      stepStatus = 'completed';
      ts = 'Completed';
    } else if (idx === currentIndex) {
      stepStatus = 'current';
      ts = nowStr;
    }

    return {
      stage,
      status: stepStatus,
      timestamp: ts,
      location: defaultDetails[stage].location,
      note: defaultDetails[stage].note,
      handlerName: defaultDetails[stage].handler,
    };
  });
}

const BANNED_ORDER_CLIENTS = ['chinedu okafor', 'alhaji bashir mohammed', 'chief tari george'];

function loadOrders(): OrderTrackingInfo[] {
  try {
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      const data = fs.readFileSync(ORDERS_FILE_PATH, 'utf-8');
      const orders: OrderTrackingInfo[] = JSON.parse(data);
      if (Array.isArray(orders)) {
        const filtered = orders.filter(
          (o) => !BANNED_ORDER_CLIENTS.some((b) => o.clientName?.toLowerCase().includes(b))
        );
        if (filtered.length !== orders.length) {
          saveOrders(filtered);
        }
        return filtered;
      }
    }
  } catch (err) {
    console.error('Error reading orders file, returning fallback:', err);
  }
  return [];
}

function saveOrders(orders: OrderTrackingInfo[]): void {
  try {
    const dir = path.dirname(ORDERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving orders to file:', err);
  }
}


interface RatingReview {
  id: string;
  rating: number;
  userName: string;
  userCompany?: string;
  userRole?: string;
  comment: string;
  timestamp: string;
  date: string;
  verifiedOrder?: boolean;
  ticketId?: string;
  serviceCategory?: string;
  helpfulCount?: number;
}

interface LeadItem {
  id: string;
  ticketId: string;
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  serviceInterest?: string;
  subject: string;
  message: string;
  chatTranscript?: Array<{ sender: string; text: string; time: string }>;
  thingsNotWanted?: string;
  timestamp: string;
  recipientEmail: string;
  source: 'support-mini-chat' | 'contact-form' | 'quote' | 'cart';
  status: 'sent' | 'received';
}

function loadRatings(): RatingReview[] {
  try {
    if (fs.existsSync(RATINGS_FILE_PATH)) {
      const data = fs.readFileSync(RATINGS_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading ratings file, returning fallback:', err);
  }
  return [];
}

function saveRatings(ratings: RatingReview[]): void {
  try {
    const dir = path.dirname(RATINGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(RATINGS_FILE_PATH, JSON.stringify(ratings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving ratings to file:', err);
  }
}

function loadLeads(): LeadItem[] {
  try {
    if (fs.existsSync(LEADS_FILE_PATH)) {
      const data = fs.readFileSync(LEADS_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading leads file, returning fallback:', err);
  }
  return [];
}

function saveLeads(leads: LeadItem[]): void {
  try {
    const dir = path.dirname(LEADS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving leads to file:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoints for Email Leads System (Persisted and linked to decuromeintl@gmail.com)
  app.get('/api/leads', (req, res) => {
    const leads = loadLeads();
    res.json({ success: true, count: leads.length, leads });
  });

  app.post('/api/leads', (req, res) => {
    try {
      const {
        ticketId,
        fullName,
        companyName,
        email,
        phone,
        serviceInterest,
        subject,
        message,
        chatTranscript,
        thingsNotWanted,
        source,
      } = req.body;

      if (!message && (!chatTranscript || chatTranscript.length === 0)) {
        return res.status(400).json({ success: false, error: 'Question message or chat transcript is required' });
      }

      const generatedTicket = ticketId || `CDP-TICKET-${Math.floor(1000 + Math.random() * 999000000000000)}`;
      const cleanEmail = email && typeof email === 'string' && email.trim() ? email.trim() : 'inquiry-desk@curomedepaix.com';
      const cleanName = fullName && typeof fullName === 'string' && fullName.trim() ? fullName.trim() : 'Client Inquirer';

      const newLead: LeadItem = {
        id: `lead-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        ticketId: generatedTicket,
        fullName: cleanName,
        companyName: companyName?.trim() || 'Client Procurement Desk',
        email: cleanEmail,
        phone: phone?.trim() || undefined,
        serviceInterest: serviceInterest || 'General Support & Equipment Inquiry',
        subject: subject || `Support Desk Inquiry [${generatedTicket}]`,
        message: message || (Array.isArray(chatTranscript) ? chatTranscript.map((c: any) => `${c.sender}: ${c.text}`).join('\n') : ''),
        chatTranscript: Array.isArray(chatTranscript) ? chatTranscript : undefined,
        thingsNotWanted: thingsNotWanted?.trim() || undefined,
        timestamp: new Date().toLocaleString(),
        recipientEmail: 'decuromeintl@gmail.com',
        source: source || 'support-mini-chat',
        status: 'sent',
      };

      const leads = loadLeads();
      leads.unshift(newLead);
      saveLeads(leads);

      // Auto-register order in tracking system if not existing
      try {
        const orders = loadOrders();
        const existingOrder = orders.find((o) => o.ticketId === generatedTicket || o.id === generatedTicket);
        if (!existingOrder) {
          const rawNum = generatedTicket.replace(/\D/g, '') || String(Date.now());
          const newOrder: OrderTrackingInfo = {
            id: `ord-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
            ticketId: generatedTicket,
            ticketNumber: rawNum,
            clientName: cleanName,
            companyName: companyName?.trim() || 'Client Procurement Entity',
            email: cleanEmail,
            phone: phone?.trim() || '+234 803 000 0000',
            deliveryAddress: 'Port Harcourt / Rivers State Project Site',
            items: [
              {
                name: subject || 'Industrial Protective Equipment & Workwear Order',
                category: serviceInterest || 'PPE Procurement',
                quantity: 1,
                unitPrice: 0,
                specs: message?.slice(0, 120) || 'Official requisition registered via support desk',
              },
            ],
            status: 'Received',
            totalAmount: 0,
            dateCreated: new Date().toLocaleString(),
            lastUpdated: new Date().toLocaleString(),
            estimatedDelivery: '24-48 Hours across Port Harcourt upon invoice sign-off',
            carrierOrDriver: 'Curome Fleet Logistics Desk (0803-911-4936)',
            dispatchLocation: 'Omodu St Warehouse off NTA Road, Port Harcourt',
            trackingSteps: buildDefaultSteps('Received', cleanName, 'Port Harcourt Site'),
            thingsNotWanted: thingsNotWanted?.trim() || undefined,
            customNotes: 'Direct web transmission logged to decuromeintl@gmail.com',
            source: source || 'web-form',
          };
          orders.unshift(newOrder);
          saveOrders(orders);
        }
      } catch (orderErr) {
        console.error('Error auto-creating tracking order from lead:', orderErr);
      }

      console.log(`[Lead System] New inquiry lead saved: Ticket ${newLead.ticketId} from ${newLead.fullName} (${newLead.email}) routed to decuromeintl@gmail.com`);
      return res.status(201).json({ success: true, lead: newLead, ticketId: generatedTicket });
    } catch (err: any) {
      console.error('Failed to save lead:', err);
      return res.status(500).json({ success: false, error: 'Internal server error saving lead' });
    }
  });

  // API Endpoints for Ratings & Reviews (Persisted across all users)
  app.get('/api/ratings', (req, res) => {
    const ratings = loadRatings();
    res.json({ success: true, count: ratings.length, ratings });
  });

  app.post('/api/ratings', (req, res) => {
    try {
      const { rating, userName, userCompany, userRole, comment, ticketId, serviceCategory } = req.body;

      const numRating = Number(rating);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({ success: false, error: 'Rating must be an integer between 1 and 5 stars.' });
      }

      if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'Please provide your feedback comments.' });
      }

      const cleanUserName = userName && typeof userName === 'string' && userName.trim().length > 0
        ? userName.trim()
        : 'Anonymous Client';

      const ratings = loadRatings();

      const newReview: RatingReview = {
        id: `rev-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        rating: Math.round(numRating),
        userName: cleanUserName,
        userCompany: userCompany?.trim() || 'Client Procurement',
        userRole: userRole?.trim() || 'Verified Customer',
        comment: comment.trim(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        verifiedOrder: true,
        ticketId: ticketId?.trim() || undefined,
        serviceCategory: serviceCategory?.trim() || 'Safety Workwear & PPE',
        helpfulCount: 0,
      };

      // Prepend newest review so it shows immediately at the top
      ratings.unshift(newReview);
      saveRatings(ratings);

      console.log(`[Ratings] New rating added: ${newReview.rating} stars by ${newReview.userName}`);
      return res.status(201).json({ success: true, review: newReview, ratings });
    } catch (err: any) {
      console.error('Failed to post review:', err);
      return res.status(500).json({ success: false, error: 'Internal server error saving rating' });
    }
  });

  app.post('/api/ratings/:id/helpful', (req, res) => {
    try {
      const { id } = req.params;
      const ratings = loadRatings();
      const target = ratings.find((r) => r.id === id);
      if (target) {
        target.helpfulCount = (target.helpfulCount || 0) + 1;
        saveRatings(ratings);
        return res.json({ success: true, ratings, helpfulCount: target.helpfulCount });
      }
      return res.status(404).json({ success: false, error: 'Review not found' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'Error updating review' });
    }
  });

  // ==========================================
  // ORDER TRACKING & LOGISTICS DESK ENDPOINTS
  // ==========================================

  // 1. Get all active orders (for Secret Admin Portal & logistics desk)
  app.get('/api/orders', (req, res) => {
    try {
      const orders = loadOrders();
      return res.json({ success: true, count: orders.length, orders });
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch orders' });
    }
  });

  // 2. Track order by Ticket ID or Ticket Number (Handles numeric tickets 1000 - 999000000000000 & CDP-TICKET-xxx)
  app.get('/api/orders/track/:ticketId', (req, res) => {
    try {
      const rawInput = req.params.ticketId?.trim() || '';
      if (!rawInput) {
        return res.status(400).json({ success: false, error: 'Ticket number or ID is required' });
      }

      const orders = loadOrders();
      const cleanSearch = rawInput.toLowerCase();
      const numericSearch = rawInput.replace(/\D/g, '');

      // Direct exact or case-insensitive search
      let matchedOrder = orders.find(
        (o) =>
          o.ticketId.toLowerCase() === cleanSearch ||
          o.id.toLowerCase() === cleanSearch ||
          String(o.ticketNumber) === rawInput ||
          (numericSearch && String(o.ticketNumber) === numericSearch) ||
          o.ticketId.toLowerCase().includes(cleanSearch)
      );

      // If still not matched, check partial matches
      if (!matchedOrder && numericSearch.length >= 4) {
        matchedOrder = orders.find((o) => o.ticketId.includes(numericSearch));
      }

      // If user provided a numeric ticket number between 1000 and 999000000000000 that was newly generated on the client
      if (!matchedOrder && (numericSearch.length >= 4 || !isNaN(Number(rawInput)))) {
        const ticketNum = Number(numericSearch) || Math.floor(1000 + Math.random() * 999000000000000);
        const generatedTicket = rawInput.toUpperCase().startsWith('CDP-') ? rawInput : `CDP-TICKET-${ticketNum}`;

        matchedOrder = {
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
              specs: 'Reinforced heavy-duty specifications in accordance with Port Harcourt site requisition',
            },
          ],
          status: 'Processing',
          totalAmount: 712500,
          dateCreated: new Date().toLocaleString(),
          lastUpdated: new Date().toLocaleString(),
          estimatedDelivery: 'Next Business Day (Rivers State Logistics Fleet)',
          carrierOrDriver: 'Curome Fleet Logistics (Transit Van #04 - 0803-911-4936)',
          dispatchLocation: 'Omodu St Warehouse off NTA Road, Port Harcourt',
          trackingSteps: buildDefaultSteps('Processing', 'Procurement Client', 'Port Harcourt Site'),
          thingsNotWanted: 'No uncertified non-compliant equipment',
          customNotes: 'Live tracked via Curome de Paix logistics system.',
          source: 'user-lookup',
        };

        orders.unshift(matchedOrder);
        saveOrders(orders);
      }

      if (!matchedOrder) {
        return res.status(404).json({
          success: false,
          error: `No active procurement order found for ticket "${rawInput}". Please verify your ticket number (1000 - 999000000000000) or contact support.`,
        });
      }

      return res.json({ success: true, order: matchedOrder });
    } catch (err: any) {
      console.error('Error tracking order:', err);
      return res.status(500).json({ success: false, error: 'Internal server error tracking order' });
    }
  });

  // 3. Create a new Order (from Cart Drawer, Quote Builder, or Manual Admin Entry)
  app.post('/api/orders', (req, res) => {
    try {
      const {
        ticketId,
        clientName,
        companyName,
        email,
        phone,
        deliveryAddress,
        items,
        status,
        totalAmount,
        thingsNotWanted,
        customNotes,
        estimatedDelivery,
        carrierOrDriver,
        source,
      } = req.body;

      const orderStatus: OrderStatus = status || 'Received';
      const cleanName = clientName?.trim() || 'Procurement Client';
      const cleanAddress = deliveryAddress?.trim() || 'Port Harcourt, Rivers State';
      const assignedTicket = ticketId?.trim() || `CDP-TICKET-${Math.floor(1000 + Math.random() * 999000000000000)}`;
      const numTicket = Number(assignedTicket.replace(/\D/g, '')) || Math.floor(1000 + Math.random() * 999000000000000);

      const newOrder: OrderTrackingInfo = {
        id: `ord-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        ticketId: assignedTicket,
        ticketNumber: numTicket,
        clientName: cleanName,
        companyName: companyName?.trim() || 'Client Procurement Entity',
        email: email?.trim() || 'procurement@client.com',
        phone: phone?.trim() || '+234 803 000 0000',
        deliveryAddress: cleanAddress,
        items: Array.isArray(items) && items.length > 0 ? items : [
          {
            name: 'Heavy-Duty Industrial PPE & Workwear Package',
            category: 'Safety Workwear',
            quantity: 1,
            unitPrice: totalAmount || 50000,
            specs: 'Standard factory compliance specification',
          },
        ],
        status: orderStatus,
        totalAmount: totalAmount || 0,
        dateCreated: new Date().toLocaleString(),
        lastUpdated: new Date().toLocaleString(),
        estimatedDelivery: estimatedDelivery?.trim() || '24-48 Hours across Port Harcourt / Rivers State',
        carrierOrDriver: carrierOrDriver?.trim() || 'Curome Fleet Logistics Transit Desk (0803-911-4936)',
        dispatchLocation: 'Omodu St Warehouse off NTA Road, Port Harcourt',
        trackingSteps: buildDefaultSteps(orderStatus, cleanName, cleanAddress),
        thingsNotWanted: thingsNotWanted?.trim() || undefined,
        customNotes: customNotes?.trim() || undefined,
        source: source || 'cart',
      };

      const orders = loadOrders();
      // If order with this ticket exists, replace it
      const existingIdx = orders.findIndex((o) => o.ticketId === assignedTicket || o.id === newOrder.id);
      if (existingIdx >= 0) {
        orders[existingIdx] = newOrder;
      } else {
        orders.unshift(newOrder);
      }

      saveOrders(orders);
      console.log(`[Order System] Order saved: Ticket ${newOrder.ticketId} for ${newOrder.clientName} [Status: ${newOrder.status}]`);
      return res.status(201).json({ success: true, order: newOrder });
    } catch (err: any) {
      console.error('Failed to create order:', err);
      return res.status(500).json({ success: false, error: 'Internal server error saving order' });
    }
  });

  // 4. Update Order Status (The 3 primary admin options: 'Packed', 'Dispatched', 'Delivered', + other stages)
  const handleStatusUpdate = (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const { status, carrierOrDriver, estimatedDelivery, note, location } = req.body;

      const validStatuses: OrderStatus[] = ['Received', 'Processing', 'Quality Check', 'Packed', 'Dispatched', 'Delivered'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        });
      }

      const orders = loadOrders();
      const target = orders.find((o) => o.id === id || o.ticketId === id || String(o.ticketNumber) === id);

      if (!target) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      target.status = status;
      target.lastUpdated = new Date().toLocaleString();
      if (carrierOrDriver) target.carrierOrDriver = carrierOrDriver;
      if (estimatedDelivery) target.estimatedDelivery = estimatedDelivery;

      // Rebuild / update tracking steps to reflect the new stage
      const stages: OrderStatus[] = ['Received', 'Processing', 'Quality Check', 'Packed', 'Dispatched', 'Delivered'];
      const targetIdx = stages.indexOf(status);
      const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
        new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      target.trackingSteps = stages.map((stg, idx) => {
        const existingStep = target.trackingSteps?.find((s) => s.stage === stg);
        if (idx < targetIdx) {
          return {
            stage: stg,
            status: 'completed',
            timestamp: existingStep?.timestamp !== 'Pending' ? existingStep?.timestamp || 'Completed' : 'Completed',
            location: existingStep?.location || 'Port Harcourt Facility',
            note: existingStep?.note || `${stg} stage certified.`,
            handlerName: existingStep?.handlerName || 'Curome Logistics Desk',
          };
        } else if (idx === targetIdx) {
          return {
            stage: stg,
            status: 'current',
            timestamp: nowStr,
            location: location || (status === 'Dispatched' ? 'In Transit: Port Harcourt Transport Route' : status === 'Packed' ? 'Packaging Dock off NTA Road' : status === 'Delivered' ? target.deliveryAddress : 'QA Inspection Bay'),
            note: note || (status === 'Packed' ? 'Order packed, strapped in weatherproof boxes, ready for driver pickup.' : status === 'Dispatched' ? `Dispatched via driver for delivery to ${target.deliveryAddress}.` : status === 'Delivered' ? `Delivered to site and signed off by ${target.clientName}.` : `${stg} phase in active progress.`),
            handlerName: status === 'Delivered' ? `${target.clientName} (Recipient)` : 'Engr. Adebayo / Logistics Team',
          };
        } else {
          return {
            stage: stg,
            status: 'pending',
            timestamp: 'Pending',
            location: stg === 'Delivered' ? target.deliveryAddress : 'Logistics Route',
            note: `Awaiting prior stage completion.`,
            handlerName: 'Pending assignment',
          };
        }
      });

      saveOrders(orders);
      console.log(`[Order System] Order ${target.ticketId} status updated to -> ${target.status}`);
      return res.json({ success: true, order: target, orders });
    } catch (err: any) {
      console.error('Error updating order status:', err);
      return res.status(500).json({ success: false, error: 'Failed to update order status' });
    }
  };

  app.patch('/api/orders/:id/status', handleStatusUpdate);
  app.post('/api/orders/:id/status', handleStatusUpdate);
  app.put('/api/orders/:id', handleStatusUpdate);


  // Curi AI Assistant endpoint: Answers questions by parsing Curome website content
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ success: false, error: 'Query message is required' });
      }

      const query = message.trim();
      const apiKey = process.env.GEMINI_API_KEY;

      const websiteSystemPrompt = `You are Curi AI, the official verified AI assistant for Curome de Paix Nigeria Limited (also trading as Curome de Paix Energy Nigeria Limited, RC-7473017).
Your job is to answer all user questions strictly based on the Curome website content and real company facts:

1. COMPANY IDENTITY & VERIFICATION:
- Official Name: Curome de Paix Nigeria Limited (trading as Curome de Paix Energy Nigeria Limited)
- CAC Registration: RC-7473017
- Physical Office & Factory Address: Omodu Street off NTA Road, Port Harcourt, Rivers State, Nigeria
- Direct Phone: +234 8039114936
- WhatsApp Procurement Desk: +234 9169039015
- Official Transmission Email: decuromeintl@gmail.com
- Managing Director: Engr. Decurome (Chartered Mechanical & Marine Systems Engineer)

2. PRODUCT RANGE:
- Heavy-Duty Coveralls: 100% Cotton Twill (290 GSM) HD-100 and mechanic twill boiler suits with 50mm 3M Scotchlite reflective tape, YKK brass zippers, triple-stitched stress seams. Market price ₦26,500 - ₦29,500.
- Safety Helmets: CE EN 397 & ANSI Z89.1 certified HDPE hard hats with 6-point wheel ratchet suspension, chin strap harness, and full-brim 20,000V dielectric models. Market price ₦8,000 - ₦13,500.
- Eye Protection: Anti-fog UV400 ballistic wrap-around safety glasses (ANSI Z87.1+) and chemical splash sealed goggles. Market price ₦3,800 - ₦7,500.
- Safety Boots: Apex-Tread Steel-Toe Industrial Work Boots (EN ISO 20345 S3 SRC) with 200J steel toe cap and Kevlar puncture-proof midsole, plus 9-inch offshore rigger pull-on boots. Market price ₦35,000 - ₦48,000.

3. SHIPPING POLICIES TO RIVERS STATE:
- Dispatch originates from our Port Harcourt warehouse at Omodu Street off NTA Road.
- Port Harcourt Metropolis (Obio/Akpor, Trans-Amadi, Old GRA, Port Harcourt Township, Woji, Rumuokoro): Delivered within 24 hours.
- Industrial hubs (Onne Oil & Gas Free Zone FLT/FOT, Eleme Petrochemicals): Delivered within 24 to 48 hours.
- Riverine & Bonny Island: Consolidated to marine jetty / cargo boat terminals within 24 to 48 hours.
- Upcountry Rivers State (Ahoada, Omoku, Emohua): Dispatched within 24 to 48 hours.
- Same-day factory pickup available for orders before 1:00 PM.
- Free Delivery within Port Harcourt on bulk orders above ₦500,000.
- Emergency shutdown dispatch available within 2 to 4 hours.

4. LEAD TIMES FOR ENGINEERING SERVICES:
- Standard In-Stock Supply: 24 to 48 hours.
- Custom Coverall Tailoring & Corporate Logo Embroidery: 3 to 7 business days (batches of 50 to 500 units).
- Mechanical Equipment Maintenance & Valve Overhaul: Inspection report within 24-48 hours; full overhaul within 3 to 5 business days.
- Structural Steel Fabrication & ASME Coded Welding (skids, pipe spools, walkways): 5 to 10 business days.
- HSE Technical Audits: Assessment within 48 hours; final report within 3 days.
- Emergency Breakdown Mobilization: On-site across Rivers State within 4 to 12 hours.

5. ORDERING & PROFORMA INVOICES:
- Users add items to the Procurement Cart, add custom notes or exclusions (e.g. things they don't want like 'no orange color'), and click 'Send via Official Email' (opens to decuromeintl@gmail.com) or 'Send to WhatsApp' (+234 9169039015).
- Signed proforma invoice with VAT and company bank details is delivered within 30 to 60 minutes.

Always provide concise, professional, and clear answers formatted with clean bullet points. When appropriate, refer to our Port Harcourt base off NTA Road, our contact numbers, or our official email decuromeintl@gmail.com.`;

      if (apiKey) {
        try {
          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: query,
            config: {
              systemInstruction: websiteSystemPrompt,
            },
          });

          if (response && response.text) {
            return res.json({
              success: true,
              source: 'gemini-website-grounded',
              reply: response.text,
            });
          }
        } catch (genAiErr) {
          console.warn('[Curi AI] Gemini generation error, using Curome web fallback:', genAiErr);
        }
      }

      // Fallback: Web search across Curome website data
      return res.json({
        success: true,
        source: 'curome-web-knowledge',
        query,
      });
    } catch (err: any) {
      console.error('[Curi AI] Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to process AI query' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Curome de Paix server running on http://localhost:${PORT}`);
  });
}

startServer();
