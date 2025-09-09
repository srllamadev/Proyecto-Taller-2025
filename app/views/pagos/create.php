<?php ob_start(); ?>

<h2>Crear Nueva Factura</h2>

<form method="POST" action="/hhh/public/pagos/create">
    <div>
        <label for="residente_id">Residente:</label>
        <select id="residente_id" name="residente_id" required>
            <option value="">Seleccionar residente</option>
            <?php foreach ($residentes as $residente): ?>
                <option value="<?= $residente['id'] ?>">
                    <?= htmlspecialchars($residente['nombre'] . ' ' . $residente['apellido'] . ' - Unidad ' . $residente['unidad']) ?>
                </option>
            <?php endforeach; ?>
        </select>
    </div>
    
    <div>
        <label for="concepto">Concepto:</label>
        <select id="concepto" name="concepto" required onchange="updateMonto()">
            <option value="">Seleccionar concepto</option>
            <option value="Administración" data-monto="250000">Cuota de Administración</option>
            <option value="Parqueadero" data-monto="50000">Parqueadero</option>
            <option value="Servicios Públicos" data-monto="180000">Servicios Públicos</option>
            <option value="Mantenimiento" data-monto="75000">Mantenimiento Especial</option>
            <option value="Multa" data-monto="100000">Multa</option>
            <option value="Otro" data-monto="0">Otro</option>
        </select>
    </div>
    
    <div>
        <label for="monto">Monto:</label>
        <input type="number" id="monto" name="monto" step="0.01" required>
    </div>
    
    <div>
        <label for="fecha_vencimiento">Fecha de Vencimiento:</label>
        <input type="date" id="fecha_vencimiento" name="fecha_vencimiento" required>
    </div>
    
    <div>
        <button type="submit">Crear Factura</button>
        <a href="/hhh/public/pagos">Cancelar</a>
    </div>
</form>

<script>
function updateMonto() {
    const concepto = document.getElementById('concepto');
    const monto = document.getElementById('monto');
    const selectedOption = concepto.options[concepto.selectedIndex];
    
    if (selectedOption.dataset.monto) {
        monto.value = selectedOption.dataset.monto;
    }
}

// Establecer fecha de vencimiento por defecto (próximo mes)
document.addEventListener('DOMContentLoaded', function() {
    const fechaVencimiento = document.getElementById('fecha_vencimiento');
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 15);
    fechaVencimiento.value = nextMonth.toISOString().split('T')[0];
});
</script>

<?php
$content = ob_get_clean();
$title = 'Crear Factura - Sistema de Administración de Edificio';
include __DIR__ . '/../layouts/main.php';
?>
