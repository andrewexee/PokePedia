import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../supabaseClient'
import { Mail, Eye, EyeOff, CornerDownLeft } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = async () => {
    setError('')

    if (!email || !password) {
      setError('Por favor rellena todos los campos.')
      return
    }

    setLoading(true)

    // Consulta directa a la tabla usuarios
    const { data, error: dbError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single()

    setLoading(false)

    if (dbError || !data) {
      setError('Correo o contraseña incorrectos.')
      return
    }

    // Guardamos el usuario en sessionStorage para mantener la sesión
    sessionStorage.setItem('usuario', JSON.stringify(data))
    navigate('/pokedex')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">

      {/* Card contenedor */}
      <div className="bg-gray-100 rounded-2xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center gap-6">

        {/* Pokeball pequeña */}
        <img
          src="/resources/pokeball.png"
          alt="Pokeball"
          className="w-16 h-16 object-contain -mt-14 drop-shadow-md animate-spin-slow"
        />

        {/* Título */}
        <div className="bg-red-500 text-white font-extrabold text-xl tracking-widest px-10 py-2 rounded-lg shadow">
          LOGIN
        </div>

        {/* Campo email */}
        <div className="w-full border-b border-gray-400 flex items-center gap-2 pb-1">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
          />
          <Mail size={18} className="text-gray-400" />
        </div>

        {/* Campo contraseña */}
        <div className="w-full border-b border-gray-400 flex items-center gap-2 pb-1">
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
          />
          <button onClick={() => setShowPass(!showPass)} tabIndex={-1}>
            {showPass
              ? <EyeOff size={18} className="text-gray-400" />
              : <Eye size={18} className="text-gray-400" />}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-xs text-center -mt-2">{error}</p>
        )}

        {/* Restablecer contraseña (visual, sin implementar) */}
        <span className="text-red-400 text-xs cursor-pointer hover:underline -mt-2 self-start">
          Restablecer su contraseña
        </span>

        {/* Botón login + icono volver */}
        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white font-bold py-2 px-8 rounded-full shadow text-sm tracking-wide disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Iniciar Sesión'}
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-300 hover:bg-gray-400 active:scale-95 transition-all rounded-full p-2"
            title="Volver al inicio"
          >
            <CornerDownLeft size={16} className="text-gray-600" />
          </button>
        </div>

      </div>

    </div>
  )
}