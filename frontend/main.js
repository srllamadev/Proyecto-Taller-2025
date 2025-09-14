// Configuración de la API
const API_BASE_URL = 'http://localhost:5000/api';

// Variables globales
let currentEditId = null;
let currentEntity = null;
let isAuthenticated = false;

// ================================
// AUTENTICACIÓN Y LANDING PAGE
// ================================

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando aplicación...');
    
    // Verificar dependencias
    if (typeof bootstrap === 'undefined') {
        console.error('❌ Bootstrap no está cargado');
    } else {
        console.log('✅ Bootstrap cargado correctamente');
    }
    
    // Verificar elementos críticos
    const landingPage = document.getElementById('landingPage');
    const dashboardApp = document.getElementById('dashboardApp');
    const loginModal = document.getElementById('loginModal');
    
    if (!landingPage) console.error('❌ Landing page no encontrado');
    if (!dashboardApp) console.error('❌ Dashboard app no encontrado');
    if (!loginModal) console.error('❌ Login modal no encontrado');
    
    console.log('🔍 Elementos encontrados:', {
        landingPage: !!landingPage,
        dashboardApp: !!dashboardApp,
        loginModal: !!loginModal
    });
    
    // Verificar si ya hay una sesión activa
    const savedAuth = localStorage.getItem('edificio_auth');
    if (savedAuth) {
        try {
            const authData = JSON.parse(savedAuth);
            // Verificar si la sesión no ha expirado (24 horas)
            const now = new Date().getTime();
            if (now - authData.timestamp < 24 * 60 * 60 * 1000) {
                console.log('✅ Sesión activa encontrada, cargando dashboard...');
                isAuthenticated = true;
                showDashboard();
                return;
            } else {
                console.log('⏰ Sesión expirada, eliminando...');
                localStorage.removeItem('edificio_auth');
            }
        } catch (error) {
            console.error('❌ Error al parsear sesión guardada:', error);
            localStorage.removeItem('edificio_auth');
        }
    }
    
    // Mostrar landing page
    console.log('🏠 Mostrando landing page...');
    showLandingPage();
});

function showLandingPage() {
    console.log('🏠 Mostrando landing page...');
    const landingPage = document.getElementById('landingPage');
    const dashboardApp = document.getElementById('dashboardApp');
    
    if (landingPage && dashboardApp) {
        landingPage.style.display = 'block';
        dashboardApp.classList.remove('active');
        console.log('✅ Landing page mostrado');
    } else {
        console.error('❌ Elementos no encontrados para mostrar landing page');
    }
}

function showDashboard() {
    console.log('📊 Mostrando dashboard...');
    const landingPage = document.getElementById('landingPage');
    const dashboardApp = document.getElementById('dashboardApp');
    
    if (landingPage && dashboardApp) {
        landingPage.style.display = 'none';
        dashboardApp.classList.add('active');
        
        console.log('✅ Dashboard mostrado, cargando datos...');
        
        // Cargar datos solo cuando se accede al dashboard
        try {
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
            
            console.log('✅ Datos cargados exitosamente');
        } catch (error) {
            console.error('❌ Error al cargar datos del dashboard:', error);
        }
    } else {
        console.error('❌ Elementos no encontrados para mostrar dashboard');
    }
}

function showLoginModal() {
    try {
        console.log('🔓 Intentando mostrar modal de login...');
        
        // Verificar si Bootstrap está cargado
        if (typeof bootstrap === 'undefined') {
            console.error('❌ Bootstrap no está cargado, usando fallback');
            showLoginModalFallback();
            return;
        }
        
        const modalElement = document.getElementById('loginModal');
        if (!modalElement) {
            console.error('❌ Modal element no encontrado');
            alert('Error: Modal no encontrado');
            return;
        }
        
        console.log('✅ Creando instancia de modal Bootstrap...');
        const loginModal = new bootstrap.Modal(modalElement, {
            backdrop: 'static',
            keyboard: false
        });
        
        loginModal.show();
        console.log('✅ Modal mostrado exitosamente');
        
        // Limpiar formulario
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
        }
        
        const loginError = document.getElementById('loginError');
        if (loginError) {
            loginError.classList.add('d-none');
        }
        
        // Focus en el campo username
        setTimeout(() => {
            const usernameField = document.getElementById('username');
            if (usernameField) {
                usernameField.focus();
            }
        }, 300);
        
    } catch (error) {
        console.error('❌ Error al mostrar modal:', error);
        console.log('🔄 Intentando con fallback...');
        showLoginModalFallback();
    }
}

// Función fallback para mostrar modal sin Bootstrap
function showLoginModalFallback() {
    console.log('🔄 Usando modal fallback...');
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
        modalElement.style.display = 'block';
        modalElement.classList.add('show');
        document.body.classList.add('modal-open');
        
        // Crear backdrop manualmente
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        backdrop.onclick = hideLoginModal;
        document.body.appendChild(backdrop);
        
        // Limpiar formulario
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
        }
        
        const loginError = document.getElementById('loginError');
        if (loginError) {
            loginError.classList.add('d-none');
        }
        
        setTimeout(() => {
            const usernameField = document.getElementById('username');
            if (usernameField) {
                usernameField.focus();
            }
        }, 100);
    }
}

function hideLoginModal() {
    try {
        console.log('🔒 Ocultando modal de login...');
        
        const modalElement = document.getElementById('loginModal');
        if (!modalElement) {
            console.error('❌ Modal element no encontrado');
            return;
        }
        
        // Intentar con Bootstrap primero
        if (typeof bootstrap !== 'undefined') {
            const loginModal = bootstrap.Modal.getInstance(modalElement);
            if (loginModal) {
                loginModal.hide();
                console.log('✅ Modal ocultado con Bootstrap');
                return;
            }
        }
        
        // Fallback manual
        console.log('🔄 Ocultando modal manualmente...');
        hideLoginModalFallback();
        
    } catch (error) {
        console.error('❌ Error al ocultar modal:', error);
        hideLoginModalFallback();
    }
}

// Función fallback para ocultar modal
function hideLoginModalFallback() {
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
        modalElement.style.display = 'none';
        modalElement.classList.remove('show');
        document.body.classList.remove('modal-open');
        
        // Remover backdrop manual
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        
        console.log('✅ Modal ocultado manualmente');
    }
}

async function performLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showLoginError('Por favor complete todos los campos');
        return;
    }
    
    // Mostrar loading
    const loginButton = document.querySelector('#loginModal .btn-primary');
    const loginButtonText = document.getElementById('loginButtonText');
    const loginSpinner = document.getElementById('loginSpinner');
    
    loginButton.disabled = true;
    loginButtonText.style.display = 'none';
    loginSpinner.classList.remove('d-none');
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Guardar sesión
            const authData = {
                username: username,
                timestamp: new Date().getTime()
            };
            localStorage.setItem('edificio_auth', JSON.stringify(authData));
            
            isAuthenticated = true;
            hideLoginModal();
            showDashboard();
            showAlert(`¡Bienvenido, ${username}!`, 'success');
        } else {
            showLoginError(data.message || 'Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error en login:', error);
        showLoginError('Error de conexión. Intente nuevamente.');
    } finally {
        // Ocultar loading
        loginButton.disabled = false;
        loginButtonText.style.display = 'inline';
        loginSpinner.classList.add('d-none');
    }
}

function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    const errorMessage = document.getElementById('loginErrorMessage');
    
    errorMessage.textContent = message;
    errorDiv.classList.remove('d-none');
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        errorDiv.classList.add('d-none');
    }, 5000);
}

function logout() {
    localStorage.removeItem('edificio_auth');
    isAuthenticated = false;
    showLandingPage();
    showAlert('Sesión cerrada correctamente', 'info');
}

// Manejar Enter en el formulario de login
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && document.getElementById('loginModal').style.display !== 'none') {
        performLogin();
    }
});

// ================================
// UTILIDADES
// ================================

function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
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
        alertDiv.remove();
    }, 5000);
}

function showSection(sectionName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.add('d-none'));
    
    // Mostrar la sección seleccionada
    document.getElementById(sectionName + '-section').classList.remove('d-none');
    
    // Actualizar navegación
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
    
    // Cargar datos de la sección
    switch(sectionName) {
        case 'departamentos':
            loadDepartamentos();
            break;
        case 'inquilinos':
            loadInquilinos();
            break;
        case 'empleados':
            loadEmpleados();
            break;
        case 'pagos':
            loadPagos();
            break;
    }
}

async function apiRequest(url, method = 'GET', data = null) {
    try {
        const config = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (data) {
            config.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE_URL}${url}`, config);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Error en la operación');
        }
        
        return result;
    } catch (error) {
        console.error('Error en API:', error);
        throw error;
    }
}

// ================================
// DEPARTAMENTOS
// ================================

async function loadDepartamentos() {
    try {
        const departamentos = await apiRequest('/departamentos');
        const tbody = document.getElementById('departamentos-table-body');
        tbody.innerHTML = '';
        
        departamentos.forEach(dept => {
            const estadoClass = dept.estado === 'Ocupado' ? 'success' : 
                              dept.estado === 'Libre' ? 'primary' : 'warning';
            
            const estadoCssClass = dept.estado === 'Ocupado' ? 'estado-ocupado' : 
                                  dept.estado === 'Libre' ? 'estado-libre' : 'estado-mantenimiento';
            
            const row = `
                <tr>
                    <td><strong>${dept.id}</strong></td>
                    <td><strong>${dept.numero}</strong></td>
                    <td><span class="badge bg-secondary">${dept.piso}°</span></td>
                    <td><span class="badge bg-${estadoClass} ${estadoCssClass}">${dept.estado}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="editDepartamento(${dept.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger ms-1" onclick="deleteDepartamento(${dept.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        showAlert('Error al cargar departamentos: ' + error.message, 'danger');
    }
}

function showDepartamentoForm(id = null) {
    currentEditId = id;
    const modal = new bootstrap.Modal(document.getElementById('departamentoModal'));
    const title = document.getElementById('departamentoModalTitle');
    const form = document.getElementById('departamentoForm');
    
    form.reset();
    
    if (id) {
        title.textContent = 'Editar Departamento';
        // Cargar datos del departamento para editar
        loadDepartamentoData(id);
    } else {
        title.textContent = 'Nuevo Departamento';
    }
    
    modal.show();
}

async function loadDepartamentoData(id) {
    try {
        const departamentos = await apiRequest('/departamentos');
        const departamento = departamentos.find(d => d.id === id);
        
        if (departamento) {
            document.getElementById('departamentoNumero').value = departamento.numero;
            document.getElementById('departamentoPiso').value = departamento.piso;
            document.getElementById('departamentoEstado').value = departamento.estado;
        }
    } catch (error) {
        showAlert('Error al cargar datos del departamento: ' + error.message, 'danger');
    }
}

async function saveDepartamento() {
    try {
        const data = {
            numero: document.getElementById('departamentoNumero').value,
            piso: parseInt(document.getElementById('departamentoPiso').value),
            estado: document.getElementById('departamentoEstado').value
        };
        
        if (currentEditId) {
            await apiRequest(`/departamentos/${currentEditId}`, 'PUT', data);
            showAlert('Departamento actualizado exitosamente');
        } else {
            await apiRequest('/departamentos', 'POST', data);
            showAlert('Departamento creado exitosamente');
        }
        
        bootstrap.Modal.getInstance(document.getElementById('departamentoModal')).hide();
        loadDepartamentos();
        currentEditId = null;
    } catch (error) {
        showAlert('Error al guardar departamento: ' + error.message, 'danger');
    }
}

function editDepartamento(id) {
    showDepartamentoForm(id);
}

async function deleteDepartamento(id) {
    if (confirm('¿Está seguro de que desea eliminar este departamento?')) {
        try {
            await apiRequest(`/departamentos/${id}`, 'DELETE');
            showAlert('Departamento eliminado exitosamente');
            loadDepartamentos();
        } catch (error) {
            showAlert('Error al eliminar departamento: ' + error.message, 'danger');
        }
    }
}

// ================================
// INQUILINOS
// ================================

async function loadInquilinos() {
    try {
        const inquilinos = await apiRequest('/inquilinos');
        const tbody = document.getElementById('inquilinos-table-body');
        tbody.innerHTML = '';
        
        inquilinos.forEach(inquilino => {
            const departamento = inquilino.departamento_numero ? 
                `<span class="badge bg-info">${inquilino.departamento_numero}</span> <small class="text-muted">Piso ${inquilino.piso}</small>` : 
                '<span class="badge bg-secondary">Sin asignar</span>';
            
            const row = `
                <tr>
                    <td><strong>${inquilino.id}</strong></td>
                    <td><i class="fas fa-user me-2 text-primary"></i>${inquilino.nombre}</td>
                    <td>${departamento}</td>
                    <td><i class="fas fa-phone me-2 text-success"></i>${inquilino.telefono || '<em class="text-muted">N/A</em>'}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="editInquilino(${inquilino.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger ms-1" onclick="deleteInquilino(${inquilino.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        showAlert('Error al cargar inquilinos: ' + error.message, 'danger');
    }
}

async function loadDepartamentosSelect() {
    try {
        const departamentos = await apiRequest('/departamentos');
        const select = document.getElementById('inquilinoDepartamento');
        select.innerHTML = '<option value="">Sin departamento asignado</option>';
        
        departamentos.forEach(dept => {
            const option = `<option value="${dept.id}">${dept.numero} - Piso ${dept.piso} (${dept.estado})</option>`;
            select.innerHTML += option;
        });
    } catch (error) {
        console.error('Error al cargar departamentos:', error);
    }
}

function showInquilinoForm(id = null) {
    currentEditId = id;
    const modal = new bootstrap.Modal(document.getElementById('inquilinoModal'));
    const title = document.getElementById('inquilinoModalTitle');
    const form = document.getElementById('inquilinoForm');
    
    form.reset();
    loadDepartamentosSelect();
    
    if (id) {
        title.textContent = 'Editar Inquilino';
        loadInquilinoData(id);
    } else {
        title.textContent = 'Nuevo Inquilino';
    }
    
    modal.show();
}

async function loadInquilinoData(id) {
    try {
        const inquilinos = await apiRequest('/inquilinos');
        const inquilino = inquilinos.find(i => i.id === id);
        
        if (inquilino) {
            document.getElementById('inquilinoNombre').value = inquilino.nombre;
            document.getElementById('inquilinoDepartamento').value = inquilino.departamento_id || '';
            document.getElementById('inquilinoTelefono').value = inquilino.telefono || '';
        }
    } catch (error) {
        showAlert('Error al cargar datos del inquilino: ' + error.message, 'danger');
    }
}

async function saveInquilino() {
    try {
        const departamentoId = document.getElementById('inquilinoDepartamento').value;
        const data = {
            nombre: document.getElementById('inquilinoNombre').value,
            departamento_id: departamentoId ? parseInt(departamentoId) : null,
            telefono: document.getElementById('inquilinoTelefono').value
        };
        
        if (currentEditId) {
            await apiRequest(`/inquilinos/${currentEditId}`, 'PUT', data);
            showAlert('Inquilino actualizado exitosamente');
        } else {
            await apiRequest('/inquilinos', 'POST', data);
            showAlert('Inquilino creado exitosamente');
        }
        
        bootstrap.Modal.getInstance(document.getElementById('inquilinoModal')).hide();
        loadInquilinos();
        currentEditId = null;
    } catch (error) {
        showAlert('Error al guardar inquilino: ' + error.message, 'danger');
    }
}

function editInquilino(id) {
    showInquilinoForm(id);
}

async function deleteInquilino(id) {
    if (confirm('¿Está seguro de que desea eliminar este inquilino?')) {
        try {
            await apiRequest(`/inquilinos/${id}`, 'DELETE');
            showAlert('Inquilino eliminado exitosamente');
            loadInquilinos();
        } catch (error) {
            showAlert('Error al eliminar inquilino: ' + error.message, 'danger');
        }
    }
}

// ================================
// EMPLEADOS
// ================================

async function loadEmpleados() {
    try {
        const empleados = await apiRequest('/empleados');
        const tbody = document.getElementById('empleados-table-body');
        tbody.innerHTML = '';
        
        empleados.forEach(empleado => {
            const rolIcon = empleado.rol.toLowerCase().includes('conserje') ? 'fas fa-tools' :
                           empleado.rol.toLowerCase().includes('admin') ? 'fas fa-user-tie' :
                           empleado.rol.toLowerCase().includes('mantenimiento') ? 'fas fa-wrench' :
                           empleado.rol.toLowerCase().includes('limpieza') ? 'fas fa-broom' :
                           'fas fa-user';
            
            const row = `
                <tr>
                    <td><strong>${empleado.id}</strong></td>
                    <td><i class="${rolIcon} me-2 text-primary"></i>${empleado.nombre}</td>
                    <td><span class="badge bg-bronze">${empleado.rol}</span></td>
                    <td><i class="fas fa-clock me-2 text-info"></i><small>${empleado.horario}</small></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="editEmpleado(${empleado.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger ms-1" onclick="deleteEmpleado(${empleado.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        showAlert('Error al cargar empleados: ' + error.message, 'danger');
    }
}

function showEmpleadoForm(id = null) {
    currentEditId = id;
    const modal = new bootstrap.Modal(document.getElementById('empleadoModal'));
    const title = document.getElementById('empleadoModalTitle');
    const form = document.getElementById('empleadoForm');
    
    form.reset();
    
    if (id) {
        title.textContent = 'Editar Empleado';
        loadEmpleadoData(id);
    } else {
        title.textContent = 'Nuevo Empleado';
    }
    
    modal.show();
}

async function loadEmpleadoData(id) {
    try {
        const empleados = await apiRequest('/empleados');
        const empleado = empleados.find(e => e.id === id);
        
        if (empleado) {
            document.getElementById('empleadoNombre').value = empleado.nombre;
            document.getElementById('empleadoRol').value = empleado.rol;
            document.getElementById('empleadoHorario').value = empleado.horario;
        }
    } catch (error) {
        showAlert('Error al cargar datos del empleado: ' + error.message, 'danger');
    }
}

async function saveEmpleado() {
    try {
        const data = {
            nombre: document.getElementById('empleadoNombre').value,
            rol: document.getElementById('empleadoRol').value,
            horario: document.getElementById('empleadoHorario').value
        };
        
        if (currentEditId) {
            await apiRequest(`/empleados/${currentEditId}`, 'PUT', data);
            showAlert('Empleado actualizado exitosamente');
        } else {
            await apiRequest('/empleados', 'POST', data);
            showAlert('Empleado creado exitosamente');
        }
        
        bootstrap.Modal.getInstance(document.getElementById('empleadoModal')).hide();
        loadEmpleados();
        currentEditId = null;
    } catch (error) {
        showAlert('Error al guardar empleado: ' + error.message, 'danger');
    }
}

function editEmpleado(id) {
    showEmpleadoForm(id);
}

async function deleteEmpleado(id) {
    if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
        try {
            await apiRequest(`/empleados/${id}`, 'DELETE');
            showAlert('Empleado eliminado exitosamente');
            loadEmpleados();
        } catch (error) {
            showAlert('Error al eliminar empleado: ' + error.message, 'danger');
        }
    }
}

// ================================
// PAGOS
// ================================

async function loadPagos() {
    try {
        const pagos = await apiRequest('/pagos');
        const tbody = document.getElementById('pagos-table-body');
        tbody.innerHTML = '';
        
        pagos.forEach(pago => {
            const fechaFormateada = new Date(pago.fecha).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            
            const row = `
                <tr>
                    <td><strong>${pago.id}</strong></td>
                    <td><i class="fas fa-user me-2 text-primary"></i>${pago.inquilino_nombre || '<em class="text-muted">N/A</em>'}</td>
                    <td><span class="badge bg-info">${pago.departamento_numero || 'N/A'}</span></td>
                    <td><span class="currency"><i class="fas fa-dollar-sign me-1"></i>${parseFloat(pago.monto).toLocaleString('es-ES', {minimumFractionDigits: 2})}</span></td>
                    <td><i class="fas fa-calendar me-2 text-success"></i><small>${fechaFormateada}</small></td>
                    <td><span class="badge bg-secondary">${pago.concepto || 'Sin concepto'}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="editPago(${pago.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger ms-1" onclick="deletePago(${pago.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        showAlert('Error al cargar pagos: ' + error.message, 'danger');
    }
}

async function loadInquilinosSelect() {
    try {
        const inquilinos = await apiRequest('/inquilinos');
        const select = document.getElementById('pagoInquilino');
        select.innerHTML = '<option value="">Seleccionar inquilino</option>';
        
        inquilinos.forEach(inquilino => {
            const departamento = inquilino.departamento_numero ? 
                ` - Depto ${inquilino.departamento_numero}` : '';
            const option = `<option value="${inquilino.id}">${inquilino.nombre}${departamento}</option>`;
            select.innerHTML += option;
        });
    } catch (error) {
        console.error('Error al cargar inquilinos:', error);
    }
}

function showPagoForm(id = null) {
    currentEditId = id;
    const modal = new bootstrap.Modal(document.getElementById('pagoModal'));
    const title = document.getElementById('pagoModalTitle');
    const form = document.getElementById('pagoForm');
    
    form.reset();
    loadInquilinosSelect();
    
    // Establecer fecha actual
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('pagoFecha').value = today;
    
    if (id) {
        title.textContent = 'Editar Pago';
        loadPagoData(id);
    } else {
        title.textContent = 'Nuevo Pago';
    }
    
    modal.show();
}

async function loadPagoData(id) {
    try {
        const pagos = await apiRequest('/pagos');
        const pago = pagos.find(p => p.id === id);
        
        if (pago) {
            document.getElementById('pagoInquilino').value = pago.inquilino_id;
            document.getElementById('pagoMonto').value = pago.monto;
            document.getElementById('pagoFecha').value = pago.fecha;
            document.getElementById('pagoConcepto').value = pago.concepto || '';
        }
    } catch (error) {
        showAlert('Error al cargar datos del pago: ' + error.message, 'danger');
    }
}

async function savePago() {
    try {
        const data = {
            inquilino_id: parseInt(document.getElementById('pagoInquilino').value),
            monto: parseFloat(document.getElementById('pagoMonto').value),
            fecha: document.getElementById('pagoFecha').value,
            concepto: document.getElementById('pagoConcepto').value
        };
        
        if (currentEditId) {
            await apiRequest(`/pagos/${currentEditId}`, 'PUT', data);
            showAlert('Pago actualizado exitosamente');
        } else {
            await apiRequest('/pagos', 'POST', data);
            showAlert('Pago registrado exitosamente');
        }
        
        bootstrap.Modal.getInstance(document.getElementById('pagoModal')).hide();
        loadPagos();
        currentEditId = null;
    } catch (error) {
        showAlert('Error al guardar pago: ' + error.message, 'danger');
    }
}

function editPago(id) {
    showPagoForm(id);
}

async function deletePago(id) {
    if (confirm('¿Está seguro de que desea eliminar este pago?')) {
        try {
            await apiRequest(`/pagos/${id}`, 'DELETE');
            showAlert('Pago eliminado exitosamente');
            loadPagos();
        } catch (error) {
            showAlert('Error al eliminar pago: ' + error.message, 'danger');
        }
    }
}