// JavaScript para Landing Page Renovada - Administración de Edificio
// Inspirado en el ejemplo de cafetería con funcionalidades mejoradas

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏢 Landing Page - Sistema de Administración de Edificio cargado');
    
    // Verificar si ya hay una sesión activa
    checkExistingSession();
    
    // Inicializar funcionalidades de la página
    initializeNavigation();
    initializeAnimations();
    initializeContactForm();
    initializeMobileMenu();
    
    console.log('✅ Todas las funcionalidades de la landing inicializadas');
});

/**
 * Verifica si ya existe una sesión activa
 */
function checkExistingSession() {
    try {
        const authData = localStorage.getItem('buildingAuthData');
        if (authData) {
            const parsed = JSON.parse(authData);
            const now = new Date().getTime();
            
            // Si la sesión no ha expirado, redirigir al dashboard
            if (parsed.expiry && now < parsed.expiry) {
                console.log('🔒 Sesión activa encontrada, redirigiendo al dashboard...');
                setTimeout(() => {
                    window.location.href = 'app.html';
                }, 1000);
                return true;
            } else {
                // Limpiar sesión expirada
                localStorage.removeItem('buildingAuthData');
                console.log('🕐 Sesión expirada eliminada');
            }
        }
    } catch (error) {
        console.warn('⚠️ Error verificando sesión:', error);
        localStorage.removeItem('buildingAuthData');
    }
    return false;
}

/**
 * Inicializa la navegación suave entre secciones
 */
function initializeNavigation() {
    // Navegación suave entre secciones
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Actualizar enlace activo
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Scroll suave hacia la sección
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Actualizar navegación activa en el scroll
    window.addEventListener('scroll', updateActiveNavigation);
    
    console.log('🧭 Navegación suave inicializada');
}

/**
 * Actualiza la navegación activa basada en la posición del scroll
 */
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Inicializa animaciones en scroll
 */
function initializeAnimations() {
    // Intersection Observer para animaciones de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos que necesitan animación
    const animateElements = document.querySelectorAll(
        '.service-card, .gallery-item, .testimonial, .contact-item'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Animación de paralaje sutil para el hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${parallax}px)`;
        }
    });
    
    console.log('🎬 Animaciones de scroll inicializadas');
}

/**
 * Inicializa el formulario de contacto
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = {
                nombre: document.getElementById('name').value,
                email: document.getElementById('email').value,
                empresa: document.getElementById('empresa').value,
                mensaje: document.getElementById('message').value
            };
            
            // Validar datos
            if (validateContactForm(formData)) {
                handleContactFormSubmit(formData);
            }
        });
    }
    
    console.log('📧 Formulario de contacto inicializado');
}

/**
 * Valida el formulario de contacto
 */
function validateContactForm(data) {
    const errors = [];
    
    if (!data.nombre.trim()) {
        errors.push('El nombre es requerido');
    }
    
    if (!data.email.trim()) {
        errors.push('El email es requerido');
    } else if (!isValidEmail(data.email)) {
        errors.push('El email no tiene un formato válido');
    }
    
    if (!data.empresa.trim()) {
        errors.push('La empresa/edificio es requerida');
    }
    
    if (!data.mensaje.trim()) {
        errors.push('El mensaje es requerido');
    }
    
    if (errors.length > 0) {
        showAlert('Por favor corrige los siguientes errores:\n• ' + errors.join('\n• '), 'warning');
        return false;
    }
    
    return true;
}

/**
 * Valida formato de email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Maneja el envío del formulario de contacto
 */
function handleContactFormSubmit(data) {
    // Mostrar estado de carga
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simular envío (en una implementación real, aquí iría la llamada al backend)
    setTimeout(() => {
        // Resetear formulario
        document.getElementById('contactForm').reset();
        
        // Restaurar botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Mostrar confirmación
        showAlert(
            `¡Gracias ${data.nombre}! Tu solicitud de demostración ha sido enviada. Te contactaremos pronto.`,
            'success'
        );
        
        console.log('📨 Solicitud de demostración enviada:', data);
    }, 2000);
}

/**
 * Inicializa el menú móvil
 */
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Cambiar icono
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinkItems = navLinks.querySelectorAll('a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            });
        });
    }
    
    console.log('📱 Menú móvil inicializado');
}

/**
 * Muestra alertas/notificaciones
 */
function showAlert(message, type = 'info') {
    // Crear elemento de alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} fixed-alert`;
    alert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${getAlertIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="alert-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Estilos para la alerta
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        background: ${getAlertBackground(type)};
        color: white;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        animation: slideInRight 0.3s ease;
    `;
    
    // Agregar al DOM
    document.body.appendChild(alert);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (alert.parentNode) {
            alert.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}

/**
 * Obtiene el icono apropiado para el tipo de alerta
 */
function getAlertIcon(type) {
    const icons = {
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

/**
 * Obtiene el color de fondo para el tipo de alerta
 */
function getAlertBackground(type) {
    const colors = {
        success: 'linear-gradient(135deg, #4ade80, #22c55e)',
        warning: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        error: 'linear-gradient(135deg, #f87171, #ef4444)',
        info: 'linear-gradient(135deg, #60a5fa, #3b82f6)'
    };
    return colors[type] || colors.info;
}

/**
 * Funciones de navegación (para mantener compatibilidad)
 */
function goToLogin() {
    console.log('🔑 Navegando al login...');
    window.location.href = 'login.html';
}

// Función global para el botón CTA
window.goToLogin = goToLogin;

// Agregar estilos para las animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .alert-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .alert-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;
        transition: background-color 0.2s;
    }
    
    .alert-close:hover {
        background-color: rgba(255,255,255,0.2);
    }
    
    /* Menú móvil responsive */
    @media (max-width: 1024px) {
        .nav-links {
            position: fixed;
            top: 80px;
            right: 5%;
            background: rgba(245, 245, 245, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 2rem;
            flex-direction: column;
            gap: 1rem;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            min-width: 200px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        
        .nav-links.active {
            transform: translateX(0);
        }
        
        .nav-links a {
            color: var(--color-dark) !important;
            padding: 0.75rem 1rem;
            border-radius: 12px;
            text-align: center;
        }
        
        .nav-links a:hover,
        .nav-links a.active {
            background-color: var(--color-bronze);
            color: var(--color-light) !important;
        }
    }
`;
document.head.appendChild(style);

console.log('🎨 Estilos adicionales agregados para la nueva landing');