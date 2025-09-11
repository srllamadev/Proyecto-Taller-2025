import requests
import json

# Script de prueba para verificar que todos los endpoints de la API funcionan correctamente

BASE_URL = 'http://localhost:5000/api'

def test_api():
    print("🧪 Probando API de Administración de Edificio...")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n1. Probando endpoint de salud...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check: OK")
            print(f"   Respuesta: {response.json()['message']}")
        else:
            print("❌ Health check: FAILED")
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al servidor. ¿Está ejecutándose Flask?")
        return False
    
    # Test 2: Departamentos
    print("\n2. Probando endpoints de departamentos...")
    try:
        # GET departamentos
        response = requests.get(f"{BASE_URL}/departamentos")
        if response.status_code == 200:
            departamentos = response.json()
            print(f"✅ GET departamentos: OK ({len(departamentos)} registros)")
        else:
            print("❌ GET departamentos: FAILED")
            
        # POST departamento
        nuevo_dept = {
            "numero": "TEST001",
            "piso": 99,
            "estado": "Libre"
        }
        response = requests.post(f"{BASE_URL}/departamentos", json=nuevo_dept)
        if response.status_code == 201:
            print("✅ POST departamento: OK")
            test_dept_id = response.json()['id']
            
            # PUT departamento
            update_data = {
                "numero": "TEST001-UPDATED",
                "piso": 99,
                "estado": "Ocupado"
            }
            response = requests.put(f"{BASE_URL}/departamentos/{test_dept_id}", json=update_data)
            if response.status_code == 200:
                print("✅ PUT departamento: OK")
            else:
                print("❌ PUT departamento: FAILED")
                
            # DELETE departamento
            response = requests.delete(f"{BASE_URL}/departamentos/{test_dept_id}")
            if response.status_code == 200:
                print("✅ DELETE departamento: OK")
            else:
                print("❌ DELETE departamento: FAILED")
        else:
            print("❌ POST departamento: FAILED")
    except Exception as e:
        print(f"❌ Error en pruebas de departamentos: {str(e)}")
    
    # Test 3: Inquilinos
    print("\n3. Probando endpoints de inquilinos...")
    try:
        # GET inquilinos
        response = requests.get(f"{BASE_URL}/inquilinos")
        if response.status_code == 200:
            inquilinos = response.json()
            print(f"✅ GET inquilinos: OK ({len(inquilinos)} registros)")
        else:
            print("❌ GET inquilinos: FAILED")
            
        # POST inquilino
        nuevo_inquilino = {
            "nombre": "Test User",
            "departamento_id": None,
            "telefono": "555-TEST"
        }
        response = requests.post(f"{BASE_URL}/inquilinos", json=nuevo_inquilino)
        if response.status_code == 201:
            print("✅ POST inquilino: OK")
            test_inquilino_id = response.json()['id']
            
            # DELETE inquilino
            response = requests.delete(f"{BASE_URL}/inquilinos/{test_inquilino_id}")
            if response.status_code == 200:
                print("✅ DELETE inquilino: OK")
            else:
                print("❌ DELETE inquilino: FAILED")
        else:
            print("❌ POST inquilino: FAILED")
    except Exception as e:
        print(f"❌ Error en pruebas de inquilinos: {str(e)}")
    
    # Test 4: Empleados
    print("\n4. Probando endpoints de empleados...")
    try:
        response = requests.get(f"{BASE_URL}/empleados")
        if response.status_code == 200:
            empleados = response.json()
            print(f"✅ GET empleados: OK ({len(empleados)} registros)")
        else:
            print("❌ GET empleados: FAILED")
    except Exception as e:
        print(f"❌ Error en pruebas de empleados: {str(e)}")
    
    # Test 5: Pagos
    print("\n5. Probando endpoints de pagos...")
    try:
        response = requests.get(f"{BASE_URL}/pagos")
        if response.status_code == 200:
            pagos = response.json()
            print(f"✅ GET pagos: OK ({len(pagos)} registros)")
        else:
            print("❌ GET pagos: FAILED")
    except Exception as e:
        print(f"❌ Error en pruebas de pagos: {str(e)}")
    
    print("\n" + "=" * 50)
    print("🎉 Pruebas de API completadas")
    return True

if __name__ == "__main__":
    print("Para ejecutar estas pruebas, asegúrese de que:")
    print("1. El servidor Flask esté ejecutándose (python app.py)")
    print("2. Tenga instalada la librería 'requests' (pip install requests)")
    print("")
    
    try:
        import requests
        test_api()
    except ImportError:
        print("❌ La librería 'requests' no está instalada.")
        print("   Instálela con: pip install requests")
