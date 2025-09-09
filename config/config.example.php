<?php
// Archivo de configuración del proyecto
// Copiar este archivo como config/config.php y ajustar según sea necesario

return [
    // Configuración de la base de datos
    'database' => [
        'host' => 'localhost',
        'name' => 'edificio_admin',
        'username' => 'root',
        'password' => '',
        'charset' => 'utf8'
    ],
    
    // Configuración de la aplicación
    'app' => [
        'name' => 'Sistema de Administración de Edificio',
        'version' => '1.0.0',
        'timezone' => 'America/Bogota',
        'debug' => true // Cambiar a false en producción
    ],
    
    // Configuración de seguridad
    'security' => [
        'max_login_attempts' => 5,
        'lockout_time' => 30, // minutos
        'session_lifetime' => 3600, // segundos
        'password_min_length' => 8
    ],
    
    // Configuración de videovigilancia
    'cameras' => [
        'max_cameras' => 10,
        'recording_path' => '/var/recordings/',
        'stream_quality' => '1080p',
        'retention_days' => 30
    ],
    
    // Configuración de consumo energético
    'energy' => [
        'default_tariff' => 600, // pesos por kWh
        'alert_threshold' => 200, // kWh por mes
        'measurement_interval' => 'daily'
    ],
    
    // Configuración de notificaciones
    'notifications' => [
        'email_enabled' => false,
        'sms_enabled' => false,
        'push_enabled' => false,
        'admin_email' => 'admin@edificio.com'
    ]
];
?>
