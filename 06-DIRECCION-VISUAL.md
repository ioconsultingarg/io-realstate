# 06 · Dirección visual: "Plano"

Decidida el 14/11/2026 a pedido de Gonzalo: interfaz **parecida, no igual**, a la de los productos de IO
Consulting, usando las skills de diseño disponibles. Implementada en [`demo/`](demo/).

## Qué se conserva del lenguaje de la casa

- Riel lateral con ícono y etiqueta; barra superior con el nombre del cliente y una pastilla de estado.
- Ceja técnica en mono, mayúsculas espaciadas, sobre titulares grandes.
- KPI en tarjetas con la cifra en mono.
- Botón principal claro sobre fondo oscuro; un acento reservado para lo que hace la IA.
- **Oscuro por defecto, no único**: el claro se elige desde la cuenta, nunca en el ingreso.

## Qué cambia (identidad propia)

| Elemento | Decisión | Por qué |
|---|---|---|
| Fondo | Grafito **cálido** (`#0f0e0c` / `#191714`) | El rubro es hogar y obra, no laboratorio |
| Marca | **Latón** (`#e3b968` oscuro, `#8a5a12` claro) | Herrajes, llaves, placas: lo inmobiliario sin caer en el dorado de lujo |
| IA | **Azul de plano** (`#8fb2ff` / `#2f5bd3`) | Lo hecho por un agente se reconoce de un vistazo |
| Titulares | **Instrument Serif**, con una palabra en itálica de latón | Tono editorial, de aviso clasificado bien hecho |
| Interfaz y cifras | **Geist** y **Geist Mono** | Neutras y legibles en tamaños chicos |
| Textura | Trama de plano de 28 px detrás de los encabezados, con máscara radial | Referencia directa al plano de arquitectura |
| Marca gráfica | I + casa de un solo trazo con una ventana de latón encendida | "Alguien atiende", a 16 px y en blanco y negro |

## Skills aplicadas

- **frontend-design**: dirección con un concepto claro, sin estéticas genéricas.
- **ui-ux-pro-max**: checklist previo a la entrega. Se descartó su paleta teal y el glassmorphism
  (choca con la casa) y se tomó la pista de usar serif para real estate.
- **dataviz**: paleta de series validada con `validate_palette.js` en los dos temas, marcas finas,
  leyenda con más de una serie, tooltip por marca y vista en tabla en cada gráfico.
- **emil-design-engineering**, **make-interfaces-feel-better**, **web-animation-design** y
  **web-animation-engines** (Motion): presión con `scale(0.97)`, entradas escalonadas, paneles que
  entran y salen por el mismo lado con la misma curva, cifras tabulares, `text-wrap: balance` y movimiento
  reducido respetado en todo.
- **ux-copy**: castellano rioplatense, verbos en los botones, estados que dicen qué pasa y qué sigue.
- **ui-component-registries**: no se instaló nada (requieren shadcn). La caja de pedido del asistente toma
  la idea de las entradas de IA de esos registros, construida a mano.
- **web-design-guidelines** y revisión de accesibilidad: pausa para el chat que se reproduce solo,
  `overscroll-contain` en paneles, contraste ≥ 4.5:1 en todos los textos, incluida la hora en las burbujas
  verdes del chat.
