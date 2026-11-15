import { crearAlmacen, nuevoId } from './almacen'
import { normalizar } from './busqueda'

export interface Recordatorio {
  id: string
  texto: string
  dia: number // 0 = hoy, 1 = mañana, ...; sirve para ordenar
  cuando: string
  origen: string
  hecho: boolean
}

const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
const cortos = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

/**
 * Entiende pedidos como los que el asesor manda por WhatsApp:
 * "recordame llamar a Tomás el jueves 10", "mañana 16:30 mandarle las opciones a Lucía", "pedir expensas".
 */
export function leerRecordatorio(frase: string, hoy = new Date()): Omit<Recordatorio, 'id' | 'hecho'> | null {
  let t = frase.trim()
  if (!t) return null
  let n = normalizar(t)

  let dia = 0
  let etiqueta = 'Hoy'
  if (/\bpasado manana\b/.test(n)) {
    dia = 2
    etiqueta = cortos[(hoy.getDay() + 2) % 7]
  } else if (/\bmanana\b/.test(n)) {
    dia = 1
    etiqueta = 'Mañana'
  } else {
    const i = dias.findIndex((d) => new RegExp(`\\b${d}\\b`).test(n))
    if (i >= 0) {
      dia = (i - hoy.getDay() + 7) % 7 || 7
      etiqueta = cortos[i]
    }
  }

  const hora = n.match(/\b(?:a las |a la |las )?(\d{1,2})(?:[:.](\d{2}))?\s*(?:h|hs|horas)?\b(?!\s*(?:m2|amb|mil|k\b))/)
  let horaTexto = ''
  if (hora && Number(hora[1]) <= 23 && (hora[2] || /\b(a las|las|hs|h)\b/.test(n) || dia > 0)) {
    horaTexto = ` ${hora[1].padStart(2, '0')}:${hora[2] ?? '00'}`
  }

  // limpiar: "recordame", día, hora y conectores sueltos
  t = t
    .replace(/^\s*(recordame|recordarme|acordate de|anota(me)?|agenda(me)?)\s*(que\s*)?/i, '')
    .replace(/\b(el|este|el próximo|el proximo)?\s*(pasado mañana|pasado manana|mañana|manana|hoy|domingo|lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado)\b/gi, '')
    .replace(/\b(a las|a la|las)?\s*\d{1,2}([:.]\d{2})?\s*(hs|h|horas)?\b(?!\s*(m2|amb|mil|k\b))/i, (m) => (horaTexto ? '' : m))
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s,]+|[\s,.]+$/g, '')
  n = normalizar(t)
  if (!n) return null

  return { texto: t.charAt(0).toUpperCase() + t.slice(1), dia, cuando: `${etiqueta}${horaTexto}`, origen: 'Pedido por WhatsApp' }
}

const iniciales: Recordatorio[] = [
  { id: 'r1', texto: 'Mandarle a los Ocampo las opciones nuevas', dia: 0, cuando: 'Hoy 11:00', origen: 'Pedido por WhatsApp', hecho: false },
  { id: 'r2', texto: 'Tasación Ugarte 1856 con Tomás Iriarte', dia: 0, cuando: 'Hoy 16:00', origen: 'Google Calendar', hecho: false },
  { id: 'r3', texto: 'Llamar a Tomás para confirmar el precio de publicación', dia: 2, cuando: 'Jue 10:00', origen: 'Pedido por WhatsApp', hecho: false },
  { id: 'r4', texto: 'Pedirle al colega las expensas de Juramento 2655', dia: 3, cuando: 'Vie', origen: 'Pedido por WhatsApp', hecho: false },
]

export const almacenRecordatorios = crearAlmacen<Recordatorio[]>('recordatorios', () => iniciales)

/** la demo transcurre el martes 17 de noviembre (ver fechaDemo): los días se cuentan desde ahí */
const HOY_DEMO = new Date(2026, 10, 17)

export function agregarRecordatorio(frase: string) {
  const r = leerRecordatorio(frase, HOY_DEMO)
  if (!r) return false
  almacenRecordatorios.cambiar((rs) => [...rs, { ...r, id: nuevoId(), hecho: false }].sort((a, b) => a.dia - b.dia || a.cuando.localeCompare(b.cuando)))
  return true
}
