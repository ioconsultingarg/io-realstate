import { Download, FileText, Plus, RotateCcw, Trash2 } from 'lucide-react'
import type { Comparable } from '../data/demo'
import { calcularACM, usd } from '../lib/acm'
import { almacenAvisos, almacenBusquedas } from '../lib/busqueda'
import { almacenTasacion, editarTasacion, nuevaTasacion } from '../lib/tasacion'
import { Boton } from './ui'

const entrada = 'block min-h-11 w-full rounded-xl border border-line-2 bg-surface px-3 text-[16px] text-ink outline-none placeholder:text-ink-3 focus:border-marca'
const celda = 'block min-h-10 w-full rounded-lg border border-line bg-surface px-2 text-[15px] text-ink outline-none focus:border-marca'
const n = (v: string) => Number(v.replace(/[^\d.,-]/g, '').replace(/\.(?=\d{3})/g, '').replace(',', '.')) || 0

/** Datos del inmueble y comparables. El cálculo se actualiza mientras se escribe. */
export function EditorTasacion({ onVerInforme }: { onVerInforme: () => void }) {
  const t = almacenTasacion.usar()
  const avisos = almacenAvisos.usar()
  const busquedas = almacenBusquedas.usar()
  const a = calcularACM(t.comparables, t.m2, t.ajuste)

  const setComparable = (i: number, cambio: Partial<Comparable>) => editarTasacion((x) => ({ comparables: x.comparables.map((c, j) => (j === i ? { ...c, ...cambio } : c)) }))

  // los avisos que llegaron por las alertas sirven como comparables publicados (sin scrapear)
  const importables = avisos.filter((av) => av.m2 && !t.comparables.some((c) => c.direccion === av.direccion))

  return (
    <div className="space-y-6 p-6">
      <div className="sticky top-0 z-10 -mx-6 -mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper/95 px-6 py-4 backdrop-blur" aria-live="polite">
        <div>
          <p className="ceja">Valor sugerido</p>
          <p className="num text-[24px] font-medium">{a.suficiente ? usd(a.sugerido) : '—'}</p>
          <p className="text-[12px] text-ink-3">
            {a.suficiente ? `${a.cantidad} comparables · ${usd(a.usdM2)}/m²` : `Faltan datos: ${a.cantidad} de 3 comparables mínimos`}
          </p>
        </div>
        <Boton icono={FileText} onClick={onVerInforme}>
          Ver informe
        </Boton>
      </div>

      <section className="space-y-4">
        <h3 className="text-[16px] font-medium">El inmueble</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Dirección</span>
            <input className={entrada} name="t-direccion" autoComplete="off" value={t.direccion} onChange={(e) => editarTasacion(() => ({ direccion: e.target.value }))} placeholder="Ugarte 1856…" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Barrio</span>
            <input className={entrada} name="t-barrio" autoComplete="off" value={t.barrio} onChange={(e) => editarTasacion(() => ({ barrio: e.target.value }))} placeholder="Villa Urquiza…" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[13px] font-medium">Descripción</span>
            <input className={entrada} name="t-desc" autoComplete="off" value={t.descripcion} onChange={(e) => editarTasacion(() => ({ descripcion: e.target.value }))} placeholder="PH de 4 ambientes con terraza…" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Superficie (m²)</span>
            <input className={`${entrada} num`} name="t-m2" inputMode="numeric" autoComplete="off" value={t.m2 || ''} onChange={(e) => editarTasacion(() => ({ m2: n(e.target.value) }))} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Propietario</span>
            <input className={entrada} name="t-cliente" autoComplete="off" value={t.cliente} onChange={(e) => editarTasacion(() => ({ cliente: e.target.value }))} placeholder="Nombre…" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Ajuste: motivo</span>
            <input className={entrada} name="t-ajuste" autoComplete="off" value={t.ajuste.etiqueta} onChange={(e) => editarTasacion((x) => ({ ajuste: { ...x.ajuste, etiqueta: e.target.value } }))} placeholder="Terraza propia…" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Ajuste: %</span>
            <input className={`${entrada} num`} name="t-pct" type="number" step="0.5" min="-30" max="30" autoComplete="off" value={t.ajuste.pct} onChange={(e) => editarTasacion((x) => ({ ajuste: { ...x.ajuste, pct: Number(e.target.value) || 0 } }))} />
          </label>
        </div>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-[16px] font-medium">Comparables</h3>
          <Boton variante="secundario" icono={Plus} onClick={() => editarTasacion((x) => ({ comparables: [...x.comparables, { direccion: '', m2: 0, usd: 0, estado: 'Vendido', dias: 0 }] }))}>
            Agregar
          </Boton>
        </div>
        <div className="space-y-3">
          {t.comparables.map((c, i) => (
            <fieldset key={i} className="grid grid-cols-2 gap-2 rounded-xl border border-line p-3 sm:grid-cols-[1.6fr_0.7fr_1fr_1fr_0.7fr_auto]">
              <legend className="sr-only">Comparable {i + 1}</legend>
              <input aria-label="Dirección del comparable" className={`${celda} col-span-2 sm:col-span-1`} value={c.direccion} onChange={(e) => setComparable(i, { direccion: e.target.value })} placeholder="Dirección…" />
              <input aria-label="Metros cuadrados" className={`${celda} num`} inputMode="numeric" value={c.m2 || ''} onChange={(e) => setComparable(i, { m2: n(e.target.value) })} placeholder="m²" />
              <input aria-label="Precio en dólares" className={`${celda} num`} inputMode="numeric" value={c.usd || ''} onChange={(e) => setComparable(i, { usd: n(e.target.value) })} placeholder="USD" />
              <select aria-label="Estado" className={celda} value={c.estado} onChange={(e) => setComparable(i, { estado: e.target.value as Comparable['estado'] })}>
                <option>Vendido</option>
                <option>Publicado</option>
              </select>
              <input aria-label="Días en el mercado" className={`${celda} num`} inputMode="numeric" value={c.dias || ''} onChange={(e) => setComparable(i, { dias: n(e.target.value) })} placeholder="días" />
              <button
                type="button"
                onClick={() => editarTasacion((x) => ({ comparables: x.comparables.filter((_, j) => j !== i) }))}
                aria-label={`Quitar ${c.direccion || 'comparable'}`}
                className="press inline-flex size-10 items-center justify-center justify-self-end rounded-full text-ink-3 hover:bg-sunken hover:text-ink"
              >
                <Trash2 size={15} aria-hidden="true" />
              </button>
            </fieldset>
          ))}
          {!t.comparables.length && <p className="rounded-xl bg-sunken p-4 text-[14px] text-ink-2">Sin comparables. Agregá ventas que conozcas o traé avisos de tus búsquedas.</p>}
        </div>
      </section>

      {importables.length > 0 && (
        <section>
          <h3 className="text-[16px] font-medium">Traer de tus búsquedas</h3>
          <p className="text-[13px] text-ink-3">Los avisos que llegaron por las alertas sirven como comparables publicados.</p>
          <ul className="mt-3 divide-y divide-line rounded-xl border border-line">
            {importables.map((av) => (
              <li key={av.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                <span className="min-w-0 text-[14px]">
                  <span className="block truncate text-ink">
                    {av.direccion} · {av.barrio}
                  </span>
                  <span className="num text-[12px] text-ink-3">
                    {av.m2} m² · {usd(av.precio)} · {busquedas.find((b) => b.id === av.busquedaId)?.cliente ?? ''}
                  </span>
                </span>
                <Boton
                  variante="fantasma"
                  icono={Download}
                  onClick={() => editarTasacion((x) => ({ comparables: [...x.comparables, { direccion: av.direccion, m2: av.m2 ?? 0, usd: av.precio, estado: 'Publicado', dias: 0 }] }))}
                >
                  Usar
                </Boton>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap gap-2 border-t border-line pt-5">
        <Boton variante="fantasma" icono={Plus} onClick={nuevaTasacion}>
          Empezar una tasación nueva
        </Boton>
        <Boton variante="fantasma" icono={RotateCcw} onClick={() => almacenTasacion.reiniciar()}>
          Volver al ejemplo
        </Boton>
      </div>
    </div>
  )
}
