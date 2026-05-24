import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Perfil from '../pages/Perfil'

vi.mock('../components/Navbar', () => ({
  default: () => <nav>Navbar</nav>,
}))

vi.mock('../supabaseClient', () => ({
  default: {
    from: () => ({
      select: () => ({
        eq: () => ({
          neq: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
      }),
      update: () => ({
        eq: async () => ({ error: null }),
      }),
      delete: () => ({
        eq: () => ({
          eq: async () => ({ error: null }),
        }),
      }),
    }),
  },
}))

describe('Perfil', () => {
  beforeEach(() => {
    sessionStorage.setItem('usuario', JSON.stringify({
      id: 1, nombre: 'Ash Ketchum', email: 'ash@pokemon.com', password: 'pikachu',
    }))
  })

  it('renderiza el título PERFIL', () => {
    render(<MemoryRouter><Perfil /></MemoryRouter>)
    expect(screen.getByText('PERFIL')).toBeInTheDocument()
  })

  it('los botones Guardar y Cancelar están desactivados si no hay cambios', () => {
    render(<MemoryRouter><Perfil /></MemoryRouter>)
    expect(screen.getByText('Guardar')).toBeDisabled()
    expect(screen.getByText('Cancelar')).toBeDisabled()
  })

  it('los botones se activan al modificar el nombre', () => {
    render(<MemoryRouter><Perfil /></MemoryRouter>)
    const inputNombre = screen.getAllByRole('textbox')[0]
    fireEvent.change(inputNombre, { target: { value: 'Misty' } })
    expect(screen.getByText('Guardar')).not.toBeDisabled()
    expect(screen.getByText('Cancelar')).not.toBeDisabled()
  })

  it('Cancelar restaura el nombre original', () => {
    render(<MemoryRouter><Perfil /></MemoryRouter>)
    const inputNombre = screen.getAllByRole('textbox')[0]
    fireEvent.change(inputNombre, { target: { value: 'Misty' } })
    fireEvent.click(screen.getByText('Cancelar'))
    expect(inputNombre.value).toBe('Ash Ketchum')
  })

  it('muestra error si la contraseña actual es incorrecta', async () => {
    render(<MemoryRouter><Perfil /></MemoryRouter>)
    const inputs = screen.getAllByRole('textbox')
    // Cambiar nombre para activar el botón guardar
    fireEvent.change(inputs[0], { target: { value: 'Misty' } })
    // Introducir contraseña incorrecta
    const passInputs = document.querySelectorAll('input[type="password"]')
    fireEvent.change(passInputs[0], { target: { value: 'wrongpass' } })
    fireEvent.change(passInputs[1], { target: { value: 'nuevapass' } })
    fireEvent.click(screen.getByText('Guardar'))
    await waitFor(() => {
      expect(screen.getByText('La contraseña actual no es correcta.')).toBeInTheDocument()
    })
  })

  it('abre el modal de confirmación al hacer clic en el botón papelera', () => {
    render(<MemoryRouter><Perfil /></MemoryRouter>)
    fireEvent.click(screen.getByTitle('Eliminar cuenta'))
    expect(screen.getByText('¿Eliminar cuenta?')).toBeInTheDocument()
  })

  it('cierra el modal de eliminación al hacer clic en Cancelar', () => {
    render(<MemoryRouter><Perfil /></MemoryRouter>)
    fireEvent.click(screen.getByTitle('Eliminar cuenta'))
    expect(screen.getByText('¿Eliminar cuenta?')).toBeInTheDocument()
    // Buscar el botón Cancelar dentro del modal específicamente
    const botonesCancelar = screen.getAllByText('Cancelar')
    const btnCancelarModal = botonesCancelar[botonesCancelar.length - 1]
    fireEvent.click(btnCancelarModal)
    expect(screen.queryByText('¿Eliminar cuenta?')).not.toBeInTheDocument()
  })
})