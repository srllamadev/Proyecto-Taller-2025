<?php
// Versión simplificada para debugging
echo "<h1>🏢 Sistema de Administración de Edificio</h1>";
echo "<p>Servidor funcionando correctamente en " . date('Y-m-d H:i:s') . "</p>";

// Probar conexión a base de datos
try {
    require_once __DIR__ . '/../config/database.php';
    $database = new Database();
    $connection = $database->getConnection();
    
    if ($connection) {
        echo "<p style='color: green;'>✅ Conexión a base de datos exitosa</p>";
        
        // Probar una consulta simple
        $stmt = $connection->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        if (count($tables) > 0) {
            echo "<p style='color: green;'>✅ Base de datos configurada correctamente</p>";
            echo "<p>Tablas encontradas: " . implode(', ', $tables) . "</p>";
        } else {
            echo "<p style='color: orange;'>⚠️ Base de datos vacía - ejecutar database.sql</p>";
        }
        
    } else {
        echo "<p style='color: red;'>❌ No se pudo conectar a la base de datos</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<h2>Navegación:</h2>";
echo "<ul>";
echo "<li><a href='/app.php'>🚀 Ir a la Aplicación Principal</a></li>";
echo "<li><a href='/test.php'>🔧 Página de Pruebas</a></li>";
echo "</ul>";

echo "<h3>📋 Instrucciones de Configuración:</h3>";
echo "<div style='background: #f0f0f0; padding: 15px; border-radius: 5px;'>";
echo "<h4>Opción 1 - Configuración Rápida:</h4>";
echo "<pre>mysql -u root -p < ../setup_quick.sql</pre>";
echo "<h4>Opción 2 - Configuración Completa:</h4>";
echo "<pre>mysql -u root -p < ../database.sql</pre>";
echo "<h4>Opción 3 - Manual:</h4>";
echo "<ol>";
echo "<li>Abrir MySQL: <code>mysql -u root -p</code></li>";
echo "<li>Crear BD: <code>CREATE DATABASE edificio_admin;</code></li>";
echo "<li>Usar BD: <code>USE edificio_admin;</code></li>";
echo "<li>Importar: <code>SOURCE C:/Users/yamil/Desktop/hhh/database.sql;</code></li>";
echo "</ol>";
echo "</div>";
echo "<p><strong>Después de configurar la BD, recarga esta página</strong></p>";
?>
