---
name: busquedas-de-compradores
description: >
  Esta skill se usa cuando el asesor dice "nueva búsqueda", "tengo un cliente que busca…", "cargá lo que busca
  {cliente}", "cambiá la búsqueda de {cliente}", "ya compró, cerrá la búsqueda", "¿qué búsquedas tengo?" o
  "armame las alertas para los portales". Crea, edita, lista y cierra las búsquedas de clientes compradores o
  inquilinos, separando lo obligatorio de lo deseable, y arma los filtros para crear las alertas en cada portal.
metadata:
  version: "0.1.0"
---

# Búsquedas de compradores

Guardar una ficha por cliente en `IO-RealState/busquedas/{cliente-en-kebab}.md` con el formato de
`references/formato-busqueda.md`. Leer antes `IO-RealState/perfil.md`; si no existe, usar la skill
`perfil-del-asesor` primero.

## Cargar una búsqueda nueva

1. Pedir que el asesor cuente lo que busca el cliente en sus palabras. Aceptar un audio transcripto o un mensaje
   reenviado del cliente.
2. Extraer y confirmar en una sola pregunta lo que falte de lo esencial:
   - **Operación:** compra o alquiler.
   - **Barrios o zona.**
   - **Ambientes mínimos.**
   - **Precio:** tope (y piso si lo hay), en USD para compra; en pesos para alquiler.
   - **Nombre para el mensaje:** con quién habla el asesor (puede ser un integrante de la familia).
3. Clasificar el resto en **obligatorio** (si falta, no le sirve: "apto crédito", "patio o terraza", "planta
   baja") y **deseable** (suma o resta: "cochera", "luminoso", "cerca del colegio", "sin escaleras"). Ante la duda,
   preguntar: "¿Sin cochera la descartás o la mirarías igual?".
4. Escribir los criterios en forma corta y buscable: "patio o terraza" (acepta cualquiera), "sin escaleras"
   (descarta las que las mencionan), "cerca de {lugar}".
5. Guardar la ficha y mostrar el resumen en 4 líneas.
6. Ofrecer armar los filtros de alertas (siguiente sección).

## Armar las alertas de los portales

IO-RealState no recorre los portales con robots: va contra sus términos de uso. Usa las **alertas por mail** que
cualquier usuario puede crear en Zonaprop, Argenprop y Mercado Libre.

1. Armar, por portal, los filtros que el asesor tiene que cargar: operación, tipo, barrios, ambientes desde,
   precio hasta y, si el portal lo permite, palabra clave del criterio obligatorio más importante.
2. Explicar en 3 pasos: buscar con esos filtros en el portal, tocar "crear alerta" o "guardar búsqueda", elegir
   aviso por mail. Si un portal no ofrece alguna opción, decirlo sin inventar el nombre del botón.
3. Pedir que las alertas lleguen al Gmail que está conectado a Claude. Si el asesor usa otra casilla, sugerir un
   reenvío automático a ese Gmail.
4. Anotar en la ficha en qué portales quedó creada la alerta.

## Editar, listar y cerrar

- **Editar:** cambiar solo lo pedido y anotar la fecha del cambio en el historial de la ficha. Si cambian barrios,
  ambientes o precio, recordar que hay que actualizar la alerta en el portal.
- **Listar:** tabla con cliente, operación, resumen, desde cuándo busca y cuántos avisos elegidos tiene.
- **Cerrar:** mover la ficha a `busquedas/cerradas/` con el motivo ("compró Melián 3120", "dejó de buscar") y
  recordar dar de baja las alertas.

## Reglas

- Guardar solo lo necesario para buscar: nombre de pila o apellido, criterios y notas del asesor. No guardar DNI,
  ingresos, datos bancarios ni capturas de documentos.
- No inventar criterios que el asesor no dijo.
- Mantener el vocabulario local: ambientes (no dormitorios, salvo que el asesor lo use), expensas, apto crédito,
  PH, cochera.
