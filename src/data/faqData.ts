export interface FaqItem {
  id: string;
  category: 'products' | 'shipping' | 'engineering' | 'orders';
  question: string;
  answer: string;
  highlights: string[];
  tags: string[];
}

export const FAQS_DATA: FaqItem[] = [
  // 1. Product Range
  {
    id: 'faq-product-range',
    category: 'products',
    question: 'What is Curome de Paix’s complete industrial safety product range?',
    answer: `Curome de Paix Nigeria Limited (RC-7473017) manufactures and distributes four core categories of certified personal protective equipment (PPE):
1. **Heavy-Duty Protective Coveralls**: 290 GSM 100% industrial-treated cotton twill (HD-100) and poly-cotton mechanic boiler suits, outfitted with dual 50mm 3M Scotchlite™ reflective striping, YKK brass two-way zippers, and triple-stitched stress seams.
2. **Certified Safety Helmets**: High-Density Polyethylene (HDPE) hard hats with 6-point micro-ratchet wheel suspension, integrated chin strap harness, and full-brim 360° sun/rain protection rated up to 20,000V dielectric insulation (EN 397 & ANSI Z89.1).
3. **Protective Safety Glasses & Goggles**: Ballistic polycarbonate wrap-around glasses and indirect-vent chemical goggles featuring dual hydro-barrier anti-fog coatings and 99.9% UV400 protection (ANSI Z87.1+ and EN 166).
4. **Heavy-Durability Steel-Toe Boots**: Apex-Tread ankle boots and 9-inch offshore rigger pull-on boots with 200J steel toe caps, Kevlar anti-penetration midsoles, and dual-density oil/acid-resistant PU/TPU soles (EN ISO 20345 S3 SRC).`,
    highlights: [
      'Heavy-duty 100% cotton coveralls with 3M reflective tape',
      'CE EN 397 ratchet helmets with chin strap harness',
      'Anti-fog UV400 ballistic glasses & chemical goggles',
      'S3 SRC steel-toe & Kevlar puncture-resistant boots',
    ],
    tags: ['Products', 'PPE', 'Coveralls', 'Helmets', 'Safety Boots', 'Goggles'],
  },
  {
    id: 'faq-safety-standards',
    category: 'products',
    question: 'Are your safety products certified for Nigerian oilfield and international standards?',
    answer: `Yes, unconditionally. Every piece of equipment supplied by Curome de Paix conforms to international safety benchmarks and Nigerian industry regulations:
• **Coveralls**: Meet EN ISO 13688 (protective workwear standards), ANSI/ISEA 107 Class 3 (high visibility), and anti-static EN 1149-5.
• **Safety Helmets**: Certified to CE EN 397:2012 (industrial cranial impact) and ANSI/ISEA Z89.1-2014 Type 1 Class E & G (dielectric insulation up to 20,000 Volts).
• **Eye Protection**: Fully certified to ANSI Z87.1+ High Velocity Impact and European EN 166 1FT KN (anti-scratch and anti-fog).
• **Safety Footwear**: Certified to European EN ISO 20345:2011 S3 SRC and American ASTM F2413-18.
All corporate deliveries include verifiable Mill Test Certificates (MTC), Certificates of Conformity (CoC), and Material Safety Data Sheets (MSDS).`,
    highlights: [
      'CE EN 397 & ANSI Z89.1 Certified Hard Hats',
      'ANSI Z87.1+ Ballistic Anti-Fog Eyewear',
      'EN ISO 20345 S3 SRC Puncture-Proof Footwear',
      'Batch Certificates of Conformity with every order',
    ],
    tags: ['Standards', 'Certification', 'Compliance', 'DPR', 'NOGICD'],
  },
  {
    id: 'faq-custom-embroidery',
    category: 'products',
    question: 'Can you customize coveralls and helmets with company embroidery and corporate colors?',
    answer: `Yes. Our Port Harcourt garment manufacturing workshop runs high-precision computerized embroidery machinery and industrial heat-press units. We digitize corporate vector logos, employee names, department labels, and blood group badges directly onto coveralls with colorfast industrial threads that withstand 50+ rigorous industrial laundry cycles. For safety helmets, we produce UV-resistant reflective vinyl decals and custom company color finishes.`,
    highlights: [
      'Digitized computerized corporate logo embroidery',
      'Employee name tapes and blood group patches',
      'Reflective helmet decals and corporate color matching',
      'Durability tested for 50+ industrial washes',
    ],
    tags: ['Customization', 'Embroidery', 'Branding', 'Workwear', 'Tailoring'],
  },

  // 2. Shipping Policies to Rivers State
  {
    id: 'faq-shipping-rivers-state',
    category: 'shipping',
    question: 'What are your shipping policies and delivery timelines across Rivers State?',
    answer: `Because Curome de Paix is based locally at **Omodu Street off NTA Road in Port Harcourt**, we eliminate the long logistics delays common with Lagos or overseas suppliers:
• **Port Harcourt Metropolis (24 Hours)**: Orders to Obio/Akpor, Trans-Amadi Industrial Layout, Old GRA, Port Harcourt Township, Woji, Peter Odili Road, and Rumuokoro are delivered within **24 hours** using our dedicated dispatch fleet.
• **Industrial Hubs (24 to 48 Hours)**: Scheduled deliveries to **Onne Oil & Gas Free Trade Zone** (FLT/FOT terminals), Eleme Petrochemicals, and Indorama complex arrive within **24 to 48 hours**.
• **Bonny Island & Riverine Terminals (24 to 48 Hours)**: Consolidated and handed over to designated marine logistics terminals, cargo boat jetties, or client barge coordinators in Port Harcourt within **24 to 48 hours**.
• **Upcountry Rivers State (24 to 48 Hours)**: Shipments to Ahoada, Omoku, Emohua, and Oyigbo are transported via dedicated haulage trucks or verified regional freight couriers within **24 to 48 hours**.
• **Same-Day Factory Pickup**: In-stock items ordered before 1:00 PM can be collected immediately at our Port Harcourt facility.`,
    highlights: [
      'Same-day pickup at Omodu St off NTA Road, Port Harcourt',
      '24-Hour delivery to Port Harcourt & Trans-Amadi',
      '24-48 Hour scheduled dispatch to Onne Oil & Gas Free Zone',
      'Direct jetty transshipment for Bonny Island cargo',
    ],
    tags: ['Shipping', 'Rivers State', 'Port Harcourt', 'Onne', 'Bonny Island', 'NTA Road'],
  },
  {
    id: 'faq-shipping-rates',
    category: 'shipping',
    question: 'How are shipping fees calculated, and is free delivery available in Rivers State?',
    answer: `We maintain transparent logistics policies with zero hidden surcharges:
• **Free Delivery in Port Harcourt**: Bulk procurement orders valued at **₦500,000 or above** qualify for **100% Free Logistics & Delivery** within Port Harcourt metropolis.
• **Standard Orders**: Orders below ₦500,000 within Port Harcourt are delivered at a flat local transit rate between ₦3,000 and ₦6,000 depending on distance and parcel volume.
• **Outlying Oilfield Terminals (Onne, Bonny Jetty, Ahoada)**: Transport costs are calculated strictly at direct logistics costs and clearly itemized on your proforma invoice before dispatch.
• **Marine Waybills**: Waybill tracking documentation and driver contact numbers are issued immediately upon vehicle departure.`,
    highlights: [
      'Free Delivery on orders ₦500,000+ within Port Harcourt metropolis',
      'Zero logistics markups on outlying oilfield freight',
      'Formal stamped waybill documentation with every dispatch',
    ],
    tags: ['Freight', 'Shipping Cost', 'Free Delivery', 'Logistics', 'Waybill'],
  },
  {
    id: 'faq-emergency-shutdown',
    category: 'shipping',
    question: 'Do you offer emergency expedited dispatch for rig shutdowns and offshore crew changes?',
    answer: `Yes. We operate an active 24/7 emergency response logistics channel for time-critical oilfield shut-downs, unexpected safety gear replenishments, and sudden crew vessel mobilizations. By contacting our emergency WhatsApp hotline (**+234 9169039015**) or phone (**+234 8039114946**), ready in-stock PPE packages can be packaged and mobilized to your site or jetty in Port Harcourt within **2 to 4 hours**.`,
    highlights: [
      '2 to 4 Hour rapid dispatch for shut-down emergencies',
      'Direct contact via dedicated WhatsApp desk (+234 9169039015)',
      'Immediate jetty and helipad delivery coordination',
    ],
    tags: ['Emergency', 'Shutdown', 'Rapid Dispatch', 'Offshore', 'Crew Change'],
  },

  // 3. Lead Times for Engineering Services
  {
    id: 'faq-engineering-lead-times',
    category: 'engineering',
    question: 'What are the lead times for your mechanical engineering and structural fabrication services?',
    answer: `Our engineering projects are planned and executed under defined Inspection and Test Plans (ITP) to ensure exact turnaround times:
• **Standard In-Stock Supply**: Ready-made equipment and PPE dispatched within **24 – 48 hours**.
• **Custom Coverall Tailoring & Corporate Embroidery**: Batch production of 50 to 500 tailored suits is completed in **3 to 7 business days** (sample prototype ready within 72 hours).
• **Mechanical Equipment Overhaul & Valve Servicing**: Detailed technical inspection report delivered within **24 to 48 hours** of receiving components or site access; complete overhaul and hydrostatic pressure re-seating executed within **3 to 5 business days**.
• **Structural Steel Fabrication & ASME Coded Welding (Skids, Spools, Manifolds)**: Typical fabrication turnaround ranges from **5 to 10 business days** from engineering drawing sign-off and material traceability verification.
• **HSE Technical Site Audits**: Site hazard inspection carried out within **48 hours**; final audit documentation and gear matrix submitted in **3 business days**.`,
    highlights: [
      'Custom coverall batch tailoring: 3 to 7 business days',
      'Mechanical maintenance & valve overhaul: 3 to 5 business days',
      'Structural steel & pipe spool fabrication: 5 to 10 business days',
      'In-stock equipment: 24 to 48 hours',
    ],
    tags: ['Lead Times', 'Engineering', 'Fabrication', 'Welding', 'Mechanical', 'Maintenance'],
  },
  {
    id: 'faq-emergency-mobilization',
    category: 'engineering',
    question: 'What is your on-site engineering emergency mobilization response time in Rivers State?',
    answer: `For urgent mechanical breakdowns, leaking high-pressure lines, structural welding repairs, or critical equipment failures in Rivers State, our qualified field engineers and certified welders can mobilize on-site within **4 to 12 hours** of formal call-out notification. We maintain pre-calibrated testing gear, mobile welding plant, and DPR-compliant safety kits ready for instant deployment.`,
    highlights: [
      '4 to 12 Hour on-site emergency mobilization across Rivers State',
      'ASME IX qualified pipe and structural welders on standby',
      'Calibrated pressure testing and non-destructive testing (NDT) kits',
    ],
    tags: ['Mobilization', 'Emergency Repair', 'Field Engineering', 'Breakdown'],
  },
  {
    id: 'faq-qa-qc-documentation',
    category: 'engineering',
    question: 'What QA/QC documentation and test certificates accompany completed engineering jobs?',
    answer: `Every engineering project executed by Curome de Paix includes a comprehensive Quality Assurance Dossier:
1. Certified Mill Test Certificates (MTC) for all raw structural steel and piping.
2. Welder Performance Qualification Records (WPQR) and Welding Procedure Specifications (WPS) according to ASME Section IX and AWS D1.1.
3. Certified Non-Destructive Testing (NDT) reports (Dye Penetrant, Magnetic Particle, Ultrasonic, or Radiographic Testing).
4. Hydrostatic and Pneumatic Pressure Test Charts with calibrated recorder traces.
5. Surface preparation profile reports (grit blasting to Sa 2.5) and coating dry film thickness (DFT) inspection records.
6. Certificate of Conformity (CoC) and final handover warranty documentation.`,
    highlights: [
      'ASME IX and AWS D1.1 Welding Qualification Records',
      'NDT Testing Reports and Hydrotest Pressure Charts',
      'Certified Mill Test Certificates (MTC) and Sa 2.5 Coating Logs',
    ],
    tags: ['QA/QC', 'Inspection', 'NDT', 'ASME', 'Certification', 'Documentation'],
  },

  // 4. Orders, Quotes & Payment Policies
  {
    id: 'faq-how-to-order',
    category: 'orders',
    question: 'How do I submit an order with custom specifications or things we don’t want?',
    answer: `Ordering through our digital procurement platform is simple and direct:
1. Browse our catalog and click **"Add to Cart"** on any coveralls, helmets, glasses, boots, or engineering services.
2. Open your **Procurement Cart** drawer and use the custom notes box to add specific requirements (e.g., sizes S to 3XL, custom logo embroidery) or things you don't want (e.g., "no orange colors", "exclude chin strap").
3. Click **"Send via Official Email"** to dispatch your order directly to **decuromeintl@gmail.com**, or click **"Send to WhatsApp"** to reach our instant desk at **+234 9169039015**.
4. Our Port Harcourt procurement team reviews your specifications and generates a formal, signed proforma invoice with VAT and company bank details within **30 to 60 minutes**.`,
    highlights: [
      'Assemble items with custom notes & exclusions in Cart',
      'One-click submission to decuromeintl@gmail.com or WhatsApp',
      'Signed proforma invoice turnaround within 30-60 minutes',
    ],
    tags: ['Orders', 'Quote', 'Cart', 'Email', 'WhatsApp', 'Proforma Invoice'],
  },
  {
    id: 'faq-payment-terms',
    category: 'orders',
    question: 'What payment terms and corporate credit structures do you provide?',
    answer: `We accommodate corporate procurement protocols:
• **Registered EPC & Oil Major Clients**: Net 30 days commercial credit upon delivery and submission of proof of delivery (waybill) against verified corporate Purchase Orders (PO).
• **Standard Business Accounts**: 70% mobilization deposit upon order confirmation and proforma acceptance; remaining 30% balance payable upon physical pre-dispatch inspection or delivery.
• **Corporate Invoicing**: All transactions are billed through corporate accounts with valid Tax Identification Number (TIN) and standard 7.5% Nigerian VAT invoices.`,
    highlights: [
      'Net 30 commercial credit terms for verified EPC & corporate clients',
      'Standard 70/30 milestones for custom fabrication and tailored workwear',
      'Official FIRS VAT and Tax receipts issued with every invoice',
    ],
    tags: ['Payment Terms', 'Credit Terms', 'Invoicing', 'VAT', 'FIRS'],
  },
];
