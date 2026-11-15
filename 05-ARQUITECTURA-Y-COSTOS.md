# 05 · Arquitectura y costos

> **Actualizado el 14/11/2026:** los costos de WhatsApp, la decisión sobre grupos y el análisis de
> competencia se verificaron en `08-FACTIBILIDAD-E2E.md`, que reemplaza las cifras de este documento.

Propuesta para el piloto (paso 1 de `04`). La demo vendible del paso 0 no necesita nada de esto: es
estática, como los otros demos del portfolio.

## 1. Vista general

```
 Cliente final ──WhatsApp──┐                          ┌── Google Calendar / Drive / Sheets
 (comprador, propietario)  │                          ├── CRM inmobiliario (fase 2)
                           ▼                          ├── Meta Ads (lectura, fase 2)
 Asesor ──WhatsApp 1:1──► Webhooks ─► Cola ─► Orquestador ─► Agente de departamento ─► Herramientas
 Asesor ──Panel web──────────────────────────────┘     │                 │
                                                       │                 └─► Generador de entregables
                                                       ▼                     (página / PDF / imagen)
                                            Cerebro (docs + cartera)
                                            Postgres + búsqueda semántica
```

## 2. Stack propuesto

| Capa | Elección | Por qué |
|---|---|---|
| Panel y API | Next.js + TypeScript + Tailwind | Mismo lenguaje que los otros proyectos (React + TS); un solo deploy para panel y webhooks |
| Base de datos | Postgres (Supabase) con **Row Level Security** por inmobiliaria + `pgvector` | Multi-cliente seguro desde el día 1; búsqueda semántica del cerebro y la cartera sin otro servicio |
| Archivos | Storage de Supabase | Fotos, PDFs, entregables |
| Trabajo en segundo plano | Cola sobre Postgres (p. ej. pg-boss) o servicio de colas | Los webhooks de WhatsApp tienen que responder rápido; el agente corre después |
| IA | API de Claude (SDK oficial `@anthropic-ai/sdk`) | Ver §4 |
| WhatsApp | **WhatsApp Business Cloud API oficial** (Meta), un número por inmobiliaria | Única vía sin riesgo de bloqueo; mismo esquema que `turnero-whatsapp-demo` |
| Entregables | HTML con plantillas de marca → PDF con Chromium sin interfaz | Una plantilla sirve para página y PDF |
| Región | São Paulo para datos | Latencia y cercanía; la transferencia internacional igual se declara (ver `03`) |

Secretos (claves de API, tokens de Meta y Google) solo en variables de entorno y cifrados en la base;
nunca en git.

## 3. El canal del equipo: decisión de diseño

La referencia mete un bot **dentro de grupos de WhatsApp**. Opciones:

| Opción | Ventajas | Riesgos | Decisión |
|---|---|---|---|
| Librería no oficial que emula WhatsApp Web | Grupos y comunidades "como en el video" | Viola términos de Meta; bloqueo del número; credenciales de una cuenta personal | **Descartada** |
| Grupos con la Cloud API oficial | Oficial | [A verificar] soporte de grupos limitado y reciente; puede no permitir comunidades ni grupos grandes | Investigar antes del piloto |
| **WhatsApp 1:1 con el asistente + panel con salas por departamento** | Oficial, simple; el panel guarda historial y archivos | El asesor no ve el trabajo de los demás en el chat (sí en el panel) | **MVP** |
| Telegram (grupos con bots, soporte completo) | Grupos nativos, gratis | El equipo no lo usa | Plan B si la inmobiliaria lo acepta |

En el chat 1:1 el orquestador detecta el departamento por la intención del mensaje, o por un comando
(`#tasación`, `#marketing`, `#capacitación`) cuando el asesor quiere ser explícito.

## 4. Diseño de los agentes

- **Orquestador**: clasifica el pedido (departamento, urgencia, si es de cara al cliente) y lo pasa al
  agente. Llamada corta y barata.
- **Agente de departamento**: Claude con **herramientas propias** (tool use) y el cerebro en el prompt
  del sistema (cacheado). Herramientas iniciales:
  `buscar_propiedades`, `ver_contacto`, `crear_o_actualizar_lead`, `consultar_disponibilidad`,
  `agendar_visita`, `derivar_a_asesor`, `generar_entregable(plantilla, datos)`, `buscar_en_cerebro`,
  y para competencia la búsqueda web del lado del servidor restringida a dominios permitidos.
- **Reglas duras** fuera del modelo (en código): no enviar al cliente final entregables que requieren
  aprobación, no hacer salientes sin opt-in, no escribir en el CRM sin registro de auditoría.
- **Memoria por contacto**: resumen de la conversación y datos de calificación en la base, no historiales
  infinitos.
- **Evaluación antes de cada cambio de prompt**: un juego de 50 a 100 conversaciones reales anonimizadas
  del piloto con criterios (no inventa datos, califica bien, deriva cuando corresponde).

Modelos (precios de la API de Anthropic al 03/11/2026, USD por millón de tokens):

| Modelo | ID | Entrada | Salida | Lectura de caché | Uso propuesto |
|---|---|---|---|---|---|
| Claude Opus 5.5 | `claude-opus-5-5` | 4,00 | 20,00 | 0,20 | Por defecto: agentes internos, tasación, competencia |
| Claude Sonnet 5.5 | `claude-sonnet-5-5` | 2,00 | 10,00 | 0,10 | Alternativa para atención si las pruebas muestran igual calidad |
| Claude Haiku 5.5 | `claude-haiku-5-5` | 0,10 | 0,50 | — | Orquestador y clasificación |

Funciones de la API que bajan costo o riesgo: **caché de prompt** (el cerebro va cacheado: se paga a
0,20 en vez de 4,00), **Batch** (50% menos para reportes semanales que no son urgentes), **salidas
estructuradas** (calificación del lead en JSON validado), **lectura de PDF** (contratos, documentación) y
**búsqueda web** del lado del servidor para el análisis de competencia.

## 5. Costo variable estimado por inmobiliaria (10 asesores)

Supuestos: cerebro de 15.000 tokens cacheado; 600 consultas de clientes al mes con 8 turnos cada una;
300 pedidos internos; 30 informes pesados (tasación o competencia).

| Concepto | Cálculo aproximado | USD/mes |
|---|---|---|
| Atención con Opus 5.5 | 4.800 turnos × ~USD 0,027 | ~130 |
| Atención con Sonnet 5.5 (si pasa la evaluación) | 4.800 × ~USD 0,014 | ~65 |
| Orquestador con Haiku 5.5 | 5.100 × ~USD 0,001 | ~5 |
| Pedidos internos con Opus 5.5 | 300 × ~USD 0,18 | ~55 |
| Informes pesados con búsqueda web | 30 × ~USD 0,60 | ~20 |
| **Total IA** | | **~USD 145 a 210** |
| WhatsApp | Las respuestas dentro de la ventana de 24 h a un cliente que escribió primero no se cobran; las plantillas salientes (recordatorios, marketing) se cobran por mensaje según la tabla de Meta para Argentina [a verificar] | ~10 a 40 |
| Infraestructura | Base, hosting, almacenamiento (compartidos) | ~10 |

Con el plan "Inmobiliaria" de la hipótesis (USD 249/mes), el margen se sostiene **si la atención usa un
modelo más económico o si el volumen es menor**; por eso el piloto tiene que **medir tokens por cliente**
desde el día 1 (tabla de uso por inmobiliaria) y decidir con la evaluación, no con supuestos. Alternativa:
cobrar la atención por volumen de conversaciones.

## 6. Modelo de datos (primer corte)

- `inmobiliarias` (jurisdicción, plan, corredor responsable: nombre, matrícula, colegio)
- `usuarios` (rol: dueño, asesor, administrativo) y su teléfono para el canal 1:1
- `cerebro_documentos` (tema, contenido, versión, aprobado_por, fecha)
- `propiedades` (operación, tipo, zona, precio, moneda, m², ambientes, estado, actualizada_en, fuente)
- `contactos` (tipo: comprador, propietario, inquilino; **consentimiento, opt-in, consulta No Llame**, retención)
- `conversaciones` y `mensajes` (canal, agente, dirección, tokens)
- `leads` (calificación JSON, temperatura, etapa, asesor asignado)
- `visitas` (propiedad, contacto, asesor, evento de calendario, estado, no-show)
- `entregables` (tipo, plantilla, archivo, estado de aprobación)
- `integraciones` (proveedor, tokens cifrados, alcance)
- `auditoria` (quién o qué agente leyó o escribió qué)
- `uso` (tokens y costo por inmobiliaria y por agente)

Todas las tablas con `inmobiliaria_id` y políticas RLS.

## 7. Riesgos técnicos a resolver antes del piloto

1. Alta de números en WhatsApp Business API por cliente (verificación del negocio en Meta, plazos).
2. Política vigente de Meta sobre asistentes de IA en WhatsApp Business y soporte de grupos.
3. Fuente de comparables para el ACM: cartera propia + cierres que cargue la inmobiliaria; portales solo
   con API o acuerdo (ver `03` §2.9). Sin buenos comparables, la tasación es el punto débil.
4. API de los CRM inmobiliarios usados en Argentina (relevar cuáles exponen API y con qué condiciones).
5. Calidad en castellano rioplatense y en vocabulario local (ambientes, expensas, apto crédito, escritura).
