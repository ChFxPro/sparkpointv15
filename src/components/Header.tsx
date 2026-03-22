'use client';

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { ChevronDown, Menu, X, Mail, Accessibility, Shield, Check } from 'lucide-react';
import { Button } from './ui/button.tsx';
import { Sheet, SheetContent, SheetTrigger as _SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet.tsx';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover.tsx';
import sparkPointLogo from '../assets/compd/35bb889d1f4d0b05ae6753439b58199640858447.webp';

// Deno/TS classic JSX compatibility (keeps React in module scope)
void React;

interface DropdownItem {
  label: string;
  href: string;
}

interface MenuItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

const menuItems: MenuItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Mission', href: '/mission' },
  { label: 'Stories', href: '/stories' },
  { label: 'Impact', href: '/impact' },
  { label: 'Programs', href: '/programs' },
  { label: 'News & Media', href: '/news-media' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'About', href: '/about' },
  { label: 'Resiliency Hub', href: '/resiliency-hub' },
  { label: 'Contact', href: '/intake?intent=contact' },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const scrolled = latest > 50;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: Event) => {
      const key = (e as unknown as { key?: string }).key;
      if (key === 'Escape') {
        setMobileOpen(false);
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown as EventListener);
    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, []);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  // Filter links for Desktop Center Nav (Option A)
  const desktopCenterLinks = menuItems.filter(item => 
    ['Mission', 'Stories', 'Impact', 'Programs'].includes(item.label)
  );

  return (
    <>
      {/* Desktop Header (lg+) */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.45, 0, 0.55, 1] }}
        className="fixed top-0 left-0 right-0 z-50 hidden lg:block"
        style={{
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(24px)',
          boxShadow: isScrolled ? '0px 4px 8px rgba(0, 0, 0, 0.08)' : '0px 1px 2px rgba(0, 0, 0, 0.05)',
          borderBottom: isScrolled ? '1px solid rgba(224, 54, 148, 0.15)' : '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 250ms ease-in-out',
        }}
      >
        <div className="max-w-[1440px] mx-auto px-8 h-20 flex items-center justify-between">
          {/* Left: Logo (Scaled down ~20%) */}
          <Link
            to="/"
            className="flex items-center transition-opacity hover:opacity-80 shrink-0"
            translate="no"
          >
            <img
              src={sparkPointLogo}
              alt="SparkPoint logo"
              width={839}
              height={290}
              className="h-14 w-auto" 
            />
          </Link>

          {/* Center: Curated Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden xl:flex items-center gap-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            {desktopCenterLinks.map((item) => (
              <Link
                key={item.label}
                to={item.href!}
                className="relative group py-2"
                style={{
                  color: '#1a1a1a',
                  fontSize: '15px',
                  fontWeight: '600',
                  letterSpacing: '0.01em',
                }}
              >
                {item.label}
                <span
                  className="absolute left-0 bottom-0 h-0.5 transition-all duration-300 ease-in-out"
                  style={{
                    background: 'linear-gradient(90deg, #E03694 0%, #FDB515 100%)',
                    width: location.pathname === item.href ? '100%' : '0',
                    opacity: location.pathname === item.href ? 1 : 0,
                  }}
                />
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#E03694]/50 group-hover:w-full transition-all duration-300 opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </nav>

          {/* Right: Donate + Utilities + Menu */}
          <div className="flex items-center gap-4">
            <Button
              asChild
              size="sm"
              className="px-6 rounded-full transition-all hover:brightness-105 hover:scale-105 shadow-md hover:shadow-lg"
              style={{
                backgroundColor: '#E03694',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              <Link to="/donations">Donate</Link>
            </Button>

            <div className="h-6 w-px bg-gray-300 mx-1 hidden xl:block" />

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 text-gray-600 hover:text-[#E03694] hover:bg-[#E03694]/10 rounded-full"
                onClick={() => navigate('/intake?intent=contact')}
                aria-label="Contact"
              >
                <Mail size={18} />
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:text-[#E03694] hover:bg-[#E03694]/10 transition-colors"
                    aria-label="Accessibility"
                  >
                    <Accessibility size={18} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-5 bg-white border border-gray-100 shadow-xl rounded-xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                       <Accessibility size={18} className="text-[#E03694]" />
                       <h4 className="font-bold text-[#1A1A1A]">Accessibility</h4>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      Built to work with keyboard navigation and screen readers.
                    </p>
                    
                    <ul className="space-y-2.5">
                      {[
                        'Keyboard navigation support',
                        'Visible focus states',
                        'Semantic headings & structure',
                        'Screen-reader-friendly labels',
                        'Reduced-motion support (System)'
                      ].map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <Check size={14} className="mt-1 text-[#E03694] shrink-0" />
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-3 border-t border-gray-100 mt-2">
                      <h5 className="text-sm font-semibold text-gray-900 mb-1">Need help?</h5>
                      <p className="text-xs text-gray-500 mb-2">
                        If something isn’t accessible for you, we want to know.
                      </p>
                      <Link 
                        to="/intake?intent=contact" 
                        className="text-sm font-bold text-[#E03694] hover:underline inline-flex items-center gap-1"
                      >
                        Contact us
                      </Link>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Button
              variant="ghost"
              className="ml-2 gap-2 pl-3 pr-4 py-2 h-auto rounded-full hover:bg-black/5 text-gray-800"
              onClick={() => setMobileOpen(true)}
            >
              <div className="flex flex-col gap-1 items-end justify-center w-5">
                <span className="w-5 h-0.5 bg-current rounded-full" />
                <span className="w-3 h-0.5 bg-current rounded-full" />
                <span className="w-5 h-0.5 bg-current rounded-full" />
              </div>
              <span className="font-semibold text-sm tracking-wide">Menu</span>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Header (lg-) */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.45, 0, 0.55, 1] }}
        className="fixed top-0 left-0 right-0 z-50 lg:hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.90)', // Increased opacity for better contrast
          backdropFilter: 'blur(20px)',
          boxShadow: isScrolled ? '0px 4px 8px rgba(0, 0, 0, 0.12), 0px 2px 0px rgba(224, 54, 148, 0.3)' : '0px 4px 8px rgba(0, 0, 0, 0.12)',
          borderBottom: isScrolled ? '2px solid rgba(224, 54, 148, 0.2)' : 'none',
          transition: 'all 250ms ease-in-out',
        }}
      >
        <div className="px-6 h-20 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center min-h-[44px] min-w-[44px]" // Ensure touch target
            onClick={handleLinkClick}
          >
            <img
              src={sparkPointLogo}
              alt="SparkPoint logo"
              width={839}
              height={290}
              className="h-14 w-auto"
            />
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-black/5 min-h-[44px] min-w-[44px] flex items-center justify-center" // Ensure touch target
            style={{ color: '#E03694' }}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={28} />
          </Button>
        </div>
      </motion.header>

      {/* Unified Menu Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="right"
          hideCloseButton
          className="w-full sm:w-[480px] p-0 border-0"
          style={{
            background: 'linear-gradient(180deg, rgba(224, 54, 148, 0.98) 0%, rgba(158, 80, 159, 0.98) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation menu
          </SheetDescription>
          
          <div className="h-full flex flex-col">
            <div className="p-3 sm:p-4 flex justify-end">
              <Button 
                 variant="ghost" 
                 onClick={() => setMobileOpen(false)}
                 className="text-white hover:bg-white/20 rounded-full h-11 w-11 p-0 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#B34A9E]"
              >
                 <X size={24} />
                 <span className="sr-only">Close</span>
              </Button>
            </div>

            {/* Mobile View (Preserved Layout) */}
            <div className="lg:hidden flex-1 flex flex-col overflow-hidden">
                <nav
                  aria-label="Mobile navigation"
                  className="flex-1 overflow-y-auto px-3 sm:px-4 pb-1 grid gap-x-2 sm:gap-x-3 gap-y-1 auto-rows-min content-start"
                  style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}
                >
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: [0.45, 0, 0.55, 1],
                      }}
                      className="mb-0"
                    >
                      <Link
                        to={item.href!}
                        onClick={handleLinkClick}
                        className="flex items-center justify-center text-center min-h-[44px] rounded-lg px-2 py-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#B34A9E]"
                        style={{ fontSize: 'clamp(0.88rem, 2.7vw, 1rem)', fontWeight: '600' }}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="border-t border-white/20 px-3 sm:px-4 pt-2 pb-2.5 space-y-2">
                  <Link 
                    to="/trust"
                    className="block group rounded-lg py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#B34A9E]"
                    onClick={handleLinkClick}
                  >
                     <div className="flex items-center justify-between text-white">
                        <span className="font-bold text-[0.9rem] sm:text-[0.95rem] leading-tight">Trust & Accountability</span>
                        <ChevronDown className="rotate-[-90deg] opacity-50" size={16} />
                     </div>
                  </Link>

                  <div className="h-px bg-white/15 w-full my-0.5" />

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      asChild
                      className="w-full min-h-[44px] transition-all hover:brightness-105 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#B34A9E]"
                      style={{
                        backgroundColor: 'white',
                        color: '#E03694',
                        fontSize: '16px',
                        fontWeight: '700',
                      }}
                    >
                      <Link to="/donations" onClick={handleLinkClick}>
                        Donate
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full min-h-[44px] rounded-md border hover:bg-white focus-visible:ring-[#4F1845]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#B34A9E]"
                      style={{
                        backgroundColor: '#FFF4FB',
                        color: '#4F1845',
                        borderColor: 'rgba(255,255,255,0.75)',
                      }}
                      onClick={() => {
                        handleLinkClick();
                        navigate('/newsletter');
                      }}
                    >
                      <Mail size={16} className="mr-1.5" />
                      Newsletter
                    </Button>
                  </div>
                </div>
            </div>

            {/* Desktop View (Grouped Layout) */}
            <div className="hidden lg:flex flex-1 flex-col overflow-y-auto px-10 pb-10">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="space-y-12"
               >
                 {/* Group 1: Explore */}
                 <div>
                   <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-6">Explore</h3>
                   <div className="grid gap-4">
                     {['Mission', 'Stories', 'Impact', 'Programs'].map(label => {
                        const item = menuItems.find(i => i.label === label);
                        return item ? (
                          <Link
                            key={label}
                            to={item.href!}
                            onClick={handleLinkClick}
                            className="text-white text-3xl font-bold hover:translate-x-2 transition-transform inline-block"
                          >
                            {label}
                          </Link>
                        ) : null;
                     })}
                   </div>
                 </div>

                 {/* Group 2: Get Involved */}
                 <div>
                   <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-6">Get Involved</h3>
                   <div className="grid gap-4">
                      <Link to="/get-involved" onClick={handleLinkClick} className="text-white text-2xl font-bold hover:translate-x-2 transition-transform">Get Involved</Link>
                      <Link to="/donations" onClick={handleLinkClick} className="text-white text-2xl font-bold hover:translate-x-2 transition-transform">Donate</Link>
                      <a
                        href="https://cowbell-primrose-tet2.squarespace.com/newsletter"
                         onClick={handleLinkClick}
                        className="text-white text-2xl font-bold hover:translate-x-2 transition-transform"
                      >
                        Newsletter
                      </a>
                   </div>
                 </div>

                 {/* Group 3: About & Trust */}
                 <div>
                   <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-6">About <span translate="no">SparkPoint</span></h3>
                   <div className="grid gap-4">
                      <Link to="/about" onClick={handleLinkClick} className="text-white text-xl font-semibold hover:text-white/80 transition-colors">About Us</Link>
                      <Link to="/sponsors" onClick={handleLinkClick} className="text-white text-xl font-semibold hover:text-white/80 transition-colors">Partners</Link>
                      <Link to="/resiliency-hub" onClick={handleLinkClick} className="text-white text-xl font-semibold hover:text-white/80 transition-colors">Resiliency Hub</Link>
                      <Link to="/intake?intent=contact" onClick={handleLinkClick} className="text-white text-xl font-semibold hover:text-white/80 transition-colors">Contact</Link>
                      
                      <Link 
                        to="/trust" 
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 mt-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10 group"
                      >
                         <div className="p-2 rounded-full bg-white/20 text-white group-hover:scale-110 transition-transform">
                            <Shield size={20} />
                         </div>
                         <div>
                            <div className="text-white font-bold text-lg">Trust & Accountability</div>
                            <div className="text-white/70 text-sm">Transparency, privacy, and stewardship</div>
                         </div>
                      </Link>
                   </div>
                 </div>
               </motion.div>
            </div>

          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
