import { Link } from 'react-router-dom'

export default function TarjetaRutina({ rutina, alEliminar }) {
  return (
    <div className="tarjeta hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{rutina.nombre}</h3>
          {rutina.descripcion && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{rutina.descripcion}</p>
          )}
        </div>
        <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-1 rounded-full whitespace-nowrap">
          {rutina.ejercicios_count ?? 0} ejercicios
        </span>
      </div>

      <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
        <Link to={`/mis-rutinas/${rutina.id}`} className="btn-primario text-sm py-1.5 flex-1 text-center">
          Ver rutina
        </Link>
        <button
          onClick={() => alEliminar(rutina.id)}
          className="btn-peligro text-sm py-1.5 px-3"
          title="Eliminar rutina"
        >
          🗑
        </button>
      </div>
    </div>
  )
}
