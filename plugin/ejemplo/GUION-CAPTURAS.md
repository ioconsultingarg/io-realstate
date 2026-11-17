# Guion para sacar las capturas del plugin

Todo con datos ficticios: no hace falta conectar Gmail ni usar clientes reales.

## Preparar (una vez)

1. En la app de Claude: **Ajustes → Plugins → Subir plugin** → elegí
   `io-consulting-proyectos/io-realstate/plugin/io-realstate.plugin`.
2. Abrí **Cowork** y elegí como carpeta de trabajo
   `io-consulting-proyectos/io-realstate/plugin/ejemplo`
   (ya tiene el perfil de "Martina", dos búsquedas y comparables de ejemplo).
3. Poné la ventana grande (maximizada) y en tema claro u oscuro, como prefieras para el PDF.

Para cada captura: **Windows + Shift + S** → recortá la ventana de Claude → guardala en
`io-consulting-proyectos/io-realstate/plugin/ejemplo/capturas/` con el nombre indicado.

## Las 4 capturas

| # | Escribí en Claude | Guardá como | Qué tiene que verse |
|---|---|---|---|
| 1 | `¿Qué búsquedas tengo?` | `1-busquedas.png` | La lista de las dos búsquedas (Familia Ocampo y Lucía Benítez) |
| 2 | `Revisá estas alertas:` y pegá **todo** el contenido de `alertas-de-ejemplo.txt` | `2-alertas.png` | El resumen con Melián 3120 y Pedraza 2450 para los Ocampo, con ✓ y ✗, y el duplicado detectado |
| 3 | `Los dos de los Ocampo me sirven. Armale el mensaje a Mariana.` | `3-mensaje.png` | El borrador en la voz de Martina |
| 4 | `Armame el ACM de Ugarte 1856, PH de 4 ambientes y 120 m² con terraza propia, para Tomás Iriarte` | `4-tasacion.png` | El resumen de la tasación: USD 239.000, rango y días de venta |

Si alguna respuesta sale distinta a lo esperado (por ejemplo, no detecta el duplicado de Melián 3120), sacá la
captura igual y avisame: es información para ajustar el plugin antes del piloto.

## Después

Avisame cuando estén las 4 en la carpeta `capturas/`. Las recorto, las sumo a la propuesta y al manual, y
regenero los dos PDF.
