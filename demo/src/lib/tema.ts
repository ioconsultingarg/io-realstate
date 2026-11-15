import { useState } from 'react'

export type Tema = 'oscuro' | 'claro'

function actual(): Tema {
  return document.documentElement.dataset.tema === 'claro' ? 'claro' : 'oscuro'
}

/** oscuro es el predeterminado; el claro se elige desde la cuenta y se recuerda en este navegador */
export function useTema() {
  const [tema, setTemaEstado] = useState<Tema>(actual)
  function setTema(t: Tema) {
    document.documentElement.dataset.tema = t
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'oscuro' ? '#0f0e0c' : '#f5f2ec')
    try {
      localStorage.setItem('iors-tema', t)
    } catch {
      /* sin almacenamiento: el tema vale solo para esta visita */
    }
    setTemaEstado(t)
  }
  return { tema, setTema }
}
