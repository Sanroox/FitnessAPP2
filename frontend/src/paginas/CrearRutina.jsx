import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import cliente from '../api/cliente'

export default function CrearRutina() {
  const navegar = useNavigate()
  const [formulario, setFormulario] = useState({ nombre: '', descripcion: '' })
  const [error,      setError]      = useState('')
  const [cargando,   setCargando]   = useState(false)

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const res = await cliente.post('/rutinas', formulario)
      navegar(`/mis-rutinas/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la rutina.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link to="/mis-rutinas" className="text-blue-600 hover:underline text-sm">← Volver</Link>

      <div className="tarjeta mt-5">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Nueva Rutina</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={manejarEnvio} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la rutina *</label>
            <input
              className="campo"
              value={formulario.nombre}
              onChange={e => setFormulario({ ...formulario, nombre: e.target.value })}
              placeholder="Ej: Día de piernas, Torso A..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
            <textarea
              className="campo resize-none"
              rows={3}
              value={formulario.descripcion}
              onChange={e => setFormulario({ ...formulario, descripcion: e.target.value })}
              placeholder="Describe el objetivo de esta rutina..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primario flex-1" disabled={cargando}>
              {cargando ? 'Creando...' : 'Crear rutina'}
            </button>
            <Link to="/mis-rutinas" className="btn-secundario flex-1 text-center">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
