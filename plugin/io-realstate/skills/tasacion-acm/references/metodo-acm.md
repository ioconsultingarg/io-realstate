# Método del ACM

## Comparables válidos

Un comparable es válido si tiene m² > 0 y precio > 0. Datos por comparable: dirección, tipo, m² (aclarar si
son cubiertos o totales y usar el mismo criterio para todos), precio en USD, estado (**vendido** o **publicado**),
días en el mercado (si se conocen) y fuente (cierre propio, colega, alerta de portal, aviso pegado).

Mínimo: **3 comparables válidos** y la superficie del inmueble. Si no se llega, no calcular.

## Cálculo

1. USD/m² de cada comparable = precio ÷ m².
2. **Base** = mediana de los USD/m² (la mediana resiste mejor a un aviso fuera de precio que el promedio).
3. **Valor** = base × m² del inmueble × (1 + suma de ajustes %).
4. **Valor sugerido de publicación** = valor redondeado a miles de USD.
5. **Rango de mercado** = valor sugerido × 0,955 a × 1,03, redondeados a miles.
6. **Días de venta esperados** = mediana de los días en el mercado de los **vendidos**. Sin vendidos con días: "sin
   datos".

Mostrar siempre: cantidad de comparables, cuántos vendidos y cuántos publicados, la base en USD/m² y cada ajuste.

## Ejemplo

Inmueble: PH 4 ambientes, 120 m², terraza propia (+0,5 %).

| Comparable | m² | USD | USD/m² | Estado | Días |
|---|---|---|---|---|---|
| Bauness 2140 · PH | 112 | 214.000 | 1.911 | Vendido | 74 |
| Ugarte 2010 · PH | 126 | 252.000 | 2.000 | Vendido | 58 |
| Mariano Acha 1620 · PH | 118 | 239.000 | 2.025 | Publicado | 41 |
| Roosevelt 4980 · PH | 104 | 199.000 | 1.913 | Vendido | 96 |
| Pedro Rivera 3150 · PH | 131 | 271.000 | 2.069 | Publicado | 122 |
| Tamborini 4512 · PH | 115 | 226.000 | 1.965 | Vendido | 63 |

Mediana USD/m² = (1.965 + 2.000) / 2 ≈ 1.983 → 1.983 × 120 × 1,005 ≈ 239.100 → **USD 239.000**.
Rango: USD 228.000 a 246.000. Días esperados: mediana de 58, 63, 74, 96 = **69 días**.

## Plantilla del informe

```markdown
# Análisis comparativo de mercado · {Dirección}

{Tipo} de {n} ambientes · {m²} m² · {extras} · {Barrio}
Preparado para {propietario} · {AAAA-MM-DD}

| Valor sugerido de publicación | Rango de mercado | Tiempo de venta esperado |
|---|---|---|
| USD {x} | USD {a} – {b} | ≈ {d} días (mediana de {k} ventas) |

## Comparables
{tabla}

## Cómo se calculó
Mediana del precio por m² de {k} comparables (USD {base}/m²) por {m²} m², {ajustes}. Los publicados se usan como
referencia de competencia; los vendidos, como valor de cierre.

---
Opinión de valor elaborada por {corredor}, corredor/a inmobiliario/a, matrícula {colegio} N.º {número}.
Borrador preparado con IO-RealState con los datos aportados por el corredor; no constituye una tasación hasta su
firma.
**Estado:** {Borrador · pendiente de firma | Aprobado por {corredor} el {fecha}}
```
