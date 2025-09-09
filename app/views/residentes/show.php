<?php ob_start(); ?>

<h2>Detalle del Residente</h2>

<?php if ($residente): ?>
    <div class="residente-info">
        <h3>Información Personal</h3>
        <p><strong>Nombre:</strong> <?= htmlspecialchars($residente['nombre'] . ' ' . $residente['apellido']) ?></p>
        <p><strong>Email:</strong> <?= htmlspecialchars($residente['email']) ?></p>
        <p><strong>Teléfono:</strong> <?= htmlspecialchars($residente['telefono']) ?></p>
        <p><strong>Unidad:</strong> <?= htmlspecialchars($residente['unidad']) ?></p>
        <p><strong>Estado:</strong> <?= htmlspecialchars($residente['estado']) ?></p>
        <p><strong>Fecha de Ingreso:</strong> <?= $residente['fecha_ingreso'] ?></p>
    </div>

    <div class="residente-pagos">
        <h3>Historial de Pagos</h3>
        <?php if (!empty($pagos)): ?>
            <table border="1">
                <thead>
                    <tr>
                        <th>Concepto</th>
                        <th>Monto</th>
                        <th>Fecha Vencimiento</th>
                        <th>Fecha Pago</th>
                        <th>Estado</th>
                        <th>Método</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($pagos as $pago): ?>
                        <tr>
                            <td><?= htmlspecialchars($pago['concepto']) ?></td>
                            <td>$<?= number_format($pago['monto'], 2) ?></td>
                            <td><?= $pago['fecha_vencimiento'] ?></td>
                            <td><?= $pago['fecha_pago'] ?? 'N/A' ?></td>
                            <td><?= htmlspecialchars($pago['estado']) ?></td>
                            <td><?= htmlspecialchars($pago['metodo_pago'] ?? 'N/A') ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php else: ?>
            <p>No hay pagos registrados para este residente.</p>
        <?php endif; ?>
    </div>

    <div class="residente-consumo">
        <h3>Consumo Energético Reciente</h3>
        <?php if (!empty($consumos)): ?>
            <table border="1">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Consumo (kWh)</th>
                        <th>Costo</th>
                        <th>Tipo Medición</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($consumos as $consumo): ?>
                        <tr>
                            <td><?= $consumo['fecha_lectura'] ?></td>
                            <td><?= $consumo['consumo_kwh'] ?></td>
                            <td>$<?= number_format($consumo['costo'], 2) ?></td>
                            <td><?= htmlspecialchars($consumo['tipo_medicion']) ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php else: ?>
            <p>No hay registros de consumo para esta unidad.</p>
        <?php endif; ?>
    </div>

    <div class="actions">
        <a href="/hhh/public/residentes/edit?id=<?= $residente['id'] ?>">Editar Residente</a>
        <a href="/hhh/public/pagos/historial?residente_id=<?= $residente['id'] ?>">Ver Todos los Pagos</a>
        <a href="/hhh/public/consumo/huella?unidad=<?= $residente['unidad'] ?>">Ver Huella Energética</a>
        <a href="/hhh/public/residentes">Volver a la Lista</a>
    </div>

<?php else: ?>
    <p>Residente no encontrado.</p>
    <a href="/hhh/public/residentes">Volver a la lista</a>
<?php endif; ?>

<?php
$content = ob_get_clean();
$title = 'Detalle Residente - Sistema de Administración de Edificio';
include __DIR__ . '/../layouts/main.php';
?>
