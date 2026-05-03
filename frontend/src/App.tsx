import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  ShoppingBag, 
  LogOut, 
  Menu, 
  TrendingUp,
  Settings,
  ShieldAlert,
  BookOpen,
  Store,
  MapPin,
  User
} from 'lucide-react';
import { auth } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { seedDatabase } from './services/seedData';

// Components
import Dashboard from './components/Dashboard';
import CRM from './components/CRM';
import DiagnosticForm from './components/DiagnosticForm';
import Marketplace from './components/Marketplace';
import ProductMarketplace from './components/ProductMarketplace';
import Courses from './components/Courses';
import AdminPanel from './components/AdminPanel';
import Contact from './components/Contact';
import Profile from './components/Profile';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        seedDatabase();
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <img src="/logo.png" alt="Ica Conecta Logo" className="w-64 h-auto mx-auto mb-6 object-contain" />
            <h1 className="text-4xl font-black text-brand-primary mb-2 italic tracking-tight">Ica Conecta</h1>
            <p className="text-slate-600 mb-8 font-medium">Mercado Regional Multisector & Transformación Digital</p>
          <button 
            onClick={handleLogin}
            className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-brand-teal shadow-lg shadow-brand-teal/20 transition-all flex items-center justify-center gap-2"
          >
            Ingresar con Google
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = user?.email === 'bbaconsultor@gmail.com';

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-brand-primary text-white transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
        `}>
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain bg-white rounded-lg p-1 shadow-sm" />
            <h2 className="text-xl font-black italic tracking-tighter">
              Ica Conecta
            </h2>
          </div>
          
          <nav className="mt-6 px-4 space-y-2">
            <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/crm" icon={<Users size={20} />} label="Gestión CRM" onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/diagnostic" icon={<ClipboardCheck size={20} />} label="Diagnóstico" onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/product-marketplace" icon={<Store size={20} />} label="Marketplace" onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/marketplace" icon={<ShoppingBag size={20} />} label="Herramientas" onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/courses" icon={<BookOpen size={20} />} label="Cursos" onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/contact" icon={<MapPin size={20} />} label="Contacto" onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/profile" icon={<User size={20} />} label="Mi Perfil" onClick={() => setIsSidebarOpen(false)} />
            {isAdmin && (
              <SidebarLink to="/admin" icon={<Settings size={20} />} label="Administración" onClick={() => setIsSidebarOpen(false)} />
            )}
          </nav>

          <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4 px-2">
              <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full ring-2 ring-brand-teal/30" referrerPolicy="no-referrer" />
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user.displayName}</p>
                <p className="text-xs text-white/50 truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-2 py-2 text-white/60 hover:text-white transition-colors text-sm font-medium"
            >
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8">
            <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="flex-1"></div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/crm" element={<CRM />} />
              <Route path="/diagnostic" element={<DiagnosticForm />} />
              <Route path="/product-marketplace" element={<ProductMarketplace />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
            </Routes>
          </div>
        </main>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </Router>
  );
}

function SidebarLink({ to, icon, label, onClick }: { to: string, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-200 group"
    >
      <div className="group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="font-semibold tracking-tight">{label}</span>
    </Link>
  );
}

