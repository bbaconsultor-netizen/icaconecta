import React, { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, Building2, Tag, Globe, MapPin, User } from 'lucide-react';
import { auth } from '../firebase';
import { getCompanies, addCompany, updateCompany } from '../services/dbService';

export default function CRM() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCompany, setNewCompany] = useState({
    ruc: '',
    name: '',
    legalRepresentative: '',
    sector: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    region: 'Ica',
    province: 'Ica',
    district: '',
    status: 'Sensibilizada'
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    // Solo mostramos las empresas del usuario actual
    // Si es el admin, podría ver todas, pero el requisito dice que cada usuario ve las suyas.
    // Para el CRM de usuario común, filtramos por su UID.
    const isAdmin = user.email === 'bbaconsultor@gmail.com';
    const data = await getCompanies(isAdmin ? undefined : user.uid);
    setCompanies(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentId) {
        await updateCompany(currentId, newCompany);
      } else {
        await addCompany(newCompany);
      }
      
      setIsModalOpen(false);
      setIsEditing(false);
      setCurrentId(null);
      fetchCompanies();
      resetForm();
    } catch (error) {
      console.error("Error saving company:", error);
      alert("Hubo un error al guardar los datos de la empresa.");
    }
  };

  const handleRucConsult = async () => {
    if (newCompany.ruc.length !== 11) {
      alert("El RUC debe tener exactamente 11 dígitos");
      return;
    }

    setIsConsulting(true);
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
      const response = await fetch(`${BACKEND_URL}/api/sunat/${newCompany.ruc}`);
      const result = await response.json();

      if (result.success && result.data) {
        fillCompanyData(result.data);
      } else {
        const msg = result.detail?.message || result.message || "No se pudo obtener información oficial de SUNAT para este RUC. Verifica que el número sea correcto y que tus credenciales de API estén vigentes.";
        alert(msg);
      }
    } catch (error: any) {
      console.error("Error consultando proxy SUNAT:", error);
      alert("Error crítico al conectar con el servidor de consulta SUNAT.");
    } finally {
      setIsConsulting(false);
    }
  };

  const fillCompanyData = (info: any) => {
    setNewCompany(prev => ({
      ...prev,
      name: info.nombre_o_razon_social || info.nombre || info.ddp_nombre || '',
      address: info.direccion_completa || info.direccion || '',
      district: info.distrito || info.desc_dist || '',
      province: info.provincia || info.desc_prov || '',
      region: info.departamento || info.region || info.desc_dep || '',
      legalRepresentative: info.representante_legal || info.representante_legal?.nombre || info.representante || '',
    }));
  };

  const handleEdit = (company: any) => {
    setNewCompany({
      ruc: company.ruc || '',
      name: company.name || '',
      legalRepresentative: company.legalRepresentative || '',
      sector: company.sector || '',
      contactName: company.contactName || '',
      email: company.email || '',
      phone: company.phone || '',
      website: company.website || '',
      address: company.address || '',
      region: company.region || 'Ica',
      province: company.province || 'Ica',
      district: company.district || '',
      status: company.status || 'Sensibilizada'
    });
    setCurrentId(company.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNewCompany({
      ruc: '',
      name: '',
      legalRepresentative: '',
      sector: '',
      contactName: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      region: 'Ica',
      province: 'Ica',
      district: '',
      status: 'Sensibilizada'
    });
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.ruc.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión CRM Empresarial</h1>
          <p className="text-slate-500">Registro y seguimiento de empresas atendidas.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-teal transition-all flex items-center gap-2 shadow-lg shadow-brand-teal/20"
        >
          <Plus size={20} />
          Nueva Empresa
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por RUC o Razón Social..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Company List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Empresa</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contacto</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Madurez</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredCompanies.map((company) => (
              <tr 
                key={company.id} 
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => handleEdit(company)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-teal/10 rounded-lg flex items-center justify-center text-brand-teal">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{company.name}</p>
                      <p className="text-xs text-slate-500">RUC: {company.ruc}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="text-slate-900 font-medium">{company.contactName}</p>
                    <div className="flex items-center gap-3 mt-1 text-slate-500">
                      <Mail size={14} />
                      <Phone size={14} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(company.status)}`}>
                    {company.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Tag size={14} />
                    {company.maturityLevel || 'No diagnosticada'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {isEditing ? 'Editar Empresa' : 'Registrar Nueva Empresa'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="rotate-45" size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* RUC and Name */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">RUC</label>
                  <div className="flex gap-2">
                    <input 
                      required
                      type="text" 
                      maxLength={11}
                      placeholder="11 dígitos"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newCompany.ruc}
                      onChange={(e) => setNewCompany({...newCompany, ruc: e.target.value.replace(/\D/g, '')})}
                    />
                    <button
                      type="button"
                      onClick={handleRucConsult}
                      disabled={isConsulting || newCompany.ruc.length !== 11}
                      className={`px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all ${
                        (isConsulting || newCompany.ruc.length !== 11) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-600'
                      }`}
                    >
                      {isConsulting ? '...' : <Search size={16} />}
                    </button>
                  </div>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Sector</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newCompany.sector}
                    onChange={(e) => setNewCompany({...newCompany, sector: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Agro">Agro</option>
                    <option value="Comercio">Comercio</option>
                    <option value="Manufactura">Manufactura</option>
                    <option value="Servicios">Servicios</option>
                    <option value="Turismo">Turismo</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Razón Social</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Nombre oficial de la empresa"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Representante Legal</label>
                  <input 
                    type="text" 
                    placeholder="Nombre completo"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newCompany.legalRepresentative}
                    onChange={(e) => setNewCompany({...newCompany, legalRepresentative: e.target.value})}
                  />
                </div>

                {/* Contact Info */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nombre Contacto</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newCompany.contactName}
                    onChange={(e) => setNewCompany({...newCompany, contactName: e.target.value})}
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Teléfono</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newCompany.phone}
                    onChange={(e) => setNewCompany({...newCompany, phone: e.target.value})}
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                  <input 
                    required
                    type="email" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newCompany.email}
                    onChange={(e) => setNewCompany({...newCompany, email: e.target.value})}
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Página Web</label>
                  <input 
                    type="url" 
                    placeholder="https://ejemplo.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newCompany.website}
                    onChange={(e) => setNewCompany({...newCompany, website: e.target.value})}
                  />
                </div>

                {/* Geography */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Dirección</label>
                  <input 
                    type="text" 
                    placeholder="Calle, Jr., Av. y Número"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newCompany.address}
                    onChange={(e) => setNewCompany({...newCompany, address: e.target.value})}
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Departamento/Región</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newCompany.region}
                    onChange={(e) => setNewCompany({...newCompany, region: e.target.value})}
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Provincia</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newCompany.province}
                    onChange={(e) => setNewCompany({...newCompany, province: e.target.value})}
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Distrito</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newCompany.district}
                    onChange={(e) => setNewCompany({...newCompany, district: e.target.value})}
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Estado en Proceso</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newCompany.status}
                    onChange={(e) => setNewCompany({...newCompany, status: e.target.value})}
                  >
                    <option value="Sensibilizada">Sensibilizada</option>
                    <option value="Diagnosticada">Diagnosticada</option>
                    <option value="En Transformación">En Transformación</option>
                    <option value="Transformada">Transformada</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all font-mono"
                >
                  CANCELAR
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-teal/20 hover:bg-brand-teal transition-all"
                >
                  {isEditing ? 'GUARDAR CAMBIOS' : 'REGISTRAR EMPRESA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Sensibilizada': return 'bg-blue-100 text-blue-700';
    case 'Diagnosticada': return 'bg-violet-100 text-violet-700';
    case 'En Transformación': return 'bg-pink-100 text-pink-700';
    case 'Transformada': return 'bg-emerald-100 text-emerald-700';
    default: return 'bg-slate-100 text-slate-700';
  }
}
