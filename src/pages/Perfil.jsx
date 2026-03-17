import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Eye, EyeOff, Check, X, Trash2 } from 'lucide-react'
import Navbar    from '../components/Navbar'
import supabase  from '../supabaseClient'

export default function Perfil() {
  const navigate = useNavigate()
  const usuario  = JSON.parse(sessionStorage.getItem('usuario') || '{}')

  const [nombre,          setNombre]          = useState(usuario.nombre || '')
  const [email,           setEmail]           = useState(usuario.email  || '')
  const [passwordActual,  setPasswordActual]  = useState('')
  const [passwordNueva,   setPasswordNueva]   = useState('')
  const [showActual,      setShowActual]      = useState(false)
  const [showNueva,       setShowNueva]       = useState(false)
  const [loading,         setLoading]         = useState(false)
  const [exito,           setExito]           = useState('')
  const [error,           setError]           = useState('')
  const [modalEliminar,   setModalEliminar]   = useState(false)
  const [loadingEliminar, setLoadingEliminar] = useState(false)

  const camposModificados =
    nombre !== usuario.nombre ||
    email  !== usuario.email  ||
    passwordNueva !== ''

  const handleGuardar = async () => {
    setError('')
    setExito('')

    if (!nombre.trim() || !email.trim()) {
      setError('El nombre y el correo no pueden estar vacíos.')
      return
    }

    if (passwordNueva) {
      if (!passwordActual) {
        setError('Introduce tu contraseña actual para poder cambiarla.')
        return
      }
      if (passwordNueva.length < 4) {
        setError('La nueva contraseña debe tener al menos 4 caracteres.')
        return
      }
      if (passwordActual !== usuario.password) {
        setError('La contraseña actual no es correcta.')
        return
      }
    }

    if (email !== usuario.email) {
      const { data: existeEmail } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email)
        .neq('id', usuario.id)
        .single()

      if (existeEmail) {
        setError('Ese correo electrónico ya está en uso por otra cuenta.')
        return
      }
    }

    setLoading(true)

    const updates = {}
    if (nombre !== usuario.nombre) updates.nombre   = nombre.trim()
    if (email  !== usuario.email)  updates.email    = email.trim()
    if (passwordNueva)             updates.password = passwordNueva

    const { error: dbError } = await supabase
      .from('usuarios')
      .update(updates)
      .eq('id', usuario.id)

    setLoading(false)

    if (dbError) {
      setError('Error al guardar los cambios. Inténtalo de nuevo.')
      return
    }

    const usuarioActualizado = { ...usuario, ...updates }
    sessionStorage.setItem('usuario', JSON.stringify(usuarioActualizado))
    setPasswordActual('')
    setPasswordNueva('')
    setExito('¡Perfil actualizado correctamente!')
    setTimeout(() => setExito(''), 3000)
  }

  const handleCancelar = () => {
    setNombre(usuario.nombre || '')
    setEmail(usuario.email   || '')
    setPasswordActual('')
    setPasswordNueva('')
    setError('')
    setExito('')
  }

  const handleEliminarCuenta = async () => {
    setLoadingEliminar(true)

    // Eliminar favoritos del usuario (por si ON DELETE CASCADE no está activo)
    await supabase.from('favoritos').delete().eq('usuario_id', usuario.id)

    // Eliminar usuario
    const { error: dbError } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', usuario.id)

    setLoadingEliminar(false)

    if (dbError) {
      setModalEliminar(false)
      setError('Error al eliminar la cuenta. Inténtalo de nuevo.')
      return
    }

    sessionStorage.removeItem('usuario')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-10">

        <div className="bg-gray-100 rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center gap-6 relative">

          {/* Botón papelera — esquina superior derecha dentro de la tarjeta */}
          <button
            onClick={() => setModalEliminar(true)}
            className="absolute top-4 right-4 rounded-full p-2 transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #ff0000, #9b00ff)',
              boxShadow: '0 0 10px 2px rgba(200,0,255,0.6), 0 0 20px 4px rgba(255,0,0,0.35)',
              border: '2px solid rgba(200,100,255,0.8)',
            }}
            title="Eliminar cuenta"
          >
            <Trash2 size={16} className="text-white drop-shadow" />
          </button>

            {/* Avatar */}
            <div className="bg-red-500 rounded-full p-4 shadow-md -mt-14">
              <User size={32} className="text-white" />
            </div>

            {/* Título */}
            <div className="bg-red-500 text-white font-extrabold text-xl tracking-widest px-10 py-2 rounded-lg shadow">
              PERFIL
            </div>

            {/* Nombre */}
            <div className="w-full flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Nombre</label>
              <div className="border-b border-gray-400 flex items-center gap-2 pb-1">
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                />
                <User size={16} className="text-gray-400" />
              </div>
            </div>

            {/* Email */}
            <div className="w-full flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Correo electrónico</label>
              <div className="border-b border-gray-400 flex items-center gap-2 pb-1">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                />
                <Mail size={16} className="text-gray-400" />
              </div>
            </div>

            {/* Separador */}
            <div className="w-full flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-xs text-gray-400 font-semibold tracking-wide">CAMBIAR CONTRASEÑA</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Contraseña actual */}
            <div className="w-full flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Contraseña actual</label>
              <div className="border-b border-gray-400 flex items-center gap-2 pb-1">
                <input
                  type={showActual ? 'text' : 'password'}
                  value={passwordActual}
                  onChange={e => setPasswordActual(e.target.value)}
                  placeholder="Introduce tu contraseña actual"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                />
                <button onClick={() => setShowActual(!showActual)} tabIndex={-1}>
                  {showActual ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Contraseña nueva */}
            <div className="w-full flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Nueva contraseña</label>
              <div className="border-b border-gray-400 flex items-center gap-2 pb-1">
                <input
                  type={showNueva ? 'text' : 'password'}
                  value={passwordNueva}
                  onChange={e => setPasswordNueva(e.target.value)}
                  placeholder="Deja vacío para no cambiarla"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                />
                <button onClick={() => setShowNueva(!showNueva)} tabIndex={-1}>
                  {showNueva ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Error / Éxito */}
            {error && (
              <div className="w-full flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <X size={14} className="text-red-500 shrink-0" />
                <p className="text-red-500 text-xs">{error}</p>
              </div>
            )}
            {exito && (
              <div className="w-full flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <Check size={14} className="text-green-500 shrink-0" />
                <p className="text-green-600 text-xs">{exito}</p>
              </div>
            )}

            {/* Botones guardar / cancelar */}
            <div className="flex gap-3 w-full mt-1">
              <button
                onClick={handleCancelar}
                disabled={!camposModificados || loading}
                className="flex-1 py-2 rounded-full text-sm font-bold text-gray-500 border border-gray-300 hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={!camposModificados || loading}
                className="flex-1 py-2 rounded-full text-sm font-bold bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all shadow disabled:opacity-40"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>

          </div>

      </main>

      {/* Modal confirmación eliminar cuenta */}
      {modalEliminar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
          onClick={() => setModalEliminar(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-5"
            onClick={e => e.stopPropagation()}
          >
            {/* Icono */}
            <div className="bg-red-100 rounded-full p-4">
              <Trash2 size={32} className="text-red-500" />
            </div>

            {/* Texto */}
            <div className="text-center flex flex-col gap-2">
              <h3 className="text-lg font-extrabold text-gray-800">¿Eliminar cuenta?</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Esta acción es <span className="font-bold text-red-500">irreversible</span>. Se borrarán
                tu cuenta y todos tus Pokémon favoritos de forma permanente.
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setModalEliminar(false)}
                disabled={loadingEliminar}
                className="flex-1 py-2 rounded-full text-sm font-bold text-gray-500 border border-gray-300 hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminarCuenta}
                disabled={loadingEliminar}
                className="flex-1 py-2 rounded-full text-sm font-bold bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all shadow disabled:opacity-60"
              >
                {loadingEliminar ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}