/*
 * Datos ficticios de la demo. Ninguna persona, inmobiliaria, matrícula ni dirección es real
 * en el sentido de una operación: todo es material de demostración.
 */

export const inmobiliaria = {
  nombre: 'Arce Propiedades',
  zona: 'Belgrano · Núñez · Villa Urquiza',
  ciudad: 'CABA',
  corredor: 'Martina Arce',
  matricula: 'CUCICBA N.º 0000 (demo)',
  asesores: 8,
}

export const usuaria = { nombre: 'Martina', apellido: 'Arce', rol: 'Dueña · corredora responsable' }

export const fechaDemo = 'Martes, 17 de noviembre'

/* ——— Panel ——— */

export const kpis = [
  { id: 'respuesta', etiqueta: 'Primera respuesta', valor: '38', unidad: 's', detalle: 'mediana de la semana', delta: 'antes: 3 h 40 min' },
  { id: 'fuera', etiqueta: 'Fuera de horario', valor: '41', unidad: '%', detalle: '87 de 212 consultas', delta: 'atendidas igual' },
  { id: 'calificados', etiqueta: 'Leads calificados', valor: '57', unidad: '', detalle: '14 calientes', delta: '+19 vs. semana anterior' },
  { id: 'visitas', etiqueta: 'Visitas agendadas', valor: '19', unidad: '', detalle: 'por los agentes', delta: '2 ausencias' },
] as const

/** consultas entrantes por hora del día, últimos 7 días */
export const consultasPorHora = [6, 4, 3, 1, 0, 1, 2, 5, 9, 11, 12, 10, 9, 8, 10, 11, 12, 13, 12, 14, 13, 11, 9, 7]
export const horarioComercial = { desde: 9, hasta: 19 }

export const embudo = [
  { etapa: 'Consultas', valor: 212 },
  { etapa: 'Calificadas', valor: 57 },
  { etapa: 'Visita agendada', valor: 19 },
  { etapa: 'Visita realizada', valor: 15 },
  { etapa: 'Reserva', valor: 3 },
]

export type Agente = 'atencion' | 'captacion' | 'tasacion' | 'marketing' | 'capacitacion' | 'ventas' | 'alquileres' | 'direccion' | 'publicidad' | 'contratos' | 'cumplimiento'

export const actividadNoche: { hora: string; agente: Agente; texto: string; enlace?: string }[] = [
  { hora: '23:14', agente: 'atencion', texto: 'Calificó a Lucía Benítez como caliente y le agendó una visita al 3 ambientes de Cabildo 2340 para el miércoles 10:30.', enlace: '#/conversaciones' },
  { hora: '00:41', agente: 'captacion', texto: 'Respondió a Tomás Iriarte, propietario de un PH en Ugarte 1856, y le agendó la tasación para el jueves 16:00 con Martina.', enlace: '#/conversaciones' },
  { hora: '02:12', agente: 'atencion', texto: 'Derivó a administración una consulta de expensas que no correspondía a ventas.' },
  { hora: '06:30', agente: 'marketing', texto: 'Dejó listas las fichas y los textos para portales de las 3 propiedades que entraron ayer.', enlace: '#/asistente' },
  { hora: '07:05', agente: 'direccion', texto: 'Te mandó el resumen de la semana: 2 captaciones frenadas hace más de 10 días.' },
]

export const visitasHoy = [
  { hora: '10:30', direccion: 'Cabildo 2340 4.º B', tipo: '3 amb · venta', cliente: 'Lucía Benítez', asesor: 'Joaquín R.', origen: 'Agendada por el agente' },
  { hora: '12:00', direccion: 'Mendoza 2915', tipo: '2 amb · alquiler', cliente: 'Carla Méndez', asesor: 'Sofía L.', origen: 'Agendada por el agente' },
  { hora: '16:00', direccion: 'Ugarte 1856', tipo: 'Tasación · PH', cliente: 'Tomás Iriarte', asesor: 'Martina A.', origen: 'Agendada por el agente' },
  { hora: '18:15', direccion: 'Juramento 1720 8.º', tipo: '4 amb · venta', cliente: 'Familia Ocampo', asesor: 'Joaquín R.', origen: 'Agendada por el asesor' },
]

/* ——— Conversaciones ——— */

export type Temperatura = 'caliente' | 'tibio' | 'frio' | 'derivado'

export interface Mensaje {
  de: 'cliente' | 'agente' | 'sistema' | 'asesor'
  texto: string
  hora: string
  adjunto?: { tipo: 'ficha'; titulo: string; detalle: string }
}

export interface Conversacion {
  id: string
  nombre: string
  tipo: 'Comprador' | 'Propietario' | 'Inquilino' | 'Inversor'
  temperatura: Temperatura
  resumen: string
  ultima: string
  hora: string
  noLeidos: number
  agente: Agente
  asesor: string
  calificacion: { campo: string; valor: string }[]
  proximo: string
  mensajes: Mensaje[]
}

export const conversaciones: Conversacion[] = [
  {
    id: 'lucia',
    nombre: 'Lucía Benítez',
    tipo: 'Comprador',
    temperatura: 'caliente',
    resumen: '3 amb en Belgrano · USD 180–210 k · crédito preaprobado',
    ultima: '¡Perfecto, ahí estaré! Gracias',
    hora: '23:19',
    noLeidos: 0,
    agente: 'atencion',
    asesor: 'Joaquín Ríos',
    calificacion: [
      { campo: 'Operación', valor: 'Compra · vivienda propia' },
      { campo: 'Zona', valor: 'Belgrano, cerca del subte D' },
      { campo: 'Presupuesto', valor: 'USD 180.000 a 210.000' },
      { campo: 'Forma de pago', valor: 'Ahorro + crédito hipotecario preaprobado' },
      { campo: 'Urgencia', valor: 'Mudanza antes de marzo' },
      { campo: 'Requisitos', valor: 'Balcón, luz, apto crédito' },
    ],
    proximo: 'Visita mié 10:30 · Cabildo 2340 4.º B · con Joaquín',
    mensajes: [
      { de: 'cliente', hora: '23:14', texto: 'Hola! Vi en un portal el 3 ambientes de Cabildo. Sigue disponible? Es apto crédito?' },
      { de: 'sistema', hora: '23:14', texto: 'Asistente automatizado de Arce Propiedades. Tus datos se usan solo para responderte (política de privacidad).' },
      { de: 'agente', hora: '23:14', texto: '¡Hola! Sí, sigue disponible. Es un 3 ambientes de 74 m² con balcón al frente, a 2 cuadras del subte D, y es apto crédito. ¿Lo buscás para vivir o como inversión?' },
      { de: 'cliente', hora: '23:15', texto: 'Para vivir. Tengo el crédito preaprobado en el Nación, más o menos hasta 210 mil dólares sumando lo que tengo ahorrado' },
      { de: 'agente', hora: '23:16', texto: 'Genial, entra bien en tu presupuesto: se publica a USD 198.000. Te paso la ficha con fotos y expensas.', adjunto: { tipo: 'ficha', titulo: 'Cabildo 2340 4.º B', detalle: '3 amb · 74 m² · balcón · USD 198.000' } },
      { de: 'cliente', hora: '23:17', texto: 'Me encanta. Se puede ver esta semana? Necesito mudarme antes de marzo' },
      { de: 'agente', hora: '23:17', texto: 'Tengo lugar con Joaquín, el asesor de la propiedad: miércoles 10:30 o jueves 18:00. ¿Cuál te queda mejor?' },
      { de: 'cliente', hora: '23:18', texto: 'Miércoles 10:30' },
      { de: 'agente', hora: '23:18', texto: 'Listo, quedó agendado el miércoles 10:30 en Cabildo 2340. Te llega un recordatorio el día anterior. Si tenés que cambiar el horario, respondé este mensaje.' },
      { de: 'cliente', hora: '23:19', texto: '¡Perfecto, ahí estaré! Gracias' },
    ],
  },
  {
    id: 'tomas',
    nombre: 'Tomás Iriarte',
    tipo: 'Propietario',
    temperatura: 'caliente',
    resumen: 'Quiere vender un PH de 4 amb en Villa Urquiza',
    ultima: 'Dale, el jueves a las 16 está bien',
    hora: '00:43',
    noLeidos: 0,
    agente: 'captacion',
    asesor: 'Martina Arce',
    calificacion: [
      { campo: 'Operación', valor: 'Venta' },
      { campo: 'Inmueble', valor: 'PH 4 amb · 120 m² · Ugarte 1856' },
      { campo: 'Motivo', valor: 'Se muda al interior' },
      { campo: 'Plazo', valor: '3 a 6 meses' },
      { campo: 'Otras inmobiliarias', valor: 'Lo consultó con una más' },
    ],
    proximo: 'Tasación jue 16:00 · ACM en preparación',
    mensajes: [
      { de: 'cliente', hora: '00:39', texto: 'Buenas noches, quiero saber cuánto vale mi PH para venderlo. Es en Villa Urquiza' },
      { de: 'agente', hora: '00:40', texto: 'Hola Tomás, gracias por escribir. Para darte un valor serio, Martina Arce, la corredora a cargo, lo tasa en persona con comparables de la zona. ¿Me contás cuántos ambientes y metros tiene?' },
      { de: 'cliente', hora: '00:41', texto: '4 ambientes, 120 metros más o menos, con terraza' },
      { de: 'agente', hora: '00:41', texto: 'Perfecto. Martina tiene disponible el jueves a las 16 o el viernes a las 11. ¿Te queda bien alguno?' },
      { de: 'cliente', hora: '00:43', texto: 'Dale, el jueves a las 16 está bien' },
    ],
  },
  {
    id: 'carla',
    nombre: 'Carla Méndez',
    tipo: 'Inquilino',
    temperatura: 'tibio',
    resumen: '2 amb en alquiler · Palermo o Colegiales',
    ultima: '¿Aceptan garantía de caución?',
    hora: '21:02',
    noLeidos: 1,
    agente: 'atencion',
    asesor: 'Sofía López',
    calificacion: [
      { campo: 'Operación', valor: 'Alquiler · 2 amb' },
      { campo: 'Zona', valor: 'Palermo o Colegiales' },
      { campo: 'Presupuesto', valor: 'Hasta $ 750.000 + expensas' },
      { campo: 'Garantía', valor: 'Seguro de caución (a confirmar)' },
    ],
    proximo: 'Visita hoy 12:00 · Mendoza 2915',
    mensajes: [
      { de: 'cliente', hora: '20:58', texto: 'Hola, el 2 ambientes de Mendoza al 2900 sigue en alquiler?' },
      { de: 'agente', hora: '20:59', texto: 'Hola Carla, sí. Se alquila a $ 720.000 más expensas, con ajuste trimestral según contrato. ¿Para cuándo lo necesitarías?' },
      { de: 'cliente', hora: '21:02', texto: '¿Aceptan garantía de caución?' },
    ],
  },
  {
    id: 'hernan',
    nombre: 'Hernán Sosa',
    tipo: 'Comprador',
    temperatura: 'derivado',
    resumen: 'Ofrece USD 160 k por Juramento 1720',
    ultima: 'Le paso tu propuesta a Joaquín',
    hora: '19:40',
    noLeidos: 0,
    agente: 'atencion',
    asesor: 'Joaquín Ríos',
    calificacion: [
      { campo: 'Operación', valor: 'Compra' },
      { campo: 'Motivo de derivación', valor: 'Quiere negociar precio' },
    ],
    proximo: 'Joaquín lo llama hoy',
    mensajes: [
      { de: 'cliente', hora: '19:38', texto: 'Si les ofrezco 160 mil cerramos hoy?' },
      { de: 'agente', hora: '19:40', texto: 'Gracias, Hernán. Las ofertas las conversa directamente el asesor con el propietario, así que le paso tu propuesta a Joaquín Ríos y te llama hoy mismo.' },
    ],
  },
  {
    id: 'julieta',
    nombre: 'Julieta Romano',
    tipo: 'Inversor',
    temperatura: 'tibio',
    resumen: 'Busca monoambiente para renta en Núñez',
    ultima: 'Pasame lo que tengan en pozo',
    hora: 'Ayer',
    noLeidos: 0,
    agente: 'atencion',
    asesor: 'Sofía López',
    calificacion: [
      { campo: 'Operación', valor: 'Compra · inversión' },
      { campo: 'Zona', valor: 'Núñez' },
      { campo: 'Presupuesto', valor: 'USD 90.000 a 110.000' },
    ],
    proximo: 'Recibir novedades de pozo (aceptó avisos)',
    mensajes: [
      { de: 'cliente', hora: '18:10', texto: 'Pasame lo que tengan en pozo' },
    ],
  },
  {
    id: 'federico',
    nombre: 'Federico Paz',
    tipo: 'Comprador',
    temperatura: 'frio',
    resumen: 'Mirando opciones, sin presupuesto definido',
    ultima: 'Por ahora solo miro, gracias',
    hora: 'Lun',
    noLeidos: 0,
    agente: 'atencion',
    asesor: '—',
    calificacion: [{ campo: 'Operación', valor: 'Compra · sin definir' }],
    proximo: 'Sin seguimiento (no aceptó avisos)',
    mensajes: [{ de: 'cliente', hora: '11:20', texto: 'Por ahora solo miro, gracias' }],
  },
]

/* ——— Agentes ——— */

export interface FichaAgente {
  id: Agente
  nombre: string
  cara: 'Cliente' | 'Interno' | 'Ambas'
  hace: string
  semana: string
  estado: 'activo' | 'pausado' | 'proximamente'
}

export const agentes: FichaAgente[] = [
  { id: 'atencion', nombre: 'Atención y leads', cara: 'Cliente', hace: 'Responde con tu cartera real, califica y agenda visitas en la agenda del asesor correcto.', semana: '212 consultas · 19 visitas', estado: 'activo' },
  { id: 'captacion', nombre: 'Captación', cara: 'Ambas', hace: 'Atiende propietarios, agenda tasaciones y prepara al asesor antes de la reunión.', semana: '6 propietarios · 3 tasaciones', estado: 'activo' },
  { id: 'tasacion', nombre: 'Tasación', cara: 'Interno', hace: 'Arma el borrador del análisis comparativo con tu marca. Lo revisa y firma la corredora.', semana: '4 informes', estado: 'activo' },
  { id: 'marketing', nombre: 'Marketing', cara: 'Interno', hace: 'Fichas, textos para portales, guiones de reels y análisis de la competencia.', semana: '11 fichas · 1 informe', estado: 'activo' },
  { id: 'capacitacion', nombre: 'Capacitación', cara: 'Interno', hace: 'Plan de 30 días para asesores nuevos y práctica de objeciones con devolución.', semana: '9 prácticas', estado: 'activo' },
  { id: 'direccion', nombre: 'Dirección', cara: 'Interno', hace: 'Resumen semanal y alertas: leads sin respuesta, captaciones frenadas.', semana: '1 resumen · 2 alertas', estado: 'activo' },
  { id: 'ventas', nombre: 'Ventas', cara: 'Interno', hace: 'Prepara cada visita, sigue al comprador después y pide referidos.', semana: '—', estado: 'pausado' },
  { id: 'alquileres', nombre: 'Alquileres', cara: 'Ambas', hace: 'Comprobantes, incidencias y ajustes según el índice que dice cada contrato.', semana: '—', estado: 'proximamente' },
  { id: 'publicidad', nombre: 'Publicidad', cara: 'Interno', hace: 'Lee tus campañas de Meta Ads y te dice qué rinde y qué no.', semana: '—', estado: 'proximamente' },
  { id: 'contratos', nombre: 'Contratos', cara: 'Interno', hace: 'Borradores desde tus plantillas, siempre revisados por la corredora.', semana: '—', estado: 'proximamente' },
  { id: 'cumplimiento', nombre: 'Cumplimiento', cara: 'Interno', hace: 'Consentimientos, Registro No Llame y checklist de debida diligencia.', semana: '—', estado: 'proximamente' },
]

export const nombreAgente = (id: Agente) => agentes.find((a) => a.id === id)?.nombre ?? id

/* ——— Cerebro ——— */

export const cerebro: { tema: string; estado: 'aprobado' | 'revision' | 'pendiente'; detalle: string }[] = [
  { tema: 'Empresa', estado: 'aprobado', detalle: 'Historia, oficinas y horarios' },
  { tema: 'Equipo', estado: 'aprobado', detalle: '8 asesores, zonas y agendas' },
  { tema: 'Zonas de mercado', estado: 'aprobado', detalle: 'Belgrano, Núñez, Villa Urquiza' },
  { tema: 'Servicios y comisiones', estado: 'aprobado', detalle: 'Venta, alquiler y tasación' },
  { tema: 'Cartera', estado: 'aprobado', detalle: '64 propiedades · sincronizada hoy 06:00' },
  { tema: 'Propuesta de valor', estado: 'aprobado', detalle: 'Por qué elegirnos, en 5 puntos' },
  { tema: 'Marca y tono', estado: 'aprobado', detalle: 'Cercano, claro, sin promesas' },
  { tema: 'Objeciones y preguntas', estado: 'revision', detalle: '23 objeciones · 4 por revisar' },
  { tema: 'Legales y plantillas', estado: 'revision', detalle: 'Aviso de privacidad y pie con matrícula' },
  { tema: 'Objetivos y KPIs', estado: 'pendiente', detalle: 'Falta cargar metas 2027' },
]

export const cartera = [
  { direccion: 'Cabildo 2340 4.º B', tipo: '3 amb', operacion: 'Venta', precio: 'USD 198.000', estado: 'disponible', actualizada: 'hoy' },
  { direccion: 'Juramento 1720 8.º', tipo: '4 amb', operacion: 'Venta', precio: 'USD 265.000', estado: 'reservada', actualizada: 'hoy' },
  { direccion: 'Mendoza 2915', tipo: '2 amb', operacion: 'Alquiler', precio: '$ 720.000', estado: 'disponible', actualizada: 'ayer' },
  { direccion: 'Ugarte 1856', tipo: 'PH 4 amb', operacion: 'Tasación', precio: '—', estado: 'en captación', actualizada: 'hoy' },
  { direccion: 'Melián 2201', tipo: '2 amb', operacion: 'Venta', precio: 'USD 128.000', estado: 'vendida', actualizada: 'hace 3 días' },
  { direccion: 'Crisólogo Larralde 3410', tipo: 'Monoamb.', operacion: 'Venta', precio: 'USD 96.000', estado: 'disponible', actualizada: 'hoy' },
] as const

/* ——— Asistente interno ——— */

export interface Comparable {
  direccion: string
  m2: number
  usd: number
  estado: 'Vendido' | 'Publicado'
  dias: number
}

export const comparablesUgarte: Comparable[] = [
  { direccion: 'Bauness 2140 · PH', m2: 112, usd: 214000, estado: 'Vendido', dias: 74 },
  { direccion: 'Ugarte 2010 · PH', m2: 126, usd: 252000, estado: 'Vendido', dias: 58 },
  { direccion: 'Mariano Acha 1620 · PH', m2: 118, usd: 239000, estado: 'Publicado', dias: 41 },
  { direccion: 'Roosevelt 4980 · PH', m2: 104, usd: 199000, estado: 'Vendido', dias: 96 },
  { direccion: 'Pedro Rivera 3150 · PH', m2: 131, usd: 271000, estado: 'Publicado', dias: 122 },
  { direccion: 'Tamborini 4512 · PH', m2: 115, usd: 226000, estado: 'Vendido', dias: 63 },
]

export const pedidosEjemplo = [
  { id: 'tasacion', agente: 'tasacion' as Agente, etiqueta: 'Tasación', texto: 'Armame el ACM de Ugarte 1856, PH de 4 ambientes y 120 m² con terraza, para presentárselo a Tomás el jueves.' },
  { id: 'competencia', agente: 'marketing' as Agente, etiqueta: 'Competencia', texto: '¿Cómo están captando propietarios mis competidores en Belgrano?' },
  { id: 'roleplay', agente: 'capacitacion' as Agente, etiqueta: 'Práctica', texto: 'Practiquemos la objeción "la otra inmobiliaria me cobra menos comisión".' },
] as const

export const competencia = {
  fuentes: '38 anuncios activos en la Biblioteca de anuncios de Meta y 3 sitios web, relevados hoy 08:12',
  hallazgos: [
    { titulo: 'Todos prometen "tasación gratis en 24 h"', detalle: 'Es el gancho de 4 de los 5 competidores. Ya no diferencia.' },
    { titulo: 'Casi nadie muestra resultados', detalle: 'Solo 1 anuncio cita días promedio de venta. Es un espacio libre.' },
    { titulo: 'El destino es WhatsApp, no un formulario', detalle: '29 de 38 anuncios llevan directo a WhatsApp.' },
  ],
  angulos: [
    { angulo: 'Tasación gratis', competidores: 4 },
    { angulo: 'Vendé rápido', competidores: 3 },
    { angulo: 'Fotos profesionales', competidores: 2 },
    { angulo: 'Datos de la zona', competidores: 1 },
    { angulo: 'Reporte al propietario', competidores: 0 },
  ],
  piezas: ['Carrusel: "Cuánto tardó en venderse un PH en Villa Urquiza este año"', 'Reel: recorrido de 30 s con el precio por m² de la cuadra', 'Anuncio: reporte quincenal al propietario sobre su publicación'],
}

export const roleplay = {
  intercambio: [
    { de: 'agente', texto: 'Hago de propietario: "Mirá, la otra inmobiliaria me cobra el 2 % y ustedes el 3 %. ¿Por qué pagaría más?"' },
    { de: 'asesor', texto: 'Entiendo. La diferencia está en lo que hacemos: tasación con comparables reales, fotos profesionales y te mando un reporte cada 15 días con las consultas y las visitas.' },
  ],
  devolucion: [
    { criterio: 'Validó la objeción antes de responder', nota: 3, de: 3 },
    { criterio: 'Mostró valor concreto, no solo servicios', nota: 2, de: 3 },
    { criterio: 'Cerró con una pregunta o un paso siguiente', nota: 1, de: 3 },
  ],
  sugerencia: 'Bien arrancado. Sumá un dato: "nuestros PH en la zona se vendieron en 63 días de mediana" y cerrá con "¿te muestro cómo quedaría la publicación del tuyo?".',
}

/* ——— Búsquedas (plan del asesor individual) ——— */

export type Portal = 'Zonaprop' | 'Argenprop' | 'Mercado Libre' | 'Colega'

export interface Criterio {
  texto: string
  tipo: 'obligatorio' | 'deseable'
}

export interface Aviso {
  id: string
  direccion: string
  barrio: string
  detalle: string
  usd: number
  afinidad: number
  fuentes: Portal[]
  publicadoPor: string
  llego: string
  motivos: { ok: boolean | null; texto: string }[]
}

export interface Busqueda {
  id: string
  cliente: string
  contacto: string
  resumen: string
  criterios: Criterio[]
  alertas: Portal[]
  desde: string
  avisos: Aviso[]
  descartadosPorCriterio: number
}

export const busquedas: Busqueda[] = [
  {
    id: 'ocampo',
    cliente: 'Familia Ocampo',
    contacto: 'Mariana',
    resumen: '4 amb con patio o terraza · hasta USD 300 k',
    criterios: [
      { texto: '4 ambientes', tipo: 'obligatorio' },
      { texto: 'Patio o terraza', tipo: 'obligatorio' },
      { texto: 'Villa Urquiza o Coghlan', tipo: 'obligatorio' },
      { texto: 'Hasta USD 300.000', tipo: 'obligatorio' },
      { texto: 'Cerca del colegio (Monroe y Bauness)', tipo: 'deseable' },
      { texto: 'Cochera', tipo: 'deseable' },
      { texto: 'Sin escaleras largas', tipo: 'deseable' },
    ],
    alertas: ['Zonaprop', 'Argenprop', 'Mercado Libre'],
    desde: 'hace 12 días',
    descartadosPorCriterio: 5,
    avisos: [
      {
        id: 'melian',
        direccion: 'Melián 3120',
        barrio: 'Coghlan',
        detalle: '4 amb · 118 m² · terraza propia · 2.º piso por ascensor',
        usd: 289000,
        afinidad: 92,
        fuentes: ['Zonaprop', 'Argenprop'],
        publicadoPor: 'publicada por 2 inmobiliarias',
        llego: 'hoy 07:12',
        motivos: [
          { ok: true, texto: 'Terraza propia de 30 m²' },
          { ok: true, texto: 'A 4 cuadras del colegio' },
          { ok: true, texto: 'Dentro del presupuesto' },
          { ok: false, texto: 'Sin cochera' },
        ],
      },
      {
        id: 'pedraza',
        direccion: 'Pedraza 2450',
        barrio: 'Villa Urquiza',
        detalle: 'PH 4 amb · 125 m² · patio · sin expensas',
        usd: 262000,
        afinidad: 85,
        fuentes: ['Mercado Libre'],
        publicadoPor: 'publicado por el dueño',
        llego: 'hoy 06:40',
        motivos: [
          { ok: true, texto: 'Patio de 22 m²' },
          { ok: true, texto: 'Precio holgado: USD 38 k por debajo' },
          { ok: null, texto: 'Escalera al primer piso (21 escalones)' },
          { ok: false, texto: 'Sin cochera' },
        ],
      },
      {
        id: 'monroe',
        direccion: 'Monroe 4880',
        barrio: 'Villa Urquiza',
        detalle: '4 amb · 105 m² · balcón · cochera',
        usd: 305000,
        afinidad: 58,
        fuentes: ['Zonaprop'],
        publicadoPor: 'publicada por 1 inmobiliaria',
        llego: 'ayer 21:30',
        motivos: [
          { ok: true, texto: 'Cochera fija' },
          { ok: false, texto: 'Balcón, no patio ni terraza' },
          { ok: false, texto: 'USD 5 k arriba del presupuesto' },
        ],
      },
    ],
  },
  {
    id: 'lucia',
    cliente: 'Lucía Benítez',
    contacto: 'Lucía',
    resumen: '3 amb apto crédito · Belgrano · USD 180–210 k',
    criterios: [
      { texto: '3 ambientes', tipo: 'obligatorio' },
      { texto: 'Apto crédito', tipo: 'obligatorio' },
      { texto: 'Belgrano', tipo: 'obligatorio' },
      { texto: 'USD 180.000 a 210.000', tipo: 'obligatorio' },
      { texto: 'Balcón', tipo: 'deseable' },
      { texto: 'Cerca del subte D', tipo: 'deseable' },
    ],
    alertas: ['Zonaprop', 'Argenprop'],
    desde: 'hace 3 días',
    descartadosPorCriterio: 3,
    avisos: [
      {
        id: 'juramento',
        direccion: 'Juramento 2655',
        barrio: 'Belgrano',
        detalle: '3 amb · 71 m² · balcón aterrazado · apto crédito',
        usd: 205000,
        afinidad: 88,
        fuentes: ['Argenprop', 'Colega'],
        publicadoPor: 'la tiene un colega de la red',
        llego: 'hoy 08:05',
        motivos: [
          { ok: true, texto: 'Apto crédito confirmado en el aviso' },
          { ok: true, texto: 'A 2 cuadras de la estación Juramento' },
          { ok: null, texto: 'Cerca del techo del presupuesto' },
        ],
      },
      {
        id: 'mendoza',
        direccion: 'Mendoza 2140',
        barrio: 'Belgrano',
        detalle: '3 amb · 68 m² · contrafrente',
        usd: 189000,
        afinidad: 71,
        fuentes: ['Zonaprop'],
        publicadoPor: 'publicada por 1 inmobiliaria',
        llego: 'ayer 19:12',
        motivos: [
          { ok: true, texto: 'Buen precio para la zona' },
          { ok: false, texto: 'Sin balcón' },
          { ok: null, texto: 'El aviso no dice si es apto crédito' },
        ],
      },
    ],
  },
  {
    id: 'julieta',
    cliente: 'Julieta Romano',
    contacto: 'Julieta',
    resumen: 'Monoambiente para renta · Núñez · USD 90–110 k',
    criterios: [
      { texto: 'Monoambiente o 2 amb chico', tipo: 'obligatorio' },
      { texto: 'Núñez', tipo: 'obligatorio' },
      { texto: 'USD 90.000 a 110.000', tipo: 'obligatorio' },
      { texto: 'Cerca de la UBA o del tren', tipo: 'deseable' },
      { texto: 'Expensas bajas', tipo: 'deseable' },
    ],
    alertas: ['Zonaprop', 'Mercado Libre'],
    desde: 'hace 20 días',
    descartadosPorCriterio: 4,
    avisos: [
      {
        id: 'crisologo',
        direccion: 'Crisólogo Larralde 2290',
        barrio: 'Núñez',
        detalle: 'Monoambiente · 34 m² · expensas $ 68.000',
        usd: 98000,
        afinidad: 81,
        fuentes: ['Mercado Libre', 'Zonaprop'],
        publicadoPor: 'publicada por 2 inmobiliarias',
        llego: 'hoy 07:48',
        motivos: [
          { ok: true, texto: 'A 5 cuadras del tren Mitre' },
          { ok: true, texto: 'Expensas bajas para la zona' },
          { ok: null, texto: 'A reciclar: cocina original' },
        ],
      },
    ],
  },
]

export const resumenBusquedas = { revisados: 23, duplicados: 7, descartados: 12 }

/** estilo aprendido de 28 mensajes que la asesora mandó a sus clientes */
export const estiloAsesora = ['Saluda con "Hola" y el nombre', 'Tutea', 'Frases cortas, sin listas', 'Sin emojis', 'Cierra con una pregunta concreta', 'Firma "Martina"']

export const recordatorios = [
  { cuando: 'Hoy 11:00', texto: 'Mandarle a los Ocampo las opciones nuevas', origen: 'Pedido por WhatsApp' },
  { cuando: 'Hoy 16:00', texto: 'Tasación Ugarte 1856 con Tomás Iriarte', origen: 'Google Calendar' },
  { cuando: 'Jue 10:00', texto: 'Llamar a Tomás para confirmar el precio de publicación', origen: 'Pedido por WhatsApp' },
  { cuando: 'Vie', texto: 'Pedirle al colega las expensas de Juramento 2655', origen: 'Pedido por WhatsApp' },
]
