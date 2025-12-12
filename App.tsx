import React, { useState } from 'react';
import { LandingView } from './components/LandingView';
import { AnalyzerView } from './components/AnalyzerView';
import { ResultsView } from './components/ResultsView';
import { AnalysisResult, AppView } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analyzedImageSrc, setAnalyzedImageSrc] = useState<string>('');

  const handleStart = () => {
    setCurrentView('analyzer');
  };

  const handleAnalysisComplete = (result: AnalysisResult, imageSrc: string) => {
    setAnalysisResult(result);
    setAnalyzedImageSrc(imageSrc);
    setCurrentView('results');
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setAnalyzedImageSrc('');
    setCurrentView('analyzer');
  };

  const handleBackToLanding = () => {
      setCurrentView('landing');
  }

  return (
    <div className="antialiased text-slate-100 bg-slate-900 min-h-screen selection:bg-cyan-500 selection:text-white">
      {currentView === 'landing' && (
        <LandingView onStart={handleStart} />
      )}
      
      {currentView === 'analyzer' && (
        <AnalyzerView 
          onAnalysisComplete={handleAnalysisComplete} 
          onBack={handleBackToLanding}
        />
      )}
      
      {currentView === 'results' && analysisResult && (
        <ResultsView 
          result={analysisResult} 
          imageSrc={analyzedImageSrc}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;