from flask import Flask, jsonify, request
from flask_cors import CORS
from database import Database
import sqlite3
from datetime import datetime
import hashlib

app = Flask(__name__)
CORS(app)  # Permite solicitudes desde el frontend

db = Database()

# ===============================
# AUTENTICACIÓN
# ===============================

# Usuarios del sistema (en un sistema real, esto estaría en una base de datos)
USERS = {
    'admin': {
        'password': 'admin123',  # En producción, esto estaría hasheado
        'role': 'administrator'
    },
    'manager': {
        'password': 'manager123',
        'role': 'manager'
    },
    'user': {
        'password': 'user123',
        'role': 'user'
    }
}

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Endpoint de autenticación"""
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        
        if not username or not password:
            return jsonify({
                'success': False,
                'message': 'Usuario y contraseña son requeridos'
            }), 400
        
        # Verificar credenciales
        if username in USERS and USERS[username]['password'] == password:
            return jsonify({
                'success': True,
                'message': 'Autenticación exitosa',
                'user': {
                    'username': username,
                    'role': USERS[username]['role']
                }
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Usuario o contraseña incorrectos'
            }), 401
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error interno del servidor'
        }), 500

@app.route('/api/auth/verify', methods=['POST'])
def verify_session():
    """Verificar si una sesión es válida"""
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        
        if username in USERS:
            return jsonify({
                'success': True,
                'user': {
                    'username': username,
                    'role': USERS[username]['role']
                }
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Sesión inválida'
            }), 401
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error interno del servidor'
        }), 500

# ===============================
# ENDPOINTS PARA DEPARTAMENTOS
# ===============================

@app.route('/api/departamentos', methods=['GET'])
def get_departamentos():
    """Obtener todos los departamentos"""
    try:
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM departamentos ORDER BY numero")
        departamentos = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(departamentos)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/departamentos', methods=['POST'])
def create_departamento():
    """Crear un nuevo departamento"""
    try:
        data = request.json
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO departamentos (numero, piso, estado) VALUES (?, ?, ?)",
            (data['numero'], data['piso'], data['estado'])
        )
        conn.commit()
        nuevo_id = cursor.lastrowid
        conn.close()
        return jsonify({'id': nuevo_id, 'message': 'Departamento creado exitosamente'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'El número de departamento ya existe'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/departamentos/<int:id>', methods=['PUT'])
def update_departamento(id):
    """Actualizar un departamento"""
    try:
        data = request.json
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE departamentos SET numero=?, piso=?, estado=? WHERE id=?",
            (data['numero'], data['piso'], data['estado'], id)
        )
        conn.commit()
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Departamento no encontrado'}), 404
        conn.close()
        return jsonify({'message': 'Departamento actualizado exitosamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/departamentos/<int:id>', methods=['DELETE'])
def delete_departamento(id):
    """Eliminar un departamento"""
    try:
        conn = db.get_connection()
        cursor = conn.cursor()
        
        # Verificar si hay inquilinos asociados
        cursor.execute("SELECT COUNT(*) FROM inquilinos WHERE departamento_id=?", (id,))
        if cursor.fetchone()[0] > 0:
            conn.close()
            return jsonify({'error': 'No se puede eliminar un departamento con inquilinos asociados'}), 400
        
        cursor.execute("DELETE FROM departamentos WHERE id=?", (id,))
        conn.commit()
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Departamento no encontrado'}), 404
        conn.close()
        return jsonify({'message': 'Departamento eliminado exitosamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===============================
# ENDPOINTS PARA INQUILINOS
# ===============================

@app.route('/api/inquilinos', methods=['GET'])
def get_inquilinos():
    """Obtener todos los inquilinos con información del departamento"""
    try:
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT i.id, i.nombre, i.telefono, i.departamento_id,
                   d.numero as departamento_numero, d.piso
            FROM inquilinos i
            LEFT JOIN departamentos d ON i.departamento_id = d.id
            ORDER BY i.nombre
        ''')
        inquilinos = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(inquilinos)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/inquilinos', methods=['POST'])
def create_inquilino():
    """Crear un nuevo inquilino"""
    try:
        data = request.json
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO inquilinos (nombre, departamento_id, telefono) VALUES (?, ?, ?)",
            (data['nombre'], data.get('departamento_id'), data.get('telefono'))
        )
        conn.commit()
        nuevo_id = cursor.lastrowid
        conn.close()
        return jsonify({'id': nuevo_id, 'message': 'Inquilino creado exitosamente'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/inquilinos/<int:id>', methods=['PUT'])
def update_inquilino(id):
    """Actualizar un inquilino"""
    try:
        data = request.json
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE inquilinos SET nombre=?, departamento_id=?, telefono=? WHERE id=?",
            (data['nombre'], data.get('departamento_id'), data.get('telefono'), id)
        )
        conn.commit()
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Inquilino no encontrado'}), 404
        conn.close()
        return jsonify({'message': 'Inquilino actualizado exitosamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/inquilinos/<int:id>', methods=['DELETE'])
def delete_inquilino(id):
    """Eliminar un inquilino"""
    try:
        conn = db.get_connection()
        cursor = conn.cursor()
        
        # Verificar si hay pagos asociados
        cursor.execute("SELECT COUNT(*) FROM pagos WHERE inquilino_id=?", (id,))
        if cursor.fetchone()[0] > 0:
            conn.close()
            return jsonify({'error': 'No se puede eliminar un inquilino con pagos registrados'}), 400
        
        cursor.execute("DELETE FROM inquilinos WHERE id=?", (id,))
        conn.commit()
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Inquilino no encontrado'}), 404
        conn.close()
        return jsonify({'message': 'Inquilino eliminado exitosamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===============================
# ENDPOINTS PARA EMPLEADOS
# ===============================

@app.route('/api/empleados', methods=['GET'])
def get_empleados():
    """Obtener todos los empleados"""
    try:
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM empleados ORDER BY nombre")
        empleados = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(empleados)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/empleados', methods=['POST'])
def create_empleado():
    """Crear un nuevo empleado"""
    try:
        data = request.json
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO empleados (nombre, rol, horario) VALUES (?, ?, ?)",
            (data['nombre'], data['rol'], data['horario'])
        )
        conn.commit()
        nuevo_id = cursor.lastrowid
        conn.close()
        return jsonify({'id': nuevo_id, 'message': 'Empleado creado exitosamente'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/empleados/<int:id>', methods=['PUT'])
def update_empleado(id):
    """Actualizar un empleado"""
    try:
        data = request.json
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE empleados SET nombre=?, rol=?, horario=? WHERE id=?",
            (data['nombre'], data['rol'], data['horario'], id)
        )
        conn.commit()
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Empleado no encontrado'}), 404
        conn.close()
        return jsonify({'message': 'Empleado actualizado exitosamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/empleados/<int:id>', methods=['DELETE'])
def delete_empleado(id):
    """Eliminar un empleado"""
    try:
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM empleados WHERE id=?", (id,))
        conn.commit()
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Empleado no encontrado'}), 404
        conn.close()
        return jsonify({'message': 'Empleado eliminado exitosamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===============================
# ENDPOINTS PARA PAGOS
# ===============================

@app.route('/api/pagos', methods=['GET'])
def get_pagos():
    """Obtener todos los pagos con información del inquilino"""
    try:
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT p.id, p.monto, p.fecha, p.concepto, p.inquilino_id,
                   i.nombre as inquilino_nombre,
                   d.numero as departamento_numero
            FROM pagos p
            LEFT JOIN inquilinos i ON p.inquilino_id = i.id
            LEFT JOIN departamentos d ON i.departamento_id = d.id
            ORDER BY p.fecha DESC
        ''')
        pagos = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(pagos)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/pagos', methods=['POST'])
def create_pago():
    """Crear un nuevo pago"""
    try:
        data = request.json
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO pagos (monto, fecha, inquilino_id, concepto) VALUES (?, ?, ?, ?)",
            (data['monto'], data['fecha'], data['inquilino_id'], data.get('concepto', ''))
        )
        conn.commit()
        nuevo_id = cursor.lastrowid
        conn.close()
        return jsonify({'id': nuevo_id, 'message': 'Pago registrado exitosamente'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/pagos/<int:id>', methods=['PUT'])
def update_pago(id):
    """Actualizar un pago"""
    try:
        data = request.json
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE pagos SET monto=?, fecha=?, inquilino_id=?, concepto=? WHERE id=?",
            (data['monto'], data['fecha'], data['inquilino_id'], data.get('concepto', ''), id)
        )
        conn.commit()
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Pago no encontrado'}), 404
        conn.close()
        return jsonify({'message': 'Pago actualizado exitosamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/pagos/<int:id>', methods=['DELETE'])
def delete_pago(id):
    """Eliminar un pago"""
    try:
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM pagos WHERE id=?", (id,))
        conn.commit()
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Pago no encontrado'}), 404
        conn.close()
        return jsonify({'message': 'Pago eliminado exitosamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===============================
# ENDPOINT DE SALUD
# ===============================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Verificar que la API está funcionando"""
    return jsonify({'status': 'OK', 'message': 'API de Administración de Edificio funcionando correctamente'})

if __name__ == '__main__':
    print("🏢 Iniciando servidor de Administración de Edificio...")
    print("📍 API disponible en: http://localhost:5000")
    print("📊 Endpoints disponibles:")
    print("   - GET/POST/PUT/DELETE /api/departamentos")
    print("   - GET/POST/PUT/DELETE /api/inquilinos")
    print("   - GET/POST/PUT/DELETE /api/empleados")
    print("   - GET/POST/PUT/DELETE /api/pagos")
    print("   - GET /api/health")
    app.run(debug=True, host='0.0.0.0', port=5000)