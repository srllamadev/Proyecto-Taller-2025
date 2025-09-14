from flask import Flask, jsonify, render_template_string
import sqlite3
import json

# Crear una nueva aplicación Flask para el visualizador de DB
app_db = Flask(__name__)

def get_database_schema():
    """Obtener el esquema completo de la base de datos"""
    conn = sqlite3.connect('edificio.db')
    cursor = conn.cursor()
    
    # Obtener todas las tablas
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    schema = {}
    relationships = []
    
    for table in tables:
        table_name = table[0]
        
        # Obtener información de columnas
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = cursor.fetchall()
        
        # Obtener claves foráneas
        cursor.execute(f"PRAGMA foreign_key_list({table_name});")
        foreign_keys = cursor.fetchall()
        
        # Contar registros
        cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
        record_count = cursor.fetchone()[0]
        
        schema[table_name] = {
            'columns': [
                {
                    'id': col[0],
                    'name': col[1],
                    'type': col[2],
                    'not_null': bool(col[3]),
                    'default': col[4],
                    'primary_key': bool(col[5])
                }
                for col in columns
            ],
            'foreign_keys': [
                {
                    'id': fk[0],
                    'seq': fk[1],
                    'table': fk[2],
                    'from': fk[3],
                    'to': fk[4]
                }
                for fk in foreign_keys
            ],
            'record_count': record_count
        }
        
        # Agregar relaciones para el diagrama ER
        for fk in foreign_keys:
            relationships.append({
                'from_table': table_name,
                'from_column': fk[3],
                'to_table': fk[2],
                'to_column': fk[4]
            })
    
    conn.close()
    return schema, relationships

def get_table_data(table_name, limit=10):
    """Obtener datos de muestra de una tabla"""
    conn = sqlite3.connect('edificio.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute(f"SELECT * FROM {table_name} LIMIT {limit}")
    rows = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return rows

@app_db.route('/db-viewer')
def database_viewer():
    """Página principal del visualizador de base de datos"""
    schema, relationships = get_database_schema()
    
    html_template = """
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Visualizador de Base de Datos - Edificio</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <style>
            :root {
                --color-dark: #0F1226;
                --color-bronze: #AB987A;
                --color-red: #FF533D;
                --color-light: #F5F5F5;
            }
            
            body {
                background: var(--color-light);
                font-family: 'Inter', sans-serif;
            }
            
            .header {
                background: linear-gradient(135deg, var(--color-dark) 0%, #1a1f3a 100%);
                color: white;
                padding: 2rem;
                margin-bottom: 2rem;
            }
            
            .table-card {
                background: white;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(15, 18, 38, 0.1);
                margin-bottom: 2rem;
                overflow: hidden;
                border: 2px solid transparent;
                transition: all 0.3s ease;
            }
            
            .table-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 48px rgba(15, 18, 38, 0.15);
                border-color: var(--color-red);
            }
            
            .table-header {
                background: linear-gradient(135deg, var(--color-bronze) 0%, #c4a883 100%);
                color: white;
                padding: 1.5rem;
                font-weight: bold;
            }
            
            .column-item {
                padding: 0.75rem 1.5rem;
                border-bottom: 1px solid #e9ecef;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .column-item:last-child {
                border-bottom: none;
            }
            
            .primary-key {
                background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
                color: #000;
            }
            
            .foreign-key {
                background: linear-gradient(135deg, #ff533d 0%, #ff6b50 100%);
                color: white;
            }
            
            .er-diagram {
                background: white;
                border-radius: 16px;
                padding: 2rem;
                box-shadow: 0 8px 32px rgba(15, 18, 38, 0.1);
                margin-bottom: 2rem;
            }
            
            .relationship-line {
                stroke: var(--color-red);
                stroke-width: 2;
                fill: none;
            }
            
            .table-box {
                fill: white;
                stroke: var(--color-bronze);
                stroke-width: 2;
                rx: 8;
            }
            
            .badge-custom {
                font-size: 0.7rem;
                padding: 0.25rem 0.5rem;
                border-radius: 12px;
            }
        </style>
    </head>
    <body>
        <div class="header text-center">
            <h1><i class="fas fa-database me-3"></i>Visualizador de Base de Datos</h1>
            <p class="mb-0">Sistema de Administración de Edificio</p>
        </div>
        
        <div class="container">
            <!-- Resumen General -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="er-diagram">
                        <h3><i class="fas fa-chart-network me-2"></i>Resumen del Esquema</h3>
                        <div class="row">
                            <div class="col-md-3">
                                <div class="text-center">
                                    <h2 class="text-primary">{{ schema|length }}</h2>
                                    <p>Tablas</p>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="text-center">
                                    <h2 class="text-success">{{ relationships|length }}</h2>
                                    <p>Relaciones</p>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="text-center">
                                    <h2 class="text-warning">
                                        {% set total_records = 0 %}
                                        {% for table, info in schema.items() %}
                                            {% set total_records = total_records + info.record_count %}
                                        {% endfor %}
                                        {{ total_records }}
                                    </h2>
                                    <p>Registros Totales</p>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="text-center">
                                    <h2 class="text-info">
                                        {% set total_columns = 0 %}
                                        {% for table, info in schema.items() %}
                                            {% set total_columns = total_columns + info.columns|length %}
                                        {% endfor %}
                                        {{ total_columns }}
                                    </h2>
                                    <p>Columnas Totales</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Relaciones -->
            {% if relationships %}
            <div class="row mb-4">
                <div class="col-12">
                    <div class="er-diagram">
                        <h3><i class="fas fa-project-diagram me-2"></i>Relaciones Entre Tablas</h3>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Tabla Origen</th>
                                        <th>Campo</th>
                                        <th></th>
                                        <th>Tabla Destino</th>
                                        <th>Campo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {% for rel in relationships %}
                                    <tr>
                                        <td><span class="badge bg-primary">{{ rel.from_table }}</span></td>
                                        <td><code>{{ rel.from_column }}</code></td>
                                        <td class="text-center"><i class="fas fa-arrow-right text-danger"></i></td>
                                        <td><span class="badge bg-success">{{ rel.to_table }}</span></td>
                                        <td><code>{{ rel.to_column }}</code></td>
                                    </tr>
                                    {% endfor %}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {% endif %}
            
            <!-- Detalles de Tablas -->
            <div class="row">
                {% for table_name, table_info in schema.items() %}
                <div class="col-lg-6 mb-4">
                    <div class="table-card">
                        <div class="table-header">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="mb-0">
                                        <i class="fas fa-table me-2"></i>{{ table_name }}
                                    </h5>
                                </div>
                                <div>
                                    <span class="badge badge-custom bg-light text-dark">
                                        {{ table_info.record_count }} registros
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="table-body">
                            {% for column in table_info.columns %}
                            <div class="column-item {% if column.primary_key %}primary-key{% endif %}">
                                <div>
                                    <strong>{{ column.name }}</strong>
                                    <span class="text-muted ms-2">{{ column.type }}</span>
                                    {% if column.primary_key %}
                                        <span class="badge bg-warning text-dark ms-2">PK</span>
                                    {% endif %}
                                    {% if column.not_null and not column.primary_key %}
                                        <span class="badge bg-danger ms-2">NOT NULL</span>
                                    {% endif %}
                                </div>
                                <div>
                                    {% if column.default %}
                                        <small class="text-muted">Default: {{ column.default }}</small>
                                    {% endif %}
                                </div>
                            </div>
                            {% endfor %}
                            
                            {% if table_info.foreign_keys %}
                            <div class="p-3 bg-light">
                                <h6><i class="fas fa-link me-2"></i>Claves Foráneas:</h6>
                                {% for fk in table_info.foreign_keys %}
                                <div class="mb-1">
                                    <span class="badge foreign-key">
                                        {{ fk.from }} → {{ fk.table }}.{{ fk.to }}
                                    </span>
                                </div>
                                {% endfor %}
                            </div>
                            {% endif %}
                        </div>
                    </div>
                </div>
                {% endfor %}
            </div>
            
            <!-- Botones de Acción -->
            <div class="row mb-4">
                <div class="col-12 text-center">
                    <a href="/db-viewer/export" class="btn btn-primary me-2">
                        <i class="fas fa-download me-2"></i>Exportar Esquema
                    </a>
                    <a href="/db-viewer/data" class="btn btn-success me-2">
                        <i class="fas fa-table me-2"></i>Ver Datos
                    </a>
                    <a href="/" class="btn btn-secondary">
                        <i class="fas fa-arrow-left me-2"></i>Volver a la App
                    </a>
                </div>
            </div>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
    """
    
    return render_template_string(html_template, schema=schema, relationships=relationships)

@app_db.route('/db-viewer/export')
def export_schema():
    """Exportar esquema como JSON"""
    schema, relationships = get_database_schema()
    export_data = {
        'schema': schema,
        'relationships': relationships,
        'metadata': {
            'export_date': '2025-09-11',
            'database_type': 'SQLite',
            'application': 'Sistema Administración Edificio'
        }
    }
    return jsonify(export_data)

@app_db.route('/db-viewer/data')
def view_data():
    """Ver datos de todas las tablas"""
    schema, _ = get_database_schema()
    all_data = {}
    
    for table_name in schema.keys():
        all_data[table_name] = get_table_data(table_name, limit=5)
    
    html_template = """
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Datos de la Base de Datos</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <style>
            body { background: #F5F5F5; font-family: 'Inter', sans-serif; }
            .header { background: linear-gradient(135deg, #0F1226 0%, #1a1f3a 100%); color: white; padding: 2rem; margin-bottom: 2rem; }
            .table-card { background: white; border-radius: 16px; box-shadow: 0 8px 32px rgba(15, 18, 38, 0.1); margin-bottom: 2rem; }
            .table-header { background: linear-gradient(135deg, #AB987A 0%, #c4a883 100%); color: white; padding: 1.5rem; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="header text-center">
            <h1><i class="fas fa-database me-3"></i>Datos de la Base de Datos</h1>
            <p class="mb-0">Muestra de registros (5 por tabla)</p>
        </div>
        
        <div class="container">
            {% for table_name, data in all_data.items() %}
            <div class="table-card">
                <div class="table-header">
                    <h5 class="mb-0"><i class="fas fa-table me-2"></i>{{ table_name }}</h5>
                </div>
                <div class="table-responsive">
                    {% if data %}
                    <table class="table table-striped mb-0">
                        <thead class="table-light">
                            <tr>
                                {% for key in data[0].keys() %}
                                <th>{{ key }}</th>
                                {% endfor %}
                            </tr>
                        </thead>
                        <tbody>
                            {% for row in data %}
                            <tr>
                                {% for value in row.values() %}
                                <td>{{ value if value is not none else 'NULL' }}</td>
                                {% endfor %}
                            </tr>
                            {% endfor %}
                        </tbody>
                    </table>
                    {% else %}
                    <div class="p-4 text-center text-muted">
                        <i class="fas fa-inbox fa-2x mb-2"></i>
                        <p>No hay datos en esta tabla</p>
                    </div>
                    {% endif %}
                </div>
            </div>
            {% endfor %}
            
            <div class="text-center mb-4">
                <a href="/db-viewer" class="btn btn-primary">
                    <i class="fas fa-arrow-left me-2"></i>Volver al Esquema
                </a>
            </div>
        </div>
    </body>
    </html>
    """
    
    return render_template_string(html_template, all_data=all_data)

if __name__ == '__main__':
    print("🔍 Iniciando Visualizador de Base de Datos...")
    print("📊 Disponible en: http://localhost:5001/db-viewer")
    app_db.run(debug=True, host='0.0.0.0', port=5001)
