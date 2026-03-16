import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../supabaseClient'
import { User, Mail, Eye, EyeOff, CornerDownLeft } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()

  const [nombre, setNombre]     = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [loading, setLoading]   = useState(false)

  const handleRegister = async () => {
    setError('')
    setSuccess('')

    if (!nombre || !email || !password) {
      setError('Por favor rellena todos los campos.')
      return
    }

    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.')
      return
    }

    setLoading(true)

    // Comprobar si el email ya existe
    const { data: existe } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single()

    if (existe) {
      setLoading(false)
      setError('Ya existe una cuenta con ese correo electrónico.')
      return
    }

    // Insertar nuevo usuario
    const { error: insertError } = await supabase
      .from('usuarios')
      .insert([{ nombre, email, password, rol: 'USER' }])

    setLoading(false)

    if (insertError) {
      setError('Error al registrar. Inténtalo de nuevo.')
      return
    }

    setSuccess('¡Cuenta creada correctamente! Redirigiendo...')
    setTimeout(() => navigate('/login'), 1800)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">

      {/* Card contenedor */}
      <div className="bg-gray-100 rounded-2xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center gap-6">

        {/* Pokeball pequeña */}
        <img
          src="/resources/pokeball.png"
          alt="Pokeball"
          className="w-16 h-16 object-contain -mt-14 drop-shadow-md"
        />

        {/* Título */}
        <div className="bg-red-500 text-white font-extrabold text-xl tracking-widest px-10 py-2 rounded-lg shadow">
          REGISTER
        </div>

        {/* Campo nombre */}
        <div className="w-full border-b border-gray-400 flex items-center gap-2 pb-1">
          <input
            type="text"
            placeholder="Nombre Completo"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
          />
          <User size={18} className="text-gray-400" />
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
            onKeyDown={e => e.key === 'Enter' && handleRegister()}
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
          />
          <button onClick={() => setShowPass(!showPass)} tabIndex={-1}>
            {showPass
              ? <EyeOff size={18} className="text-gray-400" />
              : <Eye size={18} className="text-gray-400" />}
          </button>
        </div>

        {/* Error / Éxito */}
        {error   && <p className="text-red-500 text-xs text-center -mt-2">{error}</p>}
        {success && <p className="text-green-500 text-xs text-center -mt-2">{success}</p>}

        {/* Botón registro + icono volver */}
        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white font-bold py-2 px-8 rounded-full shadow text-sm tracking-wide disabled:opacity-60"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
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