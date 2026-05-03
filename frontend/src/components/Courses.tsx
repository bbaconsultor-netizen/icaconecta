import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Search, Filter } from 'lucide-react';
import { getCourses } from '../services/dbService';

const DIMENSIONS = ["Gestión", "Marketing", "E-commerce", "Datos", "Automatizacion", "Infraestructura", "IA", "Plataformas del Estado", "Otros"];

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDimension, setSelectedDimension] = useState<string>('Todas');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDimension = selectedDimension === 'Todas' || course.dimension === selectedDimension;
    return matchesSearch && matchesDimension;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Centro de Capacitación</h1>
          <p className="text-slate-500">Recursos educativos para potenciar tu transformación digital.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar cursos..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-slate-400 w-5 h-5" />
          <select
            className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={selectedDimension}
            onChange={(e) => setSelectedDimension(e.target.value)}
          >
            <option value="Todas">Todas las Dimensiones</option>
            {DIMENSIONS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                    {course.dimension}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{course.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-3">{course.description}</p>
                </div>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700"
                >
                  Acceder al curso
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">No se encontraron cursos</h3>
          <p className="text-slate-500">Intenta ajustar tus filtros de búsqueda.</p>
        </div>
      )}
    </div>
  );
}
