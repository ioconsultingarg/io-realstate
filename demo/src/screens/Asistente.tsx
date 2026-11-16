import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUp, BookOpen, Check, FileText, Hash, LoaderCircle, Lock, Pencil, ShieldCheck, Sparkles } from 'lucide-react'
import { EditorTasacion } from '../components/EditorTasacion'
import { InformeACM } from '../components/InformeACM'
import { ComparablesUSDm2 } from '../components/Graficos'
import { Sheet } from '../components/Sheet'
import { Boton, Chip, Encabezado, iconoAgente, SelloAgente } from '../components/ui'
import { competencia, inmobiliaria, nombreAgente, pedidosEjemplo, roleplay } from '../data/demo'
import { calcularACM, usd } from '../lib/acm'
import { almacenTasacion } from '../lib/tasacion'
import { almacenCartera } from '../lib/cartera'
import { almacenCerebro } from '../lib/cerebro'
import { almacenAvisos, almacenBusquedas, normalizar } from '../lib/busqueda'
import { agregarRecordatorio, HOY_DEMO, leerRecordatorio } from '../lib/tareas'

type Pedido = (typeof pedidosEjemplo)[number]

const pasos: Record<Pedido['id'], string[]> = {
  tasacion: ['Leyendo la ficha del inmueble en el cerebro', 'Buscando PH comparables vendidos y publicados', 'Calculando el rango y armando el informe con tu marca'],
  competencia: ['Leyendo tus zonas y tu propuesta de valor', 'Relevando anuncios activos de la competencia', 'Agrupando ángulos y buscando espacios libres'],
  roleplay: ['Leyendo tus objeciones frecuentes', 'Armando el personaje del propietario', 'Preparando la devolución con tus criterios'],
}

const diasLargos: Record<string, string> = { Hoy: 'hoy', Mañana: 'mañana', Lun: 'el lunes', Mar: 'el martes', Mié: 'el miércoles', Jue: 'el jueves', Vie: 'el viernes', Sáb: 'el sábado', Dom: 'el domingo' }
const cuandoLargo = (c: string) => {
  const [dia, hora] = c.split(' ')
  return `${diasLargos[dia] ?? dia}${hora ? ` a las ${hora}` : ''}`
}

type Turno =
  | { tipo: 'pedido'; pedido: Pedido; escrito?: string; listo: boolean }
  | { tipo: 'nota'; escrito: string; respuesta: string; enlace?: { href: string; texto: string } }

export function Asistente() {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [texto, setTexto] = useState('')
  const [aviso, setAviso] = useState<string | null>(null)
  const [panel, setPanel] = useState<'informe' | 'editor' | null>(null)
  const cartera = almacenCartera.usar()
  const cerebro = almacenCerebro.usar()
  const reducir = useReducedMotion()
  const fin = useRef<HTMLDivElement>(null)
  const trabajando = turnos.some((t) => t.tipo === 'pedido' && !t.listo)

  function pedir(p: Pedido, escrito?: string) {
    if (trabajando) return
    setAviso(null)
    setTexto('')
    setTurnos((t) => [...t, { tipo: 'pedido', pedido: p, escrito, listo: Boolean(reducir) }])
  }

  function nota(escrito: string, respuesta: string, enlace?: { href: string; texto: string }) {
    setAviso(null)
    setTexto('')
    setTurnos((t) => [...t, { tipo: 'nota', escrito, respuesta, enlace }])
  }

  useEffect(() => {
    const pendiente = turnos.findIndex((t) => t.tipo === 'pedido' && !t.listo)
    if (pendiente < 0) return
    const t = setTimeout(() => setTurnos((ts) => ts.map((x, i) => (i === pendiente && x.tipo === 'pedido' ? { ...x, listo: true } : x))), 3300)
    return () => clearTimeout(t)
  }, [turnos])

  useEffect(() => {
    if (turnos.length) fin.current?.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'end' })
  }, [turnos, reducir])

  function enviar() {
    const escrito = texto.trim()
    if (!escrito || trabajando) return
    const t = normalizar(escrito)

    if (/^(recordame|recordarme|acordate|anotame|anota|agendame|agenda)(\s|$)/.test(t)) {
      const r = leerRecordatorio(escrito, HOY_DEMO)
      if (r && agregarRecordatorio(escrito)) nota(escrito, `Listo. Te lo recuerdo ${cuandoLargo(r.cuando)}: ${r.texto.charAt(0).toLowerCase() + r.texto.slice(1)}.`, { href: '#/busquedas', texto: 'Ver recordatorios' })
      else setAviso('No entendí qué tengo que recordarte. Probá con "recordame llamar a Tomás el jueves 10".')
      return
    }
    if (/tasa|acm|cuanto vale|valor de/.test(t)) return pedir(pedidosEjemplo.find((x) => x.id === 'tasacion')!, escrito)
    if (/competen/.test(t)) return pedir(pedidosEjemplo.find((x) => x.id === 'competencia')!, escrito)
    if (/objeci|practic|roleplay/.test(t)) return pedir(pedidosEjemplo.find((x) => x.id === 'roleplay')!, escrito)
    if (/busqu|busca|compradores?/.test(t)) {
      const bs = almacenBusquedas.leer()
      const nuevos = almacenAvisos.leer().filter((a) => a.llego.startsWith('hoy')).length
      return nota(escrito, `Tenés ${bs.length} búsquedas activas (${bs.map((b) => b.cliente).join(', ')}) y ${nuevos} avisos de hoy para revisar.`, { href: '#/busquedas', texto: 'Abrir búsquedas' })
    }
    nota(escrito, 'Puedo armar una tasación ("tasación de…"), anotar recordatorios ("recordame…"), analizar la competencia de tu zona y practicar objeciones. Las búsquedas de compradores se manejan en Búsquedas.')
  }

  return (
    <>
      <Encabezado
        ceja="Pedidos al equipo"
        titulo="Asistente"
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section aria-label="Conversación con el asistente" className="min-w-0">
          {/* pedidos de ejemplo */}
          <div className="grid gap-3 sm:grid-cols-3">
            {pedidosEjemplo.map((p) => {
              const Icono = iconoAgente[p.agente]
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => pedir(p)}
                  disabled={trabajando}
                  className="press tarjeta group flex flex-col gap-3 p-4 text-left hover:border-line-2 disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    <span className="inline-flex size-8 items-center justify-center rounded-lg bg-ia-soft text-ia">
                      <Icono size={16} aria-hidden="true" />
                    </span>
                    <span className="num text-[12px] text-ink-3">#{p.etiqueta.toLowerCase()}</span>
                  </span>
                  <span className="text-[14px] leading-snug text-ink">{p.texto}</span>
                </button>
              )
            })}
          </div>

          {/* hilo */}
          <div className="mt-6 space-y-6 scroll-mb-40">
            <AnimatePresence initial={false}>
              {turnos.map((t, i) => (
                <motion.div key={i} initial={reducir ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} className="space-y-3">
                  <div className="flex justify-end">
                    <p className="max-w-[85%] rounded-2xl rounded-br-md bg-boton px-4 py-3 text-[15px] leading-snug text-sobre-boton">
                      {t.tipo === 'pedido' && !t.escrito && <span className="num mr-1.5 opacity-60">#{t.pedido.etiqueta.toLowerCase()}</span>}
                      {t.tipo === 'pedido' ? (t.escrito ?? t.pedido.texto) : t.escrito}
                    </p>
                  </div>
                  {t.tipo === 'pedido' ? (
                    <div className="tarjeta p-5 sm:p-6">
                      <SelloAgente agente={t.pedido.agente} nombre={`Agente de ${nombreAgente(t.pedido.agente).toLowerCase()}`} />
                      {t.listo ? <Resultado id={t.pedido.id} onPanel={setPanel} /> : <Trabajando pasos={pasos[t.pedido.id]} />}
                    </div>
                  ) : (
                    <div className="tarjeta p-5">
                      <SelloAgente agente="direccion" nombre="Asistente" />
                      <p className="mt-3 text-[15px] leading-relaxed text-ink">{t.respuesta}</p>
                      {t.enlace && (
                        <a href={t.enlace.href} className="mt-3 inline-flex min-h-10 items-center gap-1 text-[14px] font-medium text-marca underline-offset-4 hover:underline">
                          {t.enlace.texto} →
                        </a>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={fin} />
          </div>

          {/* entrada */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              enviar()
            }}
            className="sticky bottom-20 z-20 mt-6 md:bottom-4"
          >
            <div className="rounded-[22px] border border-line-2 bg-surface p-2 shadow-(--shadow-float) focus-within:border-ia/60">
              <label htmlFor="pedido" className="sr-only">
                Pedile algo a tu equipo
              </label>
              <textarea
                id="pedido"
                name="pedido"
                autoComplete="off"
                rows={1}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    enviar()
                  }
                }}
                placeholder="Pedile algo a tu equipo… por ejemplo, #tasación de Ugarte 1856"
                className="block max-h-40 min-h-12 w-full resize-none bg-transparent px-3 py-2.5 text-[16px] text-ink outline-none placeholder:text-ink-3"
              />
              <div className="flex items-center justify-between gap-2 px-1">
                <span className="inline-flex items-center gap-1 text-[12px] text-ink-3">
                  <Hash size={13} aria-hidden="true" />
                  tasación · recordatorios · competencia · objeciones
                </span>
                <button
                  type="submit"
                  aria-label="Enviar pedido"
                  disabled={trabajando}
                  className="press inline-flex size-10 items-center justify-center rounded-full bg-boton text-sobre-boton hover:bg-boton-hover disabled:opacity-40"
                >
                  {trabajando ? <LoaderCircle size={18} aria-hidden="true" className="animate-spin" /> : <ArrowUp size={18} aria-hidden="true" />}
                </button>
              </div>
            </div>
            {aviso && (
              <p role="status" className="mt-2 rounded-xl bg-warn-soft px-3 py-2 text-[13px] text-warn">
                {aviso}
              </p>
            )}
          </form>
        </section>

        {/* reglas */}
        <aside className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
          <div className="tarjeta p-5">
            <h2 className="text-[16px] font-medium">Qué usa</h2>
            <ul className="mt-3 space-y-3 text-[14px]">
              {[
                ['Cerebro de la inmobiliaria', `${cerebro.filter((c) => c.estado === 'aprobado').length} de ${cerebro.length} temas aprobados`],
                ['Cartera', `${cartera.length} propiedades · ${cartera.filter((c) => c.estado === 'disponible').length} disponibles`],
                ['Cierres cargados', '212 operaciones desde 2021'],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full bg-ok" />
                  <span>
                    <span className="block text-ink">{t}</span>
                    <span className="text-[13px] text-ink-3">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="tarjeta p-5">
            <h2 className="text-[16px] font-medium">Reglas</h2>
            <ul className="mt-3 space-y-3 text-[14px] text-ink-2">
              <li className="flex gap-2.5">
                <ShieldCheck size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-ink-3" />
                Todo lo que sale hacia un cliente lo aprueba {inmobiliaria.corredor}.
              </li>
              <li className="flex gap-2.5">
                <BookOpen size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-ink-3" />
                Muestra de dónde sacó cada dato. Si no lo tiene, lo dice.
              </li>
              <li className="flex gap-2.5">
                <Lock size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-ink-3" />
                No promete precios ni cierra operaciones: eso es de la corredora.
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <Sheet abierto={panel !== null} onCerrar={() => setPanel(null)} titulo={panel === 'editor' ? 'Datos de la tasación' : 'Informe de tasación'} ancho="max-w-[860px]">
        {panel === 'editor' ? <EditorTasacion onVerInforme={() => setPanel('informe')} /> : <InformeACM onEditar={() => setPanel('editor')} />}
      </Sheet>
    </>
  )
}

function Trabajando({ pasos }: { pasos: string[] }) {
  const [paso, setPaso] = useState(0)
  useEffect(() => {
    if (paso >= pasos.length - 1) return
    const t = setTimeout(() => setPaso((p) => p + 1), 1100)
    return () => clearTimeout(t)
  }, [paso, pasos.length])
  return (
    <ol className="mt-4 space-y-2.5" aria-live="polite">
      {pasos.map((p, i) => (
        <li key={p} className={`flex items-center gap-2.5 text-[14px] transition-opacity duration-200 ${i > paso ? 'opacity-35' : ''}`}>
          {i < paso ? (
            <Check size={16} aria-hidden="true" className="text-ok" />
          ) : i === paso ? (
            <LoaderCircle size={16} aria-hidden="true" className="animate-spin text-ia" />
          ) : (
            <span aria-hidden="true" className="mx-[5px] size-1.5 rounded-full bg-ink-3" />
          )}
          <span className={i === paso ? 'text-ink' : 'text-ink-2'}>{p}</span>
        </li>
      ))}
    </ol>
  )
}

function ResultadoTasacion({ onPanel }: { onPanel: (p: 'informe' | 'editor') => void }) {
  const t = almacenTasacion.usar()
  const a = calcularACM(t.comparables, t.m2, t.ajuste)
  const validos = t.comparables.filter((c) => c.m2 > 0 && c.usd > 0)
  return (
    <div className="mt-4">
      {a.suficiente ? (
        <>
          <p className="text-[15px] leading-relaxed text-ink">
            Listo el borrador{t.cliente ? ` para ${t.cliente.split(' ')[0]}` : ''}. Con {a.cantidad} comparables, el valor sugerido para publicar {t.direccion ? `${t.direccion} ` : ''}es{' '}
            <strong className="num font-medium">{usd(a.sugerido)}</strong>, dentro de un rango de <span className="num">{usd(a.rango[0])}</span> a <span className="num">{a.rango[1].toLocaleString('es-AR')}</span>.
            {a.diasMediana ? (
              <>
                {' '}
                En la zona se vendieron en <span className="num">{a.diasMediana}</span> días de mediana.
              </>
            ) : null}
          </p>
          <div className="mt-5 rounded-xl border border-line p-4">
            <ComparablesUSDm2 comparables={validos} rango={[a.rango[0] / t.m2, a.rango[1] / t.m2]} sugerido={a.sugerido / t.m2} />
          </div>
        </>
      ) : (
        <p className="rounded-xl bg-warn-soft p-4 text-[15px] text-warn">Para darte un valor serio necesito al menos 3 comparables con m² y precio, y la superficie del inmueble. Cargalos y lo recalculo.</p>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Boton icono={FileText} onClick={() => onPanel('informe')} disabled={!a.suficiente}>
          Ver informe completo
        </Boton>
        <Boton variante="secundario" icono={Pencil} onClick={() => onPanel('editor')}>
          Editar inmueble y comparables
        </Boton>
        {a.suficiente && <Chip tono={t.aprobado ? 'ok' : 'warn'}>{t.aprobado ? 'Firmado · listo para enviar' : 'Falta tu firma antes de enviarlo'}</Chip>}
      </div>
    </div>
  )
}

function Resultado({ id, onPanel }: { id: Pedido['id']; onPanel: (p: 'informe' | 'editor') => void }) {
  if (id === 'tasacion') return <ResultadoTasacion onPanel={onPanel} />


  if (id === 'competencia') {
    const max = Math.max(...competencia.angulos.map((a) => a.competidores))
    return (
      <div className="mt-4 space-y-6">
        <ul className="grid gap-3 md:grid-cols-3">
          {competencia.hallazgos.map((h, i) => (
            <li key={h.titulo} className="rounded-xl bg-sunken p-4">
              <span className="num text-[12px] text-ink-3">0{i + 1}</span>
              <p className="mt-1 text-[15px] leading-snug font-medium">{h.titulo}</p>
              <p className="mt-1.5 text-[13px] leading-snug text-ink-2">{h.detalle}</p>
            </li>
          ))}
        </ul>
        <div>
          <h3 className="text-[15px] font-medium">Ángulos más repetidos</h3>
          <p className="text-[13px] text-ink-3">Cantidad de competidores (de 5) que usan cada ángulo</p>
          <ul className="mt-3 space-y-2">
            {competencia.angulos.map((a) => (
              <li key={a.angulo} className="grid grid-cols-[150px_1fr] items-center gap-3 text-[13px] sm:grid-cols-[180px_1fr]">
                <span className="text-ink-2">{a.angulo}</span>
                <span className="flex items-center gap-2.5">
                  {a.competidores > 0 ? <span className="block h-5 rounded-r-[4px] bg-serie-1" style={{ width: `${(a.competidores / max) * 70}%` }} /> : null}
                  <span className="num text-ink">{a.competidores}</span>
                  {a.competidores === 0 && <Chip tono="ok">espacio libre</Chip>}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[15px] font-medium">Piezas que te propongo</h3>
          <ul className="mt-2 space-y-2">
            {competencia.piezas.map((p) => (
              <li key={p} className="flex gap-2.5 text-[14px] text-ink">
                <Sparkles size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-ia" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="border-t border-line pt-3 text-[12px] text-ink-3">Fuentes: {competencia.fuentes}. Solo publicidad pública; no se copian textos ni fotos ajenas.</p>
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-5">
      <div className="space-y-2">
        {roleplay.intercambio.map((m, i) => (
          <p key={i} className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-[14px] leading-snug ${m.de === 'agente' ? 'bg-ia-soft text-ink' : 'ml-auto bg-sunken text-ink'}`}>
            <span className="ceja mb-0.5 block">{m.de === 'agente' ? 'Propietario (agente)' : 'Asesor'}</span>
            {m.texto}
          </p>
        ))}
      </div>
      <div>
        <h3 className="text-[15px] font-medium">Devolución</h3>
        <ul className="mt-2 divide-y divide-line">
          {roleplay.devolucion.map((d) => (
            <li key={d.criterio} className="flex items-center justify-between gap-4 py-2 text-[14px]">
              <span className="text-ink-2">{d.criterio}</span>
              <span className="flex items-center gap-1" aria-label={`${d.nota} de ${d.de}`}>
                {Array.from({ length: d.de }, (_, i) => (
                  <span key={i} aria-hidden="true" className={`h-2 w-5 rounded-full ${i < d.nota ? 'bg-marca' : 'bg-line'}`} />
                ))}
                <span className="num ml-1.5 text-[12px] text-ink-3">
                  {d.nota}/{d.de}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="rounded-xl bg-marca-soft p-4 text-[14px] leading-relaxed text-ink">{roleplay.sugerencia}</p>
    </div>
  )
}
