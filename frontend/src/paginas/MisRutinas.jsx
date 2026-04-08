import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import cliente from '../api/cliente'
import TarjetaRutina from '../componentes/TarjetaRutina'

export default function MisRutinas() {
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis Rutinas</h1>
        <Link to="/mis-rutinas/nueva" className="btn-primario">+ Nueva rutina</Link>
      </div>

      {cargando ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : rutinas.length === 0 ? (
        <div className="tarjeta text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-lg font-medium">No tienes rutinas todavía</p>
          <p className="text-sm mt-1">Crea tu primera rutina y empieza a entrenar</p>
          <Link to="/mis-rutinas/nueva" className="btn-primario inline-block mt-5">
            Crear rutina
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rutinas.map(r => (
            <TarjetaRutina key={r.id} rutina={r} alEliminar={manejarEliminar} />
          ))}
        </div>
      )}
    </div>
  )
}
