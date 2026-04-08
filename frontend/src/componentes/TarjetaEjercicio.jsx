import { Link } from 'react-router-dom'

const COLORES_MUSCULO = {
  pecho:        'bg-red-100 text-red-700',
  espalda:      'bg-blue-100 text-blue-700',
  hombros:      'bg-yellow-100 text-yellow-700',
  brazos:       'bg-purple-100 text-purple-700',
  piernas:      'bg-green-100 text-green-700',
  abdominales:  'bg-orange-100 text-orange-700',
  cardio:       'bg-pink-100 text-pink-700',
}

export default function TarjetaEjercicio({ ejercicio, alAnadir }) {
  const colorInsignia = COLORES_MUSCULO[ejercicio.grupo_muscular] || 'bg-gray-100 text-gray-700'

  return (
    <div className="tarjeta hover:shadow-md transition-shadow flex flex-col gap-3">
      {ejercicio.url_gif && (
        <img
          src={ejercicio.url_gif}
          alt={ejercicio.nombre}
          className="w-full h-40 object-cover rounded-lg bg-gray-100"
          loading="lazy"
        />
      )}

      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 capitalize">{ejercicio.nombre}</h3>
        <p className="text-sm text-gray-500 capitalize mt-0.5">{ejercicio.equipamiento}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${colorInsignia}`}>
          {ejercicio.grupo_muscular}
        </span>
        <div className="flex gap-2">
          <Link to={`/catalogo/${ejercicio.id}`} className="text-sm text-blue-600 hover:underline">
            Ver
          </Link>
          {alAnadir && (
            <button
              onClick={() => alAnadir(ejercicio)}
              className="text-sm text-green-600 hover:underline font-medium"
            >
              + Añadir
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
