import os
import json
import logging
from pathlib import Path

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, Literal

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from emergentintegrations.llm.chat import LlmChat, UserMessage

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("icaconecta")

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")
SUNAT_TOKEN = os.environ.get(
    "VITE_SUNAT_TOKEN",
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImJiYWNvbnN1bHRvckBnbWFpbC5jb20ifQ.ydGiha7Q2HdyFxDw3hNLKtdCyiyEMK3DQg6MQbSvgfM",
)

app = FastAPI(title="ICA Conecta API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.get("/api/sunat/{ruc}")
async def consultar_ruc(ruc: str):
    if not SUNAT_TOKEN:
        raise HTTPException(
            status_code=400,
            detail="🚫 CONFIGURACIÓN INCOMPLETA: Falta la variable VITE_SUNAT_TOKEN.",
        )

    url = f"https://dniruc.apisperu.com/api/v1/ruc/{ruc}?token={SUNAT_TOKEN}"
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.get(url)
    except httpx.HTTPError as exc:
        logger.exception("Error conectando a ApisPeru")
        raise HTTPException(
            status_code=502,
            detail={
                "success": False,
                "message": "❌ ERROR DE CONEXIÓN: No se pudo conectar con ApisPeru.",
                "error": str(exc),
            },
        )

    if response.status_code >= 400:
        raise HTTPException(
            status_code=response.status_code,
            detail={
                "success": False,
                "message": f"🔍 NO ENCONTRADO: El RUC {ruc} no existe o el servicio no devolvió datos.",
            },
        )

    raw = response.json()
    if not raw or not raw.get("ruc"):
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "message": f"🔍 NO ENCONTRADO: El RUC {ruc} no existe o el servicio no devolvió datos.",
            },
        )

    return {
        "success": True,
        "data": {
            "nombre_o_razon_social": raw.get("razonSocial", ""),
            "direccion_completa": raw.get("direccion", ""),
            "departamento": raw.get("departamento", ""),
            "provincia": raw.get("provincia", ""),
            "distrito": raw.get("distrito", ""),
            "estado": raw.get("estado", "ACTIVO"),
            "condicion": raw.get("condicion", "HABIDO"),
            "representante_legal": "",
        },
    }


class DiagnosticRequest(BaseModel):
    answers: Dict[str, Any]
    type: Literal["digital", "marketing"] = "digital"


def _build_prompt(answers: Dict[str, Any], kind: str) -> str:
    if kind == "marketing":
        return f"""
    Actúa como un experto en Marketing Digital para MIPYMEs en Perú.
    Analiza las siguientes respuestas de un autodiagnóstico de marketing digital que cubre:
    Estrategia y Marca, Presencia Web y SEO, Redes Sociales y Contenido, Publicidad Digital (Ads), Analítica y Conversión.

    Respuestas (Escala 1-5, donde 5 es nivel experto/optimizado y 1 es nulo):
    {json.dumps(answers, ensure_ascii=False)}

    El objetivo es mejorar la visibilidad, captación y conversión de clientes digitales.

    Devuelve SOLO un JSON válido (sin texto adicional ni markdown) con esta estructura exacta:
    {{
      "maturityLevel": "Nivel (Inicial, Básico, Intermedio o Avanzado)",
      "score": <número del 1 al 100>,
      "roadmap": "Resumen ejecutivo del plan de marketing digital.",
      "impactReport": "Análisis de impacto en ventas y posicionamiento detallado.",
      "totalInvestment": "Monto mensual estimado en pauta y herramientas (S/.)",
      "roiExpected": "Porcentaje de retorno de inversión publicitaria (ROAS) esperado",
      "dimensionScores": {{"estrategia": 0, "web": 0, "redes": 0, "ads": 0, "analitica": 0}},
      "dimensionDetails": [
        {{"dimension": "...", "evaluation": "...", "recommendation": "...", "investment": "S/. ..."}}
      ],
      "phases": [
        {{"title": "...", "period": "Mes X-Y", "tasks": ["..."], "tools": ["..."], "budget": "S/. ..."}}
      ],
      "techRecommendations": [
        {{"category": "...", "priority": "Alta", "options": ["..."]}}
      ]
    }}
    """

    return f"""
    Actúa como un experto en transformación digital para MIPYMEs en Perú.
    Analiza las siguientes respuestas de un autodiagnóstico empresarial exhaustivo que cubre 8 dimensiones:
    Gestión, Marketing, E-commerce, Automatización, Datos, Infraestructura, IA y Plataformas del Estado (PERÚ COMPRAS, PRODUCE, OSCE, RNP, SUNAT, SUNARP, VUCE, PAGALO.PE).

    Respuestas (Escala 1-5, donde 5 es uso activo y 1 es nulo):
    {json.dumps(answers, ensure_ascii=False)}

    El objetivo principal es la transformación digital (mejorar las dimensiones de negocio).
    El uso de plataformas del Estado debe evaluarse como un avance en la integración con el ecosistema gubernamental, pero no debe desviar el foco de la digitalización core del negocio.

    Devuelve SOLO un JSON válido (sin texto adicional ni markdown) con esta estructura exacta:
    {{
      "maturityLevel": "Nivel (Inicial, Básico, Intermedio o Avanzado)",
      "score": <número del 1 al 100>,
      "roadmap": "Resumen ejecutivo del plan de transformación.",
      "impactReport": "Análisis de impacto financiero y operativo detallado.",
      "totalInvestment": "Monto total estimado en Soles (S/.)",
      "roiExpected": "Porcentaje de retorno de inversión esperado",
      "dimensionScores": {{"gestion": 0, "marketing": 0, "ecommerce": 0, "automatizacion": 0, "datos": 0, "infraestructura": 0, "ia": 0, "estado": 0}},
      "dimensionDetails": [
        {{"dimension": "...", "evaluation": "...", "recommendation": "...", "investment": "S/. ..."}}
      ],
      "phases": [
        {{"title": "...", "period": "Mes X-Y", "tasks": ["..."], "tools": ["..."], "budget": "S/. ..."}}
      ],
      "techRecommendations": [
        {{"category": "...", "priority": "Alta", "options": ["..."]}}
      ]
    }}

    IMPORTANTE:
    1. Las recomendaciones deben ser tecnologías reales y existentes en el mercado peruano/global.
    2. El presupuesto debe ser realista para una MIPYME en Perú.
    3. Debes incluir una evaluación y recomendación para CADA UNA de las dimensiones evaluadas.
    """


def _extract_json(text: str) -> Dict[str, Any]:
    text = text.strip()
    if text.startswith("```"):
        # strip fenced code block
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:].strip()
    # locate first '{' and last '}'
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        text = text[start : end + 1]
    return json.loads(text)


@app.post("/api/diagnostic")
async def generate_diagnostic(payload: DiagnosticRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY no configurada en el servidor.")

    prompt = _build_prompt(payload.answers, payload.type)
    chat = (
        LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id="icaconecta-diagnostic",
            system_message="Eres un experto en transformación digital para MIPYMEs en Perú. Respondes SIEMPRE con un JSON válido, sin texto adicional.",
        )
        .with_model("gemini", "gemini-3-flash-preview")
    )

    try:
        response = await chat.send_message(UserMessage(text=prompt))
    except Exception as exc:
        logger.exception("Error llamando a Gemini vía emergentintegrations")
        raise HTTPException(status_code=502, detail=f"Error generando diagnóstico: {exc}")

    try:
        result = _extract_json(response)
    except json.JSONDecodeError:
        logger.error("Respuesta de IA no es JSON válido: %s", response[:500])
        raise HTTPException(status_code=502, detail="La IA devolvió una respuesta inválida.")

    return result
