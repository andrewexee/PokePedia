import { useNavigate } from 'react-router-dom'

export default function SplashScreen() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-10 px-4">

      {/* Logo */}
      <img
        src="/resources/pokepedia-logo.png"
        alt="PokePedia"
        className="w-72 object-contain drop-shadow-md"
      />

      {/* Pokeball */}
      <img
        src="/resources/pokeball.png"
        alt="Pokeball"
        className="w-36 h-36 object-contain animate-spin-slow drop-shadow-lg"
      />

      {/* Botones */}
      <div className="flex gap-6 mt-4">
        <button
          onClick={() => navigate('/login')}
          className="bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white font-bold py-2 px-8 rounded-full shadow-md text-sm tracking-wide"
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => navigate('/register')}
          className="bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white font-bold py-2 px-8 rounded-full shadow-md text-sm tracking-wide"
        >
          Registrarse
        </button>
      </div>
    </div>
  )
}
