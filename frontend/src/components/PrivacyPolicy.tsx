import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-brand-primary text-white py-8">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            to="/"
            data-testid="back-to-home"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
          <h1 className="text-4xl font-black tracking-tight">Política de Privacidad</h1>
          <p className="text-white/70 mt-2">Última actualización: {new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 prose prose-slate">
        <section className="space-y-6 text-slate-700 leading-relaxed">
          <p>
            En <strong>Ica Conecta</strong> (operado por <strong>BBA Consultor</strong>, en adelante "nosotros", "la Plataforma" o "el Servicio"), respetamos tu privacidad y nos comprometemos a proteger los datos personales que compartes con nosotros al utilizar <a href="https://icaconecta.com" className="text-brand-teal underline">icaconecta.com</a>.
          </p>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">1. Información que recopilamos</h2>
          <p>Cuando te registras o utilizas Ica Conecta, podemos recopilar:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Datos de cuenta Google:</strong> nombre, correo electrónico, foto de perfil (provistos por Firebase Authentication al iniciar sesión con Google).</li>
            <li><strong>Datos de tu empresa:</strong> RUC, razón social, dirección, departamento, provincia, distrito, sector, estado de transformación digital.</li>
            <li><strong>Datos de diagnóstico:</strong> respuestas que ingresas en los autodiagnósticos de madurez digital y los reportes generados.</li>
            <li><strong>Productos publicados:</strong> título, descripción, precio, imagen y categoría de los productos que ofreces en el marketplace.</li>
            <li><strong>Interacciones con el asistente IA:</strong> preguntas que envías al asesor agro digital (no se almacenan a largo plazo).</li>
            <li><strong>Datos de navegación:</strong> páginas visitadas, tiempo en cada sección, dispositivo y navegador (vía Google Analytics).</li>
          </ul>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">2. Cómo usamos tu información</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Proveer y mejorar las funcionalidades de la plataforma (CRM, diagnóstico, marketplace, cursos).</li>
            <li>Generar reportes personalizados de transformación digital usando IA.</li>
            <li>Facilitar el contacto entre productores y compradores en el marketplace regional.</li>
            <li>Validar información empresarial contra fuentes oficiales (SUNAT vía ApisPeru).</li>
            <li>Mostrar métricas agregadas y anónimas en el Dashboard de Indicadores.</li>
            <li>Enviarte comunicaciones sobre nuevas funcionalidades o cursos (solo si lo aceptas).</li>
          </ul>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">3. Compartir información</h2>
          <p>NO vendemos tus datos personales. Solo los compartimos en estos casos:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Otros usuarios de la plataforma:</strong> nombre de tu empresa, productos publicados y datos de contacto que tú elijas mostrar son visibles para otros usuarios autenticados (ej. en el marketplace y dashboard global).</li>
            <li><strong>Proveedores de servicios:</strong> Google Firebase (autenticación y base de datos), Google Cloud (Gemini AI), ApisPeru (validación RUC), Google AdSense (publicidad), Google Analytics (análisis de tráfico).</li>
            <li><strong>Cumplimiento legal:</strong> si una autoridad competente lo requiere por mandato judicial o investigación oficial.</li>
          </ul>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">4. Cookies y tecnologías similares</h2>
          <p>Usamos cookies y tecnologías similares para:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Mantener tu sesión iniciada (Firebase Auth).</li>
            <li>Analizar el uso del sitio (Google Analytics: <code>G-6JDR6G052Q</code>).</li>
            <li>Mostrar anuncios relevantes (Google AdSense: <code>ca-pub-5463278805668136</code>).</li>
          </ul>
          <p>Puedes deshabilitar las cookies desde la configuración de tu navegador, pero algunas funciones (como el inicio de sesión) podrían dejar de funcionar.</p>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">5. Google AdSense y publicidad personalizada</h2>
          <p>
            Ica Conecta utiliza Google AdSense para mostrar anuncios. Google y sus socios pueden usar cookies para mostrarte anuncios basados en tus visitas a este y otros sitios web. Puedes administrar tus preferencias de anuncios visitando{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-brand-teal underline">Configuración de anuncios de Google</a>.
          </p>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">6. Tus derechos (Ley N° 29733 — Perú / GDPR)</h2>
          <p>Tienes derecho a:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Acceder a tus datos personales.</li>
            <li>Rectificar información incorrecta.</li>
            <li>Solicitar la eliminación de tu cuenta y todos tus datos asociados.</li>
            <li>Oponerte al tratamiento de tus datos.</li>
            <li>Retirar tu consentimiento en cualquier momento.</li>
          </ul>
          <p>Para ejercer cualquiera de estos derechos, escríbenos a <a href="mailto:bbaconsultor@gmail.com" className="text-brand-teal underline">bbaconsultor@gmail.com</a>.</p>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">7. Seguridad</h2>
          <p>Tus datos están almacenados en servidores seguros de Google Firebase con cifrado en tránsito (HTTPS) y en reposo. La autenticación se realiza vía Google OAuth — nunca almacenamos tu contraseña.</p>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">8. Cambios a esta política</h2>
          <p>Podemos actualizar esta política periódicamente. Te avisaremos de cambios importantes mediante un aviso en la plataforma. La fecha de la última actualización aparece al inicio de este documento.</p>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">9. Contacto</h2>
          <p>Si tienes preguntas sobre esta política, escríbenos a:</p>
          <p>
            <strong>BBA Consultor — Ica Conecta</strong><br />
            Correo: <a href="mailto:bbaconsultor@gmail.com" className="text-brand-teal underline">bbaconsultor@gmail.com</a><br />
            Sitio web: <a href="https://icaconecta.com" className="text-brand-teal underline">icaconecta.com</a>
          </p>
        </section>
      </main>

      <footer className="bg-slate-100 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Ica Conecta · Todos los derechos reservados ·
        <Link to="/terminos" className="text-brand-teal hover:underline ml-2">Términos y Condiciones</Link>
      </footer>
    </div>
  );
}
