import { useEffect, useState } from 'react'
import { X, MapPin, Loader2 } from 'lucide-react'

// Slugs de las regiones en la PokeAPI
const REGION_SLUGS = {
  kanto:   'kanto',
  johto:   'johto',
  hoenn:   'hoenn',
  sinnoh:  'sinnoh',
  teselia: 'unova',
  kalos:   'kalos',
  alola:   'alola',
  galar:   'galar',
  paldea:  'paldea',
}

export default function MapaModal({ mapa, onClose }) {
  const [localizaciones, setLocalizaciones] = useState([])
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState(false)

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

  // Cargar localizaciones de la región desde PokeAPI
  useEffect(() => {
    const cargar = async () => {
      setLoading(true)
      setError(false)
      try {
        const slug = REGION_SLUGS[mapa.nombre.toLowerCase()] || mapa.nombre.toLowerCase()
        const res  = await fetch(`https://pokeapi.co/api/v2/region/${slug}`)
        if (!res.ok) throw new Error()
        const data = await res.json()

        // Cargar nombres de las localizaciones
        const locs = await Promise.all(
          data.locations.map(async (loc) => {
            const r = await fetch(loc.url)
            const d = await r.json()
            // Buscar nombre en español, si no inglés
            const nombreEs = d.names?.find(n => n.language.name === 'es')?.name
                          || d.names?.find(n => n.language.name === 'en')?.name
                          || loc.name.replace(/-/g, ' ')
            return nombreEs
          })
        )
        setLocalizaciones(locs.sort())
      } catch {
        setError(true)
      }
      setLoading(false)
    }
    cargar()
  }, [mapa.nombre])

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
        {/* Cabecera roja */}
        <div className="bg-red-500 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-white font-extrabold text-xl tracking-wide">{mapa.nombre}</h2>
            <p className="text-red-200 text-sm">{mapa.gen} — {mapa.juegos}</p>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 transition-colors rounded-full p-1.5"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-6">

          {/* Imagen del mapa */}
          <div className="rounded-xl overflow-hidden shadow-md border border-gray-100 shrink-0">
            <img
              src={`/resources/${mapa.archivo}`}
              alt={`Mapa ${mapa.nombre}`}
              className="w-full h-56 object-cover object-center"
            />
          </div>

          {/* Info general */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-0.5">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Generación</p>
              <p className="text-sm font-bold text-gray-700">{mapa.gen}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-0.5">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Región</p>
              <p className="text-sm font-bold text-gray-700">{mapa.nombre}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-0.5">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Juegos</p>
              <p className="text-sm font-bold text-gray-700">{mapa.juegos}</p>
            </div>
          </div>

          {/* Descripción */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 leading-relaxed">{mapa.descripcion}</p>
          </div>

          {/* Localizaciones */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-extrabold text-gray-500 tracking-widest uppercase flex items-center gap-2">
              <MapPin size={14} className="text-red-400" />
              Localizaciones
            </h3>

            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-sm py-4 justify-center">
                <Loader2 size={16} className="animate-spin text-red-400" />
                Cargando localizaciones...
              </div>
            )}

            {error && !loading && (
              <p className="text-xs text-gray-400 text-center py-2">
                No se pudieron cargar las localizaciones.
              </p>
            )}

            {!loading && !error && localizaciones.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {localizaciones.map((loc, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 flex items-center gap-1.5"
                  >
                    <MapPin size={11} className="text-red-300 shrink-0" />
                    <span className="text-xs text-gray-600 font-medium capitalize">{loc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}