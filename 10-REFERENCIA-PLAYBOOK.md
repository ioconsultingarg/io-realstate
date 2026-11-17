# 10 · Referencia: el playbook "Claude de punta a punta" de Real Growth

Relevado el 16/11/2026. Fuentes: el PDF que Gonzalo descargó ("Claude de punta a punta · Las 18 funciones de Claude
para tu inmobiliaria", 20 páginas) y su versión web en https://claude-inmobiliario-desde-0.netlify.app/. Es el
"Recurso Claude Inmobiliario" que la landing de `01` regala a cambio de nombre, WhatsApp y mail.

Análisis propio. No se copian textos, nombres ni diseño.

---

## 1. Qué es

Un **playbook de 20 páginas** que explica, para inmobiliarias y sin tecnicismos, **18 funciones del producto Claude**
(la app de Anthropic) en cinco capas, de lo más simple a lo más autónomo, con una semana de implementación y dos
llamados de venta al final.

| Capa | Funciones (las ★ son las que el autor marca como clave) |
|---|---|
| 1 · La base | Chat, modelos (Haiku / Sonnet / Opus), búsqueda web e investigación |
| 2 · Tu inmobiliaria dentro de Claude | ★ Proyectos (uno por área: captaciones, ventas, marketing…), archivos, artefactos, visuales interactivos |
| 3 · Procesos que se repiten solos | ★ Skills, ★ Conectores (Gmail, Calendar, Drive, Notion, CRM…), plugins |
| 4 · Claude trabajando por ti | ★ Cowork (tareas de varios pasos), tareas programadas, Claude en Chrome |
| 5 · Autonomía total | Importar memoria, Dispatch (pedir desde el celular y que se ejecute en la computadora), app móvil, Claude Code, Claude Design |

Cierra con **"Tu primera semana"** (una capa por día, con casillas que se guardan en el navegador), los **5
procesos para automatizar primero** (presentación de captación, ficha para portales, seguimiento de leads,
calendario de contenido, informe de mercado mensual) y la oferta de servicio.

---

## 2. El hallazgo: los "agentes" de Real Growth son Claude configurado

Lo que en la landing y el video de `01` se presenta como "un equipo de agentes de IA trabajando dentro de tu
inmobiliaria" es, según su propio playbook:

- **Un proyecto de Claude por área** ("Captaciones / Inmobiliaria X") con instrucciones y archivos: eso es "el
  agente de captación". El "cerebro" del video son los archivos de contexto de cada proyecto.
- **Skills** con los procesos de la inmobiliaria. Dicen tener **60 skills inmobiliarias** (cerebro inmobiliario,
  plan de 90 días, manual de marca, anuncio, presentación de captación, ficha para portales, lanzamiento,
  prelisting, guion de llamada al propietario, informe de mercado, research de competidores, Meta Ads…).
- **Plugins por área** (ejemplo: "LinkedIn Inmobiliario", 5 skills y un conector).
- **Conectores** de Google y del CRM, **Cowork** para tareas largas, **tareas programadas** para lo semanal y
  **Dispatch / app móvil** para pedir desde la calle.

Su servicio pago ("lo hacemos contigo") es **armar eso para la inmobiliaria**: proyectos y plugins por área,
skills con sus procesos, conexión con CRM y WhatsApp, y el equipo usando el mismo sistema. Cada usuario necesita
**su propia cuenta de Claude** (el playbook recomienda el plan Pro, USD 20 por mes, según su texto).

**No hay software propio.** El valor que venden es el conocimiento del rubro empaquetado en skills y la
implementación. Eso confirma lo de `01` (agencia, no SaaS) y lo precisa.

---

## 3. Cómo funciona el embudo (completo)

1. Landing con video de venta: nombre, WhatsApp y mail a cambio del recurso (webhook a GoHighLevel, `01`).
2. El recurso es **este playbook**, publicado como página web en Netlify y descargable en PDF (el botón "Descargar
   PDF" hace `window.print()`: el PDF es la misma página impresa).
3. La web tiene, en cada página: paginador (1 / 20), video en YouTube, **botones para copiar los prompts**,
   la lista de la semana con casillas guardadas en el navegador, y cuatro llamados fijos arriba: ver el video,
   descargar PDF, hablar por WhatsApp con el autor, agendar llamada (calendario de GoHighLevel embebido).
4. **Bucle de LinkedIn:** las 60 skills se piden comentando "SKILLS" en la publicación donde apareció el playbook;
   cada comentario empuja el alcance de la publicación.
5. Cierre: diagnóstico gratis de 30 minutos → servicio pago de implementación.

---

## 4. Fortalezas y debilidades

**Fortalezas**

- Enseña de verdad: alguien puede leerlo y empezar solo. Eso genera confianza antes de vender.
- Ordenado por capas, con un camino rápido (4 páginas) y un plan de 7 días accionable.
- Ejemplos inmobiliarios concretos en cada función (tasación en el calendario, comparativa de portales,
  calendario de Instagram).
- Mismo diseño en web y PDF; la web suma lo interactivo (copiar prompts, casillas).

**Debilidades y riesgos**

- **Se vuelve viejo rápido:** depende de pantallas, nombres de menús, planes y precios de un producto ajeno que
  cambia seguido. El propio texto pide verificar precios.
- **Escrito en "tú"**, aunque apunta a Argentina (ejemplos en Córdoba). Para el corredor argentino suena a
  contenido genérico.
- **Privacidad casi ausente:** una sola línea sobre datos sensibles al importar memoria. Nada sobre Ley 25.326,
  consentimiento de clientes ni qué datos de terceros se suben a una cuenta personal de Claude.
- **Recorrer portales con Claude en Chrome** se propone sin mencionar los términos de uso de los portales (ver `03`).
- **Dependencia total de la cuenta de cada usuario:** si el asesor se va, se lleva su cuenta con los proyectos y
  skills; no hay panel del dueño ni trazabilidad de qué se mandó a quién.

---

## 5. Qué significa para IO-RealState

**Dos caminos que no se excluyen:**

| | Camino A · Plugin de IO-RealState para Claude | Camino B · SaaS propio (lo diseñado en `04`–`09`) |
|---|---|---|
| Qué es | Skills + conectores + tareas programadas instaladas en la cuenta de Claude del asesor | Producto propio con panel, WhatsApp oficial, cartera, multiusuario |
| Sirve para | El **asesor individual** (`09`): búsquedas, ACM, borradores en su voz, recordatorios | La **inmobiliaria**: atención 24/7 a clientes, equipo, dueño, auditoría |
| Tiempo | Días a 2 semanas | 13 semanas (`08`) |
| Costo para el cliente | Su plan de Claude + nuestro paquete / implementación | Suscripción (`08` §5.2) |
| Límite | No atiende clientes solo por WhatsApp; sin panel ni control del dueño | Más desarrollo y trámites (Meta, Google) |

El camino A encaja muy bien con lo que pidió el colega de Gonzalo:

- **Búsquedas que avisan:** el conector de **Gmail** lee los mails de alertas de los portales (justo lo que
  propone `09`), una **tarea programada** diaria los compara con las búsquedas guardadas en una planilla o en el
  proyecto, y deja el resumen con el porqué. Las reglas de afinidad de la demo (obligatorio / deseable / a
  verificar) se escriben como skill.
- **ACM:** skill con el método de la demo (mediana de USD/m², ajuste declarado, rango, días de venta) y salida en
  documento con la firma del corredor.
- **Mensajes en su voz:** skill que aprende de mensajes pegados por el asesor y aplica las reglas anti-IA de `09`.
- **Recordatorios y agenda:** conector de Google Calendar.

Diferencias que podemos sostener frente a Real Growth: **castellano rioplatense**, **capa legal argentina**
(matrícula, Ley 25.326, alertas de portales en lugar de recorrerlos), **método explicable** (cada afinidad y cada
tasación dice por qué) y, cuando el cliente crece, **un camino al producto propio** con panel y control del dueño.

**Lo que no hay que hacer:** copiar el playbook, sus nombres de skills o su diseño, ni hacer un recurso que
envejezca con cada cambio de pantallas de Claude. Si IO Consulting hace un recurso gratuito, que enseñe el
**proceso inmobiliario** (cómo armar una búsqueda, cómo tasar con comparables, cómo escribir sin sonar a IA) y
use Claude como herramienta, no al revés.
