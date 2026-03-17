import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Github, Globe, Database, Wind, Layers, Code2, Star } from 'lucide-react'

const TECNOLOGIAS = [
  {
    icono:       <Globe size={20} className="text-blue-500" />,
    nombre:      'React + JavaScript',
    descripcion: 'Librería principal para la construcción de la SPA.',
  },
  {
    icono:       <Wind size={20} className="text-cyan-500" />,
    nombre:      'Tailwind CSS',
    descripcion: 'Framework de utilidades CSS para el diseño y los estilos.',
  },
  {
    icono:       <Database size={20} className="text-green-500" />,
    nombre:      'Supabase (PostgreSQL)',
    descripcion: 'Base de datos en la nube para usuarios y favoritos.',
  },
  {
    icono:       <Layers size={20} className="text-orange-500" />,
    nombre:      'PokéAPI',
    descripcion: 'API pública consumida para obtener todos los datos Pokémon.',
  },
  {
    icono:       <Code2 size={20} className="text-purple-500" />,
    nombre:      'React Router',
    descripcion: 'Gestión de rutas y navegación entre pantallas.',
  },
]

export default function Ajustes() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!sessionStorage.getItem('usuario')) navigate('/')
  }, [navigate])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-lg flex flex-col gap-6">

          {/* Cabecera app */}
          <div className="bg-gray-100 rounded-2xl shadow-md p-8 flex flex-col items-center gap-3">
            <img
              src="/resources/pokeball.png"
              alt="Pokeball"
              className="w-20 h-20 object-contain drop-shadow-md"
            />
            <img
              src="/resources/pokepedia-logo.png"
              alt="PokePedia"
              className="h-12 object-contain"
            />
            <span className="bg-red-500 text-white text-xs font-bold px-4 py-1 rounded-full tracking-widest shadow">
              VERSIÓN 1.6
            </span>
            <p className="text-gray-500 text-sm text-center leading-relaxed mt-1">
              PokePedia es una Pokédex interactiva inspirada en la app WikiDex, donde puedes
              explorar los más de 1000 Pokémon existentes, filtrarlos por tipo, generación
              o número, guardar tus favoritos y consultar la tabla de tipos y los mapas de
              cada región. Todo desde una interfaz moderna, rápida y siempre disponible.
            </p>
          </div>

          {/* Tecnologías */}
          <div className="bg-gray-100 rounded-2xl shadow-md p-6 flex flex-col gap-4">
            <h2 className="text-sm font-extrabold text-gray-700 tracking-widest uppercase">
              Tecnologías empleadas
            </h2>
            <div className="flex flex-col gap-3">
              {TECNOLOGIAS.map(t => (
                <div key={t.nombre} className="flex items-start gap-3">
                  <div className="bg-white rounded-xl p-2 shadow-sm shrink-0">
                    {t.icono}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">{t.nombre}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub */}
          <div className="bg-gray-100 rounded-2xl shadow-md p-6 flex flex-col gap-3">
            <h2 className="text-sm font-extrabold text-gray-700 tracking-widest uppercase">
              Desarrollador
            </h2>
            <p className="text-sm text-gray-500">
              ¿Te ha molado la APP? Si te interesan este tipo de proyectos, 
              visita mi perfil de GitHub donde encontrarás
              el resto de mis trabajos y repositorios.
            </p>
            <a
              href="https://github.com/andrewexee"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 active:scale-95 transition-all text-white font-bold py-2.5 px-6 rounded-full shadow text-sm tracking-wide"
            >
              <Github size={18} />
              github.com/andrewexee
            </a>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-1 text-xs text-gray-300 pb-4">
            <Star size={11} className="fill-gray-300 text-gray-300" />
            <span>PokePedia v1.0 — Andrés Iglesias Camacho</span>
            <Star size={11} className="fill-gray-300 text-gray-300" />
          </div>

        </div>
      </main>
    </div>
  )
}