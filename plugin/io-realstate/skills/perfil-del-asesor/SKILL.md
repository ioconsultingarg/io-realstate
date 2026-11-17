---
name: perfil-del-asesor
description: >
  Esta skill se usa cuando el asesor inmobiliario dice "configurá IO-RealState", "armá mi perfil", "empecemos",
  "aprendé cómo escribo", "te paso mis mensajes", "cambiá mi firma" o "actualizá mis zonas", o cuando otra skill
  de IO-RealState necesita el perfil y no existe todavía. Crea y mantiene la carpeta de trabajo y el perfil del
  asesor (datos de matrícula, zonas, forma de trabajar y estilo de escritura).
metadata:
  version: "0.1.0"
---

# Perfil del asesor

Crear y mantener `IO-RealState/perfil.md`, la base que usan todas las skills de IO-RealState. Hablar en castellano
rioplatense (vos), con frases cortas.

## Carpeta de trabajo

Todas las skills guardan sus datos en una carpeta `IO-RealState/` dentro de la carpeta de trabajo que el asesor
eligió en Cowork. Si no existe, crearla con esta estructura:

```
IO-RealState/
  perfil.md            ← esta skill
  busquedas/           ← una ficha por cliente comprador (skill busquedas-de-compradores)
  avisos-vistos.md     ← registro de avisos ya evaluados (skill revisar-alertas)
  comparables.md       ← ventas y publicaciones para tasar (skill tasacion-acm)
  tasaciones/          ← un informe por inmueble
  resumenes/           ← el resumen diario de alertas
```

Si no hay carpeta de trabajo elegida, pedirle al asesor que elija una en Cowork antes de seguir. Nunca guardar
datos de clientes fuera de esa carpeta.

## Entrevista inicial

Si `perfil.md` no existe, hacer la entrevista de a una pregunta por vez, en este orden. Aceptar respuestas
cortas; no insistir con lo que el asesor no quiera contestar.

1. Nombre y apellido, y cómo firma los mensajes ("Martina", "Martina de Arce Propiedades").
2. Si trabaja solo o en una inmobiliaria; en ese caso, cuál.
3. Corredor responsable y matrícula (con colegio: CUCICBA, CMCPSI, etc.). Explicar que va al pie de las
   tasaciones y que, si el asesor no es corredor, la tasación la firma el corredor de la inmobiliaria.
4. Zonas donde trabaja.
5. Horario en el que quiere recibir el resumen de alertas (por defecto, 8:00).
6. **Estilo de escritura:** pedirle que pegue entre 10 y 30 mensajes reales que haya mandado a clientes por
   WhatsApp (puede borrar nombres). Explicar que sirven para que los borradores suenen como él, no como una IA.

## Extraer el estilo

Con los mensajes pegados, describir en `perfil.md` (sección "Cómo escribe") reglas concretas y verificables:

- Saludo habitual ("Hola Lucía", "Buenas!", "Hola, ¿cómo va?").
- Tuteo o voseo; formalidad.
- Largo típico de mensaje y de frase (en palabras).
- Uso de emojis (cuáles y cuánto) y de signos de exclamación.
- Si usa listas, mayúsculas, abreviaturas ("q", "x", "dpto").
- Cómo cierra y cómo firma.
- 3 frases textuales típicas, para imitar el tono (sin datos de clientes).

No guardar los mensajes originales completos: solo las reglas y las 3 frases de ejemplo, sin nombres ni
teléfonos. Si pegó datos de clientes, avisarle que no se guardan.

Si el asesor no tiene mensajes para pegar, usar el estilo por defecto de `references/plantilla-perfil.md` y
anotar que es provisorio.

## Formato

Escribir `perfil.md` con la estructura de `references/plantilla-perfil.md`. Al terminar, mostrar un resumen de
5 líneas y preguntar si algo está mal. Proponer el siguiente paso: cargar la primera búsqueda de un comprador.

## Actualizar

Cuando el asesor pide cambiar algo ("cambiá mi firma", "sumá Saavedra a mis zonas", "te paso más mensajes"),
editar solo esa sección y confirmar el cambio en una línea.
