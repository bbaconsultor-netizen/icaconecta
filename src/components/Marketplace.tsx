import { useState, useEffect } from 'react';
import { ShoppingBag, ExternalLink, Search, Filter, Megaphone, Wallet, LayoutGrid, Cpu, ShoppingCart, Building2 } from 'lucide-react';
import { getSolutions } from '../services/dbService';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Marketing': return <Megaphone size={24} />;
    case 'Finanzas': return <Wallet size={24} />;
    case 'ERP': return <LayoutGrid size={24} />;
    case 'IA': return <Cpu size={24} />;
    case 'E-commerce': return <ShoppingCart size={24} />;
    case 'Estado': return <Building2 size={24} />;
    default: return <ShoppingBag size={24} />;
  }
};

export default function Marketplace() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Todas');

  useEffect(() => {
    const fetchSolutions = async () => {
      const data = await getSolutions();
      setSolutions(data);
    };
    fetchSolutions();
  }, []);

  const categories = ['Todas', 'ERP', 'IA', 'E-commerce', 'Marketing', 'Finanzas', 'Estado'];

  const filteredSolutions = solutions.filter(s => 
    (category === 'Todas' || s.category === category) &&
    (s.provider.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Marketplace de Soluciones Digitales</h1>
        <p className="text-slate-500">Directorio articulado de proveedores y herramientas para la transformación.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar soluciones..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3">
          <Filter size={18} className="text-slate-400" />
          <select 
            className="py-3 bg-transparent focus:outline-none text-slate-600 font-medium"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSolutions.length > 0 ? (
          filteredSolutions.map((solution) => (
            <div key={solution.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  {getCategoryIcon(solution.category)}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                  {solution.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{solution.provider}</h3>
              <p className="text-slate-600 text-sm mb-6 flex-1">{solution.description}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <div className="flex gap-2">
                  {solution.tags?.slice(0, 2).map((tag: string) => (
                    <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded">#{tag}</span>
                  ))}
                </div>
                <a 
                  href={solution.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm font-semibold"
                >
                  Ver más
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-slate-400">
            No se encontraron soluciones que coincidan con tu búsqueda.
          </div>
        )}
      </div>
    </div>
  );
}
