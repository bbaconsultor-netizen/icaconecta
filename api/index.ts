import express from "express";
import path from "path";
import axios from "axios";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Route - Proxy SUNAT
app.get("/api/sunat/:ruc", async (req, res) => {
  const { ruc } = req.params;
  const token = process.env.VITE_SUNAT_TOKEN || "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImJiYWNvbnN1bHRvckBnbWFpbC5jb20ifQ.ydGiha7Q2HdyFxDw3hNLKtdCyiyEMK3DQg6MQbSvgfM";

  if (!token) {
    return res.status(400).json({ 
      success: false, 
      message: "🚫 CONFIGURACIÓN INCOMPLETA: Falta la variable VITE_SUNAT_TOKEN en los Settings del proyecto." 
    });
  }

  try {
    const response = await axios.get(`https://dniruc.apisperu.com/api/v1/ruc/${ruc}?token=${token}`);
    
    if (!response.data || !response.data.ruc) {
      return res.status(404).json({
        success: false,
        message: `🔍 NO ENCONTRADO: El RUC ${ruc} no existe o el servicio de consulta no devolvió datos.`
      });
    }

    const raw = response.data;
    const mappedData = {
      nombre_o_razon_social: raw.razonSocial || '',
      direccion_completa: raw.direccion || '',
      departamento: raw.departamento || '',
      provincia: raw.provincia || '',
      distrito: raw.distrito || '',
      estado: raw.estado || 'ACTIVO',
      condicion: raw.condicion || 'HABIDO',
      representante_legal: ''
    };

    res.json({ success: true, data: mappedData });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: "❌ ERROR DE CONEXIÓN: No se pudo conectar con el servicio de ApisPeru.",
      error: error.response?.data || error.message
    });
  }
});

// Serve static files / middleware
if (process.env.NODE_ENV !== "production") {
  // Development mode: Vite middleware
  const startVite = async () => {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  };
  startVite();
} else {
  // In production (Vercel), we only handle /api routes
  // The static frontend is handled by Vercel rewrites
  app.get('*', (req, res) => {
    res.status(404).json({ error: "API route not found" });
  });
}

export default app;
