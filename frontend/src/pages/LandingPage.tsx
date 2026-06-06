import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, BrainCircuit, Activity, Zap, Network, ShieldAlert, HeartPulse, LocateFixed, MessageSquareWarning, Flame, Crosshair, Cpu, Radio, GitCommit, Thermometer, TrendingUp, Megaphone, AlertCircle } from 'lucide-react';
import { impactMetrics } from '../data/historicalCases';

const LandingPage = () => {
  const navigate = useNavigate();

  // Simple scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.classList.remove('opacity-0', 'translate-y-4');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-background min-h-screen text-gray-200 overflow-x-hidden selection:bg-primary/30 font-sans relative">
      
      {/* GLOBAL BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-pattern animate-grid-move opacity-30"></div>
        {/* Animated Particles */}
        <div className="absolute left-[10%] w-1 h-1 bg-primary/40 rounded-full animate-particle-1"></div>
        <div className="absolute left-[30%] w-1.5 h-1.5 bg-secondary/30 rounded-full animate-particle-2"></div>
        <div className="absolute left-[50%] w-2 h-2 bg-purple-500/30 rounded-full animate-particle-3"></div>
        <div className="absolute left-[70%] w-1 h-1 bg-cyan-400/40 rounded-full animate-particle-4"></div>
        <div className="absolute left-[90%] w-1.5 h-1.5 bg-primary/30 rounded-full animate-particle-5"></div>
        
        {/* Scanning Beam */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute w-full h-[3px] bg-primary/30 shadow-[0_0_25px_#0ea5e9] animate-scan"></div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-cardBorder/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg text-primary border border-primary/30">
              <Shield size={32} />
            </div>
            <div>
              <h1 className="font-extrabold text-2xl tracking-wide text-white">ResQNet</h1>
              <p className="text-[11px] text-primary uppercase tracking-widest font-bold">Sentinel Engine</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-primary hover:scale-105 transition-transform text-lg py-2.5 px-6"
          >
            Launch Command Center
          </button>
        </div>
      </header>

      {/* 1 & 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto z-10 flex flex-col md:flex-row items-center">
        {/* Glows & Shapes */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-purple-600/10 to-transparent rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-critical/10 rounded-full blur-[120px] -z-10"></div>
        
        {/* Abstract floating shapes */}
        <div className="absolute top-20 right-1/4 w-40 h-40 border-2 border-cyan-400/20 rounded-full animate-float opacity-50 shadow-[0_0_30px_rgba(34,211,238,0.1)]"></div>
        <div className="absolute bottom-20 left-1/4 w-56 h-56 border border-purple-500/20 rounded-full animate-float-delayed opacity-40 shadow-[0_0_30px_rgba(168,85,247,0.1)]"></div>

        <div className="md:w-3/5 text-left relative z-10">
          <div className="inline-flex items-center gap-3 mb-8 px-1.5 rounded-full bg-cardBorder/40 border border-cardBorder p-1.5 pr-5 shadow-lg">
            <div className="relative flex items-center justify-center px-4 py-1.5 bg-card rounded-full overflow-hidden group">
              <div className="absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#0ea5e9_100%)] animate-border-spin group-hover:opacity-100 opacity-70"></div>
              <div className="relative bg-card px-3 py-1 rounded-full z-10 text-xs font-bold text-primary uppercase tracking-widest">
                v3.2 Operations Live
              </div>
            </div>
            <span className="text-sm text-gray-300 font-semibold tracking-wide">Built for Mass Gathering Emergency Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-none drop-shadow-lg">
            AI-Powered <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_20px_rgba(14,165,233,0.4)]">
              Emergency Intelligence
            </span>
            <br /> Platform
          </h1>
          
          <p className="text-2xl text-gray-400 max-w-2xl mb-10 leading-relaxed font-medium">
            Predict risks before they escalate. Coordinate resources in real time. Protect millions during large-scale events with autonomous AI agents.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 mb-12">
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-5 px-10 rounded-lg transition-all hover:scale-105 w-full sm:w-auto text-xl flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(14,165,233,0.5)] border border-cyan-400/30"
            >
              Launch Command Center <Zap size={24}/>
            </button>
            <button 
              onClick={() => scrollToSection('architecture-section')}
              className="btn-outline py-5 px-10 w-full sm:w-auto text-xl hover:border-primary/50 hover:bg-primary/5 font-semibold cursor-pointer"
            >
              View System Overview
            </button>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {[
              { label: 'Memory AI Active', icon: BrainCircuit },
              { label: 'Risk Prediction Online', icon: Activity },
              { label: 'Resource Optimizer Live', icon: Network }
            ].map((indicator, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-medium text-gray-300 bg-card/60 border border-cardBorder px-4 py-2 rounded-full backdrop-blur-md shadow-md">
                <div className="relative">
                  <div className="w-2 h-2 bg-safe rounded-full animate-ping absolute"></div>
                  <div className="w-2 h-2 bg-safe rounded-full relative shadow-[0_0_5px_#10b981]"></div>
                </div>
                <indicator.icon size={16} className="text-cyan-400" />
                <span className="tracking-wide">{indicator.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Preview Card */}
        <div className="md:w-2/5 mt-16 md:mt-0 relative z-10 flex justify-center animate-float">
          <div className="glass-card p-8 w-full max-w-md border border-cardBorder border-t-4 border-t-critical shadow-[0_20px_50px_rgba(0,0,0,0.5),_0_0_30px_rgba(239,68,68,0.2)] relative overflow-hidden backdrop-blur-xl bg-card/80">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-critical/30 rounded-full blur-[50px]"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-critical/50 to-transparent"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
               <div className="flex items-center gap-2 text-sm font-bold text-critical bg-critical/10 border border-critical/30 px-3 py-1.5 rounded animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                 <ShieldAlert size={18} /> LIVE AI WARNING
               </div>
               <span className="text-xs text-gray-500 font-mono tracking-widest bg-black/40 px-2 py-1 rounded">SYS.T-42ms</span>
            </div>

            <h3 className="text-2xl font-black text-white mb-2 relative z-10">Potential Heat Stress Cluster</h3>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-8 bg-black/20 p-2 rounded w-fit border border-white/5">
               <Flame size={16} className="text-warning animate-pulse" />
               Zone A · Sector 7
            </div>

            <div className="space-y-6 relative z-10">
               <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                 <div className="flex justify-between text-sm mb-2">
                   <span className="text-gray-400 font-medium tracking-wide">Escalation ETA</span>
                   <span className="text-warning font-bold">8-12 min</span>
                 </div>
                 <div className="w-full bg-cardBorder h-2 rounded-full overflow-hidden shadow-inner">
                   <div className="bg-warning h-full rounded-full w-[80%] animate-pulse-slow shadow-[0_0_10px_#f59e0b]"></div>
                 </div>
               </div>

               <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                 <div className="flex justify-between text-sm mb-2">
                   <span className="text-gray-400 font-medium tracking-wide">AI Confidence</span>
                   <span className="text-primary font-bold">87%</span>
                 </div>
                 <div className="w-full bg-cardBorder h-2 rounded-full overflow-hidden shadow-inner">
                   <div className="bg-primary h-full rounded-full w-[87%] relative overflow-hidden shadow-[0_0_10px_#0ea5e9]">
                     <div className="absolute inset-0 bg-white/30 translate-x-[-100%] animate-[scan_2s_ease-in-out_infinite]" style={{ transform: 'skewX(-20deg)' }}></div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section className="py-16 px-6 border-t border-cardBorder/30 bg-card/10 relative z-10 scroll-animate opacity-0 translate-y-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Mass Gathering Vulnerabilities</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto font-medium">Traditional monitoring fails at scale. ResQNet anticipates challenges before they become emergencies, providing operational dominance.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { icon: Activity, title: 'Crowd Surges', color: 'critical', desc: 'Sudden density spikes near gates and narrow paths.' },
              { icon: HeartPulse, title: 'Medical Emergencies', color: 'warning', desc: 'Collapse, dehydration, injury, cardiac distress.' },
              { icon: Thermometer, title: 'Heat Stress Events', color: 'orange-500', desc: 'High temperature + crowding + water shortage.' },
              { icon: LocateFixed, title: 'Lost Child Incidents', color: 'primary', desc: 'Clustered missing-person reports across zones.' },
              { icon: ShieldAlert, title: 'Resource Bottlenecks', color: 'purple-500', desc: 'Ambulance, security, and medical unit overload.' }
            ].map((item, i) => (
              <div key={i} className={`glass-card p-8 flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:border-white/20 relative overflow-hidden bg-card/60 backdrop-blur-lg`}>
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-${item.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                
                <div className="relative mb-6">
                  <div className={`absolute inset-0 bg-${item.color}/30 rounded-full blur-[20px] group-hover:animate-pulse`}></div>
                  <div className={`relative p-5 rounded-full bg-card border-2 border-cardBorder group-hover:border-${item.color}/50 transition-colors text-${item.color} shadow-lg`}>
                    <item.icon size={36} />
                    {/* Tiny animated risk pulse */}
                    <div className={`absolute top-0 right-0 w-3 h-3 bg-${item.color} rounded-full border-2 border-card animate-ping`}></div>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg text-gray-100 mb-3 tracking-wide">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 & 5. ARCHITECTURE SECTION */}
      <section id="architecture-section" className="py-16 px-6 relative z-10 scroll-animate opacity-0 translate-y-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Multi-Agent Architecture</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto font-medium">
              ResQNet Sentinel operates on a collaborative neural network of specialized AI agents. They analyze data streams concurrently to synthesize high-confidence operational intelligence.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left: Agent Cards */}
            <div className="lg:w-5/12 space-y-5">
              {[
                { name: 'Classification Agent', icon: ShieldAlert, color: 'text-critical', bg: 'bg-critical/10', in: 'Incident reports (Text/Voice)', out: 'Category + Severity Matrix' },
                { name: 'Risk Prediction Agent', icon: Activity, color: 'text-warning', bg: 'bg-warning/10', in: 'Incident + Zone Telemetry', out: 'Escalation Probability Forecast' },
                { name: 'Memory Intelligence Agent', icon: BrainCircuit, color: 'text-secondary', bg: 'bg-secondary/10', in: 'Historical DB + Active Events', out: 'Hidden Pattern Detection' },
                { name: 'Resource Optimization Agent', icon: Network, color: 'text-primary', bg: 'bg-primary/10', in: 'Unit Availability & Location', out: 'Dynamic Dispatch Recommendation' },
                { name: 'Emergency Broadcast Agent', icon: MessageSquareWarning, color: 'text-orange-500', bg: 'bg-orange-500/10', in: 'Confirmed Risk Alerts', out: 'Multilingual Public Advisory' }
              ].map((agent, i) => (
                <div key={i} className="glass-card p-5 hover:border-white/20 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] group bg-card/60">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg border border-white/5 shadow-inner ${agent.bg} ${agent.color} group-hover:scale-110 transition-transform`}>
                        <agent.icon size={20} />
                      </div>
                      <span className="font-bold text-white text-base tracking-wide">{agent.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-safe border border-safe/30 bg-safe/10 px-2 py-1 rounded-full tracking-widest flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse"></div>
                      ACTIVE
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                      <span className="text-gray-500 block mb-1 uppercase font-bold tracking-widest text-[10px]">Input</span>
                      <span className="text-gray-300 font-semibold">{agent.in}</span>
                    </div>
                    <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                      <span className="text-gray-500 block mb-1 uppercase font-bold tracking-widest text-[10px]">Output</span>
                      <span className="text-primary font-bold">{agent.out}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right: Real Visual AI Architecture (Improved Balance & Height) */}
            <div className="lg:w-7/12 w-full h-[500px] glass-card flex items-center justify-center relative overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-cyan-500/5 to-background"></div>
               
               {/* Central Core */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                 <div className="relative w-28 h-28 flex items-center justify-center">
                   <div className="absolute inset-0 bg-primary/30 rounded-full blur-[30px] animate-pulse-slow"></div>
                   <div className="absolute inset-0 border-2 border-primary/40 rounded-full animate-border-spin shadow-[0_0_30px_#0ea5e9]"></div>
                   <div className="absolute inset-3 border border-purple-500/50 rounded-full animate-[spin_8s_linear_infinite_reverse]"></div>
                   <div className="absolute inset-6 border border-cyan-300/40 rounded-full animate-[spin_4s_linear_infinite]"></div>
                   <BrainCircuit size={44} className="text-white drop-shadow-[0_0_15px_#ffffff] relative z-10" />
                 </div>
                 <span className="mt-4 text-xs font-black text-white tracking-widest uppercase bg-primary/20 px-3 py-1.5 rounded-lg backdrop-blur-md border border-primary/30 shadow-[0_0_20px_rgba(14,165,233,0.3)]">Memory AI Core</span>
               </div>

               {/* Orbiting Nodes and Connecting Lines */}
               <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
                 <defs>
                   <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                     <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
                   </linearGradient>
                   <linearGradient id="lineGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                     <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                     <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
                   </linearGradient>
                 </defs>
                 {/* Balanced Connections to Center (cx="50%", cy="50%") */}
                 <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="url(#lineGrad1)" strokeWidth="2" strokeDasharray="6 6" className="animate-pulse" />
                 <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="url(#lineGrad2)" strokeWidth="2" strokeDasharray="6 6" className="animate-pulse" />
                 <line x1="20%" y1="80%" x2="50%" y2="50%" stroke="#0ea5e9" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="4 4" />
                 <line x1="80%" y1="80%" x2="50%" y2="50%" stroke="#a855f7" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="4 4" />
               </svg>

               {/* Classification Agent (Top Left) */}
               <div className="absolute top-[20%] left-[20%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group">
                 <div className="w-14 h-14 bg-card border-2 border-critical/50 rounded-full flex items-center justify-center relative hover:scale-110 transition-transform shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                   <div className="absolute inset-0 bg-critical/20 rounded-full blur-[10px]"></div>
                   <ShieldAlert size={24} className="text-critical" />
                   <div className="absolute -right-1 -top-1 w-3 h-3 bg-safe rounded-full border-2 border-card animate-pulse shadow-[0_0_10px_#10b981]"></div>
                 </div>
                 <span className="mt-2 text-[10px] font-bold text-gray-300 font-mono tracking-widest bg-black/50 px-2 py-1 rounded">CLASSIFICATION</span>
               </div>

               {/* Risk Prediction Agent (Top Right) */}
               <div className="absolute top-[20%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group">
                 <div className="w-14 h-14 bg-card border-2 border-warning/50 rounded-full flex items-center justify-center relative hover:scale-110 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                   <div className="absolute inset-0 bg-warning/20 rounded-full blur-[10px]"></div>
                   <Activity size={24} className="text-warning" />
                   <div className="absolute -right-1 -top-1 w-3 h-3 bg-safe rounded-full border-2 border-card animate-pulse shadow-[0_0_10px_#10b981]"></div>
                 </div>
                 <span className="mt-2 text-[10px] font-bold text-gray-300 font-mono tracking-widest bg-black/50 px-2 py-1 rounded">RISK PRED.</span>
               </div>

               {/* Resource Opt Agent (Bottom Left) */}
               <div className="absolute top-[80%] left-[20%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group">
                 <div className="w-14 h-14 bg-card border-2 border-primary/50 rounded-full flex items-center justify-center relative hover:scale-110 transition-transform shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                   <div className="absolute inset-0 bg-primary/20 rounded-full blur-[10px]"></div>
                   <Network size={24} className="text-primary" />
                   <div className="absolute -right-1 -top-1 w-3 h-3 bg-safe rounded-full border-2 border-card animate-pulse shadow-[0_0_10px_#10b981]"></div>
                 </div>
                 <span className="mt-2 text-[10px] font-bold text-gray-300 font-mono tracking-widest bg-black/50 px-2 py-1 rounded">RESOURCE OPT.</span>
               </div>

               {/* Broadcast Agent (Bottom Right) */}
               <div className="absolute top-[80%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group">
                 <div className="w-14 h-14 bg-card border-2 border-orange-500/50 rounded-full flex items-center justify-center relative hover:scale-110 transition-transform shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                   <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-[10px]"></div>
                   <MessageSquareWarning size={24} className="text-orange-500" />
                   <div className="absolute -right-1 -top-1 w-3 h-3 bg-safe rounded-full border-2 border-card animate-pulse shadow-[0_0_10px_#10b981]"></div>
                 </div>
                 <span className="mt-2 text-[10px] font-bold text-gray-300 font-mono tracking-widest bg-black/50 px-2 py-1 rounded">BROADCAST</span>
               </div>

               {/* Data stream particle effect */}
               <div className="absolute top-[40%] left-[30%] w-2 h-2 bg-white rounded-full shadow-[0_0_15px_white] animate-[float_2s_linear_infinite]"></div>
               <div className="absolute top-[60%] left-[70%] w-2 h-2 bg-white rounded-full shadow-[0_0_15px_white] animate-[float_2.5s_linear_infinite]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WORKFLOW SECTION */}
      <section id="workflow-section" className="py-16 px-6 border-t border-cardBorder/50 bg-card/30 relative z-10 scroll-animate opacity-0 translate-y-4">
         <div className="max-w-7xl mx-auto text-center">
           <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Autonomous System Workflow</h2>
           <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-16 font-medium">End-to-end intelligence pipeline operating at sub-second latency.</p>
           
           <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
              {/* Connecting background line for desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-cardBorder -z-10 shadow-inner">
                <div className="h-full bg-gradient-to-r from-primary via-purple-500 to-primary w-full animate-pulse-slow shadow-[0_0_15px_#a855f7]"></div>
              </div>

              {[
                { title: 'Incident Detection', icon: Radio, sub: 'Ingest raw signals' },
                { title: 'AI Analysis', icon: Cpu, sub: 'Classify & extract' },
                { title: 'Risk Prediction', icon: TrendingUp, sub: 'Forecast escalation' },
                { title: 'Resource Rec.', icon: Crosshair, sub: 'Match & optimize' },
                { title: 'Alert Generation', icon: Megaphone, sub: 'Multilingual broadcast' },
                { title: 'Response Tracking', icon: GitCommit, sub: 'Live unit monitoring' }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center mb-8 md:mb-0 group relative w-full md:w-auto">
                  <div className="w-20 h-20 rounded-full bg-card border-4 border-cardBorder group-hover:border-primary flex items-center justify-center transition-colors mb-5 relative z-10 shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
                     <step.icon size={32} className="text-gray-400 group-hover:text-white transition-colors drop-shadow" />
                     <div className="absolute inset-0 bg-primary/30 rounded-full blur-[15px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h4 className="font-bold text-gray-100 text-base mb-1.5 tracking-wide">{step.title}</h4>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold bg-black/30 px-2 py-0.5 rounded">{step.sub}</p>
                </div>
              ))}
           </div>
         </div>
      </section>

      {/* NEW: LIVE DEMO SCENARIO SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10 scroll-animate opacity-0 translate-y-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Live Demo Scenario</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-medium">How ResQNet Sentinel autonomously prevents an emergency.</p>
        </div>

        <div className="relative">
           {/* Glowing Timeline Connector */}
           <div className="absolute top-1/2 left-0 w-full h-1.5 bg-cardBorder -z-10 shadow-inner hidden lg:block rounded-full overflow-hidden">
             <div className="h-full bg-gradient-to-r from-cyan-500 via-primary to-warning w-full animate-[scan_3s_ease-in-out_infinite]"></div>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
             {/* Card 1 */}
             <div className="glass-card p-6 border-t-4 border-t-primary/50 relative overflow-hidden group hover:-translate-y-2 transition-transform shadow-lg bg-card/80 backdrop-blur-md">
               <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4 border border-primary/30 shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                 <Radio size={20} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2 tracking-wide">1. Weak Signals Detected</h3>
               <p className="text-sm text-gray-400 leading-relaxed font-medium">Water station failure + long queue + fainting reports detected in Zone A.</p>
             </div>

             {/* Card 2 */}
             <div className="glass-card p-6 border-t-4 border-t-secondary/50 relative overflow-hidden group hover:-translate-y-2 transition-transform shadow-lg bg-card/80 backdrop-blur-md">
               <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mb-4 border border-secondary/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                 <BrainCircuit size={20} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2 tracking-wide">2. Emergency Memory AI</h3>
               <p className="text-sm text-gray-400 leading-relaxed font-medium">AI correlates separate incidents and identifies a hidden heat-stress pattern.</p>
             </div>

             {/* Card 3 */}
             <div className="glass-card p-6 border-t-4 border-t-warning/50 relative overflow-hidden group hover:-translate-y-2 transition-transform shadow-lg bg-card/80 backdrop-blur-md">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <AlertCircle size={60} className="text-warning" />
               </div>
               <div className="w-10 h-10 rounded-full bg-warning/20 text-warning flex items-center justify-center mb-4 border border-warning/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                 <Activity size={20} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2 tracking-wide">3. Predictive Warning</h3>
               <p className="text-sm text-gray-400 leading-relaxed font-medium">Heat Stress Cluster predicted with <span className="text-warning font-bold">87% confidence</span> and 8–12 minute escalation window.</p>
             </div>

             {/* Card 4 */}
             <div className="glass-card p-6 border-t-4 border-t-safe/50 relative overflow-hidden group hover:-translate-y-2 transition-transform shadow-lg bg-card/80 backdrop-blur-md">
               <div className="w-10 h-10 rounded-full bg-safe/20 text-safe flex items-center justify-center mb-4 border border-safe/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                 <Crosshair size={20} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2 tracking-wide">4. Preventive Response</h3>
               <p className="text-sm text-gray-400 leading-relaxed font-medium">Deploy hydration unit, send medical team, open backup gate, broadcast bilingual advisory.</p>
             </div>
           </div>
        </div>

        {/* Demo Impact Sub-card */}
        <div className="mt-12 max-w-3xl mx-auto glass-card p-6 border border-primary/40 bg-primary/5 text-center shadow-[0_0_30px_rgba(14,165,233,0.15)] rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-[scan_3s_ease-in-out_infinite_reverse]"></div>
          <p className="text-lg text-white font-medium relative z-10 leading-relaxed">
            <span className="font-bold text-primary">Demo Impact:</span> ResQNet does not wait for disasters. It connects weak signals and recommends action before escalation.
          </p>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-20 px-6 text-center border-t border-cardBorder/50 relative overflow-hidden z-10">
        {/* Glowing Background Orb */}
        <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/30 via-purple-600/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent shadow-[0_0_20px_#22d3ee]"></div>

        <div className="max-w-4xl mx-auto">
          {/* Command Center Preview Card */}
          <div className="mx-auto w-72 glass-card p-4 mb-10 border-primary/40 flex items-center justify-between opacity-90 rotate-1 hover:rotate-0 transition-transform shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/40 shadow-inner">
                <Shield size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-white tracking-wide">System Ready</p>
                <p className="text-[11px] text-gray-400 font-mono">All agents online &amp; monitoring</p>
              </div>
            </div>
            <div className="text-safe text-sm font-black px-3 py-1 bg-safe/10 border border-safe/30 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              OK
            </div>
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tight leading-tight">Ready to secure your next <br/> massive event?</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto font-medium">Deploy ResQNet Sentinel to gain complete situational awareness and AI-driven operational dominance.</p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-primary py-5 px-12 text-xl font-bold w-full sm:w-auto shadow-[0_0_40px_rgba(14,165,233,0.4)] hover:scale-105 transition-all border border-cyan-400/30"
            >
              Launch Command Center
            </button>
            <button 
              onClick={() => scrollToSection('workflow-section')}
              className="bg-card/80 backdrop-blur-xl border-2 border-cardBorder hover:bg-cardBorder/80 text-gray-200 font-bold py-5 px-12 rounded-lg transition-colors w-full sm:w-auto text-xl hover:border-gray-500 flex items-center justify-center gap-3 shadow-lg"
            >
              View AI Workflow <ArrowRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

// Component helper for arrow
const ArrowRight = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);

export default LandingPage;
