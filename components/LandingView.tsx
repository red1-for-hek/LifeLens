import React from 'react';
import { Eye, ShieldCheck, Activity, Terminal } from 'lucide-react';

interface LandingViewProps {
  onStart: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-slate-900 relative overflow-hidden">
      
      {/* 3D Cyber Grid Background */}
      <div className="cyber-grid-container">
        <div className="cyber-grid"></div>
      </div>
      
      {/* Vignette Overlay to fade grid edges */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900 z-0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900 z-0 pointer-events-none"></div>
      
      {/* Scanline Effect */}
      <div className="scanlines"></div>

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center max-w-2xl animate-fade-in-up">
        <div className="mb-8 relative group">
          <div className="absolute inset-0 bg-cyan-500/30 blur-2xl rounded-full group-hover:bg-cyan-400/50 transition-all duration-500 animate-pulse"></div>
          <div className="relative z-10 p-4 border border-cyan-500/30 rounded-full bg-slate-900/50 backdrop-blur-md">
            <Eye className="w-20 h-20 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
          </div>
        </div>
        
        <h1 
          className="text-6xl md:text-7xl font-bold text-white mb-2 font-cyber tracking-tighter glitch-text"
          data-text="LifeLens"
        >
          LifeLens
        </h1>
        
        <h2 className="text-xl md:text-2xl text-cyan-300 font-light mb-6 tracking-widest font-cyber">
          AI REALITY ANALYZER
        </h2>

        <div className="glass-panel p-8 rounded-2xl mb-10 w-full shadow-[0_0_50px_rgba(6,182,212,0.15)] border-t border-white/10 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-50"></div>
            <p className="text-lg text-slate-200 leading-relaxed relative z-10">
              <span className="text-cyan-400 mr-2">&gt;</span>
              Upload any real-world photo. Our AI instantly detects hidden hazards, safety risks, and provides immediate solutions.
              <span className="animate-pulse inline-block w-2 h-4 bg-cyan-400 ml-2 align-middle"></span>
            </p>
        </div>

        <button
          onClick={onStart}
          className="group relative px-10 py-5 bg-cyan-500 text-slate-900 font-bold text-xl rounded-none clip-path-polygon hover:bg-cyan-400 transition-all duration-300 hover:tracking-widest"
          style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
        >
          <div className="absolute inset-0 bg-white/40 group-hover:animate-ping opacity-0 group-hover:opacity-100"></div>
          <span className="relative z-10 flex items-center gap-3 font-cyber">
            <Activity className="w-6 h-6" />
            INITIALIZE SCAN
          </span>
        </button>
      </div>
      
      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-end text-xs text-slate-500 font-mono z-20 border-t border-white/5 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex gap-6">
           <span className="flex items-center gap-1.5 text-cyan-400/70"><ShieldCheck className="w-3 h-3" /> SYSTEM: SECURE</span>
           <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" /> LATENCY: 24ms</span>
        </div>

        {/* Made By Redoyanul - Custom Credit */}
        <div className="flex flex-col items-end">
             <span className="text-[10px] uppercase tracking-wider text-slate-600 mb-1">Developed By</span>
             <a href="#" className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors group">
                <Terminal className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                <span className="font-bold tracking-wide">Redoyanul</span>
             </a>
        </div>
      </div>
    </div>
  );
};
