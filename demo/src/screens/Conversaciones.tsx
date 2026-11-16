import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowUp, CalendarCheck2, CalendarPlus, Hand, PauseCircle, Sparkles } from 'lucide-react'
import { ChatWhatsApp } from '../components/ChatWhatsApp'
import { Boton, ChipTemperatura, Encabezado, SelloAgente } from '../components/ui'
import { conversaciones, nombreAgente, type Conversacion, type Mensaje } from '../data/demo'
import { crearAlmacen } from '../lib/almacen'
import { agendarVisita, proximosDias } from '../lib/tareas'

const almacenTomadas = crearAlmacen<Record<string, boolean>>('tomadas', () => ({}))
const almacenRespuestas = crearAlmacen<Record<string, Mensaje[]>>('respuestas', () => ({}))
const almacenAgendadas = crearAlmacen<Record<string, string>>('agendadas', () => ({}))

function AgendarVisita({ conversacion }: { conversacion: Conversacion }) {
  const dias = proximosDias()
  const [abierto, setAbierto] = useState(false)
  const [lugar, setLugar] = useState('')
  const [dia, setDia] = useState(1)
  const [hora, setHora] = useState('11:00')

  function guardar(e: FormEvent) {
    e.preventDefault()
    if (!lugar.trim()) return
    const etiqueta = dias[dia].etiqueta
    agendarVisita(`Visita con ${conversacion.nombre} en ${lugar.trim()}`, dia, etiqueta, hora)
    almacenAgendadas.cambiar((a) => ({ ...a, [conversacion.id]: `Visita ${etiqueta.toLowerCase()} ${hora} · ${lugar.trim()}` }))
    setAbierto(false)
    setLugar('')
  }

  if (!abierto)
    return (
      <Boton variante="secundario" icono={CalendarPlus} onClick={() => setAbierto(true)} className="mt-3 w-full">
        Agendar visita
      </Boton>
    )
  return (
    <form onSubmit={guardar} className="mt-3 space-y-3 rounded-xl border border-line p-3">
      <label className="block">
        <span className="mb-1 block text-[13px] font-medium">Propiedad</span>
        <input autoComplete="off" name="lugar" value={lugar} onChange={(e) => setLugar(e.target.value)} placeholder="Cabildo 2340 4.º B…" className="block min-h-11 w-full rounded-xl border border-line-2 bg-surface px-3 text-[16px] outline-none placeholder:text-ink-3 focus:border-marca" />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="mb-1 block text-[13px] font-medium">Día</span>
          <select name="dia" value={dia} onChange={(e) => setDia(Number(e.target.value))} className="block min-h-11 w-full rounded-xl border border-line-2 bg-surface px-3 text-[16px] outline-none focus:border-marca">
            {dias.map((d) => (
              <option key={d.dia} value={d.dia}>
                {d.etiqueta}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[13px] font-medium">Hora</span>
          <input type="time" name="hora" value={hora} onChange={(e) => setHora(e.target.value)} className="block min-h-11 w-full rounded-xl border border-line-2 bg-surface px-3 text-[16px] outline-none focus:border-marca" />
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <Boton variante="fantasma" onClick={() => setAbierto(false)}>
          Cancelar
        </Boton>
        <Boton type="submit" icono={CalendarCheck2} disabled={!lugar.trim()}>
          Agendar
        </Boton>
      </div>
    </form>
  )
}

const filtros = [
  { id: 'todas', etiqueta: 'Todas', pasa: () => true },
  { id: 'calientes', etiqueta: 'Calientes', pasa: (c: Conversacion) => c.temperatura === 'caliente' },
  { id: 'asesor', etiqueta: 'Con asesor', pasa: (c: Conversacion) => c.temperatura === 'derivado' },
] as const

export function Conversaciones({ param }: { param: string | null }) {
  const [filtro, setFiltro] = useState<(typeof filtros)[number]['id']>('todas')
  const tomadas = almacenTomadas.usar()
  const respuestas = almacenRespuestas.usar()
  const agendadas = almacenAgendadas.usar()
  const [texto, setTexto] = useState('')
  const seleccion = conversaciones.find((c) => c.id === param) ?? null
  const actual = seleccion ?? conversaciones[0]
  const lista = conversaciones.filter(filtros.find((f) => f.id === filtro)!.pasa)
  const tomada = tomadas[actual.id]
  const mensajes = [...actual.mensajes, ...(respuestas[actual.id] ?? [])]

  function responder(e: FormEvent) {
    e.preventDefault()
    if (!texto.trim()) return
    const ahora = new Date()
    const hora = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`
    almacenRespuestas.cambiar((r) => ({ ...r, [actual.id]: [...(r[actual.id] ?? []), { de: 'asesor', texto: texto.trim(), hora }] }))
    setTexto('')
  }

  return (
    <>
      <Encabezado
        ceja="WhatsApp de la inmobiliaria"
        titulo="Clientes"
      />

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)_300px]">
        {/* Lista */}
        <section aria-label="Conversaciones" className={`tarjeta overflow-hidden ${seleccion ? 'hidden lg:block' : ''}`}>
          <div className="border-b border-line p-2">
            <div role="radiogroup" aria-label="Filtrar" className="grid grid-cols-3 gap-1 rounded-xl bg-sunken p-1">
              {filtros.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={filtro === f.id}
                  onClick={() => setFiltro(f.id)}
                  className={`press min-h-9 rounded-lg text-[13px] font-medium ${filtro === f.id ? 'bg-elevado text-ink shadow-(--shadow-card)' : 'text-ink-3 hover:text-ink'}`}
                >
                  {f.etiqueta}
                </button>
              ))}
            </div>
          </div>
          <ul className="divide-y divide-line">
            {lista.map((c) => {
              const activa = c.id === actual.id
              return (
                <li key={c.id}>
                  <a
                    href={`#/conversaciones?id=${c.id}`}
                    aria-current={activa ? 'true' : undefined}
                    className={`relative flex gap-3 px-4 py-3.5 ${activa ? 'bg-marca-soft/60' : 'hover-fila'}`}
                  >
                    {activa && <span aria-hidden="true" className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-marca" />}
                    <span aria-hidden="true" className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-sunken text-[13px] font-semibold text-ink-2">
                      {c.nombre
                        .split(' ')
                        .map((p) => p[0])
                        .join('')}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-[15px] font-medium">{c.nombre}</span>
                        <span className="num shrink-0 text-[12px] text-ink-3">{c.hora}</span>
                      </span>
                      <span className="block truncate text-[13px] text-ink-3">{c.ultima}</span>
                      <span className="mt-1.5 flex items-center gap-1.5">
                        <ChipTemperatura t={c.temperatura} />
                        <span className="truncate text-[12px] text-ink-3">{c.tipo}</span>
                        {c.noLeidos > 0 && (
                          <span className="num ml-auto rounded-full bg-marca px-1.5 text-[11px] leading-5 text-sobre-boton">
                            {c.noLeidos}
                            <span className="sr-only"> sin leer</span>
                          </span>
                        )}
                      </span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Chat */}
        <section aria-label={`Conversación con ${actual.nombre}`} className={`min-w-0 ${seleccion ? '' : 'hidden lg:block'}`}>
          <a href="#/conversaciones" className="press mb-3 inline-flex min-h-11 items-center gap-1.5 rounded-full pr-3 text-[14px] text-ink-2 lg:hidden">
            <ArrowLeft size={16} aria-hidden="true" />
            Todas las conversaciones
          </a>
          <div className="tarjeta overflow-hidden p-2">
            <ChatWhatsApp key={actual.id} mensajes={mensajes} contacto={actual.nombre} marco={false} alto="h-[560px]" />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
            {tomada ? (
              <p className="flex items-center gap-2 text-[14px] text-ink-2">
                <PauseCircle size={16} aria-hidden="true" className="text-warn" />
                Respondés vos. El agente quedó en pausa en esta conversación.
              </p>
            ) : (
              <p className="flex items-center gap-2 text-[14px] text-ink-2">
                <Sparkles size={16} aria-hidden="true" className="text-ia" />
                Atiende {nombreAgente(actual.agente)}
              </p>
            )}
            <Boton variante={tomada ? 'secundario' : 'primario'} icono={Hand} onClick={() => almacenTomadas.cambiar((t) => ({ ...t, [actual.id]: !t[actual.id] }))}>
              {tomada ? 'Devolver al agente' : 'Tomar la conversación'}
            </Boton>
          </div>
          {tomada && (
            <form onSubmit={responder} className="mt-3 flex gap-2">
              <label htmlFor="respuesta" className="sr-only">
                Tu respuesta a {actual.nombre}
              </label>
              <input
                id="respuesta"
                name="respuesta"
                autoComplete="off"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder={`Escribile a ${actual.nombre.split(' ')[0]}…`}
                className="min-h-12 min-w-0 flex-1 rounded-full border border-line-2 bg-surface px-4 text-[16px] outline-none placeholder:text-ink-3 focus:border-marca"
              />
              <button type="submit" aria-label="Enviar" disabled={!texto.trim()} className="press inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-boton text-sobre-boton hover:bg-boton-hover disabled:opacity-40">
                <ArrowUp size={18} aria-hidden="true" />
              </button>
            </form>
          )}
        </section>

        {/* Ficha */}
        <aside aria-label="Ficha del cliente" className={`tarjeta h-fit p-5 lg:col-span-2 xl:col-span-1 ${seleccion ? '' : 'hidden lg:block'}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="ceja">{actual.tipo}</p>
              <h2 className="mt-1 text-[20px] font-medium">{actual.nombre}</h2>
            </div>
            <ChipTemperatura t={actual.temperatura} />
          </div>
          <p className="mt-2 text-[14px] text-ink-2">{actual.resumen}</p>

          <div className="mt-5 rounded-xl bg-marca-soft p-3.5">
            <p className="ceja flex items-center gap-1.5 text-marca">
              <CalendarCheck2 size={13} aria-hidden="true" />
              Próximo paso
            </p>
            <p className="mt-1 text-[14px] font-medium text-ink">{agendadas[actual.id] ?? actual.proximo}</p>
          </div>
          <AgendarVisita key={actual.id} conversacion={actual} />

          <h3 className="ceja mt-6 mb-2">Calificación</h3>
          <dl className="divide-y divide-line text-[14px]">
            {actual.calificacion.map((c) => (
              <div key={c.campo} className="grid grid-cols-[108px_1fr] gap-3 py-2">
                <dt className="text-ink-3">{c.campo}</dt>
                <dd className="text-ink">{c.valor}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 border-t border-line pt-4">
            <SelloAgente agente={actual.agente} nombre={`Cargado por ${nombreAgente(actual.agente)}`} />
            <p className="mt-2 text-[13px] text-ink-3">
              Asesor: <span className="text-ink-2">{actual.asesor}</span> · también quedó en el CRM.
            </p>
          </div>
        </aside>
      </div>
    </>
  )
}
