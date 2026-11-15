import { useState } from 'react'
import { ArrowLeft, CalendarCheck2, Hand, PauseCircle, Sparkles } from 'lucide-react'
import { ChatWhatsApp } from '../components/ChatWhatsApp'
import { Boton, ChipTemperatura, Encabezado, SelloAgente } from '../components/ui'
import { conversaciones, nombreAgente, type Conversacion } from '../data/demo'

const filtros = [
  { id: 'todas', etiqueta: 'Todas', pasa: () => true },
  { id: 'calientes', etiqueta: 'Calientes', pasa: (c: Conversacion) => c.temperatura === 'caliente' },
  { id: 'asesor', etiqueta: 'Con asesor', pasa: (c: Conversacion) => c.temperatura === 'derivado' },
] as const

export function Conversaciones({ param }: { param: string | null }) {
  const [filtro, setFiltro] = useState<(typeof filtros)[number]['id']>('todas')
  const [tomadas, setTomadas] = useState<Record<string, boolean>>({})
  const seleccion = conversaciones.find((c) => c.id === param) ?? null
  const actual = seleccion ?? conversaciones[0]
  const lista = conversaciones.filter(filtros.find((f) => f.id === filtro)!.pasa)
  const tomada = tomadas[actual.id]

  return (
    <>
      <Encabezado
        ceja="Clientes · WhatsApp de la inmobiliaria"
        titulo="Cada consulta,"
        acento="respondida."
        bajada="El agente atiende con tu cartera real, califica y agenda. Lo que necesita criterio humano —precio, ofertas, reclamos— pasa al asesor con el resumen hecho."
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
            <ChatWhatsApp key={actual.id} mensajes={actual.mensajes} contacto={actual.nombre} marco={false} alto="h-[560px]" />
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
            <Boton variante={tomada ? 'secundario' : 'primario'} icono={Hand} onClick={() => setTomadas((t) => ({ ...t, [actual.id]: !t[actual.id] }))}>
              {tomada ? 'Devolver al agente' : 'Tomar la conversación'}
            </Boton>
          </div>
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
            <p className="mt-1 text-[14px] font-medium text-ink">{actual.proximo}</p>
          </div>

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
