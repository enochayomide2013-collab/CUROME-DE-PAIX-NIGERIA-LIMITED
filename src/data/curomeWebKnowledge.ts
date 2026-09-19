import { COMPANY_INFO, PRODUCTS_CATALOG, ENGINEERING_SERVICES, COMPANY_VALUES, LEADERSHIP_TEAM } from './companyData';

export interface WebKnowledgeItem {
  id: string;
  category: 'products' | 'shipping' | 'engineering' | 'company' | 'orders' | 'faq';
  title: string;
  keywords: string[];
  summary: string;
  details: string;
  action?: {
    label: string;
    type: 'products' | 'services' | 'faq' | 'contact' | 'cart' | 'quote' | 'whatsapp' | 'email' | 'call';
  };
}

export const CUROME_WEB_KNOWLEDGE: WebKnowledgeItem[] = [
  // 1. Rivers State Shipping & Delivery Policies
  {
    id: 'shipping-rivers-state',
    category: 'shipping',
    title: 'Shipping Policies & Delivery Timelines to Rivers State',
    keywords: [
      'shipping', 'delivery', 'rivers state', 'port harcourt', 'nta road', 'dispatch',
      'transport', 'haulage', 'logistics', 'timeline', 'how long', 'deliver', 'onne',
      'bonny', 'trans-amadi', 'obio/akpor', 'ahoada', 'omodu'
    ],
    summary: 'Direct delivery from our Port Harcourt warehouse at Omodu Street off NTA Road within 24 to 48 hours across Rivers State.',
    details: `**Curome de Paix Rivers State Shipping & Delivery Policies:**
• **Facility Location**: Dispatch originates from our warehouse and manufacturing unit at **Omodu Street off NTA Road, Port Harcourt, Rivers State**.
• **Port Harcourt Metropolis Delivery**: Delivered within **24 hours** to Obio/Akpor, Trans-Amadi Industrial Layout, Old GRA, Port Harcourt Township, Woji, and Rumuokoro via dedicated company logistics vans.
• **Industrial Hubs (Onne & Eleme)**: Staged scheduled deliveries to **Onne Oil & Gas Free Trade Zone** (FLT/FOT) and **Eleme Petrochemicals** within **24 to 48 hours**.
• **Riverine & Islands (Bonny Island, Brass, Opobo)**: Consolidated and transferred to designated marine logistics boat terminals or cargo jetties in Port Harcourt within **24 to 48 hours**.
• **Upcountry Rivers State (Ahoada, Omoku, Emohua, Oyigbo)**: Dispatched within **24 to 48 hours** via insured freight carriers or direct haulage trucks.
• **Same-Day Factory Pickup**: In-stock items ordered before 1:00 PM are available for instant pickup from our Port Harcourt facility.
• **Delivery Rates**: Bulk procurement orders above **₦500,000** within Port Harcourt metropolis qualify for **Free Delivery**. Outlying locations are charged at transparent net transport cost.
• **Emergency Shut-Down Dispatch**: Fast-track dispatch available within **2 to 4 hours** for critical rig shutdowns and emergency vessel turnarounds.`,
    action: { label: 'View Rivers State Shipping in FAQ', type: 'faq' },
  },

  // 2. Engineering Services Lead Times
  {
    id: 'engineering-lead-times',
    category: 'engineering',
    title: 'Lead Times for Engineering & Fabrication Services',
    keywords: [
      'lead time', 'lead times', 'engineering', 'turnaround', 'how long does it take',
      'fabrication', 'welding', 'mechanical', 'pipe spool', 'skid', 'manifold', 'custom coverall',
      'embroidery', 'mobilization', 'breakdown', 'maintenance'
    ],
    summary: 'Standard lead times: In-stock PPE: 24-48h; Custom Coveralls: 3-7 days; Structural Fabrication: 5-10 days; Emergency site mobilization: 4-12 hours.',
    details: `**Curome de Paix Engineering Services & Lead Times:**
• **Standard In-Stock Supply**: Ready warehouse items dispatched within **24 – 48 hours**.
• **Custom Coveralls & Corporate Embroidery**: Complete sizing, tailoring, and computerized embroidery production completed in **3 to 7 business days** (for batches of 50 to 500 units). Rush delivery option available.
• **Mechanical Equipment Maintenance & Valve Overhauls**: Initial on-site technical inspection and condition assessment report delivered within **24 to 48 hours**. Comprehensive overhaul turnaround is **3 to 5 business days**.
• **Structural Steel Fabrication & ASME Coded Welding**: Custom equipment skids, piping spools, handrails, manifolds, and structural walkways fabricated within **5 to 10 business days** following technical drawing sign-off and ITP approval.
• **HSE Technical Site Audits**: Field hazard assessment conducted within **48 hours**; full audit report and workforce sizing matrix delivered within **3 business days**.
• **Emergency Breakdown Mobilization**: Our field engineering team can mobilize on-site across Rivers State within **4 to 12 hours** of emergency call-out.`,
    action: { label: 'Explore Engineering Services', type: 'services' },
  },

  // 3. Product Range: Heavy-Duty Coveralls
  {
    id: 'products-coveralls',
    category: 'products',
    title: 'Heavy-Duty Industrial Coveralls & Workwear Range',
    keywords: [
      'coverall', 'coveralls', 'workwear', 'boiler suit', 'twill', 'cotton twill',
      'reflective tape', '3m', 'flame', 'anti-static', 'embroidery', 'safety suit',
      'overall', 'overalls', 'hd-100', 'price of coverall'
    ],
    summary: '100% heavy-duty cotton twill (290 GSM) and poly-cotton boiler suits with 3M reflective tape, YKK brass zippers, and triple-stitched seams.',
    details: `**Curome de Paix Coveralls Product Range:**
1. **Premium Heavy-Duty Protective Work Coverall (HD-100)**:
   • Material: 290 GSM 100% industrial-treated cotton twill with anti-tear weave.
   • Reflective: 50mm 3M Scotchlite™ industrial wash silver reflective striping across shoulders, arms, and legs.
   • Features: Heavy two-way YKK brass zippers, triple-stitched stress seams, action-back pleats.
   • Colors: Royal Navy Blue, High-Vis Petroleum Orange, Khaki, Red. Sizes: S to 4XL (custom tailoring available).
   • Standards: EN ISO 13688, ANSI/ISEA 107 Class 3.
   • Current Market Price: **₦26,500 – ₦29,500** per unit (Min Order: 5 pcs).
2. **Industrial Heavy Twill Work Boiler Suit**:
   • Material: 250 GSM heavy poly-cotton with double-layered knee and elbow impact panels.
   • Ideal for workshop mechanics, civil construction, and heavy maintenance.
   • Current Market Price: **₦19,500 – ₦22,500** per unit (Min Order: 10 pcs).`,
    action: { label: 'View Coveralls in Catalog', type: 'products' },
  },

  // 4. Product Range: Safety Helmets
  {
    id: 'products-helmets',
    category: 'products',
    title: 'Certified Safety Helmets & Hard Hats Range',
    keywords: [
      'helmet', 'helmets', 'hard hat', 'hard hats', 'ratchet', 'chin strap',
      'en 397', 'ansi z89.1', 'full brim', 'cranial', 'head protection', 'dielectric', 'price of helmet'
    ],
    summary: 'CE EN 397 and ANSI Z89.1 certified helmets with 6-point wheel ratchet suspension, chin straps, and 360° full-brim dielectric models.',
    details: `**Curome de Paix Safety Helmets Range:**
1. **Industrial High-Impact Safety Helmet (Ratchet Suspension)**:
   • Shell: UV-stabilized virgin High-Density Polyethylene (HDPE) shell with crown ventilation slots.
   • Suspension: 6-point textile cradle with micro-adjustable ratchet wheel (fits 52-64cm head sizes).
   • Accessories: 4-point elasticized chin strap included; 30mm side slots for earmuffs and face shields.
   • Standards: CE EN 397:2012 & ANSI/ISEA Z89.1-2014 Type 1 Class E & G.
   • Price: **₦8,000 – ₦9,500** per unit.
2. **Full-Brim Sun & Debris Protection Hard Hat**:
   • Extended 360° perimeter brim with rain and drip gutter for harsh tropical sun and downpours.
   • Electrical insulation rated up to 20,000 Volts (Class E dielectric barrier).
   • Price: **₦11,500 – ₦13,500** per unit.`,
    action: { label: 'View Helmets in Catalog', type: 'products' },
  },

  // 5. Product Range: Safety Glasses & Goggles
  {
    id: 'products-glasses',
    category: 'products',
    title: 'Anti-Fog Safety Glasses & Chemical Goggles Range',
    keywords: [
      'glasses', 'goggles', 'eye protection', 'anti-fog', 'uv400', 'ballistic',
      'chemical splash', 'face shield', 'ansi z87.1', 'en 166', 'scratch resistant', 'price of glasses'
    ],
    summary: 'Ballistic polycarbonate wrap-around glasses and sealed chemical splash goggles with dual hydro-barrier anti-fog and 99.9% UV400 protection.',
    details: `**Curome de Paix Eye Protection Range:**
1. **Ballistic Wrap-Around Anti-Fog Safety Glasses**:
   • Lens: 2.2mm military-grade ballistic polycarbonate with platinum scratch-resistant shield.
   • Anti-Fog: Dual hydro-barrier coating engineered for high humidity in coastal and offshore operations.
   • UV Protection: 99.9% UVA/UVB/UVC filtration (UV400).
   • Standards: ANSI Z87.1+ High Velocity Impact, EN 166 1FT KN.
   • Price: **₦3,800 – ₦4,500** per unit.
2. **Heavy-Duty Chemical & Grinding Safety Goggles**:
   • Sealed indirect ventilation system preventing chemical splashes, acid fumes, and grinding sparks.
   • Over-The-Glasses (OTG) compatible with wide panoramic visual chamber and adjustable neoprene headband.
   • Standards: EN 166 3 4 9 B, ANSI Z87.1 D3 D4.
   • Price: **₦6,200 – ₦7,500** per unit.`,
    action: { label: 'View Eye Protection in Catalog', type: 'products' },
  },

  // 6. Product Range: Steel-Toe Work Boots
  {
    id: 'products-boots',
    category: 'products',
    title: 'S3 Certified Steel-Toe Work Boots & Offshore Rigger Boots',
    keywords: [
      'boots', 'boot', 'shoes', 'safety shoe', 'steel toe', 'kevlar', 'puncture',
      'rigger boot', 'pull on', 'waterproof', 'en iso 20345', 's3', 'footwear', 'price of boots'
    ],
    summary: 'Full-grain oiled cowhide boots with 200J steel toe caps, flexible Kevlar puncture-proof midsoles, and SRC slip-resistant dual-density PU/TPU soles.',
    details: `**Curome de Paix Industrial Safety Footwear Range:**
1. **Apex-Tread Steel-Toe Industrial Work Boots (S3 SRC)**:
   • Toe Protection: Hardened carbon steel toe cap tested to 200 Joules impact deflection.
   • Midsole: Zero-penetration flexible Kevlar composite anti-nail puncture plate.
   • Outsole: Deep lug dual-density PU/TPU self-cleaning tread, fuel & acid resistant, anti-static (ESD).
   • Upper: 2.2mm breathable water-repellent oiled cowhide leather with padded ankle collar.
   • Standards: EN ISO 20345:2011 S3 SRC, ASTM F2413-18. Sizes: EU 39 to 47.
   • Price: **₦35,000 – ₦40,000** per unit.
2. **Offshore Rigger Safety Pull-On Work Boot**:
   • 9-inch high-rise protective leather shaft with dual reinforced pull straps for emergency egress.
   • Waterproof construction with reinforced toe scuff cap and anti-fatigue honeycomb cushion insole.
   • Standards: EN ISO 20345 S3 CI HI HRO SRC.
   • Price: **₦42,000 – ₦48,000** per unit.`,
    action: { label: 'View Boots in Catalog', type: 'products' },
  },

  // 7. How to Order, Quote & Send to Email
  {
    id: 'ordering-and-quote',
    category: 'orders',
    title: 'How to Assemble an Order & Send to decuromeintl@gmail.com',
    keywords: [
      'how to order', 'how to buy', 'quote', 'cart', 'decuromeintl@gmail.com',
      'email', 'proforma invoice', 'purchase order', 'payment terms', 'custom specifications',
      'exclusions', 'discount', 'bulk'
    ],
    summary: 'Add products to your cart, add specifications or exclusions, and click Send via Official Email or WhatsApp for a 30-minute signed proforma invoice.',
    details: `**Ordering & Proforma Invoice Process:**
1. **Browse & Add to Cart**: Select your items (coveralls, helmets, glasses, boots, engineering services) from our catalog.
2. **Specify Notes & Exclusions**: In the cart drawer, you can add custom specifications (e.g. sizes, color preferences, corporate embroidery) or things you don't want (e.g. "no orange color", "no ventilated crown").
3. **Submit via Official Email**: Click **"Send via Official Email"**—this formats your items and opens your email client addressed directly to **${COMPANY_INFO.email}**.
4. **Submit via WhatsApp**: Click **"Send to WhatsApp"** to immediately engage our Port Harcourt desk at **${COMPANY_INFO.whatsappNumber}**.
5. **Signed Proforma Turnaround**: We respond with a formal signed proforma invoice containing itemized breakdown, VAT, RC-7473017 registration stamp, and delivery schedule within **30 to 60 minutes**.`,
    action: { label: 'Open Procurement Cart', type: 'cart' },
  },

  // 8. Company Profile & Port Harcourt Address
  {
    id: 'company-profile-contact',
    category: 'company',
    title: 'Company Verification, RC Number & Port Harcourt Address',
    keywords: [
      'address', 'location', 'office', 'where are you located', 'rc number', 'registration',
      'cac', 'phone', 'phone number', 'email', 'contact', 'nta road', 'port harcourt', 'who is curome'
    ],
    summary: 'Curome de Paix Nigeria Limited (RC-7473017), located at Omodu Street off NTA Road, Port Harcourt, Rivers State. Phone: +234 8039114946.',
    details: `**Curome de Paix Nigeria Limited Corporate Identity:**
• **Corporate Registration**: Registered with the Corporate Affairs Commission under **RC-7473017**.
• **Commercial Identity**: Also trades as Curome de Paix Energy Nigeria Limited (CPD Energy).
• **Physical Headquarters**: **Omodu Street off NTA Road, Port Harcourt, Rivers State, Nigeria**.
• **Direct Office Phone**: **${COMPANY_INFO.phone}**
• **WhatsApp Procurement Desk**: **${COMPANY_INFO.whatsappNumber}**
• **Official Transmission Email**: **${COMPANY_INFO.email}**
• **Operating Hours**: Monday – Friday: 8:00 AM – 5:30 PM | Saturday: 9:00 AM – 2:00 PM.
• **Factory Visits**: Client procurement managers and HSE inspectors are welcome to visit our Port Harcourt facility to inspect fabrics, samples, and equipment.`,
    action: { label: 'Contact Details & Map', type: 'contact' },
  },
];

/**
 * Intelligent client-side search across all Curome website content
 */
export function searchCuromeWeb(userQuery: string): {
  matchedItem: WebKnowledgeItem;
  score: number;
  allMatches: WebKnowledgeItem[];
} {
  const q = userQuery.toLowerCase().trim();
  const words = q.split(/\s+/).filter((w) => w.length > 2);

  let bestMatch = CUROME_WEB_KNOWLEDGE[0];
  let highestScore = -1;
  const scoredItems: { item: WebKnowledgeItem; score: number }[] = [];

  for (const item of CUROME_WEB_KNOWLEDGE) {
    let score = 0;

    // Check exact category match
    if (q.includes(item.category)) score += 15;

    // Keyword matches
    for (const kw of item.keywords) {
      if (q.includes(kw)) {
        score += kw.length > 6 ? 20 : 12;
      }
      for (const word of words) {
        if (kw.includes(word)) {
          score += 6;
        }
      }
    }

    // Check title matches
    for (const word of words) {
      if (item.title.toLowerCase().includes(word)) {
        score += 10;
      }
      if (item.details.toLowerCase().includes(word)) {
        score += 3;
      }
    }

    scoredItems.push({ item, score });

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  // Sort matched items
  scoredItems.sort((a, b) => b.score - a.score);

  return {
    matchedItem: bestMatch,
    score: highestScore,
    allMatches: scoredItems.filter((s) => s.score > 5).map((s) => s.item),
  };
}
