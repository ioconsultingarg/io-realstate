---
name: mensaje-en-tu-voz
description: >
  Esta skill se usa cuando el asesor dice "armame el mensaje para {cliente}", "mandale las opciones a…",
  "escribile a {cliente} que…", "contestale a este mensaje", "hacelo más corto", "más informal" o "eso no lo
  diría así", y después de elegir avisos en revisar-alertas. Redacta borradores de WhatsApp o mail con la forma de
  escribir del asesor, sin que suenen a IA, para que el asesor los revise y los mande él.
metadata:
  version: "0.1.0"
---

# Mensaje en la voz del asesor

Leer la sección "Cómo escribe" y "Aprendizajes" de `IO-RealState/perfil.md`. Si no existe, usar el estilo por
defecto de la skill `perfil-del-asesor` y avisar que conviene pegar mensajes reales para afinarlo.

## Principio

El asesor manda el mensaje desde su WhatsApp o su mail. IO-RealState **solo redacta**: nunca envía mensajes a
clientes por su cuenta. Como el mensaje es del asesor, no lleva aviso de "asistente automatizado".

## Cómo redactar

1. Identificar el propósito en una frase: mandar opciones, confirmar visita, seguimiento después de una visita,
   responder una pregunta, pedir documentación, contestar una objeción.
2. Usar los datos reales: los avisos elegidos de la ficha (`busquedas/`), el informe de tasación, lo que el asesor
   contó. **No inventar datos de propiedades** (expensas, orientación, apto crédito): si falta algo que el cliente
   va a preguntar, dejarlo fuera o escribir que se confirma.
3. Aplicar el estilo del perfil: saludo, trato, largo, emojis, exclamaciones, cierre y firma.
4. Aplicar las reglas de `references/reglas-anti-ia.md` y revisar el borrador contra la lista antes de mostrarlo.
5. Para varias propiedades: una por párrafo corto, con dirección, lo que más le importa a ese cliente, el precio y,
   si la hay, la contra principal dicha con naturalidad ("tiene escalera al primer piso, eso sí").
6. Cerrar con una pregunta concreta que mueva la operación (día y horario para visitar, cuál prefiere).

## Cómo entregarlo

- Mostrar el borrador listo para copiar, sin comillas ni encabezados.
- Debajo, una línea con lo que se usó: "Escrito con tu estilo: sin emojis, tuteo, firma Martina".
- Si son mensajes para varios clientes, uno por bloque, con el nombre del cliente arriba.
- Ofrecer variantes solo si el asesor las pide.

## Aprender de las correcciones

Cuando el asesor corrige ("eso no lo diría", "no pongas 'te comento'", "más corto"), aplicar el cambio y agregar
la regla general a "Aprendizajes" del perfil en una línea ("No usar 'te comento'"), y confirmarlo. Antes de
agregar, revisar que no contradiga otra regla; si la contradice, preguntar cuál queda.

## Mensajes que necesitan al corredor

Si el mensaje toca precio de cierre, ofertas, reservas, señas, honorarios o temas legales, redactarlo igual pero
avisar al asesor en una línea que eso lo define o revisa el corredor.
