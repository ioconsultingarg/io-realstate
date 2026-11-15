import { useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'

/**
 * Panel lateral. Entra y sale por el mismo lado, con la misma curva que el fondo (se mueven como
 * una unidad). Esc cierra, el foco entra al panel y vuelve a donde estaba al cerrar.
 */
export function Sheet({ abierto, onCerrar, titulo, ancho = 'max-w-[520px]', children }: { abierto: boolean; onCerrar: () => void; titulo: string; ancho?: string; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null)
  const reducir = useReducedMotion()

  useEffect(() => {
    if (!abierto) return
    const previo = document.activeElement as HTMLElement | null
    panel.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCerrar()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previo?.focus()
    }
  }, [abierto, onCerrar])

  const transicion = reducir ? { duration: 0 } : { duration: 0.32, ease: [0.32, 0.72, 0, 1] as const }

  return (
    <AnimatePresence>
      {abierto && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transicion}
            onClick={onCerrar}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={titulo}
            tabIndex={-1}
            className={`absolute inset-y-0 right-0 flex w-full ${ancho} flex-col bg-paper shadow-(--shadow-sheet) outline-none`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={transicion}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <p className="ceja">{titulo}</p>
              <button type="button" onClick={onCerrar} aria-label="Cerrar" className="press inline-flex size-11 items-center justify-center rounded-full text-ink-2 hover:bg-sunken">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="scroll-fino min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
