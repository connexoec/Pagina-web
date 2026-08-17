import { lazy, Suspense, useEffect } from 'react'
import { RouterProvider, useRouter } from './router'
import Landing from './Landing'
import { FilmGrain, Spotlight } from './components/fx/Ambient'

// La RED CONNEXO es una página aparte: su código no viaja con la portada.
const RedPage = lazy(() => import('./pages/RedPage'))

const TITLES: Record<string, string> = {
  '/': 'Connexo · Tu identidad digital como motor de ventas',
  '/red': 'RED CONNEXO · El directorio de emprendedores de Connexo',
}

function Routes() {
  const { path } = useRouter()

  // El <title> acompaña a la ruta: importa para el historial y para compartir.
  useEffect(() => {
    document.title = TITLES[path] ?? TITLES['/']
  }, [path])

  if (path === '/red') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-abyss-950" aria-hidden />}>
        <RedPage />
      </Suspense>
    )
  }

  // Cualquier otra ruta cae en la portada.
  return <Landing />
}

export default function App() {
  return (
    <RouterProvider>
      {/* Atmósfera global — vive por encima de las rutas para no remontarse
          en cada navegación (el grano parpadearía). */}
      <FilmGrain />
      <Spotlight />
      <Routes />
    </RouterProvider>
  )
}
