# IO-RealState · agentes de IA para inmobiliarias

![Licencia: todos los derechos reservados](https://img.shields.io/badge/licencia-todos%20los%20derechos%20reservados-b91c1c) ![No es open source](https://img.shields.io/badge/open%20source-no-b91c1c)

> [!CAUTION]
> **© 2026 Gonzalo Nicolás Bravo — IO Consulting. Todos los derechos reservados.** No es software libre
> ni de código abierto. Condiciones en [`LICENSE`](LICENSE). Permisos: contacto@ioconsulting.com.ar.

SaaS para inmobiliarias argentinas: **un equipo de agentes de IA, uno por departamento** (atención,
captación, tasación, marketing, capacitación y más), que conoce la forma de trabajar de la inmobiliaria,
atiende y trabaja por **WhatsApp** y entrega trabajo presentable con la firma del corredor y **dentro del
marco legal argentino**.

Etapa: **demo vendible** (14/11/2026): una app navegable con datos ficticios, sin backend, en [`demo/`](demo/).

## Demo

Recorrido de una inmobiliaria ficticia: la consulta de las 23:14 atendida y agendada, la bandeja de
clientes con la calificación hecha por el agente, el asistente interno (tasación con informe para firmar,
análisis de competencia y práctica de objeciones), el catálogo de agentes y el cerebro.

```bash
cd demo
npm install
npm run dev
```

Se publica en GitHub Pages con el flujo `.github/workflows/pages.yml` (hay que elegir *GitHub Actions*
como fuente en la configuración de Pages del repo).

## Orden de lectura

1. [01-REFERENCIA-REAL-GROWTH.md](01-REFERENCIA-REAL-GROWTH.md) — análisis de la web y del video de la
   referencia: embudo, agentes, "el cerebro", fortalezas y huecos.
2. [02-MERCADO-Y-CASOS-DE-USO.md](02-MERCADO-Y-CASOS-DE-USO.md) — 12 fuentes consolidadas: casos de uso
   por departamento con prioridad, advertencias comunes, métricas, precios y competencia en Argentina.
3. [03-MARCO-LEGAL-AR.md](03-MARCO-LEGAL-AR.md) — corretaje (Ley 2340 CABA, colegios), datos personales,
   No Llame, WhatsApp/Meta, UIF, alquileres, y las reglas de producto que salen de eso.
4. [04-PRODUCTO-SAAS.md](04-PRODUCTO-SAAS.md) — tesis, segmentos, módulos, catálogo de agentes, MVP,
   precios (hipótesis) y embudo.
5. [05-ARQUITECTURA-Y-COSTOS.md](05-ARQUITECTURA-Y-COSTOS.md) — stack, canal del equipo, diseño de
   agentes, modelos de Claude, costo variable por cliente, modelo de datos y riesgos.
6. [06-DIRECCION-VISUAL.md](06-DIRECCION-VISUAL.md) — dirección "Plano": qué se conserva del lenguaje de
   la casa, qué cambia y qué skills de diseño se aplicaron.
7. [07-MANUAL.md](07-MANUAL.md) — **cómo funciona**: las piezas, el onboarding, los cinco flujos paso a paso,
   quién hace qué, guía para recorrer la demo y qué simula.
8. [08-FACTIBILIDAD-E2E.md](08-FACTIBILIDAD-E2E.md) — **implementación real**: qué es factible hoy y qué no,
   arquitectura, cuentas y trámites, datos, costos y precios revisados, plan de 13 semanas, legal y riesgos.

## En una línea

La referencia es una **agencia** que instala a mano asistentes de Claude en grupos de WhatsApp. Nosotros
lo hacemos **producto**: onboarding guiado del "cerebro", agentes de catálogo, panel para el dueño,
atención al cliente final, capa legal argentina y precio público.

## Decisiones abiertas

1. Validar en 5 entrevistas: qué compran primero (atención 24/7 o agentes internos) y el precio.
2. Jurisdicción del piloto (CABA o una provincia) y revisión legal.
3. Canal del equipo: WhatsApp 1:1 + panel (propuesto) o grupos, según lo que permita la API oficial.
4. Publicar la demo en GitHub Pages y usarla en las primeras entrevistas.
