import { useState, useEffect } from 'react';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  ShoppingBag, 
  Users, 
  BarChart3,
  ExternalLink,
  BookOpen,
  Layout
} from 'lucide-react';
import { 
  getSolutions, 
  addSolution, 
  updateSolution, 
  deleteSolution,
  getCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
  getIndicators,
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse
} from '../services/dbService';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'companies' | 'indicators' | 'courses'>('marketplace');
  const [solutions, setSolutions] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [indicators, setIndicators] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState<{id: string, type: 'solution' | 'company' | 'course'} | null>(null);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [solutionForm, setSolutionForm] = useState<any>({
    provider: '',
    category: 'ERP',
    description: '',
    website: '',
    tags: ''
  });
  const [companyForm, setCompanyForm] = useState<any>({
    name: '',
    sector: '',
    contact: '',
    email: '',
    phone: '',
    status: 'Sensibilizada'
  });
  const [courseForm, setCourseForm] = useState<any>({
    title: '',
    description: '',
    url: '',
    dimension: 'Gestión'
  });

  useEffect(() => {
    setEditingId(null);
    setSolutionForm({ provider: '', category: 'ERP', description: '', website: '', tags: '' });
    setCompanyForm({ name: '', sector: '', contact: '', email: '', phone: '', status: 'Sensibilizada' });
    setCourseForm({ title: '', description: '', url: '', dimension: 'Gestión' });
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'marketplace') {
        const data = await getSolutions();
        setSolutions(data);
      } else if (activeTab === 'companies') {
        const data = await getCompanies();
        setCompanies(data);
      } else if (activeTab === 'indicators') {
        const data = await getIndicators();
        setIndicators(data);
      } else if (activeTab === 'courses') {
        const data = await getCourses();
        setCourses(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSaveSolution = async () => {
    const data = {
      ...solutionForm,
      tags: typeof solutionForm.tags === 'string' ? solutionForm.tags.split(',').map((t: string) => t.trim()) : solutionForm.tags
    };

    try {
      if (editingId) {
        await updateSolution(editingId, data);
        showToast("Solución actualizada");
      } else {
        await addSolution(data);
        showToast("Solución agregada");
      }
      setEditingId(null);
      setSolutionForm({ provider: '', category: 'ERP', description: '', website: '', tags: '' });
      fetchData();
    } catch (error) {
      showToast("Error al guardar: " + (error as any).message, 'error');
    }
  };

  const handleSaveCompany = async () => {
    try {
      if (editingId) {
        await updateCompany(editingId, companyForm);
        showToast("Empresa actualizada");
      } else {
        await addCompany(companyForm);
        showToast("Empresa agregada");
      }
      setEditingId(null);
      setCompanyForm({ name: '', sector: '', contact: '', email: '', phone: '', status: 'Sensibilizada' });
      fetchData();
    } catch (error) {
      showToast("Error al guardar: " + (error as any).message, 'error');
    }
  };

  const handleSaveCourse = async () => {
    try {
      if (editingId) {
        await updateCourse(editingId, courseForm);
        showToast("Curso actualizado");
      } else {
        await addCourse(courseForm);
        showToast("Curso agregado");
      }
      setEditingId(null);
      setCourseForm({ title: '', description: '', url: '', dimension: 'Gestión' });
      fetchData();
    } catch (error) {
      showToast("Error al guardar: " + (error as any).message, 'error');
    }
  };

  const handleDeleteSolution = async (id: string) => {
    setShowConfirm({ id, type: 'solution' });
  };

  const handleDeleteCompany = async (id: string) => {
    setShowConfirm({ id, type: 'company' });
  };

  const handleDeleteCourse = async (id: string) => {
    setShowConfirm({ id, type: 'course' });
  };

  const confirmDelete = async () => {
    if (!showConfirm) return;
    
    try {
      if (showConfirm.type === 'solution') {
        await deleteSolution(showConfirm.id);
        showToast("Solución eliminada");
      } else if (showConfirm.type === 'company') {
        await deleteCompany(showConfirm.id);
        showToast("Empresa eliminada");
      } else if (showConfirm.type === 'course') {
        await deleteCourse(showConfirm.id);
        showToast("Curso eliminado");
      }
      setShowConfirm(null);
      fetchData();
    } catch (error) {
      showToast("Error al eliminar: " + (error as any).message, 'error');
    }
  };

  const handleSeedStatePlatforms = async () => {
    const platforms = [
      {
        provider: 'Gob.pe',
        category: 'Estado',
        description: 'Plataforma digital única del Estado Peruano para orientación al ciudadano y trámites unificados.',
        website: 'https://www.gob.pe',
        tags: ['Estado', 'Ciudadanía', 'Trámites']
      },
      {
        provider: 'PIDE',
        category: 'Estado',
        description: 'Plataforma de Interoperabilidad del Estado para el intercambio de datos entre entidades públicas.',
        website: 'https://www.gob.pe/pide',
        tags: ['Interoperabilidad', 'Datos', 'Estado']
      },
      {
        provider: 'Págalo.pe',
        category: 'Estado',
        description: 'Plataforma del Banco de la Nación para el pago de tasas y servicios de diversas entidades del Estado.',
        website: 'https://www.pagalo.pe',
        tags: ['Pagos', 'Finanzas', 'Estado']
      },
      {
        provider: 'Facilita',
        category: 'Estado',
        description: 'Herramienta para crear formularios y digitalizar trámites de manera sencilla para entidades públicas.',
        website: 'https://facilita.gob.pe',
        tags: ['Digitalización', 'Trámites', 'Estado']
      },
      {
        provider: 'Casilla Electrónica',
        category: 'Estado',
        description: 'Sistema de notificaciones electrónicas oficiales para comunicaciones seguras con el Estado.',
        website: 'https://www.gob.pe/casilla-electronica',
        tags: ['Notificaciones', 'Legal', 'Estado']
      },
      {
        provider: 'SUNAT',
        category: 'Estado',
        description: 'Operaciones en Línea (SOL) para gestión de tributos, emisión de facturas electrónicas y trámites aduaneros.',
        website: 'https://www.sunat.gob.pe',
        tags: ['Tributos', 'Facturación', 'Estado']
      },
      {
        provider: 'SUNARP',
        category: 'Estado',
        description: 'Servicio de Publicidad Registral en Línea (SPRL) para consulta de títulos, partidas y certificados registrales.',
        website: 'https://www.sunarp.gob.pe',
        tags: ['Registros', 'Propiedad', 'Estado']
      }
    ];

    try {
      setLoading(true);
      for (const platform of platforms) {
        // Check if already exists by provider name
        const exists = solutions.some(s => s.provider === platform.provider);
        if (!exists) {
          await addSolution(platform);
        }
      }
      showToast("Plataformas del Estado cargadas correctamente");
      fetchData();
    } catch (error) {
      showToast("Error al cargar plataformas: " + (error as any).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="text-indigo-600" /> Panel de Administración
          </h1>
          <p className="text-slate-500">Gestiona los recursos, usuarios y métricas de la plataforma.</p>
        </div>
      </div>

      {message && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-xl shadow-lg border animate-in fade-in slide-in-from-top-4 ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
        }`}>
          {message.text}
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">¿Estás seguro?</h3>
              <p className="text-slate-500">Esta acción no se puede deshacer y eliminará permanentemente el registro.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirm(null)}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('marketplace')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'marketplace' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <ShoppingBag size={16} /> Marketplace
        </button>
        <button 
          onClick={() => setActiveTab('companies')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'companies' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Users size={16} /> Empresas
        </button>
        <button 
          onClick={() => setActiveTab('indicators')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'indicators' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <BarChart3 size={16} /> Indicadores
        </button>
        <button 
          onClick={() => setActiveTab('courses')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'courses' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <BookOpen size={16} /> Cursos
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Cargando datos...</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {activeTab === 'marketplace' && (
            <div className="p-8 space-y-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  {editingId ? <Edit2 size={18} /> : <Plus size={18} />} 
                  {editingId ? 'Editar Solución' : 'Agregar Nueva Solución'}
                </h3>
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={handleSeedStatePlatforms}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus size={14} /> Cargar Plataformas del Estado
                  </button>
                </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" placeholder="Proveedor" 
                      className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={solutionForm.provider} onChange={e => setSolutionForm({...solutionForm, provider: e.target.value})}
                    />
                    <select 
                      className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={solutionForm.category} onChange={e => setSolutionForm({...solutionForm, category: e.target.value})}
                    >
                      <option value="ERP">ERP</option>
                      <option value="IA">IA</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finanzas">Finanzas</option>
                      <option value="Estado">Estado</option>
                    </select>
                    <input 
                      type="text" placeholder="Sitio Web (URL)" 
                      className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={solutionForm.website} onChange={e => setSolutionForm({...solutionForm, website: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Tags (separados por coma)" 
                      className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={solutionForm.tags} onChange={e => setSolutionForm({...solutionForm, tags: e.target.value})}
                    />
                    <textarea 
                      placeholder="Descripción" 
                      className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none md:col-span-2"
                      rows={3}
                      value={solutionForm.description} onChange={e => setSolutionForm({...solutionForm, description: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    {editingId && (
                      <button 
                        onClick={() => {setEditingId(null); setSolutionForm({provider: '', category: 'ERP', description: '', website: '', tags: ''})}}
                        className="px-6 py-2 text-slate-500 font-bold hover:text-slate-700"
                      >
                        Cancelar
                      </button>
                    )}
                  <button 
                    onClick={handleSaveSolution}
                    className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={18} /> {editingId ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Proveedor</th>
                      <th className="pb-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Categoría</th>
                      <th className="pb-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Tags</th>
                      <th className="pb-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {solutions.map(sol => (
                      <tr key={sol.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-4">
                          <div className="font-bold text-slate-900">{sol.provider}</div>
                          <div className="text-xs text-slate-400 truncate max-w-[200px]">{sol.website}</div>
                        </td>
                        <td className="py-4">
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase">
                            {sol.category}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-1">
                            {sol.tags?.slice(0, 2).map((t: string) => (
                              <span key={t} className="text-[10px] text-slate-400">#{t}</span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => {
                                setEditingId(sol.id);
                                setSolutionForm({
                                  provider: sol.provider,
                                  category: sol.category,
                                  description: sol.description,
                                  website: sol.website,
                                  tags: sol.tags?.join(', ') || ''
                                });
                              }}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteSolution(sol.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'companies' && (
            <div className="p-8 space-y-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  {editingId ? <Edit2 size={18} /> : <Plus size={18} />} 
                  {editingId ? 'Editar Empresa' : 'Agregar Nueva Empresa'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="Nombre de la Empresa" 
                    className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})}
                  />
                  <input 
                    type="text" placeholder="Sector" 
                    className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={companyForm.sector} onChange={e => setCompanyForm({...companyForm, sector: e.target.value})}
                  />
                  <input 
                    type="text" placeholder="Contacto (Nombre)" 
                    className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={companyForm.contact} onChange={e => setCompanyForm({...companyForm, contact: e.target.value})}
                  />
                  <input 
                    type="email" placeholder="Email" 
                    className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={companyForm.email} onChange={e => setCompanyForm({...companyForm, email: e.target.value})}
                  />
                  <input 
                    type="text" placeholder="Teléfono" 
                    className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={companyForm.phone} onChange={e => setCompanyForm({...companyForm, phone: e.target.value})}
                  />
                  <select 
                    className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={companyForm.status} onChange={e => setCompanyForm({...companyForm, status: e.target.value})}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Diagnosticada">Diagnosticada</option>
                    <option value="En Proceso">En Proceso</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  {editingId && (
                    <button 
                      onClick={() => {setEditingId(null); setCompanyForm({name: '', sector: '', contact: '', email: '', phone: '', status: 'Pendiente'})}}
                      className="px-6 py-2 text-slate-500 font-bold hover:text-slate-700"
                    >
                      Cancelar
                    </button>
                  )}
                  <button 
                    onClick={handleSaveCompany}
                    className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={18} /> {editingId ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Empresa</th>
                      <th className="pb-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Contacto</th>
                      <th className="pb-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Estado</th>
                      <th className="pb-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Madurez</th>
                      <th className="pb-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {companies.map(company => (
                      <tr key={company.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-4">
                          <div className="font-bold text-slate-900">{company.name}</div>
                          <div className="text-xs text-slate-400">{company.sector}</div>
                        </td>
                        <td className="py-4">
                          <div className="text-sm text-slate-600">{company.contact}</div>
                          <div className="text-xs text-slate-400">{company.email}</div>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            company.status === 'Diagnosticada' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {company.status || 'Pendiente'}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="text-sm font-bold text-slate-700">{company.maturityLevel || '-'}</div>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => {
                                setEditingId(company.id);
                                setCompanyForm({
                                  name: company.name || '',
                                  sector: company.sector || '',
                                  contact: company.contact || '',
                                  email: company.email || '',
                                  phone: company.phone || '',
                                  status: company.status || 'Pendiente'
                                });
                              }}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCompany(company.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'indicators' && (
            <div className="p-20 text-center text-slate-400">
              <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
              <p>Gestión de indicadores en desarrollo.</p>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="p-8 space-y-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  {editingId ? <Edit2 size={18} /> : <Plus size={18} />} 
                  {editingId ? 'Editar Curso' : 'Agregar Nuevo Curso'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="Título del Curso" 
                    className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})}
                  />
                  <select 
                    className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={courseForm.dimension} onChange={e => setCourseForm({...courseForm, dimension: e.target.value})}
                  >
                    <option value="Gestión">Gestión</option>
                    <option value="Marketing">Marketing</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Datos">Datos</option>
                    <option value="Automatizacion">Automatizacion</option>
                    <option value="Infraestructura">Infraestructura</option>
                    <option value="IA">IA</option>
                    <option value="Plataformas del Estado">Plataformas del Estado</option>
                    <option value="Otros">Otros</option>
                  </select>
                  <input 
                    type="text" placeholder="URL del material" 
                    className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none md:col-span-2"
                    value={courseForm.url} onChange={e => setCourseForm({...courseForm, url: e.target.value})}
                  />
                  <textarea 
                    placeholder="Descripción" 
                    className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none md:col-span-2"
                    rows={3}
                    value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  {editingId && (
                    <button 
                      onClick={() => {setEditingId(null); setCourseForm({title: '', description: '', url: '', dimension: 'Estrategia'})}}
                      className="px-6 py-2 text-slate-500 font-bold hover:text-slate-700"
                    >
                      Cancelar
                    </button>
                  )}
                  <button 
                    onClick={handleSaveCourse}
                    className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={18} /> {editingId ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Curso</th>
                      <th className="pb-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Dimensión</th>
                      <th className="pb-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {courses.map(course => (
                      <tr key={course.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-4">
                          <div className="font-bold text-slate-900">{course.title}</div>
                          <div className="text-xs text-slate-400 truncate max-w-[300px]">{course.description}</div>
                        </td>
                        <td className="py-4">
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase">
                            {course.dimension}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <a 
                              href={course.url} target="_blank" rel="noopener noreferrer"
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            >
                              <ExternalLink size={16} />
                            </a>
                            <button 
                              onClick={() => {
                                setEditingId(course.id);
                                setCourseForm({
                                  title: course.title,
                                  description: course.description,
                                  url: course.url,
                                  dimension: course.dimension
                                });
                              }}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCourse(course.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
