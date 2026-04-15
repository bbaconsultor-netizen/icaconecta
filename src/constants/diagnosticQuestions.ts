export interface Question {
  id: string;
  text: string;
  description?: string;
  options: { value: number; label: string }[];
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  questions: Question[];
}

export const diagnosticCategories: Category[] = [
  {
    id: 'gestion',
    title: 'Gestión Empresarial',
    icon: '🏢',
    questions: [
      {
        id: 'g1',
        text: '¿Tu empresa usa software de gestión (ERP, CRM)?',
        options: [
          { value: 1, label: 'No usamos ninguno' },
          { value: 2, label: 'Hoja de cálculo (Excel)' },
          { value: 3, label: 'Software básico' },
          { value: 4, label: 'ERP/CRM profesional' },
          { value: 5, label: 'Sistema integrado en la nube' }
        ]
      },
      {
        id: 'g2',
        text: '¿Cómo se gestionan los procesos administrativos?',
        options: [
          { value: 1, label: 'Totalmente manual' },
          { value: 2, label: 'Mayoría en papel' },
          { value: 3, label: 'Parcialmente digital' },
          { value: 4, label: 'Totalmente digital' },
          { value: 5, label: 'Automatizados y optimizados' }
        ]
      },
      {
        id: 'g3',
        text: '¿Existe una estrategia de transformación digital formal?',
        options: [
          { value: 1, label: 'No existe' },
          { value: 2, label: 'Se ha conversado' },
          { value: 3, label: 'En fase de planeación' },
          { value: 4, label: 'En ejecución' },
          { value: 5, label: 'Es parte del ADN de la empresa' }
        ]
      }
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing Digital',
    icon: '📱',
    questions: [
      {
        id: 'm1',
        text: '¿Cuál es el nivel de presencia digital de tu marca?',
        options: [
          { value: 1, label: 'Nula' },
          { value: 2, label: 'Redes sociales básicas' },
          { value: 3, label: 'Web informativa y redes activas' },
          { value: 4, label: 'Estrategia omnicanal' },
          { value: 5, label: 'Presencia digital líder en el sector' }
        ]
      },
      {
        id: 'm2',
        text: '¿Realizas inversión en pauta publicitaria digital?',
        options: [
          { value: 1, label: 'Nunca' },
          { value: 2, label: 'Ocasionalmente' },
          { value: 3, label: 'Mensualmente' },
          { value: 4, label: 'Estrategia constante' },
          { value: 5, label: 'Inversión optimizada con datos' }
        ]
      },
      {
        id: 'm3',
        text: '¿Mides el retorno de inversión (ROI) de tus campañas?',
        options: [
          { value: 1, label: 'No mido nada' },
          { value: 2, label: 'Solo likes y vistas' },
          { value: 3, label: 'Mido conversiones básicas' },
          { value: 4, label: 'Atribución detallada' },
          { value: 5, label: 'Análisis predictivo de ROI' }
        ]
      }
    ]
  },
  {
    id: 'ecommerce',
    title: 'Comercio Electrónico',
    icon: '🛒',
    questions: [
      {
        id: 'e1',
        text: '¿Vendes tus productos o servicios por internet?',
        options: [
          { value: 1, label: 'No' },
          { value: 2, label: 'Solo por WhatsApp/DM' },
          { value: 3, label: 'Marketplace externo (Mercado Libre)' },
          { value: 4, label: 'Tienda online propia' },
          { value: 5, label: 'Ecosistema e-commerce integrado' }
        ]
      },
      {
        id: 'e2',
        text: '¿Qué métodos de pago digital ofreces?',
        options: [
          { value: 1, label: 'Solo efectivo/transferencia' },
          { value: 2, label: 'Billeteras (Yape/Plin)' },
          { value: 3, label: 'Pasarela de pagos básica' },
          { value: 4, label: 'Múltiples pasarelas y cuotas' },
          { value: 5, label: 'Pagos recurrentes y suscripciones' }
        ]
      },
      {
        id: 'e3',
        text: '¿Cómo gestionas la logística de tus ventas online?',
        options: [
          { value: 1, label: 'Manual/Personal' },
          { value: 2, label: 'Courier externo básico' },
          { value: 3, label: 'Software de seguimiento' },
          { value: 4, label: 'Logística integrada' },
          { value: 5, label: 'Fulfillment automatizado' }
        ]
      }
    ]
  },
  {
    id: 'automatizacion',
    title: 'Automatización',
    icon: '⚙️',
    questions: [
      {
        id: 'a1',
        text: '¿Qué porcentaje de tareas repetitivas están automatizadas?',
        options: [
          { value: 1, label: '0%' },
          { value: 2, label: 'Menos del 25%' },
          { value: 3, label: 'Entre 25% y 50%' },
          { value: 4, label: 'Más del 50%' },
          { value: 5, label: 'Casi todas las tareas operativas' }
        ]
      },
      {
        id: 'a2',
        text: '¿Usas herramientas de automatización de marketing?',
        options: [
          { value: 1, label: 'No' },
          { value: 2, label: 'Solo respuestas automáticas' },
          { value: 3, label: 'Email marketing básico' },
          { value: 4, label: 'Flujos de trabajo (Workflows)' },
          { value: 5, label: 'Hiper-personalización automatizada' }
        ]
      },
      {
        id: 'a3',
        text: '¿Tus sistemas están integrados entre sí?',
        options: [
          { value: 1, label: 'Islas de información' },
          { value: 2, label: 'Integraciones manuales' },
          { value: 3, label: 'Algunas integraciones vía API' },
          { value: 4, label: 'Ecosistema conectado' },
          { value: 5, label: 'Plataforma única integrada' }
        ]
      }
    ]
  },
  {
    id: 'datos',
    title: 'Uso de Datos',
    icon: '📊',
    questions: [
      {
        id: 'd1',
        text: '¿Cómo recolectas los datos de tus clientes?',
        options: [
          { value: 1, label: 'No recolecto datos' },
          { value: 2, label: 'Cuaderno o Excel básico' },
          { value: 3, label: 'Base de datos estructurada' },
          { value: 4, label: 'CRM con historial completo' },
          { value: 5, label: 'Big Data y Customer Data Platform' }
        ]
      },
      {
        id: 'd2',
        text: '¿Utilizas herramientas de Business Intelligence?',
        options: [
          { value: 1, label: 'No' },
          { value: 2, label: 'Reportes de Excel' },
          { value: 3, label: 'Dashboards básicos' },
          { value: 4, label: 'PowerBI / Tableau' },
          { value: 5, label: 'Análisis en tiempo real' }
        ]
      },
      {
        id: 'd3',
        text: '¿Tomas decisiones basadas en análisis de datos?',
        options: [
          { value: 1, label: 'Solo intuición' },
          { value: 2, label: 'Reportes pasados' },
          { value: 3, label: 'Análisis descriptivo' },
          { value: 4, label: 'Análisis diagnóstico' },
          { value: 5, label: 'Análisis predictivo y prescriptivo' }
        ]
      }
    ]
  },
  {
    id: 'infraestructura',
    title: 'Infraestructura Tecnológica',
    icon: '💻',
    questions: [
      {
        id: 'i1',
        text: '¿Qué porcentaje de tu infraestructura está en la nube?',
        options: [
          { value: 1, label: '0% (Todo local)' },
          { value: 2, label: 'Solo correo y archivos' },
          { value: 3, label: 'Híbrido' },
          { value: 4, label: 'Mayoría en la nube' },
          { value: 5, label: 'Cloud Native (100%)' }
        ]
      },
      {
        id: 'i2',
        text: '¿Cuentas con protocolos de ciberseguridad?',
        options: [
          { value: 1, label: 'No' },
          { value: 2, label: 'Antivirus básico' },
          { value: 3, label: 'Backups y Firewall' },
          { value: 4, label: 'Políticas de seguridad formal' },
          { value: 5, label: 'Certificaciones internacionales' }
        ]
      },
      {
        id: 'i3',
        text: '¿Cuál es la calidad de tu hardware y conectividad?',
        options: [
          { value: 1, label: 'Obsoleta y lenta' },
          { value: 2, label: 'Básica' },
          { value: 3, label: 'Adecuada para el trabajo' },
          { value: 4, label: 'Moderna y escalable' },
          { value: 5, label: 'Alta disponibilidad y última gen' }
        ]
      }
    ]
  },
  {
    id: 'ia',
    title: 'Inteligencia Artificial',
    icon: '🤖',
    questions: [
      {
        id: 'ia1',
        text: '¿Conoces cómo la IA puede beneficiar a tu sector?',
        options: [
          { value: 1, label: 'No conozco nada' },
          { value: 2, label: 'He escuchado algo' },
          { value: 3, label: 'Conozco casos de uso' },
          { value: 4, label: 'Tengo un plan de adopción' },
          { value: 5, label: 'Lidero innovación con IA' }
        ]
      },
      {
        id: 'ia2',
        text: '¿Utilizas herramientas de IA generativa en el trabajo?',
        options: [
          { value: 1, label: 'Nunca' },
          { value: 2, label: 'Uso personal ocasional' },
          { value: 3, label: 'Uso en tareas diarias' },
          { value: 4, label: 'Uso integrado en procesos' },
          { value: 5, label: 'IA personalizada para la empresa' }
        ]
      },
      {
        id: 'ia3',
        text: '¿Has implementado modelos de IA propios o personalizados?',
        options: [
          { value: 1, label: 'No' },
          { value: 2, label: 'En evaluación' },
          { value: 3, label: 'Pruebas de concepto' },
          { value: 4, label: 'Implementaciones activas' },
          { value: 5, label: 'IA como núcleo del negocio' }
        ]
      }
    ]
  },
  {
    id: 'estado',
    title: 'Plataformas del Estado',
    icon: '🏛️',
    questions: [
      {
        id: 'pe1',
        text: '¿Utilizas PERÚ COMPRAS (Catálogos Electrónicos)?',
        description: 'Permite vender al Estado de forma ágil y electrónica sin procesos de selección clásicos.',
        options: [
          { value: 1, label: 'No la conozco' },
          { value: 2, label: 'He escuchado de ella pero no la uso' },
          { value: 3, label: 'Conozco sus funciones y la uso ocasionalmente' },
          { value: 4, label: 'La conozco bien y la uso regularmente' },
          { value: 5, label: 'Dominio experto e integración total en el negocio' }
        ]
      },
      {
        id: 'pe2',
        text: '¿Utilizas PRODUCE (Produce Virtual / Kit Digital)?',
        description: 'Acceso a vouchers de innovación, servicios de CITEs y digitalización para MIPYMES.',
        options: [
          { value: 1, label: 'No la conozco' },
          { value: 2, label: 'He escuchado de ella pero no la uso' },
          { value: 3, label: 'Conozco sus funciones y la uso ocasionalmente' },
          { value: 4, label: 'La conozco bien y la uso regularmente' },
          { value: 5, label: 'Dominio experto e integración total en el negocio' }
        ]
      },
      {
        id: 'pe3',
        text: '¿Utilizas OSCE (SEACE - Sistema Electrónico de Contrataciones)?',
        description: 'Acceso a todas las convocatorias públicas a nivel nacional para proveer bienes y servicios.',
        options: [
          { value: 1, label: 'No la conozco' },
          { value: 2, label: 'He escuchado de ella pero no la uso' },
          { value: 3, label: 'Conozco sus funciones y la uso ocasionalmente' },
          { value: 4, label: 'La conozco bien y la uso regularmente' },
          { value: 5, label: 'Dominio experto e integración total en el negocio' }
        ]
      },
      {
        id: 'pe4',
        text: '¿Utilizas RNP (Registro Nacional de Proveedores)?',
        description: 'Requisito digital obligatorio para contratar con el Estado por montos mayores a 1 UIT.',
        options: [
          { value: 1, label: 'No la conozco' },
          { value: 2, label: 'He escuchado de ella pero no la uso' },
          { value: 3, label: 'Conozco sus funciones y la uso ocasionalmente' },
          { value: 4, label: 'La conozco bien y la uso regularmente' },
          { value: 5, label: 'Dominio experto e integración total en el negocio' }
        ]
      },
      {
        id: 'pe5',
        text: '¿Utilizas SUNAT (App Emprender / Factura Electrónica)?',
        description: 'Gestión tributaria móvil y emisión de comprobantes autorizados en tiempo real.',
        options: [
          { value: 1, label: 'No la conozco' },
          { value: 2, label: 'He escuchado de ella pero no la uso' },
          { value: 3, label: 'Conozco sus funciones y la uso ocasionalmente' },
          { value: 4, label: 'La conozco bien y la uso regularmente' },
          { value: 5, label: 'Dominio experto e integración total en el negocio' }
        ]
      },
      {
        id: 'pe6',
        text: '¿Utilizas SUNARP (Síguelo / Alerta Registral)?',
        description: 'Consulta de títulos en trámite y protección contra fraude inmobiliario o mercantil.',
        options: [
          { value: 1, label: 'No la conozco' },
          { value: 2, label: 'He escuchado de ella pero no la uso' },
          { value: 3, label: 'Conozco sus funciones y la uso ocasionalmente' },
          { value: 4, label: 'La conozco bien y la uso regularmente' },
          { value: 5, label: 'Dominio experto e integración total en el negocio' }
        ]
      },
      {
        id: 'pe7',
        text: '¿Utilizas VUCE (Ventanilla Única de Comercio Exterior)?',
        description: 'Digitalización de trámites para exportación e importación con diversas entidades públicas.',
        options: [
          { value: 1, label: 'No la conozco' },
          { value: 2, label: 'He escuchado de ella pero no la uso' },
          { value: 3, label: 'Conozco sus funciones y la uso ocasionalmente' },
          { value: 4, label: 'La conozco bien y la uso regularmente' },
          { value: 5, label: 'Dominio experto e integración total en el negocio' }
        ]
      },
      {
        id: 'pe8',
        text: '¿Utilizas PAGALO.PE (Plataforma de Pagos del BN)?',
        description: 'Pago de tasas y arbitrios de diversas entidades estatales sin ir al banco físico.',
        options: [
          { value: 1, label: 'No la conozco' },
          { value: 2, label: 'He escuchado de ella pero no la uso' },
          { value: 3, label: 'Conozco sus funciones y la uso ocasionalmente' },
          { value: 4, label: 'La conozco bien y la uso regularmente' },
          { value: 5, label: 'Dominio experto e integración total en el negocio' }
        ]
      }
    ]
  }
];
