export interface ColorVariant {
  name: string;
  hex: string;
  image: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'coveralls' | 'helmets' | 'glasses' | 'boots' | 'extinguishers' | 'fall_protection' | 'safety_gear' | 'accessories';
  subtitle: string;
  description: string;
  specifications: string[];
  safetyStandards: string[];
  unitPriceEstimate: number; // In NGN (₦)
  currentMarketPrice?: string; // Current market price range in NGN
  minOrderQty: number;
  image: string;
  badges: string[];
  inStock: boolean;
  availableSizes?: string[];
  availableColors?: ColorVariant[];
  selectedSize?: string;
  selectedColor?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  deliverables: string[];
  industries: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  experience: string;
  bio: string;
  expertise: string[];
  image: string;
}

export interface CompanyValue {
  title: string;
  description: string;
  iconName: string;
  highlight: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  customSpecifications?: string;
  thingsNotWanted?: string;
  selectedSize?: string;
  selectedColor?: string;
  customLogo?: boolean;
}

export interface CartSubmission {
  id: string;
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  items: CartItem[];
  generalSpecifications?: string;
  generalThingsNotWanted?: string;
  grandTotal: number;
  timestamp: string;
  recipientEmail: string; // decuromeintl@gmail.com
}

export interface QuoteItemSelection {
  productId: string;
  quantity: number;
  customLogo: boolean;
  selectedSize?: string;
  selectedColor?: string;
}

export interface ContactSubmission {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  serviceInterest: string;
  subject: string;
  message: string;
  timestamp: string;
  recipientEmail: string; // decuromeintl@gmail.com
  status: 'sent' | 'responded';
  thingsNotWanted?: string;
}

export interface RatingReview {
  id: string;
  rating: number; // 1 to 5
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

export type OrderStatus = 'Received' | 'Processing' | 'Quality Check' | 'Packed' | 'Dispatched' | 'Delivered';

export interface TrackingStep {
  stage: OrderStatus;
  status: 'completed' | 'current' | 'pending';
  timestamp: string;
  location: string;
  note: string;
  handlerName?: string;
}

export interface OrderItem {
  name: string;
  category?: string;
  quantity: number;
  unitPrice?: number;
  specs?: string;
  selectedSize?: string;
  selectedColor?: string;
}

export interface OrderTrackingInfo {
  id: string;
  ticketId: string; // e.g. "CDP-TICKET-84729103948" or numeric
  ticketNumber: number | string; // between 1000 and 999000000000000
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

