import sqlite3
import os

def quick_analysis():
    """Análisis rápido de la base de datos"""
    
    db_path = 'edificio.db'
    if not os.path.exists(db_path):
        print("❌ No se encontró la base de datos edificio.db")
        return
    
    print("🏢 ANÁLISIS RÁPIDO DE BASE DE DATOS")
    print("=" * 50)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Obtener tablas
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [table[0] for table in cursor.fetchall()]
    
    print(f"📊 Total de tablas: {len(tables)}")
    print(f"📋 Tablas: {', '.join(tables)}")
    print()
    
    # Información de cada tabla
    for table in tables:
        print(f"🏷️  {table.upper()}")
        print("-" * 20)
        
        # Estructura
        cursor.execute(f"PRAGMA table_info({table});")
        columns = cursor.fetchall()
        print(f"   Columnas: {len(columns)}")
        for col in columns:
            pk = " (PK)" if col[5] else ""
            print(f"     • {col[1]} {col[2]}{pk}")
        
        # Contar registros
        cursor.execute(f"SELECT COUNT(*) FROM {table};")
        count = cursor.fetchone()[0]
        print(f"   Registros: {count}")
        
        # Relaciones
        cursor.execute(f"PRAGMA foreign_key_list({table});")
        fks = cursor.fetchall()
        if fks:
            print("   Relaciones:")
            for fk in fks:
                print(f"     → {fk[2]}.{fk[4]}")
        print()
    
    # Diagrama ER simplificado
    print("🎨 DIAGRAMA ER SIMPLIFICADO")
    print("-" * 30)
    print("""
    DEPARTAMENTOS (1) ──── (N) INQUILINOS (1) ──── (N) PAGOS
         │                                              
         │                                              
    EMPLEADOS (independiente)                          
    
    Relaciones:
    • Departamentos → Inquilinos (1:N)
    • Inquilinos → Pagos (1:N)
    • Empleados (tabla independiente)
    """)
    
    conn.close()

if __name__ == "__main__":
    quick_analysis()
