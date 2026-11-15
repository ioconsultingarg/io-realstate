import { useSyncExternalStore } from 'react'

/*
 * Estado persistente de la demo. Cada "almacén" guarda un valor en localStorage bajo el prefijo iors:,
 * avisa a los componentes que lo usan y sobrevive a recargas. Si el navegador no deja guardar
 * (modo privado, almacenamiento bloqueado), la demo funciona igual durante la visita.
 */

const PREFIJO = 'iors:'
const todos = new Set<{ reiniciar: () => void }>()

export interface Almacen<T> {
  usar: () => T
  leer: () => T
  cambiar: (fn: (actual: T) => T) => void
  reiniciar: () => void
}

export function crearAlmacen<T>(clave: string, inicial: () => T): Almacen<T> {
  const llave = PREFIJO + clave
  const oyentes = new Set<() => void>()
  let valor: T = (() => {
    try {
      const guardado = localStorage.getItem(llave)
      if (guardado) return JSON.parse(guardado) as T
    } catch {
      /* sin almacenamiento: se usa el valor inicial */
    }
    return inicial()
  })()

  const avisar = () => oyentes.forEach((o) => o())
  const guardar = () => {
    try {
      localStorage.setItem(llave, JSON.stringify(valor))
    } catch {
      /* el cambio vale solo para esta visita */
    }
  }

  const almacen: Almacen<T> = {
    usar: () =>
      useSyncExternalStore(
        (o) => {
          oyentes.add(o)
          return () => oyentes.delete(o)
        },
        () => valor,
      ),
    leer: () => valor,
    cambiar: (fn) => {
      valor = fn(valor)
      guardar()
      avisar()
    },
    reiniciar: () => {
      valor = inicial()
      try {
        localStorage.removeItem(llave)
      } catch {
        /* nada que borrar */
      }
      avisar()
    },
  }
  todos.add(almacen)
  return almacen
}

/** vuelve toda la demo al estado original (botón de la cuenta) */
export function restablecerDemo() {
  todos.forEach((a) => a.reiniciar())
}

export const nuevoId = () => Math.random().toString(36).slice(2, 10)
