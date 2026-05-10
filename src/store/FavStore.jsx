import { create } from 'zustand'
import supabase from '../supabaseClient'

const useFavoritosStore = create((set, get) => ({
  favoritos:  [],   // array de pokemon_id
  viendoFavs: false,

  // Carga los favoritos del usuario desde Supabase
  cargarFavoritos: async (usuarioId) => {
    const { data } = await supabase
      .from('favoritos')
      .select('pokemon_id')
      .eq('usuario_id', usuarioId)

    if (data) set({ favoritos: data.map(f => f.pokemon_id) })
  },

  // Añade o quita un favorito
  toggleFavorito: async (pokemon, usuarioId) => {
    const { favoritos } = get()
    const esFav = favoritos.includes(pokemon.id)

    if (esFav) {
      await supabase
        .from('favoritos')
        .delete()
        .eq('usuario_id', usuarioId)
        .eq('pokemon_id', pokemon.id)

      set({ favoritos: favoritos.filter(id => id !== pokemon.id) })
    } else {
      await supabase
        .from('favoritos')
        .insert([{ usuario_id: usuarioId, pokemon_id: pokemon.id, pokemon_name: pokemon.name }])

      set({ favoritos: [...favoritos, pokemon.id] })
    }
  },

  // Alterna la vista de favoritos
  toggleViendoFavs: () => set(state => ({ viendoFavs: !state.viendoFavs })),

  // Fuerza el valor de viendoFavs
  setViendoFavs: (valor) => set({ viendoFavs: valor }),

  // Resetea el store al cerrar sesión
  resetFavoritos: () => set({ favoritos: [], viendoFavs: false }),
}))

export default useFavoritosStore