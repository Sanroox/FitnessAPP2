import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import cliente from '../api/cliente'

export default function DetalleEjercicio() {
  const { id } = useParams()
  const [ejercicio, setEjercicio] = useState(null)
  const [cargando,  setCargando]  = useState(true)

  useEffect(() => {
    cliente.get(`/ejercicios/${id}`)
      .then(res => setEjercicio(res.data))
      .finally(() => setCargando(false))
  }, [id])

  if (cargando) return (
    <div className="flex justify-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  )

  if (!ejercicio) return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-400">
      Ejercicio no encontrado.{' '}
      <Link to="/catalogo" className="text-blue-600 hover:underline">Volver al catálogo</Link>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/catalogo" className="text-blue-600 hover:underline text-sm">
        ← Volver al catálogo
      </Link>

      <div className="tarjeta mt-5">
        {ejercicio.url_gif && (
          <img
            src={ejercicio.url_gif}
            alt={ejercicio.nombre}
            className="w-full max-h-72 object-contain rounded-lg bg-gray-100 mb-6"
          />
        )}

        <h1 className="text-2xl font-bold capitalize text-gray-900">{ejercicio.nombre}</h1>

        <div className="grid grid-cols-2 gap-4 mt-5">
          {[
            ['Grupo muscular',   ejercicio.grupo_muscular],
            ['Músculo objetivo', ejercicio.musculo_objetivo],
            ['Equipamiento',     ejercicio.equipamiento],
          ].map(([etiqueta, valor]) => (
            <div key={etiqueta} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{etiqueta}</p>
              <p className="font-semibold capitalize text-gray-800 mt-0.5">{valor || '—'}</p>
            </div>
          ))}
        </div>

        {ejercicio.instrucciones && (
          <div className="mt-6">
            <h2 className="font-semibold text-gray-900 mb-2">Instrucciones</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{ejercicio.instrucciones}</p>
          </div>
        )}
      </div>
    </div>
  )
}
