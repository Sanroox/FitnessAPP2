<?php

namespace App\Http\Controllers;

use App\Models\Rutina;
use App\Models\RutinaEjercicio;
use Illuminate\Http\Request;

class ControladorRutina extends Controller
{
    public function listar(Request $request)
    {
        $rutinas = Rutina::where('usuario_id', $request->user()->id)
            ->withCount('ejercicios')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($rutinas);
    }

    public function crear(Request $request)
    {
        $validado = $request->validate([
            'nombre'      => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
        ]);

        $rutina = Rutina::create([
            'usuario_id'  => $request->user()->id,
            'nombre'      => $validado['nombre'],
            'descripcion' => $validado['descripcion'] ?? null,
        ]);

        return response()->json($rutina, 201);
    }

    public function mostrar(Request $request, $id)
    {
        $rutina = Rutina::where('usuario_id', $request->user()->id)
            ->with(['ejercicios.ejercicio'])
            ->findOrFail($id);

        return response()->json($rutina);
    }

    public function actualizar(Request $request, $id)
    {
        $rutina = Rutina::where('usuario_id', $request->user()->id)->findOrFail($id);

        $validado = $request->validate([
            'nombre'      => 'sometimes|required|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
        ]);

        $rutina->update($validado);

        return response()->json($rutina);
    }

    public function eliminar(Request $request, $id)
    {
        $rutina = Rutina::where('usuario_id', $request->user()->id)->findOrFail($id);
        $rutina->delete();

        return response()->json(['mensaje' => 'Rutina eliminada correctamente.']);
    }

    public function agregarEjercicio(Request $request, $id)
    {
        $rutina = Rutina::where('usuario_id', $request->user()->id)->findOrFail($id);

        $validado = $request->validate([
            'ejercicio_id'  => 'required|exists:ejercicios,id',
            'series'        => 'required|integer|min:1|max:20',
            'repeticiones'  => 'required|integer|min:1|max:100',
            'descanso_seg'  => 'nullable|integer|min:0|max:600',
            'notas'         => 'nullable|string|max:500',
            'orden'         => 'nullable|integer|min:0',
        ]);

        if (!isset($validado['orden'])) {
            $validado['orden'] = ($rutina->ejercicios()->max('orden') ?? -1) + 1;
        }

        $rutinaEjercicio = RutinaEjercicio::create([
            'rutina_id'    => $rutina->id,
            'ejercicio_id' => $validado['ejercicio_id'],
            'series'       => $validado['series'],
            'repeticiones' => $validado['repeticiones'],
            'descanso_seg' => $validado['descanso_seg'] ?? 60,
            'notas'        => $validado['notas'] ?? null,
            'orden'        => $validado['orden'],
        ]);

        return response()->json($rutinaEjercicio->load('ejercicio'), 201);
    }

    public function actualizarEjercicio(Request $request, $id, $ejId)
    {
        $rutina = Rutina::where('usuario_id', $request->user()->id)->findOrFail($id);
        $re = RutinaEjercicio::where('rutina_id', $rutina->id)->findOrFail($ejId);

        $validado = $request->validate([
            'series'       => 'sometimes|integer|min:1|max:20',
            'repeticiones' => 'sometimes|integer|min:1|max:100',
            'descanso_seg' => 'nullable|integer|min:0|max:600',
            'notas'        => 'nullable|string|max:500',
            'orden'        => 'nullable|integer|min:0',
        ]);

        $re->update($validado);

        return response()->json($re->load('ejercicio'));
    }

    public function quitarEjercicio(Request $request, $id, $ejId)
    {
        $rutina = Rutina::where('usuario_id', $request->user()->id)->findOrFail($id);
        $re = RutinaEjercicio::where('rutina_id', $rutina->id)->findOrFail($ejId);
        $re->delete();

        return response()->json(['mensaje' => 'Ejercicio quitado de la rutina.']);
    }
}
