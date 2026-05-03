import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Tag, 
  Image as ImageIcon, 
  X,
  Store,
  Filter,
  Package,
  Calendar,
  AlertCircle,
  Upload,
  Clock
} from 'lucide-react';
import { auth } from '../firebase';
import { getProducts, addProduct, deleteProduct, updateProduct } from '../services/dbService';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const CATEGORIES = [
  "Todas",
  "Agricultura", 
  "Agroindustria", 
  "Pesca y Acuicultura", 
  "Turismo y Artesanía", 
  "Minería", 
  "Industria"
];

export default function ProductMarketplace() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Agricultura',
    imageUrl: '',
    status: 'Disponible'
  });

  const user = auth.currentUser;
  const isAdmin = user?.email === 'bbaconsultor@gmail.com';

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts(selectedCategory);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    // Quick preview
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, imageUrl: previewUrl }));

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Resize to a maximum dimension of 600px for web optimization
        const MAX_DIM = 600;
        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress the image as JPEG with 50% quality
        let compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5);
        
        // Ensure it fits within Firestore's 1MB document limit (accounting for other fields)
        if (compressedDataUrl.length > 800000) {
          compressedDataUrl = canvas.toDataURL('image/jpeg', 0.3);
        }
        
        setFormData(prev => ({ ...prev, imageUrl: compressedDataUrl }));
        console.log("Image optimized for storage. Size:", Math.round(compressedDataUrl.length / 1024), "KB");
        setUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const usePlaceholder = () => {
    const placeholder = "https://images.unsplash.com/photo-1595113333454-e03a9588667c?q=80&w=800&auto=format&fit=crop";
    setFormData(prev => ({ ...prev, imageUrl: placeholder }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0
      };

      if (isEditing && currentProductId) {
        await updateProduct(currentProductId, productData);
      } else {
        await addProduct(productData);
      }

      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      console.error("Error saving product:", error);
      let errorMessage = "Hubo un error inesperado al guardar el producto.";
      
      try {
        const firestoreError = JSON.parse(error.message);
        if (firestoreError.error.toLowerCase().includes("size of this document is too large")) {
          errorMessage = "La imagen es demasiado grande. Por favor, intenta con una imagen de menor tamaño o usa el botón 'Usar Imagen de Muestra'.";
        } else if (firestoreError.error.toLowerCase().includes("not-found")) {
          errorMessage = "No se encontró el producto para actualizar.";
        } else if (firestoreError.error.toLowerCase().includes("permission-denied")) {
          errorMessage = "No tienes permisos para realizar esta acción.";
        }
      } catch (e) {
        // Not a JSON error message
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      title: product.title,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      imageUrl: product.imageUrl || '',
      status: product.status
    });
    setCurrentProductId(product.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta publicación?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: 'Agricultura',
      imageUrl: '',
      status: 'Disponible'
    });
    setIsEditing(false);
    setCurrentProductId(null);
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Reciente';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "d 'de' MMMM", { locale: es });
    } catch (e) {
      return 'Reciente';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Marketplace de Productos</h1>
          <p className="text-slate-500 font-medium tracking-tight">Compra y vende productos directamente en la red de Ica Conecta.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          Publicar Producto
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o descripción..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
              >
                <div className="aspect-square bg-slate-100 relative overflow-hidden">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageIcon size={48} strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="bg-white/90 backdrop-blur-sm text-slate-900 px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                      {product.category}
                    </span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold shadow-sm ${
                      product.status === 'Disponible' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(product.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.title}</h3>
                    <p className="text-lg font-bold text-indigo-600">S/ {product.price}</p>
                  </div>
                  
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                    {product.description || "Sin descripción detallada."}
                  </p>

                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-4 text-xs text-slate-400">
                      <Store size={14} />
                      <span className="font-medium text-slate-600 truncate">{product.sellerName}</span>
                    </div>

                    <div className="flex gap-2">
                      <a 
                        href={`https://wa.me/?text=Hola, estoy interesado en tu producto: ${product.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-slate-900 text-white py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors text-center"
                      >
                        Contactar
                      </a>
                      {(isAdmin || product.uid === user?.uid) && (
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleEdit(product)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Plus className="rotate-45" size={20} />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Eliminar"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <ShoppingBag className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-900">No hay productos publicados</h3>
          <p className="text-slate-500">Sé el primero en publicar una oferta en esta categoría.</p>
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    {isEditing ? <Plus className="rotate-45 text-indigo-600" /> : <Plus className="text-indigo-600" />}
                    {isEditing ? 'Editar Publicación' : 'Nueva Publicación'}
                  </h2>
                  {!isEditing && <p className="text-xs text-indigo-600 mt-1 font-semibold">La fecha se asignará automáticamente</p>}
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Image Upload Area */}
                <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <label className="text-sm font-bold text-slate-700 block">Fotografía del Producto</label>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-inner">
                      {formData.imageUrl ? (
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={40} className="text-slate-300" strokeWidth={1} />
                      )}
                    </div>
                    <div className="flex-1 space-y-3 w-full">
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        Sube una foto clara de tu producto. El sistema la optimizará automáticamente.
                      </p>
                      
                      <div className="flex flex-col md:flex-row gap-2">
                        <label 
                          htmlFor="product-upload-input"
                          className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all text-sm w-full md:w-max"
                        >
                          <Upload size={18} />
                          {uploading ? 'Procesando...' : (formData.imageUrl ? 'Cambiar Imagen' : 'Seleccionar Foto')}
                        </label>
                        <input 
                          id="product-upload-input"
                          type="file" 
                          className="sr-only" 
                          onChange={handleFileUpload}
                          accept="image/*"
                        />
                        
                        <button 
                          type="button"
                          onClick={usePlaceholder}
                          className="px-4 py-3 bg-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-300 transition-all"
                        >
                          Usar Imagen de Muestra
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Nombre del Producto</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Ej: Uvas Red Globe Premium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Precio (S/.)</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Categoría</label>
                    <select 
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      {CATEGORIES.slice(1).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Estado</label>
                    <select 
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Vendido">Vendido</option>
                      <option value="Pausado">Pausado</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Descripción / Características</label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Detalla las características, peso, calidad, etc."
                  />
                </div>

                <div className="flex items-center gap-4 py-2 px-4 bg-slate-50 rounded-xl border border-slate-100">
                  <AlertCircle size={20} className="text-indigo-500 flex-shrink-0" />
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Tu nombre aparecerá como vendedor automáticamente. Los interesados podrán contactarte directamente por WhatsApp.
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={uploading || isSubmitting}
                  className={`w-full bg-indigo-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 ${
                    (uploading || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                  }`}
                >
                  {uploading ? 'Procesando imagen...' : isSubmitting ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Publicar Ahora')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
