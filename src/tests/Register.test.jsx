import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Register from '../pages/Register'

vi.mock('../supabaseClient', () => ({
  default: {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: { id: 1 }, error: null }),
        }),
      }),
      insert: async () => ({ error: null }),
    }),
  },
}))

describe('Register', () => {
  it('muestra error si los campos están vacíos', async () => {
    render(<MemoryRouter><Register /></MemoryRouter>)
    fireEvent.click(screen.getByText('Registrarse'))
    await waitFor(() => {
      expect(screen.getByText('Por favor rellena todos los campos.')).toBeInTheDocument()
    })
  })

  it('muestra error si la contraseña tiene menos de 4 caracteres', async () => {
    render(<MemoryRouter><Register /></MemoryRouter>)

    fireEvent.change(screen.getByPlaceholderText('Nombre Completo'), { target: { value: 'Test' } })
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: 'test@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: '123' } })
    fireEvent.click(screen.getByText('Registrarse'))

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 4 caracteres.')).toBeInTheDocument()
    })
  })

  it('muestra error si el email ya está en uso', async () => {
    render(<MemoryRouter><Register /></MemoryRouter>)

    fireEvent.change(screen.getByPlaceholderText('Nombre Completo'), { target: { value: 'Test' } })
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: 'existente@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'pass123' } })
    fireEvent.click(screen.getByText('Registrarse'))

    await waitFor(() => {
      expect(screen.getByText('Ya existe una cuenta con ese correo electrónico.')).toBeInTheDocument()
    })
  })
})
