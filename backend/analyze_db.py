import sqlite3
import pandas as pd
from datetime import datetime

def analyze_database():
    """Análisis completo de la base de datos"""
    
    print("🏢 ANÁLISIS DE BASE DE DATOS - SISTEMA EDIFICIO")
    print("=" * 60)
    print(f"📅 Fecha de análisis: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    try:
        conn = sqlite3.connect('edificio.db')
        cursor = conn.cursor()
        
        # 1. Información general
        print("📊 INFORMACIÓN GENERAL")
        print("-" * 30)
        
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [table[0] for table in cursor.fetchall()]
        print(f"🗂️  Número total de tablas: {len(tables)}")
        print(f"📋 Tablas: {', '.join(tables)}")
        print()
        
        # 2. Análisis por tabla
        for table in tables:
            print(f"🏷️  TABLA: {table.upper()}")
            print("-" * 40)
            
            # Estructura de la tabla
            cursor.execute(f"PRAGMA table_info({table});")
            columns = cursor.fetchall()
            print(f"   📊 Columnas ({len(columns)}):")
            for col in columns:
                pk_mark = " 🔑" if col[5] else ""
                null_mark = " ❌" if col[3] else " ✅"
                print(f"      • {col[1]} ({col[2]}){pk_mark}{null_mark}")
            
            # Contar registros
            cursor.execute(f"SELECT COUNT(*) FROM {table};")
            count = cursor.fetchone()[0]
            print(f"   📈 Registros: {count}")
            
            # Claves foráneas
            cursor.execute(f"PRAGMA foreign_key_list({table});")
            foreign_keys = cursor.fetchall()
            if foreign_keys:
                print(f"   🔗 Claves foráneas:")
                for fk in foreign_keys:
                    print(f"      • {fk[3]} → {fk[2]}.{fk[4]}")
            
            # Datos de muestra
            if count > 0:
                cursor.execute(f"SELECT * FROM {table} LIMIT 3;")
                sample_data = cursor.fetchall()
                print(f"   🔍 Muestra de datos:")
                for i, row in enumerate(sample_data, 1):
                    print(f"      {i}: {row}")
            
            print()
        
        # 3. Análisis de relaciones
        print("🔗 ANÁLISIS DE RELACIONES")
        print("-" * 30)
        
        all_relationships = []
        for table in tables:
            cursor.execute(f"PRAGMA foreign_key_list({table});")
            fks = cursor.fetchall()
            for fk in fks:
                all_relationships.append({
                    'from_table': table,
                    'from_column': fk[3],
                    'to_table': fk[2],
                    'to_column': fk[4]
                })
        
        if all_relationships:
            for rel in all_relationships:
                print(f"   {rel['from_table']}.{rel['from_column']} → {rel['to_table']}.{rel['to_column']}")
        else:
            print("   ⚠️  No se encontraron relaciones explícitas")
        print()
        
        # 4. Estadísticas por entidad
        print("📈 ESTADÍSTICAS DETALLADAS")
        print("-" * 30)
        
        # Departamentos por estado
        if 'departamentos' in tables:
            cursor.execute("SELECT estado, COUNT(*) FROM departamentos GROUP BY estado;")
            dept_stats = cursor.fetchall()
            print("🏠 Departamentos por estado:")
            for estado, count in dept_stats:
                print(f"   • {estado}: {count}")
        
        # Inquilinos con/sin departamento
        if 'inquilinos' in tables:
            cursor.execute("SELECT COUNT(*) FROM inquilinos WHERE departamento_id IS NOT NULL;")
            with_dept = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM inquilinos WHERE departamento_id IS NULL;")
            without_dept = cursor.fetchone()[0]
            print("👥 Inquilinos:")
            print(f"   • Con departamento: {with_dept}")
            print(f"   • Sin departamento: {without_dept}")
        
        # Análisis de pagos
        if 'pagos' in tables:
            cursor.execute("SELECT COUNT(*), SUM(monto), AVG(monto) FROM pagos;")
            payment_stats = cursor.fetchone()
            print("💰 Pagos:")
            print(f"   • Total de pagos: {payment_stats[0]}")
            print(f"   • Suma total: ${payment_stats[1]:,.2f}")
            print(f"   • Promedio: ${payment_stats[2]:,.2f}")
        
        print()
        
        # 5. Integridad referencial
        print("🔍 VERIFICACIÓN DE INTEGRIDAD")
        print("-" * 30)
        
        # Verificar inquilinos con departamentos inexistentes
        cursor.execute("""
            SELECT COUNT(*) FROM inquilinos i 
            LEFT JOIN departamentos d ON i.departamento_id = d.id 
            WHERE i.departamento_id IS NOT NULL AND d.id IS NULL
        """)
        orphan_inquilinos = cursor.fetchone()[0]
        
        # Verificar pagos con inquilinos inexistentes
        cursor.execute("""
            SELECT COUNT(*) FROM pagos p 
            LEFT JOIN inquilinos i ON p.inquilino_id = i.id 
            WHERE p.inquilino_id IS NOT NULL AND i.id IS NULL
        """)
        orphan_pagos = cursor.fetchone()[0]
        
        print(f"   ✅ Inquilinos huérfanos: {orphan_inquilinos}")
        print(f"   ✅ Pagos huérfanos: {orphan_pagos}")
        
        if orphan_inquilinos == 0 and orphan_pagos == 0:
            print("   🎉 ¡Integridad referencial perfecta!")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error al analizar la base de datos: {e}")

def export_to_csv():
    """Exportar todas las tablas a CSV"""
    try:
        conn = sqlite3.connect('edificio.db')
        
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [table[0] for table in cursor.fetchall()]
        
        print("📤 EXPORTANDO TABLAS A CSV")
        print("-" * 30)
        
        for table in tables:
            df = pd.read_sql_query(f"SELECT * FROM {table}", conn)
            filename = f"export_{table}.csv"
            df.to_csv(filename, index=False, encoding='utf-8')
            print(f"   ✅ {table} → {filename} ({len(df)} registros)")
        
        conn.close()
        print("\n🎉 Exportación completada!")
        
    except Exception as e:
        print(f"❌ Error al exportar: {e}")

def create_er_diagram_text():
    """Crear diagrama ER en texto"""
    print("\n🎨 DIAGRAMA ENTIDAD-RELACIÓN (TEXTO)")
    print("=" * 50)
    
    er_diagram = """
    ┌─────────────────┐       ┌─────────────────┐
    │   DEPARTAMENTOS │       │    INQUILINOS   │
    ├─────────────────┤       ├─────────────────┤
    │ 🔑 id (PK)      │◄─────┤│ 🔑 id (PK)      │
    │ numero          │      1│ nombre          │
    │ piso            │       │ 🔗 departamento_id│
    │ estado          │       │ telefono        │
    └─────────────────┘       └─────────────────┘
                                       │
                                       │ 1
                                       │
                                       │ N
                                       ▼
                              ┌─────────────────┐
                              │      PAGOS      │
                              ├─────────────────┤
                              │ 🔑 id (PK)      │
                              │ monto           │
                              │ fecha           │
                              │ 🔗 inquilino_id │
                              │ concepto        │
                              └─────────────────┘
    
    ┌─────────────────┐
    │    EMPLEADOS    │
    ├─────────────────┤
    │ 🔑 id (PK)      │
    │ nombre          │
    │ rol             │
    │ horario         │
    └─────────────────┘
    
    LEYENDA:
    🔑 = Clave Primaria
    🔗 = Clave Foránea
    1:N = Relación uno a muchos
    """
    
    print(er_diagram)

if __name__ == "__main__":
    print("🏢 HERRAMIENTAS DE ANÁLISIS DE BASE DE DATOS")
    print("=" * 60)
    
    while True:
        print("\n📋 OPCIONES DISPONIBLES:")
        print("1. 🔍 Análisis completo de la base de datos")
        print("2. 📤 Exportar tablas a CSV")
        print("3. 🎨 Mostrar diagrama ER en texto")
        print("4. 🚪 Salir")
        
        try:
            choice = input("\n👉 Seleccione una opción (1-4): ").strip()
            
            if choice == "1":
                analyze_database()
            elif choice == "2":
                export_to_csv()
            elif choice == "3":
                create_er_diagram_text()
            elif choice == "4":
                print("👋 ¡Hasta luego!")
                break
            else:
                print("❌ Opción inválida. Intente de nuevo.")
                
        except KeyboardInterrupt:
            print("\n👋 ¡Hasta luego!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
