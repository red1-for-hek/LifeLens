import React, { useState, useRef, useCallback } from 'react';
import { Upload, Camera, ScanEye, X } from 'lucide-react';
import { analyzeImage } from '../services/geminiService';
import { AnalysisResult } from '../types';

interface AnalyzerViewProps {
  onAnalysisComplete: (result: AnalysisResult, imageSrc: string) => void;
  onBack: () => void;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({ onAnalysisComplete, onBack }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsAnalyzing(true);

    try {
      const result = await analyzeImage(file);
      // Artificial delay for the scanning animation effect if analysis is too fast
      await new Promise(resolve => setTimeout(resolve, 2000));
      onAnalysisComplete(result, objectUrl);
    } catch (e) {
      console.error(e);
      setIsAnalyzing(false);
      setPreviewUrl(null);
      alert("Failed to analyze image.");
    }
  }, [onAnalysisComplete]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="p-6 flex justify-between items-center z-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
                <ScanEye className="text-cyan-400 w-6 h-6" />
                <span className="font-cyber font-bold text-white tracking-wider">LIFELENS</span>
            </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
            
            {isAnalyzing ? (
                // Scanning State
                <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-cyan-500/50">
                       {previewUrl && <img src={previewUrl} alt="Analyzing" className="w-full h-full object-cover opacity-50" />}
                       <div className="absolute inset-0 bg-cyan-900/30"></div>
                    </div>

                    {/* Radar Scanning Effect */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden z-20 pointer-events-none">
                         <div className="absolute inset-0 border-2 border-cyan-400 opacity-50 rounded-2xl"></div>
                         {/* Grid */}
                         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                         {/* Sweep Line */}
                         <div className="absolute top-1/2 left-1/2 w-[150%] h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-sm animate-spin origin-left -translate-y-1/2 -translate-x-1/2"></div>
                         {/* Pulse Circle */}
                         <div className="absolute top-1/2 left-1/2 w-full h-full border border-cyan-400/30 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
                    </div>

                    <div className="z-30 flex flex-col items-center gap-2">
                        <p className="font-cyber text-2xl text-cyan-100 animate-pulse">SCANNING...</p>
                        <p className="text-xs text-cyan-300 font-mono">DETECTING HAZARDS</p>
                    </div>
                </div>
            ) : (
                // Upload State
                <div 
                    className="w-full max-w-lg aspect-[4/5] md:aspect-square glass-panel rounded-3xl border-2 border-dashed border-slate-600 hover:border-cyan-400 transition-colors cursor-pointer flex flex-col items-center justify-center p-8 text-center group"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleInputChange}
                    />
                    
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
                        <Upload className="w-8 h-8 text-cyan-400" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">Upload Reality</h3>
                    <p className="text-slate-400 mb-8 max-w-xs">
                        Drag & drop an image here, or click to open camera/gallery.
                    </p>

                    <div className="flex gap-4 w-full">
                         <button className="flex-1 py-3 bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded-xl font-semibold hover:bg-cyan-600/30 transition-all flex items-center justify-center gap-2">
                             <Camera className="w-5 h-5" /> Open Camera
                         </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
