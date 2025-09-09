<?php ob_start(); ?>

<h2>Gestión de Residentes</h2>

<div class="actions">
    <a href="/hhh/public/residentes/create">Agregar Nuevo Residente</a>
</div>

<table border="1">
    <thead>
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Unidad</th>
            <th>Estado</th>
            <th>Fecha Ingreso</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        <?php if (!empty($residentes)): ?>
            <?php foreach ($residentes as $residente): ?>
                <tr>
                    <td><?= $residente['id'] ?></td>
                    <td><?= htmlspecialchars($residente['nombre']) ?></td>
                    <td><?= htmlspecialchars($residente['apellido']) ?></td>
                    <td><?= htmlspecialchars($residente['email']) ?></td>
                    <td><?= htmlspecialchars($residente['telefono']) ?></td>
                    <td><?= htmlspecialchars($residente['unidad']) ?></td>
                    <td><?= htmlspecialchars($residente['estado']) ?></td>
                    <td><?= $residente['fecha_ingreso'] ?></td>
                    <td>
                        <a href="/hhh/public/residentes/show?id=<?= $residente['id'] ?>">Ver</a> |
                        <a href="/hhh/public/residentes/edit?id=<?= $residente['id'] ?>">Editar</a> |
                        <a href="/hhh/public/residentes/delete?id=<?= $residente['id'] ?>" 
                           onclick="return confirm('¿Está seguro de eliminar este residente?')">Eliminar</a>
                    </td>
                </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr>
                <td colspan="9">No hay residentes registrados.</td>
            </tr>
        <?php endif; ?>
    </tbody>
</table>

<?php
$content = ob_get_clean();
$title = 'Residentes - Sistema de Administración de Edificio';
include __DIR__ . '/../layouts/main.php';
?>
