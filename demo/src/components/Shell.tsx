import { useState, type ReactNode } from 'react'
import { BookOpen, Brain, ExternalLink, FileText, Info, LayoutDashboard, MessagesSquare, Moon, SearchCheck, Sparkles, Sun, UsersRound, type LucideIcon } from 'lucide-react'
import { conversaciones, inmobiliaria, usuaria } from '../data/demo'
import type { Ruta } from '../lib/ruta'
import { useTema } from '../lib/tema'
import { restablecerDemo } from '../lib/almacen'
import { almacenAgentes } from '../screens/Agentes'
import { Marca } from './Marca'
import { Sheet } from './Sheet'

interface ItemNav {
  ruta: Ruta
  href: string
  etiqueta: string
  Icono: LucideIcon
}

const navegacion: ItemNav[] = [
  { ruta: 'hoy', href: '#/', etiqueta: 'Hoy', Icono: LayoutDashboard },
  { ruta: 'conversaciones', href: '#/conversaciones', etiqueta: 'Clientes', Icono: MessagesSquare },
  { ruta: 'busquedas', href: '#/busquedas', etiqueta: 'Búsquedas', Icono: SearchCheck },
  { ruta: 'asistente', href: '#/asistente', etiqueta: 'Asistente', Icono: Sparkles },
  { ruta: 'agentes', href: '#/agentes', etiqueta: 'Agentes', Icono: UsersRound },
  { ruta: 'cerebro', href: '#/cerebro', etiqueta: 'Cerebro', Icono: Brain },
]

const sinLeer = conversaciones.reduce((n, c) => n + c.noLeidos, 0)

function Insignia() {
  if (sinLeer === 0) return null
  return (
    <span aria-hidden="true" className="num absolute top-1 right-3 min-w-4 rounded-full bg-marca px-1 text-center text-[10px] leading-4 text-sobre-boton">
      {sinLeer}
    </span>
  )
}

function Avisos({ item }: { item: ItemNav }) {
  return item.ruta === 'conversaciones' && sinLeer > 0 ? <span className="sr-only">, {sinLeer} sin leer</span> : null
}

export function Shell({ ruta, children }: { ruta: Ruta; children: ReactNode }) {
  const [cuenta, setCuenta] = useState(false)
  const [confirmar, setConfirmar] = useState(false)
  const encendidos = Object.values(almacenAgentes.usar()).filter(Boolean).length
  const { tema, setTema } = useTema()
  const iniciales = usuaria.nombre[0] + usuaria.apellido[0]

  return (
    <div className="min-h-dvh">
      <a href="#contenido" className="sr-only z-[90] rounded-lg bg-boton px-4 py-3 text-sobre-boton focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Saltar al contenido
      </a>

      {/* Riel lateral: tablet y escritorio */}
      <nav aria-label="Principal" className="fixed inset-y-0 left-0 z-40 hidden w-[92px] flex-col items-center border-r border-line bg-surface pt-4 pb-4 md:flex">
        <a href="#/" aria-label="IO-RealState, inicio" className="press mb-5 rounded-xl p-1.5">
          <Marca size={32} className="text-ink" />
        </a>
        <ul className="flex flex-1 flex-col gap-1">
          {navegacion.map((item) => {
            const actual = item.ruta === ruta
            return (
              <li key={item.ruta}>
                <a
                  href={item.href}
                  aria-current={actual ? 'page' : undefined}
                  className={`press relative flex w-[76px] flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-[11px] leading-tight font-medium ${
                    actual ? 'bg-marca-soft text-marca' : 'text-ink-3 hover:bg-sunken hover:text-ink'
                  }`}
                >
                  <item.Icono size={20} strokeWidth={actual ? 2.2 : 1.8} aria-hidden="true" />
                  {item.etiqueta}
                  <Avisos item={item} />
                  {item.ruta === 'conversaciones' && <Insignia />}
                </a>
              </li>
            )
          })}
        </ul>
        <button type="button" onClick={() => setCuenta(true)} className="press flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium text-ink-3 hover:bg-sunken" aria-label="Cuenta y apariencia">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-sunken text-[13px] font-semibold text-ink">{iniciales}</span>
          Cuenta
        </button>
      </nav>

      <div className="md:pl-[92px]">
        {/* Barra superior */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-paper/85 px-4 backdrop-blur-md sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <a href="#/" aria-label="IO-RealState, inicio" className="md:hidden">
              <Marca size={28} className="text-ink" />
            </a>
            <p className="truncate text-[14px] text-ink-2">
              <span className="font-medium text-ink">{inmobiliaria.nombre}</span>
              <span className="hidden sm:inline"> · {inmobiliaria.zona}</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] text-ink-2 sm:inline-flex">
              <span aria-hidden="true" className="punto-vivo size-2 rounded-full bg-ok text-ok" />
              {encendidos} agentes trabajando
            </span>
            <button type="button" onClick={() => setCuenta(true)} className="press inline-flex size-11 items-center justify-center rounded-full bg-sunken text-[13px] font-semibold md:hidden" aria-label="Cuenta y apariencia">
              {iniciales}
            </button>
          </div>
        </header>

        <main id="contenido" className="mx-auto w-full max-w-[1320px] px-4 pt-8 pb-28 sm:px-8 md:pb-16">
          {children}
        </main>
      </div>

      {/* Barra inferior: celular */}
      <nav aria-label="Principal" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <ul className="grid grid-cols-6">
          {navegacion.map((item) => {
            const actual = item.ruta === ruta
            return (
              <li key={item.ruta}>
                <a
                  href={item.href}
                  aria-current={actual ? 'page' : undefined}
                  className={`press relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${actual ? 'text-marca' : 'text-ink-3'}`}
                >
                  <item.Icono size={20} strokeWidth={actual ? 2.2 : 1.8} aria-hidden="true" />
                  {item.etiqueta}
                  <Avisos item={item} />
                  {item.ruta === 'conversaciones' && <Insignia />}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <Sheet abierto={cuenta} onCerrar={() => setCuenta(false)} titulo="Cuenta" ancho="max-w-[420px]">
        <div className="space-y-8 p-6">
          <div className="flex items-center gap-4">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-marca-soft text-[18px] font-semibold text-marca">{iniciales}</span>
            <div>
              <p className="text-[17px] font-medium">
                {usuaria.nombre} {usuaria.apellido}
              </p>
              <p className="text-[14px] text-ink-3">{usuaria.rol}</p>
              <p className="num mt-0.5 text-[12px] text-ink-3">{inmobiliaria.matricula}</p>
            </div>
          </div>

          <fieldset>
            <legend className="ceja mb-3">Apariencia</legend>
            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-sunken p-1">
              {(
                [
                  { valor: 'oscuro', etiqueta: 'Oscuro', Icono: Moon },
                  { valor: 'claro', etiqueta: 'Claro', Icono: Sun },
                ] as const
              ).map(({ valor, etiqueta, Icono }) => (
                <label
                  key={valor}
                  className={`press flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl text-[14px] font-medium has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-marca ${
                    tema === valor ? 'bg-elevado text-ink shadow-(--shadow-card)' : 'text-ink-3 hover:text-ink'
                  }`}
                >
                  <input type="radio" name="tema" value={valor} checked={tema === valor} onChange={() => setTema(valor)} className="sr-only" />
                  <Icono size={16} aria-hidden="true" />
                  {etiqueta}
                </label>
              ))}
            </div>
            <p className="mt-2 text-[13px] text-ink-3">El oscuro viene por defecto. Lo que elijas queda guardado en este navegador.</p>
          </fieldset>

          <a
            href="./manual-io-realstate.pdf"
            target="_blank"
            rel="noopener"
            className="press flex min-h-14 items-center gap-3 rounded-2xl border border-line bg-surface px-4 text-[15px] font-medium text-ink hover:bg-sunken"
          >
            <BookOpen size={18} aria-hidden="true" className="text-marca" />
            <span className="flex-1">
              Manual de uso
              <span className="block text-[13px] font-normal text-ink-3">PDF · cómo funciona cada pieza y cada flujo</span>
            </span>
            <ExternalLink size={16} aria-hidden="true" className="text-ink-3" />
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </a>
          <a
            href="./io-realstate-propuesta.pdf"
            target="_blank"
            rel="noopener"
            className="press flex min-h-14 items-center gap-3 rounded-2xl border border-line bg-surface px-4 text-[15px] font-medium text-ink hover:bg-sunken"
          >
            <FileText size={18} aria-hidden="true" className="text-marca" />
            <span className="flex-1">
              Propuesta y planes
              <span className="block text-[13px] font-normal text-ink-3">PDF · qué hace, qué no hace y cuánto cuesta</span>
            </span>
            <ExternalLink size={16} aria-hidden="true" className="text-ink-3" />
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </a>

          <div className="flex gap-3 rounded-2xl border border-line p-4 text-[14px] leading-relaxed text-ink-2">
            <Info size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-ink-3" />
            <p>
              Esta es una demo con datos ficticios: la inmobiliaria, las personas y las propiedades son de ejemplo. Para verla con tu cartera escribinos a{' '}
              <a href="mailto:contacto@ioconsulting.com.ar" className="font-medium text-ink underline decoration-line-2 underline-offset-4 hover:decoration-marca">
                contacto@ioconsulting.com.ar
              </a>
              .
            </p>
          </div>

          <div className="rounded-2xl border border-line p-4">
            <p className="text-[15px] font-medium">Tus datos de prueba</p>
            <p className="mt-1 text-[14px] leading-relaxed text-ink-2">Las búsquedas, avisos, tasaciones, recordatorios y cambios que hagas quedan guardados solo en este navegador.</p>
            {confirmar ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[14px] text-bad">Se borra todo lo que cargaste.</span>
                <button
                  type="button"
                  onClick={() => {
                    restablecerDemo()
                    setConfirmar(false)
                    setCuenta(false)
                  }}
                  className="press inline-flex min-h-11 items-center rounded-full bg-bad px-4 text-[14px] font-medium text-sobre-boton hover:brightness-110"
                >
                  Restablecer la demo
                </button>
                <button type="button" onClick={() => setConfirmar(false)} className="press inline-flex min-h-11 items-center rounded-full px-4 text-[14px] text-ink-2 hover:bg-sunken">
                  Cancelar
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirmar(true)} className="press mt-3 inline-flex min-h-11 items-center rounded-full border border-line-2 px-4 text-[14px] font-medium text-ink hover:bg-sunken">
                Volver a los datos de ejemplo
              </button>
            )}
          </div>
        </div>
      </Sheet>
    </div>
  )
}
