import { useId, useState, type ReactNode } from 'react'
import { Table2, BarChart3 } from 'lucide-react'
import type { Comparable } from '../data/demo'

/*
 * Gráficos de la demo, siguiendo la skill de dataviz: marcas finas con extremo redondeado de 4 px
 * apoyado en la base, 2 px de separación, leyenda cuando hay más de una serie, tooltip por marca,
 * grilla recesiva y vista en tabla. El texto usa tokens de texto, nunca el color de la serie.
 */

function Leyenda({ items }: { items: { color: string; etiqueta: string; forma?: 'barra' | 'punto' }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-2">
      {items.map((i) => (
        <li key={i.etiqueta} className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className={i.forma === 'punto' ? 'size-2.5 rounded-full' : 'h-2.5 w-3 rounded-[3px]'} style={{ background: i.color }} />
          {i.etiqueta}
        </li>
      ))}
    </ul>
  )
}

/** conmutador gráfico / tabla: la tabla es la vista accesible de los mismos datos */
function Vista({ titulo, leyenda, grafico, tabla }: { titulo: string; leyenda?: ReactNode; grafico: ReactNode; tabla: ReactNode }) {
  const [enTabla, setEnTabla] = useState(false)
  const id = useId()
  return (
    <figure aria-labelledby={id}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <figcaption id={id} className="text-[15px] font-medium text-ink">
          {titulo}
        </figcaption>
        <div className="flex items-center gap-3">
          {!enTabla && leyenda}
          <button
            type="button"
            onClick={() => setEnTabla((v) => !v)}
            className="press inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line px-2.5 text-[12px] text-ink-2 hover:bg-sunken"
            aria-pressed={enTabla}
          >
            {enTabla ? <BarChart3 size={14} aria-hidden="true" /> : <Table2 size={14} aria-hidden="true" />}
            {enTabla ? 'Ver gráfico' : 'Ver tabla'}
          </button>
        </div>
      </div>
      {enTabla ? <div className="scroll-fino max-h-64 overflow-auto rounded-xl border border-line">{tabla}</div> : grafico}
    </figure>
  )
}

function Tabla({ cabecera, filas }: { cabecera: string[]; filas: (string | number)[][] }) {
  return (
    <table className="w-full text-left text-[13px]">
      <thead className="sticky top-0 bg-sunken text-ink-3">
        <tr>
          {cabecera.map((c, i) => (
            <th key={c} scope="col" className={`px-3 py-2 font-medium ${i > 0 ? 'text-right' : ''}`}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filas.map((f, i) => (
          <tr key={i} className="border-t border-line">
            {f.map((v, j) => (
              <td key={j} className={`px-3 py-1.5 ${j > 0 ? 'num text-right' : 'text-ink-2'}`}>
                {v}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Globo({ x, children }: { x: number; children: ReactNode }) {
  return (
    <div
      role="status"
      className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-elevado px-2.5 py-1.5 text-[12px] whitespace-nowrap text-ink shadow-(--shadow-float)"
      style={{ left: `${x}%` }}
    >
      {children}
    </div>
  )
}

/* ——— Consultas por hora ——— */

export function ConsultasPorHora({ datos, desde, hasta }: { datos: number[]; desde: number; hasta: number }) {
  const [activa, setActiva] = useState<number | null>(null)
  const max = Math.max(...datos)
  const fuera = (h: number) => h < desde || h >= hasta
  const hora = (h: number) => `${String(h).padStart(2, '0')}:00`

  return (
    <Vista
      titulo="Consultas por hora · últimos 7 días"
      leyenda={
        <Leyenda
          items={[
            { color: 'var(--color-serie-1)', etiqueta: 'Fuera de horario' },
            { color: 'var(--color-serie-base)', etiqueta: 'En horario' },
          ]}
        />
      }
      tabla={<Tabla cabecera={['Hora', 'Consultas', 'Horario']} filas={datos.map((v, h) => [hora(h), v, fuera(h) ? 'Fuera' : 'Comercial'])} />}
      grafico={
        <div>
          <div className="relative h-44" onMouseLeave={() => setActiva(null)}>
            {/* grilla recesiva */}
            {[0.5, 1].map((p) => (
              <div key={p} aria-hidden="true" className="absolute inset-x-0 border-t border-dashed border-line" style={{ bottom: `${p * 100}%` }}>
                <span className="num absolute -top-2.5 right-0 bg-surface pl-1 text-[10px] text-ink-3">{Math.round(max * p)}</span>
              </div>
            ))}
            <div className="absolute inset-0 flex items-end gap-[2px] pr-6">
              {datos.map((v, h) => (
                <button
                  key={h}
                  type="button"
                  aria-label={`${hora(h)}: ${v} consultas${fuera(h) ? ', fuera de horario' : ''}`}
                  onMouseEnter={() => setActiva(h)}
                  onFocus={() => setActiva(h)}
                  onBlur={() => setActiva(null)}
                  className="group relative flex h-full flex-1 items-end focus-visible:outline-offset-0"
                >
                  <span
                    className="block w-full rounded-t-[4px] transition-opacity duration-150"
                    style={{
                      height: `${Math.max((v / max) * 100, v ? 3 : 0)}%`,
                      background: fuera(h) ? 'var(--color-serie-1)' : 'var(--color-serie-base)',
                      opacity: activa === null || activa === h ? 1 : 0.45,
                    }}
                  />
                </button>
              ))}
            </div>
            {activa !== null && (
              <Globo x={((activa + 0.5) / datos.length) * 100 * 0.97}>
                <span className="num font-medium">{hora(activa)}</span> · <span className="num">{datos[activa]}</span> consultas
                {fuera(activa) && <span className="text-ink-3"> · fuera de horario</span>}
              </Globo>
            )}
          </div>
          <div aria-hidden="true" className="relative mt-2 mr-6 h-4">
            {[0, 6, desde, 12, hasta, 23].map((h) => (
              <span key={h} className="num absolute -translate-x-1/2 text-[10px] text-ink-3" style={{ left: `${((h + 0.5) / datos.length) * 100}%` }}>
                {hora(h)}
              </span>
            ))}
          </div>
        </div>
      }
    />
  )
}

/* ——— Embudo ——— */

export function Embudo({ etapas }: { etapas: { etapa: string; valor: number }[] }) {
  const max = etapas[0].valor
  return (
    <Vista
      titulo="Embudo de la semana"
      tabla={<Tabla cabecera={['Etapa', 'Cantidad', '% del total']} filas={etapas.map((e) => [e.etapa, e.valor, `${Math.round((e.valor / max) * 100)} %`])} />}
      grafico={
        <ol className="space-y-2.5">
          {etapas.map((e, i) => {
            const paso = i > 0 ? Math.round((e.valor / etapas[i - 1].valor) * 100) : null
            return (
              <li key={e.etapa} className="grid grid-cols-[112px_1fr] items-center gap-3 sm:grid-cols-[132px_1fr]">
                <span className="text-[13px] text-ink-2">{e.etapa}</span>
                <span className="flex items-center gap-2.5">
                  <span className="block h-6 rounded-r-[4px] bg-serie-1" style={{ width: `${Math.max((e.valor / max) * 100, 1.5)}%` }} title={`${e.etapa}: ${e.valor}`} />
                  <span className="num shrink-0 text-[13px] text-ink">{e.valor}</span>
                  {paso !== null && <span className="num shrink-0 text-[11px] text-ink-3">{paso} %</span>}
                </span>
              </li>
            )
          })}
          <li className="pt-1 text-[12px] text-ink-3">El porcentaje chico es cuántos pasaron desde la etapa anterior.</li>
        </ol>
      }
    />
  )
}

/* ——— Comparables de la tasación ——— */

export function ComparablesUSDm2({ comparables, rango, sugerido }: { comparables: Comparable[]; rango: [number, number]; sugerido: number }) {
  const [activo, setActivo] = useState<number | null>(null)
  const valores = comparables.map((c) => c.usd / c.m2)
  const min = Math.floor((Math.min(...valores, rango[0]) - 60) / 50) * 50
  const max = Math.ceil((Math.max(...valores, rango[1]) + 60) / 50) * 50
  const x = (v: number) => ((v - min) / (max - min)) * 100
  const fmt = (v: number) => `USD ${Math.round(v).toLocaleString('es-AR')}`
  const marcas = Array.from({ length: Math.floor((max - min) / 50) + 1 }, (_, i) => min + i * 50).filter((_, i) => i % 2 === 0)

  return (
    <Vista
      titulo="Precio por m² de los comparables"
      leyenda={
        <Leyenda
          items={[
            { color: 'var(--color-serie-1)', etiqueta: 'Vendido', forma: 'punto' },
            { color: 'var(--color-serie-3)', etiqueta: 'Publicado', forma: 'punto' },
          ]}
        />
      }
      tabla={
        <Tabla
          cabecera={['Comparable', 'm²', 'USD', 'USD/m²', 'Estado']}
          filas={comparables.map((c) => [c.direccion, c.m2, c.usd.toLocaleString('es-AR'), Math.round(c.usd / c.m2).toLocaleString('es-AR'), c.estado])}
        />
      }
      grafico={
        <div>
          <div className="relative h-28" onMouseLeave={() => setActivo(null)}>
            <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-line-2" />
            {/* banda del rango sugerido */}
            <div
              aria-hidden="true"
              className="absolute top-[18%] bottom-[18%] rounded-md border border-dashed border-marca/60 bg-marca-soft/70"
              style={{ left: `${x(rango[0])}%`, width: `${x(rango[1]) - x(rango[0])}%` }}
            />
            <div aria-hidden="true" className="absolute top-[10%] bottom-[10%] w-[2px] -translate-x-1/2 rounded-full bg-ink" style={{ left: `${x(sugerido)}%` }}>
              <span className="num absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] whitespace-nowrap text-ink">sugerido {fmt(sugerido)}/m²</span>
            </div>
            {comparables.map((c, i) => {
              const v = valores[i]
              // puntos casi iguales: se separan en vertical para que no se tapen
              const vecinos = valores.filter((w, j) => j < i && Math.abs(w - v) < (max - min) * 0.03).length
              const dy = vecinos ? (vecinos % 2 ? -14 : 14) : 0
              return (
                <button
                  key={c.direccion}
                  type="button"
                  aria-label={`${c.direccion}: ${fmt(v)} por m², ${c.estado.toLowerCase()}`}
                  onMouseEnter={() => setActivo(i)}
                  onFocus={() => setActivo(i)}
                  onBlur={() => setActivo(null)}
                  className="absolute top-1/2 inline-flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
                  style={{ left: `${x(v)}%`, marginTop: dy }}
                >
                  <span
                    className="block size-3 rounded-full ring-2 ring-surface transition-transform duration-150"
                    style={{ background: c.estado === 'Vendido' ? 'var(--color-serie-1)' : 'var(--color-serie-3)', transform: activo === i ? 'scale(1.35)' : undefined }}
                  />
                </button>
              )
            })}
            {activo !== null && (
              <Globo x={x(valores[activo])}>
                <span className="font-medium">{comparables[activo].direccion}</span>
                <br />
                <span className="num">{fmt(valores[activo])}/m²</span> · <span className="num">{comparables[activo].m2} m²</span> · {comparables[activo].estado.toLowerCase()} en <span className="num">{comparables[activo].dias}</span> días
              </Globo>
            )}
          </div>
          <div aria-hidden="true" className="relative mt-1 h-4">
            {marcas.map((m) => (
              <span key={m} className="num absolute -translate-x-1/2 text-[10px] text-ink-3" style={{ left: `${x(m)}%` }}>
                {m.toLocaleString('es-AR')}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-ink-3">La banda punteada es el rango que propone el agente. La línea, el valor sugerido para publicar.</p>
        </div>
      }
    />
  )
}
