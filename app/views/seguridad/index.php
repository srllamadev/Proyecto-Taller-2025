<?php ob_start(); ?>

<h2>Centro de Seguridad</h2>

<div class="actions">
    <a href="/hhh/public/seguridad/auditoria">Registros de Auditoría</a>
    <a href="/hhh/public/seguridad/videovigilancia">Videovigilancia</a>
    <a href="/hhh/public/seguridad/reporte-incidente">Reportar Incidente</a>
    <a href="/hhh/public/seguridad/configuracion">Configuración</a>
</div>

<div class="alertas-seguridad">
    <h3>Alertas de Seguridad</h3>
    
    <?php if (!empty($accesosSospechosos)): ?>
        <div style="background-color: #f8d7da; padding: 10px; border: 1px solid #f5c6cb; margin: 10px 0;">
            <h4>⚠️ Accesos Sospechosos Detectados</h4>
            <table border="1">
                <thead>
                    <tr>
                        <th>IP Address</th>
                        <th>Intentos Fallidos</th>
                        <th>Último Intento</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($accesosSospechosos as $acceso): ?>
                        <tr>
                            <td><?= htmlspecialchars($acceso['ip_address']) ?></td>
                            <td><?= $acceso['intentos'] ?></td>
                            <td><?= $acceso['ultimo_intento'] ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php else: ?>
        <div style="background-color: #d4edda; padding: 10px; border: 1px solid #c3e6cb; margin: 10px 0;">
            <h4>✅ Sin Alertas de Seguridad</h4>
            <p>No se han detectado accesos sospechosos en la última hora.</p>
        </div>
    <?php endif; ?>
</div>

<div class="resumen-seguridad">
    <h3>Estado General del Sistema</h3>
    <div class="status-grid">
        <div class="status-item">
            <h4>Control de Acceso</h4>
            <p style="color: green;">✅ Operativo</p>
        </div>
        
        <div class="status-item">
            <h4>Videovigilancia</h4>
            <p style="color: green;">✅ 3/4 Cámaras Activas</p>
        </div>
        
        <div class="status-item">
            <h4>Auditoría</h4>
            <p style="color: green;">✅ Registros Actualizados</p>
        </div>
        
        <div class="status-item">
            <h4>Backup de Datos</h4>
            <p style="color: green;">✅ Última copia: Hoy</p>
        </div>
    </div>
</div>

<div class="acciones-rapidas">
    <h3>Acciones Rápidas</h3>
    <ul>
        <li><a href="/hhh/public/acceso/validar">Validar Acceso Manual</a></li>
        <li><a href="/hhh/public/seguridad/reporte-incidente">Reportar Incidente</a></li>
        <li><a href="/hhh/public/seguridad/auditoria">Ver Logs Recientes</a></li>
        <li><a href="/hhh/public/seguridad/videovigilancia">Monitorear Cámaras</a></li>
    </ul>
</div>

<?php
$content = ob_get_clean();
$title = 'Centro de Seguridad - Sistema de Administración de Edificio';
include __DIR__ . '/../layouts/main.php';
?>
