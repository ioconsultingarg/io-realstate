import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CheckCheck, ChevronLeft, FileText, Lock, Pause, Play, RotateCcw } from 'lucide-react'
import type { Mensaje } from '../data/demo'

const ritmo = { cliente: 900, agente: 1300, sistema: 500, asesor: 900 }

/**
 * Conversación con el aspecto de WhatsApp (el teléfono es un dispositivo, no cambia con el tema).
 * En modo "reproducir" los mensajes aparecen de a uno, con "escribiendo…" antes de cada respuesta
 * del agente. Con movimiento reducido se muestra entera de entrada.
 */
export function ChatWhatsApp({ mensajes, contacto, reproducir = false, alto = 'h-[560px]', marco = true }: { mensajes: Mensaje[]; contacto: string; reproducir?: boolean; alto?: string; marco?: boolean }) {
  const reducir = useReducedMotion()
  const animar = reproducir && !reducir
  const [visibles, setVisibles] = useState(animar ? 0 : mensajes.length)
  const [escribiendo, setEscribiendo] = useState(false)
  const [vuelta, setVuelta] = useState(0)
  const [pausa, setPausa] = useState(false)
  const lista = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVisibles(animar ? 0 : mensajes.length)
    setPausa(false)
  }, [mensajes, animar, vuelta])

  useEffect(() => {
    if (pausa) return
    if (!animar || visibles >= mensajes.length) {
      setEscribiendo(false)
      return
    }
    const siguiente = mensajes[visibles]
    const esAgente = siguiente.de === 'agente' || siguiente.de === 'asesor'
    setEscribiendo(esAgente)
    const t = setTimeout(() => setVisibles((v) => v + 1), ritmo[siguiente.de] + (visibles === 0 ? 400 : 0))
    return () => clearTimeout(t)
  }, [animar, visibles, mensajes, pausa])

  useEffect(() => {
    lista.current?.scrollTo({ top: lista.current.scrollHeight, behavior: reducir ? 'auto' : 'smooth' })
  }, [visibles, escribiendo, reducir])

  const terminado = visibles >= mensajes.length

  return (
    <div className={`relative flex ${alto} flex-col overflow-hidden bg-wa-fondo text-wa-texto ${marco ? 'rounded-[34px] border-[6px] border-[#1c1a17] shadow-(--shadow-float) oscuro:border-[#2a2722]' : 'rounded-2xl'}`}>
      {/* barra del chat */}
      <div className="flex items-center gap-3 bg-wa-barra px-3 py-2.5">
        <ChevronLeft size={20} aria-hidden="true" className="text-wa-meta" />
        <span aria-hidden="true" className="inline-flex size-9 items-center justify-center rounded-full bg-[#2a3942] text-[13px] font-semibold">
          {contacto
            .split(' ')
            .map((p) => p[0])
            .join('')
            .slice(0, 2)}
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[15px] font-medium">{contacto}</p>
          <p className="text-[12px] text-wa-meta">{escribiendo ? 'Arce Propiedades está escribiendo…' : 'Arce Propiedades · asistente'}</p>
        </div>
      </div>

      <div ref={lista} className="scroll-fino flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-3" aria-live={animar ? 'polite' : undefined}>
        <p className="mx-auto mb-1 inline-flex items-center gap-1.5 rounded-lg bg-[#182229] px-2.5 py-1 text-center text-[11px] text-[#ffd279]">
          <Lock size={11} aria-hidden="true" />
          Los mensajes están cifrados de extremo a extremo
        </p>
        <AnimatePresence initial={false}>
          {mensajes.slice(0, visibles).map((m, i) => (
            <Burbuja key={`${vuelta}-${i}`} m={m} />
          ))}
          {escribiendo && (
            <motion.div key="escribiendo" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="self-end rounded-lg rounded-tr-sm bg-wa-saliente px-3 py-2.5">
              <span className="escribiendo flex gap-1" role="status" aria-label="Escribiendo">
                <span className="size-1.5 rounded-full bg-wa-texto" />
                <span className="size-1.5 rounded-full bg-wa-texto" />
                <span className="size-1.5 rounded-full bg-wa-texto" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {animar && !terminado && (
        <button
          type="button"
          onClick={() => setPausa((p) => !p)}
          className="press absolute right-3 bottom-3 inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[#2a3942] px-3 text-[13px] font-medium text-wa-texto hover:bg-[#33444f]"
        >
          {pausa ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          {pausa ? 'Seguir' : 'Pausar'}
        </button>
      )}
      {reproducir && terminado && !reducir && (
        <button
          type="button"
          onClick={() => setVuelta((v) => v + 1)}
          className="press absolute right-3 bottom-3 inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[#2a3942] px-3 text-[13px] font-medium text-wa-texto hover:bg-[#33444f]"
        >
          <RotateCcw size={14} aria-hidden="true" />
          Ver de nuevo
        </button>
      )}
    </div>
  )
}

function Burbuja({ m }: { m: Mensaje }) {
  if (m.de === 'sistema') {
    return (
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="mx-auto my-1 max-w-[88%] rounded-lg bg-[#182229] px-2.5 py-1.5 text-center text-[11.5px] leading-snug text-wa-meta">
        {m.texto}
      </motion.p>
    )
  }
  const saliente = m.de === 'agente' || m.de === 'asesor'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
      style={{ transformOrigin: saliente ? 'right bottom' : 'left bottom' }}
      className={`max-w-[84%] rounded-lg px-2.5 pt-1.5 pb-1 text-[14px] leading-snug ${saliente ? 'self-end rounded-tr-sm bg-wa-saliente' : 'self-start rounded-tl-sm bg-wa-entrante'}`}
    >
      {m.adjunto && (
        <div className="mb-1.5 flex items-center gap-2.5 rounded-md bg-black/20 p-2">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-[#e3b968] text-[#15130f]">
            <FileText size={18} aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-medium">{m.adjunto.titulo}</span>
            <span className="block truncate text-[12px] text-wa-meta">{m.adjunto.detalle}</span>
          </span>
        </div>
      )}
      <span>{m.texto}</span>
      {/* en la burbuja verde el gris original de WhatsApp no llega a 4.5:1: se usa un verde claro (4.95:1) */}
      <span className={`float-right mt-1 ml-2 inline-flex items-center gap-0.5 text-[11px] ${saliente ? 'text-[#a8d5c9]' : 'text-wa-meta'}`}>
        <span className="num">{m.hora}</span>
        {saliente && <CheckCheck size={14} aria-hidden="true" className="text-[#53bdeb]" />}
      </span>
    </motion.div>
  )
}
