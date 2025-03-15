'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { GitHubLogoIcon, LinkedInLogoIcon, EnvelopeClosedIcon, HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons';

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [hoverLink, setHoverLink] = useState<string | null>(null);
  
  // References for scroll tracking
  const headerRef = useRef<HTMLElement>(null);
  
  // Scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });

  // Use Intersection Observer API for better section detection
  useEffect(() => {
    const sectionIds = ['home', 'about', 'skills', 'projects', 'contact'];
    const sectionElements = sectionIds.map(id => document.getElementById(id));
    
    // Options for intersection observer
    const options = {
      root: null, // viewport
      rootMargin: '0px 0px -60% 0px', // trigger when section is 40% in view from top
      threshold: 0 // trigger as soon as any part is visible
    };
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);
    
    // Observe all sections
    sectionElements.forEach(section => {
      if (section) observer.observe(section);
    });
    
    // Clean up
    return () => {
      sectionElements.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const navLinks = [
    { href: '#home', label: 'Home', section: 'home', color: 'from-purple-500 to-violet-500' },
    { href: '#about', label: 'About', section: 'about', color: 'from-violet-500 to-indigo-500' },
    { href: '#skills', label: 'Skills', section: 'skills', color: 'from-indigo-500 to-blue-500' },
    { href: '#projects', label: 'Projects', section: 'projects', color: 'from-blue-500 to-cyan-500' },
    { href: '#contact', label: 'Contact', section: 'contact', color: 'from-cyan-500 to-purple-500' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Lock body scroll when menu is open
    document.body.style.overflow = !mobileMenuOpen ? 'hidden' : 'auto';
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = 'auto';
  };
  
  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80, // Adjust for header height
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <>
      <motion.header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-2 shadow-xl' : 'py-4'
        }`}
        style={{ 
          backgroundColor: scrolled ? 'rgba(10, 10, 14, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none'
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      >
        {/* Scroll Progress Indicator */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600"
          style={{ scaleX, transformOrigin: '0%' }}
        />
        
        <div className="container mx-auto px-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative z-10"
          >
            <a 
              href="#" 
              className="text-2xl font-bold tracking-tight group flex items-center"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('home');
                closeMobileMenu();
              }}
            >
              <motion.span 
                className="text-white mr-1 relative"
                whileHover={{ scale: 1.05 }}
              >
                Ciaran
                <motion.span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-700" 
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.2 }}
                />
              </motion.span>
              <motion.span 
                style={{ color: 'var(--accent-primary)' }}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                Day
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-700 to-purple-500" 
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.2 }}
                />
              </motion.span>
              <motion.div 
                className="absolute -z-10 w-8 h-8 rounded-full bg-purple-600/30 blur-xl" 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
            </a>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="relative text-lg font-medium text-white/70 hover:text-white transition-colors"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                onMouseEnter={() => setHoverLink(link.section)}
                onMouseLeave={() => setHoverLink(null)}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.section);
                }}
              >
                <span className={activeSection === link.section ? 'text-white' : ''}>
                  {link.label}
                </span>
                
                {/* Active indicator */}
                {activeSection === link.section && (
                  <motion.span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r ${link.color}`}
                    layoutId="activeSection"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                
                {/* Hover indicator (only show when not active) */}
                {hoverLink === link.section && activeSection !== link.section && (
                  <motion.span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r ${link.color} opacity-50`}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                
                {/* Glow effect on hover */}
                {hoverLink === link.section && (
                  <motion.span
                    className={`absolute inset-0 bg-gradient-to-r ${link.color} opacity-0 blur-lg -z-10`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.a>
            ))}
          </nav>

          {/* Social Icons Desktop */}
          <div className="hidden md:flex gap-5 items-center">
            <motion.a 
              href="https://github.com/CiaranGames"
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 5, y: -2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="relative group"
            >
              <span className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors duration-200"></span>
              <GitHubLogoIcon className="w-5 h-5 text-white group-hover:text-purple-300 transition-colors" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">GitHub</span>
            </motion.a>
            <motion.a 
              href="https://linkedin.com/in/ciaran-day"
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: -5, y: -2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="relative group"
            >
              <span className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors duration-200"></span>
              <LinkedInLogoIcon className="w-5 h-5 text-white group-hover:text-blue-300 transition-colors" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">LinkedIn</span>
            </motion.a>
            <motion.a 
              href="#contact"
              whileHover={{ scale: 1.2, rotate: 5, y: -2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="relative group"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
            >
              <span className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors duration-200"></span>
              <EnvelopeClosedIcon className="w-5 h-5 text-white group-hover:text-green-300 transition-colors" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Email</span>
            </motion.a>

            <motion.a
              href="#contact"
              className="ml-2 px-5 py-2 rounded-full text-white font-medium overflow-hidden relative group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
            >
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600 to-violet-600 opacity-90 group-hover:opacity-100 transition-opacity"></span>
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500 to-violet-600 blur-lg opacity-70 group-hover:opacity-90 transition-opacity transform group-hover:scale-110 duration-300"></span>
              
              {/* Pulse animation on hover */}
              <motion.span 
                className="absolute top-0 left-0 w-full h-full rounded-full bg-white/30 pointer-events-none opacity-0 group-hover:opacity-100"
                animate={{ scale: [0.8, 1.5, 0.8], opacity: [0, 0.3, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 0 }}
              />
              
              <span className="relative">Hire Me</span>
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-white p-2 z-50 relative"
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle Menu"
          >
            <span className="absolute inset-0 rounded-full bg-white/0 hover:bg-white/10 transition-colors duration-200"></span>
            {mobileMenuOpen ? <Cross1Icon className="w-6 h-6" /> : <HamburgerMenuIcon className="w-6 h-6" />}
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-lg flex flex-col justify-center p-8"
            initial={{ clipPath: "circle(0% at calc(100% - 35px) 35px)", opacity: 0.8 }}
            animate={{ clipPath: "circle(150% at calc(100% - 35px) 35px)", opacity: 1 }}
            exit={{ clipPath: "circle(0% at calc(100% - 35px) 35px)", opacity: 0.8 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.nav className="flex flex-col items-center gap-6 mb-10">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className={`text-2xl font-medium relative ${
                    activeSection === link.section ? 'text-white' : 'text-white/70'
                  } hover:text-white transition-colors`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.section);
                    closeMobileMenu();
                  }}
                >
                  <span className="relative">
                    {link.label}
                    {activeSection === link.section && (
                      <motion.span
                        className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r ${link.color}`}
                        layoutId="activeMobileSection"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </span>
                </motion.a>
              ))}
            </motion.nav>

            <motion.div 
              className="flex justify-center gap-6 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.a 
                href="https://github.com/CiaranGames"
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
                whileHover={{ scale: 1.1, backgroundColor: "#2a2a36" }}
                whileTap={{ scale: 0.9 }}
              >
                <GitHubLogoIcon className="w-6 h-6 text-white" />
              </motion.a>
              <motion.a 
                href="https://linkedin.com/in/ciaran-day"
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
                whileHover={{ scale: 1.1, backgroundColor: "#2a2a36" }}
                whileTap={{ scale: 0.9 }}
              >
                <LinkedInLogoIcon className="w-6 h-6 text-white" />
              </motion.a>
              <motion.a 
                href="#contact"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
                whileHover={{ scale: 1.1, backgroundColor: "#2a2a36" }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contact');
                  closeMobileMenu();
                }}
              >
                <EnvelopeClosedIcon className="w-6 h-6 text-white" />
              </motion.a>
            </motion.div>
            
            <motion.div
              className="absolute bottom-10 left-0 right-0 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.a
                href="#contact"
                className="px-8 py-3 rounded-full text-white font-medium overflow-hidden relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contact');
                  closeMobileMenu();
                }}
              >
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600 to-violet-600 opacity-100"></span>
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500 to-violet-600 blur-lg opacity-70"></span>
                <span className="relative">Hire Me</span>
              </motion.a>
            </motion.div>
            
            {/* Floating background elements */}
            <motion.div
              className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl -z-10"
              initial={{ x: -100, y: 100 }}
              animate={{ x: 50, y: 0 }}
              transition={{ repeat: Infinity, duration: 15, repeatType: "reverse", ease: "easeInOut" }}
            />
            <motion.div
              className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 blur-3xl -z-10"
              initial={{ x: 100, y: -100 }}
              animate={{ x: 0, y: 50 }}
              transition={{ repeat: Infinity, duration: 20, repeatType: "reverse", ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar; 