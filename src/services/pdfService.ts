import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DiagnosticResult } from './geminiService';

export const generatePDFReport = (result: DiagnosticResult, companyName: string, userAnswers: { question: string, answer: string }[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('PLAN DE TRANSFORMACIÓN DIGITAL', 20, 25);
  doc.setFontSize(10);
  doc.text(`CITE NAZCA - INFORME PARA: ${companyName.toUpperCase()}`, 20, 32);

  // Summary Cards
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.text('Resumen Ejecutivo', 20, 55);
  
  autoTable(doc, {
    startY: 60,
    head: [['Métrica', 'Valor']],
    body: [
      ['Nivel de Madurez', result.maturityLevel],
      ['Puntaje Obtenido', `${result.score}/100`],
      ['Inversión Total Estimada', result.totalInvestment],
      ['ROI Esperado', result.roiExpected],
    ],
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] }
  });

  // Detailed Dimension Analysis
  const finalY0 = (doc as any).lastAutoTable.finalY;
  doc.setFontSize(14);
  doc.text('Análisis Detallado por Dimensión', 20, finalY0 + 15);

  const dimensionData = result.dimensionDetails.map(d => [
    d.dimension,
    d.evaluation,
    d.recommendation,
    d.investment
  ]);

  autoTable(doc, {
    startY: finalY0 + 20,
    head: [['Dimensión', 'Evaluación', 'Recomendación', 'Inversión']],
    body: dimensionData,
    styles: { fontSize: 8, cellPadding: 3 },
    columnStyles: { 
      1: { cellWidth: 50 },
      2: { cellWidth: 60 }
    },
    headStyles: { fillColor: [99, 102, 241] }
  });

  // User Answers Section
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Respuestas del Diagnóstico', 20, 20);
  
  const answersData = userAnswers.map(a => [a.question, a.answer]);
  
  autoTable(doc, {
    startY: 25,
    head: [['Pregunta', 'Respuesta Seleccionada']],
    body: answersData,
    styles: { fontSize: 8 },
    columnStyles: { 0: { cellWidth: 120 } },
    headStyles: { fillColor: [100, 116, 139] }
  });

  // Roadmap Phases
  const finalY1 = (doc as any).lastAutoTable.finalY;
  doc.setFontSize(14);
  doc.text('Hoja de Ruta de Implementación (Roadmap)', 20, finalY1 + 15);

  const phaseData = result.phases.map(p => [
    p.title,
    p.period,
    p.tasks.join('\n'),
    p.budget
  ]);

  autoTable(doc, {
    startY: finalY1 + 20,
    head: [['Fase', 'Periodo', 'Tareas Clave', 'Presupuesto']],
    body: phaseData,
    styles: { fontSize: 8, cellPadding: 4 },
    columnStyles: { 2: { cellWidth: 80 } }
  });

  // Tech Recommendations
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Tecnologías Recomendadas', 20, 20);

  const techData = result.techRecommendations.map(t => [
    t.category,
    t.priority,
    t.options.join(', ')
  ]);

  autoTable(doc, {
    startY: 25,
    head: [['Categoría', 'Prioridad', 'Tecnologías Sugeridas']],
    body: techData,
    headStyles: { fillColor: [16, 185, 129] }
  });

  // Impact Analysis
  const finalY2 = (doc as any).lastAutoTable.finalY;
  doc.setFontSize(14);
  doc.text('Análisis de Impacto Estratégico', 20, finalY2 + 15);
  doc.setFontSize(9);
  const splitImpact = doc.splitTextToSize(result.impactReport, pageWidth - 40);
  doc.text(splitImpact, 20, finalY2 + 25);

  // Footer
  const pageCount = (doc as any).internal.pages.length - 1;
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Página ${i} de ${pageCount} - Generado por CITE Nazca con Inteligencia Artificial`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }

  doc.save(`Plan_Transformacion_${companyName.replace(/\s+/g, '_')}.pdf`);
};
