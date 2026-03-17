import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar     from '../components/Navbar'
import MapaModal  from '../components/MapaModal'

const MAPAS = [
  {
    nombre:      'Kanto',
    gen:         '1ª GEN',
    archivo:     'mapa-kanto.png',
    juegos:      'Rojo, Azul, Amarillo, FireRed, LeafGreen',
    descripcion: 'Kanto es la región más icónica de la franquicia Pokémon, escenario de la primera generación. Es una tierra variada con ciudades conectadas por rutas, hogar del legendario pájaro trío Articuno, Zapdos y Moltres, y del mítico Mewtwo creado en el laboratorio de Cinnabar.',
  },
  {
    nombre:      'Johto',
    gen:         '2ª GEN',
    archivo:     'mapa-johto.png',
    juegos:      'Oro, Plata, Cristal, HeartGold, SoulSilver',
    descripcion: 'Johto es una región situada al oeste de Kanto, rica en tradición y misterio. Introduce los Pokémon de tipo Acero y Siniestro, y es hogar de los legendarios Raikou, Entei, Suicune y los míticos Ho-Oh y Lugia.',
  },
  {
    nombre:      'Hoenn',
    gen:         '3ª GEN',
    archivo:     'mapa-hoenn.png',
    juegos:      'Rubí, Zafiro, Esmeralda, Rubí Omega, Zafiro Alfa',
    descripcion: 'Hoenn es una región tropical rodeada de océano, con una gran diversidad de ecosistemas. Escenario del conflicto entre los equipos Magma y Aqua, y hogar de los legendarios Kyogre, Groudon y Rayquaza.',
  },
  {
    nombre:      'Sinnoh',
    gen:         '4ª GEN',
    archivo:     'mapa-sinnoh.png',
    juegos:      'Diamante, Perla, Platino, Diamante Brillante, Perla Reluciente',
    descripcion: 'Sinnoh es una región fría y montañosa situada en el norte. Presenta la mítica montaña Coronet en su centro y es hogar de los dioses del tiempo y el espacio: Dialga, Palkia y Giratina.',
  },
  {
    nombre:      'Teselia',
    gen:         '5ª GEN',
    archivo:     'mapa-teselia.png',
    juegos:      'Negro, Blanco, Negro 2, Blanco 2',
    descripcion: 'Teselia es una región inspirada en Nueva York, moderna y cosmopolita. Introduce la mayor cantidad de Pokémon nuevos de una sola generación, y presenta una profunda historia con temas filosóficos alrededor de los legendarios Reshiram y Zekrom.',
  },
  {
    nombre:      'Kalos',
    gen:         '6ª GEN',
    archivo:     'mapa-kalos.png',
    juegos:      'X, Y',
    descripcion: 'Kalos es una región inspirada en Francia, conocida por introducir la Mega Evolución. Sus paisajes están llenos de encanto europeo, con la Torre Prisma como monumento central. Hogar de los legendarios Xerneas y Yveltal.',
  },
  {
    nombre:      'Alola',
    gen:         '7ª GEN',
    archivo:     'mapa-alola.png',
    juegos:      'Sol, Luna, Ultra Sol, Ultra Luna',
    descripcion: 'Alola es un archipiélago tropical inspirado en Hawái, formado por cuatro islas principales. Introduce las Formas de Alola y los Pokémon UB. Hogar de los legendarios Solgaleo, Lunala y el mítico Necrozma.',
  },
  {
    nombre:      'Galar',
    gen:         '8ª GEN',
    archivo:     'mapa-galar.png',
    juegos:      'Espada, Escudo',
    descripcion: 'Galar es una región inspirada en el Reino Unido, famosa por el fenómeno Gigamax y los Estadios Pokémon. Presenta un rico folclore alrededor de los legendarios Zacian y Zamazenta.',
  },
  {
    nombre:      'Paldea',
    gen:         '9ª GEN',
    archivo:     'mapa-paldea.png',
    juegos:      'Escarlata, Púrpura',
    descripcion: 'Paldea es una vasta región de mundo abierto inspirada en la Península Ibérica. Introduce las Formas de Paldea y los Pokémon Paradox. Hogar de los legendarios Koraidon y Miraidon, que sirven de montura al jugador.',
  },
]

export default function Mapas() {
  const navigate = useNavigate()
  const [mapaSeleccionado, setMapaSeleccionado] = useState(null)

  useEffect(() => {
    if (!sessionStorage.getItem('usuario')) navigate('/')
  }, [navigate])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {MAPAS.map(mapa => (
            <div
              key={mapa.nombre}
              onClick={() => setMapaSeleccionado(mapa)}
              className="bg-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col items-center p-4 gap-3 cursor-pointer group"
            >
              <p className="text-sm font-semibold text-gray-600 tracking-wide">
                {mapa.nombre}{' '}
                <span className="text-gray-400 text-xs">({mapa.gen})</span>
              </p>
              <div className="w-full h-44 overflow-hidden rounded-lg">
                <img
                  src={`/resources/${mapa.archivo}`}
                  alt={`Mapa ${mapa.nombre}`}
                  className="w-full h-full object-cover object-center rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-xs text-gray-400 text-center">{mapa.juegos}</p>
            </div>
          ))}
        </div>
      </main>

      {mapaSeleccionado && (
        <MapaModal
          mapa={mapaSeleccionado}
          onClose={() => setMapaSeleccionado(null)}
        />
      )}
    </div>
  )
}