import { Shell } from './components/Shell'
import { useRuta } from './lib/ruta'
import { Agentes } from './screens/Agentes'
import { Asistente } from './screens/Asistente'
import { Busquedas } from './screens/Busquedas'
import { Cerebro } from './screens/Cerebro'
import { Conversaciones } from './screens/Conversaciones'
import { Hoy } from './screens/Hoy'

export function App() {
  const { ruta, param } = useRuta()
  return (
    <Shell ruta={ruta}>
      {ruta === 'hoy' && <Hoy />}
      {ruta === 'conversaciones' && <Conversaciones param={param} />}
      {ruta === 'busquedas' && <Busquedas />}
      {ruta === 'asistente' && <Asistente />}
      {ruta === 'agentes' && <Agentes />}
      {ruta === 'cerebro' && <Cerebro />}
    </Shell>
  )
}
