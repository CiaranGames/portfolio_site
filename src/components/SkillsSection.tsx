'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

// Define skill categories and technologies with more meaningful descriptions and experience indicators
const skills = [
  {
    category: "Frontend",
    icon: "💻",
    description: "Building responsive, accessible, and performant user interfaces",
    technologies: [
      { 
        name: "React", 
        icon: "⚛️",
        level: "Advanced",
        description: "Component architecture, hooks, context, Redux, performance optimization"
      },
      { 
        name: "TypeScript", 
        icon: "🔷",
        level: "Advanced",
        description: "Type safety, interfaces, generics, utility types"
      },
      { 
        name: "Next.js", 
        icon: "▲",
        level: "Advanced",
        description: "SSR, ISR, API routes, middleware, app router"
      },
      { 
        name: "HTML/CSS", 
        icon: "🎨",
        level: "Advanced",
        description: "Semantic markup, CSS Grid, Flexbox, animations, responsive design"
      },
      { 
        name: "Tailwind CSS", 
        icon: "🌊",
        level: "Advanced",
        description: "Utility-first workflow, custom theming, component patterns"
      },
      { 
        name: "JavaScript", 
        icon: "🟨",
        level: "Advanced",
        description: "ES6+, async/await, functional programming, browser APIs"
      },
      { 
        name: "Vue.js", 
        icon: "🟢",
        level: "Intermediate",
        description: "Component composition, Vue Router, Vuex"
      },
    ]
  },
  {
    category: "Backend",
    icon: "🔧",
    description: "Creating robust APIs and server-side systems",
    technologies: [
      { 
        name: "Node.js", 
        icon: "🟢",
        level: "Advanced",
        description: "Event loop, streams, async patterns, performance tuning"
      },
      { 
        name: "Express", 
        icon: "🚂",
        level: "Advanced",
        description: "RESTful routing, middleware, authentication, error handling"
      },
      { 
        name: "MongoDB", 
        icon: "🍃",
        level: "Intermediate",
        description: "Schema design, aggregations, indexes, transactions"
      },
      { 
        name: "RESTful APIs", 
        icon: "🔄",
        level: "Advanced",
        description: "Resource modeling, status codes, versioning, documentation"
      },
      { 
        name: "NGINX", 
        icon: "🌐",
        level: "Intermediate",
        description: "Reverse proxy, load balancer, caching, SSL/TLS"
      },
    ]
  },
  {
    category: "DevOps & Tools",
    icon: "🛠️",
    description: "Streamlining development workflow and deployment",
    technologies: [
      { 
        name: "Git/GitHub", 
        icon: "🔄",
        level: "Advanced",
        description: "Branching strategies, PR workflow, CI integration, conflict resolution"
      },
      { 
        name: "Testing", 
        icon: "🧪",
        level: "Advanced",
        description: "Unit testing, integration testing, E2E with Jest, React Testing Library, Cypress"
      },
      { 
        name: "CI/CD", 
        icon: "🔄",
        level: "Intermediate",
        description: "GitHub Actions, automated testing, deployment pipelines"
      },
      { 
        name: "Agile/Scrum", 
        icon: "🔄",
        level: "Advanced",
        description: "Sprint planning, story points, retrospectives, continuous improvement"
      },
    ]
  }
];

// Define an interface for the skill level badge colors
interface SkillLevelColors {
  [key: string]: {
    bg: string;
    text: string;
    border: string;
  }
}

const skillLevelColors: SkillLevelColors = {
  "Beginner": {
    bg: "bg-blue-500/10",
    text: "text-blue-300",
    border: "border-blue-500/30"
  },
  "Intermediate": {
    bg: "bg-green-500/10",
    text: "text-green-300",
    border: "border-green-500/30"
  },
  "Advanced": {
    bg: "bg-purple-500/10",
    text: "text-purple-300",
    border: "border-purple-500/30"
  }
};

const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  // Filter displayed technologies based on selected category
  const filteredSkills = activeCategory === "All" 
    ? skills 
    : skills.filter(group => group.category === activeCategory);

  return (
    <section id="skills" className="py-20 relative overflow-hidden" style={{ backgroundColor: 'var(--nav-bg)' }}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-transparent top-20 -left-48 blur-3xl"></div>
        <div className="absolute w-96 h-96 rounded-full bg-gradient-to-l from-green-500/10 to-transparent bottom-20 -right-48 blur-3xl"></div>
        <div className="absolute w-96 h-96 rounded-full bg-gradient-to-t from-blue-500/10 to-transparent top-60 -right-28 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className="text-lg font-mono mb-2" style={{ color: 'var(--accent-primary)' }}>Tech Ecosystem</h2>
          <h3 className="text-4xl font-bold text-white mb-6">My Developer Toolkit</h3>
          <p className="text-white/70 max-w-2xl mx-auto">
            These are the technologies and tools I use to bring ideas to life. My approach focuses on
            selecting the right tool for each specific problem rather than using a one-size-fits-all solution.
          </p>
        </motion.div>
        
        {/* Category filter tabs */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <button 
            className={`px-5 py-2 rounded-full transition-all duration-300 ${activeCategory === "All" 
              ? "bg-white/10 text-white" 
              : "bg-transparent text-white/60 hover:text-white"}`}
            onClick={() => setActiveCategory("All")}
          >
            All
          </button>
          {skills.map(group => (
            <button 
              key={group.category}
              className={`px-5 py-2 rounded-full transition-all duration-300 ${activeCategory === group.category 
                ? "bg-white/10 text-white" 
                : "bg-transparent text-white/60 hover:text-white"}`}
              onClick={() => setActiveCategory(group.category)}
            >
              <span className="mr-2">{group.icon}</span>
              {group.category}
            </button>
          ))}
        </motion.div>
        
        {/* Skills display */}
        {filteredSkills.map((skillGroup, groupIndex) => (
          <motion.div 
            key={skillGroup.category}
            className="mb-16 last:mb-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
            viewport={{ once: true, amount: 0.1 }}
          >
            {activeCategory === "All" && (
              <motion.div 
                className="mb-6 flex items-center"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                <span className="text-3xl mr-3">{skillGroup.icon}</span>
                <div>
                  <h4 className="text-2xl font-bold text-white">{skillGroup.category}</h4>
                  <p className="text-white/70">{skillGroup.description}</p>
                </div>
              </motion.div>
            )}
            
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
            >
              {skillGroup.technologies.map((tech) => (
                <motion.div 
                  key={tech.name}
                  variants={item}
                  className={`rounded-xl p-5 relative overflow-hidden backdrop-blur-sm transition-all duration-300 ${hoveredTech === tech.name 
                    ? "bg-white/10 shadow-lg" 
                    : "bg-white/5 hover:bg-white/10"}`}
                  onMouseEnter={() => setHoveredTech(tech.name)}
                  onMouseLeave={() => setHoveredTech(null)}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{tech.icon}</span>
                      <h5 className="text-lg font-bold text-white">{tech.name}</h5>
                    </div>
                    <span 
                      className={`text-xs font-medium px-2 py-1 rounded-full border ${
                        skillLevelColors[tech.level].bg
                      } ${skillLevelColors[tech.level].text} ${
                        skillLevelColors[tech.level].border
                      }`}
                    >
                      {tech.level}
                    </span>
                  </div>
                  
                  <p className="text-white/70 text-sm">{tech.description}</p>
                  
                  {/* Visual indicator of tech relationship */}
                  {hoveredTech === tech.name && (
                    <motion.div 
                      className="absolute inset-0 -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full -mr-10 -mt-10"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full -ml-8 -mb-8"></div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
        
        <motion.div 
          className="mt-16 text-center bg-white/5 backdrop-blur-sm p-6 rounded-xl max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <h4 className="text-xl font-bold text-white mb-3">Continuous Learning</h4>
          <p className="text-white/70">
            Beyond these core technologies, I&apos;m constantly exploring new tools and approaches.
            My current learning focus includes Machine Learning, advanced React Server Components patterns, 
            and exploring A/B testing in e-commerce.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection; 