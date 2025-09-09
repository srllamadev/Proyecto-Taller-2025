<?php
// Archivo de prueba para verificar que PHP funciona
echo "<h1>¡PHP está funcionando!</h1>";
echo "<p>Fecha actual: " . date('Y-m-d H:i:s') . "</p>";
echo "<p>Versión de PHP: " . phpversion() . "</p>";

// Probar si las rutas funcionan
echo "<h2>Enlaces de prueba:</h2>";
echo '<ul>';
echo '<li><a href="/">Ir al Dashboard</a></li>';
echo '<li><a href="/residentes">Ir a Residentes</a></li>';
echo '</ul>';

// Verificar si los archivos core existen
echo "<h2>Verificación de archivos:</h2>";
echo "<ul>";
echo "<li>Router.php: " . (file_exists(__DIR__ . '/../core/Router.php') ? '✅ Existe' : '❌ No existe') . "</li>";
echo "<li>Controller.php: " . (file_exists(__DIR__ . '/../core/Controller.php') ? '✅ Existe' : '❌ No existe') . "</li>";
echo "<li>HomeController.php: " . (file_exists(__DIR__ . '/../app/controllers/HomeController.php') ? '✅ Existe' : '❌ No existe') . "</li>";
echo "</ul>";
?>
