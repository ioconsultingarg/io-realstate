---
name: revisar-alertas
description: >
  Esta skill se usa cuando el asesor dice "revisá las alertas", "¿entró algo para mis clientes?", "¿qué hay nuevo
  hoy?", "pasame las novedades de las búsquedas", o cuando la tarea programada diaria de IO-RealState la ejecuta.
  También cuando el asesor pega o reenvía un aviso y pregunta "¿le sirve a {cliente}?". Lee los mails de alertas
  de los portales en Gmail, saca duplicados, compara cada aviso con las búsquedas activas y arma el resumen del día.
metadata:
  version: "0.1.0"
---

# Revisar alertas de los portales

Leer `IO-RealState/perfil.md`, todas las fichas activas de `IO-RealState/busquedas/` y
`IO-RealState/avisos-vistos.md`. Si no hay búsquedas activas, decirlo y ofrecer cargar una.

## 1. Traer los mails

Usar el conector de Gmail. Buscar los mails de alertas desde la última revisión (si no hay registro, las últimas
48 horas). Consulta de partida:

```
from:(zonaprop OR argenprop OR mercadolibre) newer_than:2d
```

Ajustarla según `references/lectura-de-mails.md`. Si el conector de Gmail no está activo, pedirle al asesor que lo
conecte (Claude → Conectores → Gmail) o que pegue los avisos en el chat, y seguir con lo pegado.

**No abrir los portales en el navegador para buscar avisos ni recorrer listados.** Trabajar solo con lo que llega
en los mails o lo que el asesor pega. Si un dato importante no está en el mail, marcarlo "a verificar" y dejar el
enlace del aviso para que lo abra el asesor.

## 2. Extraer cada aviso

De cada mail, sacar todos los avisos que trae, con: dirección (calle y altura si está), barrio, operación, tipo,
ambientes, m² (totales o cubiertos, decir cuál), precio y moneda, expensas, lo que dice la descripción y el enlace.
Detalle en `references/lectura-de-mails.md`.

## 3. Sacar duplicados

La misma propiedad aparece en varios portales o publicada por varias inmobiliarias. Considerar duplicado cuando
coinciden calle y altura (o, sin altura, barrio + ambientes + m² ±3 % + precio ±3 %). Quedarse con un solo aviso y
anotar todas las fuentes. Descartar también lo que ya está en `avisos-vistos.md` para esa búsqueda.

## 4. Comparar con cada búsqueda

Aplicar las reglas de `references/reglas-de-afinidad.md` a cada aviso contra cada búsqueda activa. Las reglas
dan un puntaje de 0 a 100 y, sobre todo, **el porqué**: cada criterio queda como ✓ cumple, ✗ no cumple o
~ a verificar. Respetar los **Aprendizajes** de cada ficha (lo que el asesor descartó antes).

- Lo que no cumple algo obligatorio **no se muestra** en el resumen; solo se cuenta.
- Nunca suponer un dato que el aviso no dice: queda "a verificar".

## 5. Armar el resumen

Escribir `IO-RealState/resumenes/{AAAA-MM-DD}.md` y mostrar en el chat una versión corta:

```
{N} avisos nuevos revisados · {D} duplicados · {X} no cumplían

Familia Ocampo · 2
1. Melián 3120, Coghlan · USD 289.000 · 94 (muy buena)
   ✓ terraza propia · ✓ a 4 cuadras del colegio · ✗ sin cochera
   Zonaprop y Argenprop · {enlace}
2. Pedraza 2450, Villa Urquiza · USD 262.000 · 85
   ✓ patio · ✓ USD 38 k por debajo del tope · ✗ escalera al 1.er piso
   Mercado Libre · {enlace}

Lucía Benítez · nada nuevo que cumpla
```

Ordenar por afinidad dentro de cada cliente. Cerrar preguntando: "¿Cuáles te sirven? Decime los números y te
armo el mensaje para cada cliente".

## 6. Registrar y aprender

- Agregar a `avisos-vistos.md` cada aviso evaluado: fecha, búsqueda, dirección normalizada, precio, fuentes y
  resultado (mostrado / no cumple / duplicado).
- Cuando el asesor elige ("el 1 sí"), anotarlo en **Elegidas** de la ficha y ofrecer usar la skill
  `mensaje-en-tu-voz`.
- Cuando descarta ("el 2 no, tiene escalera"), agregar la regla a **Aprendizajes** de esa ficha, en una línea y en
  forma general ("No mostrar PH con escalera"), y confirmarla.

## Tarea programada

Si el asesor quiere que esto se haga solo, proponerle crear una tarea programada diaria a la hora de su perfil con
esta instrucción: "Usá la skill revisar-alertas de IO-RealState y dejame el resumen del día". Explicar que la
lectura de Gmail es solo lectura y que nada se manda a ningún cliente sin su aprobación.
