<?php ob_start(); ?>

<h2>Editar Residente</h2>

<?php if ($residente): ?>
    <form method="POST" action="/hhh/public/residentes/edit?id=<?= $residente['id'] ?>">
        <div>
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" value="<?= htmlspecialchars($residente['nombre']) ?>" required>
        </div>
        
        <div>
            <label for="apellido">Apellido:</label>
            <input type="text" id="apellido" name="apellido" value="<?= htmlspecialchars($residente['apellido']) ?>" required>
        </div>
        
        <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" value="<?= htmlspecialchars($residente['email']) ?>" required>
        </div>
        
        <div>
            <label for="telefono">Teléfono:</label>
            <input type="text" id="telefono" name="telefono" value="<?= htmlspecialchars($residente['telefono']) ?>" required>
        </div>
        
        <div>
            <label for="unidad">Unidad:</label>
            <input type="text" id="unidad" name="unidad" value="<?= htmlspecialchars($residente['unidad']) ?>" required>
        </div>
        
        <div>
            <label for="estado">Estado:</label>
            <select id="estado" name="estado" required>
                <option value="activo" <?= $residente['estado'] === 'activo' ? 'selected' : '' ?>>Activo</option>
                <option value="inactivo" <?= $residente['estado'] === 'inactivo' ? 'selected' : '' ?>>Inactivo</option>
                <option value="suspendido" <?= $residente['estado'] === 'suspendido' ? 'selected' : '' ?>>Suspendido</option>
            </select>
        </div>
        
        <div>
            <button type="submit">Actualizar Residente</button>
            <a href="/hhh/public/residentes">Cancelar</a>
        </div>
    </form>
<?php else: ?>
    <p>Residente no encontrado.</p>
    <a href="/hhh/public/residentes">Volver a la lista</a>
<?php endif; ?>

<?php
$content = ob_get_clean();
$title = 'Editar Residente - Sistema de Administración de Edificio';
include __DIR__ . '/../layouts/main.php';
?>
