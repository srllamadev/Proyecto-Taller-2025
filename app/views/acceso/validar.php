<?php ob_start(); ?>

<h2>Sistema de Validación de Acceso</h2>

<div class="validacion-acceso">
    <h3>Simulador de Lector RFID</h3>
    <p>Este formulario simula el sistema de validación de tarjetas RFID en tiempo real.</p>
    
    <form id="validacionForm">
        <div>
            <label for="tarjeta_rfid">Código de Tarjeta RFID:</label>
            <input type="text" id="tarjeta_rfid" name="tarjeta_rfid" placeholder="Ej: RFID001" required>
        </div>
        
        <div>
            <label for="punto_acceso">Punto de Acceso:</label>
            <select id="punto_acceso" name="punto_acceso" required>
                <option value="Principal">Entrada Principal</option>
                <option value="Parqueadero">Parqueadero</option>
                <option value="Azotea">Azotea</option>
                <option value="Salon Social">Salón Social</option>
            </select>
        </div>
        
        <div>
            <button type="submit">Validar Acceso</button>
        </div>
    </form>
    
    <div id="resultado" style="margin-top: 20px; padding: 10px; border: 1px solid #ccc; display: none;">
        <!-- Aquí se mostrará el resultado de la validación -->
    </div>
</div>

<div style="margin-top: 30px;">
    <h3>Tarjetas RFID de Ejemplo</h3>
    <ul>
        <li><strong>RFID001</strong> - Juan Pérez (Unidad 101)</li>
        <li><strong>RFID002</strong> - María García (Unidad 102)</li>
        <li><strong>RFID003</strong> - Carlos Rodríguez (Unidad 201)</li>
        <li><strong>RFID004</strong> - Ana Martínez (Unidad 202)</li>
        <li><strong>RFID005</strong> - Luis López (Unidad 301)</li>
        <li><strong>RFID999</strong> - Tarjeta no autorizada (para pruebas)</li>
    </ul>
</div>

<script>
document.getElementById('validacionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const resultado = document.getElementById('resultado');
    
    // Simular validación
    fetch('/hhh/public/acceso/validar', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        resultado.style.display = 'block';
        
        if (data.status === 'granted') {
            resultado.style.backgroundColor = '#d4edda';
            resultado.style.color = '#155724';
            resultado.innerHTML = `
                <h4>✅ ACCESO AUTORIZADO</h4>
                <p><strong>Residente:</strong> ${data.residente}</p>
                <p><strong>Unidad:</strong> ${data.unidad}</p>
                <p><strong>Hora:</strong> ${new Date().toLocaleString()}</p>
            `;
        } else {
            resultado.style.backgroundColor = '#f8d7da';
            resultado.style.color = '#721c24';
            resultado.innerHTML = `
                <h4>❌ ACCESO DENEGADO</h4>
                <p>${data.message}</p>
                <p><strong>Hora:</strong> ${new Date().toLocaleString()}</p>
            `;
        }
        
        // Limpiar el formulario después de 3 segundos
        setTimeout(() => {
            document.getElementById('tarjeta_rfid').value = '';
            resultado.style.display = 'none';
        }, 3000);
    })
    .catch(error => {
        console.error('Error:', error);
        resultado.style.display = 'block';
        resultado.style.backgroundColor = '#f8d7da';
        resultado.style.color = '#721c24';
        resultado.innerHTML = '<h4>Error de conexión</h4>';
    });
});
</script>

<?php
$content = ob_get_clean();
$title = 'Validación de Acceso - Sistema de Administración de Edificio';
include __DIR__ . '/../layouts/main.php';
?>
