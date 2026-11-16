import { useState, type FormEvent, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { BellRing, Check, ClipboardPaste, Copy, MessageCircle, Minus, PenLine, Pencil, Plus, ThumbsDown, ThumbsUp, Trash2, Undo2, X } from 'lucide-react'
import { Sheet } from '../components/Sheet'
import { Boton, Chip, Encabezado } from '../components/ui'
import { usuaria } from '../data/demo'
import {
  agregarAviso,
  almacenAvisos,
  almacenBusquedas,
  almacenVotos,
  armarBorrador,
  barriosConocidos,
  etiquetaAfinidad,
  evaluar,
  leerAviso,
  nuevaBusqueda,
  portales,
  type AvisoV,
  type BusquedaV,
  type Motivo,
  type Portal,
} from '../lib/busqueda'
import { agregarRecordatorio, almacenRecordatorios } from '../lib/tareas'

const estiloAsesora = ['Saluda con "Hola" y el nombre', 'Tutea', 'Frases cortas, sin listas', 'Sin emojis', 'Cierra con una pregunta concreta', `Firma "${usuaria.nombre}"`]

const aprendizaje = (m?: Motivo) => (m ? `Anotado: ${m.texto.charAt(0).toLowerCase() + m.texto.slice(1)} no va para este cliente.` : 'Anotado para afinar la búsqueda.')

/* ——— piezas chicas ——— */

function Campo({ etiqueta, ayuda, children }: { etiqueta: string; ayuda?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-ink">{etiqueta}</span>
      {children}
      {ayuda && <span className="mt-1 block text-[12px] text-ink-3">{ayuda}</span>}
    </label>
  )
}

const entrada = 'block min-h-11 w-full rounded-xl border border-line-2 bg-surface px-3 text-[16px] text-ink outline-none placeholder:text-ink-3 focus:border-marca'

function Afinidad({ valor }: { valor: number }) {
  const tono = valor >= 80 ? 'text-ok' : valor >= 65 ? 'text-warn' : 'text-ink-3'
  const r = 20
  const c = 2 * Math.PI * r
  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
      <svg width="52" height="52" viewBox="0 0 52 52" role="img" aria-label={`Afinidad ${valor} %, ${etiquetaAfinidad(valor).toLowerCase()}`} className={tono}>
        <circle cx="26" cy="26" r={r} fill="none" stroke="var(--color-line)" strokeWidth="4" />
        <circle cx="26" cy="26" r={r} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(valor / 100) * c} ${c}`} transform="rotate(-90 26 26)" />
        <text x="26" y="30.5" textAnchor="middle" fontSize="13" fill="var(--color-ink)" className="num">
          {valor}
        </text>
      </svg>
      <span className={`text-[11px] font-medium ${tono}`}>{etiquetaAfinidad(valor)}</span>
    </div>
  )
}

function Motivos({ motivos }: { motivos: Motivo[] }) {
  return (
    <ul className="grid gap-1.5 sm:grid-cols-2">
      {motivos.map((m) => (
        <li key={m.texto} className="flex items-start gap-1.5 text-[13px] text-ink-2">
          {m.ok === true ? (
            <Check size={15} aria-label="Cumple" className="mt-0.5 shrink-0 text-ok" />
          ) : m.ok === false ? (
            <X size={15} aria-label="No cumple" className="mt-0.5 shrink-0 text-bad" />
          ) : (
            <Minus size={15} aria-label="A revisar" className="mt-0.5 shrink-0 text-warn" />
          )}
          {m.texto}
        </li>
      ))}
    </ul>
  )
}

/* ——— tarjeta de aviso ——— */

function TarjetaAviso({ b, a, voto }: { b: BusquedaV; a: AvisoV; voto?: 'si' | 'no' }) {
  const { afinidad, motivos, cumpleObligatorios } = evaluar(b, a)
  const votar = (v?: 'si' | 'no') =>
    almacenVotos.cambiar((s) => {
      const n = { ...s }
      if (v) n[a.id] = v
      else delete n[a.id]
      return n
    })

  if (voto === 'no') {
    return (
      <motion.li layout initial={false} className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-line px-4 py-3 text-[14px] text-ink-3">
        <span className="min-w-0">
          <span className="line-through">{a.direccion}</span> · <span className="text-ink-2">{aprendizaje(motivos.find((m) => m.ok === false))}</span>
        </span>
        <button type="button" onClick={() => votar()} className="press inline-flex min-h-9 shrink-0 items-center gap-1 rounded-full px-2.5 text-[13px] text-ink-2 hover:bg-sunken">
          <Undo2 size={14} aria-hidden="true" />
          Deshacer
        </button>
      </motion.li>
    )
  }

  return (
    <motion.li layout initial={false} className={`tarjeta p-4 sm:p-5 ${voto === 'si' ? 'ring-2 ring-ok/50' : ''} ${!cumpleObligatorios ? 'opacity-80' : ''}`}>
      <div className="flex gap-4">
        <Afinidad valor={afinidad} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3 className="text-[17px] font-medium">
              {a.direccion} <span className="text-ink-3">· {a.barrio}</span>
            </h3>
            <span className="num text-[16px] text-ink">USD {a.precio.toLocaleString('es-AR')}</span>
          </div>
          <p className="mt-0.5 text-[14px] text-ink-2">
            {a.ambientes === 1 ? 'Monoambiente' : `${a.ambientes} amb`}
            {a.m2 ? ` · ${a.m2} m²` : ''} · {a.texto}
          </p>
          {!cumpleObligatorios && <p className="mt-2 text-[12px] font-medium text-bad">No cumple algo obligatorio: en el producto no te lo avisaría.</p>}
          <div className="mt-3">
            <Motivos motivos={motivos} />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
            <p className="flex flex-wrap items-center gap-1.5 text-[12px] text-ink-3">
              <Chip>{a.fuente}</Chip>
              <span>llegó {a.llego}</span>
            </p>
            <div className="flex gap-2">
              <Boton variante={voto === 'si' ? 'primario' : 'secundario'} icono={ThumbsUp} aria-pressed={voto === 'si'} onClick={() => votar(voto === 'si' ? undefined : 'si')}>
                {voto === 'si' ? 'Elegida' : 'Me sirve'}
              </Boton>
              <Boton variante="fantasma" icono={ThumbsDown} onClick={() => votar('no')} aria-label={`Descartar ${a.direccion}`}>
                No
              </Boton>
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  )
}

/* ——— formulario de búsqueda ——— */

const lista = (s: string) =>
  s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)

function FormBusqueda({ inicial, onListo, onEliminar }: { inicial?: BusquedaV; onListo: (id: string) => void; onEliminar?: () => void }) {
  const [f, setF] = useState({
    cliente: inicial?.cliente ?? '',
    contacto: inicial?.contacto ?? '',
    barrios: inicial?.barrios.join(', ') ?? '',
    ambientesMin: inicial?.ambientesMin ?? 2,
    precioMin: inicial?.precioMin?.toString() ?? '',
    precioMax: inicial?.precioMax.toString() ?? '',
    obligatorios: inicial?.obligatorios.join(', ') ?? '',
    deseables: inicial?.deseables.join(', ') ?? '',
    alertas: inicial?.alertas ?? (['Zonaprop', 'Argenprop', 'Mercado Libre'] as Portal[]),
  })
  const [error, setError] = useState('')
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }))

  function guardar(e: FormEvent) {
    e.preventDefault()
    const max = Number(f.precioMax.replace(/\D/g, ''))
    if (!f.cliente.trim() || !max) {
      setError('Falta el nombre del cliente o el precio máximo. Completalos para guardar.')
      return
    }
    const datos = {
      cliente: f.cliente.trim(),
      contacto: f.contacto.trim() || f.cliente.trim().split(' ')[0],
      barrios: lista(f.barrios),
      ambientesMin: Number(f.ambientesMin),
      precioMin: Number(f.precioMin.replace(/\D/g, '')) || null,
      precioMax: max,
      obligatorios: lista(f.obligatorios),
      deseables: lista(f.deseables),
      alertas: f.alertas,
    }
    if (inicial) {
      almacenBusquedas.cambiar((bs) => bs.map((b) => (b.id === inicial.id ? { ...b, ...datos } : b)))
      onListo(inicial.id)
    } else onListo(nuevaBusqueda(datos))
  }

  return (
    <form onSubmit={guardar} className="space-y-5 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Cliente">
          <input className={entrada} name="cliente" autoComplete="off" value={f.cliente} onChange={set('cliente')} placeholder="Familia Pérez…" />
        </Campo>
        <Campo etiqueta="Nombre para el mensaje" ayuda="Con quién hablás: aparece en el saludo.">
          <input className={entrada} name="contacto" autoComplete="off" value={f.contacto} onChange={set('contacto')} placeholder="Laura…" />
        </Campo>
      </div>
      <Campo etiqueta="Barrios" ayuda="Separados por coma.">
        <input className={entrada} name="barrios" list="barrios" autoComplete="off" value={f.barrios} onChange={set('barrios')} placeholder="Villa Urquiza, Coghlan…" />
        <datalist id="barrios">
          {barriosConocidos.map((b) => (
            <option key={b} value={b} />
          ))}
        </datalist>
      </Campo>
      <div className="grid gap-4 sm:grid-cols-3">
        <Campo etiqueta="Ambientes (mínimo)">
          <select className={entrada} name="ambientesMin" value={f.ambientesMin} onChange={set('ambientesMin')}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n === 1 ? 'Monoambiente' : n}
              </option>
            ))}
          </select>
        </Campo>
        <Campo etiqueta="Desde (USD)">
          <input className={`${entrada} num`} name="precioMin" inputMode="numeric" autoComplete="off" value={f.precioMin} onChange={set('precioMin')} placeholder="opcional" />
        </Campo>
        <Campo etiqueta="Hasta (USD)">
          <input className={`${entrada} num`} name="precioMax" inputMode="numeric" autoComplete="off" value={f.precioMax} onChange={set('precioMax')} placeholder="300000" />
        </Campo>
      </div>
      <Campo etiqueta="Obligatorio" ayuda='Separado por coma. "patio o terraza" acepta cualquiera de las dos; "sin escaleras" descarta las que tienen.'>
        <input className={entrada} name="obligatorios" autoComplete="off" value={f.obligatorios} onChange={set('obligatorios')} placeholder="patio o terraza, apto crédito…" />
      </Campo>
      <Campo etiqueta="Deseable" ayuda='Suma o resta afinidad, no descarta. "cerca del colegio" queda a verificar si el aviso no lo dice.'>
        <input className={entrada} name="deseables" autoComplete="off" value={f.deseables} onChange={set('deseables')} placeholder="cochera, balcón, cerca del subte…" />
      </Campo>
      <fieldset>
        <legend className="mb-1.5 text-[13px] font-medium">Alertas creadas en</legend>
        <div className="flex flex-wrap gap-2">
          {portales
            .filter((p) => p !== 'Otro')
            .map((p) => (
              <label key={p} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-line px-3 text-[14px] has-[:checked]:border-marca has-[:checked]:bg-marca-soft">
                <input
                  type="checkbox"
                  className="accent-[var(--color-marca)]"
                  checked={f.alertas.includes(p)}
                  onChange={(e) => setF((s) => ({ ...s, alertas: e.target.checked ? [...s.alertas, p] : s.alertas.filter((x) => x !== p) }))}
                />
                {p}
              </label>
            ))}
        </div>
      </fieldset>
      {error && (
        <p role="alert" className="rounded-xl bg-bad-soft px-3 py-2 text-[14px] text-bad">
          {error}
        </p>
      )}
      <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-5">
        {onEliminar ? (
          <Boton variante="fantasma" icono={Trash2} onClick={onEliminar}>
            Eliminar búsqueda
          </Boton>
        ) : (
          <span />
        )}
        <Boton type="submit" icono={Check}>
          {inicial ? 'Guardar cambios' : 'Crear búsqueda'}
        </Boton>
      </div>
    </form>
  )
}

/* ——— formulario de aviso ——— */

function FormAviso({ b, onListo }: { b: BusquedaV; onListo: () => void }) {
  const [pegado, setPegado] = useState('')
  const [f, setF] = useState({ direccion: '', barrio: b.barrios[0] ?? '', ambientes: String(b.ambientesMin), m2: '', precio: '', texto: '', fuente: 'Zonaprop' as Portal })
  const [leido, setLeido] = useState('')
  const [error, setError] = useState('')
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }))

  function leer() {
    const r = leerAviso(pegado)
    setF((s) => ({
      ...s,
      direccion: r.direccion ?? s.direccion,
      barrio: r.barrio ?? s.barrio,
      ambientes: r.ambientes ? String(r.ambientes) : s.ambientes,
      m2: r.m2 ? String(r.m2) : s.m2,
      precio: r.precio ? String(r.precio) : s.precio,
      texto: r.texto ?? s.texto,
    }))
    const encontrados = [r.direccion && 'dirección', r.barrio && 'barrio', r.ambientes && 'ambientes', r.m2 && 'm²', r.precio && 'precio'].filter(Boolean)
    setLeido(encontrados.length ? `Leí ${encontrados.join(', ')}. Revisá y completá lo que falte.` : 'No encontré datos claros en el texto. Completá los campos a mano.')
  }

  const precio = Number(f.precio.replace(/\D/g, ''))
  const borradorAviso: AvisoV = {
    id: 'vista',
    busquedaId: b.id,
    direccion: f.direccion || 'Sin dirección',
    barrio: f.barrio || '—',
    ambientes: Number(f.ambientes) || 1,
    m2: Number(f.m2) || null,
    precio: precio || 0,
    texto: f.texto,
    fuente: f.fuente,
    llego: '',
  }
  const vista = precio ? evaluar(b, borradorAviso) : null

  function guardar(e: FormEvent) {
    e.preventDefault()
    if (!f.direccion.trim() || !precio) {
      setError('Falta la dirección o el precio. Completalos para agregar el aviso.')
      return
    }
    agregarAviso({ ...borradorAviso, direccion: f.direccion.trim(), busquedaId: b.id })
    onListo()
  }

  return (
    <form onSubmit={guardar} className="space-y-5 p-6">
      <div className="rounded-2xl bg-ia-soft p-4">
        <Campo etiqueta="Pegá el aviso o el mail de la alerta" ayuda="El agente lee dirección, barrio, ambientes, m² y precio. En el producto lo hace solo con cada mail que llega.">
          <textarea
            className={`${entrada} min-h-24 py-2`}
            name="pegado"
            value={pegado}
            onChange={(e) => setPegado(e.target.value)}
            placeholder="Venta PH 4 ambientes en Villa Urquiza, Bauness 2140. 112 m², patio. U$S 214.000…"
          />
        </Campo>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Boton variante="ia" icono={ClipboardPaste} onClick={leer} disabled={!pegado.trim()}>
            Leer aviso
          </Boton>
          {leido && (
            <p role="status" className="text-[13px] text-ink-2">
              {leido}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Dirección">
          <input className={entrada} name="direccion" autoComplete="off" value={f.direccion} onChange={set('direccion')} placeholder="Bauness 2140…" />
        </Campo>
        <Campo etiqueta="Barrio">
          <input className={entrada} name="barrio" list="barrios-aviso" autoComplete="off" value={f.barrio} onChange={set('barrio')} />
          <datalist id="barrios-aviso">
            {barriosConocidos.map((x) => (
              <option key={x} value={x} />
            ))}
          </datalist>
        </Campo>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Campo etiqueta="Ambientes">
          <input className={`${entrada} num`} name="ambientes" inputMode="numeric" autoComplete="off" value={f.ambientes} onChange={set('ambientes')} />
        </Campo>
        <Campo etiqueta="m²">
          <input className={`${entrada} num`} name="m2" inputMode="numeric" autoComplete="off" value={f.m2} onChange={set('m2')} />
        </Campo>
        <Campo etiqueta="Precio (USD)">
          <input className={`${entrada} num`} name="precio" inputMode="numeric" autoComplete="off" value={f.precio} onChange={set('precio')} />
        </Campo>
      </div>
      <Campo etiqueta="Lo que dice el aviso">
        <textarea className={`${entrada} min-h-20 py-2`} name="texto" value={f.texto} onChange={set('texto')} placeholder="Patio, cochera, luminoso…" />
      </Campo>
      <Campo etiqueta="De dónde llegó">
        <select className={entrada} name="fuente" value={f.fuente} onChange={set('fuente')}>
          {portales.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </Campo>

      {vista && (
        <div className="tarjeta flex gap-4 p-4" aria-live="polite">
          <Afinidad valor={vista.afinidad} />
          <div className="min-w-0">
            <p className="mb-2 text-[14px] font-medium">Así lo vería el agente para {b.cliente}</p>
            <Motivos motivos={vista.motivos} />
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="rounded-xl bg-bad-soft px-3 py-2 text-[14px] text-bad">
          {error}
        </p>
      )}
      <div className="flex justify-end border-t border-line pt-5">
        <Boton type="submit" icono={Plus}>
          Agregar a la búsqueda
        </Boton>
      </div>
    </form>
  )
}

/* ——— recordatorios ——— */

function Recordatorios() {
  const recordatorios = almacenRecordatorios.usar()
  const [frase, setFrase] = useState('')
  const [error, setError] = useState('')

  function agregar(e: FormEvent) {
    e.preventDefault()
    if (agregarRecordatorio(frase)) {
      setFrase('')
      setError('')
    } else setError('Escribí qué hay que hacer, por ejemplo "llamar a Tomás el jueves 10".')
  }

  return (
    <div className="tarjeta p-5">
      <h2 className="text-[16px] font-medium">Recordatorios</h2>
      <p className="text-[13px] text-ink-3">Escribilos como por WhatsApp.</p>
      <form onSubmit={agregar} className="mt-3 flex gap-2">
        <label htmlFor="recordatorio" className="sr-only">
          Nuevo recordatorio
        </label>
        <input
          id="recordatorio"
          name="recordatorio"
          autoComplete="off"
          value={frase}
          onChange={(e) => setFrase(e.target.value)}
          placeholder="recordame llamar a Tomás el jueves 10…"
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-line-2 bg-surface px-3 text-[16px] outline-none placeholder:text-ink-3 focus:border-marca"
        />
        <button type="submit" aria-label="Agregar recordatorio" className="press inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-boton text-sobre-boton hover:bg-boton-hover">
          <Plus size={18} aria-hidden="true" />
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-2 text-[13px] text-bad">
          {error}
        </p>
      )}
      <ul className="mt-3 divide-y divide-line">
        {recordatorios.map((r) => (
          <li key={r.id} className="group flex items-start gap-3 py-2.5">
            <input
              type="checkbox"
              checked={r.hecho}
              onChange={() => almacenRecordatorios.cambiar((rs) => rs.map((x) => (x.id === r.id ? { ...x, hecho: !x.hecho } : x)))}
              aria-label={`Marcar como hecho: ${r.texto}`}
              className="mt-1 size-4 shrink-0 accent-[var(--color-ok)]"
            />
            <span className="num w-[68px] shrink-0 pt-0.5 text-[12px] text-ink-3">{r.cuando}</span>
            <span className="min-w-0 flex-1">
              <span className={`block text-[14px] leading-snug ${r.hecho ? 'text-ink-3 line-through' : 'text-ink'}`}>{r.texto}</span>
              <span className="text-[12px] text-ink-3">{r.origen}</span>
            </span>
            <button
              type="button"
              onClick={() => almacenRecordatorios.cambiar((rs) => rs.filter((x) => x.id !== r.id))}
              aria-label={`Borrar: ${r.texto}`}
              className="press inline-flex size-9 shrink-0 items-center justify-center rounded-full text-ink-3 hover:bg-sunken hover:text-ink"
            >
              <Trash2 size={14} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ——— filtros para crear las alertas en cada portal ——— */

function Alertas({ b }: { b: BusquedaV }) {
  const [copiado, setCopiado] = useState(false)
  const filtros = [
    ['Operación', 'Venta'],
    ['Barrios', b.barrios.join(', ') || 'Todos'],
    ['Ambientes', b.ambientesMin === 1 ? 'Desde monoambiente' : `Desde ${b.ambientesMin}`],
    ['Precio', `${b.precioMin ? `USD ${b.precioMin.toLocaleString('es-AR')} a ` : 'Hasta '}USD ${b.precioMax.toLocaleString('es-AR')}`],
    ['Palabras clave', b.obligatorios.join(', ') || '—'],
  ]
  const texto = filtros.map(([k, v]) => `${k}: ${v}`).join('\n')
  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1800)
    } catch {
      /* sin portapapeles */
    }
  }
  return (
    <div className="tarjeta p-5">
      <h2 className="flex items-center gap-2 text-[16px] font-medium">
        <BellRing size={16} aria-hidden="true" className="text-ink-3" />
        Alertas para {b.cliente}
      </h2>
      <p className="text-[13px] text-ink-3">Cargá estos filtros en cada portal y reenviá las alertas a tu casilla de búsquedas.</p>
      <dl className="mt-3 divide-y divide-line text-[14px]">
        {filtros.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[96px_1fr] gap-2 py-2">
            <dt className="text-ink-3">{k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="flex flex-wrap gap-1.5">
          {(['Zonaprop', 'Argenprop', 'Mercado Libre'] as Portal[]).map((p) => (
            <Chip key={p} tono={b.alertas.includes(p) ? 'ok' : 'neutro'}>
              {b.alertas.includes(p) ? <Check size={12} aria-hidden="true" /> : null}
              {p}
            </Chip>
          ))}
        </p>
        <Boton variante="secundario" icono={copiado ? Check : Copy} onClick={copiar}>
          {copiado ? 'Copiado' : 'Copiar filtros'}
        </Boton>
      </div>
      <p role="status" className="sr-only">
        {copiado ? 'Filtros copiados' : ''}
      </p>
    </div>
  )
}

/* ——— pantalla ——— */

export function Busquedas() {
  const busquedas = almacenBusquedas.usar()
  const avisos = almacenAvisos.usar()
  const votos = almacenVotos.usar()
  const [actualId, setActualId] = useState(busquedas[0]?.id ?? '')
  const [panel, setPanel] = useState<'nueva' | 'editar' | 'aviso' | null>(null)
  const [editado, setEditado] = useState<Record<string, string>>({})
  const [copiado, setCopiado] = useState(false)

  const actual = busquedas.find((b) => b.id === actualId) ?? busquedas[0]
  const propios = actual ? avisos.filter((a) => a.busquedaId === actual.id) : []
  const ordenados = actual ? [...propios].sort((x, y) => evaluar(actual, y).afinidad - evaluar(actual, x).afinidad) : []
  const elegidos = ordenados.filter((a) => votos[a.id] === 'si')
  const clave = `${actual?.id}:${elegidos.map((a) => a.id).join(',')}`
  const borrador = actual ? (editado[clave] ?? armarBorrador(actual, elegidos, usuaria.nombre)) : ''
  const noCumplen = actual ? propios.filter((a) => !evaluar(actual, a).cumpleObligatorios).length : 0

  async function copiar() {
    try {
      await navigator.clipboard.writeText(borrador)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1800)
    } catch {
      /* sin portapapeles: el texto sigue seleccionable */
    }
  }

  function eliminar() {
    if (!actual) return
    almacenBusquedas.cambiar((bs) => bs.filter((b) => b.id !== actual.id))
    almacenAvisos.cambiar((as) => as.filter((a) => a.busquedaId !== actual.id))
    setPanel(null)
    setActualId(busquedas.find((b) => b.id !== actual.id)?.id ?? '')
  }

  return (
    <>
      <Encabezado
        ceja="Compradores"
        titulo="Búsquedas"
        derecha={
          <div className="tarjeta grid grid-cols-3 divide-x divide-line text-center">
            {[
              [busquedas.length, 'búsquedas activas'],
              [avisos.length, 'avisos revisados'],
              [Object.values(votos).filter((v) => v === 'si').length, 'elegidos'],
            ].map(([v, t]) => (
              <div key={t} className="px-4 py-3">
                <p className="num text-[28px] leading-none font-medium">{v}</p>
                <p className="mt-1 text-[12px] leading-tight text-ink-3">{t}</p>
              </div>
            ))}
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_340px]">
        <nav aria-label="Búsquedas activas" className="space-y-2">
          <Boton icono={Plus} onClick={() => setPanel('nueva')} className="mb-2 w-full">
            Nueva búsqueda
          </Boton>
          {busquedas.map((b) => {
            const activa = b.id === actual?.id
            const nuevas = avisos.filter((a) => a.busquedaId === b.id && a.llego.startsWith('hoy') && !votos[a.id]).length
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setActualId(b.id)}
                aria-current={activa ? 'true' : undefined}
                className={`press relative w-full rounded-2xl border p-4 text-left ${activa ? 'border-marca/50 bg-marca-soft/60' : 'border-line bg-surface hover:bg-sunken'}`}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-[15px] font-medium">{b.cliente}</span>
                  {nuevas > 0 && (
                    <span className="num rounded-full bg-marca px-1.5 text-[11px] leading-5 text-sobre-boton">
                      {nuevas}
                      <span className="sr-only"> sin revisar</span>
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-[13px] text-ink-3">
                  {b.ambientesMin === 1 ? 'Monoamb.' : `${b.ambientesMin}+ amb`} · {b.barrios.join(', ') || 'cualquier barrio'} · hasta USD {Math.round(b.precioMax / 1000)} k
                </span>
                <span className="mt-2 block text-[12px] text-ink-3">Buscando {b.creada}</span>
              </button>
            )
          })}
        </nav>

        {actual ? (
          <section aria-labelledby="busqueda-actual" className="min-w-0">
            <div className="tarjeta p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 id="busqueda-actual" className="titular text-[30px]">
                  {actual.cliente}
                </h2>
                <div className="flex gap-2">
                  <Boton variante="secundario" icono={Pencil} onClick={() => setPanel('editar')}>
                    Editar
                  </Boton>
                  <Boton variante="ia" icono={Plus} onClick={() => setPanel('aviso')}>
                    Agregar aviso
                  </Boton>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[
                  ...(actual.barrios.length ? [actual.barrios.join(' o ')] : []),
                  actual.ambientesMin === 1 ? 'Monoambiente o más' : `${actual.ambientesMin}+ ambientes`,
                  actual.precioMin ? `USD ${actual.precioMin.toLocaleString('es-AR')} a ${actual.precioMax.toLocaleString('es-AR')}` : `Hasta USD ${actual.precioMax.toLocaleString('es-AR')}`,
                  ...actual.obligatorios,
                ].map((c) => (
                  <span key={c} className="inline-flex h-7 items-center rounded-full bg-sunken px-2.5 text-[13px] font-medium text-ink">
                    {c}
                  </span>
                ))}
                {actual.deseables.map((c) => (
                  <span key={c} className="inline-flex h-7 items-center rounded-full border border-dashed border-line-2 px-2.5 text-[13px] text-ink-2">
                    {c}
                  </span>
                ))}
              </div>
              <p className="mt-3 flex items-start gap-1.5 text-[12px] text-ink-3">
                <BellRing size={13} aria-hidden="true" className="mt-0.5 shrink-0" />
                <span>Alertas en {actual.alertas.join(', ') || 'ningún portal todavía'} · fondo lleno: obligatorio · punteado: deseable</span>
              </p>
            </div>

            <h3 className="mt-6 mb-3 text-[15px] font-medium">
              Lo que encontró{' '}
              <span className="text-[13px] font-normal text-ink-3">
                · ordenado por afinidad{noCumplen ? ` · ${noCumplen} no cumplen lo obligatorio` : ''}
              </span>
            </h3>
            {ordenados.length ? (
              <motion.ul layout className="space-y-3">
                {ordenados.map((a) => (
                  <TarjetaAviso key={a.id} b={actual} a={a} voto={votos[a.id]} />
                ))}
              </motion.ul>
            ) : (
              <div className="rounded-2xl border border-dashed border-line-2 p-6 text-center">
                <p className="text-[15px] text-ink">Todavía no llegó nada para esta búsqueda.</p>
                <p className="mt-1 text-[14px] text-ink-3">En el producto los avisos llegan solos con las alertas. Acá podés pegar uno para ver cómo lo evalúa el agente.</p>
                <div className="mt-4 flex justify-center">
                  <Boton variante="ia" icono={ClipboardPaste} onClick={() => setPanel('aviso')}>
                    Pegar un aviso
                  </Boton>
                </div>
              </div>
            )}

            <div className="tarjeta mt-6 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-[16px] font-medium">
                  <PenLine size={17} aria-hidden="true" className="text-ia" />
                  Mensaje para {actual.contacto}
                </h3>
                <span className="text-[12px] text-ink-3">Borrador · lo mandás vos desde tu WhatsApp</span>
              </div>
              {elegidos.length === 0 ? (
                <p className="mt-3 rounded-xl bg-sunken p-4 text-[14px] text-ink-2">Marcá "Me sirve" en las propiedades que quieras mandarle y el mensaje se arma solo, escrito como escribís vos.</p>
              ) : (
                <>
                  <label htmlFor="borrador" className="sr-only">
                    Borrador del mensaje
                  </label>
                  <textarea
                    id="borrador"
                    name="borrador"
                    rows={Math.min(16, 6 + elegidos.length * 3)}
                    value={borrador}
                    onChange={(e) => setEditado((s) => ({ ...s, [clave]: e.target.value }))}
                    className="mt-3 block w-full resize-y rounded-xl border border-line bg-sunken p-4 text-[15px] leading-relaxed text-ink outline-none focus:border-ia/60"
                  />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="flex flex-wrap gap-1.5">
                      {estiloAsesora.map((e) => (
                        <Chip key={e} tono="ia">
                          {e}
                        </Chip>
                      ))}
                    </p>
                    <div className="flex gap-2">
                      <Boton variante="secundario" icono={copiado ? Check : Copy} onClick={copiar}>
                        {copiado ? 'Copiado' : 'Copiar'}
                      </Boton>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(borrador)}`}
                        target="_blank"
                        rel="noopener"
                        className="press inline-flex min-h-11 items-center gap-2 rounded-full bg-boton px-4 text-[14px] font-medium text-sobre-boton hover:bg-boton-hover"
                      >
                        <MessageCircle size={16} aria-hidden="true" />
                        Abrir en WhatsApp
                        <span className="sr-only">(se abre en una pestaña nueva)</span>
                      </a>
                    </div>
                  </div>
                  <p role="status" className="sr-only">
                    {copiado ? 'Mensaje copiado' : ''}
                  </p>
                </>
              )}
            </div>
          </section>
        ) : (
          <div className="rounded-2xl border border-dashed border-line-2 p-8 text-center">
            <p className="text-[15px] text-ink">No hay búsquedas activas.</p>
            <p className="mt-1 text-[14px] text-ink-3">Creá una con lo que busca tu cliente y probá pegar un aviso.</p>
          </div>
        )}

        <aside className="space-y-4 lg:col-span-2 xl:col-span-1">
          <Recordatorios />
          {actual && <Alertas b={actual} />}
        </aside>
      </div>

      <Sheet abierto={panel === 'nueva' || panel === 'editar'} onCerrar={() => setPanel(null)} titulo={panel === 'editar' ? 'Editar búsqueda' : 'Nueva búsqueda'}>
        <FormBusqueda
          key={panel === 'editar' ? actual?.id : 'nueva'}
          inicial={panel === 'editar' ? actual : undefined}
          onEliminar={panel === 'editar' ? eliminar : undefined}
          onListo={(id) => {
            setActualId(id)
            setPanel(null)
          }}
        />
      </Sheet>
      {actual && (
        <Sheet abierto={panel === 'aviso'} onCerrar={() => setPanel(null)} titulo={`Aviso para ${actual.cliente}`}>
          <FormAviso key={actual.id} b={actual} onListo={() => setPanel(null)} />
        </Sheet>
      )}
    </>
  )
}
