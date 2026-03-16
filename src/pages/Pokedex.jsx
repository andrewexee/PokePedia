import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar        from '../components/Navbar'
import PokemonCard   from '../components/PokemonCard'
import PokemonModal  from '../components/PokemonModal'
import { Loader2 }  from 'lucide-react'
import supabase      from '../supabaseClient'

const PAGE_SIZE = 15  // Pokémon por página (5 columnas x 3 filas)

// Tipos en español → inglés para filtrar
const TYPE_MAP_ES = {
  fuego: 'fire', agua: 'water', planta: 'grass', eléctrico: 'electric',
  electrico: 'electric', hielo: 'ice', lucha: 'fighting', veneno: 'poison',
  tierra: 'ground', volador: 'flying', psíquico: 'psychic', psiquico: 'psychic',
  bicho: 'bug', roca: 'rock', fantasma: 'ghost', dragón: 'dragon', dragon: 'dragon',
  siniestro: 'dark', acero: 'steel', hada: 'fairy', normal: 'normal',
}

export default function Pokedex() {
  const navigate = useNavigate()

  // Protección de ruta
  useEffect(() => {
    if (!sessionStorage.getItem('usuario')) navigate('/')
  }, [navigate])

  const [allPokemon,    setAllPokemon]    = useState([])
  const [allDetails,    setAllDetails]    = useState([])
  const [loading,       setLoading]       = useState(true)
  const [currentPage,   setCurrentPage]   = useState(1)
  const [searchQuery,   setSearchQuery]   = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching,   setIsSearching]   = useState(false)
  const [activeFilter,  setActiveFilter]  = useState(null)
  const [errorMsg,      setErrorMsg]      = useState('')
  const [favoritos,     setFavoritos]     = useState([])      // ids de favoritos del usuario
  const [viendoFavs,    setViendoFavs]    = useState(false)  // modo vista favoritos
  const [modalPokemon,  setModalPokemon]  = useState(null)   // pokemon seleccionado para modal

  const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}')

  // Rangos de ID por generación
  const GEN_RANGES = {
    '1': [1,   151],
    '2': [152, 251],
    '3': [252, 386],
    '4': [387, 493],
    '5': [494, 649],
    '6': [650, 721],
    '7': [722, 809],
    '8': [810, 905],
    '9': [906, 1025],
  }

  // Traducciones tipo ES → EN
  const TIPO_ES_EN = {
    'FUEGO':'fire','AGUA':'water','PLANTA':'grass','ELÉCTRICO':'electric',
    'HIELO':'ice','LUCHA':'fighting','VENENO':'poison','TIERRA':'ground',
    'VOLADOR':'flying','PSÍQUICO':'psychic','BICHO':'bug','ROCA':'rock',
    'FANTASMA':'ghost','DRAGÓN':'dragon','SINIESTRO':'dark','ACERO':'steel',
    'HADA':'fairy','NORMAL':'normal',
  }

  // Cargar favoritos del usuario desde Supabase
  useEffect(() => {
    if (!usuario?.id) return
    const fetchFavs = async () => {
      const { data } = await supabase
        .from('favoritos')
        .select('pokemon_id')
        .eq('usuario_id', usuario.id)
      if (data) setFavoritos(data.map(f => f.pokemon_id))
    }
    fetchFavs()
  }, [usuario?.id])

  // Añadir o quitar favorito
  const handleToggleFavorito = useCallback(async (pokemon) => {
    if (!usuario?.id) return
    const esFav = favoritos.includes(pokemon.id)

    if (esFav) {
      // Quitar
      await supabase
        .from('favoritos')
        .delete()
        .eq('usuario_id', usuario.id)
        .eq('pokemon_id', pokemon.id)
      setFavoritos(prev => prev.filter(id => id !== pokemon.id))
    } else {
      // Añadir
      await supabase
        .from('favoritos')
        .insert([{ usuario_id: usuario.id, pokemon_id: pokemon.id, pokemon_name: pokemon.name }])
      setFavoritos(prev => [...prev, pokemon.id])
    }
  }, [favoritos, usuario?.id])

  // Alternar vista de favoritos desde la estrella del Navbar
  const handleToggleVistaFavs = useCallback(() => {
    setViendoFavs(prev => !prev)
    setIsSearching(false)
    setSearchResults([])
    setSearchQuery('')
    setActiveFilter(null)
    setCurrentPage(1)
  }, [])

  // 1. Cargar lista completa de nombres una sola vez
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res  = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
        const data = await res.json()
        setAllPokemon(data.results)
      } catch {
        setErrorMsg('Error al conectar con la PokéAPI.')
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // 2. Función para cargar los detalles de un lote
  const fetchBatch = useCallback(async (list) => {
    const details = await Promise.all(
      list.map(async (p) => {
        const res  = await fetch(p.url)
        const data = await res.json()
        return {
          id:     data.id,
          name:   data.name,
          sprite: data.sprites.other['official-artwork'].front_default
                  || data.sprites.front_default,
          types:  data.types.map(t => t.type.name),
        }
      })
    )
    return details
  }, [])

  // 3. Cargar TODOS los pokémon en lotes para no saturar la API
  useEffect(() => {
    if (allPokemon.length === 0) return

    const loadAll = async () => {
      setLoading(true)
      const BATCH = 50
      let all = []
      for (let i = 0; i < allPokemon.length; i += BATCH) {
        const batch   = allPokemon.slice(i, i + BATCH)
        const details = await fetchBatch(batch)
        all = [...all, ...details]
      }
      setAllDetails(all)
      setLoading(false)
    }

    loadAll()
  }, [allPokemon, fetchBatch])

  // Paginación
  const totalPages   = Math.ceil(allDetails.length / PAGE_SIZE)
  const paginatedData = allDetails.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  // Rango de páginas visibles en el paginador (máx 5 botones)
  const getPageRange = () => {
    const delta = 2
    const start = Math.max(1, currentPage - delta)
    const end   = Math.min(totalPages, currentPage + delta)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  // 4. Búsqueda sobre datos ya cargados
  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
    setActiveFilter(null)
    const q = query.trim().toLowerCase()

    if (!q) {
      setIsSearching(false)
      setSearchResults([])
      setCurrentPage(1)
      return
    }

    setIsSearching(true)
    setCurrentPage(1)

    const typeEn = TYPE_MAP_ES[q] || q
    const isType = Object.values(TYPE_MAP_ES).includes(typeEn)

    if (isType) {
      setSearchResults(allDetails.filter(p => p.types.includes(typeEn)))
      return
    }

    setSearchResults(allDetails.filter(p =>
      p.name.includes(q) || String(p.id) === q
    ))
  }, [allDetails])

  // 5. Filtro avanzado combinado desde el panel
  const handleFilter = useCallback((filtro) => {
    setSearchQuery('')
    setCurrentPage(1)

    if (!filtro) {
      setActiveFilter(null)
      setIsSearching(false)
      setSearchResults([])
      return
    }

    setActiveFilter(filtro)
    setIsSearching(true)

    let results = [...allDetails]

    // Filtro por rango de número
    if (filtro.numFrom !== null || filtro.numTo !== null) {
      const desde = filtro.numFrom ?? 1
      const hasta = filtro.numTo   ?? 1025
      results = results.filter(p => p.id >= desde && p.id <= hasta)
    }

    // Filtro por generación (si no hay rango manual, usa el rango de la gen)
    if (filtro.gen) {
      const [min, max] = GEN_RANGES[filtro.gen] || [1, 1025]
      // Si ya hay rango manual, interseccionamos; si no, aplicamos el de la gen
      if (filtro.numFrom === null && filtro.numTo === null) {
        results = results.filter(p => p.id >= min && p.id <= max)
      } else {
        // Intersección: el pokémon debe estar en el rango manual Y en la gen
        results = results.filter(p => p.id >= min && p.id <= max)
      }
    }

    // Filtro por tipo
    if (filtro.tipo) {
      const en = TIPO_ES_EN[filtro.tipo] || filtro.tipo.toLowerCase()
      results = results.filter(p => p.types.includes(en))
    }

    setSearchResults(results)
  }, [allDetails])

  const handleClearSearch = () => {
    setSearchQuery('')
    setActiveFilter(null)
    setIsSearching(false)
    setSearchResults([])
    setCurrentPage(1)
  }

  // Lista de pokémon favoritos completa
  const favoritosList = allDetails.filter(p => favoritos.includes(p.id))

  // Lista final según modo activo
  const getFinalList = () => {
    if (viendoFavs)   return favoritosList
    if (isSearching)  return searchResults
    return paginatedData
  }

  const getFinalTotal = () => {
    if (viendoFavs)  return Math.ceil(favoritosList.length / PAGE_SIZE)
    if (isSearching) return Math.ceil(searchResults.length / PAGE_SIZE)
    return totalPages
  }

  // Paginación aplicada a la lista final
  const finalList  = viendoFavs
    ? favoritosList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : isSearching
      ? searchResults.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
      : paginatedData

  const finalTotal = getFinalTotal()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        onFilter={handleFilter}
        onToggleFavs={handleToggleVistaFavs}
        viendoFavs={viendoFavs}
      />

      <main className="flex-1 px-6 py-8 flex flex-col items-center">

        {/* Error */}
        {errorMsg && (
          <div className="text-center text-red-500 mt-20 text-sm">{errorMsg}</div>
        )}

        {/* Spinner carga inicial */}
        {loading && !errorMsg && (
          <div className="flex flex-col items-center justify-center mt-24 gap-4">
            <Loader2 size={40} className="text-red-500 animate-spin" />
            <p className="text-gray-400 text-sm">Cargando Pokédex completa...</p>
          </div>
        )}

        {/* Sin resultados */}
        {!loading && finalList.length === 0 && (isSearching || viendoFavs) && (
          <div className="text-center mt-20 text-gray-400 text-sm">
            {viendoFavs
              ? 'Aún no tienes Pokémon favoritos. ¡Pasa el cursor sobre una carta y pulsa la estrella!'
              : 'No se encontraron Pokémon para los filtros aplicados.'}
          </div>
        )}

        {/* Grid de cards */}
        {!loading && finalList.length > 0 && (
          <>
            {/* Cabecera modo favoritos */}
            {viendoFavs && (
              <p className="text-xs text-gray-400 mb-4 self-start flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span>{favoritosList.length} Pokémon favorito{favoritosList.length !== 1 ? 's' : ''}</span>
              </p>
            )}

            {/* Cabecera modo búsqueda/filtro */}
            {isSearching && !viendoFavs && (
              <p className="text-xs text-gray-400 mb-4 self-start flex flex-wrap items-center gap-1">
                <span>{searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''}</span>
                {searchQuery && <><span>para</span><span className="font-semibold text-gray-600">"{searchQuery}"</span></>}
                {activeFilter?.numFrom !== null && activeFilter?.numTo !== null && activeFilter?.numFrom !== undefined && (
                  <span className="bg-red-100 text-red-500 font-bold px-2 py-0.5 rounded-full">
                    Nº {activeFilter.numFrom ?? 1} — {activeFilter.numTo ?? 1025}
                  </span>
                )}
                {activeFilter?.gen && (
                  <span className="bg-red-100 text-red-500 font-bold px-2 py-0.5 rounded-full">
                    GEN {activeFilter.gen}
                  </span>
                )}
                {activeFilter?.tipo && (
                  <span className="bg-red-100 text-red-500 font-bold px-2 py-0.5 rounded-full">
                    {activeFilter.tipo}
                  </span>
                )}
              </p>
            )}

            <div className="grid grid-cols-5 gap-4 w-full max-w-5xl">
              {finalList.map(pokemon => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  isFavorito={favoritos.includes(pokemon.id)}
                  onToggleFavorito={handleToggleFavorito}
                  onClick={setModalPokemon}
                />
              ))}
            </div>

            {/* Paginador */}
            {finalTotal > 1 && (
              <div className="flex items-center gap-2 mt-10 flex-wrap justify-center">

                {/* Anterior */}
                <button
                  onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo(0,0) }}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-full text-sm font-bold bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-colors"
                >
                  ‹
                </button>

                {/* Primera página si no está en el rango */}
                {getPageRange()[0] > 1 && (
                  <>
                    <button
                      onClick={() => { setCurrentPage(1); window.scrollTo(0,0) }}
                      className="px-3 py-1.5 rounded-full text-sm font-bold bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      1
                    </button>
                    {getPageRange()[0] > 2 && <span className="text-gray-400 text-sm">…</span>}
                  </>
                )}

                {/* Rango de páginas */}
                {getPageRange().map(page => (
                  <button
                    key={page}
                    onClick={() => { setCurrentPage(page); window.scrollTo(0,0) }}
                    className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors
                      ${currentPage === page
                        ? 'bg-red-500 text-white shadow'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  >
                    {page}
                  </button>
                ))}

                {/* Última página si no está en el rango */}
                {getPageRange().at(-1) < finalTotal && (
                  <>
                    {getPageRange().at(-1) < finalTotal - 1 && <span className="text-gray-400 text-sm">…</span>}
                    <button
                      onClick={() => { setCurrentPage(finalTotal); window.scrollTo(0,0) }}
                      className="px-3 py-1.5 rounded-full text-sm font-bold bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      {finalTotal}
                    </button>
                  </>
                )}

                {/* Siguiente */}
                <button
                  onClick={() => { setCurrentPage(p => Math.min(finalTotal, p + 1)); window.scrollTo(0,0) }}
                  disabled={currentPage === finalTotal}
                  className="px-3 py-1.5 rounded-full text-sm font-bold bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-colors"
                >
                  ›
                </button>

                {/* Indicador */}
                <span className="text-xs text-gray-400 ml-2">
                  Página {currentPage} de {finalTotal}
                </span>

              </div>
            )}
          </>
        )}
      </main>

      {/* Modal detalle pokémon */}
      {modalPokemon && (
        <PokemonModal
          pokemon={modalPokemon}
          onClose={() => setModalPokemon(null)}
        />
      )}
    </div>
  )
}