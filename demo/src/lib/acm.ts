import type { Comparable } from '../data/demo'

function mediana(v: number[]) {
  if (!v.length) return NaN
  const s = [...v].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

export const MINIMO_COMPARABLES = 3

/**
 * Cálculo del borrador de ACM. Deliberadamente simple y explicable: mediana de USD/m² de los
 * comparables × superficie, con un ajuste declarado. La corredora lo revisa antes de firmar.
 */
export function calcularACM(comparables: Comparable[], m2: number, ajuste = { etiqueta: 'Terraza propia', pct: 0.5 }) {
  const validos = comparables.filter((c) => c.m2 > 0 && c.usd > 0)
  const suficiente = validos.length >= MINIMO_COMPARABLES && m2 > 0
  const usdM2 = mediana(validos.map((c) => c.usd / c.m2))
  const base = usdM2 * m2 * (1 + (ajuste.pct || 0) / 100)
  const sugerido = suficiente ? Math.round(base / 1000) * 1000 : 0
  const rango: [number, number] = [Math.round((sugerido * 0.955) / 1000) * 1000, Math.round((sugerido * 1.03) / 1000) * 1000]
  const diasVendidos = validos.filter((c) => c.estado === 'Vendido' && c.dias > 0).map((c) => c.dias)
  return {
    suficiente,
    cantidad: validos.length,
    usdM2: Number.isFinite(usdM2) ? Math.round(usdM2) : 0,
    sugerido,
    rango,
    ajuste,
    diasMediana: diasVendidos.length ? Math.round(mediana(diasVendidos)) : null,
    vendidos: diasVendidos.length,
  }
}

export const usd = (v: number) => `USD ${v.toLocaleString('es-AR')}`
