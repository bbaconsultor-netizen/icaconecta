import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Save, LogOut, Briefcase, Phone } from 'lucide-react';
import { auth } from '../firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { motion } from 'motion/react';
import { updateUserProfile, getUserProfile } from '../services/dbService';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setDisplayName(currentUser.displayName || '');
      loadExtendedProfile(currentUser.uid);
    }
  }, []);

  const loadExtendedProfile = async (uid: string) => {
    const profile = await getUserProfile(uid);
    if (profile) {
      setPosition(profile.position || '');
      setPhone(profile.phone || '');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Update Firebase Auth Profile
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });

      // Update Extended Profile in Firestore
      await updateUserProfile(auth.currentUser.uid, {
        displayName,
        position,
        phone
      });

      setMessage({ type: 'success', text: '¡Perfil actualizado con éxito!' });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: 'Error al actualizar el perfil.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8 h-full flex flex-col justify-center py-12">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold mx-auto border-4 border-white shadow-lg">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              user.displayName ? user.displayName[0].toUpperCase() : <User size={40} />
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">{user.displayName || 'Usuario'}</h1>
          <p className="text-slate-500 font-medium">{user.email}</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-100"
      >
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg mb-2">
              <Shield size={24} className="text-indigo-600" />
              Información de la Cuenta
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tu nombre completo"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Cargo / Función</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Ej: Especialista de Negocios"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Teléfono de Contacto</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+51 ..."
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email"
                  disabled
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 outline-none cursor-not-allowed"
                  value={user.email}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">El correo es administrado por Google y no puede cambiarse aquí.</p>
            </div>
          </div>

          {message.text && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          <div className="flex gap-4">
            <button 
              type="submit"
              disabled={isSaving}
              className={`flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-extrabold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Save size={20} />
              {isSaving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
            
            <button 
              type="button"
              onClick={() => signOut(auth)}
              className="px-6 py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <LogOut size={20} />
              SALIR
            </button>
          </div>
        </form>
      </motion.div>

      <div className="text-center">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
          Acceso Nivel: <span className="text-brand-teal font-extrabold">Colaborador Ica Conecta</span>
        </p>
      </div>
    </div>
  );
}
