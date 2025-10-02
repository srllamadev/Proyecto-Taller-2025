<?php
require_once '../../includes/functions.php';

// Verificar que está logueado y es admin
if (!isLoggedIn() || !hasRole('admin')) {
    header('Location: ../../login.php');
    exit();
}

$page_title = 'Gestión de Empleados - Administrador';
require_once '../../includes/header.php';

$database = new Database();
$db = $database->getConnection();

// Obtener lista de empleados
try {
    $query = "SELECT e.*, u.name, u.email 
              FROM empleados e 
              JOIN users u ON e.user_id = u.id 
              ORDER BY e.id";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $empleados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
} catch (PDOException $e) {
    $error = "Error al obtener empleados: " . $e->getMessage();
}
?>

<div class="page-header">
    <h1><i class="fas fa-user-tie"></i> Gestión de Empleados</h1>
    <p>Administración del personal y empleados del edificio</p>
</div>

<?php if (isset($error)): ?>
    <?php showAlert($error, 'error'); ?>
<?php endif; ?>

<!-- Estadísticas rápidas -->
<div class="stats-grid" style="margin-bottom: 30px;">
    <div class="stat-card">
        <div class="stat-number"><?php echo count($empleados); ?></div>
        <div class="stat-label">Total Empleados</div>
    </div>
    <div class="stat-card">
        <div class="stat-number"><?php echo count(array_filter($empleados, function($e) { return $e['estado'] == 'activo'; })); ?></div>
        <div class="stat-label">Empleados Activos</div>
    </div>
    <div class="stat-card">
        <div class="stat-number"><?php echo count(array_filter($empleados, function($e) { return $e['cargo'] == 'mantenimiento'; })); ?></div>
        <div class="stat-label">Mantenimiento</div>
    </div>
    <div class="stat-card">
        <div class="stat-number"><?php echo count(array_filter($empleados, function($e) { return $e['cargo'] == 'seguridad'; })); ?></div>
        <div class="stat-label">Seguridad</div>
    </div>
</div>

<!-- Lista de empleados -->
<div class="bento-card">
    <h3><i class="fas fa-users"></i> Lista de Empleados</h3>
    
    <?php if (!empty($empleados)): ?>
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th><i class="fas fa-hashtag"></i> ID</th>
                        <th><i class="fas fa-user"></i> Nombre</th>
                        <th><i class="fas fa-envelope"></i> Email</th>
                        <th><i class="fas fa-id-card"></i> DNI</th>
                        <th><i class="fas fa-briefcase"></i> Cargo</th>
                        <th><i class="fas fa-phone"></i> Teléfono</th>
                        <th><i class="fas fa-calendar"></i> Fecha Ingreso</th>
                        <th><i class="fas fa-traffic-light"></i> Estado</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($empleados as $empleado): ?>
                        <tr>
                            <td><strong><?php echo $empleado['id']; ?></strong></td>
                            <td><?php echo htmlspecialchars($empleado['name']); ?></td>
                            <td>
                                <a href="mailto:<?php echo htmlspecialchars($empleado['email']); ?>" 
                                   style="color: var(--primary-blue); text-decoration: none;">
                                    <?php echo htmlspecialchars($empleado['email']); ?>
                                </a>
                            </td>
                            <td><code><?php echo htmlspecialchars($empleado['dni']); ?></code></td>
                            <td>
                                <span class="status-badge status-active">
                                    <i class="fas fa-<?php echo $empleado['cargo'] == 'mantenimiento' ? 'tools' : ($empleado['cargo'] == 'seguridad' ? 'shield-alt' : 'user'); ?>"></i>
                                    <?php echo ucfirst($empleado['cargo']); ?>
                                </span>
                            </td>
                            <td><?php echo htmlspecialchars($empleado['telefono'] ?? 'N/A'); ?></td>
                            <td>
                                <?php if ($empleado['fecha_ingreso']): ?>
                                    <i class="fas fa-calendar-alt"></i> <?php echo formatDate($empleado['fecha_ingreso']); ?>
                                <?php else: ?>
                                    <span style="color: var(--dark-gray);">N/A</span>
                                <?php endif; ?>
                            </td>
                            <td><?php echo getStatusBadge($empleado['estado']); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php else: ?>
        <div style="text-align: center; padding: 40px; background: var(--light-gray); border-radius: var(--border-radius);">
            <i class="fas fa-user-tie" style="font-size: 3rem; color: var(--dark-gray); margin-bottom: 15px;"></i>
            <h3 style="color: var(--dark-gray);">No hay empleados registrados</h3>
            <p style="color: var(--dark-gray);">Los empleados aparecerán aquí cuando se registren en el sistema.</p>
        </div>
    <?php endif; ?>
</div>

<!-- Acciones adicionales -->
<div class="bento-grid" style="margin-top: 30px;">
    <div class="bento-card" style="background: linear-gradient(135deg, var(--accent-mint), var(--secondary-green));">
        <h3><i class="fas fa-plus-circle"></i> Gestión de Personal</h3>
        <p style="color: var(--dark-blue);">Herramientas para administrar el personal del edificio.</p>
        <div class="d-flex gap-10" style="flex-wrap: wrap;">
            <a href="comunicacion.php" class="btn" style="background: var(--dark-blue); color: white;">
                <i class="fas fa-envelope"></i> Comunicaciones
            </a>
            <a href="dashboard.php" class="btn" style="background: var(--dark-blue); color: white;">
                <i class="fas fa-tachometer-alt"></i> Dashboard
            </a>
        </div>
    </div>
    
    <div class="bento-card" style="background: linear-gradient(135deg, var(--primary-blue), var(--secondary-green)); color: white;">
        <h3><i class="fas fa-chart-pie"></i> Distribución por Cargo</h3>
        <p style="color: rgba(255,255,255,0.9);">Resumen del personal por departamento.</p>
        <div class="d-flex justify-between align-center">
            <div>
                <strong style="font-size: 1.2rem;">
                    Mantenimiento: <?php echo count(array_filter($empleados, function($e) { return $e['cargo'] == 'mantenimiento'; })); ?><br>
                    Seguridad: <?php echo count(array_filter($empleados, function($e) { return $e['cargo'] == 'seguridad'; })); ?><br>
                    Otros: <?php echo count(array_filter($empleados, function($e) { return !in_array($e['cargo'], ['mantenimiento', 'seguridad']); })); ?>
                </strong>
            </div>
            <i class="fas fa-users" style="font-size: 2rem; opacity: 0.7;"></i>
        </div>
    </div>
</div>

<?php require_once '../../includes/footer.php'; ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Empleados - Administrador</title>
</head>
<body>
    <h1>Gestión de Empleados</h1>
    <p><a href="dashboard.php">← Volver al Dashboard</a> | <a href="../../logout.php">Cerrar Sesión</a></p>
    
    <hr>
    
    <?php if (isset($error)): ?>
        <div style="color: red; background: #ffe6e6; padding: 10px; border: 1px solid red; margin: 10px 0;">
            <strong>Error:</strong> <?php echo $error; ?>
        </div>
    <?php endif; ?>
    
    <h2>Lista de Empleados</h2>
    
    <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr style="background: #f0f0f0;">
                <th style="padding: 10px;">ID</th>
                <th style="padding: 10px;">Nombre</th>
                <th style="padding: 10px;">Email</th>
                <th style="padding: 10px;">DNI</th>
                <th style="padding: 10px;">Teléfono</th>
                <th style="padding: 10px;">Cargo</th>
                <th style="padding: 10px;">Salario</th>
                <th style="padding: 10px;">Fecha Contratación</th>
                <th style="padding: 10px;">Estado</th>
                <th style="padding: 10px;">Acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php if (!empty($empleados)): ?>
                <?php foreach ($empleados as $empleado): ?>
                    <tr>
                        <td style="padding: 8px;"><?php echo $empleado['id']; ?></td>
                        <td style="padding: 8px;"><?php echo htmlspecialchars($empleado['name']); ?></td>
                        <td style="padding: 8px;"><?php echo htmlspecialchars($empleado['email']); ?></td>
                        <td style="padding: 8px;"><?php echo htmlspecialchars($empleado['dni']); ?></td>
                        <td style="padding: 8px;"><?php echo htmlspecialchars($empleado['telefono'] ?? 'N/A'); ?></td>
                        <td style="padding: 8px;"><?php echo htmlspecialchars($empleado['cargo']); ?></td>
                        <td style="padding: 8px;">$<?php echo number_format($empleado['salario'] ?? 0, 2); ?></td>
                        <td style="padding: 8px;"><?php echo $empleado['fecha_contratacion'] ?? 'N/A'; ?></td>
                        <td style="padding: 8px;">
                            <span style="color: <?php echo $empleado['estado'] == 'activo' ? 'green' : 'red'; ?>;">
                                <?php echo ucfirst($empleado['estado']); ?>
                            </span>
                        </td>
                        <td style="padding: 8px;">
                            <a href="tareas_empleado.php?empleado_id=<?php echo $empleado['id']; ?>" 
                               style="background: #007cba; color: white; padding: 5px 10px; text-decoration: none; font-size: 12px;">
                               Ver Tareas
                            </a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="10" style="padding: 20px; text-align: center;">No hay empleados registrados</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>
</body>
</html>