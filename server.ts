import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
      console.log(`Consultando API ApisPeru para RUC: ${ruc}`);
      
      const response = await axios.get(`https://dniruc.apisperu.com/api/v1/ruc/${ruc}?token=${token}`);
      
      if (!response.data || !response.data.ruc) {
        return res.status(404).json({
          success: false,
          message: `🔍 NO ENCONTRADO: El RUC ${ruc} no existe o el servicio de consulta no devolvió datos.`
        });
      }

      const raw = response.data;

      // 3. Mapear respuesta de ApisPeru
      const mappedData = {
        nombre_o_razon_social: raw.razonSocial || '',
        direccion_completa: raw.direccion || '',
        departamento: raw.departamento || '',
        provincia: raw.provincia || '',
        distrito: raw.distrito || '',
        estado: raw.estado || 'ACTIVO',
        condicion: raw.condicion || 'HABIDO',
        representante_legal: '' // ApisPeru v1 RUC básico no suele incluir representantes en este endpoint simple
      };

      res.json({ success: true, data: mappedData });
    } catch (error: any) {
      const errorData = error.response?.data || error.message;
      console.error("Error en consulta ApisPeru:", errorData);
      
      res.status(500).json({ 
        success: false, 
        message: "❌ ERROR DE CONEXIÓN: No se pudo conectar con el servicio de ApisPeru.",
        error: errorData
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Token SUNAT: ${process.env.VITE_SUNAT_TOKEN ? 'Configurado' : 'USANDO DEFAULT'}`);
  });
}

startServer();
