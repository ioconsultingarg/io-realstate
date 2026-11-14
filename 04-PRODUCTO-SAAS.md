# 04 · Producto: el equipo de agentes como SaaS

Producto: **IO-RealState** (repo `ioconsultingarg/io-realstate`).

## 1. Tesis

> La inmobiliaria argentina no necesita más gente: necesita que **lo que sabe el dueño deje de vivir en
> su cabeza**. Le damos un equipo de agentes que ya conoce su forma de trabajar, que atiende en
> WhatsApp y que entrega trabajo presentable (tasaciones, informes, contenido, capacitación) con la firma
> del corredor y dentro de la ley.

Qué tomamos de la referencia: agentes por departamento, WhatsApp como canal, "el cerebro" como base y los
entregables presentables. Qué agregamos: **producto en lugar de horas de consultor**, un **panel** para el
dueño, **atención al cliente final** (lo que el resto del mercado vende primero), **capa legal argentina**
y **precio público**.

## 2. A quién se le vende

| Segmento | Dolor principal | Qué compra primero |
|---|---|---|
| Inmobiliaria de 3 a 20 asesores (núcleo) | Todo pasa por el dueño; consultas sin responder fuera de horario; asesores nuevos tardan meses | Atención 24/7 + tasaciones + capacitación |
| Corredor independiente o equipo de 2 | Hace el trabajo de 5 personas | Tasaciones, contenido y seguimiento |
| Red o franquicia con sucursales | Estandarizar procesos entre oficinas | Cerebro compartido + capacitación + tablero |

Primer mercado: CABA y GBA (un solo colegio y un solo marco para empezar); después provincias por pedido.

## 3. Módulos

### 3.1 Cerebro (base de conocimiento)

- **Onboarding guiado**: un agente entrevista al dueño en 10 temas (empresa, equipo, zonas, servicios y
  comisiones, cartera, propuesta de valor, marca y tono, objeciones y FAQ, legales y plantillas, objetivos y
  KPIs) y redacta cada documento. El dueño revisa y aprueba. Objetivo: **cerebro usable en 2 horas**.
- Documentos editables y versionados; cada respuesta de un agente puede citar de qué documento salió.
- **Cartera sincronizada**: importación CSV en el MVP; conectores a CRM inmobiliarios después. Campo
  `estado` obligatorio (disponible, reservada, vendida/alquilada) y fecha de última actualización visible.
- Datos del **corredor responsable** (nombre, matrícula, jurisdicción) que alimentan los pies legales.

### 3.2 Equipo de agentes (catálogo)

Cada agente = instrucciones + herramientas permitidas + plantillas de entregable + reglas. La inmobiliaria
activa los que necesita.

| Agente | Cara | Entregables / acciones | Fase |
|---|---|---|---|
| **Atención y leads** | Cliente | Responde con la cartera real, califica, agenda visita, deriva con resumen, carga el lead | MVP |
| **Captación** | Ambas | Atiende propietarios y agenda tasación; prepara al asesor antes de la reunión; seguimiento hasta la autorización | MVP |
| **Tasación** | Interno | Borrador de ACM con comparables y rango, en página/PDF con marca; reporte periódico al propietario | MVP |
| **Marketing** | Interno | Fichas y copys para portales y redes, calendario de contenido, guiones de reels y video-tour, **análisis de competencia** | MVP |
| **Capacitación** | Interno | Plan de 30 días, manual de procesos, **roleplay de objeciones** con devolución | MVP |
| **Ventas** | Interno | Preparación de visita, objeciones, seguimiento post-visita, pedido de referidos | Fase 2 |
| **Alquileres** | Ambas | Comprobantes de pago, incidencias, ajustes por índice según contrato, vencimientos | Fase 2 |
| **Dirección** | Interno | Resumen semanal del negocio, alertas (leads sin respuesta, captaciones frenadas) | Fase 2 |
| **Publicidad** | Interno | Lectura de Meta Ads y reporte; después prender/apagar con aprobación | Fase 2/3 |
| **Contratos** | Interno | Borradores desde plantillas de la inmobiliaria, siempre revisados por el corredor | Fase 3 |
| **Cumplimiento** | Interno | Checklist UIF por operación, opt-in y Registro No Llame | Fase 3 |

Un **orquestador** decide qué agente atiende cada pedido (por intención o por comando, p. ej.
`#tasación`), y los agentes comparten el cerebro.

### 3.3 Canales

- **Número de atención de la inmobiliaria** (WhatsApp Business API oficial): agente de atención y captación.
- **Canal del equipo**: los asesores le escriben al asistente por WhatsApp 1:1 (el orquestador enruta al
  departamento) y, en paralelo, en el **panel web** con una "sala" por departamento. Grupos de WhatsApp solo
  si la API oficial lo permite (ver `05`).
- Instagram Direct y chat web: fase 2.

### 3.4 Panel del dueño

- Conversaciones (con posibilidad de tomar el control y responder a mano).
- Tablero: tiempo de primera respuesta, consultas fuera de horario, leads calificados, visitas agendadas y
  no-show, captaciones en curso, entregables generados.
- Cola de aprobación: entregables que salen hacia un cliente (tasación, documentos) pasan por el corredor.
- Configuración de agentes, cerebro, conectores, textos legales y consumo.

### 3.5 Capa legal (diferencial)

Todo lo de `03-MARCO-LEGAL-AR.md` convertido en comportamiento: aviso de asistente automatizado y
privacidad, pie con matrícula, "no prometo precio ni cierro", opt-in para salientes, auditoría, retención y
borrado, y verificación del corredor al alta.

## 4. MVP (lo mínimo que se puede vender)

Siguiendo el criterio de IO Consulting (**no construir lo que todavía nadie compró**):

**Paso 0 — Demo vendible (2 semanas).** Demo navegable sin backend, como los otros demos del portfolio,
con una inmobiliaria ficticia: chat de WhatsApp simulado (consulta nocturna → calificación → visita
agendada), un pedido interno de tasación que devuelve el ACM en página/PDF, un informe de competencia y el
panel del dueño. Sirve para las primeras entrevistas y para el embudo propio.

**Paso 1 — Piloto con 2 o 3 inmobiliarias (6 a 8 semanas).**

1. Cerebro con onboarding guiado + cartera por CSV + corredor responsable.
2. Agente de atención y leads en el número de la inmobiliaria: calificación, Google Calendar, derivación.
3. Agentes internos: tasación (ACM), marketing (fichas + competencia), capacitación (roleplay).
4. Panel: conversaciones, tablero básico, cola de aprobación.
5. Capa legal mínima: avisos, pie de matrícula, auditoría, consentimiento.

Queda **fuera** del MVP: voz, publicación en redes, escritura en Meta Ads, scoring de inquilinos, conectores
a CRM (salvo que el piloto lo exija), multi-sucursal.

**Criterio de éxito del piloto** (medido, no prometido): primera respuesta < 1 min en el 95% de las
consultas, ≥ 30% de consultas atendidas fuera de horario, visitas agendadas por el agente, y que el dueño
use al menos 3 entregables internos por semana.

## 5. Modelo de negocio (hipótesis a validar en entrevistas)

Ninguna referencia publica precio; publicar uno simple es diferencial. Valores en USD, cobrables en pesos.

| Plan | Para quién | Incluye | Hipótesis |
|---|---|---|---|
| Independiente | 1 corredor | Cerebro + agentes internos (tasación, marketing, capacitación) por WhatsApp y panel | USD 49/mes |
| Inmobiliaria | Hasta 10 asesores | Todo lo anterior + agente de atención en 1 número + tablero + aprobación | USD 249/mes |
| Red | Sucursales / +10 asesores | Varios números, cerebro compartido, reportes por sucursal | A medida |
| Implementación asistida | Opcional | IO Consulting arma el cerebro con el dueño y capacita al equipo | Pago único, según diagnóstico |

La implementación asistida sigue el proceso de IO Consulting: reunión inicial sin costo → diagnóstico y
propuesta → implementación y seguimiento, sin paquetes rígidos. El costo variable (IA + WhatsApp) está
estimado en `05`; los planes dejan margen aun con uso alto.

## 6. Embudo propio (cómo vender)

Replicar la mecánica que funciona en la referencia, con herramientas propias:

1. **Lead magnet** útil y propio (p. ej. "plantilla de cerebro inmobiliario" o "10 prompts de tasación con
   tu cartera"), entregado por mail; contacto de IO Consulting solo por mail.
2. **Video corto** con la demo real (no promesas): consulta de las 23 h atendida, tasación en 2 minutos,
   roleplay de objeciones.
3. **Agenda de diagnóstico** de 20 minutos.
4. Atribución con UTM y origen en el CRM de IO Consulting.
