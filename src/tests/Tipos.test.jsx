import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Tipos from '../pages/Tipos'

vi.mock('../components/Navbar', () => ({
  default: () => <nav>Navbar</nav>,
}))

vi.mock('../components/TiposModal', () => ({
  default: ({ onClose }) => (
    <div>
      <span>Modal Tipos Abierto</span>
      <button onClick={onClose}>Cerrar</button>
    </div>
  ),
}))

describe('Tipos', () => {
  beforeEach(() => {
    sessionStorage.setItem('usuario', JSON.stringify({ id: 1, nombre: 'Ash' }))
  })

  it('renderiza el título Tabla de Tipos', () => {
    render(<MemoryRouter><Tipos /></MemoryRouter>)
    expect(screen.getByText('Tabla de Tipos')).toBeInTheDocument()
  })

  it('renderiza la imagen de la tabla de tipos', () => {
    render(<MemoryRouter><Tipos /></MemoryRouter>)
    expect(screen.getByAltText('Tabla de tipos Pokémon')).toBeInTheDocument()
  })

  it('muestra el texto de ayuda para hacer clic', () => {
    render(<MemoryRouter><Tipos /></MemoryRouter>)
    expect(screen.getByText(/Haz clic en la tabla/i)).toBeInTheDocument()
  })

  it('abre el modal al hacer clic en la tarjeta', () => {
    render(<MemoryRouter><Tipos /></MemoryRouter>)
    fireEvent.click(screen.getByAltText('Tabla de tipos Pokémon').closest('div'))
    expect(screen.getByText('Modal Tipos Abierto')).toBeInTheDocument()
  })

  it('cierra el modal al llamar a onClose', () => {
    render(<MemoryRouter><Tipos /></MemoryRouter>)
    fireEvent.click(screen.getByAltText('Tabla de tipos Pokémon').closest('div'))
    fireEvent.click(screen.getByText('Cerrar'))
    expect(screen.queryByText('Modal Tipos Abierto')).not.toBeInTheDocument()
  })
})
