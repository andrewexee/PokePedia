import { useEffect, useState } from 'react'
import { X, ChevronRight } from 'lucide-react'

const TYPE_COLORS = {
  fire:     'bg-orange-500', water:    'bg-blue-500',
  grass:    'bg-green-500',  electric: 'bg-yellow-400',
  ice:      'bg-cyan-400',   fighting: 'bg-red-700',
  poison:   'bg-purple-500', ground:   'bg-yellow-600',
  flying:   'bg-indigo-400', psychic:  'bg-pink-500',
  bug:      'bg-lime-500',   rock:     'bg-yellow-800',
  ghost:    'bg-indigo-700', dragon:   'bg-indigo-600',
  dark:     'bg-gray-700',   steel:    'bg-gray-400',
  fairy:    'bg-pink-300',   normal:   'bg-gray-400',
}

const TYPE_ES = {
  fire:'FUEGO', water:'AGUA', grass:'PLANTA', electric:'ELÉCTRICO',
  ice:'HIELO', fighting:'LUCHA', poison:'VENENO', ground:'TIERRA',
  flying:'VOLADOR', psychic:'PSÍQUICO', bug:'BICHO', rock:'ROCA',
  ghost:'FANTASMA', dragon:'DRAGÓN', dark:'SINIESTRO', steel:'ACERO',
  fairy:'HADA', normal:'NORMAL',
}

const STAT_LABELS = {
  hp:'HP', attack:'ATK', defense:'DEF',
  'special-attack':'SP.ATK', 'special-defense':'SP.DEF', speed:'VEL',
}

const STAT_COLORS = {
  hp:'bg-red-400', attack:'bg-orange-400', defense:'bg-yellow-400',
  'special-attack':'bg-blue-400', 'special-defense':'bg-green-400', speed:'bg-pink-400',
}

// Traduce el trigger de evolución a español legible
function traducirTrigger(det) {
  if (!det) return null
  const partes = []

  if (det.min_level)              partes.push(`Nivel ${det.min_level}`)
  if (det.item)                   partes.push(`Usar ${det.item.name.replace(/-/g,' ')}`)
  if (det.held_item)              partes.push(`Llevar ${det.held_item.name.replace(/-/g,' ')}`)
  if (det.known_move)             partes.push(`Conocer ${det.known_move.name.replace(/-/g,' ')}`)
  if (det.known_move_type)        partes.push(`Mov. tipo ${det.known_move_type.name}`)
  if (det.min_happiness !== null && det.min_happiness !== undefined)
                                  partes.push(`Amistad ${det.min_happiness}+`)
  if (det.min_beauty !== null && det.min_beauty !== undefined)
                                  partes.push(`Belleza ${det.min_beauty}+`)
  if (det.min_affection !== null && det.min_affection !== undefined)
                                  partes.push(`Afecto ${det.min_affection}+`)
  if (det.time_of_day && det.time_of_day !== '')
                                  partes.push(det.time_of_day === 'day' ? 'De día' : 'De noche')
  if (det.location)               partes.push(`En ${det.location.name.replace(/-/g,' ')}`)
  if (det.needs_overworld_rain)   partes.push('Con lluvia')
  if (det.turn_upside_down)       partes.push('Boca abajo')
  if (det.trigger?.name === 'trade') partes.push('Intercambio')
  if (det.trigger?.name === 'shed') partes.push('Muda')

  return partes.length > 0 ? partes.join(' · ') : 'Nivel up'
}

// Extrae la cadena evolutiva como array plano de { name, trigger }
function extraerCadena(nodo, triggerDet = null) {
  const resultado = [{ name: nodo.species.name, trigger: triggerDet }]
  for (const evo of nodo.evolves_to) {
    const det = evo.evolution_details?.[0] || null
    resultado.push(...extraerCadena(evo, det))
  }
  return resultado
}

// Mini card para la línea evolutiva
function EvoCard({ pokemon, isActual }) {
  if (!pokemon) return null
  const nombre = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
  const num    = `Nº${String(pokemon.id).padStart(4,'0')}`
  return (
    <div className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all
      ${isActual
        ? 'bg-red-50 border-2 border-red-400 shadow-md'
        : 'bg-gray-50 border border-gray-200'}`}>
      <img
        src={pokemon.sprite}
        alt={pokemon.name}
        className="w-20 h-20 object-contain drop-shadow"
      />
      <p className="text-xs font-bold text-gray-700">{nombre}</p>
      <p className="text-xs text-gray-400">{num}</p>
      <div className="flex gap-1 flex-wrap justify-center">
        {pokemon.types.map(t => (
          <span key={t} className={`${TYPE_COLORS[t] || 'bg-gray-400'} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
            {TYPE_ES[t] || t.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function PokemonModal({ pokemon, onClose }) {
  const [detalles,   setDetalles]   = useState(null)
  const [cadenaEvo,  setCadenaEvo]  = useState([])   // [{ name, trigger, data }]
  const [loadingEvo, setLoadingEvo] = useState(true)

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

  // Cargar detalles completos + cadena evolutiva
  useEffect(() => {
    const cargar = async () => {
      setLoadingEvo(true)
      try {
        // 1. Detalles del pokémon
        const resDet  = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`)
        const dataDet = await resDet.json()
        setDetalles(dataDet)

        // 2. Species → evolution chain url
        const resSp  = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
        const dataSp = await resSp.json()

        const resEvo  = await fetch(dataSp.evolution_chain.url)
        const dataEvo = await resEvo.json()

        // 3. Extraer cadena plana
        const cadenaPlana = extraerCadena(dataEvo.chain)

        // 4. Cargar datos de cada eslabón
        const cadenaConDatos = await Promise.all(
          cadenaPlana.map(async (eslabon) => {
            const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${eslabon.name}`)
            const d = await r.json()
            return {
              ...eslabon,
              data: {
                id:     d.id,
                name:   d.name,
                sprite: d.sprites.other['official-artwork'].front_default || d.sprites.front_default,
                types:  d.types.map(t => t.type.name),
              }
            }
          })
        )

        setCadenaEvo(cadenaConDatos)
      } catch (e) {
        console.error(e)
      }
      setLoadingEvo(false)
    }
    cargar()
  }, [pokemon.id])

  const nombre     = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
  const pokedexNum = `Nº${String(pokemon.id).padStart(4,'0')}`
  const stats      = detalles?.stats || []
  const altura     = detalles ? `${(detalles.height / 10).toFixed(1)} m`  : '—'
  const peso       = detalles ? `${(detalles.weight / 10).toFixed(1)} kg` : '—'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Cabecera roja */}
        <div className="bg-red-500 rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-extrabold text-xl tracking-wide">{nombre}</h2>
            <p className="text-red-200 text-sm">{pokedexNum}</p>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 transition-colors rounded-full p-1.5"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">

          {/* Sprite + tipos + datos básicos */}
          <div className="flex items-center gap-6">
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              className="w-32 h-32 object-contain drop-shadow-lg"
            />
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 flex-wrap">
                {pokemon.types.map(t => (
                  <span key={t} className={`${TYPE_COLORS[t] || 'bg-gray-400'} text-white text-xs font-bold px-3 py-0.5 rounded-full`}>
                    {TYPE_ES[t] || t.toUpperCase()}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                <div>
                  <p className="text-xs text-gray-400">Altura</p>
                  <p className="text-sm font-bold text-gray-700">{altura}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Peso</p>
                  <p className="text-sm font-bold text-gray-700">{peso}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas base */}
          {stats.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-extrabold text-gray-500 tracking-widest uppercase">
                Estadísticas base
              </h3>
              {stats.map(s => (
                <div key={s.stat.name} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 w-16 shrink-0">
                    {STAT_LABELS[s.stat.name] || s.stat.name.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-gray-700 w-8 text-right shrink-0">
                    {s.base_stat}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className={`${STAT_COLORS[s.stat.name] || 'bg-gray-400'} h-2 rounded-full transition-all`}
                      style={{ width: `${Math.min(100, (s.base_stat / 255) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Línea evolutiva */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-extrabold text-gray-500 tracking-widest uppercase">
              Línea evolutiva
            </h3>

            {loadingEvo ? (
              <p className="text-xs text-gray-400 text-center py-4">Cargando evoluciones...</p>
            ) : cadenaEvo.length <= 1 ? (
              <p className="text-xs text-gray-400 text-center py-2">Este Pokémon no evoluciona.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {cadenaEvo.map((eslabon, i) => (
                  <div key={eslabon.name}>
                    {/* Flecha + trigger entre eslabones */}
                    {i > 0 && (
                      <div className="flex items-center justify-center gap-2 py-1">
                        <ChevronRight size={16} className="text-red-400" />
                        <span className="text-xs text-gray-400 font-semibold">
                          {traducirTrigger(eslabon.trigger)}
                        </span>
                        <ChevronRight size={16} className="text-red-400" />
                      </div>
                    )}
                    <EvoCard
                      pokemon={eslabon.data}
                      isActual={eslabon.data?.id === pokemon.id}
                    />
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