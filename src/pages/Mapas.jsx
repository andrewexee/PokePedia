import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const MAPAS = [
  { nombre: 'Johto',  gen: '2ª GEN', archivo: 'mapa-johto.png'  },
  { nombre: 'Sinnoh', gen: '4ª GEN', archivo: 'mapa-sinnoh.png' },
  { nombre: 'Kanto',  gen: '1ª GEN', archivo: 'mapa-kanto.png'  },
]

export default function Mapas() {
  const navigate = useNavigate()

  // Protección de ruta
  useEffect(() => {
    if (!sessionStorage.getItem('usuario')) navigate('/')
  }, [navigate])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {MAPAS.map(mapa => (
            <div
              key={mapa.nombre}
              className="bg-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col items-center p-4 gap-3 cursor-pointer"
            >
              {/* Título */}
              <p className="text-sm font-semibold text-gray-600 tracking-wide">
                {mapa.nombre}{' '}
                <span className="text-gray-400 text-xs">({mapa.gen})</span>
              </p>

              {/* Imagen del mapa */}
              <img
                src={`/resources/${mapa.archivo}`}
                alt={`Mapa ${mapa.nombre}`}
                className="w-full object-contain rounded-lg"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}