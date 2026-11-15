import type { Comparable } from '../data/demo'

function mediana(v: number[]) {
  const s = [...v].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

/**
 * Cálculo del borrador de ACM. Es deliberadamente simple y explicable: mediana de USD/m² de los
 * comparables × superficie, con un ajuste declarado. La corredora lo revisa antes de firmar.
 */
export function calcularACM(comparables: Comparable[], m2: number, ajuste = { etiqueta: 'Terraza propia', pct: 0.5 }) {
  const usdM2 = mediana(comparables.map((c) => c.usd / c.m2))
  const base = usdM2 * m2 * (1 + ajuste.pct / 100)
  const sugerido = Math.round(base / 1000) * 1000
  const rango: [number, number] = [Math.round((sugerido * 0.955) / 1000) * 1000, Math.round((sugerido * 1.03) / 1000) * 1000]
  const diasVendidos = comparables.filter((c) => c.estado === 'Vendido').map((c) => c.dias)
  return {
    usdM2: Math.round(usdM2),
    sugerido,
    rango,
    ajuste,
    diasMediana: Math.round(mediana(diasVendidos)),
    vendidos: diasVendidos.length,
  }
}

export const usd = (v: number) => `USD ${v.toLocaleString('es-AR')}`
