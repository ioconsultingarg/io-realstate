import { Chip, Encabezado, iconoAgente } from '../components/ui'
import { agentes } from '../data/demo'
import { crearAlmacen } from '../lib/almacen'

export const almacenAgentes = crearAlmacen<Record<string, boolean>>('agentes', () => Object.fromEntries(agentes.map((a) => [a.id, a.estado === 'activo'])))

export function Agentes() {
  const activos = almacenAgentes.usar()
  const encendidos = Object.values(activos).filter(Boolean).length

  return (
    <>
      <Encabezado
        ceja="Agentes · uno por departamento"
        titulo="Tu equipo,"
        acento="sin sueldos extra."
        bajada="Activá los que tu operación necesita. Todos comparten el mismo cerebro: tu cartera, tus zonas, tus precios y tu forma de hablar."
        derecha={
          <div className="tarjeta flex items-center gap-4 px-5 py-4">
            <span className="num text-[40px] leading-none font-medium">{encendidos}</span>
            <span className="text-[13px] leading-tight text-ink-2">
              agentes
              <br />
              trabajando
            </span>
          </div>
        }
      />

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {agentes.map((a, i) => {
          const Icono = iconoAgente[a.id]
          const proximo = a.estado === 'proximamente'
          const on = activos[a.id]
          const idTitulo = `agente-${a.id}`
          return (
            <li key={a.id} className={`tarjeta animate-entrar flex flex-col p-5 ${proximo ? 'bg-transparent' : ''}`} style={{ animationDelay: `${60 + i * 40}ms` }}>
              <div className="flex items-start justify-between gap-3">
                <span className={`inline-flex size-11 items-center justify-center rounded-xl ${on ? 'bg-ia-soft text-ia' : 'bg-sunken text-ink-3'}`}>
                  <Icono size={20} aria-hidden="true" />
                </span>
                {proximo ? (
                  <Chip>Próximamente</Chip>
                ) : (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-labelledby={idTitulo}
                    onClick={() => almacenAgentes.cambiar((s) => ({ ...s, [a.id]: !s[a.id] }))}
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 ${on ? 'bg-ok' : 'bg-line-2'}`}
                  >
                    <span className="sr-only">{on ? 'Encendido' : 'Apagado'}</span>
                    <span aria-hidden="true" className={`size-5 rounded-full bg-white shadow transition-transform duration-200 ease-[var(--ease-fluid)] ${on ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                )}
              </div>
              <h2 id={idTitulo} className="mt-4 text-[18px] font-medium">
                {a.nombre}
              </h2>
              <p className="mt-1.5 flex-1 text-[14px] leading-snug text-ink-2">{a.hace}</p>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3 text-[12px]">
                <span className="text-ink-3">
                  {a.cara === 'Cliente' ? 'Atiende clientes' : a.cara === 'Interno' ? 'Trabaja para el equipo' : 'Clientes y equipo'}
                </span>
                <span className="num text-ink-2">{on ? a.semana : proximo ? '—' : 'en pausa'}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}
