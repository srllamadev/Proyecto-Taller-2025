import sqlite3
import os
from datetime import datetime

class Database:
    def __init__(self):
        self.db_name = 'edificio.db'
        self.init_database()
    
    def get_connection(self):
        """Crear conexión a la base de datos"""
        conn = sqlite3.connect(self.db_name)
        conn.row_factory = sqlite3.Row  # Para obtener resultados como diccionarios
        return conn
    
    def init_database(self):
        """Inicializar las tablas de la base de datos"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Tabla Departamentos
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS departamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT NOT NULL UNIQUE,
            piso INTEGER NOT NULL,
            estado TEXT NOT NULL CHECK(estado IN ('Ocupado', 'Libre', 'Mantenimiento'))
        )
        ''')
        
        # Tabla Inquilinos
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS inquilinos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            departamento_id INTEGER,
            telefono TEXT,
            FOREIGN KEY (departamento_id) REFERENCES departamentos (id)
        )
        ''')
        
        # Tabla Empleados
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS empleados (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            rol TEXT NOT NULL,
            horario TEXT NOT NULL
        )
        ''')
        
        # Tabla Pagos
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS pagos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            monto REAL NOT NULL,
            fecha TEXT NOT NULL,
            inquilino_id INTEGER,
            concepto TEXT,
            FOREIGN KEY (inquilino_id) REFERENCES inquilinos (id)
        )
        ''')
        
        conn.commit()
        
        # Insertar datos de ejemplo si las tablas están vacías
        self.insert_sample_data(cursor)
        
        conn.commit()
        conn.close()
    
    def insert_sample_data(self, cursor):
        """Insertar datos de ejemplo"""
        # Verificar si ya hay datos
        cursor.execute("SELECT COUNT(*) FROM departamentos")
        if cursor.fetchone()[0] == 0:
            # Departamentos de ejemplo
            sample_departments = [
                ('101', 1, 'Ocupado'),
                ('102', 1, 'Libre'),
                ('201', 2, 'Ocupado'),
                ('202', 2, 'Mantenimiento'),
                ('301', 3, 'Libre')
            ]
            cursor.executemany("INSERT INTO departamentos (numero, piso, estado) VALUES (?, ?, ?)", sample_departments)
            
            # Empleados de ejemplo
            sample_employees = [
                ('Juan Pérez', 'Conserje', 'Lunes a Viernes 8:00-16:00'),
                ('María García', 'Administradora', 'Lunes a Viernes 9:00-17:00'),
                ('Carlos López', 'Mantenimiento', 'Lunes a Sábado 7:00-15:00')
            ]
            cursor.executemany("INSERT INTO empleados (nombre, rol, horario) VALUES (?, ?, ?)", sample_employees)
            
            # Inquilinos de ejemplo
            sample_tenants = [
                ('Ana Martínez', 1, '555-1234'),
                ('Roberto Silva', 3, '555-5678')
            ]
            cursor.executemany("INSERT INTO inquilinos (nombre, departamento_id, telefono) VALUES (?, ?, ?)", sample_tenants)
            
            # Pagos de ejemplo
            sample_payments = [
                (1500.00, '2025-01-15', 1, 'Renta mensual'),
                (1200.00, '2025-01-15', 2, 'Renta mensual'),
                (1500.00, '2025-02-15', 1, 'Renta mensual')
            ]
            cursor.executemany("INSERT INTO pagos (monto, fecha, inquilino_id, concepto) VALUES (?, ?, ?, ?)", sample_payments)

db = Database()
