'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10 -z-10" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 20% 35%, var(--accent-primary) 0%, transparent 50%), radial-gradient(circle at 80% 65%, var(--accent-secondary) 0%, transparent 40%)'
        }}
      />
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col md:flex-row gap-12 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Profile Image */}
          <motion.div 
            className="w-full md:w-2/5"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto overflow-hidden rounded-2xl shadow-2xl" style={{ backgroundColor: 'var(--card-bg)' }}>
                {/* Headshot image */}
                <div className="w-full h-full relative">
                  <Image 
                    src="/headshot.jpg" 
                    alt="Ciaran Day" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
              </div>
              
              {/* Decorative elements */}
              <motion.div 
                className="absolute -z-10 w-full h-full top-4 left-4 rounded-2xl" 
                style={{ backgroundColor: 'var(--accent-primary)', opacity: 0.3 }}
                animate={{ 
                  top: [4, 10, 4],
                  left: [4, 10, 4],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.div 
                className="absolute w-20 h-20 rounded-full -top-6 -right-6"
                style={{ 
                  background: 'linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))',
                  opacity: 0.7 
                }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Add glowing effect on hover */}
              <motion.div 
                className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: '0 0 30px 5px var(--accent-primary)',
                  zIndex: -1
                }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
          
          {/* About Content */}
          <motion.div 
            className="w-full md:w-3/5"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true, amount: 0.1 }}
          >
            <h2 className="text-lg font-mono mb-2" style={{ color: 'var(--accent-primary)' }}>About Me</h2>
            <h3 className="text-4xl font-bold mb-6 text-white">Passionate Web Developer Creating Digital Experiences</h3>
            
            <div className="space-y-4 text-white/80">
              <p>
                Hi there! I&apos;m Ciaran Day, a dedicated web developer with a passion for creating beautiful, functional, and user-centered digital experiences. I blend technical expertise with creative problem-solving to build applications that make an impact.
              </p>
              <p>
                With several years of experience in the field, I specialize in front-end development with expertise in modern frameworks and technologies. I&apos;m constantly exploring new tools and approaches to create more efficient, accessible, and engaging web solutions.
              </p>
              <p>
                When I&apos;m not coding, I enjoy exploring new technologies, contributing to open-source projects, and sharing knowledge with the developer community. I believe in writing clean, maintainable code and delivering solutions that exceed expectations.
              </p>
            </div>
            
            <div className="mt-8 flex gap-4">
              <motion.a 
                href="#contact"
                className="px-6 py-3 rounded-full font-medium bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white transition-colors shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get In Touch
              </motion.a>
              <motion.a 
                href="#projects"
                className="px-6 py-3 rounded-full font-medium border border-white/20 text-white hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Projects
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection; 