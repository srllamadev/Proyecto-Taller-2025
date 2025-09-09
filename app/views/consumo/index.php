<?php ob_start(); ?>

<h2>Monitorización de Consumo Energético</h2>

<div class="actions">
    <a href="/hhh/public/consumo/registrar">Registrar Consumo</a>
    <a href="/hhh/public/consumo/por-piso">Ver por Piso</a>
</div>

<div class="filtros">
    <form method="GET" action="/hhh/public/consumo">
        <label for="unidad">Filtrar por Unidad:</label>
        <input type="text" id="unidad" name="unidad" value="<?= htmlspecialchars($unidad ?? '') ?>" placeholder="Ej: 101">
        <button type="submit">Filtrar</button>
        <a href="/hhh/public/consumo">Ver Todos</a>
    </form>
</div>

<?php if ($unidad): ?>
    <div class="resumen-unidad">
        <h3>Resumen para Unidad <?= htmlspecialchars($unidad) ?></h3>
        <p><strong>Promedio de Consumo (últimos 3 meses):</strong> <?= number_format($promedio, 2) ?> kWh</p>
        <a href="/hhh/public/consumo/huella?unidad=<?= $unidad ?>">Ver Huella Energética Completa</a>
        <a href="/hhh/public/consumo/ajustes?unidad=<?= $unidad ?>">Configurar Ajustes</a>
    </div>
<?php endif; ?>

<h3>Registros de Consumo</h3>

<table border="1">
    <thead>
        <tr>
            <th>ID</th>
            <th>Unidad</th>
            <th>Fecha Lectura</th>
            <th>Consumo (kWh)</th>
            <th>Costo</th>
            <th>Tipo Medición</th>
        </tr>
    </thead>
    <tbody>
        <?php if (!empty($consumos)): ?>
            <?php foreach ($consumos as $consumo): ?>
                <tr>
                    <td><?= $consumo['id'] ?></td>
                    <td><?= htmlspecialchars($consumo['unidad']) ?></td>
                    <td><?= $consumo['fecha_lectura'] ?></td>
                    <td><?= $consumo['consumo_kwh'] ?></td>
                    <td>$<?= number_format($consumo['costo'], 2) ?></td>
                    <td><?= ucfirst($consumo['tipo_medicion']) ?></td>
                </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr>
                <td colspan="6">No hay registros de consumo<?= $unidad ? ' para la unidad ' . $unidad : '' ?>.</td>
            </tr>
        <?php endif; ?>
    </tbody>
</table>

<?php if (!empty($huella)): ?>
    <div class="huella-energetica">
        <h3>Huella Energética (Últimos 30 días)</h3>
        <table border="1">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Consumo Diario (kWh)</th>
                    <th>Tipo</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach (array_slice($huella, 0, 10) as $dia): ?>
                    <tr>
                        <td><?= $dia['fecha'] ?></td>
                        <td><?= $dia['consumo_diario'] ?></td>
                        <td><?= ucfirst($dia['tipo_medicion']) ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
<?php endif; ?>

<?php
$content = ob_get_clean();
$title = 'Consumo Energético - Sistema de Administración de Edificio';
include __DIR__ . '/../layouts/main.php';
?>
