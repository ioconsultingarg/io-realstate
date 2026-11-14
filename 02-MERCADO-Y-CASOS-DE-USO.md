# 02 · Mercado y casos de uso

Relevado el 14/11/2026. Fuentes (todas son páginas de proveedores o consultoras, así que **las cifras son
afirmaciones comerciales sin metodología visible**; sirven como orientación, no como dato):

| Sigla | Fuente | Origen | Tipo |
|---|---|---|---|
| RG | realgrowth.site + VSL Loom | AR/LatAm | Agencia, agentes internos por WhatsApp (ver `01`) |
| DB | databot.com.ar — casos de uso de agentes IA en inmobiliaria | AR | Consultora de automatización |
| BE | beam.ai — property management | Global | Plataforma de agentes (administración de propiedades) |
| AI | agentesinteligentes.mx — IA en el sector inmobiliario | MX | Servicio administrado de voz + WhatsApp para desarrolladoras |
| PD | pautadigital.com.ar — agente IA para inmobiliarias | AR | Consultor de marketing |
| SI | solucionesia.cloud — implementar un agente paso a paso | CO | Guía de implementación |
| SF | sleekflow.io — IA para agentes inmobiliarios | Global | Plataforma omnicanal (WhatsApp API) |
| DA | dapta.ai — real estate | LatAm | Agentes de voz y texto sin código |
| VC | vcfmarketing.com — IA en el sector inmobiliario | ES | Agencia de captación |
| MC | myclaw.ai — AI real estate agent | Global | Hosting de agente personal (OpenClaw) |
| DC | datachaco.com — IA en inmobiliarias del NEA | AR (Chaco) | Nota sobre Wizzbot (Vida Digital) |
| RA | rendair.ai — herramientas de IA para corredores 2026 | Global | Guía de herramientas |

---

## 1. Tabla consolidada de casos de uso

Agrupados por **departamento**, que es como lo piensa el dueño de la inmobiliaria (y como lo vende RG).
"Cara" = de cara al cliente final (comprador, propietario, inquilino) o interno (copiloto del equipo).

### Leads y atención comercial

| Caso de uso | Cara | Fuentes | Prioridad MVP |
|---|---|---|---|
| Respuesta 24/7 en WhatsApp/IG/web con la cartera real | Cliente | DB, PD, SI, SF, DA, DC, VC, MC | **Alta** |
| Calificación (zona, presupuesto, compra/alquiler, forma de pago, urgencia) con puntaje caliente/tibio/frío | Cliente | DB, AI, PD, SI, SF, MC | **Alta** |
| Derivación al asesor correcto con resumen de la conversación | Interno | PD, SI, SF, DA, AI | **Alta** |
| Agenda de visitas en el calendario del asesor + confirmación y recordatorios 24 h / 2 h | Cliente | DB, PD, SI, SF, DA, RG | **Alta** |
| Carga y actualización automática del CRM (lead, etapa, conversación) | Interno | RG, SI, SF, DA, AI, MC | **Alta** |
| Matching semántico ("silencioso", "home office") contra la cartera | Cliente | DB, AI, SI, SF | Media |
| Seguimiento multicanal por días hasta que el lead avanza | Cliente | AI, SF, MC | Media |
| Reactivación de base histórica cuando entra una propiedad compatible o baja un precio | Cliente | DB, AI, SF, DA, MC | Media |
| Llamadas de voz con IA (entrantes y salientes, devolución en segundos) | Cliente | AI, DA, MC | Baja (fase 3) |
| Resumen diario/semanal del pipeline al dueño | Interno | MC | Media |

### Captación de propiedades

| Caso de uso | Cara | Fuentes | Prioridad MVP |
|---|---|---|---|
| Atender al propietario que quiere vender/alquilar y agendar la tasación | Cliente | RG, PD, SI | **Alta** |
| Preparar al asesor antes de la reunión con el propietario (perfil, zona, argumentos) | Interno | RG | **Alta** |
| Seguimiento de cada captación hasta la firma de la autorización | Interno | RG | Media |
| Monitoreo de avisos de dueños directos y publicaciones estancadas (+60 días) | Interno | DB | Media (ver límites legales en `03`) |
| Segmentación de propietarios potenciales | Interno | VC | Baja (riesgo de datos personales) |

### Tasación y análisis

| Caso de uso | Cara | Fuentes | Prioridad MVP |
|---|---|---|---|
| Informe de tasación / ACM con comparables, USD/m², rango, con la marca de la inmobiliaria (PDF/página) | Interno → propietario | RG, DB, AI, SF, VC | **Alta** |
| Reporte periódico al propietario sobre su propiedad publicada (consultas, visitas, mercado) | Propietario | RG | Media |
| Análisis predictivo de demanda, absorción y pricing | Interno | AI, BE, SF, VC | Baja |

### Marketing y publicidad

| Caso de uso | Cara | Fuentes | Prioridad MVP |
|---|---|---|---|
| Fichas y copys para portales, web y redes a partir de los datos de la propiedad | Interno | RG, DB, SF, AI, VC, RA | **Alta** |
| Calendario de contenido, guiones de reels, carruseles, guion de video-tour | Interno | RG | **Alta** |
| Análisis de competencia (qué publican, ángulos, precios, CTA) con informe | Interno | RG | **Alta** (diferencial demostrable) |
| Meta Ads: leer métricas, reportes, prender/apagar campañas | Interno | RG, SF | Media (lectura) / Baja (escritura) |
| Publicación en redes (IG, FB, LinkedIn) | Interno | RG | Baja |
| Home staging virtual / renders / limpieza de fotos | Interno | RA, VC | Fuera de alcance (integrar herramienta de terceros) |
| Broadcast de bajas de precio y nuevas propiedades | Cliente | SF | Media |

### Ventas y posventa

| Caso de uso | Cara | Fuentes | Prioridad MVP |
|---|---|---|---|
| Preparar la visita: documentos, guion, objeciones probables | Interno | RG | Media |
| Seguimiento post-visita y pedido de referidos | Cliente/Interno | RG | Media |
| Open houses: invitaciones, recordatorios, seguimiento | Cliente | SF | Baja |
| Envío de documentación (reglamentos, fichas técnicas, modelos de contrato) con autorización previa | Cliente | SI | Media |

### Alquileres y administración

| Caso de uso | Cara | Fuentes | Prioridad MVP |
|---|---|---|---|
| Recepción de comprobantes de pago (expensas, alquiler) por WhatsApp | Inquilino | DC | Media |
| Incidencias del inquilino con foto/video, clasificación de urgencia, orden de trabajo | Inquilino | DB, BE | Fase 2 |
| Precalificación de inquilinos con documentación (OCR de recibos, garantías) | Inquilino | DB, BE | Fase 2, con cuidado legal (`03`) |
| Cobranzas y recordatorios de vencimiento | Inquilino | BE, DA | Fase 2 |
| Ajustes de contrato por índice (ICL, IPC, Casa Propia) | Interno | (Colegio: calculadora) | Fase 2 |

### Equipo y dirección

| Caso de uso | Cara | Fuentes | Prioridad MVP |
|---|---|---|---|
| Onboarding de asesores nuevos con plan de 30 días y manual de procesos | Interno | RG | **Alta** |
| Roleplay / simulador de objeciones | Interno | RG | **Alta** (diferencial demostrable) |
| Selección: perfiles de puesto, guías de entrevista | Interno | RG | Media |
| Tablero de KPIs (primera respuesta, leads calificados, visitas, captaciones) | Interno | PD, SI, RG | **Alta** |

---

## 2. Lo que todas las fuentes coinciden en advertir

1. **El agente no reemplaza al corredor**: negociación, precio final, tasación firmada y cierre quedan en
   manos humanas (DB, PD, MC, SI).
2. **Cartera desactualizada = respuestas inventadas** (propiedades vendidas, precios viejos, duplicados).
   El sincronizador de cartera es tan importante como el agente (PD, SI, MC).
3. **Reglas explícitas**: no ofrecer reservadas, no prometer precios ni financiación, pedir autorización
   antes de mandar documentos, decir "lo verifico" cuando un dato no está en la fuente (SI, MC).
4. **Escalamiento humano** definido: quejas, descuentos, temas legales, pedido de asesor (SI, DA, BE).
5. **Un responsable interno** que lea conversaciones reales todas las semanas (PD).
6. **No depender de un proveedor que no deja ver ni tocar el flujo** (PD): argumento a favor de un
   panel transparente.

---

## 3. Métricas que circulan (para el pitch, citadas como "según proveedores")

- 80% de probabilidad de que el interesado consulte a otra inmobiliaria si no recibe respuesta en 10 min (DB).
- Más del 60% de las consultas llegan fuera de horario (DB).
- Ausentismo a visitas de 28% a 4% con recordatorios (DB).
- 12 h semanales ahorradas por asesor (DB).
- Solo ~23% de los prospectos contesta el teléfono; llamar a los 3 s triplica contactos vs 60 s (AI, estudio propio de 10.000 llamadas en México).

**Regla interna**: no usarlas como promesa propia. Medir las nuestras desde el piloto
(tiempo de primera respuesta, % fuera de horario, leads calificados, visitas agendadas, no-show).

---

## 4. Precios

**Ninguna fuente publica precio** de su servicio de agentes inmobiliarios: todas venden por demo,
diagnóstico o cotización. Referencias de herramientas genéricas: Lofty ~USD 449/mes (CRM con IA, EE.UU.),
Rendair ~USD 19/mes (staging), ChatGPT USD 20/mes. **Un precio público y simple es un diferencial**
(ver `04-PRODUCTO-SAAS.md`).

---

## 5. Competencia directa en Argentina (primer mapa)

| Jugador | Qué ofrece | Cómo se diferencia lo nuestro |
|---|---|---|
| Real Growth | Agentes internos por WhatsApp, a medida, high-ticket | Producto con onboarding guiado, panel, capa legal, precio público |
| Wizzbot (Vida Digital, Resistencia) | Bandeja omnicanal con IA, integrada con **SOM** (sistema de ofertas múltiples del NEA), 60+ empresas | Agentes internos por departamento (tasación, marketing, capacitación), no solo atención |
| DataBot, Pauta Digital | Consultoría + implementación de bots | Producto propio, no horas de consultor |
| Cliengo, Dapta, SleekFlow | Plataformas horizontales de chatbot/voz | Vertical inmobiliario argentino: cerebro, ACM, normativa, CRM locales |
| CRM inmobiliarios locales (p. ej. Tokko Broker) | Cartera, difusión a portales, contactos | **Nos conectamos a ellos**, no competimos: el video confirma que el CRM se usa casi solo para publicar en portales |

Pendiente: relevar integraciones disponibles (API) de los CRM inmobiliarios más usados en Argentina y de
SOM en el NEA, y las condiciones de los portales (Zonaprop, Argenprop, Mercado Libre Inmuebles) para
lectura de avisos. Ninguna fuente los nombra.
