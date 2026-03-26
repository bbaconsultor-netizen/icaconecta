import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const solutions = [
  {
    provider: "SAP Business One",
    category: "ERP",
    description: "Gestión empresarial integral para PYMEs, control de finanzas, ventas y operaciones.",
    website: "https://www.sap.com",
    tags: ["Gestión", "Finanzas", "Operaciones"]
  },
  {
    provider: "Shopify",
    category: "E-commerce",
    description: "Plataforma líder para crear tiendas online y vender en todo el mundo.",
    website: "https://www.shopify.com",
    tags: ["Ventas", "Online", "Retail"]
  },
  {
    provider: "Gemini AI for Business",
    category: "IA",
    description: "Asistente inteligente para automatización de procesos y análisis de datos.",
    website: "https://ai.google",
    tags: ["Automatización", "Productividad", "IA"]
  },
  {
    provider: "Odoo",
    category: "ERP",
    description: "Suite de aplicaciones empresariales de código abierto: CRM, eCommerce, contabilidad.",
    website: "https://www.odoo.com",
    tags: ["OpenSource", "Modular", "CRM"]
  },
  {
    provider: "HubSpot",
    category: "Marketing",
    description: "Plataforma de CRM y marketing automation para atraer, retener y deleitar clientes.",
    website: "https://www.hubspot.com",
    tags: ["Inbound", "CRM", "Automatización"]
  },
  {
    provider: "Mailchimp",
    category: "Marketing",
    description: "Servicio de marketing por correo electrónico y automatización para pequeñas empresas.",
    website: "https://www.mailchimp.com",
    tags: ["Email", "Newsletter", "Campañas"]
  },
  {
    provider: "QuickBooks",
    category: "Finanzas",
    description: "Software de contabilidad en la nube para gestionar facturación, gastos e inventario.",
    website: "https://quickbooks.intuit.com",
    tags: ["Contabilidad", "Facturación", "PYME"]
  },
  {
    provider: "Xero",
    category: "Finanzas",
    description: "Plataforma de contabilidad online para conectar empresas con sus asesores.",
    website: "https://www.xero.com",
    tags: ["Cloud", "Contabilidad", "Bancos"]
  },
  {
    provider: "Nubefact",
    category: "Finanzas",
    description: "Facturación electrónica líder en Perú, integrada con SUNAT y fácil de usar.",
    website: "https://www.nubefact.com",
    tags: ["SUNAT", "Facturación", "Perú"]
  },
  {
    provider: "Culqi",
    category: "Finanzas",
    description: "Pasarela de pagos peruana para aceptar tarjetas de crédito y débito en tu negocio.",
    website: "https://www.culqi.com",
    tags: ["Pagos", "E-commerce", "Perú"]
  },
  {
    provider: "RD Station",
    category: "Marketing",
    description: "Software de automatización de marketing y ventas líder en Latinoamérica.",
    website: "https://www.rdstation.com",
    tags: ["Inbound", "Ventas", "Latam"]
  }
];

const indicators = [
  {
    month: "2026-01",
    sensitized: 45,
    diagnosed: 20,
    transformed: 5,
    costReduction: 12500,
    salesIncrease: 35000
  },
  {
    month: "2026-02",
    sensitized: 60,
    diagnosed: 35,
    transformed: 12,
    costReduction: 28000,
    salesIncrease: 72000
  }
];

export const seedDatabase = async () => {
  const solutionsSnap = await getDocs(collection(db, 'solutions'));
  if (solutionsSnap.empty) {
    for (const s of solutions) {
      await addDoc(collection(db, 'solutions'), s);
    }
    for (const i of indicators) {
      await addDoc(collection(db, 'indicators'), i);
    }
    console.log("Database seeded successfully");
  }
};
