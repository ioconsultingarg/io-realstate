import { crearAlmacen, nuevoId } from './almacen'

/*
 * Motor de búsquedas de la demo. Sin IA: reglas explicables que muestran cómo el agente compara un aviso
 * con lo que busca el cliente. En el producto real, Claude lee el aviso completo; las reglas de abajo son
 * las mismas que se le piden (obligatorio vs deseable, decir por qué, marcar lo que no se sabe).
 */

export type Portal = 'Zonaprop' | 'Argenprop' | 'Mercado Libre' | 'Colega' | 'Otro'
export const portales: Portal[] = ['Zonaprop', 'Argenprop', 'Mercado Libre', 'Colega', 'Otro']

export interface BusquedaV {
  id: string
  cliente: string
  contacto: string
  barrios: string[]
  ambientesMin: number
  precioMin: number | null
  precioMax: number
  obligatorios: string[]
  deseables: string[]
  alertas: Portal[]
  creada: string
}

export interface AvisoV {
  id: string
  busquedaId: string
  direccion: string
  barrio: string
  ambientes: number
  m2: number | null
  precio: number
  texto: string
  fuente: Portal
  llego: string
}

export interface Motivo {
  ok: boolean | null
  texto: string
}

export const barriosConocidos = [
  'Agronomía', 'Almagro', 'Balvanera', 'Barracas', 'Belgrano', 'Boedo', 'Caballito', 'Chacarita', 'Coghlan', 'Colegiales', 'Constitución',
  'Flores', 'Floresta', 'La Boca', 'Liniers', 'Mataderos', 'Monserrat', 'Monte Castro', 'Núñez', 'Palermo', 'Parque Chacabuco', 'Parque Chas',
  'Parque Patricios', 'Paternal', 'Puerto Madero', 'Recoleta', 'Retiro', 'Saavedra', 'San Cristóbal', 'San Nicolás', 'San Telmo', 'Vélez Sarsfield',
  'Versalles', 'Villa Crespo', 'Villa del Parque', 'Villa Devoto', 'Villa Luro', 'Villa Ortúzar', 'Villa Pueyrredón', 'Villa Urquiza',
]

/* ——— utilidades de texto ——— */

export const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()

const sinonimos: Record<string, string[]> = {
  cochera: ['cochera', 'garage', 'garaje', 'estacionamiento'],
  'apto credito': ['apto credito', 'apto banco', 'apto hipotecario'],
  balcon: ['balcon'],
  terraza: ['terraza'],
  patio: ['patio', 'jardin', 'fondo libre'],
  luminoso: ['luminoso', 'mucha luz', 'muy luminoso', 'sol'],
  subte: ['subte', 'estacion'],
  tren: ['tren', 'estacion', 'mitre', 'belgrano norte'],
  pileta: ['pileta', 'piscina'],
  'expensas bajas': ['expensas bajas', 'sin expensas', 'bajas expensas'],
}

/** aparece la palabra sin estar negada: "sin cochera" o "no es apto credito" cuentan como que no lo tiene */
const contiene = (texto: string, palabra: string) => {
  const t = normalizar(texto)
  const p = normalizar(palabra)
  return (sinonimos[p] ?? [p]).some((s) => {
    if (s.startsWith('sin ')) return t.includes(s)
    let i = t.indexOf(s)
    while (i >= 0) {
      if (!/(sin|no tiene|no es|no posee)\s+$/.test(t.slice(Math.max(0, i - 12), i))) return true
      i = t.indexOf(s, i + 1)
    }
    return false
  })
}

const mayuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const k = (n: number) => `${Math.round(n / 1000)} k`

/* ——— afinidad ——— */

/** "Tiene cochera", pero "Luminoso" o "Apto crédito": los adjetivos van solos */
const describir = (s: string) => (/^(apto|a estrenar)|(oso|osa|ado|ada|ido|ida|amplio|amplia)$/.test(normalizar(s)) ? mayuscula(s) : `Tiene ${s}`)

function evaluarPalabra(criterioOriginal: string, aviso: AvisoV, obligatorio: boolean): { motivo: Motivo; descuento: number } {
  const criterio = criterioOriginal.trim()
  const c = normalizar(criterio)
  const texto = `${aviso.texto} ${aviso.direccion}`

  // "sin escaleras": falla si el aviso menciona lo que el cliente no quiere
  if (c.startsWith('sin ')) {
    const evitar = c.slice(4).replace(/s$/, '').replace(/ largas?$/, '')
    return contiene(texto, evitar) && !normalizar(texto).includes(`sin ${evitar}`)
      ? { motivo: { ok: false, texto: `Tiene ${evitar}` }, descuento: obligatorio ? 35 : 6 }
      : { motivo: { ok: true, texto: mayuscula(c) }, descuento: 0 }
  }

  // "cerca del colegio": solo se confirma si el aviso lo nombra
  if (c.startsWith('cerca')) {
    const lugar = c.replace(/^cerca (de la |del |de )?/, '').split(' ')[0]
    return contiene(texto, lugar)
      ? { motivo: { ok: true, texto: `Cerca de ${lugar}: lo menciona el aviso` }, descuento: 0 }
      : { motivo: { ok: null, texto: `A verificar: ${c}` }, descuento: obligatorio ? 10 : 3 }
  }

  // "patio o terraza": alcanza con una de las opciones (se conserva cómo lo escribió el asesor)
  const opciones = criterio.split(/ o /i).map((s) => s.trim())
  const encontrada = opciones.find((o) => contiene(texto, o))
  if (encontrada) return { motivo: { ok: true, texto: describir(encontrada) }, descuento: 0 }
  return obligatorio
    ? { motivo: { ok: null, texto: `El aviso no dice si ${describir(criterio).startsWith('Tiene') ? 'tiene ' : 'es '}${criterio}` }, descuento: 25 }
    : { motivo: { ok: false, texto: `Sin ${criterio}` }, descuento: 6 }
}

export function evaluar(b: BusquedaV, a: AvisoV): { afinidad: number; motivos: Motivo[]; cumpleObligatorios: boolean } {
  const motivos: Motivo[] = []
  let puntaje = 100
  let cumple = true

  if (b.barrios.length) {
    const ok = b.barrios.some((x) => normalizar(x) === normalizar(a.barrio))
    motivos.push({ ok, texto: ok ? `En ${a.barrio}` : `Fuera de zona: ${a.barrio}` })
    if (!ok) {
      puntaje -= 35
      cumple = false
    }
  }

  if (a.ambientes < b.ambientesMin) {
    motivos.push({ ok: false, texto: `${a.ambientes === 1 ? 'Monoambiente' : `${a.ambientes} ambientes`}: pide ${b.ambientesMin}` })
    puntaje -= 35
    cumple = false
  }

  if (a.precio > b.precioMax * 1.05) {
    motivos.push({ ok: false, texto: `USD ${k(a.precio - b.precioMax)} arriba del presupuesto` })
    puntaje -= 35
    cumple = false
  } else if (a.precio > b.precioMax) {
    motivos.push({ ok: null, texto: `USD ${k(a.precio - b.precioMax)} arriba del tope: se puede negociar` })
    puntaje -= 8
  } else if (b.precioMin && a.precio < b.precioMin) {
    motivos.push({ ok: null, texto: 'Por debajo del rango: revisar estado' })
    puntaje -= 5
  } else {
    const holgura = b.precioMax - a.precio
    motivos.push({ ok: true, texto: holgura >= b.precioMax * 0.1 ? `Precio holgado: USD ${k(holgura)} por debajo` : 'Dentro del presupuesto' })
  }

  for (const o of b.obligatorios) {
    const r = evaluarPalabra(o, a, true)
    motivos.push(r.motivo)
    puntaje -= r.descuento
    if (r.motivo.ok === false) cumple = false
  }
  for (const d of b.deseables) {
    const r = evaluarPalabra(d, a, false)
    motivos.push(r.motivo)
    puntaje -= r.descuento
  }

  return { afinidad: Math.max(5, Math.min(99, puntaje)), motivos, cumpleObligatorios: cumple }
}

export const etiquetaAfinidad = (v: number) => (v >= 80 ? 'Muy buena' : v >= 65 ? 'Buena' : 'Posible')

/* ——— lector de avisos pegados (lo que en el producto hace el agente con el mail de la alerta) ——— */

export function leerAviso(textoPegado: string): Partial<AvisoV> {
  const t = textoPegado
  const n = normalizar(t)
  const resultado: Partial<AvisoV> = { texto: t.trim() }

  if (/monoambiente/.test(n)) resultado.ambientes = 1
  const amb = n.match(/(\d+)\s*(ambientes|amb\b|amb\.)/)
  if (amb) resultado.ambientes = Number(amb[1])

  const m2 = n.match(/(\d{2,4}(?:[.,]\d+)?)\s*(m2|m²|mts|metros)/)
  if (m2) resultado.m2 = Math.round(Number(m2[1].replace(',', '.')))

  const usd = t.match(/(?:u\$s|usd|us\$|u\$d)\s*([\d.,]+)/i)
  if (usd) {
    const valor = Number(usd[1].replace(/[.,](?=\d{3}\b)/g, '').replace(',', '.'))
    resultado.precio = valor < 1000 ? valor * 1000 : valor
  }

  const barrio = barriosConocidos.find((b) => n.includes(normalizar(b)))
  if (barrio) resultado.barrio = barrio

  // calle con mayúscula (una a tres palabras) seguida de la altura; se descartan barrios sueltos
  const candidatas = [...t.matchAll(/((?:[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s){1,3}\d{2,5})\b(?!\s*(?:m2|m²|mts|metros|amb))/g)].map((m) => m[1].trim())
  const direccion = candidatas.find((d) => !barriosConocidos.some((b) => normalizar(d).startsWith(normalizar(b) + ' ')))
  if (direccion) resultado.direccion = direccion

  return resultado
}

/* ——— borrador en la voz del asesor ——— */

const numeros = ['', 'una', 'dos', 'tres', 'cuatro', 'cinco']

function semilla(s: string) {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

function frase(b: BusquedaV, a: AvisoV) {
  const { motivos } = evaluar(b, a)
  const ambientes = a.ambientes === 1 ? 'Monoambiente' : `${a.ambientes} ambientes`
  const metros = a.m2 ? ` de ${a.m2} m²` : ''
  const positivos = motivos
    .filter((m) => m.ok === true && m.texto.startsWith('Tiene '))
    .map((m) => m.texto.replace('Tiene ', ''))
    .slice(0, 2)
  const con = positivos.length ? ` con ${positivos.join(' y ')}` : ''
  const contra = motivos.find((m) => m.ok === false)
  const aclaracion = contra ? ` ${contra.texto.startsWith('Sin ') ? `No tiene ${contra.texto.slice(4)}` : contra.texto}, eso sí.` : ''
  return `${a.direccion}, en ${a.barrio}. ${ambientes}${metros}${con}. Piden USD ${a.precio.toLocaleString('es-AR')}.${aclaracion}`
}

export function armarBorrador(b: BusquedaV, elegidos: AvisoV[], firma: string) {
  if (!elegidos.length) return ''
  const n = elegidos.length
  const s = semilla(elegidos.map((a) => a.id).join())
  const cantidad = numeros[n] ?? String(n)
  const aperturas =
    n === 1
      ? [`Hola ${b.contacto}. Entró una que creo que te puede servir.`, `Hola ${b.contacto}. Te paso una que salió hoy y va bastante con lo que buscás.`]
      : [`Hola ${b.contacto}. Entraron ${cantidad} que creo que te pueden servir.`, `Hola ${b.contacto}. Te paso ${cantidad} que salieron estos días y van con lo que buscás.`]
  const cierres =
    n === 1
      ? ['¿Querés que coordine para verla esta semana?', '¿Te interesa verla? Te consigo horario.']
      : ['¿Te parece si coordino para verlas el sábado a la mañana?', '¿Cuál te gustaría ver primero? Coordino.']
  const cuerpo = elegidos.map((a) => frase(b, a)).join('\n\n')
  return `${aperturas[s % aperturas.length]}\n\n${cuerpo}\n\n${cierres[(s >> 3) % cierres.length]}\n${firma}`
}

/* ——— datos iniciales y almacenes ——— */

const busquedasIniciales: BusquedaV[] = [
  {
    id: 'ocampo',
    cliente: 'Familia Ocampo',
    contacto: 'Mariana',
    barrios: ['Villa Urquiza', 'Coghlan'],
    ambientesMin: 4,
    precioMin: null,
    precioMax: 300000,
    obligatorios: ['patio o terraza'],
    deseables: ['cerca del colegio', 'cochera', 'sin escaleras'],
    alertas: ['Zonaprop', 'Argenprop', 'Mercado Libre'],
    creada: 'hace 12 días',
  },
  {
    id: 'lucia',
    cliente: 'Lucía Benítez',
    contacto: 'Lucía',
    barrios: ['Belgrano'],
    ambientesMin: 3,
    precioMin: 180000,
    precioMax: 210000,
    obligatorios: ['apto crédito'],
    deseables: ['balcón', 'cerca del subte'],
    alertas: ['Zonaprop', 'Argenprop'],
    creada: 'hace 3 días',
  },
  {
    id: 'julieta',
    cliente: 'Julieta Romano',
    contacto: 'Julieta',
    barrios: ['Núñez', 'Saavedra'],
    ambientesMin: 1,
    precioMin: 90000,
    precioMax: 110000,
    obligatorios: [],
    deseables: ['cerca del tren', 'expensas bajas'],
    alertas: ['Zonaprop', 'Mercado Libre'],
    creada: 'hace 20 días',
  },
]

const avisosIniciales: AvisoV[] = [
  { id: 'melian', busquedaId: 'ocampo', direccion: 'Melián 3120', barrio: 'Coghlan', ambientes: 4, m2: 118, precio: 289000, texto: '4 ambientes, terraza propia de 30 m², segundo piso por ascensor, a 4 cuadras del colegio.', fuente: 'Zonaprop', llego: 'hoy 07:12' },
  { id: 'pedraza', busquedaId: 'ocampo', direccion: 'Pedraza 2450', barrio: 'Villa Urquiza', ambientes: 4, m2: 125, precio: 262000, texto: 'PH de 4 ambientes con patio de 22 m², sin expensas. Escalera al primer piso.', fuente: 'Mercado Libre', llego: 'hoy 06:40' },
  { id: 'monroe', busquedaId: 'ocampo', direccion: 'Monroe 4880', barrio: 'Villa Urquiza', ambientes: 4, m2: 105, precio: 305000, texto: '4 ambientes con balcón corrido y cochera fija.', fuente: 'Zonaprop', llego: 'ayer 21:30' },
  { id: 'juramento', busquedaId: 'lucia', direccion: 'Juramento 2655', barrio: 'Belgrano', ambientes: 3, m2: 71, precio: 205000, texto: '3 ambientes con balcón aterrazado, apto crédito, a 2 cuadras del subte D.', fuente: 'Argenprop', llego: 'hoy 08:05' },
  { id: 'mendoza', busquedaId: 'lucia', direccion: 'Mendoza 2140', barrio: 'Belgrano', ambientes: 3, m2: 68, precio: 189000, texto: '3 ambientes contrafrente, muy luminoso.', fuente: 'Zonaprop', llego: 'ayer 19:12' },
  { id: 'crisologo', busquedaId: 'julieta', direccion: 'Crisólogo Larralde 2290', barrio: 'Núñez', ambientes: 1, m2: 34, precio: 98000, texto: 'Monoambiente a 5 cuadras del tren Mitre, expensas bajas. Cocina a reciclar.', fuente: 'Mercado Libre', llego: 'hoy 07:48' },
]

export const almacenBusquedas = crearAlmacen<BusquedaV[]>('busquedas', () => busquedasIniciales)
export const almacenAvisos = crearAlmacen<AvisoV[]>('avisos', () => avisosIniciales)
export const almacenVotos = crearAlmacen<Record<string, 'si' | 'no'>>('votos', () => ({ melian: 'si' }))

export function nuevaBusqueda(datos: Omit<BusquedaV, 'id' | 'creada'>): string {
  const id = nuevoId()
  almacenBusquedas.cambiar((bs) => [...bs, { ...datos, id, creada: 'recién creada' }])
  return id
}

export function agregarAviso(datos: Omit<AvisoV, 'id' | 'llego'>) {
  const ahora = new Date()
  const hora = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`
  almacenAvisos.cambiar((as) => [{ ...datos, id: nuevoId(), llego: `hoy ${hora}` }, ...as])
}
