---
name: tasacion-acm
description: >
  Esta skill se usa cuando el asesor dice "tasá…", "armame el ACM de…", "¿cuánto vale…?", "necesito la tasación
  de {dirección} para el propietario", "sumá este comparable", "anotá esta venta" o "actualizá la tasación". Arma un
  análisis comparativo de mercado (ACM) con comparables vendidos y publicados, explica el cálculo y entrega un
  borrador de informe para que lo revise y firme el corredor matriculado.
metadata:
  version: "0.1.0"
---

# Tasación por comparables (ACM)

Leer `IO-RealState/perfil.md` (corredor responsable y matrícula) y `IO-RealState/comparables.md`.
El método completo y la plantilla del informe están en `references/metodo-acm.md`.

## Principios

- **Es un borrador.** La opinión de valor la firma el corredor matriculado. El informe lo dice siempre.
- **Se explica.** Cada número sale de comparables visibles y de ajustes declarados. Nada de "valor estimado por IA".
- **No se inventan comparables.** Solo valen los que cargó el asesor, sus cierres, avisos que llegaron por las
  alertas (skill `revisar-alertas`) o avisos que el asesor pegue. No recorrer portales en el navegador.
- **Si no alcanza, se dice.** Con menos de 3 comparables válidos (con m² y precio), no dar un valor: pedir más.

## Pasos

1. **Datos del inmueble:** dirección, barrio, tipo (depto, PH, casa), ambientes, m² cubiertos y totales, estado,
   extras (terraza, cochera, amenities) y el propietario. Preguntar solo lo que falte, en una sola pregunta.
2. **Comparables:**
   - Leer los de `comparables.md` del mismo barrio o barrios vecinos, mismo tipo y ±25 % de superficie.
   - Sumar los avisos de `avisos-vistos.md` que cumplan lo mismo, como **publicados**.
   - Mostrar la lista y preguntar: "¿Sacamos alguno o sumás ventas que conozcas?". Los **vendidos** valen más que
     los publicados; si el asesor los tiene (precio real de cierre y días en el mercado), pedirlos.
   - Guardar en `comparables.md` los que el asesor agregue, para la próxima.
3. **Ajustes:** proponer un ajuste por diferencias claras (terraza propia, cochera, estado a reciclar,
   contrafrente, piso bajo) con un porcentaje chico y declarado, y que el asesor lo confirme. Nunca más de ±15 % en
   total sin que el asesor lo pida.
4. **Cálculo:** el de `references/metodo-acm.md`: mediana del USD/m², por la superficie, más ajustes; rango;
   días de venta esperados (mediana de los vendidos).
5. **Informe:** escribir `IO-RealState/tasaciones/{direccion-en-kebab}.md` con la plantilla y, si el asesor lo
   pide, generar un documento o PDF presentable para el propietario.
6. **Revisión:** mostrar el resumen (valor sugerido, rango, días, cantidad de comparables) y preguntar si lo aprueba
   el corredor. Mientras no lo apruebe, el informe dice "Borrador · pendiente de firma". Si cambian datos después de
   aprobado, vuelve a borrador.

## Lo que no hace

- No promete precio de venta ni plazos al propietario: el informe habla de "valor sugerido de publicación" y
  "rango de mercado".
- No usa datos personales de compradores o vendedores de los comparables: solo dirección, m², precio y días.
