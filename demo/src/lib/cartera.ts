import { cartera as carteraInicial } from '../data/demo'
import { crearAlmacen, nuevoId } from './almacen'
import { normalizar } from './busqueda'

export const estadosCartera = ['disponible', 'reservada', 'vendida', 'en captación'] as const
export type EstadoCartera = (typeof estadosCartera)[number]

export interface Propiedad {
  id: string
  direccion: string
  tipo: string
  operacion: string
  precio: string
  estado: EstadoCartera
  actualizada: string
}

export const almacenCartera = crearAlmacen<Propiedad[]>('cartera', () => carteraInicial.map((p) => ({ ...p, id: nuevoId(), estado: p.estado as EstadoCartera })))

export const plantillaCSV = 'direccion;tipo;operacion;precio;estado\nCabildo 2340 4.º B;3 amb;Venta;USD 198.000;disponible\nMendoza 2915;2 amb;Alquiler;$ 720.000;reservada\n'

/** separa una línea de CSV respetando comillas; acepta coma o punto y coma (Excel en castellano usa ;) */
function separar(linea: string, sep: string) {
  const campos: string[] = []
  let actual = ''
  let comillas = false
  for (let i = 0; i < linea.length; i++) {
    const c = linea[i]
    if (c === '"') {
      if (comillas && linea[i + 1] === '"') {
        actual += '"'
        i++
      } else comillas = !comillas
    } else if (c === sep && !comillas) {
      campos.push(actual.trim())
      actual = ''
    } else actual += c
  }
  campos.push(actual.trim())
  return campos
}

export interface ResultadoImportacion {
  agregadas: number
  actualizadas: number
  sinEstado: number
  errores: string[]
}

/**
 * Importa la cartera desde un CSV exportado del CRM. Reconoce las columnas por nombre, actualiza las
 * propiedades que ya estaban (misma dirección) y avisa lo que no pudo leer: es el "informe de salud de datos".
 */
export function importarCSV(texto: string): ResultadoImportacion {
  const lineas = texto.replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.trim())
  const r: ResultadoImportacion = { agregadas: 0, actualizadas: 0, sinEstado: 0, errores: [] }
  if (lineas.length < 2) {
    r.errores.push('El archivo no tiene filas de datos.')
    return r
  }
  const sep = (lineas[0].match(/;/g)?.length ?? 0) >= (lineas[0].match(/,/g)?.length ?? 0) ? ';' : ','
  const cabecera = separar(lineas[0], sep).map(normalizar)
  const col = (...nombres: string[]) => cabecera.findIndex((c) => nombres.some((n) => c.includes(n)))
  const iDir = col('direccion', 'domicilio', 'calle')
  const iTipo = col('tipo', 'ambientes')
  const iOp = col('operacion')
  const iPrecio = col('precio', 'valor')
  const iEstado = col('estado')
  if (iDir < 0) {
    r.errores.push('No encontré la columna "direccion". Usá la plantilla para ver el formato.')
    return r
  }

  const hoy = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
  const nuevas: Propiedad[] = []
  lineas.slice(1).forEach((l, i) => {
    const c = separar(l, sep)
    const direccion = c[iDir]
    if (!direccion) {
      r.errores.push(`Fila ${i + 2}: sin dirección, la salteé.`)
      return
    }
    const estadoLeido = normalizar(c[iEstado] ?? '')
    const estado = estadosCartera.find((e) => normalizar(e) === estadoLeido || estadoLeido.startsWith(normalizar(e).slice(0, 5)))
    if (!estado) r.sinEstado++
    nuevas.push({
      id: nuevoId(),
      direccion,
      tipo: c[iTipo] ?? '',
      operacion: c[iOp] ?? '',
      precio: c[iPrecio] ?? '',
      estado: estado ?? 'disponible',
      actualizada: hoy,
    })
  })

  almacenCartera.cambiar((actual) => {
    const resultado = [...actual]
    for (const n of nuevas) {
      const j = resultado.findIndex((p) => normalizar(p.direccion) === normalizar(n.direccion))
      if (j >= 0) {
        resultado[j] = { ...resultado[j], ...n, id: resultado[j].id }
        r.actualizadas++
      } else {
        resultado.push(n)
        r.agregadas++
      }
    }
    return resultado
  })
  if (r.sinEstado) r.errores.push(`${r.sinEstado} sin estado reconocible: quedaron como "disponible". Revisalas, porque el agente las va a ofrecer.`)
  return r
}
