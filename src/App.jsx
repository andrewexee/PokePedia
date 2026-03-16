import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SplashScreen from './pages/SplashScreen'
import Login        from './pages/Login'
import Register     from './pages/Register'
import Pokedex      from './pages/Pokedex'
import Tipos        from './pages/Tipos'
import Mapas        from './pages/Mapas'
import Perfil       from './pages/Perfil'
import Ajustes      from './pages/Ajustes'

// Guarda de ruta: redirige a /login si no hay sesión activa
function RutaPrivada({ children }) {
  const usuario = sessionStorage.getItem('usuario')
  return usuario ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/"         element={<SplashScreen />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas privadas */}
        <Route path="/pokedex" element={<RutaPrivada><Pokedex /></RutaPrivada>} />
        <Route path="/tipos"   element={<RutaPrivada><Tipos   /></RutaPrivada>} />
        <Route path="/mapas"   element={<RutaPrivada><Mapas   /></RutaPrivada>} />
        <Route path="/perfil"   element={<RutaPrivada><Perfil   /></RutaPrivada>} />
        <Route path="/ajustes"  element={<RutaPrivada><Ajustes  /></RutaPrivada>} />

        {/* Ruta no encontrada → volver al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}