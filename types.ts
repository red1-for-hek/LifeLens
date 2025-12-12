export interface Risk {
  title: string;
  severity: 'Low' | 'Medium' | 'High';
  solution: string;
}

export interface AnalysisResult {
  overall_safety_score: number;
  summary: string;
  risks: Risk[];
}

export type AppView = 'landing' | 'analyzer' | 'results';
