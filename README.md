# Sistema de Administración de Edificio

Un sistema web completo desarrollado en PHP con arquitectura MVC para la administración de edificios multifamiliares inteligentes.

## 🏢 Características Principales

### Gestión de Residentes
- Registro y administración de información de residentes
- Control de unidades habitacionales
- Estados de residencia (activo, inactivo, suspendido)

### Control de Acceso y Videovigilancia
- Sistema de validación con tarjetas RFID
- Registro de accesos en tiempo real
- Simulación de sistema de videovigilancia con 4 cámaras
- Auditoría de accesos y detección de intentos sospechosos

### Gestión Financiera
- Creación y gestión de facturas por conceptos
- Control de pagos (administración, parqueadero, servicios, etc.)
- Reportes financieros
- Historial de pagos por residente

### Monitorización de Consumo Energético
- Registro de consumo por unidad
- Cálculo de huella energética personalizada
- Análisis de patrones de consumo
- Sistema de ajustes dinámicos (simulado)

### Sistema de Comunicación
- Plataforma de anuncios generales
- Mensajería entre administración y residentes
- Notificaciones de eventos
- Sistema de comunicación bidireccional

### Seguridad y Ciberseguridad
- Registro de auditoría completo
- Detección de accesos sospechosos
- Reportes de incidentes
- Configuración de políticas de seguridad

## 🛠️ Tecnologías Utilizadas

- **Backend**: PHP 7.4+
- **Base de Datos**: MySQL 5.7+
- **Arquitectura**: MVC (Modelo-Vista-Controlador)
- **Frontend**: HTML5, CSS3, JavaScript (sin frameworks para testing)

## 📋 Requisitos del Sistema

- PHP 7.4 o superior
- MySQL 5.7 o superior
- Servidor web (Apache/Nginx)
- Extensiones PHP: PDO, PDO_MySQL

## 🚀 Instalación

### 1. Clonar o Descargar el Proyecto
```bash
# Si tienes git instalado
git clone <url-del-repositorio>

# O simplemente descomprime los archivos en tu directorio web
```

### 2. Configurar la Base de Datos

1. Crear la base de datos:
```sql
CREATE DATABASE edificio_admin;
```

2. Importar el esquema:
```bash
mysql -u root -p edificio_admin < database.sql
```

3. Configurar credenciales en `config/database.php`:
```php
private $host = 'localhost';
private $db_name = 'edificio_admin';
private $username = 'root';
private $password = 'tu_password';
```

### 3. Configurar Servidor Web

#### Con XAMPP/WAMP:
1. Colocar los archivos en `htdocs/hhh/`
2. Acceder a: `http://localhost/hhh/public/`

#### Con servidor PHP integrado:
```bash
cd /ruta/del/proyecto/public
php -S localhost:8000
```

## 📁 Estructura del Proyecto

```
hhh/
├── app/
│   ├── controllers/     # Controladores MVC
│   ├── models/         # Modelos de datos
│   └── views/          # Vistas (HTML/PHP)
├── config/
│   └── database.php    # Configuración BD
├── core/
│   ├── Controller.php  # Clase base controlador
│   ├── Model.php      # Clase base modelo
│   └── Router.php     # Sistema de rutas
├── public/
│   └── index.php      # Punto de entrada
├── database.sql       # Esquema de BD
└── README.md
```

## 🎯 Funcionalidades por Módulo

### Dashboard Principal (`/`)
- Resumen general del edificio
- Estadísticas rápidas
- Anuncios recientes
- Acciones rápidas

### Residentes (`/residentes`)
- **Listar**: `/residentes`
- **Crear**: `/residentes/create`
- **Editar**: `/residentes/edit?id=X`
- **Ver detalle**: `/residentes/show?id=X`
- **Eliminar**: `/residentes/delete?id=X`

### Control de Acceso (`/acceso`)
- **Ver registros**: `/acceso`
- **Registrar manual**: `/acceso/registrar`
- **Validar RFID**: `/acceso/validar`

### Pagos (`/pagos`)
- **Gestionar pagos**: `/pagos`
- **Crear factura**: `/pagos/create`
- **Reporte financiero**: `/pagos/reporte`
- **Historial**: `/pagos/historial?residente_id=X`

### Consumo Energético (`/consumo`)
- **Ver consumos**: `/consumo`
- **Registrar**: `/consumo/registrar`
- **Por piso**: `/consumo/por-piso`
- **Huella energética**: `/consumo/huella?unidad=X`
- **Ajustes**: `/consumo/ajustes?unidad=X`

### Comunicación (`/comunicacion`)
- **Ver comunicaciones**: `/comunicacion`
- **Crear anuncio**: `/comunicacion/crear`
- **Mensajes**: `/comunicacion/mensajes?residente_id=X`
- **Solo anuncios**: `/comunicacion/anuncios`

### Seguridad (`/seguridad`)
- **Centro de control**: `/seguridad`
- **Auditoría**: `/seguridad/auditoria`
- **Videovigilancia**: `/seguridad/videovigilancia`
- **Reportar incidente**: `/seguridad/reporte-incidente`
- **Configuración**: `/seguridad/configuracion`

## 🧪 Datos de Prueba

El sistema incluye datos de ejemplo:

### Residentes de Prueba:
- Juan Pérez - Unidad 101 (RFID001)
- María García - Unidad 102 (RFID002)
- Carlos Rodríguez - Unidad 201 (RFID003)
- Ana Martínez - Unidad 202 (RFID004)
- Luis López - Unidad 301 (RFID005)

### Tarjetas RFID para Pruebas:
- `RFID001` a `RFID005`: Autorizadas
- `RFID999`: No autorizada (para testing)

## 🔧 Desarrollo y Testing

### Características de Testing:
- Sin estilos CSS para enfoque en funcionalidad
- Datos de prueba incluidos
- Simulaciones de hardware (RFID, cámaras)
- Formularios funcionales completos
- Validaciones básicas implementadas

### Para Desarrolladores:
1. Todos los modelos extienden la clase base `Model`
2. Todos los controladores extienden `Controller`
3. Sistema de rutas centralizado en `Router`
4. Patrón MVC estricto implementado
5. Base de datos normalizada con foreign keys

## 🐛 Solución de Problemas

### Error de Conexión BD:
- Verificar credenciales en `config/database.php`
- Asegurar que MySQL esté ejecutándose
- Verificar que la base de datos existe

### Error 404:
- Verificar configuración de servidor web
- Revisar que mod_rewrite esté habilitado (Apache)
- Verificar permisos de archivos

### Errores PHP:
- Verificar versión de PHP (7.4+)
- Activar display_errors para desarrollo
- Revisar logs del servidor web

## 📝 Notas Importantes

- **Sin Estilos**: Diseñado para testing de funcionalidad
- **Simulaciones**: Videovigilancia y ajustes IoT son simulados
- **Seguridad**: Implementar autenticación en producción
- **Escalabilidad**: Arquitectura preparada para crecimiento
- **APIs**: Fácil conversión a REST API

## 🔮 Próximas Funcionalidades

- Sistema de autenticación y roles
- API REST para integración móvil
- Dashboard en tiempo real con WebSockets
- Integración con dispositivos IoT reales
- Sistema de notificaciones push
- Módulo de reservas de espacios comunes
- Integración con sistemas de pago online

## 📞 Soporte

Este sistema está diseñado como base para desarrollo. Para implementación en producción, considerar:
- Implementar sistema de autenticación
- Añadir validaciones de seguridad adicionales
- Configurar HTTPS
- Implementar backup automatizado
- Añadir logging avanzado

---

**Desarrollado con arquitectura MVC en PHP para máxima funcionalidad y escalabilidad.**
