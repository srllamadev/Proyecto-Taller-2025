-- Base de datos para el Sistema de Administración de Edificio
CREATE DATABASE IF NOT EXISTS edificio_admin;
USE edificio_admin;

-- Tabla de residentes
CREATE TABLE residentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    unidad VARCHAR(10) NOT NULL,
    fecha_ingreso DATE NOT NULL,
    estado ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de control de acceso
CREATE TABLE control_acceso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    residente_id INT,
    tarjeta_rfid VARCHAR(50) NOT NULL,
    fecha_acceso DATETIME NOT NULL,
    punto_acceso VARCHAR(100) DEFAULT 'Principal',
    estado ENUM('autorizado', 'denegado', 'sospechoso') DEFAULT 'autorizado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (residente_id) REFERENCES residentes(id) ON DELETE SET NULL
);

-- Tabla de pagos
CREATE TABLE pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    residente_id INT NOT NULL,
    concepto VARCHAR(200) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATETIME NULL,
    fecha_vencimiento DATE NOT NULL,
    estado ENUM('pendiente', 'pagado', 'vencido', 'cancelado') DEFAULT 'pendiente',
    metodo_pago VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (residente_id) REFERENCES residentes(id) ON DELETE CASCADE
);

-- Tabla de consumo energético
CREATE TABLE consumo_energetico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unidad VARCHAR(10) NOT NULL,
    fecha_lectura DATETIME NOT NULL,
    consumo_kwh DECIMAL(8,2) NOT NULL,
    costo DECIMAL(10,2) NOT NULL,
    tipo_medicion ENUM('manual', 'automatico', 'estimado') DEFAULT 'manual',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de comunicaciones
CREATE TABLE comunicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo ENUM('anuncio', 'notificacion', 'mensaje', 'evento') DEFAULT 'anuncio',
    fecha_creacion DATETIME NOT NULL,
    autor VARCHAR(100) NOT NULL,
    destinatario INT NULL, -- NULL para mensajes generales
    estado ENUM('activo', 'inactivo', 'leido') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destinatario) REFERENCES residentes(id) ON DELETE SET NULL
);

-- Tabla de auditoría de seguridad
CREATE TABLE auditoria_seguridad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL,
    accion VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    fecha_hora DATETIME NOT NULL,
    detalles JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES residentes(id) ON DELETE SET NULL
);

-- Insertar datos de ejemplo
INSERT INTO residentes (nombre, apellido, email, telefono, unidad, fecha_ingreso) VALUES
('Juan', 'Pérez', 'juan.perez@email.com', '555-0101', '101', '2024-01-15'),
('María', 'García', 'maria.garcia@email.com', '555-0102', '102', '2024-02-01'),
('Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '555-0103', '201', '2024-01-20'),
('Ana', 'Martínez', 'ana.martinez@email.com', '555-0104', '202', '2024-03-10'),
('Luis', 'López', 'luis.lopez@email.com', '555-0105', '301', '2024-02-15');

-- Insertar registros de acceso de ejemplo
INSERT INTO control_acceso (residente_id, tarjeta_rfid, fecha_acceso, punto_acceso) VALUES
(1, 'RFID001', '2024-09-08 08:30:00', 'Principal'),
(2, 'RFID002', '2024-09-08 09:15:00', 'Principal'),
(3, 'RFID003', '2024-09-08 18:45:00', 'Parqueadero'),
(1, 'RFID001', '2024-09-08 19:30:00', 'Principal'),
(4, 'RFID004', '2024-09-08 07:45:00', 'Principal');

-- Insertar pagos de ejemplo
INSERT INTO pagos (residente_id, concepto, monto, fecha_vencimiento, estado) VALUES
(1, 'Administración Septiembre 2024', 250000.00, '2024-09-15', 'pendiente'),
(2, 'Administración Septiembre 2024', 250000.00, '2024-09-15', 'pagado'),
(3, 'Administración Septiembre 2024', 280000.00, '2024-09-15', 'pendiente'),
(4, 'Parqueadero Septiembre 2024', 50000.00, '2024-09-15', 'pagado'),
(5, 'Administración Agosto 2024', 250000.00, '2024-08-15', 'vencido');

-- Insertar consumos energéticos de ejemplo
INSERT INTO consumo_energetico (unidad, fecha_lectura, consumo_kwh, costo, tipo_medicion) VALUES
('101', '2024-09-01 00:00:00', 145.50, 87300.00, 'automatico'),
('102', '2024-09-01 00:00:00', 132.75, 79650.00, 'automatico'),
('201', '2024-09-01 00:00:00', 167.25, 100350.00, 'automatico'),
('202', '2024-09-01 00:00:00', 128.00, 76800.00, 'automatico'),
('301', '2024-09-01 00:00:00', 156.80, 94080.00, 'automatico');

-- Insertar comunicaciones de ejemplo
INSERT INTO comunicaciones (titulo, mensaje, tipo, fecha_creacion, autor) VALUES
('Mantenimiento del Ascensor', 'Se realizará mantenimiento preventivo del ascensor principal el próximo sábado de 8:00 AM a 12:00 PM.', 'anuncio', '2024-09-05 10:00:00', 'Administración'),
('Reunión de Copropietarios', 'Se convoca a todos los propietarios a la reunión mensual que se realizará el 15 de septiembre a las 7:00 PM en el salón social.', 'evento', '2024-09-02 14:30:00', 'Administración'),
('Corte de Agua Programado', 'Debido a trabajos de la empresa de acueducto, habrá corte de agua el miércoles de 9:00 AM a 2:00 PM.', 'notificacion', '2024-09-06 16:00:00', 'Administración');

-- Crear índices para optimizar consultas
CREATE INDEX idx_residentes_unidad ON residentes(unidad);
CREATE INDEX idx_residentes_estado ON residentes(estado);
CREATE INDEX idx_acceso_fecha ON control_acceso(fecha_acceso);
CREATE INDEX idx_acceso_tarjeta ON control_acceso(tarjeta_rfid);
CREATE INDEX idx_pagos_estado ON pagos(estado);
CREATE INDEX idx_pagos_vencimiento ON pagos(fecha_vencimiento);
CREATE INDEX idx_consumo_unidad_fecha ON consumo_energetico(unidad, fecha_lectura);
CREATE INDEX idx_comunicaciones_tipo ON comunicaciones(tipo);
CREATE INDEX idx_auditoria_fecha ON auditoria_seguridad(fecha_hora);
CREATE INDEX idx_auditoria_usuario ON auditoria_seguridad(usuario_id);
