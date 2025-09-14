# 🏢 Sistema de Administración de Edificio - Guía de Inicio

## 📋 Tabla de Contenidos
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Prerrequisitos](#-prerrequisitos)
- [Instalación desde Cero](#-instalación-desde-cero)
- [Configuración del Entorno](#-configuración-del-entorno)
- [Ejecución del Sistema](#-ejecución-del-sistema)
- [Verificación del Sistema](#-verificación-del-sistema)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Solución de Problemas](#-solución-de-problemas)

---

## 🛠 Tecnologías Utilizadas

### Backend
- **Python 3.12.4** - Lenguaje de programación principal
- **Flask 2.3.3** - Framework web minimalista para Python
- **Flask-CORS 4.0.0** - Manejo de CORS para comunicación frontend-backend
- **SQLite3** - Base de datos relacional embebida
- **JSON** - Formato de intercambio de datos

### Frontend
- **HTML5** - Estructura de la interfaz web
- **CSS3** - Estilos y diseño responsive
- **JavaScript (ES6+)** - Lógica del lado del cliente
- **Bootstrap 5.1.3** - Framework CSS para diseño responsive
- **Font Awesome 6.0.0** - Iconografía vectorial

### Herramientas de Desarrollo
- **Git** - Control de versiones
- **VS Code** - Editor de código recomendado
- **PowerShell** - Terminal para Windows

---

## 🏗 Arquitectura del Sistema

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐
│                 │ <────────────> │                 │
│    Frontend     │                │     Backend     │
│   (HTML/CSS/JS) │                │   (Flask/Python)│
│                 │                │                 │
└─────────────────┘                └─────────────────┘
                                            │
                                            │ SQLite
                                            ▼
                                   ┌─────────────────┐
                                   │                 │
                                   │   Base de Datos │
                                   │   (edificio.db) │
                                   │                 │
                                   └─────────────────┘
```

---

## 📋 Prerrequisitos

### Software Requerido
1. **Python 3.7 o superior** (Recomendado: 3.12.4)
   - Descargar desde: https://www.python.org/downloads/
   - Durante la instalación, marcar "Add Python to PATH"

2. **Git** (para clonar el repositorio)
   - Descargar desde: https://git-scm.com/downloads

3. **Navegador Web Moderno**
   - Chrome, Firefox, Edge, Safari (cualquier versión reciente)

4. **PowerShell** (incluido en Windows)

---

## 🚀 Instalación desde Cero

### Paso 1: Clonar el Repositorio

```powershell
# Abrir PowerShell y navegar al directorio deseado
cd C:\Users\[TuUsuario]\Desktop

# Clonar el repositorio
git clone https://github.com/srllamadev/Proyecto-Taller-2025.git

# Entrar al directorio del proyecto
cd Proyecto-Taller-2025
```

### Paso 2: Verificar Python

```powershell
# Verificar que Python esté instalado
python --version
# Debería mostrar: Python 3.12.4 (o similar)

# Si no funciona, intentar:
python3 --version
py --version
```

### Paso 3: Crear Entorno Virtual (Recomendado)

```powershell
# Crear entorno virtual
python -m venv .venv

# Activar entorno virtual
.\.venv\Scripts\Activate.ps1

# Si hay problemas de permisos, ejecutar:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Paso 4: Instalar Dependencias

```powershell
# Navegar al directorio backend
cd backend

# Instalar dependencias de Python
pip install -r requirements.txt

# Verificar instalación
pip list
```

---

## ⚙ Configuración del Entorno

### Estructura de Archivos Esperada

```
Proyecto-Taller-2025/
├── 📁 backend/
│   ├── 🐍 app.py              # Servidor Flask principal
│   ├── 🐍 database.py         # Configuración de base de datos
│   ├── 🐍 requirements.txt    # Dependencias Python
│   ├── 🗄 edificio.db         # Base de datos (se crea automáticamente)
│   └── 📁 __pycache__/        # Cache de Python
├── 📁 frontend/
│   ├── 🌐 index.html          # Interfaz principal
│   ├── 🎨 styles.css          # Estilos CSS
│   └── ⚡ main.js             # Lógica JavaScript
├── 🛠 iniciar.ps1             # Script de inicio automático
├── 📋 iniciar.md              # Esta documentación
└── 📖 README.txt              # Documentación básica
```

### Variables de Entorno

El sistema no requiere variables de entorno específicas, pero se puede configurar:

```powershell
# Opcional: Configurar puerto personalizado
$env:FLASK_PORT = "5000"

# Opcional: Configurar modo debug
$env:FLASK_DEBUG = "1"
```

---

## 🎯 Ejecución del Sistema

### Método 1: Script Automático (Recomendado)

```powershell
# Desde el directorio raíz del proyecto
.\iniciar.ps1
```

Si hay problemas de permisos:
```powershell
# Cambiar política de ejecución temporalmente
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
.\iniciar.ps1
```

### Método 2: Manual

```powershell
# 1. Navegar al backend
cd backend

# 2. Activar entorno virtual (si se creó)
.\..\venv\Scripts\Activate.ps1

# 3. Iniciar servidor Flask
python app.py
```

### Método 3: Usando el Entorno Virtual de VS Code

```powershell
# Si VS Code configuró un entorno virtual
c:/Users/[TuUsuario]/Desktop/Proyecto-Taller-2025/.venv/Scripts/python.exe app.py
```

---

## ✅ Verificación del Sistema

### 1. Backend Funcionando

Cuando el servidor esté ejecutándose, deberías ver:

```
🏢 Iniciando servidor de Administración de Edificio...
📍 API disponible en: http://localhost:5000
📊 Endpoints disponibles:
   - GET/POST/PUT/DELETE /api/departamentos
   - GET/POST/PUT/DELETE /api/inquilinos
   - GET/POST/PUT/DELETE /api/empleados
   - GET/POST/PUT/DELETE /api/pagos
   - GET /api/health
 * Running on http://127.0.0.1:5000
```

### 2. Probar la API

```powershell
# Probar endpoint de salud
curl http://localhost:5000/api/health

# O abrir en navegador:
# http://localhost:5000/api/health
```

### 3. Acceder al Frontend

Abrir en el navegador:
```
file:///C:/Users/[TuUsuario]/Desktop/Proyecto-Taller-2025/frontend/index.html
```

O hacer doble clic en `frontend/index.html`

---

## 📂 Estructura del Proyecto

### Backend (`/backend/`)

| Archivo | Descripción |
|---------|-------------|
| `app.py` | Servidor Flask principal con todos los endpoints REST |
| `database.py` | Clase Database para manejo de SQLite |
| `requirements.txt` | Dependencias Python (Flask, Flask-CORS) |
| `edificio.db` | Base de datos SQLite (se crea automáticamente) |

### Frontend (`/frontend/`)

| Archivo | Descripción |
|---------|-------------|
| `index.html` | Interfaz principal con Bootstrap |
| `main.js` | Lógica JavaScript para CRUD operations |
| `styles.css` | Estilos CSS personalizados |

---

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api`

#### Departamentos
- `GET /departamentos` - Listar todos los departamentos
- `POST /departamentos` - Crear nuevo departamento
- `PUT /departamentos/{id}` - Actualizar departamento
- `DELETE /departamentos/{id}` - Eliminar departamento

#### Inquilinos
- `GET /inquilinos` - Listar todos los inquilinos
- `POST /inquilinos` - Crear nuevo inquilino
- `PUT /inquilinos/{id}` - Actualizar inquilino
- `DELETE /inquilinos/{id}` - Eliminar inquilino

#### Empleados
- `GET /empleados` - Listar todos los empleados
- `POST /empleados` - Crear nuevo empleado
- `PUT /empleados/{id}` - Actualizar empleado
- `DELETE /empleados/{id}` - Eliminar empleado

#### Pagos
- `GET /pagos` - Listar todos los pagos
- `POST /pagos` - Crear nuevo pago
- `PUT /pagos/{id}` - Actualizar pago
- `DELETE /pagos/{id}` - Eliminar pago

#### Sistema
- `GET /health` - Verificar estado del servidor

---

## 🔧 Solución de Problemas

### Error: Python no encontrado

```powershell
# Verificar si Python está en PATH
where python
where py

# Si no está, reinstalar Python marcando "Add to PATH"
```

### Error: Scripts deshabilitados en PowerShell

```powershell
# Solución temporal
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# Solución permanente (como administrador)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: Módulo Flask no encontrado

```powershell
# Verificar que las dependencias estén instaladas
pip list | findstr Flask

# Si no está, instalar
pip install Flask Flask-CORS
```

### Error: Puerto 5000 ocupado

```powershell
# Cambiar puerto en app.py, línea final:
# app.run(host='0.0.0.0', port=5001, debug=True)

# O terminar proceso que usa el puerto
netstat -ano | findstr 5000
taskkill /PID [numero_del_proceso] /F
```

### Error: CORS (Frontend no puede conectar con Backend)

- Verificar que Flask-CORS esté instalado
- Verificar que el backend esté ejecutándose en localhost:5000
- Verificar que no haya proxy o firewall bloqueando

### Base de datos no se crea

```powershell
# Verificar permisos de escritura en el directorio
# La base de datos se crea automáticamente en backend/edificio.db
```

---

## 🎉 ¡Sistema Listo!

Una vez que sigas estos pasos, tendrás:

✅ Backend Flask ejecutándose en `http://localhost:5000`  
✅ Frontend accesible desde el navegador  
✅ Base de datos SQLite funcionando  
✅ API REST completamente funcional  
✅ Interfaz web para gestión de edificio  

### Funcionalidades Disponibles:
- 📋 Gestión de Departamentos
- 👥 Gestión de Inquilinos
- 👷 Gestión de Empleados
- 💰 Gestión de Pagos

Para detener el sistema, presiona `Ctrl+C` en la terminal donde está ejecutándose el servidor Flask.

---

*Documentación creada el 11 de septiembre de 2025*  
*Proyecto: Sistema de Administración de Edificio*  
*Tecnologías: Python Flask + HTML/CSS/JavaScript*
