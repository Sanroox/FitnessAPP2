import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import cliente from '../api/cliente'

function ModalAgregarEjercicio({ rutinaId, alAgregar, alCerrar }) {
  const [ejercicios, setEjercicios] = useState([])
  const [buscar,     setBuscar]     = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
  const [series,     setSeries]     = useState(3)
  const [repeticiones, setRepeticiones] = useState(10)
  const [descanso,   setDescanso]   = useState(60)
  const [cargando,   setCargando]   = useState(false)

  useEffect(() => {
    const temporizador = setTimeout(() => {
      cliente.get('/ejercicios', { params: { buscar, per_page: 10 } })
        .then(res => setEjercicios(res.data.data || res.data))
    }, 300)
    return () => clearTimeout(temporizador)
  }, [buscar])

  const manejarAgregar = async () => {
    if (!seleccionado) return
    setCargando(true)
    try {
      const res = await cliente.post(`/rutinas/${rutinaId}/ejercicios`, {
        ejercicio_id: seleccionado.id,
        series,
        repeticiones,
        descanso_seg: descanso,
      })
      alAgregar(res.data)
      alCerrar()
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Añadir ejercicio</h3>
          <button onClick={alCerrar} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="p-5 space-y-4">
          <input
            className="campo"
            placeholder="Buscar ejercicio..."
            value={buscar}
            onChange={e => setBuscar(e.target.value)}
            autoFocus
          />

          <div className="max-h-48 overflow-y-auto space-y-1 border border-gray-100 rounded-lg p-2">
            {ejercicios.map(ej => (
              <button
                key={ej.id}
                onClick={() => setSeleccionado(ej)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition capitalize ${
                  seleccionado?.id === ej.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {ej.nombre} <span className="opacity-60">· {ej.grupo_muscular}</span>
              </button>
            ))}
          </div>

          {seleccionado && (
            <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-lg p-4">
              {[
                ['Series',       series,       setSeries,       1, 20],
                ['Repeticiones', repeticiones, setRepeticiones, 1, 100],
                ['Descanso (s)', descanso,     setDescanso,     0, 600],
              ].map(([etiqueta, valor, setter, min, max]) => (
                <div key={etiqueta}>
                  <label className="text-xs text-gray-500 block mb-1">{etiqueta}</label>
                  <input
                    type="number"
                    className="campo text-center"
                    value={valor}
                    min={min}
                    max={max}
                    onChange={e => setter(Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button
            onClick={manejarAgregar}
            disabled={!seleccionado || cargando}
            className="btn-primario flex-1"
          >
            {cargando ? 'Añadiendo...' : '+ Añadir a la rutina'}
          </button>
          <button onClick={alCerrar} className="btn-secundario">Cancelar</button>
        </div>
      </div>
    </div>
  )
}

export default function DetalleRutina() {
  const { id }  = useParams()
  const navegar = useNavigate()
  const [rutina,      setRutina]      = useState(null)
  const [cargando,    setCargando]    = useState(true)
  const [mostrarModal, setMostrarModal] = useState(false)

  useEffect(() => {
    cliente.get(`/rutinas/${id}`)
      .then(res => setRutina(res.data))
      .finally(() => setCargando(false))
  }, [id])

  const manejarQuitarEjercicio = async (reId) => {
    if (!confirm('¿Quitar este ejercicio de la rutina?')) return
    await cliente.delete(`/rutinas/${id}/ejercicios/${reId}`)
    setRutina(prev => ({
      ...prev,
      ejercicios: prev.ejercicios.filter(e => e.id !== reId)
    }))
  }

  const manejarAgregarEjercicio = (re) => {
    setRutina(prev => ({ ...prev, ejercicios: [...prev.ejercicios, re] }))
  }

  const manejarEliminarRutina = async () => {
    if (!confirm('¿Eliminar esta rutina permanentemente?')) return
    await cliente.delete(`/rutinas/${id}`)
    navegar('/mis-rutinas')
  }

  if (cargando) return (
    <div className="flex justify-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  )

  if (!rutina) return (
    <div className="text-center py-12 text-gray-400">
      Rutina no encontrada.{' '}
      <Link to="/mis-rutinas" className="text-blue-600 hover:underline">Volver</Link>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/mis-rutinas" className="text-blue-600 hover:underline text-sm">← Mis rutinas</Link>

      <div className="flex items-start justify-between mt-5 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{rutina.nombre}</h1>
          {rutina.descripcion && (
            <p className="text-gray-500 mt-1">{rutina.descripcion}</p>
          )}
        </div>
        <button onClick={manejarEliminarRutina} className="btn-peligro text-sm py-1.5 px-3">
          Eliminar
        </button>
      </div>

      {/* Lista de ejercicios */}
      <div className="space-y-3 mb-5">
        {rutina.ejercicios.length === 0 ? (
          <div className="tarjeta text-center py-10 text-gray-400">
            <p>Esta rutina no tiene ejercicios todavía.</p>
          </div>
        ) : (
          rutina.ejercicios.map((re, i) => (
            <div key={re.id} className="tarjeta flex items-center gap-4">
              <span className="text-gray-400 font-bold text-sm w-6 text-center">{i + 1}</span>
              {re.ejercicio?.url_gif && (
                <img
                  src={re.ejercicio.url_gif}
                  alt=""
                  className="w-14 h-14 object-cover rounded-lg bg-gray-100"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold capitalize truncate">{re.ejercicio?.nombre}</p>
                <p className="text-sm text-gray-500">
                  {re.series} series × {re.repeticiones} reps · {re.descanso_seg}s descanso
                </p>
              </div>
              <button
                onClick={() => manejarQuitarEjercicio(re.id)}
                className="text-red-400 hover:text-red-600 transition text-lg"
                title="Quitar ejercicio"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <button onClick={() => setMostrarModal(true)} className="btn-primario w-full">
        + Añadir ejercicio
      </button>

      {mostrarModal && (
        <ModalAgregarEjercicio
          rutinaId={id}
          alAgregar={manejarAgregarEjercicio}
          alCerrar={() => setMostrarModal(false)}
        />
      )}
    </div>
  )
}
