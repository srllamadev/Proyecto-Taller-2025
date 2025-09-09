<?php ob_start(); ?>

<h2>Dashboard Principal</h2>

<div class="dashboard-stats">
    <div class="stat-card">
        <h3>Total Residentes</h3>
        <p><?= $totalResidentes ?></p>
    </div>
    
    <div class="stat-card">
        <h3>Pagos Pendientes</h3>
        <p><?= $pagosPendientes ?></p>
    </div>
</div>

<div class="recent-announcements">
    <h3>Anuncios Recientes</h3>
    <?php if (!empty($anuncios)): ?>
        <ul>
            <?php foreach ($anuncios as $anuncio): ?>
                <li>
                    <strong><?= htmlspecialchars($anuncio['titulo']) ?></strong>
                    <p><?= htmlspecialchars($anuncio['mensaje']) ?></p>
                    <small>Fecha: <?= $anuncio['fecha_creacion'] ?></small>
                </li>
            <?php endforeach; ?>
        </ul>
    <?php else: ?>
        <p>No hay anuncios recientes.</p>
    <?php endif; ?>
</div>

<div class="quick-actions">
    <h3>Acciones Rápidas</h3>
    <ul>
        <li><a href="/hhh/public/residentes/create">Registrar Nuevo Residente</a></li>
        <li><a href="/hhh/public/pagos/create">Crear Nueva Factura</a></li>
        <li><a href="/hhh/public/comunicacion/crear">Crear Anuncio</a></li>
        <li><a href="/hhh/public/acceso/validar">Validar Acceso</a></li>
        <li><a href="/hhh/public/consumo/registrar">Registrar Consumo</a></li>
    </ul>
</div>

<?php
$content = ob_get_clean();
$title = 'Dashboard - Sistema de Administración de Edificio';
include __DIR__ . '/../layouts/main.php';
?>
