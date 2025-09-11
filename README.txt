# Sistema de Administración de Edificio

Este es un proyecto full stack completo para la administración de un edificio residencial, desarrollado con tecnologías web modernas.

## Características

- **Backend**: Python con Flask y SQLite
- **Frontend**: HTML, CSS y JavaScript vanilla con Bootstrap
- **Base de datos**: SQLite con datos de ejemplo
- **CRUD completo** para todas las entidades:
  - Departamentos (número, piso, estado)
  - Inquilinos (nombre, departamento, teléfono)
  - Empleados (nombre, rol, horario)
  - Pagos (monto, fecha, inquilino, concepto)

## Estructura del Proyecto

```
proyecto2025A/
├── backend/
│   ├── app.py              # Aplicación Flask principal
│   ├── database.py         # Configuración de base de datos
│   ├── requirements.txt    # Dependencias de Python
│   └── edificio.db        # Base de datos SQLite (se crea automáticamente)
├── frontend/
│   ├── index.html         # Interfaz principal
│   ├── main.js           # Lógica JavaScript
│   └── styles.css        # Estilos CSS personalizados
└── README.txt            # Este archivo
```

## Instalación y Configuración

### Requisitos Previos
- Python 3.7 o superior
- Navegador web moderno

### Pasos de Instalación

1. **Instalar dependencias del backend**:
   Abra PowerShell en la carpeta del proyecto y ejecute:
   ```powershell
   cd backend
   pip install -r requirements.txt
   ```

2. **Iniciar el servidor Flask**:
   ```powershell
   python app.py
   ```
   
   El servidor se iniciará en http://localhost:5000

3. **Abrir el frontend**:
   Abra el archivo `frontend/index.html` en su navegador web.
   
   Alternativamente, puede usar un servidor web local:
   ```powershell
   cd frontend
   python -m http.server 8000
   ```
   Luego visite http://localhost:8000

## Uso del Sistema

### Funcionalidades Principales

1. **Gestión de Departamentos**:
   - Crear, editar y eliminar departamentos
   - Estados: Ocupado, Libre, Mantenimiento
   - Información de piso y número

2. **Gestión de Inquilinos**:
   - Registrar inquilinos con información de contacto
   - Asignar departamentos a inquilinos
   - Visualizar relaciones inquilino-departamento

3. **Gestión de Empleados**:
   - Administrar personal del edificio
   - Definir roles y horarios
   - Información completa de empleados

4. **Gestión de Pagos**:
   - Registrar pagos de inquilinos
   - Seguimiento de montos y fechas
   - Conceptos personalizables

### Navegación

- Use la barra de navegación superior para cambiar entre secciones
- Cada sección tiene botones para "Nuevo" elemento
- Use los íconos de editar (lápiz) y eliminar (papelera) en cada fila
- Los formularios se abren en modales para una mejor experiencia

## API Endpoints

El backend expone los siguientes endpoints REST:

### Departamentos
- `GET /api/departamentos` - Listar todos los departamentos
- `POST /api/departamentos` - Crear nuevo departamento
- `PUT /api/departamentos/{id}` - Actualizar departamento
- `DELETE /api/departamentos/{id}` - Eliminar departamento

### Inquilinos
- `GET /api/inquilinos` - Listar todos los inquilinos
- `POST /api/inquilinos` - Crear nuevo inquilino
- `PUT /api/inquilinos/{id}` - Actualizar inquilino
- `DELETE /api/inquilinos/{id}` - Eliminar inquilino

### Empleados
- `GET /api/empleados` - Listar todos los empleados
- `POST /api/empleados` - Crear nuevo empleado
- `PUT /api/empleados/{id}` - Actualizar empleado
- `DELETE /api/empleados/{id}` - Eliminar empleado

### Pagos
- `GET /api/pagos` - Listar todos los pagos
- `POST /api/pagos` - Crear nuevo pago
- `PUT /api/pagos/{id}` - Actualizar pago
- `DELETE /api/pagos/{id}` - Eliminar pago

### Salud
- `GET /api/health` - Verificar estado del servidor

## Datos de Ejemplo

El sistema incluye datos de ejemplo para facilitar las pruebas:

- 5 departamentos en diferentes pisos y estados
- 3 empleados con diferentes roles
- 2 inquilinos asignados a departamentos
- 3 pagos de ejemplo

## Tecnologías Utilizadas

### Backend
- **Flask**: Framework web de Python
- **Flask-CORS**: Manejo de CORS para peticiones del frontend
- **SQLite**: Base de datos ligera y sin configuración

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos personalizados
- **JavaScript ES6+**: Lógica de aplicación con async/await
- **Bootstrap 5**: Framework CSS para diseño responsivo
- **Font Awesome**: Iconografía

## Características Técnicas

- **Arquitectura REST**: API completamente RESTful
- **Validación de datos**: En backend y frontend
- **Manejo de errores**: Mensajes informativos para el usuario
- **Diseño responsivo**: Compatible con dispositivos móviles
- **Base de datos relacional**: Con claves foráneas e integridad referencial
- **Interfaz intuitiva**: Modales para formularios y confirmaciones

## Desarrollo y Personalización

### Agregar Nuevas Funcionalidades

1. **Backend**: Agregar nuevos endpoints en `app.py`
2. **Base de datos**: Modificar `database.py` para nuevas tablas
3. **Frontend**: Actualizar `main.js` para nuevas funciones
4. **UI**: Modificar `index.html` y `styles.css` para nuevos elementos

### Configuración de Base de Datos

La base de datos se inicializa automáticamente al ejecutar la aplicación. Para reiniciar con datos frescos, elimine el archivo `edificio.db` y reinicie el servidor.

## Solución de Problemas

### Errores Comunes

1. **Error de CORS**: Asegúrese de que Flask-CORS esté instalado
2. **Puerto ocupado**: Cambie el puerto en `app.py` si es necesario
3. **Módulos no encontrados**: Verifique que todas las dependencias estén instaladas

### Logs y Debugging

El servidor Flask ejecuta en modo debug por defecto, mostrando errores detallados en la consola.

## Contribución

Para contribuir al proyecto:
1. Haga un fork del repositorio
2. Cree una rama para su funcionalidad
3. Realice pruebas exhaustivas
4. Envíe un pull request con descripción detallada

## Licencia

Este proyecto está bajo la Licencia MIT. Vea el archivo LICENSE para detalles.

## Contacto

Para soporte técnico o consultas sobre el sistema, contacte al administrador del proyecto.