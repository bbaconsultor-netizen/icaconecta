import { Category } from './diagnosticQuestions';

export const marketingDiagnosticCategories: Category[] = [
  {
    id: 'estrategia_marca',
    title: 'Estrategia y Marca',
    icon: '🎯',
    questions: [
      {
        id: 'em1',
        text: '¿Tienes definida una propuesta de valor clara y diferenciada?',
        options: [
          { value: 1, label: 'No, vendemos lo mismo que la competencia' },
          { value: 2, label: 'Tenemos una idea, pero no está escrita' },
          { value: 3, label: 'Está definida pero no se comunica bien' },
          { value: 4, label: 'Está definida y es el eje de nuestra comunicación' },
          { value: 5, label: 'Es única, validada y reconocida por el mercado' }
        ]
      },
      {
        id: 'em2',
        text: '¿Conoces detalladamente a tu Buyer Persona (cliente ideal)?',
        options: [
          { value: 1, label: 'Le vendemos a todo el mundo' },
          { value: 2, label: 'Tenemos una idea general' },
          { value: 3, label: 'Tenemos perfiles básicos definidos' },
          { value: 4, label: 'Tenemos perfiles detallados con dolores y motivaciones' },
          { value: 5, label: 'Usamos datos reales para actualizar perfiles constantemente' }
        ]
      },
      {
        id: 'em3',
        text: '¿Tu identidad visual es coherente en todos los canales?',
        options: [
          { value: 1, label: 'No tenemos logo ni colores definidos' },
          { value: 2, label: 'Usamos lo que sale en el momento' },
          { value: 3, label: 'Tenemos logo pero varía según la red social' },
          { value: 4, label: 'Tenemos un manual de marca básico que seguimos' },
          { value: 5, label: 'Identidad sólida, profesional y coherente en todo' }
        ]
      }
    ]
  },
  {
    id: 'presencia_web',
    title: 'Presencia Web y SEO',
    icon: '🌐',
    questions: [
      {
        id: 'pw1',
        text: '¿Cuál es el estado actual de tu sitio web?',
        options: [
          { value: 1, label: 'No tenemos sitio web' },
          { value: 2, label: 'Tenemos una página muy antigua o "en construcción"' },
          { value: 3, label: 'Web informativa básica (Landing page)' },
          { value: 4, label: 'Web profesional, rápida y optimizada para móviles' },
          { value: 5, label: 'Web de alto rendimiento con blog y conversión' }
        ]
      },
      {
        id: 'pw2',
        text: '¿Tu web aparece en los primeros resultados de Google (SEO)?',
        options: [
          { value: 1, label: 'No aparecemos ni buscando el nombre' },
          { value: 2, label: 'Aparecemos solo por el nombre de la empresa' },
          { value: 3, label: 'Aparecemos en algunas palabras clave secundarias' },
          { value: 4, label: 'Estamos en primera página para términos importantes' },
          { value: 5, label: 'Dominamos las búsquedas de nuestro sector' }
        ]
      },
      {
        id: 'pw3',
        text: '¿Tu sitio web está preparado para captar clientes (Leads)?',
        options: [
          { value: 1, label: 'No tiene formularios ni contacto' },
          { value: 2, label: 'Solo tiene un correo escrito' },
          { value: 3, label: 'Tiene un formulario de contacto básico' },
          { value: 4, label: 'Tiene botones de WhatsApp y formularios optimizados' },
          { value: 5, label: 'Tiene imanes de leads (ebooks, demos) y CRM integrado' }
        ]
      }
    ]
  },
  {
    id: 'redes_sociales',
    title: 'Redes Sociales y Contenido',
    icon: '📱',
    questions: [
      {
        id: 'rs1',
        text: '¿En qué redes sociales tiene presencia activa tu empresa?',
        options: [
          { value: 1, label: 'En ninguna' },
          { value: 2, label: 'Tenemos perfiles pero no publicamos' },
          { value: 3, label: 'Publicamos ocasionalmente (1 vez al mes)' },
          { value: 4, label: 'Publicamos regularmente con diseño propio' },
          { value: 5, label: 'Estrategia multicanal con video y alta interacción' }
        ]
      },
      {
        id: 'rs2',
        text: '¿Qué tipo de contenido compartes con tu audiencia?',
        options: [
          { value: 1, label: 'Solo fotos de productos y precios' },
          { value: 2, label: 'Memes o contenido de otros' },
          { value: 3, label: 'Mezcla de productos y algunos consejos' },
          { value: 4, label: 'Contenido de valor que resuelve dudas del cliente' },
          { value: 5, label: 'Estrategia de contenido educativa, inspiradora y viral' }
        ]
      },
      {
        id: 'rs3',
        text: '¿Cómo respondes a las consultas en redes sociales?',
        options: [
          { value: 1, label: 'No respondo o tardo días' },
          { value: 2, label: 'Respondo con "Precio por inbox"' },
          { value: 3, label: 'Respondo en menos de 24 horas' },
          { value: 4, label: 'Respuesta rápida y amable (menos de 1 hora)' },
          { value: 5, label: 'Atención inmediata con chatbots y humanos' }
        ]
      }
    ]
  },
  {
    id: 'publicidad_digital',
    title: 'Publicidad Digital (Ads)',
    icon: '📣',
    questions: [
      {
        id: 'pd1',
        text: '¿Has invertido en Facebook, Instagram o Google Ads?',
        options: [
          { value: 1, label: 'Nunca' },
          { value: 2, label: 'Solo le doy al botón "Promocionar publicación"' },
          { value: 3, label: 'He hecho campañas básicas' },
          { value: 4, label: 'Invierto mensualmente con objetivos claros' },
          { value: 5, label: 'Inversión profesional escalable y optimizada' }
        ]
      },
      {
        id: 'pd2',
        text: '¿Haces Remarketing (mostrar anuncios a quienes ya te visitaron)?',
        options: [
          { value: 1, label: 'No sé qué es eso' },
          { value: 2, label: 'Lo he escuchado pero no lo aplico' },
          { value: 3, label: 'Lo uso ocasionalmente' },
          { value: 4, label: 'Tengo campañas de remarketing activas' },
          { value: 5, label: 'Estrategia de remarketing avanzada por etapas' }
        ]
      }
    ]
  },
  {
    id: 'analitica',
    title: 'Analítica y Conversión',
    icon: '📈',
    questions: [
      {
        id: 'ac1',
        text: '¿Sabes cuántas visitas y ventas genera tu marketing digital?',
        options: [
          { value: 1, label: 'No tengo idea' },
          { value: 2, label: 'Solo veo los seguidores' },
          { value: 3, label: 'Veo Google Analytics básico' },
          { value: 4, label: 'Mido conversiones y costo por adquisición' },
          { value: 5, label: 'Dashboard en tiempo real con KPIs de negocio' }
        ]
      },
      {
        id: 'ac2',
        text: '¿Utilizas un CRM para gestionar tus prospectos?',
        options: [
          { value: 1, label: 'No, todo está en la cabeza' },
          { value: 2, label: 'Uso un cuaderno o agenda' },
          { value: 3, label: 'Uso un Excel compartido' },
          { value: 4, label: 'Uso un CRM (Hubspot, Pipedrive, etc.)' },
          { value: 5, label: 'CRM automatizado con flujos de venta' }
        ]
      }
    ]
  }
];
