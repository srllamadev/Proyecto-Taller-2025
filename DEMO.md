# Guía de Demostración - Sistema de Administración de Edificio

## 🎯 Casos de Uso Principales

### Caso 1: Agregar un Nuevo Departamento
1. Navegue a la sección "Departamentos"
2. Haga clic en "Nuevo Departamento"
3. Complete los datos:
   - Número: 401
   - Piso: 4
   - Estado: Libre
4. Haga clic en "Guardar"

### Caso 2: Registrar un Nuevo Inquilino
1. Vaya a la sección "Inquilinos"
2. Haga clic en "Nuevo Inquilino"
3. Complete los datos:
   - Nombre: Pedro Ramírez
   - Departamento: Seleccione uno disponible
   - Teléfono: 555-9876
4. Guarde los cambios

### Caso 3: Registrar un Pago
1. Acceda a la sección "Pagos"
2. Haga clic en "Nuevo Pago"
3. Complete:
   - Inquilino: Seleccione de la lista
   - Monto: 1500.00
   - Fecha: Seleccione la fecha actual
   - Concepto: Renta mensual marzo
4. Registre el pago

### Caso 4: Administrar Empleados
1. Entre a "Empleados"
2. Agregue un nuevo empleado:
   - Nombre: Ana González
   - Rol: Limpieza
   - Horario: Lunes a Viernes 6:00-14:00

## 🧪 Pruebas Sugeridas

### Validación de Datos
- Intente crear un departamento con número duplicado
- Trate de eliminar un departamento que tiene inquilinos
- Verifique que los campos obligatorios funcionen

### Relaciones entre Entidades
- Asigne varios inquilinos al mismo departamento
- Registre múltiples pagos para el mismo inquilino
- Cambie el estado de un departamento de "Libre" a "Ocupado"

### Funcionalidades CRUD
- **Crear**: Agregue nuevos registros en cada sección
- **Leer**: Observe las listas actualizadas automáticamente
- **Actualizar**: Edite registros existentes
- **Eliminar**: Elimine registros (respetando las restricciones)

## 📊 Datos de Ejemplo Incluidos

El sistema viene pre-cargado con:

### Departamentos
- 101 (Piso 1, Ocupado)
- 102 (Piso 1, Libre)
- 201 (Piso 2, Ocupado)
- 202 (Piso 2, Mantenimiento)
- 301 (Piso 3, Libre)

### Inquilinos
- Ana Martínez (Depto 101, Tel: 555-1234)
- Roberto Silva (Depto 201, Tel: 555-5678)

### Empleados
- Juan Pérez (Conserje, L-V 8:00-16:00)
- María García (Administradora, L-V 9:00-17:00)
- Carlos López (Mantenimiento, L-S 7:00-15:00)

### Pagos
- Ana Martínez: $1,500 (Enero 2025)
- Roberto Silva: $1,200 (Enero 2025)
- Ana Martínez: $1,500 (Febrero 2025)

## 🔧 Funcionalidades Avanzadas

### Filtros y Búsquedas
- Los datos se muestran ordenados automáticamente
- Los estados de departamentos tienen colores distintivos
- Los montos se formatean como moneda

### Validaciones
- No se puede eliminar un departamento con inquilinos
- No se puede eliminar un inquilino con pagos registrados
- Los números de departamento deben ser únicos
- Los campos obligatorios están marcados

### Interfaz Responsiva
- El sistema funciona en dispositivos móviles
- Las tablas se adaptan al tamaño de pantalla
- Los modales son completamente responsivos

## 🚀 Escenarios de Demostración

### Escenario A: Nuevo Inquilino se Muda
1. Cree un nuevo inquilino
2. Asígnele un departamento "Libre"
3. Cambie el estado del departamento a "Ocupado"
4. Registre el primer pago del inquilino

### Escenario B: Mantenimiento de Departamento
1. Cambie un departamento a estado "Mantenimiento"
2. Si tiene inquilino, reasígnelo temporalmente
3. Registre los costos de mantenimiento como pagos negativos (gastos)

### Escenario C: Gestión de Personal
1. Agregue un nuevo empleado de seguridad nocturna
2. Modifique el horario de un empleado existente
3. Elimine un empleado que ya no trabaja

## 📱 Pruebas de Usabilidad

### Navegación
- Pruebe cambiar entre secciones usando la barra superior
- Verifique que los datos se cargan automáticamente
- Confirme que los mensajes de éxito/error aparecen

### Formularios
- Pruebe enviar formularios vacíos (validación)
- Verifique que los selectores se poblan correctamente
- Confirme que la edición precarga los datos

### Responsividad
- Reduzca el tamaño de la ventana del navegador
- Verifique que las tablas tengan scroll horizontal
- Confirme que los botones se adaptan en móviles

## 🎨 Características Visuales

### Iconografía
- 🏢 Edificio para la marca
- 🚪 Departamentos
- 👥 Inquilinos
- 👔 Empleados
- 💰 Pagos

### Colores de Estado
- 🟢 Verde: Ocupado
- 🔵 Azul: Libre
- 🟡 Amarillo: Mantenimiento

### Animaciones
- Transiciones suaves entre secciones
- Efectos hover en botones y filas
- Aparición gradual de alertas

## 🔄 Flujo de Trabajo Típico

1. **Matutino**: Revisar pagos pendientes y nuevos inquilinos
2. **Gestión**: Actualizar estados de departamentos
3. **Administrativo**: Registrar pagos recibidos
4. **Mantenimiento**: Actualizar empleados y horarios
5. **Reportes**: Revisar totales y estadísticas

## 💡 Tips para la Demostración

1. **Comience con la vista de departamentos** - es la más visual
2. **Muestre las relaciones** entre inquilinos y departamentos
3. **Demuestre las validaciones** intentando operaciones inválidas
4. **Resalte la responsividad** cambiando el tamaño de ventana
5. **Termine con los pagos** - es la funcionalidad más compleja

## 🎉 Mensaje Final

Este sistema demuestra un CRUD completo con:
- ✅ Backend robusto con API REST
- ✅ Frontend moderno y responsivo
- ✅ Base de datos relacional
- ✅ Validaciones y manejo de errores
- ✅ Interfaz intuitiva
- ✅ Arquitectura escalable
