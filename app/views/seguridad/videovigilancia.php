<?php ob_start(); ?>

<h2>Sistema de Videovigilancia</h2>

<div class="estado-camaras">
    <h3>Estado de las Cámaras</h3>
    
    <div class="camaras-grid">
        <?php foreach ($camaras as $camara): ?>
            <div class="camara-item" style="border: 1px solid #ccc; padding: 15px; margin: 10px; display: inline-block; width: 300px;">
                <h4><?= htmlspecialchars($camara['nombre']) ?></h4>
                <p><strong>Ubicación:</strong> <?= htmlspecialchars($camara['ubicacion']) ?></p>
                <p><strong>Estado:</strong> 
                    <span style="color: <?= $camara['estado'] === 'activa' ? 'green' : 'red' ?>">
                        <?= ucfirst($camara['estado']) ?>
                    </span>
                </p>
                
                <?php if ($camara['estado'] === 'activa' && $camara['url_stream']): ?>
                    <div class="video-placeholder" style="width: 280px; height: 200px; background-color: #333; color: white; text-align: center; line-height: 200px;">
                        📹 TRANSMISIÓN EN VIVO<br>
                        <small>Cámara <?= $camara['id'] ?></small>
                    </div>
                    <div style="margin-top: 10px;">
                        <button onclick="alert('Funcionalidad de grabación no implementada en esta demo')">📹 Grabar</button>
                        <button onclick="alert('Funcionalidad de captura no implementada en esta demo')">📸 Capturar</button>
                    </div>
                <?php else: ?>
                    <div class="video-placeholder" style="width: 280px; height: 200px; background-color: #666; color: white; text-align: center; line-height: 200px;">
                        ❌ CÁMARA INACTIVA
                    </div>
                    <div style="margin-top: 10px;">
                        <button disabled>📹 Grabar</button>
                        <button disabled>📸 Capturar</button>
                    </div>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<div class="controles-sistema">
    <h3>Controles del Sistema</h3>
    
    <div class="control-panel">
        <div style="margin: 10px 0;">
            <label for="modo_grabacion">Modo de Grabación:</label>
            <select id="modo_grabacion">
                <option value="continuo">Continuo</option>
                <option value="deteccion_movimiento">Detección de Movimiento</option>
                <option value="programado">Programado</option>
            </select>
        </div>
        
        <div style="margin: 10px 0;">
            <label for="calidad_video">Calidad de Video:</label>
            <select id="calidad_video">
                <option value="1080p">1080p HD</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
            </select>
        </div>
        
        <div style="margin: 10px 0;">
            <label>
                <input type="checkbox" checked> Notificaciones de Movimiento
            </label>
        </div>
        
        <div style="margin: 10px 0;">
            <label>
                <input type="checkbox" checked> Almacenamiento en la Nube
            </label>
        </div>
        
        <button onclick="alert('Configuraciones guardadas')">Guardar Configuración</button>
    </div>
</div>

<div class="historial-eventos">
    <h3>Eventos Recientes</h3>
    <table border="1">
        <thead>
            <tr>
                <th>Fecha/Hora</th>
                <th>Cámara</th>
                <th>Evento</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><?= date('Y-m-d H:i:s', strtotime('-2 hours')) ?></td>
                <td>Entrada Principal</td>
                <td>Detección de Movimiento</td>
                <td>
                    <button onclick="alert('Ver grabación no implementado en demo')">Ver</button>
                    <button onclick="alert('Descargar no implementado en demo')">Descargar</button>
                </td>
            </tr>
            <tr>
                <td><?= date('Y-m-d H:i:s', strtotime('-4 hours')) ?></td>
                <td>Parqueadero</td>
                <td>Acceso Autorizado</td>
                <td>
                    <button onclick="alert('Ver grabación no implementado en demo')">Ver</button>
                    <button onclick="alert('Descargar no implementado en demo')">Descargar</button>
                </td>
            </tr>
            <tr>
                <td><?= date('Y-m-d H:i:s', strtotime('-6 hours')) ?></td>
                <td>Salón Social</td>
                <td>Detección de Movimiento</td>
                <td>
                    <button onclick="alert('Ver grabación no implementado en demo')">Ver</button>
                    <button onclick="alert('Descargar no implementado en demo')">Descargar</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<div class="nota-demo">
    <p><strong>Nota:</strong> Esta es una simulación del sistema de videovigilancia. En un entorno real, aquí se mostrarían las transmisiones en vivo de las cámaras IP conectadas al sistema.</p>
</div>

<?php
$content = ob_get_clean();
$title = 'Videovigilancia - Sistema de Administración de Edificio';
include __DIR__ . '/../layouts/main.php';
?>
