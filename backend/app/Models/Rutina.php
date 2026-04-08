<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rutina extends Model
{
    protected $table = 'rutinas';

    protected $fillable = [
        'usuario_id',
        'nombre',
        'descripcion',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function ejercicios()
    {
        return $this->hasMany(RutinaEjercicio::class, 'rutina_id')->orderBy('orden');
    }
}
