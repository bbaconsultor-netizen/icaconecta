import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  const contactInfo = [
    {
      icon: <MapPin className="text-emerald-500" size={24} />,
      title: "Dirección",
      value: "Av. Los Incas 450",
      description: "Ica - Perú",
      actionLabel: "Ver en Google Maps",
      link: "https://www.google.com/maps/search/Av.+Los+Incas+450+Ica"
    },
    {
      icon: <Phone className="text-sky-500" size={24} />,
      title: "Teléfono",
      value: "+51 947 413 103",
      description: "Atención inmediata por WhatsApp",
      actionLabel: "Llamar ahora",
      link: "tel:+51947413103"
    },
    {
      icon: <Mail className="text-indigo-500" size={24} />,
      title: "Correo Electrónico",
      value: "info@icaconecta.com",
      description: "Consultas corporativas y soporte",
      actionLabel: "Enviar correo",
      link: "mailto:info@icaconecta.com"
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 bg-brand-teal/10 text-brand-teal rounded-full text-sm font-black tracking-widest uppercase"
        >
          Ica Conecta - Canales de Atención
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-extrabold text-slate-900"
        >
          Estamos para ayudarte
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 max-w-2xl mx-auto text-lg font-medium"
        >
          ¿Tienes consultas sobre Ica Conecta o el Marketplace regional? Contáctanos por cualquiera de nuestros canales oficiales.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactInfo.map((info, index) => (
          <motion.a
            href={info.link}
            target="_blank"
            rel="noopener noreferrer"
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="group bg-white p-8 rounded-3xl border border-slate-200 hover:border-brand-teal hover:shadow-xl hover:shadow-brand-teal/10 transition-all text-center flex flex-col items-center"
          >
            <div className="p-4 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform mb-6">
              {info.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{info.title}</h3>
            <p className="text-brand-primary font-black mb-2">{info.value}</p>
            <p className="text-sm text-slate-400 mb-6 font-medium">{info.description}</p>
            
            <div className="mt-auto flex items-center gap-2 text-sm font-bold text-slate-500 group-hover:text-brand-teal transition-colors">
              {info.actionLabel} <ChevronRight size={16} />
            </div>
          </motion.a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Map Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg h-[450px] relative"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15444.6!2d-75.7!3d-14.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9110e2?2sIca!5e0!3m2!1ses!2spe!4v1"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Ica Conecta"
          ></iframe>
        </motion.div>

        {/* WhatsApp Quick Link */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 bg-brand-primary rounded-3xl p-8 text-white flex flex-col justify-center items-center text-center shadow-xl shadow-brand-primary/20"
        >
          <div className="p-5 bg-white/20 backdrop-blur-md rounded-3xl mb-6">
            <MessageSquare size={48} className="text-white" />
          </div>
          <h2 className="text-2xl font-extrabold mb-4">¿Prefieres chatear?</h2>
          <p className="text-slate-100 mb-8 leading-relaxed font-light">
            Nuestro equipo de soporte está disponible de Lunes a Sábado para resolver tus dudas técnicas sobre Ica Conecta.
          </p>
          <a 
            href="https://wa.me/51947413103?text=Hola, vengo de la plataforma Ica Conecta y necesito información."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white text-brand-primary py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            Abrir WhatsApp <ExternalLink size={20} />
          </a>
          <div className="mt-8 flex items-center gap-4 text-xs font-bold text-slate-300">
            <div className="flex items-center gap-1">
              <Clock size={14} /> 8:00 AM - 6:00 PM
            </div>
            <div className="h-1 w-1 bg-white rounded-full"></div>
            <span>Respuesta en minutos</span>
          </div>
        </motion.div>
      </div>

      {/* Footer Note */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center pt-8"
      >
        <p className="text-slate-400 text-sm font-bold tracking-tight">
          &copy; {new Date().getFullYear()} Ica Conecta - Mercado Regional Multisector & Transformación Digital.
        </p>
      </motion.div>
    </div>
  );
}
