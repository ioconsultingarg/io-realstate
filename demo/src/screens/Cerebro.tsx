import { useState } from 'react'
import { BadgeCheck, ChevronRight, CircleCheck, CircleDashed, CircleDot, Download, RefreshCw, Upload } from 'lucide-react'
import { Sheet } from '../components/Sheet'
import { Boton, Encabezado } from '../components/ui'
import { inmobiliaria, usuaria } from '../data/demo'
import { almacenCerebro, aprobarTema, editarTema } from '../lib/cerebro'
import { almacenCartera, estadosCartera, importarCSV, plantillaCSV, type EstadoCartera, type ResultadoImportacion } from '../lib/cartera'

const estados = {
  aprobado: { etiqueta: 'Aprobado', Icono: CircleCheck, clase: 'text-ok' },
  revision: { etiqueta: 'En revisión', Icono: CircleDot, clase: 'text-warn' },
  pendiente: { etiqueta: 'Pendiente', Icono: CircleDashed, clase: 'text-ink-3' },
} as const

const claseEstado: Record<EstadoCartera, string> = {
  disponible: 'bg-ok-soft text-ok',
  reservada: 'bg-warn-soft text-warn',
  vendida: 'bg-sunken text-ink-3',
  'en captación': 'bg-marca-soft text-marca',
}

export function Cerebro() {
  const cartera = almacenCartera.usar()
  const [informe, setInforme] = useState<ResultadoImportacion | null>(null)
  const cerebro = almacenCerebro.usar()
  const [abierto, setAbierto] = useState<string | null>(null)
  const tema = cerebro.find((t) => t.id === abierto)
  const aprobados = cerebro.filter((c) => c.estado === 'aprobado').length
  const total = cerebro.length
  const r = 34
  const circ = 2 * Math.PI * r

  return (
    <>
      <Encabezado
        ceja="Base de conocimiento"
        titulo="Cerebro"
        bajada="Los agentes usan solo los temas aprobados."
        derecha={
          <div className="tarjeta flex items-center gap-4 px-5 py-4">
            <svg width="84" height="84" viewBox="0 0 84 84" role="img" aria-label={`${aprobados} de ${total} temas aprobados`}>
              <circle cx="42" cy="42" r={r} fill="none" stroke="var(--color-line)" strokeWidth="7" />
              <circle cx="42" cy="42" r={r} fill="none" stroke="var(--color-marca)" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${(aprobados / total) * circ} ${circ}`} transform="rotate(-90 42 42)" />
              <text x="42" y="47" textAnchor="middle" className="num" fontSize="17" fill="var(--color-ink)">
                {aprobados}/{total}
              </text>
            </svg>
            <span className="text-[13px] leading-tight text-ink-2">
              temas
              <br />
              aprobados
            </span>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <section aria-labelledby="temas">
          <h2 id="temas" className="titular mb-4 text-[28px]">
            Los 10 temas
          </h2>
          <ol className="tarjeta divide-y divide-line">
            {cerebro.map((c, i) => {
              const e = estados[c.estado]
              return (
                <li key={c.id}>
                  <button type="button" onClick={() => setAbierto(c.id)} className="hover-fila grid w-full grid-cols-[28px_1fr_auto_16px] items-center gap-3 px-4 py-3 text-left">
                    <span className="num text-[12px] text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-medium">{c.tema}</span>
                      <span className="block truncate text-[13px] text-ink-3">{c.detalle}</span>
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${e.clase}`}>
                      <e.Icono size={15} aria-hidden="true" />
                      <span className="hidden sm:inline">{e.etiqueta}</span>
                      <span className="sr-only sm:hidden">{e.etiqueta}</span>
                    </span>
                    <ChevronRight size={16} aria-hidden="true" className="text-ink-3" />
                  </button>
                </li>
              )
            })}
          </ol>
          <p className="mt-3 text-[13px] text-ink-3">
            Los textos legales llevan el pie de {inmobiliaria.corredor}, <span className="num">{inmobiliaria.matricula}</span>, en todo lo que sale a un cliente.
          </p>
          <Sheet abierto={Boolean(tema)} onCerrar={() => setAbierto(null)} titulo={tema ? `Cerebro · ${tema.tema}` : 'Cerebro'}>
            {tema && (
              <div className="space-y-4 p-6">
                <p className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${estados[tema.estado].clase}`}>
                  {(() => {
                    const E = estados[tema.estado].Icono
                    return <E size={15} aria-hidden="true" />
                  })()}
                  {estados[tema.estado].etiqueta}
                  {tema.aprobadoPor && <span className="font-normal text-ink-3">· por {tema.aprobadoPor}</span>}
                </p>
                <label htmlFor="contenido-tema" className="block text-[13px] font-medium">
                  Lo que saben los agentes sobre {tema.tema.toLowerCase()}
                </label>
                <textarea
                  id="contenido-tema"
                  name="contenido-tema"
                  rows={10}
                  value={tema.contenido}
                  onChange={(e) => editarTema(tema.id, e.target.value)}
                  placeholder="Escribí lo que tienen que saber los agentes…"
                  className="block w-full resize-y rounded-xl border border-line-2 bg-surface p-4 text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-3 focus:border-marca"
                />
                <p className="text-[13px] text-ink-3">Cualquier cambio vuelve el tema a revisión. Los agentes lo usan cuando está aprobado.</p>
                <div className="flex justify-end border-t border-line pt-4">
                  <Boton icono={BadgeCheck} onClick={() => aprobarTema(tema.id, `${usuaria.nombre} ${usuaria.apellido}`)} disabled={tema.estado === 'aprobado' || !tema.contenido.trim()}>
                    {tema.estado === 'aprobado' ? 'Aprobado' : 'Aprobar'}
                  </Boton>
                </div>
              </div>
            )}
          </Sheet>
        </section>

        <section aria-labelledby="cartera">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="cartera" className="titular text-[28px]">
                Cartera
              </h2>
              <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-3">
                <RefreshCw size={13} aria-hidden="true" />
                {cartera.length} propiedades · en el producto se sincroniza todos los días
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="press inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-boton px-4 text-[14px] font-medium text-sobre-boton hover:bg-boton-hover has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-marca">
                <Upload size={16} aria-hidden="true" />
                Importar CSV
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="sr-only"
                  onChange={async (e) => {
                    const archivo = e.target.files?.[0]
                    if (archivo) setInforme(importarCSV(await archivo.text()))
                    e.target.value = ''
                  }}
                />
              </label>
              <a
                href={`data:text/csv;charset=utf-8,${encodeURIComponent(plantillaCSV)}`}
                download="plantilla-cartera.csv"
                className="press inline-flex min-h-11 items-center gap-2 rounded-full border border-line-2 bg-surface px-4 text-[14px] font-medium text-ink hover:bg-sunken"
              >
                <Download size={16} aria-hidden="true" />
                Plantilla
              </a>
            </div>
          </div>
          {informe && (
            <div role="status" className={`mb-4 rounded-2xl p-4 text-[14px] ${informe.agregadas + informe.actualizadas ? 'bg-ok-soft text-ink' : 'bg-bad-soft text-bad'}`}>
              <p className="font-medium">
                {informe.agregadas + informe.actualizadas
                  ? `Importé ${informe.agregadas} propiedades nuevas y actualicé ${informe.actualizadas}.`
                  : 'No pude importar el archivo.'}
              </p>
              {informe.errores.map((e) => (
                <p key={e} className="mt-1 text-ink-2">
                  {e}
                </p>
              ))}
            </div>
          )}
          <div className="tarjeta scroll-fino overflow-x-auto">
            <table className="w-full min-w-[540px] text-left text-[14px]">
              <thead className="text-[12px] text-ink-3">
                <tr className="border-b border-line">
                  <th scope="col" className="px-4 py-3 font-medium">Propiedad</th>
                  <th scope="col" className="px-4 py-3 font-medium">Operación</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Precio</th>
                  <th scope="col" className="px-4 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {cartera.map((p) => (
                  <tr key={p.id} className="hover-fila">
                    <td className="px-4 py-3">
                      <span className="block font-medium">{p.direccion}</span>
                      <span className="text-[12px] text-ink-3">
                        {p.tipo} · actualizada {p.actualizada}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-2">{p.operacion}</td>
                    <td className="num px-4 py-3 text-right whitespace-nowrap">{p.precio}</td>
                    <td className="px-4 py-3">
                      <select
                        aria-label={`Estado de ${p.direccion}`}
                        value={p.estado}
                        onChange={(e) => almacenCartera.cambiar((cs) => cs.map((x) => (x.id === p.id ? { ...x, estado: e.target.value as EstadoCartera, actualizada: 'recién' } : x)))}
                        className={`min-h-9 cursor-pointer rounded-full border-0 px-2.5 text-[12px] font-medium ${claseEstado[p.estado]}`}
                      >
                        {estadosCartera.map((e) => (
                          <option key={e} value={e} className="bg-surface text-ink">
                            {e}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-3">Lo reservado o vendido el agente no lo ofrece. Si un dato no está en la cartera, responde que lo confirma un asesor en lugar de inventarlo.</p>
        </section>
      </div>
    </>
  )
}
