import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
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
          <h1 className="text-4xl font-black tracking-tight">Términos y Condiciones</h1>
          <p className="text-white/70 mt-2">Última actualización: {new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 prose prose-slate">
        <section className="space-y-6 text-slate-700 leading-relaxed">
          <p>
            Bienvenido(a) a <strong>Ica Conecta</strong>. Al acceder y utilizar nuestra plataforma <a href="https://icaconecta.com" className="text-brand-teal underline">icaconecta.com</a>, aceptas estos Términos y Condiciones en su totalidad. Si no estás de acuerdo, te pedimos no usar el servicio.
          </p>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">1. Sobre Ica Conecta</h2>
          <p>
            Ica Conecta es una plataforma digital operada por <strong>BBA Consultor</strong>, orientada a apoyar la transformación digital de las micro, pequeñas y medianas empresas (MIPYMEs) de la región Ica, Perú, mediante:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Un CRM empresarial para registro de empresas y su estado de transformación.</li>
            <li>Un sistema de autodiagnóstico de madurez digital con asistencia de inteligencia artificial.</li>
            <li>Un marketplace regional multisector (frutas, hortalizas, tubérculos, granos, agroindustria, pecuario, insumos, servicios).</li>
            <li>Un catálogo de herramientas y soluciones tecnológicas recomendadas.</li>
            <li>Cursos y recursos educativos.</li>
            <li>Un asistente virtual con IA especializado en transformación digital agropecuaria.</li>
          </ul>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">2. Registro y cuenta de usuario</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Para usar las funciones principales, debes iniciar sesión con una cuenta válida de Google.</li>
            <li>Eres responsable de mantener la confidencialidad de tu cuenta y de toda actividad realizada desde ella.</li>
            <li>Te comprometes a proveer información veraz, actual y exacta (especialmente datos de empresa, RUC, productos publicados).</li>
            <li>Debes ser mayor de 18 años o tener autorización del representante legal de la empresa.</li>
          </ul>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">3. Uso permitido</h2>
          <p>Al usar la plataforma te comprometes a NO:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Publicar productos ilegales, prohibidos o que infrinjan derechos de terceros.</li>
            <li>Publicar productos falsificados, robados o que no te pertenezcan.</li>
            <li>Suplantar la identidad de otra persona, empresa o entidad.</li>
            <li>Difundir contenido ofensivo, discriminatorio, violento o ilícito.</li>
            <li>Realizar ingeniería inversa, scraping masivo o ataques contra la plataforma.</li>
            <li>Usar la plataforma con fines fraudulentos o de spam.</li>
            <li>Compartir información falsa en el RUC u otros campos de validación oficial.</li>
          </ul>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">4. Marketplace de productos</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Ica Conecta actúa solo como facilitador del contacto entre productores y compradores. <strong>No interviene en las transacciones comerciales</strong>, no procesa pagos ni garantiza la calidad de los productos.</li>
            <li>Las negociaciones, pagos, entregas y reclamos se realizan directamente entre las partes.</li>
            <li>Ica Conecta NO se hace responsable por incumplimientos, fraudes o pérdidas entre usuarios.</li>
            <li>Recomendamos verificar la identidad y reputación de la otra parte antes de cualquier transacción.</li>
          </ul>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">5. Diagnóstico con Inteligencia Artificial</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Los reportes generados por la IA son <strong>orientativos</strong>. Son recomendaciones basadas en patrones, no asesoría profesional formal.</li>
            <li>Las cifras de inversión, ROI y plazos son estimaciones. Pueden variar según el contexto real de tu empresa.</li>
            <li>Antes de tomar decisiones financieras importantes, recomendamos consultar con un asesor especializado.</li>
            <li>El asistente virtual está limitado a 6 preguntas por sesión por usuario.</li>
          </ul>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">6. Propiedad intelectual</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>La marca <strong>Ica Conecta</strong>, su logo, diseño y código fuente son propiedad de BBA Consultor.</li>
            <li>Los productos, descripciones e imágenes que publicas siguen siendo de tu propiedad, pero nos otorgas una licencia no exclusiva para mostrarlos en la plataforma.</li>
            <li>El contenido educativo (cursos) es propiedad de Ica Conecta y/o sus respectivos autores. No puede ser redistribuido sin autorización.</li>
          </ul>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">7. Limitación de responsabilidad</h2>
          <p>
            Ica Conecta se proporciona "tal cual" sin garantías de ningún tipo. No nos hacemos responsables por:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Pérdidas comerciales o financieras derivadas del uso del servicio.</li>
            <li>Inactividades temporales del servicio o errores técnicos.</li>
            <li>Decisiones empresariales tomadas en base a los diagnósticos o recomendaciones.</li>
            <li>Transacciones entre usuarios del marketplace.</li>
            <li>Información incorrecta proporcionada por terceros (ej. APIs gubernamentales).</li>
          </ul>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">8. Suspensión o eliminación de cuentas</h2>
          <p>
            Nos reservamos el derecho de suspender o eliminar cuentas que incumplan estos términos, sin previo aviso, especialmente en casos de:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Publicaciones fraudulentas o engañosas.</li>
            <li>Uso indebido del asistente virtual o de otras funciones.</li>
            <li>Reportes reiterados de otros usuarios.</li>
            <li>Actividades ilegales o que perjudiquen a la plataforma.</li>
          </ul>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">9. Modificaciones</h2>
          <p>
            Podemos actualizar estos términos en cualquier momento. Te notificaremos cambios importantes mediante un aviso en la plataforma. Si continúas usando Ica Conecta después de una actualización, se entiende que aceptas los nuevos términos.
          </p>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">10. Ley aplicable y jurisdicción</h2>
          <p>
            Estos términos se rigen por las leyes de la República del Perú. Cualquier controversia será resuelta en los juzgados de la ciudad de Ica, Perú.
          </p>

          <h2 className="text-2xl font-bold text-brand-primary mt-8">11. Contacto</h2>
          <p>Para cualquier consulta sobre estos términos:</p>
          <p>
            <strong>BBA Consultor — Ica Conecta</strong><br />
            Correo: <a href="mailto:bbaconsultor@gmail.com" className="text-brand-teal underline">bbaconsultor@gmail.com</a><br />
            Sitio web: <a href="https://icaconecta.com" className="text-brand-teal underline">icaconecta.com</a>
          </p>
        </section>
      </main>

      <footer className="bg-slate-100 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Ica Conecta · Todos los derechos reservados ·
        <Link to="/privacidad" className="text-brand-teal hover:underline ml-2">Política de Privacidad</Link>
      </footer>
    </div>
  );
}
