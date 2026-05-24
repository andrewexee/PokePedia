import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Mapas from '../pages/Mapas'

vi.mock('../components/Navbar', () => ({
  default: () => <nav>Navbar</nav>,
}))

vi.mock('../components/MapaModal', () => ({
  default: ({ mapa, onClose }) => (
    <div>
      <span>Modal: {mapa.nombre}</span>
      <button onClick={onClose}>Cerrar</button>
    </div>
  ),
}))

describe('Mapas', () => {
  beforeEach(() => {
    sessionStorage.setItem('usuario', JSON.stringify({ id: 1, nombre: 'Ash' }))
  })

  it('renderiza las 9 regiones', () => {
    render(<MemoryRouter><Mapas /></MemoryRouter>)
    const regiones = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Teselia', 'Kalos', 'Alola', 'Galar', 'Paldea']
    regiones.forEach(region => {
      expect(screen.getByText(new RegExp(region, 'i'))).toBeInTheDocument()
    })
  })

  it('renderiza las 9 generaciones', () => {
    render(<MemoryRouter><Mapas /></MemoryRouter>)
    for (let i = 1; i <= 9; i++) {
      expect(screen.getByText(new RegExp(`${i}ª GEN`, 'i'))).toBeInTheDocument()
    }
  })

  it('abre el modal al hacer clic en una tarjeta de mapa', () => {
    render(<MemoryRouter><Mapas /></MemoryRouter>)
    fireEvent.click(screen.getAllByText(/Kanto/i)[0].closest('div'))
    expect(screen.getByText('Modal: Kanto')).toBeInTheDocument()
  })

  it('cierra el modal al llamar a onClose', () => {
    render(<MemoryRouter><Mapas /></MemoryRouter>)
    fireEvent.click(screen.getAllByText(/Kanto/i)[0].closest('div'))
    fireEvent.click(screen.getByText('Cerrar'))
    expect(screen.queryByText('Modal: Kanto')).not.toBeInTheDocument()
  })

  it('abre el modal de Paldea correctamente', () => {
    render(<MemoryRouter><Mapas /></MemoryRouter>)
    fireEvent.click(screen.getAllByText(/Paldea/i)[0].closest('div'))
    expect(screen.getByText('Modal: Paldea')).toBeInTheDocument()
  })
})
