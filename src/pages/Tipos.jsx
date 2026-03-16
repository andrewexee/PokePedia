import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Tipos() {
  const navigate = useNavigate()

  // Protección de ruta
  useEffect(() => {
    if (!sessionStorage.getItem('usuario')) navigate('/')
  }, [navigate])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl flex flex-col items-center gap-4">

          <h2 className="text-gray-500 text-sm font-semibold tracking-widest uppercase">
            Tabla de Tipos
          </h2>

          <img
            src="/resources/tipos-tabla.jpg"
            alt="Tabla de tipos Pokémon"
            className="w-full object-contain rounded-xl shadow-lg"
          />

        </div>
      </main>
    </div>
  )
}