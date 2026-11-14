# IO-RealState · agentes de IA para inmobiliarias

![Licencia: todos los derechos reservados](https://img.shields.io/badge/licencia-todos%20los%20derechos%20reservados-b91c1c) ![No es open source](https://img.shields.io/badge/open%20source-no-b91c1c)

> [!CAUTION]
> **© 2026 Gonzalo Nicolás Bravo — IO Consulting. Todos los derechos reservados.** No es software libre
> ni de código abierto. Condiciones en [`LICENSE`](LICENSE). Permisos: contacto@ioconsulting.com.ar.

SaaS para inmobiliarias argentinas: **un equipo de agentes de IA, uno por departamento** (atención,
captación, tasación, marketing, capacitación y más), que conoce la forma de trabajar de la inmobiliaria,
atiende y trabaja por **WhatsApp** y entrega trabajo presentable con la firma del corredor y **dentro del
marco legal argentino**.

Etapa: **análisis y diseño** (14/11/2026). Todavía no hay código.

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

## En una línea

La referencia es una **agencia** que instala a mano asistentes de Claude en grupos de WhatsApp. Nosotros
lo hacemos **producto**: onboarding guiado del "cerebro", agentes de catálogo, panel para el dueño,
atención al cliente final, capa legal argentina y precio público.

## Decisiones abiertas

1. Validar en 5 entrevistas: qué compran primero (atención 24/7 o agentes internos) y el precio.
2. Jurisdicción del piloto (CABA o una provincia) y revisión legal.
3. Canal del equipo: WhatsApp 1:1 + panel (propuesto) o grupos, según lo que permita la API oficial.
4. Primer entregable a construir: la **demo vendible** estática (paso 0 de `04`).
