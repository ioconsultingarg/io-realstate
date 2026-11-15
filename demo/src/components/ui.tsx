import type { ComponentProps, ReactNode } from 'react'
import {
  BadgeCheck,
  BookOpenCheck,
  Building2,
  Calculator,
  FileSignature,
  Flame,
  GraduationCap,
  Handshake,
  KeyRound,
  Megaphone,
  MessagesSquare,
  Minus,
  ShieldCheck,
  Snowflake,
  ThermometerSun,
  UserRoundCheck,
  type LucideIcon,
} from 'lucide-react'
import type { Agente, Temperatura } from '../data/demo'

export const iconoAgente: Record<Agente, LucideIcon> = {
  atencion: MessagesSquare,
  captacion: KeyRound,
  tasacion: Calculator,
  marketing: Megaphone,
  capacitacion: GraduationCap,
  ventas: Handshake,
  alquileres: Building2,
  direccion: BookOpenCheck,
  publicidad: Megaphone,
  contratos: FileSignature,
  cumplimiento: ShieldCheck,
}

type Variante = 'primario' | 'secundario' | 'fantasma' | 'ia'

const estilos: Record<Variante, string> = {
  primario: 'bg-boton text-sobre-boton hover:bg-boton-hover shadow-(--shadow-card)',
  secundario: 'border border-line-2 bg-surface text-ink hover:bg-sunken',
  fantasma: 'text-ink-2 hover:bg-sunken hover:text-ink',
  ia: 'bg-ia-soft text-ia hover:brightness-110 ring-1 ring-ia/25',
}

export function Boton({
  variante = 'primario',
  icono: Icono,
  children,
  className = '',
  ...props
}: { variante?: Variante; icono?: LucideIcon; children: ReactNode } & ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={`press inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-[14px] font-medium whitespace-nowrap disabled:opacity-50 ${estilos[variante]} ${className}`}
      {...props}
    >
      {Icono && <Icono size={16} strokeWidth={2} aria-hidden="true" className="-ml-0.5" />}
      {children}
    </button>
  )
}

export function Enlace({ href, children, variante = 'secundario', icono: Icono }: { href: string; children: ReactNode; variante?: Variante; icono?: LucideIcon }) {
  return (
    <a href={href} className={`press inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-[14px] font-medium whitespace-nowrap ${estilos[variante]}`}>
      {Icono && <Icono size={16} strokeWidth={2} aria-hidden="true" className="-ml-0.5" />}
      {children}
    </a>
  )
}

export function Encabezado({ ceja, titulo, acento, bajada, derecha }: { ceja: string; titulo: string; acento?: string; bajada?: ReactNode; derecha?: ReactNode }) {
  return (
    <header className="plano mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl animate-entrar">
        <p className="ceja">{ceja}</p>
        <h1 className="titular mt-3 text-[44px] text-ink sm:text-[60px]">
          {titulo}
          {acento && <em className="text-marca"> {acento}</em>}
        </h1>
        {bajada && <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-2">{bajada}</p>}
      </div>
      {derecha}
    </header>
  )
}

const temperaturas: Record<Temperatura, { etiqueta: string; Icono: LucideIcon; clase: string }> = {
  caliente: { etiqueta: 'Caliente', Icono: Flame, clase: 'bg-bad-soft text-bad' },
  tibio: { etiqueta: 'Tibio', Icono: ThermometerSun, clase: 'bg-warn-soft text-warn' },
  frio: { etiqueta: 'Frío', Icono: Snowflake, clase: 'bg-sunken text-ink-3' },
  derivado: { etiqueta: 'Con asesor', Icono: UserRoundCheck, clase: 'bg-ok-soft text-ok' },
}

export function ChipTemperatura({ t }: { t: Temperatura }) {
  const { etiqueta, Icono, clase } = temperaturas[t]
  return (
    <span className={`inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2 text-[12px] font-medium ${clase}`}>
      <Icono size={12} strokeWidth={2.2} aria-hidden="true" />
      {etiqueta}
    </span>
  )
}

export function Chip({ children, tono = 'neutro' }: { children: ReactNode; tono?: 'neutro' | 'marca' | 'ia' | 'ok' | 'warn' }) {
  const clase = {
    neutro: 'bg-sunken text-ink-2',
    marca: 'bg-marca-soft text-marca',
    ia: 'bg-ia-soft text-ia',
    ok: 'bg-ok-soft text-ok',
    warn: 'bg-warn-soft text-warn',
  }[tono]
  return <span className={`inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2 text-[12px] font-medium whitespace-nowrap ${clase}`}>{children}</span>
}

/** sello que acompaña a todo lo que produce un agente: quién lo hizo y quién lo aprueba */
export function SelloAgente({ agente, nombre, aprobacion }: { agente: Agente; nombre: string; aprobacion?: string }) {
  const Icono = iconoAgente[agente]
  return (
    <div className="flex flex-wrap items-center gap-2 text-[13px] text-ink-3">
      <span className="inline-flex size-7 items-center justify-center rounded-lg bg-ia-soft text-ia">
        <Icono size={15} aria-hidden="true" />
      </span>
      <span className="font-medium text-ink-2">{nombre}</span>
      {aprobacion && (
        <span className="inline-flex items-center gap-1">
          <Minus size={12} aria-hidden="true" />
          <BadgeCheck size={14} aria-hidden="true" className="text-marca" />
          {aprobacion}
        </span>
      )}
    </div>
  )
}
