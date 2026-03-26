import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Users, ClipboardCheck, CheckCircle } from 'lucide-react';
import { getCompanies, getIndicators } from '../services/dbService';

export default function Dashboard() {
  const [stats, setStats] = useState({
    sensitized: 0,
    diagnosed: 0,
    transforming: 0,
    transformed: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const companies = await getCompanies();
      const counts = {
        sensitized: companies.filter((c: any) => c.status === 'Sensibilizada').length,
        diagnosed: companies.filter((c: any) => c.status === 'Diagnosticada').length,
        transforming: companies.filter((c: any) => c.status === 'En Transformación').length,
        transformed: companies.filter((c: any) => c.status === 'Transformada').length
      };
      setStats(counts);
    };
    fetchStats();
  }, []);

  const data = [
    { name: 'Sensibilizadas', value: stats.sensitized },
    { name: 'Diagnosticadas', value: stats.diagnosed },
    { name: 'En Proceso', value: stats.transforming },
    { name: 'Transformadas', value: stats.transformed },
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard de Indicadores</h1>
          <p className="text-slate-500">Monitoreo en tiempo real del impacto CSTD.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600">
          Marzo 2026
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<TrendingUp className="text-indigo-600" />} label="Sensibilizadas" value={stats.sensitized} color="bg-indigo-50" />
        <StatCard icon={<ClipboardCheck className="text-violet-600" />} label="Diagnosticadas" value={stats.diagnosed} color="bg-violet-50" />
        <StatCard icon={<Users className="text-pink-600" />} label="En Proceso" value={stats.transforming} color="bg-pink-50" />
        <StatCard icon={<CheckCircle className="text-emerald-600" />} label="Transformadas" value={stats.transformed} color="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Empresas por Estado</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  cursor={{fill: '#f8fafc'}}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Distribución de Impacto</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {data.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
                <span className="text-xs text-slate-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
