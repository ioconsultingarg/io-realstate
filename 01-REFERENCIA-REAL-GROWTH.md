# 01 · Referencia: Real Growth ("agentes de IA para inmobiliarias")

Relevado el 14/11/2026 sobre dos fuentes:

- Landing: https://realgrowth.site/agents-page
- Video de venta (VSL) en Loom, 20 min: https://www.loom.com/share/42a9a59be83649678a718896bdd5d1d9
  (título: "Así instalamos un equipo de asistentes de IA para cada departamento de tu inmobiliaria", 96 vistas al relevarlo)

Lo que sigue es análisis propio. No se copian textos, nombres ni diseño de la referencia: se toman
**las funciones y el modelo de negocio**, que es lo que interesa replicar y superar.

---

## 1. Qué es, en una línea

**No es una SaaS: es una consultora/agencia que instala, a medida y a mano, un equipo de asistentes de
Claude dentro de grupos de WhatsApp de la inmobiliaria**, uno por departamento, alimentados por una base
de conocimiento ("el cerebro") que arman con el cliente en el onboarding. Se vende con llamada de
diagnóstico (high-ticket, precio no publicado). Dicen tenerlo instalado en más de 25 inmobiliarias.

Esto es la oportunidad: **lo que ellos hacen a mano por cliente, se puede productizar** (onboarding
guiado, agentes de catálogo, conectores estándar) y vender más barato, más rápido y con cumplimiento
legal argentino resuelto.

---

## 2. El embudo de la landing (cómo captan)

La página tiene dos estados:

1. **Puerta (gate)**: modal que pide nombre, WhatsApp (selector de 15 países de LatAm + España + EE.UU.)
   y email a cambio de un recurso gratuito ("Recurso Claude Inmobiliario") que prometen mandar
   **por WhatsApp en minutos**.
2. **Contenido desbloqueado**: al enviar, se guarda una marca en `localStorage` (no vuelve a pedir datos)
   y aparece la landing real: titular, VSL embebido, 4 agentes de muestra, integraciones y un calendario
   para agendar la **llamada de diagnóstico**.

Detalles técnicos observados (útiles para replicar el embudo propio):

| Pieza | Cómo está hecho |
|---|---|
| Página | React 18 exportado como HTML estático (bundle con recursos embebidos), estética oscura con acento terracota |
| Lead | `POST` *no-cors* a un webhook de **GoHighLevel / LeadConnector** (form-urlencoded) |
| Datos que mandan | nombre, email, teléfono E.164, país, `lead_magnet`, `origen` ("Landing VSL Agentes"), **`asignacion`** (parámetro `?ref=`, con un setter por defecto), `lm`, `utm_source/medium/campaign/content` |
| Validación | nombre ≥ 2, email por regex, teléfono 8–13 dígitos sin 0 ni 15 |
| Entrega del recurso | automatización de GHL por WhatsApp (no visible, se infiere del texto) |
| Agenda | widget de reservas de LeadConnector embebido |
| Video | Loom embebido |

Lectura comercial: embudo clásico de **lead magnet → VSL → llamada**, con atribución por setter (`ref`)
y UTMs para medir campañas de Meta Ads. El lead queda en el CRM antes de ver el video.

### Mensajes de la landing

- Promesa: un equipo de agentes de IA "trabajando dentro" de la inmobiliaria, que **captan, califican,
  hacen seguimiento y entrenan** asesores todos los días.
- 4 agentes de muestra: **Captación** (responde a propietarios y agenda tasación), **Análisis y tasación**
  (comparables + informe de zona), **Ventas y seguimiento** (sigue compradores según "temperatura"),
  **Capacitación** (entrena asesores con SOPs y simulador de objeciones).
- "Y muchos más": alquileres, contratos, contenido, Meta Ads, reportes.
- Integraciones: se le escribe al agente **por WhatsApp como a un asesor más**; conectados al **CRM**
  (cargan leads, actualizan estado, registran conversaciones), **Google Calendar** (agendan en la agenda
  del asesor correcto), **análisis de competencia** (redes y portales, qué publican y a qué precio),
  **24/7**.

---

## 3. El video (VSL), por bloques

Resumen propio con marcas de tiempo.

| Tiempo | Bloque | Contenido |
|---|---|---|
| 00:00–02:30 | A quién le habla | (a) dueño/director de inmobiliaria con **3 a 20+ asesores** donde "todo pasa por él", cada asesor trabaja a su manera, un asesor nuevo tarda meses en rendir; (b) **asesor independiente** que hace el trabajo de 5 personas |
| 02:30–04:40 | Diagnóstico del dolor | Sumar gente no saca trabajo, lo agrega (buscar, entrevistar, capacitar). El problema real: **el conocimiento vive en la cabeza** del dueño y de los mejores asesores; no hay procesos escritos ni automatización |
| 04:40–06:40 | Lo que ya probaron y falló | **CRM pago que solo usan para publicar en portales**, el equipo sigue en WhatsApp; **ChatGPT/Claude usado como buscador** que cada día arranca de cero y da resultados genéricos; cursos de IA abandonados |
| 06:40–08:00 | La propuesta | Un asistente por departamento que ya conoce tus procesos, precios, cartera, zonas, forma de hablar y objeciones. Nombra 10: **captación, tasación, marketing, leads, ventas, alquileres, asesores, contratos, publicidad, dirección** |
| 08:00–09:40 | Dónde vive | **Comunidad de WhatsApp** con **un grupo por departamento**, y dentro de cada grupo su asistente. Sin apps nuevas: "como un compañero más" |
| 09:40–10:40 | Demo 1: tasación | "Armame la presentación de tasación con estos datos, para mañana, zona X" → la devuelve en el grupo como **página web, PDF, imagen o texto** |
| 10:40–12:30 | Demo 2: marketing | "Estudiá las campañas de captación de mi zona y mis competidores" → devuelve un **informe web**: panorama, patrones, espacios libres, piezas sugeridas, qué evitar, ángulos, destinos de los CTA (formulario vs WhatsApp), ángulos repetidos por competidor, anexo de fuentes |
| 12:30–13:30 | Conectores | CRM, Google Sheets/Excel (métricas, leads, contactos), **Google Calendar** (agendar visitas por mensaje), **Google Drive** (informes, contratos, presentaciones), **Meta Ads** (leer, prender/apagar campañas, reportes), redes (crear y **publicar** contenido adaptado a LinkedIn, Instagram, Facebook) |
| 13:30–14:40 | Cómo funciona por dentro | En el centro está **Claude**. En el onboarding arman **documentación de la empresa** en 10 temas (ver §4) = "el cerebro". Sobre eso, un **orquestador de agentes** que trabaja por WhatsApp |
| 14:40–17:35 | Detalle de 5 agentes | Ver §5 |
| 17:35–19:30 | Calificación inversa | "No es para vos" si recién empezás o no tenés procesos, si buscás magia, o si no ponés **un par de horas de onboarding**. Sí es para quien ya opera y siente que todo depende de él |
| 19:30–20:05 | Cierre | Agendar llamada de diagnóstico abajo de la página |

---

## 4. "El cerebro": la base de conocimiento del onboarding

Es la pieza central del método y la más fácil de productizar. Los 10 temas que arman con el cliente:

1. Empresa (historia, estructura)
2. Equipo (roles, quién hace qué)
3. Zonas de mercado
4. Servicios y comisiones
5. Cartera (propiedades)
6. Propuesta de valor
7. Marca y tono
8. Objeciones y preguntas frecuentes
9. Legales y plantillas
10. Objetivos y KPIs

En nuestro producto esto pasa a ser un **asistente de onboarding** que entrevista al dueño (por chat o
voz), arma cada documento, los deja editables y versionados, e importa la cartera desde el CRM o un CSV.

---

## 5. Catálogo de agentes que describen

| Agente | Qué hace según la referencia |
|---|---|
| **Marketing** | Calendario mensual de contenido, hooks y guiones de reels, carruseles, guion de video-tour (cómo recorrer la propiedad), fichas y copys para portales, marca personal del asesor, newsletters, LinkedIn |
| **Asesores** | Perfiles de puesto, selección y entrevistas, onboarding con **plan de 30 días**, manual de procesos y SOPs, **roleplay** de objeciones, evaluación del equipo con métricas |
| **Captaciones** | Conseguir propiedades: prepara al asesor antes de ver al propietario, sigue cada captación hasta la firma |
| **Tasaciones** | Comparables, métodos que define la inmobiliaria, precio por m², rango de valor, informe de tasación "para que el propietario lo acepte", **reportes periódicos al propietario** (servicio premium) |
| **Ventas** | Prepara la visita (documentos, guiones), manejo de objeciones, seguimiento post-visita, negociación, posventa y **pedido de referidos** |
| Leads, alquileres, contratos, publicidad, dirección | Solo nombrados, sin detalle |

Patrón común: **agentes internos (copilotos del equipo)**, no chatbots de cara al público. La landing
sugiere también atención a propietarios y compradores, pero el video muestra solo uso interno.

---

## 6. Fortalezas y debilidades de la referencia

**Fortalezas**

- Canal sin fricción: WhatsApp, donde ya vive el equipo. Cero adopción de herramienta nueva.
- Organización por departamento = modelo mental que el dueño entiende de inmediato.
- Entregables "presentables" (página, PDF, imagen), no texto suelto.
- El cerebro resuelve el problema real (conocimiento en cabezas) y genera lock-in.
- Embudo bien armado (lead magnet → VSL → llamada) con atribución por setter.

**Debilidades / huecos que podemos atacar**

- **Servicio artesanal**: cada instalación es a mano; escala con horas del consultor, precio alto.
- **Bots dentro de grupos de WhatsApp**: la API oficial de WhatsApp Business tiene soporte de grupos
  limitado; si usan librerías no oficiales (tipo Baileys/Evolution API) hay **riesgo de bloqueo del
  número** y de incumplir los términos de Meta. A verificar en `05-ARQUITECTURA-Y-COSTOS.md`.
- **Sin capa legal visible**: nada sobre matrícula, datos personales (Ley 25.326), consentimiento,
  Registro No Llame, ni revisión humana de tasaciones. En Argentina eso es un diferencial vendible.
- **Sin panel**: todo vive en el chat. El dueño no tiene tablero de KPIs, historial ni control de
  qué hace cada agente.
- **Sin atención al cliente final** demostrada (calificación 24/7, agenda de visitas), que es lo que el
  resto del mercado vende primero (ver `02-MERCADO-Y-CASOS-DE-USO.md`).
- Integración con CRM genérica: no nombra los CRM inmobiliarios que se usan en Argentina.
