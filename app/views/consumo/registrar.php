<?php ob_start(); ?>

<h2>Registrar Consumo Energético</h2>

<form method="POST" action="/hhh/public/consumo/registrar">
    <div>
        <label for="unidad">Unidad:</label>
        <input type="text" id="unidad" name="unidad" placeholder="Ej: 101, 205, etc." required>
    </div>
    
    <div>
        <label for="fecha_lectura">Fecha y Hora de Lectura:</label>
        <input type="datetime-local" id="fecha_lectura" name="fecha_lectura" required>
    </div>
    
    <div>
        <label for="consumo_kwh">Consumo (kWh):</label>
        <input type="number" id="consumo_kwh" name="consumo_kwh" step="0.01" required>
    </div>
    
    <div>
        <label for="costo">Costo ($):</label>
        <input type="number" id="costo" name="costo" step="0.01" required>
    </div>
    
    <div>
        <label for="tipo_medicion">Tipo de Medición:</label>
        <select id="tipo_medicion" name="tipo_medicion" required>
            <option value="manual">Manual</option>
            <option value="automatico">Automático</option>
            <option value="estimado">Estimado</option>
        </select>
    </div>
    
    <div>
        <button type="submit">Registrar Consumo</button>
        <a href="/hhh/public/consumo">Cancelar</a>
    </div>
</form>

<div class="ayuda">
    <h3>Información de Ayuda</h3>
    <ul>
        <li><strong>Tarifa promedio:</strong> $600 por kWh</li>
        <li><strong>Consumo promedio por unidad:</strong> 150-200 kWh/mes</li>
        <li><strong>Tipo Manual:</strong> Lectura tomada por personal</li>
        <li><strong>Tipo Automático:</strong> Lectura de medidor inteligente</li>
        <li><strong>Tipo Estimado:</strong> Cálculo basado en patrones anteriores</li>
    </ul>
</div>

<script>
// Establecer fecha y hora actual por defecto
document.addEventListener('DOMContentLoaded', function() {
    const fechaLectura = document.getElementById('fecha_lectura');
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    fechaLectura.value = now.toISOString().slice(0, 16);
});

// Calcular costo automáticamente
document.getElementById('consumo_kwh').addEventListener('input', function() {
    const consumo = parseFloat(this.value);
    const tarifaPorKwh = 600; // Tarifa ejemplo
    
    if (consumo > 0) {
        document.getElementById('costo').value = (consumo * tarifaPorKwh).toFixed(2);
    }
});
</script>

<?php
$content = ob_get_clean();
$title = 'Registrar Consumo - Sistema de Administración de Edificio';
include __DIR__ . '/../layouts/main.php';
?>
