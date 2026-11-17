# Lectura de los mails de alertas

## Encontrar los mails

- Consulta de partida en Gmail: `from:(zonaprop OR argenprop OR mercadolibre) newer_than:2d`.
- La primera vez, revisar 2 o 3 mails reales y anotar en `IO-RealState/perfil.md` (sección "Alertas") el
  remitente exacto y el asunto típico de cada portal; usar esos datos en las revisiones siguientes. Los
  remitentes y formatos cambian: no darlos por sabidos.
- Ignorar mails de los portales que no son alertas (facturas, promociones, avisos de cuenta).
- Si el asesor reenvía las alertas desde otra casilla, buscar también `subject:(Fwd OR RV)` con los mismos
  remitentes en el cuerpo.

## Extraer los avisos

Un mail de alerta suele traer varios avisos. Para cada uno:

| Dato | Cómo leerlo | Si falta |
|---|---|---|
| Dirección | Calle y altura ("Gorriti 4820"). Si solo hay barrio, dejar "sin dirección" | Usar barrio + ambientes + m² para detectar duplicados |
| Barrio | Nombre del barrio (no la ciudad) | "a verificar" |
| Ambientes | "3 ambientes", "3 amb", "monoambiente" = 1 | "a verificar" |
| m² | Distinguir totales y cubiertos si el aviso los da | "a verificar" |
| Precio | "U$S 248.000", "USD 248.000", "US$ 248k" → 248000. Pesos: "$ 720.000" | Sin precio ("consultar"): no se puede comparar; mostrar aparte como "sin precio" |
| Expensas | "$ 68.000" | — |
| Descripción | Todo el texto del aviso: de ahí salen patio, cochera, apto crédito, etc. | — |
| Enlace | El enlace al aviso | Siempre incluirlo si existe |

## Normalizar la dirección para duplicados

Minúsculas, sin acentos, sin "av.", "avenida", "calle", sin piso ni departamento: "Av. Cabildo 2340 4° B" →
"cabildo 2340".

## Avisos pegados por el asesor

Si el asesor pega el texto de un aviso o de un mail, extraer los mismos datos, confirmar en una línea lo que se
leyó ("Leí: Gorriti 4820, Palermo, 3 amb, 78 m², USD 248.000") y evaluarlo contra la búsqueda que diga, o contra
todas si no dice.
