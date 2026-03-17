import { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'

const TIPOS = [
  { nombre: 'Normal',    en: 'normal',   color: 'bg-gray-400',    text: 'text-white' },
  { nombre: 'Fuego',     en: 'fire',     color: 'bg-orange-500',  text: 'text-white' },
  { nombre: 'Agua',      en: 'water',    color: 'bg-blue-500',    text: 'text-white' },
  { nombre: 'Planta',    en: 'grass',    color: 'bg-green-500',   text: 'text-white' },
  { nombre: 'Eléctrico', en: 'electric', color: 'bg-yellow-400',  text: 'text-gray-800' },
  { nombre: 'Hielo',     en: 'ice',      color: 'bg-cyan-400',    text: 'text-white' },
  { nombre: 'Lucha',     en: 'fighting', color: 'bg-red-700',     text: 'text-white' },
  { nombre: 'Veneno',    en: 'poison',   color: 'bg-purple-500',  text: 'text-white' },
  { nombre: 'Tierra',    en: 'ground',   color: 'bg-yellow-600',  text: 'text-white' },
  { nombre: 'Volador',   en: 'flying',   color: 'bg-indigo-400',  text: 'text-white' },
  { nombre: 'Psíquico',  en: 'psychic',  color: 'bg-pink-500',    text: 'text-white' },
  { nombre: 'Bicho',     en: 'bug',      color: 'bg-lime-500',    text: 'text-white' },
  { nombre: 'Roca',      en: 'rock',     color: 'bg-yellow-800',  text: 'text-white' },
  { nombre: 'Fantasma',  en: 'ghost',    color: 'bg-indigo-700',  text: 'text-white' },
  { nombre: 'Dragón',    en: 'dragon',   color: 'bg-indigo-600',  text: 'text-white' },
  { nombre: 'Siniestro', en: 'dark',     color: 'bg-gray-700',    text: 'text-white' },
  { nombre: 'Acero',     en: 'steel',    color: 'bg-gray-400',    text: 'text-white' },
  { nombre: 'Hada',      en: 'fairy',    color: 'bg-pink-300',    text: 'text-white' },
]

const TIPO_MAP = Object.fromEntries(TIPOS.map(t => [t.en, t]))

// Chip de tipo reutilizable
function TipoBadge({ en }) {
  const t = TIPO_MAP[en]
  if (!t) return null
  return (
    <span className={`${t.color} ${t.text} text-xs font-bold px-3 py-1 rounded-full shadow-sm`}>
      {t.nombre}
    </span>
  )
}

// Sección de efectividad
function SeccionEfectividad({ titulo, color, tipos }) {
  if (!tipos || tipos.length === 0) return null
  return (
    <div className="flex flex-col gap-2">
      <p className={`text-xs font-extrabold tracking-widest uppercase ${color}`}>{titulo}</p>
      <div className="flex flex-wrap gap-2">
        {tipos.map(t => <TipoBadge key={t} en={t} />)}
      </div>
    </div>
  )
}

export default function TiposModal({ onClose }) {
  const [tipoSel,    setTipoSel]    = useState(null)
  const [efectos,    setEfectos]    = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState(false)

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // Cargar efectividades del tipo seleccionado
  useEffect(() => {
    if (!tipoSel) return
    const cargar = async () => {
      setLoading(true)
      setError(false)
      setEfectos(null)
      try {
        const res  = await fetch(`https://pokeapi.co/api/v2/type/${tipoSel.en}`)
        const data = await res.json()
        const dr   = data.damage_relations

        setEfectos({
          efectivo:    dr.double_damage_to.map(t => t.name),
          debil:       dr.half_damage_to.map(t => t.name),
          noEfectivo:  dr.no_damage_to.map(t => t.name),
          fuerte:      dr.double_damage_from.map(t => t.name),
          resistente:  dr.half_damage_from.map(t => t.name),
          inmune:      dr.no_damage_from.map(t => t.name),
        })
      } catch {
        setError(true)
      }
      setLoading(false)
    }
    cargar()
  }, [tipoSel])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="bg-red-500 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-white font-extrabold text-xl tracking-wide">Tabla de Tipos</h2>
            <p className="text-red-200 text-sm">
              {tipoSel ? `Seleccionado: ${tipoSel.nombre}` : 'Selecciona un tipo para ver sus efectividades'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {tipoSel && (
              <button
                onClick={() => { setTipoSel(null); setEfectos(null) }}
                className="bg-white/20 hover:bg-white/30 transition-colors rounded-full px-3 py-1 text-white text-xs font-bold"
              >
                ← Volver
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 transition-colors rounded-full p-1.5"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Contenido scrollable */}
        <div className="overflow-y-auto flex-1 p-6">

          {/* Grid de tipos — 6 columnas x 3 filas */}
          {!tipoSel && (
            <div className="grid grid-cols-6 gap-3">
              {TIPOS.map(tipo => (
                <button
                  key={tipo.en}
                  onClick={() => setTipoSel(tipo)}
                  className={`${tipo.color} ${tipo.text} font-bold text-xs py-3 px-1 rounded-xl shadow-md
                    hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-150 text-center`}
                >
                  {tipo.nombre}
                </button>
              ))}
            </div>
          )}

          {/* Detalle del tipo seleccionado */}
          {tipoSel && (
            <div className="flex flex-col gap-5">

              {/* Badge grande del tipo */}
              <div className="flex justify-center">
                <span className={`${tipoSel.color} ${tipoSel.text} text-lg font-extrabold px-8 py-2 rounded-full shadow-md tracking-widest`}>
                  {tipoSel.nombre.toUpperCase()}
                </span>
              </div>

              {/* Spinner */}
              {loading && (
                <div className="flex items-center justify-center gap-2 text-gray-400 py-8">
                  <Loader2 size={20} className="animate-spin text-red-400" />
                  <span className="text-sm">Cargando efectividades...</span>
                </div>
              )}

              {/* Error */}
              {error && !loading && (
                <p className="text-center text-gray-400 text-sm py-4">
                  No se pudieron cargar las efectividades.
                </p>
              )}

              {/* Efectividades */}
              {efectos && !loading && (
                <>
                  {/* Atacando */}
                  <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-4">
                    <p className="text-xs font-extrabold text-gray-400 tracking-widest uppercase">
                      Cuando ataca
                    </p>
                    <SeccionEfectividad
                      titulo="✅ Súper efectivo contra"
                      color="text-green-600"
                      tipos={efectos.efectivo}
                    />
                    <SeccionEfectividad
                      titulo="⚡ Poco efectivo contra"
                      color="text-yellow-600"
                      tipos={efectos.debil}
                    />
                    <SeccionEfectividad
                      titulo="❌ No afecta a"
                      color="text-gray-400"
                      tipos={efectos.noEfectivo}
                    />
                  </div>

                  {/* Defendiendo */}
                  <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-4">
                    <p className="text-xs font-extrabold text-gray-400 tracking-widest uppercase">
                      Cuando defiende
                    </p>
                    <SeccionEfectividad
                      titulo="⚠️ Vulnerable a"
                      color="text-red-500"
                      tipos={efectos.fuerte}
                    />
                    <SeccionEfectividad
                      titulo="🛡️ Resistente a"
                      color="text-blue-500"
                      tipos={efectos.resistente}
                    />
                    <SeccionEfectividad
                      titulo="🚫 Inmune a"
                      color="text-gray-500"
                      tipos={efectos.inmune}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}