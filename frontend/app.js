// ================================
// APP DASHBOARD FUNCTIONS
// ================================

// Configuración de la API
const API_BASE_URL = 'http://localhost:5000/api';

// Variables globales
let currentEditId = null;
let currentEntity = null;
let currentUser = null;

// Inicialización del dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Inicializando dashboard...');
    
    // Verificar autenticación
    if (!checkAuthentication()) {
        console.log('❌ No hay sesión activa, redirigiendo a login...');
        window.location.href = 'login.html';
        return;
    }
    
    // Cargar datos del dashboard
    initializeDashboard();
});

// Verificar autenticación
function checkAuthentication() {
    const savedAuth = localStorage.getItem('edificio_auth');
    if (!savedAuth) {
        return false;
    }
    
    try {
        const authData = JSON.parse(savedAuth);
        // Verificar si la sesión no ha expirado (24 horas)
        const now = new Date().getTime();
        if (now - authData.timestamp < 24 * 60 * 60 * 1000) {
            currentUser = authData;
            
            // Mostrar usuario en la navegación
            const currentUserElement = document.getElementById('currentUser');
            if (currentUserElement) {
                currentUserElement.textContent = authData.username;
            }
            
            console.log('✅ Usuario autenticado:', authData.username);
            return true;
        } else {
            localStorage.removeItem('edificio_auth');
            return false;
        }
    } catch (error) {
        console.error('❌ Error al verificar autenticación:', error);
        localStorage.removeItem('edificio_auth');
        return false;
    }
}

// Inicializar dashboard
function initializeDashboard() {
    console.log('🚀 Cargando datos del dashboard...');
    
    try {
        // Cargar todos los datos
        loadDepartamentos();
        loadInquilinos();
        loadEmpleados();
        loadPagos();
        
        // Establecer fecha actual en el campo de fecha de pago
        const pagoFechaField = document.getElementById('pagoFecha');
        if (pagoFechaField) {
            const today = new Date().toISOString().split('T')[0];
            pagoFechaField.value = today;
        }
        
        console.log('✅ Dashboard inicializado correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar dashboard:', error);
        showAlert('Error al cargar los datos del sistema', 'danger');
    }
}

// Función de logout
function logout() {
    console.log('👋 Cerrando sesión...');
    localStorage.removeItem('edificio_auth');
    window.location.href = 'index.html';
}

// ================================
// UTILIDADES
// ================================

function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alertDiv);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function showSection(sectionName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.add('d-none'));
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.remove('d-none');
    }
    
    // Actualizar navegación
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Buscar y activar el enlace correspondiente
    const activeLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// ================================
// DEPARTAMENTOS
// ================================

async function loadDepartamentos() {
    try {
        const response = await fetch(`${API_BASE_URL}/departamentos`);
        const departamentos = await response.json();
        
        const tbody = document.getElementById('departamentos-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        departamentos.forEach(depto => {
            const row = document.createElement('tr');
            
            // Definir color del estado
            let estadoClass = '';
            switch (depto.estado) {
                case 'Ocupado':
                    estadoClass = 'badge bg-success';
                    break;
                case 'Libre':
                    estadoClass = 'badge bg-primary';
                    break;
                case 'Mantenimiento':
                    estadoClass = 'badge bg-warning';
                    break;
                default:
                    estadoClass = 'badge bg-secondary';
            }
            
            row.innerHTML = `
                <td>${depto.id}</td>
                <td><strong>${depto.numero}</strong></td>
                <td>Piso ${depto.piso}</td>
                <td><span class="${estadoClass}">${depto.estado}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editDepartamento(${depto.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteDepartamento(${depto.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        console.log('✅ Departamentos cargados:', departamentos.length);
    } catch (error) {
        console.error('❌ Error al cargar departamentos:', error);
        showAlert('Error al cargar departamentos', 'danger');
    }
}

function showDepartamentoForm(id = null) {
    currentEditId = id;
    currentEntity = 'departamento';
    
    const modal = new bootstrap.Modal(document.getElementById('departamentoModal'));
    const title = document.getElementById('departamentoModalTitle');
    
    if (id) {
        title.textContent = 'Editar Departamento';
        loadDepartamentoData(id);
    } else {
        title.textContent = 'Nuevo Departamento';
        document.getElementById('departamentoForm').reset();
    }
    
    modal.show();
}

async function loadDepartamentoData(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/departamentos/${id}`);
        const depto = await response.json();
        
        document.getElementById('departamentoNumero').value = depto.numero;
        document.getElementById('departamentoPiso').value = depto.piso;
        document.getElementById('departamentoEstado').value = depto.estado;
    } catch (error) {
        console.error('❌ Error al cargar departamento:', error);
        showAlert('Error al cargar datos del departamento', 'danger');
    }
}

async function saveDepartamento() {
    const numero = document.getElementById('departamentoNumero').value;
    const piso = document.getElementById('departamentoPiso').value;
    const estado = document.getElementById('departamentoEstado').value;
    
    if (!numero || !piso || !estado) {
        showAlert('Por favor complete todos los campos', 'warning');
        return;
    }
    
    const data = { numero, piso: parseInt(piso), estado };
    
    try {
        const url = currentEditId ? 
            `${API_BASE_URL}/departamentos/${currentEditId}` : 
            `${API_BASE_URL}/departamentos`;
        
        const method = currentEditId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const action = currentEditId ? 'actualizado' : 'creado';
            showAlert(`Departamento ${action} exitosamente`, 'success');
            
            bootstrap.Modal.getInstance(document.getElementById('departamentoModal')).hide();
            loadDepartamentos();
            loadInquilinosDepartamentos(); // Actualizar select de inquilinos
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('❌ Error al guardar departamento:', error);
        showAlert('Error al guardar departamento', 'danger');
    }
}

function editDepartamento(id) {
    showDepartamentoForm(id);
}

async function deleteDepartamento(id) {
    if (!confirm('¿Está seguro de que desea eliminar este departamento?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/departamentos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showAlert('Departamento eliminado exitosamente', 'success');
            loadDepartamentos();
            loadInquilinosDepartamentos(); // Actualizar select de inquilinos
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('❌ Error al eliminar departamento:', error);
        showAlert('Error al eliminar departamento', 'danger');
    }
}

// ================================
// INQUILINOS
// ================================

async function loadInquilinos() {
    try {
        const response = await fetch(`${API_BASE_URL}/inquilinos`);
        const inquilinos = await response.json();
        
        const tbody = document.getElementById('inquilinos-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        inquilinos.forEach(inquilino => {
            const row = document.createElement('tr');
            const departamento = inquilino.departamento_numero || 'Sin asignar';
            
            row.innerHTML = `
                <td>${inquilino.id}</td>
                <td><strong>${inquilino.nombre}</strong></td>
                <td>${departamento}</td>
                <td>${inquilino.telefono || 'No especificado'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editInquilino(${inquilino.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteInquilino(${inquilino.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        console.log('✅ Inquilinos cargados:', inquilinos.length);
    } catch (error) {
        console.error('❌ Error al cargar inquilinos:', error);
        showAlert('Error al cargar inquilinos', 'danger');
    }
}

async function loadInquilinosDepartamentos() {
    try {
        const response = await fetch(`${API_BASE_URL}/departamentos`);
        const departamentos = await response.json();
        
        const select = document.getElementById('inquilinoDepartamento');
        if (!select) return;
        
        // Limpiar opciones existentes
        select.innerHTML = '<option value="">Sin departamento asignado</option>';
        
        // Agregar departamentos disponibles
        departamentos.forEach(depto => {
            const option = document.createElement('option');
            option.value = depto.id;
            option.textContent = `${depto.numero} (Piso ${depto.piso}) - ${depto.estado}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('❌ Error al cargar departamentos para inquilinos:', error);
    }
}

function showInquilinoForm(id = null) {
    currentEditId = id;
    currentEntity = 'inquilino';
    
    loadInquilinosDepartamentos();
    
    const modal = new bootstrap.Modal(document.getElementById('inquilinoModal'));
    const title = document.getElementById('inquilinoModalTitle');
    
    if (id) {
        title.textContent = 'Editar Inquilino';
        loadInquilinoData(id);
    } else {
        title.textContent = 'Nuevo Inquilino';
        document.getElementById('inquilinoForm').reset();
    }
    
    modal.show();
}

async function loadInquilinoData(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/inquilinos/${id}`);
        const inquilino = await response.json();
        
        document.getElementById('inquilinoNombre').value = inquilino.nombre;
        document.getElementById('inquilinoDepartamento').value = inquilino.departamento_id || '';
        document.getElementById('inquilinoTelefono').value = inquilino.telefono || '';
    } catch (error) {
        console.error('❌ Error al cargar inquilino:', error);
        showAlert('Error al cargar datos del inquilino', 'danger');
    }
}

async function saveInquilino() {
    const nombre = document.getElementById('inquilinoNombre').value;
    const departamento_id = document.getElementById('inquilinoDepartamento').value || null;
    const telefono = document.getElementById('inquilinoTelefono').value;
    
    if (!nombre) {
        showAlert('El nombre es requerido', 'warning');
        return;
    }
    
    const data = { nombre, departamento_id, telefono };
    
    try {
        const url = currentEditId ? 
            `${API_BASE_URL}/inquilinos/${currentEditId}` : 
            `${API_BASE_URL}/inquilinos`;
        
        const method = currentEditId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const action = currentEditId ? 'actualizado' : 'creado';
            showAlert(`Inquilino ${action} exitosamente`, 'success');
            
            bootstrap.Modal.getInstance(document.getElementById('inquilinoModal')).hide();
            loadInquilinos();
            loadPagosInquilinos(); // Actualizar select de pagos
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('❌ Error al guardar inquilino:', error);
        showAlert('Error al guardar inquilino', 'danger');
    }
}

function editInquilino(id) {
    showInquilinoForm(id);
}

async function deleteInquilino(id) {
    if (!confirm('¿Está seguro de que desea eliminar este inquilino?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/inquilinos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showAlert('Inquilino eliminado exitosamente', 'success');
            loadInquilinos();
            loadPagosInquilinos(); // Actualizar select de pagos
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('❌ Error al eliminar inquilino:', error);
        showAlert('Error al eliminar inquilino', 'danger');
    }
}

// ================================
// EMPLEADOS
// ================================

async function loadEmpleados() {
    try {
        const response = await fetch(`${API_BASE_URL}/empleados`);
        const empleados = await response.json();
        
        const tbody = document.getElementById('empleados-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        empleados.forEach(empleado => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${empleado.id}</td>
                <td><strong>${empleado.nombre}</strong></td>
                <td><span class="badge bg-info">${empleado.rol}</span></td>
                <td>${empleado.horario}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editEmpleado(${empleado.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteEmpleado(${empleado.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        console.log('✅ Empleados cargados:', empleados.length);
    } catch (error) {
        console.error('❌ Error al cargar empleados:', error);
        showAlert('Error al cargar empleados', 'danger');
    }
}

function showEmpleadoForm(id = null) {
    currentEditId = id;
    currentEntity = 'empleado';
    
    const modal = new bootstrap.Modal(document.getElementById('empleadoModal'));
    const title = document.getElementById('empleadoModalTitle');
    
    if (id) {
        title.textContent = 'Editar Empleado';
        loadEmpleadoData(id);
    } else {
        title.textContent = 'Nuevo Empleado';
        document.getElementById('empleadoForm').reset();
    }
    
    modal.show();
}

async function loadEmpleadoData(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/empleados/${id}`);
        const empleado = await response.json();
        
        document.getElementById('empleadoNombre').value = empleado.nombre;
        document.getElementById('empleadoRol').value = empleado.rol;
        document.getElementById('empleadoHorario').value = empleado.horario;
    } catch (error) {
        console.error('❌ Error al cargar empleado:', error);
        showAlert('Error al cargar datos del empleado', 'danger');
    }
}

async function saveEmpleado() {
    const nombre = document.getElementById('empleadoNombre').value;
    const rol = document.getElementById('empleadoRol').value;
    const horario = document.getElementById('empleadoHorario').value;
    
    if (!nombre || !rol || !horario) {
        showAlert('Por favor complete todos los campos', 'warning');
        return;
    }
    
    const data = { nombre, rol, horario };
    
    try {
        const url = currentEditId ? 
            `${API_BASE_URL}/empleados/${currentEditId}` : 
            `${API_BASE_URL}/empleados`;
        
        const method = currentEditId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const action = currentEditId ? 'actualizado' : 'creado';
            showAlert(`Empleado ${action} exitosamente`, 'success');
            
            bootstrap.Modal.getInstance(document.getElementById('empleadoModal')).hide();
            loadEmpleados();
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('❌ Error al guardar empleado:', error);
        showAlert('Error al guardar empleado', 'danger');
    }
}

function editEmpleado(id) {
    showEmpleadoForm(id);
}

async function deleteEmpleado(id) {
    if (!confirm('¿Está seguro de que desea eliminar este empleado?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/empleados/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showAlert('Empleado eliminado exitosamente', 'success');
            loadEmpleados();
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('❌ Error al eliminar empleado:', error);
        showAlert('Error al eliminar empleado', 'danger');
    }
}

// ================================
// PAGOS
// ================================

async function loadPagos() {
    try {
        const response = await fetch(`${API_BASE_URL}/pagos`);
        const pagos = await response.json();
        
        const tbody = document.getElementById('pagos-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        pagos.forEach(pago => {
            const row = document.createElement('tr');
            const fecha = new Date(pago.fecha).toLocaleDateString();
            const monto = new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'USD'
            }).format(pago.monto);
            
            row.innerHTML = `
                <td>${pago.id}</td>
                <td><strong>${pago.inquilino_nombre || 'Sin asignar'}</strong></td>
                <td>${pago.departamento_numero || 'N/A'}</td>
                <td><span class="text-success">${monto}</span></td>
                <td>${fecha}</td>
                <td>${pago.concepto || 'Sin concepto'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editPago(${pago.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePago(${pago.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        console.log('✅ Pagos cargados:', pagos.length);
    } catch (error) {
        console.error('❌ Error al cargar pagos:', error);
        showAlert('Error al cargar pagos', 'danger');
    }
}

async function loadPagosInquilinos() {
    try {
        const response = await fetch(`${API_BASE_URL}/inquilinos`);
        const inquilinos = await response.json();
        
        const select = document.getElementById('pagoInquilino');
        if (!select) return;
        
        // Limpiar opciones existentes
        select.innerHTML = '<option value="">Seleccionar inquilino</option>';
        
        // Agregar inquilinos
        inquilinos.forEach(inquilino => {
            const option = document.createElement('option');
            option.value = inquilino.id;
            const departamento = inquilino.departamento_numero ? ` (Depto: ${inquilino.departamento_numero})` : '';
            option.textContent = `${inquilino.nombre}${departamento}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('❌ Error al cargar inquilinos para pagos:', error);
    }
}

function showPagoForm(id = null) {
    currentEditId = id;
    currentEntity = 'pago';
    
    loadPagosInquilinos();
    
    const modal = new bootstrap.Modal(document.getElementById('pagoModal'));
    const title = document.getElementById('pagoModalTitle');
    
    if (id) {
        title.textContent = 'Editar Pago';
        loadPagoData(id);
    } else {
        title.textContent = 'Nuevo Pago';
        document.getElementById('pagoForm').reset();
        // Establecer fecha actual
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('pagoFecha').value = today;
    }
    
    modal.show();
}

async function loadPagoData(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/pagos/${id}`);
        const pago = await response.json();
        
        document.getElementById('pagoInquilino').value = pago.inquilino_id;
        document.getElementById('pagoMonto').value = pago.monto;
        document.getElementById('pagoFecha').value = pago.fecha.split('T')[0];
        document.getElementById('pagoConcepto').value = pago.concepto || '';
    } catch (error) {
        console.error('❌ Error al cargar pago:', error);
        showAlert('Error al cargar datos del pago', 'danger');
    }
}

async function savePago() {
    const inquilino_id = document.getElementById('pagoInquilino').value;
    const monto = document.getElementById('pagoMonto').value;
    const fecha = document.getElementById('pagoFecha').value;
    const concepto = document.getElementById('pagoConcepto').value;
    
    if (!inquilino_id || !monto || !fecha) {
        showAlert('Por favor complete los campos requeridos', 'warning');
        return;
    }
    
    const data = { 
        inquilino_id: parseInt(inquilino_id), 
        monto: parseFloat(monto), 
        fecha, 
        concepto 
    };
    
    try {
        const url = currentEditId ? 
            `${API_BASE_URL}/pagos/${currentEditId}` : 
            `${API_BASE_URL}/pagos`;
        
        const method = currentEditId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const action = currentEditId ? 'actualizado' : 'creado';
            showAlert(`Pago ${action} exitosamente`, 'success');
            
            bootstrap.Modal.getInstance(document.getElementById('pagoModal')).hide();
            loadPagos();
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('❌ Error al guardar pago:', error);
        showAlert('Error al guardar pago', 'danger');
    }
}

function editPago(id) {
    showPagoForm(id);
}

async function deletePago(id) {
    if (!confirm('¿Está seguro de que desea eliminar este pago?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/pagos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showAlert('Pago eliminado exitosamente', 'success');
            loadPagos();
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('❌ Error al eliminar pago:', error);
        showAlert('Error al eliminar pago', 'danger');
    }
}