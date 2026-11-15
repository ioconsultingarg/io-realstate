import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BellRing, Check, Copy, Inbox, Mail, MessageCircle, Minus, PenLine, ThumbsDown, ThumbsUp, Undo2, X } from 'lucide-react'
import { Boton, Chip, Encabezado } from '../components/ui'
import { busquedas, estiloAsesora, recordatorios, resumenBusquedas, usuaria, type Aviso, type Busqueda } from '../data/demo'

type Voto = 'si' | 'no'

/** frase de cada aviso tal como la escribiría la asesora (estilo aprendido) */
const frases: Record<string, string> = {
  melian: 'Melián 3120, en Coghlan. 4 ambientes con terraza propia de 30 m², a 4 cuadras del colegio. Piden USD 289.000. No tiene cochera.',
  pedraza: 'Pedraza 2450, en Villa Urquiza. PH con patio, sin expensas, a USD 262.000. Tiene escalera al primer piso, eso sí.',
  monroe: 'Monroe 4880, en Villa Urquiza. Tiene cochera, pero es con balcón y están pidiendo USD 305.000.',
  juramento: 'Juramento 2655, a dos cuadras del subte. 3 ambientes con balcón aterrazado y apto crédito. USD 205.000.',
  mendoza: 'Mendoza 2140. 3 ambientes contrafrente a USD 189.000. No tiene balcón y tengo que confirmar si es apto crédito.',
  crisologo: 'Crisólogo Larralde 2290. Monoambiente de 34 m² a 5 cuadras del Mitre, expensas bajas. USD 98.000. Hay que reciclar la cocina.',
}

/** lo que aprende el agente cuando el asesor descarta un aviso */
const aprendizaje: Record<string, string> = {
  pedraza: 'Anotado: no te muestro más PH con escalera para los Ocampo.',
  monroe: 'Anotado: sin patio ni terraza no va, aunque tenga cochera.',
  mendoza: 'Anotado: para Lucía, solo los que digan apto crédito.',
}

const numero = ['', 'una', 'dos', 'tres', 'cuatro']

function armarBorrador(b: Busqueda, elegidos: Aviso[]) {
  if (!elegidos.length) return ''
  const n = elegidos.length
  const apertura = n === 1 ? `Hola ${b.contacto}. Entró hoy una que creo que te puede servir.` : `Hola ${b.contacto}. Entraron ${numero[n] ?? n} que creo que te pueden servir.`
  const cuerpo = elegidos.map((a) => frases[a.id] ?? `${a.direccion}, ${a.barrio}.`).join('\n\n')
  const cierre = n === 1 ? '¿Querés que coordine para verla esta semana?' : '¿Te parece si coordino para verlas el sábado a la mañana?'
  return `${apertura}\n\n${cuerpo}\n\n${cierre}\n${usuaria.nombre}`
}

function Afinidad({ valor }: { valor: number }) {
  const tono = valor >= 80 ? 'text-ok' : valor >= 65 ? 'text-warn' : 'text-ink-3'
  const etiqueta = valor >= 80 ? 'Muy buena' : valor >= 65 ? 'Buena' : 'Posible'
  const r = 20
  const c = 2 * Math.PI * r
  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
      <svg width="52" height="52" viewBox="0 0 52 52" role="img" aria-label={`Afinidad ${valor} %, ${etiqueta.toLowerCase()}`} className={tono}>
        <circle cx="26" cy="26" r={r} fill="none" stroke="var(--color-line)" strokeWidth="4" />
        <circle cx="26" cy="26" r={r} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(valor / 100) * c} ${c}`} transform="rotate(-90 26 26)" />
        <text x="26" y="30.5" textAnchor="middle" fontSize="13" fill="var(--color-ink)" className="num">
          {valor}
        </text>
      </svg>
      <span className={`text-[11px] font-medium ${tono}`}>{etiqueta}</span>
    </div>
  )
}

function TarjetaAviso({ a, voto, onVoto }: { a: Aviso; voto?: Voto; onVoto: (v: Voto | undefined) => void }) {
  if (voto === 'no') {
    return (
      <motion.li layout initial={false} className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-line px-4 py-3 text-[14px] text-ink-3">
        <span className="min-w-0">
          <span className="line-through">{a.direccion}</span> · <span className="text-ink-2">{aprendizaje[a.id] ?? 'Anotado para afinar la búsqueda.'}</span>
        </span>
        <button type="button" onClick={() => onVoto(undefined)} className="press inline-flex min-h-9 shrink-0 items-center gap-1 rounded-full px-2.5 text-[13px] text-ink-2 hover:bg-sunken">
          <Undo2 size={14} aria-hidden="true" />
          Deshacer
        </button>
      </motion.li>
    )
  }
  return (
    <motion.li layout initial={false} className={`tarjeta p-4 sm:p-5 ${voto === 'si' ? 'ring-2 ring-ok/50' : ''}`}>
      <div className="flex gap-4">
        <Afinidad valor={a.afinidad} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3 className="text-[17px] font-medium">
              {a.direccion} <span className="text-ink-3">· {a.barrio}</span>
            </h3>
            <span className="num text-[16px] text-ink">USD {a.usd.toLocaleString('es-AR')}</span>
          </div>
          <p className="mt-0.5 text-[14px] text-ink-2">{a.detalle}</p>
          <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {a.motivos.map((m) => (
              <li key={m.texto} className="flex items-start gap-1.5 text-[13px] text-ink-2">
                {m.ok === true ? (
                  <Check size={15} aria-label="Cumple" className="mt-0.5 shrink-0 text-ok" />
                ) : m.ok === false ? (
                  <X size={15} aria-label="No cumple" className="mt-0.5 shrink-0 text-bad" />
                ) : (
                  <Minus size={15} aria-label="A revisar" className="mt-0.5 shrink-0 text-warn" />
                )}
                {m.texto}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
            <p className="flex flex-wrap items-center gap-1.5 text-[12px] text-ink-3">
              {a.fuentes.map((f) => (
                <Chip key={f}>{f}</Chip>
              ))}
              <span>
                {a.publicadoPor} · llegó {a.llego}
              </span>
            </p>
            <div className="flex gap-2">
              <Boton variante={voto === 'si' ? 'primario' : 'secundario'} icono={ThumbsUp} aria-pressed={voto === 'si'} onClick={() => onVoto(voto === 'si' ? undefined : 'si')}>
                {voto === 'si' ? 'Elegida' : 'Me sirve'}
              </Boton>
              <Boton variante="fantasma" icono={ThumbsDown} onClick={() => onVoto('no')} aria-label={`Descartar ${a.direccion}`}>
                No
              </Boton>
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  )
}

export function Busquedas() {
  const [actualId, setActualId] = useState(busquedas[0].id)
  const [votos, setVotos] = useState<Record<string, Voto | undefined>>({ melian: 'si' })
  const [editado, setEditado] = useState<Record<string, string>>({})
  const [copiado, setCopiado] = useState(false)
  const actual = busquedas.find((b) => b.id === actualId)!

  const elegidos = actual.avisos.filter((a) => votos[a.id] === 'si')
  const generado = useMemo(() => armarBorrador(actual, elegidos), [actual, elegidos])
  const clave = `${actual.id}:${elegidos.map((a) => a.id).join(',')}`
  const borrador = editado[clave] ?? generado
  const ordenados = [...actual.avisos].sort((x, y) => y.afinidad - x.afinidad)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(borrador)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1800)
    } catch {
      /* sin portapapeles: el texto sigue seleccionable en el cuadro */
    }
  }

  return (
    <>
      <Encabezado
        ceja="Búsquedas · lo que busca cada cliente"
        titulo="Buscá menos,"
        acento="elegí más."
        bajada="Cargás lo que busca cada cliente y el agente revisa todos los días las alertas de los portales y la red de colegas. Te avisa solo lo que coincide, te dice por qué y te deja el mensaje listo para mandar."
        derecha={
          <div className="tarjeta grid grid-cols-3 divide-x divide-line text-center">
            {[
              [resumenBusquedas.revisados, 'avisos revisados hoy'],
              [resumenBusquedas.duplicados, 'duplicados'],
              [resumenBusquedas.descartados, 'no cumplían'],
            ].map(([v, t]) => (
              <div key={t} className="px-4 py-3">
                <p className="num text-[28px] leading-none font-medium">{v}</p>
                <p className="mt-1 text-[12px] leading-tight text-ink-3">{t}</p>
              </div>
            ))}
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_300px]">
        {/* Clientes */}
        <nav aria-label="Búsquedas activas" className="space-y-2">
          <p className="ceja mb-2">{busquedas.length} búsquedas activas</p>
          {busquedas.map((b) => {
            const activa = b.id === actualId
            const nuevas = b.avisos.filter((a) => a.llego.startsWith('hoy')).length
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setActualId(b.id)}
                aria-current={activa ? 'true' : undefined}
                className={`press relative w-full rounded-2xl border p-4 text-left ${activa ? 'border-marca/50 bg-marca-soft/60' : 'border-line bg-surface hover:bg-sunken'}`}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-[15px] font-medium">{b.cliente}</span>
                  {nuevas > 0 && (
                    <span className="num rounded-full bg-marca px-1.5 text-[11px] leading-5 text-sobre-boton">
                      {nuevas}
                      <span className="sr-only"> nuevas hoy</span>
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-[13px] text-ink-3">{b.resumen}</span>
                <span className="mt-2 block text-[12px] text-ink-3">Buscando {b.desde}</span>
              </button>
            )
          })}
        </nav>

        {/* Búsqueda seleccionada */}
        <section aria-labelledby="busqueda-actual" className="min-w-0">
          <div className="tarjeta p-5">
            <h2 id="busqueda-actual" className="titular text-[30px]">
              {actual.cliente}
            </h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {actual.criterios.map((c) => (
                <span
                  key={c.texto}
                  className={`inline-flex h-7 items-center rounded-full px-2.5 text-[13px] ${c.tipo === 'obligatorio' ? 'bg-sunken font-medium text-ink' : 'border border-dashed border-line-2 text-ink-2'}`}
                >
                  {c.texto}
                </span>
              ))}
            </div>
            <p className="mt-3 flex items-start gap-1.5 text-[12px] text-ink-3">
              <BellRing size={13} aria-hidden="true" className="mt-0.5 shrink-0" />
              <span>Alertas activas en {actual.alertas.join(', ')} · línea llena: obligatorio · punteada: deseable</span>
            </p>
          </div>

          <h3 className="mt-6 mb-3 text-[15px] font-medium">
            Lo que encontró <span className="text-[13px] font-normal text-ink-3">· ordenado por afinidad · {actual.descartadosPorCriterio} descartados por no cumplir lo obligatorio</span>
          </h3>
          <motion.ul layout className="space-y-3">
            <AnimatePresence initial={false}>
              {ordenados.map((a) => (
                <TarjetaAviso key={a.id} a={a} voto={votos[a.id]} onVoto={(v) => setVotos((s) => ({ ...s, [a.id]: v }))} />
              ))}
            </AnimatePresence>
          </motion.ul>

          {/* Borrador */}
          <div className="tarjeta mt-6 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-[16px] font-medium">
                <PenLine size={17} aria-hidden="true" className="text-ia" />
                Mensaje para {actual.contacto}
              </h3>
              <span className="text-[12px] text-ink-3">Borrador · lo mandás vos desde tu WhatsApp</span>
            </div>
            {elegidos.length === 0 ? (
              <p className="mt-3 rounded-xl bg-sunken p-4 text-[14px] text-ink-2">Marcá "Me sirve" en las propiedades que quieras mandarle y el mensaje se arma solo, escrito como escribís vos.</p>
            ) : (
              <>
                <label htmlFor="borrador" className="sr-only">
                  Borrador del mensaje
                </label>
                <textarea
                  id="borrador"
                  name="borrador"
                  rows={12}
                  value={borrador}
                  onChange={(e) => setEditado((s) => ({ ...s, [clave]: e.target.value }))}
                  className="mt-3 block w-full resize-y rounded-xl border border-line bg-sunken p-4 text-[15px] leading-relaxed text-ink outline-none focus:border-ia/60"
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="flex flex-wrap gap-1.5">
                    {estiloAsesora.map((e) => (
                      <Chip key={e} tono="ia">
                        {e}
                      </Chip>
                    ))}
                  </p>
                  <div className="flex gap-2">
                    <Boton variante="secundario" icono={copiado ? Check : Copy} onClick={copiar}>
                      {copiado ? 'Copiado' : 'Copiar'}
                    </Boton>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(borrador)}`}
                      target="_blank"
                      rel="noopener"
                      className="press inline-flex min-h-11 items-center gap-2 rounded-full bg-boton px-4 text-[14px] font-medium text-sobre-boton hover:bg-boton-hover"
                    >
                      <MessageCircle size={16} aria-hidden="true" />
                      Abrir en WhatsApp
                      <span className="sr-only">(se abre en una pestaña nueva)</span>
                    </a>
                  </div>
                </div>
                <p role="status" className="sr-only">
                  {copiado ? 'Mensaje copiado' : ''}
                </p>
              </>
            )}
          </div>
        </section>

        {/* Columna derecha */}
        <aside className="space-y-4 lg:col-span-2 xl:col-span-1">
          <div className="tarjeta p-5">
            <h2 className="text-[16px] font-medium">Recordatorios</h2>
            <p className="text-[13px] text-ink-3">Los pedís por WhatsApp: "recordame llamar a Tomás el jueves".</p>
            <ul className="mt-3 divide-y divide-line">
              {recordatorios.map((r) => (
                <li key={r.texto} className="flex gap-3 py-2.5">
                  <span className="num w-[68px] shrink-0 text-[12px] text-ink-3">{r.cuando}</span>
                  <span className="min-w-0">
                    <span className="block text-[14px] leading-snug text-ink">{r.texto}</span>
                    <span className="text-[12px] text-ink-3">{r.origen}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="tarjeta p-5">
            <h2 className="text-[16px] font-medium">Cómo llegan los avisos</h2>
            <ol className="mt-3 space-y-3 text-[14px] text-ink-2">
              <li className="flex gap-2.5">
                <BellRing size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-ink-3" />
                Creás una alerta en cada portal con los filtros que te arma el agente.
              </li>
              <li className="flex gap-2.5">
                <Mail size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-ink-3" />
                Los portales mandan los avisos nuevos a tu casilla de búsquedas.
              </li>
              <li className="flex gap-2.5">
                <Inbox size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-ink-3" />
                El agente los junta, saca duplicados y te avisa solo lo que coincide.
              </li>
            </ol>
            <p className="mt-3 text-[12px] text-ink-3">Sin robots que recorran portales: se usan las alertas que cualquier usuario puede crear.</p>
          </div>
        </aside>
      </div>
    </>
  )
}
