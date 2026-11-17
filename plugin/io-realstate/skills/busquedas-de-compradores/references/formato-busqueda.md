# Formato de una ficha de búsqueda

Archivo: `IO-RealState/busquedas/{cliente-en-kebab}.md`

```markdown
# Búsqueda · {Cliente}

- Nombre para el mensaje: {Mariana}
- Operación: {compra | alquiler}
- Desde: {AAAA-MM-DD}
- Estado: activa

## Obligatorio
- Barrios: {Villa Urquiza, Coghlan}
- Ambientes: {4} o más
- Precio: hasta USD {300.000} {| desde USD …}
- {patio o terraza}
- {…}

## Deseable
- {cerca del colegio (Monroe y Bauness)}
- {cochera}
- {sin escaleras}

## Alertas
- Zonaprop: {creada AAAA-MM-DD | pendiente}
- Argenprop: {…}
- Mercado Libre: {…}

## Aprendizajes
<!-- lo que se aprende de cada descarte, una línea por regla -->
- {AAAA-MM-DD} No mostrar PH con escalera (descartó Pedraza 2450).

## Elegidas
<!-- avisos marcados "me sirve", con fecha y si ya se le mandaron -->
- {AAAA-MM-DD} Melián 3120 · USD 289.000 · enviada {AAAA-MM-DD}

## Historial
- {AAAA-MM-DD} Creada.
```

## Ejemplo de filtros para alertas

| Portal | Filtros |
|---|---|
| Zonaprop | Venta · Casas, PH y Departamentos · Villa Urquiza + Coghlan · Desde 4 ambientes · Hasta USD 300.000 |
| Argenprop | Venta · Departamentos y PH · Villa Urquiza, Coghlan · 4 ambientes o más · Hasta USD 300.000 |
| Mercado Libre | Inmuebles › Venta · Capital Federal › Villa Urquiza, Coghlan · Ambientes: 4+ · Precio máximo USD 300.000 |

Si los nombres exactos de los filtros cambian en el portal, indicar el concepto (operación, zona, ambientes,
precio) y no inventar textos de botones.
