import { BadgeCheck, Printer, Send } from 'lucide-react'
import { comparablesUgarte, inmobiliaria } from '../data/demo'
import { calcularACM, usd } from '../lib/acm'
import { Marca } from './Marca'
import { ComparablesUSDm2 } from './Graficos'
import { Boton, Chip } from './ui'

export const acmUgarte = calcularACM(comparablesUgarte, 120)

/** El documento que recibe el propietario, con la marca de la inmobiliaria y la firma de la corredora */
export function InformeACM({ onAprobar, aprobado }: { onAprobar: () => void; aprobado: boolean }) {
  const a = acmUgarte
  return (
    <div className="p-4 sm:p-6">
      <div className="no-imprimir mb-4 flex flex-wrap items-center justify-between gap-3">
        <Chip tono={aprobado ? 'ok' : 'warn'}>{aprobado ? 'Aprobado por la corredora' : 'Borrador · falta tu revisión'}</Chip>
        <div className="flex gap-2">
          <Boton variante="secundario" icono={Printer} onClick={() => window.print()}>
            Imprimir
          </Boton>
          <Boton icono={aprobado ? BadgeCheck : Send} onClick={onAprobar} disabled={aprobado}>
            {aprobado ? 'Listo para enviar' : 'Aprobar y firmar'}
          </Boton>
        </div>
      </div>

      <article className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <header className="flex items-start justify-between gap-4 border-b border-line pb-5">
          <div>
            <p className="ceja">Análisis comparativo de mercado</p>
            <h2 className="titular mt-2 text-[36px]">Ugarte 1856</h2>
            <p className="mt-1 text-[14px] text-ink-2">PH de 4 ambientes · 120 m² · terraza propia · Villa Urquiza</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-right">
            <div className="hidden sm:block">
              <p className="text-[14px] font-medium">{inmobiliaria.nombre}</p>
              <p className="text-[12px] text-ink-3">Preparado para Tomás Iriarte</p>
            </div>
            <Marca size={30} className="text-ink" />
          </div>
        </header>

        <section className="grid gap-4 py-6 sm:grid-cols-3" aria-label="Resumen">
          <div className="rounded-xl bg-marca-soft p-4">
            <p className="ceja text-marca">Valor sugerido de publicación</p>
            <p className="num mt-2 text-[26px] font-medium text-ink">{usd(a.sugerido)}</p>
          </div>
          <div className="rounded-xl bg-sunken p-4">
            <p className="ceja">Rango de mercado</p>
            <p className="num mt-2 text-[18px] text-ink">
              {usd(a.rango[0])} – {a.rango[1].toLocaleString('es-AR')}
            </p>
          </div>
          <div className="rounded-xl bg-sunken p-4">
            <p className="ceja">Tiempo de venta esperado</p>
            <p className="num mt-2 text-[18px] text-ink">≈ {a.diasMediana} días</p>
            <p className="text-[12px] text-ink-3">mediana de {a.vendidos} ventas comparables</p>
          </div>
        </section>

        <section className="border-t border-line py-6">
          <ComparablesUSDm2 comparables={comparablesUgarte} rango={[a.rango[0] / 120, a.rango[1] / 120]} sugerido={a.sugerido / 120} />
        </section>

        <section className="border-t border-line py-6">
          <h3 className="text-[15px] font-medium">Comparables</h3>
          <div className="scroll-fino mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[13px]">
              <thead className="text-ink-3">
                <tr>
                  <th scope="col" className="py-2 font-medium">Inmueble</th>
                  <th scope="col" className="py-2 text-right font-medium">m²</th>
                  <th scope="col" className="py-2 text-right font-medium">Precio</th>
                  <th scope="col" className="py-2 text-right font-medium">USD/m²</th>
                  <th scope="col" className="py-2 text-right font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {comparablesUgarte.map((c) => (
                  <tr key={c.direccion} className="border-t border-line">
                    <td className="py-2 text-ink-2">{c.direccion}</td>
                    <td className="num py-2 text-right">{c.m2}</td>
                    <td className="num py-2 text-right">{c.usd.toLocaleString('es-AR')}</td>
                    <td className="num py-2 text-right">{Math.round(c.usd / c.m2).toLocaleString('es-AR')}</td>
                    <td className="py-2 text-right text-ink-3">
                      {c.estado} · <span className="num">{c.dias}</span> d
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border-t border-line py-6 text-[14px] leading-relaxed text-ink-2">
          <h3 className="text-[15px] font-medium text-ink">Cómo se calculó</h3>
          <p className="mt-2">
            Mediana del precio por m² de 6 PH comparables de la zona (<span className="num">{usd(a.usdM2)}</span>/m²) por la superficie, más {a.ajuste.pct.toLocaleString('es-AR')} % por {a.ajuste.etiqueta.toLowerCase()}. Los
            publicados se usan como referencia de competencia; los vendidos, como valor de cierre.
          </p>
        </section>

        <footer className="rounded-xl border border-dashed border-line-2 p-4 text-[13px] leading-relaxed text-ink-2">
          <p>
            Opinión de valor elaborada por <span className="font-medium text-ink">{inmobiliaria.corredor}</span>, corredora inmobiliaria, <span className="num">{inmobiliaria.matricula}</span>. El borrador lo preparó el
            agente de tasación de IO-RealState con los datos de la inmobiliaria; no constituye una tasación oficial hasta su firma.
          </p>
          <p className="mt-2 flex items-center gap-1.5 font-medium text-ink">
            {aprobado ? (
              <>
                <BadgeCheck size={16} aria-hidden="true" className="text-ok" /> Firmado por {inmobiliaria.corredor}
              </>
            ) : (
              'Pendiente de firma'
            )}
          </p>
        </footer>
      </article>
    </div>
  )
}
