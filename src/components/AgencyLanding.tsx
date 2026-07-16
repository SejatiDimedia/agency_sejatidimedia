/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Laptop, 
  Smartphone, 
  Cpu, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Send, 
  CheckCircle, 
  ChevronRight, 
  Terminal, 
  Zap, 
  Database, 
  Layers, 
  Code2,
  Lock,
  Workflow,
  Plus,
  Minus,
  Crown,
  Trophy,
  HelpCircle,
  Atom,
  Wind,
  Boxes,
  Flame,
  Cloud,
  Github,
  Network,
  HardDrive,
  Droplet,
  CreditCard
} from 'lucide-react';

const GlintStar = ({ className }: { className?: string }) => (
  <div className={`absolute pointer-events-none select-none ${className}`}>
    {/* Center core glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-theme-accent/25 blur-[4px]" />
    {/* Horizontal ray */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
    {/* Vertical ray */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-[1px] bg-gradient-to-b from-transparent via-white/80 to-transparent" />
  </div>
);

const TECH_ITEMS = [
  { name: 'React', icon: Atom, color: 'text-[#61DAFB] bg-[#61DAFB]/5 border-[#61DAFB]/20' },
  { name: 'Vite', icon: Zap, color: 'text-[#646CFF] bg-[#646CFF]/5 border-[#646CFF]/20' },
  { name: 'TypeScript', icon: Code2, color: 'text-[#3178C6] bg-[#3178C6]/5 border-[#3178C6]/20' },
  { name: 'Next.js', icon: Layers, color: 'text-[#EDEDED] bg-white/5 border-white/20' },
  { name: 'Tailwind CSS', icon: Wind, color: 'text-[#38BDF8] bg-[#38BDF8]/5 border-[#38BDF8]/20' },
  { name: 'Node.js', icon: Cpu, color: 'text-[#339933] bg-[#339933]/5 border-[#339933]/20' },
  { name: 'Go Lang', icon: Terminal, color: 'text-[#00ADD8] bg-[#00ADD8]/5 border-[#00ADD8]/20' },
  { name: 'Python', icon: Terminal, color: 'text-[#3776AB] bg-[#3776AB]/5 border-[#3776AB]/20' },
  { name: 'PostgreSQL', icon: Database, color: 'text-[#4169E1] bg-[#4169E1]/5 border-[#4169E1]/20' },
  { name: 'Docker', icon: Boxes, color: 'text-[#2496ED] bg-[#2496ED]/5 border-[#2496ED]/20' },
  { name: 'Firebase', icon: Flame, color: 'text-[#FFCA28] bg-[#FFCA28]/5 border-[#FFCA28]/20' },
  { name: 'SwiftUI', icon: Smartphone, color: 'text-[#F05138] bg-[#F05138]/5 border-[#F05138]/20' },
  { name: 'Kotlin', icon: Code2, color: 'text-[#7F52FF] bg-[#7F52FF]/5 border-[#7F52FF]/20' },
  { name: 'AWS', icon: Cloud, color: 'text-[#FF9900] bg-[#FF9900]/5 border-[#FF9900]/20' },
  { name: 'Google Cloud', icon: Cloud, color: 'text-[#4285F4] bg-[#4285F4]/5 border-[#4285F4]/20' },
  { name: 'GitHub', icon: Github, color: 'text-[#EDEDED] bg-white/5 border-white/20' },
  { name: 'GraphQL', icon: Network, color: 'text-[#E10098] bg-[#E10098]/5 border-[#E10098]/20' },
  { name: 'Redis', icon: HardDrive, color: 'text-[#DC382D] bg-[#DC382D]/5 border-[#DC382D]/20' },
  { name: 'Drizzle ORM', icon: Droplet, color: 'text-[#C5F74F] bg-[#C5F74F]/5 border-[#C5F74F]/20' },
  { name: 'Stripe API', icon: CreditCard, color: 'text-[#635BFF] bg-[#635BFF]/5 border-[#635BFF]/20' },
];

const FEATURE_ITEMS = [
  {
    num: '01',
    title: 'Easily scalable team',
    description: 'Experience the flexibility and seamless growth of our easily scalable team, adapting to your evolving project requirements effortlessly.'
  },
  {
    num: '02',
    title: 'Recruitment is done for you',
    description: 'Streamline your recruitment process with our expert team, ensuring efficient and hassle-free hiring to meet your talent acquisition needs.'
  },
  {
    num: '03',
    title: 'No need to worry about insurance',
    description: 'Enjoy the advantage of not bearing insurance costs when partnering with us, relieving you of financial obligations and administrative burdens.'
  },
  {
    num: '04',
    title: 'Operational relief',
    description: 'Simplify your operations by entrusting the management of employee benefits to us, freeing up your time and resources for core business priorities.'
  },
  {
    num: '05',
    title: 'No paying for holidays',
    description: 'Maximize cost savings as you eliminate holiday pay expenses by collaborating with us, allowing you to optimize your budget and resources.'
  }
];

export default function AgencyLanding() {
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Spotlight tracking state for the featured service banner
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Quick Estimate simple state
  const [quickService, setQuickService] = useState<'web' | 'mobile' | 'api'>('web');
  const [quickComplexity, setQuickComplexity] = useState<'standard' | 'complex'>('standard');
  const [activeMilestone, setActiveMilestone] = useState<number>(0);

  // FAQ interactive states
  const [activeFaq, setActiveFaq] = useState<number | null>(0); // First item expanded by default
  const [customQuestion, setCustomQuestion] = useState('');
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  // Interactive plan selector and scroll helper
  const selectPlan = (serviceId: string, scopeId: string) => {
    setFormData(prev => ({
      ...prev,
      service: serviceId,
      scope: scopeId
    }));
    scrollToId('contact-section');
  };

  const MILESTONES = [
    {
      step: '01',
      title: 'Discovery',
      tag: 'Phase 1: Specs & Discovery',
      description: 'Our design and engineering services combine creativity and functionality to deliver visually stunning and user-centric solutions that effectively communicate your brand message and align with target metrics.',
      deliverables: ['High-level specification sheets', 'System architecture maps', 'Feasibility reports'],
      codePreview: `{\n  "stage": "DISCOVERY",\n  "status": "COMPLETED",\n  "objectives": ["BRAND_ALIGNMENT", "USER_FLOW_MAPPING"],\n  "metrics": "DEFINED"\n}`
    },
    {
      step: '02',
      title: 'Design',
      tag: 'Phase 2: UI/UX & Prototypes',
      description: 'We translate strategic concepts into interactive Figma prototypes, detailing custom design tokens, typography pairing, unified margin grids, and motion styles for frictionless usage.',
      deliverables: ['Responsive design systems', 'Interactive high-fidelity layouts', 'Motion-style spec sheets'],
      codePreview: `{\n  "stage": "DESIGN",\n  "designTokens": {\n    "fontDisplay": "Space Grotesk",\n    "fontSerif": "Playfair Display",\n    "spacingScale": "Fluid Grid"\n  }\n}`
    },
    {
      step: '03',
      title: 'Development',
      tag: 'Phase 3: Front-End & Core App',
      description: 'We transition design assets into production-ready React/Vite/TypeScript systems. No template generators—we author clean, modern, scalable code tailored for maximum speed.',
      deliverables: ['Sleek functional frontends', 'Custom React hooks & store states', 'Dynamic responsive view shells'],
      codePreview: `const Application = () => {\n  return (\n    <RenderEngine fluid={true}>\n      <ComponentStack optimization="Lighthouse_99+" />\n    </RenderEngine>\n  );\n}`
    },
    {
      step: '04',
      title: 'Testing & Reiterate',
      tag: 'Phase 4: Optimization & QA',
      description: 'Every system is tested across responsive breakpoints, touch inputs, performance loads, and automated unit controllers to guarantee seamless, pixel-perfect execution.',
      deliverables: ['Cross-device compatibility matrices', 'Lighthouse audit checklists', 'Refined UX motion passes'],
      codePreview: `describe("Render Pipeline", () => {\n  it("should paint first content under 150ms", () => {\n    expect(paintTime).toBeLessThan(150);\n  });\n});`
    },
    {
      step: '05',
      title: 'Deployment',
      tag: 'Phase 5: Release & Server Setup',
      description: 'We transfer built assets, database definitions, and server routers to stable, isolated containers. Configured with optimized CDNs, SSL certificates, and custom subdomains.',
      deliverables: ['Dockerized server containers', 'SSL cert & secure DNS routing', 'Lighthouse-optimized asset pipes'],
      codePreview: `npm run build\n# Creating production container: SEJATIDIMEDIA_VM_01...\n# Assets compiled and cached at edge CDN nodes.\n# System is live at 0.0.0.0:3000.`
    },
    {
      step: '06',
      title: 'Maintenance & Support',
      tag: 'Phase 6: Sustained Operations',
      description: 'Continuous monitoring, server health checks, security patches, system updates, and custom scaling tweaks to keep your product stable and optimized at all times.',
      deliverables: ['Continuous telemetry reports', 'Routine database indexing checks', 'Guaranteed uptime contracts'],
      codePreview: `{\n  "stage": "MAINTENANCE",\n  "telemetry": "ACTIVE",\n  "serverStatus": "100%_UPTIME",\n  "alerts": []\n}`
    }
  ];

  // Contact form submission state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Full-Stack Web App',
    scope: 'Medium Scale',
    details: '',
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlightRef.current) return;
    const rect = spotlightRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setFormSubmitted(true);
    setTimeout(() => {
      // Simulate reset after short duration
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        service: 'Full-Stack Web App',
        scope: 'Medium Scale',
        details: '',
      });
    }, 4000);
  };

  const getQuickPrice = () => {
    let base = quickService === 'web' ? 4500 : quickService === 'mobile' ? 6000 : 3200;
    if (quickComplexity === 'complex') base *= 1.8;
    return base.toLocaleString();
  };

  return (
    <div className="space-y-24">
           {/* SECTION 1: BESPOKE SLICED HERO STAGE (AS PER REFERENCE IMAGE) */}
      <section className="relative py-8 md:py-16 min-h-[85vh] flex flex-col justify-center overflow-visible">
        {/* Cinematic Glint Star lens-flares from reference image */}
        <GlintStar className="top-[10%] left-[2%] opacity-60 scale-125 select-none" />
        <GlintStar className="bottom-[22%] right-[12%] opacity-50 scale-150 select-none" />
        <GlintStar className="top-[45%] left-[45%] opacity-35 scale-90 select-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-stretch text-left">
          
          {/* LEFT COLUMN: Main Typography & Bottom Left Stats Card (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-12 min-h-full">
            
            {/* Huge Display Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <h1 className="text-[44px] sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl font-sans font-extrabold tracking-tight leading-[1.08] text-theme-fore">
                Transforming Ideas<br />
                into <span className="font-serif italic font-normal text-theme-accent relative inline-block">Exceptional</span> Digital<br />
                Experience
              </h1>
            </motion.div>

            {/* Bottom Left Card: 320+ Projects */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[340px] p-6 rounded-3xl bg-theme-elevated/70 backdrop-blur-xl border border-theme-border shadow-2xl relative overflow-hidden group hover:border-theme-border-accent transition-all duration-300"
              id="hero-stats-card-left"
            >
              {/* Soft decorative glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-theme-accent-glow rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-3 relative z-10">
                <div className="text-4xl sm:text-5xl font-sans font-black tracking-tight text-theme-accent">
                  320+
                </div>
                <div className="text-sm font-bold text-theme-fore">
                  Project Done
                </div>
                <p className="text-xs text-theme-fore-muted leading-relaxed">
                  From start to finish, every project ends with remarkable results.
                </p>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: Intro Text, Middle Stats Card, Conclusion & Orange CTA Button (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-12 lg:space-y-0 min-h-full lg:py-4">
            
            {/* Top Right Paragraph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:text-right"
            >
              <p className="text-sm text-theme-fore-muted font-medium leading-relaxed max-w-sm lg:ml-auto">
                We design intuitive and visually engaging digital experiences that connect brands with their users.
              </p>
            </motion.div>

            {/* Middle Right Card: 99% Satisfied */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[340px] p-6 rounded-3xl bg-theme-elevated/70 backdrop-blur-xl border border-theme-border shadow-2xl relative overflow-hidden group hover:border-theme-border-accent transition-all duration-300 lg:ml-auto lg:my-6"
              id="hero-stats-card-right"
            >
              {/* Soft decorative glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-theme-accent-glow rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-3 relative z-10">
                <div className="text-4xl sm:text-5xl font-sans font-black tracking-tight text-theme-fore">
                  99%
                </div>
                <div className="text-sm font-bold text-theme-fore">
                  Customer Satisfied
                </div>
                <p className="text-xs text-theme-fore-muted leading-relaxed">
                  100+ big companies trust us to deliver results. Let's create yours next.
                </p>
              </div>
            </motion.div>

            {/* Bottom Right Description & CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 max-w-sm lg:ml-auto"
            >
              <p className="text-xs text-theme-fore-muted leading-relaxed">
                Great design is more than just looking good—it's about creating experiences that engage, convert, and leave a lasting impact.
              </p>
              <div>
                <button
                  onClick={() => scrollToId('contact-section')}
                  className="px-8 py-3.5 rounded-full text-xs font-bold bg-theme-accent hover:bg-theme-accent-bright text-white shadow-lg shadow-theme-accent/10 hover:shadow-theme-accent/20 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
                  id="hero-btn-book-call"
                >
                  <span>Book a Call</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* SECTION 2: THREE CORE PILOT SERVICES (MODERNIZED & PLACED IMMEDIATELY AFTER HERO) */}
      <section id="capabilities-section" className="space-y-12 pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-theme-accent font-semibold">
            <span className="w-6 h-[1px] bg-theme-accent" />
            <span>Capabilities</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7">
              <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.12] text-theme-fore">
                Tailored{' '}
                <span className="bg-gradient-to-r from-theme-accent via-theme-accent-bright to-[#9BC2FA] bg-clip-text text-transparent font-black">
                  Engineering & Architecture
                </span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-xs sm:text-sm text-theme-fore-muted leading-relaxed">
                We don't drag-and-drop templates. We author pixel-perfect, high-performance production code optimized for fluid layout responsiveness and sub-second paint speeds.
              </p>
            </div>
          </div>
        </div>

        {/* High-Fidelity Eye-Catching Modern Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Web App Development */}
          <div className="group relative p-8 rounded-3xl bg-theme-elevated/80 border border-theme-border/80 shadow-2xl hover:border-theme-border-accent/60 transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[380px]">
            {/* Ambient Background Glow Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent-glow/5 rounded-full blur-3xl pointer-events-none group-hover:bg-theme-accent-glow/15 transition-all duration-500" />
            
            {/* Classic Swiss Layering Typography (Absolute Number) */}
            <div className="absolute top-4 right-6 text-7xl font-sans font-black text-theme-fore/[0.03] group-hover:text-theme-accent/[0.06] select-none transition-colors duration-350">
              01
            </div>

            <div className="space-y-6 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-theme-accent/5 border border-theme-border/80 flex items-center justify-center text-theme-accent group-hover:bg-theme-accent group-hover:text-white group-hover:scale-105 transition-all duration-350 shadow-md">
                <Laptop className="w-5 h-5" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl font-sans font-bold text-theme-fore group-hover:text-theme-accent transition-colors duration-300">
                  Web Application Engineering
                </h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed">
                  Bespoke, scalable SaaS architectures, enterprise-grade backends, and highly intuitive management dashboards engineered natively.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-theme-border/40 relative z-10">
              <span className="text-[10px] font-mono text-theme-fore-subtle uppercase tracking-wider block">
                Optimized Stack Integration:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['React / Vite', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'].map((tech) => (
                  <span 
                    key={tech} 
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-theme-base border border-theme-border/60 text-theme-fore-muted hover:border-theme-accent/30 hover:text-theme-accent transition-colors duration-250 cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Mobile App Development */}
          <div className="group relative p-8 rounded-3xl bg-theme-elevated/80 border border-theme-border/80 shadow-2xl hover:border-theme-border-accent/60 transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[380px]">
            {/* Ambient Background Glow Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent-glow/5 rounded-full blur-3xl pointer-events-none group-hover:bg-theme-accent-glow/15 transition-all duration-500" />
            
            {/* Classic Swiss Layering Typography (Absolute Number) */}
            <div className="absolute top-4 right-6 text-7xl font-sans font-black text-theme-fore/[0.03] group-hover:text-theme-accent/[0.06] select-none transition-colors duration-350">
              02
            </div>

            <div className="space-y-6 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-theme-accent/5 border border-theme-border/80 flex items-center justify-center text-theme-accent group-hover:bg-theme-accent group-hover:text-white group-hover:scale-105 transition-all duration-350 shadow-md">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl font-sans font-bold text-theme-fore group-hover:text-theme-accent transition-colors duration-300">
                  Native Mobile Platforms
                </h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed">
                  Stunning, performant iOS and Android mobile experiences compiled directly using raw native environments or unified hybrid code structures.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-theme-border/40 relative z-10">
              <span className="text-[10px] font-mono text-theme-fore-subtle uppercase tracking-wider block">
                Optimized Stack Integration:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['SwiftUI', 'Kotlin Compose', 'Flutter', 'React Native', 'SQLite'].map((tech) => (
                  <span 
                    key={tech} 
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-theme-base border border-theme-border/60 text-theme-fore-muted hover:border-theme-accent/30 hover:text-theme-accent transition-colors duration-250 cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: API & Cloud Integration */}
          <div className="group relative p-8 rounded-3xl bg-theme-elevated/80 border border-theme-border/80 shadow-2xl hover:border-theme-border-accent/60 transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[380px]">
            {/* Ambient Background Glow Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent-glow/5 rounded-full blur-3xl pointer-events-none group-hover:bg-theme-accent-glow/15 transition-all duration-500" />
            
            {/* Classic Swiss Layering Typography (Absolute Number) */}
            <div className="absolute top-4 right-6 text-7xl font-sans font-black text-theme-fore/[0.03] group-hover:text-theme-accent/[0.06] select-none transition-colors duration-350">
              03
            </div>

            <div className="space-y-6 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-theme-accent/5 border border-theme-border/80 flex items-center justify-center text-theme-accent group-hover:bg-theme-accent group-hover:text-white group-hover:scale-105 transition-all duration-350 shadow-md">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl font-sans font-bold text-theme-fore group-hover:text-theme-accent transition-colors duration-300">
                  API & Cloud Orchestration
                </h3>
                <p className="text-xs text-theme-fore-muted leading-relaxed">
                  Resilient backend routers, secure multi-provider OAuth, real-time message brokers, database layers, and high-performance server pipelines.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-theme-border/40 relative z-10">
              <span className="text-[10px] font-mono text-theme-fore-subtle uppercase tracking-wider block">
                Optimized Stack Integration:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Express / Go', 'Firebase Auth', 'GraphQL API', 'Drizzle ORM', 'Stripe API'].map((tech) => (
                  <span 
                    key={tech} 
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-theme-base border border-theme-border/60 text-theme-fore-muted hover:border-theme-accent/30 hover:text-theme-accent transition-colors duration-250 cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* NEW SECTION: TECHNOLOGY (FROM UPLOADED REFERENCE) */}
      <section id="technology-section" className="space-y-12 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Heading with small line label */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-theme-accent font-semibold">
              <span className="w-6 h-[1px] bg-theme-accent" />
              <span>Technology</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-sans font-extrabold tracking-tight leading-[1.15] text-theme-fore">
              Harnessing the power of{' '}
              <span className="bg-gradient-to-r from-theme-accent to-theme-accent-bright bg-clip-text text-transparent font-black">
                Cutting-edge Technology
              </span>{' '}
              to drive Innovation and Transformation
            </h2>
            <p className="text-xs text-theme-fore-muted leading-relaxed max-w-sm">
              We engineer with a premier, battle-tested modern stack optimized for fluid layouts, sub-second execution speeds, and bulletproof security.
            </p>
          </div>

          {/* Right Column: High-fidelity Grid of Technology Cards */}
          <div className="lg:col-span-7">
            <motion.div 
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.04
                  }
                }
              }}
            >
              {TECH_ITEMS.map((tech) => {
                const IconComponent = tech.icon;
                return (
                  <motion.div
                    key={tech.name}
                    variants={{
                      hidden: { opacity: 0, y: 15, scale: 0.93 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1, 
                        transition: { type: 'spring', stiffness: 180, damping: 14 } 
                      }
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -4,
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="p-3 rounded-xl bg-theme-elevated/40 border border-theme-border flex flex-col items-center justify-center text-center gap-2.5 group hover:border-theme-border-accent/60 hover:bg-theme-elevated/80 transition-all duration-300 relative overflow-hidden cursor-pointer select-none shadow-sm"
                  >
                    {/* Miniature decorative accent dot */}
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-theme-accent/15 group-hover:bg-theme-accent group-hover:scale-125 transition-all duration-300" />
                    
                    {/* Circle Brand Icon representation */}
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 ${tech.color} group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-theme-accent/5`}>
                      <IconComponent className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                    </div>
                    <span className="text-[10px] font-mono text-theme-fore font-semibold tracking-tight group-hover:text-theme-accent transition-colors duration-200">
                      {tech.name}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

        </div>
      </section>



      {/* SECTION 3: DELIVERING REAL RESULTS */}
      <section id="preview-section" className="space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-theme-accent font-semibold">
            <span className="w-6 h-[1px] bg-theme-accent" />
            <span>Delivering Real Results</span>
            <span className="w-6 h-[1px] bg-theme-accent" />
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.12] text-theme-fore">
            Engineering Measurable Success
          </h2>
          <p className="text-xs sm:text-sm text-theme-fore-muted leading-relaxed max-w-2xl mx-auto">
            Our strategies are designed to drive measurable success. Here's what we've achieved for our clients through clean, custom-crafted digital engineering.
          </p>
        </div>

        {/* Staggered Aspect-Ratio Responsive Grid of Results Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-6">
          {[
            {
              stat: '300%',
              label: 'Increase in Organic Traffic',
              desc: 'Sub-second speed optimization and clean semantic SEO structure elevate search indexing instantly.',
              img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
              imgHeight: 'h-[200px] lg:h-[230px]',
              alt: 'Organic Traffic Team collaborating'
            },
            {
              stat: '2X',
              label: 'Return on Investment',
              desc: 'Custom hand-compiled systems save ongoing license costs and run flawlessly without heavy plug-in bloat.',
              img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
              imgHeight: 'h-[240px] lg:h-[270px]',
              alt: 'System analysis dashboard return'
            },
            {
              stat: '500+',
              label: 'Successful Projects',
              desc: 'Robust production-grade code deployed across private servers, SaaS dashboards, and native mobile hubs.',
              img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
              imgHeight: 'h-[180px] lg:h-[210px]',
              alt: 'System architecture demonstration'
            },
            {
              stat: '120%',
              label: 'Growth in Qualified Leads',
              desc: 'Frictionless visual entry funnels and sub-pixel typography tracking capture user interest to convert clicks.',
              img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
              imgHeight: 'h-[220px] lg:h-[250px]',
              alt: 'Client growth celebration'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="group flex flex-col justify-between space-y-5 p-5 rounded-3xl bg-theme-elevated/50 border border-theme-border hover:border-theme-border-accent/40 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Image Block with Custom Staggered Heights */}
              <div className={`w-full ${item.imgHeight} rounded-2xl overflow-hidden relative border border-theme-border/60 shadow-md`}>
                <img
                  src={item.img}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Text Block Aligned Elegantly at Bottom */}
              <div className="space-y-2.5 pt-2">
                <div className="bg-gradient-to-r from-theme-accent via-[#6AA0F2] to-[#9BC2FA] bg-clip-text text-transparent font-sans font-black text-4xl sm:text-5xl lg:text-5.5xl tracking-tighter leading-none select-none">
                  {item.stat}
                </div>
                <h4 className="text-xs sm:text-sm font-sans font-extrabold text-theme-fore leading-snug">
                  {item.label}
                </h4>
                <p className="text-[11px] text-theme-fore-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3.5: FLEXIBLE PRICING PLANS */}
      <section id="pricing-section" className="space-y-16 pt-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-theme-accent font-semibold">
            <span className="w-6 h-[1px] bg-theme-accent" />
            <span>Pricing</span>
            <span className="w-6 h-[1px] bg-theme-accent" />
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.12] text-theme-fore">
            Flexible Pricing Plans
          </h2>
          <p className="text-xs sm:text-sm text-theme-fore-muted leading-relaxed max-w-2xl mx-auto">
            Choose a plan that fits your business needs and start growing today. Interactive setups designed to match your scale.
          </p>
        </div>

        {/* 3-Column Beautiful Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto pt-4">
          
          {/* Card 1: Basic Plan */}
          <div className="p-7 rounded-3xl bg-theme-elevated/75 border border-theme-border hover:border-theme-border-accent/35 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-8 relative group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-theme-fore-subtle font-bold">Entry Growth</span>
                  <h3 className="text-lg font-sans font-extrabold text-theme-fore">Basic Plan</h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-theme-accent/5 border border-theme-border flex items-center justify-center text-theme-accent">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] text-theme-fore-muted leading-relaxed">
                Choose a plan that fits your business goals and starts your growth journey.
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-sans font-black text-theme-fore tracking-tight">$299</span>
                <span className="text-[10px] font-mono text-theme-fore-muted uppercase">/ month</span>
              </div>
              <button
                onClick={() => selectPlan('Full-Stack Web App', 'SaaS MVP (Fast Turnaround)')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border border-theme-border hover:border-theme-border-accent hover:bg-theme-accent-glow text-theme-accent transition-all duration-200 cursor-pointer text-center select-none"
              >
                Get Started
              </button>
            </div>
            <div className="space-y-3.5 pt-6 border-t border-theme-border/50">
              <span className="text-[9px] font-mono uppercase tracking-wider text-theme-fore-subtle block font-bold">Includes:</span>
              <ul className="space-y-2.5 text-xs">
                {[
                  'SEO Audit & Setup',
                  'Keyword Research',
                  'Competitor Analysis',
                  'Monthly Performance Report',
                  'Basic Support'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-theme-fore-muted">
                    <Check className="w-3.5 h-3.5 text-theme-accent flex-shrink-0" />
                    <span className="text-[11px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 2: Premium Plan (Highly highlighted, standing out) */}
          <div className="p-7 rounded-3xl bg-[#0F1115] dark:bg-[#0A0C10] text-white border-2 border-theme-accent hover:shadow-[0_0_50px_-10px_rgba(74,133,217,0.35)] transition-all duration-300 flex flex-col justify-between space-y-8 relative lg:scale-105 z-10 overflow-hidden">
            {/* Luminous dynamic glow mesh background for highlighted premium feel */}
            <div className="absolute inset-0 bg-[radial-gradient(350px_circle_at_top_right,rgba(74,133,217,0.18),transparent_80%)] pointer-events-none" />
            <div className="absolute top-2 right-2.5 bg-theme-accent/25 border border-theme-accent/40 text-theme-accent text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Most Popular
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-theme-accent font-bold">Unmatched Scale</span>
                  <h3 className="text-lg font-sans font-extrabold text-white">Premium Plan</h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-theme-accent/20 border border-theme-accent/30 flex items-center justify-center text-theme-accent">
                  <Crown className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Flexible plans designed to help you scale faster, capture market Share, and maximize performance.
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-sans font-black text-white tracking-tight">$999</span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase">/ month</span>
              </div>
              <button
                onClick={() => selectPlan('Comprehensive Hybrid Pipeline', 'High-Scale Custom Architecture')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-theme-accent hover:bg-theme-accent-bright text-white shadow-lg shadow-theme-accent/20 transition-all duration-200 cursor-pointer text-center select-none"
              >
                Contact Us
              </button>
            </div>
            <div className="space-y-3.5 pt-6 border-t border-zinc-800 relative z-10">
              <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">Includes:</span>
              <ul className="space-y-2.5 text-xs">
                {[
                  'Complete Marketing Strategy',
                  'Paid Ads Management',
                  'Advanced Analytics Integration',
                  'Dedicated Account Manager',
                  'Continuous System Optimization'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-theme-accent flex-shrink-0" />
                    <span className="text-[11px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 3: Standard Plan */}
          <div className="p-7 rounded-3xl bg-theme-elevated/75 border border-theme-border hover:border-theme-border-accent/35 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-8 relative group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-theme-fore-subtle font-bold">Flexible Growth</span>
                  <h3 className="text-lg font-sans font-extrabold text-theme-fore">Standard Plan</h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-theme-accent/5 border border-theme-border flex items-center justify-center text-theme-accent">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] text-theme-fore-muted leading-relaxed">
                Simple pricing structured to power every developmental stage of your growing business.
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-sans font-black text-theme-fore tracking-tight">$599</span>
                <span className="text-[10px] font-mono text-theme-fore-muted uppercase">/ month</span>
              </div>
              <button
                onClick={() => selectPlan('Native iOS/Android App', 'Medium Scale Production')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border border-theme-border hover:border-theme-border-accent hover:bg-theme-accent-glow text-theme-accent transition-all duration-200 cursor-pointer text-center select-none"
              >
                Start Now
              </button>
            </div>
            <div className="space-y-3.5 pt-6 border-t border-theme-border/50">
              <span className="text-[9px] font-mono uppercase tracking-wider text-theme-fore-subtle block font-bold">Includes:</span>
              <ul className="space-y-2.5 text-xs">
                {[
                  'Full SEO Optimization',
                  'In-depth Content Strategy',
                  'Premium Link Building',
                  'Monthly Analytics & Reporting',
                  'Priority Dedicated Support'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-theme-fore-muted">
                    <Check className="w-3.5 h-3.5 text-theme-accent flex-shrink-0" />
                    <span className="text-[11px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3.8: FREQUENTLY ASKED QUESTIONS */}
      <section id="faq-section" className="space-y-16 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Any Question Box */}
          <div className="lg:col-span-5 space-y-7 lg:sticky lg:top-24">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-theme-accent font-semibold">
                <span className="w-6 h-[1px] bg-theme-accent" />
                <span>FAQ</span>
              </div>
              <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.12] text-theme-fore">
                Frequently Asked Questions
              </h2>
            </div>

            {/* Any Question Form widget */}
            <div className="p-6 sm:p-7 rounded-3xl bg-theme-surface/75 backdrop-blur-md border border-theme-border space-y-5 shadow-xl relative overflow-hidden">
              <div className="space-y-1">
                <h4 className="text-sm font-sans font-bold text-theme-fore">Any Question?</h4>
                <p className="text-[11px] text-theme-fore-muted leading-relaxed">
                  Feel free to ask anything about feedback, custom setups, or special features.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {!questionSubmitted ? (
                  <motion.form
                    key="faq-input-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!customQuestion.trim()) return;
                      setQuestionSubmitted(true);
                    }}
                    className="space-y-3"
                  >
                    <label htmlFor="custom-q-input" className="text-[9px] font-mono uppercase tracking-wider text-theme-fore-subtle font-bold">
                      Let me know.
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="custom-q-input"
                        type="text"
                        required
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                        placeholder="Enter Here..."
                        className="w-full pr-12 pl-4 py-3 text-xs rounded-xl bg-theme-elevated border border-theme-border text-theme-fore placeholder-theme-fore-subtle focus:outline-none focus:border-theme-border-accent focus:ring-1 focus:ring-theme-border-accent hover:border-theme-border-hover transition-all duration-300 shadow-sm"
                      />
                      <button
                        type="submit"
                        className="absolute right-1.5 p-2 bg-theme-accent hover:bg-theme-accent-bright text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center shadow-md active:scale-95"
                        aria-label="Submit question"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="faq-success-state"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3"
                  >
                    <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto" />
                    <div className="space-y-1">
                      <h5 className="text-[11px] font-bold text-theme-fore">Question Received!</h5>
                      <p className="text-[10px] text-theme-fore-muted leading-relaxed">
                        Thank you. We'll examine your query and align a custom response in <span className="font-semibold text-theme-accent">12 hours</span>.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setQuestionSubmitted(false);
                        setCustomQuestion('');
                      }}
                      className="text-[9px] font-mono uppercase tracking-wider text-theme-accent hover:underline cursor-pointer"
                    >
                      Ask another question
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decorative floating help graphics */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-theme-accent-glow rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Custom Stateful Interactive Accordion */}
          <div className="lg:col-span-7 space-y-4">
            {[
              {
                q: "How will the payment be collected?",
                a: "Our platform supports secure bank wire transfers, automated stripe payouts, or milestone escrow. Depending on your select plan, services are billed transparently on a recurring 30-day index cycle."
              },
              {
                q: "Do you guarantee results?",
                a: "Yes, we guarantee complete sub-pixel visual fidelity, extreme performance optimization ratings (99+ score benchmarks), and absolute security compliance. Every build is verified through thorough QA checks."
              },
              {
                q: "What industries do you work with?",
                a: "We work with tech SaaS platforms, progressive design groups, marketing agencies, modern e-commerce systems, and direct creators seeking high-end tailored software architecture."
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely. You can modify your tier, upgrade scope limits, or pause/cancel your billing cycles at any time. We support friction-free handovers with zero long-term locks."
              },
              {
                q: "How does the GoTo Meeting free trial work?",
                a: "Before signing any contracts, we set up a complimentary 30-minute system consultation. We align on your core project milestones, wireframes, database schemas, and expected deployment guidelines."
              }
            ].map((faq, idx) => {
              const isExpanded = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 ${
                    isExpanded 
                      ? 'bg-theme-elevated border-theme-border-accent shadow-lg shadow-theme-accent-glow/5' 
                      : 'bg-theme-elevated/40 border-theme-border hover:border-theme-border-hover hover:bg-theme-elevated/70'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isExpanded ? null : idx)}
                    className="w-full px-5 py-4 text-left font-sans font-extrabold text-xs sm:text-sm text-theme-fore flex items-center justify-between gap-4 cursor-pointer select-none"
                    aria-expanded={isExpanded}
                  >
                    <span>{faq.q}</span>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                      isExpanded ? 'bg-theme-accent text-white' : 'bg-theme-surface text-theme-fore-muted'
                    }`}>
                      {isExpanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-[11px] sm:text-xs text-theme-fore-muted leading-relaxed border-t border-theme-border/50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 4: THE PROCESSES LOOP (FROM UPLOADED REFERENCE) */}
      <section id="methodology-section" className="space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-theme-accent font-semibold">
            <span className="w-6 h-[1px] bg-theme-accent" />
            <span>Processes</span>
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.15] text-theme-fore max-w-2xl">
            Providing{' '}
            <span className="bg-gradient-to-r from-theme-accent via-[#6AA0F2] to-[#9BC2FA] bg-clip-text text-transparent font-black">
              Comprehensive Solutions
            </span>{' '}
            Tailored to Your Needs.
          </h2>
        </div>

        {/* Dynamic Split Layout matching reference block 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Clean vertical list with line delimiters (5 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            {MILESTONES.map((milestone, idx) => {
              const isActive = activeMilestone === idx;
              return (
                <button
                  key={milestone.step}
                  onClick={() => setActiveMilestone(idx)}
                  className={`w-full py-4 text-left cursor-pointer border-b border-theme-border/60 transition-all duration-300 flex items-center justify-between group ${
                    isActive ? 'border-theme-accent' : 'hover:border-theme-border-hover'
                  }`}
                  id={`processes-step-${milestone.step}`}
                >
                  <span className={`text-base font-sans font-bold transition-all duration-300 ${
                    isActive 
                      ? 'text-theme-accent translate-x-1.5' 
                      : 'text-theme-fore/60 group-hover:text-theme-fore group-hover:translate-x-1'
                  }`}>
                    {milestone.title}
                  </span>
                  <span className={`text-xs font-mono font-bold transition-colors ${
                    isActive ? 'text-theme-accent' : 'text-theme-fore-subtle'
                  }`}>
                    {milestone.step}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Giant display digits details (6 cols) */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-theme-elevated border border-theme-border shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-theme-accent-glow rounded-full blur-3xl pointer-events-none opacity-40" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeMilestone}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 flex-grow flex flex-col justify-between relative z-10"
              >
                <div className="space-y-6">
                  {/* Giant floating number digits */}
                  <div className="text-8xl sm:text-9xl font-sans font-black tracking-tighter text-gradient leading-none bg-gradient-to-b from-theme-accent to-transparent bg-clip-text text-transparent select-none opacity-70">
                    {MILESTONES[activeMilestone].step}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-sans font-bold text-theme-fore">
                      {MILESTONES[activeMilestone].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-theme-fore-muted leading-relaxed max-w-lg">
                      {MILESTONES[activeMilestone].description}
                    </p>
                  </div>
                </div>

                {/* White/Dark Solid Rectangle Button 'GET STARTED' */}
                <div>
                  <button
                    onClick={() => scrollToId('contact-section')}
                    className="px-6 py-3 bg-theme-fore text-theme-base dark:bg-white dark:text-black hover:bg-theme-accent hover:text-white dark:hover:bg-theme-accent dark:hover:text-white rounded-lg text-xs font-sans font-extrabold tracking-widest uppercase transition-all duration-300 shadow-lg cursor-pointer flex items-center gap-2 group/btn"
                    id={`processes-get-started-${MILESTONES[activeMilestone].step}`}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* SECTION 4.5: THE FEATURES SECTION (FROM UPLOADED REFERENCE) */}
      <section id="features-section" className="space-y-12 pt-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-theme-accent font-semibold">
            <span className="w-6 h-[1px] bg-theme-accent" />
            <span>Features</span>
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.15] text-theme-fore max-w-3xl">
            We Offer Including{' '}
            <span className="bg-gradient-to-r from-theme-accent via-[#6AA0F2] to-[#9BC2FA] bg-clip-text text-transparent font-black">
              Expertise, Reliability, and Exceptional Customer Satisfaction.
            </span>
          </h2>
        </div>

        {/* 2-Column Bento Grid styled precisely like Section 3 of the uploaded reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURE_ITEMS.map((item, idx) => {
            const isFullWidth = idx === FEATURE_ITEMS.length - 1;
            return (
              <div
                key={item.num}
                className={`p-6 rounded-2xl bg-theme-elevated border border-theme-border flex flex-col sm:flex-row gap-5 items-start group hover:border-theme-border-accent hover:shadow-xl transition-all duration-300 ${
                  isFullWidth ? 'md:col-span-2' : ''
                }`}
              >
                {/* Number digit leading */}
                <div className="text-4xl sm:text-5xl font-sans font-extrabold tracking-tighter text-theme-accent/60 dark:text-theme-accent/40 select-none flex-shrink-0">
                  {item.num}
                </div>

                {/* Text Block */}
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-sans font-bold text-theme-fore group-hover:text-theme-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-theme-fore-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: THE SEJATIDIMEDIA DIRECT CONSOLE (CONTACT FORM) */}
      <section id="contact-section" className="p-8 md:p-14 rounded-3xl bg-theme-elevated border border-theme-border shadow-2xl space-y-8 relative overflow-hidden">
        {/* Supporting decorative premium ambient background spotlight */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-theme-accent-glow/50 rounded-full blur-[130px] pointer-events-none opacity-40 dark:opacity-60" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-theme-accent-glow/25 rounded-full blur-[100px] pointer-events-none opacity-30" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          
          {/* Left Block: Information, Value Prop, Active Slots Indicator */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[9px] font-mono bg-theme-accent-glow text-theme-accent border border-theme-border-accent/40 px-3 py-1 rounded-full uppercase font-bold tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Secure Premium Slot</span>
                </span>
                <span className="text-[9px] font-mono bg-theme-surface text-theme-fore-muted border border-theme-border px-2.5 py-1 rounded-full uppercase font-semibold">
                  2 Available Slots Left This Quarter
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.12] text-theme-fore">
                Let's engineer something{' '}
                <span className="bg-gradient-to-r from-theme-accent via-theme-accent-bright to-[#9BC2FA] bg-clip-text text-transparent font-black italic">
                  Exceptional
                </span>{' '}
                together.
              </h2>
              
              <p className="text-xs sm:text-sm text-theme-fore-muted leading-relaxed max-w-md">
                We accept a strictly limited cohort of premium clients each quarter to guarantee sub-second delivery pipelines, bespoke structural layouts, and developer-direct execution. 
              </p>

              <div className="space-y-4 pt-6 border-t border-theme-border/50 max-w-sm">
                <div className="flex items-start gap-3.5 group">
                  <div className="w-8 h-8 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-accent group-hover:border-theme-border-accent transition-colors duration-300 shadow-md">
                    <Workflow className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-sans font-bold text-theme-fore">Interactive Sprint Sandboxes</h4>
                    <p className="text-[11px] text-theme-fore-muted leading-relaxed">Weekly live staging build releases directly to your private preview terminal.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 group">
                  <div className="w-8 h-8 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-accent group-hover:border-theme-border-accent transition-colors duration-300 shadow-md">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-sans font-bold text-theme-fore">Absolute IP & Code Handovers</h4>
                    <p className="text-[11px] text-theme-fore-muted leading-relaxed">100% intellectual copyright assignment, fully clean TypeScript commits, and stable deployment guides.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick tech tagline metadata at bottom of left column */}
            <div className="pt-6 border-t border-theme-border/30 hidden lg:block text-[10px] font-mono text-theme-fore-subtle flex items-center gap-1.5">
              <span>EST. RESPONSE DELAY &lt; 12 HOURS • SECURE SHA-256 PIPELINE</span>
            </div>
          </div>

          {/* Right Block: High-Fidelity Interactive Form Widget */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-theme-surface/75 backdrop-blur-md border border-theme-border/80 shadow-2xl relative">
            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  onSubmit={handleFormSubmit}
                  className="space-y-6"
                  id="contact-form-element"
                >
                  
                  {/* Name and Email Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-theme-fore-muted uppercase font-bold tracking-wider" htmlFor="form-name">
                        Your Name
                      </label>
                      <input
                        id="form-name"
                        type="text"
                        required
                        placeholder="e.g. Raden"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 text-xs rounded-xl bg-theme-elevated border border-theme-border text-theme-fore placeholder-theme-fore-subtle focus:outline-none focus:border-theme-border-accent focus:ring-1 focus:ring-theme-border-accent hover:border-theme-border-hover transition-all duration-300 shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-theme-fore-muted uppercase font-bold tracking-wider" htmlFor="form-email">
                        Email Address
                      </label>
                      <input
                        id="form-email"
                        type="email"
                        required
                        placeholder="e.g. contact@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 text-xs rounded-xl bg-theme-elevated border border-theme-border text-theme-fore placeholder-theme-fore-subtle focus:outline-none focus:border-theme-border-accent focus:ring-1 focus:ring-theme-border-accent hover:border-theme-border-hover transition-all duration-300 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* HIGH-FIDELITY: INTERACTIVE SERVICE SELECTOR CARDS */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-mono text-theme-fore-muted uppercase font-bold tracking-wider block">
                      Primary Service Desired
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'Full-Stack Web App', label: 'Web Application Development', desc: 'SaaS Platforms & Dashboards' },
                        { id: 'Native iOS/Android App', label: 'Native Mobile Apps', desc: 'SwiftUI, Kotlin, Flutter' },
                        { id: 'API Gateway & Cloud Integration', label: 'Cloud API & Integration', desc: 'Express, Go, Databases & OAuth' },
                        { id: 'Comprehensive Hybrid Pipeline', label: 'Full-Scale Enterprise Bundle', desc: 'End-to-End System Design' }
                      ].map((svc) => {
                        const isSelected = formData.service === svc.id;
                        return (
                          <button
                            type="button"
                            key={svc.id}
                            onClick={() => setFormData({ ...formData, service: svc.id })}
                            className={`p-3 text-left rounded-xl border text-xs transition-all duration-300 cursor-pointer flex flex-col justify-between h-[85px] relative overflow-hidden group select-none ${
                              isSelected
                                ? 'bg-theme-accent-glow/55 border-theme-border-accent shadow-md shadow-theme-accent/5'
                                : 'bg-theme-elevated/60 border-theme-border hover:border-theme-border-hover hover:bg-theme-elevated'
                            }`}
                          >
                            <span className={`font-sans font-bold transition-colors duration-200 block ${
                              isSelected ? 'text-theme-accent' : 'text-theme-fore'
                            }`}>
                              {svc.label}
                            </span>
                            <span className="text-[10px] text-theme-fore-muted block truncate">
                              {svc.desc}
                            </span>
                            
                            {/* Selected Active Indicator Dot */}
                            {isSelected && (
                              <div className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* HIGH-FIDELITY: INTERACTIVE SCOPE SELECTOR TABS */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-mono text-theme-fore-muted uppercase font-bold tracking-wider block">
                      Project Scope Size
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'SaaS MVP (Fast Turnaround)', label: 'MVP Prototype', desc: 'Fast turnaround setup' },
                        { id: 'Medium Scale Production', label: 'Production Growth', desc: 'Standard scalable app' },
                        { id: 'High-Scale Custom Architecture', label: 'Enterprise Elite', desc: 'Bespoke large-scale system' }
                      ].map((sc) => {
                        const isSelected = formData.scope === sc.id;
                        return (
                          <button
                            type="button"
                            key={sc.id}
                            onClick={() => setFormData({ ...formData, scope: sc.id })}
                            className={`p-3 text-left rounded-xl border text-xs transition-all duration-300 cursor-pointer flex flex-col justify-between h-[75px] select-none ${
                              isSelected
                                ? 'bg-theme-accent-glow/55 border-theme-border-accent shadow-md shadow-theme-accent/5'
                                : 'bg-theme-elevated/60 border-theme-border hover:border-theme-border-hover hover:bg-theme-elevated'
                            }`}
                          >
                            <span className={`font-sans font-bold transition-colors duration-200 block ${
                              isSelected ? 'text-theme-accent' : 'text-theme-fore'
                            }`}>
                              {sc.label}
                            </span>
                            <span className="text-[9px] text-theme-fore-muted block truncate">
                              {sc.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-theme-fore-muted uppercase font-bold tracking-wider" htmlFor="form-details">
                      Project Details & Goals
                    </label>
                    <textarea
                      id="form-details"
                      rows={3}
                      placeholder="Briefly describe your feature scope, stack constraints, or goals..."
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full px-4 py-3 text-xs rounded-xl bg-theme-elevated border border-theme-border text-theme-fore placeholder-theme-fore-subtle focus:outline-none focus:border-theme-border-accent focus:ring-1 focus:ring-theme-border-accent hover:border-theme-border-hover transition-all duration-300 resize-none shadow-sm"
                    />
                  </div>

                  {/* Dispatch CTA Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-theme-accent hover:bg-theme-accent-bright text-white text-xs font-sans font-extrabold tracking-widest uppercase shadow-lg shadow-theme-accent/10 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 group/submit"
                    id="btn-submit-contact"
                  >
                    <Send className="w-4 h-4 group-hover/submit:translate-x-1 group-hover/submit:-translate-y-0.5 transition-transform" />
                    <span>Launch Blueprint Query</span>
                  </button>

                </motion.form>
              ) : (
                <motion.div
                  key="form-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-16 flex flex-col items-center justify-center text-center space-y-5"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/5">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-sans font-bold text-theme-fore">Blueprint Safely Received!</h4>
                    <p className="text-xs text-theme-fore-muted max-w-sm leading-relaxed mx-auto">
                      Your technical parameters were integrated directly into the SejatiDImedia rendering queue. We are auditing your stack specs and will contact you within 12 hours.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-theme-fore-subtle bg-theme-elevated/80 border border-theme-border px-3.5 py-2 rounded-lg">
                    RENDER NODE: {Math.random().toString(36).substring(2, 9).toUpperCase()} • SECURE STATUS: HIGH_PRIORITY
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

    </div>
  );
}
