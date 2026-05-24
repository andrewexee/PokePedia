import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act } from 'react'

// Mock de supabase antes de importar el store
vi.mock('../supabaseClient', () => ({
  default: {
    from: () => ({
      select: () => ({
        eq: () => ({
          data: [{ pokemon_id: 25 }, { pokemon_id: 1 }],
        }),
      }),
      insert: vi.fn(() => Promise.resolve({ error: null })),
      delete: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      }),
    }),
  },
}))

import useFavoritosStore from '../store/FavStore'

describe('FavStore', () => {
  beforeEach(() => {
    // Resetear el store antes de cada test
    useFavoritosStore.setState({ favoritos: [], viendoFavs: false })
  })

  it('el estado inicial tiene favoritos vacíos', () => {
    const { favoritos } = useFavoritosStore.getState()
    expect(favoritos).toEqual([])
  })

  it('el estado inicial tiene viendoFavs en false', () => {
    const { viendoFavs } = useFavoritosStore.getState()
    expect(viendoFavs).toBe(false)
  })

  it('toggleViendoFavs alterna el valor de viendoFavs', () => {
    const { toggleViendoFavs } = useFavoritosStore.getState()
    act(() => toggleViendoFavs())
    expect(useFavoritosStore.getState().viendoFavs).toBe(true)
    act(() => toggleViendoFavs())
    expect(useFavoritosStore.getState().viendoFavs).toBe(false)
  })

  it('setViendoFavs fuerza el valor correctamente', () => {
    const { setViendoFavs } = useFavoritosStore.getState()
    act(() => setViendoFavs(true))
    expect(useFavoritosStore.getState().viendoFavs).toBe(true)
    act(() => setViendoFavs(false))
    expect(useFavoritosStore.getState().viendoFavs).toBe(false)
  })

  it('resetFavoritos limpia el estado completamente', () => {
    useFavoritosStore.setState({ favoritos: [25, 1, 4], viendoFavs: true })
    const { resetFavoritos } = useFavoritosStore.getState()
    act(() => resetFavoritos())
    const state = useFavoritosStore.getState()
    expect(state.favoritos).toEqual([])
    expect(state.viendoFavs).toBe(false)
  })

  it('toggleFavorito añade un pokémon a favoritos', async () => {
    const { toggleFavorito } = useFavoritosStore.getState()
    await act(async () => {
      await toggleFavorito({ id: 25, name: 'pikachu' }, 1)
    })
    expect(useFavoritosStore.getState().favoritos).toContain(25)
  })

  it('toggleFavorito quita un pokémon si ya era favorito', async () => {
    useFavoritosStore.setState({ favoritos: [25] })
    const { toggleFavorito } = useFavoritosStore.getState()
    await act(async () => {
      await toggleFavorito({ id: 25, name: 'pikachu' }, 1)
    })
    expect(useFavoritosStore.getState().favoritos).not.toContain(25)
  })
})
