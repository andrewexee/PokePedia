import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, Star, User, X, SlidersHorizontal, ChevronDown } from 'lucide-react'
import useFavoritosStore from '../store/FavStore'

const TIPOS = [
  'FUEGO','AGUA','PLANTA','ELÉCTRICO','HIELO','LUCHA','VENENO',
  'TIERRA','VOLADOR','PSÍQUICO','BICHO','ROCA','FANTASMA',
  'DRAGÓN','SINIESTRO','ACERO','HADA','NORMAL'
]

const GENERACIONES = [
  { label: '1ª GEN — Kanto',   value: '1' },
  { label: '2ª GEN — Johto',   value: '2' },
  { label: '3ª GEN — Hoenn',   value: '3' },
  { label: '4ª GEN — Sinnoh',  value: '4' },
  { label: '5ª GEN — Teselia', value: '5' },
  { label: '6ª GEN — Kalos',   value: '6' },
  { label: '7ª GEN — Alola',   value: '7' },
  { label: '8ª GEN — Galar',   value: '8' },
  { label: '9ª GEN — Paldea',  value: '9' },
]

export default function Navbar({ onSearch, onClearSearch, onFilter, onToggleFavs, viendoFavs = false }) {
  const navigate  = useNavigate()
  const location  = useLocation()

  const [searchOpen,   setSearchOpen]   = useState(false)
  const [searchValue,  setSearchValue]  = useState('')
  const [profileOpen,  setProfileOpen]  = useState(false)
  const [filterOpen,   setFilterOpen]   = useState(false)
  const [filterMode,   setFilterMode]   = useState(null)     // 'numero' | 'tipo' | 'generacion'
  const [numFrom,      setNumFrom]      = useState('')
  const [numTo,        setNumTo]        = useState('')
  const [tipoSel,      setTipoSel]      = useState('')
  const [genSel,       setGenSel]       = useState('')

  const searchRef  = useRef(null)
  const profileRef = useRef(null)
  const filterRef  = useRef(null)

  const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}')

  // Cerrar dropdowns al clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      if (filterRef.current  && !filterRef.current.contains(e.target))  setFilterOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  const handleSearchToggle = () => {
    if (searchOpen) {
      setSearchOpen(false)
      setSearchValue('')
      setFilterOpen(false)
      setFilterMode(null)
      if (onClearSearch) onClearSearch()
    } else {
      setSearchOpen(true)
    }
  }

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchValue(val)
    if (onSearch) onSearch(val)
  }

  const handleSearchKey = (e) => {
    if (e.key === 'Escape') handleSearchToggle()
  }

  // Aplicar filtro combinado
  const aplicarFiltro = () => {
    if (!onFilter) return
    onFilter({
      numFrom: numFrom ? Number(numFrom) : null,
      numTo:   numTo   ? Number(numTo)   : null,
      tipo:    tipoSel || null,
      gen:     genSel  || null,
    })
    setFilterOpen(false)
  }

  const limpiarFiltro = () => {
    setFilterMode(null)
    setNumFrom('')
    setNumTo('')
    setTipoSel('')
    setGenSel('')
    if (onFilter) onFilter(null)
    setFilterOpen(false)
  }

  const { resetFavoritos } = useFavoritosStore()

  const handleLogout = () => {
    resetFavoritos()
    sessionStorage.removeItem('usuario')
    navigate('/')
  }

  const navLinks = [
    { label: 'POKÉDEX', path: '/pokedex' },
    { label: 'TIPOS',   path: '/tipos'   },
    { label: 'MAPAS',   path: '/mapas'   },
  ]

  const isPokedex = location.pathname === '/pokedex'

  return (
    <header className="w-full bg-red-600 shadow-lg">
      {/* Franja superior */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/pokedex')}>
          <div className="bg-white rounded-full" style={{lineHeight: 0}}>
            <img src="/resources/pokeball.png" alt="ball" className="w-12 h-12 object-contain" />
          </div>
          <img src="/resources/pokepedia-logo.png" alt="PokePedia" className="h-14 object-contain" />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onToggleFavs && onToggleFavs()}
            className={`transition-colors ${viendoFavs ? 'text-yellow-300' : 'text-white hover:text-yellow-300'}`}
            title={viendoFavs ? 'Ver todos los Pokémon' : 'Ver favoritos'}
          >
            <Star size={22} className={viendoFavs ? 'fill-yellow-300' : ''} />
          </button>

          {/* Perfil */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="bg-white/20 hover:bg-white/30 transition-colors rounded-full p-1.5"
            >
              <User size={20} className="text-white" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-10 bg-white rounded-lg shadow-2xl w-44 z-50 overflow-hidden border border-gray-100">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-400 font-medium">Sesión iniciada como</p>
                  <p className="text-sm text-gray-700 font-semibold truncate">{usuario.nombre || 'Usuario'}</p>
                </div>
                <ul className="py-1">
                  <li>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setProfileOpen(false)
                        navigate('/perfil')
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      PERFIL
                    </button>
                  </li>
                  <li>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setProfileOpen(false)
                        navigate('/ajustes')
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      INFO
                    </button>
                  </li>
                  <li className="border-t border-gray-100 mt-1">
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleLogout()
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      CERRAR SESIÓN
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Franja inferior: nav + buscador */}
      <div className="bg-red-700 flex items-center px-6 py-0 gap-2">
        <nav className="flex items-center">
          {navLinks.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-5 py-2.5 text-sm font-bold tracking-widest transition-colors
                ${location.pathname === link.path
                  ? 'text-white border-b-2 border-white'
                  : 'text-red-200 hover:text-white'}`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Buscador + filtro — solo en Pokédex */}
        {isPokedex && (
          <div className="flex items-center ml-2 gap-1">

            {/* Lupa */}
            <button
              onClick={handleSearchToggle}
              className="text-white hover:text-yellow-300 transition-colors p-1.5"
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            {/* Input búsqueda */}
            <div className={`overflow-hidden transition-all duration-300 ${searchOpen ? 'w-48 opacity-100' : 'w-0 opacity-0'}`}>
              <input
                ref={searchRef}
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKey}
                placeholder="Buscar pokémon..."
                className="bg-white/20 text-white placeholder-red-200 text-sm px-3 py-1.5 rounded-full outline-none w-full"
              />
            </div>

            {/* Botón filtro — solo visible con buscador abierto */}
            {searchOpen && (
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors
                    ${filterOpen || filterMode
                      ? 'bg-yellow-400 text-gray-800'
                      : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  <SlidersHorizontal size={13} />
                  FILTRAR
                  <ChevronDown size={12} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Panel de filtros */}
                {filterOpen && (
                  <div className="absolute left-0 top-10 bg-white rounded-xl shadow-2xl w-72 z-50 border border-gray-100 overflow-hidden">

                    {/* Cabecera */}
                    <div className="bg-red-500 px-4 py-3">
                      <p className="text-white font-bold text-sm tracking-wide">Filtrar Pokédex</p>
                    </div>

                    <div className="p-4 flex flex-col gap-3">

                      {/* Selector de modo — ahora múltiple */}
                      <div className="flex gap-2 flex-wrap">
                        {[
                          { key: 'numero',     label: 'Nº Pokédex' },
                          { key: 'tipo',       label: 'Tipo'       },
                          { key: 'generacion', label: 'Generación' },
                        ].map(opt => (
                          <button
                            key={opt.key}
                            onClick={() => setFilterMode(filterMode === opt.key ? null : opt.key)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors border
                              ${filterMode === opt.key
                                ? 'bg-red-500 text-white border-red-500'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      {/* Resumen de filtros activos */}
                      {(numFrom || numTo || tipoSel || genSel) && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {(numFrom || numTo) && (
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                              Nº {numFrom || '1'} — {numTo || '1025'}
                            </span>
                          )}
                          {tipoSel && (
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                              {tipoSel}
                            </span>
                          )}
                          {genSel && (
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                              GEN {genSel}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Panel Nº Pokédex */}
                      {filterMode === 'numero' && (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="number" min="1" max="1025"
                            value={numFrom}
                            onChange={e => setNumFrom(e.target.value)}
                            placeholder="Desde"
                            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-red-400"
                          />
                          <span className="text-gray-400 text-sm">—</span>
                          <input
                            type="number" min="1" max="1025"
                            value={numTo}
                            onChange={e => setNumTo(e.target.value)}
                            placeholder="Hasta"
                            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-red-400"
                          />
                        </div>
                      )}

                      {/* Panel Tipo */}
                      {filterMode === 'tipo' && (
                        <div className="grid grid-cols-3 gap-1.5 mt-1">
                          {TIPOS.map(t => (
                            <button
                              key={t}
                              onClick={() => setTipoSel(tipoSel === t ? '' : t)}
                              className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors border
                                ${tipoSel === t
                                  ? 'bg-red-500 text-white border-red-500'
                                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-red-300'}`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Panel Generación */}
                      {filterMode === 'generacion' && (
                        <div className="flex flex-col gap-1 mt-1">
                          {GENERACIONES.map(g => (
                            <button
                              key={g.value}
                              onClick={() => setGenSel(genSel === g.value ? '' : g.value)}
                              className={`text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border
                                ${genSel === g.value
                                  ? 'bg-red-500 text-white border-red-500'
                                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-red-300'}`}
                            >
                              {g.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Botones aplicar / limpiar */}
                      <div className="flex gap-2 mt-1 pt-2 border-t border-gray-100">
                        <button
                          onClick={limpiarFiltro}
                          className="flex-1 py-1.5 rounded-full text-xs font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          Limpiar
                        </button>
                        <button
                          onClick={aplicarFiltro}
                          disabled={!numFrom && !numTo && !tipoSel && !genSel}
                          className="flex-1 py-1.5 rounded-full text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-40"
                        >
                          Aplicar
                        </button>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}