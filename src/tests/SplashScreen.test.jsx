import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import SplashScreen from '../pages/SplashScreen'

describe('SplashScreen', () => {
  it('renderiza el logo de PokePedia', () => {
    render(<MemoryRouter><SplashScreen /></MemoryRouter>)
    const logo = screen.getByAltText('PokePedia')
    expect(logo).toBeInTheDocument()
  })

  it('renderiza la pokeball', () => {
    render(<MemoryRouter><SplashScreen /></MemoryRouter>)
    const pokeball = screen.getByAltText('Pokeball')
    expect(pokeball).toBeInTheDocument()
  })

  it('renderiza el botón de Iniciar Sesión', () => {
    render(<MemoryRouter><SplashScreen /></MemoryRouter>)
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
  })

  it('renderiza el botón de Registrarse', () => {
    render(<MemoryRouter><SplashScreen /></MemoryRouter>)
    expect(screen.getByText('Registrarse')).toBeInTheDocument()
  })
})
