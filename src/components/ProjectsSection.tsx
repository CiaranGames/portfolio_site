'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitHubLogoIcon, Cross2Icon, ChevronLeftIcon, ChevronRightIcon, GlobeIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

// Define the project data structure
interface ProjectLink {
  text: string;
  url: string;
  icon: React.ReactNode;
}

interface ProjectImage {
  src: string;
  alt: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  images: ProjectImage[];
  tags: string[];
  features: string[];
  challenges: string[];
  links: ProjectLink[];
  category?: string; // Optional for filtering
  isPropriety?: boolean; // Flag to indicate if project is proprietary
  isUnderConstruction?: boolean; // Flag to indicate projects still being built
}

// Enhanced project data with multiple images and extended descriptions
const projectsData: Project[] = [
  {
    id: 1,
    title: "Avtags - E-Commerce Platform",
    description: "A modern, responsive e-commerce platform built with Next.js, TypeScript, Tailwind CSS, and Framer Motion. Features include animated sections, interactive components, and a dark theme design.",
    images: [
      { src: "/avtags/landing.png", alt: "Site landing page" },
      { src: "/avtags/product.png", alt: "Products page" },
      { src: "/avtags/promo.png", alt: "Landing page promo" }
    ],
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    features: [
      "Responsive design for all device sizes",
      "Interactive animations using Framer Motion",
      "Dark theme with accent colors",
      "Type-safe code with TypeScript",
      "SEO optimized"
    ],
    challenges: [
      "Creating smooth animations that work well across devices",
      "Implementing a responsive design system",
      "Optimizing performance with Next.js"
    ],
    links: [
      { text: "Live Demo", url: "https://avtags.shop", icon: <GlobeIcon className="w-4 h-4" /> }
    ],
    category: "full-stack",
    isPropriety: true
  },
  {
    id: 2,
    title: "E-Commerce Admin Panel",
    description: "Built for AvTags, an all-in-one admin panel for managing an e-commerce platform, including product management, order processing, and customer support features.",
    images: [
      { src: "/admin-panel/landing.png", alt: "Task board overview" },
      { src: "/headshot.jpg", alt: "Task detail view" },
      { src: "/placeholder-project-3.jpg", alt: "Team collaboration view" }
    ],
    tags: ["React", "Next.js", "Node.js", "MongoDB", "Tailwind CSS", "Cloudflare"],
    features: [
      "Real-time order tracking and status updates",
      "Product inventory management",
      "Customer support system",
      "Analytics dashboard"
    ],
    challenges: [
      "Implementing real-time synchronization across multiple clients",
      "Ensuring hightened security for all endpoints",
      "Managing complex state with optimistic updates"
    ],
    links: [
      { text: "Live Demo", url: "#", icon: <GlobeIcon className="w-4 h-4" /> },
    ],
    category: "full-stack",
    isPropriety: true,
    isUnderConstruction: true,
  },
  {
    id: 3,
    title: "Clearly Development V2",
    description: "The second version of the Clearly Development website, built with Next.js, TypeScript, Tailwind CSS, and Framer Motion. Clearly Development is the largest UGC marketplace for developers.",
    images: [
      { src: "/", alt: "Image 1" },
      { src: "/", alt: "Image 2" },
      { src: "/", alt: "Image 3" }
    ],
    tags: ["React", "Tailwind CSS", "Framer Motion"],
    features: [
      "Responsive design for all devices",
      "Researched-backed features to ensure maximum conversion rates"
    ],
    challenges: [
      "Implementing a responsive design system that allows for easy scaling and updating",
    ],
    links: [
      { text: "Live Demo", url: "https://clearlydev.com", icon: <GlobeIcon className="w-4 h-4" /> },
    ],
    category: "frontend",
    isPropriety: true
  },
  {
    id: 4,
    title: "MyTeslaPower",
    description: "An application that allows users to track their Tesla Powerwall battery usage and costs, whilst giving suggestions on how to save money.",
    images: [
      { src: "/myteslapower/landing.png", alt: "Landing Page" },
      { src: "/myteslapower/dashboard.png", alt: "User Dashboard Page" },
      { src: "/myteslapower/events.png", alt: "Budget planning tool" }
    ],
    tags: ["Flask", "Chart.js", "Python", "SQL", "NGINX"],
    features: [
      "Event-based system to control the Powerwall from user-set parameters",
      "User-friendly interface to view and analyze data",
      "Graphs and charts to visualize data",
      "Tariff switching suggestions based on usage"
    ],
    challenges: [
      "Creating an algorithm to most efficiently track the Powerwall's usage",
      "Creating an intuitive user interface for a heavily data-driven application",
      "Generating meaningful insights from usage patterns"
    ],
    links: [
      { text: "Live Demo", url: "https://myteslapower.co.uk", icon: <GlobeIcon className="w-4 h-4" /> }
    ],
    category: "full-stack",
    isPropriety: true
  },
  {
    id: 5,
    title: "Contributions Style Display",
    description: "A project with my brother, which displays messages in a style similar to the contributions graph on GitHub for your profile README.md.",
    images: [
      { src: "/", alt: "Image 1" },
      { src: "/", alt: "Image 2" },
      { src: "/", alt: "Image 3" }
    ],
    tags: ["HTML", "CSS", "JS", "Capture.js"],
    features: [
      "Downloads automatically as a .GIF",
      "Allows you to set any message you want",
    ],
    challenges: [
      "Rendering GIF in the background for better usablity",
      "Ensuring it looks nice but still has the core concept",
    ],
    links: [
      { text: "Live Demo", url: "#", icon: <GlobeIcon className="w-4 h-4" /> },
      { text: "Source Code", url: "https://github.com/Jambient/Contributions-Style-Display", icon: <GitHubLogoIcon className="w-4 h-4" /> }
    ],
    category: "backend",
  },
];

const ProjectsSection = () => {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (selectedProject) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedProject]);

  // Move these functions before the useEffect that depends on them
  const nextImage = () => {
    if (!selectedProject) return;
    setCurrentImageIndex((prev) => 
      prev === selectedProject.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!selectedProject) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedProject.images.length - 1 : prev - 1
    );
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedProject) return;
      
      switch (event.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, currentImageIndex, nextImage, prevImage]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedProject]);
  
  const filteredProjects = filter === 'all' 
    ? projectsData 
    : filter === 'construction'
      ? projectsData.filter(project => project.isUnderConstruction)
      : projectsData.filter(project => project.category === filter);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        {/* Add CSS for the construction border */}
        <style jsx global>{`
          .construction-border {
            box-shadow: 0 0 0 1px rgba(250, 204, 21, 0.3);
            background-image: repeating-linear-gradient(
              -45deg,
              rgba(250, 204, 21, 0.05),
              rgba(250, 204, 21, 0.05) 10px,
              rgba(0, 0, 0, 0) 10px,
              rgba(0, 0, 0, 0) 20px
            );
          }
          
          .construction-border::before {
            content: '';
            position: absolute;
            inset: 0;
            border: 1px dashed rgba(250, 204, 21, 0.3);
            border-radius: 0.75rem;
            pointer-events: none;
          }
        `}</style>
        
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className="text-lg font-mono mb-2" style={{ color: 'var(--accent-primary)' }}>My Work</h2>
          <h3 className="text-4xl font-bold mb-8 text-white">Featured Projects</h3>
          
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {['all', 'frontend', 'backend', 'full-stack', 'in progress'].map((category) => (
              <motion.button
                key={category}
                onClick={() => setFilter(category === 'in progress' ? 'construction' : category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  (filter === category || (filter === 'construction' && category === 'in progress')) 
                    ? category === 'in progress' 
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black'
                      : 'bg-gradient-to-r from-purple-600 to-violet-600 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className={`rounded-xl overflow-hidden shadow-lg cursor-pointer relative ${project.isUnderConstruction ? 'construction-border' : ''}`}
              style={{ backgroundColor: 'var(--card-bg)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              onClick={() => openModal(project)}
            >
              {project.isUnderConstruction && (
                <div className="absolute -right-8 top-6 rotate-45 z-20 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold py-1 w-36 text-center text-xs shadow-lg">
                  IN PROGRESS
                </div>
              )}
              
              {/* Project Image Placeholder */}
              <div 
                className="h-48 w-full relative overflow-hidden"
                style={{ 
                  background: `linear-gradient(45deg, var(--card-bg), var(--nav-bg))` 
                }}
              >
                {project.images && project.images[0] && (
                  <div className="absolute inset-0 w-full h-full">
                    <div className="relative w-full h-full">
                      <Image 
                        src={project.images[0].src}
                        alt={project.images[0].alt || project.title}
                        fill
                        className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index < 3} // Load first few images with priority
                        onError={(e) => {
                          // If image fails to load, show the default SVG placeholder
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-30 z-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <motion.div 
                  className="absolute -bottom-2 -right-2 w-24 h-24 rounded-full bg-gradient-to-r from-purple-500/40 to-violet-500/40 blur-xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 45, 0],
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-bold text-white">{project.title}</h4>
                  {project.isUnderConstruction && (
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>In Progress</span>
                    </span>
                  )}
                </div>
                <p className="text-white/70 mb-4 text-sm">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  {!project.isUnderConstruction ? (
                    <motion.a 
                      href={project.links[0].url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-white/70 hover:text-white text-sm transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => e.stopPropagation()} // Prevent modal from opening
                    >
                      <GlobeIcon className="w-4 h-4" />
                      <span>{project.links[0].text}</span>
                    </motion.a>
                  ) : (
                    <span className="flex items-center gap-1 text-yellow-400/80 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>Coming Soon</span>
                    </span>
                  )}
                  
                  {project.links[1] ? (
                    <motion.a 
                      href={project.links[1].url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-white/70 hover:text-white text-sm transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => e.stopPropagation()} // Prevent modal from opening
                    >
                      <GitHubLogoIcon className="w-4 h-4" />
                      <span>{project.links[1].text}</span>
                    </motion.a>
                  ) : project.isPropriety ? (
                    <span className="flex items-center gap-1 text-amber-400/80 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Proprietary</span>
                    </span>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div 
              className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                ref={modalRef}
                className="bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] relative shadow-2xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                {/* Close button */}
                <button 
                  className="absolute top-4 right-4 z-50 bg-black/40 rounded-full p-2 text-white/80 hover:text-white hover:bg-black/60 transition-all"
                  onClick={closeModal}
                >
                  <Cross2Icon className="w-5 h-5" />
                </button>
                
                <div className="overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {/* Image carousel */}
                  <div className="relative h-72 md:h-96 bg-black">
                    {selectedProject.images.map((image, index) => (
                      <motion.div
                        key={index}
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                        <div className="w-full h-full relative">
                          {/* Try to display the image with Image component */}
                          <div className="relative w-full h-full">
                            <Image 
                              src={image.src}
                              alt={image.alt || selectedProject.title}
                              fill
                              className="object-cover object-center"
                              sizes="(max-width: 768px) 100vw, 800px"
                              priority={index === 0} // Priority loading for first image
                              onError={(e) => {
                                // If image fails to load, show a placeholder gradient
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                          
                          {/* Fallback/placeholder gradient that's visible if image fails to load */}
                          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900/50 to-black/50">
                            <div className="flex flex-col items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/20 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-white/40 text-sm mt-2">{image.alt || `Project image ${index + 1}`}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Image caption */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-center z-20">
                          <p className="text-white/80 text-sm">{image.alt || `Image ${index + 1} of ${selectedProject.images.length}`}</p>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Carousel navigation */}
                    <button
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 rounded-full p-2 text-white/80 hover:text-white hover:bg-black/60 transition-all z-30"
                      onClick={prevImage}
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 rounded-full p-2 text-white/80 hover:text-white hover:bg-black/60 transition-all z-30"
                      onClick={nextImage}
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                    
                    {/* Carousel indicators */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
                      {selectedProject.images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/40'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Project details */}
                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-2xl md:text-3xl font-bold text-white">{selectedProject.title}</h3>
                      {selectedProject.isUnderConstruction && (
                        <span className="px-3 py-1 text-sm rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>Under Construction</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedProject.tags.map((tech, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1 text-sm rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="prose prose-invert max-w-none">
                      <p className="text-white/90 mb-6">
                        {selectedProject.description}
                      </p>
                      
                      <h4 className="text-xl font-bold text-white mt-6 mb-4">Key Features</h4>
                      <ul className="space-y-2 mb-6">
                        {selectedProject.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-white/80">
                            <span className="text-purple-400 mr-2">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <h4 className="text-xl font-bold text-white mt-6 mb-4">Challenges & Solutions</h4>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedProject.challenges.map((challenge, i) => (
                          <p key={i} className="text-white/80 mb-2">• {challenge}</p>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mt-8">
                        {selectedProject.links[1] ? (
                          <motion.a 
                            href={selectedProject.links[1].url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <GitHubLogoIcon className="w-5 h-5" />
                            <span>View Code</span>
                          </motion.a>
                        ) : selectedProject.isPropriety ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-amber-900/20 border border-amber-700/30 rounded-full text-amber-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Proprietary Code</span>
                          </div>
                        ) : null}
                        
                        {selectedProject.links[0] && !selectedProject.isUnderConstruction ? (
                          <motion.a 
                            href={selectedProject.links[0].url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full text-white transition-all hover:from-purple-700 hover:to-violet-700"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <GlobeIcon className="w-5 h-5" />
                            <span>Live Demo</span>
                          </motion.a>
                        ) : selectedProject.isUnderConstruction ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span>Coming Soon</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProjectsSection; 