import { ArrowUpRight, CalendarClock, Clock3, MapPin, MessageSquareText, MoonStar, UsersRound, type LucideIcon } from 'lucide-react'
import { ChatWhatsApp } from '../components/ChatWhatsApp'
import { ConsultasPorHora, Embudo } from '../components/Graficos'
import { Encabezado, Enlace, iconoAgente } from '../components/ui'
import { actividadNoche, consultasPorHora, conversaciones, embudo, fechaDemo, horarioComercial, kpis, nombreAgente, usuaria, visitasHoy } from '../data/demo'

const iconoKpi: Record<(typeof kpis)[number]['id'], LucideIcon> = {
  respuesta: Clock3,
  fuera: MoonStar,
  calificados: UsersRound,
  visitas: CalendarClock,
}

const retraso = (i: number) => ({ animationDelay: `${80 + i * 70}ms` })

export function Hoy() {
  const lucia = conversaciones[0]

  return (
    <>
      <Encabezado
        ceja={fechaDemo}
        titulo={`Buen día, ${usuaria.nombre}.`}
        bajada={
          <>
            Mientras dormías, tus agentes atendieron <strong className="font-medium text-ink">9 consultas</strong>, agendaron <strong className="font-medium text-ink">2 visitas</strong> y una tasación. Nadie se quedó sin respuesta.
          </>
        }
      />

      {/* KPIs */}
      <section aria-label="Resultados de la semana" className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k, i) => {
          const Icono = iconoKpi[k.id]
          return (
            <div key={k.id} className="tarjeta animate-entrar p-4 sm:p-5" style={retraso(i)}>
              <p className="ceja flex items-center gap-1.5">
                <Icono size={13} aria-hidden="true" />
                {k.etiqueta}
              </p>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="num text-[36px] leading-none font-medium tracking-tight sm:text-[42px]">{k.valor}</span>
                {k.unidad && <span className="num text-[16px] text-ink-3">{k.unidad}</span>}
              </p>
              <p className="mt-2 text-[13px] text-ink-2">{k.detalle}</p>
              <p className="text-[12px] text-ink-3">{k.delta}</p>
            </div>
          )
        })}
      </section>

      {/* Anoche */}
      <section aria-labelledby="anoche" className="tarjeta animate-entrar mb-8 overflow-hidden" style={retraso(4)}>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="p-5 sm:p-7">
            <p className="ceja">Entre las 23:00 y las 08:00</p>
            <h2 id="anoche" className="titular mt-2 text-[34px]">
              Lo que hicieron <em className="text-marca">anoche</em>
            </h2>
            <ol className="relative mt-6 space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[15px] before:w-px before:bg-line">
              {actividadNoche.map((a) => {
                const Icono = iconoAgente[a.agente]
                return (
                  <li key={a.hora} className="relative grid grid-cols-[32px_1fr] gap-3">
                    <span className="relative z-10 inline-flex size-8 items-center justify-center rounded-lg bg-ia-soft text-ia ring-4 ring-surface">
                      <Icono size={15} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="flex flex-wrap items-baseline gap-x-2 text-[13px]">
                        <span className="num text-ink-3">{a.hora}</span>
                        <span className="font-medium text-ink-2">{nombreAgente(a.agente)}</span>
                      </p>
                      <p className="mt-0.5 text-[15px] leading-snug text-ink">
                        {a.texto}
                        {a.enlace && (
                          <a href={a.enlace} className="ml-1.5 inline-flex items-center gap-0.5 text-[13px] font-medium text-marca underline-offset-4 hover:underline">
                            Ver
                            <ArrowUpRight size={13} aria-hidden="true" />
                          </a>
                        )}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
          <div className="relative border-t border-line bg-sunken/60 p-5 lg:border-t-0 lg:border-l">
            <p className="ceja mb-3 flex items-center gap-1.5">
              <MessageSquareText size={13} aria-hidden="true" />
              23:14 · en vivo
            </p>
            <ChatWhatsApp mensajes={lucia.mensajes} contacto={lucia.nombre} reproducir alto="h-[520px]" />
          </div>
        </div>
      </section>

      {/* Gráficos */}
      <section aria-label="Actividad" className="mb-8 grid gap-4 lg:grid-cols-2">
        <div className="tarjeta animate-entrar p-5 sm:p-6" style={retraso(5)}>
          <ConsultasPorHora datos={consultasPorHora} desde={horarioComercial.desde} hasta={horarioComercial.hasta} />
          <p className="mt-4 text-[13px] text-ink-3">El 41 % de las consultas llega cuando la oficina está cerrada. Antes esperaban hasta el día siguiente.</p>
        </div>
        <div className="tarjeta animate-entrar p-5 sm:p-6" style={retraso(6)}>
          <Embudo etapas={embudo} />
        </div>
      </section>

      {/* Visitas */}
      <section aria-labelledby="visitas" className="animate-entrar" style={retraso(7)}>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 id="visitas" className="titular text-[30px]">
            Visitas de hoy
          </h2>
          <Enlace href="#/conversaciones">Ver clientes</Enlace>
        </div>
        <ul className="tarjeta divide-y divide-line">
          {visitasHoy.map((v) => (
            <li key={v.hora} className="hover-fila grid grid-cols-[56px_1fr] items-center gap-4 px-4 py-3.5 sm:grid-cols-[64px_1fr_auto] sm:px-5">
              <span className="num text-[17px] text-ink">{v.hora}</span>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium">{v.cliente}</p>
                <p className="flex items-center gap-1 truncate text-[13px] text-ink-3">
                  <MapPin size={13} aria-hidden="true" className="shrink-0" />
                  {v.direccion} · {v.tipo} · {v.asesor}
                </p>
              </div>
              <span className={`col-start-2 justify-self-start rounded-full px-2 py-0.5 text-[12px] font-medium sm:col-start-auto ${v.origen.includes('agente') ? 'bg-ia-soft text-ia' : 'bg-sunken text-ink-3'}`}>
                {v.origen}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
