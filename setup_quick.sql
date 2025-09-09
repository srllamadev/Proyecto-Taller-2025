-- Script rápido de configuración
-- Ejecutar en MySQL: mysql -u root -p < setup_quick.sql

CREATE DATABASE IF NOT EXISTS edificio_admin;
USE edificio_admin;

-- Crear solo las tablas esenciales para que funcione
CREATE TABLE IF NOT EXISTS residentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    unidad VARCHAR(10) NOT NULL,
    fecha_ingreso DATE NOT NULL,
    estado ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo'
);

CREATE TABLE IF NOT EXISTS comunicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo ENUM('anuncio', 'notificacion', 'mensaje', 'evento') DEFAULT 'anuncio',
    fecha_creacion DATETIME NOT NULL,
    autor VARCHAR(100) NOT NULL,
    destinatario INT NULL,
    estado ENUM('activo', 'inactivo', 'leido') DEFAULT 'activo'
);

CREATE TABLE IF NOT EXISTS pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    residente_id INT NOT NULL,
    concepto VARCHAR(200) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATETIME NULL,
    fecha_vencimiento DATE NOT NULL,
    estado ENUM('pendiente', 'pagado', 'vencido', 'cancelado') DEFAULT 'pendiente',
    metodo_pago VARCHAR(50) NULL
);

-- Insertar datos básicos
INSERT INTO residentes (nombre, apellido, email, telefono, unidad, fecha_ingreso) VALUES
('Juan', 'Pérez', 'juan.perez@email.com', '555-0101', '101', '2024-01-15'),
('María', 'García', 'maria.garcia@email.com', '555-0102', '102', '2024-02-01');

INSERT INTO comunicaciones (titulo, mensaje, tipo, fecha_creacion, autor) VALUES
('Bienvenido', 'Sistema configurado correctamente', 'anuncio', NOW(), 'Sistema');

INSERT INTO pagos (residente_id, concepto, monto, fecha_vencimiento, estado) VALUES
(1, 'Administración Septiembre 2024', 250000.00, '2024-09-15', 'pendiente');

SELECT 'Base de datos configurada correctamente!' as status;
