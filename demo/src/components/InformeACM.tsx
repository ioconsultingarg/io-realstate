import { BadgeCheck, Pencil, Printer, Send } from 'lucide-react'
import { inmobiliaria } from '../data/demo'
import { calcularACM, MINIMO_COMPARABLES, usd } from '../lib/acm'
import { almacenTasacion } from '../lib/tasacion'
import { Marca } from './Marca'
import { ComparablesUSDm2 } from './Graficos'
import { Boton, Chip } from './ui'

/** El documento que recibe el propietario, con la marca de la inmobiliaria y la firma de la corredora */
export function InformeACM({ onEditar }: { onEditar: () => void }) {
  const t = almacenTasacion.usar()
  const a = calcularACM(t.comparables, t.m2, t.ajuste)

  return (
    <div className="p-4 sm:p-6">
      <div className="no-imprimir mb-4 flex flex-wrap items-center justify-between gap-3">
        <Chip tono={t.aprobado ? 'ok' : 'warn'}>{t.aprobado ? 'Aprobado por la corredora' : 'Borrador · falta tu revisión'}</Chip>
        <div className="flex flex-wrap gap-2">
          <Boton variante="secundario" icono={Pencil} onClick={onEditar}>
            Editar datos
          </Boton>
          <Boton variante="secundario" icono={Printer} onClick={() => window.print()}>
            Imprimir o PDF
          </Boton>
          <Boton icono={t.aprobado ? BadgeCheck : Send} onClick={() => almacenTasacion.cambiar((x) => ({ ...x, aprobado: true }))} disabled={t.aprobado || !a.suficiente}>
            {t.aprobado ? 'Listo para enviar' : 'Aprobar y firmar'}
          </Boton>
        </div>
      </div>

      <article className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <header className="flex items-start justify-between gap-4 border-b border-line pb-5">
          <div className="min-w-0">
            <p className="ceja">Análisis comparativo de mercado</p>
            <h2 className="titular mt-2 text-[36px]">{t.direccion || 'Inmueble sin dirección'}</h2>
            <p className="mt-1 text-[14px] text-ink-2">
              {[t.descripcion, t.barrio].filter(Boolean).join(' · ') || 'Completá los datos del inmueble'}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-right">
            <div className="hidden sm:block">
              <p className="text-[14px] font-medium">{inmobiliaria.nombre}</p>
              {t.cliente && <p className="text-[12px] text-ink-3">Preparado para {t.cliente}</p>}
            </div>
            <Marca size={30} className="text-ink" />
          </div>
        </header>

        {!a.suficiente ? (
          <p className="my-6 rounded-xl bg-warn-soft p-4 text-[14px] text-warn">
            Con {a.cantidad} comparables no alcanza para un valor serio. Cargá al menos {MINIMO_COMPARABLES} con m² y precio, y la superficie del inmueble.
          </p>
        ) : (
          <>
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
                <p className="num mt-2 text-[18px] text-ink">{a.diasMediana ? `≈ ${a.diasMediana} días` : 'Sin datos'}</p>
                <p className="text-[12px] text-ink-3">{a.vendidos ? `mediana de ${a.vendidos} ventas comparables` : 'cargá comparables vendidos con días en el mercado'}</p>
              </div>
            </section>

            <section className="border-t border-line py-6">
              <ComparablesUSDm2 comparables={t.comparables.filter((c) => c.m2 > 0 && c.usd > 0)} rango={[a.rango[0] / t.m2, a.rango[1] / t.m2]} sugerido={a.sugerido / t.m2} />
            </section>
          </>
        )}

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
                {t.comparables.map((c, i) => (
                  <tr key={i} className="border-t border-line">
                    <td className="py-2 text-ink-2">{c.direccion || '—'}</td>
                    <td className="num py-2 text-right">{c.m2 || '—'}</td>
                    <td className="num py-2 text-right">{c.usd ? c.usd.toLocaleString('es-AR') : '—'}</td>
                    <td className="num py-2 text-right">{c.m2 && c.usd ? Math.round(c.usd / c.m2).toLocaleString('es-AR') : '—'}</td>
                    <td className="py-2 text-right text-ink-3">
                      {c.estado}
                      {c.dias ? (
                        <>
                          {' '}
                          · <span className="num">{c.dias}</span> d
                        </>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {a.suficiente && (
          <section className="border-t border-line py-6 text-[14px] leading-relaxed text-ink-2">
            <h3 className="text-[15px] font-medium text-ink">Cómo se calculó</h3>
            <p className="mt-2">
              Mediana del precio por m² de {a.cantidad} comparables (<span className="num">{usd(a.usdM2)}</span>/m²) por <span className="num">{t.m2}</span> m²
              {t.ajuste.pct ? (
                <>
                  , {t.ajuste.pct > 0 ? 'más' : 'menos'} {Math.abs(t.ajuste.pct).toLocaleString('es-AR')} % por {t.ajuste.etiqueta.toLowerCase() || 'ajuste'}
                </>
              ) : null}
              . Los publicados se usan como referencia de competencia; los vendidos, como valor de cierre.
            </p>
          </section>
        )}

        <footer className="rounded-xl border border-dashed border-line-2 p-4 text-[13px] leading-relaxed text-ink-2">
          <p>
            Opinión de valor elaborada por <span className="font-medium text-ink">{inmobiliaria.corredor}</span>, corredora inmobiliaria, <span className="num">{inmobiliaria.matricula}</span>. El borrador lo preparó el
            agente de tasación de IO-RealState con los datos de la inmobiliaria; no constituye una tasación oficial hasta su firma.
          </p>
          <p className="mt-2 flex items-center gap-1.5 font-medium text-ink">
            {t.aprobado ? (
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
