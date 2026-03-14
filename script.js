// Aguardar o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    initAOS();
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
    initStatsAnimation();
    initContactForm();
    initImageGallery();
    initLanguageSwitcher();
    initBackToTop();
    initLazyLoading();
    initFormValidation();
    initCookieConsent();
});

// ==================== INICIALIZAÇÕES ====================

function initAOS() {
    // Inicializar AOS com configurações otimizadas
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-in-out',
        delay: 100,
        disable: window.innerWidth < 768 ? true : false // Desabilitar em mobile para performance
    });
}

// ==================== MENU MOBILE ====================

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    const header = document.querySelector('.header');
    
    if (!hamburger || !navMenu) return;
    
    // Abrir/fechar menu
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(hamburger, navMenu, body);
    });
    
    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            // Fechar menu
            closeMenu(hamburger, navMenu, body);
            
            // Scroll suave para a seção
            if (targetId && targetId !== '#') {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    setTimeout(() => {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 300);
                }
            }
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            closeMenu(hamburger, navMenu, body);
        }
    });
    
    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu(hamburger, navMenu, body);
        }
    });
    
    // Prevenir scroll do body quando menu está aberto
    function toggleMenu(hamburger, navMenu, body) {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Ajustar padding-top do menu para não ficar atrás do header
        if (navMenu.classList.contains('active')) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            navMenu.style.paddingTop = headerHeight + 'px';
        } else {
            navMenu.style.paddingTop = '';
        }
    }
    
    function closeMenu(hamburger, navMenu, body) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
        navMenu.style.paddingTop = '';
    }
}

// ==================== SMOOTH SCROLL ====================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Atualizar URL sem recarregar
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Scroll para elemento se houver hash na URL
    if (window.location.hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 500);
    }
}

// ==================== HEADER SCROLL EFFECT ====================

function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    function updateHeader() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            header.style.background = 'rgba(255,255,255,0.98)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.classList.remove('scrolled');
            header.style.background = 'var(--white)';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = 'var(--shadow)';
        }
        
        // Atualizar link ativo no menu
        updateActiveMenuLink();
    }
    
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateHeader);
    });
    
    // Executar uma vez no carregamento
    updateHeader();
}

// ==================== MENU LINK ATIVO ====================

function updateActiveMenuLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        const sectionBottom = sectionTop + sectionHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').replace('#', '');
        if (href === currentSection) {
            link.classList.add('active');
        }
    });
}

// ==================== ANIMAÇÃO DAS ESTATÍSTICAS ====================

function initStatsAnimation() {
    const statsSection = document.querySelector('.estatisticas');
    const stats = document.querySelectorAll('.stat-number');
    
    if (!statsSection || stats.length === 0) return;
    
    let animated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateStats(stats);
            }
        });
    }, { 
        threshold: 0.3,
        rootMargin: '50px'
    });
    
    observer.observe(statsSection);
}

function animateStats(stats) {
    stats.forEach(stat => {
        const text = stat.innerText;
        const number = parseInt(text.replace(/[^0-9]/g, ''));
        const prefix = text.includes('+') ? '+' : '';
        const suffix = text.includes('mil') ? ' mil' : '';
        const unit = text.includes('m³') ? 'm³' : '';
        
        if (!isNaN(number)) {
            let current = 0;
            const duration = 2000; // 2 segundos
            const increment = number / (duration / 20); // 20ms por frame
            const startTime = performance.now();
            
            function updateNumber(currentTime) {
                const elapsed = currentTime - startTime;
                current = Math.min(Math.floor(increment * (elapsed / 20)), number);
                
                let displayText = prefix + current;
                if (suffix) displayText += suffix;
                if (unit) displayText += ' ' + unit;
                
                stat.innerText = displayText;
                
                if (current < number) {
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.innerText = text; // Texto original ao final
                }
            }
            
            requestAnimationFrame(updateNumber);
        }
    });
}

// ==================== SISTEMA DE TRADUÇÃO ====================

function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const currentLang = localStorage.getItem('preferred-language') || 'pt';
    
    // Dicionário de traduções
    const translations = {
        pt: {
            // Menu
            'Home': 'Home',
            'About us': 'Sobre',
            'Products': 'Produtos',
            'Services': 'Serviços',
            'Projects': 'Projetos',
            'Contact Us': 'Contato',
            
            // Hero
            'hero-title': 'Solar Gás Energy',
            'hero-subtitle': 'Energia limpa e sustentável para um futuro melhor',
            'hero-btn': 'Solicite um orçamento',
            
            // About
            'about-title': 'Nossa Referência',
            'about-subtitle': 'Quem somos?',
            'mission': '🌍 Missão',
            'vision': '🌱 Visão',
            'values': '🤝 Valores',
            
            // Adicione mais traduções conforme necessário
        },
        en: {
            // Menu
            'Home': 'Home',
            'About us': 'About us',
            'Products': 'Products',
            'Services': 'Services',
            'Projects': 'Projects',
            'Contact Us': 'Contact Us',
            
            // Hero
            'hero-title': 'Solar Gas Energy',
            'hero-subtitle': 'Clean and sustainable energy for a better future',
            'hero-btn': 'Request a quote',
            
            // About
            'about-title': 'Our Reference',
            'about-subtitle': 'Who we are?',
            'mission': '🌍 Mission',
            'vision': '🌱 Vision',
            'values': '🤝 Values',
        }
    };
    
    function setLanguage(lang) {
        // Atualizar botões
        langButtons.forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Atualizar textos com data attributes
        document.querySelectorAll('[data-pt]').forEach(element => {
            if (element.dataset[lang]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = element.dataset[lang];
                } else {
                    element.textContent = element.dataset[lang];
                }
            }
        });
        
        // Atualizar elementos com classes específicas
        document.querySelectorAll('.text-pt, .text-en').forEach(el => {
            el.style.display = el.classList.contains(`text-${lang}`) ? '' : 'none';
        });
        
        // Salvar preferência
        localStorage.setItem('preferred-language', lang);
        
        // Disparar evento personalizado
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }
    
    // Adicionar eventos aos botões
    langButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            setLanguage(btn.dataset.lang);
        });
    });
    
    // Aplicar idioma salvo
    setLanguage(currentLang);
}

// ==================== FORMULÁRIO DE CONTATO ====================

function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validar formulário
        if (!validateForm(contactForm)) {
            return;
        }
        
        // Mostrar loading
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        try {
            // Simular envio (substituir por fetch real)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Sucesso
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            contactForm.reset();
            
        } catch (error) {
            // Erro
            showNotification('Erro ao enviar mensagem. Tente novamente mais tarde.', 'error');
            console.error('Erro no formulário:', error);
            
        } finally {
            // Restaurar botão
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Validação em tempo real
    contactForm.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('blur', () => {
            validateField(field);
        });
        
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                validateField(field);
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input[required], textarea[required]');
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validar email se existir
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            showFieldError(emailField, 'Por favor, insira um email válido');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório';
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, insira um email válido';
        }
    } else if (field.type === 'tel' && value) {
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, insira um telefone válido';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        removeFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    errorElement.textContent = message;
}

function removeFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remover após 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ==================== GALERIA DE IMAGENS ====================

function initImageGallery() {
    const images = document.querySelectorAll('.gallery-img, .image-card img');
    
    if (images.length === 0) return;
    
    images.forEach(img => {
        img.addEventListener('click', function() {
            createLightbox(this);
        });
        
        // Adicionar classe para indicar que é clicável
        img.style.cursor = 'pointer';
    });
}

function createLightbox(img) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    const content = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${img.src}" alt="${img.alt}">
            <div class="lightbox-caption">${img.alt}</div>
        </div>
    `;
    
    lightbox.innerHTML = content;
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Animar entrada
    setTimeout(() => {
        lightbox.classList.add('active');
    }, 10);
    
    // Fechar lightbox
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', () => closeLightbox(lightbox));
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox(lightbox);
        }
    });
    
    // Fechar com ESC
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeLightbox(lightbox);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function closeLightbox(lightbox) {
    lightbox.classList.remove('active');
    setTimeout(() => {
        lightbox.remove();
        document.body.style.overflow = '';
    }, 300);
}

// ==================== BOTÃO VOLTAR AO TOPO ====================

function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== LAZY LOADING DE IMAGENS ====================

function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback para navegadores antigos
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// ==================== COOKIE CONSENT ====================

function initCookieConsent() {
    if (localStorage.getItem('cookie-consent')) return;
    
    const cookieBanner = document.createElement('div');
    cookieBanner.className = 'cookie-consent';
    cookieBanner.innerHTML = `
        <div class="cookie-content">
            <p>Este site utiliza cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa <a href="/politica-privacidade">Política de Privacidade</a>.</p>
            <button class="btn-primary btn-small">Aceitar</button>
        </div>
    `;
    
    document.body.appendChild(cookieBanner);
    
    setTimeout(() => {
        cookieBanner.classList.add('show');
    }, 1000);
    
    const acceptBtn = cookieBanner.querySelector('button');
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'true');
        cookieBanner.classList.remove('show');
        setTimeout(() => {
            cookieBanner.remove();
        }, 300);
    });
}

// ==================== UTILITÁRIOS ====================

// Debounce para eventos de scroll/resize
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle para limitar execução de funções
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Detecção de dispositivo mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Formatar telefone
function formatPhone(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{3})/, '($1) $2-$3');
}

// ==================== INICIALIZAÇÃO ADICIONAL ====================

// Carregar conteúdo dinamicamente (se necessário)
async function loadContent(url, containerId) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        document.getElementById(containerId).innerHTML = html;
    } catch (error) {
        console.error('Erro ao carregar conteúdo:', error);
    }
}

// Exportar funções para uso global
window.solarGasEnergy = {
    setLanguage: (lang) => {
        const event = new CustomEvent('setLanguage', { detail: { language: lang } });
        document.dispatchEvent(event);
    },
    scrollTo: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
};

// Dropdown para mobile
const dropdowns = document.querySelectorAll('.dropdown');

if (window.innerWidth <= 768) {
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.dropdown-toggle');
        link.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        });
    });
}