import { comparablesUgarte, type Comparable } from '../data/demo'
import { crearAlmacen } from './almacen'

export interface Tasacion {
  direccion: string
  descripcion: string
  barrio: string
  cliente: string
  m2: number
  ajuste: { etiqueta: string; pct: number }
  comparables: Comparable[]
  aprobado: boolean
}

const inicial = (): Tasacion => ({
  direccion: 'Ugarte 1856',
  descripcion: 'PH de 4 ambientes · 120 m² · terraza propia',
  barrio: 'Villa Urquiza',
  cliente: 'Tomás Iriarte',
  m2: 120,
  ajuste: { etiqueta: 'Terraza propia', pct: 0.5 },
  comparables: comparablesUgarte,
  aprobado: false,
})

export const almacenTasacion = crearAlmacen<Tasacion>('tasacion', inicial)

/** cualquier cambio de datos anula la firma: la aprobación corresponde a una versión */
export function editarTasacion(fn: (t: Tasacion) => Partial<Tasacion>) {
  almacenTasacion.cambiar((t) => ({ ...t, ...fn(t), aprobado: false }))
}

export function nuevaTasacion() {
  almacenTasacion.cambiar(() => ({
    direccion: '',
    descripcion: '',
    barrio: '',
    cliente: '',
    m2: 0,
    ajuste: { etiqueta: '', pct: 0 },
    comparables: [],
    aprobado: false,
  }))
}
