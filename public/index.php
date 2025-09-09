<?php
// Archivo principal - punto de entrada
session_start();

// Habilitar errores para debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Primero verificar si la base de datos está configurada
try {
    require_once __DIR__ . '/../config/database.php';
    $database = new Database();
    $connection = $database->getConnection();
    
    if (!$connection) {
        header('Location: /index_simple.php');
        exit;
    }
    
    // Verificar si las tablas existen
    $stmt = $connection->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (count($tables) === 0) {
        header('Location: /index_simple.php');
        exit;
    }
    
} catch (Exception $e) {
    header('Location: /index_simple.php');
    exit;
}

// Cargar las clases principales
require_once __DIR__ . '/../core/Router.php';
require_once __DIR__ . '/../core/Controller.php';

// Crear el router
$router = new Router();

// Definir las rutas principales
$router->get('/', 'HomeController', 'index');

// Rutas de residentes
$router->get('/residentes', 'ResidenteController', 'index');
$router->get('/residentes/create', 'ResidenteController', 'create');
$router->post('/residentes/create', 'ResidenteController', 'create');
$router->get('/residentes/edit', 'ResidenteController', 'edit');
$router->post('/residentes/edit', 'ResidenteController', 'edit');
$router->get('/residentes/delete', 'ResidenteController', 'delete');
$router->get('/residentes/show', 'ResidenteController', 'show');

// Rutas de control de acceso
$router->get('/acceso', 'AccesoController', 'index');
$router->get('/acceso/registrar', 'AccesoController', 'registrar');
$router->post('/acceso/registrar', 'AccesoController', 'registrar');
$router->get('/acceso/validar', 'AccesoController', 'validar');
$router->post('/acceso/validar', 'AccesoController', 'validar');

// Rutas de pagos
$router->get('/pagos', 'PagoController', 'index');
$router->get('/pagos/create', 'PagoController', 'create');
$router->post('/pagos/create', 'PagoController', 'create');
$router->post('/pagos/marcar-pagado', 'PagoController', 'marcarPagado');
$router->get('/pagos/reporte', 'PagoController', 'reporte');
$router->get('/pagos/historial', 'PagoController', 'historial');

// Rutas de consumo energético
$router->get('/consumo', 'ConsumoController', 'index');
$router->get('/consumo/registrar', 'ConsumoController', 'registrar');
$router->post('/consumo/registrar', 'ConsumoController', 'registrar');
$router->get('/consumo/por-piso', 'ConsumoController', 'porPiso');
$router->get('/consumo/huella', 'ConsumoController', 'huella');
$router->get('/consumo/ajustes', 'ConsumoController', 'ajustes');
$router->post('/consumo/ajustes', 'ConsumoController', 'ajustes');

// Rutas de comunicación
$router->get('/comunicacion', 'ComunicacionController', 'index');
$router->get('/comunicacion/crear', 'ComunicacionController', 'crear');
$router->post('/comunicacion/crear', 'ComunicacionController', 'crear');
$router->get('/comunicacion/mensajes', 'ComunicacionController', 'mensajes');
$router->post('/comunicacion/marcar-leido', 'ComunicacionController', 'marcarLeido');
$router->get('/comunicacion/anuncios', 'ComunicacionController', 'anuncios');

// Rutas de seguridad
$router->get('/seguridad', 'SeguridadController', 'index');
$router->get('/seguridad/auditoria', 'SeguridadController', 'auditoria');
$router->get('/seguridad/videovigilancia', 'SeguridadController', 'videovigilancia');
$router->get('/seguridad/reporte-incidente', 'SeguridadController', 'reporteIncidente');
$router->post('/seguridad/reporte-incidente', 'SeguridadController', 'reporteIncidente');
$router->get('/seguridad/configuracion', 'SeguridadController', 'configuracion');
$router->post('/seguridad/configuracion', 'SeguridadController', 'configuracion');

// Ejecutar el router
$router->dispatch();
?>
