# FitApp — Plataforma de Rutinas de Entrenamiento

Proyecto DAW intermodular · IES Gabriel García Márquez  
**Mario San Román Martínez** y **Ángel Martín Salso**

---

## Estructura del proyecto

```
fitapp/
├── backend/    ← Laravel 11 (API REST)
└── frontend/   ← React + Vite + TailwindCSS
```

---

## Requisitos previos

| Herramienta    | Versión mínima |
|----------------|----------------|
| PHP            | 8.2            |
| Composer       | 2.x            |
| Node.js        | 18.x           |
| npm            | 9.x            |
| MySQL/MariaDB  | 8.0 / 10.6     |

---

## Puesta en marcha del Backend (Laravel)

```bash
cd backend

# 1. Instalar dependencias
composer install

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Generar clave de aplicación
php artisan key:generate

# 4. Editar .env con los datos de tu base de datos:
#    DB_DATABASE=fitapp_bd
#    DB_USERNAME=root
#    DB_PASSWORD=

# 5. Crear la base de datos en MySQL:
#    CREATE DATABASE fitapp_bd CHARACTER SET utf8mb4;

# 6. Ejecutar migraciones y datos de prueba
php artisan migrate --seed

# 7. Arrancar el servidor
php artisan serve
# → http://localhost:8000
```

### Configurar Sanctum (CORS)
En `config/cors.php` asegúrate de tener:
```php
'allowed_origins' => ['http://localhost:5173'],
'supports_credentials' => true,
```

### Registrar el middleware de admin
En `bootstrap/app.php` añadir el alias:
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \App\Http\Middleware\MiddlewareAdmin::class,
    ]);
})
```

---

## Puesta en marcha del Frontend (React)

```bash
cd frontend

# 1. Instalar dependencias
npm install

# 2. Arrancar servidor de desarrollo
npm run dev
# → http://localhost:5173
```

---

## Credenciales de prueba

| Rol     | Email               | Contraseña |
|---------|---------------------|------------|
| Admin   | admin@fitapp.com    | password   |
| Usuario | mario@fitapp.com    | password   |

---

## Sincronización con ExerciseDB

1. Obtén tu clave de API gratuita en [RapidAPI · ExerciseDB](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb)
2. Añádela al `.env` del backend: `EXERCISEDB_CLAVE_API=tu_clave`
3. Entra como admin → **Panel Admin → Sincronización → Iniciar**

---

## Endpoints principales de la API

| Método | Ruta                                  | Descripción                        |
|--------|---------------------------------------|------------------------------------|
| POST   | /api/registro                         | Registro de usuario                |
| POST   | /api/inicio-sesion                    | Login (devuelve token Sanctum)     |
| POST   | /api/cerrar-sesion                    | Cierre de sesión                   |
| GET    | /api/perfil                           | Datos del usuario autenticado      |
| GET    | /api/ejercicios                       | Listado paginado de ejercicios     |
| GET    | /api/ejercicios?buscar=X              | Búsqueda por nombre                |
| GET    | /api/ejercicios?grupo_muscular=X      | Filtrar por grupo muscular         |
| GET    | /api/grupos-musculares                | Lista de grupos musculares         |
| GET    | /api/rutinas                          | Rutinas del usuario actual         |
| POST   | /api/rutinas                          | Crear nueva rutina                 |
| GET    | /api/rutinas/:id                      | Detalle de una rutina              |
| PUT    | /api/rutinas/:id                      | Actualizar rutina                  |
| DELETE | /api/rutinas/:id                      | Eliminar rutina                    |
| POST   | /api/rutinas/:id/ejercicios           | Añadir ejercicio a rutina          |
| PUT    | /api/rutinas/:id/ejercicios/:ejId     | Actualizar ejercicio en rutina     |
| DELETE | /api/rutinas/:id/ejercicios/:ejId     | Quitar ejercicio de rutina         |
| GET    | /api/admin/estadisticas               | Estadísticas globales              |
| GET    | /api/admin/usuarios                   | Listado de usuarios                |
| PUT    | /api/admin/usuarios/:id/rol           | Cambiar rol de usuario             |
| DELETE | /api/admin/usuarios/:id               | Eliminar usuario                   |
| POST   | /api/admin/sincronizar-ejercicios     | Sincronizar con ExerciseDB         |

---

## Stack tecnológico

**Backend:** PHP 8.2 · Laravel 11 · Sanctum · Eloquent ORM · MySQL  
**Frontend:** React 18 · Vite · TailwindCSS · Axios · React Router 6  
**API externa:** ExerciseDB (RapidAPI)

---

## Flujo de trabajo Git

```
main         ← producción
develop      ← integración
feature/X    ← desarrollo de funcionalidades
```

Nunca hagas commits directamente a `main`. Abre siempre un Pull Request a `develop`.
