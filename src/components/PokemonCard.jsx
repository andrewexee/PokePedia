import { Star } from 'lucide-react'

// Colores por tipo Pokémon
const TYPE_COLORS = {
  fire:     'bg-orange-500',
  water:    'bg-blue-500',
  grass:    'bg-green-500',
  electric: 'bg-yellow-400',
  ice:      'bg-cyan-400',
  fighting: 'bg-red-700',
  poison:   'bg-purple-500',
  ground:   'bg-yellow-600',
  flying:   'bg-indigo-400',
  psychic:  'bg-pink-500',
  bug:      'bg-lime-500',
  rock:     'bg-yellow-800',
  ghost:    'bg-indigo-700',
  dragon:   'bg-indigo-600',
  dark:     'bg-gray-700',
  steel:    'bg-gray-400',
  fairy:    'bg-pink-300',
  normal:   'bg-gray-400',
}

const TYPE_ES = {
  fire:     'FUEGO',
  water:    'AGUA',
  grass:    'PLANTA',
  electric: 'ELÉCTRICO',
  ice:      'HIELO',
  fighting: 'LUCHA',
  poison:   'VENENO',
  ground:   'TIERRA',
  flying:   'VOLADOR',
  psychic:  'PSÍQUICO',
  bug:      'BICHO',
  rock:     'ROCA',
  ghost:    'FANTASMA',
  dragon:   'DRAGÓN',
  dark:     'SINIESTRO',
  steel:    'ACERO',
  fairy:    'HADA',
  normal:   'NORMAL',
}

export default function PokemonCard({ pokemon, isFavorito, onToggleFavorito, onClick }) {
  const { name, id, sprite, types } = pokemon
  const pokedexNum  = `Nº${String(id).padStart(4, '0')}`
  const displayName = name.charAt(0).toUpperCase() + name.slice(1)

  const handleStar = (e) => {
    e.stopPropagation()
    if (onToggleFavorito) onToggleFavorito(pokemon)
  }

  return (
    <div
      className="relative bg-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col items-center p-4 gap-2 cursor-pointer group"
      onClick={() => onClick && onClick(pokemon)}
    >

      {/* Estrella favorito — visible solo en hover */}
      <button
        onClick={handleStar}
        className={`absolute top-2 right-2 p-1 rounded-full transition-all duration-150
          opacity-0 group-hover:opacity-100
          ${isFavorito
            ? 'opacity-100 text-yellow-400 hover:text-yellow-500'
            : 'text-gray-300 hover:text-yellow-400'}`}
        title={isFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      >
        <Star
          size={18}
          className={isFavorito ? 'fill-yellow-400' : ''}
        />
      </button>

      {/* Nombre + número */}
      <p className="text-sm font-semibold text-gray-600 tracking-wide">
        {displayName} <span className="text-gray-400 text-xs">{pokedexNum}</span>
      </p>

      {/* Sprite */}
      <div className="w-28 h-28 flex items-center justify-center">
        <img
          src={sprite}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200 drop-shadow-md"
          loading="lazy"
        />
      </div>

      {/* Tipos */}
      <div className="flex gap-2 mt-1 flex-wrap justify-center">
        {types.map(type => (
          <span
            key={type}
            className={`${TYPE_COLORS[type] || 'bg-gray-400'} text-white text-xs font-bold px-3 py-0.5 rounded-full tracking-wider shadow-sm`}
          >
            {TYPE_ES[type] || type.toUpperCase()}
          </span>
        ))}
      </div>

    </div>
  )
}