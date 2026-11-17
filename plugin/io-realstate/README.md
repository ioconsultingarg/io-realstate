# IO-RealState para Claude

Plugin para asesores inmobiliarios en Argentina. Se instala en la app de escritorio de Claude y trabaja con tus
búsquedas, tus tasaciones y tu forma de escribir.

## Qué hace

| Skill | Qué le pedís |
|---|---|
| **perfil-del-asesor** | "Configurá IO-RealState": tu matrícula, tus zonas y cómo escribís (pegás 10 a 30 mensajes tuyos) |
| **busquedas-de-compradores** | "Nueva búsqueda: la familia Ocampo busca 4 ambientes con patio o terraza en Villa Urquiza, hasta USD 300 mil". Separa lo obligatorio de lo deseable y te arma los filtros para las alertas de cada portal |
| **revisar-alertas** | "Revisá las alertas": lee en Gmail los mails de Zonaprop, Argenprop y Mercado Libre, saca duplicados y te dice qué coincide con cada cliente y por qué |
| **tasacion-acm** | "Armame el ACM de Ugarte 1856": comparables, precio por m², rango y días de venta, en un informe que firmás vos o tu corredor |
| **mensaje-en-tu-voz** | "Armale el mensaje a Mariana con las dos que elegí": un borrador escrito como escribís vos, que mandás desde tu WhatsApp |
| **recordatorios-y-visitas** | "Recordame llamar a Tomás el jueves a las 10", "agendá la visita en Melián 3120 el sábado a las 11": eventos en Google Calendar |

## Instalación (10 minutos)

1. Instalá la **app de escritorio de Claude** e iniciá sesión. Para tareas programadas y uso diario conviene un
   plan pago (ver precios vigentes en claude.com).
2. **Ajustes → Plugins → Subir plugin** y elegí `io-realstate.plugin`.
3. **Conectores:** conectá **Gmail** y **Google Calendar** con la cuenta donde te llegan las alertas.
   Recomendado: lectura "permitir siempre", escritura "requiere aprobación".
4. Abrí **Cowork**, elegí una **carpeta de trabajo** en tu computadora (por ejemplo `Documentos/IO-RealState`) y
   escribí: **"Configurá IO-RealState"**.

## Primera semana

| Día | Qué hacer |
|---|---|
| 1 | "Configurá IO-RealState" y pegá tus mensajes para que aprenda cómo escribís |
| 2 | Cargá tus búsquedas activas, una por cliente |
| 3 | Pedí "armame las alertas" y creá la alerta en cada portal con los filtros que te da |
| 4 | "Revisá las alertas" y marcá cuáles te sirven |
| 5 | "Armale el mensaje a {cliente}" y corregí lo que no dirías: aprende de cada corrección |
| 6 | Hacé una tasación con ventas que conozcas |
| 7 | Programá la revisión diaria: "Quiero que revises las alertas todos los días a las 8" |

## Dónde quedan tus datos

Todo queda en la carpeta que elegiste, en archivos de texto que podés abrir con cualquier editor:

```
IO-RealState/
  perfil.md          tus datos y tu forma de escribir
  busquedas/         una ficha por cliente
  avisos-vistos.md   lo que ya se revisó
  comparables.md     ventas y publicaciones para tasar
  tasaciones/        los informes
  resumenes/         el resumen de cada día
```

Guardá solo lo necesario para buscar: nombre de pila y criterios. No cargues DNI, ingresos ni documentos de
clientes.

## Lo que no hace

- **No le escribe a tus clientes.** Redacta; vos mandás.
- **No recorre los portales con robots** (va contra sus términos de uso): usa las alertas por mail que cualquier
  usuario puede crear.
- **No firma tasaciones ni promete precios.** La opinión de valor es del corredor matriculado.
- **No inventa datos de propiedades.** Lo que el aviso no dice queda "a verificar".

## Soporte

IO Consulting · contacto@ioconsulting.com.ar

© 2026 IO Consulting. Todos los derechos reservados.
