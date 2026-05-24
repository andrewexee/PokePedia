import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Login from '../pages/Login'

// Mock de supabase
vi.mock('../supabaseClient', () => ({
  default: {
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: { message: 'Not found' } }),
          }),
        }),
      }),
    }),
  },
}))

describe('Login', () => {
  it('muestra error si los campos están vacíos al enviar', async () => {
    render(<MemoryRouter><Login /></MemoryRouter>)
    fireEvent.click(screen.getByText('Iniciar Sesión'))
    await waitFor(() => {
      expect(screen.getByText('Por favor rellena todos los campos.')).toBeInTheDocument()
    })
  })

  it('muestra error si las credenciales son incorrectas', async () => {
    render(<MemoryRouter><Login /></MemoryRouter>)

    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'test@test.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'wrongpass' },
    })
    fireEvent.click(screen.getByText('Iniciar Sesión'))

    await waitFor(() => {
      expect(screen.getByText('Correo o contraseña incorrectos.')).toBeInTheDocument()
    })
  })

  it('renderiza el enlace para restablecer contraseña', () => {
    render(<MemoryRouter><Login /></MemoryRouter>)
    expect(screen.getByText('Restablecer su contraseña')).toBeInTheDocument()
  })
})
