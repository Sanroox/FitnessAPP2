import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexto/ContextoAuth'

export default function Registro() {
  const { registrar } = useAuth()
  const navegar = useNavigate()

  const [formulario, setFormulario] = useState({
    nombre: '', email: '', contrasena: '', contrasena_confirmation: ''
  })
  const [errores,  setErrores]  = useState({})
  const [cargando, setCargando] = useState(false)

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setErrores({})
    setCargando(true)
    try {
      await registrar(
        formulario.nombre,
        formulario.email,
        formulario.contrasena,
        formulario.contrasena_confirmation
      )
      navegar('/')
    } catch (err) {
      const datos = err.response?.data
      if (datos?.errors) setErrores(datos.errors)
      else setErrores({ general: datos?.message || 'Error al registrarse.' })
    } finally {
      setCargando(false)
    }
  }

  const campo = (clave, etiqueta, tipo = 'text', placeholder = '') => (
    <div key={clave}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{etiqueta}</label>
      <input
        type={tipo}
        className={`campo ${errores[clave] ? 'border-red-400 focus:ring-red-400' : ''}`}
        value={formulario[clave]}
        onChange={e => setFormulario({ ...formulario, [clave]: e.target.value })}
        placeholder={placeholder}
        required
      />
      {errores[clave] && <p className="text-red-500 text-xs mt-1">{errores[clave][0]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏋️</div>
          <h1 className="text-3xl font-bold text-gray-900">FitApp</h1>
          <p className="text-gray-500 mt-1">Crea tu cuenta gratis</p>
        </div>

        <div className="tarjeta shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Crear cuenta</h2>

          {errores.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
              {errores.general}
            </div>
          )}

          <form onSubmit={manejarEnvio} className="space-y-4">
            {campo('nombre',                  'Nombre completo',    'text',     'Mario San Román')}
            {campo('email',                   'Email',              'email',    'tu@email.com')}
            {campo('contrasena',              'Contraseña',         'password', '8 caracteres mínimo')}
            {campo('contrasena_confirmation', 'Repite contraseña',  'password', '••••••••')}
            <button type="submit" className="btn-primario w-full mt-2" disabled={cargando}>
              {cargando ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            ¿Ya tienes cuenta?{' '}
            <Link to="/inicio-sesion" className="text-blue-600 hover:underline font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
