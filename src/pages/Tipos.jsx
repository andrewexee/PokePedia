import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar      from '../components/Navbar'
import TiposModal  from '../components/TiposModal'

export default function Tipos() {
  const navigate = useNavigate()
  const [modalAbierto, setModalAbierto] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem('usuario')) navigate('/')
  }, [navigate])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl flex flex-col items-center gap-4">

          <h2 className="text-gray-500 text-sm font-semibold tracking-widest uppercase">
            Tabla de Tipos
          </h2>

          <div
            onClick={() => setModalAbierto(true)}
            className="bg-gray-100 rounded-2xl shadow-md p-4 w-full flex items-center justify-center
              cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group"
          >
            <img
              src="/resources/tipos-tabla.jpg"
              alt="Tabla de tipos Pokémon"
              className="w-4/5 object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-200"
            />
          </div>

          <p className="text-xs text-gray-400">Haz clic en la tabla para explorar las efectividades de cada tipo</p>

        </div>
      </main>

      {modalAbierto && (
        <TiposModal onClose={() => setModalAbierto(false)} />
      )}
    </div>
  )
}