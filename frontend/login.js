// ================================
// LOGIN PAGE FUNCTIONS
// ================================

// Configuración de la API
const API_BASE_URL = 'http://localhost:5000/api';

// Inicialización de la página de login
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Página de login cargada');
    
    // Verificar si ya hay una sesión activa
    const savedAuth = localStorage.getItem('edificio_auth');
    if (savedAuth) {
        try {
            const authData = JSON.parse(savedAuth);
            // Verificar si la sesión no ha expirado (24 horas)
            const now = new Date().getTime();
            if (now - authData.timestamp < 24 * 60 * 60 * 1000) {
                console.log('✅ Sesión activa encontrada, redirigiendo al dashboard...');
                window.location.href = 'app.html';
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
    
    // Focus en el campo de usuario
    const usernameField = document.getElementById('username');
    if (usernameField) {
        usernameField.focus();
    }
    
    // Manejar Enter en el formulario
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performLogin();
            }
        });
    }
    
    console.log('🎯 Login page listo para autenticación');
});

// Funciones para reCAPTCHA
function onRecaptchaSuccess(token) {
    console.log('✅ reCAPTCHA completado exitosamente');
    // Opcional: habilitar botón de login o realizar alguna acción
}

function onRecaptchaExpired() {
    console.log('⏰ reCAPTCHA expirado');
    showLoginError('La verificación de reCAPTCHA ha expirado. Por favor, complete nuevamente.');
}

function onRecaptchaError() {
    console.log('❌ Error en reCAPTCHA');
    showLoginError('Error en la verificación de reCAPTCHA. Por favor, inténtelo nuevamente.');
}

// Función para validar reCAPTCHA
function validateRecaptcha() {
    if (typeof grecaptcha === 'undefined') {
        console.warn('⚠️ reCAPTCHA no está cargado');
        return false;
    }
    
    const response = grecaptcha.getResponse();
    return response && response.length > 0;
}

// Función para realizar el login
async function performLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        showLoginError('Por favor complete todos los campos');
        return;
    }
    
    // Validar reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        showLoginError('Por favor complete la verificación de reCAPTCHA');
        return;
    }
    
    console.log('✅ reCAPTCHA validado correctamente');
    
    // Mostrar loading
    const loginButton = document.querySelector('.btn-login');
    const loginButtonText = document.getElementById('loginButtonText');
    const loginSpinner = document.getElementById('loginSpinner');
    
    if (loginButton && loginButtonText && loginSpinner) {
        loginButton.disabled = true;
        loginButtonText.style.display = 'none';
        loginSpinner.classList.remove('d-none');
    }
    
    try {
        console.log('🔄 Intentando autenticar usuario:', username);
        
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
            console.log('✅ Login exitoso para usuario:', username);
            
            // Guardar sesión
            const authData = {
                username: username,
                role: data.user.role,
                timestamp: new Date().getTime()
            };
            localStorage.setItem('edificio_auth', JSON.stringify(authData));
            
            // Redirigir al dashboard
            console.log('🏠 Redirigiendo al dashboard...');
            window.location.href = 'app.html';
        } else {
            console.log('❌ Login fallido:', data.message);
            showLoginError(data.message || 'Credenciales incorrectas');
        }
    } catch (error) {
        console.error('❌ Error en login:', error);
        showLoginError('Error de conexión. Verifique que el servidor esté ejecutándose.');
    } finally {
        // Ocultar loading
        if (loginButton && loginButtonText && loginSpinner) {
            loginButton.disabled = false;
            loginButtonText.style.display = 'inline';
            loginSpinner.classList.add('d-none');
        }
    }
}

// Función para mostrar errores de login
function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    const errorMessage = document.getElementById('loginErrorMessage');
    
    if (errorDiv && errorMessage) {
        errorMessage.textContent = message;
        errorDiv.classList.remove('d-none');
        
        // Reset reCAPTCHA en caso de error
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset();
            console.log('🔄 reCAPTCHA reseteado tras error');
        }
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            errorDiv.classList.add('d-none');
        }, 5000);
    }
}

// Función para llenar credenciales de prueba (para desarrollo)
function fillTestCredentials(username, password) {
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
}

// Agregar listeners para las credenciales de prueba
document.addEventListener('DOMContentLoaded', function() {
    const credentialItems = document.querySelectorAll('.credential-item');
    
    credentialItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            const text = this.textContent;
            
            if (text.includes('admin / admin123')) {
                fillTestCredentials('admin', 'admin123');
            } else if (text.includes('manager / manager123')) {
                fillTestCredentials('manager', 'manager123');
            } else if (text.includes('user / user123')) {
                fillTestCredentials('user', 'user123');
            }
            
            // Focus en el botón de login
            const loginButton = document.querySelector('.btn-login');
            if (loginButton) {
                loginButton.focus();
            }
        });
    });
});