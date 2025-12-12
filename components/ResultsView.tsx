import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CheckCircle2, AlertTriangle, AlertOctagon, RotateCcw, Shield } from 'lucide-react';
import { AnalysisResult, Risk } from '../types';

interface ResultsViewProps {
  result: AnalysisResult;
  imageSrc: string;
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, imageSrc, onReset }) => {
  const score = result.overall_safety_score;
  
  // Chart Data
  const data = useMemo(() => [
    { name: 'Safety', value: score },
    { name: 'Danger', value: 10 - score },
  ], [score]);

  // Color logic
  const getScoreColor = (score: number) => {
    if (score >= 8) return '#22c55e'; // Green
    if (score >= 5) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const scoreColor = getScoreColor(score);

  const getSeverityColor = (severity: string) => {
      switch(severity.toLowerCase()) {
          case 'high': return 'border-red-500/50 bg-red-950/30 text-red-200';
          case 'medium': return 'border-orange-500/50 bg-orange-950/30 text-orange-200';
          default: return 'border-blue-500/50 bg-blue-950/30 text-blue-200';
      }
  };

  const getSeverityIcon = (severity: string) => {
      switch(severity.toLowerCase()) {
          case 'high': return <AlertOctagon className="w-5 h-5 text-red-500" />;
          case 'medium': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
          default: return <Shield className="w-5 h-5 text-blue-400" />;
      }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
       {/* Header */}
       <div className="p-4 glass-panel border-b border-white/5 sticky top-0 z-30 flex justify-between items-center backdrop-blur-xl">
            <h2 className="font-cyber font-bold text-xl text-white">Results</h2>
            <button onClick={onReset} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <RotateCcw className="w-5 h-5 text-slate-400" />
            </button>
       </div>

       <div className="p-6 max-w-4xl mx-auto w-full space-y-8 pb-20">
            
            {/* Top Section: Score & Summary */}
            <div className="grid md:grid-cols-2 gap-8">
                
                {/* Score Card */}
                <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                    <h3 className="text-slate-400 text-sm uppercase tracking-widest mb-4">Safety Score</h3>
                    <div className="w-48 h-48 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    startAngle={180}
                                    endAngle={0}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell key="safety" fill={scoreColor} />
                                    <Cell key="danger" fill="#334155" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                            <span className="text-5xl font-bold font-cyber" style={{ color: scoreColor }}>{score}</span>
                            <span className="text-xs text-slate-500">/ 10</span>
                        </div>
                    </div>
                </div>

                {/* Summary Card */}
                <div className="glass-panel p-6 rounded-3xl flex flex-col justify-center">
                    <h3 className="text-cyan-400 text-sm uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
                        <Shield className="w-4 h-4" /> AI Analysis Summary
                    </h3>
                    <p className="text-lg leading-relaxed text-slate-200">
                        {result.summary}
                    </p>
                </div>
            </div>

            {/* Risks List */}
            <div>
                <h3 className="font-cyber text-2xl text-white mb-6 pl-2 border-l-4 border-cyan-500">Detected Risks</h3>
                <div className="space-y-4">
                    {result.risks.map((risk, index) => (
                        <div 
                            key={index} 
                            className={`glass-panel border-l-4 rounded-r-xl rounded-l-none p-5 transition-all hover:translate-x-1 ${getSeverityColor(risk.severity)}`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    {getSeverityIcon(risk.severity)}
                                    <h4 className="font-bold text-lg text-white">{risk.title}</h4>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-black/20 text-xs font-bold uppercase tracking-wider">
                                    {risk.severity}
                                </span>
                            </div>
                            
                            <div className="pl-8">
                                <div className="flex items-start gap-3 text-slate-300 mt-2 bg-black/20 p-3 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                    <p className="text-sm font-medium leading-relaxed">
                                        <span className="text-green-400 font-bold block mb-1">Recommended Solution:</span>
                                        {risk.solution}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {result.risks.length === 0 && (
                         <div className="glass-panel p-8 rounded-xl text-center border-l-4 border-green-500">
                             <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                             <h4 className="text-xl font-bold text-white mb-2">No Significant Risks Detected</h4>
                             <p className="text-slate-400">The environment appears safe based on the visual analysis.</p>
                         </div>
                    )}
                </div>
            </div>
       </div>
    </div>
  );
};
