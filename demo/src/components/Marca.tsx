/*
 * Marca IO-RealState — "llave de casa".
 * La barra es la I; la O se volvió una casa de un solo trazo (techo a dos aguas sobre un
 * cuerpo redondeado). El punto de latón es la ventana encendida: alguien atiende.
 * Un trazo, sin degradados: se lee a 16 px y en blanco y negro.
 */
export function Marca({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21 L12 47" strokeWidth="7" />
        <path d="M29 30 L42.5 18.5 L56 30 L56 41 Q56 47 50 47 L35 47 Q29 47 29 41 Z" strokeWidth="6.5" />
      </g>
      <rect x="39.5" y="32" width="6" height="6" rx="1.6" fill="var(--color-marca)" />
    </svg>
  )
}
