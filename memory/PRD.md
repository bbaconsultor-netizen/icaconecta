# ICA Conecta — PRD

## Problema original
> "haz el deploy de esta aplicacion https://github.com/bbaconsultor-netizen/icaconecta.git"

## Visión
Plataforma integral **Ica Conecta** para MIPYMEs de la región Ica (Perú): CRM, diagnóstico de madurez digital con IA, marketplace regional multisector, marketplace de herramientas, cursos y panel de administración.

## Arquitectura (adaptada al entorno Emergent)
- **Frontend** `/app/frontend` — Vite 6 + React 19 + TypeScript + Tailwind 4, servido en `:3000`.
- **Backend** `/app/backend` — FastAPI + Uvicorn en `:8001` (reemplaza el Express original):
  - `GET /api/health`
  - `GET /api/sunat/{ruc}` — proxy a ApisPeru
  - `POST /api/diagnostic` — Gemini vía `emergentintegrations` + Universal LLM Key
- **DB principal**: Firebase Firestore (proyecto `gen-lang-client-0086182194`)
- **Auth**: Google Sign-In vía Firebase Authentication

## Integraciones
- **Gemini 3 Flash Preview** usando Emergent Universal LLM Key (server-side, API key segura).
- **Firebase** (Auth + Firestore): configuración en `firebase-applet-config.json`.
- **ApisPeru SUNAT**: token hardcoded por defecto (override con `VITE_SUNAT_TOKEN`).

## Funcionalidades
- Autenticación Google.
- Dashboard con indicadores.
- CRM de empresas con consulta automática de RUC a SUNAT.
- Diagnóstico de transformación digital (8 dimensiones) y marketing digital (5 dimensiones) con plan personalizado generado por IA.
- Marketplace de productos de la comunidad.
- Marketplace de herramientas/soluciones tecnológicas.
- Cursos educativos.
- Panel de Admin solo para `bbaconsultor@gmail.com`.
- Exportar reporte PDF (jsPDF).

## Roles
- **Usuario MIPYME**: CRUD de sus empresas, diagnósticos y productos.
- **Admin (`bbaconsultor@gmail.com`)**: acceso completo a panel, marketplace, cursos, indicadores.

## Implementado (3 may 2026)
- Reestructuración a layout Emergent (`/app/frontend` + `/app/backend`).
- Backend FastAPI que reemplaza el Express original.
- Integración Gemini vía `emergentintegrations` (Universal Key).
- `geminiService.ts` ahora llama al backend (API key ya no se expone en cliente).
- `CRM.tsx` usa `REACT_APP_BACKEND_URL` para consultas SUNAT.
- Servicios supervisor funcionando: frontend :3000, backend :8001.

## Acción del usuario pendiente
1. **Agregar dominio autorizado en Firebase**: `Authentication → Settings → Authorized domains` →
   `1021f47f-cd2b-4106-a12e-ab44e911458e.preview.emergentagent.com` (sin esto, el login Google falla).
2. Si se publica a producción, agregar también el dominio final del deploy.

## Backlog
- P1: Validar reglas de Firestore contra la preview (posible CORS/domain issues en login).
- P1: Eliminar `api/index.ts` (legado Express) o convertir en fallback.
- P2: Cambiar imágenes de placeholder en Marketplace/productos.
- P2: Agregar rol "moderador" para curar productos del marketplace comunitario.
- P2: Internacionalización (es-PE ↔ en-US).
