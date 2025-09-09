<?php ob_start(); ?>

<h2>Agregar Nuevo Residente</h2>

<form method="POST" action="/hhh/public/residentes/create">
    <div>
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required>
    </div>
    
    <div>
        <label for="apellido">Apellido:</label>
        <input type="text" id="apellido" name="apellido" required>
    </div>
    
    <div>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
    </div>
    
    <div>
        <label for="telefono">Teléfono:</label>
        <input type="text" id="telefono" name="telefono" required>
    </div>
    
    <div>
        <label for="unidad">Unidad:</label>
        <input type="text" id="unidad" name="unidad" placeholder="Ej: 101, 205, etc." required>
    </div>
    
    <div>
        <button type="submit">Crear Residente</button>
        <a href="/hhh/public/residentes">Cancelar</a>
    </div>
</form>

<?php
$content = ob_get_clean();
$title = 'Agregar Residente - Sistema de Administración de Edificio';
include __DIR__ . '/../layouts/main.php';
?>
