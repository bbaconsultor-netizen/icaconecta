import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  ChevronRight, 
  ArrowLeft,
  Rocket,
  Clock,
  Target,
  Search,
  ShoppingBag,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCompanies, saveDiagnostic, getLatestDiagnostic } from '../services/dbService';
import { generateDiagnosticReport, DiagnosticResult } from '../services/geminiService';
import { diagnosticCategories } from '../constants/diagnosticQuestions';
import { generatePDFReport } from '../services/pdfService';

type Step = 'landing' | 'company-select' | 'existing-diagnostic' | 'questions' | 'loading' | 'result';

export default function DiagnosticForm() {
  const [step, setStep] = useState<Step>('landing');
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [existingDiagnostic, setExistingDiagnostic] = useState<any>(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  const handleCompanySelect = async (companyId: string) => {
    setSelectedCompanyId(companyId);
    if (!companyId) return;

    const latest = await getLatestDiagnostic(companyId);
    if (latest) {
      setExistingDiagnostic(latest);
      setStep('existing-diagnostic');
    } else {
      setStep('questions');
    }
  };

  const startNewDiagnostic = () => {
    setAnswers({});
    setCurrentCategoryIndex(0);
    setCurrentQuestionIndex(0);
    setStep('questions');
  };

  const viewExistingDiagnostic = () => {
    setResult(existingDiagnostic);
    if (existingDiagnostic.answers) {
      setAnswers(existingDiagnostic.answers);
    }
    setStep('result');
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      const data = await getCompanies();
      setCompanies(data);
    };
    fetchCompanies();
  }, []);

  const currentCategory = diagnosticCategories[currentCategoryIndex];
  const currentQuestion = currentCategory.questions[currentQuestionIndex];
  const totalQuestions = diagnosticCategories.reduce((acc, cat) => acc + cat.questions.length, 0);
  const questionsAnswered = Object.keys(answers).length;
  const progress = (questionsAnswered / totalQuestions) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < currentCategory.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentCategoryIndex < diagnosticCategories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      submitDiagnostic(newAnswers);
    }
  };

  const submitDiagnostic = async (finalAnswers: any) => {
    setStep('loading');
    try {
      const report = await generateDiagnosticReport(finalAnswers);
      await saveDiagnostic({
        companyId: selectedCompanyId,
        answers: finalAnswers,
        ...report
      });
      setResult(report);
      setStep('result');
    } catch (error) {
      console.error(error);
      setStep('questions');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl space-y-12"
          >
            <div className="bg-slate-900 rounded-3xl p-12 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Rocket size={200} />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/30">
                  <Sparkles size={14} />
                  Módulo de Diagnóstico
                </div>
                
                <h1 className="text-5xl font-bold leading-tight italic serif">
                  Diagnóstico de <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                    Madurez Digital
                  </span>
                </h1>
                
                <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
                  Evalúa el nivel de digitalización de tu empresa en 7 dimensiones clave, incluyendo Inteligencia Artificial. Obtén un informe personalizado con recomendaciones concretas.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button 
                    onClick={() => setStep('company-select')}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-3 shadow-lg shadow-indigo-500/25"
                  >
                    <Rocket size={20} />
                    Iniciar diagnóstico gratuito
                  </button>
                  <div className="flex items-center gap-2 px-6 py-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-slate-300">
                    <Clock size={18} />
                    <span className="text-sm font-medium">12-18 minutos • 21 preguntas</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {diagnosticCategories.map((cat) => (
                <div key={cat.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors group">
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{cat.icon}</div>
                  <h3 className="text-white font-bold mb-1">{cat.title}</h3>
                  <p className="text-slate-500 text-xs">3 preguntas clave</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'company-select' && (
          <motion.div 
            key="company-select"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-slate-100"
          >
            <button onClick={() => setStep('landing')} className="text-slate-400 hover:text-slate-600 mb-8 flex items-center gap-2 text-sm font-medium">
              <ArrowLeft size={16} /> Volver
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Selecciona la empresa</h2>
            <p className="text-slate-500 mb-8 text-sm">Elige la MIPYME que recibirá el diagnóstico.</p>
            
            <select 
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 outline-none bg-slate-50 text-slate-700 mb-8 appearance-none"
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
            >
              <option value="">Elegir del CRM...</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.ruc})</option>
              ))}
            </select>

            <button 
              disabled={!selectedCompanyId}
              onClick={() => handleCompanySelect(selectedCompanyId)}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Continuar
              <ChevronRight size={20} />
            </button>
          </motion.div>
        )}

        {step === 'existing-diagnostic' && (
          <motion.div 
            key="existing-diagnostic"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 text-center"
          >
            <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-6">
              <ClipboardCheck size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Diagnóstico Existente</h2>
            <p className="text-slate-500 mb-8 text-sm">
              Esta empresa ya cuenta con un diagnóstico realizado. ¿Qué deseas hacer?
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={viewExistingDiagnostic}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                Ver diagnóstico actual
                <ArrowRight size={18} />
              </button>
              <button 
                onClick={startNewDiagnostic}
                className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                Realizar nuevo diagnóstico
                <Sparkles size={18} className="text-indigo-500" />
              </button>
              <button 
                onClick={() => setStep('company-select')}
                className="w-full py-2 text-slate-400 text-sm font-medium hover:text-slate-600"
              >
                Cambiar empresa
              </button>
            </div>
          </motion.div>
        )}
        {step === 'questions' && (
          <motion.div 
            key="questions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-3xl space-y-8"
          >
            {/* Progress Header */}
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currentCategory.icon}</span>
                  <h3 className="text-white font-bold">{currentCategory.title}</h3>
                </div>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  Pregunta {questionsAnswered + 1} de {totalQuestions}
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                {diagnosticCategories.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 flex-1 mx-0.5 rounded-full ${i <= currentCategoryIndex ? 'bg-indigo-500/40' : 'bg-slate-800'}`}
                  />
                ))}
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-[2.5rem] shadow-2xl space-y-10">
              <div className="space-y-4">
                <div className="inline-block px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">
                  {currentCategory.title}
                </div>
                <h2 className="text-3xl font-bold text-white leading-tight">
                  {currentQuestion.text}
                </h2>
                {currentQuestion.description && (
                  <p className="text-slate-400 text-lg">
                    {currentQuestion.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className="flex items-center gap-6 p-6 bg-slate-800/40 border border-slate-700/50 rounded-2xl text-left hover:bg-slate-800 hover:border-indigo-500/50 transition-all group"
                  >
                    <span className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-400 group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white transition-colors">
                      {opt.value}
                    </span>
                    <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-6 text-center">
                <p className="text-slate-500 text-sm italic">
                  💡 Selecciona la opción que mejor describe tu situación actual
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-8"
          >
            <div className="relative">
              <div className="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="text-indigo-500 animate-pulse" size={32} />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Analizando respuestas...</h2>
              <p className="text-slate-500">Nuestra IA está construyendo tu hoja de ruta personalizada.</p>
            </div>
          </motion.div>
        )}

        {step === 'result' && result && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl space-y-8"
          >
            <div className="bg-slate-900 p-12 rounded-[3rem] border border-slate-800 shadow-2xl text-left relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-500/30 mb-4">
                    <Sparkles size={12} /> Módulo 3 • Generado con IA
                  </div>
                  <h2 className="text-4xl font-bold italic serif">Plan de Transformación Digital</h2>
                  <p className="text-slate-400 mt-2">Plan personalizado generado automáticamente basado en tu diagnóstico. Roadmap de 12 meses con tecnologías, presupuesto y cronograma.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setStep('questions')}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors flex items-center gap-2"
                  >
                    <Search size={16} /> Actualizar diagnóstico
                  </button>
                  <button 
                    onClick={() => {
                      const company = companies.find(c => c.id === selectedCompanyId);
                      const readableAnswers: { question: string, answer: string }[] = [];
                      diagnosticCategories.forEach(cat => {
                        cat.questions.forEach(q => {
                          const val = answers[q.id];
                          if (val !== undefined) {
                            const opt = q.options.find(o => o.value === val);
                            readableAnswers.push({
                              question: q.text,
                              answer: opt ? opt.label : val.toString()
                            });
                          }
                        });
                      });
                      generatePDFReport(result, company?.name || 'Empresa', readableAnswers);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-xl text-sm font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                  >
                    <ShoppingBag size={16} /> Descargar PDF
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                <SummaryCard label="Duración del plan" value="12 meses" icon={<Clock className="text-indigo-400" />} />
                <SummaryCard label="Inversión estimada" value={result.totalInvestment} icon={<Target className="text-amber-400" />} />
                <SummaryCard label="Tecnologías clave" value={`${result.techRecommendations.length * 3} herramientas`} icon={<Rocket className="text-violet-400" />} />
                <SummaryCard label="ROI esperado" value={result.roiExpected} icon={<TrendingUpIcon className="text-emerald-400" />} />
              </div>

              {/* Dimension Details */}
              {result.dimensionDetails && (
                <div className="space-y-6 mb-12">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <Target className="text-indigo-500" /> Evaluación Detallada por Dimensión
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result.dimensionDetails.map((detail, idx) => (
                      <div key={idx} className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-3xl space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="text-lg font-bold text-indigo-400">{detail.dimension}</h4>
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-bold border border-emerald-500/20">
                            {detail.investment}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Evaluación</p>
                          <p className="text-sm text-slate-300 leading-relaxed">{detail.evaluation}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recomendación</p>
                          <p className="text-sm text-slate-400 italic">"{detail.recommendation}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Roadmap */}
              <div className="space-y-6 mb-12">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <ClipboardCheck className="text-indigo-500" /> Roadmap de implementación
                </h3>
                <div className="space-y-4">
                  {result.phases.map((phase, idx) => (
                    <div key={idx} className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-3xl relative">
                      <div className="absolute -left-3 top-8 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold border-4 border-slate-900">
                        {idx + 1}
                      </div>
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-[10px] font-bold">Fase {idx + 1}</span>
                            <span className="text-slate-500 text-xs">{phase.period}</span>
                          </div>
                          <h4 className="text-xl font-bold">{phase.title}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Tareas</p>
                              <ul className="space-y-2">
                                {phase.tasks.map((t, i) => (
                                  <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-indigo-500 mt-0.5 shrink-0" /> {t}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Herramientas</p>
                              <div className="flex flex-wrap gap-2">
                                {phase.tools.map((tool, i) => (
                                  <span key={i} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-[10px] text-slate-300">{tool}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="md:text-right">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Inversión</p>
                          <p className="text-xl font-bold text-indigo-400">{phase.budget}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Grid */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <Rocket className="text-indigo-500" /> Tecnologías recomendadas por IA
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.techRecommendations.map((tech, idx) => (
                    <div key={idx} className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-2xl">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-sm flex items-center gap-2">
                          {getTechIcon(tech.category)} {tech.category}
                        </h4>
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          tech.priority === 'Alta' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          tech.priority === 'Media' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {tech.priority}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {tech.options.map((opt, i) => (
                          <li key={i} className="text-xs text-slate-400 flex items-center gap-2">
                            <ArrowRight size={10} className="text-indigo-500" /> {opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-800 flex justify-center">
                <button 
                  onClick={() => setStep('landing')}
                  className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-colors"
                >
                  Finalizar y volver al inicio
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SummaryCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl">
      <div className="mb-3">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</div>
    </div>
  );
}

function getTechIcon(category: string) {
  const cat = category.toLowerCase();
  if (cat.includes('comunicación')) return '📧';
  if (cat.includes('ecommerce')) return '🛒';
  if (cat.includes('crm')) return '👥';
  if (cat.includes('analítica')) return '📊';
  if (cat.includes('automatización')) return '⚙️';
  if (cat.includes('ia')) return '🤖';
  return '🛠️';
}

function TrendingUp(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
