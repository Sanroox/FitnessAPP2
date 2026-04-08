import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexto/ContextoAuth'

export default function BarraNavegacion() {
  const { usuario, cerrarSesion } = useAuth()
  const navegar   = useNavigate()
  const ubicacion = useLocation()

  const manejarCierreSesion = async () => {
    await cerrarSesion()
    navegar('/inicio-sesion')
  }

  const esActivo = (ruta) =>
    ubicacion.pathname === ruta || ubicacion.pathname.startsWith(ruta + '/')
      ? 'text-blue-600 font-semibold'
      : 'text-gray-600 hover:text-blue-600'

  if (!usuario) return null

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <span className="text-2xl">🏋️</span>
          FitApp
        </Link>

        {/* Enlaces */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/"            className={esActivo('/')            + ' transition-colors'}>Inicio</Link>
          <Link to="/catalogo"    className={esActivo('/catalogo')    + ' transition-colors'}>Ejercicios</Link>
          <Link to="/mis-rutinas" className={esActivo('/mis-rutinas') + ' transition-colors'}>Mis Rutinas</Link>
          {usuario.rol === 'admin' && (
            <Link to="/panel-admin" className={esActivo('/panel-admin') + ' transition-colors'}>Admin</Link>
          )}
        </div>

        {/* Usuario */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden md:block">
            Hola, <span className="font-medium text-gray-800">{usuario.nombre.split(' ')[0]}</span>
          </span>
          <button onClick={manejarCierreSesion} className="btn-secundario text-sm py-1.5 px-3">
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  )
}
