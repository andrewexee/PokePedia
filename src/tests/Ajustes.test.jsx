import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Ajustes from '../pages/Ajustes'

vi.mock('../components/Navbar', () => ({
  default: () => <nav>Navbar</nav>,
}))

describe('Ajustes', () => {
  beforeEach(() => {
    sessionStorage.setItem('usuario', JSON.stringify({ id: 1, nombre: 'Ash' }))
  })

  it('renderiza el badge de versión 1.0', () => {
    render(<MemoryRouter><Ajustes /></MemoryRouter>)
    expect(screen.getByText(/VERSIÓN/i)).toBeInTheDocument()
  })

  it('renderiza la sección de tecnologías empleadas', () => {
    render(<MemoryRouter><Ajustes /></MemoryRouter>)
    expect(screen.getByText('Tecnologías empleadas')).toBeInTheDocument()
  })

  it('renderiza React + JavaScript como tecnología', () => {
    render(<MemoryRouter><Ajustes /></MemoryRouter>)
    expect(screen.getByText('React + JavaScript')).toBeInTheDocument()
  })

  it('renderiza Supabase como tecnología', () => {
    render(<MemoryRouter><Ajustes /></MemoryRouter>)
    expect(screen.getByText('Supabase (PostgreSQL)')).toBeInTheDocument()
  })

  it('renderiza PokéAPI como tecnología', () => {
    render(<MemoryRouter><Ajustes /></MemoryRouter>)
    expect(screen.getByText('PokéAPI')).toBeInTheDocument()
  })

  it('renderiza el enlace al GitHub del desarrollador', () => {
    render(<MemoryRouter><Ajustes /></MemoryRouter>)
    const link = screen.getByRole('link', { name: /andrewexee/i })
    expect(link).toHaveAttribute('href', 'https://github.com/andrewexee')
  })

  it('el enlace de GitHub abre en nueva pestaña', () => {
    render(<MemoryRouter><Ajustes /></MemoryRouter>)
    const link = screen.getByRole('link', { name: /andrewexee/i })
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renderiza la sección del desarrollador', () => {
    render(<MemoryRouter><Ajustes /></MemoryRouter>)
    expect(screen.getByText('Desarrollador')).toBeInTheDocument()
  })
})