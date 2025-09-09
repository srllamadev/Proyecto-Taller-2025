<?php ob_start(); ?>

<h2>Gestión de Pagos</h2>

<div class="actions">
    <a href="/hhh/public/pagos/create">Crear Nueva Factura</a>
    <a href="/hhh/public/pagos/reporte">Ver Reporte Financiero</a>
</div>

<div class="filtros">
    <a href="/hhh/public/pagos?estado=todos" <?= $estado === 'todos' ? 'style="font-weight:bold"' : '' ?>>Todos</a> |
    <a href="/hhh/public/pagos?estado=pendientes" <?= $estado === 'pendientes' ? 'style="font-weight:bold"' : '' ?>>Solo Pendientes</a>
</div>

<table border="1">
    <thead>
        <tr>
            <th>ID</th>
            <th>Residente</th>
            <th>Unidad</th>
            <th>Concepto</th>
            <th>Monto</th>
            <th>Fecha Vencimiento</th>
            <th>Fecha Pago</th>
            <th>Estado</th>
            <th>Método</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        <?php if (!empty($pagos)): ?>
            <?php foreach ($pagos as $pago): ?>
                <tr>
                    <td><?= $pago['id'] ?></td>
                    <td><?= htmlspecialchars(($pago['nombre'] ?? '') . ' ' . ($pago['apellido'] ?? '')) ?></td>
                    <td><?= htmlspecialchars($pago['unidad'] ?? 'N/A') ?></td>
                    <td><?= htmlspecialchars($pago['concepto']) ?></td>
                    <td>$<?= number_format($pago['monto'], 2) ?></td>
                    <td><?= $pago['fecha_vencimiento'] ?></td>
                    <td><?= $pago['fecha_pago'] ?? 'No pagado' ?></td>
                    <td>
                        <span style="color: <?= $pago['estado'] === 'pagado' ? 'green' : ($pago['estado'] === 'vencido' ? 'red' : 'orange') ?>">
                            <?= ucfirst($pago['estado']) ?>
                        </span>
                    </td>
                    <td><?= htmlspecialchars($pago['metodo_pago'] ?? 'N/A') ?></td>
                    <td>
                        <?php if ($pago['estado'] === 'pendiente' || $pago['estado'] === 'vencido'): ?>
                            <form method="POST" action="/hhh/public/pagos/marcar-pagado" style="display: inline;">
                                <input type="hidden" name="id" value="<?= $pago['id'] ?>">
                                <select name="metodo_pago" required>
                                    <option value="">Método</option>
                                    <option value="efectivo">Efectivo</option>
                                    <option value="transferencia">Transferencia</option>
                                    <option value="tarjeta">Tarjeta</option>
                                    <option value="cheque">Cheque</option>
                                </select>
                                <button type="submit">Marcar Pagado</button>
                            </form>
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr>
                <td colspan="10">No hay pagos registrados.</td>
            </tr>
        <?php endif; ?>
    </tbody>
</table>

<?php
$content = ob_get_clean();
$title = 'Gestión de Pagos - Sistema de Administración de Edificio';
include __DIR__ . '/../layouts/main.php';
?>
