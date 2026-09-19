import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { COMPANY_INFO } from '../data/companyData';
import { getWhatsAppUrl, getPhoneCallUrl } from '../utils/communication';
import {
  Phone,
  MessageSquare,
  Menu,
  X,
  Shield,
  ArrowRight,
  MapPin,
  ShoppingBag,
  Bot,
  FileCheck,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenQuote: () => void;
  activeSection: string;
  cartCount: number;
  onOpenCart: () => void;
  onOpenContract: () => void;
  onOpenCuriAI: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenQuote,
  activeSection,
  cartCount,
  onOpenCart,
  onOpenContract,
  onOpenCuriAI,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Orders & Tracking', href: '#orders' },
    { label: 'Products & Gear', href: '#products' },
    { label: 'Services', href: '#services' },
    { label: 'Why Choose Us', href: '#why-us' },
    { label: 'Ratings & Reviews', href: '#ratings' },
    { label: 'About Us', href: '#about' },
    { label: 'FAQ', href: '#faq-section' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5'
          : 'bg-white/85 backdrop-blur-xs border-b border-slate-200/60 py-3.5'
      }`}
      id="main-navigation-header"
    >
      {/* Top micro bar for office location & phone */}
      <div className="hidden lg:block border-b border-slate-100 pb-2 mb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>Omodu Street off NTA Road, Port Harcourt, Rivers (RC-7473017)</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Port Harcourt Warehouse & Factory Open
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={getPhoneCallUrl()}
              className="hover:text-orange-600 transition-colors flex items-center gap-1"
              id="topbar-phone-link"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>Direct: {COMPANY_INFO.phone}</span>
            </a>
            <span className="text-slate-300">|</span>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 transition-colors flex items-center gap-1 text-emerald-600 font-semibold"
              id="topbar-whatsapp-link"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp: {COMPANY_INFO.whatsappNumber}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Company Logo */}
        <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center">
          <Logo variant="horizontal" size="md" />
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-orange-600 bg-orange-50 font-bold'
                    : 'text-slate-700 hover:text-orange-600 hover:bg-slate-100/70'
                }`}
                id={`nav-link-${link.href.substring(1)}`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Curi AI Helper Trigger */}
          <button
            onClick={onOpenCuriAI}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer shadow-2xs"
            id="nav-curi-ai-btn"
            title="Ask Curi AI assistant about products, web guide, and procurement"
          >
            <Bot className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Curi AI</span>
          </button>

          {/* Provision Contract Generator Button */}
          <button
            onClick={onOpenContract}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer shadow-2xs"
            id="nav-provision-contract-btn"
            title="Generate official equipment provision contract"
          >
            <FileCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>Provision Contract</span>
          </button>

          {/* Cart Button with badge count */}
          <button
            onClick={onOpenCart}
            className="relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer shadow-xs active:scale-95"
            id="nav-cart-btn"
            aria-label="View Procurement Cart"
          >
            <ShoppingBag className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 ? (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-orange-600 text-white font-black text-[11px] animate-pulse">
                {cartCount}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-normal ml-0.5">0</span>
            )}
          </button>

          {/* Request Quote Button */}
          <button
            onClick={onOpenQuote}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            id="nav-request-quote-btn"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Request Quote</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
            id="mobile-nav-toggle-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-xl"
          id="mobile-nav-drawer"
        >
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1 mb-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span>Omodu Street off NTA Road, Port Harcourt (RC-7473017)</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200">
              <a href={getPhoneCallUrl()} className="text-blue-700 font-bold">
                Call: {COMPANY_INFO.phone}
              </a>
              <a href={getWhatsAppUrl()} className="text-emerald-700 font-bold">
                WhatsApp Available
              </a>
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCart();
              }}
              className="w-full py-2.5 rounded-xl text-center font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-orange-400" />
              <span>Open Cart ({cartCount} Items)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContract();
              }}
              className="w-full py-2.5 rounded-xl text-center font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center gap-2"
            >
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>Generate Provision Contract</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full py-2.5 rounded-xl text-center font-bold text-white bg-orange-600 hover:bg-orange-700 flex items-center justify-center gap-2"
              id="mobile-quote-btn"
            >
              <span>Request a Quote / Pricing</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl text-center font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 flex items-center justify-center gap-2"
              id="mobile-whatsapp-btn"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Chat via WhatsApp ({COMPANY_INFO.whatsappNumber})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
