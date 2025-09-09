<?php ob_start(); ?>

<h2>Control de Acceso</h2>

<div class="actions">
    <a href="/hhh/public/acceso/registrar">Registrar Acceso Manual</a>
    <a href="/hhh/public/acceso/validar">Sistema de Validación</a>
</div>

<div class="filtros">
    <form method="GET" action="/hhh/public/acceso">
        <label for="fecha_inicio">Fecha Inicio:</label>
        <input type="date" id="fecha_inicio" name="fecha_inicio" value="<?= $fecha_inicio ?>">
        
        <label for="fecha_fin">Fecha Fin:</label>
        <input type="date" id="fecha_fin" name="fecha_fin" value="<?= $fecha_fin ?>">
        
        <button type="submit">Filtrar</button>
    </form>
</div>

<h3>Registros de Acceso (<?= $fecha_inicio ?> - <?= $fecha_fin ?>)</h3>

<table border="1">
    <thead>
        <tr>
            <th>ID</th>
            <th>Residente</th>
            <th>Unidad</th>
            <th>Tarjeta RFID</th>
            <th>Fecha/Hora</th>
            <th>Punto de Acceso</th>
            <th>Estado</th>
        </tr>
    </thead>
    <tbody>
        <?php if (!empty($accesos)): ?>
            <?php foreach ($accesos as $acceso): ?>
                <tr>
                    <td><?= $acceso['id'] ?></td>
                    <td><?= htmlspecialchars($acceso['nombre'] . ' ' . $acceso['apellido']) ?></td>
                    <td><?= htmlspecialchars($acceso['unidad']) ?></td>
                    <td><?= htmlspecialchars($acceso['tarjeta_rfid']) ?></td>
                    <td><?= $acceso['fecha_acceso'] ?></td>
                    <td><?= htmlspecialchars($acceso['punto_acceso']) ?></td>
                    <td><?= htmlspecialchars($acceso['estado']) ?></td>
                </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr>
                <td colspan="7">No hay registros de acceso para el período seleccionado.</td>
            </tr>
        <?php endif; ?>
    </tbody>
</table>

<?php
$content = ob_get_clean();
$title = 'Control de Acceso - Sistema de Administración de Edificio';
include __DIR__ . '/../layouts/main.php';
?>
