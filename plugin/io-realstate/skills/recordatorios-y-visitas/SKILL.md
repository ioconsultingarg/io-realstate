---
name: recordatorios-y-visitas
description: >
  Esta skill se usa cuando el asesor dice "recordame…", "agendame…", "anotá que…", "agendá la visita con {cliente}
  en {dirección} el {día}", "¿qué tengo hoy?", "¿qué tengo esta semana?", "mové la visita de…" o "cancelá…". Crea,
  consulta y modifica visitas, tasaciones y recordatorios en Google Calendar a partir de frases como las de WhatsApp.
metadata:
  version: "0.1.0"
---

# Recordatorios y visitas

Usar el conector de Google Calendar. Si no está activo, pedirle al asesor que lo conecte (Claude → Conectores →
Google Calendar) y recomendar: lectura "permitir siempre", escritura "requiere aprobación".

## Entender la frase

Extraer de lo que escribe el asesor:

- **Qué:** la acción, en infinitivo y con mayúscula ("Llamar a Lucía por el crédito"). Sacar "recordame",
  "agendame", el día y la hora del texto.
- **Tipo:** visita (con cliente y dirección), tasación (con propietario y dirección), llamada o tarea.
- **Cuándo:** "hoy", "mañana", "pasado mañana", un día de la semana (el próximo), una fecha ("el 20"). Hora con
  "a las 10", "10:30", "16 hs". Sin hora: recordatorio de día completo; para visitas y tasaciones, preguntar la hora.
- **Duración:** visita 45 minutos, tasación 1 hora, llamada 15 minutos, salvo que el asesor diga otra.
- **Dónde:** la dirección, para visitas y tasaciones.

No confundir alturas de calles con horas: en "visitar Gorriti 4820", 4820 es la dirección.

## Crear

1. Mostrar en una línea lo que se va a crear: "Visita con familia Ocampo · Melián 3120 · sáb 22/11 11:00 a 11:45".
2. Crear el evento con el conector (Claude pide la aprobación de escritura). Título corto, la dirección en el
   lugar, y en la descripción solo lo necesario (nombre de pila del cliente y la búsqueda). No poner teléfonos ni
   datos personales del cliente en el evento.
3. Si es una visita de una búsqueda, anotarla en el historial de la ficha (`busquedas/`).
4. Confirmar: "Listo, quedó el sábado 22 a las 11:00".

Antes de crear una visita, revisar si hay otro evento a esa hora y avisarlo.

## Consultar

"¿Qué tengo hoy?" o "¿qué tengo esta semana?": listar por día y hora, marcando visitas y tasaciones primero.
Ofrecer preparar algo útil para lo próximo: el ACM antes de una tasación (skill `tasacion-acm`) o el mensaje de
confirmación el día anterior a una visita (skill `mensaje-en-tu-voz`).

## Modificar o cancelar

Buscar el evento por cliente, dirección o día. Si hay más de uno posible, preguntar cuál. Mostrar el cambio en una
línea y aplicarlo con aprobación.
