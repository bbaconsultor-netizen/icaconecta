import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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

export const generateDiagnosticReport = async (answers: any): Promise<DiagnosticResult> => {
  const prompt = `
    Actúa como un experto en transformación digital para MIPYMEs en Perú. 
    Analiza las siguientes respuestas de un autodiagnóstico empresarial exhaustivo que cubre 8 dimensiones:
    Gestión, Marketing, E-commerce, Automatización, Datos, Infraestructura, IA y Plataformas del Estado (PERÚ COMPRAS, PRODUCE, OSCE, RNP, SUNAT, SUNARP, VUCE, PAGALO.PE).

    Respuestas (Escala 1-5, donde 5 es uso activo y 1 es nulo):
    ${JSON.stringify(answers)}

    El objetivo principal es la transformación digital (mejorar las dimensiones de negocio). 
    El uso de plataformas del Estado debe evaluarse como un avance en la integración con el ecosistema gubernamental, pero no debe desviar el foco de la digitalización core del negocio.

    Basado en esto, genera un informe formal y estructurado en formato JSON:
    {
      "maturityLevel": "Nivel (Inicial, Básico, Intermedio o Avanzado)",
      "score": (Puntaje del 1 al 100),
      "roadmap": "Resumen ejecutivo del plan de transformación.",
      "impactReport": "Análisis de impacto financiero y operativo detallado.",
      "totalInvestment": "Monto total estimado en Soles (S/.)",
      "roiExpected": "Porcentaje de retorno de inversión esperado",
      "dimensionScores": {
        "gestion": number, "marketing": number, "ecommerce": number, 
        "automatizacion": number, "datos": number, "infraestructura": number, "ia": number, "estado": number
      },
      "dimensionDetails": [
        {
          "dimension": "Nombre de la Dimensión",
          "evaluation": "Evaluación específica de la situación actual en esta dimensión.",
          "recommendation": "Recomendación estratégica para mejorar esta dimensión.",
          "investment": "Monto estimado a invertir específicamente en esta dimensión (S/.)"
        }
      ],
      "phases": [
        {
          "title": "Nombre de la Fase",
          "period": "Mes X-Y",
          "tasks": ["Tarea 1", "Tarea 2"],
          "tools": ["Herramienta 1", "Herramienta 2"],
          "budget": "Rango de inversión (S/.)"
        }
      ],
      "techRecommendations": [
        {
          "category": "Nombre Categoría",
          "priority": "Alta/Media/Baja",
          "options": ["Opción 1 (Ejem: SAP)", "Opción 2 (Ejem: Odoo)"]
        }
      ]
    }

    IMPORTANTE: 
    1. Las recomendaciones deben ser tecnologías reales y existentes en el mercado peruano/global. 
    2. El presupuesto debe ser realista para una MIPYME en Perú.
    3. Debes incluir una evaluación y recomendación para CADA UNA de las 8 dimensiones.
    4. El monto a invertir debe estar desglosado por dimensión en "dimensionDetails".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as DiagnosticResult;
  } catch (error) {
    console.error("Error generating diagnostic:", error);
    throw error;
  }
};
