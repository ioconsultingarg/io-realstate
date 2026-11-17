# Reglas de afinidad

Puntaje de partida: **100**. Restar según cada criterio. Resultado entre 5 y 99.
Etiqueta: **muy buena** ≥ 80 · **buena** 65–79 · **posible** < 65.

Cada criterio produce una línea con ✓ (cumple), ✗ (no cumple) o ~ (a verificar).

## Criterios estructurales (obligatorios)

| Criterio | Cumple | No cumple | Descuento |
|---|---|---|---|
| Barrio | El aviso está en uno de los barrios de la búsqueda | "✗ Fuera de zona: {barrio}" | −35 y **no cumple lo obligatorio** |
| Ambientes | ≥ mínimo | "✗ {n} ambientes: pide {m}" | −35 y no cumple |
| Precio | ≤ tope | — | 0 |
| Precio entre tope y tope + 5 % | — | "~ USD {x} k arriba del tope: se puede negociar" | −8 (sigue cumpliendo) |
| Precio > tope + 5 % | — | "✗ USD {x} k arriba del presupuesto" | −35 y no cumple |
| Precio < piso | — | "~ Por debajo del rango: revisar estado" | −5 |

Si cumple el precio con 10 % o más de margen, escribir "✓ Precio holgado: USD {x} k por debajo"; si no,
"✓ Dentro del presupuesto".

## Criterios de texto

Buscar cada criterio en la descripción del aviso, sin distinguir mayúsculas ni acentos, con sinónimos:

| Criterio | También vale |
|---|---|
| cochera | garage, garaje, estacionamiento |
| apto crédito | apto banco, apto hipotecario |
| patio | jardín, fondo libre |
| luminoso | mucha luz, sol |
| subte / tren | estación, nombre de la línea |
| expensas bajas | sin expensas |

**Negaciones:** si el aviso dice "sin {criterio}", "no tiene {criterio}" o "no es {criterio}" (por ejemplo, "sin
cochera", "no es apto crédito"), cuenta como que **no lo tiene**, aunque la palabra aparezca en el texto.

| Tipo de criterio | Cómo se evalúa | Si es obligatorio | Si es deseable |
|---|---|---|---|
| "A o B" (patio o terraza) | Alcanza con que aparezca una opción | Si no aparece: "~ El aviso no dice si tiene {criterio}" −25 | Si no aparece: "✗ Sin {criterio}" −6 |
| Común (cochera, balcón) | Aparece en el texto: "✓ Tiene {x}" (adjetivos solos: "✓ Luminoso") | Igual que arriba | Igual que arriba |
| "sin X" (sin escaleras) | Si el aviso menciona X (y no dice "sin X"): "✗ Tiene {x}" | −35 y no cumple | −6 |
| "cerca de {lugar}" | Solo se confirma si el aviso nombra el lugar | Si no: "~ A verificar: cerca de {lugar}" −10 | −3 |

Si un aviso **no cumple algo obligatorio** (✗ en un obligatorio), no se muestra en el resumen.

## Aprendizajes

Las reglas que el asesor fue enseñando en la ficha ("No mostrar PH con escalera") se aplican como obligatorios
adicionales: si el aviso las viola, no se muestra.

## Ejemplos (búsqueda: Villa Urquiza o Coghlan, 4+ amb, hasta USD 300.000, obligatorio "patio o terraza",
deseables "cerca del colegio", "cochera", "sin escaleras")

| Aviso | Cálculo | Puntaje |
|---|---|---|
| Melián 3120, Coghlan, 4 amb, USD 289.000, "terraza propia, ascensor, a 4 cuadras del colegio" | cochera −6 | **94** muy buena |
| Pedraza 2450, V. Urquiza, PH 4 amb, USD 262.000, "patio, escalera al primer piso" | colegio ~ −3, cochera −6, escalera −6 | **85** muy buena |
| Monroe 4880, V. Urquiza, 4 amb, USD 305.000, "balcón y cochera" | precio ~ −8, patio o terraza ~ −25, colegio ~ −3 | **64** posible |
| Bauness 2140, V. Urquiza, PH 4 amb, USD 236.000, "patio, a 3 cuadras del colegio, sin cochera" | "sin cochera" es negación: cochera ✗ −6 | **94** muy buena |
