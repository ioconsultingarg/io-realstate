import { inmobiliaria } from '../data/demo'
import { crearAlmacen } from './almacen'

export type EstadoTema = 'aprobado' | 'revision' | 'pendiente'

export interface Tema {
  id: string
  tema: string
  detalle: string
  estado: EstadoTema
  contenido: string
  aprobadoPor?: string
}

const temas: Tema[] = [
  {
    id: 'empresa',
    tema: 'Empresa',
    detalle: 'Historia, oficinas y horarios',
    estado: 'aprobado',
    contenido: `${inmobiliaria.nombre} trabaja desde 2009 en Belgrano, Núñez y Villa Urquiza. Oficina en Av. Cabildo 2100 (ficticia), de lunes a viernes de 9 a 19 y sábados de 10 a 13. Corredora responsable: ${inmobiliaria.corredor}, ${inmobiliaria.matricula}.`,
  },
  {
    id: 'equipo',
    tema: 'Equipo',
    detalle: '8 asesores, zonas y agendas',
    estado: 'aprobado',
    contenido: 'Joaquín Ríos: ventas en Belgrano. Sofía López: alquileres y Núñez. Martina Arce: tasaciones y captación. Cada asesor tiene su agenda en Google Calendar y es el contacto de las propiedades que captó.',
  },
  {
    id: 'zonas',
    tema: 'Zonas de mercado',
    detalle: 'Belgrano, Núñez, Villa Urquiza',
    estado: 'aprobado',
    contenido: 'Foco en Belgrano (R y C), Núñez y Villa Urquiza. Coghlan y Saavedra como zonas de borde. Fuera de esas zonas se deriva a colegas de la red.',
  },
  {
    id: 'servicios',
    tema: 'Servicios y comisiones',
    detalle: 'Venta, alquiler y tasación',
    estado: 'aprobado',
    contenido: 'Venta: honorarios según lo pactado en la autorización, informados por escrito. Alquiler: según el contrato. Tasación con informe firmado por la corredora. El asistente no informa honorarios por chat: los conversa el asesor.',
  },
  {
    id: 'cartera',
    tema: 'Cartera',
    detalle: 'Se sincroniza todos los días',
    estado: 'aprobado',
    contenido: 'La cartera se toma de la pantalla Cerebro → Cartera. Lo reservado o vendido no se ofrece. Si un dato no está en la ficha, se responde que lo confirma un asesor.',
  },
  {
    id: 'propuesta',
    tema: 'Propuesta de valor',
    detalle: 'Por qué elegirnos, en 5 puntos',
    estado: 'aprobado',
    contenido: '1. Tasación con comparables reales. 2. Reporte quincenal al propietario. 3. Fotos profesionales. 4. Respuesta a consultas el mismo día. 5. Acompañamiento hasta la escritura.',
  },
  {
    id: 'tono',
    tema: 'Marca y tono',
    detalle: 'Cercano, claro, sin promesas',
    estado: 'aprobado',
    contenido: 'Tuteo. Frases cortas. Sin emojis salvo que el cliente los use. Nunca prometer precio de venta ni plazos. Firmar con el nombre del asesor.',
  },
  {
    id: 'objeciones',
    tema: 'Objeciones y preguntas',
    detalle: '23 objeciones · 4 por revisar',
    estado: 'revision',
    contenido: '"Otra inmobiliaria me cobra menos": mostrar resultados concretos (días de venta, reporte al propietario). "¿Aceptan garantía de caución?": sí, aseguradoras habilitadas. "¿Es apto crédito?": lo dice la ficha; si no, se confirma con el asesor.',
  },
  {
    id: 'legales',
    tema: 'Legales y plantillas',
    detalle: 'Aviso de privacidad y pie con matrícula',
    estado: 'revision',
    contenido: `Primer mensaje automático: aviso de que responde un asistente y enlace a la política de privacidad. Todo lo que sale a un cliente lleva el pie: ${inmobiliaria.corredor}, ${inmobiliaria.matricula}. Reservas, señas y ofertas: siempre con el corredor.`,
  },
  {
    id: 'objetivos',
    tema: 'Objetivos y KPIs',
    detalle: 'Metas del año',
    estado: 'pendiente',
    contenido: '',
  },
]

export const almacenCerebro = crearAlmacen<Tema[]>('cerebro', () => temas)

/** editar un tema lo vuelve a revisión: los agentes usan solo lo aprobado */
export function editarTema(id: string, contenido: string) {
  almacenCerebro.cambiar((ts) => ts.map((t) => (t.id === id ? { ...t, contenido, estado: contenido.trim() ? 'revision' : 'pendiente', aprobadoPor: undefined } : t)))
}

export function aprobarTema(id: string, quien: string) {
  almacenCerebro.cambiar((ts) => ts.map((t) => (t.id === id ? { ...t, estado: 'aprobado', aprobadoPor: quien } : t)))
}
