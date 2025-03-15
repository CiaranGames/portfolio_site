'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouseEntered, setMouseEntered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Add refs for the gradient orbs and CD orb
  const gradientOrb1Ref = useRef<HTMLDivElement>(null);
  const gradientOrb2Ref = useRef<HTMLDivElement>(null);
  const cdOrbRef = useRef<HTMLDivElement>(null);
  
  // Track mouse position for gradient and CD orb effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Apply mouse effects to gradient orbs and CD orb
  useEffect(() => {
    const orb1 = gradientOrb1Ref.current;
    const orb2 = gradientOrb2Ref.current;
    const cdOrb = cdOrbRef.current;
    
    if (orb1 && orb2 && cdOrb) {
      // Get center of viewport
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Calculate distance from center (normalized from -1 to 1)
      const distanceX = (mousePosition.x - centerX) / centerX;
      const distanceY = (mousePosition.y - centerY) / centerY;
      
      // Move gradient orbs subtly based on mouse position
      orb1.style.transform = `translate(${distanceX * 20}px, ${distanceY * 20}px)`;
      orb2.style.transform = `translate(${distanceX * -30}px, ${distanceY * -30}px)`;
      
      // For CD orb, calculate if mouse is nearby to create a "magnetic" effect
      const cdOrbRect = cdOrb.getBoundingClientRect();
      const cdCenterX = cdOrbRect.left + cdOrbRect.width / 2;
      const cdCenterY = cdOrbRect.top + cdOrbRect.height / 2;
      
      const mouseDistanceX = mousePosition.x - cdCenterX;
      const mouseDistanceY = mousePosition.y - cdCenterY;
      const distance = Math.sqrt(mouseDistanceX * mouseDistanceX + mouseDistanceY * mouseDistanceY);
      
      // Apply glow effect to CD orb when mouse is close
      if (distance < 300) {
        const intensity = 1 - Math.min(distance / 300, 1);
        cdOrb.style.boxShadow = `0 0 ${50 * intensity}px ${10 * intensity}px rgba(125, 81, 227, ${0.2 + intensity * 0.3})`;
        cdOrb.style.transform = `scale(${1 + intensity * 0.05})`;
      } else {
        cdOrb.style.boxShadow = '';
        cdOrb.style.transform = 'scale(1)';
      }
    }
  }, [mousePosition]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mousePosition = { x: 0, y: 0 };
    let targetMousePosition = { x: 0, y: 0 };
    let hue = 260; // Initial hue (purple)

    // Define Particle class first
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      life: number = 100; // Life counter for particles
      hue: number;
      
      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * (canvas?.height || window.innerHeight);
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.hue = Math.random() * 60 - 30 + hue; // Random hue variation
        this.color = `hsl(${this.hue}, 100%, 60%)`;
        this.alpha = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Gradually decrease life
        if (this.life > 0) {
          this.life--;
        }
        
        // React to mouse with smooth tracking
        mousePosition.x += (targetMousePosition.x - mousePosition.x) * 0.1;
        mousePosition.y += (targetMousePosition.y - mousePosition.y) * 0.1;
        
        const dx = mousePosition.x - this.x;
        const dy = mousePosition.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const directionX = dx / distance || 0;
          const directionY = dy / distance || 0;
          this.speedX += directionX * force * 0.3;
          this.speedY += directionY * force * 0.3;
          
          // Increase brightness based on proximity to mouse
          this.color = `hsl(${this.hue}, 100%, ${60 + force * 30}%)`;
        } else {
          this.color = `hsl(${this.hue}, 100%, 60%)`;
        }

        // Dampen speed
        this.speedX *= 0.96;
        this.speedY *= 0.96;

        // Boundary check
        const canvasWidth = canvas?.width || window.innerWidth;
        const canvasHeight = canvas?.height || window.innerHeight;
        
        if (this.x < 0) {
          this.x = 0;
          this.speedX *= -1;
        } else if (this.x > canvasWidth) {
          this.x = canvasWidth;
          this.speedX *= -1;
        }
        
        if (this.y < 0) {
          this.y = 0;
          this.speedY *= -1;
        } else if (this.y > canvasHeight) {
          this.y = canvasHeight;
          this.speedY *= -1;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.globalAlpha = this.alpha * (this.life / 100); // Fade out based on life
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Define init function before it's used
    const init = () => {
      particles = [];
      const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 8000); // Responsive particle count
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    // Now define setCanvasDimensions that uses init
    const setCanvasDimensions = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Reinitialize particles when resizing
        init();
      }
    };

    window.addEventListener('resize', setCanvasDimensions);
    setCanvasDimensions();

    // Track mouse position with smoothing
    window.addEventListener('mousemove', (e) => {
      targetMousePosition = { x: e.clientX, y: e.clientY };
      
      // Create a "burst" effect when mouse moves
      if (mouseEntered) {
        for (let i = 0; i < 3; i++) {
          const burst = new Particle();
          burst.x = e.clientX;
          burst.y = e.clientY;
          burst.size = Math.random() * 4 + 2;
          burst.speedX = (Math.random() - 0.5) * 5;
          burst.speedY = (Math.random() - 0.5) * 5;
          burst.color = `hsl(${hue}, 100%, 60%)`;
          burst.life = 30;
          particles.push(burst);
        }
      }
    });
    
    window.addEventListener('mouseenter', () => {
      setMouseEntered(true);
    });

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Slowly shift hue over time
      hue = (hue + 0.1) % 360;

      // Filter out dead particles and add new ones to maintain count
      particles = particles.filter(p => p.life > 0);
      
      const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 8000);
      if (particles.length < particleCount && Math.random() > 0.95) {
        particles.push(new Particle());
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Draw connections
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            const opacity = (120 - distance) / 120 * 0.5;
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y, 
              particles[j].x, particles[j].y
            );
            gradient.addColorStop(0, `hsla(${particles[i].hue}, 100%, 60%, ${opacity})`);
            gradient.addColorStop(1, `hsla(${particles[j].hue}, 100%, 60%, ${opacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.6 * ((120 - distance) / 120);
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      window.removeEventListener('mousemove', (e) => {
        targetMousePosition = { x: e.clientX, y: e.clientY };
      });
      cancelAnimationFrame(animationFrameId);
    };
  }, [mouseEntered]);

  // Text animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }
  };

  return (
    <section id="home" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full -z-10"
      />
      
      {/* Decorative gradient orbs with mouse interaction */}
      <div 
        ref={gradientOrb1Ref}
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-purple-600/20 blur-[100px] -z-5 transition-transform duration-300 ease-out"
      ></div>
      <div 
        ref={gradientOrb2Ref}
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-blue-600/20 blur-[100px] -z-5 transition-transform duration-300 ease-out"
      ></div>
      
      <div className="relative z-10 container mx-auto px-4 mt-16 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Text Content */}
        <motion.div 
          className="max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center mb-4 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-3 h-3 rounded-full bg-green-400 mr-2 animate-pulse"></div>
              <span className="text-white/90 text-sm font-medium">Available for work</span>
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-xl text-white/90 font-mono mb-2"
            variants={itemVariants}
          >
            Hello, I&apos;m
          </motion.h2>
          
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            variants={itemVariants}
          >
            <div className="relative inline-block">
              <span className="text-white">Ciaran</span>
              <motion.div 
                className="absolute -z-10 -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 blur-xl opacity-30"
                animate={{ 
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>{' '}
            <div className="relative inline-block mt-1 md:mt-3">
              <span style={{ color: 'var(--accent-primary)' }}>Day</span>
              <motion.div 
                className="absolute -z-10 -inset-1 bg-gradient-to-r from-indigo-600 to-violet-600 blur-xl opacity-30"
                animate={{ 
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              />
            </div>
          </motion.h1>
          
          <motion.div
            className="relative mb-6"
            variants={itemVariants}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white inline-block">
              Web Developer
              <motion.span
                className="inline-block w-2 h-8 ml-2 bg-white"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            </h2>
            <motion.div 
              className="absolute -z-10 left-0 right-0 bottom-0 h-3 bg-gradient-to-r from-purple-600/0 via-purple-600/30 to-purple-600/0 blur-md"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                width: ['80%', '110%', '80%'],
                left: ['10%', '-5%', '10%']
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </motion.div>
          
          <motion.p
            className="text-lg text-white/80 mb-8 max-w-xl leading-relaxed"
            variants={itemVariants}
          >
            I build exceptional, responsive websites and web applications that provide intuitive, engaging user experiences with cutting-edge technology.
          </motion.p>
          
          <motion.div
            className="flex flex-wrap gap-4"
            variants={itemVariants}
          >
            <motion.a
              href="#projects"
              className="px-8 py-3 rounded-full text-white font-medium relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 to-violet-600 opacity-90 group-hover:opacity-100 transition-opacity"></span>
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500 to-violet-600 blur-md opacity-70 group-hover:opacity-90 transition-opacity transform group-hover:scale-110"></span>
              <span className="relative flex items-center">
                View My Work
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M14 5l7 7m0 0l-7 7m7-7H3" 
                  />
                </svg>
              </span>
            </motion.a>
            
            <motion.a
              href="#contact"
              className="px-8 py-3 rounded-full text-white font-medium bg-transparent border border-white/20 hover:bg-white/10 transition-colors relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative flex items-center">
                Contact Me
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
              </span>
            </motion.a>
          </motion.div>
        </motion.div>
        
        {/* Hero Image or 3D Element */}
        <motion.div
          className="relative hidden md:block w-full max-w-md"
          initial={{ opacity: 0, scale: 0.8, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="relative aspect-square">
            {/* Abstract Designer/Developer Visualization with mouse interaction */}
            <div 
              className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-900/30 via-violet-600/20 to-purple-900/30 backdrop-blur-3xl transition-all duration-300 ease-out"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x ? ((mousePosition.x / window.innerWidth) * 100) : 50}% ${mousePosition.y ? ((mousePosition.y / window.innerHeight) * 100) : 50}%, rgba(139, 92, 246, 0.3), rgba(124, 58, 237, 0.2), rgba(88, 28, 135, 0.3))`,
              }}
            ></div>
            
            <div 
              ref={cdOrbRef}
              className="absolute inset-4 rounded-full border border-white/10 overflow-hidden backdrop-blur-md bg-black/20 transition-all duration-200"
            >
              <div className="absolute inset-0 flex items-center justify-center text-white text-opacity-10 text-9xl font-bold">CD</div>
              
              {/* Animated Code Elements */}
              <motion.div 
                className="absolute top-[15%] left-[15%] w-16 h-16 rounded-lg bg-violet-700/40 backdrop-blur-sm flex items-center justify-center text-white"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-[20%] right-[15%] w-14 h-14 rounded-lg bg-purple-600/40 backdrop-blur-sm flex items-center justify-center text-white"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </motion.div>
              
              <motion.div 
                className="absolute top-[55%] right-[20%] w-12 h-12 rounded-lg bg-indigo-600/40 backdrop-blur-sm flex items-center justify-center text-white"
                animate={{ 
                  x: [0, 15, 0],
                  rotate: [0, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </motion.div>
              
              <motion.div 
                className="absolute top-[25%] right-[25%] w-10 h-10 rounded-lg bg-pink-600/40 backdrop-blur-sm flex items-center justify-center text-white"
                animate={{ 
                  x: [0, -10, 0],
                  y: [0, 15, 0],
                  rotate: [0, -8, 0],
                  scale: [1, 1.08, 1]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </motion.div>
            </div>
            
            {/* Glowing orbits */}
            <motion.div 
              className="absolute inset-0 border-2 border-purple-500/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <motion.div 
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            <motion.div 
              className="absolute inset-8 border-2 border-indigo-500/20 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <motion.div 
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center">
          <span className="text-white/50 text-sm mb-2">Scroll Down</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection; 