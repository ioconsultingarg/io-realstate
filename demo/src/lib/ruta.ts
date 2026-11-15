import { useEffect, useState } from 'react'

export type Ruta = 'hoy' | 'conversaciones' | 'busquedas' | 'asistente' | 'agentes' | 'cerebro'

const rutas: Record<string, Ruta> = {
  '': 'hoy',
  '/': 'hoy',
  '/conversaciones': 'conversaciones',
  '/busquedas': 'busquedas',
  '/asistente': 'asistente',
  '/agentes': 'agentes',
  '/cerebro': 'cerebro',
}

function leer(): { ruta: Ruta; param: string | null } {
  const [camino, consulta] = window.location.hash.replace(/^#/, '').split('?')
  const ruta = rutas[camino] ?? 'hoy'
  const param = new URLSearchParams(consulta ?? '').get('id')
  return { ruta, param }
}

/** router mínimo por hash: funciona igual en GitHub Pages y en local */
export function useRuta() {
  const [estado, setEstado] = useState(leer)
  useEffect(() => {
    const alCambiar = () => {
      setEstado(leer())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])
  return estado
}
