import { useState, useEffect, useCallback } from 'react'
import cliente from '../api/cliente'
import TarjetaEjercicio from '../componentes/TarjetaEjercicio'

export default function Catalogo() {
  const [ejercicios,      setEjercicios]      = useState([])
  const [gruposMusculares, setGruposMusculares] = useState([])
  const [cargando,        setCargando]        = useState(true)
  const [paginacion,      setPaginacion]      = useState(null)

  const [filtros, setFiltros] = useState({
    buscar:          '',
    grupo_muscular:  '',
    pagina:          1,
  })

  const obtenerEjercicios = useCallback(async () => {
    setCargando(true)
    try {
      const params = { page: filtros.pagina }
      if (filtros.buscar)         params.buscar         = filtros.buscar
      if (filtros.grupo_muscular) params.grupo_muscular = filtros.grupo_muscular

      const res = await cliente.get('/ejercicios', { params })
      setEjercicios(res.data.data)
      setPaginacion(res.data)
    } finally {
      setCargando(false)
    }
  }, [filtros])

  useEffect(() => { obtenerEjercicios() }, [obtenerEjercicios])

  useEffect(() => {
    cliente.get('/grupos-musculares').then(res => setGruposMusculares(res.data))
  }, [])

  const manejarBusqueda = (e) => {
    e.preventDefault()
    setFiltros(f => ({ ...f, pagina: 1 }))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Catálogo de Ejercicios</h1>

      {/* Filtros */}
      <div className="tarjeta mb-6 flex flex-col sm:flex-row gap-3">
        <form onSubmit={manejarBusqueda} className="flex gap-2 flex-1">
          <input
            className="campo"
            placeholder="Buscar ejercicio..."
            value={filtros.buscar}
            onChange={e => setFiltros(f => ({ ...f, buscar: e.target.value }))}
          />
          <button type="submit" className="btn-primario whitespace-nowrap">Buscar</button>
        </form>

        <select
          className="campo sm:w-52"
          value={filtros.grupo_muscular}
          onChange={e => setFiltros(f => ({ ...f, grupo_muscular: e.target.value, pagina: 1 }))}
        >
          <option value="">Todos los músculos</option>
          {gruposMusculares.map(g => (
            <option key={g} value={g} className="capitalize">{g}</option>
          ))}
        </select>
      </div>

      {/* Rejilla de ejercicios */}
      {cargando ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : ejercicios.length === 0 ? (
        <div className="tarjeta text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p>No se encontraron ejercicios con esos filtros.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {ejercicios.map(ej => (
              <TarjetaEjercicio key={ej.id} ejercicio={ej} />
            ))}
          </div>

          {/* Paginación */}
          {paginacion && paginacion.last_page > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                className="btn-secundario py-1.5 px-3"
                disabled={filtros.pagina <= 1}
                onClick={() => setFiltros(f => ({ ...f, pagina: f.pagina - 1 }))}
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-500">
                Página {paginacion.current_page} de {paginacion.last_page}
              </span>
              <button
                className="btn-secundario py-1.5 px-3"
                disabled={filtros.pagina >= paginacion.last_page}
                onClick={() => setFiltros(f => ({ ...f, pagina: f.pagina + 1 }))}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
