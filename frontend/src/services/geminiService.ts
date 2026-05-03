import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

export interface Phase {
  title: string;
  period: string;
  tasks: string[];
  tools: string[];
  budget: string;
}

export interface TechRecommendation {
  category: string;
  priority: 'Alta' | 'Media' | 'Baja';
  options: string[];
}

export interface DimensionDetail {
  dimension: string;
  evaluation: string;
  recommendation: string;
  investment: string;
}

export interface DiagnosticResult {
  maturityLevel: string;
  score: number;
  roadmap: string;
  impactReport: string;
  dimensionScores: Record<string, number>;
  totalInvestment: string;
  roiExpected: string;
  phases: Phase[];
  techRecommendations: TechRecommendation[];
  dimensionDetails: DimensionDetail[];
}

export const generateDiagnosticReport = async (
  answers: any,
  type: 'digital' | 'marketing' = 'digital'
): Promise<DiagnosticResult> => {
  try {
    const response = await axios.post(`${API}/diagnostic`, { answers, type }, {
      timeout: 120000,
    });
    return response.data as DiagnosticResult;
  } catch (error) {
    console.error('Error generating diagnostic:', error);
    throw error;
  }
};
