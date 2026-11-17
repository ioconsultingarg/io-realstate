# IO-RealState · agentes de IA para inmobiliarias

![Licencia: todos los derechos reservados](https://img.shields.io/badge/licencia-todos%20los%20derechos%20reservados-b91c1c) ![No es open source](https://img.shields.io/badge/open%20source-no-b91c1c)

> [!CAUTION]
> **© 2026 Gonzalo Nicolás Bravo — IO Consulting. Todos los derechos reservados.** No es software libre
> ni de código abierto. Condiciones en [`LICENSE`](LICENSE). Permisos: contacto@ioconsulting.com.ar.

SaaS para inmobiliarias argentinas: **un equipo de agentes de IA, uno por departamento** (atención,
captación, tasación, marketing, capacitación y más), que conoce la forma de trabajar de la inmobiliaria,
atiende y trabaja por **WhatsApp** y entrega trabajo presentable con la firma del corredor y **dentro del
marco legal argentino**.

Etapa: **demo funcional** (15/11/2026) en [`demo/`](demo/), con propuesta comercial y manual en PDF.

## Demo

**https://ioconsultingarg.github.io/io-realstate/** — funciona en el navegador: crear búsquedas, pegar avisos y ver la
afinidad, elegir y obtener el mensaje en la voz del asesor, armar una tasación con tus comparables e imprimir el
informe, importar la cartera por CSV, recordatorios en lenguaje natural y responder clientes. Lo cargado queda en el
navegador y se puede volver al ejemplo desde Cuenta. La IA de los agentes sigue simulada con respuestas armadas.

```bash
cd demo
npm install
npm run dev
```

Se publica sola en GitHub Pages con cada push que toque `demo/` (`.github/workflows/pages.yml`).

## Plugin para Claude

[`plugin/io-realstate.plugin`](plugin/io-realstate.plugin) — IO-RealState como plugin de la app de Claude, para el
asesor individual: perfil y forma de escribir, búsquedas de compradores, revisión de alertas de portales en Gmail con
afinidad explicada, tasación ACM, mensajes en su voz y recordatorios en Google Calendar. Los datos quedan en una
carpeta de su computadora. Guía de instalación en [`plugin/io-realstate/README.md`](plugin/io-realstate/README.md).

## Para vender

- [`IO-RealState-Propuesta.pdf`](IO-RealState-Propuesta.pdf) — propuesta comercial: problema, cómo funciona, qué hace,
  qué no hace, planes con precio y QR a la demo.
- [`Manual-IO-RealState.pdf`](Manual-IO-RealState.pdf) — manual completo con capturas.

Los dos se regeneran desde la demo compilada:

```bash
python manual/capturas.py && python manual/generar_manual.py && cd manual && python generar_venta.py
```

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
9. [09-ASESOR-INDIVIDUAL.md](09-ASESOR-INDIVIDUAL.md) — **plan para el asesor individual** (pedido de un agente
   en actividad): búsquedas que avisan con las alertas de los portales, borradores en su voz, ACM, agenda y
   tareas. MVP de 5 a 7 semanas.
10. [10-REFERENCIA-PLAYBOOK.md](10-REFERENCIA-PLAYBOOK.md) — el playbook de Real Growth: sus "agentes" son Claude
   configurado (proyectos, skills, conectores); embudo completo y camino A (plugin para Claude) vs camino B (SaaS).

## En una línea

La referencia es una **agencia** que instala a mano asistentes de Claude en grupos de WhatsApp. Nosotros
lo hacemos **producto**: onboarding guiado del "cerebro", agentes de catálogo, panel para el dueño,
atención al cliente final, capa legal argentina y precio público.

## Decisiones abiertas

1. Validar en 5 entrevistas: qué compran primero (atención 24/7 o agentes internos) y el precio.
2. Jurisdicción del piloto (CABA o una provincia) y revisión legal.
3. Canal del equipo: WhatsApp 1:1 + panel (propuesto) o grupos, según lo que permita la API oficial.
4. Publicar la demo en GitHub Pages y usarla en las primeras entrevistas.
