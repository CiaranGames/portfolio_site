'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { GitHubLogoIcon, LinkedInLogoIcon, EnvelopeClosedIcon, ArrowUpIcon, CodeIcon, CheckIcon, RocketIcon } from '@radix-ui/react-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: false, amount: 0.3 });
  const controls = useAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ x: number, y: number, size: number, color: string, speed: number }>>([]);
  
  // Effect for particle animation
  useEffect(() => {
    // Create particles only if viewed
    if (isInView) {
      const newParticles = Array.from({ length: 15 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        color: `hsl(${Math.random() * 60 + 240}, 80%, 70%)`,
        speed: Math.random() * 0.5 + 0.2
      }));
      setParticles(newParticles);
    }
  }, [isInView]);
  
  // Update particles position
  useEffect(() => {
    if (!isInView || particles.length === 0) return;
    
    const interval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          y: particle.y - particle.speed,
          x: particle.x + (Math.sin(particle.y / 10) * 0.2),
          // Reset particle if it goes off screen
          ...(particle.y < -5 ? {
            y: 105,
            x: Math.random() * 100
          } : {})
        }))
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, [isInView, particles]);
  
  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!footerRef.current) return;
      
      const rect = footerRef.current.getBoundingClientRect();
      
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100
      });
    };
    
    if (isInView) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isInView]);
  
  // Animation control based on view
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);
  
  // Handle copy email function
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('ciarantday@gmail.com');
    setIsEmailCopied(true);
    setTimeout(() => setIsEmailCopied(false), 2000);
  };
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  };
  
  const mainLinks = [
    { href: '#about', label: 'About', id: 'about' },
    { href: '#skills', label: 'Skills', id: 'skills' },
    { href: '#projects', label: 'Projects', id: 'projects' },
    { href: '#contact', label: 'Contact', id: 'contact' }
  ];
  
  const socialLinks = [
    { 
      href: 'https://github.com/CiaranGames',
      icon: <GitHubLogoIcon className="w-5 h-5" />,
      label: 'GitHub',
      color: 'group-hover:bg-gray-800'
    },
    { 
      href: 'https://linkedin.com/in/ciaran-day',
      icon: <LinkedInLogoIcon className="w-5 h-5" />,
      label: 'LinkedIn',
      color: 'group-hover:bg-blue-700'
    },
    { 
      href: '#contact',
      icon: <EnvelopeClosedIcon className="w-5 h-5" />,
      label: 'Email',
      color: 'group-hover:bg-green-700',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        scrollToSection('contact');
      }
    }
  ];
  
  return (
    <motion.footer 
      ref={footerRef}
      className="relative pt-20 pb-12 overflow-hidden"
      style={{ 
        backgroundColor: 'var(--nav-bg)',
        backgroundImage: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.1), transparent 25%)` 
      }}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      {/* Particle animation effect */}
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Footer main content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <motion.div 
            className="md:col-span-4 space-y-4"
            variants={itemVariants}
          >
            <motion.a
              href="#" 
              className="text-2xl font-bold tracking-tight inline-block"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-white">Ciaran</span>
              <span style={{ color: 'var(--accent-primary)' }}>Day</span>
              <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all duration-300"></div>
            </motion.a>
            
            <p className="text-white/70 text-sm max-w-xs">
              Crafting exceptional digital experiences through clean code and creative solutions. Always exploring new technologies to deliver cutting-edge results.
            </p>
            
            <div className="pt-4">
              <motion.button
                className="text-white/70 hover:text-white flex items-center space-x-2 group"
                onClick={handleCopyEmail}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="inline-block">
                  {isEmailCopied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <EnvelopeClosedIcon className="w-4 h-4" />}
                </span>
                <span className="inline-block relative">
                  {isEmailCopied ? 'Copied to clipboard!' : 'ciarantday@gmail.com'}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </span>
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:col-span-3 space-y-6"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-white">Navigation</h3>
            <div className="flex flex-col space-y-3">
              {mainLinks.map((link) => (
                <motion.a 
                  key={link.id}
                  href={link.href} 
                  className="text-white/70 hover:text-white transition-colors relative group flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.id);
                  }}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="absolute left-0 w-0 h-full border-l-2 border-purple-500 opacity-0 group-hover:opacity-100 group-hover:h-full transition-all duration-300"></span>
                  <span className="ml-0 group-hover:ml-3 transition-all duration-300">{link.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="md:col-span-3 space-y-6"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-white">Connect</h3>
            <div className="flex flex-col space-y-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  onClick={link.onClick}
                  className="flex items-center space-x-3 text-white/70 hover:text-white transition-colors group"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  target={link.href.startsWith('http') ? "_blank" : undefined}
                  rel={link.href.startsWith('http') ? "noopener noreferrer" : undefined}
                >
                  <span className={`w-8 h-8 rounded-full bg-white/10 ${link.color} flex items-center justify-center transition-colors duration-300`}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="md:col-span-2 space-y-6"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            
            <motion.button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg group"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUpIcon className="w-4 h-4" />
              <span>Back to Top</span>
            </motion.button>
            
            <motion.a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg group"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <RocketIcon className="w-4 h-4" />
              <span>Hire Me</span>
            </motion.a>
          </motion.div>
        </div>
        
        {/* Divider with gradient */}
        <motion.div 
          className="my-10 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          variants={itemVariants}
        />
        
        {/* Footer bottom */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center text-white/50 text-sm"
          variants={itemVariants}
        >
          <div className="mb-4 md:mb-0">
            © {currentYear} <span className="text-white/70">Ciaran Day</span>. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-2">
            <span>Made with</span>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                repeatType: "reverse"
              }}
              className="text-red-400"
            >
              ❤️
            </motion.div>
            <span>and</span>
            <CodeIcon className="w-4 h-4 text-purple-400" />
          </div>
          
          <div className="mt-4 md:mt-0 text-xs">
            <a 
              href="#" 
              className="text-white/50 hover:text-white transition-colors"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('home');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <motion.span
                whileHover={{ color: '#fff' }}
              >
                Designed & Built by Ciaran Day
              </motion.span>
            </a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer; 