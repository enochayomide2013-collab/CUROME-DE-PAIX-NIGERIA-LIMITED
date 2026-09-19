/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ProductsSection } from './components/ProductsSection';
import { ServicesSection } from './components/ServicesSection';
import { AboutUsSection } from './components/AboutUsSection';
import { ContactSection } from './components/ContactSection';
import { QuoteBuilderModal } from './components/QuoteBuilderModal';
import { AutoResponseModal } from './components/AutoResponseModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProvisionContractModal } from './components/ProvisionContractModal';
import { CuriAI } from './components/CuriAI';
import { FaqSection } from './components/FaqSection';
import { RatingsSection } from './components/RatingsSection';
import { OrderTrackingSection } from './components/OrderTrackingSection';
import { SecretAdminOrdersModal } from './components/SecretAdminOrdersModal';
import { ProductItem, ServiceItem, CartItem, CartSubmission } from './types';
import { COMPANY_INFO, PRODUCTS_CATALOG } from './data/companyData';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [quoteInitialProduct, setQuoteInitialProduct] = useState<ProductItem | null>(null);
  const [autoResponseData, setAutoResponseData] = useState<any | null>(null);
  const [isAutoResponseOpen, setIsAutoResponseOpen] = useState<boolean>(false);
  const [trackedTicketId, setTrackedTicketId] = useState<string | null>(null);
  const [isSecretAdminOpen, setIsSecretAdminOpen] = useState<boolean>(false);

  // Cart and Contract state
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isContractOpen, setIsContractOpen] = useState<boolean>(false);
  const [isCuriAIOpen, setIsCuriAIOpen] = useState<boolean>(false);
  const [curiAIPrompt, setCuriAIPrompt] = useState<string | null>(null);

  const handleOpenCuriAIWithPrompt = (prompt?: string) => {
    setCuriAIPrompt(prompt || null);
    setIsCuriAIOpen(true);
  };

  // Initial seed cart with coveralls and boots sample so user sees cart ready
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'initial-1',
      productId: 'coveralls-premium-hd',
      name: 'Heavy-Duty Industrial Cotton Coveralls (HD-100)',
      category: 'Coveralls',
      quantity: 25,
      unitPrice: 28500,
      customSpecifications: 'Double reflective tape, orange colorway with corporate logo embroidery',
      thingsNotWanted: 'No plastic buttons, no synthetic polyester blend',
      selectedSize: 'L (42-44)',
      selectedColor: 'High-Visibility Orange',
      customLogo: true,
    },
    {
      id: 'initial-2',
      productId: 'helmets-ratchet-pro',
      name: 'Industrial Cranial Safety Helmet (Ratchet Wheel)',
      category: 'Helmets',
      quantity: 25,
      unitPrice: 8500,
      customSpecifications: 'Equipped with 4-point chin strap harness and sweatband',
      thingsNotWanted: 'No non-ratchet pinlock mechanisms',
      selectedColor: 'Safety White',
    },
  ]);

  // Active section tracking on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'order-tracking', 'products', 'why-us', 'ratings', 'services', 'about', 'faq-section', 'contact'];
      const scrollPos = window.scrollY + 180;

      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart operations
  const handleAddToCart = (product: ProductItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          (item.selectedSize || '') === (product.selectedSize || '') &&
          (item.selectedColor || '') === (product.selectedColor || '')
      );
      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + (product.minOrderQty || 1) }
            : item
        );
      }
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productId: product.id,
        name: product.name,
        category: product.category,
        quantity: Math.max(product.minOrderQty, 1),
        unitPrice: product.unitPriceEstimate,
        customSpecifications: `Standard Port Harcourt dispatch: ${product.specifications[0] || ''}`,
        thingsNotWanted: '',
        selectedSize: product.selectedSize || (product.availableSizes?.[0] || ''),
        selectedColor: product.selectedColor || (product.availableColors?.[0]?.name || ''),
      };
      return [...prev, newItem];
    });
  };

  // Add Engineering Service to Cart
  const handleAddServiceToCart = (service: ServiceItem) => {
    const servicePrice =
      service.id === 'mechanical-equipment-engineering'
        ? 350000
        : service.id === 'structural-fabrication-welding'
        ? 450000
        : service.id === 'hse-technical-site-audits'
        ? 200000
        : 150000;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === service.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      const newItem: CartItem = {
        id: `service-${Date.now()}`,
        productId: service.id,
        name: `Engineering Service: ${service.title}`,
        category: 'Engineering Services',
        quantity: 1,
        unitPrice: servicePrice,
        customSpecifications: `Deliverables: ${service.deliverables.slice(0, 2).join('; ')}`,
        thingsNotWanted: 'No uncertified personnel or uncalibrated welding equipment',
      };
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSubmitCartOrder = (submission: CartSubmission) => {
    setAutoResponseData({
      id: submission.id,
      fullName: submission.fullName,
      companyName: submission.companyName,
      email: submission.email,
      phone: submission.phone,
      subject: `Procurement Cart Order [${submission.items.length} Lines]`,
      serviceInterest: 'Procurement Cart Equipment & Engineering',
      message: `Delivery Destination: ${submission.deliveryAddress}\nTotal Value: ₦${submission.grandTotal.toLocaleString()}\n\nItems:\n${submission.items
        .map(
          (i) =>
            `- ${i.name} (${i.quantity}x @ ₦${i.unitPrice.toLocaleString()})\n  Specs: ${
              i.customSpecifications || 'Standard'
            }\n  Exclusions / Don't want: ${i.thingsNotWanted || 'None'}`
        )
        .join('\n\n')}`,
      thingsNotWanted: submission.generalThingsNotWanted,
      timestamp: submission.timestamp,
      recipientEmail: COMPANY_INFO.email,
    });
    setIsAutoResponseOpen(true);
  };

  const handleOpenQuote = (initialProd?: ProductItem | null) => {
    setQuoteInitialProduct(initialProd || null);
    setIsQuoteModalOpen(true);
  };

  const handleNavigateToContact = () => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToProducts = () => {
    const productsEl = document.getElementById('products');
    if (productsEl) {
      productsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Called when contact form or quote calculator is submitted to decuromeintl@gmail.com
  const handleSubmissionComplete = (submission: any) => {
    setAutoResponseData(submission);
    setIsAutoResponseOpen(true);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Sticky Navigation */}
      <Navbar
        onOpenQuote={() => handleOpenQuote(null)}
        activeSection={activeSection}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenContract={() => setIsContractOpen(true)}
        onOpenCuriAI={() => setIsCuriAIOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Home / Hero */}
        <Hero
          onOpenQuote={() => handleOpenQuote(null)}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenContract={() => setIsContractOpen(true)}
          onNavigateToContact={handleNavigateToContact}
          onNavigateToProducts={handleNavigateToProducts}
        />

        {/* 2. Real-Time Order & Requisition Tracking (Ticket numbers from 1000 to 999,000,000,000,000) */}
        <OrderTrackingSection
          initialTicketId={trackedTicketId}
          onOpenQuoteModal={() => handleOpenQuote(null)}
          onOpenContractModal={() => setIsContractOpen(true)}
        />

        {/* 3. Products Section (Coveralls, Helmets, Safety Glasses, Boots, Extinguishers, Harnesses) with Add to Cart */}
        <ProductsSection
          onOpenQuoteWithProduct={(prod) => handleOpenQuote(prod)}
          onAddToCart={handleAddToCart}
        />

        {/* 4. Why Choose Curome de Paix */}
        <WhyChooseUs onOpenQuote={() => handleOpenQuote(null)} />

        {/* 5. Client Ratings & Reviews (Interactive rating submission with mandatory comment & celebratory Thank You confirmation) */}
        <RatingsSection
          onOpenQuote={() => handleOpenQuote(null)}
          onOpenCart={() => setIsCartOpen(true)}
          onNavigateToProducts={handleNavigateToProducts}
        />

        {/* 6. Engineering & PPE Services (with Add Service to Cart) */}
        <ServicesSection
          onOpenQuote={(serviceTitle) => {
            handleOpenQuote(null);
          }}
          onAddServiceToCart={handleAddServiceToCart}
        />

        {/* 7. About Us (Story, Mission, Vision, Specialization, Leadership, Values) */}
        <AboutUsSection />

        {/* 8. FAQ Accordion Section (Product Range, Shipping to Rivers State, Engineering Lead Times) */}
        <FaqSection
          onOpenQuote={() => handleOpenQuote(null)}
          onOpenCuriAI={handleOpenCuriAIWithPrompt}
          onNavigateToContact={handleNavigateToContact}
          onNavigateToProducts={handleNavigateToProducts}
          onNavigateToServices={() => handleNavigateToSection('services')}
        />

        {/* 9. Contact Section (Phone, WhatsApp, Office Address off NTA Road PH, Contact form to decuromeintl@gmail.com) */}
        <ContactSection onFormSubmitted={handleSubmissionComplete} />
      </main>

      {/* Footer */}
      <Footer
        onOpenQuote={() => handleOpenQuote(null)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenContract={() => setIsContractOpen(true)}
        onOpenCuriAI={() => setIsCuriAIOpen(true)}
      />

      {/* Floating WhatsApp Quick Action Button + Secret Admin Logistics Gateway */}
      <FloatingWhatsApp
        isOpenAdmin={isSecretAdminOpen}
        onOpenAdmin={() => setIsSecretAdminOpen(true)}
        onCloseAdmin={() => setIsSecretAdminOpen(false)}
        onTrackOrderInTracker={(tId) => {
          setTrackedTicketId(tId);
          const el = document.getElementById('orders') || document.getElementById('order-tracking');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Cart Drawer (Handles items, specifications, "things not wanted", and sends to decuromeintl@gmail.com) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onSubmitCartOrder={handleSubmitCartOrder}
        onOpenContractWithCart={(items) => {
          setIsCartOpen(false);
          setIsContractOpen(true);
        }}
      />

      {/* Provision Contract Modal */}
      <ProvisionContractModal
        isOpen={isContractOpen}
        onClose={() => setIsContractOpen(false)}
        initialItems={cartItems}
        onDispatchedToEmail={(contractId) => {
          setAutoResponseData({
            id: contractId,
            fullName: 'Contract Signatory',
            companyName: 'Procurement Entity',
            email: COMPANY_INFO.email,
            phone: COMPANY_INFO.phone,
            subject: `Signed Equipment Provision Contract [${contractId}]`,
            serviceInterest: 'Official Supply Contract Agreement',
            message: `Official Equipment Provision Contract agreement ${contractId} has been generated and dispatched to ${COMPANY_INFO.email}.`,
            timestamp: new Date().toLocaleString(),
            recipientEmail: COMPANY_INFO.email,
          });
          setIsAutoResponseOpen(true);
        }}
      />

      {/* Curi AI Assistant Widget */}
      <CuriAI
        isOpen={isCuriAIOpen}
        onOpenChange={setIsCuriAIOpen}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQuote={() => handleOpenQuote(null)}
        onOpenContract={() => setIsContractOpen(true)}
        onNavigateToSection={handleNavigateToSection}
        initialPrompt={curiAIPrompt}
      />

      {/* Interactive Quote Calculator Modal */}
      <QuoteBuilderModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialProduct={quoteInitialProduct}
        onCompleteQuote={handleSubmissionComplete}
      />

      {/* Auto-Response Thank You Note Modal (Triggered on form/cart submit to decuromeintl@gmail.com) */}
      <AutoResponseModal
        isOpen={isAutoResponseOpen}
        onClose={() => setIsAutoResponseOpen(false)}
        submission={autoResponseData}
      />
    </div>
  );
}
