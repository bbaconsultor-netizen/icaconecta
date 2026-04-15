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

export const generateDiagnosticReport = async (answers: any, type: 'digital' | 'marketing' = 'digital'): Promise<DiagnosticResult> => {
  const isMarketing = type === 'marketing';
  
  const prompt = isMarketing ? `
    Actúa como un experto en Marketing Digital para MIPYMEs en Perú. 
    Analiza las siguientes respuestas de un autodiagnóstico de marketing digital que cubre:
    Estrategia y Marca, Presencia Web y SEO, Redes Sociales y Contenido, Publicidad Digital (Ads), Analítica y Conversión.

    Respuestas (Escala 1-5, donde 5 es nivel experto/optimizado y 1 es nulo):
    ${JSON.stringify(answers)}

    El objetivo es mejorar la visibilidad, captación y conversión de clientes digitales.

    Genera un informe formal y estructurado en formato JSON:
    {
      "maturityLevel": "Nivel (Inicial, Básico, Intermedio o Avanzado)",
      "score": (Puntaje del 1 al 100),
      "roadmap": "Resumen ejecutivo del plan de marketing digital.",
      "impactReport": "Análisis de impacto en ventas y posicionamiento detallado.",
      "totalInvestment": "Monto mensual estimado en pauta y herramientas (S/.)",
      "roiExpected": "Porcentaje de retorno de inversión publicitaria (ROAS) esperado",
      "dimensionScores": {
        "estrategia": number, "web": number, "redes": number, "ads": number, "analitica": number
      },
      "dimensionDetails": [
        {
          "dimension": "Nombre de la Dimensión",
          "evaluation": "Evaluación específica de la situación actual.",
          "recommendation": "Recomendación estratégica para mejorar.",
          "investment": "Monto estimado mensual (S/.)"
        }
      ],
      "phases": [
        {
          "title": "Nombre de la Fase",
          "period": "Mes X-Y",
          "tasks": ["Tarea 1", "Tarea 2"],
          "tools": ["Herramienta 1", "Herramienta 2"],
          "budget": "Inversión mensual (S/.)"
        }
      ],
      "techRecommendations": [
        {
          "category": "Nombre Categoría",
          "priority": "Alta/Media/Baja",
          "options": ["Opción 1", "Opción 2"]
        }
      ]
    }
  ` : `
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
    3. Debes incluir una evaluación y recomendación para CADA UNA de las dimensiones evaluadas.
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
