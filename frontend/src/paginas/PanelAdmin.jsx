import { useState, useEffect } from 'react'
import cliente from '../api/cliente'

export default function PanelAdmin() {
  const [estadisticas, setEstadisticas] = useState(null)
  const [usuarios,     setUsuarios]     = useState([])
  const [sincronizando, setSincronizando] = useState(false)
  const [mensajeSync,  setMensajeSync]  = useState('')
  const [pestana,      setPestana]      = useState('estadisticas')

  useEffect(() => {
    cliente.get('/admin/estadisticas').then(res => setEstadisticas(res.data))
    cliente.get('/admin/usuarios').then(res => setUsuarios(res.data))
  }, [])

  const manejarSincronizacion = async () => {
    setSincronizando(true)
    setMensajeSync('')
    try {
      const res = await cliente.post('/admin/sincronizar-ejercicios')
      setMensajeSync(res.data.mensaje)
    } catch {
      setMensajeSync('Error durante la sincronización. Comprueba tu clave de API.')
    } finally {
      setSincronizando(false)
    }
  }

  const manejarCambioRol = async (usuarioId, rol) => {
    await cliente.put(`/admin/usuarios/${usuarioId}/rol`, { rol })
    setUsuarios(prev => prev.map(u => u.id === usuarioId ? { ...u, rol } : u))
  }

  const manejarEliminarUsuario = async (usuarioId) => {
    if (!confirm('¿Eliminar este usuario y todas sus rutinas?')) return
    await cliente.delete(`/admin/usuarios/${usuarioId}`)
    setUsuarios(prev => prev.filter(u => u.id !== usuarioId))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de Administración</h1>

      {/* Pestañas */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          ['estadisticas', '📊 Estadísticas'],
          ['usuarios',     '👥 Usuarios'],
          ['sincronizar',  '🔄 Sincronización'],
        ].map(([clave, etiqueta]) => (
          <button
            key={clave}
            onClick={() => setPestana(clave)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
              pestana === clave
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      {/* Estadísticas */}
      {pestana === 'estadisticas' && estadisticas && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            ['Usuarios totales',    estadisticas.total_usuarios,   '👤'],
            ['Nuevos esta semana',  estadisticas.usuarios_semana,  '📈'],
            ['Ejercicios en BD',    estadisticas.total_ejercicios, '🏋️'],
            ['Rutinas creadas',     estadisticas.total_rutinas,    '📋'],
          ].map(([etiqueta, valor, icono]) => (
            <div key={etiqueta} className="tarjeta text-center">
              <div className="text-3xl mb-2">{icono}</div>
              <div className="text-3xl font-bold text-blue-600">{valor}</div>
              <div className="text-sm text-gray-500 mt-1">{etiqueta}</div>
            </div>
          ))}
        </div>
      )}

      {/* Usuarios */}
      {pestana === 'usuarios' && (
        <div className="tarjeta overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-left">
                <th className="pb-3 font-medium">Usuario</th>
                <th className="pb-3 font-medium">Rutinas</th>
                <th className="pb-3 font-medium">Rol</th>
                <th className="pb-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {usuarios.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="py-3">
                    <p className="font-medium text-gray-900">{u.nombre}</p>
                    <p className="text-gray-400 text-xs">{u.email}</p>
                  </td>
                  <td className="py-3 text-gray-500">{u.rutinas_count}</td>
                  <td className="py-3">
                    <select
                      value={u.rol}
                      onChange={e => manejarCambioRol(u.id, e.target.value)}
                      className="border border-gray-200 rounded px-2 py-1 text-xs"
                    >
                      <option value="usuario">usuario</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => manejarEliminarUsuario(u.id)}
                      className="text-red-400 hover:text-red-600 text-xs font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sincronización */}
      {pestana === 'sincronizar' && (
        <div className="tarjeta max-w-md">
          <h2 className="font-semibold text-gray-900 mb-2">Sincronizar con ExerciseDB</h2>
          <p className="text-sm text-gray-500 mb-5">
            Importa todos los ejercicios desde la API de ExerciseDB. Este proceso puede tardar unos minutos.
          </p>
          {mensajeSync && (
            <div className={`rounded-lg px-4 py-3 text-sm mb-4 ${
              mensajeSync.includes('Error')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {mensajeSync}
            </div>
          )}
          <button
            onClick={manejarSincronizacion}
            disabled={sincronizando}
            className="btn-primario w-full"
          >
            {sincronizando ? '⏳ Sincronizando...' : '🔄 Iniciar sincronización'}
          </button>
          <p className="text-xs text-gray-400 mt-3">
            Asegúrate de configurar EXERCISEDB_CLAVE_API en el .env del backend.
          </p>
        </div>
      )}
    </div>
  )
}
