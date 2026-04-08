import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexto/ContextoAuth'
import cliente from '../api/cliente'
import TarjetaRutina from '../componentes/TarjetaRutina'

export default function PanelPrincipal() {
  const { usuario } = useAuth()
  const [rutinas,  setRutinas]  = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cliente.get('/rutinas')
      .then(res => setRutinas(res.data))
      .finally(() => setCargando(false))
  }, [])

  const manejarEliminar = async (id) => {
    if (!confirm('¿Eliminar esta rutina?')) return
    await cliente.delete(`/rutinas/${id}`)
    setRutinas(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Bienvenida */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white p-8 mb-8">
        <h1 className="text-2xl font-bold">
          ¡Hola, {usuario.nombre.split(' ')[0]}! 👋
        </h1>
        <p className="mt-1 text-blue-100">
          Tienes {rutinas.length} rutina{rutinas.length !== 1 ? 's' : ''} activa{rutinas.length !== 1 ? 's' : ''}.
        </p>
        <div className="flex gap-3 mt-5">
          <Link to="/mis-rutinas/nueva" className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition">
            + Nueva rutina
          </Link>
          <Link to="/catalogo" className="border border-white text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/10 transition">
            Ver ejercicios
          </Link>
        </div>
      </div>

      {/* Rutinas recientes */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Mis rutinas</h2>
        <Link to="/mis-rutinas" className="text-blue-600 text-sm hover:underline">Ver todas</Link>
      </div>

      {cargando ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : rutinas.length === 0 ? (
        <div className="tarjeta text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">📋</div>
          <p className="font-medium">Aún no tienes ninguna rutina</p>
          <Link to="/mis-rutinas/nueva" className="btn-primario inline-block mt-4 text-sm">
            Crear mi primera rutina
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rutinas.slice(0, 6).map(r => (
            <TarjetaRutina key={r.id} rutina={r} alEliminar={manejarEliminar} />
          ))}
        </div>
      )}
    </div>
  )
}
