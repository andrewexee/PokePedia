import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PokemonCard from '../components/PokemonCard'

const mockPokemon = {
  id:     25,
  name:   'pikachu',
  sprite: 'https://pokeapi.co/pikachu.png',
  types:  ['electric'],
}

describe('PokemonCard', () => {
  it('renderiza el nombre del pokémon con mayúscula', () => {
    render(<PokemonCard pokemon={mockPokemon} isFavorito={false} />)
    expect(screen.getByText(/Pikachu/i)).toBeInTheDocument()
  })

  it('renderiza el número de pokédex con formato correcto', () => {
    render(<PokemonCard pokemon={mockPokemon} isFavorito={false} />)
    expect(screen.getByText('Nº0025')).toBeInTheDocument()
  })

  it('renderiza el tipo en español', () => {
    render(<PokemonCard pokemon={mockPokemon} isFavorito={false} />)
    expect(screen.getByText('ELÉCTRICO')).toBeInTheDocument()
  })

  it('llama a onToggleFavorito al hacer clic en la estrella', () => {
    const mockToggle = vi.fn()
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isFavorito={false}
        onToggleFavorito={mockToggle}
      />
    )
    const estrella = screen.getByTitle('Añadir a favoritos')
    fireEvent.click(estrella)
    expect(mockToggle).toHaveBeenCalledWith(mockPokemon)
  })

  it('muestra título "Quitar de favoritos" si ya es favorito', () => {
    render(<PokemonCard pokemon={mockPokemon} isFavorito={true} />)
    expect(screen.getByTitle('Quitar de favoritos')).toBeInTheDocument()
  })

  it('llama a onClick al hacer clic en la card', () => {
    const mockClick = vi.fn()
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isFavorito={false}
        onClick={mockClick}
      />
    )
    fireEvent.click(screen.getByText(/Pikachu/i).closest('div'))
    expect(mockClick).toHaveBeenCalledWith(mockPokemon)
  })
})
